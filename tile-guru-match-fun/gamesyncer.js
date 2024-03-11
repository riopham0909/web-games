/**
 * Created by andrey on 14.07.17.
 */

cleverapps.GameSyncer = {
    addUpdateTask: function (slot) {
        if (cleverapps.config.type !== "merge") {
            slot = CustomSyncers.SLOT_MAIN;
        }

        cleverapps.synchronizer.addUpdateTask("games" + slot);
    },

    loadInfo: function (slot) {
        var episodeNo, levelNo;

        if (slot === undefined) {
            var level = cleverapps.user.getCurrentLevel();
            episodeNo = level.episodeNo;
            levelNo = level.levelNo;
            slot = cleverapps.GameSaver.getStoreSlot(episodeNo, levelNo);
        } else if (cleverapps.config.type === "merge" && (slot === "1" || slot === "2")) { // backward compatibility since 29.06.20203
            episodeNo = slot;
        }

        var stored = cleverapps.GameSaver.load(slot);
        if (stored && Object.keys(stored).length > 0) {
            stored = Object.assign(stored, {
                episode: episodeNo || undefined,
                level: levelNo || undefined
            });
        }

        return stored || {};
    },

    saveInfo: function (slot, serverGame) {
        if (serverGame === undefined) {
            return;
        }

        var episode = serverGame.episode || 0;
        var level = serverGame.level || 0;

        delete serverGame.episode;
        delete serverGame.level;

        if (slot === undefined) {
            slot = cleverapps.GameSaver.getStoreSlot(episode, level);
        }

        cleverapps.GameSaver.saveInfo(slot, serverGame, true);
    }
};

CustomSyncers.extractors.games = function () {
    return cleverapps.GameSyncer.loadInfo(undefined);
};
CustomSyncers.importerData.games = function (serverGame) {
    cleverapps.GameSyncer.saveInfo(undefined, serverGame);
};

if (cleverapps.config.type === "merge") {
    CustomSyncers.registerBySlots("games", function (slot) {
        return cleverapps.GameSyncer.loadInfo(slot);
    }, function (slot, serverGame) {
        cleverapps.GameSyncer.saveInfo(slot, serverGame);
    });
}