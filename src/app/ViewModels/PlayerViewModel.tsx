import RaceViewModel from "./RaceViewModel";

interface PlayerViewModel {
  Id: number;
  Name: string;
  Race: RaceViewModel;
  Initiative: number;
}

export default PlayerViewModel;
