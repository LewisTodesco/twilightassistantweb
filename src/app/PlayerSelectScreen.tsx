"use client";

import { Alert, Button, ButtonGroup, Divider } from "@heroui/react";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import PlayerSelectCard from "./Components/PlayerSelectCard";
import PlayerViewModel from "./ViewModels/PlayerViewModel";
import { races } from "./Collections/Races";
import { ErrorType, getErrorText } from "./helperFunctions";

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
  const [error, setError] = useState<ErrorType>(ErrorType.None);

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
        Initiative: -1,
      });
    }
    props.setPlayers(localPlayers);
  }

  function validateStart(): boolean {
    if (props.players.length === 0) {
      setError(ErrorType.NoPlayersSelected);
      return false;
    }

    if (props.players.some((x) => x.Name === "")) {
      setError(ErrorType.MissingPlayerName);
      return false;
    }

    if (props.players.some((x) => x.Race.Name === "")) {
      setError(ErrorType.MissingPlayerRace);
      return false;
    }

    return true;
  }

  return (
    <>
      <div className="flex flex-row flex-wrap w-full p-5 z-1">
        <div className="flex flex-row flex-wrap w-full z-1">
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
                variant="ghost"
              >
                {x}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <Divider className="mt-4 mb-4 z-1" />
      </div>
      <div className="justify-items-center w-full">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 w-4/5 gap-6 z-1">
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
                Initiative: -1,
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
      </div>
      <div className={"flex flex-row justify-center w-full p-5 z-1"}>
        <Button
          onPress={() => {
            if (validateStart()) {
              props.setStartGame(true);
            }
          }}
        >
          Start Game
        </Button>
      </div>
      {error != ErrorType.None && (
        <div className="w-full flex flex-row justify-center">
          <div className="w-1/3">
            <Alert
              variant="faded"
              color="secondary"
              title={getErrorText(error)}
            ></Alert>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerSelectScreen;
