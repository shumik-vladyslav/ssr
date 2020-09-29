import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VodModule } from './vod/vod.module';
import { HttpClientModule } from '@angular/common/http';
import { VodFooterComponent } from './vod/vod-footer/vod-footer.component';
import { VodHeaderComponent } from './vod/vod-header/vod-header.component';
import { PlayermanagerComponent } from './playermanager/playermanager.component';
import { VodListComponent } from './vod/vod-list/vod-list.component';
import { VodComponent } from './vod/vod.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    AppComponent,
    VodComponent,
    VodListComponent,
    PlayermanagerComponent,
    VodHeaderComponent,
    VodFooterComponent
  ],
  imports: [
    YouTubePlayerModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    // VodModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
