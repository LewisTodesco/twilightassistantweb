import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import PlayerViewModel, { Action } from "../ViewModels/PlayerViewModel";
import InitiativeTrackCanvas from "./InitiativeTrackCanvas";

interface Props {
  players: PlayerViewModel[];
  setPlayers: Dispatch<SetStateAction<PlayerViewModel[]>>;
}

const InitiativeTrack = (props: Props): JSX.Element => {
  const [initiativeItems, setInitiativeItems] = useState<PlayerViewModel[]>([]);

  useEffect(
    () => {
      getInitiativeItems();
    },
    // eslint-disable-next-line
    [props.players]
  );

  function getInitiativeItems() {
    if (props.players.some((p) => p.Initiative === 0)) {
      setInitiativeItems([]);
      return;
    }

    setInitiativeItems(props.players.sort((p) => p.Initiative).map((x) => x));
  }

  return (
    <div className="relative justify-items-center w-full h-[300px] p-10">
      <div className="relative flex flex-row flex-wrap justify-between w-4/5 px-12 z-1">
        {initiativeItems
          .sort((a, b) => {
            return a.Initiative - b.Initiative;
          })
          .map((player, index) => (
            <div className="mb-10" key={"container-" + index}>
              <Card
                key={index}
                isPressable
                shadow="sm"
                onPress={() => {
                  switch (player.NextAction) {
                    case Action.Reset: {
                      props.setPlayers(
                        props.players.map((p) => {
                          if (p.Id === player.Id) {
                            return {
                              ...p,
                              StrategyUsed: !p.StrategyUsed,
                              Passed: !p.Passed,
                              NextAction: Action.UseStrategy,
                            };
                          } else {
                            return p;
                          }
                        })
                      );
                      break;
                    }
                    case Action.UseStrategy: {
                      props.setPlayers(
                        props.players.map((p) => {
                          if (p.Id === player.Id) {
                            return {
                              ...p,
                              StrategyUsed: !p.StrategyUsed,
                              NextAction: Action.Pass,
                            };
                          } else {
                            return p;
                          }
                        })
                      );
                      break;
                    }
                    case Action.Pass: {
                      props.setPlayers(
                        props.players.map((p) => {
                          if (p.Id === player.Id) {
                            return {
                              ...p,
                              Passed: !p.Passed,
                              NextAction: Action.Reset,
                            };
                          } else {
                            return p;
                          }
                        })
                      );
                      break;
                    }
                  }
                }}
                className={
                  "h-[180px] w-[150px] z-10 " + (player.Passed ? "blur-sm" : "")
                }
              >
                <CardBody
                  className="overflow-visible items-center p-0 z-10"
                  key={"body" + index}
                >
                  <Image
                    alt={player.Race.Name}
                    className="object-cover h-[140px] z-10 p-2"
                    radius="sm"
                    src={player.Race.Logo}
                    key={"image" + index}
                  />
                </CardBody>
                <CardFooter
                  className="text-small justify-between z-10"
                  key={"footer" + index}
                >
                  <b>{player.Name}</b>
                </CardFooter>
              </Card>
            </div>
          ))}
        <InitiativeTrackCanvas
          color="#9baeaeff"
          glowColor="#caf1f1ff"
          speed={1.5}
          trailOpacity={0.08}
          dotRadius={10}
          cornerRadius={48}
          padding={75}
        ></InitiativeTrackCanvas>
      </div>
    </div>
  );
};

export default InitiativeTrack;
