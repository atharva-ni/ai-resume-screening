export default function About() {
  return (
    <div className="hero bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 min-h-screen flex items-center justify-center">
      <div className="hero-content flex-col text-center text-white">
        <div className="max-w-4xl rounded-3xl shadow-xl bg-white p-8 transform transition-all hover:scale-105 hover:shadow-2xl duration-300 motion-safe:animate-fade-in">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-4 motion-safe:animate-slide-in-left">
            AI-Powered Resume Screening System
          </h1>
          <h2 className="text-3xl font-semibold mb-4 text-blue-800 motion-safe:animate-slide-in-up">
            Overview
          </h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed motion-safe:animate-fade-in delay-100">
            This project provides an automated solution to screen resumes for Full-Stack Developer roles. Using Natural Language Processing (NLP) techniques, including a fine-tuned BERT model, the system evaluates how well candidates' resumes align with a given job description. Additionally, it incorporates information from online profiles (e.g., LinkedIn and GitHub links in resumes) to enhance candidate evaluation.
          </p>
          <h2 className="text-3xl font-semibold mb-4 text-blue-800 motion-safe:animate-slide-in-up delay-200">
            Features
          </h2>
          <ul className="list-disc list-inside text-left space-y-4 mb-6 text-gray-700">
            <li className="flex items-center motion-safe:animate-fade-in delay-300">
              <span className="text-green-600 mr-2">✔️</span>
              <strong className="font-semibold">Fine-Tuned BERT Model:</strong> Uses a state-of-the-art NLP model for evaluating job descriptions and resumes.
            </li>
            <li className="flex items-center motion-safe:animate-fade-in delay-400">
              <span className="text-green-600 mr-2">✔️</span>
              <strong className="font-semibold">Online Profile Analysis:</strong> Scrapes LinkedIn and GitHub profiles (when provided in resumes) for relevant skills and experiences.
            </li>
            <li className="flex items-center motion-safe:animate-fade-in delay-500">
              <span className="text-green-600 mr-2">✔️</span>
              <strong className="font-semibold">Custom Scoring:</strong> Generates a detailed score based on skills, experiences, and keywords from job descriptions.
            </li>
            <li className="flex items-center motion-safe:animate-fade-in delay-600">
              <span className="text-green-600 mr-2">✔️</span>
              <strong className="font-semibold">Dynamic Compatibility Check:</strong> Rates resumes based on their fit for the provided job description.
            </li>
            <li className="flex items-center motion-safe:animate-fade-in delay-700">
              <span className="text-green-600 mr-2">✔️</span>
              <strong className="font-semibold">Error Handling:</strong> Includes robust mechanisms to handle missing or incomplete data.
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 motion-safe:animate-slide-in-up delay-800">System Requirements</h2>
          <ul className="list-disc list-inside text-left text-gray-700">
            <li className="motion-safe:animate-fade-in delay-900">Python 3.7+</li>
            <li className="motion-safe:animate-fade-in delay-1000">Pytorch</li>
            <li className="motion-safe:animate-fade-in delay-1100">Transformers (Hugging Face)</li>
            <li className="motion-safe:animate-fade-in delay-1200">BeautifulSoup4</li>
            <li className="motion-safe:animate-fade-in delay-1300">Requests</li>
            <li className="motion-safe:animate-fade-in delay-1400">Pandas</li>
            <li className="motion-safe:animate-fade-in delay-1500">Numpy</li>
            <li className="motion-safe:animate-fade-in delay-1600">Scikit-learn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
