import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { GeneralAppService } from './general.service';

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  public dataChangeEventEmiter = new EventEmitter();

  constructor(
    private generalAppService: GeneralAppService,
    private http: HttpClient
  ) {

  }

  getVideoById(id) {
    const payload = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
    <getVodMovie xmlns="http://tempuri.org/">
      <movID>${id}</movID>
    </getVodMovie>
    </soap:Body>
      </soap:Envelope>`;

    return this.generalAppService.apiCall(this.generalAppService.getConfig().severUriSecond + "GetJsonService.asmx?op=getVodMovie", payload);
  }
  getMinifiedChannelDayEpg(param: { channelID: number; epgDate: string, userTimeOffset: any }) {

    const body = new HttpParams()
      .set('channelID', param.channelID.toString())
      .set('epgDate', param.epgDate)
      .set('userTimeOffset', param.userTimeOffset)

    return this.http.post('https://biz.cast-tv.app/GetJsonService.asmx/getMinifiedChannelDayEpg',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  generateChannelMovie(param: { channelID: number; movid: string; userTimeOffset: string, now: any }) {
    const body = new HttpParams()
      .set('movPos', "0")
      .set('movStartDate', param.now)
      .set('userTimeOffset', param.userTimeOffset)
      .set('channelID', param.channelID.toString())
      .set('movid', param.movid);

    return this.http.post('https://biz.cast-tv.app/GetJsonService.asmx/generateChannelMovie',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );


  }
}