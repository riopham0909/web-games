/**
 * Created by andrey on 7/18/17.
 */

cleverapps.Audio = function () {
    this.cache = {};

    if (WebViewAudioEngine.IsApplicable()) {
        cc.sys.isWebViewAudio = true;
        cc.audioEngine = new WebViewAudioEngine();
    }

    this.disk = undefined;
    this.muted = false;
    this.volume = 1;
    this.currentFade = undefined;
};

cleverapps.Audio.prototype.insertDisk = function (disk) {
    this.eject();

    this.disk = processVirtualUrl(disk);
    this.onChangeMusic();
};

cleverapps.Audio.prototype.eject = function () {
    this.setVolume(1);
    this.stopFade();

    if (this.disk) {
        this.disk = undefined;
        this.onChangeMusic();
    }
};

cleverapps.Audio.prototype.mute = function () {
    if (this.muted || cleverapps.gameModes.noMute || cleverapps.platform.oneOf(Instant) && cc.sys.os === cc.sys.OS_IOS && cc.sys.isInApp) {
        return;
    }

    console.log("Audio mute");

    this.muted = true;
    this.onChangeMusic();

    if (cc.Audio.gainNode) {
        cc.Audio.gainNode.gain.value = 0;
    }
};

cleverapps.Audio.prototype.unmute = function () {
    if (!this.muted || cleverapps.gameModes.noMute || cleverapps.platform.oneOf(Instant) && cc.sys.os === cc.sys.OS_IOS && cc.sys.isInApp) {
        return;
    }

    console.log("Audio unmute");

    this.muted = false;
    this.onChangeMusic();

    if (cc.Audio.gainNode) {
        cc.Audio.gainNode.gain.value = 1;
    }
};

cleverapps.Audio.prototype.onChangeMusic = function () {
    if (this.disk && !this.muted && cleverapps.settings.music && !cc.game.isPaused()) {
        this.logSound(this.disk);
        if (this.volume !== this.realVolume) {
            this.setVolume(this.volume);
        }

        var audio = cc.loader.getRes(this.disk);
        if (cc.sys.isWebViewAudio || audio && (!audio.isLoaded || audio.isLoaded())) {
            cc.audioEngine.playMusic(this.disk, true);
        }
    } else {
        cc.audioEngine.stopMusic();
    }
};

cleverapps.Audio.prototype.onSoundsLoaded = function (sounds) {
    if (this.disk && sounds.indexOf(this.disk) !== -1) {
        this.onChangeMusic();
    }
};

cleverapps.Audio.prototype.stopFade = function () {
    if (this.currentFade) {
        cleverapps.timeouts.clearInterval(this.currentFade);
        delete this.currentFade;
    }
};

cleverapps.Audio.prototype.setVolume = function (volume) {
    this.volume = volume;

    if (cc.audioEngine.canChangeMusicVolume() && !this.muted && cleverapps.settings.music && !cc.game.isPaused()) {
        this.realVolume = volume;
        cc.audioEngine.setMusicVolume(volume);
    }
};

cleverapps.Audio.prototype.fadeOut = function (fadeTime) {
    this.setVolume(1);
    this.stopFade();

    if (!this.disk) {
        return;
    }

    this._fade(fadeTime, -1);
};

cleverapps.Audio.prototype.fadeIn = function (fadeTime) {
    this.stopFade();

    if (!fadeTime) {
        this.setVolume(1);
        return;
    }

    this.setVolume(0);

    if (!this.disk) {
        return;
    }

    this._fade(fadeTime, 1);
};

cleverapps.Audio.prototype._fade = function (fadeTime, sign) {
    var FADE_TIME = fadeTime * 1000 || 400;
    var INTERVAL = 20;

    var steps = FADE_TIME / INTERVAL;
    var step = 1 / steps * sign;

    this.currentFade = cleverapps.timeouts.setInterval(function () {
        var volume = Math.max(0, Math.min(1, Math.floor((this.volume + step) * 1000) / 1000));
        this.setVolume(volume);
        steps--;

        if (steps === 0) {
            if (sign < 0) {
                this.eject();
            }
            this.stopFade();
        }
    }.bind(this), INTERVAL);
};

cleverapps.Audio.prototype.playSound = function (sound, options) {
    if (!cleverapps.settings.sound || cc.game.isPaused() || this.muted) {
        return;
    }

    if (!cleverapps.platform.isAudioContextRunning()) {
        return;
    }

    sound = processVirtualUrl(sound);

    if (!sound) {
        if (cleverapps.config.debugMode) {
            // throw "No sound " + originalSound;
        }
        return;
    }

    options = options || {};

    this.logSound(sound, options);

    var audio = this.cache[sound];
    var throttle = options.throttle !== undefined ? options.throttle : cleverapps.Audio.THROTTLE_AUDIO;

    if (audio && audio.getPlaying() && audio.startPlaying + throttle > Date.now()) {
        return;
    }

    var fromPool = (cc.audioEngine._audioPool[sound] || []).filter(function (audio) {
        return !audio.getPlaying();
    })[0];
    if (fromPool) {
        cc.audioEngine.stopEffect(fromPool);
    }

    audio = cc.loader.getRes(sound);
    if (cc.sys.isWebViewAudio || audio && (!audio.isLoaded || audio.isLoaded())) {
        audio = cc.audioEngine.playEffect(sound, options.loop);
        audio.startPlaying = Date.now();
        this.cache[sound] = audio;
        return audio;
    }
};

cleverapps.Audio.prototype.stopSound = function (audio) {
    cc.audioEngine.stopEffect(audio);
};

cleverapps.Audio.THROTTLE_AUDIO = 250;

cleverapps.Audio.prototype.logSound = function (sound, options) {
    if (cleverapps.config.debugMode && cleverapps.keyboardController.isPressed(cc.KEY.s)) {
        console.log("--------------------- sound logging ----------------------");
        console.log("sound file", sound);
        if (options) {
            console.log("sound options", options);
        }
        console.log("----------------------------------------------------------");
    }
};

cc.audioEngine.canChangeMusicVolume = function () {
    return cc.audioEngine._currMusic && cc.audioEngine._currMusic.setVolume;
};

cc.Audio.prototype.isLoaded = function () {
    return !!this._element;
};

cc.Audio.prototype.play = cleverapps.extendFunc(cc.Audio.prototype.play, function () {
    this._super.apply(this, arguments);

    if (cc.game.isPaused()) {
        cleverapps.throwAsync("Play audio error: game is paused - " + this.src);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.AUDIO_PLAY_PAUSED_GAME);
    }
});