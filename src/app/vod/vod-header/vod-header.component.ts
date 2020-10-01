import { Component, OnInit } from '@angular/core';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-vod-header',
  templateUrl: './vod-header.component.html',
  styleUrls: ['./vod-header.component.scss']
})
export class VodHeaderComponent implements OnInit {
  isOver = {};
  clicked = {};
  MouseOver(i) {
    this.isOver[i] = !this.isOver[i];
  }

  param;
  tabs = [];
  constructor(private generalAppService: GeneralAppService, private _router: Router,
    private _location: Location) { 
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
  }

  tabClick(item, i){
    this.clicked[i] = !this.clicked[i];
    this._router.navigate(["/vod"], {
      queryParams: {
        tab: item.ShownName
      },
      queryParamsHandling: 'merge',
    });
  }

  back(){
    this._location.back();
  }

}
