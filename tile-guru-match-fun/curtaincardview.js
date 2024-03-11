/**
 * Created by spepa on 18.02.21
 */

var CurtainCardView = CardView.extend({
    ctor: function (card) {
        this._super(card);

        this.setAnchorPoint2();

        this.curtains = new cleverapps.Spine(bundles.card.jsons.curtain_json);
        this.curtains.setPosition(this.width / 2, this.height / 2);
        this.curtains.setVisible(false);
        this.addChild(this.curtains);

        this.counterText = cleverapps.UI.generateImageText(this.getCounterText(), cleverapps.styles.FONTS.CURTAIN_COUNTER_TEXT);
        this.counterText.setPositionRound(cleverapps.styles.CurtainCardView.counter);
        this.curtains.addChild(this.counterText);
        this.updateCurtainsVisibility();
        card.on("hide", this.hide.bind(this));
        card.on("changeStage", this.changeStage.bind(this));
        card.on("onshowup", this.updateCurtainsVisibility.bind(this));

        if (cleverapps.environment.isEditorScene()) {
            this.addEditorControls();
        }
    },

    onEnter: function () {
        this._super();
        if (this.parent instanceof OpenCardsView) {
            this.hide();
        }
    },

    hide: function () {
        if (this.curtains) {
            this.curtains.removeFromParent();
        }
    },

    getCounterText: function () {
        if (this.card.sleeping) {
            return this.card.sleep - this.card.counter;
        }
        return this.card.active - this.card.counter;
    },

    getAnimationName: function () {
        var state = this.card.sleeping ? "sleep" : "active";
        return this.card.magicCurtain ? ("magic_" + state) : state;
    },

    getIdleAnimationName: function () {
        return this.getAnimationName() + "_idle";
    },

    getWrongMoveAnimationName: function () {
        return this.getAnimationName() + "_wrong_move";
    },

    changeStage: function () {
        if (!this.curtains.visible) {
            return;
        }

        if (this.card.counter === 0) {
            this.counterText.setString(0);
            this.curtains.setAnimation(0, this.getAnimationName(), false);

            this.curtains.setCompleteListener(function () {
                this.curtains.setCompleteListener();
                if (!this.curtains.visible) {
                    return;
                }

                this.curtains.setAnimation(0, this.getIdleAnimationName(), true);
                this.counterText.setString(this.getCounterText());
            }.bind(this));
            cleverapps.audio.playSound(bundles.game.urls[this.card.sleeping ? "curtain_close_effect" : "curtain_open_effect"]);
        } else {
            this.counterText.setString(this.getCounterText());
        }
    },

    animateReturnToScreen: function () {
        this._super();

        this.updateCurtainsVisibility();
    },

    updateCurtainsVisibility: function () {
        if (this.card.sleeping) {
            cleverapps.audio.playSound(bundles.game.urls.curtain_close_effect);
            this.curtains.setAnimationAndIdleAfter(this.getAnimationName(), this.getIdleAnimationName());
        } else {
            this.curtains.setAnimationAndIdleAfter("emerging", this.getIdleAnimationName());
        }
    },

    animateLose: function () {
        if (this.curtains) {
            this.curtains.removeFromParent();
        }
        CardView.prototype.animateLose.call(this);
    },

    wrongMove: function () {
        var wrongAnimation = this.getWrongMoveAnimationName();
        if (this.curtains.hasAnimation(wrongAnimation)) {
            cleverapps.audio.playSound(bundles.game.urls.wrong_effect);
            this.curtains.setAnimationAndIdleAfter(wrongAnimation, this.getIdleAnimationName());
        } else {
            this._super();
        }
    },

    addEditorControls: function () {
        var activeBlock = new IncDecBlock({
            value: this.card.active,
            onChange: function (value) {
                this.card.active = value;
                this.changeStage();
                Editor.currentEditor.save();
            }.bind(this)
        });
        var sleepBlock = new IncDecBlock({
            value: this.card.sleep,
            onChange: function (value) {
                this.card.sleep = value;
                this.changeStage();
                Editor.currentEditor.save();
            }.bind(this)
        });
        var checkboxSleeping = new cleverapps.UI.CheckBox({
            isSelected: this.card.sleeping || false,
            label: {
                text: "sleeping"
            },
            onChange: function (state) {
                this.card.sleeping = state;
                this.changeStage();
                Editor.currentEditor.save();
            }.bind(this)
        });
        var checkboxMagic = new cleverapps.UI.CheckBox({
            isSelected: this.card.magicCurtain || false,
            label: {
                text: "magic"
            },
            onChange: function (state) {
                this.card.magicCurtain = state;
                this.changeStage();
                Editor.currentEditor.save();
            }.bind(this)
        });
        var controls = new cleverapps.Layout([activeBlock, sleepBlock, checkboxSleeping, checkboxMagic], {
            direction: cleverapps.UI.VERTICAL
        });

        controls.setScale(0.4);
        controls.setPosition(this.width / 2, this.height / 2);
        this.addChild(controls);
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CURTAIN_COUNTER_TEXT: {
        size: 0,
        name: "default"
    }
});

cleverapps.styles.CurtainCardView = {
    counter: {
        x: { align: "center" },
        y: { align: "center", dy: -6 }
    }
};