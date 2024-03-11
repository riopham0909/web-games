/**
 * Created by mac on 2/25/20
 */

var OpenCards = function (level, save) {
    cleverapps.EventEmitter.call(this);

    this.cards = [];

    this.limit = cleverapps.gameModes.threeOpenCards ? 3 : 7;
    this.stableTime = 0;

    if (save) {
        this.loadSave(save);
    }
    this.getView = function () {};
};

OpenCards.prototype = Object.create(cleverapps.EventEmitter.prototype);
OpenCards.prototype.constructor = OpenCards;

OpenCards.prototype.getCardPosition = function (card) {
    var position = {};

    var view = this.getView();
    if (!view) {
        return position;
    }

    position.parent = view;
    position.point = view.findPosForCard(card);
    return position;
};

OpenCards.prototype.loadSave = function (data) {
    data.forEach(function (item) {
        var card = TileFactory.Create(item, {
            noMark: true
        });
        card.visibleIndex = item.visibleIndex;
        this.addCard(card);
        card.flip();
    }.bind(this));
};

OpenCards.prototype.getInfo = function () {
    return this.cards.map(function (card) {
        return card.toJSON();
    });
};

OpenCards.prototype.canExplodeCard = function (index, value) {
    return this.cards[index].value === value && !this.cards[index].inAnimation() && this.cards[index].visibleIndex === index;
};

OpenCards.prototype.explodeThreeInRow = function (i, isLast) {
    cleverapps.audio.playSound(isLast ? bundles.game.urls.tile_flip_effect : bundles.game.urls.collection_effect);

    this.trigger("explode", [this.cards[i], this.cards[i + 1], this.cards[i + 2]], isLast);

    this.cards.splice(i, 3);

    while (i < this.cards.length) {
        this.cards[i].registerAnimationTime(Card.EXPLODE_TIMEOUT);
        i++;
    }
    this.counterDelay(Card.EXPLODE_TIMEOUT);
};

OpenCards.prototype.explode = function (canBeLastThree) {
    for (var i = this.cards.length - 3; i >= 0; i--) {
        var value = this.cards[i].value;
        if (this.canExplodeCard(i, value) && this.canExplodeCard(i + 1, value) && this.canExplodeCard(i + 2, value)) {
            var isLast = canBeLastThree && this.cards.length === 3;
            this.explodeThreeInRow(i, isLast);
            Game.currentGame.log.clear();
            this.counterDelay(isLast ? 0.8 : 0);
            return;
        }
    }
};

OpenCards.prototype.counterDelay = function (delay) {
    delay *= 1000;
    this.stableTime = Math.max(this.stableTime, cleverapps.timeouts.getTime() + delay);
    cleverapps.timeouts.setTimeout(Game.currentGame.counter.trigger.bind(Game.currentGame.counter), delay);
};

OpenCards.prototype.checkLose = function () {
    if (this.isStable()) {
        this.checkWarning();
        if (this.isFull()) {
            this.trigger("overflow");
            return true;
        }
    }
};

OpenCards.prototype.checkWarning = function () {
    var warning = this.cards.length >= this.limit - 2;
    this.trigger("warning", warning);
};

OpenCards.prototype.reindexTimeout = function (deltaIndex) {
    return (deltaIndex + 3) / 3 * 0.1;
};

OpenCards.prototype.reindex = function () {
    for (var i = 0; i < this.cards.length; i++) {
        if (!this.cards[i].inAnimation() && this.cards[i].visibleIndex !== i) {
            var timeout = this.reindexTimeout(Math.abs(this.cards[i].visibleIndex - i));
            this.cards[i].visibleIndex = i;
            this.cards[i].registerAnimationTime(timeout + 0.05);

            this.moveToOpen(this.cards[i], timeout);

            this.counterDelay(timeout + 0.05);
        }
    }
};

OpenCards.prototype.moveToOpen = function (card, duration, fromTable) {
    card.trigger("moveToOpen", duration, fromTable);
};

OpenCards.prototype.isEmpty = function () {
    return this.cards.length === 0;
};

OpenCards.prototype.isFull = function () {
    return this.cards.length === this.limit;
};

OpenCards.prototype.isStable = function () {
    return this.stableTime <= cleverapps.timeouts.getTime();
};

OpenCards.prototype.canPlay = function (card) {
    return !this.isFull() && card.canPlay();
};

OpenCards.prototype.acceptCard = function (card) {
    this.addCard(card);
    card.collectMarksAndComponents();
    if (!card.isOpen()) {
        card.flip();
    }

    var flyDuration = Math.max((card.y + 600) / 3000, 0.1) + 0.1;
    var index = this.cards.length - 1;

    for (var i = index - 1; i >= 0; i--) {
        if (this.cards[i].value === card.value) {
            if (i < 2 || this.cards[i - 2].value !== card.value) {
                index = i + 1;
            }
            break;
        }
    }
    if (index !== this.cards.length - 1) {
        var reindexTimeout = Math.max(flyDuration - 0.2, 0);
        for (i = this.cards.length - 1; i > index; i--) {
            this.cards[i] = this.cards[i - 1];
            this.cards[i].registerAnimationTime(reindexTimeout);
        }
        this.cards[index] = card;
        this.counterDelay(reindexTimeout);
    }

    card.visibleIndex = index;
    if (index > 0 && card.visibleIndex <= this.cards[index - 1].visibleIndex && this.cards[index - 1].inAnimation() && this.cards[index - 1].animationEndTime + 200 > cleverapps.timeouts.getTime() + flyDuration * 1000) {
        card.visibleIndex = Math.min(this.cards[index - 1].visibleIndex + 1, this.limit - 1);
    }

    this.moveToOpen(card, flyDuration, true);

    card.registerAnimationTime(flyDuration);
    this.counterDelay(flyDuration);
};

OpenCards.prototype.addCard = function (card) {
    this.cards.push(card);
    card.setOwner(this);
};

OpenCards.prototype.cardClicked = function () {
    if (cleverapps.config.debugMode && !this.isFull()) {
        var game = Game.currentGame;

        var table = game.table;
        var cards = table.cards;

        for (var i = cards.length - 1; i >= 0; i--) {
            var card = cards[i];

            if (!card.isOpen() || card.feature === "safe") {
                continue;
            }

            var plateOnCard = card.findComponent(PlateOnCard);
            if (plateOnCard) {
                plateOnCard.collect();
            }

            if (typeof FlagsOnCard !== "undefined") {
                var flagsOnCard = card.findComponent(FlagsOnCard);
                flagsOnCard && flagsOnCard.destroy();
            }

            if (typeof IceOnCard !== "undefined") {
                var iceOnCard = card.findComponent(IceOnCard);
                iceOnCard && iceOnCard.destroy();
            }

            table.startPlayCard(card);

            break;
        }
    }
    return false;
};

OpenCards.prototype.shift = function () {
    var card = this.cards.shift();
    if (!card) {
        return;
    }

    card.setOwner(Game.currentGame.table);
    this.trigger("pop", card);
    return card;
};

OpenCards.prototype.pop = function (move) {
    var value = move.options.value;

    var index = undefined;
    for (var i = this.cards.length - 1; i >= 0; i--) {
        if (this.cards[i].value === value) {
            index = i;
            break;
        }
    }

    if (index === undefined) {
        return;
    }

    var card = this.cards[index];
    this.cards.splice(index, 1);
    this.counterDelay(0);

    card.setOwner(Game.currentGame.table);
    this.trigger("pop", card);
    return card;
};

OpenCards.prototype.clear = function () {
    this.cards.forEach(function (card) {
        card.clear();
    });
    this.cards = [];
};

OpenCards.prototype.getCurrentCard = function () {
    if (this.cards.length === 0) {
        return undefined;
    }

    return this.cards[this.cards.length - 1];
};

OpenCards.OVERFLOW_ANIMATION_DURATION = 500;
