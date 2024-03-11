/**
 * Created by slava on 24.03.17.
 */

var FinisherWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.FinisherWindow;

        this._super({
            title: "FinisherWindow.title",
            name: "finisherwindow",
            content: this.generateContent(),
            fireworks: true,
            button: {
                width: styles.button.width,
                height: styles.button.height,

                text: "FinisherWindow.Button.text",
                onPressed: function () {
                    cleverapps.platform.showOfficialPage();
                }
            },
            openSound: bundles.finisher_window.urls.finisher_effect
        });
    },

    generateStoreButton: function (source) {
        var image = {
            android: bundles.finisher_window.urls.android_png,
            ios: bundles.finisher_window.urls.ios_png,
            amazon: bundles.finisher_window.urls.amazon_png
        }[source];

        var url = cleverapps.platform.getGameUrl(source);

        if (!url || !image) {
            return undefined;
        }

        var sprite = new cc.Sprite(image);
        cleverapps.UI.applyHover(sprite);
        cleverapps.UI.onClick(sprite, function () {
            cc.sys.openURL(url);
        });

        return sprite;
    },

    generateContent: function () {
        var styles = cleverapps.styles.FinisherWindow;

        var items = [];

        items.push(this.createText("FinisherWindow.GroupText"));

        if (!cc.sys.isNative && !cleverapps.platform.oneOf(Instant) && !cleverapps.platform.oneOf(MobileOK, OKPlatform, MobileVk, VKPlatform, MyMailRu, MobileMyMailRu)) {
            var nativeAppButtons = ["android", "ios", "amazon"].map(this.generateStoreButton).filter(function (item) {
                return item !== undefined;
            });

            if (nativeAppButtons.length > 0) {
                items.push(this.createButtonsLayout(nativeAppButtons.slice(0, 2)));

                items.push(this.createText("FinisherWindow.StoreText"));
            }
            items.push(this.createText("FinisherWindow.AllPassedText"));
        } else {
            var button = this.generateStoreButton(cleverapps.platform.source);
            if (button) {
                items.push(button);
            }
            items.push(this.createText("FinisherWindow.AllAndStoreText"));
        }

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    createText: function (msg) {
        var styles = cleverapps.styles.FinisherWindow;

        var text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);

        return text;
    },

    createButtonsLayout: function (buttons) {
        var styles = cleverapps.styles.FinisherWindow;

        return new cleverapps.Layout(buttons, {
            padding: styles.button.padding,
            margin: styles.button.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
    },

    listBundles: function () {
        return ["finisher_window"];
    }
});

cleverapps.styles.FinisherWindow = {
    margin: 10,

    text: {
        width: 550
    },

    button: {
        padding: {
            x: 0,
            y: 10
        },

        margin: 30,

        width: 460,
        height: 100
    }
};
