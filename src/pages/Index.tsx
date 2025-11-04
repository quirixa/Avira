import { useState } from "react";
import { Game } from "@/components/Game";
import { Landing } from "@/components/Landing";

const Index = () => {
  const [showGame, setShowGame] = useState(false);

  if (showGame) {
    return (
      <div className="w-full h-screen overflow-hidden">
        <Game />
      </div>
    );
  }

  return <Landing onPlayClick={() => setShowGame(true)} />;
};

export default Index;
