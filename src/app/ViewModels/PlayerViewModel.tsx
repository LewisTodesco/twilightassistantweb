import RaceViewModel from "./RaceViewModel";

interface PlayerViewModel {
  Id: number;
  Name: string;
  Race: RaceViewModel;
  Initiative: number;
  StrategyUsed: boolean;
  Passed: boolean;
  NextAction: Action;
}

export enum Action {
  Reset,
  UseStrategy,
  Pass,
}

export default PlayerViewModel;
