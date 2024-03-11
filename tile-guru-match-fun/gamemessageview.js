/**
 * Created by mac on 4/7/20
 */

var GameMessageView = cc.Node.extend({
    ctor: function (message, options) {
        this._super();

        options = options || {};
        this.options = options;
        this.styles = cleverapps.styles.GameMessageView;

        var scene = cleverapps.scenes.getRunningScene();

        var background = this.createBackground();
        background.setVisible(false);
        this.addChild(background);
        this.updateSize();

        var text = this.createText(message);
        text.fitTo(scene.width * 0.9);
        background.addChild(text);

        this.setLocalZOrder(11);
        this.updatePosition();
        this.show();
    },

    updatePosition: function () {
        var scene = cleverapps.scenes.getRunningScene();
        this.background.setPositionRound(scene.width / 2, this.background.y);
        this.direction = this.options.direction || GameMessageView.DIRECTION_TOP_DOWN;

        this.start = cc.p(scene.width / 2, scene.height + this.background.height / 2);
        this.target = cc.p(scene.width / 2, scene.height / 2);
        this.finish = cc.p(scene.width / 2, -this.background.height / 2);
        if (this.direction === GameMessageView.DIRECTION_TOP_TOP) {
            this.finish = start;
        }

        if (this.pattern) {
            this.createPatternLayer(this.pattern, this.background);
        }
    },

    updateSize: function () {
        var sceneSize = cleverapps.UI.getSceneSize();
        this.background.setContentSize2(sceneSize.width * 1.2, this.background.height);
    },

    show: function () {
        this.background.setPositionRound(this.start);
        this.background.setVisible(true);
        cleverapps.audio.playSound(bundles.gamemessage.urls.game_message_effect);
        this.background.runAction(new cc.Sequence(
            new cc.MoveTo(0.3, this.target).easing(cc.easeBackOut(1.4)),
            new cc.CallFunc(function () {
                if (this.options.skin === "hard") {
                    cleverapps.audio.playSound(bundles.gamemessage.urls.game_message_hard_effect);
                }
            }.bind(this)),
            new cc.DelayTime(this.options.delay),
            new cc.CallFunc(function () {
                this.background.runAction(new cc.MoveTo(0.3, this.finish).easing(cc.easeBackIn(1.4)));
            }.bind(this)),
            new cc.DelayTime(0.3),
            new cc.CallFunc(function () {
                this.removeFromParent();
            }.bind(this))
        ));
    },

    createText: function (message) {
        message = Messages.has(message) ? Messages.get(message) : message;
        var font = cleverapps.styles.FONTS.GAME_MESSAGE_TEXT;
        var text = cleverapps.UI.generateTTFText(message.toUpperCase(), font);

        text.updatePosition = function () {
            text.setPositionRound(this.styles.text);
        }.bind(this);
        text.updatePosition();
        text.setLocalZOrder(1);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        return text;
    },

    createBackground: function () {
        var image = bundles.gamemessage.frames.gamemessage_bg_png;

        var background = this.background = new cc.Scale9Sprite(image);
        background.setLocalZOrder(-1);
        var pattern = this.pattern = bundles.gamemessage.frames.gamemessage_pattern_png;
        if (pattern) {
            this.createPatternLayer(pattern, background);
        }
        return background;
    },

    createPatternLayer: function (pattern, parent) {
        if (this.patternLayout) {
            this.patternLayout.removeFromParent();
            delete this.patternLayout;
        }

        var patternWidth = new cc.Sprite(pattern).width;
        var patternAmount = Math.ceil(cleverapps.UI.getSceneSize().width / patternWidth) + 1;
        var patterns = [];

        for (var i = 0; i <= patternAmount; i++) {
            var patternSprite = new cc.Sprite(pattern);
            patterns.push(patternSprite);
        }

        var patternLayer = this.patternLayout = new cleverapps.Layout(patterns, { direction: cleverapps.UI.HORIZONTAL });
        patternLayer.setLocalZOrder(0);
        patternLayer.setPositionRound(cleverapps.scenes.getRunningScene().width / 2, parent.height / 2);
        parent.addChild(patternLayer);
    }
});

GameMessageView.DIRECTION_TOP_DOWN = 0;
GameMessageView.DIRECTION_TOP_TOP = 1;

cleverapps.styles.GameMessageView = {
    text: {
        x: { align: "center" },
        y: { align: "center" }
    }
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    GAME_MESSAGE_TEXT: {
        size: 86,
        color: cleverapps.styles.COLORS.WHITE
    }
});