/**
 * Created by slava on 4/14/17.
 */

var CustomSyncers = {
    extractors: {
        users: function () {
            if (!cleverapps.user) {
                return;
            }
            return cleverapps.user.getInfo();
        },

        tournament: function () {
            if (!Game.currentGame || !Game.currentGame.competition || !Game.currentGame.competition.options || Game.currentGame.competition.options.type !== "tournament") {
                return;
            }
            return {
                level: Game.currentGame.competition.options.level.getHumanReadableNumber(),
                results: Game.currentGame.competition.options.players
            };
        },

        userdelete: function () {
            return cleverapps.userDelete.getInfo();
        },

        bonuses: function () {
            if (!cleverapps.periodicBonus) {
                return;
            }
            return {
                event: cleverapps.periodicBonus.when
            };
        },

        bonusgames: function () {
            if (!cleverapps.bonusRoundChest) {
                return;
            }
            return {
                event: cleverapps.bonusRoundChest.when
            };
        },

        settings: function () {
            if (!cleverapps.settings) {
                return;
            }
            return cleverapps.settings.getSaveInfo();
        },

        serverflags: function () {
            if (!cleverapps.serverFlags) {
                return;
            }
            return cleverapps.serverFlags.getInfo();
        },

        tempgoods: function () {
            if (!cleverapps.unlimitedLives) {
                return;
            }
            return cleverapps.unlimitedLives.getInfo();
        },

        boosters: function () {
            if (!cleverapps.boosters) {
                return;
            }
            return cleverapps.boosters.data;
        },

        starchests: function () {
            if (!cleverapps.starChest) {
                return;
            }
            return {
                stars: cleverapps.starChest.stars
            };
        },

        packs: function () {
            if (!cleverapps.packManager) {
                return;
            }
            return {
                used: cleverapps.packManager.used
            };
        },

        dailytasks: function () {
            if (!cleverapps.dailyTasks) {
                return;
            }
            return cleverapps.dailyTasks.getInfo();
        },

        missions: function () {
            if (!cleverapps.missionManager) {
                return;
            }
            return cleverapps.missionManager.getInfo();
        },

        piggybank: function () {
            if (!cleverapps.piggyBank) {
                return;
            }
            return cleverapps.piggyBank.getInfo();
        },

        heroes: function () {
            if (typeof match3 === "undefined" || !match3 || !match3.heroes) {
                return;
            }
            return match3.heroes.getInfo();
        },

        subscription: function () {
            return cleverapps.subscription.getInfo(true);
        },

        forces: function () {
            if (!cleverapps.forces) {
                return;
            }
            return cleverapps.forces.getInfo();
        },

        metha: function () {
            if (!cleverapps.meta.getMainObject().getInfo) {
                return;
            }

            return cleverapps.meta.getMainObject().getInfo();
        },

        cookiejar: function () {
            if (!levels || !levels.cookieJar) {
                return;
            }
            return levels.cookieJar.getCounterValue();
        },

        competitionstatistics: function () {
            if (!cleverapps.competitionStatistics) {
                return;
            }
            return cleverapps.competitionStatistics.getInfo();
        },

        growthfund: function () {
            if (!cleverapps.growthFund) {
                return;
            }
            return cleverapps.growthFund.getInfo();
        },

        unitsshop: function () {
            if (!cleverapps.unitsShop) {
                return;
            }
            return cleverapps.unitsShop.getInfo();
        },

        unitslibrary: function () {
            if (!cleverapps.unitsLibrary) {
                return;
            }
            return cleverapps.unitsLibrary.getInfo();
        },

        paymentshistory: function () {
            if (!cleverapps.paymentsHistory) {
                return;
            }
            return cleverapps.paymentsHistory.getInfo();
        },

        army: function () {
            if (!cleverapps.army) {
                return;
            }

            return cleverapps.army.getInfo();
        },

        armylibrary: function () {
            if (!cleverapps.armyLibrary) {
                return;
            }

            return cleverapps.armyLibrary.getInfo();
        },

        achievements: function () {
            if (!cleverapps.achievements) {
                return;
            }
            return cleverapps.achievements.getInfo();
        }
    },

    importerData: {
        users: function (serverData) {
            var user = cleverapps.user;
            if (!user) {
                return;
            }

            user.updateInfo(serverData);

            if (cleverapps.hose) {
                cleverapps.hose.reset();
                cleverapps.hose.setCurrentEpisode(cleverapps.user.episode);
            }
            if (cleverapps.playButton) {
                cleverapps.playButton.update();
            }
        },

        tournament: function (serverData) {
            if (serverData && serverData.level && serverData.results) {
                cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.COMPETITION + "_tournament", serverData);
            }
        },

        userdelete: function (serverData) {
            cleverapps.userDelete.updateInfo(serverData);
        },

        bonuses: function (serverData) {
            if (!cleverapps.periodicBonus) {
                return;
            }

            var bonus = cleverapps.periodicBonus;

            if (serverData.event < bonus.when || serverData.event > (Date.now() + bonus.interval)) {
                return;
            }

            bonus.locked = true;
            bonus.setWhenUnlock(serverData.event);
            bonus.save(false);
            bonus.changeLockedListener();
        },

        bonusgames: function (serverData) {
            if (!cleverapps.bonusRoundChest) {
                return;
            }

            var bonusGame = cleverapps.bonusRoundChest;
            if (serverData.event < bonusGame.when || serverData.event > (Date.now() + bonusGame.interval)) {
                return;
            }

            bonusGame.locked = true;
            bonusGame.setWhenUnlock(serverData.event);
            bonusGame.save(false);
            bonusGame.changeLockedListener();
        },

        settings: function () {
        },

        boosters: function (serverData) {
            if (!cleverapps.boosters) {
                return;
            }

            cleverapps.boosters.data = serverData;
            cleverapps.boosters.save(false);

            cleverapps.boosters.addInitAmount();
        },

        serverflags: function (serverData) {
            if (!cleverapps.serverFlags) {
                return;
            }

            cleverapps.serverFlags.updateInfo(serverData, true);
        },

        tempgoods: function (serverData) {
            if (!cleverapps.unlimitedLives) {
                return;
            }

            cleverapps.unlimitedLives.updateInfo(serverData, true);
        },

        missions: function (serverData) {
            if (!cleverapps.missionManager) {
                return;
            }
            cleverapps.missionManager.updateInfo(serverData, true);
            cleverapps.travelBook.updatePages();
        },

        piggybank: function (serverData) {
            if (!cleverapps.piggyBank) {
                return;
            }
            cleverapps.piggyBank.updateInfo(serverData, true);
        },

        starchests: function (serverData) {
            if (!cleverapps.starChest) {
                return;
            }

            cleverapps.starChest.updateInfo(serverData, true);
        },

        packs: function (serverData) {
            if (!cleverapps.packManager) {
                return;
            }

            cleverapps.packManager.used = serverData.used;
            cleverapps.packManager.save(false);
        },

        dailytasks: function (serverData) {
            if (!cleverapps.dailyTasks) {
                return;
            }

            cleverapps.dailyTasks.load(serverData);
            cleverapps.dailyTasks.save(false);
            cleverapps.dailyTasks.update();
        },

        heroes: function (serverData) {
            if (typeof match3 === "undefined" || !match3 || !match3.heroes) {
                return;
            }

            match3.heroes.updateInfo(serverData, true);
        },

        subscription: function (serverData) {
            cleverapps.subscription.updateInfo(serverData, true);
        },

        forces: function (serverData) {
            if (!cleverapps.forces) {
                return;
            }
            cleverapps.forces.updateInfo(serverData, true);
        },

        metha: function (serverData) {
            if (cleverapps.meta.getType() === Metha.HOSE) {
                return;
            }

            if (!cleverapps.meta.getMainObject().updateInfo) {
                return;
            }

            cleverapps.meta.getMainObject().updateInfo(serverData);
        },

        cookiejar: function (serverData) {
            var countOfCookies = serverData && serverData.counterValue !== undefined ? serverData.counterValue : serverData || 0;
            cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.COOKIE_JAR, countOfCookies);

            if (levels && levels.cookieJar) {
                levels.cookieJar.load();
            }
        },

        competitionstatistics: function (serverData) {
            if (!cleverapps.competitionStatistics) {
                return;
            }
            cleverapps.competitionStatistics.updateInfo(serverData, true);
        },

        growthfund: function (serverData) {
            if (!cleverapps.growthFund) {
                return;
            }

            cleverapps.growthFund.updateInfo(serverData);
        },

        unitsshop: function (serverData) {
            cleverapps.unitsShop && cleverapps.unitsShop.updateInfo(serverData);
        },

        unitslibrary: function (serverData) {
            cleverapps.unitsLibrary && cleverapps.unitsLibrary.updateInfo(serverData);
        },

        paymentshistory: function (serverData) {
            if (!cleverapps.paymentsHistory) {
                return;
            }
            cleverapps.paymentsHistory.updateInfo(serverData);
        },

        army: function (serverData) {
            if (!cleverapps.army) {
                return;
            }

            return cleverapps.army.updateInfo(serverData);
        },

        armylibrary: function (serverData) {
            if (!cleverapps.armyLibrary) {
                return;
            }

            return cleverapps.armyLibrary.updateInfo(serverData);
        },

        achievements: function (serverData) {
            if (!cleverapps.achievements) {
                return;
            }
            cleverapps.achievements.load(serverData);
            cleverapps.achievements.save(false);
        }
    },

    registerBySlots: function (name, extractor, importer) {
        CustomSyncers.SLOTS.forEach(function (slot) {
            this.extractors[name + slot] = function () {
                return extractor(slot);
            };

            this.importerData[name + slot] = function (serverData) {
                return importer(slot, serverData);
            };
        }.bind(this));

        if (cleverapps.config.debugMode) {
            this.extractors[name + "_snapshot"] = extractor;
            this.importerData[name + "_snapshot"] = importer;

            extractor.useSlots = true;
            importer.useSlots = true;
        }
    }
};

CustomSyncers.SLOT_MAIN = "";
CustomSyncers.SLOTS = [CustomSyncers.SLOT_MAIN];

if (cleverapps.config.type === "merge") {
    CustomSyncers.EXPEDITION_SLOT1 = "1";
    CustomSyncers.EXPEDITION_SLOT2 = "2";
    CustomSyncers.EXPEDITION_SLOT3 = "3";

    CustomSyncers.SLOTS = [CustomSyncers.SLOT_MAIN, CustomSyncers.EXPEDITION_SLOT1, CustomSyncers.EXPEDITION_SLOT2, CustomSyncers.EXPEDITION_SLOT3];
}
