/**
 * Created by Andrey Popov on 12/2/20.
 */

var ChatMessageView = cc.Node.extend({
    ctor: function (chatMessage) {
        this._super();

        this.chatMessage = chatMessage;

        this.setAnchorPoint2(0, 0.5);

        var messageTime = new Date(chatMessage.postDate).toLocaleTimeString(cleverapps.settings.language, { hour12: false, hour: "2-digit", minute: "2-digit" });
        var messageTimeText = this.messageTimeText = cleverapps.UI.generateOnlyText(messageTime, cleverapps.styles.FONTS.CHAT_MESSAGE_TIME_TEXT);
        messageTimeText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);

        var bg = this.bg = cleverapps.UI.createScale9Sprite(this.chatMessage.isResponse ? bundles.chat.frames.dialog_box_white : bundles.chat.frames.dialog_box_green);
        this.addChild(bg, -1);

        this.content = this.createContent(this.chatMessage);
        bg.addChild(this.content);
        bg.addChild(messageTimeText);

        if (!this.chatMessage.isResponse) {
            if (this.chatMessage.readByUser) {
                this.mark = new cc.Sprite(bundles.chat.frames.checkmark_read);
            } else if (this.chatMessage.type === ChatMessage.MESSAGE_TYPE.TEMPORARY) {
                this.mark = new cc.Sprite(bundles.chat.frames.checkmark_tmp);
            } else {
                this.mark = new cc.Sprite(bundles.chat.frames.checkmark_sent);
            }

            bg.addChild(this.mark);
        }

        this.updateSize();
    },

    createContent: function (message) {
        if (message.hasGift()) {
            return new GiftContentView(message);
        } 
        if (this.chatMessage.isFromActiveOrUnreadDialogue()) {
            this.messageText = cleverapps.UI.generateOnlyText(message.message, cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
            this.bg.setColor(new cc.Color(255, 255, 255, 255));
            this.bg.setOpacity(255);
        } else {
            this.messageText = cleverapps.UI.generateOnlyText(message.message, cleverapps.styles.FONTS.CHAT_DISABLED_MESSAGE_TEXT);
            this.bg.setColor(new cc.Color(200, 200, 200, 255));
            this.bg.setOpacity(150);
        }

        this.messageText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        return this.messageText;
    },

    updateContent: function (message) {
        if (this.content) {
            this.content.removeFromParent();
        }

        this.content = this.createContent(message);
        this.bg.addChild(this.content);

        this.updateSize();
    },

    updateSize: function () {
        var styles = cleverapps.styles.ChatMessageView;

        var messageWidth = 0.7 * cleverapps.UI.getSceneSize().width;
        if (messageWidth > styles.maxWidth) {
            messageWidth = styles.maxWidth;
        } else if (messageWidth < styles.minWidth) {
            messageWidth = styles.minWidth;
        }

        if (this.messageText) {
            this.messageText.setDimensions(messageWidth, 0);
            this.setContentSize2(cleverapps.UI.getSceneSize().width, this.messageText.height + 2 * styles.text.padding);
        } else {
            this.setContentSize2(cleverapps.UI.getSceneSize().width, this.content.height + 2 * styles.text.padding);
        }

        this.bg.setContentSize(messageWidth + 2 * styles.text.padding, this.height);

        if (this.chatMessage.isResponse) {
            this.bg.setAnchorPoint2(0, 0.5);
            this.bg.setPosition(cleverapps.config.orientation !== "horizontal" ? styles.responseBg.verticalOffsetX : styles.responseBg.offsetX, this.height / 2);
        } else {
            this.bg.setPositionRound(styles.questionBg);
        }

        this.content.setPositionRound(this.bg.width / 2 + (this.chatMessage.isResponse ? styles.text.responceOffsetX : 0), this.bg.height / 2 + styles.text.offsetY);

        this.messageTimeText.setDimensions(styles.time.width, styles.time.height);
        this.messageTimeText.setPositionRound(this.chatMessage.isResponse ? styles.time.response : styles.time.question);

        if (this.mark) {
            this.mark.setPositionRound(styles.mark);
        }
    }
});

cleverapps.styles.ChatMessageView = {
    minWidth: 500,
    maxWidth: 900,

    text: {
        padding: 30,
        responceOffsetX: 5,
        offsetY: 2
    },

    time: {
        width: 200,
        height: 26,
        response: {
            x: { align: "right", dx: -34 },
            y: { align: "bottom", dy: 16 }
        },
        question: {
            x: { align: "right", dx: -56 },
            y: { align: "bottom", dy: 16 }
        }
    },

    mark: {
        x: { align: "right", dx: -22 },
        y: { align: "bottom", dy: 18 }
    },

    responseBg: {
        offsetX: 32,
        verticalOffsetX: 4
    },

    questionBg: {
        x: { align: "right", dx: -30 },
        y: { align: "center" }
    }
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CHAT_MESSAGE_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.BLACK,
        font: bundles.chat.urls.strict_font_ttf
    },

    CHAT_DISABLED_MESSAGE_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_DARK_GRAY,
        font: bundles.chat.urls.strict_font_ttf
    },

    CHAT_MESSAGE_TIME_TEXT: {
        size: 26,
        color: new cc.Color(138, 138, 138, 255),
        font: bundles.chat.urls.strict_font_ttf
    }
});