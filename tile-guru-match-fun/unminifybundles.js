/**
 * Created by slava on 27/10/17
 */

var unmifiyBundlesRec = function (object, id, bundleName) {
    var el = object[id];
    if (typeof el === "object") {
        if (id === "episode" && id !== bundleName) {
            return;
        }
        for (var i in el) {
            unmifiyBundlesRec(el, i, bundleName);
        }
    } else if (typeof el === "string") {
        el = el.replace("@", "~%n/%r/");
        el = el.replace("~", "res/packed/");
        el = el.replace(/%n/g, bundleName);

        if (typeof unpackedBundles !== "undefined" && unpackedBundles[bundleName]) {
            if (typeof unpackedMap === "undefined") {
                unpackedMap = {};
            }

            if (unpackedBundles[bundleName][object[id]]) {
                unpackedMap[el] = unpackedBundles[bundleName][object[id]];
            }
        }

        object[id] = el;
    }
};

var isVirtualLink = function (frameId) {
    return typeof frameId === "string" && frameId.charAt(0) === "@";
};

var createVirtualLink = function (bundle, id, type) {
    return "@" + bundle + "#" + type + "#" + id;
};

var parseVirtualLink = function (link) {
    var bundle = link.substr(1, link.indexOf("#") - 1);
    var id = link.substr(link.lastIndexOf("#") + 1);
    return {
        bundle: bundle,
        id: id
    };
};

var processVirtualUrl = function (urlId) {
    if (!isVirtualLink(urlId)) {
        return cleverapps.skins.getLink(urlId);
    }

    var data = parseVirtualLink(urlId);

    var bundle = bundles[data.bundle];
    var loaded = false;
    for (var i in bundle.injectTo) {
        var bundleName = bundle.injectTo[i];
        if (cleverapps.bundleLoader.isLoaded(bundleName)) {
            if (bundles[bundleName].urls[data.id]) {
                return cleverapps.skins.getLink(bundles[bundleName].urls[data.id]);
            }
            loaded = true;
        }
    }

    if (!loaded) {
        var message = "no urlId " + urlId + " for bundle " + data.bundle;
        console.log(message);
        if (cleverapps.config.debugMode) {
            throw message;
        }
    }
};

var getVirtualLinkType = function (link) {
    return link.split("#")[1];
};

processVirtualImage = function (imageId, preferredBundles) {
    if (!isVirtualLink(imageId)) {
        return cleverapps.skins.getLink(imageId);
    }

    var type = getVirtualLinkType(imageId);
    if (type === "frame") {
        return processVirtualFrame(imageId, preferredBundles);
    }

    if (type === "url") {
        return processVirtualUrl(imageId);
    }
};

var processVirtualFrame = function (frameId, preferredBundles) {
    if (!isVirtualLink(frameId)) {
        return cleverapps.skins.getLink(frameId);
    }

    var data = parseVirtualLink(frameId);

    var bundle = bundles[data.bundle];
    var injectTo = bundle.injectTo;
    if (Array.isArray(preferredBundles) && preferredBundles.length > 0) {
        if (Game.currentGame && Game.currentGame.map) {
            var tilesTexture = Game.currentGame.map.tilesTexture;
            var unitsTexture = Game.currentGame.map.unitsTexture;
        }

        preferredBundles = preferredBundles.reduce(function (bundles, name) {
            if (tilesTexture) {
                if (name === "tiles") {
                    name = tilesTexture || name;
                } else if (name === "units") {
                    name = unitsTexture || name;
                }
            }
            bundles[name] = true;
            return bundles;
        }, {});

        injectTo = injectTo.filter(function (bundle) {
            return preferredBundles[bundle];
        }).concat(injectTo);
    }

    var loaded = false;
    for (var i in injectTo) {
        var bundleName = injectTo[i];
        if (cleverapps.bundleLoader.isLoaded(bundleName)) {
            if (bundles[bundleName].frames[data.id]) {
                return cleverapps.skins.getLink(bundles[bundleName].frames[data.id]);
            }
            loaded = true;
        }
    }

    if (!loaded) {
        var message = "not loaded " + bundle.injectTo.join(";") + " for bundle " + data.bundle;
        console.log(message);
        if (cleverapps.config.debugMode) {
            throw message;
        }
    }
};

processVirtualJson = function (jsonId) {
    if (!isVirtualLink(jsonId)) {
        return cleverapps.skins.getLink(jsonId);
    }

    var data = parseVirtualLink(jsonId);

    var bundle = bundles[data.bundle];
    var loaded = false;
    for (var i in bundle.injectTo) { 
        var bundleName = bundle.injectTo[i];
        if (cleverapps.bundleLoader.isLoaded(bundleName)) {
            if (bundles[bundleName].jsons[data.id]) {
                return cleverapps.skins.getLink(bundles[bundleName].jsons[data.id]);
            }
            loaded = true;
        }
    }

    if (!loaded) {
        var message = "not loaded " + bundle.injectTo.join(";") + " for bundle " + data.bundle;
        console.log(message);
        if (cleverapps.config.debugMode) {
            throw message;
        }
    }
};

var processInlineJSONs = function (bundle) {
    for (var jsonId in bundle.jsons) {
        var json = bundle.jsons[jsonId];

        if (json.inline) {
            var data = JSON.parse(json.data);
            var url = json.url;

            cc.loader.cache[url] = data;
            bundle.jsons[jsonId] = url;
        }
    }
};

var unminifyBundles = function (names) {
    names = names || Object.keys(bundles);

    for (var i in names) {
        var name = names[i];
        unmifiyBundlesRec(bundles, name, name);
        if (!bundles[name].frames) {
            bundles[name].frames = {};
        }
        if (!bundles[name].jsons) {
            bundles[name].jsons = {};
        }

        processInlineJSONs(bundles[name]);

        var bundle = bundles[name];
        bundle.urls = bundle.urls || {};
        if (bundle.injectTo && bundle.frameIds) {
            bundle.frameIds.forEach(function (frameId) {
                bundle.frames[frameId] = createVirtualLink(name, frameId, "frame");
            });
            delete bundle.frameIds;
        }
        if (bundle.injectTo && bundle.jsonIds) {
            bundle.jsonIds.forEach(function (jsonId) {
                bundle.jsons[jsonId] = createVirtualLink(name, jsonId, "json");
            });
            delete bundle.jsonIds;
        }
        if (bundle.injectTo && bundle.soundIds) {
            bundle.soundIds.forEach(function (soundId) {
                bundle.urls[soundId] = createVirtualLink(name, soundId, "url");
            });
            delete bundle.soundIds;
        }
        if (bundle.injectTo && bundle.unpackedIds) {
            bundle.unpackedIds.forEach(function (unpackedId) {
                bundle.urls[unpackedId] = createVirtualLink(name, unpackedId, "url");
            });
            delete bundle.unpackedIds;
        }
    }

    if (typeof unpackedBundles !== "undefined") {
        unpackedBundles = undefined;
    }

    ResourceProcessor.addStaticUrl();

    for (i in names) {
        name = names[i];
        bundle = bundles[name];

        if (bundle.important) {
            bundle.important = cleverapps.createSet(bundle.important.map(function (soundId) {
                return bundle.urls[soundId];
            }));
        }
    }
};

unminifyBundles();
