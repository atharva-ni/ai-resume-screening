export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
        {/* Title Section */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          AI-Powered Resume Screening System
        </h1>

        {/* Overview Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            Our AI-powered system streamlines the resume screening process for Full-Stack Developer roles. Leveraging Natural Language Processing (NLP) with a fine-tuned BERT model, the platform evaluates resumes based on their alignment with job descriptions and analyzes candidates' LinkedIn and GitHub profiles for a comprehensive evaluation.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Fine-Tuned BERT Model:</strong> Accurately matches resumes with job descriptions using advanced NLP techniques.
            </li>
            <li>
              <strong>Online Profile Analysis:</strong> Integrates insights from LinkedIn and GitHub profiles for better candidate assessment.
            </li>
            <li>
              <strong>Custom Scoring:</strong> Generates scores based on skills, experiences, and key job description keywords.
            </li>
            <li>
              <strong>Dynamic Compatibility Check:</strong> Provides a compatibility rating for resumes and job descriptions.
            </li>
            <li>
              <strong>Error Handling:</strong> Ensures robust performance with incomplete or missing data.
            </li>
          </ul>
        </section>

        {/* System Requirements Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            System Requirements
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Python 3.7+</li>
            <li>PyTorch</li>
            <li>Transformers (Hugging Face)</li>
            <li>BeautifulSoup4</li>
            <li>Requests</li>
            <li>Pandas</li>
            <li>NumPy</li>
            <li>Scikit-learn</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
