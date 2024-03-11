/**
 * Created by mac on 4/8/18
 */

var VideoAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });
};

VideoAds.prototype = Object.create(AdsPlugin.prototype);
VideoAds.prototype.constructor = VideoAds;

VideoAds.isAppropriate = function () {
    return cleverapps.platform instanceof TestPlatform;
};

VideoAds.prototype._connect = function (callback) {
    setTimeout(function () {
        if (cleverapps.rewardedAdsManager.isEnabled()) {
            callback(Platform.STATUS_CONNECTED);
        } else {
            callback(Platform.STATUS_DISABLED);
        }
    }, cleverapps.silentIntro ? 0 : 2000);
};

VideoAds.prototype._cache = function (name, callback) {
    setTimeout(function () {
        callback(AdsPlugin.CODE_SUCCEED, true);
    }, 5000);
};

VideoAds.prototype._playAd = function (name, ad, callback) {
    var overlay = new cc.Scale9Sprite(bundles.pixel.frames.pixel_png);
    overlay.setAnchorPoint(0, 0);
    overlay.setContentSize2(cleverapps.UI.getBgSize());
    overlay.setColor(new cc.Color(200, 200, 255, 255));
    overlay.setLocalZOrder(TransitionAnimation.ZORDER + 1);
    var parent = cleverapps.scenes.getRunningScene();
    overlay.setPositionRound(0, -parent.y);
    var oldEventNodes = cleverapps.meta.eventNodes;
    cleverapps.meta.setEventNodes([overlay]);

    parent.addChild(overlay);

    var waitForReward = setTimeout(function () {
        stop(name === RewardedAdsManager.REWARDED);
    }, 3000);

    var stop = cleverapps.once(function (success) {
        cleverapps.meta.setEventNodes(oldEventNodes);

        if (success) {
            callback(AdsPlugin.CODE_REWARD);
        } else {
            callback();
        }

        clearTimeout(waitForReward);
        overlay.removeFromParent(true);
    });

    var settings = {
        width: 300 * resolutionScale,
        height: 100 * resolutionScale,
        onClicked: function () {
            stop();
        },
        text: "SkipButton"
    };

    var button = new cleverapps.UI.Button(settings);
    button.setPositionRound(overlay.width / 2, 200);
    button.disable();

    button.runAction(new cc.Sequence(
        new cc.DelayTime(1),
        new cc.CallFunc(function () {
            button.enable();
        })
    ));

    overlay.addChild(button);
};

VideoAds.prototype.getECPM = function () {
    return 1;
};