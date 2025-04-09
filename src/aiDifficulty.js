export function getAIMove(chess, level = "easy") {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return null;
  
    switch (level) {
      case "easy":
        // Random move
        return moves[Math.floor(Math.random() * moves.length)];
  
      case "medium":
        // Random from top 3
        const topMoves = moves.slice(0, 3);
        return topMoves[Math.floor(Math.random() * topMoves.length)];
  
      case "hard":
        // Replace with minimax or better logic later
        return getBestMove(chess);
  
      default:
        return moves[0];
    }
  }
  
  function getBestMove(chess) {
    const moves = chess.moves({ verbose: true });
    let bestMove = null;
    let bestScore = -Infinity;

    for (let move of moves) {
      chess.move(move);
      const score = -evaluateBoard(chess.board());
      chess.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove || moves[Math.floor(Math.random() * moves.length)];
  }

  function evaluateBoard(board){
    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 1000,
    };

    let score = 0;

    for (let row of board){
      for (let square of row) {
        if(square) {
          const value = pieceValues[square.type.toLowerCase()] || 0;
          score += square.color === "w" ? value : -value;
        }
      }
    }

    return score; 
  }
  
  export function makeAIMoveIfBlackStarts(chess, playerColor, difficulty, setBoard, checkGameStatus) {
    // Trigger AI move only if player chooses black AND AI (white) starts
    if (playerColor === "black" && chess.turn() === "w") {
      const aiMove = getAIMove(chess, difficulty);
      if (aiMove) {
        chess.move(aiMove);
        setBoard(chess.board());
        checkGameStatus();
      }
    }
  }