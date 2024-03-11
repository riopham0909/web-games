/**
 * Created by vladislav on 25.02.2020
 */

var PassLevelsConfig = {};

var PassMissionLogic = function (mission, isNewMission) {
    this.mission = mission;

    this.onShowWindowListeners = {};
    this.onUpdateListeners = {};
    this.onLevelChangedListeners = {};
    this.onProgressChangedListeners = {};

    var levels = this.mission.view.LEVELS;
    var parentType = Mission.GetParentType(mission.type);
    if (PassLevelsConfig[parentType]) {
        levels = PassLevelsConfig[parentType];
    }

    var goalTotal = 0;
    this.levels = levels.map(function (level, index) {
        goalTotal += level.task.goal;

        var newLevel = Object.assign({
            level: index
        }, level);

        newLevel.task.goalTotal = goalTotal;
        return newLevel;
    });

    this.load(this.mission.details);

    if (this.checkComplete()) {
        this.mission.complete();
    }

    this.shownAvailableRewards = 0;

    if (Game.currentGame && Game.currentGame.bpPointsPlanner) {
        Game.currentGame.bpPointsPlanner.removeWrongPoints(true);

        if (isNewMission) {
            Game.currentGame.bpPointsPlanner.start();
        }
    }

    if (Mission.GetChildType(mission.type) === Mission.TYPE_EXPEDITION_PASS) {
        cleverapps.eventBus.on("gameEvent", this.onGameEvent.bind(this), this);
    }

    this.mission.onChangeResults = this.runListeners.bind(this, this.onUpdateListeners);

    this.onAnimateAmountChange = function () {};
    this.onNextAmountStep = function () {};
    this.onAnimateProgressChange = function () {};
    this.onNextProgressStep = function () {};
    this.onShowFinger = function () {};
};

PassMissionLogic.prototype.runListeners = function (listeners) {
    for (var key in listeners) {
        var listener = listeners[key];
        if (listener) {
            listener();
        }
    }
};

PassMissionLogic.prototype.showProgress = function () {
    if (this.isAllProgressShown()) {
        this.onShowFinger();
        return;
    }

    var nextProgress = this.shownProgress.level >= this.progress.level ? {
        level: this.progress.level,
        progress: this.progress.progress
    } : {
        level: this.shownProgress.level,
        progress: this.levels[this.shownProgress.level].task.goal
    };

    this.onAnimateAmountChange(this.shownProgress, nextProgress, this.levels[this.shownProgress.level].task.goal);
    this.onAnimateProgressChange(nextProgress, function () {
        if (this.shownProgress.level >= this.progress.level) {
            this.shownProgress = nextProgress;
            this.saveProgress();
            this.showProgress();
            return;
        }

        nextProgress = {
            level: this.shownProgress.level + 1,
            progress: 0
        };

        this.onNextAmountStep(nextProgress);
        this.onNextProgressStep(this.shownProgress.level, function () {
            this.shownProgress = nextProgress;
            this.saveProgress();
            this.runListeners(this.onLevelChangedListeners);
            this.showProgress();
        }.bind(this));
    }.bind(this));
};

PassMissionLogic.prototype.checkComplete = function () {
    return this.isAllTasksCompleted() && this.hasPremium() && this.countAvailableRewards() === 0;
};

PassMissionLogic.prototype.saveProgress = function () {
    this.mission.details = this.getInfo();
    this.mission.update(0, this.getInfo());
};

PassMissionLogic.prototype.load = function (data) {
    var arrayToBits = function (array) {
        return array.reduce(function (rewards, value) {
            return rewards | (1 << value);
        }, 0);
    };

    this.premium = data.premium || data.boughtPremium || undefined;

    this.rewards = data.rewards || 0;
    this.premiumRewards = data.premiumRewards || 0;
    this.progress = data.progress || 0;

    // migrate
    if (Array.isArray(data.levelsToReward)) {
        this.rewards = arrayToBits(data.levelsToReward);
    }

    if (Array.isArray(data.levelsToPremReward)) {
        this.premiumRewards = arrayToBits(data.levelsToPremReward);
    }

    if (data.currentTask) {
        var level = Math.min(data.currentTask.level || 0, this.levels.length - 1);
        var progress = data.currentTask.progress || 0;
        this.progress = this.levels[level].task.goalTotal - this.levels[level].task.goal + progress;
    }

    this.shownProgress = data.shownProgress || this.progress;

    this.progress = this._extract(this.progress);
    this.shownProgress = this._extract(this.shownProgress);

    // guard
    var mask = (1 << this.progress.level) - 1;
    this.rewards &= mask;
    this.premiumRewards &= mask;
};

PassMissionLogic.prototype.getInfo = function () {
    return {
        premium: this.premium,
        rewards: this.rewards,
        premiumRewards: this.premiumRewards,
        progress: this._compact(this.progress),
        shownProgress: this._compact(this.shownProgress)
    };
};

PassMissionLogic.prototype.completeCurrentTask = function () {
    if (this.progress.level < this.levels.length) {
        this.addProgress(this.levels[this.progress.level].task.goal - this.progress.progress);
    }
};

PassMissionLogic.prototype.takeLevelReward = function (level, premium) {
    if (!this.hasReward(level, premium)) {
        return;
    }

    var reward = premium ? this.levels[level].premiumReward : this.levels[level].reward;

    if (reward.unit && cleverapps.config.type === "merge" && !cleverapps.travelBook.isExpedition()) {
        var left = cleverapps.toArray(reward.unit).reduce(function (total, unit) {
            return total + unit.amount;
        }, 0) - Game.currentGame.map.countEmptySlots();
        if (left > 0) {
            Game.currentGame.centerHint.createTextHint("Spawn.nospace", { left: left });
            return;
        }
    }

    if (premium) {
        this.premiumRewards ^= (1 << level);
    } else {
        this.rewards ^= (1 << level);
    }
    this.saveProgress();

    this._logEventByType((premium ? cleverapps.EVENTS.PASS_RECEIVED_PREMIUM : cleverapps.EVENTS.PASS_RECEIVED) + "_" + level);

    if (this.checkComplete()) {
        this.mission.complete();
    }

    return reward;
};

PassMissionLogic.prototype.receiveReward = function () {
    if (this.mission.manualFinish) {
        for (var i = 0; i < this.levels.length; ++i) {
            var reward = this.takeLevelReward(i, false);
            if (reward) {
                return reward;
            }

            if (this.hasPremium()) {
                reward = this.takeLevelReward(i, true);
                if (reward) {
                    return reward;
                }
            }
        }
    }
};

PassMissionLogic.prototype.hasReward = function (level, premium) {
    return (premium ? this.premiumRewards : this.rewards) & (1 << level);
};

PassMissionLogic.prototype.setPremium = function () {
    this.premium = 1;
    this.runListeners(this.onUpdateListeners);
    this.saveProgress();
};

PassMissionLogic.prototype.isCompletedTaskShown = function () {
    return this.progress.level === this.shownProgress.level;
};

PassMissionLogic.prototype.isAllTasksCompleted = function () {
    return this.progress.level >= this.levels.length;
};

PassMissionLogic.prototype.isAllProgressShown = function () {
    return this.progress.level === this.shownProgress.level && this.progress.progress === this.shownProgress.progress;
};

PassMissionLogic.prototype.countAvailableRewards = function () {
    var matchArray = Number(this._getAvailableRewardsSet()).toString(2).match(/1/g);
    return matchArray && matchArray.length || 0;
};

PassMissionLogic.prototype.addProgress = function (amount) {
    if (!amount) {
        return;
    }

    var progress = this._extract(this._compact(this.progress) + amount);

    for (var i = this.progress.level; i < progress.level; i++) {
        this.rewards |= (1 << i);
        this.premiumRewards |= (1 << i);
        this._logEventByType(cleverapps.EVENTS.PASS_FINISH_TASK + "_" + i);

        var leftTime = this.mission.getTimeLeft();
        if (leftTime <= cleverapps.parseInterval("3 days")) {
            var timeout;
            if (!this.isAllTasksCompleted()) {
                var targetTime = new Date();
                targetTime.setHours(21, 0, 0);

                var tillTargetTime = targetTime - Date.now();
                if (tillTargetTime > 0 && tillTargetTime < (leftTime - cleverapps.parseInterval("10 minutes"))) {
                    timeout = tillTargetTime;
                }
            }

            cleverapps.localPushes.sendPush(cleverapps.LocalPushes.TYPES.PASS_UNCOMPLETED, timeout);
        }
    }

    this.progress = progress;
    this.saveProgress();

    this.runListeners(this.onProgressChangedListeners);
};

PassMissionLogic.prototype.hasPremium = function () {
    return this.premium;
};

PassMissionLogic.prototype.canBuyPremium = function () {
    return !this.hasPremium() && (this.mission.isRunning() || this.progress.level !== 0);
};

PassMissionLogic.prototype.canRemoveSilently = function () {
    return false;
};

PassMissionLogic.prototype.canRemove = function () {
    return this.countAvailableRewards() === 0;
};

PassMissionLogic.prototype.hasLastChance = function () {
    return !this.isAllTasksCompleted();
};

PassMissionLogic.prototype.processEvent = function (options) {
    this.addProgress(options.amount);

    if (options.sourceUnit) {
        options.sourceUnit.onClaimPoints({
            amount: options.amount,
            callback: function () {
                if (Game.currentGame.bpPointsPlanner) {
                    Game.currentGame.bpPointsPlanner.spawnOfferUnit();
                }
                this.displayWindow();
            }.bind(this)
        });
    } else {
        this.displayWindow(1000);
    }
};

PassMissionLogic.prototype.handleShowWindow = function () {
    this.shownAvailableRewards = this._getAvailableRewardsSet();
    this.runListeners(this.onShowWindowListeners);
};

PassMissionLogic.prototype.stop = function () {
    if (cleverapps.config.type === "merge" && Game.currentGame) {
        Game.currentGame.map.listAvailableUnits().forEach(function (unit) {
            if (unit.points) {
                unit.setPoints(0);
            }

            var unitsShopComponent = unit.findComponent(UnitsShopComponent);
            if (unitsShopComponent) {
                unitsShopComponent.checkPrizes();
                unitsShopComponent.checkCrystals();
            }

            var specialOffer = unit.findComponent(SpecialOffer);
            if (specialOffer && specialOffer.type === SpecialOffer.TYPE_PASS_POINTS) {
                unit.remove();
            }
        });

        if (Game.currentGame && Game.currentGame.bpPointsPlanner) {
            Game.currentGame.bpPointsPlanner.removeWrongPoints();
        }
    }

    runCleaners(this);
};

PassMissionLogic.prototype.beforeRemove = function () {
    if (cleverapps.config.type === "merge" && cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition()) {
        Game.currentGame.specialOfferPlanner.planNext({
            type: this.hasPremium() ? SpecialOffer.TYPE_PASS_FINISH_PREMIUM : SpecialOffer.TYPE_PASS_FINISH,
            delay: 200,
            target: this.levels[this.levels.length - 1].premiumReward.unit
        });
    }
};

PassMissionLogic.prototype.onGameEvent = function (type, options) {
    if (cleverapps.travelBook.isExpedition() && MissionManager.hasProperParent(this.mission)
        && this.mission.isRunning() && !this.isAllTasksCompleted()) {
        var unit;

        switch (type) {
            case Merge.SPAWN: unit = !Array.isArray(options.affected) && options.unit; break;
            case Merge.BUILD: unit = options.affected; break;
        }

        if (unit && unit.getData().bpPoints) {
            unit.setPoints(unit.getData().bpPoints);
        }
    }
};

PassMissionLogic.BuildableUnitPoints = function (unit) {
    var values = [0, 0, 5, 10, 20, 60, 300, 600, 2000, 2500, 3000, 4000];
    return values[Math.min(unit.stage, values.length - 1)];
};

PassMissionLogic.prototype.needDisplayWindow = function () {
    var newRewards = this._getAvailableRewardsSet();
    newRewards ^= (newRewards & this.shownAvailableRewards);
    return newRewards;
};

PassMissionLogic.prototype.displayWindow = function (delay) {
    if (!this.needDisplayWindow()) {
        return;
    }

    delay = delay || 0;

    cleverapps.meta.display({
        focus: "PassWindow",
        actions: [
            function (f) {
                cleverapps.meta.showControlsWhileFocused(this.mission.name + "MissionIcon");

                setTimeout(f, delay);
            }.bind(this),
            function (f) {
                cleverapps.meta.hideControlsWhileFocused(this.mission.name + "MissionIcon");

                // eslint-disable-next-line new-cap
                new this.mission.view(this.mission);
                cleverapps.meta.onceNoWindowsListener = f;
            }.bind(this)
        ]
    });
};

PassMissionLogic.prototype._compact = function (progress) {
    var total = 0;
    for (var level = 0; level < progress.level; level++) {
        total += this.levels[level].task.goal;
    }

    return total + progress.progress;
};

PassMissionLogic.prototype._extract = function (progress) {
    var total = 0;
    for (var level = 0; level < this.levels.length; level++) {
        if (progress < total + this.levels[level].task.goal) {
            return {
                level: level,
                progress: progress - total
            };
        }

        total += this.levels[level].task.goal;
    }

    return {
        level: this.levels.length,
        progress: 0
    };
};

PassMissionLogic.prototype._getAvailableRewardsSet = function () {
    return !this.hasPremium() ? this.rewards
        : ((this.rewards << (this.levels.length)) | this.premiumRewards);
};

PassMissionLogic.prototype._logEventByType = function (name, params) {
    switch (Mission.GetChildType(this.mission.type)) {
        case Mission.TYPE_SALEPASS:
            name = "purchase_" + name;
            break;
        case Mission.TYPE_EXPEDITION_PASS:
            name = cleverapps.travelBook.getCurrentPage().id + "_" + name;
            break;
        default:
            break;
    }

    cleverapps.eventLogger.logEvent(name, params);
};

PassMissionLogic.GetPrice = function (mission) {
    var wantsToChangePrice = [Mission.TYPE_RAPUNZEL_EXPEDITION, Mission.TYPE_RAPUNZEL2_EXPEDITION, Mission.TYPE_EASTER_EXPEDITION, Mission.TYPE_CHINA_EXPEDITION].some(function (type) {
        return mission.type === Mission.CompoundType(Mission.TYPE_EXPEDITION_PASS, type);
    });
    if (wantsToChangePrice) {
        return 499;
    }

    return Mission.TYPE_EXPEDITION_PASS === Mission.GetChildType(mission.type) ? 1000 : 750;
};

PassMissionLogic.classifyAmount = function (amount) {
    if (amount > 300) {
        return 3;
    } if (amount > 80) {
        return 2;
    }
    return 1;
};
