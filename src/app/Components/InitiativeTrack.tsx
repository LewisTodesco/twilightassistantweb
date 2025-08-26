import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { JSX, useEffect, useState } from "react";
import PlayerViewModel from "../ViewModels/PlayerViewModel";
import InitiativeTrackCanvas from "./InitiativeTrackCanvas";

interface Props {
  players: PlayerViewModel[];
}

const InitiativeTrack = (props: Props): JSX.Element => {
  const [initiativeItems, setInitiativeItems] = useState<PlayerViewModel[]>([]);

  useEffect(() => {
    getInitiativeItems();
  }, [props.players]);

  function getInitiativeItems() {
    if (props.players.some((p) => p.Initiative === -1)) {
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
            <div className="mb-10">
              <Card
                key={index}
                isPressable
                shadow="sm"
                onPress={() => console.log("item pressed")}
                className="h-[180px] w-[150px] z-10"
              >
                <CardBody
                  className="overflow-visible p-0 z-10"
                  key={"body" + index}
                >
                  <Image
                    alt={player.Race.Name}
                    className="w-full object-cover h-[140px] z-10 p-5"
                    radius="sm"
                    src={player.Race.Logo}
                    width="100%"
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
          color="#c2e9e9ff"
          glowColor="#768282ff"
          speed={1}
          trailOpacity={0.08}
          dotRadius={8}
          cornerRadius={48}
          padding={75}
        ></InitiativeTrackCanvas>
      </div>
    </div>
  );
};

export default InitiativeTrack;
