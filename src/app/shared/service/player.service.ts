import { Injectable } from '@angular/core';
import { GeneralAppService } from './general.service';

@Injectable({
    providedIn: "root",
  })
  export class PlayerService {

    constructor(private generalAppService: GeneralAppService){

    }

    getVideoById(id){
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
  }