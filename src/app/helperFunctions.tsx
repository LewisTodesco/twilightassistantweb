import { useState, useEffect } from "react";

export enum ErrorType {
  None,
  NoPlayersSelected,
  MissingPlayerName,
  MissingPlayerRace,
}

export function getErrorText(error: ErrorType): string {
  switch (error) {
    case ErrorType.NoPlayersSelected: {
      return "Please select the number of players.";
    }
    case ErrorType.MissingPlayerName: {
      return "Please select a name for each player.";
    }
    case ErrorType.MissingPlayerRace: {
      return "Please select a race for each player.";
    }
    default: {
      return "Something went wrong.";
    }
  }
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
