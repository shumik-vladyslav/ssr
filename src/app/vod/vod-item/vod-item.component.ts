import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from 'src/app/shared/service/list.service';

@Component({
  selector: 'app-vod-item',
  templateUrl: './vod-item.component.html',
  styleUrls: ['./vod-item.component.scss']
})
export class VodItemComponent implements OnInit {

  selectedItem: any = {}

  list = [];
  channelID;
  channel;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let channelID = +params['id'];
      this.channelID = +params['id'];
      console.log(params['id']);

      
      this.getChannelDetails(channelID);
      this.getData(channelID);
    })
  }

  getData(channelID) {
    this.listService.getChannelMovies(channelID).subscribe((data: any) => {
      console.log(data, 'getChannelMovies');
      this.list = data
    })
  }

  getChannelDetails(channelID){
    this.listService.getChannelDetails(channelID).subscribe((channel: any) => {
      console.log(channel, 'getChannelDetails');
      
      this.channel = channel;
    })
  }

  goToVideo(item) {
    console.log(item);
    console.log(this.channelID);
    
    this._router.navigate(["player", {id: this.channelID, movie: item.YoutubeVideoListID}]);
  }

  goToChannel() {
    this._router.navigate(["player", {id: this.channelID, movie: this.list[0].YoutubeVideoListID}]);
  }

  details(rowIndex, itemIndex, item, e){
    e.stopPropagation();
    this.selectedItem['rowIndex'] = rowIndex;
    this.selectedItem['itemIndex'] = itemIndex;
    this.selectedItem['item'] = item;
  }

}
