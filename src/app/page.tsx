"use client";

import { useState } from "react";
import Stopwatch from "./Components/Stopwatch";
import RaceViewModel from "./ViewModels/RaceViewModel";

export default function Home() {
  var races: RaceViewModel[] = [
    {
      Name: "The Arborec",
      Logo: "./Faction Logos/Arborec.png",
      ThemeColour: "green",
    },
    {
      Name: "The Barony of Letnev",
      Logo: "./Faction Logos/Barony.png",
      ThemeColour: "red",
    },
    {
      Name: "The Clan of Saar",
      Logo: "./Faction Logos/Saar.png",
      ThemeColour: "brown",
    },
    {
      Name: "The Embers of Muaat",
      Logo: "./Faction Logos/Muaat.png",
      ThemeColour: "orange",
    },
    {
      Name: "The Emirates of Hacan",
      Logo: "./Faction Logos/Hacan.png",
      ThemeColour: "orange",
    },
    {
      Name: "The Federation of Sol",
      Logo: "./Faction Logos/Sol.png",
      ThemeColour: "yellow",
    },
    {
      Name: "The Ghosts of Creuss",
      Logo: "./Faction Logos/Ghosts.png",
      ThemeColour: "blue",
    },
    {
      Name: "The L1Z1 Mindnet",
      Logo: "./Faction Logos/L1Z1X.png",
      ThemeColour: "gray",
    },
    {
      Name: "The Mentak Coalition",
      Logo: "./Faction Logos/Mentak.png",
      ThemeColour: "brown",
    },
    {
      Name: "The Naalu Collective",
      Logo: "./Faction Logos/Naalu.png",
      ThemeColour: "green",
    },
    {
      Name: "The Nekro Virus",
      Logo: "./Faction Logos/Nekro.png",
      ThemeColour: "red",
    },
    {
      Name: "Sardakk N'orr",
      Logo: "./Faction Logos/Sardakk.png",
      ThemeColour: "gray",
    },
    {
      Name: "The Universities of Jol-Nar",
      Logo: "./Faction Logos/Jol-Nar.png",
      ThemeColour: "blue",
    },
    {
      Name: "The Winnu",
      Logo: "./Faction Logos/Winnu.png",
      ThemeColour: "orange",
    },
    {
      Name: "The Xxcha Kingdom",
      Logo: "./Faction Logos/Xxcha.png",
      ThemeColour: "green",
    },
    {
      Name: "The Yin Brotherhood",
      Logo: "./Faction Logos/Yin.png",
      ThemeColour: "purple",
    },
    {
      Name: "The Yssaril Tribes",
      Logo: "./Faction Logos/Yssaril.png",
      ThemeColour: "yellow",
    },
    {
      Name: "The Argent Flight",
      Logo: "./Faction Logos/ArgentFactionSymbol.png",
      ThemeColour: "orange",
    },
    {
      Name: "The Empyrean",
      Logo: "./Faction Logos/EmpyreanFactionSymbol.png",
      ThemeColour: "purple",
    },
    {
      Name: "The Mahact Gene-Sorcerers",
      Logo: "./Faction Logos/MahactFactionSymbol.png",
      ThemeColour: "yellow",
    },
    {
      Name: "The Naaz-Rokha Alliance",
      Logo: "./Faction Logos/NaazRokhaFactionSymbol.png",
      ThemeColour: "green",
    },
    {
      Name: "The Nomad",
      Logo: "./Faction Logos/NomadFactionSheet.png",
      ThemeColour: "blue",
    },
    {
      Name: "The Titans of Ul",
      Logo: "./Faction Logos/UlFactionSymbol.png",
      ThemeColour: "pink",
    },
    {
      Name: "The Vuil'Raith Cabal",
      Logo: "./Faction Logos/CabalFactionSymbol.png",
      ThemeColour: "red",
    },
    {
      Name: "The Council Keleres",
      Logo: "./Faction Logos/Council.png",
      ThemeColour: "yellow",
    },
  ];

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
