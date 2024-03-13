(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"cutin_atlas_1", frames: [[996,172,483,194],[1262,368,172,85],[722,375,168,85],[722,462,245,46],[0,589,410,55],[0,0,242,563],[244,0,210,587],[456,172,538,201],[1481,172,204,402],[1687,172,199,404],[996,368,264,264],[456,375,264,264],[1262,576,289,109],[1553,578,289,109],[1900,157,26,71],[1928,157,26,71],[456,0,720,170],[1178,0,720,170],[1900,0,138,93],[1900,95,132,60]]}
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



(lib.effect_cjiri = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.gametext_Bonussstage = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.gametext_bossstage = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.gametext_clear = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.gametext_gameover = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.Htest01 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.Htest02 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Htest03 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.Htest04 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.Htest05 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.testui01 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.testui02 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.testui03 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.testui04 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.testui05 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.testui06 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.testui07 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.testui08 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.uitest01 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.uitest02 = function() {
	this.initialize(ss["cutin_atlas_1"]);
	this.gotoAndStop(19);
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


(lib.uitest02_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.uitest02();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.uitest02_1, new cjs.Rectangle(0,0,132,60), null);


(lib.uitest01_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.uitest01();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.uitest01_1, new cjs.Rectangle(0,0,138,93), null);


(lib.testui08_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui08();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui08_1, new cjs.Rectangle(0,0,720,170), null);


(lib.testui07_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui07();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui07_1, new cjs.Rectangle(0,0,720,170), null);


(lib.testui052 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui06();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui052, new cjs.Rectangle(0,0,26,71), null);


(lib.testui05_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui05();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui05_1, new cjs.Rectangle(0,0,26,71), null);


(lib.testui04_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui04();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui04_1, new cjs.Rectangle(0,0,289,109), null);


(lib.testui03_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui03();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui03_1, new cjs.Rectangle(0,0,289,109), null);


(lib.testui02_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui02();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui02_1, new cjs.Rectangle(0,0,264,264), null);


(lib.testui01_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.testui01();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.testui01_1, new cjs.Rectangle(0,0,264,264), null);


(lib.Htest05_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Htest05();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Htest05_1, new cjs.Rectangle(0,0,199,404), null);


(lib.Htest04_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Htest04();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Htest04_1, new cjs.Rectangle(0,0,204,402), null);


(lib.Htest03_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Htest03();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Htest03_1, new cjs.Rectangle(0,0,538,201), null);


(lib.Htest02_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Htest02();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Htest02_1, new cjs.Rectangle(0,0,210,587), null);


(lib.Htest01_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.Htest01();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Htest01_1, new cjs.Rectangle(0,0,242,563), null);


(lib.gametext_gameover_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.gametext_gameover();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gametext_gameover_1, new cjs.Rectangle(0,0,410,55), null);


(lib.gametext_clear_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.gametext_clear();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gametext_clear_1, new cjs.Rectangle(0,0,245,46), null);


(lib.gametext_bossstage_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.gametext_bossstage();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gametext_bossstage_1, new cjs.Rectangle(0,0,168,85), null);


(lib.gametext_Bonussstage_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.gametext_Bonussstage();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.gametext_Bonussstage_1, new cjs.Rectangle(0,0,172,85), null);


(lib.effect_cjiri_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.effect_cjiri();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.effect_cjiri_1, new cjs.Rectangle(0,0,483,194), null);


(lib.gameover = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// gametext_gameover_png_コピー
	this.instance = new lib.gametext_gameover_1();
	this.instance.setTransform(178,279.75,0.5,0.5,0,0,0,226,29.5);
	this.instance.alpha = 0.3008;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:203,y:291.25,alpha:1},6).to({x:178,y:302.75},6).to({x:190.5,y:318.4},6).wait(12).to({alpha:0},9).wait(1));

	// レイヤー_12_コピー_コピー_コピー
	this.instance_1 = new lib.testui07_1();
	this.instance_1.setTransform(204.75,293.15,0.5,0.5,0,0,0,409.5,85);
	this.instance_1.alpha = 0.1211;
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(6).to({_off:false},0).to({y:314.65,alpha:1},12).wait(12).to({alpha:0},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,250.7,360,106.5);


(lib.cracker = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// effect_cjiri_コピー_コピー
	this.instance = new lib.effect_cjiri_1();
	this.instance.setTransform(158.9,91.4,0.352,0.352,29.9993,0,0,241.6,96.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(11).to({_off:false},0).wait(1).to({regX:241.5,regY:97,scaleX:0.3573,scaleY:0.3573,x:155.95,y:87.45},0).wait(1).to({scaleX:0.3626,scaleY:0.3626,x:153.15,y:83.5},0).wait(1).to({scaleX:0.368,scaleY:0.368,rotation:29.9992,x:150.25,y:79.55},0).wait(1).to({scaleX:0.3734,scaleY:0.3734,x:147.4,y:75.6},0).wait(1).to({scaleX:0.3787,scaleY:0.3787,rotation:29.9991,x:144.6,y:71.65},0).wait(1).to({scaleX:0.3839,scaleY:0.3839,x:141.8,y:67.8},0).wait(1).to({scaleX:0.389,scaleY:0.389,rotation:29.999,x:139.05,y:64},0).wait(1).to({scaleX:0.3939,scaleY:0.3939,x:136.4,y:60.35},0).wait(1).to({scaleX:0.3987,scaleY:0.3987,rotation:29.9989,x:133.85,y:56.85},0).wait(1).to({scaleX:0.4033,scaleY:0.4033,x:131.45,y:53.5},0).wait(1).to({scaleX:0.4076,scaleY:0.4076,x:129.1,y:50.2},0).wait(1).to({scaleX:0.4118,scaleY:0.4118,rotation:29.9988,x:126.85,y:47.15},0).wait(1).to({scaleX:0.4157,scaleY:0.4157,x:124.8,y:44.2},0).wait(1).to({scaleX:0.4194,scaleY:0.4194,rotation:29.9987,x:122.75,y:41.5},0).wait(1).to({scaleX:0.4229,scaleY:0.4229,x:120.95,y:38.85},0).wait(1).to({scaleX:0.4261,scaleY:0.4261,x:119.2,y:36.5},0).wait(1).to({scaleX:0.4292,scaleY:0.4292,x:117.55,y:34.2},0).wait(1).to({scaleX:0.4321,scaleY:0.4321,rotation:29.9986,x:116,y:32.1},0).wait(1).to({scaleX:0.4347,scaleY:0.4347,x:114.55,y:30.15},0).wait(1).to({scaleX:0.4372,scaleY:0.4372,x:113.3,y:28.3},0).wait(1).to({scaleX:0.4395,scaleY:0.4395,x:112.05,y:26.6},0).wait(1).to({scaleX:0.4416,scaleY:0.4416,rotation:29.9985,x:110.95,y:25.05},0).wait(1).to({scaleX:0.4435,scaleY:0.4435,x:109.9,y:23.6},0).wait(1).to({scaleX:0.4453,scaleY:0.4453,x:108.95,y:22.25},0).wait(1).to({scaleX:0.447,scaleY:0.447,x:108.05,y:21.05},0).wait(1).to({scaleX:0.4485,scaleY:0.4485,x:107.25,y:19.9},0).wait(1).to({regX:241.7,regY:96.8,scaleX:0.4498,scaleY:0.4498,x:106.6,y:18.85},0).wait(1).to({regX:241.5,regY:97,scaleX:0.4511,scaleY:0.4511,rotation:29.9986,x:105.75,y:18},0).wait(1).to({scaleX:0.4522,scaleY:0.4522,rotation:29.9988,x:105.15,y:17.2},0).wait(1).to({scaleX:0.4532,scaleY:0.4532,rotation:29.9989,x:104.55,y:16.45},0).wait(1).to({scaleX:0.4542,scaleY:0.4542,rotation:29.999,x:104.05,y:15.75},0).wait(1).to({scaleX:0.455,scaleY:0.455,rotation:29.9991,x:103.65,y:15.15},0).wait(1).to({scaleX:0.4557,scaleY:0.4557,rotation:29.9992,x:103.25,y:14.65},0).wait(1).to({scaleX:0.4563,scaleY:0.4563,x:102.9,y:14.2},0).wait(1).to({scaleX:0.4568,scaleY:0.4568,rotation:29.9993,x:102.65,y:13.8},0).wait(1).to({scaleX:0.4572,scaleY:0.4572,rotation:29.9994,x:102.4,y:13.45},0).wait(1).to({regX:241.6,regY:96.8,scaleX:0.4576,scaleY:0.4576,x:102.35,y:13.15},0).wait(1));

	// effect_cjiri_コピー
	this.instance_1 = new lib.effect_cjiri_1();
	this.instance_1.setTransform(118.55,112.65,0.5,0.5,0,0,0,241.5,97);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(11).to({_off:false},0).wait(1).to({scaleX:0.5075,scaleY:0.5075,x:113.1,y:113.1},0).wait(1).to({scaleX:0.5151,scaleY:0.5151,x:107.6,y:113.5},0).wait(1).to({scaleX:0.5227,scaleY:0.5227,x:102.05,y:114},0).wait(1).to({scaleX:0.5304,scaleY:0.5304,x:96.55,y:114.45},0).wait(1).to({scaleX:0.5379,scaleY:0.5379,x:91.05,y:114.95},0).wait(1).to({scaleX:0.5453,scaleY:0.5453,x:85.7,y:115.35},0).wait(1).to({scaleX:0.5525,scaleY:0.5525,x:80.45,y:115.8},0).wait(1).to({scaleX:0.5596,scaleY:0.5596,x:75.35,y:116.25},0).wait(1).to({scaleX:0.5663,scaleY:0.5663,x:70.4,y:116.65},0).wait(1).to({scaleX:0.5728,scaleY:0.5728,x:65.7,y:117},0).wait(1).to({scaleX:0.579,scaleY:0.579,x:61.2,y:117.4},0).wait(1).to({scaleX:0.5849,scaleY:0.5849,x:56.9,y:117.75},0).wait(1).to({scaleX:0.5905,scaleY:0.5905,x:52.85,y:118.1},0).wait(1).to({scaleX:0.5958,scaleY:0.5958,x:49.05,y:118.4},0).wait(1).to({scaleX:0.6007,scaleY:0.6007,x:45.4,y:118.7},0).wait(1).to({scaleX:0.6054,scaleY:0.6054,x:42.05,y:118.95},0).wait(1).to({scaleX:0.6097,scaleY:0.6097,x:38.9,y:119.25},0).wait(1).to({scaleX:0.6138,scaleY:0.6138,x:35.95,y:119.5},0).wait(1).to({scaleX:0.6175,scaleY:0.6175,x:33.25,y:119.75},0).wait(1).to({scaleX:0.621,scaleY:0.621,x:30.7,y:119.95},0).wait(1).to({scaleX:0.6243,scaleY:0.6243,x:28.3,y:120.15},0).wait(1).to({scaleX:0.6273,scaleY:0.6273,x:26.15,y:120.3},0).wait(1).to({scaleX:0.6301,scaleY:0.6301,x:24.15,y:120.45},0).wait(1).to({scaleX:0.6326,scaleY:0.6326,x:22.25,y:120.6},0).wait(1).to({scaleX:0.6349,scaleY:0.6349,x:20.6,y:120.8},0).wait(1).to({scaleX:0.6371,scaleY:0.6371,x:19.05,y:120.9},0).wait(1).to({regY:97.1,scaleX:0.639,scaleY:0.639,x:17.65,y:121.05},0).wait(1).to({regY:97,scaleX:0.6408,scaleY:0.6408,x:16.35},0).wait(1).to({scaleX:0.6424,scaleY:0.6424,x:15.2,y:121.15},0).wait(1).to({scaleX:0.6439,scaleY:0.6439,x:14.15,y:121.25},0).wait(1).to({scaleX:0.6451,scaleY:0.6451,x:13.2,y:121.3},0).wait(1).to({scaleX:0.6463,scaleY:0.6463,x:12.35,y:121.4},0).wait(1).to({scaleX:0.6473,scaleY:0.6473,x:11.65,y:121.45},0).wait(1).to({scaleX:0.6481,scaleY:0.6481,x:11},0).wait(1).to({scaleX:0.6489,scaleY:0.6489,x:10.5,y:121.5},0).wait(1).to({scaleX:0.6495,scaleY:0.6495,x:10.05,y:121.55},0).wait(1).to({regY:97.1,scaleX:0.65,scaleY:0.65,x:9.65,y:121.65},0).wait(1));

	// effect_cjiri
	this.instance_2 = new lib.effect_cjiri_1();
	this.instance_2.setTransform(127.3,129.15,0.3505,0.3505,180,0,0,241.5,97);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(11).to({_off:false},0).wait(1).to({scaleX:0.3558,scaleY:0.3558,x:124.25,y:133.75},0).wait(1).to({scaleX:0.3611,scaleY:0.3611,x:121.2,y:138.35},0).wait(1).to({scaleX:0.3665,scaleY:0.3665,x:118.1,y:143.05},0).wait(1).to({scaleX:0.3718,scaleY:0.3718,x:115.05,y:147.7},0).wait(1).to({scaleX:0.3771,scaleY:0.3771,x:112.05,y:152.35},0).wait(1).to({scaleX:0.3823,scaleY:0.3823,x:109.05,y:156.85},0).wait(1).to({scaleX:0.3873,scaleY:0.3873,x:106.1,y:161.3},0).wait(1).to({scaleX:0.3923,scaleY:0.3923,x:103.25,y:165.6},0).wait(1).to({scaleX:0.397,scaleY:0.397,x:100.55,y:169.75},0).wait(1).to({scaleX:0.4016,scaleY:0.4016,x:97.9,y:173.7},0).wait(1).to({scaleX:0.4059,scaleY:0.4059,x:95.45,y:177.55},0).wait(1).to({scaleX:0.41,scaleY:0.41,x:93.1,y:181.15},0).wait(1).to({scaleX:0.414,scaleY:0.414,x:90.85,y:184.55},0).wait(1).to({scaleX:0.4176,scaleY:0.4176,x:88.7,y:187.75},0).wait(1).to({scaleX:0.4211,scaleY:0.4211,x:86.7,y:190.75},0).wait(1).to({scaleX:0.4244,scaleY:0.4244,x:84.85,y:193.65},0).wait(1).to({scaleX:0.4274,scaleY:0.4274,x:83.1,y:196.3},0).wait(1).to({scaleX:0.4302,scaleY:0.4302,x:81.45,y:198.75},0).wait(1).to({scaleX:0.4329,scaleY:0.4329,x:79.95,y:201.05},0).wait(1).to({scaleX:0.4353,scaleY:0.4353,x:78.5,y:203.2},0).wait(1).to({scaleX:0.4376,scaleY:0.4376,x:77.2,y:205.2},0).wait(1).to({scaleX:0.4397,scaleY:0.4397,x:76,y:207.05},0).wait(1).to({scaleX:0.4417,scaleY:0.4417,x:74.9,y:208.7},0).wait(1).to({scaleX:0.4435,scaleY:0.4435,x:73.85,y:210.3},0).wait(1).to({scaleX:0.4451,scaleY:0.4451,x:72.9,y:211.75},0).wait(1).to({scaleX:0.4466,scaleY:0.4466,x:72.1,y:213.05},0).wait(1).to({regX:241.4,scaleX:0.448,scaleY:0.448,x:71.3,y:214.25},0).wait(1).to({regX:241.5,scaleX:0.4492,scaleY:0.4492,x:70.5,y:215.35},0).wait(1).to({scaleX:0.4503,scaleY:0.4503,x:69.9,y:216.25},0).wait(1).to({scaleX:0.4513,scaleY:0.4513,x:69.3,y:217.15},0).wait(1).to({scaleX:0.4523,scaleY:0.4523,x:68.8,y:217.95},0).wait(1).to({scaleX:0.4531,scaleY:0.4531,x:68.35,y:218.65},0).wait(1).to({scaleX:0.4538,scaleY:0.4538,x:67.9,y:219.25},0).wait(1).to({scaleX:0.4544,scaleY:0.4544,x:67.6,y:219.8},0).wait(1).to({scaleX:0.4549,scaleY:0.4549,x:67.3,y:220.25},0).wait(1).to({scaleX:0.4553,scaleY:0.4553,x:67.05,y:220.65},0).wait(1).to({regX:241.4,regY:96.9,scaleX:0.4557,scaleY:0.4557,x:66.9,y:220.95},0).wait(1));

	// uitest02_コピー_コピー
	this.instance_3 = new lib.uitest02_1();
	this.instance_3.setTransform(107.25,104.65,1,1,-14.9983,0,0,66,30);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(11).to({_off:false},0).wait(1).to({x:100.65},0).wait(1).to({x:94.05},0).wait(1).to({x:87.4},0).wait(1).to({x:80.75},0).wait(1).to({x:74.2},0).wait(1).to({x:67.75},0).wait(1).to({x:61.45},0).wait(1).to({x:55.35},0).wait(1).to({rotation:-14.9982,x:49.45},0).wait(1).to({x:43.75},0).wait(1).to({x:38.35},0).wait(1).to({x:33.2},0).wait(1).to({x:28.35},0).wait(1).to({x:23.75},0).wait(1).to({x:19.45},0).wait(1).to({x:15.4},0).wait(1).to({x:11.6},0).wait(1).to({x:8.1},0).wait(1).to({x:4.8},0).wait(1).to({x:1.75},0).wait(1).to({x:-1.1},0).wait(1).to({x:-3.7},0).wait(1).to({x:-6.15},0).wait(1).to({x:-8.35},0).wait(1).to({x:-10.4},0).wait(1).to({x:-12.25},0).wait(1).to({regY:30.1,x:-13.9},0).wait(1).to({regY:30,x:-15.5,y:104.55},0).wait(1).to({x:-16.85},0).wait(1).to({x:-18.15},0).wait(1).to({x:-19.25},0).wait(1).to({rotation:-14.9983,x:-20.25},0).wait(1).to({x:-21.1},0).wait(1).to({x:-21.85},0).wait(1).to({x:-22.5},0).wait(1).to({x:-23.05},0).wait(1).to({x:-23.55,y:104.65},0).wait(1));

	// uitest02_コピー
	this.instance_4 = new lib.uitest02_1();
	this.instance_4.setTransform(149.85,145.15,1,1,-29.9992,0,0,66,30);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(11).to({_off:false},0).wait(1).to({x:145.95,y:145.8},0).wait(1).to({rotation:-29.9991,x:142,y:146.5},0).wait(1).to({x:138.05,y:147.15},0).wait(1).to({x:134.1,y:147.85},0).wait(1).to({x:130.2,y:148.55},0).wait(1).to({x:126.4,y:149.2},0).wait(1).to({x:122.65,y:149.85},0).wait(1).to({rotation:-29.999,x:119,y:150.45},0).wait(1).to({x:115.5,y:151.1},0).wait(1).to({x:112.15,y:151.65},0).wait(1).to({x:108.9,y:152.2},0).wait(1).to({x:105.85,y:152.75},0).wait(1).to({x:103,y:153.25},0).wait(1).to({x:100.25,y:153.75},0).wait(1).to({rotation:-29.9989,x:97.7,y:154.15},0).wait(1).to({x:95.3,y:154.6},0).wait(1).to({x:93.05,y:155},0).wait(1).to({x:90.95,y:155.35},0).wait(1).to({x:89,y:155.7},0).wait(1).to({x:87.2,y:156},0).wait(1).to({x:85.5,y:156.3},0).wait(1).to({x:83.95,y:156.55},0).wait(1).to({x:82.5,y:156.8},0).wait(1).to({x:81.2,y:157.05},0).wait(1).to({x:80,y:157.25},0).wait(1).to({x:78.9,y:157.45},0).wait(1).to({regY:30.1,x:77.9,y:157.6},0).wait(1).to({regY:30,x:76.9,y:157.65},0).wait(1).to({rotation:-29.999,x:76.05,y:157.8},0).wait(1).to({x:75.3,y:157.95},0).wait(1).to({x:74.6,y:158.05},0).wait(1).to({rotation:-29.9991,x:74,y:158.15},0).wait(1).to({x:73.5,y:158.2},0).wait(1).to({x:73.05,y:158.3},0).wait(1).to({x:72.65,y:158.35},0).wait(1).to({rotation:-29.9992,x:72.35,y:158.4},0).wait(1).to({x:72.15,y:158.55},0).wait(1));

	// uitest02
	this.instance_5 = new lib.uitest02_1();
	this.instance_5.setTransform(173.3,74.65,1,1,0,0,0,66,30);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(11).to({_off:false},0).wait(1).to({x:168.75,y:73.2},0).wait(1).to({x:164.15,y:71.8},0).wait(1).to({x:159.55,y:70.4},0).wait(1).to({x:154.95,y:68.95},0).wait(1).to({x:150.4,y:67.55},0).wait(1).to({x:145.9,y:66.2},0).wait(1).to({x:141.55,y:64.85},0).wait(1).to({x:137.3,y:63.55},0).wait(1).to({x:133.2,y:62.25},0).wait(1).to({x:129.25,y:61.05},0).wait(1).to({x:125.5,y:59.9},0).wait(1).to({x:121.95,y:58.8},0).wait(1).to({x:118.6,y:57.75},0).wait(1).to({x:115.4,y:56.8},0).wait(1).to({x:112.4,y:55.85},0).wait(1).to({x:109.6,y:55},0).wait(1).to({x:107,y:54.2},0).wait(1).to({x:104.55,y:53.45},0).wait(1).to({x:102.25,y:52.75},0).wait(1).to({x:100.15,y:52.1},0).wait(1).to({x:98.2,y:51.45},0).wait(1).to({x:96.4,y:50.9},0).wait(1).to({x:94.7,y:50.4},0).wait(1).to({x:93.15,y:49.9},0).wait(1).to({x:91.75,y:49.5},0).wait(1).to({x:90.45,y:49.1},0).wait(1).to({x:89.3,y:48.75},0).wait(1).to({x:88.2,y:48.4},0).wait(1).to({x:87.25,y:48.1},0).wait(1).to({x:86.35,y:47.8},0).wait(1).to({x:85.6,y:47.6},0).wait(1).to({x:84.9,y:47.35},0).wait(1).to({x:84.3,y:47.2},0).wait(1).to({x:83.8,y:47},0).wait(1).to({x:83.35,y:46.9},0).wait(1).to({x:83,y:46.75},0).wait(1).to({x:82.7,y:46.7},0).wait(1));

	// uitest01
	this.instance_6 = new lib.uitest01_1();
	this.instance_6.setTransform(368.65,172.6,1,1,0,0,0,138,93);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(4).to({regX:138.1,scaleX:0.8,scaleY:0.9456,x:368.7},4).to({regX:138.2,scaleX:1.2,scaleY:1.0938,x:368.9},3,cjs.Ease.quadIn).wait(38));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-147.3,-80.4,516,345.5);


(lib.bossStage = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// gametext_bossstage_png_コピー
	this.instance = new lib.gametext_bossstage_1();
	this.instance.setTransform(180.15,229.55,0.7007,0.7007,0,0,0,84.2,42.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:84,regY:42.5,scaleX:0.5,scaleY:0.5,x:180,y:229.5},8,cjs.Ease.quadOut).wait(12).to({alpha:0},9).wait(1));

	// testui03_png_コピー
	this.instance_1 = new lib.testui03_1();
	this.instance_1.setTransform(180.15,229.55,0.7007,0.7007,0,0,0,144.7,54.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:144.5,regY:54.5,scaleX:0.5,scaleY:0.5,x:180,y:229.5},8,cjs.Ease.quadOut).wait(12).to({alpha:0},9).wait(1));

	// レイヤー_1_コピー_コピー
	this.instance_2 = new lib.testui05_1();
	this.instance_2.setTransform(179.6,180.85,0.5997,0.6046,-9.2574,0,0,13.2,83.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:13.1,scaleX:0.4182,scaleY:0.4198,rotation:-4.3209,x:179.8,y:180.8},8,cjs.Ease.quadOut).to({regX:13.2,scaleX:0.4185,scaleY:0.4199,rotation:-3.7026,x:179.7,y:180.75},1).to({regX:13.1,scaleX:0.42,scaleY:0.42,rotation:0},6).to({regX:13.2,rotation:2.3156,x:179.85},5).to({regX:13.1,rotation:6.488,x:179.7,alpha:0},9).wait(1));

	// レイヤー_1_コピー
	this.instance_3 = new lib.testui05_1();
	this.instance_3.setTransform(179.7,180.7,0.599,0.599,-129.329,0,0,12.9,83.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regX:12.8,regY:83.4,scaleX:0.4999,scaleY:0.4999,rotation:-60.3191,y:180.95},8,cjs.Ease.quadOut).to({regX:12.9,regY:83.5,scaleX:0.5,scaleY:0.5,rotation:-51.6974,x:179.75,y:180.85},1).to({regX:13,regY:83.4,rotation:0.014,x:179.7,y:180.75},6).to({regX:13.1,regY:83.5,rotation:39.1339,x:179.75,y:180.95},5).to({rotation:109.5454,x:179.6,y:180.8,alpha:0},9).wait(1));

	// testui02_png_コピー
	this.instance_4 = new lib.testui02_1();
	this.instance_4.setTransform(180.1,177.1,0.5934,0.5934,0,0,0,132.1,128.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({regX:132,regY:128,scaleX:0.5,scaleY:0.5,x:180,y:177},8,cjs.Ease.quadOut).wait(12).to({alpha:0},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(78.8,101,202.5,166.7);


(lib.bonusStage = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// gametext_bossstage_png_コピー
	this.instance = new lib.gametext_Bonussstage_1();
	this.instance.setTransform(180.15,229.55,0.7007,0.7007,0,0,0,84.2,42.6);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:84,regY:42.5,scaleX:0.5,scaleY:0.5,x:180,y:229.5},8,cjs.Ease.quadOut).wait(12).to({alpha:0},9).wait(1));

	// testui03_png_コピー
	this.instance_1 = new lib.testui04_1();
	this.instance_1.setTransform(180.15,229.55,0.7007,0.7007,0,0,0,144.7,54.6);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:144.5,regY:54.5,scaleX:0.5,scaleY:0.5,x:180,y:229.5},8,cjs.Ease.quadOut).wait(12).to({alpha:0},9).wait(1));

	// レイヤー_1_コピー_コピー
	this.instance_2 = new lib.testui052();
	this.instance_2.setTransform(179.6,180.85,0.5997,0.6046,-9.2574,0,0,13.2,83.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:13.1,scaleX:0.4182,scaleY:0.4198,rotation:-4.3209,x:179.8,y:180.8},8,cjs.Ease.quadOut).to({regX:13.2,scaleX:0.4185,scaleY:0.4199,rotation:-3.7026,x:179.7,y:180.75},1).to({regX:13.1,scaleX:0.42,scaleY:0.42,rotation:0},6).to({regX:13.2,rotation:2.3156,x:179.85},5).to({regX:13.1,rotation:6.488,x:179.7,alpha:0},9).wait(1));

	// レイヤー_1_コピー
	this.instance_3 = new lib.testui052();
	this.instance_3.setTransform(179.7,180.7,0.599,0.599,-129.329,0,0,12.9,83.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regX:12.8,regY:83.4,scaleX:0.4999,scaleY:0.4999,rotation:-60.3191,y:180.95},8,cjs.Ease.quadOut).to({regX:12.9,regY:83.5,scaleX:0.5,scaleY:0.5,rotation:-51.6974,x:179.75,y:180.85},1).to({regX:13,regY:83.4,rotation:0.014,x:179.7,y:180.75},6).to({regX:13.1,regY:83.5,rotation:39.1339,x:179.75,y:180.95},5).to({rotation:109.5454,x:179.6,y:180.8,alpha:0},9).wait(1));

	// testui02_png_コピー
	this.instance_4 = new lib.testui01_1();
	this.instance_4.setTransform(180.1,177.1,0.5934,0.5934,0,0,0,132.1,128.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({regX:132,regY:128,scaleX:0.5,scaleY:0.5,x:180,y:177},8,cjs.Ease.quadOut).wait(12).to({alpha:0},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(78.8,101,202.5,166.7);


(lib.gameclear = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_5 = function() {
		this.dispatchEvent(new Event("showBackground"));
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(5).call(this.frame_5).wait(52));

	// gametext_clear_png_コピー_コピー_コピー
	this.instance = new lib.gametext_clear_1();
	this.instance.setTransform(190.45,321.35,0.8,0.8,0,0,0,135.6,29.7);
	this.instance.alpha = 0.3008;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:29.6,scaleX:0.4858,scaleY:0.4858,x:186.4,y:320.05,alpha:1},5).to({regX:135.7,regY:29.7,scaleX:0.55,scaleY:0.55,x:187.3,y:320.85},4).to({regX:135.6,scaleX:0.5,scaleY:0.5,x:186.55,y:320.25},5).wait(37).to({regX:135.5,regY:29.5,x:186.5,y:320.15},0).to({regX:135.6,regY:29.6,scaleX:0.8,scaleY:0.8,x:190.5,y:320.2,alpha:0},5).wait(1));

	// レイヤー_12_コピー_コピー_コピー_コピー
	this.instance_1 = new lib.testui08_1();
	this.instance_1.setTransform(214.6,314.65,0.7,0.7,0,0,0,409.4,85);
	this.instance_1.alpha = 0.6992;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regY:85.1,scaleX:0.5023,scaleY:0.4858,x:204,y:314.7,alpha:1},5).to({regX:409.5,regY:85,scaleX:0.5,scaleY:0.5,x:204.75,y:314.65},4).wait(42).to({alpha:0},5).wait(1));

	// Htest05_コピー_コピー_コピー
	this.instance_2 = new lib.Htest05_1();
	this.instance_2.setTransform(-39.3,351.25,0.5,0.5,8.984);
	this.instance_2.alpha = 0.3008;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(5).to({_off:false},0).to({rotation:0,x:-8.75,y:352.25,alpha:1},4,cjs.Ease.quadOut).to({x:0},26).wait(16).to({alpha:0},5).wait(1));

	// Htest04_コピー_コピー_コピー
	this.instance_3 = new lib.Htest04_1();
	this.instance_3.setTransform(409.6,352.3,0.5,0.5,-5.4374,0,0,204.1,0.1);
	this.instance_3.alpha = 0.3008;
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(5).to({_off:false},0).to({regX:204,regY:0,rotation:0,x:368.05,y:352.25,alpha:1},4,cjs.Ease.quadOut).to({x:359.3},26).wait(16).to({alpha:0},5).wait(1));

	// Htest03_コピー_コピー_コピー
	this.instance_4 = new lib.Htest03_1();
	this.instance_4.setTransform(183.35,705,0.5,0.5,0,0,0,269,201);
	this.instance_4.alpha = 0.3008;
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(5).to({_off:false},0).to({y:648.75,alpha:1},4,cjs.Ease.quadOut).to({y:640},26).wait(16).to({alpha:0},5).wait(1));

	// Htest01_コピー_コピー_コピー
	this.instance_5 = new lib.Htest01_1();
	this.instance_5.setTransform(-48.2,281.55,0.5,0.5,-4.1985,0,0,-0.1,563.1);
	this.instance_5.alpha = 0.3008;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(5).to({_off:false},0).to({regX:0,regY:563,rotation:0,x:-8.75,y:281.5,alpha:1},4,cjs.Ease.quadOut).to({x:0},26).wait(16).to({alpha:0},5).wait(1));

	// Htest02_コピー_コピー_コピー
	this.instance_6 = new lib.Htest02_1();
	this.instance_6.setTransform(416.1,287.1,0.5,0.5,4.188,0,0,215.1,584.6);
	this.instance_6.alpha = 0.3008;
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(5).to({_off:false},0).to({regX:210,regY:587,rotation:0,x:368.75,y:293.5,alpha:1},4,cjs.Ease.quadOut).to({x:360},26).wait(16).to({alpha:0},5).wait(1));

	// effect_cjiri_png_コピー_コピー_コピー
	this.instance_7 = new lib.cracker();
	this.instance_7.setTransform(316.5,166,0.3,0.3,0,0,0,241.7,97.5);
	this.instance_7.alpha = 0;
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(9).to({_off:false},0).to({x:266.5,alpha:1},6).wait(36).to({alpha:0},5).wait(1));

	// uitest01_png_コピー_コピー_コピー
	this.instance_8 = new lib.cracker();
	this.instance_8.setTransform(41.5,91,0.3,0.3,0,0,180,241.7,97.5);
	this.instance_8.alpha = 0;
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(9).to({_off:false},0).to({x:91.5,alpha:1},6).wait(36).to({alpha:0},5).wait(1));

	// uitest02_png_コピー_コピー_コピー_コピー
	this.instance_9 = new lib.cracker();
	this.instance_9.setTransform(294.2,454.15,0.3,0.3,0,0,0,241.8,97.5);
	this.instance_9.alpha = 0;
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(9).to({_off:false},0).to({x:256.7,alpha:1},6).wait(36).to({alpha:0},5).wait(1));

	// uitest02_png_コピー_コピー_コピー
	this.instance_10 = new lib.cracker();
	this.instance_10.setTransform(42.8,513.15,0.3,0.3,0,0,180,241.3,97.7);
	this.instance_10.alpha = 0;
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(9).to({_off:false},0).to({x:105.3,alpha:1},6).wait(36).to({alpha:0},5).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-72,-12.2,506.9,717.2);


// stage content:
(lib.cutin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// _1
	this.instance = new lib.gameover();
	this.instance.setTransform(167.5,278.8,1,1,0,0,0,167.5,278.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// _2
	this.instance_1 = new lib.gameclear();
	this.instance_1.setTransform(180,314.7,1,1,0,0,0,180,314.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	// _3
	this.instance_2 = new lib.bonusStage();
	this.instance_2.setTransform(180,184.3,1,1,0,0,0,180,184.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(1));

	// _4
	this.instance_3 = new lib.bossStage();
	this.instance_3.setTransform(180,184.3,1,1,0,0,0,180,184.3);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(108,421,324,-46.80000000000001);
// library properties:
lib.properties = {
	id: '417544034E6B4D4C9610C3AB9CB9B5D5',
	width: 360,
	height: 640,
	fps: 30,
	color: "#000000",
	opacity: 0.00,
	manifest: [
		{src:"images/cutin_atlas_1.png?1700555040179", id:"cutin_atlas_1"}
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
an.compositions['417544034E6B4D4C9610C3AB9CB9B5D5'] = {
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