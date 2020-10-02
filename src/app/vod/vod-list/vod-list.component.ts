import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralAppService } from 'src/app/shared/service/general.service';
import { ListService } from 'src/app/shared/service/list.service';
import { Tab, Chenel } from 'src/app/shared/model/general.model';

@Component({
  selector: 'app-vod-list',
  templateUrl: './vod-list.component.html',
  styleUrls: ['./vod-list.component.scss']
})
export class VodListComponent implements OnInit {
  data = {};
  tabName: string;
  tabs: Tab[];
  constructor(private _router: Router, private listService: ListService, 
    private activatedRoute: ActivatedRoute, private generalAppService: GeneralAppService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tabName = params['tab'];
      this.tabSearch();
    });
    this.generalAppService.tabsChangeEventEmiter.subscribe((data) => {
      this.tabSearch();
    })
   }

   videoType = 1;
res = []
   

   tabSearch(){
      this.tabs = this.generalAppService.getTabs();
      if(this.tabName && this.tabs) {
        let obj = this.tabs.find(t => t.ShownName === this.tabName);
        console.log(obj);
        switch (obj.ChannelType) {
          case 1:
            this.videoType = 1;
            this.listService.getChannelsList(obj.FieldID).subscribe((data: Chenel[]) => {
              console.log(data);
              this.data = {};
              data.forEach(element => {
              
                if(!this.data[element.Genere_Name]){
                  this.data[element.Genere_Name] = [];
                }

                this.data[element.Genere_Name].push(element);
                
              });

              console.log(this.data);
            })
            break;
          case 2:
            this.videoType = 2;
            this.data = {};
            this.listService.getVideoList(obj.FieldID).subscribe((data) => {
              console.log(data);
              
            })
            break;
          default:
            this.data = {};
            break;
        }
      
      }
   }

  ngOnInit(): void {
    // this.listService.getList().subscribe((data: any) => {
    //   this.data = data;
    // })
  }

  goToVideo(item) {
    this._router.navigate(["player"], {
      queryParams: {
        movId: item.programLists[0].MovID
      },
      queryParamsHandling: 'merge',
    });
  }

  cs(i){
    console.log(i);
    
  }
}
