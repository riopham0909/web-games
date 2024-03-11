/**
 * Created by razial on 17.10.2022
 */

var DeleteAccountInformationWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.DeleteAccountWindow;

        this._super({
            name: "DeleteAccountInformationWindow",
            title: "DeleteAccountInformationWindow.title",
            content: this.createContent(),
            styles: styles.window,
            closeButton: false
        });
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

        var daysLeft = Math.floor((cleverapps.userDelete.getTimeLeft() - 1000) / 24 / 60 / 60 / 1000) + 1;

        var messages = [
            Messages.get("DeleteAccountInformationWindow.time", {
                days: daysLeft
            }),
            Messages.get("DeleteAccountInformationWindow.text1", {
                newline: "\n"
            }),
            Messages.get("DeleteAccountInformationWindow.text2", {
                newline: "\n"
            })
        ];

        if (cleverapps.platform.oneOf(IOS, MacOS, IOSCh)) {
            messages.push(Messages.get("DeleteAccountInformationWindow.revoke.apple", {
                newline: "\n"
            }));
        }

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

        var cancelButton = new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_green,
            text: "Cancel",
            onClicked: function () {
                this.close();
                cleverapps.userDelete.cancelDeletion();
            }.bind(this),
            width: styles.width,
            height: styles.height
        });

        if (SettingsWindow.IsExitButtonAvailable()) {
            var exitButton = new cleverapps.UI.Button({
                type: cleverapps.styles.UI.Button.Images.button_red,
                text: "Exit",
                onClicked: cleverapps.platform.closeApplication,
                width: styles.width,
                height: styles.height
            });
        }

        return new cleverapps.Layout([cancelButton, exitButton].filter(Boolean), {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
    }
});
