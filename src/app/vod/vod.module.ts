import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VodComponent } from './vod.component';
import { VodListComponent } from './vod-list/vod-list.component';
import { Routes, RouterModule } from '@angular/router';
import { PlayermanagerComponent } from '../playermanager/playermanager.component';

const vodRoutes: Routes = [
  { path: '', component: VodComponent , pathMatch: 'full'},
  { path: 'player', component: PlayermanagerComponent},
]

@NgModule({
  declarations: [
    VodComponent,
    VodListComponent,
    PlayermanagerComponent
  ],
  imports: [
    RouterModule.forChild(vodRoutes ),
  ],
})
export class VodModule { }
