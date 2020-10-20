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

  generateChannelMovie(param: { channelID: number; movid: string; userTimeOffset: string, now: any }) {
    const body = new HttpParams()
    .set('movPos', "0")
    .set('movStartDate', "2020-10-19")
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

    let payload = `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <generateChannelMovie xmlns="http://tempuri.org/">
            <channelID>${param.channelID}</channelID>
            <movid>${param.movid}</movid>
            <movPos>0</movPos>
            <movStartDate>0</movStartDate>
            <userTimeOffset>${param.userTimeOffset}</userTimeOffset>
          </generateChannelMovie>
        </soap:Body>
      </soap:Envelope>`;

      payload = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <generateChannelMovie xmlns="http://tempuri.org/">
            <channelID>287</channelID>
            <movid>74380</movid>
            <movPos>0</movPos>
            <movStartDate>0</movStartDate>
            <userTimeOffset>180</userTimeOffset>
          </generateChannelMovie>
        </soap:Body>
        </soap:Envelope>`

    return this.generalAppService.apiCall(this.generalAppService.getConfig().serverUri + "GetJsonService.asmx?op=generateChannelMovie", payload);
  }
  // generateChannelMovie(param: { channelID: number; movid: string; userTimeOffset: string, now: any }) {
  //   const payload = `
  //     <?xml version="1.0" encoding="utf-8"?>
  //     <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  //       <soap:Body>
  //         <generateChannelMovie xmlns="http://tempuri.org/">
  //           <channelID>${param.channelID}</channelID>
  //           <movid>${param.movid}</movid>
  //           <movPos>0</movPos>
  //           <movStartDate>${param.now}</movStartDate>
  //           <userTimeOffset>${param.userTimeOffset}</userTimeOffset>
  //         </generateChannelMovie>
  //       </soap:Body>
  //     </soap:Envelope>`;

  //   // return this.http.get(`biz.cast-tv.app/GetJsonService.asmx/generateChannelMovie?channelID=${param.channelID}&movid=${param.movid}&movPos=0&movStartDate=${param.now}&userTimeOffset=${param.userTimeOffset}`)
  //   let httpObj = { headers: null };

  //   httpObj.headers = new HttpHeaders({
  //     token: authToken,
  //     "Content-Type": "text/xml",
  //   });
  //   const formData = new FormData();
  //   formData.append('channelID', param.channelID.toString());
  //   formData.append('movid', param.movid);
  //   formData.append('movPos', '0');
  //   formData.append('movStartDate', param.now);
  //   formData.append('userTimeOffset', param.userTimeOffset);
  //   return this.http.post<any>(`https://biz.cast-tv.app/GetJsonService.asmx/generateChannelMovie`, formData).subscribe(
  //     (res) => console.log(res),
  //     (err) => console.log(err)
  //   );
  //   return this.generalAppService.apiCall(

  //     'https://biz.cast-tv.app/GetJsonService.asmx/generateChannelMovie/'
  //     ,

  //     `channelID=82&movid=74980&movPos=0&movStartDate=2020-10-19&userTimeOffset=180`

  //   );
  // }
}