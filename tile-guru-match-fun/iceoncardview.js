/**
 * Created by Andrey Popov on 1/25/23.
 */

var IceOnCardView = cc.Node.extend({
    ctor: function (iceOnCard) {
        this._super();
        this.setAnchorPoint2();

        this.iceOnCard = iceOnCard;

        var styles = cleverapps.styles.IceOnCardView;
        var stage = this.lastStage = Math.min(this.iceOnCard.stage, IceOnCard.PARTS);

        this.animation = new cleverapps.Spine(bundles.card.jsons.ice_json);
        this.animation.setPosition(
            cleverapps.styles.CardView.width / 2 + styles.dx,
            cleverapps.styles.CardView.height / 2 + styles.dy
        );

        this.animation.setAnimation(0, "animation" + stage, false);
        this.addChild(this.animation);
        this.setCascadeColorEnabled(true);

        iceOnCard.onBreakOff = this.createListener(this.breakOffAnimation.bind(this));
        iceOnCard.onDestroy = this.createListener(this.removeFromParent.bind(this));
        if (!cleverapps.environment.isSceneWithPreview()) {
            iceOnCard.onShow = this.createListener(this.show);
            iceOnCard.onHide = this.createListener(this.hide);
        }
    },

    show: function () {
    },

    hide: function () {
    },

    breakOffAnimation: function () {
        var stage = Math.min(IceOnCard.PARTS, this.iceOnCard.stage);
        if (stage !== this.lastStage) {
            if (this.lastStage < this.iceOnCard.stage) {
                this.animation.setAnimation(0, "animation" + stage, false);
                cleverapps.audio.playSound(bundles.game.urls.ice_break_effect);
            } else {
                this.animation.setAnimation(0, "reverse" + this.lastStage, false);
                cleverapps.audio.playSound(bundles.game.urls.ice_revert_effect);
            }

            this.lastStage = stage;
        }
    }

});

cleverapps.styles.IceOnCardView = {
    dx: 2,
    dy: -7
};