export interface PlayerContainer {
  [key: string]: Player[];
}
export interface Player {
  name: string;
  position: string;
  attackRating: number;
  defenceRating: number;
  conditionRating: number;
  totalScore: number;
}
