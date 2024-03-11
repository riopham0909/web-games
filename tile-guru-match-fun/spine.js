/**
 * Created by mac on 2019-10-24
 */

cleverapps.Spine = cc.Node.extend({
    ctor: function (json, scale, atlas) {
        this._super();
        this.setAnchorPoint2();

        json = cleverapps.Spine.processJson(json);
        if (cleverapps.config.wysiwygMode && typeof json === "object" && json.atlas) {
            atlas = json.atlas;
            json = json.json;
        }

        this.jsonName = json;

        var guessed = cleverapps.Spine.jsonToBundle[json];
        var loaded = cleverapps.bundleLoader.isLoaded(guessed);

        if (!loaded && guessed !== "loading_scene" && json && guessed) {
            var deleteStack = cleverapps.bundleLoader.deleteStack && cleverapps.bundleLoader.deleteStack[guessed];
            throw "Json " + json + " bundle " + guessed + " not loaded stack" + deleteStack;
        }

        if (guessed === undefined && !atlas) {
            console.log("json bundles cache", cleverapps.Spine.jsonToBundle);
            throw "Can't find bundle for json - " + json + " in bundles cache ";
        }

        var jsonFile = json;
        var atlasFile = atlas || bundles[guessed].jsons.atlas;

        if (!cc.loader.getRes(atlasFile)) {
            throw "Atlas " + jsonFile + " bundle " + guessed + " not loaded " + loaded;
        }

        scale = scale || 1;

        var cached = cleverapps.Spine.getCachedData(json, scale);
        if (cached) {
            jsonFile = cached.data;
            atlasFile = cached.atlas;
        }

        // cc.sys.isNative && console.log('spine atlas', bundles[guessed].jsons.atlas, cc.loader.getRes(bundles[guessed].jsons.atlas));
        try {
            var spine = this.spine = sp.SkeletonAnimation.createWithJsonFile(jsonFile, atlasFile, scale, json);
        } catch (e) {
            console.error(e);
            if (cleverapps.config.debugMode) {
                var gitData = cleverapps.Spine.getGitPath(json) || {};
                e.message = gitData.name + "\n" + gitData.link + "\n" + e;
            } else {
                e.message = json + "\n" + e;
            }
            throw new Error(e.message);
        }
        spine.jsonName = json;

        var data = {
            data: spine._skeletonData,
            atlas: atlasFile
        };
        if (engine === "cocos2d") {
            data.atlas = true;
        }
        cleverapps.Spine.setCachedData(data, json, scale, spine.getSkin && spine.getSkin());

        this.data = cc.loader.getRes(json);
        var skeleton = this.data.skeleton;
        this.setContentSize2(skeleton.width * resolutionScale, skeleton.height * resolutionScale);
        spine.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(spine);

        this.setCascadeOpacityEnabledRecursively(true);
        this.setRecCascadeColorEnabled(true);

        // TODO: track current animation
        this.runningAnimation = undefined;

        this.initialize();

        if (cleverapps.Spine.debugSlots) {
            this.setDebugSlots(true);
        }

        if (cleverapps.Spine.debugBones) {
            this.setDebugBones(true);
        }
    },

    initialize: function () {
        this.setVisible(false);
        this.startVisibleListener = undefined;
    },

    setStartVisibleListener: function (listener) {
        this.startVisibleListener = listener;
    },

    setIdle: function (idleAnimation) {
        if (idleAnimation !== this.idle) {
            this.idle = idleAnimation;
            this.setAnimation(0, this.idle, true);
        }
    },

    setIdleSet: function (animations) {
        var sum = 0;
        cleverapps.values(animations).forEach(function (prob) {
            sum += prob;
        });
        var choose = function () {
            var number = Math.random() * sum;
            for (var key in animations) {
                number -= animations[key];
                if (number <= 0) {
                    return key;
                }
            }
        };

        var setAnimationAndChoose = function () {
            this.setAnimation(0, choose(), false);
            this.setCompleteListener(setAnimationAndChoose);
            this.setSafeToRemove();
        }.bind(this);

        setAnimationAndChoose();
    },

    hasAnimation: function (name) {
        return this.data.animations[name];
    },

    getAnimationData: function (name) {
        return this.spine.findAnimation(name);
    },

    getAnimationDuration: function (name) {
        var data = this.getAnimationData(name);
        if (data) {
            return data.duration;
        }
    },

    hasSkin: function (name) {
        return this.data.skins[name] !== undefined;
    },

    listAnimations: function () {
        return Object.keys(this.data.animations);
    },

    setAnimation: function (track, animation, repeat) {
        if (this.getCurrentAnimationName()) {
            this.setCompleteListener();
        }
        this.spine.setAnimation(track, animation, repeat);

        if (this.idle) {
            this.idle = undefined;
        }

        var json = this.spine.jsonName;
        if (!this.data.animations[animation]) {
            cleverapps.throwAsync("Not found animation " + animation + " in json " + json);
        }

        if (!this.visible) {
            this.visible = true;
            this.startVisibleListener && this.startVisibleListener();
        }
    },

    addAnimation: function (trackIndex, name, loop, delay) {
        this.spine.addAnimation(trackIndex, name, loop, delay);

        var json = this.spine.jsonName;
        if (!this.data.animations[name]) {
            cleverapps.throwAsync("Not found animation " + name + " in json " + json);
        }
    },

    getCurrentState: function (track) {
        return this.spine.getCurrent(track || 0);
    },

    getTimeLeft: function (track) {
        var state = this.getCurrentState(track);
        var duration = state && state.animation && state.animation.duration || 0;
        var trackTime = state && state.trackTime || 0;
        return Math.max(0, (duration - trackTime) / this.getTimeScale());
    },

    getCurrentAnimationName: function (track) {
        var state = this.spine.getCurrent(track);
        return state && state.animation && state.animation.name;
    },

    setTimeScale: function (scale) {
        this.spine.setTimeScale(scale);
    },

    getTimeScale: function () {
        return this.spine.getTimeScale();
    },

    clearTrack: function (trackIndex) {
        this.spine.clearTrack(trackIndex);
    },

    setSkin: function (skin) {
        this.spine.setSkin(skin);
    },

    setStartListener: function (callback) {
        this.spine.setStartListener(callback);
    },

    setCompleteListener: function (callback) {
        this.spine.setCompleteListener(callback || function () {});

        this._cantBeRemoved = Boolean(callback);

        if (this.saveStack && this._cantBeRemoved) {
            this.actionStack = new Error().stack;
        }
    },

    setCompleteListenerRemove: function (callback) {
        this.setCompleteListener(function () {
            if (callback) {
                callback();
            }
            this.runAction(new cc.RemoveSelf());
        }.bind(this));
        this.setSafeToRemove();
    },

    setCompleteListenerOnce: function (listener) {
        this.setCompleteListener(function () {
            listener();
            this.setCompleteListener();
        }.bind(this));
    },

    setAnimationAndContinue: function (animation) {
        var idle = this.getCurrentAnimationName(0);
        this.setAnimation(0, animation, false);
        this.addAnimation(0, idle, true);
    },

    setAnimationAndIdleAfter: function (animation, idle) {
        this.setAnimation(0, animation, false);
        this.addAnimation(0, idle, true);
    },

    setDebugSlots: function (enable) {
        this.spine.setDebugSolots(enable);
    },

    setDebugBones: function (enable) {
        this.spine.setDebugBones(enable);
    },

    setSafeToRemove: function () {
        this._cantBeRemoved = false;
        delete this.cantRemoveStack;
    },

    isSaveToRemove: function () {
        return !this._cantBeRemoved;
    },

    getCurSkin: function () {
        if (!this.spine._skeleton.skin) {
            return "default";
        }
        return this.spine._skeleton.skin.name;
    },

    getBoundingBoxToWorld: function () {
        var rect = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
        var trans = this.getNodeToWorldTransform();
        return cc.rectApplyAffineTransform(rect, trans);
    },

    _getBoundingBoxToCurrentNode: function (parentTransform) {
        var rect = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
        var trans = (parentTransform === undefined) ? this.getNodeToParentTransform() : cc.affineTransformConcat(this.getNodeToParentTransform(), parentTransform);
        return cc.rectApplyAffineTransform(rect, trans);
    },

    unuse: function () {
        this.removeTemporarily(false);

        this.setStartListener(undefined);
        this.setCompleteListener(undefined);
        this.clearTrack(0);
    },

    reuse: function () {
        this.initialize();
    }
});

cleverapps.Spine.getCachedData = function (json, scale, skin) {
    var cached = cleverapps.Spine.cache[json] && cleverapps.Spine.cache[json][scale];
    if (engine === "creator") {
        skin = skin || "default";
        cached = cached && cached[skin];
    }

    return cached;
};

cleverapps.Spine.setCachedData = function (data, json, scale, skin) {
    if (!cleverapps.Spine.cache[json]) {
        cleverapps.Spine.cache[json] = {};
    }
    if (engine === "creator") {
        if (!cleverapps.Spine.cache[json][scale]) {
            cleverapps.Spine.cache[json][scale] = {};
        }
        if (!cleverapps.Spine.cache[json][scale][skin]) {
            cleverapps.Spine.cache[json][scale][skin] = data;
        }
    } else if (!cleverapps.Spine.cache[json][scale]) {
        cleverapps.Spine.cache[json][scale] = data;
    }
};

cleverapps.Spine.processJson = function (json) {
    json = cleverapps.skins.getSlot("spine", {
        json: json
    });
    return processVirtualJson(json);
};

cleverapps.Spine.hasAnimation = function (name, json) {
    var data = cleverapps.Spine.getSkeletonData(json);
    return data && data.animations && data.animations[name] !== undefined;
};

cleverapps.Spine.hasSkin = function (name, json) {
    var data = cleverapps.Spine.getSkeletonData(json);
    return data && data.skins && data.skins[name] !== undefined;
};

cleverapps.Spine.getSkins = function (json) {
    var data = cleverapps.Spine.getSkeletonData(json);

    return Object.keys(data.skins).filter(function (name) {
        return name !== "default";
    });
};

cleverapps.Spine.getSkeletonData = function (json) {
    return cc.loader.getRes(processVirtualJson(json));
};

cleverapps.Spine.isAnimationLoaded = function (json) {
    json = processVirtualJson(json);
    json = cleverapps.skins.getSlot("spine", { json: json });
    return cleverapps.bundleLoader.isLoaded(cleverapps.Spine.jsonToBundle[json]);
};

cleverapps.Spine.prepare = function () {
    var cache = {};

    for (var id in bundles) {
        var bundle = bundles[id];
        if (bundle.injectTo) {
            continue;
        }

        if (id.indexOf("episode_") === 0 && Object.keys(bundle.jsons).length === 1 && bundle.jsons.levels) {
            continue;
        }

        for (var jsonId in bundle.jsons) {
            var jsonFile = bundle.jsons[jsonId];

            var atlasBundleId = id;
            if (jsonId.indexOf("island_") === 0 && id.indexOf("episode_") === 0) {
                atlasBundleId = "episodes_resources";
            }

            if (cache[jsonFile] && cache[jsonFile] !== atlasBundleId) {
                throw "Already exist json: " + jsonFile + " oldBundle - " + cache[jsonFile] + " bundle - " + id;
            }
            cache[jsonFile] = atlasBundleId;
        }
    }

    cleverapps.Spine.jsonToBundle = cache;
};

cleverapps.Spine.listBundles = function (jsons) {
    if (!Array.isArray(jsons)) {
        jsons = [jsons];
    }

    var bundles = [];
    jsons.forEach(function (json) {
        if (jsons && cleverapps.Spine.jsonToBundle[json]) {
            bundles.push(cleverapps.Spine.jsonToBundle[json]);
        }
    });
    return cleverapps.unique(bundles);
};

cleverapps.Spine.removeSlot = function (json, toRemove) {
    json = processVirtualJson(json);
    json = cleverapps.skins.getSlot("spine", {
        json: json
    });
    json = cc.loader.getRes(json);

    json.slots = json.slots.filter(function (slot) {
        return slot.name !== toRemove;
    });

    cleverapps.values(json.skins).forEach(function (skin) {
        delete skin[toRemove];
    });

    cleverapps.values(json.animations).forEach(function (animation) {
        delete animation.slots[toRemove];
    });
};

cleverapps.Spine.getGitPath = function (jsonName) {
    var json = processVirtualJson(jsonName);
    if (json) {
        var unpacked = unpackedMap[json];
        if (unpacked) {
            var repoInd = unpacked.indexOf("/");
            var repoName = unpacked.substring(0, repoInd);
            if (repoName === "res") {
                repoName = cleverapps.config.name;
                repoInd = -1;
            }
            var link = "https://github.com/rvvslv/" + repoName + "/tree/master/" + unpacked.substring(repoInd + 1, unpacked.lastIndexOf("/"));
            return {
                name: jsonName.substring(0, jsonName.lastIndexOf("-")) + ".json",
                link: link
            };
        }
    }
    return undefined;
};

cleverapps.Spine.cache = {};

cleverapps.Spine.GetPoolId = function (obj) {
    if (obj instanceof cleverapps.Spine) {
        obj = obj.jsonName;
    }
    return "spine_" + obj;
};

cleverapps.Spine.GetFromPool = function (json) {
    json = cleverapps.Spine.processJson(json);

    return cc.pool.getFromPool(cleverapps.Spine, json) || new cleverapps.Spine(json);
};

// cleverapps.Spine.debugSlots = true;
