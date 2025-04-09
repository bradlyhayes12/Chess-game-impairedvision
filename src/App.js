import React from 'react';
import './App.css';
import Layout from './Layout';
import ChessBoard from './ChessBoard';

function App() {
  return (
    <div className = "App">
    <Layout>
    <ChessBoard />
  </Layout>
  </div>
  );
}

export default App;
