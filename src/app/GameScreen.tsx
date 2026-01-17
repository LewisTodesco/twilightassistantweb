"use client";

import { Alert, Button } from "@heroui/react";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import PlayerViewModel, { Action } from "./ViewModels/PlayerViewModel";
import Stopwatch from "./Components/Stopwatch";
import { gridVariants } from "./StyleVariants/StyleVariants";
import InitiativeTrack from "./Components/InitiativeTrack";
import useWindowDimensions, {
  ErrorType,
  getErrorText,
} from "./helperFunctions";

interface Props {
  players: PlayerViewModel[];
  setPlayers: Dispatch<SetStateAction<PlayerViewModel[]>>;
  setStartGame: Dispatch<SetStateAction<boolean>>;
  setSelectPlayers: Dispatch<SetStateAction<boolean>>;
}

const GameScreen = (props: Props): JSX.Element => {
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [selectedInitiatives, setSelectedInitiatives] = useState<number[]>([]);

  const { height, width } = useWindowDimensions();

  function addSelectedInitiative(initiative: number, playerId: number) {
    let selectedInitiativesLocal = [...selectedInitiatives, initiative];
    let playersLocal = props.players.map((x) => {
      if (x.Id === playerId) {
        if (x.Initiative != 0) {
          selectedInitiativesLocal = selectedInitiativesLocal.filter(
            (i) => i != x.Initiative
          );
        }
        return {
          ...x,
          Initiative: initiative,
        };
      } else return x;
    });
    props.setPlayers(playersLocal);
    setSelectedInitiatives(selectedInitiativesLocal);
  }

  function clearInitiative() {
    let localPlayers = props.players.map((x) => {
      x.Initiative = 0;
      x.StrategyUsed = false;
      x.Passed = false;
      x.NextAction = Action.UseStrategy;
      return x;
    });
    props.setPlayers(localPlayers);
    setSelectedInitiatives([]);
  }

  return (
    <div className="flex flex-row justify-items-center flex-wrap w-full min-h-[90vh] p-5 z-1">
      <div className="flex flex-wrap justify-items-center w-full pt-5">
        <div
          className={
            gridVariants[props.players.length] + " justify-items-center"
          }
        >
          {props.players.map((x) => {
            return (
              <Stopwatch
                key={x.Id}
                playerName={x.Name}
                playerRace={{
                  Id: x.Id,
                  Name: x.Race.Name,
                  Logo: x.Race.Logo,
                  ThemeColour: x.Race.ThemeColour,
                }}
                addSelectedInitiative={(i) => addSelectedInitiative(i, x.Id)}
                selectedInitiatives={selectedInitiatives}
                strategyUsed={x.StrategyUsed}
                passed={x.Passed}
                initiative={x.Initiative}
              />
            );
          })}
        </div>
      </div>
      {width > 1900 && (
        <div className={"justify-items-center w-full pt-5"}>
          <InitiativeTrack
            players={props.players}
            setPlayers={props.setPlayers}
          ></InitiativeTrack>
        </div>
      )}

      <div className={"flex flex-row justify-center w-full p-5 z-1"}>
        <Button onPress={clearInitiative}>Reset Initiative</Button>
      </div>
      <div className={"flex flex-row justify-center w-full p-5 z-1"}>
        <Button
          onPress={() => {
            props.setStartGame(false);
            props.setSelectPlayers(true);
            clearInitiative();
          }}
        >
          Return to Player Select
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
    </div>
  );
};

export default GameScreen;
