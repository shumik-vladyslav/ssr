import { AfterViewInit, Component, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { GeneralAppService } from './shared/service/general.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService } from './shared/service/player.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListService } from './shared/service/list.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  config;
  param;
  loaded;
  deferredPrompt

  @HostListener('window:beforeinstallprompt', ['$event']) onBeforeInstallPrompt(event) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt

    event.preventDefault();

    // Stash the event so it can be triggered later.
    this.deferredPrompt = event;
    // Update UI notify the user they can add to home screen
    // console.log('Before install event stashed')
    // Update the install UI to notify the user app can be installed
    const butt = document.querySelector('#install-button') as HTMLDivElement;

    if (butt) {
      butt.setAttribute('disabled', 'false')
    }

    setTimeout(() => {
      this.installApp();
    }, 5000)
  }

  installApp() {
    // Update the install UI to remove the install button
    const butt = document.querySelector('#install-button') as HTMLDivElement;

    if (butt) {
      butt.setAttribute('disabled', 'true')
    }

    if (this.deferredPrompt) {
      // Show the modal add to home screen dialog
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('Appppppppppppppppp    User accepted the A2HS prompt     Appppppppppppppppp');

        } else {
          console.log('Appppppppppppppppp   User dismissed the A2HS prompt  Appppppppppppppppp');
        }
        // Clear the saved prompt since it can't be used again
        this.deferredPrompt = null;
      });
    }
  }


  constructor(
    private generalAppService: GeneralAppService,
    private playerService: PlayerService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private listService: ListService,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.config = this.generalAppService.getConfig();
    this.generalAppService.dataChangeEventEmiter.subscribe(data => {
      this.config = data;
    });
    this.generalAppService.paramChangeEventEmiter.subscribe((param: any) => {
      console.log(param);
      this.param = param;

      title.setTitle(param.metaTitleTxt);


      if (isPlatformBrowser(this.platformId)) {
        let videoId = localStorage.getItem('id');
        let movie = localStorage.getItem('movie');

        if (localStorage.getItem('user_accept_cookies') !== 'true') {
          this.openSnackBar(param.cookieNotificationMessage, 'Agree').subscribe(() => {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('user_accept_cookies', 'true')
            }
            this._snackBar.dismiss();
          });
        }


        console.log(videoId);
        console.log(movie);
        console.log(param);
        console.log(this._router.url);

        if (this._router.url === "/" || this._router.url === "") {
          if (!videoId || videoId === 'undefined') {
            videoId = param.DefaultChannelID;

            let params = {};
            let userTimeOffset = new Date().getTimezoneOffset();
            let now2 = moment().format('DD/MM/YYYY');

            params['id'] = videoId;

            // this.listService.getChannelMovies(videoId).subscribe((data: any) => {
            //   params['movie'] = data[0].YoutubeVideoListID;
            //   this._router.navigate(["player", params]);
            // });

            this.playerService.getMinifiedChannelDayEpg({ channelID: +videoId, userTimeOffset: userTimeOffset.toString(), epgDate: now2 }).subscribe((res: any) => {
              console.log(res);
              params['movie'] = res[0].MovID;
              params['fromStart'] = true;
              this._router.navigate(["player", params]);
            });

          } else {
            console.clear()
            console.log(videoId);
            console.log(this.param.startingYoutubeMovId);
            console.log(this.param);

            let params = {};
            params['id'] = videoId;

            if (movie && videoId !== 'undefined')
              params['movie'] = movie;
            params['fromStart'] = true;
            this._router.navigate(["player", params]);
          }
        }


      }
    });
    this.generalAppService.generalParamsLoaded.subscribe(loaded => {
      this.loaded = loaded
    })
  }

  ngAfterViewInit(): void {
    document.getElementById("main-wrap").onfullscreenchange = () => {
      this.playerService.isFullScreen = !this.playerService.isFullScreen;
      this.generalAppService.fullScreenStatus.next(this.playerService.isFullScreen);
    };
  }
  
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('scrollPosition');
    }
  }
  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action).onAction();
  }
}
