import { Component, OnInit } from '@angular/core';
import { GeneralAppService } from 'src/app/shared/service/general.service';

@Component({
  selector: 'app-vod-footer',
  templateUrl: './vod-footer.component.html',
  styleUrls: ['./vod-footer.component.scss']
})
export class VodFooterComponent implements OnInit {

  param;
  constructor(private generalAppService: GeneralAppService) { 
    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      this.param = data;
    })
  }

  ngOnInit(): void {
  }

}
