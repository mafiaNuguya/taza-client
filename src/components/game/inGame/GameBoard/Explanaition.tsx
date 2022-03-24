import { useEffect, useRef, useState } from "react";
import explanation from "../../../../libs/connection/Game/gameState/explanation";

interface ExplanaitionProps {
  gameState: GameState;
}

const Explanaition: React.FC<ExplanaitionProps> = ({ gameState }) => {
  // const explainIndex = useRef(0);
  // const charArray = useRef(
  //   explanation[gameState][explainIndex.current].split("")
  // );
  // const [text, setText] = useState("");

  // useEffect(() => {
  //   if (explanation[gameState].length === explainIndex.current + 1) return;
  //   const shifted = charArray.current.shift();
  //   if (!shifted) {
  //     setTimeout(() => {
  //       explainIndex.current++;
  //       charArray.current =
  //         explanation[gameState][explainIndex.current].split("");
  //       setText("");
  //     }, 2000);
  //     return;
  //   }
  //   const id = setTimeout(() => setText(text + shifted), 100);

  //   return () => clearTimeout(id);
  // }, [text]);

  return (
    <div className="flex justify-center items-center w-full h-full bg-zinc-900 text-white">
      {/* {text} */}
    </div>
  );
};

export default Explanaition;
