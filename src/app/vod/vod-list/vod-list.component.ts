import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vod-list',
  templateUrl: './vod-list.component.html',
  styleUrls: ['./vod-list.component.scss']
})
export class VodListComponent implements OnInit {
  data = [];
  it = [1,2,3]
  constructor(private http: HttpClient, private _router: Router) {
    const payload = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <getChannelsList xmlns="http://tempuri.org/">
          <ClientId>30</ClientId>
        </getChannelsList>
      </soap:Body>
    </soap:Envelope>`;

    let httpObj = { headers: null };
    let authToken = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoSWQiOjAsIklQIjoiMTc4LjE1OS4yMjkuMTk2In0.WTL96JlZ9CRGuy6JvLxGJ393unNAq2RhhAbiX8qUt7o";


    httpObj.headers = new HttpHeaders({
      token: authToken,
      "Content-Type": "text/xml",
    });
    
    this.http.post("https://biz.cast-tv.app/GetJsonService.asmx?op=getChannelsList", payload, httpObj).subscribe((data: any) => {
      console.log(data);
      this.data = data;
    })
   }

  ngOnInit(): void {
  }

  goToVideo(item) {
    console.log(item);
    // this.rout.navigateByUrl("player/"+item.movId);
    this._router.navigate(["player"], {
      queryParams: {
        movId: item.movId
      },
      queryParamsHandling: 'merge',
    });
  }

}
