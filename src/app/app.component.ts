import { Component } from '@angular/core';
import { GeneralAppService } from './shared/service/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  config;
  constructor(private generalAppService: GeneralAppService){
    this.config = this.generalAppService.getConfig();
    this.generalAppService.dataChangeEventEmiter.subscribe(data => {
      this.config = data;
    })
  }
}
