/**
 * Created by slava on 4/3/20
 */

var CardTableView = cc.Node.extend({
    ctor: function (table) {
        this._super();

        this.table = table;
        this.centerNode = new cc.Node();
        this.addChild(this.centerNode);
        this.setAnchorPoint2();

        this.debugId = "CardTable";

        this.table.on("replaceCardWithAnother", this.replaceCardWithAnother.bind(this));
        this.table.on("insertCard", this.insertCard.bind(this));
        this.table.on("demonstrateBoosterBefore", this.demonstrateBoosterBefore.bind(this));
        this.table.on("resetCards", this.createCards.bind(this));
        this.table.on("animatedChangeSize", this.onTableAnimatedChangeSize.bind(this));
        this.table.on("changeSize", this.onTableChangeSize.bind(this));
        this.table.on("blowCards", this.blowCards.bind(this));
        this.table.on("shuffle", this.shuffle.bind(this));

        this.table.getView = function () {
            return this.centerNode;
        }.bind(this);

        this.createCards(true);
        this.centerNode.children.forEach(function (cardView) {
            cardView.setVisible(false);
        });
    },

    shuffle: function () {
        var cardViews = this.table.cards.map(function (card) {
            return card.onGetView();
        });

        cleverapps.UI.animateShuffle(cardViews, function () {
            this.setLocalZOrder(this.card.getZ());
        });
    },

    onTableChangeSize: function () {
        this.calcRect();
        this.setContentSize2(this.rect.width, this.rect.height);
        this.centerNode.setPosition(this.getCenterNodePosition());
        this.setTableScale();
    },

    onTableAnimatedChangeSize: function () {
        this.calcRect();
        var newCenterNodePosition = this.getCenterNodePosition();
        var deltaPos = cc.pSub(newCenterNodePosition, this.centerNode.getPosition());
        var deltaSize = cc.size(this.rect.width - this.width, this.rect.height - this.height);

        this.animateOffset = cc.p(deltaPos.x / 2, deltaPos.y / 2);
        this.animateOffset.x -= deltaSize.width / 2 - deltaPos.x / 2;
        this.animateOffset.y -= deltaSize.height / 2 - deltaPos.y / 2;

        this.centerNode.runAction(new cc.Sequence(
            new cc.MoveBy(0.3, this.animateOffset.x, this.animateOffset.y),
            new cc.CallFunc(function () {
                this.animateOffset = cc.p(0, 0);
                this.setContentSize2(this.rect.width, this.rect.height);
                this.centerNode.setPosition(this.getCenterNodePosition());
            }.bind(this))
        ));

        this.animateTableScale();
    },

    getCenterNodePosition: function () {
        var centerOffset = cc.rectGetCenter(this.rect);
        return cc.p(this.rect.width / 2 - centerOffset.x, this.rect.height / 2 - centerOffset.y);
    },

    setTableScale: function () {
        if (Game.currentGame instanceof FakeGame) {
            return;
        }
        cleverapps.UI.inflateToBoundaries(this, this.getOverlappingNodes(), {
            maxScale: TileTable.MAX_SCALE,
            padding: cleverapps.styles.CardTableView.padding
        });
    },

    animateTableScale: function () {
        cleverapps.UI.inflateToBoundaries(this, this.getOverlappingNodes(), {
            animate: true,
            maxScale: TileTable.MAX_SCALE,
            padding: cleverapps.styles.CardTableView.padding
        });
    },

    getOverlappingNodes: function () {
        var scene = cleverapps.scenes.getRunningScene();
        var overlappingNodes = [scene.upMenuContainer, scene.downToolBarControl, scene.cloversControl,
            scene.collectionContainer, scene.openCardsControl, scene.shuffleButton, scene.undoButton, scene.vacuumButton,
            scene.paginationControl, scene.handView, scene.handBlockView, scene.undoButton];
        if (scene.sideBar && scene.sideBar.slots) {
            overlappingNodes = overlappingNodes.concat(scene.sideBar.slots);
        }

        return overlappingNodes.filter(Boolean);
    },

    calcRect: function () {
        var rect = this.table.rect;
        this.rect = cc.rect(
            rect.x * resolutionScale,
            rect.y * resolutionScale,
            rect.width * resolutionScale,
            rect.height * resolutionScale
        );
        return this.rect;
    },

    createCards: function (withShowUp) {
        this.centerNode.removeAllChildren();

        this.table.cards.forEach(function (card, index) {
            var cardView = CardView.createCardView(card, withShowUp);
            this.centerNode.addChild(cardView);
            cardView.setLocalZOrder(index);
            cardView.setPositionRound(card.getViewPosition().point);
        }, this);
    },

    replaceCardWithAnother: function (targetCard, sourceCard) {
        var targetView = targetCard.onGetView();

        var ViewClass = sourceCard.getViewClass();
        var sourceView = new ViewClass(sourceCard);

        sourceView.setLocalZOrder(targetView.getLocalZOrder());
        sourceView.setPositionRound(targetView.getPosition());

        targetView.removeFromParent();

        this.centerNode.addChild(sourceView);
    },

    convertToViewPosition: function (modelPosition) {
        return {
            x: modelPosition.x * resolutionScale,
            y: modelPosition.y * resolutionScale
        };
    },

    insertCard: function (card, initialOffset) {
        cleverapps.audio.playSound(bundles.game.urls.appearance_joker_effect);

        var cardView = CardView.createCardView(card);
        cardView.setPositionRound({
            x: (initialOffset || 0),
            y: 0
        });
        cardView.setRotation(0);
        this.centerNode.addChild(cardView);

        cardView.replaceParentSamePlace(cleverapps.scenes.getMovingNode());
        cardView.animation.setAnimation(0, "under_card_start", false);
        cardView.animation.setCompleteListener(function () {
            cardView.animation.setCompleteListener();

            var position = this.convertToViewPosition(card);

            position = cleverapps.scenes.getMovingNode().convertToNodeSpace(this.centerNode.convertToWorldSpace(position));

            cardView.animation.setAnimation(0, "under_card_move", false);

            cardView.runAction(
                new cc.Sequence(
                    new cc.Spawn(new cc.MoveTo(0.2, position), new cc.RotateTo(0.2, card.getRotation())),
                    new cc.DelayTime(0.09),
                    new cc.CallFunc(function () {
                        cardView.replaceParentSamePlace(this.centerNode);

                        cardView.setLocalZOrder(card.getZ());
                    }.bind(this))
                )
            );
        }.bind(this));
    },

    demonstrateBoosterBefore: function (boosterCard, callback) {
        var flyingMagnet = new cleverapps.Spine(bundles.boosters_before_game.jsons.boost_magnit_json);
        flyingMagnet.setAnimation(0, "boost_magnit", false);
        flyingMagnet.setPosition({
            x: this.width / 2,
            y: 0
        });
        flyingMagnet.setLocalZOrder(100);
        flyingMagnet.setCompleteListenerRemove(function () {
            cleverapps.audio.playSound(bundles.game.urls.decorator_appear_effect);
            callback();
        });
        this.addChild(flyingMagnet);

        var targetPosition = this.convertToNodeSpace(boosterCard.onGetView().convertToWorldSpace(cleverapps.styles.MarkView.magnet));
        flyingMagnet.runAction(new cc.Spawn(
            new cc.MoveTo(0.9, targetPosition).easing(cc.easeExponentialInOut()),
            new cc.RotateTo(0.9, boosterCard.r)
        ));

        cleverapps.audio.playSound(bundles.game.urls.appearance_magnet_effect);
    },

    blowCards: function (group, callback) {
        var styles = cleverapps.styles.CardTableView.blowCard;
        var scene = cleverapps.scenes.getRunningScene();
        var vacuum = new cleverapps.Spine(bundles.booster_effects.jsons.vacuum_json);
        vacuum.setAnimation(0, "animation", false);
        vacuum.setPositionRound(scene.width / 2, scene.height / 2);

        var stick = new cleverapps.Spine(bundles.booster_effects.jsons.vacuum_stick_json);
        stick.setAnimation(0, "animation", false);
        stick.setPositionRound(styles.stick);
        stick.setCompleteListenerRemove(callback);

        scene.addChild(vacuum);
        scene.addChild(stick);

        cleverapps.audio.playSound(bundles.booster_effects.urls.vacuum_effect);

        group.sort(function (a, b) {
            return b.onGetView().getLocalZOrder() - a.onGetView().getLocalZOrder();
        });

        var targetPosition = cleverapps.scenes.getMovingNode().convertToNodeSpace(scene.convertToWorldSpace(stick.getPosition()));
        targetPosition.x += styles.target.dx;
        targetPosition.y += styles.target.dy;

        var distances = group.map(function (card) {
            return cc.pDistance(this.convertToWorldSpace(card.onGetView().getPosition()), targetPosition);
        }.bind(this));
        var blowingTime = 1.5;
        var maxDistance = Math.max.apply(null, distances);
        var speed = maxDistance / blowingTime;

        vacuum.setCompleteListenerRemove(function () {
            group.forEach(function (card, i) {
                var plateOnCard = card.findComponent(PlateOnCard);
                if (plateOnCard) {
                    plateOnCard.collect();
                }
                var delay = (blowingTime * distances[i]) / maxDistance;
                var moveTime = distances[i] / speed;
                var tremDuratin = 0.3;
                delay = Math.max(delay - tremDuratin, 0);
                var cardView = card.onGetView();

                cardView.runAction(new cc.Sequence(
                    new cc.DelayTime(delay),
                    new cc.RotateTo(tremDuratin / 3, -5).easing(cc.easeIn(2)),
                    new cc.RotateTo(tremDuratin / 6, 5),
                    new cc.RotateTo(tremDuratin / 6, -5),
                    new cc.RotateTo(tremDuratin / 3, 0),
                    new cc.Spawn(
                        new cc.Sequence(
                            new cc.CallFunc(function () {
                                if (!card.isOpen()) {
                                    card.flip();
                                }
                                cardView.replaceParentSamePlace(cleverapps.scenes.getMovingNode(), { keepScale: true });
                            }),
                            new cc.MoveTo(moveTime, targetPosition).easing(cc.easeIn(4)),
                            new cc.RemoveSelf()
                        ),
                        new cc.RotateTo(0.5, 10)
                    )

                ));
            });
        });
    }
});

cleverapps.styles.CardTableView = {
    blowCard: {
        stick: {
            x: { align: "right" },
            y: { align: "center" }
        },
        target: {
            dx: -10,
            dy: 30
        }
    },
    padding: {
        top: 50,
        bottom: 50,
        left: 10,
        right: 10
    }
};