import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../shared/service/player.service';
import { ChildControlEventEnum } from '../shared/enums/child-control-event-enum';
import { GeneralAppService } from '../shared/service/general.service';
import { ListService } from '../shared/service/list.service';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

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

  videoURL: string = "https://www.youtube.com/watch?v=Zyg0t_hfBD4&ab_channel=ACETVONDO&output=embed"
  constructor(
    private _sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService,
    public generalAppService: GeneralAppService,
    private listService: ListService,
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
  }

  ngOnDestroy(): void {
    if (this.liveId && !this.movie) {
      this.liveId = null;
      videojs("my_video_1").dispose();
    }
    this.generalAppService.generalParamsLoaded.next(false);
  }

  ngOnInit(): void {


    document.getElementById("main-wrap").addEventListener('click', () => {
      console.log('asdas');
    })
    let event = new Event("click");
    document.getElementById("main-wrap").dispatchEvent(event);
    document.getElementById("main-wrap").click();


    setTimeout(() => {
      console.log(this.generalAppService.noMouseMove.getValue());

      // document.addEventListener("DOMContentLoaded", (ready) => {
      //   console.log(ready);
      // })
      
      if (!this.generalAppService.noMouseMove.getValue()) {
        this.isFullScreen = !this.isFullScreen;
        console.log(document.getElementById("main-wrap"));
        let elem: any = document.getElementById("main-wrap");

        // if (!document.fullscreenElement) {
        //   elem.requestFullscreen().catch(err => {
        //     alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        //   });
        // } else {
        // }

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
        this.generalAppService.fullScreenStatus.next(this.isFullScreen);
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
      if (this.id && this.movie) {
        this.getVideoById();
      } else if (!this.movie) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('id', this.liveId)
        }

        this.listService.getChannelDetails(this.liveId).subscribe((channel: any) => {
          console.log(channel);
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

              console.log(this.isFullScreen, 'full screen change')
              this.generalAppService.fullScreenStatus.next(this.isFullScreen);
            });

            player.autoplay(true);

            setTimeout(() => {
              player.muted(false)
            }, 500);

            player.ready((e) => {
              this.generalAppService.generalParamsLoaded.next(false);

              let volume = +localStorage.getItem('volume')
              if (volume && typeof volume === 'number') {
                player.volume(volume / 100);
                this.volume = volume;
              }

              this.cdRef.detectChanges();
            });

          }, 2000);
        });
        // this.setYoutube(this.youtubeTag);
      }
    });
  }

  getVideoById() {
    let userTimeOffset = moment().parseZone().utcOffset();
    let now = moment().format('YYYY-MM-DD');
    console.log(userTimeOffset);
    console.log(now);

    this.playerService.generateChannelMovie({ channelID: +this.id, movid: this.movie, userTimeOffset: userTimeOffset.toString(), now: now }).subscribe(res => {
      console.log(res);
    });

    this.playerService.getVideoById(this.movie).subscribe((data: any) => {
      console.log(data);
      this.data = data;
      this.data['videoIddForHeader'] = this.movie;
      this.playerService.dataChangeEventEmiter.emit(this.data);



      this.setYoutube(this.data.movId);
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
          iv_load_policy: 3,
          rel: 0,
          autohide: 1,
        },
        events: {
          'onReady': this.onPlayerReady.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });

    }, 1000);
  }

  // 4. The API will call this function when the video player is ready.
  onPlayerReady(event) {
    console.log(event, 223232323);
    // event.target.mute();
    this.generalAppService.generalParamsLoaded.next(false);
    this.cdRef.detectChanges();

    event.target.playVideo();

    let volume = +localStorage.getItem('volume')
    if (volume && typeof volume === 'number') {
      this.player.setVolume(volume);
      this.volume = volume;
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
      this.duration = this.player.getDuration();
    }, 100);
  }

  vidEnded() {
    console.log('vidEnded');
  }

  done = false;
  onPlayerStateChange(event) {
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        console.log(1);
        this.isPlaying = true;
        break;
      case YT.PlayerState.PAUSED:
        console.log(2);
        this.isPlaying = false;

        break;
      default:
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
        var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
        if (requestFullScreen && !this.isFullScreen) {
          iframe.requestFullscreen();
          // requestFullScreen.bind(iframe)();
          // this.isFullScreen = true;
        } else {
          // this.isFullScreen = false;
          document.exitFullscreen();
        }

        let isClicked = this.isFullScreen;

        iframe.onfullscreenchange = () => {
          this.isFullScreen = !this.isFullScreen;

          console.log(this.isFullScreen, 'full screen change')
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
    }
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
