/**
 * Created by slava on 24.03.17.
 */

var RestartWindow = Window.extend({
    ctor: function (options) {
        if (RestartWindow.showed || cleverapps.environment.isSceneWithPreview() || !cleverapps.scenes.getRunningScene()) {
            return;
        }
        RestartWindow.showed = true;

        this.options = options = options || {};

        if (cleverapps.versionChecker.isNewClientVersionAvailable()) {
            options.title = options.title || "RestartWindow.NewVersionTitle";
            options.contentMessage = options.contentMessage || "RestartWindow.NewVersionAvailable";
        }

        var message = (options && options.contentMessage) ? (Messages.get(options.contentMessage))
            : (Messages.get("RestartWindow.AnErrorOccured") || "An error occurred");
        this.text = cleverapps.UI.generateOnlyText(message, cleverapps.styles.FONTS.WINDOW_TEXT, false);
        this.text.setDimensions(cleverapps.styles.RestartWindow.width, cleverapps.styles.RestartWindow.height);
        this.text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        
        this._super();

        this.setLocalZOrder(1001);
    },

    onWindowLoaded: function () {
        var title = (this.options && this.options.title) ? (Messages.get(this.options.title))
            : (Messages.get("RestartWindow.Title") || "Try again");
        this._super({
            content: this.text,
            name: "RestartWindow",
            title: title,
            button: {
                text: (Messages.get("RestartWindow.ButtonMessage") || "Reload"),
                width: cleverapps.styles.RestartWindow.button.width,
                height: cleverapps.styles.RestartWindow.button.height,
                onPressed: function () {
                    if (cleverapps.platform.oneOf(Samsung)) {
                        GSInstant.restart();
                    } else {
                        window.location.reload();
                    }
                }
            },
            closeButton: false
        });

        if (this.window && this.window.height === 0) {
            this.text.removeFromParent();
            this.windowTitle.removeFromParent();
        }
    }
});

cleverapps.styles.RestartWindow = {
    width: 590,
    height: 460,
    button: {
    }
};

if (cleverapps.config.orientation === "horizontal") {
    cleverapps.increaseStylesByKoef(cleverapps.styles.RestartWindow, 1.4);
}