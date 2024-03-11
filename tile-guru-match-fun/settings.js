/**
 * Created by slava on 3/28/17.
 */

cleverapps.Settings = function () {
    cleverapps.EventEmitter.call(this);

    this.onChangeSoundListener = function () {
    };

    this.onChangeMusicListener = function () {
    };

    this.load();
};

cleverapps.Settings.prototype = Object.create(cleverapps.EventEmitter.prototype);
cleverapps.Settings.prototype.constructor = cleverapps.Settings;

cleverapps.Settings.getDefaultLanguage = function () {
    var languages = cleverapps.config.languages;
    if (languages.length === 1) {
        return languages[0];
    }

    var userLang = cc.sys.language;
    if (languages.indexOf(userLang) === -1 || userLang === cc.sys.LANGUAGE_ENGLISH) {
        var defaultLanguages = cleverapps.platform.getSuggestedLanguage();
        for (var i = 0; i < defaultLanguages.length; i++) {
            var defaultLanguage = defaultLanguages[i];
            if (languages.indexOf(defaultLanguage) !== -1) {
                return defaultLanguage;
            }
        }
        return cc.sys.LANGUAGE_ENGLISH;
    }

    return userLang;
};

cleverapps.Settings.prototype.getSaveInfo = function () {
    return {
        sound: this.sound,
        music: this.music,
        language: this.language
    };
};

cleverapps.Settings.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SETTINGS, this.getSaveInfo());
    cleverapps.synchronizer.addUpdateTask("settings");
};

cleverapps.Settings.prototype.loadData = function (info) {
    if (info === undefined) {
        this.sound = true;
        this.music = true;
        this.language = cleverapps.Settings.getDefaultLanguage();
        this.save();
    } else {
        this.sound = info.sound;
        this.music = info.music;
        this.language = info.language;
        this.manualResolution = info.manualResolution;
        if (this.manualResolution) {
            cleverapps.resolution.resolutionName = this.manualResolution;
        }
    }

    if (this.language === undefined) {
        this.language = cleverapps.Settings.getDefaultLanguage();
    }
};

cleverapps.Settings.prototype.load = function () {
    var info = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SETTINGS);
    this.loadData(info);
};

cleverapps.Settings.prototype.toggleSound = function () {
    this.sound = !this.sound;

    console.log("Settings toggle sound", this.sound, cc.game.isPaused());

    this.save();
    this.onChangeSoundListener();
};

cleverapps.Settings.prototype.toggleMusic = function () {
    this.music = !this.music;
    cleverapps.audio.onChangeMusic();

    console.log("Settings toggle music", this.music, cc.game.isPaused());

    this.save();
    this.onChangeMusicListener();
};

cleverapps.Settings.prototype.setLanguage = function (language) {
    this.language = language;
    this.save();
};

cleverapps.Settings.prototype.updateDependents = function () {
    if (this.language === cc.sys.LANGUAGE_RUSSIAN) {
        if (cleverapps.dailyLevel && !cleverapps.dailyLevel.currentEvent) {
            cleverapps.dailyLevel.load();
        }
    }

    if (cleverapps.config.type === "board") {
        cleverapps.episodes.reset();
        cleverapps.hose && cleverapps.hose.reset();
    }

    cleverapps.paymentsCountry.update();
};

cleverapps.Settings.prototype.setManualResolution = function (manualResolution) {
    this.manualResolution = manualResolution;
    var info = this.getSaveInfo();
    info.manualResolution = this.manualResolution;
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SETTINGS, info);
    cleverapps.DataLoader.processSaveQueue();

    window.location.reload();
};
