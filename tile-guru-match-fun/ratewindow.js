/**
 * Created by slava on 24.03.17.
 */

var RateWindow = Window.extend({
    onWindowLoaded: function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.RATE_WINDOW);

        var styles = cleverapps.styles.RateWindow;

        var content = this.createContent();

        this._super({
            content: content,
            title: "RateWindow.title",
            name: "ratewindow",
            styles: cleverapps.styles.RateWindow,
            button: {
                width: styles.button.width,
                height: styles.button.height,

                text: "RateUs",

                onPressed: function () {
                    this.openRateUrl();
                    this.close();
                }.bind(this)
            },
            contentPadding: styles.contentPadding
        });

        this.addPerson();
    },

    getPerson: function () {
        return "hero";
    },

    addPerson: function () {
        var stars = new cc.Sprite(bundles.rate_window.frames.stars_png);
        this.window.addChild(stars);
        stars.setPositionRound(cleverapps.styles.RateWindow.stars);
        stars.setLocalZOrder(20);
    },

    createContent: function () {
        var styles = cleverapps.styles.RateWindow;

        var content = new cc.Node();
        content.setAnchorPoint2();
        content.setContentSize(styles.width, styles.height);

        var text = cleverapps.UI.generateOnlyText("RateWindow.text", cleverapps.styles.FONTS.RATE_WINDOW_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT, {
            gameTitle: Messages.get(cleverapps.config.title)
        });
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);
        text.fitTo(undefined, styles.text.height);
        content.addChild(text);
        text.setPositionRound(styles.text);

        if (bundles.rate_window.frames.text_bg_png) {
            var bgRect = cc.rectAddPadding(cc.rect(0, 0, content.width, styles.text.height), cc.padding(styles.text.padding));

            var textBg = cleverapps.UI.createScale9Sprite(bundles.rate_window.frames.text_bg_png);
            textBg.setContentSize(bgRect.width, bgRect.height);
            content.addChild(textBg, -1);
            textBg.setPositionRound(text.x, text.y);
        }

        return content;
    },

    openRateUrl: function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.RATE_SEND);

        if (cleverapps.platform.canReview()) {
            cleverapps.platform.requestReview();

            return;
        }

        var rateUrl = cleverapps.platform.getRateUrl();
        if (rateUrl) {
            cc.sys.openURL(rateUrl);
        }
    },

    onClose: function () {
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.RATED, true, { raw: true });
    },

    listBundles: function () {
        return ["rate_window"];
    }
});

RateWindow.CanRate = function () {
    var rated = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.RATED, { raw: true });
    if (cleverapps.flags.norest || !levels.user.checkAvailable(RateWindow.AVAILABLE) || rated || cleverapps.config.wysiwygMode) {
        return false;
    }

    return cleverapps.platform.canReview() || cleverapps.platform.getRateUrl();
};

var RateWindowAction = function (f) {
    if (this.game.outcome === GameBase.OUTCOME_VICTORY && RateWindow.CanRate()) {
        new RateWindow();
        cleverapps.meta.onceNoWindowsListener = f;
    } else {
        f();
    }
};

cleverapps.styles.RateWindow = {
    width: 650,
    height: 300,

    stars: {
        x: { align: "center", dx: 0 },
        y: { align: "top", dy: 240 }
    },

    text: {
        width: 610,
        height: 200,

        x: { align: "center" },
        y: { align: "center" },

        padding: {
            x: 10,
            y: 20
        }
    },

    button: {
        width: 300,
        height: 100
    },

    contentPadding: {
        top: 100
    }
};

RateWindow.AVAILABLE = {
    level: 2.4
};

if (cleverapps.config.type === "merge") {
    RateWindow.AVAILABLE = {
        level: 6
    };
}
