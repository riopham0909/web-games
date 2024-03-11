/**
 * Created by Andrey Popov on 12/2/20.
 */

var ChatHeader = cc.Scale9Sprite.extend({
    ctor: function (chat) {
        this._super(bundles.chat.frames.panelup);

        this.setAnchorPoint2(0, 1);
        var styles = cleverapps.styles.ChatHeader;

        var titleText = cleverapps.UI.generateOnlyText(Messages.get("ChatTitle"), cleverapps.styles.FONTS.CHAT_HEADER_TEXT);

        chat.closing = false;

        var backButton = this.backButton = new cleverapps.UI.Button({
            noBg: true,
            content: new cc.Sprite(bundles.chat.frames.icon_back),
            onClicked: function () {
                chat.closing = true;
                // delay end editing adaptation to ensure virtual keyboard is disappeared
                setTimeout(function () {
                    cleverapps.scenes.getRunningScene().closeAction();
                }, cc.sys.isMobile && chat.editingMode ? 500 : 100);
            },
            width: styles.back.width,
            height: styles.back.height
        });

        titleText.setPosition(0, styles.text.offsetY);

        this.content = new cleverapps.Layout([backButton, titleText], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.back.margin
        });

        this.addChild(this.content);
        
        this.updateSize();
    },

    updateSize: function () {
        var styles = cleverapps.styles.ChatHeader;

        this.setContentSize2(cleverapps.UI.getSceneSize().width, styles.height);
        this.setPosition(0, cleverapps.UI.getSceneSize().height);

        this.content.setPositionRound(this.width / 2 + styles.content.offsetX, this.height / 2);
        cleverapps.UI.fitToBox(this.content, { width: 0.8 * cleverapps.UI.getSceneSize().width, height: styles.height });
        this.backButton.setScale(1 / this.content.scale);
    }
});

cleverapps.styles.ChatHeader = {
    height: 130,

    content: {
        offsetX: -50
    },

    text: {
        offsetY: -3
    },

    back: {
        width: 120,
        height: 120,

        margin: 25
    }
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CHAT_HEADER_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.BLACK
    }
});