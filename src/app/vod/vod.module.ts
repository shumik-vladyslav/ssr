import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VodComponent } from './vod.component';
import { VodListComponent } from './vod-list/vod-list.component';
import { Routes, RouterModule } from '@angular/router';
import { PlayermanagerComponent } from '../playermanager/playermanager.component';
import { VodHeaderComponent } from './vod-header/vod-header.component';
import { VodFooterComponent } from './vod-footer/vod-footer.component';

const vodRoutes: Routes = [
  { path: '', component: VodComponent , pathMatch: 'full'},
  { path: 'player', component: PlayermanagerComponent},
]

@NgModule({
  declarations: [
    VodComponent,
    VodListComponent,
    PlayermanagerComponent,
    VodHeaderComponent,
    VodFooterComponent
  ],
  imports: [
    RouterModule.forChild(vodRoutes ),
  ],
})
export class VodModule { }
