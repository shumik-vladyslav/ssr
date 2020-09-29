import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-playermanager',
  templateUrl: './playermanager.component.html',
  styleUrls: ['./playermanager.component.scss']
})
export class PlayermanagerComponent implements OnInit {
  safeURL
  id;
  data;
  videoURL: string = "https://www.youtube.com/watch?v=Zyg0t_hfBD4&ab_channel=ACETVONDO&output=embed"
  constructor(private _sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,
    private http: HttpClient){
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['movId'];
      console.log(this.id);
      
      if(!this.id) {
        this.id = 8
      }
      const payload = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
    <getVodMovie xmlns="http://tempuri.org/">
      <movID>${this.id}</movID>
    </getVodMovie>
    </soap:Body>
      </soap:Envelope>`;
  
      let httpObj = { headers: null };
      let authToken = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOjAsIklQIjoiMTc4LjE1OS4yMjkuMTk2In0.WTL96JlZ9CRGuy6JvLxGJ393unNAq2RhhAbiX8qUt7o";
  
  
      httpObj.headers = new HttpHeaders({
        token: authToken,
        "Content-Type": "text/xml",
      });
      
      this.http.post("https://ws.cast-tv.app/DemoTV_PlayerAPI/GetJsonService.asmx?op=getVodMovie", payload, httpObj).subscribe((data: any) => {
        console.log(data);
        this.data = data;
        const tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      })
    });
 }
  
  ngOnInit(): void {
 
  }

  

}
