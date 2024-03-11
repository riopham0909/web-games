/**
 * Created by mac on 4/16/22
 */

var ManualStarters = {
    ChildStarter: function (parent) {
        return function () {
            return cleverapps.missionManager.findByType(parent);
        };
    },

    ExpeditionFeastStarter: function (type) {
        var game = Game.currentGame;
        if (cleverapps.travelBook.isExpedition() && game && game.fogs.isOpened("fog6")) {
            var expedition = cleverapps.missionManager.findLocalExpedition();
            if (expedition && expedition.type === Missions[type].parentType) {
                var duration = cleverapps.parseInterval(Missions[type].duration);
                var cooldown = duration;
                var lastRemoved = cleverapps.missionManager.getLastRemoved(type);
                return expedition.getTimeLeft() >= duration && lastRemoved + cooldown < Date.now();
            }
        }
        return false;
    },

    SnailFeastStarter: function (type, options) {
        var expedition = cleverapps.missionManager.findLocalExpedition();
        var lastRemoved = cleverapps.missionManager.getLastRemoved(type);

        if (!expedition) {
            return false;
        }

        if (expedition.type !== Missions[type].parentType || !MissionTree.targets[type] || !MissionTree.targets[type].length) {
            return false;
        }

        if (lastRemoved < expedition.started) {
            lastRemoved = 0;
        }

        if (options && options.fromMissionTree) {
            return !lastRemoved;
        }

        if (!lastRemoved) {
            return false;
        }

        var duration = cleverapps.parseInterval(Missions[type].duration);
        var cooldown = duration;
        if (cleverapps.config.debugMode) {
            cooldown = cleverapps.parseInterval("3 minutes");
        }
        return expedition.getTimeLeft() >= duration && lastRemoved + cooldown < Date.now();
    },

    MissionTreeStarter: function (type, options) {
        return options && options.fromMissionTree;
    }
};
