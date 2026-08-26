import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

COLLECTION_NAME = "coffee_disease_collection"
DATABASE_URL = os.getenv("DATABASE_URL")

PDF_PATH = "coffee_disease.pdf"
START_MARKER = "### **BÀI 1: SÂU HẠI CÀ PHÊ** "
END_MARKER = "### **HƢỚNG DẪN GIẢNG DẠY MÔ ĐUN/MÔN HỌC** "
CHUNK_SIZE = 600
CHUNK_OVERLAP = 80
separators = ["\n\n", "\n", ". ", "; ", ", ", " ", ""]

embeddings = HuggingFaceEmbeddings(
    model_name=os.getenv("EMBEDDINGS_MODEL_NAME"),
    model_kwargs={"device": "cuda"},
    encode_kwargs={"normalize_embeddings": True, "batch_size": 32}
)

llm = ChatGoogleGenerativeAI(
    model=os.getenv("GOOGLE_MODEL"),
    api_key=os.getenv("GEMINI_API_KEY")
)

system_prompt = """Bạn là Chuyên gia tư vấn kỹ thuật nông nghiệp về phòng trừ sâu bệnh trên cây cà phê.

QUY TẮC NỘI DUNG:
1. Chỉ sử dụng thông tin trong phần DỮ LIỆU CHUYÊN MÔN để giải đáp.
2. Đóng vai tự nhiên, không nhắc đến từ "ngữ cảnh", "dữ liệu cung cấp", "context".
3. Nếu không có dữ liệu, hãy từ chối lịch sự và hướng dẫn người dùng mô tả thêm triệu chứng thực tế.

QUY ĐỊNH ĐỊNH DẠNG VĂN BẢN (BẮT BUỘC):
- Trả về VĂN BẢN THUẦN (Plain Text), tuyệt đối KHÔNG sử dụng cú pháp Markdown.
- CẤM dùng các ký tự nhấn mạnh: Không dùng dấu sao in đậm (**), in nghiêng (* hoặc _), tiêu đề (#).
- Khi liệt kê các ý hoặc triệu chứng: Dùng số thứ tự (1., 2.) hoặc dấu gạch ngang (-). Tuyệt đối không dùng dấu sao (*) làm gạch đầu dòng.
- Không để các dòng trống liên tiếp (hạn chế tối đa việc ngắt dòng thừa).

DỮ LIỆU CHUYÊN MÔN:
{context}"""
