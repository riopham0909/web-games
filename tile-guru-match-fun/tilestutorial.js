/**
 * Created by Andrey Popov on 12.05.20
 */

var TilesTutorial = function (level) {
    this.level = level;
    this.config = TilesTutorial.TutorialConfig(level);

    this.handValues = cleverapps.clone(this.config.handValues, true) || [];

    this.step = 0;

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.TUTORIAL_BEGIN);
};

TilesTutorial.prototype.runForce = function (cardView, tutorialStep) {
    if (cleverapps.meta.isFocused()) {
        return false;
    }
    this.running = true;
    this.showForce(cardView, tutorialStep);
    return true;
};

TilesTutorial.prototype.showTutorialStep = function () {
    if (!this.config.tutorial || this.running) {
        return;
    }

    var current = this.config.tutorial[this.step];
    if (!current) {
        return;
    }

    if (current.type === TilesTutorial.TYPE_WILDCARD) {
        Game.currentGame.wildcardBooster.activateTutorial();
        return this.runForce(cleverapps.scenes.getRunningScene().wildCardButton, current);
    }

    var card = Game.currentGame.getCardForHint(current);
    if (!card) {
        if (current.amountExtraCards) {
            Game.currentGame.hand.addExtra(current.amountExtraCards, {});
            Game.currentGame.hand.extra.setEnable(true);
        }
        return;
    }

    if (current.force !== undefined) {
        return this.runForce(card.onGetView(), current);
    }

    if (card && !card.inAnimation()) {
        this.running = true;
        this.hintCard = card;
        card.trigger("showTutorial");
        return true;
    }
};

TilesTutorial.prototype.finishTutorialStep = function () {
    if (this.running) {
        this.step += 1;
        this.running = false;

        if (this.step === this.config.tutorial.length) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.GENERAL.TUTORIAL_COMPLETE);
        }

        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }
    }
};

TilesTutorial.prototype.getCurrentStep = function () {
    return this.config.tutorial[this.step];
};

TilesTutorial.TYPE_JACKPOT = 0;
TilesTutorial.TYPE_WILDCARD = 1;

TilesTutorial.prototype.isApplicable = function (card, filter) {
    if (!filter) {
        return false;
    }

    for (var i = 0; i < filter.length; i++) {
        if (typeof filter[i] === "function") {
            if (card instanceof filter[i] || card.findComponent(filter[i])) {
                return true;
            }
        } else if (card.getRank() === filter[i]) {
            return true;
        }
    }

    return false;
};

TilesTutorial.prototype.showForce = function (target, data) {
    var scene = cleverapps.scenes.getRunningScene();

    var openCards = Game.currentGame.table.listOpen().filter(function (openCard) {
        return this.isApplicable(openCard, data.filter);
    }, this).map(function (card) {
        return card.onGetView();
    });
    var importantNodes = openCards.filter(function (cardView) {
        return cardView !== target && (this.config.importantCards || []).some(function (ClassName) {
            return cardView.card instanceof ClassName || cardView.card.findComponent(ClassName);
        });
    }.bind(this));

    var allCards = Game.currentGame.table.cards.map(function (card) {
        return card.onGetView();
    });
    allCards = allCards.filter(function (cardView) {
        return cardView !== target;
    });

    if (scene.openCardsControl) {
        allCards.push(scene.openCardsControl);
        importantNodes.push(scene.openCardsControl);
    }

    var options = {
        highlights: allCards,
        importantNodes: importantNodes
    };

    var controls = ["opencards"];
    if (data.type === TilesTutorial.TYPE_WILDCARD) {
        controls.push("hint_" + cleverapps.Boosters.TYPE_WILDCARD);
    }

    cleverapps.meta.display({
        focus: "cardtutorial",
        control: controls,
        actions: [
            function (f) {
                if (data.type === TilesTutorial.TYPE_JACKPOT) {
                    var jackpotCard = openCards.filter(function (openCard) {
                        return Card.VALUES.indexOf(data.filter[0].toLowerCase()) === openCard.card.getCardValue();
                    })[0];
                    Game.currentGame.addJackpot(f, jackpotCard.card);
                } else {
                    f();
                }
            },

            function (f) {
                Game.currentGame.counter.setTimeout(f, Card.PLAY_TIMEOUT * 1000);
            },

            function (f) {
                cleverapps.forces.create(target, {
                    text: data.force,
                    pointer: true,
                    position: this.config.position,
                    finger: {
                        delay: 10
                    }
                }, options);
                cleverapps.forces.onceForceClosed = f;
            }.bind(this)
        ]
    });
};

TilesTutorial.IsAvailable = function (level) {
    if (cleverapps.config.editorMode) {
        return false;
    }

    return TilesTutorial.TUTORIAL_LEVELS.filter(function (available) {
        return level.episodeNo === available.episode && level.levelNo === available.level;
    }).length > 0;
};

TilesTutorial.TutorialConfig = function (level) {
    return TilesTutorial.TUTORIAL_LEVELS.filter(function (available) {
        return level.episodeNo === available.episode && level.levelNo === available.level;
    })[0];
};

TilesTutorial.prototype.getHandValue = function () {
    return this.handValues.shift();
};

TilesTutorial.TUTORIAL_LEVELS = [
    {
        episode: 0,
        level: 0,
        tutorial: [{
            force: "InitialTutorialMessage1",
            value: 1,
            filter: [1]
        }].concat(
            cleverapps.arrayFill(2, { action: "highlight", value: 1 })
        )
    },

    {
        episode: 3,
        level: 3,
        tutorial: [{
            force: "BombTutorialMessage",
            component: BombOnCard,
            filter: [BombOnCard]
        }]
    },

    {
        episode: 4,
        level: 11,
        importantCards: [IceOnCard],
        tutorial: [{
            force: "IceTutorialMessage",
            filter: [IceOnCard]
        }]
    },

    {
        episode: 5,
        level: 0,
        importantCards: [CurtainCard],
        tutorial: [{
            force: "CurtainTutorialMessage",
            filter: [CurtainCard]
        }]
    }
];
