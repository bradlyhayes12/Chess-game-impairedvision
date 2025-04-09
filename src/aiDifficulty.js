import { Chess } from "chess.js";

// Basic opening moves database
const openingBook = {
  white: ["e4", "d4", "c4", "Nf3"],
  black: ["e5", "c5", "e6", "d5"],
};

export function getAIMove(chess, level = "easy") {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  const moveNumber = chess.history().length;

  // Use opening book for first 4 plies (2 full moves)
  if (moveNumber < 4) {
    const bookMoves = getOpeningMove(chess);
    if (bookMoves.length > 0) {
      return bookMoves[Math.floor(Math.random() * bookMoves.length)];
    }
  }

  switch (level) {
    case "easy":
      return moves[Math.floor(Math.random() * moves.length)];

    case "medium":
      const topMoves = moves.slice(0, 5);
      return topMoves[Math.floor(Math.random() * topMoves.length)];

    case "hard":
      return getBestMove(chess, 4);

    default:
      return moves[0];
  }
}

function getOpeningMove(chess) {
  const isWhite = chess.turn() === "w";
  const availableMoves = chess.moves({ verbose: true });
  const book = isWhite ? openingBook.white : openingBook.black;

  // Find moves matching book
  const matchingMoves = availableMoves.filter(move => book.includes(move.san));
  return matchingMoves;
}

function getBestMove(chess, depth = 3) {
  const moves = chess.moves({ verbose: true });
  let bestMove = null;
  let bestScore = -Infinity;

  for (const move of moves) {
    chess.move(move);
    const score = minimax(chess, depth - 1, false);
    chess.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove || moves[Math.floor(Math.random() * moves.length)];
}

function minimax(chess, depth, isMaximizing) {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves({ verbose: true });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, true);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
    }
    return minEval;
  }
}

function evaluateBoard(chess) {
  const board = chess.board();
  const pieceValues = {
    p: 1,
    n: 3,
    b: 3.3,
    r: 5,
    q: 9,
    k: 1000,
  };

  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const baseValue = pieceValues[piece.type] || 0;
        const devBonus = getDevelopmentBonus(piece, row, col);
        if (piece.color === "w") {
          score += baseValue + devBonus;
        } else {
          score -= baseValue + devBonus;
        }
      }
    }
  }

  if (chess.inCheck()) {
    score += chess.turn() === "w" ? -2 : 2; // Stronger check bonus
  }

  if (isRepetitionLikely(chess)) {
    score += chess.turn() === "w" ? -1.5 : 1.5; // Penalize repetition
  }

  const fen = chess.fen();
  if (fen.includes("K")) score += 0.5;
  if (fen.includes("Q")) score += 0.3;
  if (fen.includes("k")) score -= 0.5;
  if (fen.includes("q")) score -= 0.3;

  score += (Math.random() - 0.5) * 0.05; // Tiny noise

  return score;
}

function isRepetitionLikely(chess) {
  const history = chess.history({ verbose: true });
  if (history.length < 4) return false;
  
  const lastMove = history[history.length - 1];
  const prevMove = history[history.length - 3];
  
  // If a piece moves to a square then back to original, suspicious
  return lastMove && prevMove && lastMove.to === prevMove.from;
}
function getDevelopmentBonus(piece, row, col) {
  const centerSquares = ["d4", "d5", "e4", "e5"];
  const square = `${String.fromCharCode(97 + col)}${8 - row}`;
  const centerControl = centerSquares.includes(square) ? 0.3 : 0;

  if (piece.type === "p") {
    return centerControl;
  }

  if (piece.type === "n" || piece.type === "b") {
    const isDeveloped = (piece.color === "w" && row <= 5) || (piece.color === "b" && row >= 2);
    return (isDeveloped ? 0.7 : 0) + centerControl;
  }

  if (piece.type === "q") {
    return -0.3;
  }

  return 0;
}

export function makeAIMoveIfBlackStarts(chess, playerColor, difficulty, setBoard, checkGameStatus) {
  if (playerColor === "black" && chess.turn() === "w") {
    const aiMove = getAIMove(chess, difficulty);
    if (aiMove) {
      chess.move(aiMove);
      setBoard(chess.board());
      checkGameStatus();
    }
  }
}
