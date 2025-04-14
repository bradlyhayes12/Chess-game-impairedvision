import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './Layout';
import ChessBoard from './ChessBoard';
import SettingsPage from './SettingsPage';
import AboutUs from './AboutUs';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(true);
  const [boardSize, setBoardSize] = useState('medium');
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className={darkMode ? 'App dark' : 'App'}>
      <Router>
        <Layout textToSpeech={textToSpeech}>
          <Routes>
            <Route 
              path="/" 
              element={
                <ChessBoard 
                  textToSpeech={textToSpeech}
                  boardSize={boardSize}
                  isGameStarted={isGameStarted}
                  setIsGameStarted={setIsGameStarted}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <SettingsPage 
                  darkMode={darkMode} setDarkMode={setDarkMode}
                  textToSpeech={textToSpeech} setTextToSpeech={setTextToSpeech}
                  boardSize={boardSize} setBoardSize={setBoardSize}
                />
              } 
            />
            <Route
              path="/about"
              element={<AboutUs textToSpeech={textToSpeech} />}
              />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;