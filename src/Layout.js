import React from "react";
import './App.css';
import { Link } from 'react-router-dom';

const Speak = (text, textToSpeech = true) => {
  if (!textToSpeech) return;
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  synth.speak(utterance);
};

const SpeakOnHover = ({ children, text, textToSpeech = true }) => {
  const handleHover = () => {
    Speak(text, textToSpeech);
  };

  return React.cloneElement(children, {
    onMouseEnter: handleHover,
  });
};

const Layout = ({ children, textToSpeech }) => {
  return (
    <div className="page">
      <header className="header">
        <SpeakOnHover text="Vision Chess" textToSpeech={textToSpeech}>
          <span>VISION CHESS</span>
        </SpeakOnHover>
      </header>

      <nav className="navbar">
        <SpeakOnHover text="Settings" textToSpeech={textToSpeech}>
          <Link to="/settings">
            <button className="nav-button">Settings</button>
          </Link>
        </SpeakOnHover>

        <SpeakOnHover text="About Us" textToSpeech={textToSpeech}>
          <Link to="/about">
            <button className="nav-button">About Us</button>
          </Link>
        </SpeakOnHover>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-group">
          <p>Made by:</p>
          <ul className="team-list">
            <li>Brad Hayes</li>
            <li>Cameron Salazar</li>
            <li>Farrah Omar</li>
          </ul>
        </div>

        <div className="footer-group">
          <p>Version 1.0.0</p>
          <p>© 2025 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
