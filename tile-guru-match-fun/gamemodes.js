/**
 * Created by denis on 26/12/19
 */

var GameModes = function () {
    if (!cleverapps.config.debugMode) {
        return;
    }

    this.noControls = false;
    this.noBg = false;
    this.noBoosters = false;
    this.noNotifications = false;
    this.noMute = false;
    this.noGamePause = false;

    // debugging modes
    this.showAvoidRects = false;

    // wysiwyg modes
    this.showFingerAnchor = false;
    this.showMenuBarGoldItem = false;
    this.hideMenuBarCoinsItem = false;

    if (cleverapps.config.type === "merge") {
        Object.assign(this, {
            skipSpecialOffer: false,
            skipBuildingStage: false,
            skipOpenChestWindow: false,
            skipQuests: false,
            skipUnitStories: false,
            skipRestoreLandmarks: false,
            automerge: false,
            axemerge: false,
            hideGuideAndProgress: false,
            hideFruitParticlesAnimation: false,
            hideUnitPointAnimation: false,
            fastSpawnPrizes: false,
            upgradeInTwoTurns: false,
            customAnimationDidMerged: false,
            unitsPulsingDisabled: false,
            easyChop: false,
            dontCollectWands: false,
            lightUpOnHoveredUnit: false,
            hideGeneratorGuideButton: false,
            silentInfoView: false,
            silentCenterHint: false,
            fogBlockerDisabled: false,
            hideTankProgress: false,
            initFruitWithoutPrizes: false,
            initMineableWithPrizes: false,
            multipleHeroes: false,
            clans: false,
            captureToolActions: false,
            skipFlyToUnitsLibrary: false,
            skipUnitCreatePrize: false,
            skipExpPrize: false,
            muteCupsSound: false,
            scrollByFinger: false
        });
    } else if (cleverapps.config.type === "match3") {
        Object.assign(this, {
            silentGoals: false,
            multiColorCellDisabled: false,
            heroesDisabled: false,
            newRules: false
        });
    } else if (cleverapps.config.type === "klondike") {
        Object.assign(this, {
            tableAcceptAll: false
        });
    } else if (cleverapps.config.type === "blocks") {
        Object.assign(this, {
            hideScore: false,
            hideHighScore: false,
            alwaysNoMemorable: false,
            showHint: false,
            piecesAlwaysEnabled: false,
            hideSingleMoveHint: false,
            hideExplodeHint: false,
            hidePieces: false
        });
    } else if (cleverapps.config.type === "tile3") {
        Object.assign(this, {
            threeOpenCards: false,
            skipProlongation: false,
            replaceTiles: false
        });
    } else if (cleverapps.config.type === "board") {
        Object.assign(this, {
            noKeypad: false,
            noCookieJar: false,
            hideKeypadControls: false
        });
    }
};

GameModes.prototype.load = function () {
    if (!cleverapps.config.debugMode) {
        return;
    }

    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.GAME_MODES) || {};
    Object.assign(this, data);
};

GameModes.prototype.save = function () {
    var data = Object.assign({}, this);
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.GAME_MODES, data);
};

GameModes.prototype.toggle = function (mode) {
    this[mode] = !this[mode];
    this.save();
};

GameModes.prototype.listModes = function () {
    return Object.keys(this);
};
