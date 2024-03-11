/**
 * Created by mac on 2/25/20
 */

var TileTable = function () {
    cleverapps.EventEmitter.call(this);

    this.orientation = cleverapps.config.orientation === "horizontal" ? TileTable.ORIENTATION_HORIZONTAL : TileTable.ORIENTATION_VERTICAL;

    this.canvas = this.getCanvas();

    this.getView = function () {};

    this.cards = [];
};

TileTable.prototype = Object.create(cleverapps.EventEmitter.prototype);
TileTable.prototype.constructor = TileTable;

TileTable.prototype.getCanvas = function () {
    if (this.orientation === TileTable.ORIENTATION_HORIZONTAL) {
        return {
            width: 1600,
            height: 800
        };
    }

    return {
        width: 800,
        height: 1000
    };
};

TileTable.REPAINT = function (cards) {
    var isNextCard = function (a, b) {
        if (!cards[a].overlaps(cards[b])) {
            return false;
        }
        for (var k = a + 1; k < b; k++) {
            if (cards[k].overlaps(cards[b]) && cards[a].overlaps(cards[k])) {
                return false;
            }
        }
        return true;
    };

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].canRepaint) {
            var j, badValues = {};
            for (j = i - 1; j >= 0; j--) {
                if (isNextCard(j, i)) {
                    badValues[cards[j].value] = true;
                }
            }

            if (badValues[cards[i].value]) {
                var varriants = [];
                for (j = i + 1; j < cards.length; j++) {
                    if (cards[j].canRepaint && !badValues[cards[j].value]) {
                        varriants.push(j);
                    }
                }
                if (varriants.length > 0) {
                    j = cleverapps.Random.choose(varriants);
                    var tmp = cards[i].value;
                    cards[i].value = cards[j].value;
                    cards[j].value = tmp;
                }
            }
        }
    }
};

TileTable.RESORT = function (cards) {
    var i = cards.length - 2;
    while (i >= 0) {
        if (i + 1 <= cards.length - 1 && !cards[i + 1].overlaps(cards[i])) {
            if (cards[i + 1].y > cards[i].y || (cards[i + 1].y === cards[i].y && cards[i + 1].x < cards[i].x)) {
                var tmp = cards[i + 1];
                cards[i + 1] = cards[i];
                cards[i] = tmp;
                i++;
                continue;
            }
        }
        i--;
    }
};

TileTable.prototype.setCards = function (cards, magic, maxValue) {
    magic = magic || [];

    cards = cards.concat(magic.map(function (data) {
        return Object.assign(data, {
            magic: true
        });
    }));

    cards = cards.map(function (card) {
        return card;
    }).flat();

    Game.currentGame.generator.reset(cards, maxValue);

    cards = cards.map(function (data) {
        return TileFactory.Create(data);
    });

    TileTable.RESORT(cards);
    TileTable.REPAINT(cards);

    this.cards = cards;

    cards.forEach(function (card) {
        card.setOwner(this);
    }, this);

    this.stacksPosition = undefined;

    this.trigger("resetCards");
};

TileTable.prototype.listMissed = function () {
    return this.cards.filter(function (card) {
        return card.canPlay();
    });
};

TileTable.prototype.getStacksPosition = function () {
    if (this.stacksPosition === undefined) {
        this.stacksPosition = cc.p(cc.rectGetCenter(this.rect).x, this.rect.y - Card.HEIGHT);
    }

    return this.stacksPosition;
};

TileTable.prototype.push3CardsToStack = function (cards) {
    var stacks = [-1, 0, 1].map(function (x) {
        var position = this.getStacksPosition();

        return cc.p(position.x + x * Card.WIDTH, position.y);
    }, this);

    cards.forEach(function (card, index) {
        var stack = stacks[index];

        card.setPosition(stack);

        for (var l = 0; l < 5; l++) {
            var occupied = this.cards.find(function (existingCard) {
                return existingCard.samePlace(card);
            });

            if (!occupied) {
                break;
            }

            card.y -= Card.GRID_XY;
        }
        this.addCard(card);
    }, this);

    var rect = this.rect;
    cards.forEach(function (card) {
        rect = cc.rectUnion(rect, cc.rect(card.x - Card.WIDTH / 2, card.y - Card.HEIGHT / 2, Card.WIDTH, Card.HEIGHT));
    });

    this.setRect(rect);
};

TileTable.prototype.animateUpdateSize = function () {
    this.trigger("animatedChangeSize");
};

TileTable.prototype.updateSize = function () {
    this.trigger("changeSize");
};

TileTable.prototype.calcRect = function (cards) {
    cards = cards || this.cards;
    if (cards.length === 0) {
        return cc.rect(0, 0, 0, 0);
    }
    var rect = cc.rect(cards[0].x - Card.WIDTH / 2, cards[0].y - Card.HEIGHT / 2, Card.WIDTH, Card.HEIGHT);

    cards.forEach(function (card) {
        var cardWidth = Card.WIDTH * card.getScale();
        var cardHeight = Card.HEIGHT * card.getScale();
        var rotation = card.r * Math.PI / 180;
        var rotatedWidth = Math.abs(cardWidth * Math.cos(rotation) + Math.abs(cardHeight * Math.sin(rotation)));
        var rotatedHeight = Math.abs(cardHeight * Math.cos(rotation)) + Math.abs(cardWidth * Math.sin(rotation));
        rect = cc.rectUnion(rect, cc.rect(card.x - rotatedWidth / 2, card.y - rotatedHeight / 2, rotatedWidth, rotatedHeight));
    });

    return rect;
};

TileTable.prototype.setRect = function (rect) {
    this.rect = rect || this.calcRect();
};

TileTable.prototype.getCardPosition = function (card) {
    return {
        parent: this.getView(),
        point: CardView.convertToViewPosition(card)
    };
};

TileTable.prototype.getInfo = function () {
    var cards = this.cards.filter(function (card) {
        return !card.magic;
    }).map(function (card) {
        return card.toJSON();
    });

    if (Game.currentGame.streakCard) {
        cards.push(Game.currentGame.streakCard.toJSON());
    }

    var magic = this.cards.filter(function (card) {
        return card.magic;
    }).map(function (card) {
        return card.toJSON();
    });

    return {
        rect: this.rect,
        cards: cards,
        magic: magic
    };
};

TileTable.prototype.isEmpty = function () {
    return this.cards.length === 0;
};

TileTable.prototype.canClick = function (card) {
    return card.isOpen();
};

TileTable.prototype.cardClicked = function (card) {
    if (!card.isOpen()) {
        return false;
    }

    if (!Game.currentGame.open.canPlay(card)) {
        card.trigger("wrongMove");
        return false;
    }

    this.startPlayCard(card);
    return true;
};

TileTable.prototype.startPlayCard = function (card) {
    cleverapps.audio.playSound(bundles.game.urls.play_tile_effect, { throttle: 0 });

    card.index = card.getZ();
    this.removeCard(card);
    card.trigger("removeFromTable");
    card.trigger("hideTutorial");
    Game.currentGame.playCard(card);
};

TileTable.prototype.removeCard = function (card) {
    var index = this.cards.indexOf(card);
    this.cards.splice(index, 1);
};

TileTable.prototype.getCardOrder = function (card) {
    return this.cards.indexOf(card);
};

TileTable.prototype.shuffle = function () {
    var cards = cleverapps.Random.shuffle(this.cards.map(function (card, index) {
        return {
            index: index,
            position: cc.p(card.x, card.y)
        };
    }));

    var newCards = new Array(cards.length);
    cards.forEach(function (card, index) {
        newCards[card.index] = this.cards[index];
        newCards[card.index].setPosition(card.position);
    }, this);

    this.cards = newCards;

    this.cards.forEach(function (card) {
        card.open();

        for (var i = 0; i < card.components.length; i++) {
            card.components[i].handleFlip(card.isOpen(), { shuffle: true });
        }

        card.trigger("flip");
    }, this);

    this.trigger("shuffle");

    Game.currentGame.counter.setTimeout(function () {}, Card.SHUFFLE_TIMEOUT * 1000);
};

TileTable.prototype.findCardsToBlow = function () {
    var tilesByValue = {};
    var openedByValue = {};

    this.cards.forEach(function (card, index) {
        if (!tilesByValue[card.value]) {
            tilesByValue[card.value] = [];
            openedByValue[card.value] = 0;
        }
        if (card.opened || !this.cardOverlapping(index)) {
            openedByValue[card.value]++;
            tilesByValue[card.value].unshift(card);
        } else {
            tilesByValue[card.value].push(card);
        }
    }.bind(this));

    var openedCards = [];
    for (var value in openedByValue) {
        openedCards.push({ amount: openedByValue[value], value: value });
    }
    openedCards.sort(function (value1, value2) {
        return value2.amount - value1.amount;
    });

    for (var i = 0; i < openedCards.length; i++) {
        if (tilesByValue[openedCards[i].value].length >= 3) {
            return tilesByValue[openedCards[i].value].slice(0, 3);
        }
    }
};

TileTable.prototype.blowCards = function (countOfTriads) {
    cleverapps.meta.distract({
        focus: "blowCards",
        keepControls: true,
        action: function (f) {
            var cardsToBlow = [];
            for (var index = 0; index < countOfTriads; index++) {
                var cards = this.findCardsToBlow();
                if (cards) {
                    cards.forEach(function (card) {
                        Game.currentGame.table.removeCard(card);
                        card.trigger("removeFromTable");
                        card.trigger("hideTutorial");
                    });
                    cardsToBlow.push(cards);
                }
            }

            this.trigger("blowCards", cardsToBlow.flat(), function () {
                f();
                Game.currentGame.counter.trigger();
            });
        }.bind(this)
    });
};

TileTable.ListMagicCards = function (screen) {
    var orientation = cleverapps.config.orientation === "horizontal" ? TileTable.ORIENTATION_HORIZONTAL : TileTable.ORIENTATION_VERTICAL;
    if (cleverapps.environment.isEditorScene()) {
        orientation = Game.currentGame.table.getOrientation();
    }
    return orientation === TileTable.ORIENTATION_HORIZONTAL ? screen.magicH : screen.magicV;
};

TileTable.prototype.getAmountOfCards = function () {
    return this.cards.length;
};

TileTable.prototype.addCard = function (card, position) {
    position = position || this.cards.length;
    this.cards.splice(position, 0, card);
    card.setOwner(this);

    for (var i = 0; i < this.cards.length; i++) {
        this.cards[i].trigger("updateZ");
    }
};

TileTable.prototype.hasCard = function (card) {
    return this.cards.indexOf(card) !== -1;
};

TileTable.prototype.insertBeforeCard = function (existingCard, newCard) {
    var index = this.cards.indexOf(existingCard);
    this.cards.splice(index, 0, newCard);

    for (var i = 0; i < this.cards.length; i++) {
        this.cards[i].trigger("updateZ");
    }
};

TileTable.prototype.replaceCard = function (oldCard, newCard) {
    var index = this.cards.indexOf(oldCard);
    this.cards[index] = newCard;
};

TileTable.prototype.cardOverlapping = function (cardIndex, card) {
    for (var i = cardIndex + 1; i < this.cards.length; i++) {
        if ((card || this.cards[cardIndex]).overlaps(this.cards[i])) {
            return true;
        }
    }

    return false;
};

TileTable.prototype.showCards = function (f, silent) {
    var waiter = cleverapps.wait(this.cards.length, function () {
        if (cleverapps.config.type === "tile3" && !silent) {
            for (var i = 0; i < this.cards.length; i++) {
                if (!this.shouldFlipCard(i)) {
                    this.cards[i].listMarks().forEach(function (mark) {
                        mark.show();
                    });
                }
            }
        }

        f();
    }.bind(this));

    var delays = this.calcShowUpDelays(silent);

    this.cards.forEach(function (card, index) {
        if (silent) {
            card.animateShowUp(waiter, silent);
            return;
        }

        if (cleverapps.config.type === "tile3") {
            card.listMarks().forEach(function (mark) {
                mark.hide();
            });
        }

        Game.currentGame.counter.setTimeout(function () {
            card.animateShowUp(waiter);
        }, delays[index]);
    });
};

TileTable.prototype.flipNormalize = function (f, silent) {
    var cards = [];

    for (var i = this.cards.length - 1; i >= 0; i--) {
        if (this.shouldFlipCard(i)) {
            cards.push(this.cards[i]);
        }
    }

    if (cleverapps.config.type === "solitaire" && !cleverapps.environment.isAdministratorScene() && !cleverapps.environment.isEditorScene()) {
        this.avoidOpenCardsWithSamesRanks(cards);
    }

    if (!f) {
        cards.forEach(function (card) {
            card.flip(cleverapps.environment.isEditorScene() || cleverapps.environment.isAdministratorScene());
        });
        return;
    }

    cards.sort(function (a, b) {
        var rowA = Math.round(a.y / 200);
        var rowB = Math.round(b.y / 200);

        if (rowA !== rowB) {
            return rowB - rowA;
        }

        return a.x - b.x;
    });

    if (silent) {
        cards.forEach(function (card) {
            card.flip(silent);
        });
        f();
    } else {
        this.sound = cleverapps.audio.playSound(bundles.game.urls.blackout_effect);
        var cardFlipTime = cleverapps.config.type === "tile3" ? 1000 / cards.length : 50;

        var timeouts = [];
        for (var j = 0; j < cards.length; j++) {
            timeouts.push(j * cardFlipTime);
        }
        if (cleverapps.config.type === "solitaire") {
            timeouts = cleverapps.Random.shuffle(timeouts);
        }

        var waiter = cleverapps.wait(cards.length, function () {
            cleverapps.audio.stopSound(this.sound);
            cleverapps.audio.playSound(bundles.game.urls.card_1_effect);
            f();
        }.bind(this));
        cards.forEach(function (card, i) {
            setTimeout(function () {
                card.flip();
                waiter();
            }, timeouts[i]);
        });
    }
};

TileTable.prototype.avoidOpenCardsWithSamesRanks = function (flippingCards) {
    var openCards = this.cards.filter(function (card) {
        return card.isOpen();
    });

    var existedRanks = {};
    openCards.forEach(function (card) {
        existedRanks[card.getRank()] = true;
    });

    var newOpen = flippingCards.filter(function (card) {
        return !card.isOpen() && !card.wasShown && !card.feature;
    });
    var cardsToReplace = this.cards.filter(function (card) {
        return !card.isOpen() && !card.wasShown && !existedRanks[card.getRank()] && !card.feature && !newOpen.includes(card);
    });

    newOpen.forEach(function (card) {
        if (existedRanks[card.getRank()]) {
            if (cardsToReplace.length) {
                var value = cardsToReplace[0].value;
                cardsToReplace[0].value = card.value;
                card.value = value;
            } else {
                for (var i = 0; i < 30; i++) {
                    card.setRandomValue();
                    if (!existedRanks[card.getRank()]) {
                        break;
                    }
                }
            }
            existedRanks[card.getRank()] = true;
            cardsToReplace = cardsToReplace.filter(function (card) {
                return !existedRanks[card.getRank()];
            });
        }
    });
};

TileTable.prototype.shouldFlipCard = function (cardInd) {
    var card = this.cards[cardInd];
    var isOverlapping = this.cardOverlapping(cardInd);

    return !card.isOpen() && !isOverlapping || card.isOpen() && isOverlapping;
};

TileTable.prototype.returnCard = function (card, index) {
    card.onReturnToScreen(index);
    card.registerAnimationTime(Card.RETURN_TIMEOUT);
    Game.currentGame.counter.trigger();
};

TileTable.prototype.listOpen = function () {
    return this.cards.filter(function (card) {
        return card.isOpen();
    });
};

TileTable.prototype.calcShowUpDelays = function () {
    var deep = 0, changed = true;
    while (changed) {
        changed = false;
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].deep === undefined) {
                var intersect = false;
                for (var j = i + 1; j < this.cards.length; j++) {
                    if (this.cards[i].overlaps(this.cards[j]) && this.cards[j].deep === undefined) {
                        intersect = true;
                        break;
                    }
                }
                if (!intersect) {
                    this.cards[i].deep = deep;
                    changed = true;
                }
            }
        }
        deep--;
    }

    this.cards.sort(function (a, b) {
        if (a.deep !== b.deep) {
            return a.deep - b.deep;
        }
        return a.x * 10 + a.y - b.x * 10 - b.y;
    });

    var currDeep;
    var offset = 0;
    var res = [];
    var delays = [];
    this.cards.forEach(function (card, index) {
        if (currDeep !== card.deep) {
            if (currDeep !== undefined) {
                offset += 50;
            }

            currDeep = card.deep;

            delays.push([]);
        }

        delays[delays.length - 1].push(index * 50 + offset);
    }, this);

    delays.forEach(function (group) {
        var first = group.splice(0, group.length / 2);
        res = res.concat(first.concat(cleverapps.Random.shuffle(group)));
    });

    return res;
};

TileTable.prototype.updateFeatures = function (type) {
    this.cards.forEach(function (card) {
        card.updateFeature(type);
    });
};

TileTable.prototype.clear = function () {
    this.cards.forEach(function (card) {
        card.clear();
    });

    this.cards = [];
};

TileTable.DIRECTIONS = [{
    x: 0, y: -1
}, {
    x: -1, y: 0
}, {
    x: 0, y: 1
}, {
    x: 1, y: 0
}];

TileTable.MAX_SCALE = 1.7;

TileTable.ORIENTATION_HORIZONTAL = 0;
TileTable.ORIENTATION_VERTICAL = 1;