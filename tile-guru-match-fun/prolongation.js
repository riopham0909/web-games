/**
 * Created by Andrey Popov on 22.04.20
 */

var Prolongation = function () {
    this.counter = 0;

    this.onAddMoves = function () {};
    this.onCompleteOffer = function () { };
};

Prolongation.prototype.getOffer = function (type, noFree) {
    var moves;
    if (type === Prolongation.TYPES.MOVES) {
        moves = 5;
    } else if (type === Prolongation.TYPES.BOMB && cleverapps.config.type === "tile3" && Game.currentGame.open.isFull()) {
        moves = 3;
    }
    if (levels.user.getFloatLevel() < 1.4 && !cleverapps.forces.isShown(Forces.FREE_PROLONGATION_FORCE.id) && !noFree) {
        return {
            type: type,
            priceType: "free",
            price: 0,
            moves: moves,
            text: "FREE",
            force: Forces.FREE_PROLONGATION_FORCE
        };
    }

    if (this.isAdAvailable()) {
        return {
            type: type,
            priceType: "ads",
            moves: moves,
            text: "##"
        };
    }

    var price = this.isCustomWhaleFirstStep() ? 250 : Prolongation.PRICES[this.counter];
    if (type === Prolongation.TYPES.MOVES && this.isCustomWhaleFirstStep()) {
        moves = 10;
    }
    return {
        type: type,
        priceType: "currency",
        price: price,
        moves: moves,
        text: (cleverapps.config.soft ? "@@" : "$$") + price
    };
};

Prolongation.prototype.acceptOffer = function (offer) {
    switch (offer.priceType) {
        case "free":
            this.addMoves(offer.moves, {
                price: offer.price,
                delay: cleverapps.config.type === "solitaire" ? 1 : undefined
            });

            if (cleverapps.forces.isRunningForce()) {
                cleverapps.forces.closeRunningForce();
            }

            break;

        case "ads":
            cleverapps.rewardedAdsManager.loadAndPlay({
                type: RewardedAdsManager.REWARDED,
                adLimit: AdsLimits.TYPES.PROLONGATION,
                callback: function () {
                    this.addMoves(offer.moves);
                    cleverapps.adsLimits.watch(AdsLimits.TYPES.PROLONGATION);
                }.bind(this),
                onCancelCallback: function () {
                    var currentWindow = cleverapps.windows.currentWindow();
                    if (currentWindow) {
                        currentWindow.close();
                    }
                }
            });

            break;

        case "currency":
            var spend = levels.user.spendHard.bind(levels.user);

            if (cleverapps.config.soft) {
                spend = levels.user.spendSoft.bind(levels.user);
            }

            if (spend(cleverapps.EVENTS.SPENT.CONTINUE, offer.price)) {
                this.addMoves(offer.moves, {
                    price: offer.price
                });
                this.escalateToUpperLevel();

                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.HINT_USED, { value: offer.price });
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MOVES_BOUGHT + "_" + offer.price);
            }
            break;
    }
};

Prolongation.prototype.isAdAvailable = function () {
    return cleverapps.adsLimits.state(AdsLimits.TYPES.PROLONGATION) === AdsLimits.STATE_READY
        && cleverapps.rewardedAdsManager.isAvailable(RewardedAdsManager.REWARDED);
};

Prolongation.prototype.isCustomWhaleFirstStep = function () {
    return this.counter === 0 && (levels.user.gold > 500
        || cleverapps.paymentsHistory.classify() === cleverapps.PaymentsHistory.BRACKET_WHALE
        || cleverapps.paymentsHistory.classify() === cleverapps.PaymentsHistory.BRACKET_BIGWHALE);
};

Prolongation.prototype.escalateToUpperLevel = function () {
    this.counter++;

    if (this.counter >= Prolongation.PRICES.length && !cleverapps.highscore) {
        this.counter = Prolongation.PRICES.length - 1;
    }
};

Prolongation.prototype.getAlertMessage = function () {
    var game = Game.currentGame;
    var mission = game.secondaryMission;

    var lantern = Lantern.Get();
    var percent = game.getPercentOfCompletion();
    var goldCollected = game.rewards[GameBase.REWARD_HARD];

    var type = undefined;
    if (game.rewards[GameBase.REWARD_BOOSTERS]) {
        type = Prolongation.GIVE_UP_TYPES.BOOSTER;
    } else if (lantern && lantern.isActive(game.level) && lantern.getCurrentStreak() > 0) {
        type = Prolongation.GIVE_UP_TYPES.LANTERN;
    } else if (mission && mission.isRunning() && game.rewards.clover > 0) {
        type = Prolongation.GIVE_UP_TYPES.MISSION;
    } else if (goldCollected && goldCollected > 0) {
        type = Prolongation.GIVE_UP_TYPES.GOLD_COLLECTED;
    } else if (percent >= 0.70) {
        type = Prolongation.GIVE_UP_TYPES.NEARLY;
    }

    if (type === undefined) {
        return;
    }

    var message = [Messages.get("GiveUpAlert.text1")];

    if (type === Prolongation.GIVE_UP_TYPES.NEARLY) {
        message.push(Messages.get("AddMovesWindow.nearlyDoneGiveUp"));
    }

    if (cleverapps.ListBreaks().length > 0) {
        message.push(Messages.get("GiveUpAlert.text2"));
    }

    return message.join("\n");
};

Prolongation.prototype.getText = function (type) {
    if (type === Prolongation.TYPES.BOMB) {
        return Messages.get("PostponeBombWindow.addMoves", {
            moves: BombOnCard.MOVES_TO_ADD
        });
    }

    if (type === Prolongation.TYPES.FLAGS) {
        return Messages.get("RemoveFlagsWindow.text");
    }

    return Messages.get("ProlongationWindow.addMoves");
};

Prolongation.prototype.hasOffer = function () {
    return Prolongation.PRICES[this.counter] !== undefined;
};

Prolongation.prototype.addMoves = function (moves, options) {
    options = options || {};

    this.onAddMoves(moves, options);

    if (Game.currentGame) {
        if (moves) {
            Game.currentGame.setMoves(moves, options);
        }
    }
};

Prolongation.GIVE_UP_TYPES = {
    BOOSTER: 0,
    LANTERN: 1,
    MISSION: 2,
    GOLD_COLLECTED: 3,
    NEARLY: 4
};

Prolongation.PRICES = [
    100,
    300,
    500,
    700,
    1000
];

if (cleverapps.config.type === "tile3") {
    Prolongation.PRICES = [
        295,
        295,
        295,
        295,
        295
    ];
}

Prolongation.TYPES = {};
Prolongation.TYPES.MOVES = 1;
Prolongation.TYPES.BOMB = 2;
Prolongation.TYPES.FLAGS = 3;
