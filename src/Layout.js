import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="page">
      <header>VISION CHESS</header>

      <nav>
        <button>Settings</button>
        <button>About Us</button>
      </nav>

      <main>
        {children}
      </main>

      <footer>Footer</footer>
    </div>
  );
};

export default Layout;