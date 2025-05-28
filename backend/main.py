from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os

from rag_engine import load_pdf_to_chroma, get_qa_chain

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
    answer = chain.run(question)
    return {"answer": answer}