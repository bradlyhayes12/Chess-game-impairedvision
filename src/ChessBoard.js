import React, { useState } from "react";
import { Chess } from "chess.js"; // Import chess.js

const ChessBoard = () => {
  const [chess] = useState(new Chess()); // Initialize chess.js
  const [board, setBoard] = useState(chess.board()); // Get initial board state
  const [selected, setSelected] = useState(null);

  return (
    <div id="chessboard"> {/* ✅ This ensures grid layout */}
      {board.flat().map((square, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const position = `${String.fromCharCode(97 + col)}${8 - row}`; // Convert to chess notation
        return (
          <div
            key={position}
            className={`square ${(row + col) % 2 === 0 ? "white" : "black"} ${
              selected === position ? "selected" : ""
            }`}
            onClick={() => setSelected(position)}
          >
            {square ? (square.color === "b" ? square.type.toLowerCase() : square.type.toUpperCase()) : ""}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;