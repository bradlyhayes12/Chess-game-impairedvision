import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // (Optional: for styles)

export default function AboutUs() {
  return (
    <div className="about-page">
      <h2>About Vision Chess</h2>
      <p>
        Welcome to Vision Chess! This project was created to make chess more accessible
        and engaging for everyone, including those with vision impairments.
      </p>
      <p>
        Our goal is to combine the classic beauty of chess with modern accessibility features
        like voice commands and text-to-speech, ensuring everyone can enjoy the game.
      </p>
      <p>
        Developed with ❤️ by Cameron, Brad, and Farrah.
      </p>

      {/* Back button */}
      <Link to="/">
        <button>🔙 Back to Game</button>
      </Link>
    </div>
  )};