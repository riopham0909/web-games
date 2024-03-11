/**
 * Created by slava on 4/4/17.
 */

var BundleLoader = function () {
    this.handles = {};
    this.blockedCounter = 0;
    this.unusedResources = {};
    this.unusedBundles = {};

    this.waitWindow = undefined;
};

BundleLoader.prototype.addBlockWindow = function () {
    if (this.blockedCounter === 0) {
        var scene = cleverapps.scenes.getRunningScene();
        if (scene && !cleverapps.environment.isLoaderScene() && !this.waitWindow && !cleverapps.config.wysiwygMode) {
            this.waitWindow = new WaitWindow();
        }
    }

    this.blockedCounter++;
};

BundleLoader.prototype.removeBlockWindow = function () {
    this.blockedCounter--;

    if (this.blockedCounter <= 0) {
        if (this.waitWindow) {
            this.waitWindow.close();
            this.waitWindow = undefined;
        }
    }
};

BundleLoader.prototype.onFailure = function (name, status) {
    var handle = this.getHandle(name);
    var onFailures = handle && handle.onFailures;

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.FAIL_BUNDLE + name);

    if (handle && handle.blocked) {
        if (this.waitWindow) {
            this.waitWindow.close();
            this.waitWindow = false;
        }

        new RestartWindow();
    } else {
        this.deleteBundle(name, true);
    }

    if (cleverapps.versionChecker.isClientVersionActual() && !cleverapps.config.debugMode && cleverapps.checkStatus(status, 404)) {
        setTimeout(function () {
            throw ("load actual bundle " + name + " 404 error");
        }, 0);
    }

    if (onFailures) {
        onFailures.forEach(function (onFailure) {
            onFailure(status);
        });
    }
};

BundleLoader.prototype.loadBundles = function (names, options) {
    options = options || {};

    var onSuccess = options.onSuccess || function () {};
    var onFailure = options.onFailure;

    var waiter = cleverapps.wait(names.length || 0, onSuccess);

    if (onFailure) {
        onFailure = cleverapps.once(onFailure);
    }

    for (var i = 0; i < names.length; i++) {
        var singleOptions = {
            onSuccess: waiter,
            onFailure: onFailure,
            blocked: options.blocked
        };
        this.loadBundle(names[i], singleOptions);
    }
};

BundleLoader.prototype.getHandle = function (bundleName) {
    return this.handles[bundleName];
};

BundleLoader.prototype.countLoaded = function (bundleName) {
    if (Array.isArray(bundleName)) {
        return bundleName.filter(function (name) {
            return this.countLoaded(name);
        }.bind(this)).length;
    }

    if (bundles[bundleName] && bundles[bundleName].injectTo) {
        return this.isVirtualLoaded(bundleName);
    }

    var handle = this.getHandle(bundleName);
    return (handle && handle.loaded) ? 1 : 0;
};

BundleLoader.prototype.isLoaded = function (bundleName) {
    if (!Array.isArray(bundleName)) {
        bundleName = [bundleName];
    }

    return this.countLoaded(bundleName) === bundleName.length;
};

BundleLoader.prototype.isVirtualLoaded = function (bundleName) {
    var bundle = bundles[bundleName];
    for (var i in bundle.injectTo) {
        if (cleverapps.bundleLoader.isLoaded(bundle.injectTo[i])) {
            return true;
        }
    }

    return false;
};

BundleLoader.prototype.loadBundle = function (name, options) {
    var bundle = bundles[name];
    var handle = this.getHandle(name);

    options = options || {};
    var onSuccess = options.onSuccess;
    var onFailure = options.onFailure;
    var blocked = options.blocked;

    if (!cleverapps.resolution.isInitialized()) {
        cleverapps.throwAsync("Can't load urls while resolution is not defined");
    }

    if (bundle.virtual || bundle.stored) {
        onSuccess && onSuccess(bundle);
        return;
    }

    if (handle) {
        handle.counter++;
        if (handle.loaded) {
            // already loaded
            if (onSuccess) {
                onSuccess(bundle);
            }
        } else {
            // same bundle loading now
            if (onSuccess) {
                handle.onSuccesses.push(onSuccess);
            }
            if (onFailure) {
                handle.onFailures.push(onFailure);
            }
            if (!handle.blocked && blocked) {
                handle.blocked = true;
                this.addBlockWindow();
            }
        }
        return;
    }

    var onSuccesses = [];
    if (onSuccess) {
        onSuccesses = Array.isArray(onSuccess) ? onSuccess : [onSuccess];
    }

    var onFailures = [];
    if (onFailure) {
        onFailures = Array.isArray(onFailure) ? onFailure : [onFailure];
    }

    var newHandle = {
        loaded: false,
        counter: 1,
        onSuccesses: onSuccesses,
        onFailures: onFailures,
        blocked: blocked
    };

    this.handles[name] = newHandle;

    if (blocked) {
        this.addBlockWindow();
    }

    newHandle.onLoadedUrls = cleverapps.once(function () {
        newHandle.loaded = true;

        if (newHandle.blocked) {
            this.removeBlockWindow();
        }

        new Bundle(name).onLoad(function () {
            for (var i = 0; i < newHandle.onSuccesses.length; i++) {
                onSuccesses[i].call(this, bundle);
            }

            delete newHandle.onSuccesses;
            delete newHandle.onFailures;
            delete newHandle.blocked;
        });
    }.bind(this));

    var retryCount = 3;
    var loadUrls = function () {
        if (!this.getHandle(name)) {
            return;
        }

        // cc.sys.isNative && console.log('load bundle ' + name + ' urls ' + JSON.stringify((new Bundle(name)).listUrls()));
        var oldNoCacheValue = cc.game.config.noCache;
        if (bundle.unpacked) {
            cc.game.config.noCache = true;
        }

        var urls = (new Bundle(name)).listUrls();
        var soundUrls = (new Bundle(name)).listSoundUrls();

        cc.loader.load(urls, function (status) {
            if (status) {
                console.log("load failed", status, JSON.stringify((new Bundle(name)).listUrls()));
                if (retryCount <= 1 || cleverapps.checkStatus(status, 404)) {
                    cleverapps.versionChecker.loadClientVersion(function () {
                        this.onFailure(name, status);
                    }.bind(this));
                } else {
                    retryCount--;
                    loadUrls();
                }
            } else {
                newHandle.onLoadedUrls();

                if (soundUrls.length) {
                    cc.loader.load(soundUrls, function () {
                        cleverapps.audio.onSoundsLoaded(soundUrls);
                    });
                }
            }
        }.bind(this));
        cc.game.config.noCache = oldNoCacheValue;
    }.bind(this);

    loadUrls();
};

BundleLoader.prototype.cacheBundles = function (names) {
    names = cleverapps.toArray(names);
    cleverapps.bundleLoader.loadBundles(names, {
        onSuccess: function () {
            cleverapps.bundleLoader.deleteBundles(names);
        }
    });
};

BundleLoader.prototype.checkUrlUseInLoadedBundles = function (url) {
    for (var bundleId in this.handles) {
        var bundle = new Bundle(bundleId);
        var urls = bundle.listUrls().concat(bundle.listSoundUrls());
        for (var id in urls) {
            if (urls[id] === url) {
                return true;
            }
        }
    }
    return false;
};

BundleLoader.prototype.deleteBundles = function (bundles) {
    if (bundles) {
        for (var i = 0; i < bundles.length; i++) {
            this.deleteBundle(bundles[i]);
        }
    }
};

BundleLoader.prototype.deleteBundle = function (bundleId, inFailure) {
    var handle = this.handles[bundleId];
    if (handle === undefined) {
        return;
    }

    if (["main", "episodes_resources"].indexOf(bundleId) !== -1) {
        return;
    }

    handle.counter--;
    if (handle.counter > 0) {
        return;
    }

    if (bundleId.indexOf("enemy") === 0) {
        if (!this.deleteStack) {
            this.deleteStack = {};
        }

        this.deleteStack[bundleId] = new Error().stack;
    }

    if (bundles[bundleId].stored) {
        return;
    }

    if (!inFailure && !handle.loaded && handle.blocked) {
        console.log("Remove blocked loading bundle (maybe error!)", bundleId);
    }

    if (handle.loaded) {
        this.clearOverrides(handle);
    }

    var bundle = new Bundle(bundleId);
    var urls = bundle.listUrls().concat(bundle.listSoundUrls());

    handle.onLoadedUrls = function () {};
    delete this.handles[bundleId];

    for (var id in urls) {
        var url = urls[id];
        if (!this.checkUrlUseInLoadedBundles(url)) {
            this.unusedResources[url] = true;
        }
    }
    this.unusedBundles[bundleId] = true;
};

BundleLoader.prototype.override = function (handle, target, key, value) {
    handle.overrides = handle.overrides || new OverridesContainer();
    handle.overrides.override(target, key, value);
};

BundleLoader.prototype.clearOverrides = function (handle) {
    if (handle.overrides) {
        handle.unoverride();
        delete handle.overrides;
    }
};

BundleLoader.prototype.isUnused = function (bundleName) {
    return !this.isLoaded(bundleName) && this.unusedBundles[bundleName];
};

BundleLoader.prototype.clearUnusedResources = function () {
    if (Object.keys(this.unusedBundles).length === 0) {
        return;
    }

    var resources = this.unusedResources;
    for (var url in resources) {
        if (!this.checkUrlUseInLoadedBundles(url)) {
            var texture = cc.textureCache.getTextureForKey(url);

            if (texture) {
                cc.spriteFrameCache.removeSpriteFramesFromTexture(texture);
                cc.textureCache.removeTextureForKey(url);
            }
            cc.loader.release(url);
        }
    }
    this.unusedResources = {};

    Object.keys(this.unusedBundles).forEach(function (bundleId) {
        if (bundles[bundleId].injectTo || this.handles[bundleId]) {
            return;
        }

        var bundle = new Bundle(bundleId);
        bundle.onUnload();
    }.bind(this));

    this.unusedBundles = {};
};

BundleLoader.prototype.isAllLoaded = function (names) {
    var isLoaded = function (name) {
        var bundle = bundles[name];
        if (this.isLoaded(name) || !bundle || bundle.unpacked && bundle.episode) {
            return true;
        }

        var urls = (new Bundle(name)).listUrls();
        return urls.filter(function (url) {
            return cc.loader.cache[url];
        }).length === urls.length;
    }.bind(this);

    return names.filter(isLoaded).length === names.length;
};
