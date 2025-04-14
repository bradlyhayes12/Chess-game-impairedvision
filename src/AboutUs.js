import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AboutUs.css'; // (Optional: for styles)

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

export default function AboutUs({ textToSpeech = true }) {
  const navigate = useNavigate(); // <-- Add this!

  const handleBackToGame = () => {
    navigate('/'); // Go back to previous page
  };

  return (
    <div className="about-page">
        <SpeakOnHover text="About Vision Chess" textToSpeech={textToSpeech}>
      <h2>About Vision Chess</h2>
      </SpeakOnHover>
      <SpeakOnHover text=" Welcome to Vision Chess! This project was created to make chess more accessible
        and engaging for everyone, including those with vision impairments." textToSpeech={textToSpeech}>
      <p>
        Welcome to Vision Chess! This project was created to make chess more accessible
        and engaging for everyone, including those with vision impairments.
      </p>
      </SpeakOnHover>
      <SpeakOnHover text="Our goal is to combine the classic beauty of chess with modern accessibility features
        like voice commands and text-to-speech, ensuring everyon can enjoy the game" textToSpeech={textToSpeech}>
      <p>
        Our goal is to combine the classic beauty of chess with modern accessibility features
        like voice commands and text-to-speech, ensuring everyone can enjoy the game.
      </p>
      </SpeakOnHover>
      <SpeakOnHover text="Developped with love by Cameron, Brad, and Farrah" textToSpeech={textToSpeech}>
      <p>
        Developed with ❤️ by Cameron, Brad, and Farrah. 
      </p>
      </SpeakOnHover>

      {/* Buttons Row */}
      <div className="button-row">
        <Link to="/">
          <SpeakOnHover text="Back to Home" textToSpeech={textToSpeech}>
            <button>🏠 Back to Home</button>
          </SpeakOnHover>
        </Link>

        <SpeakOnHover text="Back to Game" textToSpeech={textToSpeech}>
          <button onClick={handleBackToGame}>🎯 Back to Game</button>
        </SpeakOnHover>
      </div>
    </div>
  )};