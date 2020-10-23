import {Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy, AfterViewInit, Input} from '@angular/core';

// import { MovieService } from "../../movie.service";
import { PlayerState } from 'src/app/shared/model/player-state';
import { ChannelInfo } from "src/app/shared/model/channelInfo";
import { ControlsSkinParams } from 'src/app/shared/model/ControlsSkinParams';
import { MediaValueEnum } from 'src/app/shared/enums/media-value-enum';
import { PlayerStatusEnum } from 'src/app/shared/enums/player-status-enum';
import { TimeDateUtilsService } from 'src/app/shared/service/utils/time-date-utils.service';
import { IControlsComponent } from 'src/app/shared/model/IControlsComponent';
import { ChildControlEventEnum } from 'src/app/shared/enums/child-control-event-enum';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { MatSlider } from '@angular/material/slider';


@Component({
  selector: 'ctv-live-youtube-controls',
  templateUrl: './live-youtube-controls.component.html',
  styleUrls: ['./live-youtube-controls.component.scss']
})
export class LiveYoutubeControlsComponent implements OnInit, AfterViewInit ,IControlsComponent ,OnDestroy{


  @ViewChild('progressSlider', { static: false }) progressSlider: MatSlider
  @ViewChild('volumeSlider', { static: false }) volumeSlider: MatSlider;
  @ViewChild('container', { static: false }) carouselContainer;

  @Input() data;

  @Input()ffBtnActive = true;

  @Input()hasList = false;

  @Input()showProgressbar = true;

  @Input() setTime;

  @Input() duration;
  @Input() player;

  @Input() volume = 100;
  
  @Output() onChildControlsEvent = new EventEmitter<object>();

  showEpgData = false;
  isUserInteracted = false;
  controlsSkinParams: ControlsSkinParams = new ControlsSkinParams();
  isMobileView = false;
  s1:any;s2:any;s3:any;s4:any;s5:any;s6:any;s7:any;s8:any;
  private _videoDuration: number;
  private _videoTime: number;
  channelNumber: string;
  now: Date = new Date();
  currentChannel: ChannelInfo;
  currentPlayingItem: string;
  currentItemDescription: string;
  rtl: boolean;
  noMouseMove: boolean;
  isScrubbing = false;
  scrubbingTimeout = 0;
  videoDurationFormatted;
  videoTimeFormatted;
  isFavorite = false;
  @Input() isPlaying = false;
  isMute = false;
  isFullScreen = false;
  
  isPlayingAd = false;
  dir: string;
  isEpgOpen = false;
  showChannels = false;
  tvView: boolean;
  endAt : number;


  /*
  set volume(vol:number)
  {
    this.volume=vol;
    //this.volumeSlider.value=vol;
  }
  get volume()
  {
    return this.volume;
  }*/

  intervalArr: any = [];

  constructor(
    private _timeDateUtilsService: TimeDateUtilsService,
    // private _movieService: MovieService,
    private _appService:GeneralAppService,
    // private _epgService:ChannelEpgService
    ) {

    this.dir = this._appService.assetDir;

    let interval1 = setInterval(() => {
      this.now = new Date();
    }, 30000);

    this.intervalArr.push(interval1);

    let interval2 = setInterval(() => {
      
      if(this.player && this.player.getCurrentTime ){
        let time = this.player.getCurrentTime();
        console.log(this.videoDurationFormatted);
        this.videoTimeFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(time);
        this.videoTime = (time / this.duration) * 10000;

        if(!this.videoDurationFormatted) {
          this.videoDurationFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(this.duration)
        }
      }
    }, 1000)
    this.intervalArr.push(interval2);

    this.tvView = this._appService.isAndroidTV;


///111
    // this.s2 = this._movieService.currentChannelInfo.subscribe(channelInfo => {
    //   if (!channelInfo.channel) return ;

    //   this.currentChannel = channelInfo;
    //   this.channelNumber = channelInfo.channel.channelNumber.toString();
    // }),(error: any) => console.error(error);
///22
    // this.s3 = this._appService.adIsPlaying.subscribe(val => {
    //   this.isPlayingAd = val;
    // });
///444
    // this.s4 = this._epgService.epgSource.subscribe(epg => {
    //   if(!this.isMobileView){
    //     this.showEpgData = !this._epgService.isEpgEmpty(epg)
    //   }
    // })
  }


  ngOnInit() {

  }

  ngOnChanges() {
    if(this.setTime){
      this.videoTimeFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(this.setTime);
      this.videoTime = (this.setTime / this.duration) * 10000;
    }
    if (this.duration) {
      this.videoDurationFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(this.duration)
    }
   
  }


  ngAfterViewInit() {

    // this.s1 = this._movieService.noMouseMove.subscribe(state => {
    //   // this.noMouseMove = state;
    //   setTimeout(() =>{
    //     this.noMouseMove = state;
    //   },10)

    // });

    this.s5 = this.progressSlider.change.subscribe(obj => {
      this.isScrubbing = true;
      this.scrubbingTimeout = 5;
      let newTime: number = obj.value/10000 * this.videoDuration;
      this.videoTime = newTime;
      this.playerSeek(newTime);
      // console.log(`=========== newTime : ${newTime} ========`)
    }),(error: any) => {console.error(error);};
111
    // this.s6 = this._movieService.movieDataSubject.subscribe(movieData => {

    //   if (!movieData) {
    //     return ;
    //   }

    //   this.currentPlayingItem = movieData.title;
    //   this.currentItemDescription = movieData.desc;
    //   // console.log(`movieData`)
    //   // console.log(movieData)
    //   // this.endAt = parseInt(movieData.endAt) - 12;
    //   this.endAt = +movieData.endAt - 12;
    //   // this.setTextDirection();
    //   this._appService.appWinSize.subscribe(win => {
    //     if (win.mediaState == MediaValueEnum.SMALL_WIDTH_BREAKPOINT ) {
    //       this.isMobileView = true;
    //     } else {
    //       this.isMobileView = false;
    //     }
    //   })
    // })

    this.s7=this.volumeSlider.input.subscribe(obj => {
      
      this.onChildControlsEvent.next({ action: "volumeSliderChanged", val: obj.value })
    }),(error: any) => {console.error(error);};
//333
    // this.s8 = this._channelService.showBackgroundLayerComponent.subscribe(val => {
    //   this.showChannels = val;
    // });
  }

  setTextDirection(): void {
    this.rtl = !!this.currentPlayingItem[0].match(/^[\u0590-\u05fe]+$/g);
  }

  setPausePlayBtnState(state: string) {
    throw new Error("Method not implemented.");
  }

  onInputChange(event) {
    console.log("This is emitted as the thumb slides");
    console.log(event.value);
    let secsToAdd = ((event.value/ 10000) * this.duration) ;
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.playerSetSeconds, val: secsToAdd });
    this.videoTimeFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(secsToAdd);

  }
  

  get videoTime(): number {
    return this._videoTime;
  }

  set videoTime(time:number) {

    if (isNaN(time)) time = 0;
    if (this.isScrubbing) {
      this.scrubbingTimeout--

      if (this.scrubbingTimeout <= 0)
      {
        this.isScrubbing = false;
      }
    } else {
      this._videoTime = time;
      // this.videoTimeFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(this._videoTime);
      this.progressSlider.value = (this._videoTime / this._videoDuration) * 10000;

      // this.endAt = this._videoDuration - 11;
      if (this._videoTime > 0 && this.endAt > 0 ) {
        // console.log(`======= _videoTime : (${this._videoTime})Sec. endAt: (${this.endAt}) ===> _videoDuration: (${this._videoDuration})Sec. ============== `);

        if (this._videoTime > this.endAt ){

          console.log(`======= _videoTime : (${this._videoTime})Sec. endAt: (${this.endAt}) ===> _videoDuration: (${this._videoDuration})Sec. ============== `);
          console.log(`=======  FIN! END MOVIE !!!============== `);
          this.playerSeek(this._videoDuration);
        }
      }
    }
  }

  get videoDuration(): number {
    return this._videoDuration;
  }

  set videoDuration(duration) {
    if (isNaN(duration)) duration = 0;
    this._videoDuration = duration;
    this.videoDurationFormatted = this._timeDateUtilsService.convertSecondsToTimeWithSeconds(this._videoDuration)
    // console.log(`======= videoDurationFormatted : ${this.videoDurationFormatted} (${this._videoDuration})Sec.  ============== `)
  }

  onInfoClick()
  {
    if (!this.showEpgData) {
      return ;
    }
    //this.isEpgOpen=!this.isEpgOpen;
    this.onChildControlsEvent.next({ action:ChildControlEventEnum.openCloseInfo, val: this.isFavorite });
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.forceFullScreen});
    // this._movieService.freezeToolbars = this.isEpgOpen;

  }

  onFavoriteClick() {
    this.isFavorite = !this.isFavorite;
    this.onChildControlsEvent.next({ action:ChildControlEventEnum.setFavorite, val: this.isFavorite });
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.forceFullScreen})
  }

  onPlayPauseClick() {
    this.isPlaying = !this.isPlaying;
    this.onChildControlsEvent.next({ action:ChildControlEventEnum.onPlayPauseClicked , val: !this.isPlaying });
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.forceFullScreen})
  }

  onMuteClick() {
    this.isMute = !this.isMute;
    this.onChildControlsEvent.next({ action:ChildControlEventEnum.onMuteClicked, val: !this.isMute });
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.forceFullScreen})
  }

  onFullScreenClick() {
    this.isFullScreen = !this.isFullScreen
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.onFullScreenClicked, val: this.isFullScreen });
  }

  playerSeekAddSeconds(secsToAdd:number) {

    this.onChildControlsEvent.next({ action: ChildControlEventEnum.forceFullScreen});

    // if ((this.controlsSkinParams.rwBtnActive && secsToAdd < 0) || (this.controlsSkinParams.ffBtnActive && secsToAdd > 0) )
      this.onChildControlsEvent.next({ action: ChildControlEventEnum.playerSeekAddSeconds, val: secsToAdd });


  }

  playerSeek(seconds: Number) {
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.forceFullScreen});
    this.onChildControlsEvent.next({ action:ChildControlEventEnum.playerSeek, val: seconds });
  }

  prevProgram() {
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.prevProgram});
    if (this.controlsSkinParams.toStartBtnActive==true)
      this.onChildControlsEvent.next({ action: ChildControlEventEnum.prevProgram });

  }

  nextProgram() {
    this.onChildControlsEvent.next({ action: ChildControlEventEnum.nextProgram});
    if (this.controlsSkinParams.toEndBtnActive == true)
      this.onChildControlsEvent.next({ action: "nextProgram" });

  }

  update(playerState: PlayerState,isFavorite:boolean)
  {

    if (playerState.mainPlayerState==PlayerStatusEnum.play)
    {
      this.isPlaying = true;
    }
    else
    {
      this.isPlaying = false;
    }

    this.isFullScreen = playerState.fullScreenF11;

    if (playerState.isUserInteracted)
    {
      this.isMute = playerState.mute;
      if ( this.isMute)
      {
        this.volume = 0;
      }
      else
      {
        this.volume = playerState.volume*10000;
      }
    }
    else
    {
      this.isMute =true;
      this.volume =0;
    }
    this.isFavorite = isFavorite;
  }

  setSkinParams(controlsSkinParams: ControlsSkinParams)
  {
    this.controlsSkinParams=controlsSkinParams
  }

  // goBack() {
  //   // this._movieService.showMoviePreviewSource.next(false);
  //   this._appService.fullScreenStatus.next(false);
  // }

  ngOnDestroy(): void
  {
    this.clearAllInderval();
    // this.s1.unsubscribe();
    // this.s2.unsubscribe();
    // this.s3.unsubscribe();
    // this.s4.unsubscribe();
    // this.s5.unsubscribe();
    // this.s6.unsubscribe();
    // this.s7.unsubscribe();
    // this.s8.unsubscribe();
  }

  clearAllInderval(){
    this.intervalArr.forEach(element => {
      clearInterval(element)
    });
  }

}
