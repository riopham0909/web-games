/**
 * Created by spepa on 25.05.2023
 */

var TestPlatform = function (options) {
    Platform.call(this, options, "test");
};

TestPlatform.prototype = Object.create(Platform.prototype);
TestPlatform.prototype.constructor = TestPlatform;

TestPlatform.prototype.getLocalStoragePreffix = function () {
    return "_test";
};

TestPlatform.prototype.getCurrentTournamentId = function (callback) {
    callback(1);
};

TestPlatform.prototype._reportScore = function (score, callback) {
    console.log("Report Score", score);
    callback();
};

TestPlatform.prototype._followOfficialPage = function () {
    var action = function () {
        new ToolConfirmWindow(function () {
            cc.sys.openURL(cleverapps.platform.getHelpUrl());
        }, "Follow official page");
    };

    if (cleverapps.meta.isFocused()) {
        action();
    } else if (!cleverapps.config.wysiwygMode) {
        cleverapps.meta.display({
            focus: "followOfficialPage",
            action: function (f) {
                action();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    }
};

TestPlatform.prototype.showOfficialPage = function () {
    this.followOfficialPage();
};

TestPlatform.prototype._showBannerAd = function (callback) {
    var prob = this.showBannerProb || 0.3;
    if (Math.random() > prob || cleverapps.config.wysiwygMode) {
        callback && callback("No Ad.");
        return;
    }

    this.hideBannerAd();

    var bannerSize = this.bannerSize || cc.size(Math.min(728, Math.round(cleverapps.resolution.getFrameSize().width * 0.95)), 90);

    var height = bannerSize.height;
    var width = bannerSize.width;

    // var testBanner = this.testBanner = document.createElement("div");
    // testBanner.id = "testBanner";
    // testBanner.style.display = "none";
    // testBanner.style.position = "absolute";
    // testBanner.style.zIndex = "2";
    // testBanner.style.bottom = "0";
    // testBanner.style.border = "solid 2px black";
    // testBanner.style.margin = "0 auto";
    // testBanner.style.height = height + "px";
    // testBanner.style.fontSize = height / 2 + "px";
    // testBanner.style.color = "red";
    // testBanner.style.width = width + "px";
    // testBanner.style.backgroundColor = "white";
    // testBanner.style.right = "0";
    // testBanner.style.left = "0";
    // testBanner.innerText = "BANNER";
    // var size = document.createElement("div");
    // size.style.fontSize = "18px";
    // size.style.color = "black";
    // size.innerText = "" + width + "x" + height;
    // testBanner.appendChild(size);
    // document.body.appendChild(testBanner);

    callback && callback(cleverapps.CODE_SUCCEED, bannerSize);
};

TestPlatform.prototype._hideBannerAd = function (callback) {
    var container = document.getElementById("testBanner");
    if (container) {
        container.remove();
    }

    callback && callback(cleverapps.CODE_SUCCEED);
};