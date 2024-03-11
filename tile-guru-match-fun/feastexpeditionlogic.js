/**
 * Created by iamso on 17.12.2021
 */

var FeastExpeditionLogic = function (mission) {
    this.mission = mission;

    if (mission.isRunning()) {
        cleverapps.eventBus.on("gameEvent", this.onGameEvent.bind(this), this);
    }
};

FeastExpeditionLogic.prototype.stop = function () {
    runCleaners(this);
};

FeastExpeditionLogic.prototype.onGameEvent = function (type, options) {
    if (!MissionManager.hasProperParent(this.mission)) {
        return;
    }
    var points = 0, sourceUnit, delay, time;

    if (Mission.GetChildType(this.mission.type) === Mission.TYPE_SNAIL_FEAST) {
        if (type === Merge.SPAWN && ["drsnail", "seasnail"].indexOf(options.unit.code) !== -1) {
            points = this.getSnailPoints(options.unit.stage);
            if (options.affected && Unit.IsApplicable({ type: "snailhouse" }, options.affected)) {
                sourceUnit = options.affected;
            } else {
                sourceUnit = options.unit;
            }
        }
    } else {
        switch (type) {
            case Merge.RUDOLF_COMPLETED:
                points = options.points;
                sourceUnit = options.unit;
                break;
            case Merge.COMPLETE_MINING:
                sourceUnit = options.unit;
                time = options.task.time;
                break;
            case Merge.BUILD:
                sourceUnit = options.affected;
                time = options.time;
                break;
            case Merge.SPAWN:
                if (Array.isArray(options.affected) && options.unit.isBuilt()) {
                    sourceUnit = options.unit;
                    var hasOtherPrizes = options.unit.getData().createPrize !== undefined;
                    delay = hasOtherPrizes ? 500 : 0;

                    var sourceStage = options.unit.stage - 1;

                    if (sourceStage >= 6) {
                        points = cleverapps.Random.random(10, 13);
                    } else if (sourceStage === 5) {
                        points = cleverapps.Random.random(8, 11);
                    } else if (sourceStage === 4) {
                        points = cleverapps.Random.random(6, 9);
                    } else if (sourceStage === 3) {
                        points = cleverapps.Random.random(4, 7);
                    } else if (sourceStage === 2) {
                        points = cleverapps.Random.random(2, 5);
                    } else if (sourceStage === 1) {
                        points = cleverapps.Random.random(1, 3);
                    } else if (sourceStage === 0) {
                        points = 1;
                    }
                }
                break;
        }

        if (time) {
            if (time >= cleverapps.parseInterval("60 minutes")) {
                points = 3;
            } else if (time >= cleverapps.parseInterval("10 minutes")) {
                points = 2;
            } else {
                points = 1;
            }
        }
    }

    if (points > 0 && sourceUnit) {
        this.collectFromUnit(points, sourceUnit, delay);
    }
};

FeastExpeditionLogic.prototype.getSnailPoints = function (stage) {
    if (!this.snailPoints) {
        this.snailPoints = {};
    }

    if (this.snailPoints[stage]) {
        return this.snailPoints[stage];
    }

    var points;
    if (stage === 0) {
        points = 0;
    } else if (stage === 1) {
        points = 1;
    } else if (stage === 2) {
        points = 3;
    } else {
        points = Math.round(this.getSnailPoints(stage - 1) * 2.5);
        if (points % 5 > 2.5) {
            points = points - points % 5 + 5;
        } else {
            points -= points % 5;
        }
    }

    this.snailPoints[stage] = points;

    return points;
};

FeastExpeditionLogic.prototype.collectFromUnit = function (amount, unit, delay) {
    Game.currentGame.addReward("mission", {
        missionType: this.mission.type,
        amount: amount
    }, unit, {
        delay: delay || 0
    });
};

FeastExpeditionLogic.prototype.beforeRemove = function () {
    if (Mission.GetChildType(this.mission.type) === Mission.TYPE_SNAIL_FEAST && !cleverapps.gameModes.multipleHeroes) {
        var unitsToReplace = {};
        unitsToReplace[Mission.TYPE_DRAGONIA2_EXPEDITION] = "drsnail";
        unitsToReplace[Mission.TYPE_DRAGONIA3_EXPEDITION] = "drsnail";
        unitsToReplace[Mission.TYPE_UNDERSEA2_EXPEDITION] = "seasnail";
        Game.currentGame.replaceUnit({ code: unitsToReplace[Mission.GetParentType(this.mission.type)] }, function (unit) {
            var codesByMission = {};
            codesByMission[Mission.TYPE_DRAGONIA2_EXPEDITION] = "drresource";
            codesByMission[Mission.TYPE_DRAGONIA3_EXPEDITION] = "drresource";
            codesByMission[Mission.TYPE_UNDERSEA2_EXPEDITION] = "searesource";
            var codes = cleverapps.unitsLibrary.listAvailableByType(codesByMission[Mission.GetParentType(this.mission.type)]);
            var code = cleverapps.Random.choose(codes);
            return {
                code: code,
                stage: Math.min(3, unit.stage, Families[code].units.length - 1)
            };
        }.bind(this));
    }
};
