import { ActivePlayerEnum } from "../enums/active-player-enum";
import { PlayerStatusEnum } from "../enums/player-status-enum";
import { IPlayData } from "./play-data";

export interface IPlayerState
{
  mainPlayerState:PlayerStatusEnum;
  adsMainState:PlayerStatusEnum;
  adsSecondaryState:PlayerStatusEnum;
  fullScreenF11:boolean;
  mute:boolean;
  volume:number;
  isUserInteracted:boolean;
  print():string
  activePlayer:ActivePlayerEnum;
  playData: IPlayData;
  playerControlsCommand:Object;
  caller:string;
}

export class PlayerState implements IPlayerState {
  mainPlayerState: PlayerStatusEnum;
  adsMainState: PlayerStatusEnum;
  adsSecondaryState: PlayerStatusEnum;
  activePlayer: ActivePlayerEnum;
  fullScreenF11: boolean;
  mute: boolean;
  volume: number;
  isUserInteracted:boolean;
  playData: IPlayData;
  playerControlsCommand:Object;
  caller:string;
  constructor( activePlayer:ActivePlayerEnum=undefined,mainPlayerState:PlayerStatusEnum=undefined,adsMainState:PlayerStatusEnum=undefined,
    adsSeconderyState:PlayerStatusEnum=undefined, fullScreenF11: boolean = undefined, mute: boolean =undefined, volume: number =undefined
    ,isUserInteracted:boolean=undefined, playData: IPlayData=undefined,playerControlsCommand:Object=undefined,caller:string=undefined)
  {
    this.activePlayer = activePlayer;
    this.mainPlayerState = mainPlayerState;
    this.adsMainState = adsMainState;
    this.adsSecondaryState = adsSeconderyState;
    this.fullScreenF11 = fullScreenF11;
    this.mute = mute;
    this.volume = volume;
    this.isUserInteracted=isUserInteracted;
    this.playData=playData;
    this.playerControlsCommand=playerControlsCommand;
    this.caller=caller;
  }

  print():string
  {
    return " activePlayer : "+this.activePlayer+" mainPlayerState : "+" fullScreenF11 : "+this.fullScreenF11+" mute : "+this.mute+" volume : "+this.volume;
  }

}
