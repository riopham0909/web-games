/**
 * Created by Denis Kuzin on 25 april 2023
 */

var PlateOnCardView = cc.Node.extend({
    ctor: function (plateOnCard) {
        this._super();

        this.setAnchorPoint2();

        this.plateOnCard = plateOnCard;

        var styles = cleverapps.styles.PlateOnCardView;
        var stage = this.lastStage = Math.min(PlateOnCard.PARTS, this.plateOnCard.stage);

        this.animation = new cleverapps.Spine(bundles.card.jsons.plate_json);
        this.animation.setPosition(
            cleverapps.styles.CardView.width / 2 + styles.dx,
            cleverapps.styles.CardView.height / 2 + styles.dy
        );
        this.animation.setSkin("tile_" + this.plateOnCard.card.value);
        this.animation.setAnimation(0, "animation" + stage, false);
        this.animation.setLocalZOrder(1000);
        this.addChild(this.animation);
        this.setCascadeColorEnabled(true);

        plateOnCard.onBreakOff = this.createListener(this.breakOffAnimation.bind(this));
        plateOnCard.onCollect = this.createListener(this.collect.bind(this));
        plateOnCard.onDestroy = this.createListener(this.removeFromParent.bind(this));
    },

    breakOffAnimation: function () {
        var stage = Math.min(PlateOnCard.PARTS, this.plateOnCard.stage);

        if (stage !== this.lastStage) {
            var name = this.lastStage > stage ? "reverse" + this.lastStage : "animation" + stage;
            this.animation.setAnimation(0, name, false);

            cleverapps.audio.playSound(bundles.card.urls.plate_breaks_off_effect);

            this.lastStage = stage;
        }
    },

    collect: function (target) {
        var sparks = new cleverapps.Spine(bundles.card.jsons.plate_json);
        sparks.setPosition(this.animation.x, this.animation.y);
        sparks.setSkin("tile_" + this.plateOnCard.card.value);
        sparks.setAnimation(0, "goal", false);
        sparks.setCompleteListenerRemove();
        this.addChild(sparks);
        sparks.replaceParentSamePlace(cleverapps.scenes.getMovingNode());

        cleverapps.audio.playSound(bundles.card.urls.plate_click_effect);
        this.animation.setAnimation(0, "goal_fly", false);
        this.animation.replaceParentSamePlace(cleverapps.scenes.getMovingNode());

        var delay = 400;
        this.animation.runAction(new cc.Sequence(
            new cc.DelayTime(delay / 1000),
            new cc.Spawn(
                cleverapps.UI.animateCollect(this.animation, target, {
                    duration: (PlateOnCard.COLLECT_DURATION - delay) / 1000,
                    collectEffect: true,
                    sound: bundles.card.urls.plate_collect_effect,
                    adjustToTarget: true
                }),
                new cc.RotateTo((PlateOnCard.COLLECT_DURATION - delay) / 1000, 0)
            ),
            new cc.RemoveSelf()
        ));
    }
});

cleverapps.styles.PlateOnCardView = {
    dx: 2,
    dy: -7
};