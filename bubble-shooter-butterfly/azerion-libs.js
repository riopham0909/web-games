var _azerionBuildVersion = "tc-8";
var _azerionIntegration = {
    "gdId": "1d8bd690253c483b82ffa647380dc76e",
    "rtgEnabled": false,
    "lbEnabled": false,
    "fbType": "dummy",
    "alxType": "none",
    "advType": "gd",
    "af": false,
    "sa": false,
    "la": true,
    "bd": 8,
    "playBtn": true,
    "cp": false,
    "build": {
        "version": "tc-8",
        "timeStamp": 1686561940572,
        "h": "4ddb89d4"
    },
    "gameTitle": "Mahjong Connect HD"
};
var playBtn = true;
var fbrqBD = 8;
var fbrqLA = true;
var fbrqSA = false; /* uglified */
(() => {
    var i = {
            34: t => {
                "use strict";
                var i = Object.prototype.hasOwnProperty,
                    p = "~";

                function n() {}

                function o(t, e, n) {
                    this.fn = t, this.context = e, this.once = n || !1
                }

                function r(t, e, n, i, r) {
                    if ("function" != typeof n) throw new TypeError("The listener must be a function");
                    n = new o(n, i || t, r), i = p ? p + e : e;
                    return t._events[i] ? t._events[i].fn ? t._events[i] = [t._events[i], n] : t._events[i].push(n) : (t._events[i] = n, t._eventsCount++), t
                }

                function l(t, e) {
                    0 == --t._eventsCount ? t._events = new n : delete t._events[e]
                }

                function e() {
                    this._events = new n, this._eventsCount = 0
                }
                Object.create && (n.prototype = Object.create(null), (new n).__proto__ || (p = !1)), e.prototype.eventNames = function() {
                    var t, e, n = [];
                    if (0 === this._eventsCount) return n;
                    for (e in t = this._events) i.call(t, e) && n.push(p ? e.slice(1) : e);
                    return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(t)) : n
                }, e.prototype.listeners = function(t) {
                    var t = p ? p + t : t,
                        e = this._events[t];
                    if (!e) return [];
                    if (e.fn) return [e.fn];
                    for (var n = 0, i = e.length, r = new Array(i); n < i; n++) r[n] = e[n].fn;
                    return r
                }, e.prototype.listenerCount = function(t) {
                    t = p ? p + t : t, t = this._events[t];
                    return t ? t.fn ? 1 : t.length : 0
                }, e.prototype.emit = function(t, e, n, i, r, o) {
                    var a = p ? p + t : t;
                    if (!this._events[a]) return !1;
                    var s, l = this._events[a],
                        d = arguments.length;
                    if (l.fn) {
                        switch (l.once && this.removeListener(t, l.fn, void 0, !0), d) {
                            case 1:
                                return l.fn.call(l.context), !0;
                            case 2:
                                return l.fn.call(l.context, e), !0;
                            case 3:
                                return l.fn.call(l.context, e, n), !0;
                            case 4:
                                return l.fn.call(l.context, e, n, i), !0;
                            case 5:
                                return l.fn.call(l.context, e, n, i, r), !0;
                            case 6:
                                return l.fn.call(l.context, e, n, i, r, o), !0
                        }
                        for (h = 1, s = new Array(d - 1); h < d; h++) s[h - 1] = arguments[h];
                        l.fn.apply(l.context, s)
                    } else
                        for (var c, u = l.length, h = 0; h < u; h++) switch (l[h].once && this.removeListener(t, l[h].fn, void 0, !0), d) {
                            case 1:
                                l[h].fn.call(l[h].context);
                                break;
                            case 2:
                                l[h].fn.call(l[h].context, e);
                                break;
                            case 3:
                                l[h].fn.call(l[h].context, e, n);
                                break;
                            case 4:
                                l[h].fn.call(l[h].context, e, n, i);
                                break;
                            default:
                                if (!s)
                                    for (c = 1, s = new Array(d - 1); c < d; c++) s[c - 1] = arguments[c];
                                l[h].fn.apply(l[h].context, s)
                        }
                    return !0
                }, e.prototype.on = function(t, e, n) {
                    return r(this, t, e, n, !1)
                }, e.prototype.once = function(t, e, n) {
                    return r(this, t, e, n, !0)
                }, e.prototype.removeListener = function(t, e, n, i) {
                    t = p ? p + t : t;
                    if (this._events[t])
                        if (e) {
                            var r = this._events[t];
                            if (r.fn) r.fn !== e || i && !r.once || n && r.context !== n || l(this, t);
                            else {
                                for (var o = 0, a = [], s = r.length; o < s; o++)(r[o].fn !== e || i && !r[o].once || n && r[o].context !== n) && a.push(r[o]);
                                a.length ? this._events[t] = 1 === a.length ? a[0] : a : l(this, t)
                            }
                        } else l(this, t);
                    return this
                }, e.prototype.removeAllListeners = function(t) {
                    return t ? (t = p ? p + t : t, this._events[t] && l(this, t)) : (this._events = new n, this._eventsCount = 0), this
                }, e.prototype.off = e.prototype.removeListener, e.prototype.addListener = e.prototype.on, e.prefixed = p, t.exports = e.EventEmitter = e
            },
            729: (t, e, n) => {
                n = [n, e, n(548), n(498)], e = function(t, e, n, i) {
                    "use strict";
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.AdType = e.AdEvents = e.ProviderTypes = e.GameDistributionBannerSize = e.GameDistributionAlignment = e.AdWrapper = void 0, Object.defineProperty(e, "AdWrapper", {
                        enumerable: !0,
                        get: function() {
                            return n.AdWrapper
                        }
                    }), Object.defineProperty(e, "GameDistributionAlignment", {
                        enumerable: !0,
                        get: function() {
                            return i.GameDistributionAlignment
                        }
                    }), Object.defineProperty(e, "GameDistributionBannerSize", {
                        enumerable: !0,
                        get: function() {
                            return i.GameDistributionBannerSize
                        }
                    }), Object.defineProperty(e, "ProviderTypes", {
                        enumerable: !0,
                        get: function() {
                            return i.ProviderTypes
                        }
                    }), Object.defineProperty(e, "AdEvents", {
                        enumerable: !0,
                        get: function() {
                            return i.AdEvents
                        }
                    }), Object.defineProperty(e, "AdType", {
                        enumerable: !0,
                        get: function() {
                            return i.AdType
                        }
                    })
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            470: (t, e, n) => {
                n = [n, e, n(12)], e = function(t, e, i) {
                    "use strict";

                    function n() {
                        this.adsEnabled = !1
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.JioAdProvider = void 0, n.prototype.setManager = function(t) {
                        this.adManager = t, this.jioGamesSP = null == (t = window._azerionJGSDK) ? void 0 : t.JioGamesSP
                    }, n.prototype.showAd = function(t) {
                        t === i.AdType.interstitial ? this.jioGamesSP.showAdMidRoll() : t === i.AdType.rewarded && this.jioGamesSP.showAdRewardedVideo(), this.resumeGameplay()
                    }, n.prototype.resumeGameplay = function() {
                        this.adManager.emit(i.AdEvents.CONTENT_RESUMED)
                    }, n.prototype.preloadAd = function(t, e, n) {
                        void 0 === t && (t = i.AdType.interstitial), console.log("Calling cache Jio Ad"), t === i.AdType.interstitial && this.jioGamesSP.cacheAdMidRoll(e, n), t === i.AdType.rewarded && this.jioGamesSP.cacheAdRewardedVideo(e, n)
                    }, n.prototype.destroyAd = function() {}, n.prototype.hideAd = function() {}, n.prototype.adAvailable = function(t) {
                        return !0
                    }, e.JioAdProvider = n
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            766: (t, e, n) => {
                n = [n, e, n(470)], e = function(t, e, n) {
                    "use strict";
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.JioAdProvider = void 0, Object.defineProperty(e, "JioAdProvider", {
                        enumerable: !0,
                        get: function() {
                            return n.JioAdProvider
                        }
                    })
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            110: (t, e, n) => {
                n = [n, e, n(12)], e = function(t, e, n) {
                    "use strict";

                    function i() {
                        this.adsEnabled = !1
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.AdFreeUntrackedProvider = void 0, i.prototype.setManager = function(t) {
                        this.adManager = t
                    }, i.prototype.showAd = function(t) {
                        void 0 === t && (t = n.AdType.interstitial), this.resumeGameplay()
                    }, i.prototype.resumeGameplay = function() {
                        this.adManager.emit(n.AdEvents.CONTENT_RESUMED)
                    }, i.prototype.preloadAd = function(t) {
                        void 0 === t && n.AdType.interstitial
                    }, i.prototype.destroyAd = function() {}, i.prototype.hideAd = function() {}, i.prototype.adAvailable = function(t) {
                        return !0
                    }, e.AdFreeUntrackedProvider = i
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            592: (t, e, n) => {
                n = [n, e, n(260)], e = function(t, e, i) {
                    "use strict";

                    function n(t) {
                        var e = this;
                        this.scaleFactor = 1, this.offsetX = 0, this.offsetY = 0, this.dummyBannerConfigList = [{
                            sizeType: i.DummyBannerSize.LargeRectangle,
                            width: 336,
                            height: 280
                        }, {
                            sizeType: i.DummyBannerSize.MediumRectangle,
                            width: 300,
                            height: 250
                        }, {
                            sizeType: i.DummyBannerSize.Billboard,
                            width: 970,
                            height: 250
                        }, {
                            sizeType: i.DummyBannerSize.Leaderboard,
                            width: 728,
                            height: 90
                        }, {
                            sizeType: i.DummyBannerSize.Skyscraper,
                            width: 120,
                            height: 600
                        }, {
                            sizeType: i.DummyBannerSize.WideSkyscraper,
                            width: 160,
                            height: 600
                        }], this.element = document.createElement("div"), this.element.style.position = "absolute", this.element.style.top = "0px", this.element.style.left = "0px", this.element.id = "banner-".concat(Date.now()).concat(1e7 * Math.random() | 0), document.body.appendChild(this.element), this.setSize(t), this.resizeListener = function() {
                            return e.resize()
                        }, window.addEventListener("resize", this.resizeListener), this.loadBanner().catch(function() {
                            return console.log("Could not create Dummy Banner")
                        })
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.DummyBanner = void 0, n.prototype.getBoundingClientRect = function() {
                        return {
                            left: 0,
                            top: 0,
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    }, n.prototype.loadBanner = function() {
                        var n = Math.floor(2 * Math.random());
                        return console.log("[Dummy]:Banner Available =>", 0 === n), new Promise(function(t, e) {
                            1 === n ? e("No Dummy banner available") : t()
                        })
                    }, n.prototype.destroy = function() {
                        try {
                            document.body.removeChild(this.element), this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null), delete this.element, delete this.parent, delete this.alignment
                        } catch (t) {
                            console.log("Could not destroy Dummy Banner")
                        }
                    }, n.prototype.getUpdatedPosition = function() {
                        var t = this.getBoundingClientRect(),
                            e = 0,
                            n = 0;
                        switch (this.alignment) {
                            case i.DummyAlignment.TopLeft:
                                e = t.left, n = t.top;
                                break;
                            case i.DummyAlignment.TopCenter:
                                e = t.left + t.width / 2 - this.width * this.scaleFactor / 2, n = t.top;
                                break;
                            case i.DummyAlignment.TopRight:
                                e = t.left + t.width - this.width * this.scaleFactor, n = t.top;
                                break;
                            case i.DummyAlignment.CenterLeft:
                                e = t.left, n = t.top + t.height / 2 - this.height * this.scaleFactor / 2;
                                break;
                            case i.DummyAlignment.Center:
                                e = t.left + t.width / 2 - this.width * this.scaleFactor / 2, n = t.top + t.height / 2 - this.height * this.scaleFactor / 2;
                                break;
                            case i.DummyAlignment.CenterRight:
                                e = t.left + t.width - this.width * this.scaleFactor, n = t.top + t.height / 2 - this.height * this.scaleFactor / 2;
                                break;
                            case i.DummyAlignment.BottomLeft:
                                e = t.left, n = t.top + t.height - this.height * this.scaleFactor;
                                break;
                            case i.DummyAlignment.BottomCenter:
                                e = t.left + t.width / 2 - this.width * this.scaleFactor / 2, n = t.top + t.height - this.height * this.scaleFactor;
                                break;
                            case i.DummyAlignment.BottomRight:
                                e = t.left + t.width - this.width * this.scaleFactor, n = t.top + t.height - this.height * this.scaleFactor
                        }
                        return {
                            x: e,
                            y: n
                        }
                    }, n.prototype.alignIn = function(t) {
                        this.alignment = t;
                        t = this.getUpdatedPosition();
                        this.element.style.left = "".concat(t.x + this.offsetX, "px"), this.element.style.top = "".concat(t.y + this.offsetY, "px")
                    }, n.prototype.resize = function() {
                        this.alignment && this.element && this.alignIn(this.alignment)
                    }, n.prototype.setSize = function(e) {
                        var t = this.dummyBannerConfigList.filter(function(t) {
                            return t.sizeType === e
                        });
                        t && 0 < t.length && (t = t[0], this.width = t.width, this.height = t.height, this.element.style.width = "".concat(this.width, "px"), this.element.style.height = "".concat(this.height, "px"))
                    }, e.DummyBanner = n
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            670: (t, e, n) => {
                n = [n, e, n(12), n(592)], e = function(t, e, i, n) {
                    "use strict";

                    function r() {
                        this.adsEnabled = !1
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.DummyProvider = void 0, r.prototype.setManager = function(t) {
                        this.adManager = t, this.adsEnabled = !0
                    }, r.prototype.showAd = function(t) {
                        var e = this,
                            n = (void 0 === t && (t = i.AdType.interstitial), console.log("[Dummy]: Ad type requested = ", t === i.AdType.interstitial ? "interstitial" : "rewarded"), this.adManager.emit(i.AdEvents.CONTENT_PAUSED), Math.floor(2 * Math.random()));
                        console.log("[Dummy]:Ad Available =>", 0 === n), 1 === n ? (console.log("[Dummy]:AD ERROR / UNAVAILABLE"), setTimeout(function() {
                            console.log("[Dummy]: Resuming game"), e.resumeGameplay()
                        }, 200)) : (t === i.AdType.rewarded && setTimeout(function() {
                            console.log("[Dummy]: Reward Claimed for rewarded ad"), e.adManager.emit(i.AdEvents.AD_REWARDED)
                        }, 100), setTimeout(function() {
                            console.log("[Dummy]: Finished watching ad"), console.log("[Dummy]: Resuming game"), e.resumeGameplay()
                        }, 200))
                    }, r.prototype.resumeGameplay = function() {
                        this.adManager.emit(i.AdEvents.CONTENT_RESUMED)
                    }, r.prototype.preloadAd = function(t) {
                        void 0 === t && i.AdType.interstitial
                    }, r.prototype.destroyAd = function() {}, r.prototype.hideAd = function() {}, r.prototype.adAvailable = function(t) {
                        return !0
                    }, r.prototype.getBanner = function(t) {
                        return this.adsEnabled ? new n.DummyBanner(t) : null
                    }, e.DummyProvider = r
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            474: (t, e, n) => {
                n = [n, e, n(12), n(444)], e = function(t, e, r, n) {
                    "use strict";
                    var i, o;

                    function a(t) {
                        var e, n, i = this;
                        if (this.adsEnabled = !1, this.hasRewarded = !1, this.adShowing = !1, !t) throw new Error("Valid game id is not provided for GD Ad provider");
                        window.GD_OPTIONS = {
                            gameId: t,
                            advertisementSettings: {
                                autoplay: !1
                            },
                            onEvent: function(t) {
                                switch (t.name) {
                                    case "SDK_GAME_PAUSE":
                                        i.adManager.emit(r.AdEvents.CONTENT_PAUSED);
                                        break;
                                    case "SDK_GAME_START":
                                    case "SDK_ERROR":
                                    case "AD_SDK_CANCELED":
                                        i.adManager.emit(r.AdEvents.CONTENT_RESUMED);
                                        break;
                                    case "SDK_READY":
                                        i.sdkLoaded();
                                        break;
                                    case "SDK_REWARDED_WATCH_COMPLETE":
                                        i.adManager.emit(r.AdEvents.AD_REWARDED), i.hasRewarded = !1
                                }
                            }
                        }, t = "gamedistribution-jssdk", n = (e = document).getElementsByTagName("script")[0], e.getElementById(t) || ((e = e.createElement("script")).id = t, e.src = "main.min.js", n.parentNode && n.parentNode.insertBefore(e, n))
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.GameDistribution = e.GameDistributionAdType = void 0, (o = i = e.GameDistributionAdType || (e.GameDistributionAdType = {})).interstitial = "interstitial", o.rewarded = "rewarded", o.display = "display", a.prototype.setManager = function(t) {
                        this.adManager = t, this.adManager.emit(r.AdEvents.AD_PROVIDER_LOADED)
                    }, a.prototype.sdkLoaded = function() {
                        this.adsEnabled = !0
                    }, a.prototype.showAd = function(t) {
                        var e = this;
                        this.adsEnabled ? void 0 === window.gdsdk || window.gdsdk && void 0 === window.gdsdk.showAd ? (this.adsEnabled = !1, this.adManager.emit(r.AdEvents.CONTENT_RESUMED)) : window.gdsdk.showAd(t === r.AdType.rewarded ? i.rewarded : i.interstitial).catch(function() {
                            t === r.AdType.rewarded && e.hasRewarded && (e.hasRewarded = !1), e.adManager.emit(r.AdEvents.CONTENT_RESUMED)
                        }) : this.adManager.emit(r.AdEvents.CONTENT_RESUMED)
                    }, a.prototype.preloadAd = function(t) {
                        var e = this;
                        !this.hasRewarded && this.adsEnabled && t === r.AdType.rewarded && (console.log("preloading ad"), window.gdsdk.preloadAd(i.rewarded).then(function() {
                            e.hasRewarded = !0, e.adManager.emit(r.AdEvents.AD_LOADED, t)
                        }))
                    }, a.prototype.adAvailable = function(t) {
                        return t !== r.AdType.rewarded || this.hasRewarded
                    }, a.prototype.destroyAd = function() {}, a.prototype.hideAd = function() {}, a.prototype.getBanner = function(t) {
                        return this.adsEnabled ? ((t = new n.GameDistributionBanner(t)).loadBanner().catch(function() {
                            return console.log("Could not create GD Banner")
                        }), t) : null
                    }, e.GameDistribution = a
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            444: (t, e, n) => {
                n = [n, e, n(474), n(869)], e = function(t, e, n, i) {
                    "use strict";

                    function r(t) {
                        this.scaleFactor = 1, this.offsetX = 0, this.offsetY = 0, this.element = document.createElement("div"), this.element.style.position = "absolute", this.element.style.top = "0px", this.element.style.left = "0px", this.element.id = "banner-".concat(Date.now()).concat(1e7 * Math.random() | 0), this.setSize(t), document.body.appendChild(this.element)
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.GameDistributionBanner = void 0, r.prototype.getBoundingClientRect = function() {
                        return {
                            left: 0,
                            top: 0,
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    }, r.prototype.loadBanner = function() {
                        return void 0 === window.gdsdk ? Promise.reject("GD Sdk not available, probably due to adblocker") : window.gdsdk.showAd(n.GameDistributionAdType.display, {
                            containerId: this.element.id
                        })
                    }, r.prototype.destroy = function() {
                        document.body.removeChild(this.element), this.resizeListener && window.removeEventListener("resize", this.resizeListener), delete this.element, delete this.parent, delete this.alignment
                    }, r.prototype.alignIn = function(t) {
                        var e = this;
                        this.parent ? console.warn("Banner already aligned, ignoring...") : (this.parent = this.getBoundingClientRect(), this.alignment = t, this.resizeListener = function() {
                            return e.resize()
                        }, window.addEventListener("resize", this.resizeListener), this.resize())
                    }, r.prototype.setOffset = function(t, e) {
                        void 0 === e && (e = 0), this.offsetX = t = void 0 === t ? 0 : t, this.offsetY = e, this.resize()
                    }, r.prototype.resize = function() {
                        if (this.parent) {
                            var t = this.parent;
                            switch (this.alignment) {
                                case i.GameDistributionAlignment.TopLeft:
                                    this.position(t.left, t.top);
                                    break;
                                case i.GameDistributionAlignment.TopCenter:
                                    this.position(t.left + t.width / 2 - this.width * this.scaleFactor / 2, t.top);
                                    break;
                                case i.GameDistributionAlignment.TopRight:
                                    this.position(t.left + t.width - this.width * this.scaleFactor, t.top);
                                    break;
                                case i.GameDistributionAlignment.CenterLeft:
                                    this.position(t.left, t.top + t.height / 2 - this.height * this.scaleFactor / 2);
                                    break;
                                case i.GameDistributionAlignment.Center:
                                    this.position(t.left + t.width / 2 - this.width * this.scaleFactor / 2, t.top + t.height / 2 - this.height * this.scaleFactor / 2);
                                    break;
                                case i.GameDistributionAlignment.CenterRight:
                                    this.position(t.left + t.width - this.width * this.scaleFactor, t.top + t.height / 2 - this.height * this.scaleFactor / 2);
                                    break;
                                case i.GameDistributionAlignment.BottomLeft:
                                    this.position(t.left, t.top + t.height - this.height * this.scaleFactor);
                                    break;
                                case i.GameDistributionAlignment.BottomCenter:
                                    this.position(t.left + t.width / 2 - this.width * this.scaleFactor / 2, t.top + t.height - this.height * this.scaleFactor);
                                    break;
                                case i.GameDistributionAlignment.BottomRight:
                                    this.position(t.left + t.width - this.width * this.scaleFactor, t.top + t.height - this.height * this.scaleFactor)
                            }
                        }
                    }, r.prototype.setSize = function(t) {
                        var e, n;
                        switch (t) {
                            default:
                            case i.GameDistributionBannerSize.LargeRectangle:
                                e = 336, n = 280;
                                break;
                            case i.GameDistributionBannerSize.MediumRectangle:
                                e = 300, n = 250;
                                break;
                            case i.GameDistributionBannerSize.Billboard:
                                e = 970, n = 250;
                                break;
                            case i.GameDistributionBannerSize.Leaderboard:
                                e = 728, n = 90;
                                break;
                            case i.GameDistributionBannerSize.Skyscraper:
                                e = 120, n = 600;
                                break;
                            case i.GameDistributionBannerSize.WideSkyscraper:
                                e = 160, n = 600
                        }
                        this.width = e, this.height = n, this.element.style.width = "".concat(e, "px"), this.element.style.height = "".concat(n, "px")
                    }, r.prototype.position = function(t, e) {
                        this.element.style.left = "".concat(t + this.offsetX, "px"), this.element.style.top = "".concat(e + this.offsetY, "px")
                    }, r.prototype.scale = function(t) {
                        this.element.style.transformOrigin = "left top", this.scaleFactor = t, this.element.style.transform = "scale(".concat(t, ")")
                    }, e.GameDistributionBanner = r
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            654: (t, e, n) => {
                n = [n, e, n(12)], e = function(t, e, i) {
                    "use strict";

                    function n(t) {
                        var e, n, i, r = this;
                        this.adsEnabled = !1, e = "yandex-jssdk", i = (n = document).getElementsByTagName("script")[0], n.getElementById(e) || ((n = n.createElement("script")).addEventListener("load", function() {
                            r.initialize()
                        }), n.id = e, n.src = "//yandex.ru/games/sdk/v2", i.parentNode.insertBefore(n, i))
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.YandexAdProvider = void 0, n.prototype.setManager = function(t) {
                        this.adManager = t
                    }, n.prototype.showAd = function(t) {
                        var e, n = this;
                        void 0 === t && (t = i.AdType.interstitial), this.adsEnabled && window.hasOwnProperty("_YaSDK") ? t === i.AdType.interstitial && null != (e = null == (e = window._YaSDK) ? void 0 : e.adv) && e.adOpened || (t === i.AdType.rewarded ? null != (e = null == (t = null == (e = window._YaSDK) ? void 0 : e.adv) ? void 0 : t.showRewardedVideo) && e.call(t, {
                            callbacks: {
                                onOpen: function() {
                                    console.log("Video ad open."), n.adManager.emit(i.AdEvents.CONTENT_PAUSED)
                                },
                                onRewarded: function() {
                                    console.log("Rewarded!"), n.adManager.emit(i.AdEvents.AD_REWARDED)
                                },
                                onClose: function() {
                                    console.log("Video ad closed."), n.resumeGameplay()
                                },
                                onError: function(t) {
                                    console.log("Error while open video ad:", t), n.resumeGameplay()
                                }
                            }
                        }) : null != (e = null == (t = null == (e = window._YaSDK) ? void 0 : e.adv) ? void 0 : t.showFullscreenAdv) && e.call(t, {
                            callbacks: {
                                onOpen: function() {
                                    console.log("Video ad open."), n.adManager.emit(i.AdEvents.CONTENT_PAUSED)
                                },
                                onClose: function() {
                                    n.resumeGameplay()
                                },
                                onError: function() {
                                    n.resumeGameplay()
                                }
                            }
                        })) : this.resumeGameplay()
                    }, n.prototype.initialize = function() {
                        var e = this;
                        window.YaGames.init().then(function(t) {
                            window._YaSDK = t, e.adsEnabled = !0
                        })
                    }, n.prototype.resumeGameplay = function() {
                        this.adManager.emit(i.AdEvents.CONTENT_RESUMED)
                    }, n.prototype.preloadAd = function(t) {
                        void 0 === t && (t = i.AdType.interstitial), this.adManager.emit(i.AdEvents.AD_LOADED, t)
                    }, n.prototype.destroyAd = function() {}, n.prototype.hideAd = function() {}, n.prototype.adAvailable = function(t) {
                        return !0
                    }, e.YandexAdProvider = n
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            563: (t, e, n) => {
                n = [n, e, n(110), n(670), n(474), n(444), n(654)], e = function(t, e, n, i, r, o, a) {
                    "use strict";
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.YandexAdProvider = e.GameDistributionBanner = e.GameDistribution = e.DummyProvider = e.AdFreeUntrackedProvider = void 0, Object.defineProperty(e, "AdFreeUntrackedProvider", {
                        enumerable: !0,
                        get: function() {
                            return n.AdFreeUntrackedProvider
                        }
                    }), Object.defineProperty(e, "DummyProvider", {
                        enumerable: !0,
                        get: function() {
                            return i.DummyProvider
                        }
                    }), Object.defineProperty(e, "GameDistribution", {
                        enumerable: !0,
                        get: function() {
                            return r.GameDistribution
                        }
                    }), Object.defineProperty(e, "GameDistributionBanner", {
                        enumerable: !0,
                        get: function() {
                            return o.GameDistributionBanner
                        }
                    }), Object.defineProperty(e, "YandexAdProvider", {
                        enumerable: !0,
                        get: function() {
                            return a.YandexAdProvider
                        }
                    })
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            260: (t, e, n) => {
                n = function(t, e) {
                    "use strict";
                    var n;
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.DummyAlignment = e.DummyBannerSize = void 0, (n = e.DummyBannerSize || (e.DummyBannerSize = {}))[n.LargeRectangle = 0] = "LargeRectangle", n[n.MediumRectangle = 1] = "MediumRectangle", n[n.Billboard = 2] = "Billboard", n[n.Leaderboard = 3] = "Leaderboard", n[n.Skyscraper = 4] = "Skyscraper", n[n.WideSkyscraper = 5] = "WideSkyscraper", (n = e.DummyAlignment || (e.DummyAlignment = {}))[n.TopLeft = 0] = "TopLeft", n[n.TopCenter = 1] = "TopCenter", n[n.TopRight = 2] = "TopRight", n[n.CenterLeft = 3] = "CenterLeft", n[n.Center = 4] = "Center", n[n.CenterRight = 5] = "CenterRight", n[n.BottomLeft = 6] = "BottomLeft", n[n.BottomCenter = 7] = "BottomCenter", n[n.BottomRight = 8] = "BottomRight"
                }.apply(e, [n, e]);
                void 0 !== n && (t.exports = n)
            },
            869: (t, e, n) => {
                n = function(t, e) {
                    "use strict";
                    var n;
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.GameDistributionAlignment = e.GameDistributionBannerSize = void 0, (n = e.GameDistributionBannerSize || (e.GameDistributionBannerSize = {}))[n.LargeRectangle = 0] = "LargeRectangle", n[n.MediumRectangle = 1] = "MediumRectangle", n[n.Billboard = 2] = "Billboard", n[n.Leaderboard = 3] = "Leaderboard", n[n.Skyscraper = 4] = "Skyscraper", n[n.WideSkyscraper = 5] = "WideSkyscraper", (n = e.GameDistributionAlignment || (e.GameDistributionAlignment = {}))[n.TopLeft = 0] = "TopLeft", n[n.TopCenter = 1] = "TopCenter", n[n.TopRight = 2] = "TopRight", n[n.CenterLeft = 3] = "CenterLeft", n[n.Center = 4] = "Center", n[n.CenterRight = 5] = "CenterRight", n[n.BottomLeft = 6] = "BottomLeft", n[n.BottomCenter = 7] = "BottomCenter", n[n.BottomRight = 8] = "BottomRight"
                }.apply(e, [n, e]);
                void 0 !== n && (t.exports = n)
            },
            498: (t, e, n) => {
                n = [n, e, n(12), n(869)], e = function(t, e, n, i) {
                    "use strict";
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.GameDistributionAlignment = e.GameDistributionBannerSize = e.ProviderTypes = e.AdType = e.AdEvents = void 0, Object.defineProperty(e, "AdEvents", {
                        enumerable: !0,
                        get: function() {
                            return n.AdEvents
                        }
                    }), Object.defineProperty(e, "AdType", {
                        enumerable: !0,
                        get: function() {
                            return n.AdType
                        }
                    }), Object.defineProperty(e, "ProviderTypes", {
                        enumerable: !0,
                        get: function() {
                            return n.ProviderTypes
                        }
                    }), Object.defineProperty(e, "GameDistributionBannerSize", {
                        enumerable: !0,
                        get: function() {
                            return i.GameDistributionBannerSize
                        }
                    }), Object.defineProperty(e, "GameDistributionAlignment", {
                        enumerable: !0,
                        get: function() {
                            return i.GameDistributionAlignment
                        }
                    })
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            12: (t, e, n) => {
                n = function(t, e) {
                    "use strict";
                    var n;
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.ProviderTypes = e.AdType = e.AdEvents = void 0, (n = e.AdEvents || (e.AdEvents = {})).CONTENT_PAUSED = "onContentPaused", n.CONTENT_RESUMED = "onContentResumed", n.AD_PROGRESSION = "onAdProgression", n.AD_DISABLED = "onAdsDisabled", n.AD_CLICKED = "onAdClicked", n.AD_REWARDED = "onAdRewardGranted", n.BANNER_SHOWN = "onBannerShown", n.BANNER_HIDDEN = "onBannerHidden", n.AD_LOADED = "onAdLoaded", n.AD_PROVIDER_LOADED = "onAdProviderLoaded", (n = e.AdType || (e.AdType = {}))[n.interstitial = 0] = "interstitial", n[n.rewarded = 1] = "rewarded", n[n.banner = 2] = "banner", (n = e.ProviderTypes || (e.ProviderTypes = {})).Yandex = "yx", n.Dummy = "dm", n.AdFree = "af", n.GD = "gd", n.GDBanner = "gdb", n.Jio = "jio"
                }.apply(e, [n, e]);
                void 0 !== n && (t.exports = n)
            },
            548: function(t, e, n) {
                var i, l = this && this.__extends || (i = function(t, e) {
                        return (i = Object.setPrototypeOf || ({
                                __proto__: []
                            }
                            instanceof Array ? function(t, e) {
                                t.__proto__ = e
                            } : function(t, e) {
                                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                            }))(t, e)
                    }, function(t, e) {
                        if ("function" != typeof e && null !== e) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");

                        function n() {
                            this.constructor = t
                        }
                        i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n)
                    }),
                    d = this && this.__importDefault || function(t) {
                        return t && t.__esModule ? t : {
                            default: t
                        }
                    },
                    n = [n, e, n(34), n(12), n(563), n(766)],
                    e = function(t, e, n, i, r, o) {
                        "use strict";
                        var a;

                        function s(t, e) {
                            var n = a.call(this) || this;
                            switch (n.bannerActive = !1, n.provider = null, t) {
                                case i.ProviderTypes.AdFree:
                                    n.provider = new r.AdFreeUntrackedProvider;
                                    break;
                                case i.ProviderTypes.Dummy:
                                    n.provider = new r.DummyProvider;
                                    break;
                                case i.ProviderTypes.Yandex:
                                    n.provider = new r.YandexAdProvider;
                                    break;
                                case i.ProviderTypes.Jio:
                                    n.provider = new o.JioAdProvider;
                                    break;
                                default:
                                case i.ProviderTypes.GD:
                                    n.provider = new r.GameDistribution(e)
                            }
                            return n.provider.setManager(n), n
                        }
                        Object.defineProperty(e, "__esModule", {
                            value: !0
                        }), e.AdWrapper = void 0, n = d(n), a = n.default, l(s, a), s.prototype.showAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not request an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.showAd.apply(this.provider, e)
                        }, s.prototype.getBanner = function() {
                            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                            if (null === this.provider) throw new Error("Can not load a banner without an provider, please attach an ad provider!");
                            return "function" == typeof this.provider.getBanner ? this.provider.getBanner.apply(this.provider, t) : null
                        }, s.prototype.preloadAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not preload an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.preloadAd.apply(this.provider, e)
                        }, s.prototype.destroyAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not destroy an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.destroyAd.apply(this.provider, e)
                        }, s.prototype.hideAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.hideAd.apply(this.provider, e)
                        }, s.prototype.adsEnabled = function() {
                            if (null === this.provider) throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                            return this.provider.adsEnabled
                        }, s.prototype.adAvailable = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                            return e.unshift(t), this.provider.adAvailable.apply(this.provider, e)
                        }, e.AdWrapper = s
                    }.apply(e, n);
                void 0 !== e && (t.exports = e)
            }
        },
        r = {},
        t = function t(e) {
            var n = r[e];
            return (void 0 !== n ? n : (n = r[e] = {
                exports: {}
            }, i[e].call(n.exports, n, n.exports, t), n)).exports
        }(729);
    self.h5ads = t
})(),
function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).h5branding = t.h5branding || {})
}(this, function(o) {
    "use strict";
    var F = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function l() {
        throw new Error("Dynamic requires are not currently supported by rollup-plugin-commonjs")
    }

    function t(t, e) {
        return t(e = {
            exports: {}
        }, e.exports), e.exports
    }
    t(function(t, z) {
        function l(t) {
            return "function" == typeof t
        }

        function e() {
            var t = setTimeout;
            return function() {
                return t(n, 1)
            }
        }

        function n() {
            for (var t = 0; t < o; t += 2)(0, S[t])(S[t + 1]), S[t] = void 0, S[t + 1] = void 0;
            o = 0
        }

        function G() {
            try {
                var t = Function("return this")().require("vertx");
                return void 0 !== (v = t.runOnLoop || t.runOnContext) ? function() {
                    v(n)
                } : e()
            } catch (t) {
                return e()
            }
        }

        function d(t, e) {
            var n, i = this,
                r = new this.constructor(u),
                o = (void 0 === r[k] && y(r), i._state);
            return o ? (n = arguments[o - 1], _(function() {
                return g(o, r, n, i._result)
            })) : a(i, r, t, e), r
        }

        function c(t) {
            var e;
            return t && "object" == typeof t && t.constructor === this ? t : (p(e = new this(u), t), e)
        }

        function u() {}

        function I(t, i, r) {
            _(function(e) {
                var n = !1,
                    t = function(t, e, n, i) {
                        try {
                            t.call(e, n, i)
                        } catch (t) {
                            return t
                        }
                    }(r, i, function(t) {
                        n || (n = !0, (i !== t ? p : f)(e, t))
                    }, function(t) {
                        n || (n = !0, m(e, t))
                    }, e._label);
                !n && t && (n = !0, m(e, t))
            }, t)
        }

        function h(t, e, n) {
            var i, r;
            e.constructor === t.constructor && n === d && e.constructor.resolve === c ? (i = t, (r = e)._state === B ? f(i, r._result) : r._state === L ? m(i, r._result) : a(r, void 0, function(t) {
                return p(i, t)
            }, function(t) {
                return m(i, t)
            })) : void 0 !== n && l(n) ? I(t, e, n) : f(t, e)
        }

        function p(e, t) {
            if (e === t) m(e, new TypeError("You cannot resolve a promise with itself"));
            else if (n = typeof t, null === t || "object" != n && "function" != n) f(e, t);
            else {
                n = void 0;
                try {
                    n = t.then
                } catch (t) {
                    return void m(e, t)
                }
                h(e, t, n)
            }
            var n
        }

        function j(t) {
            t._onerror && t._onerror(t._result), s(t)
        }

        function f(t, e) {
            t._state === C && (t._result = e, t._state = B, 0 !== t._subscribers.length) && _(s, t)
        }

        function m(t, e) {
            t._state === C && (t._state = L, t._result = e, _(j, t))
        }

        function a(t, e, n, i) {
            var r = t._subscribers,
                o = r.length;
            t._onerror = null, r[o] = e, r[o + B] = n, r[o + L] = i, 0 === o && t._state && _(s, t)
        }

        function s(t) {
            var e = t._subscribers,
                n = t._state;
            if (0 !== e.length) {
                for (var i, r = void 0, o = t._result, a = 0; a < e.length; a += 3) i = e[a], r = e[a + n], i ? g(n, i, r, o) : r(o);
                t._subscribers.length = 0
            }
        }

        function g(t, e, n, i) {
            var r = l(n),
                o = void 0,
                a = void 0,
                s = !0;
            if (r) {
                try {
                    o = n(i)
                } catch (t) {
                    s = !1, a = t
                }
                if (e === o) return void m(e, new TypeError("A promises callback cannot return that same promise."))
            } else o = i;
            e._state === C && (r && s ? p(e, o) : !1 === s ? m(e, a) : t === B ? f(e, o) : t === L && m(e, o))
        }

        function y(t) {
            t[k] = M++, t._state = void 0, t._result = void 0, t._subscribers = []
        }

        function i(t, e) {
            this._instanceConstructor = t, this.promise = new t(u), this.promise[k] || y(this.promise), w(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 !== this.length && (this.length = this.length || 0, this._enumerate(e), 0 !== this._remaining) || f(this.promise, this._result)) : m(this.promise, new Error("Array Methods must be provided an Array"))
        }

        function r(t) {
            if (this[k] = M++, this._result = this._state = void 0, this._subscribers = [], u !== t) {
                if ("function" != typeof t) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (!(this instanceof r)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                var e = this;
                try {
                    t(function(t) {
                        p(e, t)
                    }, function(t) {
                        m(e, t)
                    })
                } catch (t) {
                    m(e, t)
                }
            }
        }
        var w, o, v, b, _, A, D, x, S, T, O, P, E, k, C, B, L, M, N, R;
        t.exports = (w = Array.isArray || function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }, b = v = void(o = 0), _ = function(t, e) {
            S[o] = t, S[o + 1] = e, 2 === (o += 2) && (b ? b(n) : E())
        }, t = "undefined" != typeof window ? window : void 0, A = (A = t || {}).MutationObserver || A.WebKitMutationObserver, D = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process), x = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, S = new Array(1e3), E = void 0, E = D ? function() {
            return process.nextTick(n)
        } : A ? (O = 0, D = new A(n), P = document.createTextNode(""), D.observe(P, {
            characterData: !0
        }), function() {
            P.data = O = ++O % 2
        }) : x ? ((T = new MessageChannel).port1.onmessage = n, function() {
            return T.port2.postMessage(0)
        }) : (void 0 === t ? G : e)(), k = Math.random().toString(36).substring(2), C = void 0, B = 1, L = 2, M = 0, i.prototype._enumerate = function(t) {
            for (var e = 0; this._state === C && e < t.length; e++) this._eachEntry(t[e], e)
        }, i.prototype._eachEntry = function(e, t) {
            var n = this._instanceConstructor,
                i = n.resolve;
            if (i === c) {
                var r, o = void 0,
                    a = void 0,
                    s = !1;
                try {
                    o = e.then
                } catch (t) {
                    s = !0, a = t
                }
                o === d && e._state !== C ? this._settledAt(e._state, t, e._result) : "function" != typeof o ? (this._remaining--, this._result[t] = e) : n === R ? (r = new n(u), s ? m(r, a) : h(r, e, o), this._willSettleAt(r, t)) : this._willSettleAt(new n(function(t) {
                    return t(e)
                }), t)
            } else this._willSettleAt(i(e), t)
        }, i.prototype._settledAt = function(t, e, n) {
            var i = this.promise;
            i._state === C && (this._remaining--, t === L ? m(i, n) : this._result[e] = n), 0 === this._remaining && f(i, this._result)
        }, i.prototype._willSettleAt = function(t, e) {
            var n = this;
            a(t, void 0, function(t) {
                return n._settledAt(B, e, t)
            }, function(t) {
                return n._settledAt(L, e, t)
            })
        }, N = i, r.prototype.catch = function(t) {
            return this.then(null, t)
        }, r.prototype.finally = function(e) {
            var n = this.constructor;
            return l(e) ? this.then(function(t) {
                return n.resolve(e()).then(function() {
                    return t
                })
            }, function(t) {
                return n.resolve(e()).then(function() {
                    throw t
                })
            }) : this.then(e, e)
        }, (R = r).prototype.then = d, R.all = function(t) {
            return new N(this, t).promise
        }, R.race = function(r) {
            var o = this;
            return w(r) ? new o(function(t, e) {
                for (var n = r.length, i = 0; i < n; i++) o.resolve(r[i]).then(t, e)
            }) : new o(function(t, e) {
                return e(new TypeError("You must pass an array to race."))
            })
        }, R.resolve = c, R.reject = function(t) {
            var e = new this(u);
            return m(e, t), e
        }, R._setScheduler = function(t) {
            b = t
        }, R._setAsap = function(t) {
            _ = t
        }, R._asap = _, R.polyfill = function() {
            var t = void 0;
            if (void 0 !== F) t = F;
            else if ("undefined" != typeof self) t = self;
            else try {
                t = Function("return this")()
            } catch (t) {
                throw new Error("polyfill failed because global object is unavailable in this environment")
            }
            var e = t.Promise;
            if (e) {
                var n = null;
                try {
                    n = Object.prototype.toString.call(e.resolve())
                } catch (t) {}
                if ("[object Promise]" === n && !e.cast) return
            }
            t.Promise = R
        }, R.Promise = R)
    }).polyfill(), e.has = function(t) {
        var e, n, i = t.lastIndexOf(".");
        return !(i <= 0 || i >= t.length - 1 || (e = t.lastIndexOf(".", i - 1)) <= 0 || i - 1 <= e || !(n = r[t.slice(i + 1)])) && 0 <= n.indexOf(" " + t.slice(e + 1, i) + " ")
    }, e.is = function(t) {
        var e, n = t.lastIndexOf(".");
        return !(n <= 0 || n >= t.length - 1 || 0 <= t.lastIndexOf(".", n - 1) || !(e = r[t.slice(n + 1)])) && 0 <= e.indexOf(" " + t.slice(0, n) + " ")
    }, e.get = function(t) {
        var e, n, i = t.lastIndexOf(".");
        return i <= 0 || i >= t.length - 1 || (e = t.lastIndexOf(".", i - 1)) <= 0 || i - 1 <= e || !(n = r[t.slice(i + 1)]) || n.indexOf(" " + t.slice(e + 1, i) + " ") < 0 ? null : t.slice(e + 1)
    };
    var r, n = e;

    function e() {}
    a.setList = function(t) {
        r = t || {}
    }, a.getDomain = function(t) {
        var e;
        return r ? (e = t.match(/\./g)) && e.length < 2 ? t : (e = this.getTld(t)) ? (e = t.length - e.length - 1, e = t.lastIndexOf(".", e - 1) + 1, t.substring(e) || "") : null : null
    }, a.getTld = function(t) {
        var e;
        return r ? (e = t.lastIndexOf("."), e = t.substring(e + 1), r[e.toLowerCase()] && n.get(t) || e) : ""
    }, a.KEY = "Domains";
    var i = a;

    function a() {}
    Object.defineProperty(d, "instance", {
        get: function() {
            return d.classInstance = void 0 === d.classInstance ? new d : d.classInstance
        },
        enumerable: !1,
        configurable: !0
    }), d.prototype.load = function(e, t, n) {
        var i = this;
        return this.contains(e) ? Promise.reject("Already in cache.") : (this.cache[e] = {
            url: t,
            data: null
        }, this.requestXhr(t, n).then(function(t) {
            return i.loadComplete(e, t)
        }).catch(function(t) {
            return i.remove(e), Promise.reject(t)
        }))
    }, d.prototype.loadComplete = function(t, e) {
        if (!this.contains(t)) return Promise.reject("Item was removed from cache before loading was complete.");
        try {
            var n = JSON.parse(e);
            return this.cache[t].data = n, Promise.resolve(n)
        } catch (t) {
            return Promise.reject("There was an error parsing JSON file.")
        }
    }, d.prototype.remove = function(t) {
        this.contains(t) && delete this.cache[t]
    }, d.prototype.get = function(t) {
        return this.contains(t) ? this.cache[t].data : null
    }, d.prototype.contains = function(t) {
        return this.cache.hasOwnProperty(t)
    }, d.prototype.isLoading = function(t) {
        return this.contains(t) && null === this.cache[t].data
    }, d.prototype.isLoaded = function(t) {
        return this.contains(t) && null !== this.cache[t].data
    }, d.prototype.loadScript = function(i, t, r) {
        return new Promise(function(t, e) {
            var n = document.createElement("script");
            n.src = i, n.async = !1, n.onload = function() {
                "function" == typeof r && r(), t()
            }, document.head.appendChild(n)
        })
    }, d.prototype.requestXhr = function(n, i) {
        var r;
        return void 0 === i && (i = "application/json"), window.XMLHttpRequest ? (r = new XMLHttpRequest, new Promise(function(t, e) {
            r.onreadystatechange = function() {
                4 === r.readyState && (200 === r.status ? (t(r.responseText), r.onreadystatechange = null) : 0 < r.status && (e("There was a problem with the request: status ".concat(r.status)), r.onreadystatechange = null))
            };
            try {
                r.open("GET", n, !0), r.setRequestHeader("Content-Type", i), r.send()
            } catch (t) {
                e("Error: Unable to send request, CORS not allowed.")
            }
        })) : Promise.reject("Unable to send request, XMLHttpRequest not supported.")
    };
    var s = d;

    function d() {
        this.cache = {}
    }

    function c(o, a, s, l) {
        return new(s = s || Promise)(function(t, e) {
            function n(t) {
                try {
                    r(l.next(t))
                } catch (t) {
                    e(t)
                }
            }

            function i(t) {
                try {
                    r(l.throw(t))
                } catch (t) {
                    e(t)
                }
            }

            function r(e) {
                e.done ? t(e.value) : new s(function(t) {
                    t(e.value)
                }).then(n, i)
            }
            r((l = l.apply(o, a || [])).next())
        })
    }

    function u(i, r) {
        var o, a, s, l = {
                label: 0,
                sent: function() {
                    if (1 & s[0]) throw s[1];
                    return s[1]
                },
                trys: [],
                ops: []
            },
            t = {
                next: e(0),
                throw: e(1),
                return: e(2)
            };
        return "function" == typeof Symbol && (t[Symbol.iterator] = function() {
            return this
        }), t;

        function e(n) {
            return function(t) {
                var e = [n, t];
                if (o) throw new TypeError("Generator is already executing.");
                for (; l;) try {
                    if (o = 1, a && (s = 2 & e[0] ? a.return : e[0] ? a.throw || ((s = a.return) && s.call(a), 0) : a.next) && !(s = s.call(a, e[1])).done) return s;
                    switch (a = 0, (e = s ? [2 & e[0], s.value] : e)[0]) {
                        case 0:
                        case 1:
                            s = e;
                            break;
                        case 4:
                            return l.label++, {
                                value: e[1],
                                done: !1
                            };
                        case 5:
                            l.label++, a = e[1], e = [0];
                            continue;
                        case 7:
                            e = l.ops.pop(), l.trys.pop();
                            continue;
                        default:
                            if (!(s = 0 < (s = l.trys).length && s[s.length - 1]) && (6 === e[0] || 2 === e[0])) {
                                l = 0;
                                continue
                            }
                            if (3 === e[0] && (!s || e[1] > s[0] && e[1] < s[3])) l.label = e[1];
                            else if (6 === e[0] && l.label < s[1]) l.label = s[1], s = e;
                            else {
                                if (!(s && l.label < s[2])) {
                                    s[2] && l.ops.pop(), l.trys.pop();
                                    continue
                                }
                                l.label = s[2], l.ops.push(e)
                            }
                    }
                    e = r.call(i, l)
                } catch (t) {
                    e = [6, t], a = 0
                } finally {
                    o = s = 0
                }
                if (5 & e[0]) throw e[1];
                return {
                    value: e[0] ? e[1] : void 0,
                    done: !0
                }
            }
        }
    }
    o.BrandingDomain = void 0, (T = o.BrandingDomain || (o.BrandingDomain = {}))[T.Neutral = 0] = "Neutral", T[T.Yepi = 1] = "Yepi", T[T.Spele = 2] = "Spele", T[T.Funnygames = 3] = "Funnygames", T[T.Kizi = 4] = "Kizi", T[T.PlayCell = 5] = "PlayCell", T[T.GameCell = 6] = "GameCell", T[T.Bild = 7] = "Bild", T[T.AGame = 8] = "AGame", T[T.Admeen = 9] = "Admeen", T[T.PlayTime = 10] = "PlayTime", T[T.Zigiz = 11] = "Zigiz", p.isBip = function() {
        return -1 !== window.location.search.indexOf("bipgaming") || "bip.fbrq.io" === window.location.host
    }, p.isPlaycellApp = function() {
        return -1 !== window.location.search.indexOf("playcellApp")
    }, p.isAGame = function() {
        return -1 !== window.location.search.indexOf("agame")
    }, p.isAirfi = function() {
        return !!window.hasOwnProperty("airfi") && window.airfi
    }, p.isPlaytime = function() {
        return -1 !== window.location.host.indexOf("playtime.nl")
    }, p.isBild = function() {
        return "bild.fbrq.io" === window.location.host || -1 !== window.location.host.indexOf("contentfleet.com")
    }, p.isYandex = function() {
        return window.hasOwnProperty("_YaSDK") || window.hasOwnProperty("YaGames")
    }, p.getYandexBaseURL = function() {
        var t;
        return null != (t = null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.browser) && t.lang && "en" === window.YandexGamesSDKEnvironment.browser.lang ? "yandex.com" : "yandex.ru"
    };
    var h = p;

    function p() {}
    o.UtmTargets = void 0, (T = o.UtmTargets || (o.UtmTargets = {}))[T.splashscreen = 0] = "splashscreen", T[T.logo = 1] = "logo", T[T.facebook = 2] = "facebook", T[T.twitter = 3] = "twitter", T[T.playstore = 4] = "playstore", T[T.appstore = 5] = "appstore", T[T.more_games = 6] = "more_games", T[T.download_game = 7] = "download_game", T[T.walkthrough = 8] = "walkthrough", T[T.disclaimer = 9] = "disclaimer", T[T.highscores = 10] = "highscores", m.getProtocol = function(t) {
        return t ? "https://" : "//"
    }, m.getUtmContent = function(t) {
        return "string" == typeof t ? t : o.UtmTargets[t]
    }, m.getDomainURL = function(t, e) {
        var n;
        switch (t) {
            case o.BrandingDomain.Spele:
                n = e + "www.spele.nl";
                break;
            case o.BrandingDomain.Yepi:
                n = e + "www.yepi.com";
                break;
            case o.BrandingDomain.Admeen:
                n = "https://media.admeen.com/branding/link.php";
                break;
            case o.BrandingDomain.PlayCell:
                n = e + "www.playcell.com";
                break;
            case o.BrandingDomain.GameCell:
                n = e + "www.gamecell.com";
                break;
            case o.BrandingDomain.Kizi:
                n = e + "www.kizi.com";
                break;
            case o.BrandingDomain.Bild:
                n = e + "www.bildspielt.de";
                break;
            case o.BrandingDomain.Funnygames:
                n = e + "www.funnygames.nu";
                break;
            case o.BrandingDomain.PlayTime:
                n = e + "playtime.nl";
                break;
            default:
            case o.BrandingDomain.AGame:
                n = e + "www.agame.com";
                break;
            case o.BrandingDomain.Zigiz:
                n = e + "m.zigiz.com"
        }
        return n
    }, m.getPromoURL = function(t, e, n, i, r) {
        return window.hasOwnProperty("_YaSDK") || window.hasOwnProperty("YaGames") ? "https://".concat(h.getYandexBaseURL(), "/games/developer?name=Azerion") : t === o.BrandingDomain.Admeen ? "https://media.admeen.com/branding/link.php" : t === o.BrandingDomain.Bild ? e : e + "/?utm_source=" + n + "&utm_medium=html5&utm_term=" + i + "&utm_content=" + r + "&utm_campaign=Gamedistribution"
    };
    var f = m;

    function m() {}

    function g(t, e, n) {
        var i = document.createElement("script");
        i.setAttribute("src", t + "?v=" + e), "function" == typeof n && (i.onload = n), document.body.appendChild(i)
    }
    w.loadPortalScript = function(t) {
        t && t.hasOwnProperty("minijuegos") && -1 !== t.minijuegos.indexOf(D.getSourceSite()) && (void 0 !== window.mpConfig ? window.mpConfig.partner = "orange-games" : window.mpConfig = {
            partner: "orange-games"
        }, g("https://ext.minijuegosgratis.com/external-host/main.js", Date.now() / 1e3)), t && t.hasOwnProperty("kongregate") && -1 !== t.kongregate.indexOf(D.getSourceSite()) && g("https://cdn1.kongregate.com/javascripts/kongregate_api.js", Date.now() / 1e3, function() {
            "undefined" != typeof kongregateAPI && kongregateAPI.loadAPI(function() {
                window.kongregate = kongregateAPI.getAPI()
            })
        }), t && t.hasOwnProperty("newgrounds") && -1 !== t.newgrounds.indexOf(D.getSourceSite()) && g("https://cdn.fbrq.io/@azerion/splash/assets/scripts/newgroundsio.min.js", Date.now() / 1e3)
    };
    var y = w;

    function w() {}
    b.isStandAlone = function() {
        var t;
        return null != (t = window._azerionIntegration) && t.sa ? null == (t = window._azerionIntegration) ? void 0 : t.sa : !!window.hasOwnProperty("fbrqSA") && window.fbrqSA
    }, b.hasDomainForCustomBuild = function() {
        var t;
        return (null == (t = window._azerionIntegration) ? void 0 : t.bd) || window.hasOwnProperty("fbrqBD")
    }, b.getDomainForCustomBuild = function() {
        var t;
        return null != (t = window._azerionIntegration) && t.bd && (null == (t = window._azerionIntegration) ? void 0 : t.bd) in o.BrandingDomain ? null == (t = window._azerionIntegration) ? void 0 : t.bd : window.hasOwnProperty("fbrqBD") && window.fbrqBD in o.BrandingDomain ? window.fbrqBD : void 0
    }, b.hasLinksSettingsForCustomBuild = function() {
        var t;
        return (null == (t = window._azerionIntegration) ? void 0 : t.la) || window.hasOwnProperty("fbrqLA")
    }, b.getLinkSettingsForCustomBuild = function() {
        var t;
        return null != (t = window._azerionIntegration) && t.la ? null == (t = window._azerionIntegration) ? void 0 : t.la : window.hasOwnProperty("fbrqLA") ? window.hasOwnProperty("fbrqLA") : void 0
    };
    var v = b;

    function b() {}
    A.preload = function(t) {
        var e = Promise.all([s.instance.load(i.KEY, "".concat(D.ASSET_LOCATION, "json/domains.json?v=").concat(t), "text/plain"), s.instance.load(A.SITELOCK_PORTALS, "".concat(D.ASSET_LOCATION, "json/sitelock.json?v=").concat(t), "text/plain")]);
        return Promise.all([s.instance.load(A.INTERNAL_PORTALS_KEY, "".concat(D.ASSET_LOCATION, "json/internal.json?v=").concat(t), "text/plain"), s.instance.load(A.CONTRACTED_PORTALS_KEY, "".concat(D.ASSET_LOCATION, "json/contracted.json?v=").concat(t), "text/plain"), s.instance.load(A.SPECIAL_PORTALS_KEY, "".concat(D.ASSET_LOCATION, "json/special.json?v=").concat(t), "text/plain")]), e.then(function(t) {
            var e = t[0],
                t = t[1];
            i.setList(e), y.loadPortalScript(t), A.setSiteLock(t)
        }).catch(function() {
            console.warn("Unable to parse json")
        })
    }, A.setSiteLock = function(t) {
        A.siteLocks = t
    }, Object.defineProperty(A, "brandingLogoUrl", {
        get: function() {
            var t;
            switch (D.isOnDevice() || h.isAirfi() ? D.ASSET_LOCATION = "assets/" : "fbrq.io" === D.getSourceSite(!0) && (D.ASSET_LOCATION = "https://" + window.location.host + "/@azerion/splash/assets/"), D.getBrandingDomain()) {
                case o.BrandingDomain.Spele:
                    t = "spele";
                    break;
                case o.BrandingDomain.PlayCell:
                    t = "playcell";
                    break;
                case o.BrandingDomain.GameCell:
                    t = "gamecell";
                    break;
                case o.BrandingDomain.Yepi:
                    t = "yepi";
                    break;
                case o.BrandingDomain.Admeen:
                    t = "admeen";
                    break;
                case o.BrandingDomain.Bild:
                    t = "bild";
                    break;
                case o.BrandingDomain.Kizi:
                    t = "kizi";
                    break;
                case o.BrandingDomain.Funnygames:
                    t = "funnygames";
                    break;
                case o.BrandingDomain.PlayTime:
                    t = "playtime";
                    break;
                default:
                case o.BrandingDomain.AGame:
                    t = "agame";
                    break;
                case o.BrandingDomain.Zigiz:
                    t = "zigiz"
            }
            return D.ASSET_LOCATION + "images/branding_logo_" + t + "_small.png"
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(A, "brandingBackgroundColor", {
        get: function() {
            var t;
            switch (D.getBrandingDomain()) {
                case o.BrandingDomain.Spele:
                    t = "#4a72ad";
                    break;
                case o.BrandingDomain.PlayCell:
                    t = "#52a1e1";
                    break;
                case o.BrandingDomain.GameCell:
                    t = "#c600b2";
                    break;
                case o.BrandingDomain.Yepi:
                    t = "#0573a7";
                    break;
                case o.BrandingDomain.AGame:
                    t = "#0C486C";
                    break;
                case o.BrandingDomain.Admeen:
                    t = "#4267B2";
                    break;
                case o.BrandingDomain.Bild:
                    t = "#de0000";
                    break;
                default:
                case o.BrandingDomain.Kizi:
                    t = "#012f50";
                    break;
                case o.BrandingDomain.Funnygames:
                    t = "#33b0ff";
                    break;
                case o.BrandingDomain.PlayTime:
                case o.BrandingDomain.Zigiz:
                    t = "#023a63"
            }
            return t
        },
        enumerable: !1,
        configurable: !0
    }), A.blockedDomain = function() {
        return D.isOnDevice() || A.isSpecial()
    }, A.createCampaignURL = function(t, e) {
        var n = D.getSourceSite(),
            i = D.getBrandingDomain(),
            r = f.getProtocol(D.isOnDevice()),
            r = f.getDomainURL(i, r),
            e = f.getUtmContent(e);
        return f.getPromoURL(i, r, n, t, e)
    }, A.openCampaignLink = function(t, e) {
        t = A.createCampaignURL(t, e);
        A.blockedDomain() || (e = window.open(t)) && e.focus && e.focus()
    }, A.isInternal = function() {
        return A.hostMatchesList(s.instance.get(A.INTERNAL_PORTALS_KEY))
    }, A.isContracted = function() {
        return A.hostMatchesList(s.instance.get(A.CONTRACTED_PORTALS_KEY))
    }, A.isSpecial = function() {
        return A.hostMatchesList(s.instance.get(A.SPECIAL_PORTALS_KEY))
    }, A.isAdmeen = function() {
        var t;
        return !(!A.siteLocks || !A.siteLocks.hasOwnProperty("admeen")) && (t = A.siteLocks.admeen, A.hostMatchesList(t))
    }, A.isKongregate = function() {
        var t;
        return !(!A.siteLocks || !A.siteLocks.hasOwnProperty("kongregate")) && (t = A.siteLocks.kongregate, A.hostMatchesList(t))
    }, A.isNewgrounds = function() {
        var t;
        return !(!A.siteLocks || !A.siteLocks.hasOwnProperty("newgrounds")) && (t = A.siteLocks.newgrounds, A.hostMatchesList(t))
    }, A.crossPromoAllowed = function() {
        var t = A.siteLocks.yandex;
        return A.hostMatchesList(t)
    }, A.outGoingLinksAllowed = function() {
        return !(h.isAirfi() || A.isSpecial() || A.isContracted()) && (!v.hasLinksSettingsForCustomBuild() || v.getLinkSettingsForCustomBuild())
    }, A.hostMatchesList = function(t) {
        t = t || [];
        for (var e = D.getSourceSite(), n = 0; n < t.length; n++)
            if (e === t[n]) return !0;
        return !1
    }, A.LOGO_KEY = "branding_logo", A.INTERNAL_PORTALS_KEY = "branding_portals", A.CONTRACTED_PORTALS_KEY = "branding_contracted", A.SPECIAL_PORTALS_KEY = "branding_special", A.SITELOCK_PORTALS = "sitelock_portals", A.DOMAIN_OVERWRITE = null, A.analyticsEnabled = !0;
    var _ = A;

    function A() {}
    x.loadHost = function() {
        return c(this, void 0, void 0, function() {
            var e, n;
            return u(this, function(t) {
                switch (t.label) {
                    case 0:
                        if (e = document.referrer || window.location.host, !window.hasOwnProperty("gdsdk")) return [3, 4];
                        t.label = 1;
                    case 1:
                        return t.trys.push([1, 3, , 4]), [4, window.gdsdk.getSession()];
                    case 2:
                        return n = t.sent(), e = n.location.parentDomain, [3, 4];
                    case 3:
                        return n = t.sent(), console.log(n), [3, 4];
                    case 4:
                        return x.HOST = e, [2]
                }
            })
        })
    }, x.getSourceSite = function(t) {
        var e = x.HOST;
        return -1 !== (e = (t = void 0 !== t && t) ? window.location.host : e).indexOf("embed.gamedistribution.com") && -1 !== window.location.search.indexOf("gd_sdk_referrer_url") && (e = x.getUrlParameter("gd_sdk_referrer_url") || e), e = decodeURIComponent(e), h.isBild() ? "bildspielt.de" : h.isBip() ? "bipgaming.com" : (e = (e = -1 < e.indexOf("://") ? e.split("/")[2] : e.split("/")[0]).split(":")[0], null !== (t = i.getDomain(e)) ? t : 3 === e.split(".").length ? e.substr(e.indexOf(".") + 1) : e)
    }, x.getBrandingDomain = function() {
        if (v.hasDomainForCustomBuild()) return v.getDomainForCustomBuild();
        if (_.DOMAIN_OVERWRITE) return _.DOMAIN_OVERWRITE;
        var t = x.getSourceSite();
        if (_.isAdmeen()) return o.BrandingDomain.Admeen;
        if (h.isPlaycellApp() || h.isBip()) return o.BrandingDomain.PlayCell;
        switch (t) {
            case "spele.nl":
                return o.BrandingDomain.Spele;
            case "yepi.com":
                return o.BrandingDomain.Yepi;
            case "oyunskor.com":
            case "barbioyunu.com.tr":
            case "bebekoyunu.com.tr":
            case "oyunkolu.com":
            case "oyungemisi.com":
            case "oyunlar1.com":
            case "oyunkuzusu.com":
            case "kraloyun.com":
            case "rekoroyun.com":
            case "oyundedem.com":
            case "oyunoyna.com":
            case "pastaoyunu.com.tr":
            case "playcell.com":
                return o.BrandingDomain.PlayCell;
            case "gamecell.com":
                return o.BrandingDomain.GameCell;
            case "playxl.com":
                return o.BrandingDomain.Admeen;
            case "kizi.com":
                return o.BrandingDomain.Kizi;
            case "bildspielt.de":
                return o.BrandingDomain.Bild;
            case "funnygames.nl":
                return o.BrandingDomain.Funnygames;
            case "playtime.nl":
                return o.BrandingDomain.PlayTime;
            default:
            case "agame.com":
                return o.BrandingDomain.AGame;
            case "gmbl.nl":
            case "zigiz.com":
                return o.BrandingDomain.Zigiz;
            case "coolmathgames.com":
                return o.BrandingDomain.Neutral
        }
    }, x.getReferrer = function(t) {
        return -1 !== t.indexOf("?ref=") ? t.substr(t.indexOf("?ref=") + 5) : t
    }, x.inIframe = function() {
        try {
            return window.self !== window.top
        } catch (t) {
            return !0
        }
    }, x.inGDGameZone = function() {
        return -1 !== document.referrer.indexOf("html5.gamedistribution.com")
    }, x.getDomain = function(t) {
        var e = document.createElement("a");
        return e.href = t, e.origin
    }, x.isOnDevice = function() {
        return void 0 !== window.cordova && !/(gamedistribution\.com)/.test(window.location.hostname)
    }, x.isTc = function() {
        return /(teamcity\.azerdev\.com)/.test(window.location.host)
    }, x.getRandomRange = function(t, e) {
        return Math.random() * (e - t) + t | 0
    }, x.getUrlParameter = function(t) {
        t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        t = new RegExp("[\\?&]" + t + "=([^&#]*)").exec(location.search);
        return null === t ? "" : decodeURIComponent(t[1].replace(/\+/g, " "))
    }, x.intTimeToString = function(t) {
        var e = Math.floor(t / 3600),
            n = Math.floor(t % 3600 / 60),
            t = t % 60;
        return (e < 10 ? "0" + e : e.toString()) + ":" + (n < 10 ? "0" + n : n.toString()) + ":" + (t < 10 ? "0" + t : t.toString())
    }, x.LANGUAGE = "en", x.HOST = document.referrer || window.location.host, x.ASSET_LOCATION = "assets/";
    var D = x;

    function x() {}
    var S = t(function(t, e) {
            t.exports = function n(i, r, o) {
                function a(e, t) {
                    if (!r[e]) {
                        if (!i[e]) {
                            if (!t && l) return l();
                            if (s) return s(e, !0);
                            t = new Error("Cannot find module '" + e + "'");
                            throw t.code = "MODULE_NOT_FOUND", t
                        }
                        t = r[e] = {
                            exports: {}
                        };
                        i[e][0].call(t.exports, function(t) {
                            return a(i[e][1][t] || t)
                        }, t, t.exports, n, i, r, o)
                    }
                    return r[e].exports
                }
                for (var s = l, t = 0; t < o.length; t++) a(o[t]);
                return a
            }({
                1: [function(t, I, j) {
                    ! function() {
                        var c, n, u, h, p, t, f, s, d, l, m, o, r, a, i, g, e, y, w = this || Function("return this")(),
                            v = (t = Date.now || function() {
                                return +new Date
                            }, f = "undefined" != typeof SHIFTY_DEBUG_NOW ? SHIFTY_DEBUG_NOW : t, n = "undefined" != typeof window && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame) || setTimeout, E.prototype.tween = function(t) {
                                return this._isTweening ? this : (void 0 === t && this._configured || this.setConfig(t), this._timestamp = f(), this._start(this.get(), this._attachment), this.resume())
                            }, E.prototype.setConfig = function(t) {
                                t = t || {}, this._configured = !0, this._attachment = t.attachment, this._pausedAtTime = null, this._scheduleId = null, this._delay = t.delay || 0, this._start = t.start || b, this._step = t.step || b, this._finish = t.finish || b, this._duration = t.duration || 500, this._currentState = A({}, t.from || this.get()), this._originalState = this.get(), this._targetState = A({}, t.to || this.get());
                                var e = this,
                                    n = (this._timeoutHandler = function() {
                                        O(e, e._timestamp, e._delay, e._duration, e._currentState, e._originalState, e._targetState, e._easing, e._step, e._scheduleFunction)
                                    }, this._currentState),
                                    i = this._targetState;
                                return D(i, n), this._easing = P(n, t.easing || "linear"), this._filterArgs = [n, this._originalState, i, this._easing], T(this, "tweenCreated"), this
                            }, E.prototype.get = function() {
                                return A({}, this._currentState)
                            }, E.prototype.set = function(t) {
                                this._currentState = t
                            }, E.prototype.pause = function() {
                                return this._pausedAtTime = f(), this._isPaused = !0, this
                            }, E.prototype.resume = function() {
                                return this._isPaused && (this._timestamp += f() - this._pausedAtTime), this._isPaused = !1, this._isTweening = !0, this._timeoutHandler(), this
                            }, E.prototype.seek = function(t) {
                                t = Math.max(t, 0);
                                var e = f();
                                return this._timestamp + t === 0 || (this._timestamp = e - t, this.isPlaying()) || (this._isTweening = !0, this._isPaused = !1, O(this, this._timestamp, this._delay, this._duration, this._currentState, this._originalState, this._targetState, this._easing, this._step, this._scheduleFunction, e), this.pause()), this
                            }, E.prototype.stop = function(t) {
                                return this._isTweening = !1, this._isPaused = !1, this._timeoutHandler = b, (w.cancelAnimationFrame || w.webkitCancelAnimationFrame || w.oCancelAnimationFrame || w.msCancelAnimationFrame || w.mozCancelRequestAnimationFrame || w.clearTimeout)(this._scheduleId), t && (T(this, "beforeTween"), x(1, this._currentState, this._originalState, this._targetState, 1, 0, this._easing), T(this, "afterTween"), T(this, "afterTweenEnd"), this._finish.call(this, this._currentState, this._attachment)), this
                            }, E.prototype.isPlaying = function() {
                                return this._isTweening && !this._isPaused
                            }, E.prototype.setScheduleFunction = function(t) {
                                this._scheduleFunction = t
                            }, E.prototype.dispose = function() {
                                for (var t in this) this.hasOwnProperty(t) && delete this[t]
                            }, E.prototype.filter = {}, c = E.prototype.formula = {
                                linear: function(t) {
                                    return t
                                }
                            }, A(E, {
                                now: f,
                                each: _,
                                tweenProps: x,
                                tweenProp: S,
                                applyFilter: T,
                                shallowCopy: A,
                                defaults: D,
                                composeEasingObject: P
                            }), "function" == typeof SHIFTY_DEBUG_NOW && (w.timeoutHandler = O), "object" == typeof j ? I.exports = E : void 0 === w.Tweenable && (w.Tweenable = E), E);

                        function b() {}

                        function _(t, e) {
                            for (var n in t) Object.hasOwnProperty.call(t, n) && e(n)
                        }

                        function A(e, n) {
                            return _(n, function(t) {
                                e[t] = n[t]
                            }), e
                        }

                        function D(e, n) {
                            _(n, function(t) {
                                void 0 === e[t] && (e[t] = n[t])
                            })
                        }

                        function x(t, e, n, i, r, o, a) {
                            var s, l, d = t < o ? 0 : (t - o) / r;
                            for (s in e) e.hasOwnProperty(s) && (l = "function" == typeof(l = a[s]) ? l : c[l], e[s] = S(n[s], i[s], l, d));
                            return e
                        }

                        function S(t, e, n, i) {
                            return t + (e - t) * n(i)
                        }

                        function T(e, n) {
                            var i = E.prototype.filter,
                                r = e._filterArgs;
                            _(i, function(t) {
                                void 0 !== i[t][n] && i[t][n].apply(e, r)
                            })
                        }

                        function O(t, e, n, i, r, o, a, s, l, d, c) {
                            p = e + n + i, u = Math.min(c || f(), p), h = p <= u, p = i - (p - u), t.isPlaying() && (h ? (l(a, t._attachment, p), t.stop(!0)) : (t._scheduleId = d(t._timeoutHandler, 1e3 / 60), T(t, "beforeTween"), u < e + n ? x(1, r, o, a, 1, 1, s) : x(u, r, o, a, i, e + n, s), T(t, "afterTween"), l(r, t._attachment, p)))
                        }

                        function P(t, e) {
                            var n = {},
                                i = typeof e;
                            return _(t, "string" == i || "function" == i ? function(t) {
                                n[t] = e
                            } : function(t) {
                                n[t] || (n[t] = e[t] || "linear")
                            }), n
                        }

                        function E(t, e) {
                            this._currentState = t || {}, this._configured = !1, this._scheduleFunction = n, void 0 !== e && this.setConfig(e)
                        }

                        function k(n) {
                            d.each(n, function(t) {
                                var e = n[t];
                                "string" == typeof e && e.match(i) && (n[t] = B(i, e, z))
                            })
                        }

                        function z(t) {
                            3 === (t = (t = t).replace(/#/, "")).length && (t = (t = t.split(""))[0] + t[0] + t[1] + t[1] + t[2] + t[2]), e[0] = C(t.substr(0, 2)), e[1] = C(t.substr(2, 2)), e[2] = C(t.substr(4, 2));
                            t = e;
                            return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
                        }

                        function C(t) {
                            return parseInt(t, 16)
                        }

                        function B(t, e, n) {
                            var i = e.match(t),
                                r = e.replace(t, g);
                            if (i)
                                for (var o, a = i.length, s = 0; s < a; s++) o = i.shift(), r = r.replace(g, n(o));
                            return r
                        }

                        function G(t) {
                            for (var e = t.match(o), n = e.length, i = t.match(a)[0], r = 0; r < n; r++) i += parseInt(e[r], 10) + ",";
                            return i.slice(0, -1) + ")"
                        }

                        function L(r, o) {
                            d.each(o, function(t) {
                                for (var e = R(r[t]), n = e.length, i = 0; i < n; i++) r[o[t].chunkNames[i]] = +e[i];
                                delete r[t]
                            })
                        }

                        function M(n, i) {
                            d.each(i, function(t) {
                                n[t];
                                var e = function(t, e) {
                                        y.length = 0;
                                        for (var n = e.length, i = 0; i < n; i++) y.push(t[e[i]]);
                                        return y
                                    }(function(t, e) {
                                        for (var n, i = {}, r = e.length, o = 0; o < r; o++) i[n = e[o]] = t[n], delete t[n];
                                        return i
                                    }(n, i[t].chunkNames), i[t].chunkNames),
                                    e = function(t, e) {
                                        for (var n = t, i = e.length, r = 0; r < i; r++) n = n.replace(g, +e[r].toFixed(4));
                                        return n
                                    }(i[t].formatString, e);
                                n[t] = B(r, e, G)
                            })
                        }

                        function R(t) {
                            return t.match(o)
                        }
                        v.shallowCopy(v.prototype.formula, {
                            easeInQuad: function(t) {
                                return Math.pow(t, 2)
                            },
                            easeOutQuad: function(t) {
                                return -(Math.pow(t - 1, 2) - 1)
                            },
                            easeInOutQuad: function(t) {
                                return (t /= .5) < 1 ? .5 * Math.pow(t, 2) : -.5 * ((t -= 2) * t - 2)
                            },
                            easeInCubic: function(t) {
                                return Math.pow(t, 3)
                            },
                            easeOutCubic: function(t) {
                                return Math.pow(t - 1, 3) + 1
                            },
                            easeInOutCubic: function(t) {
                                return (t /= .5) < 1 ? .5 * Math.pow(t, 3) : .5 * (Math.pow(t - 2, 3) + 2)
                            },
                            easeInQuart: function(t) {
                                return Math.pow(t, 4)
                            },
                            easeOutQuart: function(t) {
                                return -(Math.pow(t - 1, 4) - 1)
                            },
                            easeInOutQuart: function(t) {
                                return (t /= .5) < 1 ? .5 * Math.pow(t, 4) : -.5 * ((t -= 2) * Math.pow(t, 3) - 2)
                            },
                            easeInQuint: function(t) {
                                return Math.pow(t, 5)
                            },
                            easeOutQuint: function(t) {
                                return Math.pow(t - 1, 5) + 1
                            },
                            easeInOutQuint: function(t) {
                                return (t /= .5) < 1 ? .5 * Math.pow(t, 5) : .5 * (Math.pow(t - 2, 5) + 2)
                            },
                            easeInSine: function(t) {
                                return 1 - Math.cos(t * (Math.PI / 2))
                            },
                            easeOutSine: function(t) {
                                return Math.sin(t * (Math.PI / 2))
                            },
                            easeInOutSine: function(t) {
                                return -.5 * (Math.cos(Math.PI * t) - 1)
                            },
                            easeInExpo: function(t) {
                                return 0 === t ? 0 : Math.pow(2, 10 * (t - 1))
                            },
                            easeOutExpo: function(t) {
                                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
                            },
                            easeInOutExpo: function(t) {
                                return 0 === t ? 0 : 1 === t ? 1 : (t /= .5) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * --t))
                            },
                            easeInCirc: function(t) {
                                return -(Math.sqrt(1 - t * t) - 1)
                            },
                            easeOutCirc: function(t) {
                                return Math.sqrt(1 - Math.pow(t - 1, 2))
                            },
                            easeInOutCirc: function(t) {
                                return (t /= .5) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
                            },
                            easeOutBounce: function(t) {
                                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                            },
                            easeInBack: function(t) {
                                return t * t * (2.70158 * t - 1.70158)
                            },
                            easeOutBack: function(t) {
                                return --t * t * (2.70158 * t + 1.70158) + 1
                            },
                            easeInOutBack: function(t) {
                                var e = 1.70158;
                                return (t /= .5) < 1 ? t * t * ((1 + (e *= 1.525)) * t - e) * .5 : .5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2)
                            },
                            elastic: function(t) {
                                return -1 * Math.pow(4, -8 * t) * Math.sin((6 * t - 1) * (2 * Math.PI) / 2) + 1
                            },
                            swingFromTo: function(t) {
                                var e = 1.70158;
                                return (t /= .5) < 1 ? t * t * ((1 + (e *= 1.525)) * t - e) * .5 : .5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2)
                            },
                            swingFrom: function(t) {
                                return t * t * (2.70158 * t - 1.70158)
                            },
                            swingTo: function(t) {
                                return --t * t * (2.70158 * t + 1.70158) + 1
                            },
                            bounce: function(t) {
                                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                            },
                            bouncePast: function(t) {
                                return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 2 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : t < 2.5 / 2.75 ? 2 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 2 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
                            },
                            easeFromTo: function(t) {
                                return (t /= .5) < 1 ? .5 * Math.pow(t, 4) : -.5 * ((t -= 2) * Math.pow(t, 3) - 2)
                            },
                            easeFrom: function(t) {
                                return Math.pow(t, 4)
                            },
                            easeTo: function(t) {
                                return Math.pow(t, .25)
                            }
                        }), v.setBezierFunction = function(t, e, n, i, r) {
                            function o(t) {
                                return c = (r = 1) - (h = 3 * (e = a)) - (u = 3 * ((n = p) - a) - h), (((1 - (n = 3 * s) - (e = 3 * ((i = f) - s) - n)) * (i = function(t, e) {
                                    for (var n, i, r, o, a = t, s = 0; s < 8; s++) {
                                        if (d(r = l(a) - t) < e) return a;
                                        if (d(o = (3 * c * a + 2 * u) * a + h) < 1e-6) break;
                                        a -= r / o
                                    }
                                    if ((a = t) < (n = 0)) return n;
                                    if ((i = 1) < a) return i;
                                    for (; n < i;) {
                                        if (d((r = l(a)) - t) < e) return a;
                                        r < t ? n = a : i = a, a = .5 * (i - n) + n
                                    }
                                    return a
                                }(t, 1 / (200 * r))) + e) * i + n) * i;

                                function l(t) {
                                    return ((c * t + u) * t + h) * t
                                }

                                function d(t) {
                                    return 0 <= t ? t : 0 - t
                                }
                                var e, n, i, r, c, u, h
                            }
                            var a, s, p, f, a = e,
                                s = n,
                                p = i,
                                f = r;
                            return o.displayName = t, o.x1 = e, o.y1 = n, o.x2 = i, o.y2 = r, v.prototype.formula[t] = o
                        }, v.unsetBezierFunction = function(t) {
                            delete v.prototype.formula[t]
                        }, (s = new v)._filterArgs = [], v.interpolate = function(t, e, n, i, r) {
                            var o = v.shallowCopy({}, t),
                                r = r || 0,
                                i = v.composeEasingObject(t, i || "linear"),
                                a = (s.set({}), s._filterArgs),
                                a = (a.length = 0, a[0] = o, a[1] = t, a[2] = e, a[3] = i, v.applyFilter(s, "tweenCreated"), v.applyFilter(s, "beforeTween"), v.tweenProps(n, o, t, e, 1, r, i));
                            return v.applyFilter(s, "afterTween"), a
                        }, d = v, l = /(\d|\-|\.)/, m = /([^\-0-9\.]+)/g, o = /[0-9.\-]+/g, r = new RegExp("rgb\\(" + o.source + /,\s*/.source + o.source + /,\s*/.source + o.source + "\\)", "g"), a = /^.*\(/, i = /#([0-9]|[a-f]){3,6}/gi, g = "VAL", e = [], y = [], d.prototype.filter.token = {
                            tweenCreated: function(t, e, n, i) {
                                var o, a;
                                k(t), k(e), k(n), this._tokenData = (o = t, a = {}, d.each(o, function(t) {
                                    var r, e, n = o[t];
                                    "string" == typeof n && (r = R(n), a[t] = {
                                        formatString: ((e = (n = n).match(m)) ? 1 !== e.length && !n.charAt(0).match(l) || e.unshift("") : e = ["", ""], e.join(g)),
                                        chunkNames: function(t) {
                                            for (var e = [], n = r.length, i = 0; i < n; i++) e.push("_" + t + "_" + i);
                                            return e
                                        }(t)
                                    })
                                }), a)
                            },
                            beforeTween: function(t, e, n, i) {
                                var s = i,
                                    l = this._tokenData;
                                d.each(l, function(t) {
                                    var e = l[t].chunkNames,
                                        n = e.length,
                                        i = s[t];
                                    if ("string" == typeof i)
                                        for (var r = i.split(" "), o = r[r.length - 1], a = 0; a < n; a++) s[e[a]] = r[a] || o;
                                    else
                                        for (a = 0; a < n; a++) s[e[a]] = i;
                                    delete s[t]
                                }), L(t, this._tokenData), L(e, this._tokenData), L(n, this._tokenData)
                            },
                            afterTween: function(t, e, n, i) {
                                var a, s;
                                M(t, this._tokenData), M(e, this._tokenData), M(n, this._tokenData), a = i, s = this._tokenData, d.each(s, function(t) {
                                    var e = s[t].chunkNames,
                                        n = e.length,
                                        i = a[e[0]];
                                    if ("string" == typeof i) {
                                        for (var r = "", o = 0; o < n; o++) r += " " + a[e[o]], delete a[e[o]];
                                        a[t] = r.substr(1)
                                    } else a[t] = i
                                })
                            }
                        }
                    }.call(null)
                }, {}],
                2: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}", this.containerAspectRatio = 1, r.apply(this, arguments)
                    }
                    var r = t("./shape"),
                        o = t("./utils");
                    ((i.prototype = new r).constructor = i).prototype._pathString = function(t) {
                        var e = t.strokeWidth,
                            t = 50 - (t.trailWidth && t.trailWidth > t.strokeWidth ? t.trailWidth : e) / 2;
                        return o.render(this._pathTemplate, {
                            radius: t,
                            "2radius": 2 * t
                        })
                    }, i.prototype._trailString = function(t) {
                        return this._pathString(t)
                    }, e.exports = i
                }, {
                    "./shape": 7,
                    "./utils": 9
                }],
                3: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 0,{center} L 100,{center}", r.apply(this, arguments)
                    }
                    var r = t("./shape"),
                        o = t("./utils");
                    ((i.prototype = new r).constructor = i).prototype._initializeSvg = function(t, e) {
                        t.setAttribute("viewBox", "0 0 100 " + e.strokeWidth), t.setAttribute("preserveAspectRatio", "none")
                    }, i.prototype._pathString = function(t) {
                        return o.render(this._pathTemplate, {
                            center: t.strokeWidth / 2
                        })
                    }, i.prototype._trailString = function(t) {
                        return this._pathString(t)
                    }, e.exports = i
                }, {
                    "./shape": 7,
                    "./utils": 9
                }],
                4: [function(t, e, n) {
                    e.exports = {
                        Line: t("./line"),
                        Circle: t("./circle"),
                        SemiCircle: t("./semicircle"),
                        Square: t("./square"),
                        Path: t("./path"),
                        Shape: t("./shape"),
                        utils: t("./utils")
                    }
                }, {
                    "./circle": 2,
                    "./line": 3,
                    "./path": 5,
                    "./semicircle": 6,
                    "./shape": 7,
                    "./square": 8,
                    "./utils": 9
                }],
                5: [function(t, e, n) {
                    function i(t, e) {
                        if (!(this instanceof i)) throw new Error("Constructor was called without new keyword");
                        e = l.extend({
                            duration: 800,
                            easing: "linear",
                            from: {},
                            to: {},
                            step: function() {}
                        }, e), t = l.isString(t) ? document.querySelector(t) : t, this.path = t, this._opts = e, this._tweenable = null;
                        t = this.path.getTotalLength();
                        this.path.style.strokeDasharray = t + " " + t, this.set(0)
                    }
                    var s = t("shifty"),
                        l = t("./utils"),
                        r = {
                            easeIn: "easeInCubic",
                            easeOut: "easeOutCubic",
                            easeInOut: "easeInOutCubic"
                        };
                    i.prototype.value = function() {
                        var t = this._getComputedDashOffset(),
                            e = this.path.getTotalLength();
                        return parseFloat((1 - t / e).toFixed(6), 10)
                    }, i.prototype.set = function(t) {
                        this.stop(), this.path.style.strokeDashoffset = this._progressToOffset(t);
                        var e, n = this._opts.step;
                        l.isFunction(n) && (e = this._easing(this._opts.easing), n(this._calculateTo(t, e), this._opts.shape || this, this._opts.attachment))
                    }, i.prototype.stop = function() {
                        this._stopTween(), this.path.style.strokeDashoffset = this._getComputedDashOffset()
                    }, i.prototype.animate = function(t, n, e) {
                        n = n || {}, l.isFunction(n) && (e = n, n = {});
                        var i = l.extend({}, n),
                            r = l.extend({}, this._opts),
                            r = (n = l.extend(r, n), this._easing(n.easing)),
                            i = this._resolveFromAndTo(t, r, i),
                            o = (this.stop(), this.path.getBoundingClientRect(), this._getComputedDashOffset()),
                            t = this._progressToOffset(t),
                            a = this;
                        this._tweenable = new s, this._tweenable.tween({
                            from: l.extend({
                                offset: o
                            }, i.from),
                            to: l.extend({
                                offset: t
                            }, i.to),
                            duration: n.duration,
                            easing: r,
                            step: function(t) {
                                a.path.style.strokeDashoffset = t.offset;
                                var e = n.shape || a;
                                n.step(t, e, n.attachment)
                            },
                            finish: function(t) {
                                l.isFunction(e) && e()
                            }
                        })
                    }, i.prototype._getComputedDashOffset = function() {
                        var t = window.getComputedStyle(this.path, null);
                        return parseFloat(t.getPropertyValue("stroke-dashoffset"), 10)
                    }, i.prototype._progressToOffset = function(t) {
                        var e = this.path.getTotalLength();
                        return e - t * e
                    }, i.prototype._resolveFromAndTo = function(t, e, n) {
                        return n.from && n.to ? {
                            from: n.from,
                            to: n.to
                        } : {
                            from: this._calculateFrom(e),
                            to: this._calculateTo(t, e)
                        }
                    }, i.prototype._calculateFrom = function(t) {
                        return s.interpolate(this._opts.from, this._opts.to, this.value(), t)
                    }, i.prototype._calculateTo = function(t, e) {
                        return s.interpolate(this._opts.from, this._opts.to, t, e)
                    }, i.prototype._stopTween = function() {
                        null !== this._tweenable && (this._tweenable.stop(), this._tweenable = null)
                    }, i.prototype._easing = function(t) {
                        return r.hasOwnProperty(t) ? r[t] : t
                    }, e.exports = i
                }, {
                    "./utils": 9,
                    shifty: 1
                }],
                6: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0", this.containerAspectRatio = 2, r.apply(this, arguments)
                    }
                    var r = t("./shape"),
                        o = t("./circle"),
                        a = t("./utils");
                    ((i.prototype = new r).constructor = i).prototype._initializeSvg = function(t, e) {
                        t.setAttribute("viewBox", "0 0 100 50")
                    }, i.prototype._initializeTextContainer = function(t, e, n) {
                        t.text.style && (n.style.top = "auto", n.style.bottom = "0", t.text.alignToBottom ? a.setStyle(n, "transform", "translate(-50%, 0)") : a.setStyle(n, "transform", "translate(-50%, 50%)"))
                    }, i.prototype._pathString = o.prototype._pathString, i.prototype._trailString = o.prototype._trailString, e.exports = i
                }, {
                    "./circle": 2,
                    "./shape": 7,
                    "./utils": 9
                }],
                7: [function(t, e, n) {
                    function i(t, e) {
                        if (!(this instanceof i)) throw new Error("Constructor was called without new keyword");
                        if (0 !== arguments.length) {
                            this._opts = o.extend({
                                color: "#555",
                                strokeWidth: 1,
                                trailColor: null,
                                trailWidth: null,
                                fill: null,
                                text: {
                                    style: {
                                        color: null,
                                        position: "absolute",
                                        left: "50%",
                                        top: "50%",
                                        padding: 0,
                                        margin: 0,
                                        transform: {
                                            prefix: !0,
                                            value: "translate(-50%, -50%)"
                                        }
                                    },
                                    autoStyleContainer: !0,
                                    alignToBottom: !0,
                                    value: null,
                                    className: "progressbar-text"
                                },
                                svgStyle: {
                                    display: "block",
                                    width: "100%"
                                },
                                warnings: !1
                            }, e, !0), o.isObject(e) && void 0 !== e.svgStyle && (this._opts.svgStyle = e.svgStyle), o.isObject(e) && o.isObject(e.text) && void 0 !== e.text.style && (this._opts.text.style = e.text.style);
                            var e = this._createSvgView(this._opts),
                                n = o.isString(t) ? document.querySelector(t) : t;
                            if (!n) throw new Error("Container does not exist: " + t);
                            this._container = n, this._container.appendChild(e.svg), this._opts.warnings && this._warnContainerAspectRatio(this._container), this._opts.svgStyle && o.setStyles(e.svg, this._opts.svgStyle), this.svg = e.svg, this.path = e.path, this.trail = e.trail, this.text = null;
                            t = o.extend({
                                attachment: void 0,
                                shape: this
                            }, this._opts);
                            this._progressPath = new r(e.path, t), o.isObject(this._opts.text) && null !== this._opts.text.value && this.setText(this._opts.text.value)
                        }
                    }
                    var r = t("./path"),
                        o = t("./utils"),
                        a = "Object is destroyed";
                    i.prototype.animate = function(t, e, n) {
                        if (null === this._progressPath) throw new Error(a);
                        this._progressPath.animate(t, e, n)
                    }, i.prototype.stop = function() {
                        if (null === this._progressPath) throw new Error(a);
                        void 0 !== this._progressPath && this._progressPath.stop()
                    }, i.prototype.destroy = function() {
                        if (null === this._progressPath) throw new Error(a);
                        this.stop(), this.svg.parentNode.removeChild(this.svg), this.svg = null, this.path = null, this.trail = null, (this._progressPath = null) !== this.text && (this.text.parentNode.removeChild(this.text), this.text = null)
                    }, i.prototype.set = function(t) {
                        if (null === this._progressPath) throw new Error(a);
                        this._progressPath.set(t)
                    }, i.prototype.value = function() {
                        if (null === this._progressPath) throw new Error(a);
                        return void 0 === this._progressPath ? 0 : this._progressPath.value()
                    }, i.prototype.setText = function(t) {
                        if (null === this._progressPath) throw new Error(a);
                        null === this.text && (this.text = this._createTextContainer(this._opts, this._container), this._container.appendChild(this.text)), o.isObject(t) ? (o.removeChildren(this.text), this.text.appendChild(t)) : this.text.innerHTML = t
                    }, i.prototype._createSvgView = function(t) {
                        var e = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                            n = (this._initializeSvg(e, t), null),
                            t = ((t.trailColor || t.trailWidth) && (n = this._createTrail(t), e.appendChild(n)), this._createPath(t));
                        return e.appendChild(t), {
                            svg: e,
                            path: t,
                            trail: n
                        }
                    }, i.prototype._initializeSvg = function(t, e) {
                        t.setAttribute("viewBox", "0 0 100 100")
                    }, i.prototype._createPath = function(t) {
                        var e = this._pathString(t);
                        return this._createPathElement(e, t)
                    }, i.prototype._createTrail = function(t) {
                        var e = this._trailString(t),
                            t = o.extend({}, t);
                        return t.trailColor || (t.trailColor = "#eee"), t.trailWidth || (t.trailWidth = t.strokeWidth), t.color = t.trailColor, t.strokeWidth = t.trailWidth, t.fill = null, this._createPathElement(e, t)
                    }, i.prototype._createPathElement = function(t, e) {
                        var n = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        return n.setAttribute("d", t), n.setAttribute("stroke", e.color), n.setAttribute("stroke-width", e.strokeWidth), e.fill ? n.setAttribute("fill", e.fill) : n.setAttribute("fill-opacity", "0"), n
                    }, i.prototype._createTextContainer = function(t, e) {
                        var n = document.createElement("div"),
                            i = (n.className = t.text.className, t.text.style);
                        return i && (t.text.autoStyleContainer && (e.style.position = "relative"), o.setStyles(n, i), i.color || (n.style.color = t.color)), this._initializeTextContainer(t, e, n), n
                    }, i.prototype._initializeTextContainer = function(t, e, n) {}, i.prototype._pathString = function(t) {
                        throw new Error("Override this function for each progress bar")
                    }, i.prototype._trailString = function(t) {
                        throw new Error("Override this function for each progress bar")
                    }, i.prototype._warnContainerAspectRatio = function(t) {
                        var e, n, i;
                        this.containerAspectRatio && (e = window.getComputedStyle(t, null), n = parseFloat(e.getPropertyValue("width"), 10), i = parseFloat(e.getPropertyValue("height"), 10), o.floatEquals(this.containerAspectRatio, n / i) || (console.warn("Incorrect aspect ratio of container", "#" + t.id, "detected:", e.getPropertyValue("width") + "(width)", "/", e.getPropertyValue("height") + "(height)", "=", n / i), console.warn("Aspect ratio of should be", this.containerAspectRatio)))
                    }, e.exports = i
                }, {
                    "./path": 5,
                    "./utils": 9
                }],
                8: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 0,{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{strokeWidth}", this._trailTemplate = "M {startMargin},{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{halfOfStrokeWidth}", r.apply(this, arguments)
                    }
                    var r = t("./shape"),
                        o = t("./utils");
                    ((i.prototype = new r).constructor = i).prototype._pathString = function(t) {
                        var e = 100 - t.strokeWidth / 2;
                        return o.render(this._pathTemplate, {
                            width: e,
                            strokeWidth: t.strokeWidth,
                            halfOfStrokeWidth: t.strokeWidth / 2
                        })
                    }, i.prototype._trailString = function(t) {
                        var e = 100 - t.strokeWidth / 2;
                        return o.render(this._trailTemplate, {
                            width: e,
                            strokeWidth: t.strokeWidth,
                            halfOfStrokeWidth: t.strokeWidth / 2,
                            startMargin: t.strokeWidth / 2 - t.trailWidth / 2
                        })
                    }, e.exports = i
                }, {
                    "./shape": 7,
                    "./utils": 9
                }],
                9: [function(t, e, n) {
                    var o = "Webkit Moz O ms".split(" ");

                    function i(t, e, n) {
                        for (var i = t.style, r = 0; r < o.length; ++r) i[o[r] + a(e)] = n;
                        i[e] = n
                    }

                    function a(t) {
                        return t.charAt(0).toUpperCase() + t.slice(1)
                    }

                    function s(t) {
                        return "[object Array]" !== Object.prototype.toString.call(t) && "object" == typeof t && !!t
                    }

                    function r(t, e) {
                        for (var n in t) t.hasOwnProperty(n) && e(t[n], n)
                    }
                    e.exports = {
                        extend: function t(e, n, i) {
                            for (var r in e = e || {}, i = i || !1, n = n || {}) {
                                var o, a;
                                n.hasOwnProperty(r) && (o = e[r], a = n[r], i && s(o) && s(a) ? e[r] = t(o, a, i) : e[r] = a)
                            }
                            return e
                        },
                        render: function(t, e) {
                            var n, i, r, o = t;
                            for (n in e) e.hasOwnProperty(n) && (i = e[n], r = new RegExp("\\{" + n + "\\}", "g"), o = o.replace(r, i));
                            return o
                        },
                        setStyle: i,
                        setStyles: function(n, t) {
                            r(t, function(t, e) {
                                null != t && (s(t) && !0 === t.prefix ? i(n, e, t.value) : n.style[e] = t)
                            })
                        },
                        capitalize: a,
                        isString: function(t) {
                            return "string" == typeof t || t instanceof String
                        },
                        isFunction: function(t) {
                            return "function" == typeof t
                        },
                        isObject: s,
                        forEachObject: r,
                        floatEquals: function(t, e) {
                            return Math.abs(t - e) < .001
                        },
                        removeChildren: function(t) {
                            for (; t.firstChild;) t.removeChild(t.firstChild)
                        }
                    }
                }, {}]
            }, {}, [4])(4)
        }),
        T = (O.getInstance = function(t) {
            if (!O.instance) {
                if (!t) throw new Error("Can not create new SplashLoader instance without options!");
                O.instance = new O(t)
            }
            return O.instance
        }, O.prototype.create = function() {
            return c(this, void 0, void 0, function() {
                var i, r, o, a;
                return u(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return r = "\n        #h5branding-center {\n            position: absolute;\n            top: 45%;\n            left: 50%;\n            transform: translate(-50%, -20%);\n            text-align: center;\n            width: 100%;\n        }\n        #h5branding-wrapper {\n            position: relative;\n            z-index: 665;\n            width: 150px;\n            height: 150px;\n            display:inline-block;\n            margin: 35px 40px 96px 40px;\n        }\n\n        #h5branding-version {\n            position: absolute;\n            right: 10px;\n            font-family: Helvetica, Arial, sans-serif;\n            color: #ffffff;\n            font-size: 0.8em;\n            top: 10px;\n            display: none;\n        }\n\n        #h5branding-wrapper > #h5branding-bar, #h5branding-wrapper > img {\n            box-shadow: inset 10px 10px 20px 5px rgba(0, 0, 0, 0.5);\n            border-radius: 50%;\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n        }\n\n        #h5branding-ad {\n            position: relative;\n            z-index: 667;\n            border-radius: 5px;\n            border: 3px solid white;\n            background: rgba(256, 256, 256, 0.2);\n            width: 336px;\n            height: 280px;\n            display: none;\n            margin: 0px 10px 0px 10px;\n        }\n\n        #h5branding-wrapper > img {\n            /* Needs appropriate vendor prefixes */\n            box-sizing: border-box;\n\n            /* This needs to be equal to strokeWidth */\n            padding: 4%;\n        }\n\n        #h5branding-wrapper > img {\n            border-radius: 50%;\n            box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.5), 5px 5px 7px rgba(0, 0, 0, 0.3);\n        }\n\n        #h5branding-container {\n            box-sizing: border-box;\n            position: absolute;\n            z-index: 664;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background-color: #000;\n            overflow: hidden;\n        }\n\n        #h5branding-background {\n            position: absolute;\n            top: -25%;\n            left: -25%;\n            width: 150%;\n            height: 150%;\n            background-blend-mode: multiply;\n            background-size: cover;\n            filter: blur(40px) brightness(1.5);\n        }\n\n        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n             /* IE10+ CSS styles go here */\n             #h5branding-background {\n                background-image: none !important;\n             }\n        }\n\n        #h5branding-logo {\n            position: absolute;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n            text-align: center;\n            top: 10%;\n        }\n\n        #h5branding-logo > img {\n            height: 150px;\n        }\n\n        #h5branding-title {\n            position: absolute;\n            width: 100%;\n            background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.5) 50%, transparent);\n            color: #fff;\n            text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);\n            bottom:10%;\n            padding: 15px 0;\n            text-align: center;\n            font-size: 18px;\n            font-family: Helvetica, Arial, sans-serif;\n            font-weight: bold;\n            line-height: 100%;\n        }\n\n        #h5branding-button {\n            /* border: 0; */\n            padding: 10px 22px;\n            border-radius: 5px;\n            border: 3px solid white;\n            background: linear-gradient(0deg, #dddddd, #ffffff);\n            color: #222;\n            text-transform: uppercase;\n            text-shadow: 0 0 1px #fff;\n            font-family: Helvetica, Arial, sans-serif;\n            font-weight: bold;\n            font-size: 18px;\n            cursor: pointer;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n            display: none;\n            width: 150px;\n            position: absolute;\n            top: 170px;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n        }\n\n        @media (orientation: portrait) and (max-width: 1080px) {\n            #h5branding-logo > img {\n                height: initial;\n                width:100%;\n            }\n        }\n\n        @media (orientation: landscape) and (max-height: 640px) {\n            #h5branding-title {\n                display: none;\n            }\n\n            #h5branding-logo > img {\n                height: 100px;\n            }\n        }\n\n        @media (orientation: landscape) and (max-height: 460px) {\n        /*This fix is for is for iPhone 13*/\n            #h5branding-title {\n                display: block;\n                bottom: 5%;\n            }\n\n            #h5branding-wrapper {\n                width: 110px;\n                height: 110px;\n                margin: 0;\n                transform: scale(0.8, 0.8);\n            }\n\n            #h5branding-logo {\n                top: 0;\n                transform: scale(0.5, 0.5);\n            }\n\n            #h5branding-button {\n                top: initial;\n                width: 110px;\n                position: absolute;\n                top: 140px;\n                left: 0;\n                right: 0;\n            }\n\n            #h5branding-ad {\n               display: none !important;\n            }\n\n            #h5branding-center {\n                transform: translate(-50%, -50%);\n            }\n        }\n\n        @media (orientation: portrait) and (max-width: 250px) {\n            #h5branding-logo {\n                top: 2%;\n            }\n        }\n\n        @media (orientation: landscape) and (max-width: 330px) {\n             #h5branding-button {\n                top: 120px;\n            }\n\n            #h5branding-logo > img {\n                height: 70px;\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 850px) {\n            #h5branding-ad {\n               display: none !important;\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 1100px) {\n            #h5branding-center {\n                top: 40%;\n            }\n\n            #h5branding-title {\n               bottom: 5%\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 900px) {\n        /*This fix is for is for iPhone*/\n            #h5branding-title {\n               display: block\n            }\n        }\n\n        @media (orientation: landscape) and (min-width: 800px) {\n            #h5branding-wrapper {\n                margin-left: 120px;\n                margin-right: 120px;\n            }\n        }\n\n        ", e = this.getGameLogoUrl(), n = this.options.gameTitle, i = '\n        <div id="h5branding-background"></div>\n        <div id="h5branding-version"></div>\n        <div id="h5branding-logo"></div>\n        <div id="h5branding-center">\n            <div id="h5branding-ad"></div>\n            <div id="h5branding-wrapper">\n                <img src="'.concat(e, '" />\n                <div id="h5branding-bar"></div>\n                <button id="h5branding-button" onclick="h5branding.SplashLoader.getInstance().onPlayButtonClick();">Play</button>\n            </div>\n        </div>\n        <div id="h5branding-title">').concat(n, "</div>\n    "), o = document.head || document.getElementsByTagName("head")[0], (a = document.createElement("style")).type = "text/css", a.styleSheet ? a.styleSheet.cssText = r : a.appendChild(document.createTextNode(r)), o.appendChild(a), (r = document.createElement("div")).innerHTML = i, r.id = "h5branding-container", (o = document.body || document.getElementsByTagName("body")[0]).insertBefore(r, o.firstChild), this.circleLoader = new S.Circle("#h5branding-bar", {
                                strokeWidth: 3,
                                color: this.options.barColor
                            }), (a = document.getElementById("h5branding-version")) && (a.innerHTML = this.options.version), [4, this.loadLibs()];
                        case 1:
                            return t.sent(), [4, D.loadHost()];
                        case 2:
                            return t.sent(), [4, this.loadBranding()];
                        case 3:
                            return t.sent(), this.loaded = !0, [2]
                    }
                    var e, n
                })
            })
        }, O.prototype.loadBranding = function() {
            return c(this, void 0, void 0, function() {
                var e, n;
                return u(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, _.preload(Date.now().toString())];
                        case 1:
                            return t.sent(), (e = document.getElementById("h5branding-background")) && (e.style.backgroundColor = _.brandingBackgroundColor), (e = document.getElementById("h5branding-logo")) && D.getBrandingDomain() !== o.BrandingDomain.Neutral && ((n = document.createElement("img")).src = _.brandingLogoUrl.replace("_small", ""), e.appendChild(n)), [2]
                    }
                })
            })
        }, O.prototype.loadLibs = function() {
            var n = this,
                i = this.options.libs.map(function(t, e) {
                    return s.instance.loadScript(t, !0, function() {
                        n.setScriptloadProgress(i.length, e + 1)
                    })
                });
            return Promise.all(i)
        }, Object.defineProperty(O.prototype, "bannerAllowed", {
            get: function() {
                var t = document.body.clientWidth,
                    e = document.body.clientHeight;
                return this.progress < 100 && !(e < t && e <= 460) && !(t < 600 && e < 850)
            },
            enumerable: !1,
            configurable: !0
        }), O.prototype.showBanner = function() {
            var t;
            return this.bannerAllowed && (t = document.getElementById("h5branding-ad")) ? (t.style.display = "inline-flex", t) : null
        }, O.prototype.setScriptloadProgress = function(t, e) {
            this.circleLoader.animate(.3 * e / t, null, function() {})
        }, O.prototype.setLoadProgress = function(t) {
            var e, n = this;

            n.showPlayButton= false;
            this.loaded && (100 == (this.progress = t = 30 + .7 * t) ? (e = document.querySelector("#h5branding-button"), this.circleLoader.animate(1, null, function() {
                !D.inGDGameZone() && e && !0 === n.showPlayButton ? e.style.display = "block" : !D.inGDGameZone() && !1 !== n.showPlayButton || n.onPlayButtonClick()
            })) : this.circleLoader.animate(t / 100, null, function() {}))
        }, O.prototype.setButtonCallback = function(t) {
            this.buttonCallback = t
        }, O.prototype.onPlayButtonClick = function() {
            this.buttonCallback && this.buttonCallback()
        }, O.prototype.destroy = function() {
            var t = document.querySelector("#h5branding-container");
            null !== t && null !== t.parentNode && t.parentNode.removeChild(t)
        }, O.prototype.getGameLogoUrl = function() {
            return "assets/icon.jpeg"
        }, O);

    function O(t) {
        this.circleLoader = null, this.loaded = !1, this.showPlayButton = "undefined" == typeof playBtn || playBtn, this.progress = 0, this.options = {
            gameId: "12346",
            gameTitle: "Place Holder",
            gameName: "place-holder",
            libs: [],
            version: "dev",
            barColor: "white",
            gaMeasurementId: "none"
        }, this.options.gameId = t.gameId, this.options.gameTitle = t.gameTitle, this.options.version = t.version, this.options.barColor = t.barColor || this.options.barColor, this.options.libs = t.libs, this.options.gaMeasurementId = t.gaMeasurementId
    }
    o.Branding = _, o.Domain = i, o.Hosts = h, o.SplashLoader = T, o.Utils = D, Object.defineProperty(o, "__esModule", {
        value: !0
    })
});