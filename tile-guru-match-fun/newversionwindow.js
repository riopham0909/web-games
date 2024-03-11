/**
 * Created by andrey on 19.04.17.
 */

var NewVersionWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.NewVersionWindow;

        var text1 = cleverapps.UI.generateOnlyText("NewVersionWindow.text1", cleverapps.styles.FONTS.WINDOW_TEXT, {
            version: cleverapps.versionChecker.serverVersion,
            title: Messages.get(cleverapps.config.title)
        });
        text1.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text1.setDimensions(styles.text.width, 0);
        text1.setAnchorPoint2();

        var text2 = cleverapps.UI.generateOnlyText("NewVersionWindow.text2", cleverapps.styles.FONTS.WINDOW_TEXT);
        text2.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text2.setDimensions(styles.text.width, 0);
        text2.setAnchorPoint2();

        var content = new cleverapps.Layout([text1, text2], {
            direction: cleverapps.UI.VERTICAL,
            padding: styles.padding,
            margin: styles.margin
        });
        content.setAnchorPoint2();

        this._super({
            title: "NewVersionWindow.Title",
            name: "newversionwindow",
            content: content,
            button: {
                text: "OK",
                width: styles.button.width,
                height: styles.button.height,
                onPressed: function () {
                    cc.sys.openURL(cleverapps.platform.getGameUrl());
                }
            },
            closeButton: false
        });
    },

    close: function () {}
});

cleverapps.styles.NewVersionWindow = {
    text: {
        width: 550
    },
    button: {
        width: 220,
        height: 90
    },
    margin: 40
};

if (cleverapps.config.orientation === "horizontal") {
    cleverapps.increaseStylesByKoef(cleverapps.styles.NewVersionWindow, 1.4);
}