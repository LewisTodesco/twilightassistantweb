"use client";

import { useState } from "react";
import Stopwatch from "./Components/Stopwatch";
import { races } from "./Collections/Races";
import { Button, ButtonGroup, Divider, Image, Tab, Tabs } from "@heroui/react";
import PlayerViewModel from "./ViewModels/PlayerViewModel";
import PlayerSelectCard from "./Components/PlayerSelectCard";
import StarfieldCanvas from "./StarfieldCanvas";
import PlayerSelectScreen from "./PlayerSelectScreen";

export default function Home() {
  const [selectedInitiative, setSelectedInitiative] = useState<number[]>([]);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerViewModel[]>([]);
  const [selectPlayers, setSelectPlayers] = useState<boolean>(false);

  function addSelectedInitiative(initiative: number) {
    var selectedInitiativeLocal = [...selectedInitiative, initiative];
    setSelectedInitiative(selectedInitiativeLocal);
  }

  return (
    <main className="flex flex-column flex-wrap content-start sm:content-start dark min-h-screen">
      <StarfieldCanvas></StarfieldCanvas>
      <div className="flex flex-row justify-center content-center w-full pt-2 z-1">
        <Image src={"./tilogo.png"} />
      </div>

      {!selectPlayers && (
        <div className="flex flex-col justify-center content-center w-full h-[80vh] pt-2 z-1">
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

      {startGame &&
        players.map((x) => {
          return (
            <Stopwatch
              key={x.Id}
              playerName={"Lewis"}
              playerRace={{
                Id: x.Id,
                Name: x.Name,
                Logo: x.Race.Logo,
                ThemeColour: x.Race.ThemeColour,
              }}
              addSelectedInitiative={(i) => addSelectedInitiative(i)}
              selectedInitiative={selectedInitiative}
            />
          );
        })}
    </main>
  );
}
