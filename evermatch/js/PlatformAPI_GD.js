    var NetworkPlatformApi = {

      payments : null,

      init: function () {
        setTimeout(function() {
          NetworkPlatformApi.initSuccessCallback();
        }, 1);

        this.initPageVisibilityStateListener();
      },

      initSuccessCallback: function(){
        var response = {'response': 'success'};
        NetworkPlatformApi.sendMessage('OnInitComplete', JSON.stringify(response));
      },

      initErrorCallback: function(error){
        console.log("initErrorCallback");

        var response = {'error': error};
        NetworkPlatformApi.sendMessage('OnInitComplete', JSON.stringify(response));
      },

      sendMessage: function(method, param) {
        AppPage.unityInstance.SendMessage("SocialNetworkJsBridge", method, param);
      },

      openAuthDialog: function(uid, callbackMethodName){
          NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"result" : true});
      },

      getPlayer: function(uid, callbackMethodName){
		var data = {
		  "uid"               : get_user_id(),
		  "first_name"        : "",
		  "last_name"         : "",
		  "gender"            : "",
		  "mode"              : "",
		  "pic50x50"          : 'small',
		  "pic128x128"        : 'medium',
		  "avatarUrlLarge"    : 'large'
		};

		NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"result" : data, "data" : data, "status" : "ok"});
      },

      getPayments: function(uid, callbackMethodName){
          console.log("Payments not available on GD");
          NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : "Payments not available on GD"});
      },

      getPurchases: function (uid, callbackMethodName) {
        console.log("Purchases not available on GD");
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : "Purchases not available on GD"});
      },

      consumePurchase: function (purchaseToken, uid, callbackMethodName) {
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, { "result": true });
      },

      showPayment: function(productName, productDescription, productCode, productPrice, paymentAttr, uid, callbackMethodName){
        if(!this.payments){
          NetworkPlatformApi.uiCallback.call(
            null,
            uid,
            callbackMethodName,
            {
              "error" : {
                "code" : 0,
                "message" : "Prepare payments by method: getPayments"
              }
            });

          return;
        }
      },

      loadRewardedAd: function(uid, callbackMethodName){
        if (gdsdk !== 'undefined' && gdsdk.preloadAd !== 'undefined') {
			gdsdk
				.preloadAd('rewarded')
				.then(response => {
				  // A rewarded ad can be shown to user when he/she clicked it.
				  console.log("[GD] A rewarded ad can be shown to user when he/she clicked it.");
				  NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"method" : "loadAd", "result": "ok", "data": "ready"});
				})
				.catch(error => {
				  // Any Rewarded ad is not available to user.
				  console.log("[GD] Any Rewarded ad is not available to user.");
				  NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"method" : "loadAd", "result": "error", "data": "error"});
				});
		}
		
		//NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"method" : "loadAd", "result": "ok", "data": "ready"});
      },
	  
	  isAdPlaying: false,
	  isAdRewarded: false,

      showRewardedAd: function(uid, callbackMethodName){
		if (gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
			NetworkPlatformApi.isAdPlaying = true;
			NetworkPlatformApi.isAdRewarded = false;
			gdsdk.showAd('rewarded')
			.then(response => {
			  NetworkPlatformApi.isAdPlaying = false;
			  // Ad process done. You can track "SDK_REWARDED_WATCH_COMPLETE" event if that event triggered, that means the user watched the advertisement completely, you can give reward there.
			  console.log("[GD] Ad process done. You can give reward there.");
			  if(NetworkPlatformApi.isAdRewarded){
                  NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"rewarded" : true, "method" : "showLoadedAd", "result": "ok", "data": "complete"});
              }else{
                  NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"rewarded" : false, "method" : "showLoadedAd", "result": "error", "data": "skip"});
              }
			})
			.catch(error => {
			  // An error catched. Please don't give reward here.
			  console.log("[GD] An error catched. Please don't give reward here.");
			  NetworkPlatformApi.isAdPlaying = false;
			  NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : error, "method" : "showLoadedAd", "result": "error", "data": "not_prepared"});
			});
		}
      },

      showInterstitialAd: function(openUid,closeUid,errorUid, onOpenMethodName, onCloseMethodName, onErrorMethodName){
		if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
			NetworkPlatformApi.interstitialState.isInterStarted = true;
			NetworkPlatformApi.interstitialState.openId = openUid;
			NetworkPlatformApi.interstitialState.openMethod = onOpenMethodName;
			NetworkPlatformApi.interstitialState.closeId = closeUid;
			NetworkPlatformApi.interstitialState.closeMethod = onCloseMethodName;
			NetworkPlatformApi.interstitialState.errorId = errorUid;
			NetworkPlatformApi.interstitialState.errorMethod = onErrorMethodName;
			
			NetworkPlatformApi.isAdPlaying = true;
			
			gdsdk.showAd()			
			.then(response => {
				// Ad process done. You can track "SDK_REWARDED_WATCH_COMPLETE" event if that event triggered, that means the user watched the advertisement completely, you can give reward there.
				console.log("[GD] Ad Inter process done. You can give reward there.");
				NetworkPlatformApi.interstitialState.isInterStarted = false;
				NetworkPlatformApi.isAdPlaying = false;
				NetworkPlatformApi.uiCallback.call(null, closeUid, onCloseMethodName, {"state" : "Close", "wasShown" : true, "data" : "complete"});
			})
			.catch(error => {
				// An error catched. Please don't give reward here.
				console.log("[GD] An Inter error catched. Please don't give reward here.");
				NetworkPlatformApi.interstitialState.isInterStarted = false;
				NetworkPlatformApi.isAdPlaying = false;
				NetworkPlatformApi.uiCallback.call(null, closeUid, onCloseMethodName, {"state" : "error", "wasShown" : false, "data" : "complete"});
			});
		}
      },
	  
	  interstitialState: {
		  isInterStarted: false,
		  openId: null,
		  openMethod: null,
		  closeId: null,
		  closeMethod: null,
		  errorId: null,
		  errorMethod: null
	  },
	  
	  prerollComleted: false,
	  
	  AdComplete: function(event){
			NetworkPlatformApi.isAdPlaying = false;
			switch (event.adPosition) {
				case "preroll":
					console.log("[GD] Preroll completed");
					NetworkPlatformApi.prerollComleted = true;
					NetworkPlatformApi.sendMessage("OnPageFocus", "show");
					break;
				case "midroll":
					console.log("[GD] Midroll completed");
					NetworkPlatformApi.prerollComleted = true;
					if(NetworkPlatformApi.interstitialState.isInterStarted) {  
						NetworkPlatformApi.interstitialState.isInterStarted = false;
						var closeUid = NetworkPlatformApi.interstitialState.closeId, 
						onCloseMethodName = NetworkPlatformApi.interstitialState.closeMethod;
						
						//NetworkPlatformApi.uiCallback.call(null, closeUid, onCloseMethodName, {"state" : "Close", "wasShown" : true, "data" : "complete"});
					}
					break;
				case "rewarded":
					console.log("[GD] Rewarded completed");
					break;
			}
	  },
	  
	  GetPrerollComleted: function(){
        var resultObj = NetworkPlatformApi.prerollComleted ? 1 : 0;
        return resultObj;
      },

      showAppRating: function(uid, callbackMethodName){
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : "Not available"});
      },

      copyToClipboard: function(text){
            var textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.setAttribute("readonly", "");
            textArea.style.position = "absolute";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
      },

      uiCallback: function(uid, callbackMethodName, response) {
        response = {'callback_id': uid, 'response': response};
        NetworkPlatformApi.sendMessage(callbackMethodName, JSON.stringify(response));
      },

      initPageVisibilityStateListener: function(){
        // Set the name of the hidden property and the change event for visibility
        var hidden;
        var visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
          hidden = "hidden";
          visibilityChange = "visibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          hidden = "msHidden";
          visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }
		window.HiddenTag = hidden;

        // If the page is hidden, pause the video;
        // if the page is shown, play the video
        function handleVisibilityChange() {
			if(!NetworkPlatformApi.isAdPlaying)
			{
			  if (document[hidden]) {
				console.log("pause")
				NetworkPlatformApi.sendMessage("OnPageFocus", "hide");
			  } else {
				console.log("play")
				NetworkPlatformApi.sendMessage("OnPageFocus", "show");
			  }
			}
        }

        // Warn if the browser doesn't support addEventListener or the Page Visibility API
        if (typeof document.addEventListener === "undefined" || hidden === undefined) {
          console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
        } else {
          // Handle page visibility change
          document.addEventListener(visibilityChange, handleVisibilityChange, false);
        }
      },

      setLBscore: function(leaderboardNameString, scoreValue, extraCommentString) {
      },

      getLBscore: function(uid, callbackMethodName, leaderboardNameString) {
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : "LEADERBOARD_PLAYER_NOT_PRESENT"});
      },

      addLBscore: function(leaderboardNameString, scoreValue, extraCommentString) {
      },

      apiCallback: function(callback_id, status, data, error) {  // вероятно это не нужно
          var response = {
              'callback_id'   : callback_id,
              'response': {
                  'status'    : status,
                  'data'      : data,
                  'error'     : error
              }
          };

          NetworkPlatformApi.sendMessage('OnSocialApiComplete', JSON.stringify(response));
      },

      api: function(method, params, callback_id) {
      },

      showInvite: function(message, params, selectedUids, uid, callbackMethodName) {
      },

      showNotification: function(message, params, selectedUids, uid, callbackMethodName) {
      },

      showAskPermissions: function(permissions, uid, callbackMethodName){
      },

      postMediatopic: function(attachments, status, uid, callbackMethodName){
      },

      isAdBlockEnabled: function(uid, callbackMethodName){
      },

      requestBannerAds: function(uid, callbackMethodName){
      },

      showBannerAds: function(uid, callbackMethodName, position, layoutType, canClose){
      },

      hideBannerAds: function(uid, callbackMethodName){
      },

      isBannerAdsVisible: function(uid, callbackMethodName){
      },

      requestFullscreen: function(){
      },

      requestScrollToFrame: function(){
      },

      appBannerAdClosedByUser: function(uid, callbackMethodName){
      },

      appBannerAdUpdated: function(uid, callbackMethodName){
      },

      achieveGetList: function(uid, callbackMethodName) {
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : ""});
      },

      achieveGetProgress: function(uid, callbackMethodName, achieveIdString) {
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : ""});
      },

      achieveSetProgress: function(uid, callbackMethodName, achieveIdString, progress) {
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : ""});
      },

      achieveUnlock: function(uid, callbackMethodName, achieveIdString) {
        NetworkPlatformApi.uiCallback.call(null, uid, callbackMethodName, {"error" : err});
      },

      sendGameReady: function() {
      }

    }
