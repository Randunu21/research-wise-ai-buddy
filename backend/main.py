from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

from rag_engine import load_pdf_to_chroma, get_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:5173"] for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint to upload and index PDF
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    filepath = f"temp/{file.filename}"
    os.makedirs("temp", exist_ok=True)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    load_pdf_to_chroma(filepath)
    return {"message": "PDF indexed successfully."}



# Endpoint to ask question using Gemini + retrieved chunks
@app.post("/ask")
async def ask_question(payload: dict):
    question = payload["question"]
    chain = get_qa_chain()
    result = chain.invoke({"query": question})
    return {"answer": result["result"]}

# Endpoint to return structured summary from the document
@app.get("/summarize")
def summarize_pdf(filepath):
    # Load and split the PDF
    loader = PyMuPDFLoader(filepath)
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=300)
    chunks = splitter.split_documents(documents)

    # Concatenate content into one big string
    full_text = "\n".join(chunk.page_content for chunk in chunks)

    # Set up LLM
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=os.getenv("GOOGLE_API_KEY"))

    # Define better summarization prompt
    prompt = f"""You are a research assistant. Summarize this research paper by extracting the following:
    - Title
    - Authors
    - Abstract
    - Research Problem
    - Methodology
    - Key Results
    - Conclusion

    Paper content:
    {full_text[:15000]}"""  # Limit if needed

    return llm.invoke(prompt)