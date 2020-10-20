import { Component, OnInit } from '@angular/core';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlayerService } from 'src/app/shared/service/player.service';

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
  constructor(public generalAppService: GeneralAppService, private _router: Router,
    private _location: Location, private playerService: PlayerService) {
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
    this._location.back();
  }

}
