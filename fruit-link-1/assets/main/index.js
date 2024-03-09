window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Advert: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9dffdFRskNJ469Z2aS1nOJx", "Advert");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var NativeCtrl_1 = require("./NativeCtrl");
    var Util_1 = require("./Util");
    var Main_1 = require("../ui/Main");
    var Logger_1 = require("./Logger");
    var SDK_1 = require("./SDK");
    var ADVERT_STATUS_OK = 1;
    var ADVERT_STATUS_NO_AD = 2;
    var ADVERT_STATUS_SKIP = 3;
    var ADVERT_STATUS_PLAYING = 4;
    var ADVERT_STATUS_ERROR = 5;
    var ADVERT_EVENT_SHOW_BANNER = "advert_event_show_banner";
    var ADVERT_EVENT_HIDE_BANNER = "advert_event_hide_banner";
    var ADVERT_EVENT_WIN = "advert_event_win";
    var ADVERT_EVENT_LOSE = "advert_event_lose";
    var ADVERT_EVENT_BOMB = "advert_event_bomb";
    var ADVERT_EVENT_MAGNIFIER = "advert_event_magnifier";
    var ADVERT_EVENT_REFRESHMAP = "advert_event_refreshmap";
    function openMask() {
      Main_1.default.instance.setAdvNodeActive(true);
    }
    function closeMask() {
      Main_1.default.instance.setAdvNodeActive(false);
    }
    function showAdvert(event) {
      return __awaiter(this, void 0, void 0, function() {
        var ret, flag, flag, flag;
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            if (!cc.sys.isNative) return [ 3, 2 ];
            Logger_1.default.info("[Advert showAdvert] start:" + event);
            openMask();
            return [ 4, Util_1.default.promisify(NativeCtrl_1.default.advertShow, null, event) ];

           case 1:
            ret = _a.sent();
            closeMask();
            Logger_1.default.info("[Advert showAdvert] end:" + event);
            return [ 2, ret ];

           case 2:
            if (!cc.sys.isBrowser) return [ 3, 12 ];
            if (!(event === ADVERT_EVENT_SHOW_BANNER)) return [ 3, 3 ];
            return [ 3, 12 ];

           case 3:
            if (!(event === ADVERT_EVENT_HIDE_BANNER)) return [ 3, 4 ];
            return [ 3, 12 ];

           case 4:
            if (!(event === ADVERT_EVENT_WIN)) return [ 3, 5 ];
            SDK_1.default.showInters();
            return [ 3, 12 ];

           case 5:
            if (!(event === ADVERT_EVENT_LOSE)) return [ 3, 6 ];
            SDK_1.default.showInters();
            return [ 3, 12 ];

           case 6:
            if (!(event === ADVERT_EVENT_BOMB)) return [ 3, 8 ];
            return [ 4, SDK_1.default.showReward() ];

           case 7:
            flag = _a.sent();
            return [ 2, flag ? ADVERT_STATUS_OK : ADVERT_STATUS_NO_AD ];

           case 8:
            if (!(event === ADVERT_EVENT_MAGNIFIER)) return [ 3, 10 ];
            return [ 4, SDK_1.default.showReward() ];

           case 9:
            flag = _a.sent();
            return [ 2, flag ? ADVERT_STATUS_OK : ADVERT_STATUS_NO_AD ];

           case 10:
            if (!(event === ADVERT_EVENT_REFRESHMAP)) return [ 3, 12 ];
            return [ 4, SDK_1.default.showReward() ];

           case 11:
            flag = _a.sent();
            return [ 2, flag ? ADVERT_STATUS_OK : ADVERT_STATUS_NO_AD ];

           case 12:
            return [ 2, ADVERT_STATUS_OK ];
          }
        });
      });
    }
    exports.default = {
      ADVERT_STATUS_OK: ADVERT_STATUS_OK,
      ADVERT_STATUS_NO_AD: ADVERT_STATUS_NO_AD,
      ADVERT_STATUS_SKIP: ADVERT_STATUS_SKIP,
      ADVERT_STATUS_PLAYING: ADVERT_STATUS_PLAYING,
      ADVERT_STATUS_ERROR: ADVERT_STATUS_ERROR,
      ADVERT_EVENT_SHOW_BANNER: "advert_event_show_banner",
      ADVERT_EVENT_HIDE_BANNER: "advert_event_hide_banner",
      ADVERT_EVENT_WIN: "advert_event_win",
      ADVERT_EVENT_LOSE: "advert_event_lose",
      ADVERT_EVENT_BOMB: "advert_event_bomb",
      ADVERT_EVENT_MAGNIFIER: "advert_event_magnifier",
      ADVERT_EVENT_REFRESHMAP: "advert_event_refreshmap",
      showAdvert: showAdvert
    };
    cc._RF.pop();
  }, {
    "../ui/Main": "Main",
    "./Logger": "Logger",
    "./NativeCtrl": "NativeCtrl",
    "./SDK": "SDK",
    "./Util": "Util"
  } ],
  AltasDefine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8443e0i+4FMW5+QBCAP146v", "AltasDefine");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ALTAS = void 0;
    var ALTAS;
    (function(ALTAS) {
      ALTAS["CN"] = "textures/cn/cn";
      ALTAS["COMMON"] = "textures/common/common";
      ALTAS["EN"] = "textures/en/en";
      ALTAS["GAME"] = "textures/game/game";
      ALTAS["GAMELEVEL"] = "textures/gamelevel/gamelevel";
      ALTAS["HAOPING"] = "textures/haoping/haoping";
      ALTAS["HOME"] = "textures/home/home";
      ALTAS["LOADING"] = "textures/loading/loading";
      ALTAS["WIN"] = "textures/win/win";
    })(ALTAS = exports.ALTAS || (exports.ALTAS = {}));
    cc._RF.pop();
  }, {} ],
  AtlasPool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "232e84GAX1M06wy7ALUu3YQ", "AtlasPool");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ALTAS = void 0;
    var Util_1 = require("./Util");
    var ALTAS;
    (function(ALTAS) {
      ALTAS["CN"] = "textures/cn/cn";
      ALTAS["COMMON"] = "textures/common/common";
      ALTAS["EN"] = "textures/en/en";
      ALTAS["FT"] = "textures/ft/ft";
      ALTAS["GAME"] = "textures/game/game";
      ALTAS["GAMELEVEL"] = "textures/gamelevel/gamelevel";
      ALTAS["HAOPING"] = "textures/haoping/haoping";
      ALTAS["HOME"] = "textures/home/home";
      ALTAS["LOADING"] = "textures/loading/loading";
      ALTAS["WIN"] = "textures/win/win";
    })(ALTAS = exports.ALTAS || (exports.ALTAS = {}));
    var atlasMap = {};
    function getSpriteFrame(atlasUrl, frameName) {
      return __awaiter(this, void 0, void 0, function() {
        var atlas, spriteFrame, err;
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            atlas = atlasMap[atlasUrl];
            if (!!atlas) return [ 3, 2 ];
            return [ 4, Util_1.default.promisifyLoadRes(atlasUrl, cc.SpriteAtlas) ];

           case 1:
            atlas = _a.sent();
            atlasMap[atlasUrl] = atlas;
            _a.label = 2;

           case 2:
            spriteFrame = atlas.getSpriteFrame(frameName);
            if (spriteFrame) return [ 2, spriteFrame ];
            err = new Error("[Atlas.getSpriteFrame] " + atlasUrl + "\u56fe\u96c6\u4e2d\u4e0d\u5b58\u5728" + frameName + "\u8d44\u6e90");
            throw err;
          }
        });
      });
    }
    function clearAll() {
      Object.keys(atlasMap).forEach(function(e) {
        cc.loader.releaseRes(e, cc.SpriteAtlas);
        delete atlasMap[e];
      });
    }
    exports.default = {
      getSpriteFrame: getSpriteFrame,
      clearAll: clearAll
    };
    cc._RF.pop();
  }, {
    "./Util": "Util"
  } ],
  AudioDefine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9d13aKYXG9BxI8bSS5IB4+b", "AudioDefine");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AUDIO_URL = void 0;
    var AUDIO_URL;
    (function(AUDIO_URL) {
      AUDIO_URL["bgm1"] = "sound/bgm1";
      AUDIO_URL["bgm2"] = "sound/bgm2";
      AUDIO_URL["click"] = "sound/click";
      AUDIO_URL["click1"] = "sound/click1";
      AUDIO_URL["daojishi"] = "sound/daojishi";
      AUDIO_URL["go"] = "sound/go";
      AUDIO_URL["item1"] = "sound/item1";
      AUDIO_URL["item2"] = "sound/item2";
      AUDIO_URL["lose"] = "sound/lose";
      AUDIO_URL["ready"] = "sound/ready";
      AUDIO_URL["star"] = "sound/star";
      AUDIO_URL["win"] = "sound/win";
      AUDIO_URL["xiao"] = "sound/xiao";
    })(AUDIO_URL = exports.AUDIO_URL || (exports.AUDIO_URL = {}));
    cc._RF.pop();
  }, {} ],
  AudioNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "887fckVozRHGp3TtGTGocx5", "AudioNode");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var User_1 = require("../lib/User");
    var Util_1 = require("../lib/Util");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var AudioNode = function(_super) {
      __extends(AudioNode, _super);
      function AudioNode() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._musicEnable = true;
        _this._curMusicUrl = "";
        _this._effectEnable = true;
        _this._audioClipMap = {};
        return _this;
      }
      AudioNode_1 = AudioNode;
      Object.defineProperty(AudioNode, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      AudioNode.prototype.onLoad = function() {
        AudioNode_1._instance = this;
      };
      AudioNode.prototype.onInit = function() {
        return __awaiter(this, void 0, void 0, function() {
          var audioUrlArr, key, audioClipArr, i, key;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              audioUrlArr = [];
              for (key in AudioPool_1.AUDIO_URL) audioUrlArr.push(AudioPool_1.AUDIO_URL[key]);
              return [ 4, Util_1.default.promisifyLoadResArray(audioUrlArr, cc.AudioClip) ];

             case 1:
              audioClipArr = _a.sent();
              i = 0;
              for (key in AudioPool_1.AUDIO_URL) {
                this._audioClipMap[AudioPool_1.AUDIO_URL[key]] = audioClipArr[i];
                i++;
              }
              this._musicEnable = User_1.default.instance.getUserInfo().musicState;
              this._effectEnable = User_1.default.instance.getUserInfo().effectState;
              return [ 2 ];
            }
          });
        });
      };
      AudioNode.prototype.playSound = function(audioUrl) {
        if (this._effectEnable) {
          var clip = this._audioClipMap[audioUrl];
          clip && cc.audioEngine.playEffect(clip, false);
        }
      };
      AudioNode.prototype.playBgMusic = function(bgMusic) {
        if (this._musicEnable && this._curMusicUrl !== bgMusic) {
          cc.audioEngine.stopMusic();
          var clip = this._audioClipMap[bgMusic];
          if (clip) {
            this._curMusicUrl = bgMusic;
            cc.audioEngine.playMusic(clip, true);
          }
        }
      };
      AudioNode.prototype.setBgMusic = function(state, bgMusic) {
        this._curMusicUrl = "";
        if (state) {
          this._musicEnable = true;
          this.playBgMusic(bgMusic);
        } else {
          cc.audioEngine.stopMusic();
          this._musicEnable = false;
        }
        User_1.default.instance.setBgMusic(state);
      };
      AudioNode.prototype.setEffect = function(state) {
        this._effectEnable = state;
        User_1.default.instance.setSoundEffect(state);
      };
      var AudioNode_1;
      AudioNode._instance = null;
      AudioNode = AudioNode_1 = __decorate([ ccclass ], AudioNode);
      return AudioNode;
    }(cc.Component);
    exports.default = AudioNode;
    cc._RF.pop();
  }, {
    "../lib/AudioPool": "AudioPool",
    "../lib/User": "User",
    "../lib/Util": "Util"
  } ],
  AudioPool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8887azrMwtNVKR7BoIRpMWO", "AudioPool");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AUDIO_URL = void 0;
    var Util_1 = require("./Util");
    var AUDIO_URL;
    (function(AUDIO_URL) {
      AUDIO_URL["bgm1"] = "sound/bgm1";
      AUDIO_URL["bgm2"] = "sound/bgm2";
      AUDIO_URL["click"] = "sound/click";
      AUDIO_URL["click1"] = "sound/click1";
      AUDIO_URL["daojishi"] = "sound/daojishi";
      AUDIO_URL["go"] = "sound/go";
      AUDIO_URL["item1"] = "sound/item1";
      AUDIO_URL["item2"] = "sound/item2";
      AUDIO_URL["lose"] = "sound/lose";
      AUDIO_URL["ready"] = "sound/ready";
      AUDIO_URL["star"] = "sound/star";
      AUDIO_URL["win"] = "sound/win";
      AUDIO_URL["xiao"] = "sound/xiao";
    })(AUDIO_URL = exports.AUDIO_URL || (exports.AUDIO_URL = {}));
    var audioClipMap = {};
    function initAudioPool() {
      return __awaiter(this, void 0, void 0, function() {
        var audioUrlArr, key, audioClipArr, i, key;
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            audioUrlArr = [];
            for (key in AUDIO_URL) audioUrlArr.push(AUDIO_URL[key]);
            return [ 4, Util_1.default.promisifyLoadResArray(audioUrlArr, cc.AudioClip) ];

           case 1:
            audioClipArr = _a.sent();
            i = 0;
            for (key in AUDIO_URL) {
              audioClipMap[AUDIO_URL[key]] = audioClipArr[i];
              i++;
            }
            return [ 2 ];
          }
        });
      });
    }
    function getAudioClip(audioUrl) {
      return audioClipMap[audioUrl];
    }
    exports.default = {
      initAudioPool: initAudioPool,
      getAudioClip: getAudioClip
    };
    cc._RF.pop();
  }, {
    "./Util": "Util"
  } ],
  ContentNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6124t0UjVCfrPjmpbM26Zy", "ContentNode");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ContentNode = function(_super) {
      __extends(ContentNode, _super);
      function ContentNode() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      ContentNode_1 = ContentNode;
      Object.defineProperty(ContentNode, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      ContentNode.prototype.onLoad = function() {
        ContentNode_1._instance = this;
      };
      var ContentNode_1;
      ContentNode._instance = null;
      ContentNode = ContentNode_1 = __decorate([ ccclass ], ContentNode);
      return ContentNode;
    }(cc.Component);
    exports.default = ContentNode;
    cc._RF.pop();
  }, {} ],
  DGameDefine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b039yD43pPv7ytoLLP6/gx", "DGameDefine");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GAMESTATE = void 0;
    var GAMESTATE;
    (function(GAMESTATE) {
      GAMESTATE[GAMESTATE["REARY"] = 0] = "REARY";
      GAMESTATE[GAMESTATE["START"] = 1] = "START";
      GAMESTATE[GAMESTATE["NORMAL"] = 2] = "NORMAL";
      GAMESTATE[GAMESTATE["MATCHING"] = 3] = "MATCHING";
      GAMESTATE[GAMESTATE["PAUSE"] = 4] = "PAUSE";
      GAMESTATE[GAMESTATE["END"] = 5] = "END";
      GAMESTATE[GAMESTATE["BOMB"] = 6] = "BOMB";
      GAMESTATE[GAMESTATE["MAGNIFIER"] = 7] = "MAGNIFIER";
      GAMESTATE[GAMESTATE["CHANGEMAP"] = 8] = "CHANGEMAP";
    })(GAMESTATE = exports.GAMESTATE || (exports.GAMESTATE = {}));
    cc._RF.pop();
  }, {} ],
  DGameLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d861bI65dL0J54jEYxK92i", "DGameLevel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GAMEMODE = void 0;
    var LoadNode_1 = require("./LoadNode");
    var PassConfig_1 = require("../config/PassConfig");
    var Util_1 = require("../lib/Util");
    var NodePool_1 = require("../lib/NodePool");
    var GameLevelItem_1 = require("./GameLevelItem");
    var AtlasPool_1 = require("../lib/AtlasPool");
    var AudioNode_1 = require("./AudioNode");
    var GameParm_1 = require("../lib/GameParm");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GAMEMODE;
    (function(GAMEMODE) {
      GAMEMODE[GAMEMODE["NORMAL"] = 1] = "NORMAL";
      GAMEMODE[GAMEMODE["TIME"] = 2] = "TIME";
      GAMEMODE[GAMEMODE["NIGHTMARE"] = 3] = "NIGHTMARE";
    })(GAMEMODE = exports.GAMEMODE || (exports.GAMEMODE = {}));
    var DGameLevel = function(_super) {
      __extends(DGameLevel, _super);
      function DGameLevel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.modeSpr = null;
        _this.pageLay = null;
        _this.bgSpr = null;
        _this.levelPv = null;
        _this._turnToPage = 0;
        return _this;
      }
      DGameLevel_1 = DGameLevel;
      Object.defineProperty(DGameLevel, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      DGameLevel.prototype.onInit = function(args) {
        return __awaiter(this, void 0, void 0, function() {
          var gameLevelDataArr, _a, pageNum, i, node, lay;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              DGameLevel_1._instance = this;
              this._turnToPage = Math.floor((args[0].pass - 1) / 20);
              this.bgSpr.node.scale = GameParm_1.default.instance.getConetentViewScale();
              AudioNode_1.default.instance.playBgMusic(AudioPool_1.AUDIO_URL.bgm1);
              this._gameMode = args[0].mode;
              this._gameMode === GAMEMODE.NORMAL ? gameLevelDataArr = Util_1.default.findParamsArrFromConfig(GAMEMODE.NORMAL, "PassType", PassConfig_1.PassConfig) : this._gameMode === GAMEMODE.TIME ? gameLevelDataArr = Util_1.default.findParamsArrFromConfig(GAMEMODE.TIME, "PassType", PassConfig_1.PassConfig) : this._gameMode === GAMEMODE.NIGHTMARE && (gameLevelDataArr = Util_1.default.findParamsArrFromConfig(GAMEMODE.NIGHTMARE, "PassType", PassConfig_1.PassConfig));
              _a = this.modeSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.CN, "" + this._gameMode) ];

             case 1:
              _a.spriteFrame = _b.sent();
              pageNum = Math.ceil(gameLevelDataArr.length / 20);
              for (i = 0; i < pageNum; i++) {
                node = new cc.Node();
                node.setContentSize(950, 1300);
                node.setPosition(1425, 650);
                node.anchorY = 1;
                lay = node.addComponent(cc.Layout);
                lay.type = cc.Layout.Type.GRID;
                lay.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
                lay.paddingLeft = 25;
                lay.spacingX = 60;
                lay.spacingY = 60;
                this.levelPv.addPage(node);
              }
              return [ 4, this.showGameLevel(gameLevelDataArr) ];

             case 2:
              _b.sent();
              return [ 2 ];
            }
          });
        });
      };
      DGameLevel.prototype.start = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.scheduleOnce(function() {
                _this.levelPv.scrollToPage(_this._turnToPage, .1);
              }, .1);
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, .5, this) ];

             case 1:
              _a.sent();
              LoadNode_1.default.instance.hideLoad();
              return [ 2 ];
            }
          });
        });
      };
      DGameLevel.prototype.showGameLevel = function(gameLevelDataArr) {
        return __awaiter(this, void 0, void 0, function() {
          var j, pageNode, i, gameLevelData, itemPre, itemNode;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              j = 0;
              _a.label = 1;

             case 1:
              if (!(j < this.pageLay.node.children.length)) return [ 3, 7 ];
              pageNode = this.pageLay.node.children[j];
              i = 20 * j;
              _a.label = 2;

             case 2:
              if (!(i < 20 * (j + 1))) return [ 3, 6 ];
              gameLevelData = gameLevelDataArr[i];
              if (!gameLevelData) return [ 3, 5 ];
              return [ 4, NodePool_1.default.getNode(GameLevelItem_1.default) ];

             case 3:
              itemPre = _a.sent();
              itemNode = cc.instantiate(itemPre);
              return [ 4, itemNode.getComponent(GameLevelItem_1.default).onInit([ {
                data: gameLevelData
              } ]) ];

             case 4:
              _a.sent();
              pageNode.addChild(itemNode);
              _a.label = 5;

             case 5:
              i++;
              return [ 3, 2 ];

             case 6:
              j++;
              return [ 3, 1 ];

             case 7:
              return [ 2 ];
            }
          });
        });
      };
      DGameLevel.prototype.onClickReturnBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        LoadNode_1.default.instance.loadContent("DHome", null);
      };
      DGameLevel.prototype.getGameMode = function() {
        return this._gameMode;
      };
      var DGameLevel_1;
      DGameLevel._instance = null;
      __decorate([ property(cc.Sprite) ], DGameLevel.prototype, "modeSpr", void 0);
      __decorate([ property(cc.Layout) ], DGameLevel.prototype, "pageLay", void 0);
      __decorate([ property(cc.Sprite) ], DGameLevel.prototype, "bgSpr", void 0);
      __decorate([ property(cc.PageView) ], DGameLevel.prototype, "levelPv", void 0);
      DGameLevel = DGameLevel_1 = __decorate([ ccclass ], DGameLevel);
      return DGameLevel;
    }(cc.Component);
    exports.default = DGameLevel;
    cc._RF.pop();
  }, {
    "../config/PassConfig": "PassConfig",
    "../lib/AtlasPool": "AtlasPool",
    "../lib/AudioPool": "AudioPool",
    "../lib/GameParm": "GameParm",
    "../lib/NodePool": "NodePool",
    "../lib/Util": "Util",
    "./AudioNode": "AudioNode",
    "./GameLevelItem": "GameLevelItem",
    "./LoadNode": "LoadNode"
  } ],
  DGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1b90/rohdEk4SdmmEZANaD", "DGame");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Util_1 = require("../lib/Util");
    var DGameLevel_1 = require("../ui/DGameLevel");
    var Logger_1 = require("../lib/Logger");
    var LlkMap_1 = require("./LlkMap");
    var DGameDefine_1 = require("./DGameDefine");
    var LoadNode_1 = require("../ui/LoadNode");
    var AudioNode_1 = require("../ui/AudioNode");
    var AtlasPool_1 = require("../lib/AtlasPool");
    var GameParm_1 = require("../lib/GameParm");
    var AudioPool_1 = require("../lib/AudioPool");
    var Advert_1 = require("../lib/Advert");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DGame = function(_super) {
      __extends(DGame, _super);
      function DGame() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.levelLab = null;
        _this.scroeLab = null;
        _this.gameNode = null;
        _this.timerPb = null;
        _this.timerBarSpr = null;
        _this.fruitSpr = null;
        _this.bombNumLab = null;
        _this.magnifierNumLab = null;
        _this.changeMapNumLab = null;
        _this.rightRedLineAn = null;
        _this.leftRedLineAn = null;
        _this.stageAn = null;
        _this.stageLab = null;
        _this.bombBtn = null;
        _this.chooseBombSpr = null;
        _this.bombSpr = null;
        _this.magnifierSpr = null;
        _this.changeMapSpr = null;
        _this.bgSpr = null;
        _this.adDiSpr = null;
        _this.topSprNode = null;
        _this.goodsLayNode = null;
        _this.comboLastTime = 0;
        _this.comboAddScore = 0;
        _this.propNum = 0;
        _this.propAdv = 0;
        _this.timeAddScore = 0;
        _this.createTimes1 = 0;
        _this.createTimes2 = 0;
        _this.timeModeLevelTime = 0;
        _this.timeModeAddTime = 0;
        _this.fruitScaleNum = 0;
        _this._gameState = DGameDefine_1.GAMESTATE.REARY;
        _this._comboDuration = 0;
        _this._comboCount = 0;
        _this._passTime = 0;
        _this._timeRemain = 0;
        _this._linkCount = 0;
        _this._targetNumber = 0;
        _this._gameScore = 0;
        _this._timeModeFinalTime = 0;
        _this._bombNum = 0;
        _this._magnifierNum = 0;
        _this._changeMapNum = 0;
        _this._bombAdv = 0;
        _this._magnifierAdv = 0;
        _this._changeMapAdv = 0;
        _this._curStep = 1;
        _this._stepStarArr = [];
        return _this;
      }
      DGame_1 = DGame;
      Object.defineProperty(DGame, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      DGame.prototype.start = function() {
        this.node.setContentSize(cc.winSize);
        var leftWidget = this.leftRedLineAn.node.getComponent(cc.Widget);
        leftWidget.left = 0;
        leftWidget.updateAlignment();
        var rightWidget = this.rightRedLineAn.node.getComponent(cc.Widget);
        rightWidget.right = 0;
        rightWidget.updateAlignment();
        this.bgSpr.node.scale = GameParm_1.default.instance.getConetentViewScale();
        LoadNode_1.default.instance.hideLoad();
        this.topSprNode.getComponent(cc.Widget).updateAlignment();
        var topY = this.topSprNode.y - this.topSprNode.height / 2;
        var bottomY = this.goodsLayNode.y + this.goodsLayNode.height / 2;
        this.gameNode.y = (topY + bottomY) / 2;
      };
      DGame.prototype.onInit = function(args) {
        return __awaiter(this, void 0, void 0, function() {
          var rndFruit, _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              DGame_1._instance = this;
              AudioNode_1.default.instance.playBgMusic(AudioPool_1.AUDIO_URL.bgm2);
              this._levelData = args[0].data;
              this._targetNumber = this.createTimes1;
              this._bombNum = this.propNum;
              this._magnifierNum = this.propNum;
              this._changeMapNum = this.propNum;
              this._bombAdv = this.propAdv;
              this._magnifierAdv = this.propAdv;
              this._changeMapAdv = this.propAdv;
              this.bombNumLab.string = "" + this._bombNum;
              this.magnifierNumLab.string = "" + this._magnifierNum;
              this.changeMapNumLab.string = "" + this._changeMapNum;
              this.levelLab.string = "" + this._levelData.PassId;
              rndFruit = Util_1.default.randomInt(7, 1);
              _a = this.fruitSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "" + rndFruit) ];

             case 1:
              _a.spriteFrame = _b.sent();
              return [ 4, this.addMap() ];

             case 2:
              _b.sent();
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.addMap = function() {
        return __awaiter(this, void 0, void 0, function() {
          var prefabName, prefab, node;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              1 === this._curStep ? this.stageLab.string = "" + this._levelData.PassId : this.stageLab.string = "" + this._curStep;
              this.gameNode.removeAllChildren();
              prefabName = this._levelData.PrefabId[this._curStep - 1];
              return [ 4, Util_1.default.promisifyLoadRes("prefab/jichuguan/" + prefabName, cc.Prefab) ];

             case 1:
              prefab = _a.sent();
              if (!prefab) return [ 3, 3 ];
              node = cc.instantiate(prefab);
              this.gameNode.addChild(node);
              return [ 4, node.getComponent(LlkMap_1.default).onInit() ];

             case 2:
              _a.sent();
              return [ 3, 4 ];

             case 3:
              Logger_1.default.info("[DGame onInit] prefabURL=" + prefabName);
              _a.label = 4;

             case 4:
              this.stageAn.play("stage");
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.resetGameParam = function() {
        this._comboCount = 0;
        this._linkCount = 0;
        this._comboDuration = 0;
        this._timeRemain = 0;
        this._timeModeFinalTime = 0;
      };
      DGame.prototype.calScore = function(worldPos) {
        return __awaiter(this, void 0, void 0, function() {
          var node_1, sprite, _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this._comboCount++;
              this._comboCount = this._comboCount > 7 ? 7 : this._comboCount;
              this._linkCount++;
              this._gameScore += 200 + (this._comboCount - 1) * this.comboAddScore;
              this._comboDuration = 0;
              if (!(this._comboCount > 1)) return [ 3, 2 ];
              node_1 = new cc.Node();
              sprite = node_1.addComponent(cc.Sprite);
              _a = sprite;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "combo" + this._comboCount) ];

             case 1:
              _a.spriteFrame = _b.sent();
              this.node.addChild(node_1);
              node_1.setPosition(this.node.convertToNodeSpaceAR(worldPos));
              node_1.y += 50;
              node_1.runAction(cc.sequence(cc.delayTime(.2), cc.fadeOut(.3), cc.callFunc(function() {
                node_1.destroy();
              })));
              _b.label = 2;

             case 2:
              this.addTime(2);
              this.scroeLab.string = "" + this._gameScore;
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.addTime = function(count) {
        this._levelData.PassType === DGameLevel_1.GAMEMODE.TIME && (this._timeRemain = this._timeRemain + this.timeModeAddTime * count / 2 > this._passTime ? this._passTime : this._timeRemain + this.timeModeAddTime);
      };
      DGame.prototype.addFruit = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!(this._levelData.PassType === DGameLevel_1.GAMEMODE.NIGHTMARE)) return [ 3, 2 ];
              if (!(this._linkCount === this._targetNumber && !LlkMap_1.default.instance.isGameOver())) return [ 3, 2 ];
              this._targetNumber = this._targetNumber === this.createTimes1 ? this.createTimes2 : this.createTimes1;
              return [ 4, LlkMap_1.default.instance.createFruit() ];

             case 1:
              _a.sent();
              this._linkCount = 0;
              _a.label = 2;

             case 2:
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.onClickSettingBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        if (this._gameState === DGameDefine_1.GAMESTATE.NORMAL) {
          LoadNode_1.default.instance.loadDialog("DSetting", [ {
            levelData: this._levelData
          } ]);
          this.setGameState(DGameDefine_1.GAMESTATE.PAUSE);
        }
      };
      DGame.prototype.resetRedLineOpacity = function() {
        this.leftRedLineAn.stop();
        this.leftRedLineAn.node.opacity = 0;
        this.rightRedLineAn.stop();
        this.rightRedLineAn.node.opacity = 0;
      };
      DGame.prototype.gameWin = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _a, data;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.setGameState(DGameDefine_1.GAMESTATE.END);
              this.resetRedLineOpacity();
              this._levelData.PassType === DGameLevel_1.GAMEMODE.TIME && (this._timeRemain = this._timeModeFinalTime);
              this._gameScore += Math.round(this._timeRemain) * this.timeAddScore;
              this.scroeLab.string = "" + this._gameScore;
              this._timeRemain / this._passTime >= 2 / 3 ? this._stepStarArr.push(3) : this._timeRemain / this._passTime >= 1 / 3 ? this._stepStarArr.push(2) : this._stepStarArr.push(1);
              if (!(this._curStep < this._levelData.PrefabId.length)) return [ 3, 3 ];
              this._curStep++;
              _a = this.stageAn.node.getComponent(cc.Sprite);
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "step") ];

             case 1:
              _a.spriteFrame = _b.sent();
              return [ 4, this.addMap() ];

             case 2:
              _b.sent();
              return [ 3, 4 ];

             case 3:
              data = [ {
                levelData: this.getLevelData(),
                score: this.getGameScore(),
                starArr: this._stepStarArr
              } ];
              LoadNode_1.default.instance.loadDialog("DWin", data);
              _b.label = 4;

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.gameLose = function() {
        this.setGameState(DGameDefine_1.GAMESTATE.END);
        this.resetRedLineOpacity();
        var data = [ {
          levelData: this._levelData,
          score: this._gameScore
        } ];
        LoadNode_1.default.instance.loadDialog("DLose", data);
      };
      DGame.prototype.update = function(dt) {
        if (this._gameState === DGameDefine_1.GAMESTATE.NORMAL || this._gameState === DGameDefine_1.GAMESTATE.MATCHING || this._gameState === DGameDefine_1.GAMESTATE.BOMB || this._gameState === DGameDefine_1.GAMESTATE.MAGNIFIER || this._gameState === DGameDefine_1.GAMESTATE.CHANGEMAP) {
          this._comboDuration += dt;
          if (this._comboDuration >= this.comboLastTime) {
            this._comboDuration = 0;
            this._comboCount = 0;
          }
          this._timeRemain -= dt;
          this._levelData.PassType === DGameLevel_1.GAMEMODE.TIME && this._timeModeFinalTime > this._timeRemain && (this._timeModeFinalTime = this._timeRemain);
          if (this._timeRemain <= 5) {
            var animState = this.leftRedLineAn.getAnimationState("daojishi");
            animState.isPlaying || this.leftRedLineAn.play("daojishi");
            animState = this.rightRedLineAn.getAnimationState("daojishi");
            animState.isPlaying || this.rightRedLineAn.play("daojishi");
          } else {
            this.leftRedLineAn.stop();
            this.leftRedLineAn.node.opacity = 0;
            this.rightRedLineAn.stop();
            this.rightRedLineAn.node.opacity = 0;
          }
          this.timerPb.progress = this._timeRemain / this._passTime;
          this.fruitSpr.node.x = this.timerBarSpr.node.width;
          this.timerPb.progress <= 0 && this.gameLose();
        }
      };
      DGame.prototype.onClickBomb = function() {
        return __awaiter(this, void 0, void 0, function() {
          var result, _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              if (!(this._gameState === DGameDefine_1.GAMESTATE.NORMAL)) return [ 3, 7 ];
              if (!(this._bombNum > 0)) return [ 3, 1 ];
              LlkMap_1.default.instance.clearFirst();
              this.chooseBombSpr.node.active = true;
              this.setGameState(DGameDefine_1.GAMESTATE.BOMB);
              return [ 3, 6 ];

             case 1:
              if (!(this._bombAdv > 0)) return [ 3, 6 ];
              this.setGameState(DGameDefine_1.GAMESTATE.PAUSE);
              return [ 4, Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_BOMB) ];

             case 2:
              result = _b.sent();
              Logger_1.default.info("advert result " + result);
              if (!(result === Advert_1.default.ADVERT_STATUS_OK)) return [ 3, 4 ];
              this._bombAdv--;
              this._bombNum = 1;
              this.bombNumLab.string = "" + this._bombNum;
              _a = this.bombSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "goods2") ];

             case 3:
              _a.spriteFrame = _b.sent();
              this.adDiSpr.node.active = false;
              return [ 3, 5 ];

             case 4:
              result === Advert_1.default.ADVERT_STATUS_NO_AD || result === Advert_1.default.ADVERT_STATUS_ERROR ? LoadNode_1.default.instance.loadToast("DTips", {
                imgName: "guanggao"
              }) : result === Advert_1.default.ADVERT_STATUS_SKIP && LoadNode_1.default.instance.loadToast("DTips", {
                imgName: "wz"
              });
              _b.label = 5;

             case 5:
              this.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              _b.label = 6;

             case 6:
              return [ 3, 8 ];

             case 7:
              if (this._gameState === DGameDefine_1.GAMESTATE.BOMB) {
                this._gameState = DGameDefine_1.GAMESTATE.NORMAL;
                this.chooseBombSpr.node.active = false;
              }
              _b.label = 8;

             case 8:
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.reduceBomb = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this.hideBombChoose();
              this._bombNum--;
              this.bombNumLab.string = "" + this._bombNum;
              if (!(0 === this._bombNum)) return [ 3, 2 ];
              this._bombAdv > 0 && (this.adDiSpr.node.active = true);
              _a = this.bombSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "goods2_disable") ];

             case 1:
              _a.spriteFrame = _b.sent();
              _b.label = 2;

             case 2:
              this._bombAdv <= 0 && (this.bombBtn.interactable = false);
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.onClickMagnifier = function(event) {
        return __awaiter(this, void 0, void 0, function() {
          var _a, btnNode, result, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              if (!(this._gameState === DGameDefine_1.GAMESTATE.NORMAL)) return [ 3, 9 ];
              if (!(this._magnifierNum > 0)) return [ 3, 4 ];
              LlkMap_1.default.instance.clearFirst();
              this.setGameState(DGameDefine_1.GAMESTATE.MAGNIFIER);
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.item1);
              this._magnifierNum--;
              this.magnifierNumLab.string = "" + this._magnifierNum;
              if (!(0 === this._magnifierNum)) return [ 3, 2 ];
              _a = this.magnifierSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "goods1_disable") ];

             case 1:
              _a.spriteFrame = _c.sent();
              this._magnifierAdv > 0 && (this.adDiSpr.node.active = true);
              _c.label = 2;

             case 2:
              if (this._magnifierAdv <= 0) {
                btnNode = event.target;
                btnNode.getComponent(cc.Button).interactable = false;
              }
              return [ 4, LlkMap_1.default.instance.autoClear() ];

             case 3:
              _c.sent();
              return [ 3, 9 ];

             case 4:
              if (!(this._magnifierAdv > 0)) return [ 3, 9 ];
              this.setGameState(DGameDefine_1.GAMESTATE.PAUSE);
              return [ 4, Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_MAGNIFIER) ];

             case 5:
              result = _c.sent();
              Logger_1.default.info("advert result " + result);
              if (!(result === Advert_1.default.ADVERT_STATUS_OK)) return [ 3, 7 ];
              this._magnifierAdv--;
              this._magnifierNum = 1;
              this.magnifierNumLab.string = "" + this._magnifierNum;
              _b = this.magnifierSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "goods1") ];

             case 6:
              _b.spriteFrame = _c.sent();
              this.adDiSpr.node.active = false;
              return [ 3, 8 ];

             case 7:
              result === Advert_1.default.ADVERT_STATUS_NO_AD || result === Advert_1.default.ADVERT_STATUS_ERROR ? LoadNode_1.default.instance.loadToast("DTips", {
                imgName: "guanggao"
              }) : result === Advert_1.default.ADVERT_STATUS_SKIP && LoadNode_1.default.instance.loadToast("DTips", {
                imgName: "wz"
              });
              _c.label = 8;

             case 8:
              this.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              _c.label = 9;

             case 9:
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.onClickChangeMap = function(event) {
        return __awaiter(this, void 0, void 0, function() {
          var _a, btnNode, result, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              if (!(this._gameState === DGameDefine_1.GAMESTATE.NORMAL)) return [ 3, 8 ];
              if (!(this._changeMapNum > 0)) return [ 3, 3 ];
              LlkMap_1.default.instance.clearFirst();
              this.setGameState(DGameDefine_1.GAMESTATE.CHANGEMAP);
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.item2);
              this._changeMapNum--;
              this.changeMapNumLab.string = "" + this._changeMapNum;
              if (!(0 === this._changeMapNum)) return [ 3, 2 ];
              _a = this.changeMapSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "goods3_disable") ];

             case 1:
              _a.spriteFrame = _c.sent();
              this._changeMapAdv > 0 && (this.adDiSpr.node.active = true);
              _c.label = 2;

             case 2:
              if (this._changeMapAdv <= 0) {
                btnNode = event.target;
                btnNode.getComponent(cc.Button).interactable = false;
              }
              LlkMap_1.default.instance.changeMap();
              LlkMap_1.default.instance.isDrop();
              this.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              return [ 3, 8 ];

             case 3:
              if (!(this._changeMapAdv > 0)) return [ 3, 8 ];
              this.setGameState(DGameDefine_1.GAMESTATE.PAUSE);
              return [ 4, Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_REFRESHMAP) ];

             case 4:
              result = _c.sent();
              Logger_1.default.info("advert result " + result);
              if (!(result === Advert_1.default.ADVERT_STATUS_OK)) return [ 3, 6 ];
              this._changeMapAdv--;
              this._changeMapNum = 1;
              this.changeMapNumLab.string = "" + this._changeMapNum;
              _b = this.changeMapSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "goods3") ];

             case 5:
              _b.spriteFrame = _c.sent();
              this.adDiSpr.node.active = false;
              return [ 3, 7 ];

             case 6:
              result === Advert_1.default.ADVERT_STATUS_NO_AD || result === Advert_1.default.ADVERT_STATUS_ERROR ? LoadNode_1.default.instance.loadToast("DTips", {
                imgName: "guanggao"
              }) : result === Advert_1.default.ADVERT_STATUS_SKIP && LoadNode_1.default.instance.loadToast("DTips", {
                imgName: "wz"
              });
              _c.label = 7;

             case 7:
              this.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              _c.label = 8;

             case 8:
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.onclickAutoClear = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!(this._gameState === DGameDefine_1.GAMESTATE.NORMAL)) return [ 3, 2 ];
              LlkMap_1.default.instance.clearFirst();
              return [ 4, LlkMap_1.default.instance.autoClear() ];

             case 1:
              _a.sent();
              this.onclickAutoClear();
              _a.label = 2;

             case 2:
              return [ 2 ];
            }
          });
        });
      };
      DGame.prototype.setCountDown = function(childrenCount) {
        this._levelData.PassType === DGameLevel_1.GAMEMODE.TIME ? this._timeModeFinalTime = this._passTime = this._timeRemain = this.timeModeLevelTime : this._timeModeFinalTime = this._passTime = this._timeRemain = Math.round(2.1 * childrenCount);
      };
      DGame.prototype.gameReborn = function() {};
      DGame.prototype.getLevelData = function() {
        return this._levelData;
      };
      DGame.prototype.getGameScore = function() {
        return this._gameScore;
      };
      DGame.prototype.getGameState = function() {
        return this._gameState;
      };
      DGame.prototype.hideBombChoose = function() {
        this.chooseBombSpr.node.active = false;
      };
      DGame.prototype.setGameState = function(state) {
        this._gameState = state;
      };
      DGame.prototype.getFruitScaleNum = function() {
        return this.fruitScaleNum;
      };
      var DGame_1;
      DGame._instance = null;
      __decorate([ property(cc.Label) ], DGame.prototype, "levelLab", void 0);
      __decorate([ property(cc.Label) ], DGame.prototype, "scroeLab", void 0);
      __decorate([ property(cc.Node) ], DGame.prototype, "gameNode", void 0);
      __decorate([ property(cc.ProgressBar) ], DGame.prototype, "timerPb", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "timerBarSpr", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "fruitSpr", void 0);
      __decorate([ property(cc.Label) ], DGame.prototype, "bombNumLab", void 0);
      __decorate([ property(cc.Label) ], DGame.prototype, "magnifierNumLab", void 0);
      __decorate([ property(cc.Label) ], DGame.prototype, "changeMapNumLab", void 0);
      __decorate([ property(cc.Animation) ], DGame.prototype, "rightRedLineAn", void 0);
      __decorate([ property(cc.Animation) ], DGame.prototype, "leftRedLineAn", void 0);
      __decorate([ property(cc.Animation) ], DGame.prototype, "stageAn", void 0);
      __decorate([ property(cc.Label) ], DGame.prototype, "stageLab", void 0);
      __decorate([ property(cc.Button) ], DGame.prototype, "bombBtn", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "chooseBombSpr", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "bombSpr", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "magnifierSpr", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "changeMapSpr", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "bgSpr", void 0);
      __decorate([ property(cc.Sprite) ], DGame.prototype, "adDiSpr", void 0);
      __decorate([ property(cc.Node) ], DGame.prototype, "topSprNode", void 0);
      __decorate([ property(cc.Node) ], DGame.prototype, "goodsLayNode", void 0);
      __decorate([ property({
        tooltip: "combo\u6301\u7eed\u65f6\u95f4"
      }) ], DGame.prototype, "comboLastTime", void 0);
      __decorate([ property({
        tooltip: "combo\u5206\u6570\u52a0\u6210"
      }) ], DGame.prototype, "comboAddScore", void 0);
      __decorate([ property({
        tooltip: "\u9053\u5177\u521d\u59cb\u6570\u91cf"
      }) ], DGame.prototype, "propNum", void 0);
      __decorate([ property({
        tooltip: "\u9053\u5177\u5e7f\u544a\u53ef\u89c2\u770b\u6b21\u6570"
      }) ], DGame.prototype, "propAdv", void 0);
      __decorate([ property({
        tooltip: "\u5269\u4f59\u65f6\u95f4\u5206\u6570\u52a0\u6210"
      }) ], DGame.prototype, "timeAddScore", void 0);
      __decorate([ property({
        tooltip: "\u68a6\u9765\u6a21\u5f0f\u8fbe\u6210\u6d88\u9664\u6b21\u6570\u521b\u5efa\u6c34\u679c"
      }) ], DGame.prototype, "createTimes1", void 0);
      __decorate([ property({
        tooltip: "\u68a6\u9765\u6a21\u5f0f\u8fbe\u6210\u6d88\u9664\u6b21\u6570\u521b\u5efa\u6c34\u679c"
      }) ], DGame.prototype, "createTimes2", void 0);
      __decorate([ property({
        tooltip: "\u65f6\u95f4\u6a21\u5f0f\u5173\u5361\u65f6\u95f4"
      }) ], DGame.prototype, "timeModeLevelTime", void 0);
      __decorate([ property({
        tooltip: "\u65f6\u95f4\u6a21\u5f0f\u6d88\u9664\u5757\u52a0\u65f6\u95f4"
      }) ], DGame.prototype, "timeModeAddTime", void 0);
      __decorate([ property({
        tooltip: "\u6c34\u679c\u653e\u5927\u500d\u6570"
      }) ], DGame.prototype, "fruitScaleNum", void 0);
      DGame = DGame_1 = __decorate([ ccclass ], DGame);
      return DGame;
    }(cc.Component);
    exports.default = DGame;
    cc._RF.pop();
  }, {
    "../lib/Advert": "Advert",
    "../lib/AtlasPool": "AtlasPool",
    "../lib/AudioPool": "AudioPool",
    "../lib/GameParm": "GameParm",
    "../lib/Logger": "Logger",
    "../lib/Util": "Util",
    "../ui/AudioNode": "AudioNode",
    "../ui/DGameLevel": "DGameLevel",
    "../ui/LoadNode": "LoadNode",
    "./DGameDefine": "DGameDefine",
    "./LlkMap": "LlkMap"
  } ],
  DHome: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5c842kI4u9GpKImNC3voAdK", "DHome");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DGameLevel_1 = require("./DGameLevel");
    var LoadNode_1 = require("./LoadNode");
    var AudioNode_1 = require("./AudioNode");
    var User_1 = require("../lib/User");
    var AtlasPool_1 = require("../lib/AtlasPool");
    var GameParm_1 = require("../lib/GameParm");
    var Util_1 = require("../lib/Util");
    var NativeCtrl_1 = require("../lib/NativeCtrl");
    var AudioPool_1 = require("../lib/AudioPool");
    var Advert_1 = require("../lib/Advert");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DHome = function(_super) {
      __extends(DHome, _super);
      function DHome() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.musicBtn = null;
        _this.effectBtn = null;
        _this.bgSpr = null;
        return _this;
      }
      DHome_1 = DHome;
      Object.defineProperty(DHome, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      DHome.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            try {
              DHome_1._instance = this;
              this.node.setContentSize(cc.winSize);
              this.bgSpr.node.scale = GameParm_1.default.instance.getConetentViewScale();
              AudioNode_1.default.instance.playBgMusic(AudioPool_1.AUDIO_URL.bgm1);
              this.refreshBtnFrame();
              Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_HIDE_BANNER);
            } catch (error) {
              Util_1.default.showError(error);
            }
            return [ 2 ];
          });
        });
      };
      DHome.prototype.start = function() {
        try {
          LoadNode_1.default.instance.hideLoad();
        } catch (error) {
          Util_1.default.showError(error);
        }
      };
      DHome.prototype.onClickNormalBtn = function() {
        try {
          AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
          LoadNode_1.default.instance.loadContent("DGameLevel", [ {
            mode: DGameLevel_1.GAMEMODE.NORMAL,
            pass: User_1.default.instance.getGameModeInfo(DGameLevel_1.GAMEMODE.NORMAL).length
          } ]);
          Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_SHOW_BANNER);
        } catch (error) {
          Util_1.default.showError(error);
        }
      };
      DHome.prototype.onClickTimeBtn = function() {
        try {
          AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
          LoadNode_1.default.instance.loadContent("DGameLevel", [ {
            mode: DGameLevel_1.GAMEMODE.TIME,
            pass: User_1.default.instance.getGameModeInfo(DGameLevel_1.GAMEMODE.TIME).length
          } ]);
          Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_SHOW_BANNER);
        } catch (error) {
          Util_1.default.showError(error);
        }
      };
      DHome.prototype.onClickNightmareBtn = function() {
        try {
          AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
          LoadNode_1.default.instance.loadContent("DGameLevel", [ {
            mode: DGameLevel_1.GAMEMODE.NIGHTMARE,
            pass: User_1.default.instance.getGameModeInfo(DGameLevel_1.GAMEMODE.TIME).length
          } ]);
          Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_SHOW_BANNER);
        } catch (error) {
          Util_1.default.showError(error);
        }
      };
      DHome.prototype.onClickMusic = function() {
        try {
          AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
          AudioNode_1.default.instance.setBgMusic(!User_1.default.instance.getUserInfo().musicState, AudioPool_1.AUDIO_URL.bgm1);
          this.refreshBtnFrame();
        } catch (error) {
          Util_1.default.showError(error);
        }
      };
      DHome.prototype.onClickEffect = function() {
        try {
          AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
          AudioNode_1.default.instance.setEffect(!User_1.default.instance.getUserInfo().effectState);
          this.refreshBtnFrame();
        } catch (error) {
          Util_1.default.showError(error);
        }
      };
      DHome.prototype.onClickRate = function() {
        return __awaiter(this, void 0, void 0, function() {
          var error_1;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              _a.trys.push([ 0, 2, , 3 ]);
              return [ 4, NativeCtrl_1.default.openRating(false) ];

             case 1:
              _a.sent();
              return [ 3, 3 ];

             case 2:
              error_1 = _a.sent();
              Util_1.default.showError(error_1);
              return [ 3, 3 ];

             case 3:
              return [ 2 ];
            }
          });
        });
      };
      DHome.prototype.onClickRank = function() {
        return __awaiter(this, void 0, void 0, function() {
          var error_2;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              _a.trys.push([ 0, 2, , 3 ]);
              return [ 4, Util_1.default.promisify(NativeCtrl_1.default.leaderboardsShow, NativeCtrl_1.default) ];

             case 1:
              _a.sent();
              return [ 3, 3 ];

             case 2:
              error_2 = _a.sent();
              Util_1.default.showError(error_2);
              return [ 3, 3 ];

             case 3:
              return [ 2 ];
            }
          });
        });
      };
      DHome.prototype.refreshBtnFrame = function() {
        return __awaiter(this, void 0, void 0, function() {
          var musicSpr, _a, _b, effectSpr, _c, _d;
          return __generator(this, function(_e) {
            switch (_e.label) {
             case 0:
              musicSpr = this.musicBtn.node.getComponent(cc.Sprite);
              if (!User_1.default.instance.getUserInfo().musicState) return [ 3, 2 ];
              _a = musicSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinyue") ];

             case 1:
              _a.spriteFrame = _e.sent();
              return [ 3, 4 ];

             case 2:
              _b = musicSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinyueguanbi") ];

             case 3:
              _b.spriteFrame = _e.sent();
              _e.label = 4;

             case 4:
              effectSpr = this.effectBtn.node.getComponent(cc.Sprite);
              if (!User_1.default.instance.getUserInfo().effectState) return [ 3, 6 ];
              _c = effectSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinxiao") ];

             case 5:
              _c.spriteFrame = _e.sent();
              return [ 3, 8 ];

             case 6:
              _d = effectSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinxiaoguanbi") ];

             case 7:
              _d.spriteFrame = _e.sent();
              _e.label = 8;

             case 8:
              return [ 2 ];
            }
          });
        });
      };
      var DHome_1;
      DHome._instance = null;
      __decorate([ property(cc.Button) ], DHome.prototype, "musicBtn", void 0);
      __decorate([ property(cc.Button) ], DHome.prototype, "effectBtn", void 0);
      __decorate([ property(cc.Sprite) ], DHome.prototype, "bgSpr", void 0);
      DHome = DHome_1 = __decorate([ ccclass ], DHome);
      return DHome;
    }(cc.Component);
    exports.default = DHome;
    cc._RF.pop();
  }, {
    "../lib/Advert": "Advert",
    "../lib/AtlasPool": "AtlasPool",
    "../lib/AudioPool": "AudioPool",
    "../lib/GameParm": "GameParm",
    "../lib/NativeCtrl": "NativeCtrl",
    "../lib/User": "User",
    "../lib/Util": "Util",
    "./AudioNode": "AudioNode",
    "./DGameLevel": "DGameLevel",
    "./LoadNode": "LoadNode"
  } ],
  DLose: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f96a1sTJ/1OnK2vTpX6l8zt", "DLose");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LoadNode_1 = require("./LoadNode");
    var AudioNode_1 = require("./AudioNode");
    var Util_1 = require("../lib/Util");
    var AudioPool_1 = require("../lib/AudioPool");
    var Advert_1 = require("../lib/Advert");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DLose = function(_super) {
      __extends(DLose, _super);
      function DLose() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.levelLab = null;
        _this.sorceLab = null;
        _this.topLab = null;
        _this.btnArr = [];
        _this._levelData = null;
        _this._argsData = null;
        return _this;
      }
      DLose.prototype.onInit = function(args) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            this._argsData = args;
            return [ 2 ];
          });
        });
      };
      DLose.prototype.start = function() {
        return __awaiter(this, void 0, void 0, function() {
          var score, repeat, interval, addValue_1, curScore_1, fadTime, _loop_1, _i, _a, btn;
          var _this = this;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              this._levelData = this._argsData[0].levelData;
              this.levelLab.string = "" + this._levelData.PassId;
              score = Math.round(this._argsData[0].score);
              this.sorceLab.string = "" + score;
              this.topLab.string = "" + score;
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.lose);
              repeat = 20;
              interval = .03;
              if (!(score / repeat > 1)) return [ 3, 2 ];
              addValue_1 = Math.floor(score / repeat);
              curScore_1 = 0;
              this.schedule(function() {
                curScore_1 += addValue_1;
                _this.sorceLab.string = "" + curScore_1;
              }, interval, repeat - 1);
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, repeat * interval, this) ];

             case 1:
              _b.sent();
              _b.label = 2;

             case 2:
              this.sorceLab.string = "" + score;
              this.topLab.node.opacity = 255;
              fadTime = .8;
              _loop_1 = function(btn) {
                btn.node.runAction(cc.sequence(cc.fadeIn(fadTime), cc.callFunc(function() {
                  btn.interactable = true;
                })));
              };
              for (_i = 0, _a = this.btnArr; _i < _a.length; _i++) {
                btn = _a[_i];
                _loop_1(btn);
              }
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, fadTime, this) ];

             case 3:
              _b.sent();
              return [ 4, Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_LOSE) ];

             case 4:
              _b.sent();
              return [ 2 ];
            }
          });
        });
      };
      DLose.prototype.onClickQuitBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        this.node.destroy();
        LoadNode_1.default.instance.loadContent("DGameLevel", [ {
          mode: this._levelData.PassType,
          pass: this._levelData.PassId
        } ]);
      };
      DLose.prototype.onClickResetBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        this.node.destroy();
        LoadNode_1.default.instance.loadContent("DGame", [ {
          data: this._levelData
        } ]);
      };
      __decorate([ property(cc.Label) ], DLose.prototype, "levelLab", void 0);
      __decorate([ property(cc.Label) ], DLose.prototype, "sorceLab", void 0);
      __decorate([ property(cc.Label) ], DLose.prototype, "topLab", void 0);
      __decorate([ property(cc.Button) ], DLose.prototype, "btnArr", void 0);
      DLose = __decorate([ ccclass ], DLose);
      return DLose;
    }(cc.Component);
    exports.default = DLose;
    cc._RF.pop();
  }, {
    "../lib/Advert": "Advert",
    "../lib/AudioPool": "AudioPool",
    "../lib/Util": "Util",
    "./AudioNode": "AudioNode",
    "./LoadNode": "LoadNode"
  } ],
  DSetting: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "27e3cfFRnxKwK90kcXl3ubn", "DSetting");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DGame_1 = require("../game/DGame");
    var DGameDefine_1 = require("../game/DGameDefine");
    var AtlasPool_1 = require("../lib/AtlasPool");
    var User_1 = require("../lib/User");
    var AudioNode_1 = require("./AudioNode");
    var LoadNode_1 = require("./LoadNode");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DSetting = function(_super) {
      __extends(DSetting, _super);
      function DSetting() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.musicBtn = null;
        _this.effectBtn = null;
        _this._levelData = null;
        return _this;
      }
      DSetting.prototype.onInit = function(args) {
        this._levelData = args[0].levelData;
        this.refreshBtnFrame();
      };
      DSetting.prototype.onClickQuitBtn = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
            LoadNode_1.default.instance.loadContent("DGameLevel", [ {
              mode: this._levelData.PassType,
              pass: this._levelData.PassId
            } ]);
            this.node.destroy();
            return [ 2 ];
          });
        });
      };
      DSetting.prototype.onClickResetBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        LoadNode_1.default.instance.loadContent("DGame", [ {
          data: this._levelData
        } ]);
        this.node.destroy();
      };
      DSetting.prototype.onClickContinueBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
        this.node.destroy();
      };
      DSetting.prototype.onClickMusic = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        AudioNode_1.default.instance.setBgMusic(!User_1.default.instance.getUserInfo().musicState, AudioPool_1.AUDIO_URL.bgm2);
        this.refreshBtnFrame();
      };
      DSetting.prototype.onClickEffect = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        AudioNode_1.default.instance.setEffect(!User_1.default.instance.getUserInfo().effectState);
        this.refreshBtnFrame();
      };
      DSetting.prototype.refreshBtnFrame = function() {
        return __awaiter(this, void 0, void 0, function() {
          var musicSpr, _a, _b, effectSpr, _c, _d;
          return __generator(this, function(_e) {
            switch (_e.label) {
             case 0:
              musicSpr = this.musicBtn.node.getComponent(cc.Sprite);
              if (!User_1.default.instance.getUserInfo().musicState) return [ 3, 2 ];
              _a = musicSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinyue") ];

             case 1:
              _a.spriteFrame = _e.sent();
              return [ 3, 4 ];

             case 2:
              _b = musicSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinyueguanbi") ];

             case 3:
              _b.spriteFrame = _e.sent();
              _e.label = 4;

             case 4:
              effectSpr = this.effectBtn.node.getComponent(cc.Sprite);
              if (!User_1.default.instance.getUserInfo().effectState) return [ 3, 6 ];
              _c = effectSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinxiao") ];

             case 5:
              _c.spriteFrame = _e.sent();
              return [ 3, 8 ];

             case 6:
              _d = effectSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.COMMON, "yinxiaoguanbi") ];

             case 7:
              _d.spriteFrame = _e.sent();
              _e.label = 8;

             case 8:
              return [ 2 ];
            }
          });
        });
      };
      __decorate([ property(cc.Button) ], DSetting.prototype, "musicBtn", void 0);
      __decorate([ property(cc.Button) ], DSetting.prototype, "effectBtn", void 0);
      DSetting = __decorate([ ccclass ], DSetting);
      return DSetting;
    }(cc.Component);
    exports.default = DSetting;
    cc._RF.pop();
  }, {
    "../game/DGame": "DGame",
    "../game/DGameDefine": "DGameDefine",
    "../lib/AtlasPool": "AtlasPool",
    "../lib/AudioPool": "AudioPool",
    "../lib/User": "User",
    "./AudioNode": "AudioNode",
    "./LoadNode": "LoadNode"
  } ],
  DTips: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6336f05fhBHk711s0eusERS", "DTips");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AtlasPool_1 = require("../lib/AtlasPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DTips = function(_super) {
      __extends(DTips, _super);
      function DTips() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.infoSpr = null;
        return _this;
      }
      DTips.prototype.onLoad = function() {
        var _this = this;
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(.5), cc.callFunc(function() {
          _this.node.destroy();
        })));
      };
      DTips.prototype.onInit = function(arg) {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              _a = this.infoSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.EN, arg.imgName) ];

             case 1:
              _a.spriteFrame = _b.sent();
              return [ 2 ];
            }
          });
        });
      };
      __decorate([ property(cc.Sprite) ], DTips.prototype, "infoSpr", void 0);
      DTips = __decorate([ ccclass ], DTips);
      return DTips;
    }(cc.Component);
    exports.default = DTips;
    cc._RF.pop();
  }, {
    "../lib/AtlasPool": "AtlasPool"
  } ],
  DWin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e7b90IZF1RCkpvfXZ3O7Qw3", "DWin");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LoadNode_1 = require("./LoadNode");
    var PassConfig_1 = require("../config/PassConfig");
    var Util_1 = require("../lib/Util");
    var User_1 = require("../lib/User");
    var AudioNode_1 = require("./AudioNode");
    var NativeCtrl_1 = require("../lib/NativeCtrl");
    var Advert_1 = require("../lib/Advert");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DWin = function(_super) {
      __extends(DWin, _super);
      function DWin() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.levelLab = null;
        _this.sorceLab = null;
        _this.topLab = null;
        _this.starSprAn = [];
        _this.nextBtn = null;
        _this.shockAn = null;
        _this.btnArr = [];
        _this._levelData = null;
        _this._argsData = null;
        return _this;
      }
      DWin_1 = DWin;
      Object.defineProperty(DWin, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      DWin.prototype.onInit = function(args) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            DWin_1._instance = this;
            AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.win);
            this._argsData = args;
            return [ 2 ];
          });
        });
      };
      DWin.prototype.start = function() {
        return __awaiter(this, void 0, void 0, function() {
          var score, starArr, star, _i, starArr_1, starNum, gameModeInfo, recordInfo, repeat, interval, addValue, curScore, gameLevelDataArr, i, starAn, animationState, fadTime, _loop_1, _a, _b, btn;
          var _this = this;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              this._levelData = this._argsData[0].levelData;
              this.levelLab.string = "" + this._levelData.PassId;
              score = this._argsData[0].score;
              this.sorceLab.string = "" + score;
              this.topLab.string = "" + score;
              starArr = this._argsData[0].starArr;
              star = 0;
              for (_i = 0, starArr_1 = starArr; _i < starArr_1.length; _i++) {
                starNum = starArr_1[_i];
                star ? star > starNum && star-- : star = starNum;
              }
              gameModeInfo = User_1.default.instance.getGameModeInfo(this._levelData.PassType);
              recordInfo = gameModeInfo[this._levelData.PassId - 1];
              if (recordInfo) score > recordInfo.topScore ? User_1.default.instance.updateLevelRecord(this._levelData.PassType, {
                star: star,
                topScore: score,
                levelId: this._levelData.PassId
              }, true) : this.topLab.string = "" + recordInfo.topScore; else {
                this.topLab.string = "" + score;
                User_1.default.instance.updateLevelRecord(this._levelData.PassType, {
                  star: star,
                  topScore: score,
                  levelId: this._levelData.PassId
                }, true);
              }
              repeat = 20;
              interval = .03;
              addValue = Math.floor(score / repeat);
              curScore = 0;
              this.schedule(function() {
                curScore += addValue;
                _this.sorceLab.string = "" + curScore;
              }, interval, repeat - 1);
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, repeat * interval, this) ];

             case 1:
              _c.sent();
              this.sorceLab.string = "" + score;
              this.topLab.node.opacity = 255;
              gameLevelDataArr = Util_1.default.findParamsArrFromConfig(this._levelData.PassType, "PassType", PassConfig_1.PassConfig);
              gameLevelDataArr.length < this._levelData.PassId + 1 && (this.nextBtn.node.active = false);
              i = 0;
              _c.label = 2;

             case 2:
              if (!(i < star)) return [ 3, 6 ];
              starAn = this.starSprAn[i];
              starAn.node.opacity = 255;
              animationState = starAn.play("star1");
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.star);
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, animationState.duration, this) ];

             case 3:
              _c.sent();
              animationState = this.shockAn.play("doudong");
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, animationState.duration, this) ];

             case 4:
              _c.sent();
              _c.label = 5;

             case 5:
              i++;
              return [ 3, 2 ];

             case 6:
              fadTime = .8;
              _loop_1 = function(btn) {
                btn.node.runAction(cc.sequence(cc.fadeIn(fadTime), cc.callFunc(function() {
                  btn.interactable = true;
                })));
              };
              for (_a = 0, _b = this.btnArr; _a < _b.length; _a++) {
                btn = _b[_a];
                _loop_1(btn);
              }
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, fadTime, this) ];

             case 7:
              _c.sent();
              return [ 4, Advert_1.default.showAdvert(Advert_1.default.ADVERT_EVENT_WIN) ];

             case 8:
              _c.sent();
              NativeCtrl_1.default.openRating(true);
              return [ 2 ];
            }
          });
        });
      };
      DWin.prototype.onClickQuitBtn = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
        this.node.destroy();
        LoadNode_1.default.instance.loadContent("DGameLevel", [ {
          mode: this._levelData.PassType,
          pass: this._levelData.PassId
        } ]);
      };
      DWin.prototype.onClickResetBtn = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
              this.node.destroy();
              return [ 4, LoadNode_1.default.instance.loadContent("DGame", [ {
                data: this._levelData
              } ]) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      DWin.prototype.onClickNextBtn = function() {
        return __awaiter(this, void 0, void 0, function() {
          var gameLevelDataArr;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
              gameLevelDataArr = Util_1.default.findParamsArrFromConfig(this._levelData.PassType, "PassType", PassConfig_1.PassConfig);
              this.node.destroy();
              return [ 4, LoadNode_1.default.instance.loadContent("DGame", [ {
                data: gameLevelDataArr[this._levelData.PassId]
              } ]) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      var DWin_1;
      DWin._instance = null;
      __decorate([ property(cc.Label) ], DWin.prototype, "levelLab", void 0);
      __decorate([ property(cc.Label) ], DWin.prototype, "sorceLab", void 0);
      __decorate([ property(cc.Label) ], DWin.prototype, "topLab", void 0);
      __decorate([ property([ cc.Animation ]) ], DWin.prototype, "starSprAn", void 0);
      __decorate([ property(cc.Button) ], DWin.prototype, "nextBtn", void 0);
      __decorate([ property(cc.Animation) ], DWin.prototype, "shockAn", void 0);
      __decorate([ property(cc.Button) ], DWin.prototype, "btnArr", void 0);
      DWin = DWin_1 = __decorate([ ccclass ], DWin);
      return DWin;
    }(cc.Component);
    exports.default = DWin;
    cc._RF.pop();
  }, {
    "../config/PassConfig": "PassConfig",
    "../lib/Advert": "Advert",
    "../lib/AudioPool": "AudioPool",
    "../lib/NativeCtrl": "NativeCtrl",
    "../lib/User": "User",
    "../lib/Util": "Util",
    "./AudioNode": "AudioNode",
    "./LoadNode": "LoadNode"
  } ],
  DialogNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71b1dIsTslD4ZYsmqZJbgeg", "DialogNode");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DialogNode = function(_super) {
      __extends(DialogNode, _super);
      function DialogNode() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      DialogNode_1 = DialogNode;
      Object.defineProperty(DialogNode, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      DialogNode.prototype.onLoad = function() {
        DialogNode_1._instance = this;
      };
      var DialogNode_1;
      DialogNode._instance = null;
      DialogNode = DialogNode_1 = __decorate([ ccclass ], DialogNode);
      return DialogNode;
    }(cc.Component);
    exports.default = DialogNode;
    cc._RF.pop();
  }, {} ],
  Events: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d01b00oBvxAb7YbOLZu0djQ", "Events");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EVENT = void 0;
    var Logger_1 = require("./Logger");
    var eventsMap = {};
    function on(event, listener, target) {
      listener || cc.warn("event: " + event + " \u4e8b\u4ef6\u76d1\u542c\u51fd\u6570\u4e3a\u7a7a");
      var list = eventsMap[event];
      if (!list) {
        list = [];
        eventsMap[event] = list;
      }
      var idx = list.findIndex(function(e) {
        return e.target === target && e.listener === listener;
      });
      -1 !== idx && cc.warn("event: " + event + " \u91cd\u590d\u6ce8\u518c");
      list.push({
        target: target,
        listener: listener
      });
    }
    function off(event, listener, target) {
      var list = eventsMap[event];
      if (!list) {
        cc.warn("event: " + event + " \u4e8b\u4ef6\u4e0d\u5b58\u5728\uff0c\u65e0\u6cd5\u79fb\u9664");
        return;
      }
      var idx = list.findIndex(function(e) {
        return e.target === target && e.listener === listener;
      });
      -1 !== idx && list.splice(idx, 1);
      0 === list.length && delete eventsMap[event];
    }
    function emit(event, args) {
      void 0 === args && (args = null);
      Logger_1.default.info("[events.emit] event:" + event);
      var list = eventsMap[event];
      list ? list.forEach(function(e) {
        return e.listener.call(e.target, event, args);
      }) : cc.warn("event: " + event + " \u4e8b\u4ef6\u4e0d\u5b58\u5728");
    }
    exports.default = {
      on: on,
      off: off,
      emit: emit
    };
    exports.EVENT = {
      UI_ERROR_ALERT: "ui_error_alert",
      UI_STATUS_UPDATE_DATA: "ui_status_update_data",
      UI_PLAY_BUTTON_CLOSE_AUDIO: "ui_play_button_close_audio",
      ADD_BUBBLE: "eventAddBubble",
      BUB_CHANGE: "eventBubChange",
      USE_PURGE: "eventPurge",
      CONTENTLOADOVER: "contentLoadOver",
      CONTENTARRLOADRUN: "contentArrLoadRun",
      SHOW_EXPLAIN_INFO_IN_ROLE: "showExplainInfoInRole",
      HIDE_EXPLAIN_INFO_IN_ROLE: "hideExplainInfoInRole",
      SHOW_EXPLAIN_INFO_IN_ZHANDOU: "showExplainInfoInZhanDou",
      HIDE_EXPLAIN_INFO_IN_ZHANDOU: "hideExplainInfoInZhanDou",
      REFRESH_GOLD: "refreshGold",
      REFRESH_HP: "refreshHp",
      REFRESH_TALENT_POINT: "refreshTalentPoint",
      UPDATE_LOCALIZATION: "updateLocalization",
      START_TIME: "startTime",
      RESET_TIME: "resetTime",
      END_TIME: "endTime",
      REFRESH_DRUGS: "refreshDrugs"
    };
    cc._RF.pop();
  }, {
    "./Logger": "Logger"
  } ],
  Fruit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bfe3b7iuBRMKoLoic4uB1K9", "Fruit");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.FRUIT_STATE = void 0;
    var AtlasPool_1 = require("../lib/AtlasPool");
    var Logger_1 = require("../lib/Logger");
    var LlkMap_1 = require("./LlkMap");
    var DGame_1 = require("./DGame");
    var DGameDefine_1 = require("./DGameDefine");
    var AudioNode_1 = require("../ui/AudioNode");
    var Util_1 = require("../lib/Util");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FRUIT_STATE;
    (function(FRUIT_STATE) {
      FRUIT_STATE[FRUIT_STATE["NORMAL"] = 1] = "NORMAL";
      FRUIT_STATE[FRUIT_STATE["DESTORY"] = 2] = "DESTORY";
    })(FRUIT_STATE = exports.FRUIT_STATE || (exports.FRUIT_STATE = {}));
    var Fruit = function(_super) {
      __extends(Fruit, _super);
      function Fruit() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.iconSpr = null;
        _this.bgSpr = null;
        _this.arrPosLab = null;
        _this.xiaochu = null;
        _this._createIndex = 0;
        _this._fruitType = 0;
        _this._arrPos = null;
        _this._state = FRUIT_STATE.NORMAL;
        return _this;
      }
      Fruit.prototype.onInit = function(fruitType, index) {
        return __awaiter(this, void 0, void 0, function() {
          var frameName, frame;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this._fruitType = fruitType;
              frameName = "" + fruitType;
              this._createIndex = index;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, frameName) ];

             case 1:
              frame = _a.sent();
              frame ? this.iconSpr.spriteFrame = frame : Logger_1.default.info("[Fruit onInit] " + AtlasPool_1.ALTAS.GAME + "\u56fe\u96c6\u4e2d\u6ca1\u6709\u540d\u4e3a" + frameName + "\u7684\u56fe\u7247");
              return [ 4, this.showIconBg() ];

             case 2:
              _a.sent();
              this._state = FRUIT_STATE.NORMAL;
              return [ 2 ];
            }
          });
        });
      };
      Fruit.prototype.onClickIcon = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!(this._state === FRUIT_STATE.NORMAL)) return [ 3, 4 ];
              if (!(DGame_1.default.instance.getGameState() === DGameDefine_1.GAMESTATE.NORMAL)) return [ 3, 1 ];
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click1);
              if (LlkMap_1.default.instance.getFirstFruit()) {
                if (LlkMap_1.default.instance.getFirstFruit() !== this) {
                  LlkMap_1.default.instance.setSecondFruit(this);
                  LlkMap_1.default.instance.matchType();
                }
              } else LlkMap_1.default.instance.setFirstFruit(this);
              return [ 3, 4 ];

             case 1:
              if (!(DGame_1.default.instance.getGameState() === DGameDefine_1.GAMESTATE.BOMB)) return [ 3, 4 ];
              DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.MATCHING);
              return [ 4, Util_1.default.promisify(LlkMap_1.default.instance.clearFruitByType, LlkMap_1.default.instance, this._fruitType) ];

             case 2:
              _a.sent();
              return [ 4, DGame_1.default.instance.reduceBomb() ];

             case 3:
              _a.sent();
              _a.label = 4;

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      Fruit.prototype.setArrPos = function(point) {
        this._arrPos = point;
        this.arrPosLab.string = "(" + point.x + "," + point.y + ")";
      };
      Fruit.prototype.getArrPos = function() {
        return this._arrPos;
      };
      Fruit.prototype.getFruitType = function() {
        return this._fruitType;
      };
      Fruit.prototype.setChooseSpr = function(state) {
        return __awaiter(this, void 0, void 0, function() {
          var _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              if (!state) return [ 3, 2 ];
              _a = this.bgSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "xuanzhong") ];

             case 1:
              _a.spriteFrame = _b.sent();
              return [ 3, 3 ];

             case 2:
              this.showIconBg();
              _b.label = 3;

             case 3:
              return [ 2 ];
            }
          });
        });
      };
      Fruit.prototype.showIconBg = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _a, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              if (!(this._createIndex % 2 === 1)) return [ 3, 2 ];
              _a = this.bgSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "di1") ];

             case 1:
              _a.spriteFrame = _c.sent();
              return [ 3, 4 ];

             case 2:
              _b = this.bgSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAME, "di2") ];

             case 3:
              _b.spriteFrame = _c.sent();
              _c.label = 4;

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      Fruit.prototype.playAn = function() {
        this._state = FRUIT_STATE.DESTORY;
        this.bgSpr.spriteFrame = null;
        this.iconSpr.spriteFrame = null;
        var animation = this.xiaochu.play("xiaochu");
        return animation.duration;
      };
      Fruit.prototype.getState = function() {
        return this._state;
      };
      Fruit.prototype.unuse = function() {
        this.node.scale = 1;
      };
      Fruit.prototype.reuse = function() {};
      __decorate([ property(cc.Sprite) ], Fruit.prototype, "iconSpr", void 0);
      __decorate([ property(cc.Sprite) ], Fruit.prototype, "bgSpr", void 0);
      __decorate([ property(cc.Label) ], Fruit.prototype, "arrPosLab", void 0);
      __decorate([ property(cc.Animation) ], Fruit.prototype, "xiaochu", void 0);
      Fruit = __decorate([ ccclass ], Fruit);
      return Fruit;
    }(cc.Component);
    exports.default = Fruit;
    cc._RF.pop();
  }, {
    "../lib/AtlasPool": "AtlasPool",
    "../lib/AudioPool": "AudioPool",
    "../lib/Logger": "Logger",
    "../lib/Util": "Util",
    "../ui/AudioNode": "AudioNode",
    "./DGame": "DGame",
    "./DGameDefine": "DGameDefine",
    "./LlkMap": "LlkMap"
  } ],
  GameLevelItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "23c680x2h9JhZyU42N641Ta", "GameLevelItem");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LoadNode_1 = require("./LoadNode");
    var User_1 = require("../lib/User");
    var AtlasPool_1 = require("../lib/AtlasPool");
    var AudioNode_1 = require("./AudioNode");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameLevelItem = function(_super) {
      __extends(GameLevelItem, _super);
      function GameLevelItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.iconSpr = null;
        _this.levelLab = null;
        _this.starSpr = null;
        _this.levelBtn = null;
        _this.guankaBf = null;
        _this.guanka1Bf = null;
        return _this;
      }
      GameLevelItem.prototype.onInit = function(args) {
        return __awaiter(this, void 0, void 0, function() {
          var gameModeInfo, gameLevelInfo, _a, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              this._gameLevelData = args[0].data;
              this.levelLab.string = "" + this._gameLevelData.PassId;
              gameModeInfo = User_1.default.instance.getGameModeInfo(this._gameLevelData.PassType);
              gameLevelInfo = gameModeInfo[this._gameLevelData.PassId - 1];
              if (!gameLevelInfo) return [ 3, 3 ];
              this.levelLab.font = this.guanka1Bf;
              if (!(gameLevelInfo.star > 0)) return [ 3, 2 ];
              _a = this.starSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAMELEVEL, "star" + gameLevelInfo.star) ];

             case 1:
              _a.spriteFrame = _c.sent();
              _c.label = 2;

             case 2:
              return [ 3, 6 ];

             case 3:
              if (!(this._gameLevelData.PassId === gameModeInfo.length + 1)) return [ 3, 4 ];
              this.levelLab.font = this.guanka1Bf;
              return [ 3, 6 ];

             case 4:
              _b = this.iconSpr;
              return [ 4, AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.GAMELEVEL, "level_disabled") ];

             case 5:
              _b.spriteFrame = _c.sent();
              this.levelBtn.interactable = false;
              _c.label = 6;

             case 6:
              return [ 2 ];
            }
          });
        });
      };
      GameLevelItem.prototype.onClickGameLevel = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.click);
              return [ 4, LoadNode_1.default.instance.loadContent("DGame", [ {
                data: this._gameLevelData
              } ]) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      __decorate([ property(cc.Sprite) ], GameLevelItem.prototype, "iconSpr", void 0);
      __decorate([ property(cc.Label) ], GameLevelItem.prototype, "levelLab", void 0);
      __decorate([ property(cc.Sprite) ], GameLevelItem.prototype, "starSpr", void 0);
      __decorate([ property(cc.Button) ], GameLevelItem.prototype, "levelBtn", void 0);
      __decorate([ property(cc.BitmapFont) ], GameLevelItem.prototype, "guankaBf", void 0);
      __decorate([ property(cc.BitmapFont) ], GameLevelItem.prototype, "guanka1Bf", void 0);
      GameLevelItem = __decorate([ ccclass ], GameLevelItem);
      return GameLevelItem;
    }(cc.Component);
    exports.default = GameLevelItem;
    cc._RF.pop();
  }, {
    "../lib/AtlasPool": "AtlasPool",
    "../lib/AudioPool": "AudioPool",
    "../lib/User": "User",
    "./AudioNode": "AudioNode",
    "./LoadNode": "LoadNode"
  } ],
  GameParm: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6263adWH8pIYqxiPGUsB6nr", "GameParm");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GAMEWIN_EVALUATE = exports.GAMEWIN_ADV = exports.GAME_HEIGHT = exports.GAME_WIDTH = void 0;
    var NativeCtrl_1 = require("./NativeCtrl");
    var GameParm = function() {
      function GameParm() {
        this._lan = "";
      }
      Object.defineProperty(GameParm, "instance", {
        get: function() {
          null === GameParm._instance && (this._instance = new GameParm());
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      GameParm.prototype.onInit = function() {
        if (cc.sys.isNative) {
          var lan = NativeCtrl_1.default.getSystemLanguage();
          this._lan = lan ? "zh-cn" === lan ? "zh" : "zh-tw" === lan || "zh-hk" === lan ? "ft" : "en" : "en";
        } else this._lan = "en";
      };
      GameParm.prototype.getConetentViewScale = function() {
        var viewHeight = cc.winSize.height;
        return viewHeight / exports.GAME_HEIGHT;
      };
      GameParm.prototype.getLan = function() {
        return this._lan;
      };
      GameParm._instance = null;
      return GameParm;
    }();
    exports.default = GameParm;
    exports.GAME_WIDTH = 1080;
    exports.GAME_HEIGHT = 1920;
    exports.GAMEWIN_ADV = 3;
    exports.GAMEWIN_EVALUATE = 3;
    cc._RF.pop();
  }, {
    "./NativeCtrl": "NativeCtrl"
  } ],
  Line: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "12d7dB0Bp5FQ4xuVu0S9P/5", "Line");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Line = function(_super) {
      __extends(Line, _super);
      function Line() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.lineSpr = null;
        return _this;
      }
      Line.prototype.onInit = function(args) {
        this.lineSpr.node.width = 0 === Math.abs(args[0].width) ? 20 : Math.abs(args[0].width);
        this.lineSpr.node.height = 0 === Math.abs(args[0].height) ? 20 : Math.abs(args[0].height);
      };
      __decorate([ property(cc.Sprite) ], Line.prototype, "lineSpr", void 0);
      Line = __decorate([ ccclass ], Line);
      return Line;
    }(cc.Component);
    exports.default = Line;
    cc._RF.pop();
  }, {} ],
  LlkMapDefine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f26dZ/MahEELjmrmDOZRGv", "LlkMapDefine");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BLOCK_TYPE = exports.FADIN_TIME = exports.GAME_MODULUS = exports.MAP_SCALE = exports.BLOCK_HEIGHT = exports.BLOCK_WIDTH = void 0;
    var LlkMap_1 = require("./LlkMap");
    function isLinkPoint(p1, p2, map) {
      if (p1.x === p2.x) {
        var y1 = Math.min(p1.y, p2.y);
        var y2 = Math.max(p1.y, p2.y);
        for (var y = y1 + 1; y < y2; y++) if (map[p1.x][y].blockType !== BLOCK_TYPE.EMPTY && map[p1.x][y].blockType !== BLOCK_TYPE.WALL) return false;
        return true;
      }
      if (p1.y === p2.y) {
        var x1 = Math.min(p1.x, p2.x);
        var x2 = Math.max(p1.x, p2.x);
        for (var x = x1 + 1; x < x2; x++) if (map[x][p1.y].blockType !== BLOCK_TYPE.EMPTY && map[x][p1.y].blockType !== BLOCK_TYPE.WALL) return false;
        return true;
      }
      return false;
    }
    function expandX(p, pointArr, map, xCount) {
      pointArr = [];
      for (var x = p.x + 1; x < xCount; x++) {
        if (map[x][p.y].blockType !== BLOCK_TYPE.EMPTY && map[x][p.y].blockType !== BLOCK_TYPE.WALL) break;
        pointArr.push(cc.v2(x, p.y));
      }
      for (var x = p.x - 1; x >= 0; x--) {
        if (map[x][p.y].blockType !== BLOCK_TYPE.EMPTY && map[x][p.y].blockType !== BLOCK_TYPE.WALL) break;
        pointArr.push(cc.v2(x, p.y));
      }
      return pointArr;
    }
    function expandY(p, pointArr, map, yCount) {
      pointArr = [];
      for (var y = p.y + 1; y < yCount; y++) {
        if (map[p.x][y].blockType !== BLOCK_TYPE.EMPTY && map[p.x][y].blockType !== BLOCK_TYPE.WALL) break;
        pointArr.push(cc.v2(p.x, y));
      }
      for (var y = p.y - 1; y >= 0; y--) {
        if (map[p.x][y].blockType !== BLOCK_TYPE.EMPTY && map[p.x][y].blockType !== BLOCK_TYPE.WALL) break;
        pointArr.push(cc.v2(p.x, y));
      }
      return pointArr;
    }
    var FIRST_ARR_POS = cc.v2(0, 0);
    var FIRST_MAP_POS = cc.v2(51, -61);
    exports.BLOCK_WIDTH = 140;
    exports.BLOCK_HEIGHT = 140;
    exports.MAP_SCALE = .85;
    exports.GAME_MODULUS = 1.7;
    exports.FADIN_TIME = .3;
    function arrPosToMapPos(arrPos) {
      var tempX = (FIRST_ARR_POS.x - arrPos.x) * exports.BLOCK_WIDTH;
      var tempY = (FIRST_ARR_POS.y - arrPos.y) * exports.BLOCK_HEIGHT;
      return cc.v2(FIRST_MAP_POS.x - tempX, FIRST_MAP_POS.y + tempY);
    }
    function getZIndex(arrPos) {
      return arrPos.x * LlkMap_1.default.instance.getYcount() + 1 + arrPos.y;
    }
    var BLOCK_TYPE;
    (function(BLOCK_TYPE) {
      BLOCK_TYPE[BLOCK_TYPE["WALL"] = 0] = "WALL";
      BLOCK_TYPE[BLOCK_TYPE["EMPTY"] = 1] = "EMPTY";
      BLOCK_TYPE[BLOCK_TYPE["NODE"] = 2] = "NODE";
    })(BLOCK_TYPE = exports.BLOCK_TYPE || (exports.BLOCK_TYPE = {}));
    exports.default = {
      isLinkPoint: isLinkPoint,
      expandX: expandX,
      expandY: expandY,
      arrPosToMapPos: arrPosToMapPos,
      getZIndex: getZIndex
    };
    cc._RF.pop();
  }, {
    "./LlkMap": "LlkMap"
  } ],
  LlkMapEditor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98363acq+tHb4O+sXA5E+Rq", "LlkMapEditor");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LlkMapDefine_1 = require("./LlkMapDefine");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var LlkMapEditor = function(_super) {
      __extends(LlkMapEditor, _super);
      function LlkMapEditor() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.movePos = null;
        _this.scaleNum = 0;
        _this._xCount = 1;
        _this._yCount = 1;
        _this.blockSf = null;
        _this._blockLay = null;
        _this._listener = null;
        return _this;
      }
      Object.defineProperty(LlkMapEditor.prototype, "xCount", {
        get: function() {
          return this._xCount;
        },
        set: function(num) {
          this._xCount = Math.round(num);
          this._xCount < 3 && (this._xCount = 3);
          this.refreshBlockLay();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(LlkMapEditor.prototype, "yCount", {
        get: function() {
          return this._yCount;
        },
        set: function(num) {
          this._yCount = Math.round(num);
          this._yCount < 3 && (this._yCount = 3);
          this.refreshBlockLay();
        },
        enumerable: false,
        configurable: true
      });
      LlkMapEditor.prototype.onLoad = function() {
        var ipcRenderer;
        false;
      };
      LlkMapEditor.prototype.changeNodeState = function() {
        Editor.log("hello i18n got message");
        var nodeid = Editor.Selection.curSelection("node");
        for (var _i = 0, _a = this.node.children; _i < _a.length; _i++) {
          var child = _a[_i];
          child.uuid === nodeid[0] && (255 === child.opacity ? child.opacity = 50 : child.opacity = 255);
        }
      };
      LlkMapEditor.prototype.onDestroy = function() {
        var ipcRenderer;
        false;
      };
      LlkMapEditor.prototype.refreshBlockLay = function() {
        return __awaiter(this, void 0, void 0, function() {
          var i, j, node, blockSpr;
          return __generator(this, function(_a) {
            false;
            return [ 2 ];
          });
        });
      };
      LlkMapEditor.prototype.getMovePos = function() {
        return this.movePos;
      };
      LlkMapEditor.prototype.getScaleNum = function() {
        return this.scaleNum;
      };
      __decorate([ property(cc.Vec2) ], LlkMapEditor.prototype, "movePos", void 0);
      __decorate([ property ], LlkMapEditor.prototype, "scaleNum", void 0);
      __decorate([ property ], LlkMapEditor.prototype, "_xCount", void 0);
      __decorate([ property ], LlkMapEditor.prototype, "xCount", null);
      __decorate([ property ], LlkMapEditor.prototype, "_yCount", void 0);
      __decorate([ property ], LlkMapEditor.prototype, "yCount", null);
      __decorate([ property(cc.SpriteFrame) ], LlkMapEditor.prototype, "blockSf", void 0);
      LlkMapEditor = __decorate([ ccclass, executeInEditMode ], LlkMapEditor);
      return LlkMapEditor;
    }(cc.Component);
    exports.default = LlkMapEditor;
    cc._RF.pop();
  }, {
    "./LlkMapDefine": "LlkMapDefine"
  } ],
  LlkMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea8097BoBFDp6PLXxd9Ooen", "LlkMap");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LlkMapEditor_1 = require("./LlkMapEditor");
    var Util_1 = require("../lib/Util");
    var Fruit_1 = require("./Fruit");
    var NodePool_1 = require("../lib/NodePool");
    var DGame_1 = require("./DGame");
    var DGameDefine_1 = require("./DGameDefine");
    var Line_1 = require("./Line");
    var Star_1 = require("./Star");
    var LlkMapDefine_1 = require("./LlkMapDefine");
    var AudioNode_1 = require("../ui/AudioNode");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LlkMap = function(_super) {
      __extends(LlkMap, _super);
      function LlkMap() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.blockLay = null;
        _this._xCount = 0;
        _this._yCount = 0;
        _this._map = [];
        _this._firstFruit = null;
        _this._secondFruit = null;
        _this._pointPath = [];
        _this._lineStarArr = [];
        _this._fruitType = 0;
        _this._movePos = null;
        return _this;
      }
      LlkMap_1 = LlkMap;
      Object.defineProperty(LlkMap, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      LlkMap.prototype.onInit = function() {
        return __awaiter(this, void 0, void 0, function() {
          var width, height, scaleNum;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              LlkMap_1._instance = this;
              this._xCount = this.blockLay.node.getComponent(LlkMapEditor_1.default).xCount;
              this._yCount = this.blockLay.node.getComponent(LlkMapEditor_1.default).yCount;
              this._movePos = this.blockLay.node.getComponent(LlkMapEditor_1.default).getMovePos();
              width = this._xCount * LlkMapDefine_1.BLOCK_WIDTH;
              height = this._yCount * LlkMapDefine_1.BLOCK_HEIGHT;
              scaleNum = this.blockLay.node.getComponent(LlkMapEditor_1.default).getScaleNum() ? this.blockLay.node.getComponent(LlkMapEditor_1.default).getScaleNum() : 1;
              this.blockLay.node.setContentSize(width, height);
              this.blockLay.node.scale = LlkMapDefine_1.MAP_SCALE * scaleNum;
              this.blockLay.node.setPosition(-width / 2 * LlkMapDefine_1.MAP_SCALE * scaleNum, height / 2 * LlkMapDefine_1.MAP_SCALE * scaleNum);
              this.blockLay.node.x += 5;
              return [ 4, this.readMap() ];

             case 1:
              _a.sent();
              return [ 4, this.addfruit() ];

             case 2:
              _a.sent();
              this.isGameOver() && this.changeMap();
              DGame_1.default.instance.setCountDown(this.blockLay.node.childrenCount);
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.readMap = function() {
        return __awaiter(this, void 0, void 0, function() {
          var chidlren, childrenCount, i, arr, j, arrPos, obj, x, y, nodeArr, i, child, obj, node, _i, nodeArr_1, child;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.blockLay.enabled = false;
              chidlren = this.blockLay.node.children;
              childrenCount = this.blockLay.node.childrenCount;
              for (i = 0; i < this._xCount; i++) {
                arr = [];
                for (j = 0; j < this._yCount; j++) {
                  arrPos = cc.v2(i, j);
                  obj = {
                    fruitType: 0,
                    arrPos: arrPos,
                    node: null,
                    zIndex: LlkMapDefine_1.default.getZIndex(arrPos),
                    nodePos: LlkMapDefine_1.default.arrPosToMapPos(arrPos),
                    blockType: LlkMapDefine_1.BLOCK_TYPE.WALL
                  };
                  arr.push(obj);
                }
                this._map.push(arr);
              }
              x = 0;
              y = 0;
              nodeArr = [];
              i = 0;
              _a.label = 1;

             case 1:
              if (!(i < childrenCount)) return [ 3, 5 ];
              child = chidlren[i];
              if (!(255 === child.opacity)) return [ 3, 3 ];
              obj = this._map[x][y];
              return [ 4, NodePool_1.default.getNode(Fruit_1.default) ];

             case 2:
              node = _a.sent();
              node.setPosition(child.getPosition());
              nodeArr.push(node);
              obj.node = node;
              node.getComponent(Fruit_1.default).setArrPos(obj.arrPos);
              obj.blockType = LlkMapDefine_1.BLOCK_TYPE.NODE;
              node.setPosition(obj.nodePos);
              node.zIndex = obj.zIndex;
              _a.label = 3;

             case 3:
              y++;
              if (y === this._yCount) {
                y = 0;
                x++;
              }
              if (x === this._xCount) return [ 3, 5 ];
              _a.label = 4;

             case 4:
              i++;
              return [ 3, 1 ];

             case 5:
              this.blockLay.node.removeAllChildren();
              for (_i = 0, nodeArr_1 = nodeArr; _i < nodeArr_1.length; _i++) {
                child = nodeArr_1[_i];
                this.blockLay.node.addChild(child);
              }
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.addfruit = function() {
        return __awaiter(this, void 0, void 0, function() {
          var chidlrenCount, min, max, fruitTypeArr, i, diffVal, i, randType, i, len, currentRandom, current, fruitIndex, i, j, obj, fruitType;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              chidlrenCount = this.blockLay.node.childrenCount;
              min = Math.max(Math.floor(chidlrenCount / 2 / LlkMapDefine_1.GAME_MODULUS), 13);
              chidlrenCount < 28 && (min = Math.floor(chidlrenCount / 2 - 1));
              max = min + 1;
              this._fruitType = Util_1.default.randomInt(max, min);
              fruitTypeArr = [];
              for (i = 1; i <= this._fruitType; i++) {
                fruitTypeArr.push(i);
                fruitTypeArr.push(i);
              }
              diffVal = chidlrenCount / 2 - this._fruitType;
              for (i = 0; i < diffVal; i++) {
                randType = Util_1.default.randomInt(this._fruitType, 1);
                fruitTypeArr.push(randType);
                fruitTypeArr.push(randType);
              }
              for (i = 0, len = fruitTypeArr.length; i < len; i++) {
                currentRandom = Math.round(Math.random() * (len - 1));
                current = fruitTypeArr[i];
                fruitTypeArr[i] = fruitTypeArr[currentRandom];
                fruitTypeArr[currentRandom] = current;
              }
              fruitIndex = 0;
              i = 0;
              _a.label = 1;

             case 1:
              if (!(i < this._xCount)) return [ 3, 6 ];
              j = 0;
              _a.label = 2;

             case 2:
              if (!(j < this._yCount)) return [ 3, 5 ];
              obj = this._map[i][j];
              if (!(obj.blockType === LlkMapDefine_1.BLOCK_TYPE.NODE)) return [ 3, 4 ];
              fruitType = fruitTypeArr[fruitIndex];
              return [ 4, obj.node.getComponent(Fruit_1.default).onInit(fruitType, obj.zIndex) ];

             case 3:
              _a.sent();
              obj.fruitType = fruitType;
              obj.node.opacity = 0;
              fruitIndex++;
              _a.label = 4;

             case 4:
              j++;
              return [ 3, 2 ];

             case 5:
              i++;
              return [ 3, 1 ];

             case 6:
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.matchType = function() {
        return __awaiter(this, void 0, void 0, function() {
          var arrPos1, arrPos2, mapChild1, mapChild2;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this._pointPath = [];
              DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.MATCHING);
              arrPos1 = this._firstFruit.getArrPos();
              arrPos2 = this._secondFruit.getArrPos();
              mapChild1 = this._map[arrPos1.x][arrPos1.y];
              mapChild2 = this._map[arrPos2.x][arrPos2.y];
              if (!(mapChild1.fruitType === mapChild2.fruitType)) return [ 3, 4 ];
              if (!this.isLinkSuccess(arrPos1, arrPos2)) return [ 3, 2 ];
              return [ 4, this.lineAndEliminate(arrPos1, arrPos2) ];

             case 1:
              _a.sent();
              return [ 3, 3 ];

             case 2:
              this.clearSelect();
              _a.label = 3;

             case 3:
              return [ 3, 5 ];

             case 4:
              this.clearSelect();
              _a.label = 5;

             case 5:
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.moveFruit = function() {
        var isMove = false;
        for (var x = 0; x < this._xCount; x++) for (var y = 0; y < this._yCount; y++) {
          var childMap = this._map[x][y];
          if (childMap.blockType === LlkMapDefine_1.BLOCK_TYPE.NODE) {
            var arrP = childMap.arrPos;
            var childTemp = void 0;
            if (this._movePos.x > arrP.x && this._movePos.x > 0) {
              childTemp = this._map[arrP.x + 1][arrP.y];
              if (childTemp.blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY && childMap.blockType === LlkMapDefine_1.BLOCK_TYPE.NODE) {
                this.mapAddNode(childTemp, childMap.node, true);
                this.mapClearNode(childMap);
                isMove = true;
              }
            }
            if (this._movePos.x < arrP.x && this._movePos.x > 0) {
              childTemp = this._map[arrP.x - 1][arrP.y];
              if (childTemp.blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY && childMap.blockType === LlkMapDefine_1.BLOCK_TYPE.NODE) {
                this.mapAddNode(childTemp, childMap.node, true);
                this.mapClearNode(childMap);
                isMove = true;
              }
            }
            if (this._movePos.y > arrP.y && this._movePos.y > 0) {
              childTemp = this._map[arrP.x][arrP.y + 1];
              if (childTemp.blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY && childMap.blockType === LlkMapDefine_1.BLOCK_TYPE.NODE) {
                this.mapAddNode(childTemp, childMap.node, true);
                this.mapClearNode(childMap);
                isMove = true;
              }
            }
            if (this._movePos.y < arrP.y && this._movePos.y > 0) {
              childTemp = this._map[arrP.x][arrP.y - 1];
              if (childTemp.blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY && childMap.blockType === LlkMapDefine_1.BLOCK_TYPE.NODE) {
                this.mapAddNode(childTemp, childMap.node, true);
                this.mapClearNode(childMap);
                isMove = true;
              }
            }
          }
        }
        isMove && this.moveFruit();
      };
      LlkMap.prototype.isLinkSuccess = function(p1, p2) {
        this._pointPath = [];
        if (LlkMapDefine_1.default.isLinkPoint(p1, p2, this._map)) {
          this._pointPath.push(p1);
          this._pointPath.push(p2);
          return true;
        }
        var p = cc.v2(p1.x, p2.y);
        if ((this._map[p.x][p.y].blockType === LlkMapDefine_1.BLOCK_TYPE.WALL || this._map[p.x][p.y].blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY) && LlkMapDefine_1.default.isLinkPoint(p1, p, this._map) && LlkMapDefine_1.default.isLinkPoint(p, p2, this._map)) {
          this._pointPath.push(p1);
          this._pointPath.push(p);
          this._pointPath.push(p2);
          return true;
        }
        p = cc.v2(p2.x, p1.y);
        if ((this._map[p.x][p.y].blockType === LlkMapDefine_1.BLOCK_TYPE.WALL || this._map[p.x][p.y].blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY) && LlkMapDefine_1.default.isLinkPoint(p1, p, this._map) && LlkMapDefine_1.default.isLinkPoint(p, p2, this._map)) {
          this._pointPath.push(p1);
          this._pointPath.push(p);
          this._pointPath.push(p2);
          return true;
        }
        var p1PointArr = [];
        var p2PointArr = [];
        p1PointArr = LlkMapDefine_1.default.expandX(p1, p1PointArr, this._map, this._xCount);
        p2PointArr = LlkMapDefine_1.default.expandX(p2, p2PointArr, this._map, this._xCount);
        for (var _i = 0, p1PointArr_1 = p1PointArr; _i < p1PointArr_1.length; _i++) {
          var pt1 = p1PointArr_1[_i];
          for (var _a = 0, p2PointArr_1 = p2PointArr; _a < p2PointArr_1.length; _a++) {
            var pt2 = p2PointArr_1[_a];
            if (pt1.x === pt2.x && LlkMapDefine_1.default.isLinkPoint(pt1, pt2, this._map)) {
              this._pointPath.push(p1);
              this._pointPath.push(pt1);
              this._pointPath.push(pt2);
              this._pointPath.push(p2);
              return true;
            }
          }
        }
        p1PointArr = LlkMapDefine_1.default.expandY(p1, p1PointArr, this._map, this._yCount);
        p2PointArr = LlkMapDefine_1.default.expandY(p2, p2PointArr, this._map, this._yCount);
        for (var _b = 0, p1PointArr_2 = p1PointArr; _b < p1PointArr_2.length; _b++) {
          var pt1 = p1PointArr_2[_b];
          for (var _c = 0, p2PointArr_2 = p2PointArr; _c < p2PointArr_2.length; _c++) {
            var pt2 = p2PointArr_2[_c];
            if (pt1.y === pt2.y && LlkMapDefine_1.default.isLinkPoint(pt1, pt2, this._map)) {
              this._pointPath.push(p1);
              this._pointPath.push(pt1);
              this._pointPath.push(pt2);
              this._pointPath.push(p2);
              return true;
            }
          }
        }
        return false;
      };
      LlkMap.prototype.drawLine = function() {
        return __awaiter(this, void 0, void 0, function() {
          var mapPointArr, i, arrPoint, childMap, p, i, lineNode, p1, p2, starNode;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              mapPointArr = [];
              for (i = 0; i < this._pointPath.length; i++) {
                arrPoint = this._pointPath[i];
                childMap = this._map[arrPoint.x][arrPoint.y];
                if (childMap.blockType !== LlkMapDefine_1.BLOCK_TYPE.EMPTY && childMap.blockType !== LlkMapDefine_1.BLOCK_TYPE.WALL) mapPointArr.push(childMap.nodePos); else {
                  p = LlkMapDefine_1.default.arrPosToMapPos(arrPoint);
                  mapPointArr.push(p);
                }
              }
              this._pointPath = [];
              i = 0;
              _a.label = 1;

             case 1:
              if (!(i < mapPointArr.length - 1)) return [ 3, 5 ];
              return [ 4, NodePool_1.default.getNode(Line_1.default) ];

             case 2:
              lineNode = _a.sent();
              this.blockLay.node.addChild(lineNode);
              p1 = mapPointArr[i];
              p2 = mapPointArr[i + 1];
              lineNode.getComponent(Line_1.default).onInit([ {
                width: p2.x - p1.x,
                height: p2.y - p1.y
              } ]);
              lineNode.setPosition((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
              this._lineStarArr.push(lineNode);
              if (!(0 !== i && i !== mapPointArr.length)) return [ 3, 4 ];
              return [ 4, NodePool_1.default.getNode(Star_1.default) ];

             case 3:
              starNode = _a.sent();
              this.blockLay.node.addChild(starNode);
              starNode.setPosition(mapPointArr[i]);
              this._lineStarArr.push(starNode);
              _a.label = 4;

             case 4:
              i++;
              return [ 3, 1 ];

             case 5:
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.isDrop = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!this._movePos) return [ 3, 2 ];
              this.moveFruit();
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, .05, this) ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.lineAndEliminate = function(arrPos1, arrPos2) {
        return __awaiter(this, void 0, void 0, function() {
          var comboPos, worldPos, result, isExistFruit, i, j, map;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.drawLine() ];

             case 1:
              _a.sent();
              comboPos = this._secondFruit.node.getPosition();
              worldPos = this.blockLay.node.convertToWorldSpaceAR(comboPos);
              return [ 4, DGame_1.default.instance.calScore(worldPos) ];

             case 2:
              _a.sent();
              this.destroyFruit(arrPos1, arrPos2);
              return [ 4, DGame_1.default.instance.addFruit() ];

             case 3:
              _a.sent();
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, .03, this) ];

             case 4:
              _a.sent();
              return [ 4, this.isDrop() ];

             case 5:
              _a.sent();
              result = this.isGameOver();
              if (result) {
                isExistFruit = false;
                for (i = 0; i < this._xCount; i++) for (j = 0; j < this._yCount; j++) {
                  map = this._map[i][j];
                  if (map.node) {
                    isExistFruit = true;
                    break;
                  }
                }
                if (isExistFruit) {
                  this.changeMap();
                  DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
                } else DGame_1.default.instance.gameWin();
              } else DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.destroyFruit = function(arrPos1, arrPos2) {
        return __awaiter(this, void 0, void 0, function() {
          var fruitMap1, fruitMap2, fruitNode1, fruitNode2, delay, i, len;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.xiao);
              this._firstFruit = null;
              this._secondFruit = null;
              fruitMap1 = this._map[arrPos1.x][arrPos1.y];
              fruitMap2 = this._map[arrPos2.x][arrPos2.y];
              fruitNode1 = fruitMap1.node;
              fruitNode2 = fruitMap2.node;
              this.mapClearNode(fruitMap1);
              this.mapClearNode(fruitMap2);
              delay = fruitNode1.getComponent(Fruit_1.default).playAn();
              fruitNode2.getComponent(Fruit_1.default).playAn();
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, delay / 3, this) ];

             case 1:
              _a.sent();
              NodePool_1.default.putNode(Fruit_1.default, fruitNode1);
              NodePool_1.default.putNode(Fruit_1.default, fruitNode2);
              for (i = 0, len = this._lineStarArr.length; i < len; i++) {
                this._lineStarArr[0].destroy();
                this._lineStarArr.shift();
              }
              this._lineStarArr = [];
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.isGameOver = function() {
        var haveFruitMapArr = [];
        for (var i = 0; i < this._xCount; i++) for (var j = 0; j < this._yCount; j++) {
          var mapItem = this._map[i][j];
          mapItem.node && haveFruitMapArr.push(mapItem);
        }
        for (var _i = 0, haveFruitMapArr_1 = haveFruitMapArr; _i < haveFruitMapArr_1.length; _i++) {
          var mapItem = haveFruitMapArr_1[_i];
          for (var _a = 0, haveFruitMapArr_2 = haveFruitMapArr; _a < haveFruitMapArr_2.length; _a++) {
            var temp = haveFruitMapArr_2[_a];
            if (mapItem.fruitType === temp.fruitType && (mapItem.arrPos.x !== temp.arrPos.x || mapItem.arrPos.y !== temp.arrPos.y) && this.isLinkSuccess(mapItem.arrPos, temp.arrPos)) return false;
          }
        }
        return true;
      };
      LlkMap.prototype.changeMap = function() {
        var tempX;
        var tempY;
        for (var x = 1; x < this._xCount - 1; x++) for (var y = 1; y < this._yCount - 1; y++) {
          tempX = Math.round(1 + Math.random() * (this._xCount - 2));
          tempY = Math.round(1 + Math.random() * (this._yCount - 2));
          var childMap = this._map[x][y];
          var childTemp = this._map[tempX][tempY];
          if (childMap.blockType !== LlkMapDefine_1.BLOCK_TYPE.WALL && childMap.blockType !== LlkMapDefine_1.BLOCK_TYPE.EMPTY && childTemp.blockType !== LlkMapDefine_1.BLOCK_TYPE.WALL && childTemp.blockType !== LlkMapDefine_1.BLOCK_TYPE.EMPTY) {
            var tempNode = childTemp.node;
            this.mapAddNode(childTemp, childMap.node);
            this.mapAddNode(childMap, tempNode);
          }
        }
        var res = this.isGameOver();
        res && this.changeMap();
      };
      LlkMap.prototype.clearFruitByType = function(callback, fruitType) {
        return __awaiter(this, void 0, void 0, function() {
          var destroyArr, x, y, childMap, delay, _i, destroyArr_1, child, _a, destroyArr_2, child, result, err_1;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              _b.trys.push([ 0, 5, , 6 ]);
              destroyArr = [];
              for (x = 1; x < this._xCount - 1; x++) for (y = 1; y < this._yCount - 1; y++) {
                childMap = this._map[x][y];
                if (childMap.blockType !== LlkMapDefine_1.BLOCK_TYPE.WALL && childMap.blockType !== LlkMapDefine_1.BLOCK_TYPE.EMPTY && childMap.fruitType === fruitType) {
                  childMap.node.zIndex = 1e3;
                  childMap.node.scale = DGame_1.default.instance.getFruitScaleNum();
                  childMap.node.getComponent(Fruit_1.default).setChooseSpr(true);
                  destroyArr.push(childMap.node);
                  this.mapClearNode(childMap);
                }
              }
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, .3, this) ];

             case 1:
              _b.sent();
              delay = 0;
              for (_i = 0, destroyArr_1 = destroyArr; _i < destroyArr_1.length; _i++) {
                child = destroyArr_1[_i];
                delay = child.getComponent(Fruit_1.default).playAn();
              }
              AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.xiao);
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, delay / 3, this) ];

             case 2:
              _b.sent();
              DGame_1.default.instance.addTime(destroyArr.length);
              for (_a = 0, destroyArr_2 = destroyArr; _a < destroyArr_2.length; _a++) {
                child = destroyArr_2[_a];
                child.destroy();
              }
              return [ 4, this.isDrop() ];

             case 3:
              _b.sent();
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, .1, this) ];

             case 4:
              _b.sent();
              result = this.isGameOver();
              if (result) if (this.blockLay.node.childrenCount <= 0) DGame_1.default.instance.gameWin(); else {
                this.changeMap();
                DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              } else DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              callback(null, null);
              return [ 3, 6 ];

             case 5:
              err_1 = _b.sent();
              callback(err_1, null);
              return [ 3, 6 ];

             case 6:
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.mapAddNode = function(map, node, isMove) {
        void 0 === isMove && (isMove = false);
        map.node = node;
        map.fruitType = node.getComponent(Fruit_1.default).getFruitType();
        map.blockType = LlkMapDefine_1.BLOCK_TYPE.NODE;
        map.node.zIndex = map.zIndex;
        node.getComponent(Fruit_1.default).setArrPos(map.arrPos);
        if (isMove) {
          node.stopAllActions();
          node.runAction(cc.moveTo(.05, map.nodePos));
        } else node.setPosition(map.nodePos);
      };
      LlkMap.prototype.mapClearNode = function(map) {
        map.node = null;
        map.fruitType = 0;
        map.blockType = LlkMapDefine_1.BLOCK_TYPE.EMPTY;
      };
      LlkMap.prototype.showMap = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _i, _a, child;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              for (_i = 0, _a = this.blockLay.node.children; _i < _a.length; _i++) {
                child = _a[_i];
                this.showFruit(child);
              }
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, LlkMapDefine_1.FADIN_TIME, this) ];

             case 1:
              _b.sent();
              DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.createFruit = function() {
        return __awaiter(this, void 0, void 0, function() {
          var emptyPosArr, x, y, fruitType, i, rnd, arrPos, node;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              emptyPosArr = [];
              for (x = 0; x < this._xCount; x++) for (y = 0; y < this._yCount; y++) this._map[x][y].blockType === LlkMapDefine_1.BLOCK_TYPE.EMPTY && emptyPosArr.push(cc.v2(x, y));
              fruitType = Util_1.default.randomInt(this._fruitType, 1);
              i = 0;
              _a.label = 1;

             case 1:
              if (!(i < 2)) return [ 3, 5 ];
              rnd = Util_1.default.randomInt(emptyPosArr.length - 1, 0);
              arrPos = emptyPosArr[rnd];
              return [ 4, NodePool_1.default.getNode(Fruit_1.default) ];

             case 2:
              node = _a.sent();
              this.blockLay.node.addChild(node);
              node.opacity = 0;
              return [ 4, node.getComponent(Fruit_1.default).onInit(fruitType, i) ];

             case 3:
              _a.sent();
              this.mapAddNode(this._map[arrPos.x][arrPos.y], node);
              this.showFruit(node);
              emptyPosArr.splice(rnd, 1);
              _a.label = 4;

             case 4:
              i++;
              return [ 3, 1 ];

             case 5:
              return [ 4, Util_1.default.promisify(Util_1.default.addDelayTime, Util_1.default, LlkMapDefine_1.FADIN_TIME, this) ];

             case 6:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.clearSelect = function() {
        var arrPos1 = this._firstFruit.getArrPos();
        var childMap = this._map[arrPos1.x][arrPos1.y];
        this._firstFruit.node.scale = 1;
        this._firstFruit.node.zIndex = childMap.zIndex;
        this._firstFruit.setChooseSpr(false);
        this._firstFruit = null;
        this.setFirstFruit(this._secondFruit);
        this._secondFruit = null;
        DGame_1.default.instance.setGameState(DGameDefine_1.GAMESTATE.NORMAL);
      };
      LlkMap.prototype.autoClear = function() {
        return __awaiter(this, void 0, void 0, function() {
          var arrPos1, arrPos2;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.isGameOver();
              arrPos1 = this._pointPath[0];
              arrPos2 = this._pointPath[this._pointPath.length - 1];
              this.setFirstFruit(this._map[arrPos1.x][arrPos1.y].node.getComponent(Fruit_1.default));
              this.setSecondFruit(this._map[arrPos2.x][arrPos2.y].node.getComponent(Fruit_1.default));
              return [ 4, this.lineAndEliminate(arrPos1, arrPos2) ];

             case 1:
              _a.sent();
              return [ 2 ];
            }
          });
        });
      };
      LlkMap.prototype.showFruit = function(node) {
        node.runAction(cc.fadeIn(LlkMapDefine_1.FADIN_TIME));
      };
      LlkMap.prototype.getFirstFruit = function() {
        return this._firstFruit;
      };
      LlkMap.prototype.clearFirst = function() {
        if (this._firstFruit) {
          var arrPos1 = this._firstFruit.getArrPos();
          var childMap = this._map[arrPos1.x][arrPos1.y];
          this._firstFruit.node.scale = 1;
          this._firstFruit.node.zIndex = childMap.zIndex;
          this._firstFruit.setChooseSpr(false);
          this._firstFruit = null;
        }
      };
      LlkMap.prototype.setFirstFruit = function(script) {
        this._firstFruit = script;
        script.node.zIndex = 1e3;
        script.node.scale = DGame_1.default.instance.getFruitScaleNum();
        script.setChooseSpr(true);
      };
      LlkMap.prototype.getSecondFruit = function() {
        return this._secondFruit;
      };
      LlkMap.prototype.setSecondFruit = function(script) {
        this._secondFruit = script;
      };
      LlkMap.prototype.getXcount = function() {
        return this._xCount;
      };
      LlkMap.prototype.getYcount = function() {
        return this._yCount;
      };
      var LlkMap_1;
      LlkMap._instance = null;
      __decorate([ property(cc.Layout) ], LlkMap.prototype, "blockLay", void 0);
      LlkMap = LlkMap_1 = __decorate([ ccclass ], LlkMap);
      return LlkMap;
    }(cc.Component);
    exports.default = LlkMap;
    cc._RF.pop();
  }, {
    "../lib/AudioPool": "AudioPool",
    "../lib/NodePool": "NodePool",
    "../lib/Util": "Util",
    "../ui/AudioNode": "AudioNode",
    "./DGame": "DGame",
    "./DGameDefine": "DGameDefine",
    "./Fruit": "Fruit",
    "./Line": "Line",
    "./LlkMapDefine": "LlkMapDefine",
    "./LlkMapEditor": "LlkMapEditor",
    "./Star": "Star"
  } ],
  LoadNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dd4c12KaztPd68WNUI+wo2s", "LoadNode");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PrefabDefine_1 = require("../lib/PrefabDefine");
    var PrefabPool_1 = require("../lib/PrefabPool");
    var ContentNode_1 = require("./ContentNode");
    var DialogNode_1 = require("./DialogNode");
    var ToastNode_1 = require("./ToastNode");
    var GameParm_1 = require("../lib/GameParm");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoadNode = function(_super) {
      __extends(LoadNode, _super);
      function LoadNode() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.bgSpr = null;
        return _this;
      }
      LoadNode_1 = LoadNode;
      Object.defineProperty(LoadNode, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      LoadNode.prototype.onLoad = function() {
        LoadNode_1._instance = this;
        this.bgSpr.node.scale = GameParm_1.default.instance.getConetentViewScale();
      };
      LoadNode.prototype.loadContent = function(componentName, data) {
        return __awaiter(this, void 0, void 0, function() {
          var node, _a, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              this.node.active = true;
              this.bgSpr.node.active = true;
              ContentNode_1.default.instance.node.removeAllChildren();
              _b = (_a = cc).instantiate;
              return [ 4, PrefabPool_1.default.getPrefab(PrefabDefine_1.PREFAB_URL[componentName]) ];

             case 1:
              node = _b.apply(_a, [ _c.sent() ]);
              if (!data) return [ 3, 3 ];
              return [ 4, node.getComponent(componentName).onInit(data) ];

             case 2:
              _c.sent();
              _c.label = 3;

             case 3:
              ContentNode_1.default.instance.node.addChild(node);
              return [ 2 ];
            }
          });
        });
      };
      LoadNode.prototype.loadDialog = function(componentName, data) {
        return __awaiter(this, void 0, void 0, function() {
          var node, _a, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              this.node.active = true;
              this.bgSpr.node.active = false;
              _b = (_a = cc).instantiate;
              return [ 4, PrefabPool_1.default.getPrefab(PrefabDefine_1.PREFAB_URL[componentName]) ];

             case 1:
              node = _b.apply(_a, [ _c.sent() ]);
              data && node.getComponent(componentName).onInit(data);
              DialogNode_1.default.instance.node.addChild(node);
              this.node.active = false;
              return [ 2 ];
            }
          });
        });
      };
      LoadNode.prototype.loadToast = function(componentName, data) {
        return __awaiter(this, void 0, void 0, function() {
          var node, _a, _b;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              _b = (_a = cc).instantiate;
              return [ 4, PrefabPool_1.default.getPrefab(PrefabDefine_1.PREFAB_URL[componentName]) ];

             case 1:
              node = _b.apply(_a, [ _c.sent() ]);
              data && node.getComponent(componentName).onInit(data);
              ToastNode_1.default.instance.node.addChild(node);
              return [ 2 ];
            }
          });
        });
      };
      LoadNode.prototype.showLoad = function() {
        this.node.active = true;
        this.bgSpr.node.active = false;
      };
      LoadNode.prototype.hideLoad = function() {
        this.node.active = false;
      };
      var LoadNode_1;
      LoadNode._instance = null;
      __decorate([ property(cc.Sprite) ], LoadNode.prototype, "bgSpr", void 0);
      LoadNode = LoadNode_1 = __decorate([ ccclass ], LoadNode);
      return LoadNode;
    }(cc.Component);
    exports.default = LoadNode;
    cc._RF.pop();
  }, {
    "../lib/GameParm": "GameParm",
    "../lib/PrefabDefine": "PrefabDefine",
    "../lib/PrefabPool": "PrefabPool",
    "./ContentNode": "ContentNode",
    "./DialogNode": "DialogNode",
    "./ToastNode": "ToastNode"
  } ],
  Logger: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1bedcQVtVN3qd+JNO9zxTs", "Logger");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LOGLV_DEBUG = 1;
    var LOGLV_INFO = 2;
    var LOGLV_WARN = 3;
    var LOGLV_ERROR = 4;
    var LOGLV = 1;
    var OUT_DEBUG = cc.log;
    var OUT_INFO = cc.log;
    var OUT_WARN = cc.warn;
    var OUT_ERROR = cc.error;
    function getDateString() {
      var time = new Date();
      return "" + time.toISOString();
    }
    function logdebug(val) {
      if (LOGLV <= LOGLV_DEBUG) {
        var text = getDateString() + " " + ("object" === typeof val ? JSON.stringify(val) : val);
        OUT_DEBUG(text);
      }
    }
    function loginfo(val) {
      if (LOGLV <= LOGLV_INFO) {
        var text = getDateString() + " " + ("object" === typeof val ? JSON.stringify(val) : val);
        OUT_INFO(text);
      }
    }
    function logwarn(val) {
      if (LOGLV <= LOGLV_WARN) {
        var text = getDateString() + " " + ("object" === typeof val ? JSON.stringify(val) : val);
        OUT_WARN(text);
      }
    }
    function logerror(val) {
      var text = "";
      if (LOGLV <= LOGLV_ERROR) {
        text = getDateString() + " " + ("object" === typeof val ? JSON.stringify(val) : val);
        OUT_ERROR(text);
      }
    }
    exports.default = {
      getDateString: getDateString,
      debug: logdebug,
      info: loginfo,
      warn: logwarn,
      error: logerror
    };
    cc._RF.pop();
  }, {} ],
  Main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2994LpEo5L46GC0LhH01R5", "Main");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LoadNode_1 = require("./LoadNode");
    var User_1 = require("../lib/User");
    var AudioNode_1 = require("./AudioNode");
    var NativeCtrl_1 = require("../lib/NativeCtrl");
    var AtlasPool_1 = require("../lib/AtlasPool");
    var i18n_1 = require("../lib/i18n/i18n");
    var GameParm_1 = require("../lib/GameParm");
    var Events_1 = require("../lib/Events");
    var Util_1 = require("../lib/Util");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Main = function(_super) {
      __extends(Main, _super);
      function Main() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.errorNode = null;
        _this.errorLab = null;
        _this.blockInputNode = null;
        return _this;
      }
      Main_1 = Main;
      Object.defineProperty(Main, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      Main.prototype.onLoad = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            try {
              Main_1._instance = this;
              cc.debug.setDisplayStats(false);
              NativeCtrl_1.default.setup();
              User_1.default.instance.onInit();
              GameParm_1.default.instance.onInit();
              AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.CN, "1");
              AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.EN, "1");
              AtlasPool_1.default.getSpriteFrame(AtlasPool_1.ALTAS.FT, "1");
              Events_1.default.on(Events_1.EVENT.UI_ERROR_ALERT, this.eventUiErrorAlert, this);
            } catch (error) {
              Util_1.default.showError(error);
            }
            return [ 2 ];
          });
        });
      };
      Main.prototype.start = function() {
        return __awaiter(this, void 0, void 0, function() {
          var error_1;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              _a.trys.push([ 0, 2, , 3 ]);
              i18n_1.default.instance.change(GameParm_1.default.instance.getLan());
              return [ 4, AudioNode_1.default.instance.onInit() ];

             case 1:
              _a.sent();
              LoadNode_1.default.instance.loadContent("DHome", null);
              return [ 3, 3 ];

             case 2:
              error_1 = _a.sent();
              Util_1.default.showError(error_1);
              return [ 3, 3 ];

             case 3:
              return [ 2 ];
            }
          });
        });
      };
      Main.prototype.setAdvNodeActive = function(state) {
        this.blockInputNode.active = state;
      };
      Main.prototype.eventUiErrorAlert = function(event, arg) {
        this.errorNode.active = true;
        var text = "string" === typeof arg[0] ? arg[0] : JSON.stringify(arg[0]);
        var arr = text.split("\n");
        var out = arr[0].replace("] ", "]\n");
        this.errorLab.string = out;
      };
      var Main_1;
      Main._instance = null;
      __decorate([ property(cc.Node) ], Main.prototype, "errorNode", void 0);
      __decorate([ property(cc.Label) ], Main.prototype, "errorLab", void 0);
      __decorate([ property(cc.Node) ], Main.prototype, "blockInputNode", void 0);
      Main = Main_1 = __decorate([ ccclass ], Main);
      return Main;
    }(cc.Component);
    exports.default = Main;
    cc._RF.pop();
  }, {
    "../lib/AtlasPool": "AtlasPool",
    "../lib/Events": "Events",
    "../lib/GameParm": "GameParm",
    "../lib/NativeCtrl": "NativeCtrl",
    "../lib/User": "User",
    "../lib/Util": "Util",
    "../lib/i18n/i18n": "i18n",
    "./AudioNode": "AudioNode",
    "./LoadNode": "LoadNode"
  } ],
  NativeCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5204v10cFFRYUXh53qRQMI", "NativeCtrl");
    "use strict";
    var __spreadArrays = this && this.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
      k++) r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Logger_1 = require("./Logger");
    var Util_1 = require("./Util");
    function errorHandle(err, callback) {
      void 0 === callback && (callback = null);
      callback ? callback(err, null) : Util_1.default.showError(err);
    }
    var ANDROID_PATH = "org/cocos2dx/javascript/AppExport";
    var func = {
      appleGameCenterSetup: "appleGameCenterSetup",
      googlePlayGamesSetup: "googlePlayGamesSetup",
      googlePlayGamesStartCaptureVideo: "googlePlayGamesStartCaptureVideo",
      cloudSaveData: "cloudSaveData",
      cloudLoadData: "cloudLoadData",
      cloudDeleteData: "cloudDeleteData",
      cloudDeleteAllData: "cloudDeleteAllData",
      cloudShowSaves: "cloudShowSaves",
      achievementsUnlock: "achievementsUnlock",
      achievementsShow: "achievementsShow",
      leaderboardsSubmitScore: "leaderboardsSubmitScore",
      leaderboardsShow: "leaderboardsShow",
      leaderboardsShowSpecific: "leaderboardsShowSpecific",
      replaySetup: "replaySetup",
      replayStartCapture: "replayStartCapture",
      replayStopCapture: "replayStopCapture",
      openRating: "openRating",
      openAppStore: "openAppStore",
      adsSetup: "adsSetup",
      adsShowAdvert: "adsShowAdvert",
      wxSetup: "wxSetup",
      talkingdataSetup: "talkingdataSetup",
      talkingdataSetDefaultAccount: "talkingdataSetDefaultAccount",
      crashReportJSError: "crashReportJSError",
      crashReportLog: "crashReportLog",
      getScreenResolution: "getScreenResolution",
      getScreenSafeArea: "getScreenSafeArea",
      getSystemLanguage: "getSystemLanguage"
    };
    var sign = {};
    function setup() {
      if (!cc.sys.isNative) return;
      if (cc.sys.os === cc.sys.OS_IOS) {
        sign[func.appleGameCenterSetup] = [ "gameCenterSetup" ];
        sign[func.cloudSaveData] = [ "cloudSaveDataWithKey:data:" ];
        sign[func.cloudLoadData] = [ "cloudLoadData" ];
        sign[func.cloudDeleteData] = [ "cloudDeleteData" ];
        sign[func.cloudDeleteAllData] = [ "cloudDeleteAllData" ];
        sign[func.replaySetup] = [ "replaySetup" ];
        sign[func.replayStartCapture] = [ "replayStartCapture:" ];
        sign[func.replayStopCapture] = [ "replayStopCapture" ];
        sign[func.wxSetup] = [ "wxSetup:" ];
      } else if (cc.sys.os === cc.sys.OS_ANDROID) {
        sign[func.googlePlayGamesSetup] = [ "googlePlayGamesSetup", "(Z)V" ];
        sign[func.googlePlayGamesStartCaptureVideo] = [ "googlePlayGamesStartCaptureVideo", "()V" ];
        sign[func.cloudSaveData] = [ "cloudSaveData", "(Ljava/lang/String;Ljava/lang/String;)V" ];
        sign[func.cloudLoadData] = [ "cloudLoadData", "()V" ];
        sign[func.cloudShowSaves] = [ "cloudShowSaves", "()V" ];
        sign[func.achievementsUnlock] = [ "achievementsUnlock", "(Ljava/lang/String;)V" ];
        sign[func.achievementsShow] = [ "achievementsShow", "()V" ];
        sign[func.leaderboardsSubmitScore] = [ "leaderboardsSubmitScore", "(Ljava/lang/String;I)V" ];
        sign[func.leaderboardsShow] = [ "leaderboardsShow", "()V" ];
        sign[func.leaderboardsShowSpecific] = [ "leaderboardsShowSpecific", "(Ljava/lang/String;)V" ];
        sign[func.replaySetup] = [ "replaySetup", "()V" ];
        sign[func.replayStartCapture] = [ "replayStartCapture", "(ZII)V" ];
        sign[func.replayStopCapture] = [ "replayStopCapture", "()V" ];
        sign[func.openRating] = [ "openRating", "(Z)V" ];
        sign[func.openAppStore] = [ "openAppStore", "()V" ];
        sign[func.adsSetup] = [ "adsSetup", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V" ];
        sign[func.adsShowAdvert] = [ "adsShowAdvert", "(Ljava/lang/String;)V" ];
        sign[func.wxSetup] = [ "wxSetup", "(Ljava/lang/String;)V" ];
        sign[func.talkingdataSetup] = [ "talkingdataSetup", "(Ljava/lang/String;Ljava/lang/String;Z)V" ];
        sign[func.talkingdataSetDefaultAccount] = [ "talkingdataSetDefaultAccount", "()V" ];
        sign[func.crashReportJSError] = [ "crashReportJSError", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V" ];
        sign[func.crashReportLog] = [ "crashReportLog", "(Ljava/lang/String;)V" ];
        sign[func.getScreenResolution] = [ "getScreenResolution", "()Ljava/lang/String;" ];
        sign[func.getScreenSafeArea] = [ "getScreenSafeArea", "()Ljava/lang/String;" ];
        sign[func.getSystemLanguage] = [ "getSystemLanguage", "()Ljava/lang/String;" ];
      }
      googlePlayGamesServicesSetup();
      advertSetup();
      talkingdataSetup();
      talkingdataSetDefaultAccount();
    }
    function jsbInvoke(name) {
      var _a, _b;
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
      if (!cc.sys.isNative) return null;
      Logger_1.default.info("[NativeCtrl.jsbInvoke] invoke function " + name);
      var obj = sign[name];
      if (!obj) return null;
      return cc.sys.os === cc.sys.OS_IOS && 1 === obj.length ? (_a = jsb.reflection).callStaticMethod.apply(_a, __spreadArrays([ "AppExport", obj[0] ], args)) : cc.sys.os === cc.sys.OS_ANDROID && 2 === obj.length ? (_b = jsb.reflection).callStaticMethod.apply(_b, __spreadArrays([ ANDROID_PATH, obj[0], obj[1] ], args)) : null;
    }
    function appleGameCenterSetup() {
      jsbInvoke(func.appleGameCenterSetup);
    }
    function googlePlayGamesServicesSetup() {
      jsbInvoke(func.googlePlayGamesSetup, false);
    }
    function googlePlayGamesServiceStartCaptureVideo() {
      jsbInvoke(func.googlePlayGamesStartCaptureVideo);
    }
    var cloudSaveCallback = null;
    var cloudLoadCallback = null;
    var cloudDeleteCallback = null;
    var cloudDeleteAllCallback = null;
    window.appCloudSaveDataResult = function(key, status) {
      if (cc.sys.isNative && cloudSaveCallback) {
        var call = cloudSaveCallback;
        cloudSaveCallback = null;
        call(null, {
          key: key,
          status: status
        });
      }
    };
    window.appCloudLoadDataResult = function(data, status) {
      if (cc.sys.isNative && cloudLoadCallback) {
        var call = cloudLoadCallback;
        cloudLoadCallback = null;
        call(null, {
          data: data,
          status: status
        });
      }
    };
    window.appCloudDeleteDataResult = function(key, status) {
      if (cc.sys.isNative && cloudDeleteCallback) {
        var call = cloudDeleteCallback;
        cloudDeleteCallback = null;
        call(null, {
          key: key,
          status: status
        });
      }
    };
    window.appCloudDelteAllDataResult = function(status) {
      if (cc.sys.isNative && cloudDeleteAllCallback) {
        var call = cloudDeleteAllCallback;
        cloudDeleteAllCallback = null;
        call(null, {
          status: status
        });
      }
    };
    function cloudSaveData(callback, key, data) {
      try {
        cloudSaveCallback = callback;
        jsbInvoke(func.cloudSaveData, key, data);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function cloudLoadData(callback) {
      try {
        cloudLoadCallback = callback;
        jsbInvoke(func.cloudLoadData);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function cloudDeleteData(callback, key) {
      try {
        cloudDeleteCallback = callback;
        jsbInvoke(func.cloudDeleteData, key);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function cloudDeleteAllData(callback) {
      try {
        cloudDeleteAllCallback = callback;
        jsbInvoke(func.cloudDeleteAllData);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function cloudShowSaves() {
      jsbInvoke(func.cloudShowSaves);
    }
    var achievementsUnlockCallback = null;
    var achievementsShowCallback = null;
    window.appAchievementsUnlockResult = function() {
      if (cc.sys.isNative && achievementsUnlockCallback) {
        var call = achievementsUnlockCallback;
        achievementsUnlockCallback = null;
        call(null, null);
      }
    };
    window.appAchievementsShowResult = function() {
      if (cc.sys.isNative && achievementsShowCallback) {
        var call = achievementsShowCallback;
        achievementsShowCallback = null;
        call(null, null);
      }
    };
    function achievementsUnlock(callback, key) {
      try {
        achievementsUnlockCallback = callback;
        jsbInvoke(func.achievementsUnlock, key);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function achievementsShow(callback) {
      try {
        achievementsShowCallback = callback;
        jsbInvoke(func.achievementsShow);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    var leaderboardsSubmitScoreCallback = null;
    var leaderboardsShowCallback = null;
    var leaderboardsShowSpecificCallback = null;
    window.appLeaderboardsSubmitSocreResult = function() {
      if (cc.sys.isNative && leaderboardsSubmitScoreCallback) {
        var call = leaderboardsSubmitScoreCallback;
        leaderboardsSubmitScoreCallback = null;
        call(null, null);
      }
    };
    window.appLeaderboardsShowResult = function() {
      if (cc.sys.isNative && leaderboardsShowCallback) {
        var call = leaderboardsShowCallback;
        leaderboardsShowCallback = null;
        call(null, null);
      }
    };
    window.appLeaderboardsShowSpecificResult = function() {
      if (cc.sys.isNative && leaderboardsShowSpecificCallback) {
        var call = leaderboardsShowSpecificCallback;
        leaderboardsShowSpecificCallback = null;
        call(null, null);
      }
    };
    function leaderboardsSubmitScore(callback, key, score) {
      try {
        leaderboardsSubmitScoreCallback = callback;
        jsbInvoke(func.leaderboardsSubmitScore, key, score);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function leaderboardsShow(callback) {
      try {
        leaderboardsShowCallback = callback;
        jsbInvoke(func.leaderboardsShow);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function leaderboardsShowSpecific(callback, leaderboardId) {
      try {
        leaderboardsShowSpecificCallback = callback;
        jsbInvoke(func.leaderboardsShowSpecific, leaderboardId);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    var replayStartCaptureCallback = null;
    var replayStopCaptureCallback = null;
    window.appReplayStartCaptureResult = function(status) {
      if (cc.sys.isNative && replayStartCaptureCallback) {
        var call = replayStartCaptureCallback;
        replayStartCaptureCallback = null;
        call(null, status);
      }
    };
    window.appReplayStopCaptureResult = function(status) {
      if (cc.sys.isNative && replayStopCaptureCallback) {
        var call = replayStopCaptureCallback;
        replayStopCaptureCallback = null;
        call(null, status);
      }
    };
    function replaySetup() {
      jsbInvoke(func.replaySetup);
    }
    function replayStartCapture(callback, isEnableMic, videoWidth, videoHeight) {
      void 0 === isEnableMic && (isEnableMic = false);
      void 0 === videoWidth && (videoWidth = 0);
      void 0 === videoHeight && (videoHeight = 0);
      try {
        replayStartCaptureCallback = callback;
        jsbInvoke(func.replayStartCapture, isEnableMic, videoWidth, videoHeight);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function replayStopCapture(callback) {
      try {
        replayStopCaptureCallback = callback;
        jsbInvoke(func.replayStopCapture);
      } catch (err) {
        errorHandle(err, callback);
      }
    }
    function openRating(isAuto) {
      jsbInvoke(func.openRating, isAuto);
    }
    function openAppStore() {
      jsbInvoke(func.openAppStore);
    }
    var ADVERT_DEBUG = false;
    var GOOGLE_ADMOB_APP_ID = "ca-app-pub-1724648192219817~9853243090";
    var GOOGLE_ADMOB_BANNER_ID = "ca-app-pub-1724648192219817/6404952672";
    var GOOGLE_ADMOB_INTERSTITIAL_ID = "ca-app-pub-1724648192219817/8786314250";
    var GOOGLE_ADMOB_VIDEO_ID = "";
    var GOOGLE_ADMOB_REWARD_VIDEO_ID = "ca-app-pub-1724648192219817/3019762509";
    var UNITY_APP_ID = "3240484";
    var UNITY_BANNER_ID = "banner";
    var UNITY_INTERSTITIAL_ID = "";
    var UNITY_VIDEO_ID = "video";
    var UNITY_REWARAD_VIDEO_ID = "rewardedVideo";
    var FACEBOOK_APP_ID = "";
    var FACEBOOK_BANNER_ID = "437632023525250_437633290191790";
    var FACEBOOK_INTERSTITIAL_ID = "437632023525250_437632670191852";
    var FACEBOOK_VIDEO_ID = "";
    var FACEBOOK_REWARD_VIDEO_ID = "437632023525250_437633843525068";
    var ADVERT_PLATFORM_GOOGLE_ADMOB = 1;
    var ADVERT_PLATFORM_UNITY_ADS = 2;
    var ADVERT_PLATFORM_FACEBOOK_ADS = 3;
    var advertShowCallback = null;
    window.appAdvertShowResult = function(code) {
      if (advertShowCallback) {
        var call = advertShowCallback;
        advertShowCallback = null;
        call(null, code);
      }
    };
    function advertSetup() {
      jsbInvoke(func.adsSetup, ADVERT_PLATFORM_GOOGLE_ADMOB, GOOGLE_ADMOB_APP_ID, GOOGLE_ADMOB_BANNER_ID, GOOGLE_ADMOB_INTERSTITIAL_ID, GOOGLE_ADMOB_VIDEO_ID, GOOGLE_ADMOB_REWARD_VIDEO_ID, ADVERT_DEBUG);
      jsbInvoke(func.adsSetup, ADVERT_PLATFORM_UNITY_ADS, UNITY_APP_ID, UNITY_BANNER_ID, UNITY_INTERSTITIAL_ID, UNITY_VIDEO_ID, UNITY_REWARAD_VIDEO_ID, ADVERT_DEBUG);
      jsbInvoke(func.adsSetup, ADVERT_PLATFORM_FACEBOOK_ADS, FACEBOOK_APP_ID, FACEBOOK_BANNER_ID, FACEBOOK_INTERSTITIAL_ID, FACEBOOK_VIDEO_ID, FACEBOOK_REWARD_VIDEO_ID, ADVERT_DEBUG);
    }
    function advertShow(callback, event) {
      try {
        advertShowCallback = callback;
        jsbInvoke(func.adsShowAdvert, event);
      } catch (err) {
        callback(err, null);
      }
    }
    var WX_APP_ID = "wxd3ec9516cb0a39f2";
    function wxSetup() {
      jsbInvoke(func.wxSetup, WX_APP_ID);
    }
    var TALKING_DATA_DEBUG = false;
    var TALKING_DATA_APP_ID = "B45D153F71434C208C6E7B08FA3D652F";
    var TALKING_DATA_CHANNEL = "default";
    function talkingdataSetup() {
      jsbInvoke(func.talkingdataSetup, TALKING_DATA_APP_ID, TALKING_DATA_CHANNEL, TALKING_DATA_DEBUG);
    }
    function talkingdataSetDefaultAccount() {
      jsbInvoke(func.talkingdataSetDefaultAccount);
    }
    function crashReportJSError(err) {
      var location = err.name || "";
      var message = err.message || "";
      var stack = err.stack || "";
      jsbInvoke(func.crashReportJSError, location, message, stack);
    }
    function crashReportLog(message) {
      jsbInvoke(func.crashReportLog, message);
    }
    function getScreenResolution() {
      var ret = {
        width: 0,
        height: 0
      };
      var text = jsbInvoke(func.getScreenResolution);
      if (text) {
        var obj = JSON.parse(text);
        ret.width = obj.width || 0;
        ret.height = obj.height || 0;
      }
      return ret;
    }
    function getScreenSafeArea() {
      var ret = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
      var text = jsbInvoke(func.getScreenSafeArea);
      if (text) {
        var obj = JSON.parse(text);
        ret.top = obj.top || 0;
        ret.bottom = obj.bottom || 0;
        ret.left = obj.left || 0;
        ret.right = obj.right || 0;
      }
      return ret;
    }
    function getSystemLanguage() {
      return jsbInvoke(func.getSystemLanguage);
    }
    exports.default = {
      setup: setup,
      googlePlayGamesServiceStartCaptureVideo: googlePlayGamesServiceStartCaptureVideo,
      cloudSave: cloudSaveData,
      cloudLoad: cloudLoadData,
      cloudDelete: cloudDeleteData,
      cloudDeleteAll: cloudDeleteAllData,
      cloudShowSaves: cloudShowSaves,
      achievementsUnlock: achievementsUnlock,
      achievementsShow: achievementsShow,
      LEADERBOARD_CLASSIC: "CgkI5vHGxv0JEAIQAA",
      LEADERBOARD_TIME: "CgkI5vHGxv0JEAIQAQ",
      LEADERBOARD_NIGHT: "CgkI5vHGxv0JEAIQAg",
      leaderboardsSubmitScore: leaderboardsSubmitScore,
      leaderboardsShow: leaderboardsShow,
      leaderboardsShowSpecific: leaderboardsShowSpecific,
      replayStartCapture: replayStartCapture,
      replayStopCapture: replayStopCapture,
      openRating: openRating,
      openAppStore: openAppStore,
      advertShow: advertShow,
      crashReportJSError: crashReportJSError,
      crashReportLog: crashReportLog,
      getScreenResolution: getScreenResolution,
      getScreenSafeArea: getScreenSafeArea,
      getSystemLanguage: getSystemLanguage
    };
    cc._RF.pop();
  }, {
    "./Logger": "Logger",
    "./Util": "Util"
  } ],
  NodePool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1e55bSaP8BCSZ0VBvsZD3os", "NodePool");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PrefabPool_1 = require("./PrefabPool");
    var PrefabDefine_1 = require("./PrefabDefine");
    var poolMap = {};
    function getPool(cmp) {
      var key = "string" === typeof cmp ? cmp : cmp.name;
      var pool = poolMap[key];
      if (!pool) {
        pool = "string" === typeof cmp ? new cc.NodePool() : new cc.NodePool(cmp);
        poolMap[key] = pool;
      }
      return pool;
    }
    function getNode(cmp) {
      return __awaiter(this, void 0, void 0, function() {
        var node, pool, key, prefabUrl, prefab;
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            node = null;
            pool = getPool(cmp);
            if (!(pool.size() > 0)) return [ 3, 1 ];
            node = pool.get();
            return [ 3, 5 ];

           case 1:
            key = "string" === typeof cmp ? cmp : cmp.name;
            prefabUrl = PrefabDefine_1.PREFAB_URL[key];
            prefab = null;
            if (!prefabUrl) return [ 3, 3 ];
            return [ 4, PrefabPool_1.default.getPrefab(prefabUrl) ];

           case 2:
            prefab = _a.sent();
            return [ 3, 4 ];

           case 3:
            throw new Error("[NodePool.getNode] \u4e0d\u5b58\u5728\u8def\u5f84\u4e3a" + prefabUrl + "\u7684prefab");

           case 4:
            node = cc.instantiate(prefab);
            _a.label = 5;

           case 5:
            return [ 2, node ];
          }
        });
      });
    }
    function putNode(cmp, node) {
      var pool = getPool(cmp);
      pool.put(node);
    }
    function clearPoolByCmp(cmp) {
      var pool = getPool(cmp);
      pool.clear();
    }
    function clearAll() {
      Object.keys(poolMap).forEach(function(e) {
        return poolMap[e].clear();
      });
    }
    exports.default = {
      getNode: getNode,
      putNode: putNode,
      clearPoolByRespath: clearPoolByCmp,
      clearAll: clearAll
    };
    cc._RF.pop();
  }, {
    "./PrefabDefine": "PrefabDefine",
    "./PrefabPool": "PrefabPool"
  } ],
  PassConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d4224KVgLFLcpYmLffeysAA", "PassConfig");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PassConfig = void 0;
    var PassConfig = [ {
      OrderId: 1,
      PassId: 1,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_3" ]
    }, {
      OrderId: 2,
      PassId: 2,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_2" ]
    }, {
      OrderId: 3,
      PassId: 3,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_1" ]
    }, {
      OrderId: 4,
      PassId: 4,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_3" ]
    }, {
      OrderId: 5,
      PassId: 5,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_4" ]
    }, {
      OrderId: 6,
      PassId: 6,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_2" ]
    }, {
      OrderId: 7,
      PassId: 7,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_5" ]
    }, {
      OrderId: 8,
      PassId: 8,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_6" ]
    }, {
      OrderId: 9,
      PassId: 9,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_3" ]
    }, {
      OrderId: 10,
      PassId: 10,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_7" ]
    }, {
      OrderId: 11,
      PassId: 11,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_8" ]
    }, {
      OrderId: 12,
      PassId: 12,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_4" ]
    }, {
      OrderId: 13,
      PassId: 13,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_9" ]
    }, {
      OrderId: 14,
      PassId: 14,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_10" ]
    }, {
      OrderId: 15,
      PassId: 15,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_5" ]
    }, {
      OrderId: 16,
      PassId: 16,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_11" ]
    }, {
      OrderId: 17,
      PassId: 17,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_12" ]
    }, {
      OrderId: 18,
      PassId: 18,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_6" ]
    }, {
      OrderId: 19,
      PassId: 19,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_13" ]
    }, {
      OrderId: 20,
      PassId: 20,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_14" ]
    }, {
      OrderId: 21,
      PassId: 21,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_7" ]
    }, {
      OrderId: 22,
      PassId: 22,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_15" ]
    }, {
      OrderId: 23,
      PassId: 23,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_16" ]
    }, {
      OrderId: 24,
      PassId: 24,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_8" ]
    }, {
      OrderId: 25,
      PassId: 25,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_17" ]
    }, {
      OrderId: 26,
      PassId: 26,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_18" ]
    }, {
      OrderId: 27,
      PassId: 27,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_9" ]
    }, {
      OrderId: 28,
      PassId: 28,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_19" ]
    }, {
      OrderId: 29,
      PassId: 29,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_20" ]
    }, {
      OrderId: 30,
      PassId: 30,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_10" ]
    }, {
      OrderId: 31,
      PassId: 31,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_21" ]
    }, {
      OrderId: 32,
      PassId: 32,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_22" ]
    }, {
      OrderId: 33,
      PassId: 33,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_11" ]
    }, {
      OrderId: 34,
      PassId: 34,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_23" ]
    }, {
      OrderId: 35,
      PassId: 35,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_0_24" ]
    }, {
      OrderId: 36,
      PassId: 36,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_12" ]
    }, {
      OrderId: 37,
      PassId: 37,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_13" ]
    }, {
      OrderId: 38,
      PassId: 38,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_14" ]
    }, {
      OrderId: 39,
      PassId: 39,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_15" ]
    }, {
      OrderId: 40,
      PassId: 40,
      PassType: 1,
      Step: 1,
      PrefabId: [ "9x8_9_16" ]
    }, {
      OrderId: 41,
      PassId: 41,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_1", "9x8_9_1" ]
    }, {
      OrderId: 42,
      PassId: 42,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_3", "9x8_9_2" ]
    }, {
      OrderId: 43,
      PassId: 43,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 44,
      PassId: 44,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 45,
      PassId: 45,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_5", "9x8_9_3" ]
    }, {
      OrderId: 46,
      PassId: 46,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_4" ]
    }, {
      OrderId: 47,
      PassId: 47,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_5" ]
    }, {
      OrderId: 48,
      PassId: 48,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_6" ]
    }, {
      OrderId: 49,
      PassId: 49,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_13", "9x8_9_7" ]
    }, {
      OrderId: 50,
      PassId: 50,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_15", "9x8_9_8" ]
    }, {
      OrderId: 51,
      PassId: 51,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_9" ]
    }, {
      OrderId: 52,
      PassId: 52,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 53,
      PassId: 53,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_11" ]
    }, {
      OrderId: 54,
      PassId: 54,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_23", "9x8_9_12" ]
    }, {
      OrderId: 55,
      PassId: 55,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 56,
      PassId: 56,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 57,
      PassId: 57,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 58,
      PassId: 58,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 59,
      PassId: 59,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 60,
      PassId: 60,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 61,
      PassId: 61,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 62,
      PassId: 62,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 63,
      PassId: 63,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 64,
      PassId: 64,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 65,
      PassId: 65,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_4" ]
    }, {
      OrderId: 66,
      PassId: 66,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_7" ]
    }, {
      OrderId: 67,
      PassId: 67,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_10" ]
    }, {
      OrderId: 68,
      PassId: 68,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_13" ]
    }, {
      OrderId: 69,
      PassId: 69,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_16" ]
    }, {
      OrderId: 70,
      PassId: 70,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_3" ]
    }, {
      OrderId: 71,
      PassId: 71,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_6" ]
    }, {
      OrderId: 72,
      PassId: 72,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_9" ]
    }, {
      OrderId: 73,
      PassId: 73,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_12" ]
    }, {
      OrderId: 74,
      PassId: 74,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_15" ]
    }, {
      OrderId: 75,
      PassId: 75,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_1", "9x8_9_2" ]
    }, {
      OrderId: 76,
      PassId: 76,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_8", "9x8_9_5" ]
    }, {
      OrderId: 77,
      PassId: 77,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_15", "9x8_9_8" ]
    }, {
      OrderId: 78,
      PassId: 78,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_4" ]
    }, {
      OrderId: 79,
      PassId: 79,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_7" ]
    }, {
      OrderId: 80,
      PassId: 80,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_8", "9x8_9_10" ]
    }, {
      OrderId: 81,
      PassId: 81,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_13" ]
    }, {
      OrderId: 82,
      PassId: 82,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_16" ]
    }, {
      OrderId: 83,
      PassId: 83,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_3" ]
    }, {
      OrderId: 84,
      PassId: 84,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_4", "9x8_9_6" ]
    }, {
      OrderId: 85,
      PassId: 85,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_9" ]
    }, {
      OrderId: 86,
      PassId: 86,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_12" ]
    }, {
      OrderId: 87,
      PassId: 87,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_15" ]
    }, {
      OrderId: 88,
      PassId: 88,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_16", "9x8_9_2" ]
    }, {
      OrderId: 89,
      PassId: 89,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_5" ]
    }, {
      OrderId: 90,
      PassId: 90,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_8" ]
    }, {
      OrderId: 91,
      PassId: 91,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 92,
      PassId: 92,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 93,
      PassId: 93,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 94,
      PassId: 94,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 95,
      PassId: 95,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 96,
      PassId: 96,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 97,
      PassId: 97,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 98,
      PassId: 98,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 99,
      PassId: 99,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 100,
      PassId: 100,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 101,
      PassId: 101,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 102,
      PassId: 102,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 103,
      PassId: 103,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 104,
      PassId: 104,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_2" ]
    }, {
      OrderId: 105,
      PassId: 105,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_6" ]
    }, {
      OrderId: 106,
      PassId: 106,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_10" ]
    }, {
      OrderId: 107,
      PassId: 107,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_14" ]
    }, {
      OrderId: 108,
      PassId: 108,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 109,
      PassId: 109,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 110,
      PassId: 110,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 111,
      PassId: 111,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 112,
      PassId: 112,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_3" ]
    }, {
      OrderId: 113,
      PassId: 113,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_7" ]
    }, {
      OrderId: 114,
      PassId: 114,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_11" ]
    }, {
      OrderId: 115,
      PassId: 115,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_15" ]
    }, {
      OrderId: 116,
      PassId: 116,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_4" ]
    }, {
      OrderId: 117,
      PassId: 117,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_8" ]
    }, {
      OrderId: 118,
      PassId: 118,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_12" ]
    }, {
      OrderId: 119,
      PassId: 119,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_16" ]
    }, {
      OrderId: 120,
      PassId: 120,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_2" ]
    }, {
      OrderId: 121,
      PassId: 121,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_6" ]
    }, {
      OrderId: 122,
      PassId: 122,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_10" ]
    }, {
      OrderId: 123,
      PassId: 123,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_14" ]
    }, {
      OrderId: 124,
      PassId: 124,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 125,
      PassId: 125,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 126,
      PassId: 126,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 127,
      PassId: 127,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 128,
      PassId: 128,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_3" ]
    }, {
      OrderId: 129,
      PassId: 129,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_7" ]
    }, {
      OrderId: 130,
      PassId: 130,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_11" ]
    }, {
      OrderId: 131,
      PassId: 131,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_15" ]
    }, {
      OrderId: 132,
      PassId: 132,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_4" ]
    }, {
      OrderId: 133,
      PassId: 133,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_8" ]
    }, {
      OrderId: 134,
      PassId: 134,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_12" ]
    }, {
      OrderId: 135,
      PassId: 135,
      PassType: 1,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_16" ]
    }, {
      OrderId: 136,
      PassId: 136,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_1", "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 137,
      PassId: 137,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_3", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 138,
      PassId: 138,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_5", "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 139,
      PassId: 139,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_7", "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 140,
      PassId: 140,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_9", "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 141,
      PassId: 141,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_11", "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 142,
      PassId: 142,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_13", "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 143,
      PassId: 143,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_15", "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 144,
      PassId: 144,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_17", "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 145,
      PassId: 145,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_19", "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 146,
      PassId: 146,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_21", "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 147,
      PassId: 147,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_23", "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 148,
      PassId: 148,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 149,
      PassId: 149,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 150,
      PassId: 150,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 151,
      PassId: 151,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 152,
      PassId: 152,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 153,
      PassId: 153,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 154,
      PassId: 154,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 155,
      PassId: 155,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 156,
      PassId: 156,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 157,
      PassId: 157,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 158,
      PassId: 158,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 159,
      PassId: 159,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 160,
      PassId: 160,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 161,
      PassId: 161,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 162,
      PassId: 162,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 163,
      PassId: 163,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 164,
      PassId: 164,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 165,
      PassId: 165,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4", "9x8_9_5" ]
    }, {
      OrderId: 166,
      PassId: 166,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8", "9x8_9_9" ]
    }, {
      OrderId: 167,
      PassId: 167,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12", "9x8_9_13" ]
    }, {
      OrderId: 168,
      PassId: 168,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16", "9x8_9_1" ]
    }, {
      OrderId: 169,
      PassId: 169,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_1", "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 170,
      PassId: 170,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_3", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 171,
      PassId: 171,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_5", "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 172,
      PassId: 172,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_7", "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 173,
      PassId: 173,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_9", "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 174,
      PassId: 174,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_11", "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 175,
      PassId: 175,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_13", "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 176,
      PassId: 176,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_15", "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 177,
      PassId: 177,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_17", "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 178,
      PassId: 178,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_19", "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 179,
      PassId: 179,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_21", "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 180,
      PassId: 180,
      PassType: 1,
      Step: 3,
      PrefabId: [ "9x8_0_23", "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 181,
      PassId: 181,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 182,
      PassId: 182,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 183,
      PassId: 183,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 184,
      PassId: 184,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 185,
      PassId: 185,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 186,
      PassId: 186,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 187,
      PassId: 187,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 188,
      PassId: 188,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 189,
      PassId: 189,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 190,
      PassId: 190,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 191,
      PassId: 191,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 192,
      PassId: 192,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 193,
      PassId: 193,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 194,
      PassId: 194,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 195,
      PassId: 195,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 196,
      PassId: 196,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 197,
      PassId: 197,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 198,
      PassId: 198,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4", "9x8_9_5" ]
    }, {
      OrderId: 199,
      PassId: 199,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8", "9x8_9_9" ]
    }, {
      OrderId: 200,
      PassId: 200,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12", "9x8_9_13" ]
    }, {
      OrderId: 201,
      PassId: 201,
      PassType: 1,
      Step: 5,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16", "9x8_9_1" ]
    }, {
      OrderId: 202,
      PassId: 202,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 203,
      PassId: 203,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 204,
      PassId: 204,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 205,
      PassId: 205,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 206,
      PassId: 206,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 207,
      PassId: 207,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 208,
      PassId: 208,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 209,
      PassId: 209,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 210,
      PassId: 210,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 211,
      PassId: 211,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 212,
      PassId: 212,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 213,
      PassId: 213,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 214,
      PassId: 214,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 215,
      PassId: 215,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 216,
      PassId: 216,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 217,
      PassId: 217,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 218,
      PassId: 218,
      PassType: 1,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 219,
      PassId: 219,
      PassType: 1,
      Step: 4,
      PrefabId: [ "11x8_9_1", "11x8_9_2", "11x8_9_3", "11x8_9_4" ]
    }, {
      OrderId: 220,
      PassId: 220,
      PassType: 1,
      Step: 4,
      PrefabId: [ "11x8_9_5", "11x8_9_6", "11x8_9_7", "11x8_9_8" ]
    }, {
      OrderId: 221,
      PassId: 1,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_4" ]
    }, {
      OrderId: 222,
      PassId: 2,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_5" ]
    }, {
      OrderId: 223,
      PassId: 3,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_1" ]
    }, {
      OrderId: 224,
      PassId: 4,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_3" ]
    }, {
      OrderId: 225,
      PassId: 5,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_1" ]
    }, {
      OrderId: 226,
      PassId: 6,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_2" ]
    }, {
      OrderId: 227,
      PassId: 7,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_2" ]
    }, {
      OrderId: 228,
      PassId: 8,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_6" ]
    }, {
      OrderId: 229,
      PassId: 9,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_3" ]
    }, {
      OrderId: 230,
      PassId: 10,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_7" ]
    }, {
      OrderId: 231,
      PassId: 11,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_8" ]
    }, {
      OrderId: 232,
      PassId: 12,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_4" ]
    }, {
      OrderId: 233,
      PassId: 13,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_9" ]
    }, {
      OrderId: 234,
      PassId: 14,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_10" ]
    }, {
      OrderId: 235,
      PassId: 15,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_5" ]
    }, {
      OrderId: 236,
      PassId: 16,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_11" ]
    }, {
      OrderId: 237,
      PassId: 17,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_12" ]
    }, {
      OrderId: 238,
      PassId: 18,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_6" ]
    }, {
      OrderId: 239,
      PassId: 19,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_13" ]
    }, {
      OrderId: 240,
      PassId: 20,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_14" ]
    }, {
      OrderId: 241,
      PassId: 21,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_7" ]
    }, {
      OrderId: 242,
      PassId: 22,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_15" ]
    }, {
      OrderId: 243,
      PassId: 23,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_16" ]
    }, {
      OrderId: 244,
      PassId: 24,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_8" ]
    }, {
      OrderId: 245,
      PassId: 25,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_17" ]
    }, {
      OrderId: 246,
      PassId: 26,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_18" ]
    }, {
      OrderId: 247,
      PassId: 27,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_9" ]
    }, {
      OrderId: 248,
      PassId: 28,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_19" ]
    }, {
      OrderId: 249,
      PassId: 29,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_20" ]
    }, {
      OrderId: 250,
      PassId: 30,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_10" ]
    }, {
      OrderId: 251,
      PassId: 31,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_21" ]
    }, {
      OrderId: 252,
      PassId: 32,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_22" ]
    }, {
      OrderId: 253,
      PassId: 33,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_11" ]
    }, {
      OrderId: 254,
      PassId: 34,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_23" ]
    }, {
      OrderId: 255,
      PassId: 35,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_0_24" ]
    }, {
      OrderId: 256,
      PassId: 36,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_12" ]
    }, {
      OrderId: 257,
      PassId: 37,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_13" ]
    }, {
      OrderId: 258,
      PassId: 38,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_14" ]
    }, {
      OrderId: 259,
      PassId: 39,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_15" ]
    }, {
      OrderId: 260,
      PassId: 40,
      PassType: 2,
      Step: 1,
      PrefabId: [ "9x8_9_16" ]
    }, {
      OrderId: 261,
      PassId: 41,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_1", "9x8_9_1" ]
    }, {
      OrderId: 262,
      PassId: 42,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_3", "9x8_9_2" ]
    }, {
      OrderId: 263,
      PassId: 43,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 264,
      PassId: 44,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 265,
      PassId: 45,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_5", "9x8_9_3" ]
    }, {
      OrderId: 266,
      PassId: 46,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_4" ]
    }, {
      OrderId: 267,
      PassId: 47,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_5" ]
    }, {
      OrderId: 268,
      PassId: 48,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_6" ]
    }, {
      OrderId: 269,
      PassId: 49,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_13", "9x8_9_7" ]
    }, {
      OrderId: 270,
      PassId: 50,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_15", "9x8_9_8" ]
    }, {
      OrderId: 271,
      PassId: 51,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_9" ]
    }, {
      OrderId: 272,
      PassId: 52,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 273,
      PassId: 53,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_11" ]
    }, {
      OrderId: 274,
      PassId: 54,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_23", "9x8_9_12" ]
    }, {
      OrderId: 275,
      PassId: 55,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 276,
      PassId: 56,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 277,
      PassId: 57,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 278,
      PassId: 58,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 279,
      PassId: 59,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 280,
      PassId: 60,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 281,
      PassId: 61,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 282,
      PassId: 62,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 283,
      PassId: 63,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 284,
      PassId: 64,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 285,
      PassId: 65,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_4" ]
    }, {
      OrderId: 286,
      PassId: 66,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_7" ]
    }, {
      OrderId: 287,
      PassId: 67,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_10" ]
    }, {
      OrderId: 288,
      PassId: 68,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_13" ]
    }, {
      OrderId: 289,
      PassId: 69,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_16" ]
    }, {
      OrderId: 290,
      PassId: 70,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_3" ]
    }, {
      OrderId: 291,
      PassId: 71,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_6" ]
    }, {
      OrderId: 292,
      PassId: 72,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_9" ]
    }, {
      OrderId: 293,
      PassId: 73,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_12" ]
    }, {
      OrderId: 294,
      PassId: 74,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_15" ]
    }, {
      OrderId: 295,
      PassId: 75,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_1", "9x8_9_2" ]
    }, {
      OrderId: 296,
      PassId: 76,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_8", "9x8_9_5" ]
    }, {
      OrderId: 297,
      PassId: 77,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_15", "9x8_9_8" ]
    }, {
      OrderId: 298,
      PassId: 78,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_4" ]
    }, {
      OrderId: 299,
      PassId: 79,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_7" ]
    }, {
      OrderId: 300,
      PassId: 80,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_8", "9x8_9_10" ]
    }, {
      OrderId: 301,
      PassId: 81,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_13" ]
    }, {
      OrderId: 302,
      PassId: 82,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_16" ]
    }, {
      OrderId: 303,
      PassId: 83,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_3" ]
    }, {
      OrderId: 304,
      PassId: 84,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_4", "9x8_9_6" ]
    }, {
      OrderId: 305,
      PassId: 85,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_9" ]
    }, {
      OrderId: 306,
      PassId: 86,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_12" ]
    }, {
      OrderId: 307,
      PassId: 87,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_15" ]
    }, {
      OrderId: 308,
      PassId: 88,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_16", "9x8_9_2" ]
    }, {
      OrderId: 309,
      PassId: 89,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_5" ]
    }, {
      OrderId: 310,
      PassId: 90,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_8" ]
    }, {
      OrderId: 311,
      PassId: 91,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 312,
      PassId: 92,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 313,
      PassId: 93,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 314,
      PassId: 94,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 315,
      PassId: 95,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 316,
      PassId: 96,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 317,
      PassId: 97,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 318,
      PassId: 98,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 319,
      PassId: 99,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 320,
      PassId: 100,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 321,
      PassId: 101,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 322,
      PassId: 102,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 323,
      PassId: 103,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 324,
      PassId: 104,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_2" ]
    }, {
      OrderId: 325,
      PassId: 105,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_6" ]
    }, {
      OrderId: 326,
      PassId: 106,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_10" ]
    }, {
      OrderId: 327,
      PassId: 107,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_14" ]
    }, {
      OrderId: 328,
      PassId: 108,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 329,
      PassId: 109,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 330,
      PassId: 110,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 331,
      PassId: 111,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 332,
      PassId: 112,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_3" ]
    }, {
      OrderId: 333,
      PassId: 113,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_7" ]
    }, {
      OrderId: 334,
      PassId: 114,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_11" ]
    }, {
      OrderId: 335,
      PassId: 115,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_15" ]
    }, {
      OrderId: 336,
      PassId: 116,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_4" ]
    }, {
      OrderId: 337,
      PassId: 117,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_8" ]
    }, {
      OrderId: 338,
      PassId: 118,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_12" ]
    }, {
      OrderId: 339,
      PassId: 119,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_16" ]
    }, {
      OrderId: 340,
      PassId: 120,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_2" ]
    }, {
      OrderId: 341,
      PassId: 121,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_6" ]
    }, {
      OrderId: 342,
      PassId: 122,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_10" ]
    }, {
      OrderId: 343,
      PassId: 123,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_14" ]
    }, {
      OrderId: 344,
      PassId: 124,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 345,
      PassId: 125,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 346,
      PassId: 126,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 347,
      PassId: 127,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 348,
      PassId: 128,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_3" ]
    }, {
      OrderId: 349,
      PassId: 129,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_7" ]
    }, {
      OrderId: 350,
      PassId: 130,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_11" ]
    }, {
      OrderId: 351,
      PassId: 131,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_15" ]
    }, {
      OrderId: 352,
      PassId: 132,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_4" ]
    }, {
      OrderId: 353,
      PassId: 133,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_8" ]
    }, {
      OrderId: 354,
      PassId: 134,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_12" ]
    }, {
      OrderId: 355,
      PassId: 135,
      PassType: 2,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_16" ]
    }, {
      OrderId: 356,
      PassId: 136,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_1", "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 357,
      PassId: 137,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_3", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 358,
      PassId: 138,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_5", "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 359,
      PassId: 139,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_7", "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 360,
      PassId: 140,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_9", "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 361,
      PassId: 141,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_11", "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 362,
      PassId: 142,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_13", "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 363,
      PassId: 143,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_15", "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 364,
      PassId: 144,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_17", "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 365,
      PassId: 145,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_19", "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 366,
      PassId: 146,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_21", "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 367,
      PassId: 147,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_23", "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 368,
      PassId: 148,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 369,
      PassId: 149,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 370,
      PassId: 150,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 371,
      PassId: 151,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 372,
      PassId: 152,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 373,
      PassId: 153,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 374,
      PassId: 154,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 375,
      PassId: 155,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 376,
      PassId: 156,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 377,
      PassId: 157,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 378,
      PassId: 158,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 379,
      PassId: 159,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 380,
      PassId: 160,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 381,
      PassId: 161,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 382,
      PassId: 162,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 383,
      PassId: 163,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 384,
      PassId: 164,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 385,
      PassId: 165,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4", "9x8_9_5" ]
    }, {
      OrderId: 386,
      PassId: 166,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8", "9x8_9_9" ]
    }, {
      OrderId: 387,
      PassId: 167,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12", "9x8_9_13" ]
    }, {
      OrderId: 388,
      PassId: 168,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16", "9x8_9_1" ]
    }, {
      OrderId: 389,
      PassId: 169,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_1", "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 390,
      PassId: 170,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_3", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 391,
      PassId: 171,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_5", "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 392,
      PassId: 172,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_7", "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 393,
      PassId: 173,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_9", "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 394,
      PassId: 174,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_11", "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 395,
      PassId: 175,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_13", "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 396,
      PassId: 176,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_15", "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 397,
      PassId: 177,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_17", "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 398,
      PassId: 178,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_19", "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 399,
      PassId: 179,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_21", "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 400,
      PassId: 180,
      PassType: 2,
      Step: 3,
      PrefabId: [ "9x8_0_23", "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 401,
      PassId: 181,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 402,
      PassId: 182,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 403,
      PassId: 183,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 404,
      PassId: 184,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 405,
      PassId: 185,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 406,
      PassId: 186,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 407,
      PassId: 187,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 408,
      PassId: 188,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 409,
      PassId: 189,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 410,
      PassId: 190,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 411,
      PassId: 191,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 412,
      PassId: 192,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 413,
      PassId: 193,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 414,
      PassId: 194,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 415,
      PassId: 195,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 416,
      PassId: 196,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 417,
      PassId: 197,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 418,
      PassId: 198,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4", "9x8_9_5" ]
    }, {
      OrderId: 419,
      PassId: 199,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8", "9x8_9_9" ]
    }, {
      OrderId: 420,
      PassId: 200,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12", "9x8_9_13" ]
    }, {
      OrderId: 421,
      PassId: 201,
      PassType: 2,
      Step: 5,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16", "9x8_9_1" ]
    }, {
      OrderId: 422,
      PassId: 202,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 423,
      PassId: 203,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 424,
      PassId: 204,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 425,
      PassId: 205,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 426,
      PassId: 206,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 427,
      PassId: 207,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 428,
      PassId: 208,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 429,
      PassId: 209,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 430,
      PassId: 210,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 431,
      PassId: 211,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 432,
      PassId: 212,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 433,
      PassId: 213,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 434,
      PassId: 214,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 435,
      PassId: 215,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 436,
      PassId: 216,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 437,
      PassId: 217,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 438,
      PassId: 218,
      PassType: 2,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 439,
      PassId: 219,
      PassType: 2,
      Step: 4,
      PrefabId: [ "11x8_9_1", "11x8_9_2", "11x8_9_3", "11x8_9_4" ]
    }, {
      OrderId: 440,
      PassId: 220,
      PassType: 2,
      Step: 4,
      PrefabId: [ "11x8_9_5", "11x8_9_6", "11x8_9_7", "11x8_9_8" ]
    }, {
      OrderId: 441,
      PassId: 1,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_3" ]
    }, {
      OrderId: 442,
      PassId: 2,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_2" ]
    }, {
      OrderId: 443,
      PassId: 3,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_1" ]
    }, {
      OrderId: 444,
      PassId: 4,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_5" ]
    }, {
      OrderId: 445,
      PassId: 5,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_6" ]
    }, {
      OrderId: 446,
      PassId: 6,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_2" ]
    }, {
      OrderId: 447,
      PassId: 7,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_1" ]
    }, {
      OrderId: 448,
      PassId: 8,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_4" ]
    }, {
      OrderId: 449,
      PassId: 9,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_3" ]
    }, {
      OrderId: 450,
      PassId: 10,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_7" ]
    }, {
      OrderId: 451,
      PassId: 11,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_8" ]
    }, {
      OrderId: 452,
      PassId: 12,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_4" ]
    }, {
      OrderId: 453,
      PassId: 13,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_9" ]
    }, {
      OrderId: 454,
      PassId: 14,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_10" ]
    }, {
      OrderId: 455,
      PassId: 15,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_5" ]
    }, {
      OrderId: 456,
      PassId: 16,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_11" ]
    }, {
      OrderId: 457,
      PassId: 17,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_12" ]
    }, {
      OrderId: 458,
      PassId: 18,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_6" ]
    }, {
      OrderId: 459,
      PassId: 19,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_13" ]
    }, {
      OrderId: 460,
      PassId: 20,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_14" ]
    }, {
      OrderId: 461,
      PassId: 21,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_7" ]
    }, {
      OrderId: 462,
      PassId: 22,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_15" ]
    }, {
      OrderId: 463,
      PassId: 23,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_16" ]
    }, {
      OrderId: 464,
      PassId: 24,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_8" ]
    }, {
      OrderId: 465,
      PassId: 25,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_17" ]
    }, {
      OrderId: 466,
      PassId: 26,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_18" ]
    }, {
      OrderId: 467,
      PassId: 27,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_9" ]
    }, {
      OrderId: 468,
      PassId: 28,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_19" ]
    }, {
      OrderId: 469,
      PassId: 29,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_20" ]
    }, {
      OrderId: 470,
      PassId: 30,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_10" ]
    }, {
      OrderId: 471,
      PassId: 31,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_21" ]
    }, {
      OrderId: 472,
      PassId: 32,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_22" ]
    }, {
      OrderId: 473,
      PassId: 33,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_11" ]
    }, {
      OrderId: 474,
      PassId: 34,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_23" ]
    }, {
      OrderId: 475,
      PassId: 35,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_0_24" ]
    }, {
      OrderId: 476,
      PassId: 36,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_12" ]
    }, {
      OrderId: 477,
      PassId: 37,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_13" ]
    }, {
      OrderId: 478,
      PassId: 38,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_14" ]
    }, {
      OrderId: 479,
      PassId: 39,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_15" ]
    }, {
      OrderId: 480,
      PassId: 40,
      PassType: 3,
      Step: 1,
      PrefabId: [ "9x8_9_16" ]
    }, {
      OrderId: 481,
      PassId: 41,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_1", "9x8_9_1" ]
    }, {
      OrderId: 482,
      PassId: 42,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_3", "9x8_9_2" ]
    }, {
      OrderId: 483,
      PassId: 43,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 484,
      PassId: 44,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 485,
      PassId: 45,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_5", "9x8_9_3" ]
    }, {
      OrderId: 486,
      PassId: 46,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_4" ]
    }, {
      OrderId: 487,
      PassId: 47,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_5" ]
    }, {
      OrderId: 488,
      PassId: 48,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_6" ]
    }, {
      OrderId: 489,
      PassId: 49,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_13", "9x8_9_7" ]
    }, {
      OrderId: 490,
      PassId: 50,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_15", "9x8_9_8" ]
    }, {
      OrderId: 491,
      PassId: 51,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_9" ]
    }, {
      OrderId: 492,
      PassId: 52,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 493,
      PassId: 53,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_11" ]
    }, {
      OrderId: 494,
      PassId: 54,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_23", "9x8_9_12" ]
    }, {
      OrderId: 495,
      PassId: 55,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 496,
      PassId: 56,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 497,
      PassId: 57,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 498,
      PassId: 58,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 499,
      PassId: 59,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 500,
      PassId: 60,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 501,
      PassId: 61,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 502,
      PassId: 62,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 503,
      PassId: 63,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 504,
      PassId: 64,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 505,
      PassId: 65,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_4" ]
    }, {
      OrderId: 506,
      PassId: 66,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_7" ]
    }, {
      OrderId: 507,
      PassId: 67,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_10" ]
    }, {
      OrderId: 508,
      PassId: 68,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_13" ]
    }, {
      OrderId: 509,
      PassId: 69,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_16" ]
    }, {
      OrderId: 510,
      PassId: 70,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_3" ]
    }, {
      OrderId: 511,
      PassId: 71,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_6" ]
    }, {
      OrderId: 512,
      PassId: 72,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_9" ]
    }, {
      OrderId: 513,
      PassId: 73,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_12" ]
    }, {
      OrderId: 514,
      PassId: 74,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_15" ]
    }, {
      OrderId: 515,
      PassId: 75,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_1", "9x8_9_2" ]
    }, {
      OrderId: 516,
      PassId: 76,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_8", "9x8_9_5" ]
    }, {
      OrderId: 517,
      PassId: 77,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_15", "9x8_9_8" ]
    }, {
      OrderId: 518,
      PassId: 78,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_4" ]
    }, {
      OrderId: 519,
      PassId: 79,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_7" ]
    }, {
      OrderId: 520,
      PassId: 80,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_8", "9x8_9_10" ]
    }, {
      OrderId: 521,
      PassId: 81,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_13" ]
    }, {
      OrderId: 522,
      PassId: 82,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_16" ]
    }, {
      OrderId: 523,
      PassId: 83,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_3" ]
    }, {
      OrderId: 524,
      PassId: 84,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_4", "9x8_9_6" ]
    }, {
      OrderId: 525,
      PassId: 85,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_9" ]
    }, {
      OrderId: 526,
      PassId: 86,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_12" ]
    }, {
      OrderId: 527,
      PassId: 87,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_15" ]
    }, {
      OrderId: 528,
      PassId: 88,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_16", "9x8_9_2" ]
    }, {
      OrderId: 529,
      PassId: 89,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_5" ]
    }, {
      OrderId: 530,
      PassId: 90,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_8" ]
    }, {
      OrderId: 531,
      PassId: 91,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 532,
      PassId: 92,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 533,
      PassId: 93,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 534,
      PassId: 94,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 535,
      PassId: 95,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 536,
      PassId: 96,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 537,
      PassId: 97,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 538,
      PassId: 98,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 539,
      PassId: 99,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 540,
      PassId: 100,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 541,
      PassId: 101,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 542,
      PassId: 102,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 543,
      PassId: 103,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 544,
      PassId: 104,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_2" ]
    }, {
      OrderId: 545,
      PassId: 105,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_6" ]
    }, {
      OrderId: 546,
      PassId: 106,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_10" ]
    }, {
      OrderId: 547,
      PassId: 107,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_14" ]
    }, {
      OrderId: 548,
      PassId: 108,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 549,
      PassId: 109,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 550,
      PassId: 110,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 551,
      PassId: 111,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 552,
      PassId: 112,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_3" ]
    }, {
      OrderId: 553,
      PassId: 113,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_7" ]
    }, {
      OrderId: 554,
      PassId: 114,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_11" ]
    }, {
      OrderId: 555,
      PassId: 115,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_15" ]
    }, {
      OrderId: 556,
      PassId: 116,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_4" ]
    }, {
      OrderId: 557,
      PassId: 117,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_8" ]
    }, {
      OrderId: 558,
      PassId: 118,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_12" ]
    }, {
      OrderId: 559,
      PassId: 119,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_16" ]
    }, {
      OrderId: 560,
      PassId: 120,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_2" ]
    }, {
      OrderId: 561,
      PassId: 121,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_6" ]
    }, {
      OrderId: 562,
      PassId: 122,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_10" ]
    }, {
      OrderId: 563,
      PassId: 123,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_14" ]
    }, {
      OrderId: 564,
      PassId: 124,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 565,
      PassId: 125,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 566,
      PassId: 126,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 567,
      PassId: 127,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 568,
      PassId: 128,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_2", "9x8_9_3" ]
    }, {
      OrderId: 569,
      PassId: 129,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_6", "9x8_9_7" ]
    }, {
      OrderId: 570,
      PassId: 130,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_10", "9x8_9_11" ]
    }, {
      OrderId: 571,
      PassId: 131,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_14", "9x8_9_15" ]
    }, {
      OrderId: 572,
      PassId: 132,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_1", "9x8_9_4" ]
    }, {
      OrderId: 573,
      PassId: 133,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_5", "9x8_9_8" ]
    }, {
      OrderId: 574,
      PassId: 134,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_9", "9x8_9_12" ]
    }, {
      OrderId: 575,
      PassId: 135,
      PassType: 3,
      Step: 2,
      PrefabId: [ "9x8_9_13", "9x8_9_16" ]
    }, {
      OrderId: 576,
      PassId: 136,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_1", "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 577,
      PassId: 137,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_3", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 578,
      PassId: 138,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_5", "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 579,
      PassId: 139,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_7", "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 580,
      PassId: 140,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_9", "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 581,
      PassId: 141,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_11", "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 582,
      PassId: 142,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_13", "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 583,
      PassId: 143,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_15", "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 584,
      PassId: 144,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_17", "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 585,
      PassId: 145,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_19", "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 586,
      PassId: 146,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_21", "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 587,
      PassId: 147,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_23", "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 588,
      PassId: 148,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 589,
      PassId: 149,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 590,
      PassId: 150,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 591,
      PassId: 151,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 592,
      PassId: 152,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 593,
      PassId: 153,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 594,
      PassId: 154,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 595,
      PassId: 155,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 596,
      PassId: 156,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 597,
      PassId: 157,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 598,
      PassId: 158,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 599,
      PassId: 159,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 600,
      PassId: 160,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 601,
      PassId: 161,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 602,
      PassId: 162,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 603,
      PassId: 163,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 604,
      PassId: 164,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 605,
      PassId: 165,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4", "9x8_9_5" ]
    }, {
      OrderId: 606,
      PassId: 166,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8", "9x8_9_9" ]
    }, {
      OrderId: 607,
      PassId: 167,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12", "9x8_9_13" ]
    }, {
      OrderId: 608,
      PassId: 168,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16", "9x8_9_1" ]
    }, {
      OrderId: 609,
      PassId: 169,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_1", "9x8_0_2", "9x8_9_1" ]
    }, {
      OrderId: 610,
      PassId: 170,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_3", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 611,
      PassId: 171,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_5", "9x8_0_6", "9x8_9_3" ]
    }, {
      OrderId: 612,
      PassId: 172,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_7", "9x8_0_8", "9x8_9_4" ]
    }, {
      OrderId: 613,
      PassId: 173,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_9", "9x8_0_10", "9x8_9_5" ]
    }, {
      OrderId: 614,
      PassId: 174,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_11", "9x8_0_12", "9x8_9_6" ]
    }, {
      OrderId: 615,
      PassId: 175,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_13", "9x8_0_14", "9x8_9_7" ]
    }, {
      OrderId: 616,
      PassId: 176,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_15", "9x8_0_16", "9x8_9_8" ]
    }, {
      OrderId: 617,
      PassId: 177,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_17", "9x8_0_18", "9x8_9_9" ]
    }, {
      OrderId: 618,
      PassId: 178,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_19", "9x8_0_20", "9x8_9_10" ]
    }, {
      OrderId: 619,
      PassId: 179,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_21", "9x8_0_22", "9x8_9_11" ]
    }, {
      OrderId: 620,
      PassId: 180,
      PassType: 3,
      Step: 3,
      PrefabId: [ "9x8_0_23", "9x8_0_24", "9x8_9_12" ]
    }, {
      OrderId: 621,
      PassId: 181,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 622,
      PassId: 182,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 623,
      PassId: 183,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 624,
      PassId: 184,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 625,
      PassId: 185,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 626,
      PassId: 186,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 627,
      PassId: 187,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 628,
      PassId: 188,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 629,
      PassId: 189,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 630,
      PassId: 190,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 631,
      PassId: 191,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 632,
      PassId: 192,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 633,
      PassId: 193,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 634,
      PassId: 194,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 635,
      PassId: 195,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 636,
      PassId: 196,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 637,
      PassId: 197,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 638,
      PassId: 198,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4", "9x8_9_5" ]
    }, {
      OrderId: 639,
      PassId: 199,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8", "9x8_9_9" ]
    }, {
      OrderId: 640,
      PassId: 200,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12", "9x8_9_13" ]
    }, {
      OrderId: 641,
      PassId: 201,
      PassType: 3,
      Step: 5,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16", "9x8_9_1" ]
    }, {
      OrderId: 642,
      PassId: 202,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_2", "9x8_9_2", "9x8_0_5", "9x8_9_4" ]
    }, {
      OrderId: 643,
      PassId: 203,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_9", "9x8_9_5", "9x8_0_12", "9x8_9_7" ]
    }, {
      OrderId: 644,
      PassId: 204,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_17", "9x8_9_8", "9x8_0_19", "9x8_9_10" ]
    }, {
      OrderId: 645,
      PassId: 205,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_24", "9x8_9_11", "9x8_0_2", "9x8_9_13" ]
    }, {
      OrderId: 646,
      PassId: 206,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_7", "9x8_9_14", "9x8_0_9", "9x8_9_16" ]
    }, {
      OrderId: 647,
      PassId: 207,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_14", "9x8_9_1", "9x8_0_17", "9x8_9_3" ]
    }, {
      OrderId: 648,
      PassId: 208,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_21", "9x8_9_4", "9x8_0_24", "9x8_9_6" ]
    }, {
      OrderId: 649,
      PassId: 209,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_4", "9x8_9_7", "9x8_0_7", "9x8_9_9" ]
    }, {
      OrderId: 650,
      PassId: 210,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_11", "9x8_9_10", "9x8_0_14", "9x8_9_12" ]
    }, {
      OrderId: 651,
      PassId: 211,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_18", "9x8_9_13", "9x8_0_21", "9x8_9_15" ]
    }, {
      OrderId: 652,
      PassId: 212,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_1", "9x8_9_16", "9x8_0_4", "9x8_9_2" ]
    }, {
      OrderId: 653,
      PassId: 213,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_8", "9x8_9_3", "9x8_0_11", "9x8_9_5" ]
    }, {
      OrderId: 654,
      PassId: 214,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_0_15", "9x8_9_6", "9x8_0_18", "9x8_9_8" ]
    }, {
      OrderId: 655,
      PassId: 215,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_1", "9x8_9_2", "9x8_9_3", "9x8_9_4" ]
    }, {
      OrderId: 656,
      PassId: 216,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_5", "9x8_9_6", "9x8_9_7", "9x8_9_8" ]
    }, {
      OrderId: 657,
      PassId: 217,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_9", "9x8_9_10", "9x8_9_11", "9x8_9_12" ]
    }, {
      OrderId: 658,
      PassId: 218,
      PassType: 3,
      Step: 4,
      PrefabId: [ "9x8_9_13", "9x8_9_14", "9x8_9_15", "9x8_9_16" ]
    }, {
      OrderId: 659,
      PassId: 219,
      PassType: 3,
      Step: 4,
      PrefabId: [ "11x8_9_1", "11x8_9_2", "11x8_9_3", "11x8_9_4" ]
    }, {
      OrderId: 660,
      PassId: 220,
      PassType: 3,
      Step: 4,
      PrefabId: [ "11x8_9_5", "11x8_9_6", "11x8_9_7", "11x8_9_8" ]
    } ];
    exports.PassConfig = PassConfig;
    cc._RF.pop();
  }, {} ],
  PrefabDefine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe78aayc2NHCLiDiZYPMkoM", "PrefabDefine");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PREFAB_URL = void 0;
    var PREFAB_URL;
    (function(PREFAB_URL) {
      PREFAB_URL["DGame"] = "prefab/game/DGame";
      PREFAB_URL["Fruit"] = "prefab/game/Fruit";
      PREFAB_URL["Line"] = "prefab/game/Line";
      PREFAB_URL["LlkMap"] = "prefab/game/LlkMap";
      PREFAB_URL["Star"] = "prefab/game/Star";
      PREFAB_URL["biaozhun"] = "prefab/jichuguan/biaozhun";
      PREFAB_URL["biaozhun2"] = "prefab/jichuguan/biaozhun2";
      PREFAB_URL["biaozhun3"] = "prefab/jichuguan/biaozhun3";
      PREFAB_URL["DGameLevel"] = "prefab/ui/DGameLevel";
      PREFAB_URL["DHome"] = "prefab/ui/DHome";
      PREFAB_URL["DLose"] = "prefab/ui/DLose";
      PREFAB_URL["DSetting"] = "prefab/ui/DSetting";
      PREFAB_URL["DTips"] = "prefab/ui/DTips";
      PREFAB_URL["DWin"] = "prefab/ui/DWin";
      PREFAB_URL["GameLevelItem"] = "prefab/ui/GameLevelItem";
    })(PREFAB_URL = exports.PREFAB_URL || (exports.PREFAB_URL = {}));
    cc._RF.pop();
  }, {} ],
  PrefabPool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10eeb7LC6FDsa7FeCRU5R7R", "PrefabPool");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Util_1 = require("./Util");
    var prefabMap = {};
    function getPrefab(url) {
      return __awaiter(this, void 0, void 0, function() {
        var prefab;
        return __generator(this, function(_a) {
          switch (_a.label) {
           case 0:
            prefab = prefabMap[url];
            if (!!prefab) return [ 3, 2 ];
            return [ 4, Util_1.default.promisifyLoadRes(url, cc.Prefab) ];

           case 1:
            prefab = _a.sent();
            prefabMap[url] = prefab;
            _a.label = 2;

           case 2:
            return [ 2, prefab ];
          }
        });
      });
    }
    function clearAll() {
      Object.keys(prefabMap).forEach(function(e) {
        cc.loader.releaseRes(e, cc.Prefab);
        delete prefabMap[e];
      });
    }
    exports.default = {
      getPrefab: getPrefab,
      clearAll: clearAll
    };
    cc._RF.pop();
  }, {
    "./Util": "Util"
  } ],
  ReadyGoAn: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "52ae9HaTyNDcIrzUm2Q3A/d", "ReadyGoAn");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AudioNode_1 = require("../ui/AudioNode");
    var LlkMap_1 = require("./LlkMap");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ReadyGoAn = function(_super) {
      __extends(ReadyGoAn, _super);
      function ReadyGoAn() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      ReadyGoAn.prototype.playSound = function(effectName) {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL[effectName]);
      };
      ReadyGoAn.prototype.changeGameState = function() {
        LlkMap_1.default.instance.showMap();
      };
      ReadyGoAn = __decorate([ ccclass ], ReadyGoAn);
      return ReadyGoAn;
    }(cc.Component);
    exports.default = ReadyGoAn;
    cc._RF.pop();
  }, {
    "../lib/AudioPool": "AudioPool",
    "../ui/AudioNode": "AudioNode",
    "./LlkMap": "LlkMap"
  } ],
  RedLineAn: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ba05GYoMZITrqBpF/Hczc9", "RedLineAn");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AudioNode_1 = require("../ui/AudioNode");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RedLineAn = function(_super) {
      __extends(RedLineAn, _super);
      function RedLineAn() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      RedLineAn.prototype.playSound = function(effectName) {
        "leftRedLineAn" === this.node.name && AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL[effectName]);
      };
      RedLineAn = __decorate([ ccclass ], RedLineAn);
      return RedLineAn;
    }(cc.Component);
    exports.default = RedLineAn;
    cc._RF.pop();
  }, {
    "../lib/AudioPool": "AudioPool",
    "../ui/AudioNode": "AudioNode"
  } ],
  SDKInit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac7733ZINdBHIXWhEf0buWh", "SDKInit");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SDK_1 = require("../lib/SDK");
    var _a = cc._decorator, ccclass = _a.ccclass, executionOrder = _a.executionOrder, property = _a.property;
    var SDKInit = function(_super) {
      __extends(SDKInit, _super);
      function SDKInit() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.canvas = null;
        return _this;
      }
      SDKInit.prototype.onLoad = function() {
        SDK_1.default.setup();
        var w = cc.winSize.width;
        var h = cc.winSize.height;
        var r = w / h;
        var s = 9 / 16;
        if (r < s) {
          this.canvas.fitWidth = true;
          this.canvas.fitHeight = false;
        } else {
          this.canvas.fitWidth = false;
          this.canvas.fitHeight = true;
        }
      };
      __decorate([ property(cc.Canvas) ], SDKInit.prototype, "canvas", void 0);
      SDKInit = __decorate([ ccclass, executionOrder(-100) ], SDKInit);
      return SDKInit;
    }(cc.Component);
    exports.default = SDKInit;
    cc._RF.pop();
  }, {
    "../lib/SDK": "SDK"
  } ],
  SDK: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b9575t6ohBBxqfc3zhNapmW", "SDK");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SDK = function() {
      function SDK() {}
      SDK.setup = function() {
        if (!SDK.isInited) {
          SDK.isInited = true;
          window["GD_OPTIONS"] = {
            gameId: "6ea042f347614eb4a277d2c01ba27cef",
            onEvent: function(event) {
              if ("SDK_READY" === event.name) {
                SDK.showInters();
                SDK.preloadReward();
              } else if ("SDK_GAME_START" === event.name) {
                cc.audioEngine.resumeAll();
                cc.game.resume();
                if (SDK.rewardedResolve) {
                  SDK.rewardedResolve(false);
                  SDK.rewardedResolve = null;
                }
              } else if ("SDK_GAME_PAUSE" === event.name) {
                cc.audioEngine.pauseAll();
                cc.game.pause();
              } else if ("SDK_GDPR_TRACKING" === event.name) ; else if ("SDK_GDPR_TARGETING" === event.name) ; else if ("SDK_REWARDED_WATCH_COMPLETE" === event.name && SDK.rewardedResolve) {
                SDK.rewardedResolve(true);
                SDK.rewardedResolve = null;
              }
            }
          };
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "main.min.js";
            fjs.parentNode.insertBefore(js, fjs);
          })(document, "script", "gamedistribution-jssdk");
          SDK.showInters();
        }
      };
      SDK.showBanner = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd(window.gdsdk.AdType.Display, {
          containerId: "CONTAINER_ID_TO_PUT_AD_IN"
        });
      };
      SDK.hideBanner = function() {};
      SDK.showInters = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.showAd();
      };
      SDK.preloadReward = function() {
        "undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd && gdsdk.preloadAd("rewarded").then(function(response) {}).catch(function(error) {});
      };
      SDK.showReward = function() {
        return new Promise(function(resolve, reject) {
          if ("undefined" !== typeof gdsdk && "undefined" !== gdsdk.showAd) {
            SDK.rewardedResolve = resolve;
            gdsdk.showAd("rewarded").then(function(response) {
              SDK.preloadReward();
            }).catch(function(error) {});
          } else resolve(false);
        });
      };
      SDK.isInited = false;
      SDK.rewardedResolve = null;
      return SDK;
    }();
    exports.default = SDK;
    cc._RF.pop();
  }, {} ],
  StarAn: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6643esMITxJ7oU32xmGQ76B", "StarAn");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AudioNode_1 = require("./AudioNode");
    var AudioPool_1 = require("../lib/AudioPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var StarAn = function(_super) {
      __extends(StarAn, _super);
      function StarAn() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      StarAn.prototype.playEnd = function() {
        AudioNode_1.default.instance.playSound(AudioPool_1.AUDIO_URL.star);
      };
      StarAn = __decorate([ ccclass ], StarAn);
      return StarAn;
    }(cc.Component);
    exports.default = StarAn;
    cc._RF.pop();
  }, {
    "../lib/AudioPool": "AudioPool",
    "./AudioNode": "AudioNode"
  } ],
  Star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1c2dS/detNopPpyTN6oDXw", "Star");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Star = function(_super) {
      __extends(Star, _super);
      function Star() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Star = __decorate([ ccclass ], Star);
      return Star;
    }(cc.Component);
    exports.default = Star;
    cc._RF.pop();
  }, {} ],
  Stroage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9dd035kJNBHDIEU1EYRdEtP", "Stroage");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var User_1 = require("./User");
    var Stroage = function() {
      function Stroage() {
        this.strogeName = "userInfo_LLK";
      }
      Object.defineProperty(Stroage, "instance", {
        get: function() {
          null === Stroage._instance && (this._instance = new Stroage());
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      Stroage.prototype.saveUserData = function() {
        cc.sys.localStorage.setItem(this.strogeName, JSON.stringify(User_1.default.instance.getUserInfo()));
      };
      Stroage.prototype.getUserData = function() {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem(this.strogeName));
        return userInfo;
      };
      Stroage._instance = null;
      return Stroage;
    }();
    exports.default = Stroage;
    cc._RF.pop();
  }, {
    "./User": "User"
  } ],
  ToastNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "93cb65j3S5DVYF+OwiJNxX+", "ToastNode");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ToastNode = function(_super) {
      __extends(ToastNode, _super);
      function ToastNode() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      ToastNode_1 = ToastNode;
      Object.defineProperty(ToastNode, "instance", {
        get: function() {
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      ToastNode.prototype.onLoad = function() {
        ToastNode_1._instance = this;
      };
      var ToastNode_1;
      ToastNode._instance = null;
      ToastNode = ToastNode_1 = __decorate([ ccclass ], ToastNode);
      return ToastNode;
    }(cc.Component);
    exports.default = ToastNode;
    cc._RF.pop();
  }, {} ],
  User: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "533daLJCdRJNoDRhQwMTZJj", "User");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Stroage_1 = require("./Stroage");
    var DGameLevel_1 = require("../ui/DGameLevel");
    var NativeCtrl_1 = require("./NativeCtrl");
    var User = function() {
      function User() {
        this._userInfo = null;
      }
      Object.defineProperty(User, "instance", {
        get: function() {
          null === User._instance && (this._instance = new User());
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      User.prototype.onInit = function() {
        var userInfo = Stroage_1.default.instance.getUserData();
        if (userInfo && Object.keys(userInfo).length > 0) this._userInfo = userInfo; else {
          this._userInfo = {
            musicState: true,
            effectState: true,
            normalMode: [],
            timeMode: [],
            nightmareMode: []
          };
          Stroage_1.default.instance.saveUserData();
        }
      };
      User.prototype.getUserInfo = function() {
        return this._userInfo;
      };
      User.prototype.setBgMusic = function(state) {
        this._userInfo.musicState = state;
        Stroage_1.default.instance.saveUserData();
      };
      User.prototype.setSoundEffect = function(state) {
        this._userInfo.effectState = state;
        Stroage_1.default.instance.saveUserData();
      };
      User.prototype.getGameModeInfo = function(gameMode) {
        if (gameMode === DGameLevel_1.GAMEMODE.NORMAL) return this._userInfo.normalMode;
        if (gameMode === DGameLevel_1.GAMEMODE.TIME) return this._userInfo.timeMode;
        if (gameMode === DGameLevel_1.GAMEMODE.NIGHTMARE) return this._userInfo.nightmareMode;
        return;
      };
      User.prototype.updateLevelRecord = function(gameMode, data, isWin) {
        return __awaiter(this, void 0, void 0, function() {
          var starCount, _i, _a, levelInfo, starCount, _b, _c, levelInfo, starCount, _d, _e, levelInfo;
          return __generator(this, function(_f) {
            if (gameMode === DGameLevel_1.GAMEMODE.NORMAL) if (this._userInfo.normalMode.length < data.levelId) {
              this._userInfo.normalMode.push(data);
              if (isWin) {
                starCount = 0;
                for (_i = 0, _a = this._userInfo.normalMode; _i < _a.length; _i++) {
                  levelInfo = _a[_i];
                  starCount += levelInfo.star;
                }
                cc.sys.isNative && NativeCtrl_1.default.leaderboardsSubmitScore(null, NativeCtrl_1.default.LEADERBOARD_CLASSIC, starCount);
              }
            } else this._userInfo.normalMode.splice(data.levelId - 1, 1, data); else if (gameMode === DGameLevel_1.GAMEMODE.TIME) if (this._userInfo.timeMode.length < data.levelId) {
              this._userInfo.timeMode.push(data);
              if (isWin) {
                starCount = 0;
                for (_b = 0, _c = this._userInfo.timeMode; _b < _c.length; _b++) {
                  levelInfo = _c[_b];
                  starCount += levelInfo.star;
                }
                cc.sys.isNative && NativeCtrl_1.default.leaderboardsSubmitScore(null, NativeCtrl_1.default.LEADERBOARD_TIME, starCount);
              }
            } else this._userInfo.timeMode.splice(data.levelId - 1, 1, data); else if (gameMode === DGameLevel_1.GAMEMODE.NIGHTMARE) if (this._userInfo.nightmareMode.length < data.levelId) {
              this._userInfo.nightmareMode.push(data);
              if (isWin) {
                starCount = 0;
                for (_d = 0, _e = this._userInfo.nightmareMode; _d < _e.length; _d++) {
                  levelInfo = _e[_d];
                  starCount += levelInfo.star;
                }
                cc.sys.isNative && NativeCtrl_1.default.leaderboardsSubmitScore(null, NativeCtrl_1.default.LEADERBOARD_NIGHT, starCount);
              }
            } else this._userInfo.nightmareMode.splice(data.levelId - 1, 1, data);
            Stroage_1.default.instance.saveUserData();
            return [ 2 ];
          });
        });
      };
      User._instance = null;
      return User;
    }();
    exports.default = User;
    cc._RF.pop();
  }, {
    "../ui/DGameLevel": "DGameLevel",
    "./NativeCtrl": "NativeCtrl",
    "./Stroage": "Stroage"
  } ],
  Util: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08429o7oupK0rMy9wl37r7W", "Util");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Logger_1 = require("./Logger");
    function promisify(func, thisArg) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
      return new Promise(function(resolve, reject) {
        try {
          var callback = function(err, res) {
            err ? reject(err) : resolve(res);
          };
          args.unshift(callback);
          func.apply(thisArg, args);
        } catch (err) {
          reject(err);
        }
      });
    }
    function promisifyLoadRes(url, type, callback) {
      return new Promise(function(resolve, reject) {
        try {
          cc.loader.loadRes(url, type, callback, function(err, res) {
            err ? reject(err) : resolve(res);
          });
        } catch (err) {
          reject(err);
        }
      });
    }
    function promisifyLoadResArray(urlArr, type, callback) {
      return new Promise(function(resolve, reject) {
        try {
          cc.loader.loadResArray(urlArr, type, callback, function(err, res) {
            err ? reject(err) : resolve(res);
          });
        } catch (err) {
          reject(err);
        }
      });
    }
    function randomInt(max, min) {
      void 0 === min && (min = 0);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function distance(p1, p2) {
      return p1.sub(p2).mag();
    }
    function actionSeq(func, target) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
      args.push(cc.callFunc(function() {
        try {
          func();
        } catch (err) {
          showError(err);
        }
      }, target));
      var seq = cc.sequence(args);
      return seq;
    }
    function formatLanguageString(str, data) {
      var result = str;
      for (var key in data) {
        var value = data[key];
        var reg = new RegExp("\\{" + key + "\\}", "g");
        result = result.replace(reg, value);
      }
      return result;
    }
    function findParamsFromConfig(val, key, config) {
      var res = config.find(function(ele) {
        return ele[key] === val;
      });
      return res;
    }
    function findParamsArrFromConfig(val, key, config) {
      var resArr = [];
      config.forEach(function(ele) {
        ele[key] === val && resArr.push(ele);
      });
      return resArr;
    }
    function showError(err) {
      var val = "" + (err.stack || err.message);
      var text = Logger_1.default.getDateString() + " " + ("object" === typeof val ? JSON.stringify(val) : val);
      Logger_1.default.error(val);
    }
    function addDelayTime(callback, delay, component) {
      try {
        component.scheduleOnce(function() {
          callback(null, null);
        }, delay);
      } catch (err) {
        callback(err, null);
      }
    }
    exports.default = {
      promisify: promisify,
      promisifyLoadRes: promisifyLoadRes,
      promisifyLoadResArray: promisifyLoadResArray,
      randomInt: randomInt,
      distance: distance,
      actionSeq: actionSeq,
      formatLanguageString: formatLanguageString,
      findParamsFromConfig: findParamsFromConfig,
      findParamsArrFromConfig: findParamsArrFromConfig,
      showError: showError,
      addDelayTime: addDelayTime
    };
    cc._RF.pop();
  }, {
    "./Logger": "Logger"
  } ],
  en: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48f81VB8yhDn749J0bz/LAR", "en");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {
      u1: "Only through the previous level to the next level oh",
      u2: "Equipped with success",
      u3: "Replace the success",
      u4: "You cannot equip two full class artifacts at the same time",
      u5: "No resistance",
      u6: "Energy required for skills: {num}",
      u7: "With probability",
      u8: "Lack of gold COINS",
      u9: "Occupation: full-time",
      u10: "Class: knight",
      u11: "Class: archer",
      u12: "Class: warrior",
      u13: "Class: shield hand",
      u14: "Occupation: priest",
      u15: "Buy success",
      u16: "Lack of gold COINS",
      u17: "Diamond is insufficient",
      u18: "No repeat purchase",
      u19: "Base health increased by {num}%",
      u20: "Base damage increased by {num}%",
      u21: "Base resilience increased by {num}%",
      u22: "Atk:{num}",
      u23: "Cure:{num}",
      u24: "Equip",
      u25: "You get experience after you pass",
      u26: "NO.{num}",
      u27: "enemy",
      u28: "reward",
      u29: "You dead",
      u30: "Play again",
      u31: "Challange",
      u32: "Next level",
      u33: "Shop",
      u34: "Previous page",
      u35: "Next page",
      u36: "Loading",
      u37: "Lose",
      c38: "",
      u39: "Sure",
      u40: "Victory",
      c41: "",
      u42: "Cards",
      u43: "Artifact",
      u44: "Equip",
      u45: "Skill",
      u46: "Item",
      c47: "",
      c48: "",
      c49: "",
      c50: "",
      c51: "",
      u52: "Get",
      u53: "All heroes lose {num}% of their base life cap",
      u54: "Hp:{num}",
      u55: "Setting",
      u56: "Music",
      u57: "FrameRate",
      u58: "Open",
      u59: "Close",
      u60: "60",
      u61: "30",
      u62: "Show FrameRate",
      c63: "",
      u64: "New game",
      u65: "Continue",
      u66: "Game infomation",
      u67: "Exit game",
      u68: "Need hool:{num}",
      u69: "Hole not enough.Need {num} hole",
      c70: "",
      c71: "",
      c72: "",
      c73: "",
      c74: "",
      c75: "",
      c76: "",
      c77: "",
      c78: "",
      c79: "",
      c80: "",
      c81: "",
      c82: "",
      c83: "",
      c84: "",
      c85: "",
      c86: "",
      c87: "",
      c88: "",
      c89: "",
      c90: "",
      c91: "",
      c92: "",
      c93: "",
      c94: "",
      c95: "",
      c96: "",
      c97: "",
      c98: "",
      c99: "",
      c100: "",
      c101: "",
      c102: "",
      c103: "",
      c104: "",
      c105: "",
      c106: "",
      c107: "",
      c108: "",
      c109: "",
      c110: "",
      c111: "",
      c112: "",
      c113: "",
      c114: "",
      c1: "The cooldown",
      c2: "Every 10 swords removed increases the skill energy by 5",
      c3: "Every 10 bows removed increases the skill energy by 5",
      c4: "Every 10 magic caps removed increases the energy of the skill by 5",
      c5: "Every 10 love dispels increases skill energy by 5",
      c6: "Every 10 shields removed adds an additional 5 skill energy",
      c7: "HP reply",
      c8: "Turn starts restoring 50% of total health",
      c9: "Defense response",
      c10: "Turn begins with a 50% block of total regeneration",
      c11: "Eliminate the attack",
      c12: "Every 10 swords removed deals 100% total damage to random enemies",
      c13: "Every 10 bows removed deals 100% total damage to random enemies",
      c14: "Dispels 10 caps that deal 100% total damage to random enemies",
      c15: "Every 10 hearts removed deals 100% total damage to random enemies",
      c16: "Each 10 shields removed deals 100% total damage to random enemies",
      c17: "Eliminating dizziness",
      c18: "Removes more than 5 swords per turn, causing random monomer enemies to stun for 1 turn",
      c19: "Removes more than 5 arrows per turn, causing random monomer enemies to stun for 1 turn",
      c20: "Dispels more than 5 magic blocks per turn, causing random monomer enemies to stun for 1 turn",
      c21: "Removes more than 5 heart blocks per turn, causing random monomer enemies to stun for 1 turn",
      c22: "Removes more than 5 shields per turn, causing random monomer enemies to stun for 1 turn",
      c23: "Eliminate poisoning",
      c24: "Every 10 swords removed adds 1 tier of poison to random monomer enemies",
      c25: "Every 10 bows removed adds 1 tier of poison to random monomer enemies",
      c26: "Every 10 magic caps removed adds 1 tier of poison to random monomer enemies",
      c27: "Every 10 hearts removed adds 1 layer of poison to random monomer enemies",
      c28: "Every 10 shields removed adds 1 tier of poison to random monomer enemies",
      c29: "combo",
      c30: "There is a 10% chance that the same action will be repeated after each elimination",
      c31: "Skill cooldown 1",
      c32: "Each time there are at least 4 pieces of skill required to eliminate the temporary reduced role -1",
      c33: "conversion",
      c34: "All damage converted to regeneration",
      c35: "Avoid injury",
      c36: "1 for every 5 injuries",
      c37: "God save",
      c38: "Resurrect immediately after death and restore all blood. Can only trigger once.",
      c39: "Boss bane",
      c40: "Damage from boss type monsters reduced by 50%",
      c41: "poisoning",
      c42: "10% of total damage per tier",
      c43: "dizzy",
      c44: "Stunned turn incapacitated",
      c45: "Attack power increased by {number} point",
      c46: "Resilience increased by {number} point",
      c47: "Crit rate increased by {number}%",
      c48: "Critical strike damage increased by {number}%",
      c49: "HP upper limit increased by {number}%",
      c50: "Defense cap increased by {number}%",
      c51: "Initial health {number}% increased to initial block",
      c52: "Damage value {number}% drains health",
      c53: "The {number}% of the recovery amount is converted to damage",
      c54: "Remove skill energy extra +{number}",
      c55: "Disables attacks that cause {val}% chance to stun",
      c56: "Each elimination attack comes with {number} layer poisoning",
      c57: "Energy upper limit reduced {number}",
      c58: "Total mana regeneration {number}%",
      c59: "Defense against total resilience {number}%",
      c60: "Deals damage to {number}% of total damage",
      c61: "The chance of {val}% acting again after elimination",
      c62: "{number}% damage all converted to resilience",
      c63: "Immune to damage {number} rounds per {val} damage",
      c64: "Resurrect restore {number}%",
      c65: "Boss class damage reduced by {number}%",
      c66: "Sword type damage reduced {number}%",
      c67: "Reduces bow type damage by {number}%",
      c68: "Reduces magical cap type damage {number}%",
      c69: "Reduces poisoning type damage {number}%",
      c70: "Elite damage reduced {number}%",
      c71: "All monsters take damage reduced by {number}%",
      c72: "The total damage done by a character is {number}% * the current level of damage",
      c73: "Monster does not act {number} round",
      c74: "Eliminate {val} sword block skill energy +{number}",
      c75: "Eliminate {val} bow block skill energy +{number}",
      c76: "Remove {val} magic hat block skill energy +{number}",
      c77: "Remove {val} love block skill energy +{number}",
      c78: "Remove {val} shield block skill energy +{number}",
      c79: "Removes damage from {val} blade that causes {number}% of total damage",
      c80: "Removes damage from {val} bow that causes {number}% of total damage",
      c81: "Removes damage from {val} magic hat block that causes {number}% total damage",
      c82: "Removes the damage done by {val} heart block to {number}% of total damage",
      c83: "Removes damage from {val} shield that causes {number}% of total damage",
      c84: "Removes more than {val} swords per turn, causing random enemies to stun for {number} rounds",
      c85: "Removes more than {val} arrows per turn, causing random enemies to stun for {number} rounds",
      c86: "Removes more than {val} magic blocks per turn, causing random enemies to stun for {number} rounds",
      c87: "Removes more than {val} love blocks per turn causing random enemies to daze with {number} rounds",
      c88: "Removes more than {val} shields per turn, causing random enemies to stun for {number} rounds",
      c89: "Removes {val} sword block from poisoning random enemies by increasing {number} level",
      c90: "Eliminates {val} bow block poisoning by increasing the {number} level on random enemies",
      c91: "Removes {val} magic cap block from poisoning random enemies by increasing {number} level",
      c92: "Removes {val} love block from poisoning random enemies by increasing {number} level",
      c93: "Removes {val} shield block from poisoning random enemies by increasing {number} level",
      c94: "Every time there is a sword block greater than or equal to {val}, remove the block {number} needed to temporarily reduce the role skill.",
      c95: "Every time there is a bow block greater than or equal to {val}, remove the block {number} needed to temporarily reduce the role skills.",
      c96: "Every time there are magic hat blocks greater than or equal to {val}, remove the block {number} needed to temporarily reduce the role skills.",
      c97: "Every time there is a love block greater than or equal to {val}, remove the block {number} needed to temporarily reduce the role skills.",
      c98: "Every time there are shield blocks greater than or equal to {val}, remove the block {number} needed to temporarily reduce the role skills.",
      c99: "Immune damage {number} round",
      c100: "Initial block increased by {number}",
      c101: "Equipped with 1",
      c102: "Damage increased by 5",
      c103: "Equipped with 2",
      c104: "Equipped with 3",
      c105: "Equipped with four",
      c106: "Resilience increased by 5",
      c107: "Equipped with 5",
      c108: "Equipped with 6",
      c109: "15% of all damage taken",
      c110: "Equipped with seven",
      c111: "Equipped with 8",
      c112: "Equipped with a 9",
      c113: "15% of all regeneration converted to damage",
      c114: "Equipped with 10",
      c115: "Equipped with 11",
      c116: "Crit rate increased by 30%",
      c117: "Equipped with 12",
      c118: "Equipped with 13",
      c119: "Equipped with 14",
      c120: "Equipped with a 15",
      c121: "Equipped with 16",
      c122: "Each dispel gives a 10% chance to stun",
      c123: "Equipped with 17",
      c124: "Equipped with 18",
      c125: "Equipped with 19",
      c126: "Equipped with 20",
      c127: "Equipped with 21",
      c128: "15% health increased to block",
      c129: "Equipped with 22",
      c130: "Equipped with 23",
      c131: "Equipped with 24",
      c132: "Equipped with 25",
      c133: "Equipped with 26",
      c134: "Expunge skill energy each time +1",
      c135: "Equipped with 27",
      c136: "Equipped with 28",
      c137: "Equipped with 29",
      c138: "Equipped with 30",
      c139: "Equipped with 31",
      c140: "Critical strike damage increased by 100%",
      c141: "Equipped with a 32",
      c142: "Equipped with 33",
      c143: "Equipped with 34",
      c144: "Equipped with a 35",
      c145: "Equipment 36",
      c146: "Eliminate 1 layer of poison at a time",
      c147: "Equipped with 37",
      c148: "Equipped with 38",
      c149: "Equipped with 39",
      c150: "Equipped with 40",
      c151: "Equipped with 41",
      c152: "HP cap increased by 30%",
      c153: "Equipped with 42",
      c154: "Equipment 43",
      c155: "Equipped with 44",
      c156: "Equipped with 45",
      c157: "Equipped with 46",
      c158: "Block limit increased by 20%",
      c159: "Equipped with 47",
      c160: "Equipped with 48",
      c161: "Equipped with 49",
      c162: "Equipped with 50",
      c163: "Equipped with 51",
      c164: "Initial block increased by 50",
      c165: "Equipped with 52",
      c166: "Equipped with 53",
      c167: "Equipped with 54",
      c168: "Equipped with 55",
      c169: "Gold COINS",
      c170: "Hero skills can be purchased in the store oh!",
      c171: "skills",
      c172: "In the hero interface can be equipped to the hero oh!",
      c173: "equipment",
      c174: "Equipment need not say much!",
      c175: "artifact",
      c176: "If you don't say much, it's just cow B!",
      c177: "The monster 1",
      c178: "Go to hell!",
      c179: "The monster 2",
      c180: "The monster 3",
      c181: "Split the monster",
      c182: "Split little monster 1",
      c183: "Split little monster 2",
      c184: "The monster 4",
      c185: "The monster 5",
      c186: "The monster 6",
      c187: "The monster 7",
      c188: "Mermaid boss",
      c189: "Summon merman 1",
      c190: "Summon merman 2",
      c191: "Normal attack",
      c192: "Deals 400% of the damage",
      c193: "Chain strike",
      c194: "Deals 500% damage and adds a chain block",
      c195: "Poisoning blow",
      c196: "Deals 500% damage and adds 2 poisons to each block for 100% damage",
      c197: "reply",
      c198: "Restores 300% of health",
      c199: "block",
      c200: "Increased parry by 300%",
      c201: "Fold the breaking",
      c202: "Deals 200% damage * number of actions",
      c203: "Seal strike",
      c204: "Deals 100% damage and seals sword block for 3 turns (stun)",
      c205: "Division 1",
      c206: "Spawns X monsters (inherited the amount of health of the splittist) that die",
      c207: "summon",
      c208: "Summons X designated monsters",
      c209: "Division 2",
      c210: "Split specifies X monsters (normal monsters) that die themselves",
      c211: "suicide",
      c212: "Do total health damage to yourself",
      c213: "Deals 100% damage and seals the mana block for 3 turns (stun)",
      c214: "Ice blow",
      c215: "Does 600% damage and adds an ice cube",
      c216: "After 10 actions, the monster dies",
      c217: "Less than 50% of the blood is divided",
      c218: "No younger brother to call after",
      c219: "Hero 1",
      c220: "Hero 2",
      c221: "Heroes 3",
      c222: "Hero 4",
      c223: "Heroes 5",
      c224: "Blue waves strike",
      c225: "Deals 1000% damage to enemy cells",
      c226: "Make track for a star of the arrow",
      c227: "The storm hit",
      c228: "Love flood",
      c229: "Resilience 1000% health",
      c230: "Invincible shield",
      c231: "Resilience 1000% block",
      c232: "Dizziness strike",
      c233: "Deals 1000% damage to enemy cells and stuns them for 1 turn",
      c234: "Conversion of love",
      c235: "Convert 10 swords on the board to 4 swords",
      c236: "Convert 10 arrows on the board to 4 arrows",
      c237: "Converts 10 magic blocks on the board to 4 magic",
      c238: "Conversion of shield",
      c239: "After poison machine",
      c240: "Does 1000% damage to enemy cells plus 2 levels of poison",
      c241: "Transform 5 hearts on the board into universal blocks",
      c242: "Convert 5 shield blocks on board to universal blocks",
      c243: "Double poisoning",
      c244: "Deals 800% damage to enemy cells, doubling the number of levels poisoned by monsters",
      c245: "Convert 10 hearts on the board to 4 hearts",
      c246: "Convert 10 shields on the board to shield 4",
      c247: "Loss of blood strike",
      c248: "Deals 1,000% damage to enemy cells plus 30% health loss",
      c249: "Shield bash",
      c250: "Deals 1000% damage to enemy cells plus 30% of block value",
      c251: "Red bull",
      c252: "Randomly increases the energy of a class skill by 20",
      c253: "Causing 100% damage * Number of actions",
      c254: "HP upper limit reduced {number}%",
      c255: "Money slave",
      c256: "Be a slave to money. Get 200 gold coins",
      c257: "Lost 200 gold coins. Get an artifact",
      c258: "out",
      c259: "Bullfight",
      c260: "Warriors, fighting with elites and monsters, will win an artifact when they win.",
      c261: "Coward, give up and leave, all heroes lose 5% of their basic life cap.",
      c262: "Gambling, 50% chance of getting 200 gold coins, 50% chance of losing 200 gold coins",
      c263: "Additional Sword Skill Energy 5 per 10 Swords Eliminated",
      c264: "Additional bow skill energy per 10 bows removed 5",
      c265: "Increase spell power by 5 per 10 magic caps removed",
      c266: "Increase the energy of love skills by 5 per 10 elimination of love",
      c267: "Increase shield skill power by 5 per 10 shields removed",
      c268: "Deals 300% damage to enemy units and stuns enemy units for 1 turn",
      c269: "Talent point",
      c270: "Can increase the player's talent attribute in the talent system oh!",
      c271: "Gambling, 50% chance to get 200 gold coins, 50% chance to lose 200 gold coins.",
      c272: "The more fighting, the more brave",
      c273: "Restore all blood.",
      c274: "All heroes have an attack power increase of 2 points.",
      c275: "",
      c276: "",
      c277: "",
      c278: "",
      c279: "",
      c280: "",
      c281: "",
      c282: "",
      c283: "",
      c284: "",
      c285: "",
      c286: "",
      c287: "",
      c288: "",
      c289: "",
      c290: "",
      c291: "",
      c292: "",
      c293: "",
      c294: "",
      c295: "",
      c296: "",
      c297: "",
      c298: "",
      c299: "",
      c300: "",
      c301: "",
      c302: "",
      c303: "",
      c304: "",
      c305: "",
      c306: "",
      c307: "",
      c308: "",
      c309: "",
      c310: "",
      c311: "",
      c312: "",
      c313: "",
      c314: "",
      c315: "",
      c316: "",
      c317: "",
      c318: "",
      c319: "",
      c320: "",
      c321: "",
      c322: "",
      c323: "",
      c324: "",
      c325: "",
      c326: "",
      c327: "",
      c328: "",
      c329: "",
      c330: "",
      c331: "",
      c332: "",
      c333: "",
      c334: "",
      c335: "",
      c336: "",
      c337: "",
      c338: "",
      c339: "",
      c340: "",
      c341: "",
      c342: "",
      c343: "",
      c344: "",
      c345: "",
      c346: "",
      c347: "",
      c348: "",
      c349: "",
      c350: "",
      c351: "",
      c352: "",
      c353: "",
      c354: "",
      c355: "",
      c356: "",
      c357: "",
      c358: "",
      c359: "",
      c360: "",
      c361: "",
      c362: "",
      c363: "",
      c364: "",
      c365: "",
      c366: "",
      c367: "",
      c368: "",
      c369: "",
      c370: "",
      c371: "",
      c372: "",
      c373: "",
      c374: "",
      c375: "",
      c376: "",
      c377: "",
      c378: "",
      c379: "",
      c380: "",
      c381: "",
      c382: "",
      c383: "",
      c384: "",
      c385: "",
      c386: "",
      c387: "",
      c388: "",
      c389: "",
      c390: "",
      c391: "",
      c392: "",
      c393: "",
      c394: "",
      c395: "",
      c396: "",
      c397: "",
      c398: "",
      c399: "",
      c400: "",
      c401: "",
      c402: "",
      c403: "",
      c404: "",
      c405: "",
      c406: "",
      c407: "",
      c408: "",
      c409: "",
      c410: "",
      c411: "",
      c412: "",
      c413: "",
      c414: "",
      c415: "",
      c416: "",
      c417: "",
      c418: "",
      c419: "",
      c420: "",
      c421: "",
      c422: "",
      c423: "",
      c424: "",
      c425: "",
      c426: "",
      c427: "",
      c428: "",
      c429: "",
      c430: "",
      c431: "",
      c432: "",
      c433: "",
      c434: "",
      c435: "",
      c436: "",
      c437: "",
      c438: "",
      c439: "",
      c440: "",
      c441: "",
      c442: "",
      c443: "",
      c444: "",
      c445: "",
      c446: "",
      c447: "",
      c448: "",
      c449: "",
      c450: "",
      c451: "",
      c452: "",
      c453: "",
      c454: "",
      c455: "",
      c456: "",
      c457: "",
      c458: "",
      c459: "",
      c460: "",
      c461: "",
      c462: "",
      c463: "",
      c464: "",
      c465: "",
      c466: "",
      c467: "",
      c468: "",
      c469: "",
      c470: "",
      c471: "",
      c472: "",
      c473: "",
      c474: "",
      c475: "",
      c476: "",
      c477: "",
      c478: "",
      c479: "",
      c480: "",
      c481: "",
      c482: "",
      c483: "",
      c484: "",
      c485: "",
      c486: "",
      c487: "",
      c488: "",
      c489: "",
      c490: "",
      c491: "",
      c492: "",
      c493: "",
      c494: "",
      c495: "",
      c496: "",
      c497: "",
      c498: "",
      c499: "",
      c500: "",
      c501: "",
      c502: "",
      c503: "",
      c504: "",
      c505: "",
      c506: "",
      c507: "",
      c508: "",
      c509: "",
      c510: "",
      c511: "",
      c512: "",
      c513: "",
      c514: "",
      c515: "",
      c516: "",
      c517: "",
      c518: "",
      c519: "",
      c520: "",
      c521: "",
      c522: "",
      c523: "",
      c524: "",
      c525: "",
      c526: "",
      c527: "",
      c528: "",
      c529: "",
      c530: "",
      c531: "",
      c532: "",
      c533: "",
      c534: "",
      c535: "",
      c536: "",
      c537: "",
      c538: "",
      c539: "",
      c540: "",
      c541: "",
      c542: "",
      c543: "",
      c544: "",
      c545: "",
      c546: "",
      c547: "",
      c548: "",
      c549: "",
      c550: "",
      c551: "",
      c552: "",
      c553: "",
      c554: "",
      c555: "",
      c556: "",
      c557: "",
      c558: "",
      c559: "",
      c560: "",
      c561: "",
      c562: "",
      c563: "",
      c564: "",
      c565: "",
      c566: "",
      c567: "",
      c568: "",
      c569: "",
      c570: "",
      c571: "",
      c572: "",
      c573: "",
      c574: "",
      c575: "",
      c576: "",
      c577: "",
      c578: "",
      c579: "",
      c580: "",
      c581: "",
      c582: "",
      c583: "",
      c584: "",
      c585: "",
      c586: "",
      c587: "",
      c588: "",
      c589: "",
      c590: "",
      c591: "",
      c592: "",
      c593: "",
      c594: "",
      c595: "",
      c596: "",
      c597: "",
      c598: "",
      c599: "",
      c600: "",
      c601: "",
      c602: "",
      c603: "",
      c604: "",
      c605: "",
      c606: "",
      c607: "",
      c608: "",
      c609: "",
      c610: "",
      c611: "",
      c612: "",
      c613: "",
      c614: "",
      c615: "",
      c616: "",
      c617: "",
      c618: "",
      c619: "",
      c620: "",
      c621: "",
      c622: "",
      c623: "",
      c624: "",
      c625: "",
      c626: "",
      c627: "",
      c628: "",
      c629: "",
      c630: "",
      c631: "",
      c632: "",
      c633: "",
      c634: "",
      c635: "",
      c636: "",
      c637: "",
      c638: "",
      c639: "",
      c640: "",
      c641: "",
      c642: "",
      c643: "",
      c644: "",
      c645: "",
      c646: "",
      c647: "",
      c648: "",
      c649: "",
      c650: "",
      c651: "",
      c652: "",
      c653: "",
      c654: "",
      c655: "",
      c656: "",
      c657: "",
      c658: "",
      c659: "",
      c660: "",
      c661: "",
      c662: "",
      c663: "",
      c664: "",
      c665: "",
      c666: "",
      c667: "",
      c668: "",
      c669: "",
      c670: "",
      c671: "",
      c672: "",
      c673: "",
      c674: "",
      c675: "",
      c676: "",
      c677: "",
      c678: "",
      c679: "",
      c680: "",
      c681: "",
      c682: "",
      c683: "",
      c684: "",
      c685: "",
      c686: "",
      c687: "",
      c688: "",
      c689: "",
      c690: "",
      c691: "",
      c692: "",
      c693: "",
      c694: "",
      c695: "",
      c696: "",
      c697: "",
      c698: "",
      c699: "",
      c700: "",
      c701: "",
      c702: "",
      c703: "",
      c704: "",
      c705: "",
      c706: "",
      c707: "",
      c708: "",
      c709: "",
      c710: "",
      c711: "",
      c712: "",
      c713: "",
      c714: "",
      c715: "",
      c716: "",
      c717: "",
      c718: "",
      c719: "",
      c720: "",
      c721: "",
      c722: "",
      c723: "",
      c724: "",
      c725: "",
      c726: "",
      c727: "",
      c728: "",
      c729: "",
      c730: "",
      c731: "",
      c732: "",
      c733: "",
      c734: "",
      c735: "",
      c736: "",
      c737: "",
      c738: "",
      c739: "",
      c740: "",
      c741: "",
      c742: "",
      c743: "",
      c744: "",
      c745: "",
      c746: "",
      c747: "",
      c748: "",
      c749: "",
      c750: "",
      c751: "",
      c752: "",
      c753: "",
      c754: "",
      c755: "",
      c756: "",
      c757: "",
      c758: "",
      c759: "",
      c760: "",
      c761: "",
      c762: "",
      c763: "",
      c764: "",
      c765: "",
      c766: "",
      c767: "",
      c768: "",
      c769: "",
      c770: "",
      c771: "",
      c772: "",
      c773: "",
      c774: "",
      c775: "",
      c776: "",
      c777: "",
      c778: "",
      c779: "",
      c780: "",
      c781: "",
      c782: "",
      c783: "",
      c784: "",
      c785: "",
      c786: "",
      c787: "",
      c788: "",
      c789: "",
      c790: "",
      c791: "",
      c792: "",
      c793: "",
      c794: "",
      c795: "",
      c796: "",
      c797: "",
      c798: "",
      c799: "",
      c800: "",
      c801: "",
      c802: "",
      c803: "",
      c804: "",
      c805: "",
      c806: "",
      c807: "",
      c808: "",
      c809: "",
      c810: "",
      c811: "",
      c812: "",
      c813: "",
      c814: "",
      c815: "",
      c816: "",
      c817: "",
      c818: "",
      c819: "",
      c820: "",
      c821: "",
      c822: "",
      c823: "",
      c824: "",
      c825: "",
      c826: "",
      c827: "",
      c828: "",
      c829: "",
      c830: "",
      c831: "",
      c832: "",
      c833: "",
      c834: "",
      c835: "",
      c836: "",
      c837: "",
      c838: "",
      c839: "",
      c840: "",
      c841: "",
      c842: "",
      c843: "",
      c844: "",
      c845: "",
      c846: "",
      c847: "",
      c848: "",
      c849: "",
      c850: "",
      c851: "",
      c852: "",
      c853: "",
      c854: "",
      c855: "",
      c856: "",
      c857: "",
      c858: "",
      c859: "",
      c860: "",
      c861: "",
      c862: "",
      c863: "",
      c864: "",
      c865: "",
      c866: "",
      c867: "",
      c868: "",
      c869: "",
      c870: "",
      c871: "",
      c872: "",
      c873: "",
      c874: "",
      c875: "",
      c876: "",
      c877: "",
      c878: "",
      c879: "",
      c880: "",
      c881: "",
      c882: "",
      c883: "",
      c884: "",
      c885: "",
      c886: "",
      c887: "",
      c888: "",
      c889: "",
      c890: "",
      c891: "",
      c892: "",
      c893: "",
      c894: "",
      c895: "",
      c896: "",
      c897: "",
      c898: "",
      c899: "",
      c900: "",
      c901: "",
      c902: "",
      c903: "",
      c904: "",
      c905: "",
      c906: "",
      c907: "",
      c908: "",
      c909: "",
      c910: "",
      c911: "",
      c912: "",
      c913: "",
      c914: "",
      c915: "",
      c916: "",
      c917: "",
      c918: "",
      c919: "",
      c920: "",
      c921: "",
      c922: "",
      c923: "",
      c924: "",
      c925: "",
      c926: "",
      c927: "",
      c928: "",
      c929: "",
      c930: "",
      c931: "",
      c932: "",
      c933: "",
      c934: "",
      c935: "",
      c936: "",
      c937: "",
      c938: "",
      c939: "",
      c940: "",
      c941: "",
      c942: "",
      c943: "",
      c944: "",
      c945: "",
      c946: "",
      c947: "",
      c948: "",
      c949: "",
      c950: "",
      c951: "",
      c952: "",
      c953: "",
      c954: "",
      c955: "",
      c956: "",
      c957: "",
      c958: "",
      c959: "",
      c960: "",
      c961: "",
      c962: "",
      c963: "",
      c964: "",
      c965: "",
      c966: "",
      c967: "",
      c968: "",
      c969: "",
      c970: "",
      c971: "",
      c972: "",
      c973: "",
      c974: "",
      c975: "",
      c976: "",
      c977: "",
      c978: "",
      c979: "",
      c980: "",
      c981: "",
      c982: "",
      c983: "",
      c984: "",
      c985: "",
      c986: "",
      c987: "",
      c988: "",
      c989: "",
      c990: "",
      c991: "",
      c992: "",
      c993: "",
      c994: "",
      c995: "",
      c996: "",
      c997: "",
      c998: "",
      c999: "",
      c1000: "",
      c1001: "",
      c1002: "",
      c1003: "",
      c1004: "",
      c1005: "",
      c1006: "",
      c1007: "",
      c1008: "",
      c1009: "",
      c1010: "",
      c1011: "",
      c1012: "",
      c1013: "",
      c1014: "",
      c1015: "",
      c1016: "",
      c1017: "",
      c1018: "",
      c1019: "",
      c1020: "",
      c1021: "",
      c1022: "",
      c1023: "",
      c1024: "",
      c1025: "",
      c1026: "",
      c1027: "",
      c1028: "",
      c1029: "",
      c1030: "",
      c1031: "",
      c1032: "",
      c1033: "",
      c1034: "",
      c1035: "",
      c1036: "",
      c1037: "",
      c1038: "",
      c1039: "",
      c1040: "",
      c1041: "",
      c1042: "",
      c1043: "",
      c1044: "",
      c1045: "",
      c1046: "",
      c1047: "",
      c1048: "",
      c1049: "",
      c1050: "",
      c1051: "",
      c1052: "",
      c1053: "",
      c1054: "",
      c1055: "",
      c1056: "",
      c1057: "",
      c1058: "",
      c1059: "",
      c1060: "",
      c1061: ""
    };
    cc._RF.pop();
  }, {} ],
  ft: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "60f3bSaFl1PSZZiXPlPz6pX", "ft");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {};
    cc._RF.pop();
  }, {} ],
  i18n: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "028b0kAUthPWZhAnxI6OJEH", "i18n");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var en_1 = require("./config/en");
    var zh_1 = require("./config/zh");
    var polyglot_1 = require("./polyglot");
    var Events_1 = require("../Events");
    var ft_1 = require("./config/ft");
    var I18n = function() {
      function I18n() {
        var _this = this;
        this._curLang = "";
        this._phrases = null;
        this._polyglot = null;
        var ipcRenderer;
        false;
      }
      Object.defineProperty(I18n, "instance", {
        get: function() {
          this._instance || (this._instance = new I18n());
          return this._instance;
        },
        enumerable: false,
        configurable: true
      });
      I18n.prototype.getCurLang = function() {
        return this._curLang;
      };
      I18n.prototype.init = function(language) {
        language = "en";
        if ("zh" === language) {
          this._phrases = zh_1.default;
          this._curLang = "zh";
        } else if ("en" === language) {
          this._phrases = en_1.default;
          this._curLang = "en";
        } else if ("ft" === language) {
          this._phrases = ft_1.default;
          this._curLang = "ft";
        }
        this.setPolyglot(this._phrases);
      };
      I18n.prototype.change = function(language) {
        this.init(language);
        this.updateSceneRenderers();
      };
      I18n.prototype.getKeyByValue = function(val) {
        for (var key in this._phrases) if (this._phrases[key] === val) return key;
        return "";
      };
      I18n.prototype.setPolyglot = function(data) {
        data && (this._polyglot ? this._polyglot.replace(data) : this._polyglot = new polyglot_1.default({
          phrases: data,
          allowMissing: true
        }));
      };
      I18n.prototype.t = function(key, opt) {
        return this._polyglot.t(key, opt);
      };
      I18n.prototype.updateSceneRenderers = function() {
        Events_1.default.emit(Events_1.EVENT.UPDATE_LOCALIZATION);
      };
      return I18n;
    }();
    exports.default = I18n;
    I18n.instance.init(cc.sys.language);
    cc._RF.pop();
  }, {
    "../Events": "Events",
    "./config/en": "en",
    "./config/ft": "ft",
    "./config/zh": "zh",
    "./polyglot": "polyglot"
  } ],
  localizedLabel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1b97fD6sKhBNqyU9E0R3nUC", "localizedLabel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var i18n_1 = require("./i18n");
    var Events_1 = require("../Events");
    var Util_1 = require("../Util");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var LocalizedLabel = function(_super) {
      __extends(LocalizedLabel, _super);
      function LocalizedLabel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._textKey = "";
        _this._option = null;
        return _this;
      }
      Object.defineProperty(LocalizedLabel.prototype, "TextKey", {
        get: function() {
          return this._textKey;
        },
        set: function(key) {
          this._textKey = key;
          this.updateLabel();
        },
        enumerable: false,
        configurable: true
      });
      LocalizedLabel.prototype.onLoad = function() {
        try {
          this.updateLabel();
          Events_1.default.on(Events_1.EVENT.UPDATE_LOCALIZATION, this.updateLabel, this);
        } catch (err) {
          Util_1.default.showError(err);
        }
      };
      LocalizedLabel.prototype.onDestroy = function() {
        try {
          Events_1.default.off(Events_1.EVENT.UPDATE_LOCALIZATION, this.updateLabel, this);
        } catch (err) {
          Util_1.default.showError(err);
        }
      };
      LocalizedLabel.prototype.getLabel = function() {
        var label = this.node.getComponent(cc.Label) || this.node.getComponent(cc.RichText);
        if (!label) {
          cc.error("Failed to update localized label, label component is invalid!");
          return null;
        }
        return label;
      };
      LocalizedLabel.prototype.resetInEditor = function() {
        var label = this.getLabel();
        if (label.string) {
          var key = i18n_1.default.instance.getKeyByValue(label.string);
          key && (this.TextKey = key);
        }
      };
      LocalizedLabel.prototype.setTextKeyAndOption = function(key, option) {
        this._textKey = key;
        this._option = option || null;
        this.updateLabel();
      };
      LocalizedLabel.prototype.setOption = function(option) {
        this._option = option || null;
        this.updateLabel();
      };
      LocalizedLabel.prototype.updateLabel = function() {
        var label = this.getLabel();
        var localizedString = i18n_1.default.instance.t(this._textKey, this._option);
        localizedString && (label.string = i18n_1.default.instance.t(this._textKey, this._option));
      };
      LocalizedLabel.prototype.clearStr = function() {
        var label = this.getLabel();
        label.string = "";
        this.TextKey = "";
      };
      __decorate([ property({
        type: cc.String,
        tooltip: "Enter i18n key here"
      }) ], LocalizedLabel.prototype, "TextKey", null);
      __decorate([ property(cc.String) ], LocalizedLabel.prototype, "_textKey", void 0);
      LocalizedLabel = __decorate([ ccclass, executeInEditMode ], LocalizedLabel);
      return LocalizedLabel;
    }(cc.Component);
    exports.default = LocalizedLabel;
    cc._RF.pop();
  }, {
    "../Events": "Events",
    "../Util": "Util",
    "./i18n": "i18n"
  } ],
  localizedSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8a9fRea49BTZCENDGhTV9V", "localizedSprite");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var i18n_1 = require("./i18n");
    var Events_1 = require("../Events");
    var Util_1 = require("../Util");
    var AtlasPool_1 = require("../AtlasPool");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var LocalizedSprite = function(_super) {
      __extends(LocalizedSprite, _super);
      function LocalizedSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._imageKey = "";
        return _this;
      }
      LocalizedSprite.prototype.onLoad = function() {
        try {
          var sprite = this.node.getComponent(cc.Sprite);
          if (!sprite) {
            cc.error("Failed to update localized sprite, sprite component is invalid!");
            return;
          }
          this._imageKey = sprite.spriteFrame.name;
          this.updateSprite();
          Events_1.default.on(Events_1.EVENT.UPDATE_LOCALIZATION, this.updateSprite, this);
        } catch (err) {
          Util_1.default.showError(err);
        }
      };
      LocalizedSprite.prototype.onDestroy = function() {
        try {
          Events_1.default.off(Events_1.EVENT.UPDATE_LOCALIZATION, this.updateSprite, this);
        } catch (err) {
          Util_1.default.showError(err);
        }
      };
      LocalizedSprite.prototype.updateSprite = function() {
        return __awaiter(this, void 0, void 0, function() {
          var sprite, url, _a;
          return __generator(this, function(_b) {
            switch (_b.label) {
             case 0:
              sprite = this.node.getComponent(cc.Sprite);
              if (!sprite) {
                cc.error("Failed to update localized sprite, sprite component is invalid!");
                return [ 2 ];
              }
              url = "";
              "zh" === i18n_1.default.instance.getCurLang() ? url = "textures/cn/cn" : "en" === i18n_1.default.instance.getCurLang() ? url = "textures/en/en" : "ft" === i18n_1.default.instance.getCurLang() && (url = "textures/ft/ft");
              true;
              return [ 3, 1 ];

             case 1:
              _a = sprite;
              return [ 4, AtlasPool_1.default.getSpriteFrame(url, this._imageKey) ];

             case 2:
              _a.spriteFrame = _b.sent();
              _b.label = 3;

             case 3:
              return [ 2 ];
            }
          });
        });
      };
      LocalizedSprite = __decorate([ ccclass, executeInEditMode ], LocalizedSprite);
      return LocalizedSprite;
    }(cc.Component);
    exports.default = LocalizedSprite;
    cc._RF.pop();
  }, {
    "../AtlasPool": "AtlasPool",
    "../Events": "Events",
    "../Util": "Util",
    "./i18n": "i18n"
  } ],
  polyglot: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      cc._RF.push(module, "bd74cTD8DdCBZNrwyQIAPEC", "polyglot");
      "use strict";
      (function(root, factory) {
        "function" === typeof define && define.amd ? define([], function() {
          return factory(root);
        }) : "object" === typeof exports ? module.exports = factory(root) : root.Polyglot = factory(root);
      })("undefined" !== typeof global ? global : void 0, function(root) {
        var replace = String.prototype.replace;
        function Polyglot(options) {
          options = options || {};
          this.phrases = {};
          this.extend(options.phrases || {});
          this.currentLocale = options.locale || "en";
          this.allowMissing = !!options.allowMissing;
          this.warn = options.warn || warn;
        }
        Polyglot.VERSION = "1.0.0";
        Polyglot.prototype.locale = function(newLocale) {
          newLocale && (this.currentLocale = newLocale);
          return this.currentLocale;
        };
        Polyglot.prototype.extend = function(morePhrases, prefix) {
          var phrase;
          for (var key in morePhrases) if (morePhrases.hasOwnProperty(key)) {
            phrase = morePhrases[key];
            prefix && (key = prefix + "." + key);
            "object" === typeof phrase ? this.extend(phrase, key) : this.phrases[key] = phrase;
          }
        };
        Polyglot.prototype.unset = function(morePhrases, prefix) {
          var phrase;
          if ("string" === typeof morePhrases) delete this.phrases[morePhrases]; else for (var key in morePhrases) if (morePhrases.hasOwnProperty(key)) {
            phrase = morePhrases[key];
            prefix && (key = prefix + "." + key);
            "object" === typeof phrase ? this.unset(phrase, key) : delete this.phrases[key];
          }
        };
        Polyglot.prototype.clear = function() {
          this.phrases = {};
        };
        Polyglot.prototype.replace = function(newPhrases) {
          this.clear();
          this.extend(newPhrases);
        };
        Polyglot.prototype.t = function(key, options) {
          var phrase, result;
          options = null == options ? {} : options;
          "number" === typeof options && (options = {
            smart_count: options
          });
          if ("string" === typeof this.phrases[key]) phrase = this.phrases[key]; else if ("string" === typeof options._) phrase = options._; else if (this.allowMissing) phrase = key; else {
            this.warn('Missing translation for key: "' + key + '"');
            result = key;
          }
          if ("string" === typeof phrase) {
            options = clone(options);
            result = choosePluralForm(phrase, this.currentLocale, options.smart_count);
            result = interpolate(result, options);
          }
          return result;
        };
        Polyglot.prototype.has = function(key) {
          return key in this.phrases;
        };
        var delimeter = "||||";
        var pluralTypes = {
          chinese: function chinese(n) {
            return 0;
          },
          german: function german(n) {
            return 1 !== n ? 1 : 0;
          },
          french: function french(n) {
            return n > 1 ? 1 : 0;
          },
          russian: function russian(n) {
            return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
          },
          czech: function czech(n) {
            return 1 === n ? 0 : n >= 2 && n <= 4 ? 1 : 2;
          },
          polish: function polish(n) {
            return 1 === n ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
          },
          icelandic: function icelandic(n) {
            return n % 10 !== 1 || n % 100 === 11 ? 1 : 0;
          }
        };
        var pluralTypeToLanguages = {
          chinese: [ "fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh" ],
          german: [ "da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv" ],
          french: [ "fr", "tl", "pt-br" ],
          russian: [ "hr", "ru" ],
          czech: [ "cs", "sk" ],
          polish: [ "pl" ],
          icelandic: [ "is" ]
        };
        function langToTypeMap(mapping) {
          var type, langs, l, ret = {};
          for (type in mapping) if (mapping.hasOwnProperty(type)) {
            langs = mapping[type];
            for (l in langs) ret[langs[l]] = type;
          }
          return ret;
        }
        var trimRe = /^\s+|\s+$/g;
        function trim(str) {
          return replace.call(str, trimRe, "");
        }
        function choosePluralForm(text, locale, count) {
          var ret, texts, chosenText;
          if (null != count && text) {
            texts = text.split(delimeter);
            chosenText = texts[pluralTypeIndex(locale, count)] || texts[0];
            ret = trim(chosenText);
          } else ret = text;
          return ret;
        }
        function pluralTypeName(locale) {
          var langToPluralType = langToTypeMap(pluralTypeToLanguages);
          return langToPluralType[locale] || langToPluralType.en;
        }
        function pluralTypeIndex(locale, count) {
          return pluralTypes[pluralTypeName(locale)](count);
        }
        var dollarRegex = /\$/g;
        var dollarBillsYall = "$$$$";
        function interpolate(phrase, options) {
          for (var arg in options) if ("_" !== arg && options.hasOwnProperty(arg)) {
            var replacement = options[arg];
            "string" === typeof replacement && (replacement = replace.call(options[arg], dollarRegex, dollarBillsYall));
            phrase = replace.call(phrase, new RegExp("\\{" + arg + "\\}", "g"), replacement);
          }
          return phrase;
        }
        function warn(message) {
          root.console && root.console.warn && root.console.warn("WARNING: " + message);
        }
        function clone(source) {
          var ret = {};
          for (var prop in source) ret[prop] = source[prop];
          return ret;
        }
        Polyglot["default"] = Polyglot;
        return Polyglot;
      });
      cc._RF.pop();
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  "use_v2.0.x_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1b42Ogld5E6JDR37rihhRt", "use_v2.0.x_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_check = true);
    cc._RF.pop();
  }, {} ],
  zh: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "77ce394dIhC24wYUEJJtige", "zh");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {
      u1: "\u901a\u8fc7\u524d\u4e00\u5173\u624d\u80fd\u8fdb\u884c\u540e\u7eed\u5173\u5361\u54e6",
      u2: "\u88c5\u5907\u6210\u529f",
      u3: "\u66ff\u6362\u6210\u529f",
      u4: "\u4e0d\u80fd\u540c\u65f6\u88c5\u5907\u4e24\u4ef6\u5168\u804c\u4e1a\u795e\u5668",
      u5: "\u6297\u6027\u5168\u65e0",
      u6: "\u6280\u80fd\u6240\u9700\u80fd\u91cf\uff1a{num}",
      u7: "\u6709\u6982\u7387\u83b7\u5f97",
      u8: "\u91d1\u5e01\u4e0d\u8db3",
      u9: "\u6240\u5c5e\u804c\u4e1a\uff1a\u5168\u804c\u4e1a",
      u10: "\u6240\u5c5e\u804c\u4e1a\uff1a\u9a91\u58eb",
      u11: "\u6240\u5c5e\u804c\u4e1a\uff1a\u5f13\u624b",
      u12: "\u6240\u5c5e\u804c\u4e1a\uff1a\u6218\u58eb",
      u13: "\u6240\u5c5e\u804c\u4e1a\uff1a\u76fe\u624b",
      u14: "\u6240\u5c5e\u804c\u4e1a\uff1a\u7267\u5e08",
      u15: "\u8d2d\u4e70\u6210\u529f",
      u16: "\u91d1\u5e01\u4e0d\u8db3",
      u17: "\u94bb\u77f3\u4e0d\u8db3",
      u18: "\u65e0\u6cd5\u91cd\u590d\u8d2d\u4e70",
      u19: "\u57fa\u7840\u8840\u91cf\u589e\u52a0{num}%",
      u20: "\u57fa\u7840\u653b\u51fb\u529b\u589e\u52a0{num}%",
      u21: "\u57fa\u7840\u56de\u590d\u529b\u589e\u52a0{num}%",
      u22: "\u653b\u51fb\u529b:{num}",
      u23: "\u66b4\u51fb:{num}",
      u24: "\u88c5\u5907",
      u25: "\u8fc7\u5173\u540e\u5c31\u80fd\u83b7\u5f97\u7ecf\u9a8c",
      u26: "\u7b2c{num}\u5173",
      u27: "\u654c\u4eba",
      u28: "\u5956\u52b1",
      u29: "\u80dc\u8d25\u4e43\u5175\u5bb6\u5e38\u4e8b\uff0c\u5927\u4fa0\u8bf7\u91cd\u65b0\u6765\u8fc7",
      u30: "\u518d\u6b21\u6218\u6597",
      u31: "\u6311\u6218",
      u32: "\u4e0b\u4e00\u5173",
      u33: "\u5546\u5e97",
      u34: "\u4e0a\u4e00\u9875",
      u35: "\u4e0b\u4e00\u9875",
      u36: "\u52a0\u8f7d\u4e2d",
      u37: "\u5931\u53bb",
      u38: "{num1}/{num2}",
      u39: "\u786e\u5b9a",
      u40: "\u80dc\u5229",
      u41: "\u8bf7\u9009\u62e9\u5956\u52b1",
      u42: "\u5361\u724c",
      u43: "\u795e\u5668",
      u44: "\u88c5\u5907",
      u45: "\u6280\u80fd",
      u46: "\u7269\u54c1",
      u47: "\u5929\u8d4b",
      u48: "\u5347\u7ea7",
      u49: "\u94c1\u5854",
      u50: "\u9e92\u9e9f\u81c2",
      u51: "\u5e78\u8fd0\u513f",
      u52: "\u83b7\u5f97",
      u53: "\u6240\u6709\u82f1\u96c4\u5931\u53bb5%\u57fa\u7840\u751f\u547d\u4e0a\u9650",
      u54: "\u66b4\u51fb\u4f24\u5bb3:{num}",
      u55: "\u8bbe\u7f6e",
      u56: "\u97f3\u4e50",
      u57: "\u5e27\u7387",
      u58: "\u5f00",
      u59: "\u5173",
      u60: "60\u5e27",
      u61: "30\u5e27",
      u62: "\u5e27\u7387\u663e\u793a",
      u63: "\u97f3\u6548\u5f00\u5173\u6682\u65f6\u4e0d\u53ef\u7528",
      u64: "\u65b0\u6e38\u620f",
      u65: "\u7ee7\u7eed\u6e38\u620f",
      u66: "\u4e39\u9752\u7ed8\u5377",
      u67: "\u79bb\u5f00\u6e38\u620f",
      u68: "\u9700\u6c42\u5b54\u6d1e:{num}",
      u69: "\u5b54\u6d1e\u4e0d\u8db3\u54e6\uff0c\u9700\u8981{num}\u4e2a\u5b54\u6d1e\u624d\u80fd\u88c5\u5907",
      u70: "\u88c5\u5907\u6280\u80fd\uff1a",
      u71: "\u672a\u6dfb\u52a0\u88c5\u5907\uff0c\u70b9\u51fb\u88c5\u5907\u6309\u94ae\u524d\u5f80\u6dfb\u52a0",
      u72: "\u97f3\u6548",
      u73: "\u57ce\u9547",
      u74: "\u56de\u590d\uff08\u56de\u590d20%\u8840\u91cf\uff09",
      u75: "\u7b2c{num}\u5c42",
      u76: "\u7b2c{num}\u9636\u6bb5",
      u77: "\u56fe\u9274",
      u78: "\u96be\u5ea6",
      u79: "\u4eba\u7269",
      u80: "\u4e8b\u4ef6",
      u81: "\u7cbe\u82f1",
      u82: "Boss",
      u83: "\u901a\u7528",
      u84: "\u6218\u58eb",
      u85: "\u6cd5\u5e08",
      u86: "\u5546\u4eba",
      u87: "\u7ea2",
      u88: "\u84dd",
      u89: "\u7eff",
      u90: "\u7d2b",
      u91: "\u6a59",
      u92: "\u672a\u89e3\u9501",
      u93: "\u4f7f\u7528",
      u94: "\u4e22\u5f03",
      u95: "\u6500\u722c\u7684\u5c42\u6570",
      u96: "\u51fb\u6740\u7684\u602a\u7269\u6570",
      u97: "\u51fb\u6740\u666e\u901a\u602a",
      u98: "\u51fb\u6740\u7cbe\u82f1\u602a",
      u99: "\u51fb\u6740BOSS\u602a",
      u100: "\u89e3\u9501",
      u101: "\u518d\u73a9\u4e00\u6b21",
      u102: "\u603b\u5206",
      u103: "\u88ab\u52a8\u6280\uff1a",
      u104: "\u4e3b\u52a8\u6280\uff1a",
      u105: "\u66f4\u6362",
      u106: "\u88c5\u5907\u953b\u9020",
      u107: "\u8bf7\u9009\u62e9\u60f3\u8981\u5347\u7ea7\u7684\u88c5\u5907",
      u108: "\u953b\u9020\u6210\u529f",
      u109: "\u5f53\u524d\u72b6\u6001\u4e0b\u65e0\u6cd5\u4f7f\u7528",
      u110: "\u56de\u590d\u8840\u91cf{num}",
      u111: "\u6263\u9664\u8840\u91cf{num}",
      u112: "\u8840\u91cf\u5df2\u5168\u90e8\u6062\u590d",
      u113: "\u5931\u53bb",
      u114: "\u66f4\u6362\u6210\u529f",
      c1: "\u6280\u80fd\u51b7\u5374",
      c2: "\u6bcf\u6d88\u966410\u4e2a\u5251\u989d\u5916\u589e\u52a0\u6280\u80fd\u80fd\u91cf5",
      c3: "\u6bcf\u6d88\u966410\u4e2a\u5f13\u989d\u5916\u589e\u52a0\u6280\u80fd\u80fd\u91cf5",
      c4: "\u6bcf\u6d88\u966410\u4e2a\u9b54\u6cd5\u5e3d\u989d\u5916\u589e\u52a0\u6280\u80fd\u80fd\u91cf5",
      c5: "\u6bcf\u6d88\u966410\u4e2a\u7231\u5fc3\u989d\u5916\u589e\u52a0\u6280\u80fd\u80fd\u91cf5",
      c6: "\u6bcf\u6d88\u966410\u4e2a\u76fe\u989d\u5916\u589e\u52a0\u6280\u80fd\u80fd\u91cf5",
      c7: "\u8840\u91cf\u56de\u590d",
      c8: "\u56de\u5408\u5f00\u59cb\u56de\u590d\u603b\u56de\u590d\u529b50%\u7684\u8840\u91cf",
      c9: "\u9632\u5fa1\u56de\u590d",
      c10: "\u56de\u5408\u5f00\u59cb\u56de\u590d\u603b\u56de\u590d\u529b50%\u7684\u683c\u6321",
      c11: "\u6d88\u9664\u653b\u51fb",
      c12: "\u6bcf\u6d88\u966410\u4e2a\u5251\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c13: "\u6bcf\u6d88\u966410\u4e2a\u5f13\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c14: "\u6bcf\u6d88\u966410\u4e2a\u9b54\u6cd5\u5e3d\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c15: "\u6bcf\u6d88\u966410\u4e2a\u7231\u5fc3\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c16: "\u6bcf\u6d88\u966410\u4e2a\u76fe\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c17: "\u6d88\u9664\u6655\u7729",
      c18: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc75\u4e2a\u5251\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c19: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc75\u4e2a\u5f13\u7bad\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c20: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc75\u4e2a\u9b54\u6cd5\u5e3d\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c21: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc75\u4e2a\u7231\u5fc3\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c22: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc75\u4e2a\u76fe\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c23: "\u6d88\u9664\u4e2d\u6bd2",
      c24: "\u6bcf\u6d88\u966410\u4e2a\u5251\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c25: "\u6bcf\u6d88\u966410\u4e2a\u5f13\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c26: "\u6bcf\u6d88\u966410\u4e2a\u9b54\u6cd5\u5e3d\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c27: "\u6bcf\u6d88\u966410\u4e2a\u7231\u5fc3\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c28: "\u6bcf\u6d88\u966410\u4e2a\u76fe\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c29: "\u8fde\u51fb",
      c30: "\u6bcf\u6b21\u6d88\u9664\u884c\u52a8\u8fc7\u540e\u670910%\u7684\u51e0\u7387\u518d\u6b21\u8fdb\u884c\u76f8\u540c\u7684\u884c\u52a8",
      c31: "\u6280\u80fd\u51b7\u53741",
      c32: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e4\u7684\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c33: "\u8f6c\u6362",
      c34: "\u6240\u6709\u653b\u51fb\u529b\u5168\u90e8\u8f6c\u6362\u6210\u56de\u590d\u529b",
      c35: "\u514d\u4f24",
      c36: "\u6bcf\u53d7\u4f245\u6b21\u514d\u53d71\u6b21\u4f24\u5bb3",
      c37: "\u795e\u4f51",
      c38: "\u6b7b\u4ea1\u4ee5\u540e\u7acb\u5373\u590d\u6d3b\u5e76\u4e14\u56de\u590d\u6240\u6709\u8840\uff0c\u53ea\u80fd\u89e6\u53d1\u4e00\u6b21\uff08\u795e\u5668\u6bc1\u574f\uff09",
      c39: "Boss\u514b\u661f",
      c40: "\u6765\u6e90\u4e8eboss\u7c7b\u602a\u7269\u4f24\u5bb3\u51cf\u5c1150%",
      c41: "\u4e2d\u6bd2",
      c42: "\u6bcf\u5c42\u89d2\u8272\u653b\u51fb\u529b\u603b\u548c\u768410%\u4f24\u5bb3",
      c43: "\u6655\u7729",
      c44: "\u6655\u7729\u56de\u5408\u65e0\u6cd5\u884c\u52a8",
      c45: "\u653b\u51fb\u529b\u589e\u52a0{number}\u70b9",
      c46: "\u6062\u590d\u529b\u589e\u52a0{number}\u70b9",
      c47: "\u66b4\u51fb\u7387\u589e\u52a0{number}%",
      c48: "\u66b4\u51fb\u4f24\u5bb3\u589e\u52a0{number}%",
      c49: "HP\u4e0a\u9650\u589e\u52a0{number}%",
      c50: "\u9632\u5fa1\u4e0a\u9650\u589e\u52a0{number}%",
      c51: "\u521d\u59cb\u8840\u91cf\u7684{number}%\u589e\u52a0\u81f3\u521d\u59cb\u683c\u6321",
      c52: "\u4f24\u5bb3\u503c\u7684{number}%\u5438\u53d6\u6210\u8840\u91cf",
      c53: "\u56de\u590d\u91cf\u7684{number}%\u8f6c\u5316\u6210\u4f24\u5bb3",
      c54: "\u6d88\u9664\u6280\u80fd\u80fd\u91cf\u989d\u5916+{number}",
      c55: "\u6d88\u9664\u653b\u51fb\u5e26\u6765{val}%\u51e0\u7387\u6655\u7729",
      c56: "\u6bcf\u6b21\u6d88\u9664\u653b\u51fb\u9644\u5e26{number}\u5c42\u4e2d\u6bd2",
      c57: "\u80fd\u91cf\u4e0a\u9650\u51cf\u5c11{number}",
      c58: "\u56de\u590d\u603b\u56de\u590d\u529b{number}%\u7684\u8840\u91cf",
      c59: "\u56de\u590d\u603b\u56de\u590d\u529b{number}%\u7684\u9632\u5fa1",
      c60: "\u9020\u6210{number}%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c61: "\u6d88\u9664\u540e{val}%\u7684\u51e0\u7387\u518d\u6b21\u884c\u52a8",
      c62: "{number}%\u653b\u51fb\u529b\u5168\u90e8\u8f6c\u6362\u6210\u56de\u590d\u529b",
      c63: "\u6bcf\u53d7{val}\u6b21\u4f24\u5bb3\u514d\u75ab\u4f24\u5bb3{number}\u56de\u5408",
      c64: "\u590d\u6d3b\u6062\u590d{number}%",
      c65: "boss\u7c7b\u53d7\u5230\u4f24\u5bb3\u51cf\u5c11{number}%",
      c66: "\u51cf\u5c11\u5251\u7c7b\u578b\u4f24\u5bb3{number}%",
      c67: "\u51cf\u5c11\u5f13\u7bad\u7c7b\u578b\u4f24\u5bb3{number}%",
      c68: "\u51cf\u5c11\u9b54\u6cd5\u5e3d\u7c7b\u578b\u4f24\u5bb3{number}%",
      c69: "\u51cf\u5c11\u4e2d\u6bd2\u7c7b\u578b\u4f24\u5bb3{number}%",
      c70: "\u7cbe\u82f1\u7c7b\u53d7\u5230\u4f24\u5bb3\u51cf\u5c11{number}%",
      c71: "\u6240\u6709\u602a\u7269\u53d7\u5230\u4f24\u5bb3\u51cf\u5c11{number}%",
      c72: "\u89d2\u8272\u653b\u51fb\u529b\u603b\u548c\u7684{number}%\u4f24\u5bb3*\u76ee\u524d\u7684\u5c42\u6570",
      c73: "\u602a\u7269\u4e0d\u884c\u52a8{number}\u56de\u5408",
      c74: "\u6d88\u9664{val}\u5251\u5757\u6280\u80fd\u80fd\u91cf+{number}",
      c75: "\u6d88\u9664{val}\u5f13\u5757\u6280\u80fd\u80fd\u91cf+{number}",
      c76: "\u6d88\u9664{val}\u9b54\u6cd5\u5e3d\u5757\u6280\u80fd\u80fd\u91cf+{number}",
      c77: "\u6d88\u9664{val}\u7231\u5fc3\u5757\u6280\u80fd\u80fd\u91cf+{number}",
      c78: "\u6d88\u9664{val}\u76fe\u5757\u6280\u80fd\u80fd\u91cf+{number}",
      c79: "\u6d88\u9664{val}\u5251\u5757\u9020\u6210{number}%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c80: "\u6d88\u9664{val}\u5f13\u5757\u9020\u6210{number}%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c81: "\u6d88\u9664{val}\u9b54\u6cd5\u5e3d\u5757\u9020\u6210{number}%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c82: "\u6d88\u9664{val}\u7231\u5fc3\u5757\u9020\u6210{number}%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c83: "\u6d88\u9664{val}\u76fe\u5757\u9020\u6210{number}%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c84: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc7{val}\u4e2a\u5251\u5757\u9020\u6210\u968f\u673a\u654c\u4eba\u6655\u7729{number}\u56de\u5408",
      c85: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc7{val}\u4e2a\u5f13\u7bad\u5757\u9020\u6210\u968f\u673a\u654c\u4eba\u6655\u7729{number}\u56de\u5408",
      c86: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc7{val}\u4e2a\u9b54\u6cd5\u5e3d\u5757\u9020\u6210\u968f\u673a\u654c\u4eba\u6655\u7729{number}\u56de\u5408",
      c87: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc7{val}\u4e2a\u7231\u5fc3\u5757\u9020\u6210\u968f\u673a\u654c\u4eba\u6655\u7729{number}\u56de\u5408",
      c88: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc7{val}\u4e2a\u76fe\u5757\u9020\u6210\u968f\u673a\u654c\u4eba\u6655\u7729{number}\u56de\u5408",
      c89: "\u6d88\u9664{val}\u5251\u5757\u5bf9\u968f\u673a\u654c\u4eba\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c90: "\u6d88\u9664{val}\u5f13\u5757\u5bf9\u968f\u673a\u654c\u4eba\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c91: "\u6d88\u9664{val}\u9b54\u6cd5\u5e3d\u5757\u5bf9\u968f\u673a\u654c\u4eba\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c92: "\u6d88\u9664{val}\u7231\u5fc3\u5757\u5bf9\u968f\u673a\u654c\u4eba\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c93: "\u6d88\u9664{val}\u76fe\u5757\u5bf9\u968f\u673a\u654c\u4eba\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c94: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e{val}\u7684\u5251\u5757\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757{number}",
      c95: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e{val}\u7684\u5f13\u5757\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757{number}",
      c96: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e{val}\u7684\u9b54\u6cd5\u5e3d\u5757\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757{number}",
      c97: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e{val}\u7684\u7231\u5fc3\u5757\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757{number}",
      c98: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e{val}\u7684\u76fe\u5757\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757{number}",
      c99: "\u514d\u75ab\u4f24\u5bb3{number}\u56de\u5408",
      c100: "\u521d\u59cb\u683c\u6321\u589e\u52a0{number}",
      c101: "\u88c5\u59071",
      c102: "\u653b\u51fb\u529b\u589e\u52a05\u70b9",
      c103: "\u88c5\u59072",
      c104: "\u88c5\u59073",
      c105: "\u88c5\u59074",
      c106: "\u6062\u590d\u529b\u589e\u52a05\u70b9",
      c107: "\u88c5\u59075",
      c108: "\u88c5\u59076",
      c109: "\u6240\u6709\u4f24\u5bb3\u503c\u768415%\u5438\u53d6\u6210\u8840\u91cf",
      c110: "\u88c5\u59077",
      c111: "\u88c5\u59078",
      c112: "\u88c5\u59079",
      c113: "\u6240\u6709\u56de\u590d\u91cf\u768415%\u8f6c\u5316\u6210\u4f24\u5bb3",
      c114: "\u88c5\u590710",
      c115: "\u88c5\u590711",
      c116: "\u66b4\u51fb\u7387\u589e\u52a030%",
      c117: "\u88c5\u590712",
      c118: "\u88c5\u590713",
      c119: "\u88c5\u590714",
      c120: "\u88c5\u590715",
      c121: "\u88c5\u590716",
      c122: "\u6bcf\u6b21\u6d88\u9664\u9020\u621010%\u51e0\u7387\u6655\u7729",
      c123: "\u88c5\u590717",
      c124: "\u88c5\u590718",
      c125: "\u88c5\u590719",
      c126: "\u88c5\u590720",
      c127: "\u88c5\u590721",
      c128: "\u8840\u91cf\u768415%\u589e\u52a0\u81f3\u683c\u6321",
      c129: "\u88c5\u590722",
      c130: "\u88c5\u590723",
      c131: "\u88c5\u590724",
      c132: "\u88c5\u590725",
      c133: "\u88c5\u590726",
      c134: "\u6bcf\u6b21\u6d88\u9664\u6280\u80fd\u80fd\u91cf\u989d\u5916+1",
      c135: "\u88c5\u590727",
      c136: "\u88c5\u590728",
      c137: "\u88c5\u590729",
      c138: "\u88c5\u590730",
      c139: "\u88c5\u590731",
      c140: "\u66b4\u51fb\u4f24\u5bb3\u589e\u52a0100%",
      c141: "\u88c5\u590732",
      c142: "\u88c5\u590733",
      c143: "\u88c5\u590734",
      c144: "\u88c5\u590735",
      c145: "\u88c5\u590736",
      c146: "\u6bcf\u6b21\u6d88\u9664\u5e261\u5c42\u4e2d\u6bd2",
      c147: "\u88c5\u590737",
      c148: "\u88c5\u590738",
      c149: "\u88c5\u590739",
      c150: "\u88c5\u590740",
      c151: "\u88c5\u590741",
      c152: "HP\u4e0a\u9650\u589e\u52a030%",
      c153: "\u88c5\u590742",
      c154: "\u88c5\u590743",
      c155: "\u88c5\u590744",
      c156: "\u88c5\u590745",
      c157: "\u88c5\u590746",
      c158: "\u683c\u6321\u4e0a\u9650\u589e\u52a020%",
      c159: "\u88c5\u590747",
      c160: "\u88c5\u590748",
      c161: "\u88c5\u590749",
      c162: "\u88c5\u590750",
      c163: "\u88c5\u590751",
      c164: "\u521d\u59cb\u683c\u6321\u589e\u52a050",
      c165: "\u88c5\u590752",
      c166: "\u88c5\u590753",
      c167: "\u88c5\u590754",
      c168: "\u88c5\u590755",
      c169: "\u91d1\u5e01",
      c170: "\u53ef\u4ee5\u5728\u5546\u5e97\u8d2d\u4e70\u82f1\u96c4\u6280\u80fd\u54e6\uff01",
      c171: "\u6280\u80fd",
      c172: "\u5728\u82f1\u96c4\u754c\u9762\u53ef\u4ee5\u88c5\u5907\u7ed9\u82f1\u96c4\u54e6\uff01",
      c173: "\u88c5\u5907",
      c174: "\u88c5\u5907\u4e0d\u7528\u591a\u8bf4\u4e86\u5427\uff01",
      c175: "\u795e\u5668",
      c176: "\u4e0d\u591a\u8bf4\uff0c\u5c31\u662f\u725bB\uff01",
      c177: "\u602a\u72691",
      c178: "\u53bb\u6b7b\u5427\uff01",
      c179: "\u602a\u72692",
      c180: "\u602a\u72693",
      c181: "\u5206\u88c2\u602a\u7269",
      c182: "\u5206\u88c2\u5c0f\u602a\u72691",
      c183: "\u5206\u88c2\u5c0f\u602a\u72692",
      c184: "\u602a\u72694",
      c185: "\u602a\u72695",
      c186: "\u602a\u72696",
      c187: "\u602a\u72697",
      c188: "\u4eba\u9c7cboss",
      c189: "\u53ec\u5524\u4eba\u9c7c1",
      c190: "\u53ec\u5524\u4eba\u9c7c2",
      c191: "\u666e\u901a\u653b\u51fb",
      c192: "\u9020\u6210400%\u4f24\u5bb3",
      c193: "\u9501\u94fe\u51fb",
      c194: "\u9020\u6210500%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a0\u4e00\u4e2a\u9501\u94fe\u5757",
      c195: "\u4e2d\u6bd2\u51fb",
      c196: "\u9020\u6210500%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u4e2d\u6bd2\u5757\u6d88\u9664\u65f6\u6bcf\u4e2a\u9020\u6210100%\u4f24\u5bb3",
      c197: "\u56de\u590d",
      c198: "\u56de\u590d300%\u7684\u8840\u91cf",
      c199: "\u683c\u6321",
      c200: "\u589e\u52a0300%\u7684\u683c\u6321",
      c201: "\u53e0\u6d6a\u51fb",
      c202: "\u9020\u6210200%\u4f24\u5bb3*\u884c\u52a8\u6b21\u6570",
      c203: "\u5c01\u5370\u51fb",
      c204: "\u9020\u6210100%\u4f24\u5bb3\uff0c\u5c01\u5370\u5251\u57573\u56de\u5408(\u7729\u6655)",
      c205: "\u5206\u88c21",
      c206: "\u5206\u88c2\u6307\u5b9a\u602a\u7269X\u4e2a\uff08\u7ee7\u627f\u5206\u88c2\u8005\u8840\u91cf\uff09\uff0c\u81ea\u5df1\u6b7b\u4ea1",
      c207: "\u53ec\u5524",
      c208: "\u53ec\u5524X\u4e2a\u6307\u5b9a\u602a\u7269",
      c209: "\u5206\u88c22",
      c210: "\u5206\u88c2\u6307\u5b9a\u602a\u7269X\u4e2a\uff08\u6b63\u5e38\u602a\u7269\uff09\uff0c\u81ea\u5df1\u6b7b\u4ea1",
      c211: "\u81ea\u6740",
      c212: "\u5bf9\u81ea\u5df1\u9020\u6210\u5168\u90e8\u8840\u91cf\u4f24\u5bb3",
      c213: "\u9020\u6210100%\u4f24\u5bb3\uff0c\u5c01\u5370\u9b54\u6cd5\u57573\u56de\u5408(\u7729\u6655)",
      c214: "\u51b0\u5757\u51fb",
      c215: "\u9020\u6210600%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a0\u4e00\u4e2a\u51b0\u5757",
      c216: "\u884c\u52a810\u6b21\u4ee5\u540e\u602a\u7269\u6b7b\u4ea1",
      c217: "\u5c11\u4e8e50%\u8840\u91cf\u540e\u5206\u88c2",
      c218: "\u6ca1\u6709\u5c0f\u5f1f\u540e\u53ec\u5524",
      c219: "\u82f1\u96c41",
      c220: "\u82f1\u96c42",
      c221: "\u82f1\u96c43",
      c222: "\u82f1\u96c44",
      c223: "\u82f1\u96c45",
      c224: "\u6ca7\u6d6a\u51fb",
      c225: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101000%\u7684\u4f24\u5bb3",
      c226: "\u8ffd\u661f\u7bad\xa0",
      c227: "\u66b4\u98ce\u51fb",
      c228: "\u7231\u5fc3\u6cdb\u6ee5",
      c229: "\u6062\u590d\u529b1000%\u7684\u8840\u91cf",
      c230: "\u65e0\u654c\u4e4b\u76fe",
      c231: "\u6062\u590d\u529b1000%\u7684\u683c\u6321",
      c232: "\u6655\u7729\u51fb",
      c233: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101000%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c234: "\u8f6c\u5316\u7231\u5fc3",
      c235: "\u8f6c\u5316\u68cb\u76d8\u4e0a10\u5251\u5757\u4e3a\u52514",
      c236: "\u8f6c\u5316\u68cb\u76d8\u4e0a10\u5f13\u7bad\u5757\u4e3a\u5f13\u7bad4",
      c237: "\u8f6c\u5316\u68cb\u76d8\u4e0a10\u9b54\u6cd5\u5757\u4e3a\u9b54\u6cd54",
      c238: "\u8f6c\u5316\u76fe",
      c239: "\u590d\u6bd2\u673a",
      c240: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101000%\u7684\u4f24\u5bb3\u9644\u52a0\u4e2d\u6bd2\u5c42\u65702\u5c42",
      c241: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u7231\u5fc3\u4e3a\u4e07\u80fd\u5757",
      c242: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u76fe\u5757\u4e3a\u4e07\u80fd\u5757",
      c243: "\u4e2d\u6bd2\u7ffb\u500d",
      c244: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210800%\u7684\u4f24\u5bb3\u4f7f\u602a\u7269\u4e2d\u6bd2\u5c42\u6570\u7ffb\u500d",
      c245: "\u8f6c\u5316\u68cb\u76d8\u4e0a10\u7231\u5fc3\u5757\u4e3a\u7231\u5fc34",
      c246: "\u8f6c\u5316\u68cb\u76d8\u4e0a10\u76fe\u724c\u5757\u4e3a\u76fe\u724c4",
      c247: "\u635f\u8840\u51fb",
      c248: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101000%\u7684\u4f24\u5bb3\u9644\u52a0\u635f\u5931\u8840\u91cf\u768430%",
      c249: "\u76fe\u51fb",
      c250: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101000%\u7684\u4f24\u5bb3\u9644\u52a0\u62e5\u6709\u683c\u6321\u503c\u768430%",
      c251: "\u7ea2\u725b",
      c252: "\u968f\u673a\u589e\u52a0\u804c\u4e1a\u6280\u80fd\u80fd\u91cf20",
      c253: "\u9020\u6210100%\u4f24\u5bb3*\u884c\u52a8\u6b21\u6570",
      c254: "HP\u4e0a\u9650\u51cf\u5c11{number}%",
      c255: "\u91d1\u94b1\u5974\u96b6",
      c256: "\u505a\u91d1\u94b1\u7684\u5974\u96b6\u5427\u3002\u83b7\u5f97200\u91d1\u5e01",
      c257: "\u5931\u53bb200\u91d1\u5e01\u3002\u83b7\u5f971\u4e2a\u795e\u5668",
      c258: "\u79bb\u5f00",
      c259: "\u6597\u725b\u573a",
      c260: "\u52c7\u58eb\uff0c\u548c\u7cbe\u82f1\u602a\u8fdb\u884c\u6218\u6597\uff0c\u83b7\u5f97\u80dc\u5229\u540e\u4f1a\u83b7\u5f97\u4e00\u4ef6\u795e\u5668\u3002",
      c261: "\u61e6\u592b\uff0c\u8ba4\u8f93\u79bb\u5f00\uff0c\u6240\u6709\u82f1\u96c4\u5931\u53bb5%\u57fa\u7840\u751f\u547d\u4e0a\u9650\u3002",
      c262: "\u8d4c\u535a\uff0c50%\u51e0\u7387\u83b7\u5f97200\u91d1\u5e01\uff0c50%\u51e0\u7387\u5931\u53bb200\u91d1\u5e01",
      c263: "\u6bcf\u6d88\u966410\u4e2a\u5251\u989d\u5916\u589e\u52a0\u5251\u6280\u80fd\u80fd\u91cf5",
      c264: "\u6bcf\u6d88\u966410\u4e2a\u5f13\u989d\u5916\u589e\u52a0\u5f13\u6280\u80fd\u80fd\u91cf5",
      c265: "\u6bcf\u6d88\u966410\u4e2a\u9b54\u6cd5\u5e3d\u989d\u5916\u589e\u52a0\u9b54\u6cd5\u5e3d\u6280\u80fd\u80fd\u91cf5",
      c266: "\u6bcf\u6d88\u966410\u4e2a\u7231\u5fc3\u989d\u5916\u589e\u52a0\u7231\u5fc3\u6280\u80fd\u80fd\u91cf5",
      c267: "\u6bcf\u6d88\u966410\u4e2a\u76fe\u989d\u5916\u589e\u52a0\u76fe\u6280\u80fd\u80fd\u91cf5",
      c268: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210300%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c269: "\u5929\u8d4b\u70b9",
      c270: "\u53ef\u4ee5\u5728\u5929\u8d4b\u7cfb\u7edf\u4e2d\u589e\u52a0\u73a9\u5bb6\u7684\u5929\u8d4b\u5c5e\u6027\u54e6\uff01",
      c271: "\u8d4c\u535a\uff0c50%\u51e0\u7387\u83b7\u5f97200\u91d1\u5e01\uff0c50%\u51e0\u7387\u5931\u53bb200\u91d1\u5e01\u3002",
      c272: "\u8d8a\u6218\u8d8a\u52c7",
      c273: "\u6062\u590d\u5168\u90e8\u8840\u3002",
      c274: "\u6240\u6709\u82f1\u96c4\u653b\u51fb\u529b\u589e\u52a02\u70b9\u3002",
      c275: "\u57fa\u7840\u8840\u91cf\u4e0a\u9650\u589e\u52a0{number}",
      c276: "\u57fa\u7840\u653b\u51fb\u589e\u52a0{number}",
      c277: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a0{number}%",
      c278: "\u91d1\u5e01\u6389\u843d\u589e\u52a0{number}%",
      c279: "\u57fa\u7840\u8840\u91cf",
      c280: "\u521d\u59cb\u683c\u6321\u503c",
      c281: "\u57fa\u7840\u653b\u51fb",
      c282: "\u4e2d\u6bd2\u4f24\u5bb3",
      c283: "\u91d1\u5e01\u6389\u843d",
      c284: "\u66b4\u51fb\u7387",
      c285: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a0",
      c286: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a010\uff08\u4e0b\u4e00\u7ea715\uff09",
      c287: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a015\uff08\u4e0b\u4e00\u7ea720\uff09",
      c288: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a020\uff08\u4e0b\u4e00\u7ea725\uff09",
      c289: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a025\uff08\u4e0b\u4e00\u7ea730\uff09",
      c290: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a030\uff08max\uff09",
      c291: "\u6240\u6709\u82f1\u96c4\u521d\u59cb\u683c\u6321\u503c\u589e\u52a0",
      c292: "\u6240\u6709\u82f1\u96c4\u521d\u59cb\u683c\u6321\u503c\u589e\u52a010\uff08\u4e0b\u4e00\u7ea715\uff09",
      c293: "\u6240\u6709\u82f1\u96c4\u521d\u59cb\u683c\u6321\u503c\u589e\u52a015\uff08\u4e0b\u4e00\u7ea720\uff09",
      c294: "\u6240\u6709\u82f1\u96c4\u521d\u59cb\u683c\u6321\u503c\u589e\u52a020\uff08\u4e0b\u4e00\u7ea725\uff09",
      c295: "\u6240\u6709\u82f1\u96c4\u521d\u59cb\u683c\u6321\u503c\u589e\u52a025\uff08\u4e0b\u4e00\u7ea730\uff09",
      c296: "\u6240\u6709\u82f1\u96c4\u521d\u59cb\u683c\u6321\u503c\u589e\u52a030\uff08max\uff09",
      c297: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a0",
      c298: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a01\u70b9\uff08\u4e0b\u4e00\u7ea72\uff09",
      c299: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a02\u70b9\uff08\u4e0b\u4e00\u7ea73\uff09",
      c300: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a03\u70b9\uff08\u4e0b\u4e00\u7ea74\uff09",
      c301: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a04\u70b9\uff08\u4e0b\u4e00\u7ea75\uff09",
      c302: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a05\u70b9\uff08max\uff09",
      c303: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a0",
      c304: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a010%\uff08\u4e0b\u4e00\u7ea715%\uff09",
      c305: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a015%\uff08\u4e0b\u4e00\u7ea720%\uff09",
      c306: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a020%\uff08\u4e0b\u4e00\u7ea725%\uff09",
      c307: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a025%\uff08\u4e0b\u4e00\u7ea730%\uff09",
      c308: "\u4e2d\u6bd2\u4f24\u5bb3\u589e\u52a030%\uff08max\uff09",
      c309: "\u91d1\u5e01\u6389\u843d\u589e\u52a0",
      c310: "\u91d1\u5e01\u6389\u843d\u589e\u52a010%\uff08\u4e0b\u4e00\u7ea720%\uff09",
      c311: "\u91d1\u5e01\u6389\u843d\u589e\u52a020%\uff08\u4e0b\u4e00\u7ea730%\uff09",
      c312: "\u91d1\u5e01\u6389\u843d\u589e\u52a030%\uff08\u4e0b\u4e00\u7ea740%\uff09",
      c313: "\u91d1\u5e01\u6389\u843d\u589e\u52a040%\uff08\u4e0b\u4e00\u7ea750%\uff09",
      c314: "\u91d1\u5e01\u6389\u843d\u589e\u52a050%\uff08max\uff09",
      c315: "\u6240\u6709\u82f1\u96c4\u66b4\u51fb\u7387\u589e\u52a0",
      c316: "\u6240\u6709\u82f1\u96c4\u66b4\u51fb\u7387\u589e\u52a05%\uff08\u4e0b\u4e00\u7ea710%\uff09",
      c317: "\u6240\u6709\u82f1\u96c4\u66b4\u51fb\u7387\u589e\u52a010%\uff08\u4e0b\u4e00\u7ea715%\uff09",
      c318: "\u6240\u6709\u82f1\u96c4\u66b4\u51fb\u7387\u589e\u52a015%\uff08\u4e0b\u4e00\u7ea720%\uff09",
      c319: "\u6240\u6709\u82f1\u96c4\u66b4\u51fb\u7387\u589e\u52a020%\uff08\u4e0b\u4e00\u7ea725%\uff09",
      c320: "\u6240\u6709\u82f1\u96c4\u66b4\u51fb\u7387\u589e\u52a025%\uff08max\uff09",
      c321: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a0<color=#00ff00>10</c>\uff08\u4e0b\u4e00\u7ea7<color=#00ffff>15</c>\uff09",
      c322: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a0<color=#00ff00>15</c>\uff08\u4e0b\u4e00\u7ea7<color=#00ffff>20</c>\uff09",
      c323: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a0<color=#00ff00>20</c>\uff08\u4e0b\u4e00\u7ea7<color=#00ffff>25</c>\uff09",
      c324: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u751f\u547d\u503c\u4e0a\u9650\u589e\u52a0<color=#00ff00>25</c>\uff08\u4e0b\u4e00\u7ea7<color=#00ffff>30</c>\uff09",
      c325: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e4\u7684\u5251\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c326: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e4\u7684\u5f13\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c327: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e4\u7684\u65a7\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c328: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e4\u7684\u7231\u5fc3\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c329: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e4\u7684\u76fe\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c330: "\u653b\u51fb\u529b\u589e\u52a015\u70b9",
      c331: "\u6062\u590d\u529b\u589e\u52a015\u70b9",
      c332: "\u6240\u6709\u4f24\u5bb3\u503c\u768445%\u5438\u53d6\u6210\u8840\u91cf",
      c333: "\u6240\u6709\u56de\u590d\u91cf\u768445%\u8f6c\u5316\u6210\u4f24\u5bb3",
      c334: "\u66b4\u51fb\u7387\u589e\u52a040%",
      c335: "\u6bcf\u6b21\u6d88\u966420%\u51e0\u7387\u9020\u6210\u6655\u7729",
      c336: "\u8840\u91cf\u768430%\u589e\u52a0\u81f3\u683c\u6321",
      c337: "\u6bcf\u6b21\u76f8\u5e94\u7684\u6d88\u9664\u6280\u80fd\u80fd\u91cf\u989d\u5916+3",
      c338: "\u6bcf\u6b21\u6d88\u9664\u5e262\u5c42\u4e2d\u6bd2",
      c339: "\u683c\u6321\u4e0a\u9650\u589e\u52a030%",
      c340: "\u6bcf\u5c42\u89d2\u8272\u653b\u51fb\u529b\u603b\u548c\u768450%\u4f24\u5bb3",
      c341: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a02\u70b9\uff08\u4e0b\u4e00\u7ea74\uff09",
      c342: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a04\u70b9\uff08\u4e0b\u4e00\u7ea76\uff09",
      c343: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a06\u70b9\uff08\u4e0b\u4e00\u7ea78\uff09",
      c344: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a08\u70b9\uff08\u4e0b\u4e00\u7ea710\uff09",
      c345: "\u6240\u6709\u82f1\u96c4\u57fa\u7840\u653b\u51fb\u589e\u52a010\u70b9\uff08max\uff09",
      c346: "\u9020\u6210400%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a0\u4e00\u4e2a\u9501\u94fe\u5757",
      c347: "\u9020\u6210400%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u4e2d\u6bd2\u5757\u6d88\u9664\u65f6\u6bcf\u4e2a\u9020\u6210100%\u4f24\u5bb3",
      c348: "\u9020\u6210400%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a0\u4e00\u4e2a\u51b0\u5757",
      c349: "\u6bcf\u6d88\u966410\u4e2a\u65a7\u989d\u5916\u589e\u52a0\u9b54\u6cd5\u5e3d\u6280\u80fd\u80fd\u91cf5",
      c350: "\u6bcf\u6d88\u966410\u4e2a\u65a7\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c351: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc75\u4e2a\u65a7\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c352: "\u6bcf\u6d88\u966410\u4e2a\u65a7\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c353: "\u8f6c\u5316\u68cb\u76d8\u4e0a10\u65a7\u5757\u4e3a\u9b54\u6cd54",
      c354: "\u6bcf\u6d88\u966410\u4e2a\u65a7\u989d\u5916\u589e\u52a0\u65a7\u6280\u80fd\u80fd\u91cf5",
      c355: "\u6bcf\u6d88\u966420\u4e2a\u5251\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c356: "\u6bcf\u6d88\u966420\u4e2a\u5f13\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c357: "\u6bcf\u6d88\u966420\u4e2a\u65a7\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c358: "\u6bcf\u6d88\u966420\u4e2a\u7231\u5fc3\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c359: "\u6bcf\u6d88\u966420\u4e2a\u76fe\u5bf9\u968f\u673a\u654c\u4eba\u9020\u6210100%\u603b\u653b\u51fb\u529b\u7684\u4f24\u5bb3",
      c360: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc710\u4e2a\u5251\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c361: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc710\u4e2a\u5f13\u7bad\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c362: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc710\u4e2a\u65a7\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c363: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc710\u4e2a\u7231\u5fc3\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c364: "\u6bcf\u56de\u5408\u6d88\u9664\u8d85\u8fc710\u4e2a\u76fe\u5757\u9020\u6210\u968f\u673a\u5355\u4f53\u654c\u4eba\u6655\u77291\u56de\u5408",
      c365: "\u6bcf\u6d88\u966420\u4e2a\u5251\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c366: "\u6bcf\u6d88\u966420\u4e2a\u5f13\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c367: "\u6bcf\u6d88\u966420\u4e2a\u65a7\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c368: "\u6bcf\u6d88\u966420\u4e2a\u7231\u5fc3\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c369: "\u6bcf\u6d88\u966420\u4e2a\u76fe\u5bf9\u968f\u673a\u5355\u4f53\u654c\u4eba\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c370: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e7\u7684\u5251\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c371: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e7\u7684\u5f13\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c372: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e7\u7684\u65a7\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c373: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e7\u7684\u7231\u5fc3\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c374: "\u6bcf\u6b21\u6709\u5927\u4e8e\u7b49\u4e8e7\u7684\u76fe\u6d88\u9664\u4e34\u65f6\u51cf\u5c11\u76f8\u5e94\u89d2\u8272\u6280\u80fd\u6240\u9700\u5757-1",
      c375: "\u6bcf\u6b21\u6d88\u966415%\u51e0\u7387\u9020\u6210\u6655\u7729",
      c376: "\u9020\u6210300%\u4f24\u5bb3",
      c377: "\u9020\u6210300%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a0\u4e00\u4e2a\u9501\u94fe\u5757",
      c378: "\u9020\u6210300%\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u4e2d\u6bd2\u5757\u6d88\u9664\u65f6\u6bcf\u4e2a\u9020\u6210100%\u4f24\u5bb3",
      c379: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101500%\u7684\u4f24\u5bb3",
      c380: "\u6062\u590d\u529b1500%\u7684\u8840\u91cf",
      c381: "\u6062\u590d\u529b1500%\u7684\u683c\u6321",
      c382: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210500%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c383: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101000%\u7684\u4f24\u5bb3\u9644\u52a0\u4e2d\u6bd2\u5c42\u65705\u5c42",
      c384: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101500%\u7684\u4f24\u5bb3\u9644\u52a0\u635f\u5931\u8840\u91cf\u768430%",
      c385: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u62101500%\u7684\u4f24\u5bb3\u9644\u52a0\u62e5\u6709\u683c\u6321\u503c\u768430%",
      c386: "\u968f\u673a\u589e\u52a0\u804c\u4e1a\u6280\u80fd\u80fd\u91cf75",
      c387: "\u5c0f\u8840\u74f6",
      c388: "\u6218\u6597\u5f00\u59cb\u56de\u590d2\u8840\u91cf",
      c389: "\u76fe\u724c",
      c390: "\u56de\u5408\u5f00\u59cb\u56de\u590d1\u683c\u6321",
      c391: "\u6bd2\u6c14\u6cc4\u6f0f",
      c392: "\u6218\u6597\u5f00\u59cb\u7ed9\u602a\u7269\u589e\u52a03\u5c42\u4e2d\u6bd2",
      c393: "\u6bd2\u6c14",
      c394: "\u56de\u5408\u5f00\u59cb\u7ed9\u602a\u7269\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c395: "\u5143\u7d20\u4e4b\u706b",
      c396: "\u56de\u5408\u5f00\u59cb\u7ed9\u68cb\u76d8\u589e\u52a01\u4e2a\u706b\u5143\u7d20",
      c397: "\u53cd\u7532",
      c398: "\u56de\u5408\u5f00\u59cb\u589e\u52a01\u5c42\u8346\u68d8",
      c399: "\u706b\u653b",
      c400: "\u707c\u70e7\u4f24\u5bb3+1",
      c401: "\u8fde\u51fb\u6d88\u5931",
      c402: "\u8fde\u51fb\u4e0d\u5728\u8fdb\u884c\u8ba1\u7b97\uff0c\u4f24\u5bb3\u500d\u7387\u56fa\u5b9a1.5\u500d",
      c403: "\u7b80\u5355",
      c404: "\u6d88\u9664\u65f6\u95f4\u5ef6\u957f1.2",
      c405: "\u683c\u6321\u5757\u4e0d\u518d\u589e\u52a0\u683c\u6321\uff0c\u6062\u590d\u7c7b\u6280\u80fd\u80fd\u91cf*2",
      c406: "\u8fde\u51fb\u4f24\u5bb3",
      c407: "\u6bcf\u6b21\u6709\u5927\u4e8e5\u7684\u8fde\u51fb\u8fde\u51fb\u4f24\u5bb3\u589e\u52a020%",
      c408: "\u683c\u6321\u4f24\u5bb3",
      c409: "\u6bcf\u83b7\u5f9710\u70b9\u683c\u6321\u5c31\u4f1a\u5bf9\u968f\u673a\u602a\u7269\u9020\u62101\u70b9\u4f24\u5bb3",
      c410: "\u80fd\u91cf\u7ee7\u627f",
      c411: "\u6280\u80fd\u80fd\u91cf\u53ef\u4ee5\u7ee7\u627f\u5230\u4e0b\u6b21\u6218\u6597",
      c412: "\u514d\u75ab\u4f24\u5bb3",
      c413: "\u6bcf\u573a\u6218\u6597\u4e2d\u7b2c\u4e00\u6b21\u53d7\u5230\u7684\u4f24\u5bb3\u514d\u75ab",
      c414: "\u6389\u843d",
      c415: "\u68cb\u76d8\u5237\u65b0\u65f6\u683c\u6321\u5757\u6389\u843d\u6982\u7387\u589e\u52a010%",
      c416: "\u66b4\u51fb\u4e2d\u6bd2",
      c417: "\u6bcf\u6b21\u66b4\u51fb\u5e26\u67653\u5c42\u4e2d\u6bd2",
      c418: "\u66b4\u51fb\u6655\u7729",
      c419: "\u6bcf\u6b21\u66b4\u51fb\u5e26\u67651\u5c42\u6655\u7729",
      c420: "\u9e21\u8840",
      c421: "\u653b\u51fb\u529b\u589e\u52a0200%,\u602a\u7269\u5c06\u63d0\u524d\u4e00\u56de\u5408\u884c\u52a8",
      c422: "\u7cbe\u82f1\u6740\u624b",
      c423: "\u7cbe\u82f1\u602a\u7269\u8840\u91cf\u51cf\u5c1125%",
      c424: "\u8fde\u51fb\u4e2d\u6bd2",
      c425: "\u6bcf\u6b21\u8fde\u51fb\u6570\u8d85\u8fc76\u540e\uff0c\u653b\u51fb\u4f1a\u9644\u5e261\u5c42\u4e2d\u6bd2",
      c426: "\u6218\u6597\u7ed3\u675f\u8840\u91cf\u4f4e\u4e8e50%\u5219\u56de\u590d10%\u7684\u8840\u91cf",
      c427: "\u6492\u5e01",
      c428: "\u6389\u843d\u7684\u91d1\u5e01\u589e\u52a020%",
      c429: "\u5546\u5e97\u8d2d\u4e707\u6298",
      c430: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u56de\u590d1\u70b9\u8840",
      c431: "\u6bcf\u6b21\u653b\u51fb\u65f6\u589e\u52a01\u70b9\u683c\u6321",
      c432: "\u52a0\u5f3a\u5757\u6d88\u9664\u7684\u6570\u91cf\u4f1a\u67091.5\u7684\u52a0\u6210",
      c433: "\u52a0\u5f3a\u5757\u9020\u6210\u7684\u7206\u70b8\u8303\u56f4\u4e3a\u6b63\u65b9\u5f62",
      c434: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e20%\u65f6\u653b\u51fb\u529b\u589e\u52a0+5",
      c435: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e50%\u65f6\u653b\u51fb\u529b\u589e\u52a0+10",
      c436: "\u653b\u51fb\u529b\u589e\u52a0+10",
      c437: "\u6bcf\u6b21\u653b\u51fb\u90fd\u4f1a\u9644\u5e261\u5c42\u4e2d\u6bd2",
      c438: "\u66b4\u51fb\u7387\u589e\u52a010%\uff0c\u540c\u65f6\u9020\u6210\u66b4\u51fb\u4f24\u5bb3\u65f6\u4f1a\u9644\u5e261\u5c42\u4e2d\u6bd2\u3002",
      c439: "\u653b\u51fb\u65f6\u670920%\u7684\u51e0\u7387\u9020\u6210\u8fde\u51fb\uff08\u653b\u51fb\u4e24\u6b21\uff09",
      c440: "\u653b\u51fb\u65f6\u670930%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c441: "\u6280\u80fd\u80fd\u91cf\u521d\u59cb\u503c+2",
      c442: "\u6280\u80fd\u4f24\u5bb3\u589e\u52a0300%",
      c443: "\u8840\u91cf\u6ee1\u65f6\u653b\u51fb\u529b\u589e\u52a0+10",
      c444: "\u653b\u51fb\u529b\u589e\u52a0+5\uff0c30%\u9644\u5e261\u5c42\u865a\u5f31",
      c445: "\u653b\u51fb\u65f6\u670950%\u51e0\u7387\u9644\u5e261\u5c42\u865a\u5f31",
      c446: "\u66b4\u51fb\u65f6\u670910%\u7684\u51e0\u7387\u9020\u6210\u6655\u7729",
      c447: "\u653b\u51fb\u529b+2\uff0c\u670910%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c448: "\u6bcf\u6b21\u6d88\u9664\u5251\u5757\u6570\u91cf+1",
      c449: "\u5251\u5757\u7684\u4f24\u5bb3\u589e\u52a020%",
      c450: "\u521d\u59cb\u68cb\u76d8\u4e2d\u5251\u575750%\u4e3a\u52a0\u5f3a\u5251\u5757\uff08\u5251\u5757*2\uff09",
      c451: "\u5237\u65b0\u7684\u5251\u5757\u670920%\u6982\u7387\u4e3a\u52a0\u5f3a\u5251\u5757",
      c452: "\u8fde\u51fb\u4f24\u5bb3\u589e\u52a010%",
      c453: "\u521d\u59cb\u5757\u4f1a15%\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c454: "\u521d\u59cb\u5757\u4f1a15%\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c455: "\u5237\u65b0\u7684\u57575%\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c456: "\u5237\u65b0\u7684\u57575%\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c457: "\u66b4\u51fb\u6982\u7387\u589e\u52a05%",
      c458: "\u66b4\u51fb\u4f24\u5bb3\u589e\u52a010%",
      c459: "\u5c06\u9020\u6210{num}\u4f24\u5bb3",
      c460: "\u5c06\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a0\u4e00\u4e2a\u9501\u94fe\u5757",
      c461: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u4e2d\u6bd2\u5757\uff08\u6d88\u9664\u65f6\u6bcf\u4e2a\u9020\u62102\u70b9\u4f24\u5bb3\uff09",
      c462: "\u56de\u590d{num}\u7684\u8840\u91cf",
      c463: "\u589e\u52a0{num}\u7684\u683c\u6321",
      c464: "\u9020\u6210{num}\u4f24\u5bb3*\u884c\u52a8\u6b21\u6570",
      c465: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3",
      c466: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u621050%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c467: "\u5bf9\u654c\u65b9\u5168\u4f53\u9020\u621010%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c468: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u5251\u5757\u4e3a\u5251\u5757\u6280\u80fd\u57572",
      c469: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u5f13\u7bad\u5757\u4e3a\u5f13\u7bad\u5757\u6280\u80fd\u57572",
      c470: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u65a7\u5757\u4e3a\u65a7\u5757\u52a0\u5f3a2",
      c471: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u6cd5\u6756\u5757\u4e3a\u6cd5\u6756\u5757\u52a0\u5f3a2",
      c472: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u65b0\u5757\u4e3a\u65b0\u5757\u52a0\u5f3a2",
      c473: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u9644\u52a0\u4e2d\u6bd2\u5c42\u65705\u5c42",
      c474: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u621050%\u7684\u4f24\u5bb3\u4f7f\u602a\u7269\u4e2d\u6bd2\u5c42\u6570\u7ffb\u500d",
      c475: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u9644\u52a0\u635f\u5931\u8840\u91cf\u768430%",
      c476: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u9644\u52a0\u62e5\u6709\u683c\u6321\u503c\u768430%",
      c477: "\u514d\u75ab\u4e0b1\u6b21\u4f24\u5bb3",
      c478: "\u589e\u52a03\u5c42\u8346\u68d8",
      c479: "\u589e\u52a015\u70b9\u683c\u6321",
      c480: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u5982\u679c\u654c\u65b9\u6709\u4e2d\u6bd2\u5219\u4f24\u5bb3\u4f24\u5bb3\u4e3a200%",
      c481: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u5982\u679c\u654c\u65b9\u6709\u707c\u70e7\u5219\u4f24\u5bb3\u4f24\u5bb3\u4e3a200%",
      c482: "\u9020\u6210{num}\u4f24\u5bb3",
      c483: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u5c01\u5370\u5251\u57573\u56de\u5408(\u5251\u5757\u5c06\u4e0d\u5728\u751f\u6548)",
      c484: "\u5206\u88c2\u6210\u4e24\u4e2a\u602a\u7269",
      c485: "\u53ec\u55242\u4e2a\u624b\u4e0b",
      c486: "\u81ea\u5df1\u6b7b\u4ea1",
      c487: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u5c01\u5370\u9b54\u6cd5\u57573\u56de\u5408(\u9b54\u6cd5\u5757\u5c06\u4e0d\u5728\u751f\u6548)",
      c488: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a01\u4e2a\u51b0\u5757\uff08\u51b0\u51bb\u5757\u65e0\u6cd5\u76f4\u63a5\u6d88\u9664\u548c\u6389\u843d\uff09",
      c489: "\u5206\u88c2\u62102\u4e2a\u602a\u7269",
      c490: "\u884c\u52a8{round}\u6b21\u4ee5\u540e\u602a\u7269\u6b7b\u4ea1",
      c491: "\u5c11\u4e8e50%\u8840\u91cf\u540e\u5206\u88c2\u62102\u4e2a\u602a\u7269",
      c492: "\u6ca1\u6709\u5c0f\u5f1f\u540e\u53ec\u55242\u4e2a\u5c0f\u5f1f",
      c493: "\u683c\u6321\u5757\u4e0d\u518d\u589e\u52a0\u683c\u6321\uff0c\u6062\u590d\u7c7b\u6280\u80fd\u83b7\u5f97\u80fd\u91cf\u65f6\u80fd\u91cf*2",
      c494: "\u6bcf\u6b21\u6709\u5927\u4e8e5\u7684\u8fde\u51fb\u8fde\u51fb\u500d\u7387\u589e\u52a020%",
      c495: "\u6bcf\u6b21\u66b4\u51fb100%\u5e26\u67653\u5c42\u4e2d\u6bd2",
      c496: "\u6bcf\u6b21\u66b4\u51fb100%\u5e26\u67651\u5c42\u6655\u7729",
      c497: "\u6d88\u9664\u4f24\u5bb3\u589e\u52a050%,\u602a\u7269\u5c06\u63d0\u524d\u4e00\u56de\u5408\u884c\u52a8",
      c498: "\u6bcf\u53d7\u4f245\u6b21\u514d\u75ab1\u6b21\u4f24\u5bb3",
      c499: "\u6bcf\u5c42\u9020\u62101\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u51cf1\u5c42",
      c500: "\u4e2d\u6bd2\uff1a\u884c\u52a8\u65f6\u5c06\u9020\u6210{num}\u70b9\u4f24\u5bb3",
      c501: "\u6655\u7729\u540e\u602a\u7269\u5c06\u4e0d\u51cf\u56de\u5408\u6570",
      c502: "\u8be5\u602a\u7269\u6655\u7729\uff0c\u672c\u6b21\u56de\u5408\u6570\u4e0d\u51cf\u5c11",
      c503: "\u865a\u5f31",
      c504: "\u654c\u4eba\u9020\u6210\u4f24\u5bb3\u51cf\u5c1125%",
      c505: "\u5728{round}\u56de\u5408\u5185\uff0c\u654c\u4eba\u9020\u6210\u7684\u4f24\u5bb3\u51cf\u5c11{num}",
      c506: "\u707c\u70e7",
      c507: "\u6bcf1\u5c42\u707c\u70e7\u9020\u62102\u70b9\u4f24\u5bb3\uff0c\u7136\u540e\u6d88\u5931",
      c508: "\u707c\u70e7\uff1a\u884c\u52a8\u65f6\u5c06\u9020\u6210{num}\u70b9\u4f24\u5bb3",
      c509: "\u8346\u68d8",
      c510: "\u6bcf1\u5c42\u8346\u68d8\u4f1a\u5728\u53d7\u5230\u4f24\u5bb3\u65f6\uff0c\u7ed9\u6765\u6e90\u8005\u53cd\u5f391\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u5c42\u6570\u51cf1",
      c511: "\u8346\u68d8\uff1a\u53d7\u5230\u653b\u51fb\u65f6\u653b\u51fb\u8005\u53d7\u5230{num}\u70b9\u4f24\u5bb3",
      c512: "\u5f31\u70b9",
      c513: "\u653b\u51fb\u53d7\u5230\u7684\u4f24\u5bb3\u589e\u52a020%",
      c514: "\u5728{round}\u56de\u5408\u5185\uff0c\u53d7\u5230\u7684\u4f24\u5bb3\u5c06\u589e\u52a0{num}",
      c515: "\u653b\u51fb\u529b\u589e\u52a0+{number}",
      c516: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e{val}\u65f6\u653b\u51fb\u529b\u589e\u52a0+{number}",
      c517: "\u66b4\u51fb\u7387\u589e\u52a0{number}",
      c518: "\u66b4\u51fb\u4f24\u5bb3\u500d\u7387\u589e\u52a0{number}(\u767e\u5206\u6bd4)",
      c519: "\u6218\u6597\u5f00\u59cb\u56de\u590d{number}\u8840\u91cf",
      c520: "\u6218\u6597\u7ed3\u675f\u8840\u91cf\u4f4e\u4e8e{val}\u5219\u56de\u590d{number}\u7684\u8840\u91cf",
      c521: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u56de\u590d{number}\u70b9\u8840",
      c522: "\u56de\u5408\u5f00\u59cb\u56de\u590d{number}\u683c\u6321",
      c523: "\u6bcf\u6b21\u653b\u51fb\u65f6\u589e\u52a0{number}\u70b9\u683c\u6321",
      c524: "\u6218\u6597\u5f00\u59cb\u6280\u80fd\u80fd\u91cf\u521d\u59cb\u503c+{number}",
      c525: "\u6280\u80fd\u4f24\u5bb3\u589e\u52a0{number}",
      c526: "\u6d88\u9664\u4f24\u5bb3\u589e\u52a0{number}",
      c527: "\u5251\u5757\u7684\u4f24\u5bb3\u589e\u52a0{number}",
      c528: "\u6bcf\u6b21\u6709\u5927\u4e8e{val}\u7684\u8fde\u51fb\u8fde\u51fb\u500d\u7387\u589e\u52a0{number}",
      c529: "\u8fde\u51fb\u4e0d\u5728\u8fdb\u884c\u8ba1\u7b97\uff0c\u4f24\u5bb3\u500d\u7387\u56fa\u5b9a{number}\u500d",
      c530: "\u8fde\u51fb\u500d\u7387\u589e\u52a0{number}",
      c531: "\u6bcf\u6b21\u6d88\u9664\u5251\u5757\u6570\u91cf+{number}",
      c532: "\u653b\u51fb\u65f6\u6709{number}\u7684\u51e0\u7387\u653b\u51fb\u4e24\u6b21",
      c533: "\u683c\u6321\u5757\u4e0d\u518d\u589e\u52a0\u683c\u6321\uff0c\u6062\u590d\u7c7b\u6280\u80fd\u83b7\u5f97\u80fd\u91cf\u65f6\u80fd\u91cf*{number}\u500d",
      c534: "\u6bcf\u83b7\u5f97{val}\u70b9\u683c\u6321\u5c31\u4f1a\u5bf9\u968f\u673a\u602a\u7269\u9020\u6210{number}\u70b9\u4f24\u5bb3",
      c535: "\u6bcf\u53d7\u4f24{val}\u6b21\u514d\u75ab{number}\u6b21\u4f24\u5bb3",
      c536: "\u6218\u6597\u5f00\u59cb\u7ed9\u602a\u7269\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c537: "\u56de\u5408\u5f00\u59cb\u7ed9\u602a\u7269\u589e\u52a0{number}\u5c42\u4e2d\u6bd2",
      c538: "\u6bcf\u6b21\u653b\u51fb\u90fd\u4f1a\u9644\u5e26{number}\u5c42\u4e2d\u6bd2",
      c539: "\u6bcf\u6b21\u66b4\u51fb\u5e26\u6765{number}\u5c42\u4e2d\u6bd2",
      c540: "\u6bcf\u6b21\u8fde\u51fb\u6570\u8d85\u8fc7{val}\u540e\uff0c\u653b\u51fb\u4f1a\u9644\u5e26{number}\u5c42\u4e2d\u6bd2",
      c541: "\u6bcf\u6b21\u653b\u51fb{val}\u9644\u5e26{number}\u5c42\u865a\u5f31",
      c542: "\u6bcf\u6b21\u653b\u51fb\u6709{val}\u7684\u51e0\u7387\u9020\u6210{number}\u5c42\u6655\u7729",
      c543: "\u6bcf\u6b21\u66b4\u51fb\u6709{number}\u7684\u51e0\u7387\u9020\u6210{number}\u5c42\u6655\u7729",
      c544: "\u56de\u5408\u5f00\u59cb\u589e\u52a0{number}\u5c42\u8346\u68d8",
      c545: "\u707c\u70e7\u4f24\u5bb3+{number}",
      c546: "\u6389\u843d\u7684\u91d1\u5e01\u589e\u52a0{number}",
      c547: "\u5546\u5e97\u8d2d\u4e70{number}\u6298",
      c548: "\u602a\u7269\u5c06\u63d0\u524d\u4e00\u56de\u5408\u884c\u52a8",
      c549: "\u7cbe\u82f1\u602a\u7269\u8840\u91cf\u51cf\u5c11{number}",
      c550: "\u56de\u5408\u5f00\u59cb\u7ed9\u68cb\u76d8\u589e\u52a0{number}\u4e2a\u706b\u5143\u7d20",
      c551: "\u6d88\u9664\u65f6\u95f4\u5ef6\u957f{number}",
      c552: "\u68cb\u76d8\u5237\u65b0\u65f6\u683c\u6321\u5757\u6389\u843d\u6982\u7387\u589e\u52a0{number}",
      c553: "\u52a0\u5f3a\u5757\u6d88\u9664\u7684\u6570\u91cf\u4f1a\u6709{number}\u7684\u52a0\u6210",
      c554: "\u653b\u51fb\u65f6\u670920%\u7684\u51e0\u7387\u653b\u51fb\u4e24\u6b21",
      c555: "\u6218\u6597\u5f00\u59cb\u6280\u80fd\u80fd\u91cf\u521d\u59cb\u503c+2",
      c556: "\u653b\u51fb\u529b\u589e\u52a0+5\uff0c\u6bcf\u6b21\u653b\u51fb30%\u9644\u5e261\u5c42\u865a\u5f31",
      c557: "\u6bcf\u6b21\u653b\u51fb\u670950%\u51e0\u7387\u9644\u5e261\u5c42\u865a\u5f31",
      c558: "\u6bcf\u6b21\u66b4\u51fb\u670910%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c559: "\u653b\u51fb\u529b+2\uff0c\u6bcf\u6b21\u653b\u51fb\u670910%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c560: "\u6bcf\u6b21\u653b\u51fb\u670930%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c561: "\u8fde\u51fb\u500d\u7387\u589e\u52a010%",
      c562: "\u66b4\u51fb\u7387\u589e\u52a05%",
      c563: "\u8840\u91cf\u6ee1\u65f6\u653b\u51fb\u529b\u589e\u52a0+{number}",
      c564: "\u66b4\u51fb\u7387\u589e\u52a0{number}(%)",
      c565: "\u66b4\u51fb\u4f24\u5bb3\u500d\u7387\u589e\u52a0{number}(%)",
      c566: "\u521d\u59cb\u683c\u6321+{number}",
      c567: "\u57fa\u7840\u8840\u91cf+{number}",
      c568: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u589e\u52a0{number}\u70b9\u683c\u6321",
      c569: "\u6280\u80fd\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c570: "\u6d88\u9664\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c571: "\u5251\u5757\u7684\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c572: "\u6bcf\u6b21\u6709\u5927\u4e8e{val}\u7684\u8fde\u51fb\u8fde\u51fb\u500d\u7387\u589e\u52a0{number}(%)",
      c573: "\u8fde\u51fb\u500d\u7387\u589e\u52a0{number}(%)",
      c574: "\u683c\u6321\u5757\u4e0d\u518d\u589e\u52a0\u683c\u6321",
      c575: "\u6062\u590d\u7c7b\u6280\u80fd\u83b7\u5f97\u80fd\u91cf\u65f6\u80fd\u91cf*{number}\u500d",
      c576: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u90fd\u4f1a\u9644\u5e26{number}\u5c42\u4e2d\u6bd2",
      c577: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3{val}\u9644\u5e26{number}\u5c42\u865a\u5f31",
      c578: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u6709{val}\u7684\u51e0\u7387\u9020\u6210{number}\u5c42\u6655\u7729",
      c579: "\u865a\u5f31\uff1a\u602a\u7269\u4f24\u5bb3\u51cf\u5c1125%\uff0c\u6bcf\u6b21\u5c42\u6570\u51cf1",
      c580: "\u707c\u70e7\uff1a\u6bcf1\u5c42\u707c\u70e7\u9020\u62102\u70b9\u4f24\u5bb3\uff0c\u7136\u540e\u6d88\u5931\uff08\u602a\u7269\u884c\u52a8\u65f6\u89e6\u53d1\uff09",
      c581: "\u4e2d\u6bd2\uff1a\u6bcf1\u5c42\u4e2d\u6bd2\u9020\u62101\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u51cf1\u5c42\uff08\u602a\u7269\u884c\u52a8\u65f6\u89e6\u53d1\uff09",
      c582: "\u6655\u7729\uff1a",
      c583: "\u8346\u68d8\uff1a\u6bcf1\u5c42\u8346\u68d8\u4f1a\u5728\u53d7\u5230\u4f24\u5bb3\u65f6\uff0c\u7ed9\u6765\u6e90\u8005\u53cd\u5f391\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u5c42\u6570\u51cf1",
      c584: "\u5f31\u70b9\uff1a\u53d7\u5230\u7684\u4f24\u5bb3\u589e\u52a020%\uff08\u53d7\u5230\u4f24\u5bb3\u65f6\u89e6\u53d1\uff09",
      c585: "\u7cbe\u82f1\u602a\u7269\u8840\u91cf\u51cf\u5c11{number}(%)",
      c586: "\u521d\u59cb\u68cb\u76d8\u4e2d\u5251\u5757{number}\u4e3a\u52a0\u5f3a\u5251\u5757\uff08\u5251\u5757*2\uff09",
      c587: "\u5237\u65b0\u7684\u5251\u5757\u6709{number}\u6982\u7387\u4e3a\u52a0\u5f3a\u5251\u5757",
      c588: "\u521d\u59cb\u5757\u4f1a{number}\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c589: "\u521d\u59cb\u5757\u4f1a{number}\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c590: "\u5237\u65b0\u7684\u5757{number}\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c591: "\u5237\u65b0\u7684\u5757{number}\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c592: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u589e\u52a01\u70b9\u683c\u6321",
      c593: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u90fd\u4f1a\u9644\u5e261\u5c42\u4e2d\u6bd2",
      c594: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u670930%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c595: "\u653b\u51fb\u529b\u589e\u52a0+5\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb330%\u9644\u5e261\u5c42\u865a\u5f31",
      c596: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u670950%\u51e0\u7387\u9644\u5e261\u5c42\u865a\u5f31",
      c597: "\u653b\u51fb\u529b+2\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u670910%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c598: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u670930%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c599: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u65a7\u5757\u4e3a\u65a7\u5757\u6280\u80fd\u57572",
      c600: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u6cd5\u6756\u5757\u4e3a\u6cd5\u6756\u5757\u6280\u80fd\u57572",
      c601: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u65b0\u5757\u4e3a\u65b0\u5757\u6280\u80fd\u57572",
      c602: "\u56de\u5408\u5f00\u59cb\u7ed9\u4eba\u7269\u589e\u52a01\u5c42\u8346\u68d8",
      c603: "\u8fde\u51fb\u4e0d\u518d\u8fdb\u884c\u8ba1\u7b97\uff0c\u4f24\u5bb3\u500d\u7387\u56fa\u5b9a1.5",
      c604: "\u683c\u6321\u5757\u4e0d\u518d\u589e\u52a0\u683c\u6321\uff0c\u6062\u590d\u7c7b\u6280\u80fd\u6d88\u9664\u65f6\u83b7\u5f97\u80fd\u91cf\u65f6\u80fd\u91cf*2",
      c605: "\u6d88\u9664\u4f24\u5bb3\u589e\u52a050%,\u602a\u7269\u5c06\u63d0\u524d1\u56de\u5408\u884c\u52a8",
      c606: "\u9ebb\u75f9",
      c607: "\u4eba\u7269\u76f8\u5e94\u804c\u4e1a\u5757\u6d88\u9664100%\u65e0\u6548",
      c608: "\u5728{round}\u56de\u5408\u5185\uff0c{type}\u5757\u7c7b\u578b\u65e0\u6548",
      c609: "\u6bcf\u6b21\u6709\u5927\u4e8e{val}\u7684\u8fde\u51fb\u8fde\u51fb\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c610: "\u8fde\u51fb\u4e0d\u5728\u8fdb\u884c\u8ba1\u7b97\uff0c\u4f24\u5bb3\u500d\u7387\u56fa\u5b9a{number}",
      c611: "\u8fde\u51fb\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c612: "\u865a\u5f31\uff1a\u4f24\u5bb3\u51cf\u5c11{number}\uff0c\u6bcf\u6b21\u5c42\u6570\u51cf1",
      c613: "\u707c\u70e7\uff1a\u6bcf1\u5c42\u707c\u70e7\u9020\u6210{number}\u70b9\u4f24\u5bb3\uff0c\u7136\u540e\u6d88\u5931\uff08\u602a\u7269\u884c\u52a8\u65f6\u89e6\u53d1\uff09",
      c614: "\u4e2d\u6bd2\uff1a\u6bcf1\u5c42\u4e2d\u6bd2\u9020\u6210{number}\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u51cf1\u5c42\uff08\u602a\u7269\u884c\u52a8\u65f6\u89e6\u53d1\uff09",
      c615: "\u8346\u68d8\uff1a\u6bcf1\u5c42\u8346\u68d8\u4f1a\u5728\u53d7\u5230\u4f24\u5bb3\u65f6\uff0c\u7ed9\u6765\u6e90\u8005\u53cd\u5f39{number}\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u5c42\u6570\u51cf1",
      c616: "\u5f31\u70b9\uff1a\u53d7\u5230\u7684\u4f24\u5bb3\u589e\u52a0{number}\uff08\u53d7\u5230\u4f24\u5bb3\u65f6\u89e6\u53d1\uff09",
      c617: "\u602a\u7269\u5c06\u63d0\u524d{number}\u56de\u5408\u884c\u52a8",
      c618: "\u6280\u80fd\u5757\u9020\u6210\u7684\u7206\u70b8\u8303\u56f4\u4e3a\u6b63\u65b9\u5f62",
      c619: "\u66b4\u51fb\u7387\u589e\u52a010%\uff0c\u540c\u65f6\u9020\u6210\u66b4\u51fb\u65f6\u4f1a\u9644\u5e261\u5c42\u4e2d\u6bd2\u3002",
      c620: "\u6280\u80fd\u4f24\u5bb3\u589e\u52a0200%",
      c621: "\u8840\u91cf\u6ee1\u65f6\u653b\u51fb\u529b\u589e\u52a0+15",
      c622: "\u6bcf\u6b21\u66b4\u51fb\u670980%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c623: "\u653b\u51fb\u529b\u589e\u52a0+5\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb330%\u9644\u5e261\u5c42\u5f31\u70b9",
      c624: "\u5728{round}\u56de\u5408\u5185\uff0c\u654c\u4eba\u9020\u6210\u7684\u4f24\u5bb3\u51cf\u5c1125%",
      c625: "\u5728{round}\u56de\u5408\u5185\uff0c\u53d7\u5230\u7684\u4f24\u5bb3\u5c06\u589e\u52a020%",
      c626: "1\u6297\u6027",
      c627: "\u51cf\u5c111\u7c7b\u578b\u4f24\u5bb320%",
      c628: "2\u6297\u6027",
      c629: "\u51cf\u5c112\u7c7b\u578b\u4f24\u5bb320%",
      c630: "3\u6297\u6027",
      c631: "\u51cf\u5c113\u7c7b\u578b\u4f24\u5bb320%",
      c632: "4\u6297\u6027",
      c633: "\u51cf\u5c114\u7c7b\u578b\u4f24\u5bb320%",
      c634: "5\u6297\u6027",
      c635: "\u51cf\u5c115\u7c7b\u578b\u4f24\u5bb320%",
      c636: "\u795e\u519c",
      c637: "\u51cf\u5c11\u4e2d\u6bd2\u7c7b\u578b\u4f24\u5bb350%",
      c638: "\u9ebb\u75f9\uff1a\u4eba\u7269\u76f8\u5e94\u804c\u4e1a\u5757\u6d88\u9664{number}%\u65e0\u6548",
      c639: "\u51cf\u5c111\u7c7b\u578b\u4f24\u5bb3{number}%",
      c640: "\u51cf\u5c112\u7c7b\u578b\u4f24\u5bb3{number}%",
      c641: "\u51cf\u5c113\u7c7b\u578b\u7c7b\u578b\u4f24\u5bb3{number}%",
      c642: "\u51cf\u5c114\u7c7b\u578b\u7c7b\u578b\u4f24\u5bb3{number}%",
      c643: "\u51cf\u5c115\u7c7b\u578b\u7c7b\u578b\u4f24\u5bb3{number}%",
      c644: "\u666e\u901a\u653b\u51fb2",
      c645: "\u666e\u901a\u653b\u51fb3",
      c646: "\u514d\u75ab",
      c647: "\u514d\u75ab\uff1a",
      c648: "\u589e\u52a01\u5c42\u514d\u75ab",
      c649: "\u9020\u6210\u4f24\u5bb3\u51cf\u5c1125%",
      c650: "\u91d1\u949f\u7f69",
      c651: "\u514d\u75ab1\u6b21\u4f24\u5bb3",
      c652: "\u514d\u75ab{num}\u6b21\u4f24\u5bb3",
      c653: "\u514d\u75ab{number}\u6b21\u4f24\u5bb3",
      c654: "\u4e2d\u6bd2\u602a\u7269",
      c655: "\u666e\u901a\u653b\u51fb4",
      c656: "\u666e\u901a\u653b\u51fb5",
      c657: "\u865a\u5f31\u51fb",
      c658: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u5c42\u865a\u5f31",
      c659: "\u5f31\u70b9\u51fb",
      c660: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u5c42\u5f31\u70b9",
      c661: "\u5c01\u5370\u51fb1",
      c662: "\u5c01\u5370\u51fb2",
      c663: "\u81ea\u52a8\u56de\u590d\u8840\u91cf",
      c664: "\u884c\u52a8\u524d\u81ea\u52a8\u56de\u590d{num}\u8840\u91cf",
      c665: "\u81ea\u52a8\u56de\u590d\u683c\u6321",
      c666: "\u884c\u52a8\u524d\u81ea\u52a8\u56de\u590d{num}\u683c\u6321",
      c667: "\u56de\u5408\u5f00\u59cb\u56de\u590d{number}\u683c\u6321(\u4eba\u7269\u5728\u56de\u5408\u5f00\u59cb\u89e6\u53d1,\u602a\u7269\u5728\u884c\u52a8\u524d\u89e6\u53d1)",
      c668: "\u589e\u52a0\u4e2d\u6bd2\u4f24\u5bb3{number}%",
      c669: "\u56de\u5408\u5f00\u59cb\u589e\u52a0{number}\u8840(\u4eba\u7269\u5728\u56de\u5408\u5f00\u59cb\u89e6\u53d1,\u602a\u7269\u5728\u884c\u52a8\u524d\u89e6\u53d1)",
      c670: "\u51b0\u51bb\u602a\u72691",
      c671: "\u51b0\u51bb\u602a\u72692",
      c672: "\u51b0\u51bb\u602a\u72693",
      c673: "\u6124\u6012\u602a\u7269",
      c674: "\u6124\u6012\u602a\u72691",
      c675: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210200%\u7684\u4f24\u5bb3",
      c676: "\u5bf9\u654c\u65b9\u5168\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3",
      c677: "\u6b21\u6570\u51fb",
      c678: "\u5bf9\u654c\u65b9\u9020\u621050%*\u4f7f\u7528\u6b21\u6570\u7684\u4f24\u5bb3",
      c679: "\u5bf9\u654c\u65b9\u5168\u4f53\u9020\u621025%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c680: "\u4e3a\u68cb\u76d8\u4e0a5\u4e2a\u5251\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c681: "\u4e3a\u68cb\u76d8\u4e0a5\u4e2a\u5f13\u7bad\u5757\u4e0a\u589e\u52a0\u6728\u5143\u7d20",
      c682: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u9b54\u6cd5\u5757\u4e3a\u65a7\u5757\u6280\u80fd\u57572",
      c683: "\u4e3a\u68cb\u76d8\u4e0a5\u4e2a\u9b54\u6cd5\u5757\u4e0a\u589e\u52a0\u6728\u5143\u7d20",
      c684: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u957f\u77db\u5757\u4e3a\u6280\u80fd\u57572",
      c685: "\u4e3a\u68cb\u76d8\u4e0a5\u4e2a\u957f\u77db\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c686: "\u8f6c\u5316\u68cb\u76d8\u4e0a1\u4e2a\u65a7\u5757\u4e3a\u6280\u80fd\u57572",
      c687: "\u4e3a\u68cb\u76d8\u4e0a5\u4e2a\u65a7\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c688: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u9644\u52a0\u635f\u5931\u8840\u91cf\u7684100%",
      c689: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u9644\u52a0\u62e5\u6709\u683c\u6321\u503c\u768450%",
      c690: "\u589e\u52a020\u70b9\u683c\u6321",
      c691: "\u5c01\u5370",
      c692: "\u5c01\u5370\u56de\u5408\u5185\u76f8\u5e94\u7684\u5757\u5b8c\u5168\u65e0\u6548",
      c693: "\u6ca7\u6d6a\u51fb1",
      c694: "\u6ca7\u6d6a\u51fb2",
      c695: "\u6ca7\u6d6a\u51fb3",
      c696: "\u5355\u4f53\u6655\u7729\u51fb",
      c697: "\u5168\u4f53\u6655\u7729\u51fb",
      c698: "\u52a0\u5f3a\u5251",
      c699: "\u706b\u7bad",
      c700: "\u52a0\u5f3a\u5f13\u7bad",
      c701: "\u6728\u5f13\u7bad",
      c702: "\u52a0\u5f3a\u9b54\u6cd5",
      c703: "\u6728\u9b54\u6cd5",
      c704: "\u52a0\u5f3a\u957f\u77db",
      c705: "\u706b\u77db",
      c706: "\u52a0\u5f3a\u65a7",
      c707: "\u706b\u65a7",
      c708: "\u6bd2\u7d20\u5f15\u53d1",
      c709: "\u707c\u70e7\u5f15\u53d1",
      c710: "\u521d\u59cb\u68cb\u76d8\u4e2d\u5251\u5757{val}\u4e3a\u52a0\u5f3a\u5251\u5757\uff08\u5251\u5757*2\uff09",
      c711: "\u5237\u65b0\u7684\u5251\u5757\u6709{val}\u6982\u7387\u4e3a\u52a0\u5f3a\u5251\u5757",
      c712: "\u521d\u59cb\u5757\u4f1a{val}\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c713: "\u521d\u59cb\u5757\u4f1a{val}\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c714: "\u5237\u65b0\u7684\u5757{val}\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c715: "\u5237\u65b0\u7684\u5757{val}\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c716: "\u505a\u91d1\u94b1\u7684\u5974\u96b6\u5427\u3002\u83b7\u5f9799\u91d1\u5e01",
      c717: "\u4e3a\u68cb\u76d8\u4e0a3\u4e2a\u5251\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c718: "\u4e3a\u68cb\u76d8\u4e0a3\u4e2a\u957f\u77db\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c719: "\u4e3a\u68cb\u76d8\u4e0a3\u4e2a\u65a7\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c720: "\u653b\u51fb\u65f6\u6709{val}\u7684\u51e0\u7387\u653b\u51fb\u4e24\u6b21",
      c721: "combo\u4f24\u5bb3\u589e\u52a010%",
      c722: "\u683c\u6321\u7ffb\u500d",
      c723: "\u76ee\u524d\u62e5\u6709\u7684\u683c\u6321\u503c\u7ffb\u500d",
      c724: "\u521d\u59cb\u5757\u4f1a100%\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c725: "\u521d\u59cb\u5757\u4f1a100%\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c726: "\u5237\u65b0\u7684\u575710%\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c727: "\u5237\u65b0\u7684\u575710%\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c728: "\u521d\u59cb\u5757\u4f1a60%\u51e0\u7387\u9644\u5e26\u6728\u5143\u7d20",
      c729: "\u6218\u6597\u5f00\u59cb\u7ed91\u4e2a\u602a\u7269\u589e\u52a03\u5c42\u4e2d\u6bd2",
      c730: "\u56de\u5408\u5f00\u59cb\u7ed91\u4e2a\u602a\u7269\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c731: "\u4e2d\u6bd2\uff1a\u884c\u52a8\u65f6\u5c06\u9020\u6210{num}\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u884c\u52a8\u51cf1\u5c42\u3002",
      c732: "\u707c\u70e7\uff1a\u884c\u52a8\u65f6\u5c06\u9020\u6210{num}\u70b9\u4f24\u5bb3\uff0c\u707c\u70e7\u6d88\u5931\u3002",
      c733: "\u8346\u68d8\uff1a\u53d7\u5230\u653b\u51fb\u65f6\u653b\u51fb\u8005\u53d7\u5230{num}\u70b9\u4f24\u5bb3\uff0c\u6bcf\u6b21\u51cf1\u5c42\u3002",
      c734: "\u6d88\u9664\u65f6\u95f4\u5ef6\u957f120%",
      c735: "\u6bcf\u6b21\u6709\u5927\u4e8e5\u7684\u8fde\u51fb\u653b\u51fb\u4f1a\u9644\u5e261\u5c42\u4e2d\u6bd2",
      c736: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u4e2a\u5251\u5757\u4e3a\u5251\u5757\u6280\u80fd\u57573",
      c737: "\u4e3a\u68cb\u76d8\u4e0a10\u4e2a\u5251\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c738: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u4e2a\u5f13\u7bad\u5757\u4e3a\u5f13\u7bad\u5757\u6280\u80fd\u57573",
      c739: "\u4e3a\u68cb\u76d8\u4e0a6\u4e2a\u5f13\u7bad\u5757\u4e0a\u589e\u52a0\u6728\u5143\u7d20",
      c740: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u4e2a\u9b54\u6cd5\u5757\u4e3a\u65a7\u5757\u6280\u80fd\u57573",
      c741: "\u4e3a\u68cb\u76d8\u4e0a6\u4e2a\u9b54\u6cd5\u5757\u4e0a\u589e\u52a0\u6728\u5143\u7d20",
      c742: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u4e2a\u957f\u77db\u5757\u4e3a\u6280\u80fd\u57573",
      c743: "\u4e3a\u68cb\u76d8\u4e0a10\u4e2a\u957f\u77db\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c744: "\u8f6c\u5316\u68cb\u76d8\u4e0a5\u4e2a\u65a7\u5757\u4e3a\u6280\u80fd\u57573",
      c745: "\u4e3a\u68cb\u76d8\u4e0a10\u4e2a\u65a7\u5757\u4e0a\u589e\u52a0\u706b\u5143\u7d20",
      c746: "\u56de\u590d\uff08\u56de\u590d20%\u7684\u8840\u91cf\uff09",
      c747: "\u56de\u590d20%\u7684\u8840\u91cf",
      c748: "\u953b\u9020",
      c749: "\u5347\u7ea7\u5361\u724c",
      c750: "\u83b7\u53d6\u8840\u91cf\u4e0a\u9650",
      c751: "\u589e\u52a05\u70b9\u8840\u91cf\u4e0a\u9650",
      c752: "\u83b7\u53d6\u653b\u51fb\u52a0\u6210",
      c753: "\u6240\u6709\u89d2\u8272\u6c38\u4e45\u589e\u52a01\u70b9\u653b\u51fb\u529b",
      c754: "\u83b7\u5f97\u5361\u724c",
      c755: "\u5361\u724c\u62bd\u53d6",
      c756: "\u6316\u6398\u795e\u5668",
      c757: "\u795e\u5668\u62bd\u53d6",
      c758: "\u589e\u52a02\u5c42\u865a\u5f31",
      c759: "\u8840\u91cf\u5927\u4e8e{val}\u65f6\u653b\u51fb\u529b\u589e\u52a0+{number}",
      c760: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u6709{val}\u7684\u51e0\u7387\u9020\u6210{number}\u5c42\u5f31\u70b9",
      c761: "\u5728{round}\u56de\u5408\u5185\uff0c\u5bf9\u654c\u4eba\u9020\u6210\u7684\u4f24\u5bb3\u51cf\u5c1125%",
      c762: "\u602a\u7269\u81ea\u6740\u6b7b\u4ea1",
      c763: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u4e2d\u6bd2\u5757\uff08\u6d88\u9664\u65f6\u6bcf\u4e2a\u9020\u62102\u70b9\u8840\u91cf\u5c11\u8840\uff09",
      c764: "\u63a5\u4e0b\u6765{num}\u6b21\u653b\u51fb\uff0c\u5bf9\u654c\u4eba\u9020\u6210\u7684\u4f24\u5bb3\u51cf\u5c1125%",
      c765: "\u63a5\u4e0b\u6765{num}\u6b21\u653b\u51fb\uff0c\u53d7\u5230\u7684\u4f24\u5bb3\u5c06\u589e\u52a020%",
      c766: "\u63a5\u4e0b\u6765{level}\u6b21\u653b\u51fb\uff0c\u5bf9\u654c\u4eba\u9020\u6210\u7684\u4f24\u5bb3\u51cf\u5c1125%",
      c767: "\u63a5\u4e0b\u6765{level}\u6b21\u653b\u51fb\uff0c\u53d7\u5230\u7684\u4f24\u5bb3\u5c06\u589e\u52a020%",
      c768: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u589e\u52a02\u70b9\u683c\u6321",
      c769: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e20%\u65f6\u653b\u51fb\u529b\u589e\u52a0+20",
      c770: "\u5237\u65b0\u7684\u5251\u5757\u670910%\u6982\u7387\u4e3a\u52a0\u5f3a\u5251\u5757",
      c771: "\u589e\u52a010\u70b9\u683c\u6321",
      c772: "\u514d\u75ab{level}\u6b21\u4f24\u5bb3",
      c773: "\u659c\u6d88",
      c774: "\u80fd\u591f\u5bf9\u89d2\u7ebf\u6d88\u9664,\u602a\u7269\u5c06\u63d0\u524d1\u56de\u5408\u884c\u52a8",
      c775: "\u5bf9\u89d2\u7ebf\u6d88\u9664\u5f00\u542f",
      c776: "\u52a0\u5f3a\u9501\u94fe\u51fb",
      c777: "\u5931\u53bb100\u91d1\u5e01\u3002\u83b7\u5f971\u4e2a\u795e\u5668",
      c778: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210100%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c779: "\u5bf9\u654c\u65b9\u5168\u4f53\u9020\u621080%\u7684\u4f24\u5bb3\u540c\u65f6\u51fb\u6655\u654c\u65b91\u56de\u5408",
      c780: "\u589e\u52a05\u5c42\u8346\u68d8",
      c781: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210200%\u7684\u4f24\u5bb3\u5982\u679c\u654c\u65b9\u6709\u4e2d\u6bd2\u5219\u4f24\u5bb3\u4f24\u5bb3\u4e3a400%",
      c782: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210200%\u7684\u4f24\u5bb3\u5982\u679c\u654c\u65b9\u6709\u707c\u70e7\u5219\u4f24\u5bb3\u4f24\u5bb3\u4e3a400%",
      c783: "\u666e\u901a\u5173\u5361",
      c784: "\u5c0f\u602a\u7269\u96c6\u7ed3",
      c785: "\u7cbe\u82f1\u5173\u5361",
      c786: "\u7cbe\u82f1\u96c6\u7ed3",
      c787: "boss\u5173\u5361",
      c788: "boss\u96c6\u7ed3",
      c789: "\u5546\u5e97",
      c790: "\u53ef\u4ee5\u8d2d\u4e70\u4e1c\u897f",
      c791: "\u968f\u673a\u4e8b\u4ef6",
      c792: "\u770b\u5929\u5427",
      c793: "\u57ce\u9547",
      c794: "\u53ef\u4ee5\u4f11\u606f\u56de\u590d\u8840\u91cf\u54e6",
      c795: "\u968f\u673a\u5173\u5361",
      c796: "\u666e\u901a\u5173\u5361\uff0c\u968f\u673a\u4e8b\u4ef6\uff0c\u5546\u5e97",
      c797: "\u51cf\u5c11{number}%\u57fa\u7840\u751f\u547d\u8840\u91cf\u4e0a\u9650",
      c798: "\u82f9\u679c",
      c799: "\u8840\u91cf\u4e0a\u9650\u589e\u52a05\u70b9",
      c800: "\u706b\u9f99\u679c",
      c801: "\u8840\u91cf\u4e0a\u9650\u589e\u52a07\u70b9",
      c802: "\u897f\u74dc",
      c803: "\u8840\u91cf\u4e0a\u9650\u589e\u52a010\u70b9",
      c804: "\u6bcf\u653b\u51fb\u7684\u7b2c5\u6b21\u4f24\u5bb3\u4e3a2\u500d",
      c805: "\u865a\u5f31\u6548\u679c\u589e\u5f3a\u4e3a\u51cf\u5c1150%\u4f24\u5bb3",
      c806: "\u5f31\u70b9\u6548\u679c\u589e\u5f3a\u4e3a50%",
      c807: "\u6bcf\u56de\u5408\u5931\u53bb1\u751f\u547d\uff0c\u9020\u6210\u7684\u4f24\u5bb3\u589e\u52a010%",
      c808: "\u6218\u6597\u5f00\u59cb\u65f6\u5c31\u80fd\u91ca\u653e\u4e00\u6b21\u968f\u673a\u6280\u80fd",
      c809: "\u56de\u5408\u5f00\u59cb\u65f6\u5931\u53bb3\u70b9\u751f\u547d\uff0c\u63a8\u8fdf\u602a\u7269\u884c\u52a81\u56de\u5408",
      c810: "\u56de\u590d\u7c7b\u6d88\u9664\u5c06\u4e0d\u518d\u8d77\u6548\u679c\uff08\u8fde\u51fb\u6709\u6548\uff09\uff0c\u653b\u51fb\u7c7b\u6d88\u9664\u6548\u679c+200%",
      c811: "\u6218\u6597\u5f00\u59cb\u65f6\u5168\u961f\u83b7\u5f9750%\u6280\u80fd\u80fd\u91cf\uff0c\u5168\u961f\u653b\u51fb\u964d\u4f4e10%",
      c812: "\u6bcf\u56de\u5408\u5f00\u59cb\u524d\u81ea\u8eab\u6263\u96641\u70b9\u8840\uff0c\u4f46\u662f\u7ed9\u6240\u6709\u602a\u7269\u9020\u62105\u70b9\u4f24\u5bb3",
      c813: "\u6bcf\u56de\u5408\u5f00\u59cb\u524d\u7ed9\u6240\u6709\u602a\u7269\u9020\u62103\u70b9\u4f24\u5bb3",
      c814: "\u6bcf\u722c\u4e00\u5c42\u589e\u52a0\u91d1\u5e0120",
      c815: "\u7cbe\u82f1\u6389\u843d\u7684\u795e\u5668+1\uff0c\u6b21\u6570\u4e3a3",
      c816: "\u6316\u6398\u7684\u5b9d\u7bb1\u5185\u4f1a\u6709\u4e24\u4e2a\u795e\u5668",
      c817: "\u602a\u7269\u56de\u5408\u63a8\u8fdf1\u56de\u5408\uff0c\u4f46\u662f\u65e0\u6cd5\u57ce\u9547\u4f11\u606f",
      c818: "\u57ce\u9547\u56de\u590d\u8840\u91cf\u589e\u52a015%",
      c819: "\u8840\u91cf\u4e0a\u9650\u51cf\u5c1130%\uff0c\u4f46\u662f\u4f24\u5bb3\u7c7b\u6280\u80fd\u9644\u5e26\u5438\u88405\u70b9\u7684\u6548\u679c\u3002",
      c820: "\u5c0f\u602a\u7269\u6389\u843d\u88c5\u5907\u53d8\u6210100%",
      c821: "\u7cbe\u82f1\u602a\u7269\u4f1a\u6709\u4e24\u6b21\u83b7\u5f97\u88c5\u5907\u7684\u673a\u4f1a",
      c822: "\u5931\u53bb10\u70b9\u8840\u91cf\u4e0a\u9650\uff0c\u653b\u51fb\u7c7b\u6280\u80fd\u9644\u5e261\u70b9\u7684\u5438\u8840",
      c823: "\u91ca\u653e\u6280\u80fd\u65f6\u67095%\u7684\u51e0\u7387\u91cd\u65b0\u5237\u65b0",
      c824: "\u57ce\u9547\u4e2d\u88c5\u5907\u5347\u7ea7\u6b21\u6570+1",
      c825: "\u514d\u75ab\u4f24\u5bb3\u65f6\u602a\u7269\u4f1a\u968f\u673a\u589e\u52a01\u5c42\u6655\u7729",
      c826: "\u514d\u75ab\u4f24\u5bb3\u65f6\u602a\u7269\u4f1a\u968f\u673a\u589e\u52a01\u5c42\u4e2d\u6bd2",
      c827: "\u514d\u75ab\u4f24\u5bb3\u65f6\u602a\u7269\u4f1a\u968f\u673a\u589e\u52a01\u5c42\u865a\u5f31",
      c828: "\u602a\u7269\u53d7\u5230\u4f24\u5bb3\u5927\u4e8e30\u65f6\u4f1a\u589e\u52a0\u4e00\u5c42\u6655\u7729",
      c829: "\u6bcf\u6b21\u7cbe\u82f1\u6218\u6597\u80fd\u83b7\u5f97\u53cc\u500d\u7684\u91d1\u5e01",
      c830: "\u5f53\u53ea\u67091\u79cd\u5757\u6d88\u9664\u7684\u65f6\u5019\uff0c\u9020\u6210\u7684\u4f24\u5bb3\u589e\u52a050%",
      c831: "\u5f53\u53ea\u67092\u79cd\u5757\u6d88\u9664\u7684\u65f6\u5019\uff0c\u9020\u6210\u7684\u4f24\u5bb3\u589e\u52a030%",
      c832: "\u5f53\u67095\u79cd\u5757\u6d88\u9664\u7684\u65f6\u5019\uff0c\u9020\u6210\u7684\u4f24\u5bb3\u589e\u52a050%",
      c833: "\u4e00\u6b21\u6027\u91ca\u653e5\u79cd\u6280\u80fd\u6d88\u9664\u8eab\u4e0a\u6240\u6709\u7684\u8d1f\u9762buff",
      c834: "\u6bcf\u5f53\u4f60\u91ca\u653e\u6280\u80fd\u7684\u65f6\u5019\u83b7\u5f972\u70b9\u8840\u91cf\u56de\u590d",
      c835: "\u6218\u58eb",
      c836: "\u53ec\u5524\u5e08\u5ce1\u8c37\u7684\u52c7\u6562\u6218\u58eb\uff0c\u53ef\u4ee5\u53ec\u5524\u82f1\u96c4\u8fdb\u884c\u6218\u6597",
      c837: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u56de\u590d3\u70b9\u8840",
      c838: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u589e\u52a04\u70b9\u683c\u6321",
      c839: "\u52a0\u5f3a\u5757\u6d88\u9664\u7684\u6570\u91cf\u4f1a\u67092\u7684\u52a0\u6210",
      c840: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e20%\u65f6\u653b\u51fb\u529b\u589e\u52a0+25",
      c841: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e50%\u65f6\u653b\u51fb\u529b\u589e\u52a0+15",
      c842: "\u653b\u51fb\u529b\u589e\u52a0+15",
      c843: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u90fd\u4f1a\u9644\u5e262\u5c42\u4e2d\u6bd2",
      c844: "\u66b4\u51fb\u7387\u589e\u52a015%\uff0c\u540c\u65f6\u9020\u6210\u66b4\u51fb\u65f6\u4f1a\u9644\u5e262\u5c42\u4e2d\u6bd2\u3002",
      c845: "\u653b\u51fb\u65f6\u670930%\u7684\u51e0\u7387\u653b\u51fb\u4e24\u6b21",
      c846: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u670940%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c847: "\u6218\u6597\u5f00\u59cb\u6280\u80fd\u80fd\u91cf\u521d\u59cb\u503c+5",
      c848: "\u8840\u91cf\u6ee1\u65f6\u653b\u51fb\u529b\u589e\u52a0+30",
      c849: "\u653b\u51fb\u529b\u589e\u52a0+10\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb350%\u9644\u5e261\u5c42\u865a\u5f31",
      c850: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u670970%\u51e0\u7387\u9644\u5e261\u5c42\u865a\u5f31",
      c851: "\u6bcf\u6b21\u66b4\u51fb\u6709100%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c852: "\u653b\u51fb\u529b+5\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u670920%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c853: "\u6bcf\u6b21\u6d88\u9664\u5251\u5757\u6570\u91cf+2",
      c854: "\u5251\u5757\u7684\u4f24\u5bb3\u589e\u52a050%",
      c855: "\u521d\u59cb\u68cb\u76d8\u4e2d\u5251\u575770%\u4e3a\u52a0\u5f3a\u5251\u5757\uff08\u5251\u5757*2\uff09",
      c856: "combo\u4f24\u5bb3\u589e\u52a020%",
      c857: "\u5237\u65b0\u7684\u575720%\u51e0\u7387\u9644\u5e26\u706b\u5143\u7d20",
      c858: "\u66b4\u51fb\u7387\u589e\u52a010%",
      c859: "\u66b4\u51fb\u4f24\u5bb3\u589e\u52a030%",
      c860: "\u653b\u51fb\u529b\u589e\u52a0+10\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb350%\u9644\u5e261\u5c42\u5f31\u70b9",
      c861: "\u56de\u5408\u5f00\u59cb\u65f6\u5931\u53bb1\u751f\u547d\uff0c\u6d88\u9664\u4f24\u5bb3\u589e\u52a010%",
      c862: "\u6218\u6597\u5f00\u59cb\u65f6\u968f\u673a\u5145\u6ee1\u4e00\u4e2a\u5c0f\u4eba\u7684\u6280\u80fd\u80fd\u91cf",
      c863: "\u683c\u6321\u5757\u4e0d\u518d\u589e\u52a0\u683c\u6321\uff08\u8fde\u51fb\u6709\u6548\uff09\uff0c\u6d88\u9664\u4f24\u5bb3+200%",
      c864: "\u6218\u6597\u5f00\u59cb\u65f6\u5168\u961f\u83b7\u5f9750%\u6280\u80fd\u80fd\u91cf\uff0c\u5168\u961f\u6d88\u9664\u4f24\u5bb3\u964d\u4f4e10%",
      c865: "\u56de\u5408\u5f00\u59cb\u65f6\u5931\u53bb1\u751f\u547d\uff0c\u4f46\u662f\u7ed9\u6240\u6709\u602a\u7269\u9020\u62105\u70b9\u4f24\u5bb3",
      c866: "\u5931\u53bb10\u70b9\u8840\u91cf\u4e0a\u9650\uff0c\u4f24\u5bb3\u7c7b\u6280\u80fd\u9644\u5e261\u70b9\u7684\u5438\u8840",
      c867: "\u86ee\u529b",
      c868: "1\u5c42\u589e\u52a01\u70b9\u4f24\u5bb3",
      c869: "\u589e\u52a0{num}\u70b9\u4f24\u5bb3",
      c870: "\u51cf\u5c11\u86ee\u529b",
      c871: "1\u5c42\u51cf\u5c111\u70b9\u4f24\u5bb3",
      c872: "\u51cf\u5c11{num}\u70b9\u4f24\u5bb3",
      c873: "\u5c04\u624b",
      c874: "\u6cd5\u5e08",
      c875: "\u57fa\u7840\u8840\u91cf\u4e0a\u9650\u589e\u52a0/\u51cf\u5c11{number}",
      c876: "\u6d88\u9664\u4f24\u5bb3\u589e\u52a0/\u964d\u4f4e{number}(%)",
      c877: "\u56de\u5408\u5f00\u59cb\u589e\u52a0/\u5931\u53bb{number}\u8840(\u4eba\u7269\u5728\u56de\u5408\u5f00\u59cb\u89e6\u53d1,\u602a\u7269\u5728\u884c\u52a8\u524d\u89e6\u53d1)",
      c878: "\u57fa\u7840\u8840\u91cf\u4e0a\u9650\u589e\u52a0/\u51cf\u5c11{number}(%)",
      c879: "\u6bcf\u6d88\u9664\u653b\u51fb\u7684\u7b2c{val}\u6b21\u4f24\u5bb3\u4e3a{number}\u500d",
      c880: "\u865a\u5f31\u6548\u679c\u589e\u5f3a\u4e3a\u51cf\u5c11{number}%\u4f24\u5bb3",
      c881: "\u6218\u6597\u5f00\u59cb\u65f6\u5168\u961f\u83b7\u5f97{number}%\u6280\u80fd\u80fd\u91cf",
      c882: "\u56de\u5408\u5f00\u59cb\u65f6\u7ed9\u6240\u6709\u602a\u7269\u9020\u6210{number}\u70b9\u4f24\u5bb3",
      c883: "\u6bcf\u722c\u4e00\u5c42\u589e\u52a0\u91d1\u5e01{number}",
      c884: "\u65e0\u6cd5\u57ce\u9547\u4f11\u606f",
      c885: "\u57ce\u9547\u56de\u590d\u8840\u91cf\u589e\u52a0{number}%",
      c886: "\u4f24\u5bb3\u7c7b\u6280\u80fd\u9644\u5e26\u5438\u8840{number}\u70b9\u7684\u6548\u679c",
      c887: "\u5c0f\u602a\u7269\u6389\u843d\u88c5\u5907\u53d8\u6210{number}%",
      c888: "\u91ca\u653e\u6280\u80fd\u65f6\u6709{number}%\u7684\u51e0\u7387\u91cd\u65b0\u5237\u65b0",
      c889: "\u57ce\u9547\u4e2d\u88c5\u5907\u5347\u7ea7\u6b21\u6570+{number}",
      c890: "\u6bcf\u6b21\u7cbe\u82f1\u6218\u6597\u80fd\u83b7\u5f97{number}\u500d\u7684\u91d1\u5e01",
      c891: "\u5f53\u53ea\u6709{val}\u79cd\u5757\u6d88\u9664\u7684\u65f6\u5019\uff0c\u9020\u6210\u7684\u4f24\u5bb3\u589e\u52a0{number}%",
      c892: "\u9a91\u58eb\u602a\u7269",
      c893: "\u796d\u7940\u602a\u7269",
      c894: "\u5c01\u5370\u602a\u7269",
      c895: "\u5c06\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a01\u4e2a\u9501\u94fe\u5757",
      c896: "\u9501\u94fe\u51fb2",
      c897: "\u5c06\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u9501\u94fe\u5757",
      c898: "\u4e2d\u6bd2\u51fb1",
      c899: "\u4e2d\u6bd2\u51fb2",
      c900: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a01\u5c42\u865a\u5f31",
      c901: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a01\u5c42\u5f31\u70b9",
      c902: "\u9020\u6210{num}\u4f24\u5bb3\uff0c\u540c\u65f6\u589e\u52a02\u4e2a\u51b0\u5757\uff08\u51b0\u51bb\u5757\u65e0\u6cd5\u76f4\u63a5\u6d88\u9664\u548c\u6389\u843d\uff09",
      c903: "\u91cd\u51fb",
      c904: "\u91cd\u51fb1",
      c905: "\u51b0\u5757\u51fb2",
      c906: "\u4f24\u5bb3\u589e\u52a0",
      c907: "\u589e\u52a03\u5c42\u4f24\u5bb3",
      c908: "\u589e\u52a01\u5c42\u865a\u5f31",
      c909: "\u589e\u52a01\u5c42\u5f31\u70b9",
      c910: "\u5e78\u8fd0",
      c911: "\u83b7\u5f9730\u91d1\u5e01",
      c912: "\u83b7\u5f9799\u91d1\u5e01\uff0c\u5931\u53bb7\u70b9\u8840\u91cf",
      c913: "\u6211\u5565\u90fd\u4e0d\u60f3\u8981",
      c914: "\u61e6\u592b\uff0c\u8ba4\u8f93\u79bb\u5f00\uff0c\u5931\u53bb10\u70b9\u751f\u547d",
      c915: "\u8d4c\u535a\uff0c50%\u51e0\u7387\u83b7\u5f9799\u91d1\u5e01\uff0c50%\u51e0\u7387\u5931\u53bb99\u91d1\u5e01\u3002",
      c916: "\u5bf9\u654c\u65b9\u5355\u4f53\u9020\u6210600%\u7684\u4f24\u5bb3",
      c917: "\u6ca7\u6d6a\u51fb\u5168\u51fb1",
      c918: "\u5bf9\u654c\u65b9\u5168\u4f53\u9020\u6210400%\u7684\u4f24\u5bb3",
      c919: "\u683c\u6321\u56de\u590d",
      c920: "\u5f31\u70b9\u6548\u679c\u589e\u5f3a\u4e3a{number}%",
      c921: "\u91ca\u653e\u6280\u80fd\u65f6\u6709{val}%\u7684\u51e0\u7387\u91cd\u65b0\u5237\u65b0",
      c922: "\u514d\u75ab\u4f24\u5bb3\u65f6\u602a\u7269\u4f1a\u968f\u673a\u589e\u52a0{number}\u5c42\u6655\u7729/\u4e2d\u6bd2/\u865a\u5f31",
      c923: "\u602a\u7269\u53d7\u5230\u4f24\u5bb3\u5927\u4e8e{val}\u65f6\u4f1a\u589e\u52a0\u4e00\u5c42\u6655\u7729",
      c924: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u589e\u52a03\u70b9\u683c\u6321",
      c925: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e20%\u65f6\u653b\u51fb\u529b\u589e\u52a0+60",
      c926: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e50%\u65f6\u653b\u51fb\u529b\u589e\u52a0+45",
      c927: "\u653b\u51fb\u529b\u589e\u52a0+30",
      c928: "\u653b\u51fb\u65f6\u670920%\u7684\u51e0\u7387\u653b\u51fb2\u6b21",
      c929: "\u8840\u91cf\u6ee1\u65f6\u653b\u51fb\u529b\u589e\u52a0+60",
      c930: "\u6bcf\u6b21\u6d88\u96641\u7c7b\u5757\u6570\u91cf+2",
      c931: "1\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0100%",
      c932: "\u521d\u59cb\u68cb\u76d81\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5251\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c933: "\u5237\u65b0\u76841\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5251\u5757",
      c934: "\u6bcf\u6b212\u7c7b\u5757\u6570\u91cf+2",
      c935: "2\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0100%",
      c936: "\u521d\u59cb\u68cb\u76d82\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5251\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c937: "\u5237\u65b0\u76842\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5251\u5757",
      c938: "combo\u4f24\u5bb3\u589e\u52a0100%",
      c939: "\u653b\u51fb\u529b\u589e\u52a0+30\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb330%\u9644\u5e261\u5c42\u865a\u5f31",
      c940: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u670915%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c941: "\u6bcf\u6b21\u66b4\u51fb\u9020\u62101\u5c42\u6655\u7729",
      c942: "\u653b\u51fb\u529b\u589e\u52a0+30\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb330%\u9644\u5e261\u5c42\u5f31\u70b9",
      c943: "\u88c5\u59071+1",
      c944: "\u88c5\u59072+1",
      c945: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e20%\u65f6\u653b\u51fb\u529b\u589e\u52a0+90",
      c946: "\u88c5\u59073+1",
      c947: "\u5f53\u751f\u547d\u503c\u4f4e\u4e8e50%\u65f6\u653b\u51fb\u529b\u589e\u52a0+65",
      c948: "\u88c5\u59074+1",
      c949: "\u88c5\u59075+1",
      c950: "\u653b\u51fb\u529b\u589e\u52a0+45",
      c951: "\u88c5\u59076+1",
      c952: "\u653b\u51fb\u65f6\u670930%\u7684\u51e0\u7387\u653b\u51fb2\u6b21",
      c953: "\u88c5\u59077+1",
      c954: "\u88c5\u59078+1",
      c955: "\u88c5\u59079+1",
      c956: "\u8840\u91cf\u6ee1\u65f6\u653b\u51fb\u529b\u589e\u52a0+90",
      c957: "\u88c5\u590710+1",
      c958: "\u6bcf\u6b21\u6d88\u96641\u7c7b\u5757\u6570\u91cf+3",
      c959: "\u88c5\u590711+1",
      c960: "1\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0150%",
      c961: "\u88c5\u590712+1",
      c962: "\u521d\u59cb\u68cb\u76d81\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c963: "\u88c5\u590713+1",
      c964: "\u5237\u65b0\u76841\u7c7b\u5757\u670930%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c965: "\u88c5\u590714+1",
      c966: "\u6bcf\u6b21\u6d88\u96642\u7c7b\u5757\u6570\u91cf+3",
      c967: "\u88c5\u590715+1",
      c968: "2\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0150%",
      c969: "\u88c5\u590716+1",
      c970: "\u521d\u59cb\u68cb\u76d82\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c971: "\u88c5\u590717+1",
      c972: "\u5237\u65b0\u76842\u7c7b\u5757\u670930%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c973: "\u88c5\u590718+1",
      c974: "\u6bcf\u6b21\u6d88\u96643\u7c7b\u5757\u6570\u91cf+3",
      c975: "\u88c5\u590719+1",
      c976: "3\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0150%",
      c977: "\u88c5\u590720+1",
      c978: "\u521d\u59cb\u68cb\u76d83\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c979: "\u88c5\u590721+1",
      c980: "\u5237\u65b0\u76843\u7c7b\u5757\u670930%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c981: "\u88c5\u590722+1",
      c982: "\u6bcf\u6b21\u6d88\u96644\u7c7b\u5757\u6570\u91cf+3",
      c983: "\u88c5\u590723+1",
      c984: "4\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0150%",
      c985: "\u88c5\u590724+1",
      c986: "\u521d\u59cb\u68cb\u76d84\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c987: "\u88c5\u590725+1",
      c988: "\u5237\u65b0\u76844\u7c7b\u5757\u670930%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c989: "\u88c5\u590726+1",
      c990: "\u6bcf\u6b21\u6d88\u96645\u7c7b\u5757\u6570\u91cf+3",
      c991: "\u88c5\u590727+1",
      c992: "5\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0150%",
      c993: "\u88c5\u590728+1",
      c994: "\u521d\u59cb\u68cb\u76d85\u7c7b\u5757\u4e3a\u52a0\u5f3a\u5757\uff08\u6d88\u9664\u6570\u91cf*2\uff09",
      c995: "\u88c5\u590729+1",
      c996: "\u5237\u65b0\u76845\u7c7b\u5757\u670930%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c997: "\u88c5\u590730+1",
      c998: "combo\u4f24\u5bb3\u589e\u52a0150%",
      c999: "\u88c5\u590731+1",
      c1000: "\u66b4\u51fb\u7387\u589e\u52a015%",
      c1001: "\u88c5\u590732+1",
      c1002: "\u66b4\u51fb\u4f24\u5bb3\u589e\u52a0150%",
      c1003: "\u88c5\u5907101+1",
      c1004: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u56de\u590d2\u70b9\u8840",
      c1005: "\u88c5\u5907102+1",
      c1006: "\u653b\u51fb\u529b\u589e\u52a0+45\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb350%\u9644\u5e261\u5c42\u865a\u5f31",
      c1007: "\u88c5\u5907103+1",
      c1008: "\u6bcf\u6b21\u9020\u6210\u4f24\u5bb3\u65f6\u670920%\u7684\u51e0\u7387\u9020\u62101\u5c42\u6655\u7729",
      c1009: "\u88c5\u5907104+1",
      c1010: "\u88c5\u5907105+1",
      c1011: "\u653b\u51fb\u529b\u589e\u52a0+45\uff0c\u6bcf\u6b21\u9020\u6210\u4f24\u5bb350%\u9644\u5e261\u5c42\u5f31\u70b9",
      c1012: "\u602a\u7269\u53d7\u5230\u6d88\u9664\u4f24\u5bb3\u5927\u4e8e30\u65f6\u4f1a\u589e\u52a0\u4e00\u5c42\u6655\u7729",
      c1013: "\u653b\u51fb\u529b\u6c38\u4e45\u63d0\u53472\u70b9",
      c1014: "\u7cbe\u82f1\u6389\u843d\u7684\u795e\u5668+{number}\uff0c\u6b21\u6570\u4e3a{val}",
      c1015: "\u6316\u6398\u7684\u5b9d\u7bb1\u5185\u4f1a\u6709{number}\u4e2a\u795e\u5668",
      c1016: "\u5c0f\u602a\u7269\u6389\u843d\u88c5\u5907\u51e0\u7387\u53d8\u6210{number}%",
      c1017: "\u7cbe\u82f1\u602a\u7269\u4f1a\u6709{number}\u6b21\u83b7\u5f97\u88c5\u5907\u7684\u673a\u4f1a",
      c1018: "\u602a\u7269\u53d7\u5230\u6d88\u9664\u4f24\u5bb3\u5927\u4e8e{val}\u65f6\u4f1a\u589e\u52a0{number}\u5c42\u6655\u7729",
      c1019: "\u4e00\u6b21\u6027\u91ca\u653e{val}\u79cd\u6280\u80fd\u6d88\u9664\u8eab\u4e0a\u6240\u6709\u7684\u8d1f\u9762buff",
      c1020: "\u6bcf\u5f53\u4f60\u91ca\u653e\u6280\u80fd\u7684\u65f6\u5019\u83b7\u5f97{number}\u70b9\u8840\u91cf\u56de\u590d",
      c1021: "\u5237\u65b0\u76841\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c1022: "\u6bcf\u6b21\u6d88\u96642\u7c7b\u5757\u6570\u91cf+2",
      c1023: "\u5237\u65b0\u76842\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c1024: "\u6bcf\u6b21\u6d88\u96643\u7c7b\u5757\u6570\u91cf+2",
      c1025: "3\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0100%",
      c1026: "\u5237\u65b0\u76843\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c1027: "\u6bcf\u6b21\u6d88\u96644\u7c7b\u5757\u6570\u91cf+2",
      c1028: "4\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0100%",
      c1029: "\u5237\u65b0\u76844\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c1030: "\u6bcf\u6b21\u6d88\u96645\u7c7b\u5757\u6570\u91cf+2",
      c1031: "5\u7c7b\u5757\u7684\u4f24\u5bb3\u589e\u52a0100%",
      c1032: "\u5237\u65b0\u76845\u7c7b\u5757\u670925%\u6982\u7387\u4e3a\u52a0\u5f3a\u5757",
      c1033: "\u5f13\u5757\u7684\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c1034: "\u9b54\u6cd5\u5757\u7684\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c1035: "\u957f\u77db\u5757\u7684\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c1036: "\u65a7\u5757\u7684\u4f24\u5bb3\u589e\u52a0{number}(%)",
      c1037: "\u6bcf\u6b21\u6d88\u9664\u5f13\u5757\u6570\u91cf+{number}",
      c1038: "\u6bcf\u6b21\u6d88\u9664\u9b54\u6cd5\u5757\u6570\u91cf+{number}",
      c1039: "\u6bcf\u6b21\u6d88\u9664\u957f\u77db\u5757\u6570\u91cf+{number}",
      c1040: "\u6bcf\u6b21\u6d88\u9664\u65a7\u5757\u6570\u91cf+{number}",
      c1041: "\u521d\u59cb\u68cb\u76d8\u4e2d\u5f13\u5757{val}\u4e3a\u52a0\u5f3a\u5f13\u5757",
      c1042: "\u521d\u59cb\u68cb\u76d8\u4e2d\u9b54\u6cd5\u5757{val}\u4e3a\u52a0\u5f3a\u9b54\u6cd5\u5757",
      c1043: "\u521d\u59cb\u68cb\u76d8\u4e2d\u957f\u77db\u5757{val}\u4e3a\u52a0\u5f3a\u957f\u77db\u5757",
      c1044: "\u521d\u59cb\u68cb\u76d8\u4e2d\u65a7\u5757{val}\u4e3a\u52a0\u5f3a\u65a7\u5757",
      c1045: "\u5237\u65b0\u7684\u5f13\u5757\u6709{val}\u6982\u7387\u4e3a\u52a0\u5f3a\u5f13\u5757",
      c1046: "\u5237\u65b0\u7684\u9b54\u6cd5\u5757\u6709{val}\u6982\u7387\u4e3a\u52a0\u5f3a\u9b54\u6cd5\u5757",
      c1047: "\u5237\u65b0\u7684\u957f\u77db\u5757\u6709{val}\u6982\u7387\u4e3a\u52a0\u5f3a\u957f\u77db\u5757",
      c1048: "\u5237\u65b0\u7684\u65a7\u5757\u6709{val}\u6982\u7387\u4e3a\u52a0\u5f3a\u65a7\u5757",
      c1049: "\u6bcf\u6d88\u9664\u653b\u51fb\u7684\u7b2c5\u6b21\u4f24\u5bb3\u4e3a2\u500d",
      c1050: "\u6218\u6597\u5f00\u59cb\u65f6\u5168\u961f\u83b7\u5f9750%\u6280\u80fd\u80fd\u91cf\uff0c\u6d88\u9664\u4f24\u5bb3\u964d\u4f4e10%",
      c1051: "\u602a\u7269\u5c06\u63d0\u524d/\u63a8\u8fdf{number}\u56de\u5408\u884c\u52a8",
      c1052: "\u86ee\u529b\uff1a\u6bcf1\u5c42\u589e\u52a0{number}\u70b9\u4f24\u5bb3",
      c1053: "\u51cf\u5c11\u86ee\u529b\uff1a\u6bcf1\u5c42\u51cf\u5c11{number}\u70b9\u4f24\u5bb3",
      c1054: "\u5b9d\u7bb1\u5173\u5361",
      c1055: "\u7279\u6b8a\u7684\u5b9d\u7bb1\u5173\u5361",
      c1056: "\u5b9d\u7bb1\u602a\u72691",
      c1057: "\u5b9d\u7bb1\u602a\u72692",
      c1058: "\u53d8\u8eab",
      c1059: "\u5c06\u53d8\u8eab\u6210\u4e3a\u602a\u7269",
      c1060: "{round}\u56de\u5408\u4ee5\u540e\u53d8\u8eab\u6210\u602a\u7269",
      c1061: "\u683c\u6321\u5f3a\u5316"
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "PassConfig", "DGame", "DGameDefine", "Fruit", "Line", "LlkMap", "LlkMapDefine", "LlkMapEditor", "ReadyGoAn", "RedLineAn", "SDKInit", "Star", "Advert", "AltasDefine", "AtlasPool", "AudioDefine", "AudioPool", "Events", "GameParm", "Logger", "NativeCtrl", "NodePool", "PrefabDefine", "PrefabPool", "SDK", "Stroage", "User", "Util", "en", "ft", "zh", "i18n", "localizedLabel", "localizedSprite", "polyglot", "AudioNode", "ContentNode", "DGameLevel", "DHome", "DLose", "DSetting", "DTips", "DWin", "DialogNode", "GameLevelItem", "LoadNode", "Main", "StarAn", "ToastNode", "use_v2.0.x_cc.Toggle_event" ]);