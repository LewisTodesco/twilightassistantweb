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
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { JSX, useState, useEffect, useRef } from "react";
import RaceViewModel from "../ViewModels/RaceViewModel";

interface Props {
  playerName: string;
  playerRace: RaceViewModel;
  addSelectedInitiative: (i: number) => void;
  selectedInitiative: number[];
}

const Stopwatch = (props: Props): JSX.Element => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout>(null);
  const startTimeRef = useRef(0);

  const [initiative, setInitiative] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  interface colourVariants {
    [key: string]: string;
  }

  interface strategyCard {
    initiative: number;
    card: string;
  }

  const outlineColourVariants: colourVariants = {
    red: "outline-red-500",
    green: "outline-green-500",
    orange: "outline-orange-500",
    blue: "outline-blue-500",
    purple: "outline-purple-500",
    pink: "outline-pink-500",
    yellow: "outline-yellow-500",
    gray: "outline-gray-500",
    brown: "outline-amber-900",
  };

  const backgroundColourVariants: colourVariants = {
    red: "bg-red-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    yellow: "bg-yellow-500",
    gray: "bg-gray-500",
    brown: "bg-amber-900",
  };

  const strategyCards: strategyCard[] = [
    {
      initiative: 1,
      card: "./Strategy Cards/leadership.webp",
    },
    {
      initiative: 2,
      card: "./Strategy Cards/diplomacy.webp",
    },
    {
      initiative: 3,
      card: "./Strategy Cards/politics.webp",
    },
    {
      initiative: 4,
      card: "./Strategy Cards/construction.webp",
    },
    {
      initiative: 5,
      card: "./Strategy Cards/trade.webp",
    },
    {
      initiative: 6,
      card: "./Strategy Cards/warfare.webp",
    },
    {
      initiative: 7,
      card: "./Strategy Cards/technology.webp",
    },
    {
      initiative: 8,
      card: "./Strategy Cards/imperial.webp",
    },
    {
      initiative: 0,
      card: "./Strategy Cards/unknown.png",
    },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Card
        className={
          "min-w-[300px] min-h-[400px] " +
          (isRunning ? outlineColourVariants[props.playerRace.ThemeColour] : "")
        }
        shadow="sm"
      >
        <CardHeader className="flex gap-3">
          <Image
            alt={props.playerRace.Name}
            height={60}
            radius="sm"
            src={props.playerRace.Logo}
            width={60}
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
                  strategyCards[
                    strategyCards.findIndex((x) => x.initiative === initiative)
                  ].card
                }
                className="item-center"
                onClick={onOpen}
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
            >
              Stop
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="min-w-[1400px] bg-transparent"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className={"flex flex-row flex-wrap"}>
              {strategyCards.map((s, i) => {
                if (s.initiative !== 0) {
                  return (
                    <Image
                      key={i}
                      src={s.card}
                      height={380}
                      onClick={() => {
                        if (!props.selectedInitiative.includes(s.initiative)) {
                          setInitiative(s.initiative);
                          props.addSelectedInitiative(s.initiative);
                          onClose();
                        }
                      }}
                      className={
                        props.selectedInitiative.includes(s.initiative)
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
