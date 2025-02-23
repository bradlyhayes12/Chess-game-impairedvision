import React, { useState } from "react";
import { Chess } from "chess.js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Piece = ({ piece, position, onClick, setValidMoves, chess }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: () => {
      const possibleMoves = chess.moves({ square: position, verbose: true}).map(m => m.to);
      setValidMoves(possibleMoves);
      return{position};
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="piece"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick(position)} // Allow clicking to select
    >
      {piece}
    </div>
  );
};

const Square = ({ children, position, handleMove, isValidMove, isSelected }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item) => handleMove(item.position, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`square ${(parseInt(position[1]) + position.charCodeAt(0)) % 2 === 0 ? "white" : "black"} 
      ${isOver ? "hover" : ""} ${isValidMove ? "valid-move" : ""} ${isSelected ? "selected" : ""}`}
      onClick={() => handleMove(null, position)} // Handle clicking on squares
    >
      {children}
    </div>
  );
};

const ChessBoard = () => {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState("");

  const checkGameStatus = () => {
    if (chess.isCheckmate()) {
      setGameStatus(`Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!`);
    } else if (chess.isCheck()) {
      setGameStatus(`Check! ${chess.turn() === "w" ? "White" : "Black"} is in check.`);
    } else if (chess.isDraw()){
      setGameStatus("Game Drawn!");
    } else {
      setGameStatus("");
    }
  };

  const handleMove = (from, to) => {
    if (!from) from = selected; // If clicking, move from selected piece

    if (!from) return; // If nothing is selected, do nothing

    const possibleMoves = chess.moves({ square: from, verbose: true }).map(m => m.to);

    if (possibleMoves.includes(to)) {
      const move = chess.move({ from, to });

      if (move) {
        setBoard(chess.board()); // Update board state
        setSelected(null); // Deselect after move
        setValidMoves([]); // Clear valid moves
        checkGameStatus();
      }
    } else {
      setSelected(null); // Deselect on invalid move
      setValidMoves([]);
    }
  };

  const handlePieceClick = (position) => {
    if (selected === position) {
      setSelected(null); // Deselect piece
      setValidMoves([]);
      return;
    }

    const piece = chess.get(position);
    if (piece) {
      setSelected(position); // Select piece
      const possibleMoves = chess.moves({ square: position, verbose: true }).map(m => m.to);
      setValidMoves(possibleMoves); // Show valid moves
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>{gameStatus}</h2>
      <div id="chessboard">
        {board.flat().map((square, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const position = `${String.fromCharCode(97 + col)}${8 - row}`;

          return (
            <Square
              key={position}
              position={position}
              handleMove={handleMove}
              isValidMove={validMoves.includes(position)}
              isSelected={selected === position}
            >
              {square ? (
                <Piece
                  piece={square.color === "b" ? square.type.toLowerCase() : square.type.toUpperCase()}
                  position={position}
                  onClick={handlePieceClick}
                  setValidMoves={setValidMoves}
                  chess={chess}
                />
              ) : null}
            </Square>
          );
        })}
      </div>
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
