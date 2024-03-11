/**
 * Created by mac on 12/08/22
 */

var Tile3 = function (level, options) {
    TileGame.call(this, level, options);

    this.updateClovers();

    cleverapps.Random.seed(Date.now());

    this.counter.registerStage(18, this.explode.bind(this));
    this.counter.registerStage(19, this.reindex.bind(this));
    this.counter.registerStage(33, this.checkLose.bind(this));
};

var Game = Tile3;

Tile3.prototype = Object.create(TileGame.prototype);
Tile3.constructor = Tile3;

Tile3.prototype.getInfo = function () {
    var info = TileGame.prototype.getInfo.call(this);

    info.open = this.open.getInfo();
    info.page = this.pagination.getCurrent();

    return info;
};

Tile3.prototype.explode = function () {
    this.open.explode(this.table.isEmpty());
};

Tile3.prototype.checkLose = function () {
    if (this.outcome !== GameBase.OUTCOME_UNKNOWN) {
        return;
    }
    if (this.open.checkLose()) {
        var actions = [
            function (f) {
                this.counter.inc();
                cleverapps.timeouts.setTimeout(f, OpenCards.OVERFLOW_ANIMATION_DURATION);
            }.bind(this),
            function (f) {
                if (cleverapps.gameModes.skipProlongation) {
                    this.lose();
                    f();
                    return;
                }

                new ProlongationWindow({
                    onGiveUp: this.lose.bind(this)
                });

                cleverapps.meta.onceNoWindowsListener = f;
            }.bind(this),

            function (f) {
                this.counter.dec();
                f();
            }.bind(this)
        ];

        cleverapps.meta.display({
            focus: "ProlongationWindow",
            actions: actions
        });

        return;
    }
    if (!this.table.isEmpty() && !this.isMoveExist()) {
        this.counter.inc();

        cleverapps.gameMessage.showMessage("message.noMoves", {
            callback: function () {
                this.lose();
                this.counter.dec();
            }.bind(this)
        });
    }
};

Tile3.prototype.isMoveExist = function () {
    return this.table.cards.filter(function (card) {
        return card.canPlay();
    }).length;
};

Tile3.prototype.reindex = function () {
    this.open.reindex();
};

Tile3.prototype.setMoves = function () {
    cleverapps.audio.playSound(bundles.game.urls.return_booster_effect);
    Game.currentGame.log.clear();

    new ActionPlayer([
        function (f) {
            Game.currentGame.counter.setTimeout(f, 600);
        },
        function (f) {
            Game.currentGame.counter.setTimeout(f, 400);
            var lastCards = [];
            for (var i = 0; i < 3; i++) {
                var card = this.open.shift();
                if (card) {
                    lastCards.push(card);
                }
            }

            this.table.push3CardsToStack(lastCards);
            this.table.animateUpdateSize();
            lastCards.forEach(function (card, index) {
                this.table.returnCard(card, lastCards.length - index);
            }.bind(this));
        }.bind(this)
    ]).play();
};

Tile3.prototype.updateClovers = function () {
    this.clovers = 0;

    this.table.cards.forEach(function (card) {
        if (card.findComponent(PlateOnCard)) {
            this.clovers++;
        }
    }.bind(this));

    this.trigger("updateCloversTarget");
};
