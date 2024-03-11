/**
 * Created by razial on 13.10.2022
 */

var DeleteAccountWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.DeleteAccountWindow;

        this._super({
            name: "DeleteAccountWindow",
            title: "DeleteAccountWindow.title",
            content: this.createContent(),
            styles: styles.window
        });
    },

    getPerson: function () {
        return cleverapps.styles.DeleteAccountWindow.person;
    },

    createContent: function () {
        var styles = cleverapps.styles.DeleteAccountWindow;

        var info = this.createInfo();
        var buttons = this.createButtons();

        return new cleverapps.Layout([info, buttons], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    createInfo: function () {
        var styles = cleverapps.styles.DeleteAccountWindow.info;

        var days = Math.floor(cleverapps.userDelete.getFullTime() / 24 / 60 / 60 / 1000);

        var messages = [
            Messages.get("DeleteAccountWindow.text1", {
                newline: "\n"
            }),
            Messages.get("DeleteAccountWindow.text2", {
                days: days
            }),
            Messages.get("DeleteAccountWindow.text3", {
                days: days
            })
        ];

        var texts = messages.map(function (message) {
            var text = cleverapps.UI.generateOnlyText(message, cleverapps.styles.FONTS.DELETE_ACCOUNT_TEXT);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setWrapWidth(styles.text.size[cleverapps.resolution.mode].width);
            return text;
        });

        var info = new cleverapps.Layout(texts, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
        info.setPositionRound(info.width / 2, info.height / 2);

        var background = cleverapps.UI.createScale9Sprite(bundles.windows.frames.windows_details_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        background.setContentSize(info.width, info.height);
        background.addChild(info);

        return background;
    },

    createButtons: function () {
        var styles = cleverapps.styles.DeleteAccountWindow.buttons;

        var deleteButton = new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_red,
            text: "Continue",
            onClicked: function () {
                new DeleteAccountConfirmationWindow();
                this.close();
            }.bind(this),
            width: styles.width,
            height: styles.height
        });

        var cancelButton = new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_green,
            text: "Cancel",
            onClicked: this.close.bind(this),
            width: styles.width,
            height: styles.height
        });

        return new cleverapps.Layout([deleteButton, cancelButton], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    DELETE_ACCOUNT_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.DeleteAccountWindow = {
    margin: 20,

    info: {
        margin: 10,
        padding: {
            x: 40,
            y: 40
        },
        text: {
            size: [
                { width: 1000 },
                { width: 1300 },
                { width: 1300 }
            ]
        }
    },

    buttons: {
        width: 340,
        height: 110,
        margin: 240
    }
};
