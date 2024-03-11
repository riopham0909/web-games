/**
 * Created by Oleg on 16.12.19.
 */

var Forces = function () {
    this.shownForces = [];

    this.load();

    this.forceView = undefined;
    this.onceForceClosed = undefined;
};

Forces.prototype.isRunningForce = function (force) {
    return this.forceView !== undefined && (force === undefined || this.forceView.force.id === force.id);
};

Forces.prototype.getRunningForce = function () {
    return this.forceView;
};

Forces.prototype.whenForceClosed = function (callback) {
    if (!this._whenForceClosedCallbacks) {
        this._whenForceClosedCallbacks = [];
    }

    this._whenForceClosedCallbacks.push(callback);
};

Forces.prototype._runForceClosedCallbacks = function () {
    if (!this._whenForceClosedCallbacks) {
        return;
    }

    this._whenForceClosedCallbacks.forEach(function (callback) {
        callback();
    });

    delete this._whenForceClosedCallbacks;
};

Forces.prototype.closeRunningForce = function () {
    this.forceView.close();

    this._runForceClosedCallbacks(this.forceView.force.id);

    if (this.forceView.force.id !== undefined) {
        this.saveForce(this.forceView.force.id);
    }

    this.forceView = undefined;

    if (this.onceForceClosed) {
        var onceForceClosed = this.onceForceClosed;
        this.onceForceClosed = undefined;
        onceForceClosed();
    }
};

Forces.prototype.reset = function () {
    this.shownForces = [];
    this.save();
};

Forces.prototype.load = function () {
    this.shownForces = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.FORCES) || [];
};

Forces.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.FORCES, this.shownForces);

    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("forces");
    }
};

Forces.prototype.getInfo = function () {
    return {
        forces: cleverapps.toBit(this.shownForces)
    };
};

Forces.prototype.updateInfo = function (data, fromServer) {
    this.shownForces = cleverapps.fromBit(data.forces || 0);

    this.save(fromServer);
};

Forces.prototype.isAvailable = function (element, force) {
    if (!element || (element && element !== ForceView.NO_ELEMENT && !element.isRunning())) {
        return false;
    }

    if (force.id !== undefined) {
        if (this.shownForces.indexOf(force.id) !== -1) {
            return false;
        }
    }

    return true;
};

Forces.prototype.isShown = function (forceId) {
    if (forceId === undefined) {
        return false;
    }
    return this.shownForces && this.shownForces.indexOf(forceId) >= 0;
};

Forces.prototype.saveForce = function (forceId) {
    if (forceId && !this.isShown(forceId)) {
        this.shownForces.push(forceId);
        this.save();
    }
};

Forces.prototype.clearForce = function (forceId) {
    var pos = this.shownForces.indexOf(forceId);
    if (pos !== -1) {
        this.shownForces.splice(pos, 1);
        this.save();
    }
};

Forces.prototype.create = function (element, force, options) {
    if (this.isAvailable(element, force)) {
        var ClassName = force.fragile ? FragileForceView : ForceView;
        this.forceView = new ClassName(element, force, options);

        return this.forceView;
    }
};

Forces.prototype.checkMainForces = function () {
    return this.checkDailyTasksForce()
        || this.checkPeriodicBonusForce()
        || this.checkBonusRoundForce()
        || this.checkHeroesForce();
};

Forces.prototype.checkDailyTasksForce = function () {
    return cleverapps.dailyTasks && cleverapps.dailyTasks.isAvailable() && !this.isShown(Forces.DAILY_TASKS_FORCE.id);
};

Forces.prototype.checkPeriodicBonusForce = function () {
    return cleverapps.periodicBonus && cleverapps.periodicBonus.isAvailable() && !this.isShown(Forces.PERIODIC_BONUS_FORCE.id);
};

Forces.prototype.checkBonusRoundForce = function () {
    return cleverapps.bonusRoundChest && cleverapps.bonusRoundChest.isActive() && !this.isShown(Forces.BONUS_ROUND_FORCE.id);
};

Forces.prototype.checkHeroesForce = function () {
    return typeof match3 !== "undefined" && match3.heroes.available() && !this.isShown(Forces.HEROES_AVAILABLE.id);
};

// Forces.HALLOWEEN_FORCE = 2;
// Forces.THANKSGIVING_FORCE = 4;
// Forces.CHRISTMAS_FORCE = 5;
// Forces.VALENTINES_FORCE = 6;
// Forces.TOURNAMENT_FORCE = 7;
// Forces.EASTER_FORCE = 8;
// Forces.LEADERS_FORCE = 9;
// Forces.SHOP_HINTS_TAB_FORCE = 11;
// Forces.SHOP_BOOSTERS_TAB_FORCE = 13;
// Forces.ALL_LETTERS_BOOSTER_FORCE = 14;

Forces.FREE_UNDO_FORCE = {
    id: 2,
    text: "UndoTutorialMessage"
};

Forces.FREE_HINT_FORCE = {
    id: 3,
    text: "hintTutorialMessage"
};

Forces.FIRST_BOOSTERS_BEFORE = {
    id: 4,
    text: "FirstBoostersBefore.force",
    position: Dialogue.POSITIONS.BOTTOM
};

Forces.SECOND_BOOSTERS_BEFORE = {
    id: 5,
    text: "SecondBoostersBefore.force",
    position: Dialogue.POSITIONS.BOTTOM
};

Forces.THIRD_BOOSTERS_BEFORE = {
    id: 6,
    text: "ThirdBoostersBefore.force",
    position: Dialogue.POSITIONS.BOTTOM
};

Forces.FREE_PAINT_FORCE = {
    id: 8,
    text: "Paint.force"
};

Forces.DAILY_TASKS_FORCE = {
    id: 10,
    text: "Forces.DailyTasks"
};

Forces.COOLDOWN_FORCE = {
    id: 11,
    text: "CoolDownNode.force",
    button: {
        text: "SkipButton"
    },
    finger: false
};

Forces.PERIODIC_BONUS_FORCE = {
    id: 12,
    text: "Forces.PeriodicBonus"
};

Forces.FOG_EXPLORE = {
    id: 13
};

Forces.HEROES_AVAILABLE = {
    id: 17,
    text: "Forces.HeroesAvailable"
};

Forces.DAILY_CUP = {
    id: 18,
    text: "Cups.daily.force"
};

Forces.LANTERN = {
    id: 20,
    text: "LanternWindow.force"
};

Forces.BONUS_ROUND_FORCE = {
    id: 21,
    text: "Forces.BonusRound"
};

Forces.UNLOCK_HEROES = {
    text: "Forces.UnlockHero"
};

Forces.UPGRADE_HEROES = {
    text: "Forces.UpgradeFirstHero"
};

Forces.METHA_PLAY_BUTTON = {
    id: 23,
    controls: ["play_button"],
    text: function () {
        if (cleverapps.meta.getType() === Metha.SIMPLE) {
            return "SimpleMethaPlayButton.force";
        }
        return "MethaPlayButton.force";
    },
    position: Dialogue.POSITIONS.TOP_LOWER
};

Forces.KNOCKOUT_PLAYERS = {
    id: 24,
    text: "KnockoutPlayers.force",
    button: {
        text: "SkipButton"
    },
    finger: false,
    closeByTouchInShadow: true
};

Forces.KEYPAD = {
    id: 25,
    text: "Keypad.force",
    button: {
        text: "SkipButton"
    },
    finger: false,
    position: function () {
        if (cleverapps.config.type === "differences") {
            return Dialogue.POSITIONS.TOP;
        }
        return undefined;
    }
};

Forces.COOKIEJAR = {
    id: 27,
    text: "Cookiejar.force",
    button: {
        text: "OK"
    },
    closeByTouchInShadow: true
};

Forces.CRYPTEX = {
    id: 28,
    text: "Cryptex.force",
    fragile: true
};

Forces.FREE_SHUFFLE_FORCE = {
    id: 29,
    text: "ShuffleBooster.force"
};

Forces.PHOTO_CLOVER = {
    id: 30,
    text: "PhotoClover.force"
};

Forces.TRICKY_LEVEL = {
    id: 31,
    text: "TrickyLevelForce",
    finger: false
};

Forces.SIMPLE = {
    id: 32,
    text: "Simple.Force"
};

Forces.BONUS_WORLD = {
    id: 33
};

Forces.SLOT_MACHINE_ICON = {
    id: 34,
    text: "SlotMachine.IconForce"
};

Forces.SLOT_MACHINE = {
    id: 35,
    text: "SlotMachine.Force"
};

Forces.BUY_ENERGY_ICON = {
    id: 36,
    text: "BuyEnergy.IconForce",
    productKey: "buyEnergy350",
    productOptions: {
        price: 0,
        reward: 30
    }
};

Forces.UNITS_SHOP_ICON = {
    id: 37,
    text: "UnitsShop.IconForce"
};

Forces.SLOT_MACHINE_HELP = {
    id: 38,
    text: "SlotMachine.HelpForce"
};

Forces.QUEST_ICON = {
    id: 39,
    text: "Quest.IconForce"
};

Forces.TRAVEL_BOOK = {
    id: 40,
    text: function () {
        return cleverapps.travelBook.chosenForForce.forceText;
    },
    person: "king"
};

Forces.PERIODIC_SALE = {
    id: 41,
    text: function () {
        var lottery = cleverapps.eventManager.getFeatureEvent("lottery");
        if (lottery && lottery.options.vkSaleDay) {
            return "PeriodicSale.vkforce";
        }
        return "PeriodicSale.force";
    }
};

Forces.PERIODIC_PACK = {
    id: 26,
    text: "PeriodicPack.force"
};

Forces.CLANS_ICON = {
    id: 42,
    text: "Clans.force"
};

Forces.OFFER_ICON_SLOT1 = {
    id: 43,
    text: "Offer.IconForce"
};

Forces.OFFER_ICON_SLOT2 = {
    id: 44,
    text: "Offer.IconForce"
};

Forces.LEVELPASS = {
    id: 45,
    text: "LevelPass.force"
};

Forces.SECOND_LANDMARK = {
    id: 46
};

Forces.LANDMARK_DONOR_SLOT1 = {
    id: 47,
    text: "Landmarks.force"
};

Forces.LANDMARK_DONOR_SLOT2 = {
    id: 48,
    text: "Landmarks.force"
};

Forces.CHAIN_SALE = {
    id: 50,
    text: "ChainSale.force"
};

Forces.FREE_VACUUM_FORCE = {
    id: 22,
    text: "VacuumBooster.force"
};

Forces.FREE_PROLONGATION_FORCE = {
    id: 51,
    text: "Prolongation.force"
};

Forces.FREE_REPLACE_ALL_FORCE = {
    id: 7,
    text: "ReplaceAllBooster.force"
};

Forces.FREE_NEXT_PIECES_FORCE = {
    id: 16,
    text: "ClearPiecesBooster.force"
};

Forces.FREE_UNDO_PIECE = {
    id: 19,
    text: "UndoPieceBooster.force"
};

Forces.FREE_BOMB_FORCE = {
    id: 9,
    text: "outOfBombMovesHint"
};

Forces.TROOP_CARDS_FORCE = {
    id: 14,
    text: "TroopCards.force"
};

Forces.MENU_BAR_SOFT_FORCE = {
    id: 15,
    text: "SoftForce",
    finger: {
        useForceTarget: true
    },
    available: {
        level: 1.6
    },
    productKey: "softCurrencyVerySmall",
    productOptions: {
        price: 0
    }
};

Forces.BLOCK_TUTORIAL = {
    text: "Blocks.TutorialMessage1",
    position: Dialogue.POSITIONS.TOP_LOWER,
    finger: {
        delay: 10
    }
};

// MAXIMUM FORCE NEED TO BE LESS THAN 52 FOR NOW
