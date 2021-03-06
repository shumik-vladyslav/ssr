import { Injectable, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from '../model/general.model';
import { IPageInformation } from '../model/page-information';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash'
import * as serverUrlConfigas from '../../../../server-url-config'
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: "root",
})
export class GeneralAppService {

  noMouseMove: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  fullScreen = false;
  fullScreenStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  generalParamsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  timeout;

  data: Config;
  token;
  param;
  tabs;
  generalParams;
  langId = 5;

  public dataChangeEventEmiter = new EventEmitter();
  public paramChangeEventEmiter = new EventEmitter();
  public tabsChangeEventEmiter = new EventEmitter();
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log(1);
    // this.http.get("./assets/config-07.json").subscribe((data: any) => {
    //   console.log(data);
    //   this.data = data;
    //   // this.getToken();
    // });
    this.data = serverUrlConfigas.serverUrlConfig as any;

    this.getToken();

    this.fullScreenStatus.subscribe(status => {
      this.fullScreen = status;
    })
  }


  getToken() {
    const payload = this.getXmlStart() + `
            <getAuthToken xmlns="http://tempuri.org/">
             <authId>0</authId>
           </getAuthToken>
         ` + this.getXmlEnd();

    this.apiCall(this.data.serverUri + "GetJsonService.asmx?op=getAuthToken", payload).subscribe((token) => {
      this.token = token;
      console.log(token);
      this.dataChangeEventEmiter.emit(this.data);
      this.getParamsServer();
      this.getTabsList();
    });
  }
  startingVideoPlay = true;

  getParamsServer() {
    const payload = this.getXmlStart() + `
            <getGeneralParams xmlns="http://tempuri.org/">
            <GeneralParamMode>Production</GeneralParamMode>
            </getGeneralParams>
         ` + this.getXmlEnd();

    this.apiCall(this.data.serverUri + "GetJsonService.asmx?op=getGeneralParams", payload).subscribe((param: any) => {
      this.param = param;
      console.log(param, 'getGeneralParams');
      this.paramChangeEventEmiter.emit(this.param);

      this.addFavicoToHeader();

    });
  }

  getTabsList() {
    const payload = this.getXmlStart() +
      `<GetTabsList xmlns="http://tempuri.org/">
          <LanguageID>5</LanguageID>
        </GetTabsList>`
      + this.getXmlEnd();

    this.apiCall(this.data.severUriSecond + "GetJsonService.asmx?op=GetTabsList", payload).subscribe((tabs) => {
      console.log(tabs);
      this.tabs = tabs;
      this.tabsChangeEventEmiter.emit(tabs);
    });
  }

  getTabs() {
    return this.tabs;
  }

  getConfig(): Config {
    return this.data;
  }

  getParams() {
    return this.param;
  }

  apiCall(url, payload) {
    let httpObj = { headers: null };
    let authToken = "";

    if (this.token) {
      authToken = this.token.authToken;
    }

    httpObj.headers = new HttpHeaders({
      token: authToken,
      "Content-Type": "text/xml",
    });
    return this.http.post(url, payload, httpObj)
  }

  addFavicoToHeader() {
    if (isPlatformBrowser(this.platformId)) {
      let node = document.createElement('link');
  
      node.href = this.param.SmallFavicoIcon;
      node.rel = 'shortcut icon';
      node.type = 'image/png';
      document.getElementsByTagName('head')[0].appendChild(node);
  
      let node1 = document.createElement('link');
      node1.href = this.param.MediumeFavicoIcon;
      node1.rel = 'shortcut icon';
      node1.type = 'image/png';
      document.getElementsByTagName('head')[0].appendChild(node1);
  
      let node2 = document.createElement('link');
      node2.href = this.param.Icon162X162;
      node2.rel = 'shortcut icon';
      node2.type = 'image/png';
      document.getElementsByTagName('head')[0].appendChild(node2);
    }
  }

  xmlStart = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>`;
  xmlEnd = `</soap:Body>
      </soap:Envelope>`;
  getXmlStart() {
    return this.xmlStart;
  }
  getXmlEnd() {
    return this.xmlEnd;
  }
  private _assetDir: string;
  public static isMobile: boolean;
  public static userAgent: string;
  public static userIpData: any;

  get assetDir(): string {
    return this._assetDir;
  }
  set assetDir(value: string) {
    this._assetDir = value;
  }

  isAndroidTV = false;


  private _allPages: IPageInformation[];
  set allPages(value: IPageInformation[]) {
    this._allPages = value;
  }
  get allPages(): IPageInformation[] {
    return this._allPages;
  }

  mouseMoveTrigger() {
    let timeMilisec = 4000;

    this.noMouseMove.next(true);

    // console.log(`mouse timeout set to: ${timeMilisec}`)
    this.timeout = setTimeout(() => {
      this.noMouseMove.next(false);
    }, timeMilisec)
    // }, parseInt(this._generalAppService.generalParams.controlsIdealMili))
  }

  getPageInformationAll() {
    const body = new HttpParams()
      .set('myLangID', '5')
      .set('myParentPageID', '0')

    return this.http.post('https://biz.cast-tv.app/GetJsonService.asmx/getPageInformation_All',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

}