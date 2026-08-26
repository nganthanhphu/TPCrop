from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

headers_to_split_on = [
    ("#", "bai_hoc"),
    ("##", "doi_tuong"),
    ("###", "noi_dung"),
    ("####", "bien_phap_chi_tiet")
]


def split_markdown_content(content):
    md_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=headers_to_split_on,
        strip_headers=False
    )
    split_docs = md_splitter.split_text(content)

    return split_docs


def chunking_content(content, chunk_size, chunk_overlap, separators):
    recursive_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=separators
    )
    chunks = recursive_splitter.split_documents(content)

    return chunks
