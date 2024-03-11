/**
 * Created by Andrey Popov on 09.02.21.
 */

var FakeGame = function (level) {
    Game.currentGame = this;

    this.counter = {
        isActive: function () {
            return true; 
        },
        registerStage: function () {},
        trigger: function () {},
        fieldCounter: {
            registerStage: function () {}
        },
        setTimeout: function () {}
    };

    var bundle = bundles[Episode.BundleId(level.episodeNo)];
    var properties = bundle.episode.levels && bundle.episode.levels[level.levelNo] || {};

    this.levelContent = level;
    this.level = {
        quick: true,
        content: level,
        episodeNo: level.episodeNo,
        expedition: properties.expedition || "main",
        getHumanReadableNumber: function () {
            return cleverapps.humanReadableNumber(level.episodeNo, level.levelNo);
        },
        getLevelEnemies: function () {
            var enemies = {};
            if (properties.enemies) {
                properties.enemies.forEach(function (enemy) {
                    enemies[enemy] = Game.GOAL_ENEMY_TYPES[enemy];
                });
            }
            return enemies;
        },
        episode: {
            isBonusRound: function () {
                return false;
            },
            isBonusWorldLevel: function () {
                return false;
            },
            bundleId: function () {
                return Episode.BundleId(level.episodeNo);
            }
        },
        getTag: function () {
            return properties.tag;
        },
        isHard: function () {
            return this.getTag() === Level.TAGS.HARD;
        },
        isTricky: function () {
            return this.getTag() === Level.TAGS.TRICKY;
        },
        getImageBundle: function () {
            return properties.bundleName;
        }
    };

    if (["solitaire", "tile3"].indexOf(cleverapps.config.type) !== -1) {
        this.pagination = new cleverapps.Pagination(this.levelContent.screens.length);

        this.generator = new TileGenerator();
        this.table = {
            cards: []
        };

        this.updateClovers = function () {

        };
    }

    if (cleverapps.config.type === "match3") {
        var loader = new Loader();
        this.field = new Field(loader);
        this.loader = loader;
        this.callsOnFieldReady = [];
        this.goals = new Goals(level);
        this.score = {
            updatePoints: function () {}
        };
        this.moves = this.levelContent.moves;
        this.leftMoves = this.moves;
        this.beginMoves = this.moves;

        Match3.counter = this.counter;
    }

    if (cleverapps.config.type === "merge") {
        Object.assign(this, {
            level: Object.assign(this.level, {
                families: Families.listExpeditionCodes(this.level.expedition),
                mapSize: properties.mapSize,
                units: this.levelContent.units,
                tiles: this.levelContent.tiles
            }),
            tutorial: {
                isActive: function () {}
            },
            orders: {
                updateOrder: function () {},
                findCanCook: function () {
                    return true;
                }
            },
            gameLevel: {
                value: 0,
                getLevel: function () {
                    return 1;
                },
                nextLevelThreshold: function () {
                    return 1000;
                }
            },
            harvested: {
                canTakeList: function () {},
                on: function () {}
            },
            workers: {
                findAssigned: function () {},
                countRegularFree: function () {
                    return 2; 
                },
                countRegularTotal: function () {
                    return 2; 
                },
                isBonusWorkerBuyed: function () {
                    return false; 
                },
                removeInstant: function () {}
            },
            energyLottery: {
                isAvailable: function () {
                    return false; 
                },
                isReady: function () {
                    return false; 
                }
            },
            spawn: function () {
                return [];
            },
            storeSave: function () {
            },
            seasonalOperator: {
            },
            on: function () {
            },
            isExpedition: function () {
            },
            specialOfferPlanner: {
                specialOffers: []
            },
            needToReplaceWithCoins: function () {
            },
            customers: {
                removeCustomer: function () {}
            },
            unitGreeter: {
                addGreeter: function () {},
                removeGreeter: function () {}
            },
            isMainGame: function () {
                return false;
            }
        });
    }

    if (cleverapps.config.type === "board") {
        this.board = new cleverapps.Board(this, [], []);
        this.board.addHint = function () {};
        this.hintBooster = {
            addHint: function () {}
        };
        this.keypad = new Keypad(this, {});
        this.current = new cleverapps.Current(this, this.keypad);
        this.extra = new cleverapps.Extra(this.levelContent, []);
    }

    if (cleverapps.config.rpg) {
        this.enemies = Game.SelectEnemies(this.level);
    }

    if (cleverapps.config.type === "battlefield") {
        this.battlefield = new Battlefield(this.level.content.army.size, this.level.content.army.formation);
    }
};

FakeGame.prototype.getMissionType = function () {
    return undefined;
};

FakeGame.prototype.stop = function () {
    if (this.stopped) {
        return;
    }
    this.stopped = true;

    if (cleverapps.config.type === "merge") {
        this.map.stop();
        InfoView.Clear();
    }
};

FakeGame.prototype.on = function () {

};