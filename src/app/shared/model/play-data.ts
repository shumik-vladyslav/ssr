import { PlayerTypeEnum } from "../enums/player-type-enum";

export interface IPlayData
{
  url: string;
  playerType: PlayerTypeEnum;
  seekTo: number;
  size: string;
  vodType: string;
  preload:boolean;
  id:number;

}

