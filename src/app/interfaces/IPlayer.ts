import { Positions } from '../enums/positions.enum';

export interface Player {
  name: string;
  position: string;
  attackRating: number;
  defenceRating: number;
  conditionRating: number;
  totalScore: number;
}
