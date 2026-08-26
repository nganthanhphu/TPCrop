import re

def extract_content_between_markers(text, start_marker, end_marker):
    start_index = text.find(start_marker)
    end_index = text.find(end_marker)

    return text[start_index:end_index]


def clean_and_normalize(text):

    # Remove review questions section
    pattern = r'(?im)^[#*\s]*[A-Z]\.\s*Câu hỏi ôn tập:?[\s\S]*?(?=(?:^[#*\s]*Bài\s+\d+)|\Z)'
    text = re.sub(pattern, '', text)

    # Remove page number
    text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)

    # Remove special characters and symbols
    text = re.sub(r'^\s*[-_.*~`]{1,3}\s*$', '', text, flags=re.MULTILINE)

    # Remove extra whitespace and newlines
    text = re.sub(r'[ \t]+$', '', text, flags=re.MULTILINE)

    # Remove multiple consecutive newlines
    text = re.sub(r'[ \t]{2,}', ' ', text)

    # Remove image captions
    text = re.sub(r'^[#*>\s]*\bH\.\s*\d+[\s-]+\d+.*$',
                  '', text, flags=re.MULTILINE)

    # Fix the case where the title "Bài 2" is split across two lines
    text = re.sub(
        r'###\s*\*\*Bài\s*2\*\*\s*\n+\s*###\s*\*\*BỆNH HẠI CÀ PHÊ\*\*',
        r'# BÀI 2: BỆNH HẠI CÀ PHÊ',
        text,
        flags=re.IGNORECASE
    )

    # Normalize titile "Bài 1" and "Bài 3" to header level 1
    text = re.sub(r'^[#\s]*\*{0,2}(BÀI\s+\d+:?\s+[^\n*]+)\*{0,2}$',
                  r'# \1', text, flags=re.MULTILINE | re.IGNORECASE)

    # Normalize main topics (1 digit: 1., 2., 3...) to Header level 2 (##), excluding subtopics (1.1., 1.2., 2.3...)
    text = re.sub(
        r'^[#\s]*\*{0,2}(\d+\.\s+(?!\d)[^\n]+?)\*{0,2}$', r'## \1', text, flags=re.MULTILINE)

    # Normalize subtopics (2 digits: 1.1., 1.2., 2.3...) to Header level 3 (###)
    text = re.sub(
        r'^[#\s]*\*{0,2}(\d+\.\d+\.?\s+[^\n]+?)\*{0,2}$', r'### \1', text, flags=re.MULTILINE)

    # Normalize sub-subtopics (3 digits: 1.1.1., 1.1.2., 2.3.4...) to Header level 4 (####)
    text = re.sub(r'^[#\s]*\*{0,2}(\d+\.\d+\.\d+\.?\s+[^\n]+?)\*{0,2}$',
                  r'#### \1', text, flags=re.MULTILINE)

    # Remove bold and italic markers from headers
    text = re.sub(r'^(#{1,4}\s+)[*_]{1,3}(.*?)[*_]{1,3}$',
                  r'\1\2', text, flags=re.MULTILINE)

    return text.strip()
