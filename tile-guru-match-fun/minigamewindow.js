/**
 * Created by slava on 23/11/17
 */

var MiniGameWindow = Window.extend({
    onWindowLoaded: function (reward) {
        this.reward = reward;

        var styles = cleverapps.styles.MiniGameWindow;

        this.text = cleverapps.UI.generateOnlyText("MiniGameWindow.Text", cleverapps.styles.FONTS.WINDOW_TEXT);
        this.text.fitTo(styles.text.width);

        var boxes = this.createBoxesNode();

        var content = new cleverapps.Layout([boxes, this.text], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL,
            padding: styles.padding
        });

        this._super({
            title: "MiniGameWindow.Title",
            name: "minigamewindow",
            content: content,
            closeButton: false
        });
    },

    createBoxesNode: function () {
        var styles = cleverapps.styles.MiniGameWindow;

        var node = new cc.Node();
        node.setAnchorPoint2();

        this.boxes = [];
        styles.boxes.forEach(function (position, index) {
            var box = this.createBox(index);

            this.boxes.push(box);

            node.addChild(box);
            box.setPositionRound(position);
        }, this);

        cleverapps.UI.wrap(node);

        return node;
    },

    createBox: function (index) {
        var styles = cleverapps.styles.MiniGameWindow;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(styles.box);

        var animation = new cleverapps.Spine(bundles.minigame.jsons.minigame_json);
        node.addChild(animation);
        animation.setSkin(["green", "blue", "pink"][index]);
        animation.setAnimation(0, "animation", true);
        animation.setPositionRound(styles.box.animation);

        cleverapps.UI.applyHover(node);
        cleverapps.UI.onClick(node, this.onPressed.bind(this));

        return node;
    },

    onShow: function () {
        this._super();
        this.showUpAnimation();
    },

    onHide: function () {
        this._super();

        if (this.boxes) {
            this.boxes.forEach(function (box) {
                box.stopAllActions();
            });
        }

        if (this.text) {
            this.text.stopAllActions();
        }
    },

    showUpAnimation: function () {
        var boxes = this.boxes;

        var positions = boxes.map(function (box) {
            return box.getPosition();
        });

        var targets = [[2, 0, 1], [0, 2, 1], [1, 0, 2]];
        this.text.setOpacity(0);

        boxes.forEach(function (box, id) {
            box.runAction(new cc.Sequence(
                new cc.DelayTime(0.5),
                new cc.MoveTo(0.3, positions[targets[0][id]]),
                new cc.DelayTime(0.1),
                new cc.CallFunc(function () {
                    if (id === 0) {
                        cleverapps.audio.playSound(bundles.main.urls.daily_game_mix_effect);
                    }
                }),
                new cc.MoveTo(0.3, positions[targets[1][id]]),
                new cc.DelayTime(0.1),
                new cc.CallFunc(function () {
                    if (id === 0) {
                        cleverapps.audio.playSound(bundles.main.urls.daily_game_mix_effect);
                    }
                }),
                new cc.MoveTo(0.3, positions[targets[2][id]]),
                new cc.DelayTime(0.1),
                new cc.CallFunc(function () {
                    if (id === 0) {
                        cleverapps.audio.playSound(bundles.main.urls.daily_game_mix_effect);
                    }
                }),
                new cc.MoveTo(0.3, positions[id]),
                new cc.DelayTime(0.3),
                new cc.CallFunc(function () {
                    if (id === 0) {
                        this.text.runAction(
                            new cc.FadeIn(0.5)
                        );
                    }
                }.bind(this))
            ));
        }, this);
    },

    onPressed: function () {
        if (!cleverapps.periodicBonus.locked) {
            cleverapps.periodicBonus.open();
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DAILY_BONUS);
            RewardWindow.createMiniGameWindow(this.reward);
            this.close();
        }
    }
});

cleverapps.styles.MiniGameWindow = {
    margin: 30,

    padding: {
        top: 30,
        bottom: 30
    },

    text: {
        width: 500
    },

    box: {
        width: 150,
        height: 150,

        animation: {
            x: { align: "center" },
            y: { align: "center" }
        }
    },

    boxes: [
        {
            x: -180,
            y: -50
        },
        {
            x: 0,
            y: 50
        },
        {
            x: 180,
            y: -50
        }
    ]
};