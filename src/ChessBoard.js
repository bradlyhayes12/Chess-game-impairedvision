// src/ChessBoard.js
import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAIMove } from "./aiDifficulty";
import pieceImages from "./pieceImages";

const Speak = (text) => {
  const synth = window.speechSynthesis;
  if (synth.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slower for clarity (optional)
  synth.speak(utterance);
};

const pieceNames = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King"
};

const announceCapture = (move) => {
  if (!move?.captured) return;

  const pieceName = pieceNames[move.piece?.toLowerCase()] || "Piece";
  const capturedName = pieceNames[move.captured?.toLowerCase()] || "piece";
  const color = move.color === "w" ? "White" : "Black";

  Speak(`${color} ${pieceName} captures ${capturedName} at ${move.to}`);
};


const speakMove = (move, prefix = "") => {
  if (!move) return;
  const pieceName = pieceNames[move.piece.toLowerCase()] || move.piece;
  const moveText = `${prefix}${pieceName} to ${move.to.toUpperCase()}`;
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(moveText);
  synth.speak(utterance);
};


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
      className="piece"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => pieceColor === (playerColor === "white" ? "w" : "b") && onClick(position)}
    >
      <img
        src={pieceImages[pieceColor + piece.toLowerCase()]}
        alt={`${pieceColor === "w" ? "White" : "Black"} ${piece.toUpperCase()}`} 
        style={{ width: "80%", height: "80%"}}
      />
    </div>
  );
};

const Square = ({ children, position, handleMove, isValidMove, isSelected, isFocused }) => {
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
      ${isOver ? "hover" : ""} ${isValidMove ? "valid-move" : ""} ${isSelected ? "selected" : ""} ${isFocused ? "focused" : ""}`}
      onClick={() => handleMove(null, position)}
      tabIndex={0}
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
  const [focusedSquare, setFocusedSquare] = useState("e2");

  const checkGameStatus = () => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === "w" ? "Black" : "White";
      const message = `Checkmate! ${winner} wins!`;
      setGameStatus(message);
      Speak(message);
    } else if (chess.isCheck()) {
      const playerInCheck = chess.turn() === "w" ? "White" : "Black";
      const message = `Check! ${playerInCheck} is in check.`;
      setGameStatus(message);
      Speak(message);
    } else if (chess.isDraw()) {
      const message = "Game drawn!";
      setGameStatus(message);
      Speak(message);
    } else {
      setGameStatus("");
    }
  };  

  const handlePieceClick = useCallback((position) => {
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
  }, [chess, selected]);

  const handleMove = useCallback((from, to) => {
    if (!from) from = selected;
    if (!from) return;

    const possibleMoves = chess.moves({ square: from, verbose: true }).map(m => m.to);

    if (possibleMoves.includes(to)) {
      const piece = chess.get(from);
      let moveOptions = { from, to };
      if (piece.type === "p" && (to[1] === "8" || to[1] === "1")) moveOptions.promotion = "q";

      const move = chess.move(moveOptions);
      if (move) {
        speakMove(move);
        setBoard(chess.board());
        setSelected(null);
        setValidMoves([]);
        setMoveHistory(prev => [...prev, move.san]);
        Speak("Valid move");
        announceCapture(move);       

        if (chess.turn() !== (playerColor === "white" ? "w" : "b")) {
          setTimeout(() => {
            const aiMove = getAIMove(chess, difficulty);
            if (aiMove) {
              const aiMoveResult = chess.move(aiMove);
        
              if (aiMoveResult) {
                const pieceName = pieceNames[aiMoveResult.piece] || "Piece";
                const color = aiMoveResult.color === "w" ? "White" : "Black";
                const toSquare = aiMoveResult.to;
        
                // 🎙️ Speak the move
                Speak(`${color} ${pieceName} to ${toSquare}`);
        
                // 🎙️ Speak the capture if any
                announceCapture(aiMoveResult);
        
                // 🧠 Update state
                setBoard(chess.board());
                setMoveHistory(prev => [...prev, aiMoveResult.san]);
                if (aiMoveResult.captured) setCaptured(prev => [...prev, aiMoveResult.captured]);
                checkGameStatus();
              }
            }
          }, 500);
        }
        
      }
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  }, [chess, selected, playerColor, difficulty, checkGameStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const file = focusedSquare.charCodeAt(0);
      const rank = parseInt(focusedSquare[1]);
      let newFile = file;
      let newRank = rank;

      const isWhite = playerColor === "white";

      if (e.key === "ArrowUp") newRank += isWhite ? 1 : -1;
      if (e.key === "ArrowDown") newRank += isWhite ? -1 : 1;
      if (e.key === "ArrowLeft") newFile += isWhite ? -1 : 1;
      if (e.key === "ArrowRight") newFile += isWhite ? 1 : -1;

      if (newFile >= 97 && newFile <= 104 && newRank >= 1 && newRank <= 8) {
        const newSquare = `${String.fromCharCode(newFile)}${newRank}`;
        setFocusedSquare(newSquare);

        const piece = chess.get(newSquare);
        if (piece) {
          const colorName = piece.color === "w" ? "White" : "Black";
          const pieceName = pieceNames[piece.type?.toLowerCase()] || "Piece";
          Speak(`${colorName} ${pieceName} on ${newSquare}`);
        } else {
          Speak(`Empty square ${newSquare}`);
        }
        
      }

      if (e.key === "Enter" || e.key === " ") {
        handlePieceClick(focusedSquare);
        handleMove(null, focusedSquare);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSquare, chess, handlePieceClick, handleMove]);

  const startGameAsBlack = () => {
    setPlayerColor("black");
    setIsGameStarted(true);
    setTimeout(() => {
      const aiMove = getAIMove(chess, difficulty);
      if (aiMove) {
        const aiMoveResult = chess.move(aiMove);
        if (aiMoveResult) {
          speakMove(aiMoveResult, "Computer played ");
          setTimeout(() => {
            setBoard(chess.board());
            setMoveHistory([aiMoveResult.san]);
            if (aiMoveResult.captured) setCaptured([aiMoveResult.captured]);
            checkGameStatus();
          }, 800);
        }
      }
    }, 300);
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
        <button onClick={() => { setPlayerColor("white"); setIsGameStarted(true); }}>Play as White</button>
        <button onClick={startGameAsBlack}>Play as Black</button>
      </div>
    );
  }
  const restartGame = () => {
    const newGame = new Chess();
    setChess(newGame);
    setBoard(newGame.board());
    setSelected(null);
    setValidMoves([]);
    setGameStatus("");
    setMoveHistory([]);
    setCaptured([]);
    setFocusedSquare("e2");
    setPlayerColor(null);
    setIsGameStarted(false);
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>{gameStatus}</h2>
        <button onClick={restartGame}>Restart</button>
        <div className="game-container">
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
                isFocused={focusedSquare === position}
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

        <div className="move-history-panel">
          <h3>Move History</h3>
          <ol>
            {moveHistory.map((move, i) => (
              <li key={i}>{move}</li>
            ))}
          </ol>
        </div>
      </div>
      </div>
    </DndProvider>
  );
};

export default ChessBoard;
