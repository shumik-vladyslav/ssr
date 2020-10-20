import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { GeneralAppService } from './shared/service/general.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService } from './shared/service/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  config;
  param;
  loaded;

  constructor(
    private generalAppService: GeneralAppService,
    private playerService: PlayerService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.config = this.generalAppService.getConfig();
    this.generalAppService.dataChangeEventEmiter.subscribe(data => {
      this.config = data;
    });
    this.generalAppService.paramChangeEventEmiter.subscribe((param: any) => {
      console.log(param);
      this.param = param;

      if (isPlatformBrowser(this.platformId)) {
        let videoId = localStorage.getItem('id');
        let movie = localStorage.getItem('movie');
        console.log(videoId);
        console.log(movie);
        console.log(param);
        console.log(this._router.url);

        if (!videoId || videoId === 'undefined') {
          videoId = param.DefaultChannelID;

          console.log();
          let params = {};
          params['id'] = videoId;
          params['movie'] = param.defaultMovId;

          this._router.navigate(["player", params]);
        } else {

          if ((this._router.url === "/") && (this.param.startingYoutubeMovId || videoId)) {
            console.log(videoId);

            let params = {};
            params['id'] = videoId;

            if (movie && videoId !== 'undefined')
              params['movie'] = movie;

            this._router.navigate(["player", params]);
          }
        }

      }
    });
    this.generalAppService.generalParamsLoaded.subscribe(loaded => {
      this.loaded = loaded
    })
  }
}
