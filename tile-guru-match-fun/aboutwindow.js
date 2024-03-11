/**
 * Created by mac on 1/10/23
 */

var AboutWindow = Window.extend({
    onWindowLoaded: function () {
        var links = [
            {
                button: "AboutWindow.terms",
                url: Terms.TERMS_URL,
                text: typeof termsText !== "undefined" && termsText
            },
            {
                button: "AboutWindow.privacy",
                url: Terms.PRIVACY_URL,
                text: typeof privacyText !== "undefined" && privacyText
            }
        ];

        var buttons = links.map(function (link) {
            return new cleverapps.UI.Button({
                type: cleverapps.styles.UI.Button.Images.button_green,
                text: link.button,
                onClicked: function () {
                    if (cleverapps.platform.oneOf(Wechat)) {
                        new PrivacyWindow(link.button, link.text);
                    } else {
                        window.open(link.url, "_blank");
                    }
                },
                width: cleverapps.styles.AboutWindow.button.width
            });
        });

        var buttonsBlock = new cleverapps.Layout(buttons, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: cleverapps.styles.AboutWindow.button.margin
        });

        var text = cleverapps.UI.generateTTFText("AboutWindow.text", cleverapps.styles.FONTS.WINDOW_TEXT, {
            version: cleverapps.config.version,
            gameTitle: Messages.get(cleverapps.config.title)
        });
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var textBlock = cleverapps.UI.wrapWithPadding(text, cleverapps.styles.AboutWindow.text.padding);
        var content = new cleverapps.Layout([textBlock, buttonsBlock], {
            direction: cleverapps.UI.VERTICAL
        });

        this._super({
            title: "AboutWindow.title",
            name: "aboutwindow",
            content: content
        });
    }
});

cleverapps.styles.AboutWindow = {
    text: {
        padding: {
            left: 50,
            right: 50,
            top: 80,
            bottom: 80
        }
    },

    button: {
        width: 450,
        margin: 200
    }
};