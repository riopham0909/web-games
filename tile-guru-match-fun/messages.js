/**
 * Created by andrey on 20.07.17.
 */

var Messages = {
    dictionary: undefined,
    debugTextCodes: {},

    isInitialized: function () {
        return this.dictionary;
    },

    get: function (code, toReplace) {
        if (!Messages.dictionary || !code) {
            return code || "";
        }
        toReplace = toReplace || {};

        code = cleverapps.skins.getSlot("localization", code) || code;

        var value = code;
        if (Messages.dictionary[value]) {
            value = Messages.dictionary[value];
        } else if (value.length > 10 && cleverapps.config.debugMode && value.includes(".") && Game.currentGame && !toReplace.ignoreWarning) {
            console.log("Non-existent key: ", value);
        }

        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                value[i] = Messages.replace(value[i], toReplace);
            }
        } else {
            value = Messages.replace(value, toReplace);
        }

        if (cleverapps.config.debugMode && Messages.dictionary[code] && typeof value === "string") {
            Messages.debugTextCodes[value.toLowerCase().replace(/\s/g, ".")] = code;
        }

        return value;
    },

    has: function (code) {
        if (!Messages.dictionary) {
            return false;
        }
        return Messages.dictionary[code];
    },

    replace: function (message, toReplace) {
        toReplace = toReplace || {};

        if (typeof message === "string") {
            for (var i in toReplace) {
                var value = toReplace[i];
                if (typeof value === "string") {
                    value = Messages.get(value);
                }

                var template = "%{" + i + "}";
                while (message.indexOf(template) !== -1) {
                    message = message.replace(template, value);
                }
            }
        }
        return message;
    },

    getLocalized: function (obj, toReplace) {
        if (typeof obj === "string") {
            return Messages.get(obj, toReplace);
        }

        if (typeof obj === "object" && cleverapps.intersect(Object.keys(obj), cleverapps.config.languages).length > 0) {
            if (obj[cleverapps.settings.language] !== undefined) {
                obj = obj[cleverapps.settings.language];
            } else {
                obj = obj[cc.sys.LANGUAGE_ENGLISH];
            }
            return Messages.getLocalized(obj, toReplace);
        }

        if (typeof obj !== "object") {
            return obj;
        }

        obj = cleverapps.clone(obj);
        for (var i in obj) {
            obj[i] = Messages.getLocalized(obj[i], toReplace);
        }
        return obj;
    },

    preload: function (language, callback) {
        cleverapps.bundleLoader.loadBundle("language_" + language, {
            onSuccess: function (bundle) {
                Messages.dictionary = {};

                if (cleverapps.config.debugMode) {
                    Messages.debugTextCodes = {};
                    Messages.debugMapping = {};
                }

                Object.keys(cleverapps.config.dictionaries).forEach(function (dictionary) {
                    if (bundle.jsons[dictionary]) {
                        var data = cc.loader.getRes(bundle.jsons[dictionary]);
                        Messages.validate(data);
                        Object.assign(Messages.dictionary, data);

                        if (cleverapps.config.debugMode) {
                            Object.keys(data).forEach(function (key) {
                                Messages.debugMapping[key] = bundle.jsons[dictionary];
                            });
                        }
                    }
                });

                cleverapps.bundleLoader.deleteBundle("language_" + language);
                callback();
            },
            blocked: true
        });
    }
};

Messages.validate = function (data) {
    var validateTypes = Object.keys(Messages.validateTypes).map((item) => Messages.validateTypes[item]);
    Object.keys(data).forEach(function (key) {
        validateTypes.forEach(function (type) {
            if (type.filter(key)) {
                if (Array.isArray(data[key])) {
                    data[key].forEach(function (item, index) {
                        data[key][index] = type.action(item);
                    });
                } else {
                    data[key] = type.action(data[key]);
                }
            }
        });
    });
};

Messages.validateTypes = {
    localPushes: {
        filter: function (key) {
            return key.includes("LocalPushes");
        },
        action: function (value) {
            if (value.length > 100) {
                if (cleverapps.config.debugMode) {
                    cleverapps.throwAsync(`Messages.validate error ${value}`);
                }
                return value.substring(0, 100);
            }
            return value;
        }
    }
};