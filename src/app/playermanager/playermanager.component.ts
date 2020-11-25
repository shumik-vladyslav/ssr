import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../shared/service/player.service';
import { ChildControlEventEnum } from '../shared/enums/child-control-event-enum';
import { GeneralAppService } from '../shared/service/general.service';
import { ListService } from '../shared/service/list.service';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { MovieTypeEnum } from '../shared/enums/movie-type-enum';

declare var videojs;
declare var WowzaPlayer;

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
  vodPlayer;

  youtubeTag;
  playerTime = 0;
  duration = 0;

  isPlaying = false;
  isPlayingLive = false;

  volume = 100;

  videoURL: string = "https://www.youtube.com/watch?v=Zyg0t_hfBD4&ab_channel=ACETVONDO&output=embed";

  isDestroyed = false;
  isMoved;

  movieList;
  selectedYtVideo;

  isInit = true;

  isYtLive = false;
  fromStart = false;
  backToList = false;

  isMute = false;
  isVodPlayer = false;
  isMov = false;

  durationInterval: any;

  param;

  constructor(
    private _sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService,
    public generalAppService: GeneralAppService,
    private listService: ListService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private _meta: Meta,
    private _title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      this.param = data;
      this.updateSEO(this.liveData || this.data);
    });
    this.param = this.generalAppService.param;

    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    var tag = document.createElement('script');
    console.log(tag);

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

    if (this.vodPlayer) {
      this.vodPlayer.destroy();
    }

    clearTimeout(this.generalAppService.timeout);

    this.generalAppService.generalParamsLoaded.next(false);

    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }

  }

  fullScreenOnInit() {
    if (this.generalAppService.fullScreenStatus.getValue()) {
      this.playerService.isFullScreen = true;
    }

    setTimeout(() => {
      if (!this.isDestroyed && !this.playerService.isFullScreen && isPlatformBrowser(this.platformId)) {
        let elem: any = document.getElementById("main-wrap");
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(err => {
            this.fullScreenOnInit();
          });
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen().catch(err => {
            this.fullScreenOnInit();
          });
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen().catch(err => {
            this.fullScreenOnInit();
          });
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen().catch(err => {
            this.fullScreenOnInit();
          })
        }

      }
    }, 3000);
  }

  ngOnInit(): void {

    this.fullScreenOnInit();

    setTimeout(() => {
      this.generalAppService.generalParamsLoaded.next(true);
    }, 0);

    this.cdRef.detectChanges();

    this.liveId = null;

    this.activatedRoute.params.subscribe(params => {

      if (!this.isInit && this.id !== params['id'] && isPlatformBrowser(this.platformId)) {
        window.location.reload();
      }
      this.id = params['id'];
      this.liveId = params['id'];
      this.movie = params['movie'];
      this.fromStart = Boolean(params['fromStart']);
      this.backToList = Boolean(params['backToList']);
      this.isMov = Boolean(params['backToList']);

      if (this.id) {
        if (isPlatformBrowser(this.platformId)) {
          let lastViewed = JSON.parse(localStorage.getItem('lastViewed'))

          if (lastViewed?.expires !== moment().format('DD/MM/YYYY')) {
            lastViewed = {};
            lastViewed.value = {};
            lastViewed.expires = moment().format('DD/MM/YYYY');
          };

          if (!lastViewed?.value[this.id]) {
            if (!lastViewed) {
              lastViewed = {};
              lastViewed.value = {}
            }
            lastViewed.value[this.id] = this.id;
          }

          localStorage.setItem('lastViewed', JSON.stringify(lastViewed));
        }
      }

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('id', params['id']);
        if (params['movie']) {
          localStorage.setItem('movie', params['movie']);
        } else {
          localStorage.removeItem('movie');
        }
      }


      // this.youtubeTag = params["youtubeTag"];
      if (this.movie) {
        this.getVideoById();
      } else if (!this.movie) {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('id', this.liveId)
        }

        this.listService.getChannelDetails(this.liveId).subscribe((channel: any) => {

          this.updateSEO(channel);

          switch (channel.SourceType) {
            case MovieTypeEnum.YouTube_Live:
              this.data = channel;
              this.data['isMov'] = this.isMov;
              // this.data['videoIddForHeader'] = this.movie;
              this.playerService.dataChangeEventEmiter.emit(this.data);
              this.setYoutube(channel.Link_PC);
              this.isYtLive = true;

              break;
            default:

              this.liveUrl = channel.Link_PC;

              this.liveData = channel;
              this.liveData['channelNum'] = channel['ChannelNumber'];
              this.liveData['isMov'] = this.isMov;

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
                  this.playerService.isFullScreen = !this.playerService.isFullScreen;

                  if (!this.isDestroyed)
                    this.generalAppService.fullScreenStatus.next(this.playerService.isFullScreen);
                });

                player.autoplay(true);


                setTimeout(() => {
                  player.muted(false)
                  this.mudedStorage();
                }, 500);
                player.ready((e) => {
                  // player.volume(0 / 100);
                  setTimeout(() => {
                    this.livePlayer.play();
                    this.generalAppService.generalParamsLoaded.next(false);
                    let volume = +localStorage.getItem('volume');
                    if (volume && typeof volume === 'number') {
                      player.volume(volume / 100);
                      this.volume = volume;
                    };

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
    console.log(this.movie);

    this.playerService.getVideoById(this.movie).subscribe((data: any) => {
      console.log(data);
      
      this.updateSEO(data);

      if ((!this.id || this.id === 'undefined') && data.channelId) {
        this.id = +data.channelId;

        if (isPlatformBrowser(this.platformId)) {
          let lastViewed = JSON.parse(localStorage.getItem('lastViewed'))

          if (lastViewed?.expires !== moment().format('DD/MM/YYYY')) {
            lastViewed = {};
            lastViewed.value = {};
            lastViewed.expires = moment().format('DD/MM/YYYY');
          };

          if (!lastViewed?.value[this.id]) {
            if (!lastViewed) {
              lastViewed = {};
              lastViewed.value = {}
            }
            lastViewed.value[this.id] = this.id;
          }
          lastViewed['expires'] = moment().format('DD/MM/YYYY');
          localStorage.setItem('lastViewed', JSON.stringify(lastViewed));
          localStorage.setItem('id', this.id)
        }
      }
      console.log(data);

      this.data = data;
      this.data['videoIddForHeader'] = this.movie;
      this.data['isMov'] = this.isMov;

      this.playerService.dataChangeEventEmiter.emit(this.data);

      switch (data.sourceType) {
        case MovieTypeEnum.VOD_Folder:
          this.setVodPlayer(this.data.ratesData.serversList[0]);
          break;
        case MovieTypeEnum.YouTube_Video:
          this.setYoutube(this.data.movId);
          break;
      }
    })
  }
  setVodPlayer(sourceURL) {
    setTimeout(() => {
      this.vodPlayer = WowzaPlayer.create("player",
        {
          "license": "PLAY1-d3xyQ-ucNFT-p9af4-6GQ7v-hVYZN",
          "sources": [{
            "sourceURL": sourceURL
          },
          {
            "sourceURL": ""
          }],
          "title": "",
          "description": "",
          "autoPlay": true,
          "mute": false,
          "volume": 75
        }
      );
      this.isVodPlayer = true;
      setTimeout(() => {
        this.vodPlayer.onReady(this.onVodIsReady());
        this.vodPlayer.onPause(this.pauseListener);
        this.vodPlayer.onResume(this.resumeListener);
      }, 500);
    }, 500);
  }

  onVodIsReady() {
    this.mudedStorage();

    this.durationInterval = setInterval(() => {
      if (!this.duration) {
        this.duration = this.vodPlayer.getDuration() / 1000;
      } else {
        clearInterval(this.durationInterval)
      }
    }, 1000);

    let interval = setInterval(() => {
      if (this.vodPlayer.getCurrentState() === WowzaPlayer.State.PLAYING) {
        this.isPlaying = true;
        clearInterval(interval)
      }
    }, 1000);

    setTimeout(() => {
      this.generalAppService.generalParamsLoaded.next(false);
    }, 1000);

    if (this.vodPlayer.getCurrentState() == WowzaPlayer.State.PLAYING) {
      this.isPlaying = true;
    }

    if (isPlatformBrowser(this.platformId)) {
      let volume = +localStorage.getItem('volume')

      if (volume && typeof volume === 'number') {
        this.vodPlayer.setVolume(volume);
        this.volume = volume;
      }
    }
  }

  pauseListener = (pauseEvent) => {
    this.isPlaying = false;
  };
  resumeListener = (resumeEvent) => {
    this.isPlaying = true;
  };
  playListener = (playEvent) => {
    this.isPlaying = true;
  };

  setYoutube(videoId) {
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
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this)
        }
      });

    }, 1000);
  }

  onPlayerError(event) {
    console.error("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%youtube onPlayerError");
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

    // this.player.else
    // event.target.mute();
    this.cdRef.detectChanges();

    event.target.playVideo();
    if (isPlatformBrowser(this.platformId)) {
      let volume = +localStorage.getItem('volume')

      if (volume && typeof volume === 'number') {
        this.player.setVolume(volume);
        this.volume = volume;
      }
    }

    this.mudedStorage();

    if (!this.isYtLive) {
      let userTimeOffset = new Date().getTimezoneOffset();
      let now = moment().format('YYYY-MM-DD');
      let now2 = moment().format('DD/MM/YYYY');

      if (this.isInit && !this.fromStart) {
        this.playerService.generateChannelMovie({ channelID: +this.id, movid: this.movie, userTimeOffset: userTimeOffset.toString(), now: now }).subscribe((res: any) => {
          let a = moment();
          let b = res[0] ? moment(res[0].startTime, 'DD/MM/YYYY hh:mm:ss') : moment(res.startTime, 'DD/MM/YYYY hh:mm:ss');

          this.playerSeekAddSeconds(a.diff(b, 'seconds'));
          this.isInit = false;

        });
      } else {
        this.player.seekTo(0);
        this.playerTime = 0;
      }
      this.playerService.getMinifiedChannelDayEpg({ channelID: +this.id, userTimeOffset: userTimeOffset.toString(), epgDate: now2 }).subscribe((res: any) => {

        this.movieList = [];
        this.movieList = res;

        console.log(this.movieList);


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
      this.generalAppService.generalParamsLoaded.next(false);
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
      this.resume();
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
        this.isPlaying = true;
        break;
      case YT.PlayerState.PAUSED:
        this.isPlaying = false;
        break;
      case YT.PlayerState.ENDED:
        if (this.backToList) {
          this.back();
        } else {
          this.goToProgram(false);
        }
        break;
    }
  }

  back() {
    if (isPlatformBrowser(this.platformId)) {

      let lastPage: any = JSON.parse(localStorage.getItem('lastPage'));

      if (lastPage) {
        this.router.navigate([`/${lastPage.page}`], {
          queryParams: lastPage.queryParams
        });
      } else {
        this.router.navigate([`/channels`], {
          queryParams: {
            tab: 'Channels'
          }
        });
      }
    }
  }

  stopVideo() {
    this.player.stopVideo();
  }

  onMute() {
    if (this.player) {
      if (!this.player.isMuted()) {
        this.player.mute();
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'true');
        }
      }
      else {
        this.player.unMute();
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'false');
        }
      }
    } else if (this.livePlayer) {
      if (!this.livePlayer.muted()) {
        this.livePlayer.muted(true);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'true');
        }
      }
      else {
        this.livePlayer.muted(false);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'false');
        }
      }
    } else if (this.vodPlayer) {
      if (!this.vodPlayer.isMuted()) {
        this.vodPlayer.mute(true);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'true');
        }
      }
      else {
        this.vodPlayer.mute(false);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'false');
        }
      }
    }
  }

  onChildControls(event) {
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

        this.onMute();

        break;
      case ChildControlEventEnum.onFullScreenClicked:
        if (isPlatformBrowser(this.platformId)) {
          let iframe: any = document.getElementById("main-wrap");
          var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;

          if (requestFullScreen && !this.playerService.isFullScreen) {
            iframe.requestFullscreen();
            // requestFullScreen.bind(iframe)();
            // this.playerService.isFullScreen = true;
          } else {
            // this.playerService.isFullScreen = false;
            document.exitFullscreen();
          }

        }
        break;
      case ChildControlEventEnum.volumeSliderChanged:
        if (this.player) {
          this.player.setVolume(event.val);
        } else if (this.livePlayer) {
          this.livePlayer.volume(event.val / 100);
        } else if (this.vodPlayer) {
          this.vodPlayer.setVolume(event.val);
        }

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('onMute', 'false');
          localStorage.setItem('volume', event.val);
        }

        if (this.player) {
          if (this.player.isMuted()) {
            this.player.unMute();
          }
        } else if (this.livePlayer) {
          if (this.livePlayer.muted()) {
            this.livePlayer.muted(false);
          }
        } else if (this.vodPlayer) {
          if (this.vodPlayer.isMuted()) {
            this.vodPlayer.mute(false);
          }
        }
        this.isMute = false;

        break;
      case ChildControlEventEnum.playerSetSeconds:
        if (this.player) {
          this.player.seekTo(event.val);
        } else if (this.vodPlayer) {
          this.vodPlayer.seek(event.val * 1000)
        }
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
    if (!this.isDestroyed) {
      setTimeout(() => {
        let index;

        this.movieList.forEach((element, i) => {

          if (+this.selectedYtVideo.MovID === +element.MovID) {
            this.selectedYtVideo['index'] = index;
            index = +i;
          }
        });

        if (isPrev) {

          if (index === 0) {
            this.selectedYtVideo = this.movieList[this.movieList.length - 1];
          } else {
            this.selectedYtVideo = this.movieList[index - 1];
          }
        } else {

          if (index === this.movieList.length - 1) {
            this.selectedYtVideo = this.movieList[0];
          } else {
            this.selectedYtVideo = this.movieList[index + 1];
          }
        }

        this.player.stopVideo();
        this.player.destroy();
        this.playerTime = 0;
        this.duration = 0;

        this.movie = this.selectedYtVideo.MovID;

        setTimeout(() => {
          this.generalAppService.generalParamsLoaded.next(true);
          this.router.navigate(["player", { id: this.id, movie: this.selectedYtVideo.MovID, fromStart: true }]);
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 1000);
        // this.getVideoById();
      }, 2000);
    }
  }

  playerSeekAddSeconds(secsToAdd: number) {
    if (this.player) {
      let time = this.player.getCurrentTime() + secsToAdd;
      this.player.seekTo(time);
      this.playerTime = time;
    } else if (this.vodPlayer) {
      let time = this.vodPlayer.getCurrentTime() + secsToAdd * 1000;
      this.vodPlayer.seek(time);
      this.playerTime = time / 1000;
    }
  }

  resume() {
    if (this.player) {
      this.player.playVideo();
    } else if (this.livePlayer) {
      this.livePlayer.play();
    } else if (this.vodPlayer) {
      this.vodPlayer.play();
      this.isPlaying = true;
    }
  }

  pause() {
    if (this.player) {
      this.player.pauseVideo();
    } else if (this.livePlayer) {
      this.livePlayer.pause();
    } else if (this.vodPlayer) {
      this.vodPlayer.pause();
    }
  }

  mudedStorage() {
    let muted = localStorage.getItem('onMute');

    if (muted && muted !== 'undefined') {
      switch (muted) {
        case 'true':
          if (this.player) {
            this.player.mute();
          } else if (this.livePlayer) {
            this.livePlayer.muted(true);
          } else if (this.vodPlayer) {
            this.vodPlayer.mute(true);
          }
          this.isMute = true;
          break;
        case 'false':
          if (this.player) {
            this.player.unMute();
          } else if (this.livePlayer) {
            this.livePlayer.muted(false);
          } else if (this.vodPlayer) {
            this.vodPlayer.mute(false);
          }

          this.isMute = false;
          break;
      }
    }
  }

  updateSEO(data) {
    if (this.param && data) {

      this._meta.removeTag("name='description'");
      this._meta.removeTag("name='keywords'");
      console.log(data);

      let details = `${data.GenerName} | ${data.ChannelName} | ${data.title}`;
      let tmp_title = `${data.GenerName} | ${data.ChannelName} | ${data.title}`;
      let tmp_desc = `${this.param.metaDescriptionTxt} ${details}`;
      let tmp_key = `${this.param.metaKeywordsTxt} ${details}`;


      // this._title.setTitle(tmp_title.length > 69 ? tmp_title.slice(0, 70) : tmp_title);
      this._meta.addTags([
        {
          name: "description", content: tmp_desc.length > 299 ? tmp_desc.slice(0, 300) : tmp_desc
        },
        { name: "keywords", content: tmp_key.length > 299 ? tmp_key.slice(0, 300) : tmp_key },
        { name: "title ", content: tmp_title.length > 299 ? tmp_title.slice(0, 300) : tmp_title }
      ]);
    }
  }

}
