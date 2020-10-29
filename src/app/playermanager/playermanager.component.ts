import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/service/player.service';
import { ChildControlEventEnum } from '../shared/enums/child-control-event-enum';
import { GeneralAppService } from '../shared/service/general.service';
import { ListService } from '../shared/service/list.service';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { MovieTypeEnum } from '../shared/enums/movie-type-enum';

declare var videojs;

@Component({
  selector: 'app-playermanager',
  templateUrl: './playermanager.component.html',
  styleUrls: ['./playermanager.component.scss']
})
export class PlayermanagerComponent implements OnInit, OnDestroy {
  safeURL;

  id;
  liveId;
  movie;

  liveUrl;

  data;
  liveData;

  player;
  livePlayer;

  youtubeTag;
  playerTime = 0;
  duration = 0;

  isPlaying = false;
  isPlayingLive = false;

  volume = 100;

  videoURL: string = "https://www.youtube.com/watch?v=Zyg0t_hfBD4&ab_channel=ACETVONDO&output=embed";

  isDestroyed;
  isMoved;

  movieList;
  selectedYtVideo;

  isInit = true;

  isYtLive = false;
  fromStart = false;

  constructor(
    private _sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService,
    public generalAppService: GeneralAppService,
    private listService: ListService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  @HostListener('mousemove') onMouseMove() {
    clearTimeout(this.generalAppService.timeout);
    this.generalAppService.mouseMoveTrigger();
    this.isMoved = true;
  }
  @HostListener('click') onMouseClick() {
    clearTimeout(this.generalAppService.timeout);
    this.generalAppService.mouseMoveTrigger();
    this.isMoved = true;
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.liveId && !this.movie && !this.isYtLive) {
      this.liveId = null;
      videojs("my_video_1").dispose();
    }

    clearTimeout(this.generalAppService.timeout);
    this.generalAppService.fullScreenStatus.next(false);

    this.generalAppService.generalParamsLoaded.next(false);
  }

  ngOnInit(): void {

    setTimeout(() => {
      if (!this.isDestroyed) {
        let elem: any = document.getElementById("main-wrap");
        this.isFullScreen = !this.isFullScreen;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(err => {
          });
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen().catch(err => {
          });
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen().catch(err => {
          });
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen().catch(err => {
          })
        }
        elem.onfullscreenchange = () => {
          this.isFullScreen = !this.isFullScreen;
          if (!this.isDestroyed)
            this.generalAppService.fullScreenStatus.next(this.isFullScreen);
        };


      }
    }, 5000);

    setTimeout(() => {
      this.generalAppService.generalParamsLoaded.next(true);
    }, 0);

    this.cdRef.detectChanges();

    this.liveId = null;

    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.id = params['id'];
      this.liveId = params['id'];
      this.movie = params['movie'];
      this.fromStart = Boolean(params['fromStart']);
      console.log(this.fromStart);


      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('id', params['id']);
        if (params['movie']) {
          localStorage.setItem('movie', params['movie']);
        } else {
          localStorage.removeItem('movie');
        }
      }


      // this.youtubeTag = params["youtubeTag"];
      console.log(this.id);
      if (this.movie) {
        this.getVideoById();
      } else if (!this.movie) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('id', this.liveId)
        }

        this.listService.getChannelDetails(this.liveId).subscribe((channel: any) => {
          console.log(channel);

          switch (channel.SourceType) {
            case MovieTypeEnum.YouTube_Live:
              console.log(channel);
              this.data = channel;
              // this.data['videoIddForHeader'] = this.movie;
              this.playerService.dataChangeEventEmiter.emit(this.data);
              this.setYoutube(channel.Link_PC);
              this.isYtLive = true;

              break;
            default:

              this.liveUrl = channel.Link_PC;

              this.liveData = channel;
              this.liveData['channelNum'] = channel['ChannelNumber'];

              this.playerService.dataChangeEventEmiter.emit(this.liveData);

              setTimeout(() => {

                var player = videojs('my_video_1');
                this.livePlayer = player;


                player.on('play', () => {
                  this.isPlayingLive = true;
                });
                player.on('pause', () => {
                  this.isPlayingLive = false;
                });

                player.on('fullscreenchange', (e) => {
                  this.isFullScreen = !this.isFullScreen;
                  console.clear();
                  console.log(this.isFullScreen, 'full screen change')

                  if (!this.isDestroyed)
                    this.generalAppService.fullScreenStatus.next(this.isFullScreen);
                });

                player.autoplay(true);

                setTimeout(() => {
                  player.muted(false)
                }, 500);

                player.ready((e) => {
                  player.volume(0 / 100);
                  setTimeout(() => {
                    this.generalAppService.generalParamsLoaded.next(false);
                    let volume = +localStorage.getItem('volume');
                    if (volume && typeof volume === 'number') {
                      player.volume(volume / 100);
                      this.volume = volume;
                    }
                  }, 1500);

                  this.cdRef.detectChanges();
                });

              }, 2000);

              break;
          }

        });
        // this.setYoutube(this.youtubeTag);
      }
    });
  }

  getVideoById() {
    console.log('playerService.getVideoById');

    this.playerService.getVideoById(this.movie).subscribe((data: any) => {
      console.log(data, 'getVideoById(this.movie)');

      if ((!this.id || this.id === 'undefined') && data.channelId) {
        this.id = +data.channelId;
        console.log(this.id);

        localStorage.setItem('id', this.id)
      }
      this.data = data;
      this.data['videoIddForHeader'] = this.movie;
      this.playerService.dataChangeEventEmiter.emit(this.data);

      switch (data.sourceType) {
        case MovieTypeEnum.VOD_Folder:
          this.setYoutube(this.data.ratesData.serversList[0]);
          break;
        case MovieTypeEnum.YouTube_Video:
          this.setYoutube(this.data.movId);
          break;
      }
    })
  }

  setYoutube(videoId) {
    console.log(videoId);

    setTimeout(() => {

      this.player = new YT.Player('player', {
        height: '260',
        width: '540',
        videoId: videoId,
        playerVars: {
          controls: 0,
          showinfo: 0,
          autoplay: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          autohide: 1,
          iv_load_policy: 3,
        },
        events: {
          'onReady': this.onPlayerReady.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });

    }, 1000);
  }

  onPlayerError(event) {
    console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%youtube onPlayerError");
    console.log(event);
    this.goToProgram(false);
    switch (event.data) {
      case 2:
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };

  // 4. The API will call this function when the video player is ready.
  onPlayerReady(event) {
    console.log(event, 223232323);
    // event.target.mute();
    this.cdRef.detectChanges();

    event.target.playVideo();

    let volume = +localStorage.getItem('volume')
    if (volume && typeof volume === 'number') {
      this.player.setVolume(volume);
      this.volume = volume;
    }

    if (!this.isYtLive) {
      // let userTimeOffset = moment().parseZone().utcOffset();
      let userTimeOffset = new Date().getTimezoneOffset();
      let now = moment().format('YYYY-MM-DD');
      let now2 = moment().format('DD/MM/YYYY');

      console.log(this.fromStart);

      if (this.isInit && !this.fromStart) {
        console.log('this.isInit && this.fromStartthis.isInit && this.fromStartthis.isInit && this.fromStartthis.isInit && this.fromStartthis.isInit && this.fromStartthis.isInit && this.fromStart');

        this.playerService.generateChannelMovie({ channelID: +this.id, movid: this.movie, userTimeOffset: userTimeOffset.toString(), now: now }).subscribe((res: any) => {
          console.log(res);

          let a = moment();
          let b = res[0] ? moment(res[0].startTime, 'DD/MM/YYYY hh:mm:ss') : moment(res.startTime, 'DD/MM/YYYY hh:mm:ss');

          console.log(a);
          console.log(b);

          console.log(a.diff(b, 'seconds'));

          this.playerSeekAddSeconds(a.diff(b, 'seconds'));
          this.isInit = false;

        });
      } else {
        this.player.seekTo(0);
        this.playerTime = 0;
      }
      console.log(this.id, 'this.id');

      this.playerService.getMinifiedChannelDayEpg({ channelID: +this.id, userTimeOffset: userTimeOffset.toString(), epgDate: now2 }).subscribe((res: any) => {

        console.log(res);
        this.movieList = [];
        this.movieList = res;

        res.forEach((element, index) => {
          if (+element.MovID === +this.movie) {
            this.selectedYtVideo = element;
            this.selectedYtVideo['index'] = index;
          }
        });
        if (!this.selectedYtVideo) {
          this.selectedYtVideo = res[0];
          this.selectedYtVideo['index'] = 0;
        }

      });
    }

    setTimeout(() => {
      // event.target.unMute();
      event.target.playVideo();
    }, 2000);

    setTimeout(() => {
      switch (this.player.getPlayerState()) {
        case -1:
          this.isPlaying = false;
          break;
        case 1:
          this.isPlaying = true;
          break;
        case 2:
          this.isPlaying = false;
          break;
        default:
          this.isPlaying = false;
          break;
      }
      console.log('asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
      this.duration = this.player.getDuration();
      console.log(this.duration);
      console.log(this.player.getDuration());

    }, 1000);
  }

  vidEnded() {
    console.log('vidEnded');
  }

  done = false;
  onPlayerStateChange(event) {
    setTimeout(() => {
      this.generalAppService.generalParamsLoaded.next(false);
    }, 500);

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log(1);
        this.isPlaying = true;
        break;
      case YT.PlayerState.PAUSED:
        console.log(2);
        this.isPlaying = false;
        break;
      case YT.PlayerState.ENDED:
        this.goToProgram(false);
        break;
    }
  }

  stopVideo() {
    this.player.stopVideo();
  }
  isFullScreen;
  onChildControls(event) {
    console.log(event);

    switch (event.action) {
      case ChildControlEventEnum.setFavorite:
        // this._channelsService.updateChannelFavorite(event.val);
        break;
      case ChildControlEventEnum.onPlayPauseClicked:
        if (event.val == true) {
          this.pause();
        }
        else {
          this.resume();
        }
        break;
      case ChildControlEventEnum.playerSeekAddSeconds:
        this.playerSeekAddSeconds(event.val);
        break;
      case ChildControlEventEnum.onMuteClicked:

        if (this.player) {
          if (!this.player.isMuted()) {
            this.player.mute();
          }
          else {
            this.player.unMute();
          }
        } else if (this.livePlayer) {
          if (!this.livePlayer.muted()) {
            this.livePlayer.muted(true);
          }
          else {
            this.livePlayer.muted(false);
          }
        }
        break;
      case ChildControlEventEnum.onFullScreenClicked:

        let iframe: any = document.getElementById("main-wrap");
        console.log(iframe);

        var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
        if (requestFullScreen && !this.isFullScreen) {
          iframe.requestFullscreen();
          // requestFullScreen.bind(iframe)();
          // this.isFullScreen = true;
        } else {
          // this.isFullScreen = false;
          document.exitFullscreen();
        }

        iframe.onfullscreenchange = () => {
          this.isFullScreen = !this.isFullScreen;

          console.log(this.isFullScreen, 'full screen change')
          if (!this.isDestroyed)
            this.generalAppService.fullScreenStatus.next(this.isFullScreen);
        };

        break;
      case ChildControlEventEnum.volumeSliderChanged:
        console.log(event);

        if (this.player) {
          this.player.setVolume(event.val);
        } else if (this.livePlayer) {
          this.livePlayer.volume(event.val / 100);
        }

        localStorage.setItem('volume', event.val);

        break;
      case ChildControlEventEnum.playerSetSeconds:
        this.player.seekTo(event.val);
        break;

      case ChildControlEventEnum.prevProgram:
        this.goToProgram(true);
        break;

      case ChildControlEventEnum.nextProgram:
        this.goToProgram(false);
        break;
    }
  }

  goToProgram(isPrev) {
    let index;

    console.log(index);
    console.log(this.movieList);
    console.log(this.movieList);
    console.log(this.selectedYtVideo);

    this.movieList.forEach((element, i) => {

      if (+this.selectedYtVideo.MovID === +element.MovID) {
        this.selectedYtVideo['index'] = index;
        index = +i;
        console.log(index);
      }
    });
    console.log(index);


    if (isPrev) {

      if (index === 0) {
        console.log(11111111111111111);

        this.selectedYtVideo = this.movieList[this.movieList.length - 1];
      } else {
        console.log(2222222222222222222);
        this.selectedYtVideo = this.movieList[index - 1];
      }
    } else {

      if (index === this.movieList.length - 1) {
        console.log(3333333333333333333);
        this.selectedYtVideo = this.movieList[0];
      } else {
        console.log(444444444444444444444444);
        this.selectedYtVideo = this.movieList[index + 1];
      }
    }

    this.player.stopVideo();
    this.player.destroy();
    this.playerTime = 0;
    this.duration = 0;

    console.log(this.selectedYtVideo);

    this.movie = this.selectedYtVideo.MovID;

    setTimeout(() => {
      this.generalAppService.generalParamsLoaded.next(true);
      this.router.navigate(["player", { id: this.id, movie: this.selectedYtVideo.MovID }]);
    }, 1000);
    // this.getVideoById();
    console.log(this.selectedYtVideo);

  }

  playerSeekAddSeconds(secsToAdd: number) {
    console.log(secsToAdd);
    let time = this.player.getCurrentTime() + secsToAdd;
    this.player.seekTo(time);
    this.playerTime = time;
  }

  resume() {
    if (this.player) {
      this.player.playVideo();
    } else if (this.livePlayer) {
      this.livePlayer.play();
    }
  }

  pause() {
    if (this.player) {
      this.player.pauseVideo();
    } else if (this.livePlayer) {
      this.livePlayer.pause();
    }
  }


}
