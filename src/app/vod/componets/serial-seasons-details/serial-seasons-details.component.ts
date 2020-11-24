import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-serial-seasons-details',
  templateUrl: './serial-seasons-details.component.html',
  styleUrls: ['./serial-seasons-details.component.scss']
})
export class SerialSeasonsDetailsComponent implements OnInit, OnChanges {
  @Input() data;
  @Output() selectEpisodeEvent = new EventEmitter;

  showDrb = false;
  seasonsOptions = [];
  selectedSeason;

  constructor() { }
  ngOnChanges(): void {
    this.parseData();
  }

  ngOnInit(): void {
  }
  parseData(){
    let options = {}
    this.data.forEach(element => {
      if (!options[element.Serial_seasone]) {
        options[element.Serial_seasone] = {
          name: `Season ${element.Serial_seasone}`,
          value: element.Serial_seasone
        }
      }
    });
    this.seasonsOptions = Object.keys(options).map(key => {
      return options[key];
    })
    this.selectedSeason = this.seasonsOptions[0]
  }

  select(episode){
    this.selectEpisodeEvent.emit(episode)
  }
}
