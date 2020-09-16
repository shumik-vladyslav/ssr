import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VodComponent } from './vod.component';
import { VodListComponent } from './vod-list/vod-list.component';
import { Routes, RouterModule } from '@angular/router';

const vodRoutes: Routes = [
  { path: '', component: VodComponent , pathMatch: 'full'},
]

@NgModule({
  declarations: [
    VodComponent,
    VodListComponent
  ],
  imports: [
    RouterModule.forChild(vodRoutes ),
  ],
})
export class VodModule { }
