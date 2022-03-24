import Timer from "./Timer";
import Explanaition from "./Explanaition";

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  return (
    <div className="w-full h-full bg bg-red-700">
      <Timer gameState={gameState} />
      <Explanaition gameState={gameState} />
    </div>
  );
};

export default GameBoard;
