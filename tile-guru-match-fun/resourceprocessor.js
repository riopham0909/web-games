/**
 * Created by slava on 27/10/17
 */

var ResourceProcessor = {
    addStaticUrl: function () {
        var isImage = function (url) {
            return typeof url === "string" && [".png", ".jpg"].indexOf(cc.path.extname(url)) !== -1;
        };

        var isPlistOrAtlas = function (url) {
            return typeof url === "string" && [".plist", ".atlas"].indexOf(cc.path.extname(url)) !== -1;
        };

        var isJSON = function (url) {
            return typeof url === "string" && [".json"].indexOf(cc.path.extname(url)) !== -1;
        };

        var addPrefix = function (urls, prefix) {
            if (typeof urls === "string" && urls.charAt(0) === "@") {
                return urls;
            }

            if (typeof urls === "string" && urls.indexOf(prefix) === -1) {
                if (typeof unpackedMap !== "undefined") {
                    unpackedMap[prefix + urls] = unpackedMap[urls];
                }

                return prefix + urls;
            }

            if (urls.type === "font") {
                urls.srcs = urls.srcs.map(function (src) {
                    return addPrefix(src, prefix);
                });
                return urls;
            }

            if (typeof urls === "object") {
                var result = {};
                for (var i in urls) {
                    result[i] = addPrefix(urls[i], prefix);
                }
                return result;
            }

            return urls;
        };

        var names = Object.keys(bundles);
        for (var i in names) {
            var name = names[i];
            var bundle = bundles[name];

            var prefixBase = cleverapps.config.staticUrl;
            var prefixExternal = cleverapps.config.externalStaticUrl || "";

            if (prefixBase || prefixExternal) {
                for (var j in bundle.urls) {
                    var url = bundle.urls[j];
                    var prefix = bundle.external && isImage(url) && prefixExternal || prefixBase;
                    if (prefix) {
                        bundle.urls[j] = addPrefix(url, prefix);
                    }
                }
            }

            if (prefixBase) {
                Object.keys(bundle.jsons).forEach(function (key) {
                    if (isPlistOrAtlas(bundle.jsons[key]) || isJSON(bundle.jsons[key]) && key === "levels" && bundle.urls.levels) {
                        bundle.jsons[key] = addPrefix(bundle.jsons[key], prefixBase);
                    }
                });
            }

            Object.keys(bundle.urls).forEach(function (key) {
                if (isPlistOrAtlas(bundle.urls[key])) {
                    bundle.jsons[key] = bundle.urls[key];
                }
            });
        }
    },

    calcAlwaysNeed: function () {
        var probablyNeed = ["main"];
        if (cleverapps.config.debugMode) {
            probablyNeed.push("dev_resources");
        }
        return probablyNeed;
    },

    calcProbablyNeed: function () {
        if (cleverapps.config.source === "playable") {
            return [];
        }

        var probablyNeed = ResourceProcessor.calcAlwaysNeed();

        if (cleverapps.settings) {
            probablyNeed.push("language_" + cleverapps.settings.language);
        }

        var SceneClass = cleverapps.Plot.onStartup(undefined, true);
        var options = [];
        if (typeof SceneClass === "object") {
            options = SceneClass.options;
            SceneClass = SceneClass.scene;
        }
        var nextScene = new SceneClass(options[0], options[1], options[2], options[3], options[4]);
        probablyNeed = probablyNeed.concat(nextScene.listBundles(), nextScene.listBaseBundles());

        probablyNeed = cleverapps.unique(probablyNeed);
        probablyNeed = probablyNeed.filter(function (name) {
            return bundles[name] !== undefined;
        });

        return probablyNeed;
    }
};
