function imaAds()
{
  this.init = function(caller, contentElementId, adContainerId, forceNotPreload)  {
    try
    {
      this.caller = caller;
      this.adContainerId = adContainerId;
      this.videoContent = document.getElementById(contentElementId);
      this.isContainerInited = false;
      this.adWidth = 640;
      this.adHeight = 400;
      this.canPreload = false;
      this.canPreload = this.checkIfcanPreload();

      // ??
      if (forceNotPreload) {
        this.canPreload=false;
      }

      this.setUpIMA();

      //  initRecieveMsg();
    }
    catch(e) {
      console.error('ads.js init error: '+e)
    }
  }

  this.setUpIMA = () => {

    try
    {
      var lineId = 0;
      // STEP 1
      // Create the ad display container.
      lineId = 1;
      this.createAdDisplayContainer();

      lineId = 2;
      // STEP 2
      // Create ads loader.
      this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

      lineId = 3;
      // Listen and respond to ads loaded and error events.

      this.adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        this.onAdsManagerLoaded,
        false);

      lineId = 4;
      this.adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        this.onAdError,
        false);

      lineId=5;
      // An event listener to tell the SDK that our content video
      // is completed so the SDK can play any post-roll ads.
      var contentEndedListener = function () { this.adsLoader.contentComplete(); };
      lineId=6;
      // this.videoContent.onended = this.contentEndedListener;
      lineId=7;
      // Request video ads.

    }
    catch(e) {
      console.error('ads.js setUpIMA error: ' + lineId + " " + e)
    }
  }

  this.createAdDisplayContainer = function() {

    try {
      // We assume the adContainer is the DOM id of the element that will house the ads.
      this.adDisplayContainer = new google.ima.AdDisplayContainer(
        document.getElementById(this.adContainerId), this.videoContent);
    } catch(e) {
      console.error('ads.js createAdDisplayContainer error ' + e)
    }
  };

  this.setVolume = function(val) {

    if (this.adsManager)
      this.adsManager.setVolume(val)
  }

  this.initAdContainer=function() {

    if (!this.isContainerInited)
    {
      this.isContainerInited = true;
      this.adDisplayContainer.initialize();
    }
  }

  this.playAd = function() {
    try
    {

      this.initAdContainer();
      if (this.adsManager &&  this.isAdManagerLoaded)
      {
        this.adsManager.start();
        this.caller.onStartPlaying();
        //setTimeout( ()=> { this.adsManager.pause();}, 2000)
      }
      else
      {
        this.isWaitimgForAdsManagerToStart = true;
        this.caller.onWaitingForAdsManager();
      }
    }
    catch(e)
    {
      console.error('ads.js playAd error'+e)
    }

  }

  this.onAdError = (adErrorEvent) =>  {

    try
    {
      // Handle the error logging and destroy the AdsManager
      var getErr = adErrorEvent.getError();

      this.prepareForNextAd();
      this.caller.onAdError(getErr.h, getErr.l, getErr.o);
    }
    catch(e)
    {
      console.error('ads.js onAdError error'+e);
    }
  }
  // An event listener to tell the SDK that our content video
  // is completed so the SDK can play any post-roll ads.
  // var contentEndedListener = function () { this.adsLoader.contentComplete(); };
  // videoContent.onended = contentEndedListener;
  // var playButton = document.getElementById('playButton');
  //playButton.addEventListener('click', requestAds);

  this.requestAds = (adLink) => {
    try {
      this.caller.onAdLoading();

      this.adLink = adLink;

      var adsRequest = new google.ima.AdsRequest();
      adsRequest.linearAdSlotWidth = this.adWidth;
      adsRequest.linearAdSlotHeight = this.adHeight;
      adsRequest.nonLinearAdSlotWidth = this.adWidth;
      adsRequest.nonLinearAdSlotHeight = this.adHeight;
      adsRequest.adTagUrl = adLink;
      this.adsLoader.getSettings().setAutoPlayAdBreaks(false);


      this.adsLoader.requestAds(adsRequest);
      this.isAdManagerLoaded = false;

      //alert('requestAds');
    } catch(e) {
      //alert('ads.js requestAds error')
    }

  }

  this.onAdsManagerLoaded=(adsManagerLoadedEvent) => {

    var lineId = 0;

    try {
      this.isAdManagerLoaded = true;
      lineId = 1;
      var adsRenderingSettings = new google.ima.AdsRenderingSettings();

      if (this.canPreload) {
        lineId = 2;
        adsRenderingSettings.enablePreloading = true;
      }

      lineId = 3;
      // Get the ads manager.
      this.adsManager = adsManagerLoadedEvent.getAdsManager(
        this.videoContent, adsRenderingSettings);  // See API reference for contentPlayback

      lineId = 4;
      // Add listeners to the required events.
      this.adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        this.onAdError);

      lineId = 5;
      this.adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        this.onContentPauseRequested);

      lineId = 6;
      this.adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        this.onContentResumeRequested);

      lineId = 7;
      this.adsManager.addEventListener(
        google.ima.AdEvent.Type.AD_BREAK_READY,
        this.adBreakReadyHandler);

      lineId = 8;
      this.adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        this.onAdStartedPlaying);

      lineId = 9;
      try {
        lineId = 12;

        // Initialize the ads manager. Ad rules playlist will start at this time.
        this.adsManager.init(this.adWidth, this.adHeight, google.ima.ViewMode.NORMAL);
        // Call start to show ads. Single video and overlay ads will
        // start at this time; this call will be ignored for ad rules, as ad rules
        // ads start when the adsManager is initialized.
        // if (!this.canPreload)
        //    adsManager.start();
        lineId = 13;
      } catch (adError) {

        console.error("onAdsManagerLoaded"+adError)

        // An error may be thrown if there was a problem with the VAST response.
        // Play content here, because we won't be getting an ad.
        //videoContent.play();
      }

      if (this.isWaitimgForAdsManagerToStart) {
        lineId = 10;
        this.isWaitimgForAdsManagerToStart = false;
        this.adsManager.start();
        this.caller.onStartPlaying();
        lineId = 11;
      }
      else {
        this.caller.onAdsManagerLoaded();
      }
    }
    catch(e)    {
      //alert('onAdsManagerLoaded error'+e);
      console.error('ads.js onAdsManagerLoaded error'+lineId+" " +e)
    }
  }

  this.adBreakReadyHandler=()=>  {

  }

  this.onContentPauseRequested = () =>  {
    // This function is where you should setup UI for showing ads (e.g.
    // display ad timer countdown, disable seeking, etc.)
    // videoContent.removeEventListener('ended', contentEndedListener);
    // videoContent.pause();
  }

  this.onContentResumeRequested = () =>  {
    // This function is where you should ensure that your UI is ready
    // to play content.
    // videoContent.addEventListener('ended', contentEndedListener);
    //videoContent.play();

    // console.log(`on ads.js ==>> this.onContentResumeRequested`)

    this.caller.onAdCompleted();

    this.prepareForNextAd();
  }

  this.onAdStartedPlaying = () =>  {

    let rT = this.adsManager.getRemainingTime();

    if (rT < 1) {
      setTimeout(() => {
        this.onAdStartedPlaying();
      }, 500);
    } else {
     /*
      setTimeout(() =>
      {
        this.prepareForNextAd();
        this.caller.onAdError("", "", "");
      }, 3000);
     */
      this.caller.onAdPlaying(rT);
    }
  };

  this.prepareForNextAd = function()  {

    this.isWaitimgForAdsManagerToStart = false;
    console.log('prepareForNextAd adsManager: ');
    console.log( this.adsManager );
    console.log(" adsLoader: ");
    console.log(this.adsLoader);

    if (this.adsLoader) {
      this.adsLoader.contentComplete()
    }

    if (this.adsManager) {
      this.adsManager.destroy();
      console.error('adsManager.destroy() !!')
    }
  };

  this.setSize=function(width, height)  {

    try {
      this.adWidth = Number(width);
      this.adHeight = Number(height);

      if (this.adsManager) {
        this.adsManager.resize(Number(width), Number(height), google.ima.ViewMode.NORMAL)
      }
    }
    catch (e) {

      console.error("ima sdk iframe setSize error"+e)
    }
  }

  this.getAndroidVersion=function(ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
  };

  this.checkIfcanPreload=function()  {

    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    return !(iOS || parseFloat(this.getAndroidVersion()) < 4.0);
  }

  this.pauseAd = function() {
    if (this.adsManager)
      this.adsManager.pause();
  }
}

