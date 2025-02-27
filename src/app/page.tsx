"use client";

import { useState } from "react";
import Stopwatch from "./Components/Stopwatch";
import { races } from "./Collections/Races";

export default function Home() {
  const [selectedInitiative, setSelectedInitiative] = useState<number[]>([]);

  function addSelectedInitiative(initiative: number) {
    var selectedInitiativeLocal = [...selectedInitiative, initiative];
    setSelectedInitiative(selectedInitiativeLocal);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-row flex-wrap gap-8 row-start-2 items-center sm:items-start dark">
        {races.map((x, i) => {
          return (
            <Stopwatch
              key={i}
              playerName={"Lewis" + i}
              playerRace={{
                Name: x.Name,
                Logo: x.Logo,
                ThemeColour: x.ThemeColour,
              }}
              addSelectedInitiative={(i) => addSelectedInitiative(i)}
              selectedInitiative={selectedInitiative}
            />
          );
        })}
      </main>
    </div>
  );
}
