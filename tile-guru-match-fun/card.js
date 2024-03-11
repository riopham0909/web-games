/**
 * Created by Andrey Popov on 12.05.20
 */

var Card = function (options) {
    options = options || {};
    cleverapps.EventEmitter.call(this);

    this.opened = (options.opened !== undefined) ? options.opened : (cleverapps.config.type === "tile3");

    this.animationEndTime = 0;

    this.feature = options.feature;
    this.featureTrigger = 0;
    this.canFeatureProcess = false;
    this.nearToDestroy = false;

    if (options) {
        this.setPosition(options);
    }

    if (options.magic) { // auto generated
        this.magic = true;
    }

    this.marks = (options.marks || []).map(function (type) {
        if (type instanceof Mark) {
            return type;
        }
        return new Mark(type);
    });

    this.owner = undefined;

    if (cleverapps.environment.isEditorScene()) {
        this.decorators = options.decorators;
        this.disableEditorControls = options.disableEditorControls;

        if (options.value === undefined) {
            this.random = true;
        }
    }

    this.setupValue(options.value);

    this.onReturnToScreen = function () {};
    this.onGetView = function () {};

    this.components = (options.components || []).map(function (component) {
        switch (component.name) {
            case "ice": return new IceOnCard(this, component);
            case "bomb": return new BombOnCard(this, component);
            case "chain": return new ChainOnCard(this, component);
            case "flags": return new FlagsOnCard(this, component);
            case "plate": return new PlateOnCard(this, component);
        }
        return undefined;
    }.bind(this));
};

Card.prototype = Object.create(cleverapps.EventEmitter.prototype);
Card.prototype.constructor = Card;

Card.prototype.samePlace = function (position) {
    return this.x === position.x && this.y === position.y;
};

Card.prototype.canPlay = function () {
    return this.isOpen() && !this.isBlocked();
};

Card.prototype.isBlocked = function () {
    return this.components.some(function (component) {
        return component.isBlocked();
    });
};

Card.prototype.animateShowUp = function (f, silent) {
    this.trigger("animateShowUp", function () {
        this.afterAnimateShowUp();

        var delayTime = 0;
        this.components.forEach(function (component) {
            if (component.onShowUp) {
                delayTime += component.onShowUp();
            }
        });

        if (delayTime) {
            setTimeout(f, delayTime);
        } else {
            f();
        }
    }.bind(this), silent);
};

Card.prototype.afterAnimateShowUp = function () {
    var marks = this.listMarks();

    marks.forEach(function (mark) {
        if (mark.alwaysVisible()) {
            mark.show();
        }
    });

    if (bundles.game.urls.card_1_effect !== undefined) {
        var effects = [], effectId = 1;
        while (bundles.game.urls["card_" + effectId + "_effect"] !== undefined) {
            effects.push(bundles.game.urls["card_" + effectId + "_effect"]);
            effectId++;
        }
        cleverapps.audio.playSound(cleverapps.Random.choose(effects));
    }
};

Card.prototype.setupValue = function (value) {
    if (value !== undefined) {
        this.value = value;
    } else {
        this.canRepaint = true;
        this.setRandomValue();
    }
};

Card.prototype.getZ = function () {
    return Game.currentGame.table.getCardOrder(this);
};

Card.prototype.listMarks = function () {
    return this.marks;
};

Card.prototype.getRank = function () {
    return this.value;
};

Card.prototype.setRandomValue = function () {
    this.value = Game.currentGame.generator.next();
};

Card.prototype.getSkin = function () {
    if (cleverapps.config.editorMode && this.value === undefined) {
        return this.isOpen() ? "skin_unknown" : "backside_unknown";
    }

    return "skin_" + this.value;
};

Card.STICK_TO_GRID = function (value, grid) {
    var d = Math.round(value / grid);
    return d * grid;
};

Card.prototype.canClick = function () {
    if (Game.currentGame.counter.isActive() || Game.currentGame.outcome !== GameBase.OUTCOME_UNKNOWN) {
        return false;
    }

    if (this.owner !== undefined && !this.inAnimation() && this.owner.canClick) {
        return this.owner.canClick(this);
    }
};

Card.prototype.handleClick = function () {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].handleClick()) {
            return true;
        }
    }

    return this.owner && this.owner.cardClicked(this);
};

Card.prototype.onClickListener = function () {
    if (Game.currentGame.counter.isActive() || Game.currentGame.outcome !== GameBase.OUTCOME_UNKNOWN) {
        return true;
    }

    if (!this.inAnimation()) {
        if (this.handleClick()) {
            if (Game.currentGame.cardsTutorial) {
                Game.currentGame.cardsTutorial.finishTutorialStep();
                Game.currentGame.counter.trigger();
            }

            if (Game.currentGame.removeHint) {
                Game.currentGame.removeHint();
            }
        }
    }

    return true;
};

Card.prototype.beforePlayCard = function (callback) {
    callback();
};

Card.prototype.magnetHit = function () {
    Game.currentGame.table.startPlayCard(this);
};

Card.prototype.setPosition = function (options) {
    this.x = Card.STICK_TO_GRID(options.x, Card.GRID_XY);
    this.y = Card.STICK_TO_GRID(options.y, Card.GRID_XY);
    this.r = Card.STICK_TO_GRID(options.r || options.rotation || 0, Card.GRID_ANGLE);
};

Card.prototype.isOpen = function () {
    return this.opened;
};

Card.prototype.open = function () {
    this.opened = true;
    this.wasShown = true;
};

Card.prototype.close = function () {
    this.opened = false;
};

Card.prototype.getRotation = function () {
    return this.r;
};

Card.prototype.getViewPosition = function () {
    return this.owner.getCardPosition(this);
};

Card.prototype.getViewClass = function () {
    return CardView;
};

Card.prototype.setOwner = function (owner) {
    this.owner = owner;

    this.trigger("changeOwner", this.owner);
};

Card.prototype.getScale = function () {
    return 1;
};

Card.prototype.getSize = function () {
    return {
        width: Card.WIDTH * this.getScale(),
        height: Card.HEIGHT * this.getScale()
    };
};

Card.prototype.danceMove = function () {
    if (!this.canFeatureProcess) {
        return;
    }
    this.canFeatureProcess = false;

    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].danceMove) {
            this.components[i].danceMove();
        }
    }
};

Card.prototype.isNearToDestroy = function () {
    return this.nearToDestroy;
};

Card.prototype.setNearToDestroy = function () {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].lives !== undefined && this.components[i].lives > 1) {
            return;
        }
    }

    this.nearToDestroy = true;
};

Card.prototype.inAnimation = function () {
    return this.animationEndTime >= cleverapps.timeouts.getTime();
};

Card.prototype.registerAnimationTime = function (timeout) {
    var endTime = cleverapps.timeouts.getTime() + timeout * 1000;
    if (endTime > this.animationEndTime) {
        this.animationEndTime = endTime;
    }
};

Card.prototype.flip = function (silent) {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].handleFlip(this.isOpen())) {
            return;
        }
    }

    if (this.isOpen()) {
        this.close();
    } else {
        this.open();
        this.trigger("changeValue");
    }

    this.marks.forEach(function (mark) {
        if (!mark.alwaysVisible()) {
            if (this.isOpen()) {
                mark.show();
            } else {
                mark.hide();
            }
        }
    }.bind(this));

    this.trigger("flip", silent);
};

Card.prototype.autoPlay = function () {

};

Card.prototype.canBeAttacked = function () {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].canBeAttacked && !this.components[i].canBeAttacked()) {
            return false;
        }
    }

    return true;
};

Card.prototype.canBeReplacedWithBoosters = function () {
    return this.components.length === 0;
};

Card.prototype.collectMarksAndComponents = function () {
    this.marks.forEach(function (mark) {
        mark.collect();
    });
    this.marks = [];

    this.components.forEach(function (component) {
        if (component.collect) {
            component.collect();
        }
    });
};

Card.prototype.updateFeature = function (type) {
    this.canFeatureProcess = (this.featureTrigger & type) !== 0;
};

Card.prototype.toJSON = function () {
    var data = {
        x: this.x,
        y: this.y,
        r: this.r
    };

    if (!cleverapps.config.editorMode) {
        data.marks = this.marks.map(function (mark) {
            return mark.type;
        });

        data.components = this.components.map(function (component) {
            return component.name;
        });
    }

    if (this.value !== undefined && !this.random) {
        data.value = this.value;
    }

    if (this.feature) {
        data.feature = this.feature;
    }

    if (this.visibleIndex !== undefined) {
        data.visibleIndex = this.visibleIndex;
    }

    if (this.components.length > 0) {
        data.components = this.components.map(function (component) {
            return component.toJSON();
        });
    }

    return data;
};

Card.prototype.findComponent = function (Component) {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i] instanceof Component) {
            return this.components[i];
        }
    }
};

Card.prototype.removeComponent = function (Component) {
    var indexToRemove = undefined;
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i] instanceof Component) {
            indexToRemove = i;
            break;
        }
    }
    if (indexToRemove !== undefined) {
        this.components.splice(indexToRemove, 1);
    }
};

/*
 * heuristic but works for normal play cards
 * check if any of 4 vertexes of rectangle or it's center are contained within another,
 * or vice versa
 */
Card.prototype.containsAnyPoint = function (otherCard, points) {
    var eps = 1;

    var THIS_REC_CONTAINS = function (point) {
        return Math.abs(point.x) <= this.getSize().width / 2 + eps && Math.abs(point.y) <= this.getSize().height / 2 + eps;
    }.bind(this);

    var VECT_ROTATE = function (point, angle) {
        angle = angle / 180 * Math.PI;
        return {
            x: point.x * Math.cos(angle) + point.y * Math.sin(angle),
            y: -point.x * Math.sin(angle) + point.y * Math.cos(angle)
        };
    };

    var dx = otherCard.x - this.x;
    var dy = otherCard.y - this.y;

    // apply scale
    var otherPoints = points.map(function (point) {
        return {
            x: point.x * otherCard.getScale() * 0.95,
            y: point.y * otherCard.getScale() * 0.95
        };
    });

    // rotate other card
    otherPoints = otherPoints.map(function (point) {
        return VECT_ROTATE(point, otherCard.getRotation());
    });

    // move other card to relative position
    otherPoints = otherPoints.map(function (point) {
        return {
            x: point.x + dx,
            y: point.y + dy
        };
    });

    // rotate space relative current card has no rotation
    otherPoints = otherPoints.map(function (point) {
        return VECT_ROTATE(point, -this.getRotation());
    }.bind(this));

    var pointsInsideThis = otherPoints.filter(function (point) {
        return THIS_REC_CONTAINS(point);
    });

    return pointsInsideThis.length > 0;
};

Card.prototype.overlaps = function (otherCard) {
    var points = [
        {
            x: 0,
            y: 0
        },
        {
            x: Card.WIDTH / 2,
            y: Card.HEIGHT / 2
        },
        {
            x: -Card.WIDTH / 2,
            y: Card.HEIGHT / 2
        },
        {
            x: Card.WIDTH / 2,
            y: -Card.HEIGHT / 2
        },
        {
            x: -Card.WIDTH / 2,
            y: -Card.HEIGHT / 2
        }];

    var currentCards = [this];
    var otherCards = [otherCard];

    return currentCards.some(function (card) {
        return otherCards.some(function (card2) {
            return card.containsAnyPoint(card2, points) || card2.containsAnyPoint(card, points);
        });
    });
};

Card.prototype.clear = function () {
    var cardView = this.onGetView();
    if (cardView) {
        cardView.removeFromParent();
    }

    this.components = [];
};

Card.prototype.hide = function () {
    this.trigger("hide");
};

Card.WIDTH = 120;
Card.HEIGHT = 120;
Card.GRID_XY = 10;
Card.GRID_ANGLE = 90;

Card.SHUFFLE_TIMEOUT = 1.5;
Card.EXPLODE_TIMEOUT = 0.28;
Card.RETURN_TIMEOUT = 0.3;

Card.MOVES = {
    PLAY: 1 << 0,
    SHIFT: 1 << 1,
    UNDO: 1 << 2,
    UNSHIFT: 1 << 3
};