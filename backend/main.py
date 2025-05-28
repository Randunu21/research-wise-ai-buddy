from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

from rag_engine import load_pdf_to_chroma, get_qa_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from fastapi import Query


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

    vector_path = f"db/{file.filename}"
    load_pdf_to_chroma(filepath, vector_path=vector_path)

    return {
        "message": "PDF indexed successfully.",
        "filepath": filepath,           # For summarization
        "vector_path": vector_path      # For QA
    }


# Endpoint to ask question using Gemini + retrieved chunks
@app.post("/ask")
async def ask_question(payload: dict):
    question = payload["question"]
    filepath = payload.get("filepath")  # Get filepath from frontend
    if not filepath:
        return {"error": "No PDF filepath provided. Please upload a PDF first."}
    chain = get_qa_chain(filepath)
    result = chain.invoke({"query": question})
    return {"answer": result["result"]}

# Endpoint to return structured summary from the document
@app.get("/summarize")
def summarize_pdf(filepath: str = Query(...)):
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
    prompt = f"""You are a research assistant. Analyze the research paper and return a summary in the following format. Make sure the output uses markdown-style headers like **Title**, **Authors**, etc. Extract only the most relevant content.

Format:
**Title**
<title of the paper>

**Authors**
<comma-separated list of authors>

**Abstract**
<abstract>

**Problem Statement**
<problem the paper addresses>

**Methodology**
<methods used in the research>

**Key Results**
<key findings>

**Conclusion**
<brief conclusion>

Paper content:
{full_text[:15000]}"""

    response = llm.invoke(prompt)

    import re

    content = response.content

    def extract_section(header, text):
        pattern = rf"\*\*{header}\*\*\s*\n*(.*?)(?=\n\*\*|\Z)"
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        return match.group(1).strip() if match else ""

    title = extract_section("Title", content)
    authors_raw = extract_section("Authors", content)
    authors = "\n".join([
        name.strip(" *†‡") for name in authors_raw.split(", ")
        if any(char.isalpha() for char in name)
    ])

    summary = {
        "title": title,
        "authors": authors,
        "abstract": extract_section("Abstract", content),
        "problemStatement": extract_section("Problem Statement", content),
        "methodology": extract_section("Methodology", content),
        "keyResults": extract_section("Key Results", content),
        "conclusion": extract_section("Conclusion", content)
    }

    return summary