/**
 * Created by slava on 24.03.17.
 */

var FbConnectWindow = Window.extend({
    onWindowLoaded: function (options) {
        options = options || {};

        var styles = cleverapps.styles.FbConnectWindow;

        this.restoreProgress = options.restoreProgress;

        var items = [];

        var font = cleverapps.styles.FONTS.FBCONNECT_WINDOW_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT;

        var text = "FbConnectWindow.text";
        if (cleverapps.platform.oneOf(CleverApps, Kongregate)) {
            text = "XsollaLogin.text";
        }
        if (this.restoreProgress) {
            text = "RestoreProgress.text";
        }
        items.push(this.createText(text, font));

        if (options.errorMessage) {
            items.push(this.createText(options.errorMessage, cleverapps.styles.FONTS.SMALL_TEXT_ERROR));
        }

        items.push(this.createButtons());

        var content = new cleverapps.Layout(items, {
            margin: styles.margin,
            padding: styles.padding,
            direction: cleverapps.UI.VERTICAL
        });

        this._super({
            title: this.restoreProgress ? "RestoreProgress" : "SignIn",
            closeButton: true,
            name: "fbconnectwindow",
            content: content
        });

        this.closeCallback = cleverapps.once(options.onClose);
        this.success = cleverapps.once(options.onSuccess);
        this.failureLogin = options.onFailure;

        this.waitingSync = false;
    },

    createText: function (msg, font) {
        var styles = cleverapps.styles.FbConnectWindow;

        var text = cleverapps.UI.generateOnlyText(msg, font);
        text.setDimensions(styles.text.width, 0);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        return text;
    },

    onClose: function () {
        if (this.failureLogin) {
            this.failureLogin();
        }

        if (this.closeCallback) {
            this.closeCallback();
        }
    },

    waitSync: function () {
        this.waitingSync = true;

        var waitWindow = new WaitWindow();

        new ActionPlayer([
            function (f) {
                f = cleverapps.wait(2, f);
                cleverapps.synchronizer._onceNextSyncCompletedListener = cleverapps.waitNoMore(15000, f);
                setTimeout(f, 3000);
            },

            function (f) {
                if (!cleverapps.synchronizer._syncIn.needShowReloadWindow() && cleverapps.platform.oldUserId && cleverapps.synchronizer.isReady()) {
                    f = cleverapps.waitNoMore(15000, f);
                    cleverapps.synchronizer.getProgress(cleverapps.platform.oldUserId, {
                        acceptOnlyIfBetter: true,
                        progressLoadOnly: true,
                        callback: function () {
                            cleverapps.platform.oldUserId = undefined;
                            f();
                        }
                    });
                } else {
                    f();
                }
            },

            function (f) {
                waitWindow.close();
                this.waitingSync = false;

                if (!this.closed) {
                    this.close();
                }
                this.success();

                if (cleverapps.synchronizer._syncIn.needShowReloadWindow()) {
                    if (cleverapps.meta.isFocused() && !cleverapps.synchronizer._syncIn.isReloadInProcess()) {
                        cleverapps.synchronizer._syncIn.distractToReloadWindow();
                    }
                } else if (this.restoreProgress) {
                    cleverapps.notification.create("RestoreProgress.progressNotFound");
                }

                f();
            }.bind(this)
        ]).play();
    },

    close: function () {
        if (this.waitingSync) {
            return;
        }

        this._super();
    },

    onButtonClick: function () {
        if (this.closed) {
            return;
        }

        this.failureLogin = false;
        this.waitSync();
    },

    createButtons: function () {
        var sources = cleverapps.social.getCodes();

        var styles = cleverapps.styles.FbConnectWindow;

        var buttons = sources.map(function (source) {
            return new LoginButton({
                multiSocials: sources.length > 1,
                height: styles.button.height,
                width: styles.button.width,
                source: source,
                onSuccess: this.onButtonClick.bind(this)
            });
        }, this);

        return new cleverapps.Layout(buttons, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.button.margin
        });
    },

    listBundles: function () {
        return ["social_buttons"];
    }
});

cleverapps.styles.FbConnectWindow = {
    margin: 30,
    padding: {
        bottom: 25
    },

    button: {
        height: 110,
        width: 500,
        margin: 20
    },

    text: {
        width: 800,
        height: 400
    }
};
