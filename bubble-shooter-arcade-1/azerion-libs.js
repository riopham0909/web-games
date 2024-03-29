var _azerionBuildVersion = "tc-14";
var _azerionIntegration = {
    "gdId": "42deccbbdde24144bb9e231375ccbf60",
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
        "version": "tc-14",
        "timeStamp": 1679907932215,
        "h": "09313e37"
    }
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
                    h = "~";

                function n() {}

                function r(t, e, n) {
                    this.fn = t, this.context = e, this.once = n || !1
                }

                function o(t, e, n, i, o) {
                    if ("function" != typeof n) throw new TypeError("The listener must be a function");
                    n = new r(n, i || t, o), i = h ? h + e : e;
                    return t._events[i] ? t._events[i].fn ? t._events[i] = [t._events[i], n] : t._events[i].push(n) : (t._events[i] = n, t._eventsCount++), t
                }

                function d(t, e) {
                    0 == --t._eventsCount ? t._events = new n : delete t._events[e]
                }

                function e() {
                    this._events = new n, this._eventsCount = 0
                }
                Object.create && (n.prototype = Object.create(null), (new n).__proto__ || (h = !1)), e.prototype.eventNames = function() {
                    var t, e, n = [];
                    if (0 === this._eventsCount) return n;
                    for (e in t = this._events) i.call(t, e) && n.push(h ? e.slice(1) : e);
                    return Object.getOwnPropertySymbols ? n.concat(Object.getOwnPropertySymbols(t)) : n
                }, e.prototype.listeners = function(t) {
                    var t = h ? h + t : t,
                        e = this._events[t];
                    if (!e) return [];
                    if (e.fn) return [e.fn];
                    for (var n = 0, i = e.length, o = new Array(i); n < i; n++) o[n] = e[n].fn;
                    return o
                }, e.prototype.listenerCount = function(t) {
                    t = h ? h + t : t, t = this._events[t];
                    return t ? t.fn ? 1 : t.length : 0
                }, e.prototype.emit = function(t, e, n, i, o, r) {
                    var a = h ? h + t : t;
                    if (!this._events[a]) return !1;
                    var s, d = this._events[a],
                        l = arguments.length;
                    if (d.fn) {
                        switch (d.once && this.removeListener(t, d.fn, void 0, !0), l) {
                            case 1:
                                return d.fn.call(d.context), !0;
                            case 2:
                                return d.fn.call(d.context, e), !0;
                            case 3:
                                return d.fn.call(d.context, e, n), !0;
                            case 4:
                                return d.fn.call(d.context, e, n, i), !0;
                            case 5:
                                return d.fn.call(d.context, e, n, i, o), !0;
                            case 6:
                                return d.fn.call(d.context, e, n, i, o, r), !0
                        }
                        for (p = 1, s = new Array(l - 1); p < l; p++) s[p - 1] = arguments[p];
                        d.fn.apply(d.context, s)
                    } else
                        for (var c, u = d.length, p = 0; p < u; p++) switch (d[p].once && this.removeListener(t, d[p].fn, void 0, !0), l) {
                            case 1:
                                d[p].fn.call(d[p].context);
                                break;
                            case 2:
                                d[p].fn.call(d[p].context, e);
                                break;
                            case 3:
                                d[p].fn.call(d[p].context, e, n);
                                break;
                            case 4:
                                d[p].fn.call(d[p].context, e, n, i);
                                break;
                            default:
                                if (!s)
                                    for (c = 1, s = new Array(l - 1); c < l; c++) s[c - 1] = arguments[c];
                                d[p].fn.apply(d[p].context, s)
                        }
                    return !0
                }, e.prototype.on = function(t, e, n) {
                    return o(this, t, e, n, !1)
                }, e.prototype.once = function(t, e, n) {
                    return o(this, t, e, n, !0)
                }, e.prototype.removeListener = function(t, e, n, i) {
                    t = h ? h + t : t;
                    if (this._events[t])
                        if (e) {
                            var o = this._events[t];
                            if (o.fn) o.fn !== e || i && !o.once || n && o.context !== n || d(this, t);
                            else {
                                for (var r = 0, a = [], s = o.length; r < s; r++)(o[r].fn !== e || i && !o[r].once || n && o[r].context !== n) && a.push(o[r]);
                                a.length ? this._events[t] = 1 === a.length ? a[0] : a : d(this, t)
                            }
                        } else d(this, t);
                    return this
                }, e.prototype.removeAllListeners = function(t) {
                    return t ? (t = h ? h + t : t, this._events[t] && d(this, t)) : (this._events = new n, this._eventsCount = 0), this
                }, e.prototype.off = e.prototype.removeListener, e.prototype.addListener = e.prototype.on, e.prefixed = h, t.exports = e.EventEmitter = e
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
                n = [n, e, n(12)], e = function(t, e, r) {
                    "use strict";

                    function n(t) {
                        this.adsEnabled = !1;
                        var e = t.adSpotInterstitial,
                            n = t.adSpotRewardedVideo,
                            t = t.gamePackage;
                        try {
                            window.adSpotInterstitial = e, window.adSpotRewardedVideo = n, window.isAdReady = !1, window.isRVReady = !1, window.isINSReady = !1, window.gamePackage = t
                        } catch (t) {
                            console.log("Could not initialize Jio Games SDK", t)
                        }
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.JioAdProvider = void 0, n.prototype.setManager = function(t) {
                        this.adManager = t
                    }, n.prototype.showAd = function(t, e) {
                        var o = this;
                        if (void 0 === t && (t = r.AdType.interstitial), this.adAvailable(t)) {
                            if (window.hasOwnProperty("onAdView") && (window.onAdView, 1) && (window.onAdView = function(t) {
                                    setTimeout(function() {
                                        console.log("JioGames ads: onAdView " + t), o.resumeGameplay()
                                    }, 2e3)
                                }), window.hasOwnProperty("onAdClosed") && (window.onAdClosed, 1) && (window.onAdClosed = function(t, e, n) {
                                    var i = t.split(",");
                                    null != i && 1 < i.length && (t = i[0].trim(), e = Boolean(i[1].trim()), n = Boolean(i[2].trim())), t === window.adSpotInterstitial && (window.isAdReady = !1), t === window.adSpotRewardedVideo && (window.isRVReady = !1, n) && e && o.adManager.emit(r.AdEvents.AD_REWARDED), setTimeout(function() {
                                        console.log("JioGames ads: onAdClose"), o.resumeGameplay()
                                    }, 3e3)
                                }), t === r.AdType.interstitial && window.hasOwnProperty("showAdMidRoll") && (window.showAdMidRoll, 1)) try {
                                window.adSpotInterstitial = e, window.showAdMidRoll(e, window.gamePackage)
                            } catch (t) {
                                this.resumeGameplay(), console.log("Error caching midroll ads")
                            }
                            if (t === r.AdType.rewarded && window.hasOwnProperty("showAdRewardedVideo") && (window.showAdRewardedVideo, 1)) try {
                                window.adSpotRewardedVideo = e, window.showAdRewardedVideo(e, window.gamePackage)
                            } catch (t) {
                                this.resumeGameplay(), console.log("Error caching rewarded ads")
                            }
                        } else console.log("Cannot show Jio ads; Ads were not preloaded or failed to load. Resuming game"), this.resumeGameplay()
                    }, n.prototype.resumeGameplay = function() {
                        this.adManager.emit(r.AdEvents.CONTENT_RESUMED)
                    }, n.prototype.preloadAd = function(t, e) {
                        if (void 0 === t && (t = r.AdType.interstitial), console.log("Calling cache Jio Ad"), t === r.AdType.interstitial && window.hasOwnProperty("cacheAdMidRoll") && (window.cacheAdMidRoll, 1)) try {
                            window.adSpotInterstitial = e, window.cacheAdMidRoll(e, window.gamePackage)
                        } catch (t) {
                            console.log("Error caching midroll ads")
                        }
                        if (t === r.AdType.rewarded && window.hasOwnProperty("cacheAdRewardedVideo") && (window.cacheAdRewardedVideo, 1)) try {
                            window.adSpotRewardedVideo = e, window.cacheAdRewardedVideo(e, window.gamePackage)
                        } catch (t) {
                            console.log("Error cacheAdRewardedVideo of Jio rewarded ads")
                        }
                        window.hasOwnProperty("onAdPrepared") && (window.onAdPrepared, 1) && (window.onAdPrepared = function(t) {
                            try {
                                t === window.adSpotInterstitial && (window.isAdReady = !0), t === window.adSpotRewardedVideo && (window.isRVReady = !0)
                            } catch (t) {
                                console.log("Error onAdPrepared for Jio rewarded ads")
                            }
                        }), window.hasOwnProperty("onAdFailedToLoad") && (window.onAdFailedToLoad, 1) && (window.onAdFailedToLoad = function(t, e) {
                            var n = t.split(","),
                                i = t;
                            null != n && 1 < n.length && (i = n[0].trim(), e = n[1].trim());
                            try {
                                i === window.adSpotInterstitial && (window.isAdReady = !1), i === window.adSpotRewardedVideo && (window.isRVReady = !1), console.log("JioGames: onAdFailedToLoad => ".concat(t.toString(), " => ").concat(e))
                            } catch (t) {
                                console.log("Error loading Jio ads")
                            }
                        })
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
            670: (t, e, n) => {
                n = [n, e, n(12)], e = function(t, e, i) {
                    "use strict";

                    function n() {
                        this.adsEnabled = !1
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.DummyProvider = void 0, n.prototype.setManager = function(t) {
                        this.adManager = t, this.adsEnabled = !0
                    }, n.prototype.showAd = function(t) {
                        var e = this,
                            n = (void 0 === t && (t = i.AdType.interstitial), console.log("[Dummy]: Ad type requested = ", t === i.AdType.interstitial ? "interstitial" : "rewarded"), this.adManager.emit(i.AdEvents.CONTENT_PAUSED), Math.floor(2 * Math.random()));
                        console.log("[Dummy]:Ad Available =>", 0 === n), 1 === n ? (console.log("[Dummy]:AD ERROR / UNAVAILABLE"), setTimeout(function() {
                            console.log("[Dummy]: Resuming game"), e.resumeGameplay()
                        }, 200)) : (t === i.AdType.rewarded && setTimeout(function() {
                            console.log("[Dummy]: Reward Claimed for rewarded ad"), e.adManager.emit(i.AdEvents.AD_REWARDED)
                        }, 100), setTimeout(function() {
                            console.log("[Dummy]: Finished watching ad"), console.log("[Dummy]: Resuming game"), e.resumeGameplay()
                        }, 200))
                    }, n.prototype.resumeGameplay = function() {
                        this.adManager.emit(i.AdEvents.CONTENT_RESUMED)
                    }, n.prototype.preloadAd = function(t) {
                        void 0 === t && i.AdType.interstitial
                    }, n.prototype.destroyAd = function() {}, n.prototype.hideAd = function() {}, n.prototype.adAvailable = function(t) {
                        return !0
                    }, e.DummyProvider = n
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            474: (t, e, n) => {
                n = [n, e, n(12)], e = function(t, e, o) {
                    "use strict";
                    var n, i;

                    function r(t) {
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
                                        i.adManager.emit(o.AdEvents.CONTENT_PAUSED);
                                        break;
                                    case "SDK_ERROR":
                                        i.adManager.emit(o.AdEvents.CONTENT_RESUMED);
                                        break;
                                    case "SDK_READY":
                                        i.sdkLoaded();
                                        break;
                                    case "SDK_REWARDED_WATCH_COMPLETE":
                                        i.adManager.emit(o.AdEvents.AD_REWARDED), i.hasRewarded = !1
                                }
                            }
                        }, t = "gamedistribution-jssdk", n = (e = document).getElementsByTagName("script")[0], e.getElementById(t) || ((e = e.createElement("script")).id = t, e.src = "main.min.js", n.parentNode && n.parentNode.insertBefore(e, n))
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.GameDistribution = e.GameDistributionAdType = void 0, (i = n = e.GameDistributionAdType || (e.GameDistributionAdType = {})).interstitial = "interstitial", i.rewarded = "rewarded", i.display = "display", r.prototype.setManager = function(t) {
                        this.adManager = t, this.adManager.emit(o.AdEvents.AD_PROVIDER_LOADED)
                    }, r.prototype.sdkLoaded = function() {
                        this.adsEnabled = !0
                    }, r.prototype.showAd = function(t) {
                        var e = this;
                        this.adsEnabled ? void 0 === window.gdsdk || window.gdsdk && void 0 === window.gdsdk.showAd ? (this.adsEnabled = !1, this.adManager.emit(o.AdEvents.CONTENT_RESUMED)) : window.gdsdk.showAd(t === o.AdType.rewarded ? n.rewarded : n.interstitial).then(function() {
                            e.adManager.emit(o.AdEvents.CONTENT_RESUMED)
                        }).catch(function() {
                            t === o.AdType.rewarded && e.hasRewarded && (e.hasRewarded = !1), e.adManager.emit(o.AdEvents.CONTENT_RESUMED)
                        }) : this.adManager.emit(o.AdEvents.CONTENT_RESUMED)
                    }, r.prototype.preloadAd = function(t) {
                        var e = this;
                        !this.hasRewarded && this.adsEnabled && t === o.AdType.rewarded && (console.log("preloading ad"), window.gdsdk.preloadAd(n.rewarded).then(function() {
                            e.hasRewarded = !0, e.adManager.emit(o.AdEvents.AD_LOADED, t)
                        }))
                    }, r.prototype.adAvailable = function(t) {
                        return t !== o.AdType.rewarded || this.hasRewarded
                    }, r.prototype.destroyAd = function() {}, r.prototype.hideAd = function() {}, e.GameDistribution = r
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            444: (t, e, n) => {
                n = [n, e, n(474), n(869)], e = function(t, e, n, i) {
                    "use strict";

                    function o() {
                        this.scaleFactor = 1, this.offsetX = 0, this.offsetY = 0, this.element = document.createElement("div"), this.element.style.position = "absolute", this.element.style.top = "0px", this.element.style.left = "0px", this.element.id = "banner-".concat(Date.now()).concat(1e7 * Math.random() | 0), document.body.appendChild(this.element)
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }), e.GameDistributionBanner = void 0, o.prototype.loadBanner = function() {
                        return void 0 === window.gdsdk ? Promise.reject("GD Sdk not available, probably due to adblocker") : window.gdsdk.showAd(n.GameDistributionAdType.display, {
                            containerId: this.element.id
                        })
                    }, o.prototype.destroy = function() {
                        document.body.removeChild(this.element), this.resizeListener && window.removeEventListener("resize", this.resizeListener), delete this.element, delete this.parent, delete this.alignment
                    }, o.prototype.alignIn = function(t, e) {
                        var n = this;
                        this.parent ? console.warn("Banner already aligned, ignoring...") : (this.parent = t, this.alignment = e, this.resizeListener = function() {
                            return n.resize()
                        }, window.addEventListener("resize", this.resizeListener), this.resize())
                    }, o.prototype.setOffset = function(t, e) {
                        void 0 === e && (e = 0), this.offsetX = t = void 0 === t ? 0 : t, this.offsetY = e, this.resize()
                    }, o.prototype.resize = function() {
                        if (this.parent) {
                            var t = this.parent.getBoundingClientRect();
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
                    }, o.prototype.setSize = function(t) {
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
                    }, o.prototype.position = function(t, e) {
                        this.element.style.left = "".concat(t + this.offsetX, "px"), this.element.style.top = "".concat(e + this.offsetY, "px")
                    }, o.prototype.scale = function(t) {
                        this.element.style.transformOrigin = "left top", this.scaleFactor = t, this.element.style.transform = "scale(".concat(t, ")")
                    }, e.GameDistributionBanner = o
                }.apply(e, n);
                void 0 !== e && (t.exports = e)
            },
            654: (t, e, n) => {
                n = [n, e, n(12)], e = function(t, e, i) {
                    "use strict";

                    function n(t) {
                        var e, n, i, o = this;
                        this.adsEnabled = !1, e = "yandex-jssdk", i = (n = document).getElementsByTagName("script")[0], n.getElementById(e) || ((n = n.createElement("script")).addEventListener("load", function() {
                            o.initialize()
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
                n = [n, e, n(110), n(670), n(474), n(444), n(654)], e = function(t, e, n, i, o, r, a) {
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
                            return o.GameDistribution
                        }
                    }), Object.defineProperty(e, "GameDistributionBanner", {
                        enumerable: !0,
                        get: function() {
                            return r.GameDistributionBanner
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
                var i, d = this && this.__extends || (i = function(t, e) {
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
                    l = this && this.__importDefault || function(t) {
                        return t && t.__esModule ? t : {
                            default: t
                        }
                    },
                    n = [n, e, n(34), n(12), n(563), n(766)],
                    e = function(t, e, n, o, r, a) {
                        "use strict";
                        var s;

                        function i(t, e, n) {
                            var i = s.call(this) || this;
                            switch (i.bannerActive = !1, i.provider = null, t) {
                                case o.ProviderTypes.AdFree:
                                    i.provider = new r.AdFreeUntrackedProvider;
                                    break;
                                case o.ProviderTypes.Dummy:
                                    i.provider = new r.DummyProvider;
                                    break;
                                case o.ProviderTypes.Yandex:
                                    i.provider = new r.YandexAdProvider;
                                    break;
                                case o.ProviderTypes.Jio:
                                    i.provider = new a.JioAdProvider(n);
                                    break;
                                default:
                                case o.ProviderTypes.GD:
                                    i.provider = new r.GameDistribution(e)
                            }
                            return i.provider.setManager(i), i
                        }
                        Object.defineProperty(e, "__esModule", {
                            value: !0
                        }), e.AdWrapper = void 0, n = l(n), s = n.default, d(i, s), i.prototype.showAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not request an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.showAd.apply(this.provider, e)
                        }, i.prototype.createBanner = function() {
                            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                            return this.provider.loadBanner.apply(this.provider, t)
                        }, i.prototype.loadBanner = function() {
                            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                            return "function" == typeof this.provider.loadBanner ? this.provider.loadBanner.apply(this.provider, t) : null
                        }, i.prototype.preloadAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not preload an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.preloadAd.apply(this.provider, e)
                        }, i.prototype.destroyAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not destroy an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.destroyAd.apply(this.provider, e)
                        }, i.prototype.hideAd = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                            e.unshift(t), this.provider.hideAd.apply(this.provider, e)
                        }, i.prototype.adsEnabled = function() {
                            if (null === this.provider) throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                            return this.provider.adsEnabled
                        }, i.prototype.adAvailable = function(t) {
                            for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
                            if (null === this.provider) throw new Error("Can not hide an ad without an provider, please attach an ad provider!");
                            return e.unshift(t), this.provider.adAvailable.apply(this.provider, e)
                        }, e.AdWrapper = i
                    }.apply(e, n);
                void 0 !== e && (t.exports = e)
            }
        },
        o = {},
        t = function t(e) {
            var n = o[e];
            return (void 0 !== n ? n : (n = o[e] = {
                exports: {}
            }, i[e].call(n.exports, n, n.exports, t), n)).exports
        }(729);
    self.h5ads = t
})(),
function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).h5branding = t.h5branding || {})
}(this, function(r) {
    "use strict";
    var z = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function d() {
        throw new Error("Dynamic requires are not currently supported by rollup-plugin-commonjs")
    }

    function t(t, e) {
        return t(e = {
            exports: {}
        }, e.exports), e.exports
    }
    t(function(t, I) {
        function d(t) {
            return "function" == typeof t
        }

        function e() {
            var t = setTimeout;
            return function() {
                return t(n, 1)
            }
        }

        function n() {
            for (var t = 0; t < r; t += 2)(0, D[t])(D[t + 1]), D[t] = void 0, D[t + 1] = void 0;
            r = 0
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

        function l(t, e) {
            var n, i = this,
                o = new this.constructor(u),
                r = (void 0 === o[k] && w(o), i._state);
            return r ? (n = arguments[r - 1], _(function() {
                return m(r, o, n, i._result)
            })) : a(i, o, t, e), o
        }

        function c(t) {
            var e;
            return t && "object" == typeof t && t.constructor === this ? t : (h(e = new this(u), t), e)
        }

        function u() {}

        function N(t, i, o) {
            _(function(e) {
                var n = !1,
                    t = function(t, e, n, i) {
                        try {
                            t.call(e, n, i)
                        } catch (t) {
                            return t
                        }
                    }(o, i, function(t) {
                        n || (n = !0, (i !== t ? h : f)(e, t))
                    }, function(t) {
                        n || (n = !0, g(e, t))
                    }, e._label);
                !n && t && (n = !0, g(e, t))
            }, t)
        }

        function p(t, e, n) {
            var i, o;
            e.constructor === t.constructor && n === l && e.constructor.resolve === c ? (i = t, (o = e)._state === B ? f(i, o._result) : o._state === R ? g(i, o._result) : a(o, void 0, function(t) {
                return h(i, t)
            }, function(t) {
                return g(i, t)
            })) : void 0 !== n && d(n) ? N(t, e, n) : f(t, e)
        }

        function h(e, t) {
            if (e === t) g(e, new TypeError("You cannot resolve a promise with itself"));
            else if (n = typeof t, null === t || "object" != n && "function" != n) f(e, t);
            else {
                n = void 0;
                try {
                    n = t.then
                } catch (t) {
                    return void g(e, t)
                }
                p(e, t, n)
            }
            var n
        }

        function j(t) {
            t._onerror && t._onerror(t._result), s(t)
        }

        function f(t, e) {
            t._state === C && (t._result = e, t._state = B, 0 !== t._subscribers.length) && _(s, t)
        }

        function g(t, e) {
            t._state === C && (t._state = R, t._result = e, _(j, t))
        }

        function a(t, e, n, i) {
            var o = t._subscribers,
                r = o.length;
            t._onerror = null, o[r] = e, o[r + B] = n, o[r + R] = i, 0 === r && t._state && _(s, t)
        }

        function s(t) {
            var e = t._subscribers,
                n = t._state;
            if (0 !== e.length) {
                for (var i, o = void 0, r = t._result, a = 0; a < e.length; a += 3) i = e[a], o = e[a + n], i ? m(n, i, o, r) : o(r);
                t._subscribers.length = 0
            }
        }

        function m(t, e, n, i) {
            var o = d(n),
                r = void 0,
                a = void 0,
                s = !0;
            if (o) {
                try {
                    r = n(i)
                } catch (t) {
                    s = !1, a = t
                }
                if (e === r) return void g(e, new TypeError("A promises callback cannot return that same promise."))
            } else r = i;
            e._state === C && (o && s ? h(e, r) : !1 === s ? g(e, a) : t === B ? f(e, r) : t === R && g(e, r))
        }

        function w(t) {
            t[k] = L++, t._state = void 0, t._result = void 0, t._subscribers = []
        }

        function i(t, e) {
            this._instanceConstructor = t, this.promise = new t(u), this.promise[k] || w(this.promise), y(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 !== this.length && (this.length = this.length || 0, this._enumerate(e), 0 !== this._remaining) || f(this.promise, this._result)) : g(this.promise, new Error("Array Methods must be provided an Array"))
        }

        function o(t) {
            if (this[k] = L++, this._result = this._state = void 0, this._subscribers = [], u !== t) {
                if ("function" != typeof t) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (!(this instanceof o)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                var e = this;
                try {
                    t(function(t) {
                        h(e, t)
                    }, function(t) {
                        g(e, t)
                    })
                } catch (t) {
                    g(e, t)
                }
            }
        }
        var y, r, v, b, _, A, x, S, D, O, T, P, E, k, C, B, R, L, F, M;
        t.exports = (y = Array.isArray || function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }, b = v = void(r = 0), _ = function(t, e) {
            D[r] = t, D[r + 1] = e, 2 === (r += 2) && (b ? b(n) : E())
        }, t = "undefined" != typeof window ? window : void 0, A = (A = t || {}).MutationObserver || A.WebKitMutationObserver, x = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process), S = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, D = new Array(1e3), E = void 0, E = x ? function() {
            return process.nextTick(n)
        } : A ? (T = 0, x = new A(n), P = document.createTextNode(""), x.observe(P, {
            characterData: !0
        }), function() {
            P.data = T = ++T % 2
        }) : S ? ((O = new MessageChannel).port1.onmessage = n, function() {
            return O.port2.postMessage(0)
        }) : (void 0 === t ? G : e)(), k = Math.random().toString(36).substring(2), C = void 0, B = 1, R = 2, L = 0, i.prototype._enumerate = function(t) {
            for (var e = 0; this._state === C && e < t.length; e++) this._eachEntry(t[e], e)
        }, i.prototype._eachEntry = function(e, t) {
            var n = this._instanceConstructor,
                i = n.resolve;
            if (i === c) {
                var o, r = void 0,
                    a = void 0,
                    s = !1;
                try {
                    r = e.then
                } catch (t) {
                    s = !0, a = t
                }
                r === l && e._state !== C ? this._settledAt(e._state, t, e._result) : "function" != typeof r ? (this._remaining--, this._result[t] = e) : n === M ? (o = new n(u), s ? g(o, a) : p(o, e, r), this._willSettleAt(o, t)) : this._willSettleAt(new n(function(t) {
                    return t(e)
                }), t)
            } else this._willSettleAt(i(e), t)
        }, i.prototype._settledAt = function(t, e, n) {
            var i = this.promise;
            i._state === C && (this._remaining--, t === R ? g(i, n) : this._result[e] = n), 0 === this._remaining && f(i, this._result)
        }, i.prototype._willSettleAt = function(t, e) {
            var n = this;
            a(t, void 0, function(t) {
                return n._settledAt(B, e, t)
            }, function(t) {
                return n._settledAt(R, e, t)
            })
        }, F = i, o.prototype.catch = function(t) {
            return this.then(null, t)
        }, o.prototype.finally = function(e) {
            var n = this.constructor;
            return d(e) ? this.then(function(t) {
                return n.resolve(e()).then(function() {
                    return t
                })
            }, function(t) {
                return n.resolve(e()).then(function() {
                    throw t
                })
            }) : this.then(e, e)
        }, (M = o).prototype.then = l, M.all = function(t) {
            return new F(this, t).promise
        }, M.race = function(o) {
            var r = this;
            return y(o) ? new r(function(t, e) {
                for (var n = o.length, i = 0; i < n; i++) r.resolve(o[i]).then(t, e)
            }) : new r(function(t, e) {
                return e(new TypeError("You must pass an array to race."))
            })
        }, M.resolve = c, M.reject = function(t) {
            var e = new this(u);
            return g(e, t), e
        }, M._setScheduler = function(t) {
            b = t
        }, M._setAsap = function(t) {
            _ = t
        }, M._asap = _, M.polyfill = function() {
            var t = void 0;
            if (void 0 !== z) t = z;
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
            t.Promise = M
        }, M.Promise = M)
    }).polyfill(), e.has = function(t) {
        var e, n, i = t.lastIndexOf(".");
        return !(i <= 0 || i >= t.length - 1 || (e = t.lastIndexOf(".", i - 1)) <= 0 || i - 1 <= e || !(n = o[t.slice(i + 1)])) && 0 <= n.indexOf(" " + t.slice(e + 1, i) + " ")
    }, e.is = function(t) {
        var e, n = t.lastIndexOf(".");
        return !(n <= 0 || n >= t.length - 1 || 0 <= t.lastIndexOf(".", n - 1) || !(e = o[t.slice(n + 1)])) && 0 <= e.indexOf(" " + t.slice(0, n) + " ")
    }, e.get = function(t) {
        var e, n, i = t.lastIndexOf(".");
        return i <= 0 || i >= t.length - 1 || (e = t.lastIndexOf(".", i - 1)) <= 0 || i - 1 <= e || !(n = o[t.slice(i + 1)]) || n.indexOf(" " + t.slice(e + 1, i) + " ") < 0 ? null : t.slice(e + 1)
    };
    var o, n = e;

    function e() {}
    a.setList = function(t) {
        o = t || {}
    }, a.getDomain = function(t) {
        var e;
        return o ? (e = t.match(/\./g)) && e.length < 2 ? t : (e = this.getTld(t)) ? (e = t.length - e.length - 1, e = t.lastIndexOf(".", e - 1) + 1, t.substring(e) || "") : null : null
    }, a.getTld = function(t) {
        var e;
        return o ? (e = t.lastIndexOf("."), e = t.substring(e + 1), o[e.toLowerCase()] && n.get(t) || e) : ""
    }, a.KEY = "Domains";
    var i = a;

    function a() {}
    Object.defineProperty(l, "instance", {
        get: function() {
            return l.classInstance = void 0 === l.classInstance ? new l : l.classInstance
        },
        enumerable: !1,
        configurable: !0
    }), l.prototype.load = function(e, t, n) {
        var i = this;
        return this.contains(e) ? Promise.reject("Already in cache.") : (this.cache[e] = {
            url: t,
            data: null
        }, this.requestXhr(t, n).then(function(t) {
            return i.loadComplete(e, t)
        }).catch(function(t) {
            return i.remove(e), Promise.reject(t)
        }))
    }, l.prototype.loadComplete = function(t, e) {
        if (!this.contains(t)) return Promise.reject("Item was removed from cache before loading was complete.");
        try {
            var n = JSON.parse(e);
            return this.cache[t].data = n, Promise.resolve(n)
        } catch (t) {
            return Promise.reject("There was an error parsing JSON file.")
        }
    }, l.prototype.remove = function(t) {
        this.contains(t) && delete this.cache[t]
    }, l.prototype.get = function(t) {
        return this.contains(t) ? this.cache[t].data : null
    }, l.prototype.contains = function(t) {
        return this.cache.hasOwnProperty(t)
    }, l.prototype.isLoading = function(t) {
        return this.contains(t) && null === this.cache[t].data
    }, l.prototype.isLoaded = function(t) {
        return this.contains(t) && null !== this.cache[t].data
    }, l.prototype.loadScript = function(i, t, o) {
        return new Promise(function(t, e) {
            var n = document.createElement("script");
            n.src = i, n.async = !1, n.onload = function() {
                "function" == typeof o && o(), t()
            }, document.head.appendChild(n)
        })
    }, l.prototype.requestXhr = function(n, i) {
        var o;
        return void 0 === i && (i = "application/json"), window.XMLHttpRequest ? (o = new XMLHttpRequest, new Promise(function(t, e) {
            o.onreadystatechange = function() {
                4 === o.readyState && (200 === o.status ? (t(o.responseText), o.onreadystatechange = null) : 0 < o.status && (e("There was a problem with the request: status ".concat(o.status)), o.onreadystatechange = null))
            };
            try {
                o.open("GET", n, !0), o.setRequestHeader("Content-Type", i), o.send()
            } catch (t) {
                e("Error: Unable to send request, CORS not allowed.")
            }
        })) : Promise.reject("Unable to send request, XMLHttpRequest not supported.")
    };
    var s = l;

    function l() {
        this.cache = {}
    }

    function c(r, a, s, d) {
        return new(s = s || Promise)(function(t, e) {
            function n(t) {
                try {
                    o(d.next(t))
                } catch (t) {
                    e(t)
                }
            }

            function i(t) {
                try {
                    o(d.throw(t))
                } catch (t) {
                    e(t)
                }
            }

            function o(e) {
                e.done ? t(e.value) : new s(function(t) {
                    t(e.value)
                }).then(n, i)
            }
            o((d = d.apply(r, a || [])).next())
        })
    }

    function u(i, o) {
        var r, a, s, d = {
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
                if (r) throw new TypeError("Generator is already executing.");
                for (; d;) try {
                    if (r = 1, a && (s = 2 & e[0] ? a.return : e[0] ? a.throw || ((s = a.return) && s.call(a), 0) : a.next) && !(s = s.call(a, e[1])).done) return s;
                    switch (a = 0, (e = s ? [2 & e[0], s.value] : e)[0]) {
                        case 0:
                        case 1:
                            s = e;
                            break;
                        case 4:
                            return d.label++, {
                                value: e[1],
                                done: !1
                            };
                        case 5:
                            d.label++, a = e[1], e = [0];
                            continue;
                        case 7:
                            e = d.ops.pop(), d.trys.pop();
                            continue;
                        default:
                            if (!(s = 0 < (s = d.trys).length && s[s.length - 1]) && (6 === e[0] || 2 === e[0])) {
                                d = 0;
                                continue
                            }
                            if (3 === e[0] && (!s || e[1] > s[0] && e[1] < s[3])) d.label = e[1];
                            else if (6 === e[0] && d.label < s[1]) d.label = s[1], s = e;
                            else {
                                if (!(s && d.label < s[2])) {
                                    s[2] && d.ops.pop(), d.trys.pop();
                                    continue
                                }
                                d.label = s[2], d.ops.push(e)
                            }
                    }
                    e = o.call(i, d)
                } catch (t) {
                    e = [6, t], a = 0
                } finally {
                    r = s = 0
                }
                if (5 & e[0]) throw e[1];
                return {
                    value: e[0] ? e[1] : void 0,
                    done: !0
                }
            }
        }
    }
    r.BrandingDomain = void 0, (O = r.BrandingDomain || (r.BrandingDomain = {}))[O.Neutral = 0] = "Neutral", O[O.Yepi = 1] = "Yepi", O[O.Spele = 2] = "Spele", O[O.Funnygames = 3] = "Funnygames", O[O.Kizi = 4] = "Kizi", O[O.PlayCell = 5] = "PlayCell", O[O.GameCell = 6] = "GameCell", O[O.Bild = 7] = "Bild", O[O.AGame = 8] = "AGame", O[O.Admeen = 9] = "Admeen", O[O.PlayTime = 10] = "PlayTime", O[O.Zigiz = 11] = "Zigiz", h.isBip = function() {
        return -1 !== window.location.search.indexOf("bipgaming") || "bip.fbrq.io" === window.location.host
    }, h.isPlaycellApp = function() {
        return -1 !== window.location.search.indexOf("playcellApp")
    }, h.isAGame = function() {
        return -1 !== window.location.search.indexOf("agame")
    }, h.isAirfi = function() {
        return !!window.hasOwnProperty("airfi") && window.airfi
    }, h.isPlaytime = function() {
        return -1 !== window.location.host.indexOf("playtime.nl")
    }, h.isBild = function() {
        return "bild.fbrq.io" === window.location.host || -1 !== window.location.host.indexOf("contentfleet.com")
    }, h.isYandex = function() {
        return window.hasOwnProperty("_YaSDK") || window.hasOwnProperty("YaGames")
    }, h.getYandexBaseURL = function() {
        var t;
        return null != (t = null == (t = window.YandexGamesSDKEnvironment) ? void 0 : t.browser) && t.lang && "en" === window.YandexGamesSDKEnvironment.browser.lang ? "yandex.com" : "yandex.ru"
    };
    var p = h;

    function h() {}
    r.UtmTargets = void 0, (O = r.UtmTargets || (r.UtmTargets = {}))[O.splashscreen = 0] = "splashscreen", O[O.logo = 1] = "logo", O[O.facebook = 2] = "facebook", O[O.twitter = 3] = "twitter", O[O.playstore = 4] = "playstore", O[O.appstore = 5] = "appstore", O[O.more_games = 6] = "more_games", O[O.download_game = 7] = "download_game", O[O.walkthrough = 8] = "walkthrough", O[O.disclaimer = 9] = "disclaimer", O[O.highscores = 10] = "highscores", g.getProtocol = function(t) {
        return t ? "https://" : "//"
    }, g.getUtmContent = function(t) {
        return "string" == typeof t ? t : r.UtmTargets[t]
    }, g.getDomainURL = function(t, e) {
        var n;
        switch (t) {
            case r.BrandingDomain.Spele:
                n = e + "www.spele.nl";
                break;
            case r.BrandingDomain.Yepi:
                n = e + "www.yepi.com";
                break;
            case r.BrandingDomain.Admeen:
                n = "https://media.admeen.com/branding/link.php";
                break;
            case r.BrandingDomain.PlayCell:
                n = e + "www.playcell.com";
                break;
            case r.BrandingDomain.GameCell:
                n = e + "www.gamecell.com";
                break;
            case r.BrandingDomain.Kizi:
                n = e + "www.kizi.com";
                break;
            case r.BrandingDomain.Bild:
                n = e + "www.bildspielt.de";
                break;
            case r.BrandingDomain.Funnygames:
                n = e + "www.funnygames.nu";
                break;
            case r.BrandingDomain.PlayTime:
                n = e + "playtime.nl";
                break;
            default:
            case r.BrandingDomain.AGame:
                n = e + "www.agame.com";
                break;
            case r.BrandingDomain.Zigiz:
                n = e + "m.zigiz.com"
        }
        return n
    }, g.getPromoURL = function(t, e, n, i, o) {
        return window.hasOwnProperty("_YaSDK") || window.hasOwnProperty("YaGames") ? "https://".concat(p.getYandexBaseURL(), "/games/developer?name=Azerion") : t === r.BrandingDomain.Admeen ? "https://media.admeen.com/branding/link.php" : t === r.BrandingDomain.Bild ? e : e + "/?utm_source=" + n + "&utm_medium=html5&utm_term=" + i + "&utm_content=" + o + "&utm_campaign=Gamedistribution"
    };
    var f = g;

    function g() {}

    function m(t, e, n) {
        var i = document.createElement("script");
        i.setAttribute("src", t + "?v=" + e), "function" == typeof n && (i.onload = n), document.body.appendChild(i)
    }
    y.loadPortalScript = function(t) {
        t && t.hasOwnProperty("minijuegos") && -1 !== t.minijuegos.indexOf(x.getSourceSite()) && (void 0 !== window.mpConfig ? window.mpConfig.partner = "orange-games" : window.mpConfig = {
            partner: "orange-games"
        }, m("https://ext.minijuegosgratis.com/external-host/main.js", Date.now() / 1e3)), t && t.hasOwnProperty("kongregate") && -1 !== t.kongregate.indexOf(x.getSourceSite()) && m("https://cdn1.kongregate.com/javascripts/kongregate_api.js", Date.now() / 1e3, function() {
            "undefined" != typeof kongregateAPI && kongregateAPI.loadAPI(function() {
                window.kongregate = kongregateAPI.getAPI()
            })
        }), t && t.hasOwnProperty("newgrounds") && -1 !== t.newgrounds.indexOf(x.getSourceSite()) && m("https://cdn.fbrq.io/@azerion/splash/assets/scripts/newgroundsio.min.js", Date.now() / 1e3)
    };
    var w = y;

    function y() {}
    b.isStandAlone = function() {
        var t;
        return null != (t = window._azerionIntegration) && t.sa ? null == (t = window._azerionIntegration) ? void 0 : t.sa : !!window.hasOwnProperty("fbrqSA") && window.fbrqSA
    }, b.hasDomainForCustomBuild = function() {
        var t;
        return (null == (t = window._azerionIntegration) ? void 0 : t.bd) || window.hasOwnProperty("fbrqBD")
    }, b.getDomainForCustomBuild = function() {
        var t;
        return null != (t = window._azerionIntegration) && t.bd && (null == (t = window._azerionIntegration) ? void 0 : t.bd) in r.BrandingDomain ? null == (t = window._azerionIntegration) ? void 0 : t.bd : window.hasOwnProperty("fbrqBD") && window.fbrqBD in r.BrandingDomain ? window.fbrqBD : void 0
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
        var e = Promise.all([s.instance.load(i.KEY, "".concat(x.ASSET_LOCATION, "json/domains.json?v=").concat(t), "text/plain"), s.instance.load(A.SITELOCK_PORTALS, "".concat(x.ASSET_LOCATION, "json/sitelock.json?v=").concat(t), "text/plain")]);
        return Promise.all([s.instance.load(A.INTERNAL_PORTALS_KEY, "".concat(x.ASSET_LOCATION, "json/internal.json?v=").concat(t), "text/plain"), s.instance.load(A.CONTRACTED_PORTALS_KEY, "".concat(x.ASSET_LOCATION, "json/contracted.json?v=").concat(t), "text/plain"), s.instance.load(A.SPECIAL_PORTALS_KEY, "".concat(x.ASSET_LOCATION, "json/special.json?v=").concat(t), "text/plain")]), e.then(function(t) {
            var e = t[0],
                t = t[1];
            i.setList(e), w.loadPortalScript(t), A.setSiteLock(t)
        }).catch(function() {
            console.warn("Unable to parse json")
        })
    }, A.setSiteLock = function(t) {
        A.siteLocks = t
    }, Object.defineProperty(A, "brandingLogoUrl", {
        get: function() {
            var t;
            switch (x.isOnDevice() || p.isAirfi() ? x.ASSET_LOCATION = "assets/" : "fbrq.io" === x.getSourceSite(!0) && (x.ASSET_LOCATION = "https://" + window.location.host + "/@azerion/splash/assets/"), x.getBrandingDomain()) {
                case r.BrandingDomain.Spele:
                    t = "spele";
                    break;
                case r.BrandingDomain.PlayCell:
                    t = "playcell";
                    break;
                case r.BrandingDomain.GameCell:
                    t = "gamecell";
                    break;
                case r.BrandingDomain.Yepi:
                    t = "yepi";
                    break;
                case r.BrandingDomain.Admeen:
                    t = "admeen";
                    break;
                case r.BrandingDomain.Bild:
                    t = "bild";
                    break;
                case r.BrandingDomain.Kizi:
                    t = "kizi";
                    break;
                case r.BrandingDomain.Funnygames:
                    t = "funnygames";
                    break;
                case r.BrandingDomain.PlayTime:
                    t = "playtime";
                    break;
                default:
                case r.BrandingDomain.AGame:
                    t = "agame";
                    break;
                case r.BrandingDomain.Zigiz:
                    t = "zigiz"
            }
            return x.ASSET_LOCATION + "images/branding_logo_" + t + "_small.png"
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(A, "brandingBackgroundColor", {
        get: function() {
            var t;
            switch (x.getBrandingDomain()) {
                case r.BrandingDomain.Spele:
                    t = "#4a72ad";
                    break;
                case r.BrandingDomain.PlayCell:
                    t = "#52a1e1";
                    break;
                case r.BrandingDomain.GameCell:
                    t = "#c600b2";
                    break;
                case r.BrandingDomain.Yepi:
                    t = "#0573a7";
                    break;
                case r.BrandingDomain.AGame:
                    t = "#0C486C";
                    break;
                case r.BrandingDomain.Admeen:
                    t = "#4267B2";
                    break;
                case r.BrandingDomain.Bild:
                    t = "#de0000";
                    break;
                default:
                case r.BrandingDomain.Kizi:
                    t = "#012f50";
                    break;
                case r.BrandingDomain.Funnygames:
                    t = "#33b0ff";
                    break;
                case r.BrandingDomain.PlayTime:
                case r.BrandingDomain.Zigiz:
                    t = "#023a63"
            }
            return t
        },
        enumerable: !1,
        configurable: !0
    }), A.blockedDomain = function() {
        return x.isOnDevice() || A.isSpecial()
    }, A.createCampaignURL = function(t, e) {
        var n = x.getSourceSite(),
            i = x.getBrandingDomain(),
            o = f.getProtocol(x.isOnDevice()),
            o = f.getDomainURL(i, o),
            e = f.getUtmContent(e);
        return f.getPromoURL(i, o, n, t, e)
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
        return !(p.isAirfi() || A.isSpecial() || A.isContracted()) && (!v.hasLinksSettingsForCustomBuild() || v.getLinkSettingsForCustomBuild())
    }, A.hostMatchesList = function(t) {
        t = t || [];
        for (var e = x.getSourceSite(), n = 0; n < t.length; n++)
            if (e === t[n]) return !0;
        return !1
    }, A.LOGO_KEY = "branding_logo", A.INTERNAL_PORTALS_KEY = "branding_portals", A.CONTRACTED_PORTALS_KEY = "branding_contracted", A.SPECIAL_PORTALS_KEY = "branding_special", A.SITELOCK_PORTALS = "sitelock_portals", A.DOMAIN_OVERWRITE = null, A.analyticsEnabled = !0;
    var _ = A;

    function A() {}
    S.loadHost = function() {
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
                        return S.HOST = e, [2]
                }
            })
        })
    }, S.getSourceSite = function(t) {
        var e = S.HOST;
        return -1 !== (e = (t = void 0 !== t && t) ? window.location.host : e).indexOf("embed.gamedistribution.com") && -1 !== window.location.search.indexOf("gd_sdk_referrer_url") && (e = S.getUrlParameter("gd_sdk_referrer_url") || e), e = decodeURIComponent(e), p.isBild() ? "bildspielt.de" : p.isBip() ? "bipgaming.com" : (e = (e = -1 < e.indexOf("://") ? e.split("/")[2] : e.split("/")[0]).split(":")[0], null !== (t = i.getDomain(e)) ? t : 3 === e.split(".").length ? e.substr(e.indexOf(".") + 1) : e)
    }, S.getBrandingDomain = function() {
        if (v.hasDomainForCustomBuild()) return v.getDomainForCustomBuild();
        if (_.DOMAIN_OVERWRITE) return _.DOMAIN_OVERWRITE;
        var t = S.getSourceSite();
        if (_.isAdmeen()) return r.BrandingDomain.Admeen;
        if (p.isPlaycellApp() || p.isBip()) return r.BrandingDomain.PlayCell;
        switch (t) {
            case "spele.nl":
                return r.BrandingDomain.Spele;
            case "yepi.com":
                return r.BrandingDomain.Yepi;
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
                return r.BrandingDomain.PlayCell;
            case "gamecell.com":
                return r.BrandingDomain.GameCell;
            case "playxl.com":
                return r.BrandingDomain.Admeen;
            case "kizi.com":
                return r.BrandingDomain.Kizi;
            case "bildspielt.de":
                return r.BrandingDomain.Bild;
            case "funnygames.nl":
                return r.BrandingDomain.Funnygames;
            case "playtime.nl":
                return r.BrandingDomain.PlayTime;
            default:
            case "agame.com":
                return r.BrandingDomain.AGame;
            case "gmbl.nl":
            case "zigiz.com":
                return r.BrandingDomain.Zigiz;
            case "coolmathgames.com":
                return r.BrandingDomain.Neutral
        }
    }, S.getReferrer = function(t) {
        return -1 !== t.indexOf("?ref=") ? t.substr(t.indexOf("?ref=") + 5) : t
    }, S.inIframe = function() {
        try {
            return window.self !== window.top
        } catch (t) {
            return !0
        }
    }, S.inGDGameZone = function() {
        return -1 !== document.referrer.indexOf("html5.gamedistribution.com")
    }, S.getDomain = function(t) {
        var e = document.createElement("a");
        return e.href = t, e.origin
    }, S.isOnDevice = function() {
        return void 0 !== window.cordova && !/(gamedistribution\.com)/.test(window.location.hostname)
    }, S.isTc = function() {
        return /(teamcity\.azerdev\.com)/.test(window.location.host)
    }, S.getRandomRange = function(t, e) {
        return Math.random() * (e - t) + t | 0
    }, S.getUrlParameter = function(t) {
        t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        t = new RegExp("[\\?&]" + t + "=([^&#]*)").exec(location.search);
        return null === t ? "" : decodeURIComponent(t[1].replace(/\+/g, " "))
    }, S.intTimeToString = function(t) {
        var e = Math.floor(t / 3600),
            n = Math.floor(t % 3600 / 60),
            t = t % 60;
        return (e < 10 ? "0" + e : e.toString()) + ":" + (n < 10 ? "0" + n : n.toString()) + ":" + (t < 10 ? "0" + t : t.toString())
    }, S.LANGUAGE = "en", S.HOST = document.referrer || window.location.host, S.ASSET_LOCATION = "assets/";
    var x = S;

    function S() {}
    var D = t(function(t, e) {
            t.exports = function n(i, o, r) {
                function a(e, t) {
                    if (!o[e]) {
                        if (!i[e]) {
                            if (!t && d) return d();
                            if (s) return s(e, !0);
                            t = new Error("Cannot find module '" + e + "'");
                            throw t.code = "MODULE_NOT_FOUND", t
                        }
                        t = o[e] = {
                            exports: {}
                        };
                        i[e][0].call(t.exports, function(t) {
                            return a(i[e][1][t] || t)
                        }, t, t.exports, n, i, o, r)
                    }
                    return o[e].exports
                }
                for (var s = d, t = 0; t < r.length; t++) a(r[t]);
                return a
            }({
                1: [function(t, N, j) {
                    ! function() {
                        var c, n, u, p, h, t, f, s, l, d, g, r, o, a, i, m, e, w, y = this || Function("return this")(),
                            v = (t = Date.now || function() {
                                return +new Date
                            }, f = "undefined" != typeof SHIFTY_DEBUG_NOW ? SHIFTY_DEBUG_NOW : t, n = "undefined" != typeof window && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || window.mozCancelRequestAnimationFrame && window.mozRequestAnimationFrame) || setTimeout, E.prototype.tween = function(t) {
                                return this._isTweening ? this : (void 0 === t && this._configured || this.setConfig(t), this._timestamp = f(), this._start(this.get(), this._attachment), this.resume())
                            }, E.prototype.setConfig = function(t) {
                                t = t || {}, this._configured = !0, this._attachment = t.attachment, this._pausedAtTime = null, this._scheduleId = null, this._delay = t.delay || 0, this._start = t.start || b, this._step = t.step || b, this._finish = t.finish || b, this._duration = t.duration || 500, this._currentState = A({}, t.from || this.get()), this._originalState = this.get(), this._targetState = A({}, t.to || this.get());
                                var e = this,
                                    n = (this._timeoutHandler = function() {
                                        T(e, e._timestamp, e._delay, e._duration, e._currentState, e._originalState, e._targetState, e._easing, e._step, e._scheduleFunction)
                                    }, this._currentState),
                                    i = this._targetState;
                                return x(i, n), this._easing = P(n, t.easing || "linear"), this._filterArgs = [n, this._originalState, i, this._easing], O(this, "tweenCreated"), this
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
                                return this._timestamp + t === 0 || (this._timestamp = e - t, this.isPlaying()) || (this._isTweening = !0, this._isPaused = !1, T(this, this._timestamp, this._delay, this._duration, this._currentState, this._originalState, this._targetState, this._easing, this._step, this._scheduleFunction, e), this.pause()), this
                            }, E.prototype.stop = function(t) {
                                return this._isTweening = !1, this._isPaused = !1, this._timeoutHandler = b, (y.cancelAnimationFrame || y.webkitCancelAnimationFrame || y.oCancelAnimationFrame || y.msCancelAnimationFrame || y.mozCancelRequestAnimationFrame || y.clearTimeout)(this._scheduleId), t && (O(this, "beforeTween"), S(1, this._currentState, this._originalState, this._targetState, 1, 0, this._easing), O(this, "afterTween"), O(this, "afterTweenEnd"), this._finish.call(this, this._currentState, this._attachment)), this
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
                                tweenProps: S,
                                tweenProp: D,
                                applyFilter: O,
                                shallowCopy: A,
                                defaults: x,
                                composeEasingObject: P
                            }), "function" == typeof SHIFTY_DEBUG_NOW && (y.timeoutHandler = T), "object" == typeof j ? N.exports = E : void 0 === y.Tweenable && (y.Tweenable = E), E);

                        function b() {}

                        function _(t, e) {
                            for (var n in t) Object.hasOwnProperty.call(t, n) && e(n)
                        }

                        function A(e, n) {
                            return _(n, function(t) {
                                e[t] = n[t]
                            }), e
                        }

                        function x(e, n) {
                            _(n, function(t) {
                                void 0 === e[t] && (e[t] = n[t])
                            })
                        }

                        function S(t, e, n, i, o, r, a) {
                            var s, d, l = t < r ? 0 : (t - r) / o;
                            for (s in e) e.hasOwnProperty(s) && (d = "function" == typeof(d = a[s]) ? d : c[d], e[s] = D(n[s], i[s], d, l));
                            return e
                        }

                        function D(t, e, n, i) {
                            return t + (e - t) * n(i)
                        }

                        function O(e, n) {
                            var i = E.prototype.filter,
                                o = e._filterArgs;
                            _(i, function(t) {
                                void 0 !== i[t][n] && i[t][n].apply(e, o)
                            })
                        }

                        function T(t, e, n, i, o, r, a, s, d, l, c) {
                            h = e + n + i, u = Math.min(c || f(), h), p = h <= u, h = i - (h - u), t.isPlaying() && (p ? (d(a, t._attachment, h), t.stop(!0)) : (t._scheduleId = l(t._timeoutHandler, 1e3 / 60), O(t, "beforeTween"), u < e + n ? S(1, o, r, a, 1, 1, s) : S(u, o, r, a, i, e + n, s), O(t, "afterTween"), d(o, t._attachment, h)))
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
                            l.each(n, function(t) {
                                var e = n[t];
                                "string" == typeof e && e.match(i) && (n[t] = B(i, e, I))
                            })
                        }

                        function I(t) {
                            3 === (t = (t = t).replace(/#/, "")).length && (t = (t = t.split(""))[0] + t[0] + t[1] + t[1] + t[2] + t[2]), e[0] = C(t.substr(0, 2)), e[1] = C(t.substr(2, 2)), e[2] = C(t.substr(4, 2));
                            t = e;
                            return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
                        }

                        function C(t) {
                            return parseInt(t, 16)
                        }

                        function B(t, e, n) {
                            var i = e.match(t),
                                o = e.replace(t, m);
                            if (i)
                                for (var r, a = i.length, s = 0; s < a; s++) r = i.shift(), o = o.replace(m, n(r));
                            return o
                        }

                        function G(t) {
                            for (var e = t.match(r), n = e.length, i = t.match(a)[0], o = 0; o < n; o++) i += parseInt(e[o], 10) + ",";
                            return i.slice(0, -1) + ")"
                        }

                        function R(o, r) {
                            l.each(r, function(t) {
                                for (var e = M(o[t]), n = e.length, i = 0; i < n; i++) o[r[t].chunkNames[i]] = +e[i];
                                delete o[t]
                            })
                        }

                        function L(n, i) {
                            l.each(i, function(t) {
                                n[t];
                                var e = function(t, e) {
                                        w.length = 0;
                                        for (var n = e.length, i = 0; i < n; i++) w.push(t[e[i]]);
                                        return w
                                    }(function(t, e) {
                                        for (var n, i = {}, o = e.length, r = 0; r < o; r++) i[n = e[r]] = t[n], delete t[n];
                                        return i
                                    }(n, i[t].chunkNames), i[t].chunkNames),
                                    e = function(t, e) {
                                        for (var n = t, i = e.length, o = 0; o < i; o++) n = n.replace(m, +e[o].toFixed(4));
                                        return n
                                    }(i[t].formatString, e);
                                n[t] = B(o, e, G)
                            })
                        }

                        function M(t) {
                            return t.match(r)
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
                        }), v.setBezierFunction = function(t, e, n, i, o) {
                            function r(t) {
                                return c = (o = 1) - (p = 3 * (e = a)) - (u = 3 * ((n = h) - a) - p), (((1 - (n = 3 * s) - (e = 3 * ((i = f) - s) - n)) * (i = function(t, e) {
                                    for (var n, i, o, r, a = t, s = 0; s < 8; s++) {
                                        if (l(o = d(a) - t) < e) return a;
                                        if (l(r = (3 * c * a + 2 * u) * a + p) < 1e-6) break;
                                        a -= o / r
                                    }
                                    if ((a = t) < (n = 0)) return n;
                                    if ((i = 1) < a) return i;
                                    for (; n < i;) {
                                        if (l((o = d(a)) - t) < e) return a;
                                        o < t ? n = a : i = a, a = .5 * (i - n) + n
                                    }
                                    return a
                                }(t, 1 / (200 * o))) + e) * i + n) * i;

                                function d(t) {
                                    return ((c * t + u) * t + p) * t
                                }

                                function l(t) {
                                    return 0 <= t ? t : 0 - t
                                }
                                var e, n, i, o, c, u, p
                            }
                            var a, s, h, f, a = e,
                                s = n,
                                h = i,
                                f = o;
                            return r.displayName = t, r.x1 = e, r.y1 = n, r.x2 = i, r.y2 = o, v.prototype.formula[t] = r
                        }, v.unsetBezierFunction = function(t) {
                            delete v.prototype.formula[t]
                        }, (s = new v)._filterArgs = [], v.interpolate = function(t, e, n, i, o) {
                            var r = v.shallowCopy({}, t),
                                o = o || 0,
                                i = v.composeEasingObject(t, i || "linear"),
                                a = (s.set({}), s._filterArgs),
                                a = (a.length = 0, a[0] = r, a[1] = t, a[2] = e, a[3] = i, v.applyFilter(s, "tweenCreated"), v.applyFilter(s, "beforeTween"), v.tweenProps(n, r, t, e, 1, o, i));
                            return v.applyFilter(s, "afterTween"), a
                        }, l = v, d = /(\d|\-|\.)/, g = /([^\-0-9\.]+)/g, r = /[0-9.\-]+/g, o = new RegExp("rgb\\(" + r.source + /,\s*/.source + r.source + /,\s*/.source + r.source + "\\)", "g"), a = /^.*\(/, i = /#([0-9]|[a-f]){3,6}/gi, m = "VAL", e = [], w = [], l.prototype.filter.token = {
                            tweenCreated: function(t, e, n, i) {
                                var r, a;
                                k(t), k(e), k(n), this._tokenData = (r = t, a = {}, l.each(r, function(t) {
                                    var o, e, n = r[t];
                                    "string" == typeof n && (o = M(n), a[t] = {
                                        formatString: ((e = (n = n).match(g)) ? 1 !== e.length && !n.charAt(0).match(d) || e.unshift("") : e = ["", ""], e.join(m)),
                                        chunkNames: function(t) {
                                            for (var e = [], n = o.length, i = 0; i < n; i++) e.push("_" + t + "_" + i);
                                            return e
                                        }(t)
                                    })
                                }), a)
                            },
                            beforeTween: function(t, e, n, i) {
                                var s = i,
                                    d = this._tokenData;
                                l.each(d, function(t) {
                                    var e = d[t].chunkNames,
                                        n = e.length,
                                        i = s[t];
                                    if ("string" == typeof i)
                                        for (var o = i.split(" "), r = o[o.length - 1], a = 0; a < n; a++) s[e[a]] = o[a] || r;
                                    else
                                        for (a = 0; a < n; a++) s[e[a]] = i;
                                    delete s[t]
                                }), R(t, this._tokenData), R(e, this._tokenData), R(n, this._tokenData)
                            },
                            afterTween: function(t, e, n, i) {
                                var a, s;
                                L(t, this._tokenData), L(e, this._tokenData), L(n, this._tokenData), a = i, s = this._tokenData, l.each(s, function(t) {
                                    var e = s[t].chunkNames,
                                        n = e.length,
                                        i = a[e[0]];
                                    if ("string" == typeof i) {
                                        for (var o = "", r = 0; r < n; r++) o += " " + a[e[r]], delete a[e[r]];
                                        a[t] = o.substr(1)
                                    } else a[t] = i
                                })
                            }
                        }
                    }.call(null)
                }, {}],
                2: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 50,50 m 0,-{radius} a {radius},{radius} 0 1 1 0,{2radius} a {radius},{radius} 0 1 1 0,-{2radius}", this.containerAspectRatio = 1, o.apply(this, arguments)
                    }
                    var o = t("./shape"),
                        r = t("./utils");
                    ((i.prototype = new o).constructor = i).prototype._pathString = function(t) {
                        var e = t.strokeWidth,
                            t = 50 - (t.trailWidth && t.trailWidth > t.strokeWidth ? t.trailWidth : e) / 2;
                        return r.render(this._pathTemplate, {
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
                        this._pathTemplate = "M 0,{center} L 100,{center}", o.apply(this, arguments)
                    }
                    var o = t("./shape"),
                        r = t("./utils");
                    ((i.prototype = new o).constructor = i).prototype._initializeSvg = function(t, e) {
                        t.setAttribute("viewBox", "0 0 100 " + e.strokeWidth), t.setAttribute("preserveAspectRatio", "none")
                    }, i.prototype._pathString = function(t) {
                        return r.render(this._pathTemplate, {
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
                        e = d.extend({
                            duration: 800,
                            easing: "linear",
                            from: {},
                            to: {},
                            step: function() {}
                        }, e), t = d.isString(t) ? document.querySelector(t) : t, this.path = t, this._opts = e, this._tweenable = null;
                        t = this.path.getTotalLength();
                        this.path.style.strokeDasharray = t + " " + t, this.set(0)
                    }
                    var s = t("shifty"),
                        d = t("./utils"),
                        o = {
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
                        d.isFunction(n) && (e = this._easing(this._opts.easing), n(this._calculateTo(t, e), this._opts.shape || this, this._opts.attachment))
                    }, i.prototype.stop = function() {
                        this._stopTween(), this.path.style.strokeDashoffset = this._getComputedDashOffset()
                    }, i.prototype.animate = function(t, n, e) {
                        n = n || {}, d.isFunction(n) && (e = n, n = {});
                        var i = d.extend({}, n),
                            o = d.extend({}, this._opts),
                            o = (n = d.extend(o, n), this._easing(n.easing)),
                            i = this._resolveFromAndTo(t, o, i),
                            r = (this.stop(), this.path.getBoundingClientRect(), this._getComputedDashOffset()),
                            t = this._progressToOffset(t),
                            a = this;
                        this._tweenable = new s, this._tweenable.tween({
                            from: d.extend({
                                offset: r
                            }, i.from),
                            to: d.extend({
                                offset: t
                            }, i.to),
                            duration: n.duration,
                            easing: o,
                            step: function(t) {
                                a.path.style.strokeDashoffset = t.offset;
                                var e = n.shape || a;
                                n.step(t, e, n.attachment)
                            },
                            finish: function(t) {
                                d.isFunction(e) && e()
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
                        return o.hasOwnProperty(t) ? o[t] : t
                    }, e.exports = i
                }, {
                    "./utils": 9,
                    shifty: 1
                }],
                6: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 50,50 m -{radius},0 a {radius},{radius} 0 1 1 {2radius},0", this.containerAspectRatio = 2, o.apply(this, arguments)
                    }
                    var o = t("./shape"),
                        r = t("./circle"),
                        a = t("./utils");
                    ((i.prototype = new o).constructor = i).prototype._initializeSvg = function(t, e) {
                        t.setAttribute("viewBox", "0 0 100 50")
                    }, i.prototype._initializeTextContainer = function(t, e, n) {
                        t.text.style && (n.style.top = "auto", n.style.bottom = "0", t.text.alignToBottom ? a.setStyle(n, "transform", "translate(-50%, 0)") : a.setStyle(n, "transform", "translate(-50%, 50%)"))
                    }, i.prototype._pathString = r.prototype._pathString, i.prototype._trailString = r.prototype._trailString, e.exports = i
                }, {
                    "./circle": 2,
                    "./shape": 7,
                    "./utils": 9
                }],
                7: [function(t, e, n) {
                    function i(t, e) {
                        if (!(this instanceof i)) throw new Error("Constructor was called without new keyword");
                        if (0 !== arguments.length) {
                            this._opts = r.extend({
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
                            }, e, !0), r.isObject(e) && void 0 !== e.svgStyle && (this._opts.svgStyle = e.svgStyle), r.isObject(e) && r.isObject(e.text) && void 0 !== e.text.style && (this._opts.text.style = e.text.style);
                            var e = this._createSvgView(this._opts),
                                n = r.isString(t) ? document.querySelector(t) : t;
                            if (!n) throw new Error("Container does not exist: " + t);
                            this._container = n, this._container.appendChild(e.svg), this._opts.warnings && this._warnContainerAspectRatio(this._container), this._opts.svgStyle && r.setStyles(e.svg, this._opts.svgStyle), this.svg = e.svg, this.path = e.path, this.trail = e.trail, this.text = null;
                            t = r.extend({
                                attachment: void 0,
                                shape: this
                            }, this._opts);
                            this._progressPath = new o(e.path, t), r.isObject(this._opts.text) && null !== this._opts.text.value && this.setText(this._opts.text.value)
                        }
                    }
                    var o = t("./path"),
                        r = t("./utils"),
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
                        null === this.text && (this.text = this._createTextContainer(this._opts, this._container), this._container.appendChild(this.text)), r.isObject(t) ? (r.removeChildren(this.text), this.text.appendChild(t)) : this.text.innerHTML = t
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
                            t = r.extend({}, t);
                        return t.trailColor || (t.trailColor = "#eee"), t.trailWidth || (t.trailWidth = t.strokeWidth), t.color = t.trailColor, t.strokeWidth = t.trailWidth, t.fill = null, this._createPathElement(e, t)
                    }, i.prototype._createPathElement = function(t, e) {
                        var n = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        return n.setAttribute("d", t), n.setAttribute("stroke", e.color), n.setAttribute("stroke-width", e.strokeWidth), e.fill ? n.setAttribute("fill", e.fill) : n.setAttribute("fill-opacity", "0"), n
                    }, i.prototype._createTextContainer = function(t, e) {
                        var n = document.createElement("div"),
                            i = (n.className = t.text.className, t.text.style);
                        return i && (t.text.autoStyleContainer && (e.style.position = "relative"), r.setStyles(n, i), i.color || (n.style.color = t.color)), this._initializeTextContainer(t, e, n), n
                    }, i.prototype._initializeTextContainer = function(t, e, n) {}, i.prototype._pathString = function(t) {
                        throw new Error("Override this function for each progress bar")
                    }, i.prototype._trailString = function(t) {
                        throw new Error("Override this function for each progress bar")
                    }, i.prototype._warnContainerAspectRatio = function(t) {
                        var e, n, i;
                        this.containerAspectRatio && (e = window.getComputedStyle(t, null), n = parseFloat(e.getPropertyValue("width"), 10), i = parseFloat(e.getPropertyValue("height"), 10), r.floatEquals(this.containerAspectRatio, n / i) || (console.warn("Incorrect aspect ratio of container", "#" + t.id, "detected:", e.getPropertyValue("width") + "(width)", "/", e.getPropertyValue("height") + "(height)", "=", n / i), console.warn("Aspect ratio of should be", this.containerAspectRatio)))
                    }, e.exports = i
                }, {
                    "./path": 5,
                    "./utils": 9
                }],
                8: [function(t, e, n) {
                    function i(t, e) {
                        this._pathTemplate = "M 0,{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{strokeWidth}", this._trailTemplate = "M {startMargin},{halfOfStrokeWidth} L {width},{halfOfStrokeWidth} L {width},{width} L {halfOfStrokeWidth},{width} L {halfOfStrokeWidth},{halfOfStrokeWidth}", o.apply(this, arguments)
                    }
                    var o = t("./shape"),
                        r = t("./utils");
                    ((i.prototype = new o).constructor = i).prototype._pathString = function(t) {
                        var e = 100 - t.strokeWidth / 2;
                        return r.render(this._pathTemplate, {
                            width: e,
                            strokeWidth: t.strokeWidth,
                            halfOfStrokeWidth: t.strokeWidth / 2
                        })
                    }, i.prototype._trailString = function(t) {
                        var e = 100 - t.strokeWidth / 2;
                        return r.render(this._trailTemplate, {
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
                    var r = "Webkit Moz O ms".split(" ");

                    function i(t, e, n) {
                        for (var i = t.style, o = 0; o < r.length; ++o) i[r[o] + a(e)] = n;
                        i[e] = n
                    }

                    function a(t) {
                        return t.charAt(0).toUpperCase() + t.slice(1)
                    }

                    function s(t) {
                        return "[object Array]" !== Object.prototype.toString.call(t) && "object" == typeof t && !!t
                    }

                    function o(t, e) {
                        for (var n in t) t.hasOwnProperty(n) && e(t[n], n)
                    }
                    e.exports = {
                        extend: function t(e, n, i) {
                            for (var o in e = e || {}, i = i || !1, n = n || {}) {
                                var r, a;
                                n.hasOwnProperty(o) && (r = e[o], a = n[o], i && s(r) && s(a) ? e[o] = t(r, a, i) : e[o] = a)
                            }
                            return e
                        },
                        render: function(t, e) {
                            var n, i, o, r = t;
                            for (n in e) e.hasOwnProperty(n) && (i = e[n], o = new RegExp("\\{" + n + "\\}", "g"), r = r.replace(o, i));
                            return r
                        },
                        setStyle: i,
                        setStyles: function(n, t) {
                            o(t, function(t, e) {
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
                        forEachObject: o,
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
        O = (T.getInstance = function(t) {
            if (!T.instance) {
                if (!t) throw new Error("Can not create new SplashLoader instance without options!");
                T.instance = new T(t)
            }
            return T.instance
        }, T.prototype.create = function() {
            return c(this, void 0, void 0, function() {
                var i, o, r, a;
                return u(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return o = "\n        #h5branding-center {\n            position: absolute;\n            top: 45%;\n            left: 50%;\n            transform: translate(-50%, -20%);\n            text-align: center;\n            width: 100%;\n        }\n        #h5branding-wrapper {\n            position: relative;\n            z-index: 665;\n            width: 150px;\n            height: 150px;\n            display:inline-block;\n            margin: 35px 40px 96px 40px;\n        }\n\n        #h5branding-version {\n            position: absolute;\n            right: 10px;\n            font-family: Helvetica, Arial, sans-serif;\n            color: #ffffff;\n            font-size: 0.8em;\n            top: 10px;\n            display: none;\n        }\n\n        #h5branding-wrapper > #h5branding-bar, #h5branding-wrapper > img {\n            box-shadow: inset 10px 10px 20px 5px rgba(0, 0, 0, 0.5);\n            border-radius: 50%;\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n        }\n\n        #h5branding-ad {\n            position: relative;\n            z-index: 667;\n            border-radius: 5px;\n            border: 3px solid white;\n            background: rgba(256, 256, 256, 0.2);\n            width: 336px;\n            height: 280px;\n            display: none;\n            margin: 0px 10px 0px 10px;\n        }\n\n        #h5branding-wrapper > img {\n            /* Needs appropriate vendor prefixes */\n            box-sizing: border-box;\n\n            /* This needs to be equal to strokeWidth */\n            padding: 4%;\n        }\n\n        #h5branding-wrapper > img {\n            border-radius: 50%;\n            box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.5), 5px 5px 7px rgba(0, 0, 0, 0.3);\n        }\n\n        #h5branding-container {\n            box-sizing: border-box;\n            position: absolute;\n            z-index: 664;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            background-color: #000;\n            overflow: hidden;\n        }\n\n        #h5branding-background {\n            position: absolute;\n            top: -25%;\n            left: -25%;\n            width: 150%;\n            height: 150%;\n            background-blend-mode: multiply;\n            background-size: cover;\n            filter: blur(40px) brightness(1.5);\n        }\n\n        @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n             /* IE10+ CSS styles go here */\n             #h5branding-background {\n                background-image: none !important;\n             }\n        }\n\n        #h5branding-logo {\n            position: absolute;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n            text-align: center;\n            top: 10%;\n        }\n\n        #h5branding-logo > img {\n            height: 150px;\n        }\n\n        #h5branding-title {\n            position: absolute;\n            width: 100%;\n            background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.5) 50%, transparent);\n            color: #fff;\n            text-shadow: 0 0 1px rgba(0, 0, 0, 0.7);\n            bottom:10%;\n            padding: 15px 0;\n            text-align: center;\n            font-size: 18px;\n            font-family: Helvetica, Arial, sans-serif;\n            font-weight: bold;\n            line-height: 100%;\n        }\n\n        #h5branding-button {\n            /* border: 0; */\n            padding: 10px 22px;\n            border-radius: 5px;\n            border: 3px solid white;\n            background: linear-gradient(0deg, #dddddd, #ffffff);\n            color: #222;\n            text-transform: uppercase;\n            text-shadow: 0 0 1px #fff;\n            font-family: Helvetica, Arial, sans-serif;\n            font-weight: bold;\n            font-size: 18px;\n            cursor: pointer;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n            display: none;\n            width: 150px;\n            position: absolute;\n            top: 170px;\n            margin: 0 auto;\n            left: 0;\n            right: 0;\n        }\n\n        @media (orientation: portrait) and (max-width: 1080px) {\n            #h5branding-logo > img {\n                height: initial;\n                width:100%;\n            }\n        }\n\n        @media (orientation: landscape) and (max-height: 640px) {\n            #h5branding-title {\n                display: none;\n            }\n\n            #h5branding-logo > img {\n                height: 100px;\n            }\n        }\n\n        @media (orientation: landscape) and (max-height: 460px) {\n            #h5branding-title {\n                display: none;\n            }\n\n            #h5branding-wrapper {\n                width: 110px;\n                height: 110px;\n                margin: 0;\n            }\n\n            #h5branding-logo {\n                top: 0;\n                transform: scale(0.7, 0.7);\n            }\n\n            #h5branding-button {\n                top: initial;\n                width: 110px;\n                font-size: 14px;\n                position: absolute;\n                top: 140px;\n                left: 0;\n                right: 0;\n            }\n\n            #h5branding-ad {\n               display: none !important;\n            }\n        }\n\n        @media (orientation: portrait) and (max-width: 250px) {\n            #h5branding-logo {\n                top: 2%;\n            }\n        }\n\n        @media (orientation: landscape) and (max-width: 330px) {\n             #h5branding-button {\n                top: 120px;\n            }\n\n            #h5branding-logo > img {\n                height: 70px;\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 850px) {\n            #h5branding-ad {\n               display: none !important;\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 1100px) {\n            #h5branding-center {\n                top: 40%;\n            }\n\n            #h5branding-title {\n               bottom: 5%\n            }\n        }\n\n        @media (max-width: 600px) and (max-height: 900px) {\n            #h5branding-title {\n               display: none\n            }\n        }\n\n        @media (orientation: landscape) and (min-width: 800px) {\n            #h5branding-wrapper {\n                margin-left: 120px;\n                margin-right: 120px;\n            }\n        }\n\n        ", e = this.getGameLogoUrl(), n = this.options.gameTitle, i = '\n        <div id="h5branding-background"></div>\n        <div id="h5branding-version"></div>\n        <div id="h5branding-logo"></div>\n        <div id="h5branding-center">\n            <div id="h5branding-ad"></div>\n            <div id="h5branding-wrapper">\n                <img src="'.concat(e, '" />\n                <div id="h5branding-bar"></div>\n                <button id="h5branding-button" onclick="h5branding.SplashLoader.getInstance().onPlayButtonClick();">Play</button>\n            </div>\n        </div>\n        <div id="h5branding-title">').concat(n, "</div>\n    "), r = document.head || document.getElementsByTagName("head")[0], (a = document.createElement("style")).type = "text/css", a.styleSheet ? a.styleSheet.cssText = o : a.appendChild(document.createTextNode(o)), r.appendChild(a), (o = document.createElement("div")).innerHTML = i, o.id = "h5branding-container", (r = document.body || document.getElementsByTagName("body")[0]).insertBefore(o, r.firstChild), this.circleLoader = new D.Circle("#h5branding-bar", {
                                strokeWidth: 3,
                                color: this.options.barColor
                            }), (a = document.getElementById("h5branding-version")) && (a.innerHTML = this.options.version), [4, this.loadLibs()];
                        case 1:
                            return t.sent(), [4, x.loadHost()];
                        case 2:
                            return t.sent(), [4, this.loadBranding()];
                        case 3:
                            return t.sent(), this.loaded = !0, [2]
                    }
                    var e, n
                })
            })
        }, T.prototype.loadBranding = function() {
            return c(this, void 0, void 0, function() {
                var e, n;
                return u(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return [4, _.preload(Date.now().toString())];
                        case 1:
                            return t.sent(), (e = document.getElementById("h5branding-background")) && (e.style.backgroundColor = _.brandingBackgroundColor), (e = document.getElementById("h5branding-logo")) && x.getBrandingDomain() !== r.BrandingDomain.Neutral && ((n = document.createElement("img")).src = _.brandingLogoUrl.replace("_small", ""), e.appendChild(n)), [2]
                    }
                })
            })
        }, T.prototype.loadLibs = function() {
            var n = this,
                i = this.options.libs.map(function(t, e) {
                    return s.instance.loadScript(t, !0, function() {
                        n.setScriptloadProgress(i.length, e + 1)
                    })
                });
            return Promise.all(i)
        }, Object.defineProperty(T.prototype, "bannerAllowed", {
            get: function() {
                var t = document.body.clientWidth,
                    e = document.body.clientHeight;
                return this.progress < 100 && !(e < t && e <= 460) && !(t < 600 && e < 850)
            },
            enumerable: !1,
            configurable: !0
        }), T.prototype.showBanner = function() {
            var t;
            return this.bannerAllowed && (t = document.getElementById("h5branding-ad")) ? (t.style.display = "inline-flex", t) : null
        }, T.prototype.setScriptloadProgress = function(t, e) {
            this.circleLoader.animate(.3 * e / t, null, function() {})
        }, T.prototype.setLoadProgress = function(t) {
            var e, n = this;
            n.showPlayButton=false;
            this.loaded && (100 == (this.progress = t = 30 + .7 * t) ? (e = document.querySelector("#h5branding-button"), this.circleLoader.animate(1, null, function() {
                !x.inGDGameZone() && e && !0 === n.showPlayButton ? e.style.display = "block" : !x.inGDGameZone() && !1 !== n.showPlayButton || n.onPlayButtonClick()
            })) : this.circleLoader.animate(t / 100, null, function() {}))
        }, T.prototype.setButtonCallback = function(t) {
            this.buttonCallback = t
        }, T.prototype.onPlayButtonClick = function() {
            this.buttonCallback && this.buttonCallback()
        }, T.prototype.destroy = function() {
            var t = document.querySelector("#h5branding-container");
            null !== t && null !== t.parentNode && t.parentNode.removeChild(t)
        }, T.prototype.getGameLogoUrl = function() {
            return "assets/icon.jpeg"
        }, T);

    function T(t) {
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
    r.Branding = _, r.Domain = i, r.Hosts = p, r.SplashLoader = O, r.Utils = x, Object.defineProperty(r, "__esModule", {
        value: !0
    })
});