/**
 * Created by vladislav on 30.12.2019
 */

cleverapps.SkinManager = function () {
    this.active = [];

    this.defaultSlots = cleverapps.SkinManager.SKINS.default.slots;

    this.prepareBundlesSkins();
};

cleverapps.SkinManager.prototype.prepareBundlesSkins = function () {
    this.overrides = {};

    for (var name in bundles) {
        var bundle = bundles[name];
        this.prepareOverriddenUrls(bundle.frames);
        this.prepareOverriddenUrls(bundle.jsons);
        this.prepareOverriddenUrls(bundle.urls);
    }
};

cleverapps.SkinManager.prototype.prepareOverriddenUrls = function (urls) {
    for (var url in urls) {
        var key = url.split("$");
        var skin = key[1];
        key = key[0];

        if (skin) {
            if (!this.overrides[skin]) {
                this.overrides[skin] = {};
            }

            this.overrides[skin][urls[key]] = urls[url];
        }
    }
};

cleverapps.SkinManager.prototype.getLink = function (link) {
    if (!this.active.length) {
        return link;
    }

    for (var i = 0; i < this.active.length; i++) {
        var active = this.active[i].slots;
        var skin = active && active.skinName && active.skinName();
        var url = skin && this.overrides[skin] && this.overrides[skin][link];
        if (url) {
            return url;
        }
    }

    return link;
};

cleverapps.SkinManager.prototype.getSlot = function (slotName, options) {
    for (var i = 0; i < this.active.length; i++) {
        if (this.active[i] && this.active[i].slots[slotName]) {
            var skinned = this.active[i].slots[slotName](options);

            if (skinned !== undefined) {
                return skinned;
            }
        }
    }

    return this.defaultSlots[slotName] && this.defaultSlots[slotName](options);
};

cleverapps.SkinManager.prototype.update = function () {
    this.active = [];

    if (cleverapps.config.type === "merge") {
        var expedition = cleverapps.travelBook.getCurrentExpedition();

        if (expedition && cleverapps.SkinManager.SKINS[expedition.id + "_expedition"]) {
            this.active.push(cleverapps.SkinManager.SKINS[expedition.id + "_expedition"]);
        }
        if (cleverapps.eventManager && cleverapps.eventManager.isActive("xmas_skin")) {
            this.active.push(cleverapps.SkinManager.SKINS.xmas);
        }
        if (cleverapps.eventManager && cleverapps.eventManager.isActive("dragonia")) {
            this.active.push(cleverapps.SkinManager.SKINS.dragonia);
        }
        if (cleverapps.eventManager && cleverapps.eventManager.isActive("dragonia2")) {
            this.active.push(cleverapps.SkinManager.SKINS.dragonia2);
        }
        if (cleverapps.eventManager && cleverapps.eventManager.isActive("undersea")) {
            this.active.push(cleverapps.SkinManager.SKINS.undersea);
        }
        if (cleverapps.eventManager && cleverapps.eventManager.isActive("undersea2")) {
            this.active.push(cleverapps.SkinManager.SKINS.undersea2);
        }

        return;
    }

    if (!cleverapps.eventManager) {
        return;
    }

    cleverapps.eventManager.listCurrentFeatures().forEach(function (feature) {
        if (cleverapps.SkinManager.SKINS[feature]) {
            this.active.push(cleverapps.SkinManager.SKINS[feature]);
        }
    }, this);
};

cleverapps.SkinManager.prototype.getBundles = function () {
    var bundles = [];
    this.active.forEach(function (skin) {
        if (skin && skin.bundle) {
            bundles.push(skin.bundle);
        }
    });

    return bundles.length > 0 ? bundles : undefined;
};

cleverapps.SkinManager.SKINS = {
    default: {
        localization: {},
        slots: {
            windowDecors: function (options) {
                return options.decors;
            },
            windowBg: function (options) {
                return options.image;
            },
            spine: function (options) {
                return options.json;
            },
            menuBarItem: function () {},
            sceneControlButton: function () {},
            gameAudio: function () {},
            missionIcon: function (options) {
                return Missions[options.type].collectIcon;
            },
            missionWindowHero: function () {
                return cleverapps.styles.MissionWindow.heroTitleAnimation;
            },
            tulpanScale: function () {
                return cleverapps.styles.TulpanCellView.scale;
            },
            removeMissions: function () {
            },
            toolbarDecors: function () {
                return [];
            },
            localization: function (code) {
                return cleverapps.SkinManager.SKINS.default.localization[code];
            },
            windowTitle: function (options) {
                return options.image;
            },
            missionMarkIcon: function (options) {
                return Missions[options.type].collectIcon;
            },
            missionWindowTitleFont: function () {
                return cleverapps.styles.FONTS.WINDOW_TITLE_TEXT;
            },
            cardMarkSpine: function (options) {
                return options.json;
            },
            water: function () {
                var tilesTexture = Game.currentGame && Game.currentGame.map && Game.currentGame.map.tilesTexture;
                return bundles[tilesTexture] && bundles[tilesTexture].frames.water;
            },
            unitIcon: function (unitCode) {
                return bundles.unit_icons.frames["small_icon_castle_" + unitCode];
            },
            fog: function () {
                return {};
            },
            outOfBoundaryScale: function () {
                return 0.2;
            }
        }
    }
};