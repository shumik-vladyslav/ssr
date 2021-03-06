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
import { GeneralAppService } from './shared/service/general.service';
import { ListService } from './shared/service/list.service';
import { PlayerService } from './shared/service/player.service';
import { ArraySortPipe } from './shared/pipe/sort.pipe';
import { MaterialModule } from "./shared/material.module";
import { TimeDateUtilsService } from './shared/service/utils/time-date-utils.service';
import { LiveYoutubeControlsComponent } from './playermanager/live-youtube-controls/live-youtube-controls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VodItemComponent } from './vod/vod-item/vod-item.component';
import { RowListPipe } from './shared/pipe/row-list.pipe';
import { VodPageInfoComponent } from './vod/vod-page-info/vod-page-info.component';
import { CurrentDatePipe } from './shared/pipe/current-date.pipe';
import { SortByListPipe } from './shared/pipe/sort-by-list.pipe';
import { SerialSeasonsDetailsComponent } from './vod/componets/serial-seasons-details/serial-seasons-details.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { FilterBySeasonPipe } from './vod/componets/serial-seasons-details/filter-by-season.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ArraySortPipe,
    RowListPipe,
    CurrentDatePipe,
    SortByListPipe,
    VodComponent,
    VodListComponent,
    VodItemComponent,
    PlayermanagerComponent,
    VodHeaderComponent,
    VodFooterComponent,
    LiveYoutubeControlsComponent,
    VodPageInfoComponent,
    SerialSeasonsDetailsComponent,
    FilterBySeasonPipe
  ],
  imports: [
    MaterialModule,
    YouTubePlayerModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    ClickOutsideModule
    // VodModule,
  ],
  providers: [GeneralAppService, ListService, PlayerService, 
    TimeDateUtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
