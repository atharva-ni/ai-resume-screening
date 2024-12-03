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

def get_job_description_from_pdf(folder_path):
    """Searches for a PDF file in the folder and extracts the job description."""
    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith(".pdf"):
            file_path = os.path.join(folder_path, file_name)
            print(f"Found job description PDF: {file_name}")
            return extract_text_from_pdf(file_path)
    print("No PDF job description found in the folder.")
    return ""

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
    # Path to the folder containing job description PDF
    job_desc_folder = "E:/New folder/backend/jobdesc"  # Update this path as needed

    # Get job description from the PDF file in the folder
    job_description = get_job_description_from_pdf(job_desc_folder)

    if job_description:  # Only proceed if job description is found
        # Analyze resumes and find top 10 matches based on job description
        top_resumes = analyze_resumes_with_job_description(resume_folder, job_description, top_n=10)

        print("Top 10 Resumes:")
        for idx, (resume, score) in enumerate(top_resumes):
            print(f"{idx + 1}. {resume} - Similarity Score: {score:.2f}")
    else:
        print("Unable to proceed without a job description.")
