'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, BarChartIcon as ChartBar, FileSearch } from 'lucide-react';
import { Link } from "react-router-dom";
// Removed import Image from "next/image";

// Assuming these images are in the public folder
const img1 = "src/assets/undraw_updated_resume_re_7r9j.svg";
const img2 = "src/assets/undraw_job_offers_re_634p.svg";
const img3 = "src/assets/undraw_statistic_chart_re_w0pk.svg";

export default function Hero() {
  const images = [img1, img2, img3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <Upload className="w-6 h-6" />, text: "Easy Resume Upload" },
    { icon: <FileSearch className="w-6 h-6" />, text: "AI-Powered Analysis" },
    { icon: <ChartBar className="w-6 h-6" />, text: "Detailed Insights" },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-5xl font-bold text-blue-600 ">
            Welcome to <span className="text-blue-600">ResumeRack!</span>
          </h1>
          <p className="text-xl text-white-600">
            Streamline your hiring proc
            ess with our AI-powered resume screening
            platform. Upload resumes, analyze job descriptions, and find the
            best match effortlessly. Simplify recruitment like never before!
          </p>
          <motion.div 
            className="flex flex-wrap gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center bg-white rounded-full px-4 py-2 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.icon}
                <span className="ml-2 text-gray-700">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/upload" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="flex-1 relative w-full h-[400px]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={images[currentImageIndex]}
                alt="Project showcase"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

