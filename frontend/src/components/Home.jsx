import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="welcome-image animate-image">
        <img
          src="https://professional.dce.harvard.edu/wp-content/uploads/sites/9/2022/08/why-is-professional-development-important.jpg"
          alt="Illustration showing job safety"
          className="image"
        />
      </div>
      <div className="welcome-message fade-in">
        <h1>Welcome to <span className="highlight-text">TRAP</span> <span>- A Fake Job Post Detection System</span></h1>
        <p>
          Protect yourself from fraudulent job postings with our advanced
          detection system. Get started today and secure your career!
        </p>
        {user ? (
          <button 
            className="cta-button"
            onClick={() => navigate('/analyzepost')}
          >
            Analyze a Job Post
          </button>
        ) : (
          <button 
            className="cta-button"
            onClick={() => navigate('/')} // Goes to login since that's the root route when not logged in
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;