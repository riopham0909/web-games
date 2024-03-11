/**
 * Created by Andrey Popov on 1/25/23.
 */

var BombOnCardView = cc.Node.extend({
    ctor: function (bombOnCard) {
        this._super();
        this.setAnchorPoint2();

        this.bombOnCard = bombOnCard;

        var styles = cleverapps.styles.BombOnCardView;
        this.shown = false;
        this.animation = new cleverapps.Spine(bundles.card.jsons.bomb_json);
        this.animation.setAnimation(0, "bomb_idle", true);
        this.animation.setTimeScale(0);
        this.animation.setPositionRound(styles.animation);
        this.addChild(this.animation);

        this.counterText = cleverapps.UI.generateImageText(bombOnCard.counter, cleverapps.styles.FONTS.BOMB_COUNTER_TEXT);
        this.counterText.fitTo(styles.counter.width);
        this.counterText.setPositionRound(styles.counter);
        this.animation.addChild(this.counterText);

        this.animation.setScale(0);

        this.setCascadeColorEnabled(true);
        this.updateBombVisibility();

        bombOnCard.onChangeCounter = this.createListener(this.onChangeCounterValue.bind(this));
        bombOnCard.onRemove = this.createListener(this.removeFromParent.bind(this));
        bombOnCard.onFlip = this.createListener(this.onFlip.bind(this));
        bombOnCard.onHide = this.createListener(this.hide.bind(this));

        if (cleverapps.environment.isEditorScene()) {
            this.addIncDecBlock();
        }
    },

    show: function () {
        this.shown = true;
        this.animation.setScale(1);
        this.animation.setTimeScale(1);
    },

    hide: function () {
        this.animation.setTimeScale(0);
        this.shown = false;
    },

    updateBombVisibility: function () {
        var visible = this.bombOnCard.isActive() || cleverapps.environment.isSceneWithPreview();
        if (visible && !this.shown) {
            this.show();
        } else if (!visible && this.shown) {
            this.hide();
        }
    },

    onFlip: function () {
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.CallFunc(this.updateBombVisibility.bind(this))
        ));
    },

    onChangeCounterValue: function () {
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.CallFunc(function () {
                this.counterText.setString(this.bombOnCard.counter);
                this.counterText.fitTo(cleverapps.styles.BombOnCardView.counter.width);
                if (this.bombOnCard.danger) {
                    this.counterText.runAction(new cc.TintTo(0.4, 255, 235, 110));
                    this.animation.setAnimationAndIdleAfter("bombcounter_danger", "danger");
                } else {
                    this.counterText.runAction(new cc.TintTo(0.4, 255, 255, 255));
                    this.animation.setAnimationAndIdleAfter("bombcounter_idle", "bomb_idle");
                }
                cleverapps.audio.playSound(bundles.game.urls.bomb_indication_effect);
            }.bind(this))
        ));
    },

    addIncDecBlock: function () {
        var incDecBlock = new IncDecBlock({
            value: this.bombOnCard.counter,
            onChange: function (value) {
                this.bombOnCard.counter = value;
                this.onChangeCounterValue(0, true);
                Editor.currentEditor.save();
            }.bind(this)
        });
        var cardView = this.bombOnCard.card.onGetView();
        incDecBlock.setPosition(cardView.width / 2, cardView.height / 2);
        incDecBlock.setScale(0.6);
        cardView.addChild(incDecBlock, 5);
    }

});

BombOnCardView.explosion = function () {
    var scene = cleverapps.scenes.getRunningScene();
    var explosion = new cleverapps.Spine(bundles.card.jsons.bomb_explosion_json);
    explosion.setAnimation(0, "explosion", false);
    scene.addChild(explosion);
    explosion.setPosition(scene.width / 2, scene.height / 2);
    explosion.runAction(new cc.PlaySound(bundles.game.urls.explosion_effect));
    explosion.setCompleteListenerRemove();
    var params = {
        x: scene.width / 2,
        y: scene.height / 2,
        r: 0
    };
    cleverapps.UI.shake(scene, params);
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BOMB_COUNTER_TEXT: {
        name: "default",
        size: 35
    }
});

cleverapps.styles.BombOnCardView = {
    animation: {
        x: 85,
        y: 42
    },

    counter: {
        x: { align: "center", dx: 1 },
        y: { align: "center", dy: -12 },
        width: 34
    }
};