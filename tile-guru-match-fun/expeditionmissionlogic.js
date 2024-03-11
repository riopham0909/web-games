/**
 * Created by razial on 27.10.2021
 */

var ExpeditionMissionLogic = function (mission, isNewMission) {
    this.mission = mission;
    this.expedition = Missions[mission.type].id;
    this.episode = Missions[mission.type].episode;
    this.level = Missions[mission.type].level;
    this.slot = Missions[mission.type].slot;

    if (isNewMission) {
        this.clearSavedGames();
        this.clearUnitsLibrary();

        cleverapps.travelBook.onNewExpeditionMission(mission.type);

        cleverapps.offerManager.clearForceByMission(mission.type);

        Landmarks.clearForce(this.expedition);

        if (cleverapps.user.registered > ExpeditionMissionLogic.EXPEDITIONS_LOG_SINCE) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.EXPEDITIONS.PLAY + this.expedition);
        }
    }
};

ExpeditionMissionLogic.prototype.stop = function (onRemove) {
    if (!onRemove) {
        cleverapps.travelBookHint.checkMission(this.mission);
    }
};

ExpeditionMissionLogic.prototype.clearSavedGames = function () {
    cleverapps.GameSaver.saveInfo(this.slot, {});
};

ExpeditionMissionLogic.prototype.clearUnitsLibrary = function () {
    var activeFamilies = {};

    cleverapps.travelBook.listAvailablePages().forEach(function (page) {
        if (page.id !== this.expedition && page.isRunning()) {
            var level = new Episode(page.episode, page.level).getLevel();
            Object.assign(activeFamilies, level.families);
        }
    }.bind(this));

    var level = new Episode(this.episode, this.level).getLevel();
    var families = Object.keys(level.families).filter(function (code) {
        return !activeFamilies[code];
    });

    cleverapps.unitsLibrary.resetFamilies(families);
};

ExpeditionMissionLogic.prototype.resetPush = function () {
    if (this.mission.getTimeLeft() >= ExpeditionMissionLogic.ATTENTION_TIMEOUT) {
        cleverapps.localPushes.sendPush(cleverapps.LocalPushes.TYPES.EXPEDITION, ExpeditionMissionLogic.ATTENTION_TIMEOUT);
    }
};

ExpeditionMissionLogic.prototype.sendPeriodicPush = function () {
    var lastSendTime = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.EXPEDITION_PUSH_PLANNING_TIME) || 0;

    if (Date.now() > lastSendTime + ExpeditionMissionLogic.PERIODIC_PUSH_TIMEOUT && this.mission.getTimeLeft() >= ExpeditionMissionLogic.PERIODIC_PUSH_TIMEOUT) {
        cleverapps.localPushes.sendPush(cleverapps.LocalPushes.TYPES.EXPEDITION_PERIODIC, ExpeditionMissionLogic.PERIODIC_PUSH_TIMEOUT);

        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.EXPEDITION_PUSH_PLANNING_TIME, Date.now());
    }
};

ExpeditionMissionLogic.prototype.getPrize = function () {
    var fogsOpened = Fogs.LoadOpened(this.expedition);

    var reward;

    for (var id in ExpeditionMissionLogic.REWARDS) {
        if (fogsOpened[id]) {
            reward = ExpeditionMissionLogic.REWARDS[id];
        }
    }

    return reward;
};

ExpeditionMissionLogic.prototype.blowUp = function (callback) {
    var gotoMainSceneAction = function (f) {
        if (!cleverapps.travelBook.isExpedition()) {
            f();
            return;
        }

        cleverapps.travelBook.gotoMainScene(f);
    };

    var showFinishDialogue = function (f) {
        var steps = [{
            text: Messages.get("ExpeditionFinishWindow.text"),
            person: {
                role: "king",
                emotion: "happy"
            }
        }];

        var dialogue = new Dialogue(steps, {
            showUp: true
        });

        var closeDialogue = function () {
            if (!dialogue.typing && dialogue.stage >= dialogue.data.length - 1) {
                dialogue.close();
            }
        };

        dialogue.on("buttonClicked", closeDialogue);
        dialogue.on("screenClicked", closeDialogue);
        dialogue.on("afterClose", f);

        new DialogueView(dialogue);
    };

    var collectAndRemoveAllUnitsAction = function (f) {
        Game.currentGame.collectAndRemoveAllUnits(f);
    };

    var displayCompletedChildMissionsAction = function (f) {
        var actions = [];

        this.mission.getChildMissions().forEach(function (mission) {
            actions.push(mission.displayCompleted.bind(mission));
        });

        cleverapps.meta.compound(f, actions);
    }.bind(this);

    cleverapps.meta.compound(callback, [
        showFinishDialogue,
        collectAndRemoveAllUnitsAction,
        displayCompletedChildMissionsAction,
        gotoMainSceneAction
    ]);
};

ExpeditionMissionLogic.prototype.canRemoveSilently = function () {
    return Date.now() - this.mission.finishTime() > ExpeditionMissionLogic.AUTO_REMOVE_TIMEOUT;
};

ExpeditionMissionLogic.prototype.beforeRemove = function () {
    cleverapps.eventBus.trigger("taskEvent", DailyTasks.FINISH_EXPEDITION);
};

ExpeditionMissionLogic.prototype.canShowCompleted = function () {
    return cleverapps.environment.hasEpisode(this.episode);
};

ExpeditionMissionLogic.EXPEDITIONS_LOG_SINCE = new Date("2022-10-27").getTime();
ExpeditionMissionLogic.ATTENTION_TIMEOUT = cleverapps.parseInterval("2 days");
ExpeditionMissionLogic.PERIODIC_PUSH_TIMEOUT = cleverapps.parseInterval("3 days");
ExpeditionMissionLogic.AUTO_REMOVE_TIMEOUT = cleverapps.parseInterval("14 days");

if (cleverapps.config.debugMode) {
    ExpeditionMissionLogic.ATTENTION_TIMEOUT = cleverapps.parseInterval("10 minutes");
}

ExpeditionMissionLogic.REWARDS = {
    fog1: {
        soft: 10
    },
    fog6: {
        soft: 10,
        lives: 10
    },
    fog16: {
        soft: 20,
        lives: 20
    },
    fog26: {
        soft: 30,
        lives: 30
    },
    fog36: {
        soft: 50,
        lives: 50
    }
};
