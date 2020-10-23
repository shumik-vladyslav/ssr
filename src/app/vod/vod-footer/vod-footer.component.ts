import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-vod-footer',
  templateUrl: './vod-footer.component.html',
  styleUrls: ['./vod-footer.component.scss']
})
export class VodFooterComponent implements OnInit {
  pagesArr = [];
  footerText = "";
  param;
  tabs;

  quickLinks;
  about;

  constructor(
    private generalAppService: GeneralAppService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      console.log(data, 'footer generalAppService.paramChangeEventEmiter');
      this.param = data;
    });
    this.param = this.generalAppService.param;

    this.generalAppService.tabsChangeEventEmiter.subscribe((data: any) => {
      console.log(data);
      this.tabs = data;
    });
    if (this.generalAppService.tabs) {
      this.tabs = this.generalAppService.tabs;
    }

    this.generalAppService.getPageInformationAll().subscribe((res: any) => {
      console.log(res);
      this.quickLinks = res;
      this.quickLinks.forEach(element => {
        if (element.page_id === 2056)
          this.about = element;
      });
    })
  }

  tabClick(item, i) {
    this._router.navigate(["/channels"], {
      queryParams: {
        tab: item.ShownName
      },
    });
  }

  download() {
    let osName = "unknown";
    let userAgent;
    if (isPlatformBrowser(this.platformId)) {
      userAgent = navigator.userAgent || navigator.vendor;
      console.log(navigator);
    }
    

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      osName = "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      osName = "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      osName = "iOS";
    }

    if (osName === "iOS") {
      window.open(this.param.IphoneUrl, "_blank");
    } else {
      window.open(this.param.AndroidUrl, "_blank");
    }

  }

}
