/**
 * Created by Andrey Popov on 1/24/23.
 */

var BombOnCard = function (card, options) {
    this.card = card;
    this.counter = options.counter || 5;
    this.card.featureTrigger = Card.MOVES.PLAY | Card.MOVES.SHIFT;

    this.onChangeCounter = function () {};
    this.onRemove = function () {};
    this.onFlip = function () {};
    this.onHide = function () {};

    Game.currentGame.counter.registerStage(32, BombOnCard.process);
};

BombOnCard.prototype.getViewClass = function () {
    return BombOnCardView;
};

BombOnCard.prototype.isActive = function () {
    return this.card.isOpen();
};

BombOnCard.prototype.collect = function () {
    return this.remove();
};

BombOnCard.prototype.isBlocked = function () {
    return false;
};

BombOnCard.prototype.remove = function () {
    this.card.removeComponent(BombOnCard);
    this.onRemove();
};

BombOnCard.prototype.toJSON = function () {
    return {
        name: "bomb",
        counter: this.counter
    };
};

BombOnCard.prototype.handleFlip = function () {
    this.onFlip();
};

BombOnCard.prototype.handleClick = function () {
};

BombOnCard.prototype.danceMove = function () {
    this.counter--;

    this.updateDanger();
    this.onChangeCounter();

    if (this.counter <= 0) {
        this.counter = 0;
        this.readyToExplode = true;
    }
};

BombOnCard.prototype.addUntilExplode = function (amount) {
    this.counter += amount;
    this.updateDanger();
    this.onChangeCounter();
};

BombOnCard.prototype.updateDanger = function () {
    var danger = this.counter <= BombOnCard.DANGER_THRESHOLD;
    if (this.danger !== danger) {
        this.danger = danger;
    }
};

BombOnCard.process = function () {
    var game = Game.currentGame;
    var bombs = game.table.cards.map(function (card) {
        return card.findComponent(BombOnCard);
    }).filter(function (bomb) {
        return bomb && bomb.isActive() && !bomb.card.isNearToDestroy();
    });
    var toExplode = bombs.filter(function (bomb) {
        return bomb.readyToExplode;
    });

    if (toExplode.length === 0) {
        return;
    }

    toExplode.forEach(function (bomb) {
        bomb.readyToExplode = false;
    });

    var onSuccess = function () {
        game.counter.setTimeout(function () {
            bombs.forEach(function (bomb) {
                bomb.addUntilExplode(BombOnCard.MOVES_TO_ADD);
            });
        }, 100);
    };

    var onGiveUp = function () {
        toExplode.forEach(function (bomb) {
            bomb.remove();
        });

        game.counter.setTimeout(BombOnCardView.explosion, 500);

        game.counter.setTimeout(function () {
            game.lose();
        }, 1200);
    };

    game.hideHint();

    cleverapps.meta.display({
        focus: "PostponeBombWindow",
        control: ["panel_info", "opencards"],
        filter: function () {
            return Game.currentGame === game;
        },
        actions: [
            function (f) {
                cleverapps.timeouts.setTimeout(f, 1000);
            },

            function (f) {
                new ProlongationWindow({
                    type: Prolongation.TYPES.BOMB,
                    title: "PostponeBombWindow.title",
                    onSuccess: onSuccess,
                    onGiveUp: onGiveUp
                });
                cleverapps.meta.onceNoWindowsListener = f;
            }
        ]
    });
};

BombOnCard.MOVES_TO_ADD = 5;
BombOnCard.DANGER_THRESHOLD = 3;