/**
 * Created by denis on 26/12/19
 */

cleverapps.Flags = function () {
    cleverapps.EventEmitter.call(this);

    this.init();

    cleverapps.whenAllInitialized(function () {
        cleverapps.paymentsHistory.onAddPaymentListeners.flags = this.update.bind(this);
    }.bind(this));
};

cleverapps.Flags.prototype = Object.create(cleverapps.EventEmitter.prototype);
cleverapps.Flags.prototype.constructor = cleverapps.Flags;

cleverapps.Flags.prototype.init = function () {
    this.norest = cleverapps.platform.oneOf(Huzcom, Pliega, Playable) || cleverapps.config.norest;
    this.noLogEvents = cleverapps.platform.oneOf(Huzcom, Pliega, Rustore, Playable);
    this.noinvites = cleverapps.platform.oneOf(Huzcom, GDCom, Plinga, Pliega, Rustore, IOSCh, CleverApps, Playable, Yandex, Microsoft, MacOS, Mygames, MSStart, PWA, Ton, Wechat, Crazy, Samsung, Xiaomi);
    this.norequest = this.noinvites || cleverapps.platform.oneOf(AndroidPlatform, IOS, FacebookCanvas, Instant, MSStart, PWA, Wechat);
    this.noshares = cleverapps.platform.oneOf(AndroidPlatform, Amazon, IOS, Pliega, Plinga, Rustore, SPMobage, IOSCh, Playable, Yandex, Microsoft, MacOS, Draugiem, CleverApps, PWA, Ton, Wechat, Crazy);
    this.nocommunity = cleverapps.platform.oneOf(Huzcom, GDCom, Plinga, Pliega, Rustore, Playable, Yandex, Microsoft, MSStart, PWA, Wechat, Crazy);
    this.videoAdsMainMonetization = cleverapps.platform.oneOf(GDCom, IOSCh, Xiaomi);
    this.nofirebase = cleverapps.platform.oneOf(Pliega, Rustore, IOSCh, Playable, Microsoft, Mygames, MSStart, PWA);
    this.nofacebookevents = cleverapps.platform.oneOf(Pliega, Rustore, IOSCh, Playable, Microsoft, MacOS, Mygames, MSStart, PWA, Wechat, Crazy);
    this.nologin = cleverapps.social instanceof cleverapps.NoSocial || cleverapps.config.nologin;
    this.softCurrencyRealProduct = cleverapps.platform.oneOf(Mobage, SPMobage);

    this.highMonetization = ["merge"].includes(cleverapps.config.type);
};

cleverapps.Flags.prototype.toggle = function (flag) {
    this.set(flag, !this[flag]);
};

cleverapps.Flags.prototype.get = function (flag) {
    return this[flag];
};

cleverapps.Flags.prototype.set = function (flag, value) {
    if (!!this[flag] === !!value) {
        return;
    }

    this[flag] = value;

    this.trigger("change:" + flag, value);
};

cleverapps.Flags.prototype.reset = function () {
    this.init();
    this.update();
};

cleverapps.Flags.prototype.update = function () {
    this.highMonetization = ["merge"].includes(cleverapps.config.type) || cleverapps.ABTest.HIGH_MONETIZATION();

    var nopayments = !cleverapps.payments.isAvailable() || Object.keys(Products.ACTIVE).length === 0;
    if (nopayments) {
        this.highMonetization = false;
    }

    this.set("videoAdsMainMonetization", nopayments);

    var keepAnnoying = cleverapps.paymentsHistory.classify() === cleverapps.PaymentsHistory.BRACKET_NONE;

    if (!keepAnnoying) {
        this.norequest = true;
        levels.friendRequests.deleteFakeRequests();
    }

    this.norest = this.norest || cleverapps.user.cheater;

    AdsLimits.initialize();
};
