import os
from collections import defaultdict, deque

from flask import Flask, request, jsonify
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_postgres import PGVector

from config import system_prompt, embeddings, COLLECTION_NAME, DATABASE_URL, llm

app = Flask(__name__)

user_histories = defaultdict(lambda: deque(maxlen=10))


def format_context(context):
    formatted = []
    for c in context:
        bai_hoc = c.metadata.get("bai_hoc", "")
        doi_tuong = c.metadata.get("doi_tuong", "")
        noi_dung = c.metadata.get("noi_dung", "")
        bien_phap = c.metadata.get("bien_phap_chi_tiet", "")

        header_path = " > ".join(
            filter(None, [bai_hoc, doi_tuong, noi_dung, bien_phap]))
        formatted.append(f"[Chuyên mục: {header_path}]\n{c.page_content}")

    return "\n\n---\n\n".join(formatted)


contextualize_prompt = ChatPromptTemplate.from_messages([
    ("system", "Dựa vào lịch sử trò chuyện và câu hỏi mới nhất, hãy viết lại thành một câu hỏi độc lập. Không trả lời câu hỏi, chỉ viết lại nếu cần hoặc giữ nguyên."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])

contextualize_chain = contextualize_prompt | llm | StrOutputParser()


def get_query(input_data):
    if input_data.get("chat_history"):
        return contextualize_chain.invoke(input_data)
    return input_data["question"]


qa_prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])

vector_store = PGVector(
    embeddings=embeddings,
    collection_name=COLLECTION_NAME,
    connection=DATABASE_URL,
    use_jsonb=True
)

retriever = vector_store.as_retriever(search_kwargs={"k": 4})

rag_chain = (
    RunnablePassthrough.assign(
        context=RunnableLambda(get_query) | retriever | RunnableLambda(format_context)
    )
    | qa_prompt
    | llm
    | StrOutputParser()
)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'default_user')
    question = data.get('question', '').strip()

    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        history = user_histories[user_id]
        response = rag_chain.invoke({
            "question": question,
            "chat_history": list(history)
        })
        history.append(HumanMessage(content=question))
        history.append(AIMessage(content=response))
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run()

