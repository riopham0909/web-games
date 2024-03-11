/**
 * Created by r4zi4l on 22.06.2022
 */

var RewardTypes = {};

// GameBase.REWARD_HARD
RewardTypes.hard = RewardTypes.rubies = {
    icon: bundles.reward_icons.frames.reward_gold_png,
    smallIcon: bundles.reward_icons.frames.gold_small_png,
    controls: "MenuBarGoldItem",
    flyingAnimation: Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value, options) {
        if (!cleverapps.isNumber(value)) {
            cleverapps.throwAsync("RewardTypes.hard - " + value);
            value = 0;
        }
        cleverapps.user.earnHard(options.event, value, true);
        return function () {
            cleverapps.user.onChangeGold();
        };
    }
};

RewardTypes.soft = {
    icon: bundles.reward_icons.frames.reward_coin_png,
    smallIcon: bundles.reward_icons.frames.coin_small_png,
    controls: "MenuBarCoinsItem",
    bundle: "episode_0",
    flyingAnimation: Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value) {
        if (!cleverapps.isNumber(value)) {
            cleverapps.throwAsync("RewardTypes.soft - " + value);
            value = 0;
        }
        cleverapps.user.setSoft(cleverapps.user.soft + value, true);
        return function () {
            cleverapps.user.trigger("changeSoft");
        };
    }
};

// GameBase.REWARD_EXP
RewardTypes.exp = {
    icon: bundles.reward_icons.frames.reward_exp_png,
    smallIcon: bundles.reward_icons.frames.reward_exp_small_png,
    controls: "MenuBarGameLevelItem",
    flyingAnimation: cleverapps.config.type === "merge" && Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value) {
        var expAvailable = cleverapps.exp.isAvailable();
        if (!cleverapps.isNumber(value)) {
            cleverapps.throwAsync("RewardTypes.exp - " + value);
            value = 0;
        }
        if (expAvailable) {
            cleverapps.exp.setExp(cleverapps.exp.getExp() + value, true);
        }
        return function () {
            if (expAvailable) {
                cleverapps.exp.onChange();
            }
        };
    }
};

// GameBase.REWARD_BOOSTERS
RewardTypes.boosters = {
    icon: {},
    smallIcon: {},

    handler: function (value) {
        var available = value.amount > 0;
        if (available) {
            cleverapps.boosters.add(value.id, value.amount, true);
        }
        return function () {
            if (available) {
                cleverapps.boosters.onChange();
            }
        };
    }
};

RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_CELL] = bundles.reward_icons.frames.cellbooster;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_LINE] = bundles.reward_icons.frames.linebooster;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_COLOR] = bundles.reward_icons.frames.colorbooster;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_HINT] = bundles.reward_icons.frames.hint_icon_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_WILDCARD] = bundles.reward_icons.frames.joker_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_BRUSH] = bundles.reward_icons.frames.pot;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_DISCOVER] = bundles.reward_icons.frames.hat;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_COMBO] = bundles.reward_icons.frames.heroes_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_MOVES] = bundles.reward_icons.frames.moves_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_MULTICOLOR] = bundles.reward_icons.frames.multicolor_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_MAGNET] = bundles.reward_icons.frames.magnet_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_DICE] = bundles.reward_icons.frames.dice_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_JOKERS] = bundles.reward_icons.frames.joker_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_HIGHLIGHT] = bundles.reward_icons.frames.highlight;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_EYE] = bundles.reward_icons.frames.eye;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_MAGNIFIER] = bundles.reward_icons.frames.hint;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_UNDO] = bundles.reward_icons.frames.booster_undo_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_TILE_SHUFFLE] = bundles.reward_icons.frames.booster_tile_shuffle_png;
RewardTypes.boosters.icon[cleverapps.Boosters.TYPE_VACUUM] = bundles.reward_icons.frames.booster_vacuum_png;

RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_CELL] = bundles.reward_icons.frames.cellbooster_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_LINE] = bundles.reward_icons.frames.linebooster_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_COLOR] = bundles.reward_icons.frames.colorbooster_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_HINT] = bundles.reward_icons.frames.hint_icon_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_WILDCARD] = bundles.reward_icons.frames.joker_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_BRUSH] = bundles.reward_icons.frames.pot_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_DISCOVER] = bundles.reward_icons.frames.hat_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_COMBO] = bundles.reward_icons.frames.heroes_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_MOVES] = bundles.reward_icons.frames.moves_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_MULTICOLOR] = bundles.reward_icons.frames.multicolor_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_MAGNET] = bundles.reward_icons.frames.magnet_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_DICE] = bundles.reward_icons.frames.dice_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_JOKERS] = bundles.reward_icons.frames.joker_small_png;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_HIGHLIGHT] = bundles.reward_icons.frames.highlight_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_EYE] = bundles.reward_icons.frames.eye_small;
RewardTypes.boosters.smallIcon[cleverapps.Boosters.TYPE_MAGNIFIER] = bundles.reward_icons.frames.hint_small;

RewardTypes.keys = {
    handler: function () {
        return function () {};
    }
};

RewardTypes.unlimitedLives = {
    icon: bundles.reward_icons.frames.life_unlim,
    smallIcon: bundles.reward_icons.frames.life_unlim_small,
    controls: "MenuBarLivesItem",

    handler: function (value) {
        cleverapps.unlimitedLives.buy(value.time);
        return function () {
            cleverapps.lives.onBuyUnlimitedLivesListener();
        };
    }
};

RewardTypes.stars = {
    icon: bundles.reward_icons.frames.stars_png,
    smallIcon: bundles.reward_icons.frames.stars_small_png,

    handler: function (value) {
        cleverapps.starChest.addStars(value, true);
        return function () {
            cleverapps.sideBar.resetByClassName(StarChestIcon);
            cleverapps.starChest.onChangeStars();
        };
    }
};

RewardTypes.simpleStar = {
    icon: bundles.reward_icons.frames.simple_star_png,

    handler: function (value) {
        cleverapps.simple.earnStars(value, true);
        return function () {
            cleverapps.simple.pendingsStars += value;
            cleverapps.simple.updateProgress();
        };
    }
};

RewardTypes.homeStar = {
    handler: function (value) {
        cleverapps.home.earnStars(value, true);
        return function () {
            cleverapps.home.onChangeStars();
        };
    }
};

RewardTypes.lives = RewardTypes.energy = {
    icon: bundles.reward_icons.frames.reward_energy_png || bundles.reward_icons.frames.life_png,
    smallIcon: bundles.reward_icons.frames.energy_small_png || bundles.reward_icons.frames.life_small_png,
    controls: "MenuBarLivesItem",
    flyingAnimation: Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value, options) {
        cleverapps.lives.give(value, options.event, true);
        return function () {
            cleverapps.lives.processRegenerateState(true);
            cleverapps.lives.runListeners();
        };
    }
};

RewardTypes.wands = {
    icon: bundles.reward_icons.frames.reward_wand_png,
    smallIcon: bundles.reward_icons.frames.reward_wand_small_png,
    controls: "MenuBarWandsItem",
    bundle: "episode_0",
    flyingAnimation: Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value) {
        Game.currentGame.wands += value;
        Game.currentGame.storeSave();
        return function () {
            Game.currentGame.fogs.onChangeWandsAmount();
            Game.currentGame.onChangeWandsListener();
        };
    }
};

RewardTypes.worker = {
    icon: bundles.reward_icons.frames.reward_worker_png,
    smallIcon: bundles.reward_icons.frames.worker_small_png,
    controls: "MenuBarWorkersItem",

    handler: function (value) {
        if (value.subscription) {
            Game.currentGame.workers.addSubscriptionWorker(true);
        } else {
            Game.currentGame.workers.addBonusWorkerPeriod(value.time, true);
        }
        return function () {
            Game.currentGame.workers.onChangeTotalAmount(value.amount);
        };
    }
};

RewardTypes.herolevels = {
    bundle: "heroes_game",

    handler: function (value) {
        match3.heroes.setLevel(value.color, Math.max(0, Math.min(Heroes.HEROES_MAX_LEVEL, value.level)), true);
        return function () {
            match3.heroes.onHeroChangeLevel(value.color);
        };
    }
};

RewardTypes.growthFund = {
    icon: bundles.reward_icons.frames.growth_fund_png,
    flyingAnimation: Reward.NO_ANIMATION,

    handler: function () {
        var growthFundAvailable = cleverapps.growthFund && !cleverapps.growthFund.isBought();
        if (growthFundAvailable) {
            cleverapps.growthFund.afterBuy(true);
        }
        return function () {
            if (growthFundAvailable) {
                cleverapps.growthFund.onBought();
            }
        };
    }
};

RewardTypes.units = {
    handler: function (value) {
        if (Families[value.code].type === "landmark") {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.LANDMARKS.OPEN + value.stage);
            cleverapps.unitsLibrary.openUnit(value);
            return function () {};
        }

        var centerCell = Game.currentGame.map.getScreenCenterCell();
        var units = [];

        for (var i = value.amount || 1; i > 0; --i) {
            units.push({
                code: value.code,
                stage: value.stage,
                pointsValue: value.pointsValue
            });
        }

        if (this.options.toMainWorld) {
            var pocket = new Pocket();
            pocket.addUnits(units);
            return function () {
                cleverapps.toolbar.resetByType(ToolbarItem.TRAVEL_BOOK);
            };
        }

        var spawnedUnits = [];

        units.forEach(function (unit) {
            var slot = Game.currentGame.map.findEmptySlot(centerCell.x, centerCell.y, unit);
            if (!slot) {
                Game.currentGame.pocket.addUnits(unit);
                return;
            }

            unit = new Unit(unit);
            unit.setPosition(slot.x, slot.y);
            Game.currentGame.map.add(Map2d.LAYER_UNITS, slot.x, slot.y, unit);
            spawnedUnits.push(unit);
        });

        if (!this.spawnedUnits) {
            this.spawnedUnits = [];
        }

        if (spawnedUnits.length) {
            this.spawnedUnits = this.spawnedUnits.concat(spawnedUnits);
            Game.currentGame.storeSave();
        }

        return function () {};
    }
};

RewardTypes.randomBoosters = {
    icon: bundles.reward_icons.frames.boosters_common_small_png,
    smallIcon: bundles.reward_icons.frames.boosters_common_small_png,

    handler: function () {
        return function () {};
    }
};

RewardTypes.moves = {
    icon: bundles.reward_icons.frames.moves_png,
    smallIcon: bundles.reward_icons.frames.moves_small_png,

    handler: function () {
        return function () {};
    }
};

RewardTypes.cards = {
    icon: bundles.reward_icons.frames.cards,
    flyingAnimation: Reward.SPAWN_CARDS_ANIMATION,

    handler: function (value) {
        if (!this.spawnedCards) {
            this.spawnedCards = [];
        }

        for (var i = 0; i < value; ++i) {
            var card = TileFactory.Create({}, {
                noMarks: true
            });

            this.spawnedCards.push(card);
        }

        return function () {

        };
    }
};

RewardTypes.battlePass = {
    bundle: "passbuyticket_window",

    handler: function () {
        return function () {};
    }
};

RewardTypes.mission = {
    icon: {},
    smallIcon: {},
    flyingAnimation: cleverapps.config.type === "merge" && Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value) {
        var mission = cleverapps.missionManager.findByType(value.missionType);
        if (mission && !mission.isRunning()) {
            mission = undefined;
        }
        if (mission) {
            if (mission.isPassMission() || mission.isTreasureSearchMission()) {
                cleverapps.missionManager.dispatchEvent(mission, value);
            } else if (mission.isSlotMachineMission()) {
                mission.logic.slotMachine.setTickets(mission.logic.slotMachine.tickets + value.amount, true);
            } else {
                mission.update(value.amount, undefined, true);
            }
        }

        return cleverapps.once(function () {
            if (mission) {
                mission.onUpdateMission(value.amount);

                if (mission.isSlotMachineMission()) {
                    mission.logic.slotMachine.trigger("updateTickets");
                }
            }
        });
    }
};

RewardTypes.kraken = {
    icon: bundles.reward_icons.frames.tentacle_png,
    flyingAnimation: Reward.NO_ANIMATION,

    handler: function () {
        Game.currentGame.monstersPlanner.spawnToAllSlots();
        return function () {};
    }
};

RewardTypes.pawsPoints = {
    icon: bundles.reward_icons.frames.paw_png,
    flyingAnimation: Reward.JUMP_COLLECT_ANIMATION,
    handler: function (value) {
        return function () {
            if (Game.currentGame.pawBox) {
                Game.currentGame.pawBox.addPoints(value);
            }
        };
    }
};

RewardTypes.mission.icon[Mission.TYPE_SOFTFEAST] = bundles.reward_icons.frames.reward_coin_png;

RewardTypes.mission.icon[Mission.TYPE_TREASURE_SEARCH] = bundles.reward_icons.frames.reward_shovel_png;

RewardTypes.slotMachineTicket = {
    icon: bundles.reward_icons.frames.slot_machine_ticket,

    handler: function (value) {
        var mission = cleverapps.missionManager.findByType(Mission.TYPE_SLOT_MACHINE);
        return RewardTypes.mission.handler({
            missionType: mission && mission.type,
            amount: value
        });
    }
};

// GameBase.REWARD_PIGGY_BANK
RewardTypes.piggyBank = {
    bundle: "piggy_bank_reward",

    handler: function (value) {
        if (cleverapps.piggyBank.isActive()) {
            cleverapps.piggyBank.add(value);
        }
        return function () {};
    }
};

// GameBase.REWARD_SECONDARY
RewardTypes.clover = {
    handler: function (value) {
        var mission = Game.currentGame && Game.currentGame.secondaryMission;
        return RewardTypes.mission.handler({
            missionType: mission && mission.type,
            amount: value
        });
    }
};

// GameBase.REWARD_PRIMARY
RewardTypes.background_clover = {
    handler: function (value) {
        var mission = Game.currentGame && Game.currentGame.primaryMission;
        return RewardTypes.mission.handler({
            missionType: mission && mission.type,
            amount: value
        });
    }
};

RewardTypes.lantern = {
    handler: function () {
        return function () {};
    }
};

RewardTypes.cup = {
    icon: {},
    smallIcon: {},
    flyingAnimation: Reward.JUMP_COLLECT_ANIMATION,

    handler: function (value) {
        var cup;

        switch (value.type) {
            case CupsConfig.TYPE_DAILY: cup = cleverapps.dailyCup; break;
            case CupsConfig.TYPE_WEEKLY: cup = cleverapps.weeklyCup; break;
            case CupsConfig.TYPE_CLAN: cup = cleverapps.clanCup; break;
        }

        if (cup) {
            cup.addAmount(value.amount);

            if (cup.innerCup) {
                cup.innerCup.addAmount(value.amount);
            }
        }

        return function () {};
    }
};

RewardTypes.troopCards = {};
RewardTypes.troop = {
    handler: function (value) {
        cleverapps.formation.receiveNewSquad(value);
    }
};

RewardTypes.cup.icon[CupsConfig.TYPE_CLAN] = bundles.reward_icons.frames.cup_png;

RewardTypes.cup.smallIcon[CupsConfig.TYPE_CLAN] = bundles.reward_icons.frames.cup_small_png;
