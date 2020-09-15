import { SecondComponent } from './../components/second/second.component';
import { FirstComponent } from './../components/first/first.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FirstComponent
  },
  {
    path: 'seccond',
    component: SecondComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
