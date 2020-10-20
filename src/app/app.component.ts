import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { GeneralAppService } from './shared/service/general.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerService } from './shared/service/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
    },5000)
  }

  installApp(){
    // Update the install UI to remove the install button
    const butt = document.querySelector('#install-button') as HTMLDivElement;
  
    if (butt) {
      butt.setAttribute('disabled', 'true')
    }
  
    if (this.deferredPrompt)
    {
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.config = this.generalAppService.getConfig();
    this.generalAppService.dataChangeEventEmiter.subscribe(data => {
      this.config = data;
    });
    this.generalAppService.paramChangeEventEmiter.subscribe((param: any) => {
      console.log(param);
      this.param = param;

      if (isPlatformBrowser(this.platformId)) {
        let videoId = localStorage.getItem('id');
        let movie = localStorage.getItem('movie');
        console.log(videoId);
        console.log(movie);
        console.log(param);
        console.log(this._router.url);

        if (!videoId || videoId === 'undefined') {
          videoId = param.DefaultChannelID;

          console.log();
          let params = {};
          params['id'] = videoId;
          params['movie'] = param.defaultMovId;

          this._router.navigate(["player", params]);
        } else {

          if ((this._router.url === "/") && (this.param.startingYoutubeMovId || videoId)) {
            console.log(videoId);

            let params = {};
            params['id'] = videoId;

            if (movie && videoId !== 'undefined')
              params['movie'] = movie;

            this._router.navigate(["player", params]);
          }
        }

      }
    });
    this.generalAppService.generalParamsLoaded.subscribe(loaded => {
      this.loaded = loaded
    })
  }
}
