"use client";

import { Alert, Button, ButtonGroup, Divider } from "@heroui/react";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import PlayerSelectCard from "./Components/PlayerSelectCard";
import PlayerViewModel from "./ViewModels/PlayerViewModel";
import { races } from "./Collections/Races";
import Stopwatch from "./Components/Stopwatch";
import { gridVariants } from "./StyleVariants/StyleVariants";
import InitiativeTrack from "./Components/InitiativeTrack";
import { ErrorType, getErrorText } from "./helperFunctions";
import InitiativeTrackCanvas from "./Components/InitiativeTrackCanvas";

interface Props {
  players: PlayerViewModel[];
  setPlayers: Dispatch<SetStateAction<PlayerViewModel[]>>;
}

const GameScreen = (props: Props): JSX.Element => {
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [selectedInitiative, setSelectedInitiative] = useState<number[]>([]);

  function addSelectedInitiative(initiative: number, playerId: number) {
    var selectedInitiativeLocal = [...selectedInitiative, initiative];
    var playersLocal = props.players.map((x) => {
      if (x.Id === playerId) {
        if (x.Initiative != -1) {
          selectedInitiativeLocal = selectedInitiativeLocal.filter(
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
    setSelectedInitiative(selectedInitiativeLocal);
  }

  return (
    <div className="flex flex-row  justify-items-center flex-wrap w-full p-5 z-1">
      <div className="justify-items-center w-full pt-5">
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
                selectedInitiative={selectedInitiative}
              />
            );
          })}
        </div>
      </div>
      <div className={"justify-items-center w-full pt-5"}>
        <InitiativeTrack players={props.players}></InitiativeTrack>
      </div>

      <div className={"flex flex-row justify-center w-full p-5 z-1"}>
        <Button onPress={() => {}}>Return to Player Select</Button>
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
