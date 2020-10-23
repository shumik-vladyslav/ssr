import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VodComponent } from './vod/vod.component';
import { PlayermanagerComponent } from './playermanager/playermanager.component';
import { VodItemComponent } from './vod/vod-item/vod-item.component';
import { VodListComponent } from './vod/vod-list/vod-list.component';
import { VodPageInfoComponent } from './vod/vod-page-info/vod-page-info.component';

const routes: Routes = [
  { path: '', component: VodComponent, children: [
    { path: 'channels', component: VodListComponent},
    { path: 'channel', component: VodItemComponent},
    { path: 'page', component: VodPageInfoComponent},
  ]},
  { path: 'player/:id', component: PlayermanagerComponent},
  { path: 'player', component: PlayermanagerComponent},
  { path: '**', redirectTo: 'vod' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
