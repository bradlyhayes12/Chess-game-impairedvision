import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SettingsPage.css';

const Speak = (text, textToSpeech = true) => {
  if (!textToSpeech) return;
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  synth.speak(utterance);
};

export default function SettingsPage({ 
  darkMode, setDarkMode, 
  textToSpeech, setTextToSpeech, 
  boardSize, setBoardSize 
}) {

  useEffect(() => {
    if (textToSpeech) {
      Speak("Settings page. Use buttons to enable or disable dark mode, text to speech, or resize the board.", textToSpeech);
    }
  }, [textToSpeech]);

  const handleDarkModeToggle = () => {
    setDarkMode(prev => !prev);
    if (textToSpeech) {
      Speak(darkMode ? "Dark mode disabled" : "Dark mode enabled", textToSpeech);
    }
  };

  const handleTextToSpeechToggle = () => {
    setTextToSpeech(prev => !prev);
    if (!textToSpeech) { // Important: speak BEFORE disabling it
      Speak("Text to speech disabled.", true);
    } else {
      Speak("Text to speech enabled.", true);
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
      <h2>Settings</h2>

      <div className="back-button">
        <Link to="/">
          <button>🔙 Back to Game</button>
        </Link>
      </div>

      <div className="setting-item">
        <label>Dark Mode:</label>
        <button onClick={handleDarkModeToggle}>
          {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
        </button>
      </div>

      <div className="setting-item">
        <label>Text to Speech:</label>
        <button onClick={handleTextToSpeechToggle}>
          {textToSpeech ? "Disable Text to Speech" : "Enable Text to Speech"}
        </button>
      </div>

      <div className="setting-item">
        <label>Board Size:</label>
        <select value={boardSize} onChange={handleBoardSizeChange}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
}
