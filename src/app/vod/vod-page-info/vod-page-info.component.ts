import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralAppService } from 'src/app/shared/service/general.service';

@Component({
  selector: 'app-vod-page-info',
  templateUrl: './vod-page-info.component.html',
  styleUrls: ['./vod-page-info.component.scss']
})
export class VodPageInfoComponent implements OnInit {

  data;

  constructor(
    private activatedRoute: ActivatedRoute,
    private generalAppService: GeneralAppService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.generalAppService.getPageInformationAll().subscribe( (res: any) => {
        console.log(res);
        res.forEach(element => {
          if (+params['id'] === +element.page_id) {
            this.data = element;
            console.log(this.data);
          }
        });
      })
    })
  }

}
