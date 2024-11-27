# AI-Powered Resume Screening System

## Overview

This project provides an automated solution to screen resumes for Full-Stack Developer roles. Using Natural Language Processing (NLP) techniques, including a fine-tuned BERT model, the system evaluates how well candidates' resumes align with a given job description. Additionally, it incorporates information from online profiles (e.g., LinkedIn and GitHub links in resumes) to enhance candidate evaluation.

---

## Features

- **Fine-Tuned BERT Model**: Uses a state-of-the-art NLP model for evaluating job descriptions and resumes.
- **Online Profile Analysis**: Scrapes LinkedIn and GitHub profiles (when provided in resumes) for relevant skills and experiences.
- **Custom Scoring**: Generates a detailed score based on skills, experiences, and keywords from job descriptions.
- **Dynamic Compatibility Check**: Rates resumes based on their fit for the provided job description.
- **Error Handling**: Includes robust mechanisms to handle missing or incomplete data.

---

## System Requirements

- Python 3.7+
- Pytorch
- Transformers (Hugging Face)
- BeautifulSoup4
- Requests
- Pandas
- Numpy
- Scikit-learn

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/ai-resume-screening.git
   cd ai-resume-screening
