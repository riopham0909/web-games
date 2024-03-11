/**
 * Created by mac on 2/25/20
 */

var TileGame = function (level, options) {
    GameBase.call(this, level, options);

    this.levelWithCoins = cleverapps.user.checkAvailable(GameBase.LEVEL_WITH_COINS_AVAILABLE)
        && !["tile3"].includes(cleverapps.config.type);

    if (cleverapps.config.debugMode && cleverapps.flags.goldOnCardsDisabled) {
        this.levelWithCoins = false;
    }
    this.generator = new TileGenerator();

    this.pagination = new cleverapps.Pagination(this.level.content.screens.length, this.savedGame.page);

    var TableClassName = cleverapps.environment.isEditorScene() ? EditorCardTable : TileTable;
    this.table = new TableClassName();

    this.log = new MovesLog(this, this.savedGame.log);
    this.open = new OpenCards(this.level, this.savedGame.open);

    if (this.levelWithTutorial()) {
        this.cardsTutorial = new TilesTutorial(this.level);
    }

    var page = this.savedGame.page || 0;
    this.setPage(page, this.savedGame);
    this.pagination.on("changePage", this.setPage.bind(this));

    this.counter.registerStage(4, this.danceMove.bind(this));
    this.counter.registerStage(5, this.flip.bind(this));
    this.counter.registerStage(10, this.autoPlayOneCard.bind(this));
    this.counter.registerStage(20, this.changeScreen.bind(this));
    this.counter.registerStage(40, this.checkWin.bind(this));
    this.counter.registerStage(50, this.showTutorialStep.bind(this));
    this.counter.registerStage(55, this.afterPlayer.bind(this));
    this.counter.registerStage(60, this.activateBoosters.bind(this));

    this.userStatus.on("active", this.removeHint.bind(this), this);
    this.userStatus.on("inactive_very_short", this.showHint.bind(this), this);
};

TileGame.prototype = Object.create(GameBase.prototype);
TileGame.constructor = TileGame;

TileGame.prototype.setPage = function (page, save) {
    var screen = this.level.content.screens[page];
    var levelCards = screen.cards;

    if (!screen.cards || screen.horizontalCards && cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL && !cleverapps.environment.isEditorScene()) {
        levelCards = screen.horizontalCards;
    }
    var tiles = save && save.table && save.table.cards || levelCards;
    var magic = save && save.table && save.table.magic || TileTable.ListMagicCards(screen);
    var saveRect = save && save.table && save.table.rect;

    this.table.setCards(tiles, magic, screen.maxValue);
    this.table.setRect(saveRect);
    this.table.updateSize();

    this.updateClovers();

    if (page !== 0 && (save && !save.page || !save)) {
        this.table.flipNormalize();
    }
};

TileGame.prototype.getInfo = function () {
    var info = GameBase.prototype.getInfo.call(this);
    if (!this.stopped) {
        info.table = this.table.getInfo();
        info.log = this.log.getInfo();
    }
    return info;
};

TileGame.prototype.storeSave = function () {

};

TileGame.prototype.afterPlayer = function () {
    if (this.move !== undefined) {
        if (!this.stopped) {
            this.userStatus.reportUserAction();
        }
        this.move = false;
    }
};

TileGame.prototype.flip = function (f, silent) {
    this.table.flipNormalize(f, silent);
};

TileGame.prototype.autoPlayOneCard = function () {
    if (cleverapps.environment.isSceneWithPreview() || this.introPlaying) {
        return;
    }

    var openCards = this.table.cards.filter(function (card) {
        return card.isOpen();
    });

    for (var i = 0; i < openCards.length; i++) {
        var card = openCards[i];
        card.autoPlay();

        if (this.counter.isActive()) {
            break;
        }
    }
};

TileGame.prototype.danceMove = function () {
    if (!this.move) {
        return;
    }
    this.table.cards.filter(function (card) {
        return card.isOpen() && !card.inAnimation();
    }).forEach(function (card) {
        card.danceMove();
    });
};

TileGame.prototype.changeScreen = function () {
    if (this.table.isEmpty() && this.outcome === GameBase.OUTCOME_UNKNOWN && this.open.isStable() && !cleverapps.environment.isEditorScene()) {
        this.pagination.nextPage();
    }
};

TileGame.prototype.isWin = function () {
    return this.table.isEmpty() && this.open.isStable() && this.pagination.isLast();
};

TileGame.prototype.checkWin = function () {
    if (this.isWin()) {
        this.win();
    }
};

TileGame.prototype.getDailyCupStars = function () {
    return this.beginCards;
};

TileGame.prototype.showScreen = function (f, silent) {
    cleverapps.meta.compound(f, [
        function (f) {
            var controls = ["opencards"];
            cleverapps.Boosters.listBoostersIds().forEach(function (id) {
                controls.push("hint_" + id);
            });

            cleverapps.meta.showControlsWhileFocused(controls);

            this.table.updateSize();
            this.table.showCards(f, silent);
        }.bind(this),

        function (f) {
            this.flip(f, silent);
        }.bind(this)
    ]);
};

TileGame.prototype.beforeGameStart = function (f) {
    this.beginCards = this.countOfCardsToPlay();

    if (this.competition) {
        this.competition.start();
    }

    f();
};

TileGame.prototype.playCard = function (card) {
    this.move = Card.MOVES.PLAY;
    this.table.updateFeatures(this.move);

    if (cleverapps.dailyTasks) {
        cleverapps.dailyTasks.processOpenCard(card);
    }

    this.open.acceptCard(card);
    if (!card.feature) {
        this.log.push(MovesLog.MOVE_PLAY_CARD, { value: card.value });
    } else {
        this.log.clear();
    }

    this.score.addPoints(10);
    this.counter.trigger();
};

TileGame.prototype.undoCard = function (card) {
    this.table.addCard(card, card.index);
    this.move = Card.MOVES.UNDO;
    this.table.updateFeatures(this.move);
    this.table.returnCard(card);
};

TileGame.prototype.removeHint = function () {
    this.hideHint();
};

TileGame.prototype.hideHint = function () {
    if (this.hintCard) {
        this.hintCard.trigger("hideTutorial");
        this.hintCard = undefined;
    }
};

TileGame.prototype.showHint = function () {
    if (!this.canShowHint()) {
        this.hideHint();
        return;
    }

    var card = this.getCardForHint();

    if (this.hintCard !== card) {
        this.hideHint();
    }

    if (card && !card.inAnimation()) {
        this.hintCard = card;
        this.hintCard.trigger("showTutorial");
    }
};

TileGame.prototype.canShowHint = function () {
    return !(this.outcome !== GameBase.OUTCOME_UNKNOWN || cleverapps.meta.isFocused() || this.counter.isActive() || this.tutorialRunning
        || cleverapps.config.editorMode || cleverapps.environment.isSceneWithPreview() || cleverapps.forces.isRunningForce());
};

TileGame.prototype.activateBoosters = function () {
    if (this.outcome === GameBase.OUTCOME_UNKNOWN && !cleverapps.environment.isSceneWithPreview()) {
        if (this.log.isUndoNeedOnPreviousMove()) {
            this.log.showAlert();
        }
    }
};

TileGame.prototype.getCardForHint = function (tutorialStep) {
    var cards = this.table.listMissed();

    if (tutorialStep && (tutorialStep.value !== undefined || tutorialStep.component !== undefined)) {
        return cards.find(function (card) {
            return card.value === tutorialStep.value || card.findComponent(tutorialStep.component);
        });
    }

    return cards[0];
};

TileGame.prototype.stop = function () {
    GameBase.prototype.stop.apply(this, arguments);

    this.generator.clear();
    this.log.clear();
    this.open.clear();
    this.table.clear();

    this.removeHint();
};

TileGame.prototype.showTutorialStep = function () {
    this.tutorialRunning = true;

    if (this.log.showTutorialStep()) {
        return;
    }

    if (this.cardsTutorial) {
        if (this.cardsTutorial.showTutorialStep()) {
            return;
        }
    }

    this.tutorialRunning = false;
};

TileGame.prototype.countOfCardsToPlay = function () {
    var amount = this.table.cards.length;
    for (var i = this.pagination.getCurrent() + 1; i < this.pagination.getTotal(); i++) {
        var screen = this.level.content.screens[i];
        amount += screen.cards.length + TileTable.ListMagicCards(screen).length;
    }

    return amount;
};

TileGame.prototype.getPercentOfCompletion = function () {
    return 1 - this.countOfCardsToPlay() / this.beginCards;
};

TileGame.prototype.updateClovers = function () {

};