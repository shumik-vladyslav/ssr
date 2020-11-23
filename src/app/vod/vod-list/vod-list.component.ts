import { Component, HostListener, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { ListService } from 'src/app/shared/service/list.service';
import { Tab, Chenel } from 'src/app/shared/model/general.model';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { MovieTypeEnum } from 'src/app/shared/enums/movie-type-enum';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vod-list',
  templateUrl: './vod-list.component.html',
  styleUrls: ['./vod-list.component.scss']
})
export class VodListComponent implements OnInit {

  @ViewChild('scrollWrap') scrollWrap;

  data = {};
  orderData = {};
  lastViewedData = [];
  tabName: string;
  tabs: Tab[];
  videoType = 1;
  res = [];
  listUpdater = 0;
  fieldID;

  constructor(
    private _router: Router,
    private listService: ListService,
    private activatedRoute: ActivatedRoute,
    private generalAppService: GeneralAppService,
    private _meta: Meta,
    private _title: Title,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.tabName = params['tab'];
      this.tabSearch();
    });

    this.generalAppService.tabsChangeEventEmiter.subscribe((data) => {
      this.tabSearch();
    });

    this.generalAppService.paramChangeEventEmiter.subscribe((data: any) => {
      this.param = data;
    });
    this.param = this.generalAppService.param;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.listUpdater++;
  }

  onScroll(event) {
    if (isPlatformBrowser(this.platformId)) {
      let obj = {};
      obj[this.tabName] = event.target.scrollTop;
      localStorage.setItem('scrollPosition', JSON.stringify(obj));
    }
  }


  setScrollPosition() {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {

        let scrollPosition = JSON.parse(localStorage.getItem('scrollPosition'));
        if (scrollPosition && scrollPosition[this.tabName]) {
          this.scrollWrap.nativeElement.scrollTop = scrollPosition[this.tabName];
        }

      }
    }, 500);
  }

  tabSearch() {
    this.tabs = this.generalAppService.getTabs();
    if (this.tabName && this.tabs) {
      let obj = this.tabs.find(t => t.ShownName === this.tabName);
      console.log(obj);

      this.fieldID = obj.FieldID;

      switch (obj.ChannelType) {
        case MovieTypeEnum.YouTube_Video:
          this.videoType = MovieTypeEnum.YouTube_Video;
          this.getChenels(obj);
          break;
        case MovieTypeEnum.Serials:
          this.videoType = MovieTypeEnum.Serials;
          this.getChenelsType2(obj);
          break;
        case MovieTypeEnum.Lessons:
          this.videoType = MovieTypeEnum.Lessons;
          this.getChenelsType2(obj);
          break;
        case MovieTypeEnum.VOD_Folder:
          this.videoType = MovieTypeEnum.VOD_Folder;
          this.getChenels(obj);
          break;
        default:
          this.data = {};
          break;
      }

    }
  }
  param;

  ngOnInit(): void {
  }

  getChenels(obj) {

    if (isPlatformBrowser(this.platformId)) {
      let page = JSON.stringify({
        page: 'channels',
        queryParams: {
          tab: obj.ShownName
        }
      });
      localStorage.setItem('lastPage', page);
      console.log(localStorage.getItem('lastPage'));
    }


    if (this.listService.videoList[obj.FieldID]) {
      this.data = this.listService.videoList[obj.FieldID];

      this.getLastViewedList(obj);

      this.orderData = {};
      this.listService.videoListOriginal[obj.FieldID].forEach(element => {
        this.orderData[element.Genere_Name] = element.GenreOrderBy;
      });

      this.setScrollPosition();

      this.updateSEO(this.data, 'channels');
    } else
      this.listService.getChannelsList(obj.FieldID).subscribe((data: Chenel[]) => {
        console.log(data);
        this.data = {};
        data.forEach(element => {

          if (!this.data[element.Genere_Name]) {
            this.data[element.Genere_Name] = [];
          }

          this.data[element.Genere_Name].push(element);

          this.orderData[element.Genere_Name] = element.GenreOrderBy;

        });


        this.listService.videoList[obj.FieldID] = this.data;
        this.listService.videoListOriginal[obj.FieldID] = data;

        this.getLastViewedList(obj);

        console.log(this.data);

        this.setScrollPosition();

        this.updateSEO(this.data, 'channels');
      })
  }

  getChenelsType2(obj) {

    if (isPlatformBrowser(this.platformId)) {
      let page = JSON.stringify({
        page: 'channels',
        queryParams: {
          tab: obj.ShownName
        }
      });
      localStorage.setItem('lastPage', page);
      console.log(localStorage.getItem('lastPage'));
    }


    if (this.listService.videoList[obj.FieldID]) {
      this.data = this.listService.videoList[obj.FieldID];

      this.getLastViewedList(obj);

      this.orderData = {};
      this.listService.videoListOriginal[obj.FieldID].forEach(element => {
        this.orderData[element.Genere_Name] = element.GenreOrderBy;
      });

      this.setScrollPosition();

      this.updateSEO(this.data, 'movie');

    } else {
      this.listService.getVideoList(obj.FieldID).subscribe((data: Chenel[]) => {
        console.log(data);
        this.data = {};
        data.forEach(element => {

          if (!this.data[element.Genere_Name]) {
            this.data[element.Genere_Name] = [];
          }

          this.data[element.Genere_Name].push(element);

          this.orderData[element.Genere_Name] = element.GenreOrderBy;

        });


        this.listService.videoList[obj.FieldID] = this.data;
        this.listService.videoListOriginal[obj.FieldID] = data;

        this.getLastViewedList(obj);

        console.log(this.data);

        this.setScrollPosition();

        this.updateSEO(this.data, 'movie');

      });
    }
  }

  getLastViewedList(obj) {
    if (isPlatformBrowser(this.platformId)) {
      let lastViewed = JSON.parse(localStorage.getItem('lastViewed'));

      console.log(lastViewed);

      this.lastViewedData = [];
      if (lastViewed?.value && lastViewed.expires === moment().format('DD/MM/YYYY')) {
        console.log(lastViewed);

        let channelIDArr = Object.keys(lastViewed.value);
        if (channelIDArr.length) {
          channelIDArr.forEach(channelID => {
            this.listService.videoListOriginal[obj.FieldID].forEach((item: any) => {
              if (+item.ChannelID === +channelID) {
                this.lastViewedData.push(item);
              }
            });
          })
        }
      }

      console.log(this.lastViewedData);

    }
  }

  goToVideo(item) {
    console.log(item);

    if (item.LiveLink) {
      console.log(item.ChannelID, 'item.ChannelID');

      this._router.navigate(["player", { id: item.ChannelID }]);
    } else {
      this._router.navigate(["player", { id: item.ChannelID, movie: item.programLists[0].MovID }]);
    }

  }

  goToVideo2(item): void {
    console.log(item);
    this._router.navigate(['player', { id: item.ChannelID, movie: item.YoutubeVideoListID, fromStart: true, backToList: true }]);
  }

  goToVideo3(item): void {
    console.log(item);
    this._router.navigate(['player', { id: item.VOD_MovieDetailsList[0].ChannelID, movie: item.VOD_MovieDetailsList[0].YoutubeVideoListID, fromStart: true, backToList: true }]);
  }

  info(e, item) {
    e.stopPropagation();
    console.log(item);
    this._router.navigate(["channel"], {
      queryParams: {
        id: item.ChannelID
      }
    });
  }

  info2(e, item, rowWraprow) {
    e.stopPropagation();
    console.log(item);
    this._router.navigate(['channel'], {
      queryParams: {
        id: item.SerialID,
        fieldID: this.fieldID,
        Genere_ID: rowWraprow.Genere_ID,
      }
    });
  }

  info3(e, id) {
    e.stopPropagation();
    this._router.navigate(['channel'], {
      queryParams: {
        fieldID: this.fieldID,
        Genere_ID: id,
      }
    });
  }

  updateSEO(data, type) {
    let interval = setInterval(() => {
      if (this.param) {
        if (data) {
          this._meta.removeTag("name='description'");
          this._meta.removeTag("name='keywords'");
    
          let details;
    
          let result = [];
          switch (type) {
    
            case 'channels':
              Object.keys(data).map(key => {
                data[key].map(el => {
                  result.push(el.ChannelName)
                })
              });
              details = result.join(' | ');
              break;
    
            case 'movie':
              Object.keys(data).map(key => {
                // Gener name
                result.push(key)
              });
              details = result.join(' | ');
              break;
          }
    
          let tmp_title = `${this.param.metaTitleTxt}`;
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
        clearInterval(interval)
      }
    }, 500);
  }

}
