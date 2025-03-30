import React, { useState } from "react";
import { Chess } from "chess.js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAIMove, makeAIMoveIfBlackStarts } from "./aiDifficulty";

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
      className={`piece ${pieceClass}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => isCorrectPlayer && onClick(position)}
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
      onClick={() => handleMove(null, position)}
    >
      {children}
    </div>
  );
};

const ChessBoard = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState("");
  const [playerColor, setPlayerColor] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [captured, setCaptured] = useState([]);

  const checkGameStatus = () => {
    if (chess.isCheckmate()) {
      setGameStatus(`Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!`);
    } else if (chess.isCheck()) {
      setGameStatus(`Check! ${chess.turn() === "w" ? "White" : "Black"} is in check.`);
    } else if (chess.isDraw()) {
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
        setMoveHistory([...moveHistory, move.san]);
        if (move.captured) setCaptured([...captured, move.captured]);
        checkGameStatus();

        if (chess.turn() !== (playerColor === "white" ? "w" : "b")) {
          setTimeout(() => {
            const aiMove = getAIMove(chess, difficulty);
            if (aiMove) {
              const aiMoveResult = chess.move(aiMove);
              setBoard(chess.board());
              setMoveHistory(prev => [...prev, aiMoveResult.san]);
              if (aiMoveResult.captured) setCaptured(prev => [...prev, aiMoveResult.captured]);
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
      setSelected(null);
      setValidMoves([]);
      return;
    }

    const piece = chess.get(position);
    if (piece) {
      setSelected(position);
      const possibleMoves = chess.moves({ square: position, verbose: true }).map(m => m.to);
      setValidMoves(possibleMoves);
    }
  };

  const restartGame = () => {
    const newGame = new Chess();
    setChess(newGame);
    setBoard(newGame.board());
    setSelected(null);
    setValidMoves([]);
    setGameStatus("");
    setMoveHistory([]);
    setCaptured([]);
    setPlayerColor(null);
    setIsGameStarted(false);
  };

  if (!isGameStarted) {
    return (
      <div className="setup-menu">
        <h2>Choose Your Side</h2>
        <div>
          <label>Difficulty: </label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button onClick={() => {
          setPlayerColor("white");
          setIsGameStarted(true);
        }}>Play as White</button>

        <button onClick={() => {
          setPlayerColor("black");
          setIsGameStarted(true);
          setTimeout(() => {
            makeAIMoveIfBlackStarts(chess, "black", difficulty, setBoard, checkGameStatus);
          }, 300);
        }}>Play as Black</button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>{gameStatus}</h2>
        <button onClick={restartGame}>Restart Game</button>
        <div id="chessboard" className={playerColor === "black" ? "flipped" : ""}>
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
        <div className="move-history">
          <h3>Move History</h3>
          <ol>
            {moveHistory.map((move, i) => <li key={i}>{move}</li>)}
          </ol>
        </div>
        <div className="captured-pieces">
          <h3>Captured Pieces</h3>
          <p>{captured.join(", ")}</p>
        </div>
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
