import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerService } from '../shared/service/player.service';
import { ChildControlEventEnum } from '../shared/enums/child-control-event-enum';

@Component({
  selector: 'app-playermanager',
  templateUrl: './playermanager.component.html',
  styleUrls: ['./playermanager.component.scss']
})
export class PlayermanagerComponent implements OnInit {
  safeURL
  id;
  data;
  player;
  youtubeTag;
  playerTime = 0;
  duration = 0;
  videoURL: string = "https://www.youtube.com/watch?v=Zyg0t_hfBD4&ab_channel=ACETVONDO&output=embed"
  constructor(private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,
    private playerService: PlayerService){
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
 }
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['movId'];
      localStorage.setItem('videoId', this.id);

      // this.youtubeTag = params["youtubeTag"];
      console.log(this.id);
      if(this.id){
        this.getVideoById();
      } else if(this.youtubeTag){
        this.setYoutube(this.youtubeTag);
      }
    
    });
  }

  getVideoById(){
    this.playerService.getVideoById(this.id).subscribe((data: any) => {
      console.log(data);
      this.data = data;
      this.playerService.dataChangeEventEmiter.emit(this.data);
      this.setYoutube(this.data.movId);
    })
  }

  setYoutube(videoId){
    console.log(videoId);

    setTimeout(() => {
      this.player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId:videoId ,
        playerVars: {
          controls: 0,
          showinfo: 0,
          autoplay: 1,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          rel: 0,
          autohide:1
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
      event.target.playVideo();
      setTimeout(() => {
       this.stopVideo();
       this.duration = this.player.getDuration();
      }, 100);
    }

    done = false;
     onPlayerStateChange(event) {
    }

    stopVideo() {
      this.player.stopVideo();
    }

    onChildControls(event){
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
            if (!this.player.isMuted()) {
              this.player.mute();
            }
            else {
              this.player.unMute();
            }
            break;
          case ChildControlEventEnum.onFullScreenClicked: 
            let iframe:any = document.getElementById("player");
            var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
            if (requestFullScreen) {
              requestFullScreen.bind(iframe)();
            }
            break;
          case ChildControlEventEnum.volumeSliderChanged:
              this.player.setVolume(event.val);
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

  resume(){
    this.player.playVideo();
  }

  pause(){
    this.player.pauseVideo();
  }


}
