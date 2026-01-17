"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { JSX, Dispatch, SetStateAction } from "react";
import RaceViewModel from "../ViewModels/RaceViewModel";
import {
  blurVariants,
  outlineColourVariants,
} from "../StyleVariants/StyleVariants";
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
    <div
      className={
        "flex justify-center w-100 " +
        (props.emptySlot ? blurVariants["small"] : blurVariants["none"])
      }
    >
      <Card
        className={
          "w-[325px] h-[250px] " +
          (props.player.Race.ThemeColour !== undefined
            ? outlineColourVariants[props.player.Race.ThemeColour]
            : "")
        }
        shadow="sm"
      >
        <CardHeader className="flex gap-3">
          <Image
            alt={props.player.Race.Name}
            radius="sm"
            src={
              props.player.Race.Logo === ""
                ? "./Faction Logos/unknown.png"
                : props.player.Race.Logo
            }
            className="object-cover h-[60px] z-10"
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
                isDisabled={props.emptySlot}
                value={props.player.Name}
              />
            </div>
            <div className="flex flex-col items-center w-full">
              <Select
                label="Player Race"
                onChange={(e) => {
                  props.setSelectedRaces([
                    ...props.selectedRaces.filter(
                      (x) => x !== props.player.Race.Id
                    ),
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
                disabledKeys={props.selectedRaces.map((x) => x.toString())}
                isDisabled={props.emptySlot}
              >
                {props.races.map((race) => {
                  return <SelectItem key={race.Id}>{race.Name}</SelectItem>;
                })}
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PlayerSelectCard;
