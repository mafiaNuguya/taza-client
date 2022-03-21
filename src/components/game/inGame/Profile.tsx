import { useEffect, useState } from "react";
import Player from "../../../libs/connection/Game/Player";
import User from "../../svgs/User";

interface ProfileProps {
  player: Player;
  isMine: boolean;
}

const Profile: React.FC<ProfileProps> = ({ player, isMine }) => {
  const [audioDetected, setAudioDetected] = useState(false);

  useEffect(() => {
    const audioDetectUpdater = (detected: boolean) =>
      setAudioDetected(detected);
    player.onAudioDetected(audioDetectUpdater);

    return () => player.removeAudioDetected(audioDetectUpdater);
  }, []);

  return (
    <div className="relative w-1/3 aspect-square bg-zinc-600">
      {player.isMaster && (
        <img
          src="/assests/crown.png"
          width={15}
          className="absolute z-10 top-1 left-1"
        />
      )}
      {isMine && <User />}
      <div className="flex justify-center items-center w-full h-full bg-zinc-800 opacity-90">
        <div
          className={`flex justify-center items-center w-2/3 aspect-square bg-black rounded-full ring-2 ${
            audioDetected ? "ring-white" : "ring-black"
          } text-2xl text-primary-gray`}
        >
          {player.name}
        </div>
      </div>
    </div>
  );
};

export default Profile;
