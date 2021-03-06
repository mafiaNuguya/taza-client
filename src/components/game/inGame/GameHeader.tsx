import { useGame } from '../../../libs/connection/Game/Provider';

const GameHeader: React.FC = () => {
  const { gameInfo, leaveGame } = useGame();

  const handleLeaveGame = () => leaveGame();

  return (
    <div className="flex justify-between items-center w-full h-16 px-2">
      <div className="flex-1 text-xs text-white">
        {gameInfo && (
          <div className="flex flex-col">
            <div>{`방 번호: ${gameInfo.gameId}`}</div>
            <div>
              {gameInfo.gameType}
              {gameInfo.isPrivate && ' / 비밀방'}
            </div>
          </div>
        )}
      </div>
      <div
        className="flex justify-center items-center text-sm text-zinc-800 rounded-full w-10 h-10 bg-primary-gray cursor-pointer hover:opacity-70"
        onClick={handleLeaveGame}
      >
        나가기
      </div>
    </div>
  );
};

export default GameHeader;
