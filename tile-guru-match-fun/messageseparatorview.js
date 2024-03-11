/**
 * Created by Andrey Popov on 25/2/20.
 */

var MessageSeparatorView = cc.Node.extend({
    ctor: function (chatMessage) {
        this._super();

        this.chatMessage = chatMessage;

        this.setAnchorPoint2(0, 0.5);

        this.line = cleverapps.UI.createScale9Sprite(bundles.chat.frames.dialogue_separator);
        this.addChild(this.line);

        this.updateSize();
    },

    updateSize: function () {
        var styles = cleverapps.styles.MessageSeparatorView;
        this.setContentSize2(cleverapps.UI.getSceneSize().width, styles.height);

        this.line.setContentSize(cleverapps.UI.getSceneSize().width - 2 * styles.line.padding, styles.line.height);
        this.line.setPositionRound(this.width / 2, this.height / 2);
    }
});

cleverapps.styles.MessageSeparatorView = {
    height: 50,
    line: {
        height: 3,
        padding: 40
    }
};