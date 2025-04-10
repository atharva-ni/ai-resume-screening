'use client';

import { motion } from 'framer-motion';
import { Code, Github, Linkedin, Server, Zap, ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <motion.section
        className="h-screen flex flex-col items-center justify-center text-center px-5"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-6" variants={fadeInUp}>
          AI-Powered Resume Screening
        </motion.h1>
        <motion.p className="text-xl md:text-2xl text-white-600 max-w-3xl mb-8" variants={fadeInUp}>
          Revolutionizing the hiring process with advanced NLP and comprehensive candidate evaluation.
        </motion.p>
        <motion.div variants={fadeInUp} className="animate-bounce">
          <ChevronDown className="w-10 h-10 text-gray-600" />
        </motion.div>
      </motion.section>

      {/* Content Sections */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-16"
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
      >
        {/* Overview Section */}
        <motion.section className="mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold text-white-600 mb-4 flex items-center">
            <Zap className="mr-2 text-yellow-500" />
            Overview
          </h2>
          <p className="text-white-600 leading-relaxed text-lg">
            Our AI-powered system streamlines the resume screening process for Full-Stack Developer roles. Leveraging
            Natural Language Processing (NLP) with a fine-tuned BERT model, the platform evaluates resumes based on their
            alignment with job descriptions and analyzes candidates' LinkedIn and GitHub profiles for a comprehensive
            evaluation.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section className="mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold text-white-600 mb-6 flex items-center">
            <Server className="mr-2 text-blue-500" />
            Key Features
          </h2>
          <motion.ul className="space-y-6" variants={stagger}>
            {[
              {
                icon: <Code className="text-green-500" />,
                title: 'Fine-Tuned BERT Model',
                description: 'Accurately matches resumes with job descriptions using advanced NLP techniques.',
              },
              {
                icon: <Linkedin className="text-blue-600" />,
                title: 'Online Profile Analysis',
                description:
                  'Integrates insights from LinkedIn and GitHub profiles for better candidate assessment.',
              },
              {
                icon: <Github className="text-gray-800" />,
                title: 'Custom Scoring',
                description: 'Generates scores based on skills, experiences, and key job description keywords.',
              },
              {
                icon: <Zap className="text-yellow-500" />,
                title: 'Dynamic Compatibility Check',
                description: 'Provides a compatibility rating for resumes and job descriptions.',
              },
              {
                icon: <Server className="text-purple-500" />,
                title: 'Error Handling',
                description: 'Ensures robust performance with incomplete or missing data.',
              },
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start bg-white rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg"
                variants={fadeInUp}
              >
                <span className="mr-4 mt-1 p-2 bg-gray-100 rounded-full">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* System Requirements Section */}
        <motion.section variants={fadeInUp}>
          <h2 className="text-3xl font-semibold text-white-600 mb-6 flex items-center">
            <Server className="mr-2 text-red-500" />
            System Requirements
          </h2>
          <motion.ul className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger}>
            {[
              'Python 3.7+',
              'PyTorch',
              'Transformers (Hugging Face)',
              'BeautifulSoup4',
              'Requests',
              'Pandas',
              'NumPy',
              'Scikit-learn',
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center bg-white rounded-lg p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                variants={fadeInUp}
              >
                <Code className="mr-2 text-indigo-500" />
                <span className="text-gray-700">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>
      </motion.div>
    </div>
  );
}
