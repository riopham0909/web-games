/**
 * Created by andrey on 04.05.2021.
 */

var WebViewAudioEngine = function () {
    this._musicVolume = 1;
    this._musicUrl = undefined;
    this._audioPool = {};
    this.batch = {};
    this.sendBatch = cleverapps.accumulate(0, this._sendBatch.bind(this));
};

WebViewAudioEngine.prototype._pausePlaying = function () {
};

WebViewAudioEngine.prototype._resumePlaying = function () {
};

WebViewAudioEngine.prototype.setMusicVolume = function (volume) {
    volume -= 0;
    if (isNaN(volume)) {
        volume = 1;
    }
    if (volume > 1) {
        volume = 1;
    }
    if (volume < 0) {
        volume = 0;
    }

    this._musicVolume = volume;

    this.batch.setMusicVolume = {
        action: "setMusicVolume",
        volume: volume
    };
    this.sendBatch();
};

WebViewAudioEngine.prototype._sendBatch = function () {
    var batch = cleverapps.values(this.batch);

    cleverapps.platform.callNative("AudioPlugin.sendBatch", { batch: batch });

    this.batch = {};
};

WebViewAudioEngine.prototype.getMusicVolume = function () {
    return this._musicVolume;
};

WebViewAudioEngine.prototype.playMusic = function (url, loop) {
    if (!url) {
        return;
    }

    this._musicUrl = url;

    this.batch.musicAction = {
        action: "playMusic",
        url: url,
        loop: Boolean(loop)
    };
    this.sendBatch();
};

WebViewAudioEngine.prototype.stopMusic = function () {
    this._musicUrl = undefined;

    this.batch.musicAction = {
        action: "stopMusic"
    };
    this.sendBatch();
};

WebViewAudioEngine.prototype.stopEffect = function (audio) {
    if (!audio || !audio.url) {
        return;
    }

    this.batch["effect_" + audio.url] = {
        action: "stopEffect",
        url: audio.url
    };
    this.sendBatch();
};

WebViewAudioEngine.prototype.stopAllEffects = function () {
};

WebViewAudioEngine.prototype.playEffect = function (url, loop) {
    if (!url) {
        return;
    }

    this.batch["effect_" + url] = {
        action: "playEffect",
        url: url,
        loop: Boolean(loop)
    };
    this.sendBatch();

    return new WebViewAudio(url, loop);
};

WebViewAudioEngine.prototype.canChangeMusicVolume = function () {
    return true;
};

WebViewAudioEngine.IsApplicable = function () {
    // if (cleverapps.platform.oneOf(IOS) && ["mergecraft"].includes(cleverapps.config.name)) {
    //     return false;
    // }

    return (cleverapps.platform.oneOf(Apple)
        || cleverapps.platform.audioPluginAvailable && cleverapps.platform.oneOf(AndroidBase))
        && cc.sys.isNative && !cc.sys.isNativeFlight && cc.sys.isMobile;
};