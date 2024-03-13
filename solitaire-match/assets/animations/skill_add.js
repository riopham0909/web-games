(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"skill_add_atlas_1", frames: [[445,0,54,58],[263,0,180,227],[0,0,261,229],[445,60,45,45]]}
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



(lib.kr_y = function() {
	this.initialize(ss["skill_add_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.squirrel_idol = function() {
	this.initialize(ss["skill_add_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.squirrel_plus1 = function() {
	this.initialize(ss["skill_add_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.sr_y = function() {
	this.initialize(ss["skill_add_atlas_1"]);
	this.gotoAndStop(3);
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


(lib.squirrel_plus1_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.squirrel_plus1();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.squirrel_plus1_1, new cjs.Rectangle(0,0,261,229), null);


(lib.squirrel_idol_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.squirrel_idol();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.squirrel_idol_1, new cjs.Rectangle(0,0,180,227), null);


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


(lib.リス跳ねる = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.squirrel_plus1_1();
	this.instance.setTransform(74.8,95.35,0.3998,0.4,-12.4525,0,0,143.4,218.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:143.3,regY:218.2,scaleY:0.4079,rotation:-12.4516,y:91.85},4).to({regX:143.4,scaleY:0.3852,rotation:-12.4518,x:74.75,y:95.3},5).to({regY:218.1,scaleY:0.4,rotation:-12.4525,x:74.8,y:95.35},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.3,-5.2,122.1,117.2);


(lib.エフェクト2 = function(mode,startPosition,loop,reversed) {
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

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,alpha:0},4).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:44.5},29).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:44.45,alpha:0},30).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:44.5},28).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:44.45,alpha:0},30).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:44.5},28).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:44.45,alpha:0},30).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regX:27.2,regY:29.1,scaleX:0.7,scaleY:0.7,x:32.65,y:44.5},14).wait(2));

	// kr_y
	this.instance_1 = new lib.kr_y_1();
	this.instance_1.setTransform(72.65,79.5,0.8333,0.8333,0,0,0,27.2,29.2);
	this.instance_1.alpha = 0.3281;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regY:29.3,scaleX:0.8,scaleY:0.8,x:72.6,y:79.45,alpha:0},10).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:79.5},29).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:79.45,alpha:0},30).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:79.5},28).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:79.45,alpha:0},30).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.2,scaleX:0.9,scaleY:0.9,y:79.5},28).to({regX:27.2,regY:29.3,scaleX:0.8,scaleY:0.8,y:79.45,alpha:0},30).wait(2).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,alpha:1},0).to({regY:29.1,scaleX:0.6143,scaleY:0.6143},8).wait(2));

	// kr_y
	this.instance_2 = new lib.kr_y_1();
	this.instance_2.setTransform(23.4,62.95,0.56,0.56,0,0,0,27.2,29);
	this.instance_2.alpha = 0.6016;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:27.1,scaleX:0.5,scaleY:0.5,x:23.35,alpha:0},18).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:62.95},29).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:62.95},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:62.95},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:63,alpha:1},0).wait(2));

	// kr_y
	this.instance_3 = new lib.kr_y_1();
	this.instance_3.setTransform(69.9,35,0.5866,0.5866,0,0,0,27.2,29.1);
	this.instance_3.alpha = 0.8711;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regX:27.1,regY:29,scaleX:0.5,scaleY:0.5,x:69.85,y:34.95,alpha:0},26).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:35,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:34.95},29).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:35,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:34.95},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:35,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:34.95},28).to({regX:27.2,regY:29.1,scaleX:0.52,scaleY:0.52,x:69.9,y:35,alpha:0.1992},24).wait(2));

	// kr_y
	this.instance_4 = new lib.kr_y_1();
	this.instance_4.setTransform(41.35,82.4,0.5143,0.5143,0,0,0,27.3,29.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},6).to({scaleX:0.5,scaleY:0.5,alpha:0},31).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:82.5,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:82.5,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:82.5,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:82.45},28).to({regY:29.1,scaleX:0.5533,scaleY:0.5533,y:82.5,alpha:0.5391},14).wait(2));

	// kr_y
	this.instance_5 = new lib.kr_y_1();
	this.instance_5.setTransform(83.35,37.95,0.5,0.5,0,0,0,27.1,29);
	this.instance_5.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:37.95},28).to({scaleX:0.5,scaleY:0.5,alpha:0},31).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:37.95},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.1,regY:29,scaleX:0.6,scaleY:0.6,y:37.95},28).to({scaleX:0.5,scaleY:0.5,alpha:0},30).wait(2).to({regX:27.2,regY:29.2,scaleX:0.2,scaleY:0.2,y:38,alpha:1},0).to({regX:27.4,regY:29.3,scaleX:0.4571,scaleY:0.4571,y:37.95},18).wait(2));

	// sr_y
	this.instance_6 = new lib.sr_y_1();
	this.instance_6.setTransform(51.3,92.3,0.5999,0.5999,130.4221,0,0,22.6,22.6);
	this.instance_6.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(2).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},39).wait(2).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},38).wait(2).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},38).wait(2).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},38).wait(2).to({regX:22.4,regY:22.5,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:52.3,y:87.45,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:51.3,y:92.3,alpha:0},38).wait(2));

	// sr_y_
	this.instance_7 = new lib.sr_y_1();
	this.instance_7.setTransform(84.9,89.35,0.5999,0.5999,130.4221,0,0,22.4,22.5);
	this.instance_7.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(2).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},39).wait(2).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},38).wait(2).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},38).wait(2).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},38).wait(2).to({regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:80.2,y:85.05,alpha:1},0).to({regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:84.9,y:89.35,alpha:0},38).wait(2));

	// sr_y
	this.instance_8 = new lib.sr_y_1();
	this.instance_8.setTransform(44.55,19.05,0.5999,0.5999,130.4221,0,0,22.6,22.5);
	this.instance_8.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(2).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},39).wait(2).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},38).wait(2).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},38).wait(2).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},38).wait(2).to({regX:22.4,regY:22.4,scaleX:0.4999,scaleY:0.4999,rotation:130.42,x:46.6,y:26.5,alpha:1},0).to({regX:22.6,regY:22.5,scaleX:0.5999,scaleY:0.5999,rotation:130.4221,x:44.55,y:19.05,alpha:0},38).wait(2));

	// sr_y
	this.instance_9 = new lib.sr_y_1();
	this.instance_9.setTransform(30.6,42.65,0.5789,0.5789,-114.0355,0,0,22.4,22.7);
	this.instance_9.alpha = 0.2109;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).to({scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},8).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},39).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},38).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},38).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:29.75,y:42.1,alpha:0},38).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:33.65,y:44.95,alpha:1},0).to({regY:22.7,scaleX:0.5789,scaleY:0.5789,rotation:-114.0355,x:30.6,y:42.65,alpha:0.2109},30).wait(2));

	// sr_y
	this.instance_10 = new lib.sr_y_1();
	this.instance_10.setTransform(19.2,73.15,0.5789,0.5789,-114.0355,0,0,22.3,22.5);
	this.instance_10.alpha = 0.2109;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).to({regX:22.4,regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},8).wait(2).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},39).wait(2).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},38).wait(2).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},38).wait(2).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:17.95,y:73.65,alpha:0},38).wait(2).to({regY:22.4,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:23.8,y:71.25,alpha:1},0).to({regX:22.3,regY:22.5,scaleX:0.5789,scaleY:0.5789,rotation:-114.0355,x:19.2,y:73.15,alpha:0.2109},30).wait(2));

	// sr_y
	this.instance_11 = new lib.sr_y_1();
	this.instance_11.setTransform(97.05,67.3,0.5789,0.5789,-114.0355,0,0,22.4,22.5);
	this.instance_11.alpha = 0.2109;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).to({regX:22.5,regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},8).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},39).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},38).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},38).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,rotation:-114.0357,x:98.7,y:67.55,alpha:0},38).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,rotation:-114.0367,x:91.05,y:66.15,alpha:1},0).to({regX:22.4,scaleX:0.5789,scaleY:0.5789,rotation:-114.0355,x:97.05,y:67.3,alpha:0.2109},30).wait(2));

	// sr_y
	this.instance_12 = new lib.sr_y_1();
	this.instance_12.setTransform(88.3,46.5,0.5473,0.5473,0,0,0,22.4,22.7);
	this.instance_12.alpha = 0.5313;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).to({regX:22.5,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},20).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},39).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},38).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},38).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regY:22.7,scaleX:0.6,scaleY:0.6,x:90.6,y:45.25,alpha:0},38).wait(2).to({regY:22.6,scaleX:0.5,scaleY:0.5,x:86.35,y:47.65,alpha:1},0).to({regX:22.4,regY:22.7,scaleX:0.5473,scaleY:0.5473,x:88.3,y:46.5,alpha:0.5313},18).wait(2));

	// sr_y
	this.instance_13 = new lib.sr_y_1();
	this.instance_13.setTransform(66.5,25,0.5473,0.5473,0,0,0,22.6,22.6);
	this.instance_13.alpha = 0.5313;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).to({regX:22.5,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},20).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},39).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},38).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},38).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regY:22.6,scaleX:0.6,scaleY:0.6,x:66.6,y:21.6,alpha:0},38).wait(2).to({regY:22.5,scaleX:0.5,scaleY:0.5,x:66.35,y:27.95,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.5473,scaleY:0.5473,x:66.5,y:25,alpha:0.5313},18).wait(2));

	// sr_y
	this.instance_14 = new lib.sr_y_1();
	this.instance_14.setTransform(41.45,94.5,0.5473,0.5473,0,0,0,22.4,22.6);
	this.instance_14.alpha = 0.5313;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).to({regX:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},20).wait(2).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},39).wait(2).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},38).wait(2).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},38).wait(2).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.6,regY:22.6,scaleX:0.6,scaleY:0.6,x:39.25,y:97.85,alpha:0},38).wait(2).to({regX:22.5,regY:22.5,scaleX:0.5,scaleY:0.5,x:43.55,y:91.5,alpha:1},0).to({regX:22.4,regY:22.6,scaleX:0.5473,scaleY:0.5473,x:41.45,y:94.5,alpha:0.5313},18).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,116.5,111.4);


// stage content:
(lib.skill_add = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [11];
	// timeline functions:
	this.frame_11 = function() {
		this.dispatchEvent(new Event("take"));
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(11).call(this.frame_11).wait(33));

	// squirrel_idol_png
	this.instance = new lib.squirrel_idol_1();
	this.instance.setTransform(257.55,625,0.4,0.4,0,0,179.9388,87.2,211);
	this.instance.alpha = 0.3906;

	this.instance_1 = new lib.リス跳ねる();
	this.instance_1.setTransform(253.25,590.2,1,1,0,0,0,60.8,56);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleY:0.3948,skewX:1.484,skewY:181.4407,x:257.6,y:624.95,alpha:1},3).to({regX:87.4,regY:210.9,scaleY:0.3827,skewX:4.9496,skewY:184.9504,x:257.55},7).to({_off:true},1).wait(33));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(11).to({_off:false},0).to({x:233.25},15).to({x:225.25,alpha:0},6).to({_off:true},1).wait(11));

	// エフェクト
	this.instance_2 = new lib.エフェクト2();
	this.instance_2.setTransform(314.75,583.1,1,1,0,0,0,58.2,55.8);
	this.instance_2.alpha = 0;
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(11).to({_off:false},0).to({alpha:1},4).wait(17).to({regX:58.3,x:314.8,y:583.05,alpha:0},11).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(344.5,847.2,26.30000000000001,-201);
// library properties:
lib.properties = {
	id: '394C84341852DD44B2D1D2AED466E69B',
	width: 360,
	height: 640,
	fps: 30,
	color: "#000000",
	opacity: 0.00,
	manifest: [
		{src:"images/skill_add_atlas_1.png?1697701954078", id:"skill_add_atlas_1"}
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
an.compositions['394C84341852DD44B2D1D2AED466E69B'] = {
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