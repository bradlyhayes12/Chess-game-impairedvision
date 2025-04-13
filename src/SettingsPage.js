import React from 'react';
import { Link } from 'react-router-dom';
import './SettingsPage.css'; // Optional if you want special styling

export default function SettingsPage({ 
  darkMode, setDarkMode, 
  textToSpeech, setTextToSpeech, 
  boardSize, setBoardSize 
}) {
  return (
    <div className="settings-page">
      <h2>Settings</h2>
        {/* Add Back to Game button */}
        <div className="back-button">
        <Link to="/">
          <button>🔙 Back to Game</button>
        </Link>
      </div>

      <div className="setting-item">
        <label>Dark Mode:</label>
        <button onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? "Disable" : "Enable"}
        </button>
      </div>

      <div className="setting-item">
        <label>Text to Speech:</label>
        <button onClick={() => setTextToSpeech(prev => !prev)}>
          {textToSpeech ? "Disable" : "Enable"}
        </button>
      </div>

      <div className="setting-item">
        <label>Board Size:</label>
        <select value={boardSize} onChange={(e) => setBoardSize(e.target.value)}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
}