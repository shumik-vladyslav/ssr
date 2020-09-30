import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerService } from '../shared/service/player.service';

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
    private playerService: PlayerService){
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);

 }
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['movId'];
      console.log(this.id);
      
      if(!this.id) {
        this.id = 8
      }
      
      this.playerService.getVideoById(this.id).subscribe((data: any) => {
        console.log(data);
        this.data = data;
        const tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      })
    });
  }

  

}
