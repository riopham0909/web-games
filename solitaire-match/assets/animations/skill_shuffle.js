(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"skill_shuffle_atlas_1", frames: [[0,579,223,112],[0,0,720,192],[333,555,281,281],[670,394,266,342],[333,194,335,359],[722,0,290,392],[0,194,331,383]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.character_stand = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.ef_fence = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.ef_lightup = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.giraffe02 = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.giraffe03 = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.giraffe04 = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.giraffe04_2 = function() {
	this.initialize(ss["skill_shuffle_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.giraffe04_2_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.giraffe04_2();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.giraffe04_2_1, new cjs.Rectangle(0,0,331,383), null);


(lib.giraffe04_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.giraffe04();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.giraffe04_1, new cjs.Rectangle(0,0,290,392), null);


(lib.giraffe03_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.giraffe03();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.giraffe03_1, new cjs.Rectangle(0,0,335,359), null);


(lib.giraffe02_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.giraffe02();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.giraffe02_1, new cjs.Rectangle(0,0,266,342), null);


(lib.ef_fence_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.ef_fence();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ef_fence_1, new cjs.Rectangle(0,0,720,192), null);


(lib.character_stand_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.character_stand();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.character_stand_1, new cjs.Rectangle(0,0,223,112), null);


(lib.ef光 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.ef_lightup();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ef光, new cjs.Rectangle(0,0,281,281), null);


(lib.ef_lightup_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// 光
	this.instance = new lib.ef光();
	this.instance.setTransform(143.35,145.45,1,1,89.9956,0,0,144.1,141.6);
	this.instance.alpha = 0.6016;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:144,y:142.85,alpha:0.1992},13,cjs.Ease.quadOut).to({alpha:0.6016},14,cjs.Ease.quadOut).wait(1));

	// 光
	this.instance_1 = new lib.ef光();
	this.instance_1.setTransform(144.1,141.6,1,1,0,0,0,144.1,141.6);
	this.instance_1.alpha = 0.1992;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({alpha:1},13,cjs.Ease.quadOut).to({alpha:0.1992},14,cjs.Ease.quadOut).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-1.1,285,283.5);


// stage content:
(lib.skill_shuffle = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [36,38];
	// timeline functions:
	this.frame_36 = function() {
		this.dispatchEvent(new Event("appearStars"));
	}
	this.frame_38 = function() {
		this.dispatchEvent(new Event("appearAurora"));
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(36).call(this.frame_36).wait(2).call(this.frame_38).wait(68));

	// レイヤー_17
	this.instance = new lib.ef_lightup_1();
	this.instance.setTransform(137.35,515.25,0.584,0.584,0,0,0,140.7,140.7);
	this.instance.alpha = 0.5117;
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(20).to({_off:false},0).to({regX:140.8,regY:140.8,scaleX:0.6238,scaleY:0.6238,x:145.05,y:514.25,alpha:1},15).wait(1).to({scaleX:1.0549,scaleY:1.0549,x:161.8,y:489.7},0).to({x:169.2,y:481.7,alpha:0},18,cjs.Ease.quadOut).to({_off:true},1).wait(51));

	// シャッフル
	this.instance_1 = new lib.giraffe02_1();
	this.instance_1.setTransform(170.35,616.65,0.3544,0.3544,0,0,0,133.9,342.6);
	this.instance_1.alpha = 0;

	this.instance_2 = new lib.giraffe04_1();
	this.instance_2.setTransform(167.15,596.25,0.3544,0.3599,0,0,0,145.6,392.8);
	this.instance_2._off = true;

	this.instance_3 = new lib.giraffe04_2_1();
	this.instance_3.setTransform(167.25,596.35,0.3543,0.3353,5.6774,0,0,145.6,393.2);
	this.instance_3._off = true;

	this.instance_4 = new lib.giraffe03_1();
	this.instance_4.setTransform(149.05,589.2,0.3544,0.3281,0,0,0,133.8,342.9);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regY:342.7,y:595.45,alpha:1},13).wait(1).to({regY:342.8,scaleY:0.3164},5).to({_off:true},1).wait(86));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(20).to({_off:false},0).to({regX:145.7,regY:393.2,scaleX:0.3543,scaleY:0.3543,rotation:5.6767,x:167.2,y:596.35},15).to({_off:true},1).wait(70));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(36).to({_off:false},0).to({regX:145.9,regY:392.9,scaleX:0.3639,scaleY:0.3639,rotation:9.6432,x:167.3},18).to({_off:true},1).wait(51));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(55).to({_off:false},0).to({regY:342.7,scaleY:0.3544,y:589.15},15).wait(25).to({y:599.15,alpha:0},10).wait(1));

	// レイヤー_22
	this.instance_5 = new lib.character_stand_1();
	this.instance_5.setTransform(180,612,0.5,0.5,0,0,0,111.5,56);
	this.instance_5.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({y:595.2,alpha:1},13).wait(82).to({y:605.2,alpha:0},10).wait(1));

	// レイヤー_3
	this.instance_6 = new lib.ef_fence_1();
	this.instance_6.setTransform(180,608.95,0.5,0.5,0,0,0,360,96);
	this.instance_6.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({y:598,alpha:1},13).wait(82).to({y:602,alpha:0},10).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(180,653.2,180,3.7999999999999545);
// library properties:
lib.properties = {
	id: '8CD2B45195AC9246974B8852E4F89651',
	width: 360,
	height: 640,
	fps: 30,
	color: "#000000",
	opacity: 0.00,
	manifest: [
		{src:"images/skill_shuffle_atlas_1.png?1697621944438", id:"skill_shuffle_atlas_1"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['8CD2B45195AC9246974B8852E4F89651'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;