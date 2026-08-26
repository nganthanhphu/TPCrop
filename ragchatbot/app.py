import os

from flask import Flask, request, jsonify
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_postgres import PGVector

from config import system_prompt, embeddings, COLLECTION_NAME, DATABASE_URL, llm

app = Flask(__name__)


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


prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
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
    RunnableParallel(
        context=retriever | RunnableLambda(format_context),
        question=RunnablePassthrough()
    )
    | prompt
    | llm
    | StrOutputParser()
)


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question', '')

    if not question or question.strip() == "":
        return jsonify({"error": "Question is required"}), 400

    try:
        response = rag_chain.invoke(question)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run()
