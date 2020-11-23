import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from 'src/app/shared/service/list.service';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { GeneralAppService } from 'src/app/shared/service/general.service';

@Component({
  selector: 'app-vod-item',
  templateUrl: './vod-item.component.html',
  styleUrls: ['./vod-item.component.scss']
})
export class VodItemComponent implements OnInit {

  selectedItem: any = {}

  list = [];
  channelID;
  channel;
  listUpdater = 0;
  param;
  hasSeasons = false;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private _meta: Meta,
    private _title: Title,
    private generalAppService: GeneralAppService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      this.param = data;
      this.updateSEO(this.list);
    });
    this.param = this.generalAppService.param;
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.listUpdater++;
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let channelID = +params['id'];
      this.channelID = +params['id'];

      if (isPlatformBrowser(this.platformId)) {

        let queryParams = {};
        if (params['id'])
          queryParams['id'] = params['id'];
        if (params['fieldID'])
          queryParams['fieldID'] = params['fieldID'];
        if (params['Genere_ID'])
          queryParams['Genere_ID'] = params['Genere_ID'];

        let page = JSON.stringify({
          page: 'channel',
          queryParams: queryParams
        });
        localStorage.setItem('lastPage', page);
      }
      // serials
      if (params.fieldID && params.Genere_ID && params.id) {
        this.listService.getVideoList(params.fieldID, params.Genere_ID, params.id).subscribe((data: any) => {
          console.log(data);

          data.map(element => {
            if (element.Genere_ID === +params.Genere_ID) {
              element.SerialList.map(item => {
                if (item.SerialID === +params.id) {
                  this.list = item.VOD_MovieDetailsList;
                  this.channel = {};
                  this.channel.ChannelName = item.SerialName;
                  this.channel.ChannelDesc = item.SerialDesc;
                  this.updateSEO(this.list);
                }
              });
            }
          });
        });
        this.hasSeasons = true;
        // lessons
      } else if (params.Genere_ID && params.fieldID && !params.id) {
        this.listService.getVideoList(params.fieldID, params.Genere_ID).subscribe((data: any) => {
          console.log(data);

          data.map(element => {
            if (element.Genere_ID === +params.Genere_ID) {
              this.list = element.VOD_MovieDetailsList;
              this.updateSEO(this.list);
            }
          });

        });
        // movie
      } else {
        this.getChannelDetails(channelID);
        this.getData(channelID);
      }
    });
  }

  getData(channelID) {
    this.listService.getChannelMovies(channelID).subscribe((data: any) => {
      console.log(data, 'getChannelMovies');
      this.list = data;

      this.updateSEO(this.list);
    })
  }

  getChannelDetails(channelID) {
    this.listService.getChannelDetails(channelID).subscribe((channel: any) => {
      console.log(channel, 'getChannelDetails');

      this.channel = channel;
    })
  }

  goToVideo(item) {
    console.log(item);
    console.log(this.channelID);

    let channelID;

    if (this.channelID) {
      channelID = this.channelID;
    } else {
      channelID = item.ChannelID;
    }

    this._router.navigate(["player", { id: channelID, movie: item.YoutubeVideoListID, fromStart: true }]);
  }

  goToChannel() {
    this._router.navigate(["player", { id: this.channelID, movie: this.list[0].YoutubeVideoListID }]);
  }

  details(rowIndex, itemIndex, item, e, deteilsId) {
    e.stopPropagation();
    this.selectedItem['rowIndex'] = rowIndex;
    this.selectedItem['itemIndex'] = itemIndex;
    this.selectedItem['item'] = item;
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.getElementById(deteilsId).scrollIntoView({ block: "center", behavior: "smooth" });
      }, 100);
    }
  }

  updateSEO(data) {
    if (this.param && data) {

      this._meta.removeTag("name='description'");
      this._meta.removeTag("name='keywords'");

      let details;

      let result = [];

      data.map(el => {
        result.push(el.Title)
      });
      details = result.join(' | ');

      let tmp_title = `${this.param.metaTitleTxt} ${details}`;
      let tmp_desc = `${this.param.metaDescriptionTxt} ${details}`;
      let tmp_key = `${this.param.metaKeywordsTxt} ${details}`;


      this._title.setTitle(tmp_title.length > 69 ? tmp_title.slice(0, 70) : tmp_title);
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
