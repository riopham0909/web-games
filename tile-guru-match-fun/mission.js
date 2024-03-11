/**
 * Created by mac on 7/23/18
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../utils");
}

var Mission = function (type, data, fromServer) {
    this.started = undefined;
    this.type = type;
    this.state = Mission.STATE_RUNNING;
    this.details = {};
    this.result = 0;

    this.onChangeResults = function () {};

    Object.assign(this, Missions[this.type]);

    if (this.isMinigameMission()) {
        this.currency = this.getStartCurrency();
    }

    if (this.type === Mission.TYPE_LANTERN) {
        this.result = 1;
    }

    var isNewMission = !data;

    if (!isNewMission) {
        this.load(data);
    } else {
        this.started = Date.now();
        this.needShowStartWindow = true;
    }

    if (this.oncePerEvent) {
        var event = cleverapps.eventManager.getFeatureEvent(this.feature);
        this.eventFinishTime = event ? event.finish.getTime() : Date.now();
    }

    this.startCompetition(isNewMission || fromServer);

    if (this.logic) {
        // eslint-disable-next-line new-cap
        this.logic = new this.logic(this, isNewMission);
    }

    this.onUpdateState();
};

Mission.STATE_RUNNING = 0;
Mission.STATE_COMPLETED = 1;

Mission.prototype.displayCompleted = function (cb) {
    cleverapps.meta.compound(cb, [
        function (f) {
            this.wasDisplayedCompleted = true;

            if (this.finishWindow) {
                // eslint-disable-next-line new-cap
                new this.finishWindow(this);
                cleverapps.meta.onceNoWindowsListener = f;
            } else {
                f();
            }
        }.bind(this),

        function (f) {
            if (this.logic && this.logic.blowUp) {
                this.logic.blowUp(f);
            } else {
                f();
            }
        }.bind(this),

        function (f) {
            if (!this.lastChanceUsed && this.hasLastChance()) {
                this.lastChanceUsed = true;

                // eslint-disable-next-line new-cap
                new this.lastChanceView(this);
                cleverapps.meta.onceNoWindowsListener = f;
            } else {
                f();
            }
        }.bind(this),

        function (f) {
            var isInTop = this.runningCompetition && this.place < 3;
            var reward = this.receiveReward();
            var received = false;

            while (reward) {
                RewardWindow.createMissionWindow(reward, this, {
                    shareId: isInTop && "tournament"
                });
                received = true;
                reward = this.receiveReward();
            }

            if (this.canRemove() || this.manualFinish) {
                if (this.logic && this.logic.beforeRemove) {
                    this.logic.beforeRemove();
                }

                cleverapps.missionManager.remove(this, false);
            }

            if (received) {
                cleverapps.meta.onceNoWindowsListener = f;
            } else {
                f();
            }
        }.bind(this)
    ]);
};

Mission.prototype.onUpdateState = function () {
    if (this.countdown) {
        this.countdown.remove();
        delete this.countdown;
    }

    if (this.isRunning()) {
        var leftTime = this.getTimeLeft();
        if (leftTime > 0) {
            this.countdown = new cleverapps.CountDown(leftTime, {
                onFinish: this.onUpdateState.bind(this),
                permanent: true
            });
        }
    } else {
        this.complete();
        if (this.runningCompetition) {
            this.runningCompetition.stop();
        }
        if (this.logic && this.logic.stop) {
            this.logic.stop();
        }
    }

    this.updateMissionIcon();
};

Mission.prototype.updateMissionIcon = function () {
    var icon = cleverapps.sideBar.findMissionIcon(this.type);
    if (icon) {
        icon.resetState();
    }
};

Mission.prototype.userInfoChanged = function (oldId) {
    this.runningCompetition.onUserInfoChanged(oldId);

    cleverapps.missionManager.table.resetResults(this.type);

    this.resultsChanged();
};

Mission.prototype.resultsChanged = function () {
    this.onChangeResults();

    if (this.logic && this.logic.onChangeResults) {
        this.logic.onChangeResults();
    }
};

Mission.prototype.beforeRemove = function () {
    if (this.countdown) {
        this.countdown.remove();
        delete this.countdown;
    }

    if (this.runningCompetition) {
        this.runningCompetition.stop();
    }

    if (this.logic && this.logic.stop) {
        this.logic.stop(true);
    }

    this.removeChildMissions();
};

Mission.prototype.load = function (data) {
    this.started = data.started;
    this.result = data.result;
    this.details = data.details;
    this.currency = data.currency;
};

Mission.prototype.update = function (data, details, silent) {
    if (!this.isRunning()) {
        data = undefined;
        details = undefined;
    }
    this.increaseResult(data, details, silent);
};

Mission.prototype.increaseResult = function (data, details, silent) {
    if (data || details) {
        this.result += data;
        if (details) {
            this.details = details;
        }
        cleverapps.user.incProgressCompare();
    }

    if (this.runningCompetition && data) {
        this.runningCompetition.updatePlayerResult(cleverapps.platform.getUserID(), this.result);
    }

    cleverapps.missionManager.save();

    if (!silent) {
        this.onUpdateMission(data);
    }
};

Mission.prototype.onUpdateMission = function (data) {
    this.onUpdateState();
    this.onChangeResults();

    if (this.logic && this.logic.onUpdateMission) {
        this.logic.onUpdateMission(data);
    }
};

Mission.prototype.canRemoveSilently = function () {
    if (this.logic) {
        if (this.logic.canRemoveSilently) {
            return this.logic.canRemoveSilently();
        }
        return false;
    }

    if (this.result === 0) {
        return true;
    }

    var place = this.getSummary().place;
    return place === "?";
};

Mission.prototype.canRemove = function () {
    if (this.manualFinish) {
        return false;
    }

    if (this.logic && this.logic.canRemove) {
        return this.logic.canRemove();
    }

    return this.rewardsReceived;
};

Mission.prototype.hasLastChance = function () {
    if (!this.lastChanceView) {
        return false;
    }

    if (!this.canRemove() && !this.manualFinish) {
        return false;
    }

    if (this.logic && this.logic.hasLastChance) {
        return this.logic.hasLastChance();
    }

    return false;
};

Mission.prototype.receiveReward = function () {
    if (this.logic && this.logic.receiveReward) {
        return this.logic.receiveReward();
    }

    if (this.rewardsReceived) {
        return;
    }

    var prize = this.getPrize();

    if (prize && prize.unit && !this.mainWorldReward) {
        var left = cleverapps.toArray(prize.unit).length - Game.currentGame.map.countEmptySlots();
        if (left > 0) {
            Game.currentGame.centerHint.createTextHint("Spawn.nospace", { left: left });
            return;
        }
    }

    this.rewardsReceived = true;

    var textPlace = prize ? "_prize" : "_lost";
    if (this.runningCompetition && this.place === 0) {
        textPlace = "_first";
    }

    var event = cleverapps.EVENTS.MISSION_FINISH;

    if (cleverapps.travelBook.isExpedition()) {
        event += "_" + cleverapps.travelBook.getCurrentPage().id;
    }

    cleverapps.eventLogger.logEvent(event + textPlace);
    cleverapps.eventLogger.logEvent(event + "_" + this.type + textPlace);

    return prize;
};

Mission.prototype.skipNext = function () {
    return this.logic && this.logic.skipNext && this.logic.skipNext();
};

Mission.prototype.useMissionIntent = function (f) {
    var ViewClass = this.getViewClass();
    cleverapps.scenes.replaceScene(new ViewClass(this), f);
};

Mission.prototype.updateCurrency = function (delta, details) {
    if (delta === 0) {
        return;
    }

    if (this.currency !== undefined) {
        this.currency += delta;
        if (details) {
            this.details = details;
        }

        this.onUpdateState();
        cleverapps.missionManager.save();
    }
};

Mission.prototype.getSummary = function () {
    if (this.runningCompetition) {
        return {
            place: this.runningCompetition.calcPlace(),
            points: this.runningCompetition.player.amount
        };
    }

    return {
        place: "?",
        points: this.result
    };
};

Mission.prototype.getResults = function () {
    if (!this.runningCompetition) {
        return [];
    }

    var results = this.runningCompetition.getResults().map(function (result) {
        return {
            id: result.id,
            player: result.player,
            text: result.name,
            avatar: {
                id: result.id,
                avatar: result.avatar
            },
            amount: result.amount
        };
    });

    results.sort(function (a, b) {
        if (a.amount === b.amount && (a.player || b.player)) {
            return a.player ? -1 : 1;
        }
        return b.amount - a.amount;
    });

    results.forEach(function (result, place) {
        result.place = place + 1;
    });

    return results;
};

Mission.prototype.save = function () {
    if (this.logic && this.logic.save) {
        this.logic.save(this.details);
    }

    return {
        started: this.started,
        type: this.type,
        result: this.result,
        currency: this.currency,
        details: this.details,
        semaphore: this.semaphore
    };
};

Mission.prototype.getName = function () {
    return this.name;
};

Mission.prototype.getWindowBundleName = function () {
    return this.bundle;
};

Mission.prototype.isMinigameMission = function () {
    return this.minigame !== undefined;
};

Mission.prototype.isPassMission = function () {
    return this.logic && this.logic instanceof PassMissionLogic;
};

Mission.prototype.isExpedition = function () {
    return this.logic && this.logic instanceof ExpeditionMissionLogic;
};

Mission.prototype.isSlotMachineMission = function () {
    return this.logic && typeof SlotMachineMissionLogic !== "undefined" && this.logic instanceof SlotMachineMissionLogic;
};

Mission.prototype.isTreasureSearchMission = function () {
    return this.logic && typeof TreasureSearchMissionLogic !== "undefined" && this.logic instanceof TreasureSearchMissionLogic;
};

Mission.prototype.isCompetitionMission = function () {
    return this.competition !== undefined;
};

Mission.prototype.getViewClass = function () {
    return this.view;
};

Mission.prototype.getViewConstructor = function () {
    return this.viewConstructor;
};

Mission.prototype.complete = function () {
    if (this.state === Mission.STATE_RUNNING) {
        this.state = Mission.STATE_COMPLETED;

        cleverapps.missionManager.refreshOffer(this);
    }
};

Mission.prototype.getIcon = function () {
    return Mission.getCollectIcon(this.type);
};

Mission.prototype.finishTime = function () {
    if (this.feature) {
        if (this.oncePerEvent) {
            return this.eventFinishTime;
        }
        var feature = cleverapps.eventManager.getFeatureEvent(this.feature)
            || cleverapps.eventManager.getLastFeatureEvent(this.feature);
        return feature ? feature.finish.getTime() : 0;
    }

    if (this.manualFinish) {
        return 0;
    }

    return this.started + cleverapps.parseInterval(this.duration);
};

Mission.prototype.getTimeLeft = function () {
    return Math.max(0, this.finishTime() - Date.now());
};

Mission.prototype.isRunning = function () {
    if (this.state === Mission.STATE_RUNNING) {
        if (this.manualFinish || this.getTimeLeft() > 0) {
            return true;
        }
    }
    return false;
};

Mission.prototype.isCompleted = function () {
    return this.state === Mission.STATE_COMPLETED;
};

Mission.prototype.canPlayMinigame = function () {
    return this.isMinigameMission() && this.currency && this.currency >= this.getMinigamePrice();
};

Mission.prototype.getMinigamePrice = function () {
    return this.minigame.price;
};

Mission.prototype.isMinigameReadyToFinish = function () {
    return this.isMinigameMission() && this.logic && this.logic.isMinigameReadyToFinish && this.logic.isMinigameReadyToFinish();
};

Mission.prototype.getStartCurrency = function () {
    return this.startCurrency !== undefined ? this.startCurrency : this.getMinigamePrice();
};

Mission.prototype.getMinigameClass = function () {
    return this.minigame.className;
};

Mission.prototype.getChildMissionTypes = function () {
    return (this.childMissions || []).map(function (type) {
        return Mission.CompoundType(type, this.type);
    }, this);
};
Mission.prototype.getChildMissions = function () {
    return this.getChildMissionTypes().map(function (type) {
        return cleverapps.missionManager.findByType(type);
    }).filter(function (mission) {
        return mission;
    });
};

Mission.prototype.removeChildMissions = function () {
    this.getChildMissions().forEach(function (child) {
        cleverapps.missionManager.remove(child);
    });
};

Mission.prototype.getLevelReward = function () {
    if ([Mission.TYPE_TREASURE_SEARCH].indexOf(this.type) !== -1) {
        return [1, 3, 2];
    }
    if ([Mission.TYPE_LEVELPASS].indexOf(this.type) !== -1) {
        return [3, 6, 4];
    }
    return [1, 1, 1];
};

Mission.prototype.getPrize = function () {
    if (this.logic && this.logic.getPrize) {
        return this.logic.getPrize();
    }

    if (!this.prize) {
        return;
    }

    if (this.minigame) {
        if (!this.logic.isFinished()) {
            return undefined;
        }

        if (["board", "match3"].indexOf(cleverapps.config.type) !== -1 && [Mission.TYPE_TREASURE_SEARCH, Mission.TYPE_STICKERS_COLLECTION].indexOf(this.type) !== -1) {
            return cleverapps.user.prepareRewardByRich(this.prize);
        }
        return this.prize;
    }

    this.place = this.getSummary().place;
    if (this.place < this.prize.length) {
        return this.getPrizeByPlace(this.place);
    }

    return undefined;
};

Mission.prototype.getPrizeByPlace = function (place) {
    if (cleverapps.config.type !== "merge") {
        return cleverapps.user.prepareRewardByRich(this.prize[place]);
    }
    return this.prize[place];
};

Mission.prototype.updateCompetitionResults = function () {
    if (this.runningCompetition) {
        this.runningCompetition.updatePlayerResult(cleverapps.platform.getUserID(), this.result);
    }
};

Mission.prototype.startCompetition = function (cleanData) {
    if (!this.isCompetitionMission()) {
        return;
    }

    if (cleanData) {
        Competition.CLEAN_SAVED(this.type);
    }

    var options = Competition.optionsByMission(this);
    this.runningCompetition = new Competition(options);

    this.runningCompetition.onChangeResultsListeners.mission = this.resultsChanged.bind(this);
    this.runningCompetition.onChangePlaceListener = this.updateMissionIcon.bind(this);

    cleverapps.friends.playerInfoChangedListeners.mission = this.userInfoChanged.bind(this);

    this.runningCompetition.start();
};

Mission.prototype.isAvailable = function () {
    return (this.logic && this.logic.isAvailable) ? this.logic.isAvailable() : true;
};

Mission.ParseCompoundType = function (type) {
    type = String(type).split("_");

    return {
        type: cleverapps.castType(type[0]),
        parentType: cleverapps.castType(type[1])
    };
};

Mission.GetParentType = function (type) {
    return Mission.ParseCompoundType(type).parentType;
};

Mission.GetChildType = function (type) {
    return Mission.ParseCompoundType(type).type;
};

Mission.CompoundType = function (type, parentType) {
    type = Mission.GetChildType(type);
    return parentType !== undefined ? type + "_" + parentType : type;
};

Mission.ParseTypeVersion = function (type) {
    type = Mission.ParseCompoundType(type);
    return String(type.type).split("v")[1] || 0;
};

Mission.VersionType = function (type, version) {
    type = Mission.ParseCompoundType(type);
    type.type = cleverapps.castType(String(type.type).split("v")[0]);

    if (version > 0) {
        type.type += "v" + version;
    }

    return Mission.CompoundType(type.type, type.parentType);
};

Mission.getCollectIcon = function (type) {
    return cleverapps.skins.getSlot("missionIcon", {
        type: type
    });
};

if (typeof cc === "undefined") {
    module.exports = {
        Mission: Mission
    };
}
