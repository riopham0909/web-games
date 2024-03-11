/**
 * Created by Aleksandr on 10.03.2023
 */

var MarkView = cleverapps.Spine.extend({
    ctor: function (mark) {
        this.mark = mark;
        this.styles = cleverapps.styles.MarkView[this.mark.type];

        if (cleverapps.environment.isSceneWithPreview()) {
            this.styles = cleverapps.overrideStyles(this.styles, this.styles.editor || {}, true);
        }

        var json = cleverapps.skins.getSlot("cardMarkSpine", {
            json: bundles.card.jsons.marks_json,
            type: mark.type
        });

        this._super(json);
        this.setAnchorPoint2();

        var animation;
        switch (this.mark.type) {
            case "mission": animation = "gem_idle"; break;
            case "key": animation = "key_idle"; break;
            case "coin": animation = "coin_idle"; break;
            case "magnet": animation = "magnet_idle_0"; break;
            case "bone": animation = "bone_idle"; break;
        }

        this.setAnimation(0, animation, true);
        this.setTimeScale(0.7 + Math.random() * 0.6);
        this.setScale(0);

        this.mark.on("show", this.show.bind(this));
        this.mark.on("collect", this.collect.bind(this));
        this.mark.on("collectMagnet", this.collectMagnet.bind(this));
        this.mark.on("executeMagnet", this.executeMagnet.bind(this));

        if (!cleverapps.environment.isSceneWithPreview()) {
            this.mark.on("hide", this.hide.bind(this));
        }
    },

    show: function (silent, callback) {
        this.setVisible(true);
        this.setPositionRound(this.styles);

        var scale = this.styles.scale || 1;

        if (silent) {
            this.setScale(scale);
            return;
        }

        var spark = new cleverapps.Spine(bundles.card.jsons.effects_json);
        spark.setAnimation(0, "appearance_corner", false);
        spark.setPositionRound(this.x, this.y);
        this.parent.addChild(spark);

        this.setScale(0);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.33),
            new cc.ScaleTo(0.33, scale),
            new cc.CallFunc(function () {
                spark.removeFromParent();
                if (callback) {
                    callback();
                }
            })
        ));
    },

    hide: function () {
        this.setVisible(false);
    },

    collect: function (target) {
        if (!target) {
            this.removeFromParent();
            return;
        }

        this.setTimeScale(1);

        var sound;
        switch (this.mark.type) {
            case "mission": sound = bundles.game.urls.cell_collect_effect; break;
            case "key": sound = bundles.game.urls.key_effect; break;
        }

        this.runAction(new cc.Sequence(
            new cc.Spawn(
                cleverapps.UI.animateCollect(this, target, {
                    duration: Mark.COLLECT_DURATION / 1000,
                    sound: sound,
                    collectEffect: true
                }),
                new cc.RotateTo(Mark.COLLECT_DURATION / 1000, 0)
            ),
            new cc.RemoveSelf()
        ));
    },

    collectMagnet: function () {
        this.setTimeScale(1);
        this.setAnimation(0, "magnet_jump", false);

        var movingNode = cleverapps.scenes.getMovingNode();

        var targetPosition = this.convertToWorldSpace(cc.p(this.x + this.styles.offset.x, this.y + this.styles.offset.y));
        targetPosition = movingNode.convertToNodeSpace(targetPosition);

        this.runAction(new cc.Sequence(
            new cc.ReplaceParent(movingNode),
            new cc.PlaySound(bundles.game.urls.magnet_collect),
            new cc.Spawn(
                new cc.MoveTo(Mark.COLLECT_DURATION / 1000 - 0.1, targetPosition),
                new cc.RotateTo(Mark.COLLECT_DURATION / 1000 - 0.1, 0)
            ),
            new cc.DelayTime(0.1),
            new cc.CallFunc(function () {
                this.setAnimation(0, "magnet_idle_1", true);
            }.bind(this))
        ));
    },

    executeMagnet: function (cardsToDestroy) {
        this.stopAllActions();
        this.setAnimation(0, "magnet_open", false);
        this.setCompleteListener(this.removeFromParent.bind(this));

        cleverapps.audio.playSound(bundles.game.urls.magnet_explode);
        cardsToDestroy.forEach(function (target) {
            var targetView = target.onGetView();
            if (!targetView || !targetView.getParent()) {
                return;
            }
            var targetPosition = this.getParent().convertToNodeSpace(targetView.getParent().convertToWorldSpace(targetView.getPosition()));
            var lightning = new cleverapps.Spine(bundles.card.jsons.lightning_json);
            lightning.setPositionRound(this.getPosition());
            lightning.setAnimation(0, "animation", false);
            var dx = targetPosition.x - lightning.x;
            var dy = targetPosition.y - lightning.y;
            lightning.setRotation(Math.atan2(-dy, dx) * 180 / Math.PI);
            lightning.setScaleX(Math.sqrt(dx * dx + dy * dy) / this.styles.lightningLength);
            this.getParent().addChild(lightning);
            lightning.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.RemoveSelf()
            ));
        }.bind(this));
    }
});

cleverapps.styles.MarkView = {
    mission: {
        x: 15,
        y: 15
    },

    key: {
        x: 95,
        y: 50,

        editor: {
            x: { align: "center" },
            y: { align: "center", dy: 60 },
            scale: 2
        }
    },

    coin: {
        x: 15,
        y: 15
    },

    magnet: {
        x: 95,
        y: 20,

        offset: {
            x: 0,
            y: 150
        },

        lightningLength: 530,

        editor: {
            x: { align: "center" },
            y: { align: "center", dy: -20 },
            scale: 1.5
        }
    },

    bone: {
        x: 90,
        y: 80
    }
};
