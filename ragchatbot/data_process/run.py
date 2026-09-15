from langchain_postgres import PGVector

from data_process.chunking import chunking_content, split_markdown_content
from data_process.cleaner import clean_and_normalize, extract_content_between_markers
from config import embeddings, COLLECTION_NAME, DATABASE_URL, PDF_PATH, START_MARKER, END_MARKER, CHUNK_SIZE, \
    CHUNK_OVERLAP, separators
from data_process.utils import save_markdown
from data_process.extractor import pdf_extractor


if __name__ == "__main__":
    raw_content = pdf_extractor(PDF_PATH)
    save_markdown(raw_content, "raw_content.md")
    extracted_content = extract_content_between_markers(
        raw_content, START_MARKER, END_MARKER)
    save_markdown(extracted_content, "extracted_content.md")
    cleaned_content = clean_and_normalize(extracted_content)
    save_markdown(cleaned_content, "cleaned_content.md")
    split_docs = split_markdown_content(cleaned_content)
    chunks = chunking_content(split_docs, CHUNK_SIZE,
                              CHUNK_OVERLAP, separators)

    vector_store = PGVector.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        connection=DATABASE_URL,
        use_jsonb=True
    )
