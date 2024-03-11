/**
 * Created by Andrey Popov on 12/2/20.
 */

var ChatInput = cc.Scale9Sprite.extend({
    ctor: function (chat) {
        this._super(bundles.chat.frames.paneldown);

        var styles = cleverapps.styles.ChatInput;

        this.chat = chat;

        this.inputHeight = styles.height;

        this.setAnchorPoint2(0, 0);

        var sendButton = this.sendButton = new cleverapps.UI.Button({
            noBg: true,
            text: "``",
            textOff: "~~",
            icons: {
                "``": bundles.chat.frames.panel_on,
                "~~": bundles.chat.frames.panel_off
            },
            onClicked: this.send.bind(this),
            width: styles.sendButton.width,
            height: this.inputHeight,
            fitTo: false
        });
        sendButton.disable();
        this.addChild(sendButton);

        this.charsCountText = cleverapps.UI.generateOnlyText("0/500", cleverapps.styles.FONTS.CHAT_CHARS_COUNT_TEXT);
        this.charsCountText.setVisible(false);
        this.charsCountText.setDimensions(styles.charsCount.width, 0);
        this.charsCountText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.charsCountText);

        var textAreaBg = this.textAreaBg = cleverapps.UI.createScale9Sprite(bundles.chat.frames.textbox);
        this.addChild(textAreaBg);

        var text = this.text = new cc.EditBox(cc.size(textAreaBg.width - styles.textPadding.x, textAreaBg.height - styles.textPadding.y));
        text.setDelegate(this);
        text.stayOnTop(true);
        text.setTouchEnabled();
        text.setMaxLength(500);
        text.setFontColor(cleverapps.styles.FONTS.CHAT_INPUT_FIELD_TEXT.color);
        this.textAreaBg.addChild(this.text);

        this.updateSize();

        this.chat.on("returnMessageBack", this.returnMessageBack.bind(this), this);
        this.chat.on("updatePlaceholder", this.updatePlaceholder.bind(this), this);
    },

    updateSize: function () {
        var styles = cleverapps.styles.ChatInput;

        this.setContentSize2(cleverapps.UI.getSceneSize().width, this.inputHeight + styles.padding);
        this.setPosition(0, 0);

        this.textAreaBg.setContentSize(this.width - styles.textArea.rightMargin, this.inputHeight);
        this.textAreaBg.setPositionRound(styles.textArea);

        this.sendButton.setContentSize(styles.sendButton.width, this.inputHeight);
        this.sendButton.setPositionRound(styles.sendButton);

        this.text.setContentSize(this.textAreaBg.width - styles.textPadding.x, this.textAreaBg.height - styles.textPadding.y);
        this.text.setPositionRound(this.textAreaBg.width / 2, this.textAreaBg.height / 2);

        this.charsCountText.setPositionRound(styles.charsCount);
    },

    send: function () {
        var messageToSend = this.getMessageText();
        if (messageToSend.length > 0) {
            this.text.setString("");
            this.sendButton.disable();
            this.charsCountText.setVisible(false);
            this.chat.postMessage(messageToSend);
        }
    },

    returnMessageBack: function (message) {
        this.text.setString(message);
        this.editBoxTextChanged(this.text, message);
    },

    updatePlaceholder: function (message) {
        this.placeholderText = message;
        if (this.getMessageText().length > 0 || !message) {
            return;
        }

        this.text.setString(message);
        this.text.setFont("Rubik", cleverapps.styles.FONTS.CHAT_INPUT_FIELD_TEXT.size);
        this.text.setFontColor(cleverapps.styles.FONTS.CHAT_INPUT_FIELD_TEXT.placeholderColor);
        this.placeholderShown = true;
    },

    editBoxTextChanged: function (sender, text) {
        if (this.getMessageText(text).length > 0) {
            this.sendButton.enable();
        } else {
            this.sendButton.disable();
        }
        this.text.setFont("Rubik", cleverapps.styles.FONTS.CHAT_INPUT_FIELD_TEXT.size);
        this.text.setFontColor(cleverapps.styles.FONTS.CHAT_INPUT_FIELD_TEXT.color);

        if (this.text.getString().length >= 400) {
            this.charsCountText.setVisible(true);
            this.charsCountText.setString(this.text.getString().length + "/500");
            this.charsCountText.setFont(this.text.getString().length >= 450 ? cleverapps.styles.FONTS.CHAT_CHARS_COUNT_RED_TEXT : cleverapps.styles.FONTS.CHAT_CHARS_COUNT_TEXT);
        } else {
            this.charsCountText.setVisible(false);
        }
    },

    editBoxReturn: function () {
        setTimeout(this.send.bind(this), 0);
    },

    getMessageText: function (text) {
        if (this.placeholderShown) {
            return "";
        }

        text = text || this.text.getString();
        return text.trim().replace(/(?:\r\n|\r|\n)/g, "")
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, "\uFFFD");
    },

    editBoxEditingDidBegin: function () {
        this.chat.editingMode = true;
        if (this.placeholderShown) {
            this.text.setString("");
            this.placeholderShown = false;
        }
    },

    editBoxEditingDidEnd: function () {
        this.chat.editingMode = false;
        if (this.placeholderText) {
            this.updatePlaceholder(this.placeholderText);
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CHAT_INPUT_FIELD_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.BLACK,
        placeholderColor: cleverapps.styles.COLORS.COLOR_DARK_GRAY,
        font: bundles.chat.urls.strict_font_ttf
    },

    CHAT_CHARS_COUNT_TEXT: {
        size: 22,
        color: cleverapps.styles.COLORS.COLOR_VERY_DARK_GRAY,
        font: bundles.chat.urls.strict_font_ttf
    },

    CHAT_CHARS_COUNT_RED_TEXT: {
        size: 22,
        color: new cc.Color(243, 60, 60, 255),
        font: bundles.chat.urls.strict_font_ttf
    }
});

cleverapps.styles.ChatInput = {
    height: 150,
    padding: 22,

    sendButton: {
        x: { align: "right", dx: -15 },
        y: { align: "center" },
        width: 150
    },

    charsCount: {
        x: { align: "right", dx: -40 },
        y: { align: "bottom", dy: 10 },
        width: 100
    },

    textArea: {
        rightMargin: 230,
        x: { align: "left", dx: 50 },
        y: { align: "center", dy: -6 }
    },

    textPadding: {
        x: 40,
        y: 12
    }
};