"use client";

import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [selectedInitiatives, setSelectedInitiatives] = useState<number[]>([]);

  const { height, width } = useWindowDimensions();

  function addSelectedInitiative(initiative: number, playerId: number) {
    let selectedInitiativesLocal = [...selectedInitiatives, initiative];
    let playersLocal = props.players.map((x) => {
      if (x.Id === playerId) {
        if (x.Initiative != 0) {
          selectedInitiativesLocal = selectedInitiativesLocal.filter(
            (i) => i != x.Initiative,
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

  function clearSelectedFactions() {
    let localPlayers = props.players.map((x) => {
      x.Race = {
        Id: -1,
        Name: "",
        Logo: "",
        ThemeColour: "default",
      };
      return x;
    });
    props.setPlayers(localPlayers);
  }

  function handleOpen() {
    onOpen();
  }

  function handleClose() {
    onClose();
  }

  function handleContinue() {
    props.setStartGame(false);
    props.setSelectPlayers(true);
    clearInitiative();
    clearSelectedFactions();
    onClose();
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
            handleOpen();
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

      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Return to player selection
              </ModalHeader>
              <ModalBody>
                <p>
                  Returning to the player selection screen will erase all
                  elapsed times.
                </p>
                <p>Are you sure you want to continue?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleClose}>
                  Back
                </Button>
                <Button color="danger" variant="light" onPress={handleContinue}>
                  Continue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GameScreen;
