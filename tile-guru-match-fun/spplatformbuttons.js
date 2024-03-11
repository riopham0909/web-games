var SpPlatformButtons = cleverapps.Layout.extend({
    ctor: function (buttonWidth, callback) {
        this.buttonWidth = Math.min(buttonWidth, cleverapps.styles.SpPlatformButtons.maxButtonWidth);
        this.callback = callback;

        this._super(this.createItems(), {
            direction: cleverapps.UI.VERTICAL,
            margin: cleverapps.styles.SpPlatformButtons.buttonsMargin
        });

        cleverapps.meta.setEventNodes([this]);
    },

    createItems: function () {
        if (SpPlatformButtons.EASY_REGISTRATION_UNAVAILABLE.indexOf(cleverapps.config.name) === -1) {
            return this.createNewFormItems();
        }

        return this.createOldFormItems();
    },

    createNewFormItems: function () {
        var items = [];
        if (cleverapps.social.clientData.platformLogin) {
            items.push(this.createOneButton("ゲームを始める", this.createLink("同意事項等（必読)")));
        } else {
            items.push(this.createOneButton("モバゲーIDで始める", this.createLink("同意事項等（必読)")));
            items.push(this.createOneButton("新規かんたん会員で始める", this.createLink("会員規約等（必読)", true), true));
        }
        return items;
    },

    createOldFormItems: function () {
        var items = [];

        if (cleverapps.social.clientData.platformLogin) {
            items.push(this.createOneButton("インストール"));
        } else {
            items.push(this.createOneButton("ログイン"));
        }

        var msg = "ゲームをスタートするには" + (cleverapps.social.clientData.platformLogin ? "ゲームをインストール" : "ログイン")
            + "してください。";
        var text = cleverapps.UI.__generateNotLocalizedText(msg, cleverapps.styles.FONTS.BLACK_LINK_TEXT);
        text.setDimensions(Math.min(cleverapps.styles.SpPlatformButtons.maxTextWidth, cleverapps.UI.getSceneSize().width * 0.7), 0);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        items.push(text);

        return items;
    },

    createOneButton: function (msg, link, registration) {
        var afterPlatformProcessing = function (err, result) {
            if (err) {
                console.log("Authorization failed:", err);
            } else {
                cleverapps.social.clientData.platformLogin = true;
                cleverapps.social.clientData.connected = true;
                cleverapps.social.clientData.code = result.response.code;

                cleverapps.social.checkAccessToken();
                this.callback();
            }
        }.bind(this);

        var content = cleverapps.UI.__generateNotLocalizedText(msg, cleverapps.styles.FONTS.BUTTON_TEXT);

        var platformButton = new cleverapps.UI.Button({
            content: content,
            width: this.buttonWidth,
            onClicked: function () {
                var params = {
                    state: cleverapps.social.clientData.state
                };

                if (registration) {
                    params.easyRegistration = true;
                    params.requestType = "window";
                }

                mobage.oauth.connect(params, afterPlatformProcessing);
            }
        });

        var items = [link, platformButton].filter(function (item) {
            return item;
        });
        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: cleverapps.styles.SpPlatformButtons.linkMargin
        });
    },

    createLink: function (txt, registration) {
        var link1 = cleverapps.UI.__generateNotLocalizedText(txt, cleverapps.styles.FONTS.BLUE_LINK_TEXT);
        var link2 = cleverapps.UI.__generateNotLocalizedText(" に同意して", cleverapps.styles.FONTS.BLACK_LINK_TEXT);

        var msg = new cleverapps.Layout([link1, link2], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: cleverapps.styles.SpPlatformButtons.textMargin
        });

        cleverapps.UI.applyHover(msg);
        cleverapps.UI.onClick(msg, function () {
            if (registration) {
                mobage.ui.show("client_agreement_menu", { "isEasyRegistration": true });
            } else {
                mobage.ui.show("client_agreement_menu");
            }
        });

        return msg;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BLUE_LINK_TEXT: {
        size: 40,
        color: new cc.Color(62, 158, 254)
    },

    BLACK_LINK_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.BLACK
    }
});

// apps registered before 2020/12/1 cannot use new form easy registration of hybrid flow v2
SpPlatformButtons.EASY_REGISTRATION_UNAVAILABLE = [
    "riddles", "heroes", "tripeaks", "crocword", "runes"
];

cleverapps.styles.SpPlatformButtons = {
    buttonsMargin: 50,
    linkMargin: 10,
    textMargin: 5,
    maxButtonWidth: 600,
    maxTextWidth: 600
};