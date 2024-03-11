/**
 * Created by mac on 3/4/20
 */

var OpenCardsView = cc.Node.extend({
    ctor: function (openCards) {
        this._super();

        this.openCards = openCards;

        var styles = cleverapps.styles.OpenCardsView;

        this.slots = [];
        for (var i = 0; i < this.openCards.limit; i++) {
            var slot = new cc.Node();
            slot.setContentSize2(styles.slotSize, styles.slotSize);
            slot.setAnchorPoint2();
            slot.setPosition((i - (this.openCards.limit - 1) / 2) * styles.slotSize, 0);
            this.slots.push(slot);
            this.addChild(slot);
        }

        cleverapps.UI.wrap(this);

        this.bg = cleverapps.UI.createSprite(bundles.card.frames.opencards_bg);
        this.bg.setPositionRound(styles.bg);
        this.addChild(this.bg, -1);

        var fg = cleverapps.UI.createSprite(bundles.card.frames.opencards_fg);
        fg.setPositionRound(styles.fg);
        this.addChild(fg, 1000);

        this.updateSize();
        this.updatePosition();

        openCards.on("explode", this.explode.bind(this));
        openCards.on("overflow", this.overflowAnimation.bind(this));
        openCards.on("warning", this.setWarning.bind(this));

        this.openCards.getView = function () {
            return this;
        }.bind(this);

        this.createWarningAnimation();
        this.createCards();
    },

    updatePosition: function () {
        this.setPositionRound(cleverapps.styles.OpenCardsView.position);
    },

    updateSize: function () {
        var scale = cleverapps.UI.getSceneSize().width / (this.width + 2 * cleverapps.styles.OpenCardsView.scenePaddingX);
        this.setScale(Math.min(scale, 1));
    },

    findPosForCard: function (card) {
        return this.slots[card.visibleIndex].getPosition();
    },

    overflowAnimation: function () {
        var params = {
            power: 2,
            moveTime: 0.05,
            delayTimeAfterMove: 0.01,
            points: [
                { x: 0, y: 3, r: 0 }, 
                { x: 0, y: 0, r: 0 },
                { x: 3, y: 3, r: 0 },
                { x: 0, y: 1, r: 0 },
                { x: -3, y: 3, r: 0 },
                { x: 0, y: 0, r: 0 },
                { x: 0, y: 2, r: 0 },
                { x: 0, y: 0, r: 0 }
            ]
        };
        cleverapps.UI.shake(this, params);
    },

    createWarningAnimation: function () {
        var styles = cleverapps.styles.OpenCardsView.warning;
        var warningAnimation = this.warningAnimation = new cleverapps.Spine(bundles.card.jsons.open_warning_json);
        warningAnimation.setAnimation(0, "animation", true);
        warningAnimation.setPositionRound(styles);
        this.addChild(warningAnimation);
        warningAnimation.setVisible(false);
    },

    setWarning: function (warning) {
        this.warningAnimation.setVisible(warning);
    },

    explode: function (cards, isLast) {
        if (isLast) {
            var firstCardView = cards[0].onGetView();
            firstCardView.runAction(
                new cc.Spawn(
                    new cc.Sequence(
                        new cc.DelayTime(0.1),
                        new cc.RotateBy(0.4, 360)
                    ),
                    new cc.CallFunc(firstCardView.highlight.bind(firstCardView)),
                    new cc.Sequence(
                        new cc.MoveBy(0.25, 0, cleverapps.styles.OpenCardsView.explodeJump.dy).easing(cc.easeOut(3)),
                        new cc.MoveBy(0.25, 0, -cleverapps.styles.OpenCardsView.explodeJump.dy).easing(cc.easeIn(3)),
                        new cc.CallFunc(firstCardView.explode.bind(firstCardView))
                    )
                )
            );

            [cards[1], cards[2]].forEach(function (card, index) {
                var cardView = card.onGetView();
                cardView.runAction(
                    new cc.Sequence(
                        new cc.DelayTime(0.05 * index),
                        new cc.CallFunc(cardView.highlight.bind(cardView)),
                        new cc.MoveTo(0.5, firstCardView).easing(cc.easeBackIn(5)),
                        new cc.RemoveSelf()
                    )
                );
            });
        } else {
            cards.forEach(function (card) {
                card.onGetView().explode();
            });
        }
    },

    createCards: function () {
        this.openCards.cards.forEach(function (card) {
            var cardView = CardView.createCardView(card);
            this.addChild(cardView);
            cardView.setPositionRound(this.findPosForCard(card));
            cardView.setScale(cleverapps.styles.OpenCardsView.slotSize / cleverapps.styles.CardView.width);
        }, this);
    }
});

cleverapps.styles.OpenCardsView = {
    position: [
        {
            x: { align: "center" },
            y: { align: "bottom", dy: 200 }
        },
        {
            x: { align: "center" },
            y: { align: "bottom", dy: 48 }
        },
        {
            x: { align: "center" },
            y: { align: "bottom", dy: 48 }
        }
    ],
    bg: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -35 }
    },

    fg: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -27 }
    },

    warning: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: -16 }
    },

    slotSize: 120,

    scenePaddingX: 30,

    explodeJump: {
        dy: 300
    }
};