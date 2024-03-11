/**
 * Created by mac on 2019-03-22
 */

var Bundle = function (name) {
    this.name = name;
    this.data = bundles[name];
};

Bundle.prototype.onLoad = function (callback) {
    callback = callback || function () {};

    var packedJson = cc.loader.getRes(this.data.urls.json);
    for (var jsonId in packedJson) {
        var jsonLink = this.data.jsons[jsonId];
        var value = packedJson[jsonId];
        if (typeof jsonLink === "string" && cc.path.extname(jsonLink) === ".plist") {
            try {
                value = cc.plistParser.parse(value);
            } catch (e) {
                throw "Parse " + jsonLink + " " + this.data.urls.json + " error " + e;
            }
        }
        cc.loader.cache[jsonLink] = value;
    }

    if (this.data.jsons.plist) {
        cc.spriteFrameCache.addSpriteFrames(this.data.jsons.plist, this.data.urls.png);
    }

    cc.loader.release(this.data.urls.json);

    callback();
};

Bundle.prototype.onUnload = function () {
    if (this.data.jsons.plist) {
        cc.spriteFrameCache.removeSpriteFramesFromFile(this.data.jsons.plist);
        delete cc.spriteFrameCache._frameConfigCache[this.data.jsons.plist];
    }

    for (var jsonId in this.data.jsons) {
        var jsonLink = this.data.jsons[jsonId];
        cc.loader.release(jsonLink);
        delete cleverapps.Spine.cache[jsonLink];
    }
};

Bundle.prototype.isResourceSound = function (url) {
    if (!url) {
        return false;
    }

    return url.music || (typeof url === "string") && (url.indexOf("/sfx/") !== -1 || url.indexOf(".mp3") !== -1);
};

Bundle.prototype.listSoundUrls = function () {
    if (cc.sys.isWebViewAudio) {
        return [];
    }

    if (cleverapps.config.debugMode && cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TEST_SOUNDS) === "important_only") {
        return [];
    }

    return cleverapps.values(this.data.urls).filter(function (element) {
        return this.isResourceSound(element) && !isVirtualLink(element) && !this.isImportantSound(element);
    }.bind(this));
};

Bundle.prototype.listUrls = function () {
    var urls = cleverapps.values(this.data.urls).filter(function (element) {
        if (cleverapps.config.source === "playable") {
            if (typeof element === "string" && (cc.loader.cache[element] !== undefined || element.indexOf(".json") !== -1)) {
                return false;
            }
            if (element && element.type === "font") {
                return false;
            }
        }

        if (this.isResourceSound(element) && (cc.sys.isWebViewAudio || !this.isImportantSound(element))) {
            return false;
        }

        return !isVirtualLink(element);
    }.bind(this));

    return urls;
};

Bundle.prototype.isImportantSound = function (url) {
    if (cleverapps.config.debugMode && cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TEST_SOUNDS) === "wait_all") {
        return true;
    }

    return this.data.important && this.data.important[url];
};

Bundle.prototype.listJsons = function () {
    return cleverapps.values(this.data.jsons);
};

Bundle.prototype.injectTo = function (res) {
    var types = ["urls", "frames", "jsons"];
    types.forEach(function (type) {
        Object.assign(res, this.data[type]);
    }, this);
};