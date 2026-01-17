"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { JSX, useState, useEffect, useRef } from "react";
import RaceViewModel from "../ViewModels/RaceViewModel";
import {
  backgroundColourVariants,
  outlineColourVariants,
} from "../StyleVariants/StyleVariants";
import { strategyCards } from "../Collections/StrategyCards";

interface Props {
  playerName: string;
  playerRace: RaceViewModel;
  addSelectedInitiative: (i: number) => void;
  selectedInitiatives: number[];
  strategyUsed: boolean;
  passed: boolean;
  initiative: number;
}

const Stopwatch = (props: Props): JSX.Element => {
  // test deploy

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout>(null);
  const startTimeRef = useRef(0);

  function formatTime(milliseconds: number) {
    var hours = Math.floor(milliseconds / (1000 * 60 * 60));
    var minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    var seconds = Math.floor((milliseconds / 1000) % 60);

    var hString = hours.toString().padStart(2, "0");
    var mString = minutes.toString().padStart(2, "0");
    var sString = seconds.toString().padStart(2, "0");

    return `${hString}:${mString}:${sString}.`;
  }

  function formatDecimalTime(milliseconds: number) {
    var hundreths = Math.floor((milliseconds % 1000) / 10);
    var hunString = hundreths.toString().padStart(2, "0");

    return `${hunString}`;
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [isRunning]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function stop() {
    setIsRunning(false);
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log("player: " + props.playerName);
  console.log("initiative: " + props.initiative);

  return (
    <>
      <Card
        className={
          "w-[300px] h-[550px] " +
          (isRunning
            ? outlineColourVariants[props.playerRace.ThemeColour]
            : "") +
          (props.passed ? "blur-sm" : "")
        }
        shadow="sm"
        isDisabled={props.passed}
      >
        <CardHeader className="flex gap-3">
          <Image
            alt={props.playerRace.Name}
            radius="sm"
            src={props.playerRace.Logo}
            className="object-cover h-[60px] z-10"
          />
          <div className="flex flex-col">
            <p className="text-lg">{props.playerName}</p>
            <p className="text-md text-default-500">{props.playerRace.Name}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col items-start">
            <h1 className="text-4xl pb-5">
              {formatTime(elapsedTime)}
              <span className="text-xl">{formatDecimalTime(elapsedTime)}</span>
            </h1>
            <div className="flex flex-col items-center w-full">
              <Image
                alt={props.playerRace.Name}
                height={280}
                radius="sm"
                src={
                  props.strategyUsed
                    ? strategyCards[
                        strategyCards.findIndex(
                          (x) => x.initiative === props.initiative
                        )
                      ].used
                    : strategyCards[
                        strategyCards.findIndex(
                          (x) => x.initiative === props.initiative
                        )
                      ].card
                }
                className="item-center"
                onClick={() => {
                  if (!props.passed) {
                    onOpen();
                  }
                }}
              />
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-row justify-between">
          <div className="ml-2">
            <Button
              className={
                isRunning
                  ? backgroundColourVariants[props.playerRace.ThemeColour]
                  : outlineColourVariants[props.playerRace.ThemeColour]
              }
              onPress={() => {
                start();
              }}
              isDisabled={props.passed}
            >
              Start
            </Button>
          </div>
          <div className="mr-2">
            <Button
              className={
                isRunning
                  ? outlineColourVariants[props.playerRace.ThemeColour]
                  : ""
              }
              onPress={() => {
                stop();
              }}
              isDisabled={props.passed}
            >
              Stop
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="2xl:min-w-[1400px] xl:min-w-[1200px] lg:min-w-[900px] md:min-w-[600px] sm:w-[300px] w-[300px] bg-transparent"
        backdrop="blur"
        hideCloseButton
        scrollBehavior="outside"
        placement="bottom"
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody
              className={
                "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 z-1"
              }
            >
              {strategyCards.map((s, i) => {
                if (s.initiative !== 0) {
                  return (
                    <Image
                      key={i}
                      src={s.card}
                      onClick={() => {
                        if (!props.selectedInitiatives.includes(s.initiative)) {
                          props.addSelectedInitiative(s.initiative);
                          onClose();
                        }
                      }}
                      className={
                        props.selectedInitiatives.includes(s.initiative)
                          ? "blur-sm"
                          : ""
                      }
                    />
                  );
                }
              })}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Stopwatch;
