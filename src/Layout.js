import React from "react";
import './App.css'

const Layout = ({ children }) => {
  return (
    <div className="page">
      <header className="header">VISION CHESS</header>
      <nav className="navbar">
        <button className="nav-button">Settings</button>
        <button className="nav-button">About Us</button>
      </nav>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">Footer</footer>
    </div>
  );
};

export default Layout;