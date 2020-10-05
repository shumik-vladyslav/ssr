import { Component, OnInit } from '@angular/core';
import { GeneralAppService } from 'src/app/shared/service/general.service';

@Component({
  selector: 'app-vod-footer',
  templateUrl: './vod-footer.component.html',
  styleUrls: ['./vod-footer.component.scss']
})
export class VodFooterComponent implements OnInit {
  pagesArr = [];
  footerText = "";
  param;
  constructor(private generalAppService: GeneralAppService) { 
    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      this.param = data;
    })
  }

  ngOnInit(): void {
    // this.pagesArr = this._appService.allPages.filter((item) => {
    //   if (item.page_name == "footer"){
    //      this.footerText = item.page_description.replace(/<(.|\n)*?>/g, "").trim();
    //   }
    //   else {
    //     return item;
    //   }
    // }).sort((a, b) => {
    //   if (a.location > b.location) return 1;
    //   if (b.location > a.location) return -1;
    //   return 0;
    // })
  }

}
