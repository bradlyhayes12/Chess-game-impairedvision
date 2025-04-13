import React from "react";
import './App.css'
import { Link } from 'react-router-dom';

const Speak = (text, textToSpeech = true) => {
  if (!textToSpeech) return; 
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slower for clarity (optional)
  synth.speak(utterance);
};

const SpeakOnHover = ({ children, text, textToSpeech = true }) => {
  const handleHover = () => {
    Speak(text, textToSpeech);
  };

  // Clone the child and add the onMouseEnter handler
  return React.cloneElement(children, {
    onMouseEnter: handleHover,
  });
};

const Layout = ({ children , textToSpeech}) => {
  return (
    <div className="page">
      <SpeakOnHover text="Vision CHess" textToSpeech={textToSpeech}>
      <header className="header">VISION CHESS</header>
      </SpeakOnHover>
      <nav className="navbar">
        <SpeakOnHover text="Settings" textToSpeech={textToSpeech}>
          <Link to="/settings">
        <button className="nav-button">Settings</button>
        </Link>
        </SpeakOnHover>
        <Link to="/about">
        <SpeakOnHover text="About Us" textToSpeech={textToSpeech}>
        <button className="nav-button">About Us</button>
        </SpeakOnHover>
        </Link>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">Footer</footer>
    </div>
  );
};

export default Layout;