import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import image from '../assets/logo.png';
import githubLogo from '../assets/github-logo.png'; 

const Header = ({ scrollToSection, activeSection }) => {
  const sections = ["home", "demos", "STR", "about"];

  const handleClick = (section) => {
    scrollToSection(section); 
  };

  return (
    <header className="sticky-header">
      <div className="logo-container">
        <img src={image} alt="Logo" className="logo" />
      </div>
      <nav>
        <ul>
          {sections.map((item) => (
            <li key={item}>
              <a
                href={`#${item}`}
                className={activeSection === item ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault(); 
                  handleClick(item); 
                }}
              >
                {item.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="github-section">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
          v0.00.1
        </a>
        <span className="separator">|</span>
        <button
          className="get-started-button"
          onClick={() => {
            window.location.href = 'hey.html';
          }}
        >
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;