/**
 * Created by Andrey Popov on 12/2/20.
 */

var ChatView = cc.Node.extend({
    ctor: function (chat) {
        this.chat = chat;

        this.messageViews = {};

        this._super();
        this.setAnchorPoint2();

        var container = this.container = new cc.Node();
        container.setAnchorPoint2();

        this.scroll = new cleverapps.UI.ScrollView(container, {
            childrenVisibility: cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_FULLCHECK
        });
        this.scroll.setAnchorPoint2(0, 0);
        this.scroll.setPositionRound(0, 0);
        this.addChild(this.scroll);

        this.updateSize();

        this.chat.on("messagesUpdated", this.updateMessages.bind(this), this);
        this.chat.on("removeMessagesByType", this.removeMessagesByType.bind(this), this);
    },

    updateMessages: function () {
        this.chat.messages.forEach(function (message) {
            if (!this.messageViews[message.id]) {
                var messageView = MessageViewFactory.create(message);
                this.container.addChild(messageView);
                this.messageViews[message.id] = messageView;
            } else if (message.tag !== this.messageViews[message.id].chatMessage.tag) {
                this.messageViews[message.id].updateContent(message);
            } else if (message.type === ChatMessage.MESSAGE_TYPE.CATEGORIES) {
                this.messageViews[message.id].updateSize();
            }
        }.bind(this));

        var height = cleverapps.UI.arrangeWithMargins(this.container.getChildren(), {
            margin: cleverapps.styles.ChatView.margin,
            direction: cleverapps.UI.VERTICAL
        });

        if (height < this.scroll.height) {
            height = this.scroll.height;
        }

        this.container.setContentSize2(cleverapps.UI.getSceneSize().width, height);

        this.scroll.updateInnerContent();
        this.scroll.scrollToPercent(0);
    },

    removeMessagesByType: function (type) {
        Object.keys(this.messageViews).forEach(function (messageId) {
            if (this.messageViews[messageId] && this.messageViews[messageId].chatMessage
                && this.messageViews[messageId].chatMessage.type === type) {
                this.messageViews[messageId].removeFromParent();
                this.messageViews[messageId] = undefined;
            }
        }.bind(this));
        this.updateMessages();
    },

    updateSize: function () {
        var styles = cleverapps.styles.ChatView;

        var inputHeight = cleverapps.styles.ChatInput.height;
        var height = cleverapps.UI.getSceneSize().height - cleverapps.styles.ChatHeader.height - inputHeight - styles.extraHeight;
        this.scroll.setContentSize2(cleverapps.UI.getSceneSize().width, height);

        this.setContentSize2(this.scroll.getContentSize());
        this.setPositionRound(styles);

        this.chat.messages.forEach(function (message) {
            if (this.messageViews[message.id]) {
                this.messageViews[message.id].updateSize();
            }
        }.bind(this));

        this.updateMessages();
    }
});

cleverapps.styles.ChatView = {
    x: { align: "center" },
    y: { align: "top", dy: -128 },

    margin: 4,

    scrollBarPosition: {
        x: 4,
        y: 14
    },

    extraHeight: 8
};