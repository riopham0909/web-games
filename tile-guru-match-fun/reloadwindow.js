/**
 * Created by slava on 24.03.17.
 */

var ReloadWindow = Window.extend({
    onWindowLoaded: function (syncInCallback) {
        var styles = cleverapps.styles.ReloadWindow;

        var text1 = this.createText("ReloadWindow.YouHaveSavedGame");
        var text2 = this.createText("ReloadWindow.WeStoreGames", {
            gameTitle: Messages.get(cleverapps.config.title)
        });

        this.content = new cleverapps.Layout([text1, text2], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL
        });

        this.syncInCallback = syncInCallback || function () {};

        this._super({
            content: this.content,
            title: "ReloadWindow.Title",
            name: "reloadwindow",
            button: {
                width: styles.button.width,
                height: styles.button.height,
                text: "ReloadWindow.UpdateNow"
            },
            closeButton: false
        });
        cleverapps.windows.list = [this];
    },

    createText: function (msg, toReplace) {
        var styles = cleverapps.styles.ReloadWindow;

        var text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.WINDOW_TEXT, toReplace);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);

        return text;
    },

    onClose: function () {
        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }

        this.syncInCallback();
    }
});

cleverapps.styles.ReloadWindow = {
    margin: 20,

    button: {
        width: 400
    },

    text: {
        width: 600
    }
};

if (cleverapps.config.orientation === "horizontal") {
    cleverapps.styles.ReloadWindow.text.width *= 1.5;
}