(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"skill_hammer_atlas_1", frames: [[455,0,151,151],[418,834,223,112],[253,834,163,162],[442,549,120,128],[564,549,8,199],[442,679,109,125],[179,0,274,260],[179,262,223,285],[0,706,251,300],[404,262,175,285],[253,549,187,283],[418,948,54,58],[179,549,65,65],[0,0,177,704],[179,616,45,45]]}
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



(lib.br_y = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.character_stand = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.cr1_original = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.cr2_original = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.cr_b = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.crash_hammer = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.ef_smoke = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.fox03 = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.fox03_2 = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.fox_walk1 = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.fox_walk2 = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.kr_y = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.pr_y = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.spotlight = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.sr_y = function() {
	this.initialize(ss["skill_hammer_atlas_1"]);
	this.gotoAndStop(14);
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


(lib.ef_smoke_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.ef_smoke();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ef_smoke_1, new cjs.Rectangle(0,0,274,260), null);


(lib.spotlight_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.spotlight();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.spotlight_1, new cjs.Rectangle(0,0,177,704), null);


(lib.fox3_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fox_walk1_png
	this.instance = new lib.fox03_2();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.fox3_2, new cjs.Rectangle(0,0,251,300), null);


(lib.fox_walk2_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fox_walk1_png
	this.instance = new lib.fox_walk2();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.fox_walk2_1, new cjs.Rectangle(0,0,187,283), null);


(lib.fox_walk1_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fox_walk1_png
	this.instance = new lib.fox_walk1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.fox_walk1_1, new cjs.Rectangle(0,0,175,285), null);


(lib.fox = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fox_walk1_png
	this.instance = new lib.fox03();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.fox, new cjs.Rectangle(0,0,223,285), null);


(lib.sr_y_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// sr_y_png
	this.instance = new lib.sr_y();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.sr_y_1, new cjs.Rectangle(0,0,45,45), null);


(lib.pr_y_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// pr_y_png
	this.instance = new lib.pr_y();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.pr_y_1, new cjs.Rectangle(0,0,65,65), null);


(lib.kr_y_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// kr_y_png
	this.instance = new lib.kr_y();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.kr_y_1, new cjs.Rectangle(0,0,54,58), null);


(lib.cr2_original_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cr2_original_png
	this.instance = new lib.cr2_original();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.cr2_original_1, new cjs.Rectangle(0,0,120,128), null);


(lib.cr1_original_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// cr1_original_png
	this.instance = new lib.cr1_original();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.cr1_original_1, new cjs.Rectangle(0,0,163,162), null);


(lib.cr_b_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// sr_b_png
	this.instance = new lib.cr_b();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.cr_b_1, new cjs.Rectangle(0,0,8,199), null);


(lib.br_y_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// br_y_png
	this.instance = new lib.br_y();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.br_y_1, new cjs.Rectangle(0,0,151,151), null);


(lib.crash_hammer_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.crash_hammer();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.crash_hammer_1, new cjs.Rectangle(0,0,109,125), null);


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


(lib.エフェクト = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// kr_y
	this.instance = new lib.kr_y_1();
	this.instance.setTransform(32.6,44.45,0.8133,0.8133,0,0,0,27.1,29.2);
	this.instance.alpha = 0.1289;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,alpha:0},2).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:44.5},14).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:44.45,alpha:0},15).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:44.5},14).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:44.45,alpha:0},15).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:44.5},14).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:44.45,alpha:0},15).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regX:27.2,regY:29.1,scaleX:0.7,scaleY:0.7,x:32.65,y:44.5},7).wait(1));

	// kr_y
	this.instance_1 = new lib.kr_y_1();
	this.instance_1.setTransform(72.65,79.5,0.8333,0.8333,0,0,0,27.2,29.2);
	this.instance_1.alpha = 0.3281;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regY:29.3,scaleX:0.8,scaleY:0.8,x:72.6,y:79.45,alpha:0},5).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:79.5},14).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:79.45,alpha:0},15).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:79.5},14).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:79.45,alpha:0},15).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:79.5},14).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:79.45,alpha:0},15).wait(1).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.1,scaleX:0.6143,scaleY:0.6143},4).wait(1));

	// kr_y
	this.instance_2 = new lib.kr_y_1();
	this.instance_2.setTransform(23.4,62.95,0.56,0.56,0,0,0,27.2,29);
	this.instance_2.alpha = 0.6016;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:27.1,scaleX:0.5,scaleY:0.5,x:23.35,alpha:0},9).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:62.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:62.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:62.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).wait(1));

	// kr_y
	this.instance_3 = new lib.kr_y_1();
	this.instance_3.setTransform(69.9,35,0.5866,0.5866,0,0,0,27.2,29.1);
	this.instance_3.alpha = 0.8711;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,x:69.85,y:34.95,alpha:0},13).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:35,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:34.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:35,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:34.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:35,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:34.95},14).to({regX:27.2,regY:29.1,scaleX:0.52,scaleY:0.52,x:69.9,y:35,alpha:0.1992},12).wait(1));

	// kr_y
	this.instance_4 = new lib.kr_y_1();
	this.instance_4.setTransform(41.35,82.4,0.5143,0.5143,0,0,0,27.3,29.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},3).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:82.5,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:82.5,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:82.5,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},14).to({regY:29.1,scaleX:0.5533,scaleY:0.5533,y:82.5,alpha:0.5391},7).wait(1));

	// kr_y
	this.instance_5 = new lib.kr_y_1();
	this.instance_5.setTransform(83.35,37.95,0.5,0.5,0,0,0,27.1,29);
	this.instance_5.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:37.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:37.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:37.95},14).to({scaleX:0.5,scaleY:0.5,alpha:0},15).wait(1).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.4,regY:29.3,scaleX:0.4571,scaleY:0.4571,y:37.95},9).wait(1));

	// br_y
	this.instance_6 = new lib.br_y_1();
	this.instance_6.setTransform(55.3,58.65,0.5743,0.5743,0,0,0,75.7,75.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).to({regX:75.5,regY:75.6,scaleX:0.6,scaleY:0.6,x:55.25},10).wait(1).to({regX:75.6,regY:75.5,scaleX:0.5,scaleY:0.5},0).to({regX:75.5,regY:75.6,scaleX:0.6,scaleY:0.6},39).wait(1).to({regX:75.6,regY:75.5,scaleX:0.5,scaleY:0.5},0).to({regX:75.5,regY:75.6,scaleX:0.6,scaleY:0.6},39).wait(1).to({regX:75.6,regY:75.5,scaleX:0.5,scaleY:0.5},0).to({regX:75.7,scaleX:0.5231,scaleY:0.5231,x:55.3,y:58.7},9).wait(1));

	// pr_y_コピー_コピー
	this.instance_7 = new lib.pr_y_1();
	this.instance_7.setTransform(46.65,49.15,0.2999,0.2999,97.9421,0,0,32.9,32.6);
	this.instance_7.alpha = 0.6719;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).to({regX:33,x:44.45,y:46.2,alpha:0.8008},3).to({regX:32.8,regY:32.5,x:33.4,y:31.55,alpha:0},15).wait(1).to({regX:32.9,regY:32.6,x:54.65,y:59.8,alpha:0.1914},0).to({regX:33,x:44.45,y:46.2,alpha:0.8008},14).to({regX:32.8,regY:32.5,x:33.4,y:31.55,alpha:0},15).wait(1).to({regX:32.9,regY:32.6,x:54.65,y:59.8,alpha:0.1914},0).to({regX:33,x:44.45,y:46.2,alpha:0.8008},14).to({regX:32.8,regY:32.5,x:33.4,y:31.55,alpha:0},15).wait(1).to({regX:32.9,regY:32.6,x:54.65,y:59.8,alpha:0.1914},0).to({regX:33,x:44.45,y:46.2,alpha:0.8008},14).to({x:39.35,y:39.4,alpha:0.4297},7).wait(1));

	// pr_y_コピー
	this.instance_8 = new lib.pr_y_1();
	this.instance_8.setTransform(77.8,58.55,0.2999,0.2999,-135,0,0,32.8,32.8);
	this.instance_8.alpha = 0.5391;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).to({regX:32.6,regY:32.6,x:90,alpha:0},10).wait(1).to({regX:32.8,regY:32.8,x:54.65,y:58.45,alpha:0.1914},0).to({regX:32.9,regY:32.6,x:71.6,y:58.5,alpha:0.8008},14).to({regX:32.6,x:90,y:58.55,alpha:0},15).wait(1).to({regX:32.8,regY:32.8,x:54.65,y:58.45,alpha:0.1914},0).to({regX:32.9,regY:32.6,x:71.6,y:58.5,alpha:0.8008},14).to({regX:32.6,x:90,y:58.55,alpha:0},15).wait(1).to({regX:32.8,regY:32.8,x:54.65,y:58.45,alpha:0.1914},0).to({regX:32.9,regY:32.6,x:71.6,y:58.5,alpha:0.8008},14).to({regX:32.6,x:90,y:58.55,alpha:0},15).wait(1));

	// pr_y
	this.instance_9 = new lib.pr_y_1();
	this.instance_9.setTransform(30.25,83.65,0.3,0.3,0,0,0,32.9,32.6);
	this.instance_9.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1).to({x:55.25,y:58.65,alpha:0.1914},0).to({regX:33,regY:32.9,x:43.2,y:70.7,alpha:0.8008},14).to({regX:32.9,regY:32.6,x:30.25,y:83.65,alpha:0},15).wait(1).to({x:55.25,y:58.65,alpha:0.1914},0).to({regX:33,regY:32.9,x:43.2,y:70.7,alpha:0.8008},14).to({regX:32.9,regY:32.6,x:30.25,y:83.65,alpha:0},15).wait(1).to({x:55.25,y:58.65,alpha:0.1914},0).to({regX:33,regY:32.9,x:43.2,y:70.7,alpha:0.8008},14).to({regX:32.9,regY:32.6,x:30.25,y:83.65,alpha:0},15).wait(1).to({x:55.25,y:58.65,alpha:0.1914},0).to({regX:33,x:47.55,y:66.4,alpha:0.5781},9).wait(1));

	// sr_y
	this.instance_10 = new lib.sr_y_1();
	this.instance_10.setTransform(51.3,92.3,0.5999,0.5999,130.4221,0,0,22.6,22.6);
	this.instance_10.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(1).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},19).wait(1).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},19).wait(1).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},19).wait(1).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},19).wait(1).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},19).wait(1));

	// sr_y_
	this.instance_11 = new lib.sr_y_1();
	this.instance_11.setTransform(84.9,89.35,0.5999,0.5999,130.4221,0,0,22.4,22.5);
	this.instance_11.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(1).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},19).wait(1));

	// sr_y
	this.instance_12 = new lib.sr_y_1();
	this.instance_12.setTransform(44.55,19.05,0.5999,0.5999,130.4221,0,0,22.6,22.5);
	this.instance_12.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(1).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},19).wait(1).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},19).wait(1).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},19).wait(1).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},19).wait(1).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},19).wait(1));

	// sr_y
	this.instance_13 = new lib.sr_y_1();
	this.instance_13.setTransform(30.6,42.65,0.5789,0.5789,-114.0355,0,0,22.4,22.7);
	this.instance_13.alpha = 0.2109;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).to({scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},4).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.5789,scaleY:0.5789,rotation:-114.0355,x:30.6,y:42.65,alpha:0.2109},15).wait(1));

	// sr_y
	this.instance_14 = new lib.sr_y_1();
	this.instance_14.setTransform(19.2,73.15,0.5789,0.5789,-114.0355,0,0,22.3,22.5);
	this.instance_14.alpha = 0.2109;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).to({regX:22.4,regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},4).wait(1).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},19).wait(1).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regX:22.3,regY:22.5,scaleX:0.5789,scaleY:0.5789,rotation:-114.0355,x:19.2,y:73.15,alpha:0.2109},15).wait(1));

	// sr_y
	this.instance_15 = new lib.sr_y_1();
	this.instance_15.setTransform(97.05,67.3,0.5789,0.5789,-114.0355,0,0,22.4,22.5);
	this.instance_15.alpha = 0.2109;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).to({regX:22.5,regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},4).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regX:22.4,scaleX:0.5789,scaleY:0.5789,rotation:-114.0355,x:97.05,y:67.3,alpha:0.2109},15).wait(1));

	// sr_y
	this.instance_16 = new lib.sr_y_1();
	this.instance_16.setTransform(88.3,46.5,0.5473,0.5473,0,0,0,22.4,22.7);
	this.instance_16.alpha = 0.5313;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).to({regX:22.5,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},10).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},19).wait(1).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regX:22.4,regY:22.7,scaleX:0.5473,scaleY:0.5473,x:88.3,y:46.5,alpha:0.5313},9).wait(1));

	// sr_y
	this.instance_17 = new lib.sr_y_1();
	this.instance_17.setTransform(66.5,25,0.5473,0.5473,0,0,0,22.6,22.6);
	this.instance_17.alpha = 0.5313;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).to({regX:22.5,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},10).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},19).wait(1).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5473,scaleY:0.5473,x:66.5,y:25,alpha:0.5313},9).wait(1));

	// sr_y
	this.instance_18 = new lib.sr_y_1();
	this.instance_18.setTransform(41.45,94.5,0.5473,0.5473,0,0,0,22.4,22.6);
	this.instance_18.alpha = 0.5313;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).to({regX:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},10).wait(1).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},19).wait(1).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},19).wait(1).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},19).wait(1).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},19).wait(1).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.4,regY:22.6,scaleX:0.5473,scaleY:0.5473,x:41.45,y:94.5,alpha:0.5313},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,116.5,111.4);


(lib.hammer = function(mode,startPosition,loop,reversed) {
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
	this.frame_36 = function() {
		this.dispatchEvent(new Event("slam"));
	}
	this.frame_70 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(36).call(this.frame_36).wait(34).call(this.frame_70).wait(1));

	// レイヤー_27
	this.instance = new lib.ef_smoke_1();
	this.instance.setTransform(236.35,316.1,0.1075,0.1075,0,0,0,137.2,130.2);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:137,regY:130,scaleX:0.1101,scaleY:0.1101,y:316.05,alpha:0.0349},0).wait(1).to({scaleX:0.1134,scaleY:0.1134,alpha:0.0801},0).wait(1).to({scaleX:0.1175,scaleY:0.1175,x:236.3,y:316.1,alpha:0.1367},0).wait(1).to({scaleX:0.1226,scaleY:0.1226,y:316.05,alpha:0.2062},0).wait(1).to({scaleX:0.1288,scaleY:0.1288,x:236.35,y:316.1,alpha:0.2902},0).wait(1).to({scaleX:0.1361,scaleY:0.1361,alpha:0.3905},0).wait(1).to({scaleX:0.1448,scaleY:0.1448,y:316.05,alpha:0.5094},0).wait(1).to({scaleX:0.155,scaleY:0.155,y:316.1,alpha:0.649},0).wait(1).to({scaleX:0.1669,scaleY:0.1669,alpha:0.8118},0).wait(1).to({regX:137.3,regY:130.3,scaleX:0.1806,scaleY:0.1806,x:236.4,y:316.15,alpha:1},0).wait(1).to({regX:137,regY:130,scaleX:0.1969,scaleY:0.1969,x:236.35,y:316.05,alpha:0.9259},0).wait(1).to({scaleX:0.2153,scaleY:0.2153,x:236.3,alpha:0.8421},0).wait(1).to({scaleX:0.2357,scaleY:0.2357,alpha:0.749},0).wait(1).to({scaleX:0.2579,scaleY:0.2579,alpha:0.6478},0).wait(1).to({scaleX:0.2815,scaleY:0.2815,x:236.25,y:316,alpha:0.5404},0).wait(1).to({scaleX:0.3058,scaleY:0.3058,alpha:0.4294},0).wait(1).to({scaleX:0.3303,scaleY:0.3303,alpha:0.3177},0).wait(1).to({scaleX:0.3544,scaleY:0.3544,y:315.95,alpha:0.2077},0).wait(1).to({scaleX:0.3777,scaleY:0.3777,x:236.2,alpha:0.1014},0).wait(1).to({regX:137.2,regY:130.2,scaleX:0.4,scaleY:0.4,x:236.35,y:316.15,alpha:0},0).to({_off:true},1).wait(50));

	// レイヤー_26
	this.instance_1 = new lib.crash_hammer_1();
	this.instance_1.setTransform(229.95,333.8,0.1997,0.1997,22.333,0,0,55.4,125.5);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(10).to({_off:false},0).to({regX:54.6,regY:125,scaleX:0.5,scaleY:0.5,rotation:22.4638,x:220.95,y:347.8},5).wait(6).to({regX:54.5,rotation:-90},15,cjs.Ease.quadIn).wait(1).to({regY:125.1,scaleX:0.4294,x:221,y:351.7},0).to({regY:125,scaleX:0.5,x:220.95,y:347.8},6).wait(19).to({alpha:0},8).wait(1));

	// cr1_original
	this.instance_2 = new lib.cr1_original_1();
	this.instance_2.setTransform(180.15,374.8,0.4,0.4,0,0,0,81.9,81.2);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(36).to({_off:false},0).wait(1).to({regX:81.5,regY:81,scaleX:0.4251,scaleY:0.4251,x:179.95,y:374.7,alpha:0.1729},0).wait(1).to({scaleX:0.4505,scaleY:0.4505,alpha:0.3476},0).wait(1).to({scaleX:0.4757,scaleY:0.4757,alpha:0.5208},0).wait(1).to({scaleX:0.5001,scaleY:0.5001,x:179.9,alpha:0.6891},0).wait(1).to({scaleX:0.5235,scaleY:0.5235,alpha:0.8496},0).wait(1).to({regX:81.9,regY:81.4,scaleX:0.5453,scaleY:0.5453,x:180.15,y:374.9,alpha:1},0).wait(1).to({regX:81.5,regY:81,scaleX:0.5655,scaleY:0.5655,x:179.9,y:374.6},0).wait(1).to({scaleX:0.584,scaleY:0.584},0).wait(1).to({scaleX:0.6007,scaleY:0.6007},0).wait(1).to({scaleX:0.6157,scaleY:0.6157,y:374.55},0).wait(1).to({scaleX:0.629,scaleY:0.629,x:179.85},0).wait(1).to({scaleX:0.6408,scaleY:0.6408,x:179.9},0).wait(1).to({scaleX:0.6512,scaleY:0.6512,x:179.85},0).wait(1).to({regX:82,regY:81.2,scaleX:0.6603,scaleY:0.6603,x:180.2,y:374.75},0).wait(1).to({regX:81.5,regY:81,scaleX:0.6688,scaleY:0.6688,x:179.85,y:374.6},0).wait(1).to({scaleX:0.6761,scaleY:0.6761,x:179.8},0).wait(1).to({scaleX:0.6824,scaleY:0.6824},0).wait(1).to({scaleX:0.6876,scaleY:0.6876,x:179.85},0).wait(1).to({scaleX:0.6919,scaleY:0.6919},0).wait(1).to({scaleX:0.6954,scaleY:0.6954,x:179.8,y:374.65},0).wait(1).to({scaleX:0.698,scaleY:0.698,x:179.85,y:374.6},0).wait(1).to({regX:81.8,regY:81.2,scaleX:0.7,scaleY:0.7,x:180.15,y:374.85},0).to({regX:81.9,scaleX:0.84,scaleY:0.84,x:180.25,y:374.8,alpha:0},4).to({_off:true},1).wait(8));

	// cr2_original
	this.instance_3 = new lib.cr2_original_1();
	this.instance_3.setTransform(180.2,374.85,0.2672,0.2672,0,0,0,60.1,64);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(40).to({_off:false},0).to({scaleX:0.5,scaleY:0.5,x:180.15,y:374.8},18,cjs.Ease.quadOut).to({scaleX:0.6,scaleY:0.6,alpha:0},4).to({_off:true},1).wait(8));

	// cr_b
	this.instance_4 = new lib.cr_b_1();
	this.instance_4.setTransform(180.15,374.85,0.3993,0.3993,38.6321,0,0,4.4,99.5);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(43).to({_off:false},0).to({regY:99.6,scaleX:0.599,scaleY:0.7036,rotation:38.6326,x:180.1,y:374.9},15,cjs.Ease.quadOut).to({regX:4.5,regY:99.7,scaleX:0.7188,scaleY:0.8443,rotation:38.632,x:180.15,y:374.95,alpha:0},4).to({_off:true},1).wait(8));

	// レイヤー_33
	this.instance_5 = new lib.br_y_1();
	this.instance_5.setTransform(179.6,373.65,0.6,0.6,0,0,0,75.5,75.6);
	this.instance_5.alpha = 0.5;
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(36).to({_off:false},0).wait(1).to({regY:75.5,scaleX:0.6237,scaleY:0.6237,y:373.6,alpha:0.5348},0).wait(1).to({scaleX:0.6477,scaleY:0.6477,x:179.55,y:373.55,alpha:0.5701},0).wait(1).to({scaleX:0.6718,scaleY:0.6718,alpha:0.6054},0).wait(1).to({scaleX:0.6957,scaleY:0.6957,alpha:0.6404},0).wait(1).to({scaleX:0.7191,scaleY:0.7191,y:373.6,alpha:0.6748},0).wait(1).to({scaleX:0.7419,scaleY:0.7419,y:373.55,alpha:0.7082},0).wait(1).to({scaleX:0.7638,scaleY:0.7638,alpha:0.7404},0).wait(1).to({scaleX:0.7848,scaleY:0.7848,y:373.6,alpha:0.7711},0).wait(1).to({scaleX:0.8047,scaleY:0.8047,alpha:0.8003},0).wait(1).to({scaleX:0.8234,scaleY:0.8234,alpha:0.8277},0).wait(1).to({scaleX:0.8409,scaleY:0.8409,alpha:0.8534},0).wait(1).to({scaleX:0.8572,scaleY:0.8572,y:373.55,alpha:0.8774},0).wait(1).to({scaleX:0.8724,scaleY:0.8724,y:373.6,alpha:0.8996},0).wait(1).to({scaleX:0.8864,scaleY:0.8864,alpha:0.9202},0).wait(1).to({scaleX:0.8993,scaleY:0.8993,alpha:0.9391},0).wait(1).to({scaleX:0.9111,scaleY:0.9111,alpha:0.9564},0).wait(1).to({scaleX:0.9219,scaleY:0.9219,alpha:0.9723},0).wait(1).to({scaleX:0.9318,scaleY:0.9318,alpha:0.9868},0).wait(1).to({regY:75.7,scaleX:0.9408,scaleY:0.9408,x:179.6,y:373.75,alpha:1},0).to({regX:75.7,regY:75.6,scaleX:1,scaleY:1,x:179.65,y:373.65,alpha:0},15).wait(1));

	// エフェクト
	this.instance_6 = new lib.エフェクト();
	this.instance_6.setTransform(234.15,312.6,1,1,0,0,0,58.2,55.6);
	this.instance_6.alpha = 0;
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(10).to({_off:false},0).to({alpha:1},7).wait(3).to({alpha:0},15).to({_off:true},1).wait(35));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(104,257,187.10000000000002,192.10000000000002);


(lib.fox_walk = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// fox_walk1
	this.instance = new lib.fox_walk1_1();
	this.instance.setTransform(87.5,264.6,1,1,0,0,0,87.5,264.6);

	this.instance_1 = new lib.fox_walk2_1();
	this.instance_1.setTransform(87.5,262.6,1,1.0075,0,0,0,87.5,262.6);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleY:0.9395,y:264.65},9).to({_off:true},1).wait(10));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(10).to({_off:false},0).to({scaleY:0.9695,y:262.65},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-1.9,187,286.9);


(lib.main = function(mode,startPosition,loop,reversed) {
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
	this.frame_22 = function() {
		this.dispatchEvent(new Event("chooseCard"));
	}
	this.frame_28 = function() {
		this.stop();
		this.dispatchEvent(new Event("wait"));
	}
	this.frame_65 = function() {
		this.dispatchEvent(new Event("gushStars"));
	}
	this.frame_103 = function() {
		this.dispatchEvent(new Event("fadeout"));
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(22).call(this.frame_22).wait(6).call(this.frame_28).wait(37).call(this.frame_65).wait(38).call(this.frame_103).wait(11));

	// レイヤー_23
	this.instance = new lib.fox_walk1_1();
	this.instance.setTransform(185,605,0.4,0.4,0,0,0,87.7,268.9);
	this.instance.alpha = 0;

	this.instance_1 = new lib.fox_walk();
	this.instance_1.setTransform(185,588.2,0.4,0.3538,0,0,0,87.7,268.9);

	this.instance_2 = new lib.fox();
	this.instance_2.setTransform(179.45,589.8,0.4,0.3667,4.4865,0,0,119.5,272.9);
	this.instance_2._off = true;

	this.instance_3 = new lib.fox3_2();
	this.instance_3.setTransform(179.45,589.85,0.3999,0.4423,-1.2275,0,0,119.7,273.2);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance}]},13).to({state:[{t:this.instance_1}]},8).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_2}]},6).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_2}]},8).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_3}]},6).to({state:[{t:this.instance_3}]},5).to({state:[{t:this.instance_3}]},16).to({state:[{t:this.instance_3}]},3).to({state:[{t:this.instance_3}]},3).to({state:[{t:this.instance_3}]},4).to({state:[{t:this.instance_3}]},28).to({state:[{t:this.instance_3}]},10).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance).to({y:588.2,alpha:1},13).to({_off:true,scaleY:0.3538},8).wait(93));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(22).to({_off:false},0).to({regY:273.1,scaleX:0.3999,scaleY:0.3953,rotation:8.2283,x:179.4,y:589.85},6).wait(1).to({regX:119.6,scaleY:0.3428,rotation:8.2271},8).to({_off:true},1).wait(76));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(38).to({_off:false},0).to({regX:119.8,regY:273.3,scaleY:0.4189,rotation:-1.2272,y:589.9},6).wait(21).to({y:580.4},3).wait(3).to({regX:119.9,regY:273.4,scaleY:0.4046,rotation:-1.2252,y:589.95},0).to({regX:119.8,regY:273.3,scaleY:0.4189,rotation:-1.2272,y:589.9},4).wait(28).to({y:599.9,alpha:0},10).wait(1));

	// レイヤー_22
	this.instance_4 = new lib.character_stand_1();
	this.instance_4.setTransform(180,612,0.5,0.5,0,0,0,111.5,56);
	this.instance_4.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({y:595.2,alpha:1},13).wait(90).to({y:605.2,alpha:0},10).wait(1));

	// レイヤー_21_コピー
	this.instance_5 = new lib.spotlight_1();
	this.instance_5.setTransform(-52.7,771.3,0.0674,0.5,0,22.7366,-157.2664,88.2,704.1);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(6).to({_off:false},0).to({regX:88.7,scaleX:0.5,skewY:-157.2634},6).wait(26).to({regX:88.5,scaleX:0.6896,scaleY:0.4994,skewX:22.5875,skewY:-157.4137,x:-52.65,y:771.25},6).to({regX:88.7,scaleX:0.5993,skewY:-157.414,x:-52.75},5).wait(13).to({regX:91,regY:704.2,scaleX:0.0258,skewY:-157.4192,x:-52.7},6).to({regX:88.8,scaleX:0.0277,rotation:22.5875,skewX:0,skewY:0,x:-52.65,y:771.3,alpha:0},4).to({_off:true},1).wait(41));

	// レイヤー_21_コピー_コピー
	this.instance_6 = new lib.spotlight_1();
	this.instance_6.setTransform(70.3,852.25,0.0674,0.5,0,7.7369,-172.2699,89.2,704.2);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(4).to({_off:false},0).to({regX:88.7,scaleX:0.5,skewY:-172.2631},6).wait(28).to({regX:88.5,scaleX:0.7534,scaleY:0.4997,skewX:7.562,skewY:-172.4373,x:70.35},6).to({regX:88.7,scaleX:0.6997,skewY:-172.4371,x:70.3},5).wait(13).to({regX:88.3,regY:704.4,scaleX:0.03,skewY:-172.4593,y:852.3},6).to({alpha:0},4).to({_off:true},1).wait(41));

	// レイヤー_21_コピー
	this.instance_7 = new lib.spotlight_1();
	this.instance_7.setTransform(285.9,852.25,0.0674,0.5,-7.7369,0,0,89.2,704.2);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(4).to({_off:false},0).to({regX:88.7,scaleX:0.5},6).wait(28).to({regX:88.8,scaleX:0.7865,scaleY:0.4997,rotation:-7.562,x:285.95,y:852.2},6).to({regX:88.7,scaleX:0.6997,x:285.85,y:852.25},5).wait(13).to({regX:88.2,regY:704.3,scaleX:0.0301,x:285.9},6).to({alpha:0},4).to({_off:true},1).wait(41));

	// レイヤー_21
	this.instance_8 = new lib.spotlight_1();
	this.instance_8.setTransform(412.75,771.3,0.0674,0.5,-22.7366,0,0,88.2,704.1);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(6).to({_off:false},0).to({regX:88.7,scaleX:0.5},6).wait(26).to({regX:88.8,regY:704.3,scaleX:0.6899,scaleY:0.4994,rotation:-22.5875,x:412.8,y:771.25},6).to({regX:88.7,regY:704.1,scaleX:0.5993,x:412.75},5).wait(13).to({regX:87.8,scaleX:0.0258,x:412.7},6).to({alpha:0},4).to({_off:true},1).wait(41));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-109,423.2,578,438.09999999999997);


// stage content:
(lib.skill_hammer = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_3
	this.instance = new lib.hammer();
	this.instance.setTransform(134.05,442,1,1,0,0,0,206.7,345.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// レイヤー_2
	this.instance_1 = new lib.main();
	this.instance_1.setTransform(180,320,1,1,0,0,0,180,320);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(304.3,718.6,-68.5,-78.60000000000002);
// library properties:
lib.properties = {
	id: '87BAAC54BB61134F907FD7FC94A51ECF',
	width: 360,
	height: 640,
	fps: 30,
	color: "#000000",
	opacity: 0.00,
	manifest: [
		{src:"images/skill_hammer_atlas_1.png?1699242448263", id:"skill_hammer_atlas_1"}
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
an.compositions['87BAAC54BB61134F907FD7FC94A51ECF'] = {
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