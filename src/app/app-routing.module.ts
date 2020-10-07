import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VodComponent } from './vod/vod.component';
import { PlayermanagerComponent } from './playermanager/playermanager.component';

const routes: Routes = [
  { path: '', component: VodComponent},
  { path: 'vod', component: VodComponent},
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
