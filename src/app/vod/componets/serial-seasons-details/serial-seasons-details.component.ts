import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-serial-seasons-details',
  templateUrl: './serial-seasons-details.component.html',
  styleUrls: ['./serial-seasons-details.component.scss']
})
export class SerialSeasonsDetailsComponent implements OnInit {

  showDrb = false;
  seasonsOptions = [
    {
      name: 'Season 1'
    },
    {
      name: 'Season 2'
    },
    {
      name: 'Season 3'
    },
    {
      name: 'Season 4'
    },
    {
      name: 'Season 5'
    }
  ];
  selectedSeason = this.seasonsOptions[0];

  episodesArr = [
    {
      name: '1 The Man at the Top',
      banner: 'https://i.ytimg.com/vi/TXfltmzRG-g/hqdefault.jpg',
      duration: '57m',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe! Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe!`
    },
    {
      name: '2 The Man at the Top',
      banner: 'https://i.ytimg.com/vi/TXfltmzRG-g/hqdefault.jpg',
      duration: '57m',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe! Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe!`
    },
    {
      name: '3 The Man at the Top',
      banner: 'https://i.ytimg.com/vi/TXfltmzRG-g/hqdefault.jpg',
      duration: '57m',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe! Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe!`
    },
    {
      name: '4 The Man at the Top',
      banner: 'https://i.ytimg.com/vi/TXfltmzRG-g/hqdefault.jpg',
      duration: '57m',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe! Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, saepe! Impedit, explicabo provident
      ipsa aspernatur qui officia voluptatem! Doloribus laboriosam, quibusdam perferendis laudantium placeat
      illum a velit deleniti vitae saepe!`
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }
}
