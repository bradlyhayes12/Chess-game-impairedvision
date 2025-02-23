import React, { useState } from "react";
import { Chess } from "chess.js";

const ChessBoard = () => {
  const [chess] = useState(new Chess()); // Initialize game
  const [board, setBoard] = useState(chess.board()); // Board state
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]); // Store valid moves
  const [invalidMove, setInvalidMove] = useState(null); // Highlight invalid moves

  const handleClick = (row, col) => {
    const position = `${String.fromCharCode(97 + col)}${8 - row}`; // Convert to chess notation (e.g., "e4")

    if (selected === position) {
      // ✅ Deselect the piece if the same square is clicked again
      setSelected(null);
      setValidMoves([]);
      return;
    }
    
    if (selected){
      const possibleMoves = chess.moves( { square: selected, verbose: true}).map(m => m.to);

      if(possibleMoves.includes(position)){
        const move = chess.move({ from: selected , to: position});

        if (move){
          setBoard(chess.board());
          setValidMoves([]);
          setSelected(null);
          return;
        }
      }

      setInvalidMove(position);
      setTimeout(() => setInvalidMove(null), 1000);
      setSelected(null);
      setValidMoves([]);
      return; 
    }

      const piece = chess.get(position);
      if (piece) {
        setSelected(position); // ✅ Select piece
        const possibleMoves = chess.moves({ square: position, verbose: true }).map(m => m.to);
        setValidMoves(possibleMoves); // ✅ Highlight valid moves
      }
    };

  return (
    <div id="chessboard">
      {board.flat().map((square, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const position = `${String.fromCharCode(97 + col)}${8 - row}`;

        return (
          <div
            key={position}
            className={`square ${(row + col) % 2 === 0 ? "white" : "black"} 
              ${selected === position ? "selected" : ""}
              ${validMoves.includes(position) ? "valid-move" : ""}
              ${invalidMove === position ? "invalid-move" : ""}`}
            onClick={() => handleClick(row, col)}
          >
            {square ? (square.color === "b" ? square.type.toLowerCase() : square.type.toUpperCase()) : ""}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
