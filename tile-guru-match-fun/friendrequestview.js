/**
 * Created by slava on 02.02.17.
 */

levels.FriendRequestView = cc.Node.extend({
    ctor: function (model, requestsView, onRemove) {
        this._super();
        this.setContentSize(cleverapps.styles.FriendRequestView.width, cleverapps.styles.FriendRequestView.height);
        this.setAnchorPoint2();

        this.model = model;
        this.onRemove = onRemove;

        this.createBackground();
        this.createFromContent();
        this.createRequestContent();
        this.createRequestImage();
        this.createCancelContent();
        this.createProcessContent();

        cleverapps.UI.onClick(this, function () {
            this.process();
        }.bind(this));
    },

    onEnter: function () {
        this._super();

        this.model.onRemoveListener = this.createListener(this.removeAnimation.bind(this));
        this.model.animateCollect = this.createListener(this.animateCollect.bind(this));
    },

    animateCollect: function (target, callback) {
        callback = callback || function () {};

        if (!this.image) {
            callback();
            return;
        }

        this.image.runAction(new cc.Sequence(
            cleverapps.UI.animateCollect(this.image, target, {
                scale: 0.8,
                collectEffect: true
            }),
            new cc.CallFunc(callback),
            new cc.RemoveSelf()
        ));
    },

    createFromContent: function () {
        var data = levels.FriendRequest.REQUEST_TYPES[this.model.type];
        var avatar;
        var fbUserId = undefined;
        if (cleverapps.social instanceof cleverapps.BaseFB) {
            fbUserId = this.model.from;
        }
        if (data.avatar) {
            avatar = new cleverapps.UI.Avatar(cc.spriteFrameCache.getSpriteFrame(data.avatar), fbUserId);
        } else {
            var friend = cleverapps.friends.getById(this.model.from);
            if (friend) {
                avatar = new cleverapps.UI.Avatar(friend);
            } else {
                avatar = new cleverapps.UI.Avatar("https://scontent.xx.fbcdn.net/v/", fbUserId);
            }
        }

        var styles = cleverapps.styles.FriendRequestView.Avatar;
        avatar.setPositionRound(avatar.width / 2 + styles.Margin.x, this.height / 2 + styles.Margin.y);
        avatar.setAnchorPoint2();
        this.addChild(avatar);
    },

    createBackground: function () {
        var bg = cleverapps.UI.createScale9Sprite(bundles.request_center.frames.friend_message_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        bg.setContentSize2(this.width, this.height);
        bg.setPosition(this.width / 2, this.height / 2);
        this.addChild(bg);
    },

    getRequestText: function () {
        var data = levels.FriendRequest.REQUEST_TYPES[this.model.type];
        return Messages.get(data.text);
    },

    createRequestContent: function () {
        var text = this.getRequestText();
        if (text) {
            var style = cleverapps.styles.FriendRequestView.Request;
            text = cleverapps.UI.generateTTFText(text, cleverapps.styles.FONTS.FRIEND_REQUEST_TEXT || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
            text.setPositionRound(this.width / 2 + style.x, this.height / 2 + style.y);
            text.setDimensions(style.width, 0);
            text.fitTo(undefined, style.height);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.addChild(text);
        }
    },

    getRequestImage: function () {
        var data = levels.FriendRequest.REQUEST_TYPES[this.model.type];
        if (data.image) {
            var image = new cc.Sprite(data.image);
            if (data.imageText) {
                var text = cleverapps.UI.generateImageText(data.imageText, cleverapps.styles.FONTS.FRIEND_REQUEST_ITEM_TEXT);
                text.setPositionRound(image.width / 2, image.height / 2);
                image.addChild(text);
            }
            return image;
        }
        return false;
    },

    createRequestImage: function () {
        var image = this.getRequestImage();
        if (image) {
            image.setPosition(cleverapps.styles.FriendRequestView.Icon.x, this.height / 2 + cleverapps.styles.FriendRequestView.Icon.y);
            this.addChild(image);
            this.image = image;
        }
    },

    createProcessContent: function () {
        var data = levels.FriendRequest.REQUEST_TYPES[this.model.type];
        var styles = cleverapps.styles.FriendRequestView.processButton;

        var processButton = new cleverapps.UI.Button({
            type: data.button_type,
            text: data.button_text,
            onClicked: this.process.bind(this),
            width: styles.width,
            height: styles.height
        });

        if (!data.image) {
            processButton.setPositionRound(
                this.width - processButton.width / 2 - cleverapps.styles.FriendRequestView.processButton.noImage.x,
                this.height / 2 + cleverapps.styles.FriendRequestView.processButton.noImage.y
            );
        } else {
            processButton.setPositionRound(
                this.width - processButton.width / 2 - cleverapps.styles.FriendRequestView.processButton.x,
                this.height / 2 + cleverapps.styles.FriendRequestView.processButton.y
            );
        }
        this.addChild(processButton);
    },

    createCancelContent: function () {
        var styles = cleverapps.styles.FriendRequestView.close;

        var closeButton = new cleverapps.UI.Button({
            type: {
                button_png: bundles.buttons_main.frames.close_small,
                button_on_png: bundles.buttons_main.frames.close_small_on
            },
            onClicked: this.cancel.bind(this)
        });

        closeButton.setPositionRound(
            this.width - closeButton.width / 2 + styles.x,
            this.height - closeButton.height / 2 + styles.y
        );
        this.addChild(closeButton);
    },

    cancel: function () {
        this.model.cancel();
    },

    process: function () {
        this.model.process();
    },

    removeAnimation: function () {
        this.runAction(new cc.Sequence(
            new cc.ScaleTo(0.3, 0),
            new cc.CallFunc(this.onRemove),
            new cc.RemoveSelf()
        ));
    },

    showAnimation: function (delayTimeout) {
        this.setScale(0);
        this.runAction(new cc.Sequence(new cc.DelayTime(delayTimeout), new cc.ScaleTo(0.3, 1)));
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    FRIEND_REQUEST_ITEM_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.FriendRequestView = {
    width: 490,
    height: 190,

    close: {
        x: 10,
        y: 10
    },

    processButton: {
        width: 170,
        x: 25,
        y: -30,
        noImage: {
            x: 90,
            y: -35
        }
    },

    Request: {
        x: 66,
        y: 45,
        width: 270,
        height: 80
    },

    Icon: {
        x: 216,
        y: -30
    },

    Avatar: {
        Margin: {
            x: 30,
            y: 0
        }
    }
};
