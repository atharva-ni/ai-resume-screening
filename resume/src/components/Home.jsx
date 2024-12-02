import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import img from "../assets/undraw_updated_resume_re_7r9j.svg";
import img2 from "../assets/undraw_job_offers_re_634p.svg";
import img3 from "../assets/undraw_statistic_chart_re_w0pk.svg";

export default function Hero() {
  const navigate = useNavigate();

  const images = [img, img2, img3];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, );

  function handleClick() {
    navigate("/upload");
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={images[currentImageIndex]} 
          alt="Project showcase"
          className="max-w-sm rounded-lg"
        />
        <div>
          <h1 className="text-5xl font-bold">Welcome to ResumeRack!</h1>
          <p className="py-6">
            Streamline your hiring process with our AI-powered resume screening
            platform. Upload resumes, analyze job descriptions, and find the
            best match effortlessly. Simplify recruitment like never before!
          </p>
          <button className="btn btn-primary" onClick={handleClick}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
