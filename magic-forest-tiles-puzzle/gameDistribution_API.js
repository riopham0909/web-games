//V6.4 (midroll on exit if reward + fix resumeOnForeground)
if(typeof gameConfig.AdsWaitForInput === "undefined") gameConfig.AdsWaitForInput = true;	//handle default to support old index-config with the new SDK
if(typeof gameConfig.gameHasRewarded !== "boolean") gameConfig.gameHasRewarded = false;	//handle default to support old index-config with the new rewarded

function onVisibilityChanged() {
	if(typeof cr_setSuspended === "function") cr_setSuspended(!!(document.hidden || document.mozHidden || document.webkitHidden || document.msHidden));
};

document.addEventListener("visibilitychange", onVisibilityChanged, false);
document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
document.addEventListener("msvisibilitychange", onVisibilityChanged, false);


var adsIsQueued = false, rewardedIsReady = false, rewardedIsLoading = false, rewardedIsRequested = false, c2CB = {onSuccess:[], onFail:[]}, C2cbOnVideoDidAppear="", C2cbOnVideoDidDisappear ="", C2cbOnFail ="";

function queueAds(){
	adsIsQueued = true;
}

function unQueueAds(){
	adsIsQueued = false;
	if(typeof gdsdk !== "undefined" && gdsdk.showAd !== "undefined") gdsdk.showAd();
}

function onTouchEvent(){
	if(rewardedIsRequested) return false;
	if(adsIsQueued){
		if($("#preroll_play_bg, #preroll_play_over_bg, #preroll_play_frame").length){
			$("#preroll_play_bg, #preroll_play_over_bg, #preroll_play_frame").remove();
			if(typeof cr_setSuspended === "function") cr_setSuspended(false);
			$("#c2canvas").show();
		}
		unQueueAds();
	}
}

document.addEventListener("mouseup", onTouchEvent, false);
document.addEventListener("touchend", onTouchEvent, false);


function c2LayoutChange(state,name,force){
	if(gameConfig.gameHasRewarded){
		if(state === "out" && name.toLowerCase() === "gameover"){
			if(gameConfig.debugMode) console.log("(game break) gdsdk.showAd()");
			if(typeof gdsdk !== "undefined" && gdsdk.showAd !== "undefined") gdsdk.showAd();
		}
	}else{
		if(state === "in" && name.toLowerCase() === "gameover"){
			if(gameConfig.debugMode) console.log("(game break) gdsdk.showAd()");
			if(typeof gameConfig.AdsWaitForInput === "boolean" && gameConfig.AdsWaitForInput) queueAds();
			else if(typeof gdsdk !== "undefined" && gdsdk.showAd !== "undefined") gdsdk.showAd();
		}
	}
	
}

//ROTATOR START
var onMobile, reallyOnMobile; onMobile = reallyOnMobile = (navigator.userAgent.match(/(mobile|android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi));
function checkOrientation(){
	if(!gameConfig.activeRotator || !reallyOnMobile){
		hideRotator();
		return true;
	}
	if(gameConfig.gameIsPortrait && jQuery(window).width() > jQuery(window).height()){
		displayRotator('portrait');
		return false;
	}
	if(!gameConfig.gameIsPortrait && jQuery(window).width() < jQuery(window).height()){
		displayRotator('landscape');
		return false;
	}
	hideRotator();
	return true;
}

function displayRotator(orientation){
	var gameElement = document.getElementById("c2canvasdiv");
	var rotatorElement = document.getElementById("rotator");
	if(rotatorElement.style.display != "none") return false;
	if(typeof cr_setSuspended === "function") cr_setSuspended(true);
	gameElement.style.display = "none";
	rotatorElement.innerHTML = "";
	rotatorElement.innerHTML = '<img id="rotatorLogo" src="./rotate-device-to-' + orientation + '.jpg" />';
	rotatorElement.style.display = "block";
	rotatorElement.style.backgroundColor = "black";
	rotatorElement.style.width = "100%";
	rotatorElement.style.height = "100%";
	window.centerRotatorTimer = setInterval(function(){	centerRotator();	}, 100);
	return true;
}

function centerRotator(){
	var rotatorElement = document.getElementById("rotator");
	rotatorElement.style.paddingLeft = jQuery(window).width() / 2 - jQuery("#rotatorLogo").width() / 2 +"px";
	rotatorElement.style.paddingTop = jQuery(window).height() / 2 - jQuery("#rotatorLogo").height() / 2 +"px";
	rotatorElement.style.paddingBottom = jQuery(window).height() / 2 - jQuery("#rotatorLogo").height() / 2 +"px";
}

function hideRotator(){
	var gameElement = document.getElementById("c2canvasdiv");
	var rotatorElement = document.getElementById("rotator");
	if(rotatorElement == null) return false;
	if(rotatorElement.style.display == "none") return false;
	rotatorElement.innerHTML = "";
	rotatorElement.style.display = "none";
	gameElement.style.display = "block";
	cr_setSuspended(false);
	clearInterval(window.centerRotatorTimer);
	return true;
}

var waitForJQ = setInterval(function(){
		if(typeof jQuery === "undefined") return;
		jQuery(document).ready(function (){
			if(checkOrientation() || !gameConfig.activeRotator)	hideRotator();
			if(gameConfig.activeRotator && reallyOnMobile){
				jQuery(window).resize(function(){
					if(checkOrientation())	hideRotator();
				});
			}
		});
		clearInterval(waitForJQ);
	},100);

//ROTATOR END
function loadGame(){			
	if(typeof cr_createRuntime === "function") cr_createRuntime("c2canvas");
	else setTimeout(loadGame, 500);
}

function preloadReward(){
	if(!gameConfig.gameHasRewarded || rewardedIsReady || rewardedIsLoading || typeof gdsdk === "undefined" || typeof gdsdk.preloadAd === "undefined") return;
	rewardedIsLoading = true;
	gdsdk
		.preloadAd('rewarded')
		.then(function(response){
			rewardedIsReady = true;
			rewardedIsLoading = false;
			console.log("reward ready", response);
			for(var f=0;f<c2CB.onSuccess.length;f++) c2_callFunction(c2CB.onSuccess[f], [1]);
		})
		.catch(function(error){
			console.log("reward fail", error);
			rewardedIsLoading = false;
			for(var f=0;f<c2CB.onFail.length;f++) c2_callFunction(c2CB.onFail[f], [0]);
		});
}

function prepareTJEvent(eventName, forceParam, C2cbOnReadyStateTrue, C2cbOnReadyStateFalse, repeat, retry){
	if(typeof C2cbOnReadyStateTrue === "string" && C2cbOnReadyStateTrue !== "" && c2CB.onSuccess.indexOf(C2cbOnReadyStateTrue)) c2CB.onSuccess.push(C2cbOnReadyStateTrue);
	if(typeof C2cbOnReadyStateFalse === "string" && C2cbOnReadyStateFalse !== "" && c2CB.onFail.indexOf(C2cbOnReadyStateFalse)) c2CB.onFail.push(C2cbOnReadyStateFalse);
	preloadReward();
}

function isIVAvailable(eventName){
	return (rewardedIsReady) ? "1" : "0";
}

function isTJEventReady(eventName){
	return isIVAvailable(eventName);
}

function promptTJEvent(){return "0";}

function launchTJEvent(eventName, C2cbOnFail, C2cbOnVideoDidAppear, C2cbOnVideoDidDisappear, forceReload, fallBackOnOfferWall){
	if(isTJEventReady(eventName) !== "0" && typeof gdsdk !== "undefined" && typeof gdsdk.showAd !== "undefined"){
		window.C2cbOnFail = C2cbOnFail;
		window.C2cbOnVideoDidAppear = C2cbOnVideoDidAppear;
		window.C2cbOnVideoDidDisappear = C2cbOnVideoDidDisappear;
		if(gameConfig.debugMode) console.log("Launch rewarded");
		rewardedIsRequested=true;
		gdsdk.showAd('rewarded').then(response => {
			  // Ad process done. You can track "SDK_REWARDED_WATCH_COMPLETE" event if that event triggered, that means the user watched the advertisement completely, you can give reward there.
			if(gameConfig.debugMode) console.log("Rewarded succeded");
			c2_callFunction(C2cbOnVideoDidAppear, ["1"]);
			setTimeout(function(){	c2_callFunction(window.C2cbOnVideoDidDisappear, ["1"]);	}, 70);
			rewardedIsRequested=false;
		})
		.catch(error => {
		  // An error catched. Please don't give reward here.
			if(gameConfig.debugMode) console.log("Rewarded failed");
			c2_callFunction(window.C2cbOnFail, ["0"]);
			c2_callFunction(window.C2cbOnVideoDidDisappear, ["0"]);
			rewardedIsRequested=false;
		});
	}else{
		if(gameConfig.debugMode) console.log("Can't launch rewarded");
		c2_callFunction(window.C2cbOnFail, ["0"]);
		c2_callFunction(window.C2cbOnVideoDidDisappear, ["0"]);
	}
	rewardedIsReady = false;
	setTimeout(function(){	preloadReward();	}, 250);
	return;
}


window["GD_OPTIONS"] = {
     "gameId": gameConfig.gameId
    ,"onEvent": function(event) {
		if(gameConfig.debugMode) console.log("gdsdk.event(", event.name, ",", arguments, ")");
        switch (event.name) {
			case "SDK_ERROR":
				console.log("Error: ", arguments);
            case "SDK_READY":
				jQuery(document).ready(function(){
					loadGame();
					if(typeof gameConfig.AdsWaitForInput === "boolean" && gameConfig.AdsWaitForInput) queueAds();
					if(gameConfig.gameHasRewarded) preloadReward();
				});
				break;
            case "SDK_GAME_START":
				if(typeof cr_setSuspended === "function") cr_setSuspended(false);
                break;
            case "SDK_GAME_PAUSE":
				if(typeof cr_setSuspended === "function") cr_setSuspended(true);
				break;
			case "SDK_GDPR_TARGETING":
				// this event is triggered when your user doesn't want personalised targeting of ads and such
				break;
			default:
				break;
        }
    }
	,"debug":gameConfig.debugMode
	,"prefix":""
	,"advertisementSettings": {
		 "debug": gameConfig.debugMode
		,"autoplay": false
		//,"locale": "en"
    }
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'main.min.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'gamedistribution-jssdk'));