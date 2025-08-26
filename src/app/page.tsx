"use client";

import { useState } from "react";
import Stopwatch from "./Components/Stopwatch";
import { Button, Image } from "@heroui/react";
import PlayerViewModel from "./ViewModels/PlayerViewModel";
import StarfieldCanvas from "./StarfieldCanvas";
import PlayerSelectScreen from "./PlayerSelectScreen";
import GameScreen from "./GameScreen";
import InitiativeTrackCanvas from "./Components/InitiativeTrackCanvas";

export default function Home() {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerViewModel[]>([]);
  const [selectPlayers, setSelectPlayers] = useState<boolean>(false);
  const [canvasLoaded, setCanvasLoaded] = useState<boolean>(false);

  return (
    <main className="flex flex-column flex-wrap content-start sm:content-start dark min-h-screen">
      <StarfieldCanvas setLoaded={setCanvasLoaded}></StarfieldCanvas>
      <div className="flex flex-row justify-center content-center w-full pt-2 z-1">
        <Image src={"./tilogo.png"} />
      </div>

      {canvasLoaded && !selectPlayers && (
        <div className="absolute flex flex-col justify-center content-center w-full h-[95vh] pt-2 z-1">
          <div className="flex flex-row justify-center content-center pt-2 z-1">
            <Button onPress={() => setSelectPlayers(true)}>
              Select Players
            </Button>
          </div>
        </div>
      )}

      {!startGame && selectPlayers && (
        <PlayerSelectScreen
          players={players}
          setStartGame={(x) => setStartGame(x)}
          setPlayers={setPlayers}
        />
      )}

      {startGame && (
        <GameScreen players={players} setPlayers={setPlayers}></GameScreen>
      )}
    </main>
  );
}
