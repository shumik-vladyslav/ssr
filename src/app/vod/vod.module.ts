import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VodComponent } from './vod.component';
import { VodListComponent } from './vod-list/vod-list.component';
import { Routes, RouterModule } from '@angular/router';
import { PlayermanagerComponent } from '../playermanager/playermanager.component';
import { VodHeaderComponent } from './vod-header/vod-header.component';
import { VodFooterComponent } from './vod-footer/vod-footer.component';

import {YouTubePlayerModule} from '@angular/youtube-player';
import { CommonModule } from '@angular/common';

const vodRoutes: Routes = [
 
]

@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(vodRoutes ),
  
  ]
})
export class VodModule { }
