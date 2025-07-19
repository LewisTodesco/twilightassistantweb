"use client";

import { Button, ButtonGroup, Divider } from "@heroui/react";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import PlayerSelectCard from "./Components/PlayerSelectCard";
import PlayerViewModel from "./ViewModels/PlayerViewModel";
import { races } from "./Collections/Races";

interface Props {
  players: PlayerViewModel[];
  setStartGame: (start: boolean) => void;
  setPlayers: Dispatch<SetStateAction<PlayerViewModel[]>>;
}

const PlayerSelectScreen = (props: Props): JSX.Element => {
  const playerCounts = [3, 4, 5, 6, 7, 8];
  const playerSlots = [1, 2, 3, 4, 5, 6, 7, 8];

  const [selectedRaces, setSelectedRaces] = useState<number[]>([]);
  const [emptyPlayerSlots, setEmptyPlayerSlots] = useState<boolean[]>([]);

  useEffect(() => {
    var emptySlots = playerSlots.map((x) => {
      if (x > props.players.length) {
        return true;
      } else {
        return false;
      }
    });
    setEmptyPlayerSlots(emptySlots);
  }, [props.players]);

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
    props.setPlayers(localPlayers);
  }

  return (
    <>
      <div className="flex flex-row flex-wrap items-center content-center w-full p-5 z-1">
        <div className="flex flex-row flex-wrap items-center content-center w-full z-1">
          <p className={"w-full text-center z-1"}>
            Select the number of players:
          </p>
        </div>
        <Divider className="mt-4 mb-4 z-1" />
        <div className="flex flex-row flex-wrap items-center content-center w-full z-1">
          <ButtonGroup className="flex flex-row flex-wrap items-center content-center w-full gap-1 z-1">
            {playerCounts.map((x) => (
              <Button
                key={x}
                color={x === props.players.length ? "secondary" : "default"}
                onPress={() => {
                  setupPlayers(x);
                }}
              >
                {x}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <Divider className="mt-4 mb-4 z-1" />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full gap-8 z-1">
        {props.players.length !== 0 &&
          props.players.map((x) => {
            return (
              <PlayerSelectCard
                races={races}
                player={x}
                players={props.players}
                key={x.Id}
                setPlayers={props.setPlayers}
                selectedRaces={selectedRaces}
                setSelectedRaces={setSelectedRaces}
                emptySlot={false}
              />
            );
          })}
        {emptyPlayerSlots.map((x, i) => {
          if (x) {
            var emptyPlayer: PlayerViewModel = {
              Id: i,
              Name: "",
              Race: {
                Id: -1,
                Name: "",
                Logo: "unknown.png",
                ThemeColour: "black",
              },
            };
            return (
              <PlayerSelectCard
                races={races}
                player={emptyPlayer}
                players={props.players}
                key={i}
                setPlayers={props.setPlayers}
                selectedRaces={selectedRaces}
                setSelectedRaces={setSelectedRaces}
                emptySlot={true}
              />
            );
          }
        })}
      </div>
      <div className={"flex flex-row justify-center w-full p-5 z-1"}>
        <Button onPress={() => props.setStartGame(true)}>Start Game</Button>
      </div>
    </>
  );
};

export default PlayerSelectScreen;
