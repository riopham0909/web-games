/**
 * Created by decipaliz on 01.07.2023
 */

var FakeLoginWindow = Window.extend({
    onWindowLoaded: function (onLogin) {
        var styles = cleverapps.styles.FakeLoginWindow;

        this.userId = undefined;
        this.onLoginListener = cleverapps.once(onLogin);

        this._super({
            content: this.createContent(),
            name: "FakeLoginWindow",
            title: "FakeLoginWindow.title",
            styles: styles,
            button: {
                text: "FakeLoginWindow.Login",
                width: styles.loginButton.width,
                height: styles.loginButton.height,
                onPressed: function () {
                    this.userId = this.textBox.getString();
                    this.close();
                }.bind(this)
            }
        });
    },

    createContent: function () {
        var styles = cleverapps.styles.FakeLoginWindow;

        var textBox = this.textBox = new cc.EditBox(cc.size(styles.textBox.width, styles.textBox.height), new cc.Scale9Sprite(bundles.windows.frames.editbox_bg_png), true);
        textBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        textBox.setMaxLength(30);
        textBox.stayOnTop(true);
        textBox.setTouchEnabled();
        textBox.setFontColor(cleverapps.styles.COLORS.WHITE);
        textBox.setFont(cleverapps.UI.getFontName(), cleverapps.styles.FONTS.WINDOW_TEXT.size);

        var customIdText = cleverapps.UI.generateOnlyText("FakeLoginWindow.CustomID", cleverapps.styles.FONTS.WINDOW_TEXT);

        var chooseUserText = cleverapps.UI.generateOnlyText("FakeLoginWindow.ChooseUser", cleverapps.styles.FONTS.WINDOW_TEXT);

        var buttons = cleverapps.values(TestSocial.USERS).map(function (user) {
            var type = cleverapps.platform.getUserID() === user.id ? cleverapps.styles.UI.Button.Images.button_green : cleverapps.styles.UI.Button.Images.button_blue;
            return new cleverapps.UI.Button({
                type: type,
                text: user.name,
                width: styles.buttons.width,
                height: styles.buttons.height,
                onClicked: function () {
                    this.userId = user.id;
                    this.close();
                }.bind(this)
            });
        }.bind(this));

        var adsInfo = cleverapps.values(TestSocial.USERS).map(function (user) {
            var bg = new cc.Scale9Sprite(bundles.windows.frames.ads_bg);
            bg.setContentSize2(styles.buttons.width, styles.buttons.height);
            var infoIcon = new cc.Sprite(bundles.windows.frames["ads_" + user.name.toLowerCase()]);
            infoIcon.setPositionRound({
                x: { align: "left", dx: styles.adsInfo.padding },
                y: { align: "center" }
            });
            infoIcon.setScale(0.7);
            var texts = {
                alpha: "Rewarded ads enabled",
                beta: "Rewarded and interstitial",
                gamma: "No ads"
            };
            var infoText = cleverapps.UI.generateOnlyText(texts[user.name.toLowerCase()], cleverapps.styles.FONTS.SMALL_TEXT);
            infoText.setDimensions(styles.buttons.width - styles.adsInfo.offset - styles.adsInfo.padding, 0);
            infoText.fitTo(undefined, styles.buttons.height);
            infoText.setPositionRound({
                x: { align: "left", dx: styles.adsInfo.offset + styles.adsInfo.padding },
                y: { align: "center" }
            });
            bg.addChild(infoIcon);
            bg.addChild(infoText);
            return bg;
        });

        var currentUserIdText = cleverapps.UI.generateOnlyText("FakeLoginWindow.CurrentUserID", cleverapps.styles.FONTS.WINDOW_TEXT, { id: cleverapps.platform.getUserID() });
        cleverapps.UI.onClick(currentUserIdText, function () {
            cleverapps.copyToClipboard(cleverapps.platform.getUserID());
        });

        var buttonsLayout = new cleverapps.Layout(buttons, { direction: cleverapps.UI.HORIZONTAL, margin: styles.buttons.margin });
        var adsInfoLayout = new cleverapps.Layout(adsInfo, { direction: cleverapps.UI.HORIZONTAL, margin: styles.buttons.margin });

        return new cleverapps.Layout([currentUserIdText, chooseUserText, buttonsLayout, adsInfoLayout, customIdText, textBox], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.layout.margin
        });
    },

    onClose: function () {
        this.onLoginListener(this.userId);
    }
});

cleverapps.styles.FakeLoginWindow = {
    padding: {
        x: 85,
        top: 100,
        bottom: 100
    },

    adsInfo: {
        offset: 70,
        padding: 10
    },

    buttons: {
        width: 260,
        height: 100,
        margin: 50
    },

    layout: {
        margin: 50
    },

    loginButton: {
        width: 280,
        height: 110
    },

    textBox: {
        width: 780,
        height: 80
    }
};