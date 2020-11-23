import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlayerService } from 'src/app/shared/service/player.service';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-vod-header',
  templateUrl: './vod-header.component.html',
  styleUrls: ['./vod-header.component.scss']
})
export class VodHeaderComponent implements OnInit {
  isOver = {};
  clicked = {};
  isMouseMove;
  MouseOver(i) {
    this.isOver[i] = !this.isOver[i];
  }

  param;
  tabs = [];
  video;
  constructor(
    public generalAppService: GeneralAppService,
    private _router: Router,
    private _location: Location,
    private playerService: PlayerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.playerService.dataChangeEventEmiter.subscribe((data) => {
      console.log(data, 111111111111);
      this.video = data;
    });
    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      console.log(data);
      this.param = data;
    });
    this.generalAppService.tabsChangeEventEmiter.subscribe((data: any) => {
      console.log(data);

      this.tabs = data;
    });
    if (this.generalAppService.tabs) {
      this.tabs = this.generalAppService.tabs;
    }
  }

  ngOnInit(): void {
    this.generalAppService.noMouseMove.subscribe(status => {
      this.isMouseMove = status;
    })
  }

  selectVideo() {

    let obj = {}

    if (this.video.videoIddForHeader) {
      obj['movie'] = this.video.videoIddForHeader;
      obj['id'] = this.video.channelId;
    } else {
      obj['id'] = this.video.ChannelID
    }

    this._router.navigate(["player", obj]);
  }

  tabClick(item, i) {
    this.clicked[i] = !this.clicked[i];
    this._router.navigate(["/channels"], {
      queryParams: {
        tab: item.ShownName
      },
      // queryParamsHandling: 'merge',
    });
  }

  back() {
    if (isPlatformBrowser(this.platformId)) {

      let lastPage: any = JSON.parse(localStorage.getItem('lastPage'));

      if (this._router.url.startsWith('/channels')) {
        this._location.back();
      } else {
        if (lastPage) {
          this._router.navigate([`/${lastPage.page}`], {
            queryParams: lastPage.queryParams
          });
        } else {
          this._router.navigate([`/channels`], {
            queryParams: {
              tab: 'Channels'
            }
          });
        }
      }

    }
  }

  defaultVideo() {
    let channelID = this.param.DefaultChannelID;

    let params = {};
    let userTimeOffset = new Date().getTimezoneOffset();
    let now = moment().format('DD/MM/YYYY');

    params['id'] = channelID;

    this.playerService.getMinifiedChannelDayEpg({ channelID: +channelID, userTimeOffset: userTimeOffset.toString(), epgDate: now }).subscribe((res: any) => {
      console.log(res);
      params['movie'] = res[0].MovID;
      this._router.navigate(["player", params]);
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.reload();
        }
      }, 100);
    });
  }

}
