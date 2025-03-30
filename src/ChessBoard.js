import React, { useState } from "react";
import { Chess } from "chess.js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAIMove } from "./aiDifficulty";

const Piece = ({ piece, position, onClick, setValidMoves, chess, playerColor }) => {
  const pieceColor = piece === piece.toUpperCase() ? "w" : "b";
  const isCorrectPlayer = pieceColor === (playerColor === "white" ? "w" : "b");
  const pieceClass = pieceColor === "w" ? "white-piece" : "black-piece";

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { position },
    canDrag: isCorrectPlayer,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));


  return (
    <div
      ref={drag}
      className= { `piece ${pieceClass}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => isCorrectPlayer && onClick(position)} // ✅ Allow clicking to select
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
      onClick={() => handleMove(null, position)} // ✅ Handle clicking on squares
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
  const [playerColor, setPlayerColor] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [isPlayingAgainstAI] = useState(true);

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
    if (!from) from = selected;
    if (!from) return;

    const possibleMoves = chess.moves({ square: from, verbose: true }).map(m => m.to);

    if (possibleMoves.includes(to)) {
      const move = chess.move({ from, to });

      if (move) {
        setBoard(chess.board());
        setSelected(null);
        setValidMoves([]);
        checkGameStatus();

        // AI Move
        if (isPlayingAgainstAI && chess.turn() !== (playerColor === "white" ? "w" : "b")) {
          setTimeout(() => {
            const aiMove = getAIMove(chess, difficulty);
            if (aiMove) {
              chess.move(aiMove);
              setBoard(chess.board());
              checkGameStatus();
            }
          }, 500);
        }
      }
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  };

  const handlePieceClick = (position) => {
    if (selected === position) {
      setSelected(null); // ✅ Deselect piece
      setValidMoves([]);
      return;
    }

    const piece = chess.get(position);
    if (piece) {
      setSelected(position); // ✅ Select piece
      const possibleMoves = chess.moves({ square: position, verbose: true }).map(m => m.to);
      setValidMoves(possibleMoves); // ✅ Show valid moves
    }
  };
  
  if (playerColor === null) {
    return (
      <div className="choose-side">
        <h2>Choose Your Side</h2>
        <button onClick={() => setPlayerColor("white")}>Play as White</button>
        <button onClick={() => setPlayerColor("black")}>Play as Black</button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>{gameStatus}</h2>
        <label>Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
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
                  playerColor={playerColor}
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
