import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralAppService } from './general.service';

@Injectable({
  providedIn: "root",
})
export class ListService {

  videoList = {};
  videoListOriginal = {};

  // lastViewed: any = {};

  constructor(private generalAppService: GeneralAppService, private http: HttpClient) {

  }

  getVideoList(TabID, Genere_ID?, SerialID?) {
    const payload = this.generalAppService.getXmlStart() + `
      <Get_VideoList_By_GenerID_Lang_For_Player xmlns="http://tempuri.org/">
        <CrmLanguageId>0</CrmLanguageId>
        <TabID>${TabID}</TabID>
        <Genere_ID>${Genere_ID ? Genere_ID : 0}</Genere_ID>
        <SubGenere_ID>0</SubGenere_ID>
        <SerialID>${SerialID ? SerialID : 0}</SerialID>
        <SeasonNumber>0</SeasonNumber>
        <Page>1</Page>
        <SortBy>1</SortBy>
        <NumberOfMovies>10</NumberOfMovies>
      </Get_VideoList_By_GenerID_Lang_For_Player>
       ` + this.generalAppService.getXmlEnd();

    return this.generalAppService.apiCall(this.generalAppService.getConfig().severUriSecond + "GetJsonService.asmx?op=Get_VideoList_By_GenerID_Lang_For_Player", payload);
  }

  getChannelsList(tabId) {
    const payload = this.generalAppService.getXmlStart() + `
        <getChannelsList xmlns="http://tempuri.org/">
        <TabID>${tabId}</TabID>
        <userTimeOffset>1</userTimeOffset>
      </getChannelsList>
       ` + this.generalAppService.getXmlEnd();

    return this.generalAppService.apiCall(this.generalAppService.getConfig().severUriSecond + "GetJsonService.asmx?op=getChannelsList", payload);

  }
  getChannelDetails(ChannelID) {
    const payload = this.generalAppService.getXmlStart() + `
      <getChannelDetails xmlns="http://tempuri.org/">
        <ChannelID>${ChannelID}</ChannelID>
      </getChannelDetails>
       ` + this.generalAppService.getXmlEnd();
    return this.generalAppService.apiCall(this.generalAppService.getConfig().severUriSecond + "GetJsonService.asmx?op=getChannelsList", payload);
  }
  getChannelMovies(ChannelID) {
    return this.http.get(this.generalAppService.getConfig().serverUri + `GetJsonService.asmx/getChannelMovies?channelID=${ChannelID}`);
  }

  getList() {
    const payload = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <getChannelsList xmlns="http://tempuri.org/">
              <ClientId>30</ClientId>
            </getChannelsList>
          </soap:Body>
        </soap:Envelope>`;

    return this.generalAppService.apiCall(this.generalAppService.getConfig().serverUri + "GetJsonService.asmx?op=getChannelsList", payload);
  }
}