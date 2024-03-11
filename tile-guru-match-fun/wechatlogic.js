/**
 * Created by vladislav on 1/17/2024
 */

var WechatLogic = function () {
    PlatformLogic.call(this);
};

WechatLogic.prototype = Object.create(PlatformLogic.prototype);
WechatLogic.prototype.constructor = WechatLogic;

WechatLogic.prototype.onInitialize = function () {
    cleverapps.config.sendLoadingTime = cleverapps.config.debugMode;

    cc.sys.isDevTools = wx.getSystemInfoSync().platform === "devtools";

    if (cc.sys.isDevTools) {
        cc.assetManager.downloader.register(".png", cc.assetManager.downloader.downloadDomImage);
        cc.assetManager.downloader.register(".jpg", cc.assetManager.downloader.downloadDomImage);
        cc.assetManager.parser.register(".png", cc.assetManager.parser.parseImage);
        cc.assetManager.parser.register(".jpg", cc.assetManager.parser.parseImage);
    }

    cc.assetManager.cacheManager.cachedFiles.forEach(function (file, key) {
        if (!key.includes(cleverapps.config.version)) {
            cc.assetManager.cacheManager.removeCache(key);
        }
    });
};

WechatLogic.prototype.onStart = function () {
    cleverapps.resolution.setSafePadding(cleverapps.styles.Wechat.padding[cleverapps.platform.getOrientation()]);
};

cleverapps.styles.Wechat = {
    padding: {
        landscape: {
            right: 260
        },
        portrait: {
            top: 120
        }
    }
};