"use client";

import { useState } from "react";
import Stopwatch from "./Components/Stopwatch";
import { races } from "./Collections/Races";
import { Button, ButtonGroup, Divider } from "@heroui/react";
import PlayerViewModel from "./ViewModels/PlayerViewModel";
import PlayerSelectCard from "./Components/PlayerSelectCard";

export default function Home() {
  const [selectedInitiative, setSelectedInitiative] = useState<number[]>([]);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<PlayerViewModel[]>([]);
  const [selectedRaces, setSelectedRaces] = useState<number[]>([]);

  function addSelectedInitiative(initiative: number) {
    var selectedInitiativeLocal = [...selectedInitiative, initiative];
    setSelectedInitiative(selectedInitiativeLocal);
  }

  function setupPlayers(count: number) {
    var localPlayers: PlayerViewModel[] = [];
    for (var i = 0; i < count; i++) {
      localPlayers.push({
        Id: i,
        Name: "",
        Race: {
          Id: -1,
          Name: "",
          Logo: "",
          ThemeColour: "default",
        },
      });
    }
    setPlayers(localPlayers);
  }

  function updatePlayers(updatedPlayer: PlayerViewModel) {
    var localPlayers = players.map((x) => {
      if (x.Id === updatedPlayer.Id) {
        return updatedPlayer;
      } else {
        return x;
      }
    });
    setPlayers(localPlayers);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row flex-wrap gap-8 row-start-2 items-center sm:items-start dark">
        {!startGame && (
          <div className="flex flex-row flex-wrap items-center content-center w-full">
            <div className="flex flex-row flex-wrap items-center content-center w-full">
              <p className={"w-full text-center"}>
                Select the number of players:
              </p>
            </div>
            <Divider className="m-4" />
            <div className="flex flex-row flex-wrap items-center content-center w-full">
              <ButtonGroup className="flex flex-row flex-wrap items-center content-center w-full">
                <Button onPress={() => setupPlayers(3)}>3</Button>
                <Button onPress={() => setupPlayers(4)}>4</Button>
                <Button onPress={() => setupPlayers(5)}>5</Button>
                <Button onPress={() => setupPlayers(6)}>6</Button>
                <Button onPress={() => setupPlayers(7)}>7</Button>
                <Button onPress={() => setupPlayers(8)}>8</Button>
              </ButtonGroup>
            </div>
            <Divider className="m-4" />
          </div>
        )}

        <div className="flex flex-row flex-wrap gap-8 w-full justify-between">
          {players.length !== 0 &&
            players.map((x) => {
              return (
                <PlayerSelectCard
                  races={races}
                  player={x}
                  players={players}
                  key={x.Id}
                  setPlayers={setPlayers}
                  selectedRaces={selectedRaces}
                  setSelectedRaces={setSelectedRaces}
                />
              );
            })}
        </div>

        {startGame &&
          races.map((x) => {
            return (
              <Stopwatch
                key={x.Id}
                playerName={"Lewis"}
                playerRace={{
                  Id: x.Id,
                  Name: x.Name,
                  Logo: x.Logo,
                  ThemeColour: x.ThemeColour,
                }}
                addSelectedInitiative={(i) => addSelectedInitiative(i)}
                selectedInitiative={selectedInitiative}
              />
            );
          })}
      </main>
    </div>
  );
}
