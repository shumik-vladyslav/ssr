import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vod-header',
  templateUrl: './vod-header.component.html',
  styleUrls: ['./vod-header.component.scss']
})
export class VodHeaderComponent implements OnInit {
  isOver = false;
  MouseOver() {
    this.isOver = !this.isOver;
  }
  isOverb = false;

  MouseOverb() {
    this.isOverb = !this.isOverb;
  }
  isOverc = false;
  MouseOverc() {
    this.isOverc = !this.isOverc;
  }
  clicked = false;
  onClick() {
    this.clicked = !this.clicked;
  }
  clickedb = false;
  onClickb() {
    this.clickedb = !this.clickedb;
  }
  clickedc = false;
  onClickc() {
    this.clickedc = !this.clickedc;
  }
  isOvera = false;
  MouseOvera() {
    this.isOvera = !this.isOvera;
  }


  constructor() { }

  ngOnInit(): void {
  }

}
