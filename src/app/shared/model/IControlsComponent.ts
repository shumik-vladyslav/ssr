import { PlayerState } from "./player-state";
import { ControlsSkinParams } from "./ControlsSkinParams";

export interface IControlsComponent
{
  isPlaying: boolean;
  isMute: boolean;
  isFullScreen: boolean;
  volume:number;
  videoDuration:number;
  videoTime:number;
  isFavorite:boolean;
  onFavoriteClick();
  onPlayPauseClick() ;
  onMuteClick();
  onFullScreenClick()
  playerSeek(seconds: Number);
  setPausePlayBtnState(state:string);
  update(playerState:PlayerState,isFavorite:boolean)
  setSkinParams(controlsSkinParams:ControlsSkinParams)
  isUserInteracted:boolean;
  isEpgOpen:boolean;

}
