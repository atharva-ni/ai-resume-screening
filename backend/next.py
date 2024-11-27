import os
import fitz  # PyMuPDF
import pytesseract
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_text_from_pdf(file_path):
    """Extracts text from a PDF."""
    text = ""
    try:
        with fitz.open(file_path) as pdf:
            for page_num in range(len(pdf)):
                page = pdf[page_num]
                text += page.get_text()
                # Use OCR if the page has no text
                if not text.strip():
                    pix = page.get_pixmap()
                    text += pytesseract.image_to_string(pix.tobytes(), lang='eng')
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return text

def preprocess_text(text):
    """Tokenizes and cleans text."""
    return text.lower().split()

def analyze_resumes_with_job_description(resume_folder, job_description, top_n=10):
    """Compares resumes to a job description using cosine similarity."""
    resumes = []
    resume_texts = []

    # Extract text from all resumes
    for file_name in os.listdir(resume_folder):
        if file_name.lower().endswith(".pdf"):
            file_path = os.path.join(resume_folder, file_name)
            text = extract_text_from_pdf(file_path)
            resumes.append(file_name)
            resume_texts.append(text)

    # Add job description for comparison
    resume_texts.append(job_description)

    # Calculate similarity using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(resume_texts)
    similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()

    # Rank resumes based on similarity scores
    ranked_resumes = sorted(zip(resumes, similarity_scores), key=lambda x: x[1], reverse=True)

    # Return top N resumes
    return ranked_resumes[:top_n]

if __name__ == "__main__":
    # Path to folder containing resumes
    resume_folder = "E:/New folder/backend/uploads"
    # Job description as a string (use your job description or keywords here)
    job_description = """
   
     HTML/CSS, Linux , Github, NodeJS, ReactJS, NextJs , Docker, Deployement, Appwrite, MongoDB, Postgress C++, C, Python, SQL, Typescritp ,Javascript
    """

    # Analyze resumes and find top 10 matches based on job description
    top_resumes = analyze_resumes_with_job_description(resume_folder, job_description, top_n=10)

    print("Top 10 Resumes:")
    for idx, (resume, score) in enumerate(top_resumes):
        print(f"{idx + 1}. {resume} - Similarity Score: {score:.2f}")