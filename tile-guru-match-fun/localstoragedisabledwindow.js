/**
 * Created by iamso on 19.12.18.
 */

var LocalStorageDisabledWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.LocalStorageDisabledWindow;

        var content = new cc.Node();

        var addText = function(text) {
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setDimensions(cc.size(styles.width, 0));
            content.addChild(text);
        };

        addText(cleverapps.UI.generateTTFText("LocalStorageDisabledWindow.text2", cleverapps.styles.FONTS.WINDOW_TEXT));
        addText(cleverapps.UI.generateTTFText("LocalStorageDisabledWindow.text1", cleverapps.styles.FONTS.WINDOW_TEXT));

        cleverapps.UI.arrangeWithMargins(content.children, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            y: styles.paddingY
        });
        cleverapps.UI.wrap(content);
        content.setAnchorPoint2();
        content = cleverapps.UI.wrapWithPadding(content, styles.padding);

        this.content = content;

        this._super({
            content: content,
            title: "LocalStorageDisabledWindow.title",
            name: 'localstoragedisabledwindow',
            button: {
                text: "OK",
                width: styles.button.width
            },
            closeButton: false
        });
    }
});

cleverapps.styles.LocalStorageDisabledWindow = {
    width: 600,
    margin: 20,
    paddingY: 20,
    padding: {
        x: 0,
        y: 35
    },

    button: {
        width: 200
    }
};