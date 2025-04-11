import os
import fitz  # PyMuPDF
import pytesseract
import pdfplumber
import docx
import re
import requests
from bs4 import BeautifulSoup
from typing import Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------- TEXT EXTRACTION ----------
def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with fitz.open(file_path) as pdf:
            for page in pdf:
                page_text = page.get_text()
                if page_text.strip():
                    text += page_text
                else:
                    pix = page.get_pixmap()
                    text += pytesseract.image_to_string(pix.tobytes(), lang='eng')
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return text

def extract_text(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            return "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    return ""

# ---------- SMART LINK EXTRACTION (VISIBLE + HYPERLINKS) ----------
def extract_links_with_annotations(file_path: str, text: str) -> Dict[str, str]:
    links = {
        "github": None,
        "leetcode": None,
        "codechef": None,
    }

    # Step 1: Extract visible links
    urls = re.findall(r'https?://[^\s,;)\]]+', text)
    for url in urls:
        if "github.com" in url and not links["github"]:
            links["github"] = url
        elif "leetcode.com" in url and not links["leetcode"]:
            links["leetcode"] = url
        elif "codechef.com" in url and not links["codechef"]:
            links["codechef"] = url

    # Step 2: Extract hyperlinks from PDF annotations
    try:
        with fitz.open(file_path) as doc:
            for page in doc:
                link_annots = page.get_links()
                for link in link_annots:
                    uri = link.get("uri", "")
                    if "github.com" in uri and not links["github"]:
                        links["github"] = uri
                    elif "leetcode.com" in uri and not links["leetcode"]:
                        links["leetcode"] = uri
                    elif "codechef.com" in uri and not links["codechef"]:
                        links["codechef"] = uri
    except Exception as e:
        print(f"Error reading annotations from {file_path}: {e}")

    return links

# ---------- PROFILE STATS ----------
def get_github_stats(url: str):
    username = url.rstrip("/").split("/")[-1]
    try:
        user_data = requests.get(f"https://api.github.com/users/{username}").json()
        events_data = requests.get(f"https://api.github.com/users/{username}/events/public").json()
        dates = set(event["created_at"][:10] for event in events_data if "created_at" in event)
        return {
            "url": url,
            "total_contributions": len(events_data),
            "active_days": len(dates),
            "public_repos": user_data.get("public_repos"),
            "followers": user_data.get("followers"),
            "following": user_data.get("following"),
            "public_gists": user_data.get("public_gists")
        }
    except Exception as e:
        return {"url": url, "error": str(e)}

def get_leetcode_stats(url: str):
    username = url.rstrip("/").split("/")[-1]
    try:
        api_url = f"https://leetcode-stats-api.herokuapp.com/{username}"
        r = requests.get(api_url)
        if r.status_code != 200:
            return {"url": url, "error": "LeetCode profile not found or unavailable."}
        data = r.json()
        return {
            "url": url,
            "total_problems_solved": data.get("totalSolved"),
            "ranking": data.get("ranking"),
            "acceptance_rate": f"{data.get('acceptanceRate', 0)}%",
            "contest_rating": data.get("contestRating"),
            "contribution_points": data.get("contributionPoints")
        }
    except Exception as e:
        return {"url": url, "error": str(e)}

def get_codechef_stats(url: str):
    username = url.rstrip("/").split("/")[-1]
    profile_url = f"https://www.codechef.com/users/{username}"
    stats = {"url": url}
    try:
        r = requests.get(profile_url)
        if r.status_code != 200:
            return stats

        soup = BeautifulSoup(r.text, "html.parser")
        stats["rating"] = int(soup.find("div", class_="rating-number").text.strip())
        stats["stars"] = soup.find("span", class_="rating").text.strip().count('*')

        ranks = soup.find_all("a", class_="inline-list")
        for rank in ranks:
            if "Global Rank" in rank.text:
                stats["global_rank"] = int(rank.text.split(":")[-1].strip().replace(",", ""))
            elif "Country Rank" in rank.text:
                stats["country_rank"] = int(rank.text.split(":")[-1].strip().replace(",", ""))

        solved = soup.find("section", class_="rating-data-section problems-solved").find("h5").text
        stats["fully_solved"] = int(re.search(r'\d+', solved).group())
    except Exception as e:
        stats["error"] = str(e)
    return stats

# ---------- SIMILARITY CHECK ----------
def get_job_description_from_pdf(folder_path: str) -> str:
    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith(".pdf"):
            return extract_text_from_pdf(os.path.join(folder_path, file_name))
    return ""

def analyze_resumes_with_job_description(resume_folder: str, job_description: str, top_n: int = 10):
    resumes = []
    resume_texts = []

    for file_name in os.listdir(resume_folder):
        if file_name.lower().endswith(".pdf"):
            file_path = os.path.join(resume_folder, file_name)
            text = extract_text_from_pdf(file_path)
            resumes.append((file_name, text))
            resume_texts.append(text)

    resume_texts.append(job_description)

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(resume_texts)
    scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()

    ranked = sorted(
        zip([name for name, _ in resumes], scores, [text for _, text in resumes]),
        key=lambda x: x[1],
        reverse=True
    )
    return ranked[:top_n]

# ---------- MAIN LOGIC ----------
if __name__ == "__main__":
    resume_folder = "E:/ai-resume-screening/backend/uploads"
    job_desc_folder = "E:/ai-resume-screening/backend/jobdesc"

    job_description = get_job_description_from_pdf(job_desc_folder)
    if not job_description:
        print("Job description not found. Exiting.")
        exit()

        print("\nTop 10 Matching Resumes:\n" + "=" * 60)
    top_resumes = analyze_resumes_with_job_description(resume_folder, job_description)

    for idx, (name, score, text) in enumerate(top_resumes, 1):
        print(f"\n{idx}. {name}")
        print(f"   Similarity Score : {score:.2f}")
        print(f"   Resume Length    : {len(text)} characters")

        file_path = os.path.join(resume_folder, name)
        links = extract_links_with_annotations(file_path, text)

        print("   Coding Profiles  :")
        if not any(links.values()):
            print("     No valid coding profile links found.")
        else:
            for platform in ["github", "leetcode", "codechef"]:
                if links[platform]:
                    print(f"     {platform.capitalize()} : {links[platform]}")
        
        # Fetch and display stats
        if links["github"]:
            stats = get_github_stats(links["github"])
            print("   GitHub Stats     :")
            for k, v in stats.items():
                if k != "url":
                    print(f"     - {k.replace('_', ' ').capitalize()}: {v}")

        if links["leetcode"]:
            stats = get_leetcode_stats(links["leetcode"])
            print("   LeetCode Stats   :")
            for k, v in stats.items():
                if k != "url":
                    print(f"     - {k.replace('_', ' ').capitalize()}: {v}")

        if links["codechef"]:
            stats = get_codechef_stats(links["codechef"])
            print("   CodeChef Stats   :")
            for k, v in stats.items():
                if k != "url":
                    print(f"     - {k.replace('_', ' ').capitalize()}: {v}")

        print("-" * 60)
