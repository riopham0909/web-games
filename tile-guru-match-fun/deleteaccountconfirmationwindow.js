/**
 * Created by razial on 17.10.2022
 */

var DeleteAccountConfirmationWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.DeleteAccountWindow;

        this._super({
            name: "DeleteAccountConfirmationWindow",
            title: "DeleteAccountConfirmationWindow.title",
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
            Messages.get("DeleteAccountConfirmationWindow.text1"),
            Messages.get("DeleteAccountConfirmationWindow.text2", {
                days: days
            }),
            Messages.get("DeleteAccountConfirmationWindow.text3", {
                days: days,
                newline: "\n"
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
            text: "Delete",
            onClicked: function () {
                cleverapps.userDelete.startDeletion();
            },
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
