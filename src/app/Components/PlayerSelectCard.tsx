"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  JSX,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import RaceViewModel from "../ViewModels/RaceViewModel";
import {
  backgroundColourVariants,
  outlineColourVariants,
} from "../StyleVariants/ColourVariants";
import { strategyCards } from "../Collections/StrategyCards";
import PlayerViewModel from "../ViewModels/PlayerViewModel";

interface Props {
  races: RaceViewModel[];
  player: PlayerViewModel;
  players: PlayerViewModel[];
  setPlayers: Dispatch<SetStateAction<PlayerViewModel[]>>;
  selectedRaces: number[];
  setSelectedRaces: Dispatch<SetStateAction<number[]>>;
  emptySlot: boolean;
}

const PlayerSelectCard = (props: Props): JSX.Element => {
  return (
    <>
      <Card
        className={
          "max-w-[300px] min-h-[250px] " +
          (props.player.Race.ThemeColour !== undefined
            ? outlineColourVariants[props.player.Race.ThemeColour]
            : "")
        }
        shadow="sm"
      >
        <CardHeader className="flex gap-3">
          <Image
            alt={props.player.Race.Name}
            height={60}
            radius="sm"
            src={
              props.player.Race.Logo === ""
                ? "./Faction Logos/unknown.png"
                : props.player.Race.Logo
            }
            width={60}
          />
          <div className="flex flex-col">
            <p className="text-lg">{props.player.Name}</p>
            <p className="text-md text-default-500">{props.player.Race.Name}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col items-start gap-4">
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                label="Player Name"
                onChange={(e) => {
                  props.setPlayers(
                    props.players.map((x) => {
                      if (x.Id === props.player.Id) {
                        return {
                          ...props.player,
                          Name: e.target.value,
                        };
                      } else {
                        return x;
                      }
                    })
                  );
                }}
                value={props.player.Name}
              />
            </div>
            <div className="flex flex-col items-center w-full">
              <Select
                label="Player Race"
                onChange={(e) => {
                  props.setSelectedRaces([
                    ...props.selectedRaces,
                    Number(e.target.value),
                  ]);
                  props.setPlayers(
                    props.players.map((x) => {
                      if (x.Id === props.player.Id) {
                        return {
                          ...props.player,
                          Race: props.races[Number(e.target.value)],
                        };
                      } else {
                        return x;
                      }
                    })
                  );
                }}
                selectedKeys={[
                  props.player.Race.Id === -1
                    ? ""
                    : props.player.Race.Id.toString(),
                ]}
              >
                {props.races.map((race) => {
                  return <SelectItem key={race.Id}>{race.Name}</SelectItem>;
                })}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default PlayerSelectCard;
