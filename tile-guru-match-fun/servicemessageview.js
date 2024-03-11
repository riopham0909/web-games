/**
 * Created by Andrey Popov on 25/2/20.
 */

var ServiceMessageView = cc.Node.extend({
    ctor: function (chatMessage) {
        this._super();

        this.chatMessage = chatMessage;

        this.setAnchorPoint2(0, 0.5);

        this.messageText = cleverapps.UI.generateOnlyText(chatMessage.message, cleverapps.styles.FONTS.SERVICE_MESSAGE_TEXT);
        this.messageText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.messageText);

        this.updateSize();
    },

    updateSize: function () {
        this.messageText.setDimensions(cleverapps.UI.getSceneSize().width - cleverapps.styles.ServiceMessageView.padding, 0);
        this.setContentSize2(cleverapps.UI.getSceneSize().width, this.messageText.height + cleverapps.styles.ServiceMessageView.padding);

        this.messageText.setPositionRound(this.width / 2, this.height / 2);
    }
});

cleverapps.styles.ServiceMessageView = {
    padding: 50
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    SERVICE_MESSAGE_TEXT: {
        size: 30,
        color: new cc.Color(83, 97, 106, 255),
        font: bundles.chat.urls.strict_font_ttf
    }
});