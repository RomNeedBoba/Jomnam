import React, { useState, useEffect, useRef } from 'react';
import './Content.css';
import myVideo from '../../../assets/s.mp4';
import Header from '../Header/Header';
import githubLogo from '../../../assets/github-logo.png';
import p1 from '../../../assets/p1.png';
import p2 from '../../../assets/p2.png';
import p3 from '../../../assets/p3.png';
import leaderProfile from '../../../assets/leaderProfile.png';
import c1 from '../../../assets/c1.png';
import c2 from '../../../assets/c2.png';
import c3 from '../../../assets/c3.png';
import c4 from '../../../assets/c4.png';
import c5 from '../../../assets/c5.png';
import c6 from '../../../assets/c6.png';
import mission from '../../../assets/mission.png';
import vision from '../../../assets/vission.png';
import card1 from '../../../assets/card1.png';
import card2 from '../../../assets/card2.png';
import telelgram from '../../../assets/telegram.png';
import strimage from '../../../assets/strimage.png';

const KhmerTextGlobalReach = () => {
    const [activeSection, setActiveSection] = useState("home");

    const sectionRefs = {
        home: useRef(null),
        demos: useRef(null),
        STR: useRef(null),
        about: useRef(null),
        s: useRef(null),
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.target.id !== activeSection) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        Object.values(sectionRefs).forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            observer.disconnect();
        };
    }, [activeSection]);

    const scrollToSection = (section) => {
        const targetRef = sectionRefs[section];

        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div className="container">
            <Header scrollToSection={scrollToSection} activeSection={activeSection} />
            <section className="hero-section" ref={sectionRefs.home} id="home">
                <div className="left-content">
                    <h1>Khmer Text, Global Reach</h1>
                    <p>AI-powered annotation for accurate and efficient labeling. Automate complex scripts, scale effortlessly, and preserve Khmer language digitally.</p>
                    <button className="start-button">START</button>
                </div>
                <div className="right-content">
                    <div className="image-placeholder">
                        <img src="/capstoneImageI.jpg" alt="Capstone" className="khmer-image" />
                    </div>
                </div>
            </section>
            <section className="demo-section" ref={sectionRefs.demos} id="demos">
                <div className="demo-content">
                    <div className="video-container">
                        <div className="demo-text">
                            <p className="demo-text-bold">Scense Text Recognition brings Khmer text into the digital world</p>
                            <p className="demo-text-right">Empowering Khmer speakers and preserving the language's presence in the modern technological landscape.</p>
                        </div>
                        <div className="demo-video-frame">
                            <video autoPlay loop muted className="demo-video">
                                <source src={myVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </section>

            <section className="str-section" ref={sectionRefs.STR} id="STR">
                <div className="str-content">
                    <div className="str-text">
                        <p className="str-text-bold">Scense Text Recognition brings Khmer text into the digital world</p>
                        <p className="str-text-right">Empowering Khmer speakers and preserving the language's presence in the modern technological landscape.</p>
                    </div>

                    <div className="str-image-frame">
                        <img src={strimage} alt="STR" className="str-image" />
                    </div>

                    <div className="data-grid">
                        <div className="data-box">
                            <div className="data-box-content">
                                <div className="data-icon">
                                    <img src={telelgram} alt="telegram" />
                                </div>
                                <h3>Telegram STR Public Channel</h3>
                                <p>Found a bug and want it to be fixed? Get your questions answered by joining our Public Telegram Channel Community.</p>
                                <p className="data-link">TELEGRAM CHANNEL →</p>
                            </div>
                        </div>
                        <div className="data-box">
                            <div className="data-box-content">
                                <div className="data-icon">
                                    <img src={p1} alt="Profile 1" className="profile-image" />
                                    <img src={p2} alt="Profile 2" className="profile-image" />
                                    <img src={p3} alt="Profile 3" className="profile-image" />
                                </div>
                                <h3>Want to contribute?</h3>
                                <p>STR is always welcoming developers to help spread Khmer Text across the internet! Create a Pull Request on our GitHub.</p>
                                <p className="data-link">GO TO GITHUB PAGE →</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-us-section" ref={sectionRefs.about} id="about">
                <div className="about-us-content">
                    <h2>About Us</h2>
                    <div className="about-us-intro">
                        <p>
                            We embarked on this project with a deep commitment to bridging the digital divide for the Khmer language. We believe that access to technology and digital resources is crucial for preserving and promoting Khmer in the modern world. This project aims to empower Khmer speakers by providing them with the tools they need to engage with digital content, ensuring that the Khmer language remains vibrant and accessible for future generations.
                        </p>
                        <p>
                            Our team is passionate about leveraging AI and cutting-edge technologies to create innovative solutions that address the specific challenges faced by the Khmer language community. We are dedicated to building a sustainable and scalable platform that supports the long-term growth and preservation of Khmer in the digital age.
                        </p>
                        <p>
                            We are driven by the belief that technology can be a powerful force for positive change, and we are committed to using our skills and expertise to make a meaningful contribution to the Khmer language community. We invite you to join us on this journey as we work together to build a brighter future for Khmer in the digital world.
                        </p>
                    </div>

                    <div className="mission-vision">
                        <div className="mission">
                            <div className="mv-image">
                                <img src={mission} alt="Mission" />
                            </div>
                            <div className="mv-text">
                                <h3>Mission</h3>
                                <p>
                                    Empowering Khmer Text Recognition – We develop an advanced annotation tool to streamline and automate Khmer Scene Text Recognition (STR), ensuring high-quality datasets for AI-driven language technologies.
                                </p>
                            </div>
                        </div>
                        <div className="vision">
                            <div className="mv-image">
                                <img src={vision} alt="Vision" />
                            </div>
                            <div className="mv-text">
                                <h3>Vision</h3>
                                <p>
                                    Bridging the Gap in Khmer Text Technology – Our vision is to create a scalable and efficient annotation solution tailored for Khmer script, enabling accurate text recognition and fostering innovation in digital transformation.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="two-cards-section">
                        <div className="two-cards-grid">
                            <div className="two-cards-card">
                                <img src={card1} alt="Card 1" className="two-cards-image" />
                            </div>
                            <div className="two-cards-card">
                                <img src={card2} alt="Card 2" className="two-cards-image" />
                            </div>
                        </div>
                    </div>

                    <div className="core-team-card-widget">
                        <div className="core-team-title">Core Team</div>
                        <div className="core-team-grid">
                            <div className="core-team-card">
                                <div className="core-team-image-container">
                                    <img src={c1} alt="Profile 1" />
                                </div>
                                <div>
                                    <h4>Rin Pichphyrom</h4>
                                    <p>Project Lead</p>
                                </div>
                            </div>
                            <div className="core-team-card">
                                <div className="core-team-image-container">
                                    <img src={c1} alt="Profile 2" />
                                </div>
                                <div>
                                    <h4>Srean leangsreng</h4>
                                    <p>Data Engineer</p>
                                </div>
                            </div>
                            <div className="core-team-card">
                                <div className="core-team-image-container">
                                    <img src={c1} alt="Profile 3" />
                                </div>
                                <div>
                                    <h4>Sovan Chanara</h4>
                                    <p>Data Scientist</p>
                                </div>
                            </div>
                            <div className="core-team-card">
                                <div className="core-team-image-container">
                                    <img src={c1} alt="Profile 4" />
                                </div>
                                <div>
                                    <h4>Non Sorany</h4>
                                    <p>DevOps</p>
                                </div>
                            </div>
                            <div className="core-team-card">
                                <div className="core-team-image-container">
                                    <img src={c1} alt="Profile 5" />
                                </div>
                                <div>
                                    <h4>Seng Sovathara</h4>
                                    <p>Data Annotation Engineer</p>
                                </div>
                            </div>
                            <div className="core-team-card">
                                <div className="core-team-image-container">
                                    <img src={c1} alt="Profile 6" />
                                </div>
                                <div>
                                    <h4>Seng Kosal</h4>
                                    <p>API Engineer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default KhmerTextGlobalReach;