var HideableElMixin = {
	isHidden : function() {
		return this.el.classList.contains("hidden");
	},

	show : function() {
		this.el.classList.remove("hidden");
	},

	hide : function() {
		this.el.classList.add("hidden");
	}
};

var BlackScreen = function(el){
	this.el = el;
};

// copy the methods
Object.assign(BlackScreen.prototype, HideableElMixin);

var Popup = function(el){
	this.el = el;
}

// copy the methods
Object.assign(Popup.prototype, HideableElMixin);

var AnotherDevicePopup = function(el){
	Popup.call(this, el);

	this.closeBtn = el.querySelector('.close-btn-cross');
	this.reloadGameBtn = el.querySelector('.reload-game-btn');event
};

AnotherDevicePopup.prototype = new Popup();
AnotherDevicePopup.prototype.constructor = AnotherDevicePopup;

AnotherDevicePopup.prototype.setOnCloseClick = function(action){
	this.closeBtn.addEventListener("click", function(e){
		action.call(this);
	});
};

AnotherDevicePopup.prototype.setOnReloadClick = function(action){
	this.reloadGameBtn.addEventListener("click", function(e){
		action.call(this);
	});
};

var LoadScreen = function(el){
	this.el = el;
};

// copy the methods
Object.assign(LoadScreen.prototype, HideableElMixin);

var ProgressBar = function(el, fullWidth){
	this.el = el;
	this.fullWidth = fullWidth;
};

ProgressBar.prototype.setProgress = function(percent){
	this.el.style.width = Math.round(this.fullWidth * percent) + "px";
};

var AppPage = {
	blackScreen : null,
	anotherDevicePopup : null,
	unityLoaded : false,
	unityInstance : false,

	init: function(){
		this.blackScreen = new BlackScreen(document.getElementById("blackscreen"));
		this.anotherDevicePopup = new AnotherDevicePopup(document.getElementById("another-device-popup"));
		this.loadScreen = new LoadScreen(document.getElementById("loading-screen"));
		this.progressBar = new ProgressBar(document.querySelector("#loading-screen .progressbar .fill"), 420);
	},

	embedUnity : function(canvasEl, unityConfig){
		var that = this;

		that.unityLoaded = false;
		createUnityInstance(canvas, unityConfig, (progress) => {
			that.progressBar.setProgress(progress);
		}).then((unityInstance) => {
			that.unityInstance = unityInstance;
			that.unityLoaded = true;

			that.loadScreen.hide();
		}).catch((message) => {
			that.showUnityBanner(message, "error");
		});
	},

	createUnityCanvas: function(width, height){
		var canvas = document.createElement('canvas');
		canvas.id = "unity-canvas";
		canvas.width = width * window.devicePixelRatio;
		canvas.height = height * window.devicePixelRatio;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";

		return canvas;
	},

	resizeUnityCanvas: function(canvas, width, height){
		canvas.width = canvasWidth * window.devicePixelRatio;
		canvas.height = canvasHeight * window.devicePixelRatio;
		canvas.style.width = canvasWidth + "px";
		canvas.style.height = canvasHeight + "px";
	},

	anotherDeviceException : function(){
		this.anotherDevicePopup.setOnCloseClick(this.reloadPage);
		this.anotherDevicePopup.setOnReloadClick(this.reloadPage);

		this.blackScreen.show();
		this.anotherDevicePopup.show();
	},

	showUnityBanner: function(msg, type){
		console.log("Unity report " + type + ": " + msg);
	},

	showLoadScreen: function(){
		this.loadScreen.show();
	},

	hideLoadScreen: function(){
		this.loadScreen.hide();
	},

	reloadPage : function(){
		if (typeof location == "undefined") {
            return;
        }
        
        try{
            location.reload(true);
        }catch(err){}
	}
};

var DevToDevPostbacks = {
	apiKeyName: 'apikey',
	apiKey : null,
	url : 'https://api.devtodev.com/track/install/v1/custom/',

	init: function(apiKey){
		this.apiKey = apiKey;
	},

	trackCustom: function(eventName, params){
		if(this.apiKey == null){
			return;
		}

		var eventParams = Object.assign({}, params, {'event_name' : 'install'});

		var request = this.createRequest(eventParams);
		request.send( null );
	},

	createRequest: function(params){
		var url = this.createUrl(params);

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", url, true); // false for synchronous request

		return xmlHttp;
	},

	createUrl: function(params){
		if(!(this.apiKeyName in params)){
			params[this.apiKeyName] = this.apiKey;
		}

		var queryString = Object.keys(params).map(function(key) {
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
		}).join('&');

		var url = this.url + "?" + queryString;

		return url;
	}
};