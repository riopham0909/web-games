let azAdWrapper;
const sgSdk = (function () {
  // window['console']['log'] = () => {};
  let config;
  let adPlaying = false;
	let focused = false;

  function initialize(moduleArray, _config, callBack) {
    config = _config;
    const getCurrentLanguage = (supportedLanguages) => {
      // ?lang=en
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      });
      if (params.lang) {
          return params.lang;
      }
      let lang = (navigator.language || navigator.userLanguage).substr(0, 2);

      if (supportedLanguages.indexOf(lang) === -1) {
        lang = 'en';
      }

      return lang;
    };
    const settings = {
      config: {
        rewarded: {
          enabled: true,
        },
        env: {
          locale: getCurrentLanguage(config.supportedLanguages),
        },
        user: {
          avatar: "",
          avatarBase64: "",
          name: "Fake User",
          userId: "1234"
        }
      },
    };
    var integrationVars =  window['_azerionIntegration'];

    if (window.hasOwnProperty('fbrqSA') && window['fbrqSA'] === true) {
      h5branding.Utils.ASSET_LOCATION = 'assets/';
    }
    console.error(integrationVars);
    h5branding.SplashLoader.getInstance({
      gameId: integrationVars.gdId,
      gameName: "Dog Puzzle Story",
      gameTitle: "Dog Puzzle Story",
      libs: [],
      version: '1.0',
    }).create()
      .then(() => {
        azAdWrapper = new h5ads.AdWrapper(integrationVars.advType, integrationVars.gdId);
        callBack(null, settings, sgSdk);
      })
      .catch((e) => {
        console.error('h5branding load loaded', e);
      });
  }

  function trigger(key, data, binder) {
    console.log(key, data, binder);
    switch (key) {
      case 'restore':
        restore(data);
        break;

      case 'loading.completed':
        loadingComplete(data);
        break;

      case 'loading.update':
        loadingUpdate(data);
        break;

      case 'levelStart':
        levelStart(data);
        break;

      case 'gameTracking':
      case 'start':
      case 'levelFinish':
        nothing(data);
        break;

      case 'save':
        save(data);
        break;

      case 'beforePlayButtonDisplay':
      case 'playButtonPressed':
        callbackCall(data);
        break;

      case "interstitialAd":
        showAD(data, binder);
        break;

      case 'rewardedAd':
        showADRewarded(data, binder);
        break;

      default:
        break;
    }
  }

  function nothing(data) {
    // we dont use this data for now
  }

  function restore(data) {
    const item = localStorage.getItem(data.key);

    data.callback(null, item);
  }

  function loadingComplete(data) {
    addListenerAdWrapper();
  
    h5branding.SplashLoader.getInstance().setLoadProgress(100);
    h5branding.SplashLoader.getInstance().setButtonCallback(() => {
        h5branding.SplashLoader.getInstance().destroy();
        showAD({
            callback: function callback() {
              data.callback.call();
              config.runGame();
            }
          })
    });

    addGameEvents();
  }

  function loadingUpdate(data) {
    h5branding.SplashLoader.getInstance().setLoadProgress(data.progressPercentage);
  }

  function levelStart(data) {
    // we dont use this data for now
  }

  function save(data) {
    localStorage.setItem(data.key, data.value);

    data.callback();
  }

  function callbackCall(data) {
    data.callback();
  }

  function addListenerAdWrapper() {
    azAdWrapper.on(h5ads.AdEvents.CONTENT_PAUSED, () => {
      console.log('CONTENT_PAUSED');
      pause();
      adPlaying = true;
    });

    azAdWrapper.on(h5ads.AdEvents.CONTENT_RESUMED, () => {
      console.log('CONTENT_RESUMED');
      adFinish();
    });
  }

  function addGameEvents() {
    focused = true;
    window.game.stage.disableVisibilityChange = true;
    window.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

    Phaser.Stage.prototype.visibilityChange = visibilityChange;

    window.game.onBlur.add(onBlur);
    window.game.onFocus.add(onFocus);
    window.game.onPause.add(onPause);
    window.game.onResume.add(onResume);
  }
  //ovveride internal method cuz if playing rewarded ad and switch tabs music will start playing behind ad
  function visibilityChange(event) {
    if (event.type === 'pagehide' || event.type === 'blur')
    {
      window.game.onBlur.dispatch(event);
    }
    else if (event.type === 'pageshow' || event.type === 'focus')
    {
      window.game.onFocus.dispatch(event);
    }
  }

  function onPause() {
    //for update resize when game paused
    window.game.time.gamePaused();
    window.game.sound.setMute();
  }

  function onResume() {
    //for update resize when game paused
    window.game.input.reset();
    window.game.time.gameResumed();
    window.game.sound.unsetMute();
  }

  function pause() {
    window.game.onPause.dispatch();
  }

  function resume() {
    if (focused === true) {
      window.game.onResume.dispatch();
    }
  }

  function onBlur() {
    focused = false;
    pause();
  }

  function onFocus() {
    focused = true;
    if (adPlaying === false) {
        resume();
    }
  }

  function adStart() {
    showLoader();
    adPlaying = true;
  }

  function adFinish() {
    window.focus();
    adPlaying = false;
    hideLoader();
    resume();
  }

  function showLoader() {
    let loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'block';
    }
  }

  function hideLoader() {
    let loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
  }

  function showAD(data, binder) {
    adStart();

    azAdWrapper.once(h5ads.AdEvents.CONTENT_RESUMED, () => {
      console.log('DEBUG: onAdComplete');
      data.callback.call(binder);
    });
    azAdWrapper.showAd(h5ads.AdType.interstitial);
  }

  function showADRewarded(data, binder) {
    adStart();

    let succeed = false;
    azAdWrapper.once(h5ads.AdEvents.AD_REWARDED, () => {
      succeed = true;
    });

    azAdWrapper.once(h5ads.AdEvents.CONTENT_RESUMED, () => {
      console.log('DEBUG: rewarded onAdComplete');
      azAdWrapper.preloadAd(h5ads.AdType.rewarded);
      data.callback.call(binder, succeed);
    });
    azAdWrapper.showAd(h5ads.AdType.rewarded);
  }

  function isAdPlaying() {
    return adPlaying;
  }

  return {
    initialize,
    trigger,
    isAdPlaying
  };
}());
