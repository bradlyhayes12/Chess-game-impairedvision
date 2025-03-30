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
    // TEMP: same as easy, placeholder for real engine logic
    return moves[Math.floor(Math.random() * moves.length)];
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