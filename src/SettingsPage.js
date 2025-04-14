import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import './SettingsPage.css';

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

  // Clone the child and add the onMouseEnter handler
  return React.cloneElement(children, {
    onMouseEnter: handleHover,
  });
};

export default function SettingsPage({ 
  darkMode, setDarkMode, 
  textToSpeech, setTextToSpeech, 
  boardSize, setBoardSize 
}) {

  const navigate = useNavigate(); // <-- Add this!

  const handleBackToGame = () => {
    navigate('/'); // Go back to previous page
  };

  const handleDarkModeToggle = () => {
    setDarkMode(prev => !prev);
    if (textToSpeech) {
      Speak(darkMode ? "Dark mode disabled" : "Dark mode enabled", textToSpeech);
    }
  };

  const handleTextToSpeechToggle = () => {
    setTextToSpeech(prev => !prev);
    if (!textToSpeech) { // Important: speak BEFORE disabling it
      Speak("Text to speech enabled.", true);
    } else {
      Speak("Text to speech disabled.", true);
    }
  };

  const handleBoardSizeChange = (e) => {
    setBoardSize(e.target.value);
    if (textToSpeech) {
      Speak(`Board size set to ${e.target.value}`, textToSpeech);
    }
  };

  return (
    <div className="settings-page">
        <SpeakOnHover text="Settings" textToSpeech={textToSpeech}>
      <h2>Settings</h2>
      </SpeakOnHover>
      <SpeakOnHover text="Back to Game" textToSpeech={textToSpeech}>
      <div className="back-button">
          <button onClick={handleBackToGame}>🔙 Back to Game</button>
      </div>
      </SpeakOnHover>
      <div className="back-button">
        <SpeakOnHover text="Back to Home Page" textToSpeech={textToSpeech}>
          <Link to="/">
            <button> 🏠 Back to Home</button>
          </Link>
        </SpeakOnHover>
      </div>

      <div className="setting-item">
        <label>Dark Mode:</label>
        <SpeakOnHover text="Dark Mode Button" textToSpeech={textToSpeech}>
        <button onClick={handleDarkModeToggle}>
          {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
        </button>
        </SpeakOnHover>
      </div>

      <div className="setting-item">
        <label>Text to Speech:</label>
        <SpeakOnHover text="Text to Speech Button" textToSpeech={textToSpeech}>
        <button onClick={handleTextToSpeechToggle}>
          {textToSpeech ? "Disable Text to Speech" : "Enable Text to Speech"}
        </button>
        </SpeakOnHover>
      </div>

      <div className="setting-item">
        <label>Board Size:</label>
        <SpeakOnHover text="Board Sizes" textToSpeech={textToSpeech}>
        <select value={boardSize} onChange={handleBoardSizeChange}>
            <SpeakOnHover text="Small" textToSpeech={textToSpeech}>
          <option value="small">Small</option>
          </SpeakOnHover>
          <SpeakOnHover text="Meduim" textToSpeech={textToSpeech}>
          <option value="medium">Medium</option>
          </SpeakOnHover>
          <SpeakOnHover text="Large" textToSpeech={textToSpeech}>
          <option value="large">Large</option>
          </SpeakOnHover>
        </select>
        </SpeakOnHover>
      </div>
    </div>
  );
}
