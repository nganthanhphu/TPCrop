import pymupdf4llm

def pdf_extractor(pdf_path):
    raw_content = pymupdf4llm.to_markdown(
        doc=pdf_path,
        write_images=False,
        show_progress=True
    )
    return raw_content
