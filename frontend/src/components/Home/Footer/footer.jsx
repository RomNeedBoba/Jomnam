import React from 'react';
import './Footer.css';
import logo from '../../../assets/github-logo.png'; // Replace with your logo

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo-section">
                    <img src={logo} alt="STR Logo" className="footer-logo" />
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#demos">Demo</a></li>
                        <li><a href="#STR">STR</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </div>

                <div className="footer-community">
                    <h4>Community</h4>
                    <ul>
                        <li><a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer">Telegram</a></li>
                        <li><a href="https://github.com/yourrepo" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        <li><a href="#contribute">Contribute</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} JOMNAM</p>
            </div>
        </footer>
    );
};

export default Footer;
