/**
 * Created by iamso on 25.12.2019.
 */

cleverapps.GameSaver = {
    gamesData: [],

    getStoreSlot: function (episodeNo, levelNo) {
        episodeNo = episodeNo || 0;
        levelNo = levelNo || 0;

        if (["match3", "board", "merge"].indexOf(cleverapps.config.type) === -1 || cleverapps.isRumble()) {
            var snapshot = cleverapps.loadedSnapshot && cleverapps.loadedSnapshot.games;
            if (!snapshot || snapshot.episode !== episodeNo || snapshot.level !== levelNo) {
                return undefined;
            }
        }

        if (cleverapps.config.type === "merge") {
            var level = new Episode(episodeNo, levelNo).getLevel();
            var page = TravelBook.findPageById(level.expedition);

            if (page && String(page.episode) === String(level.episodeNo) && String(page.level || 0) === String(level.levelNo)) {
                return page.slot || CustomSyncers.SLOT_MAIN;
            }
        }

        return levelNo + "x" + episodeNo;
    },

    convertToStoreKey: function (slot) {
        if (cleverapps.config.type === "merge") {
            slot = "0x" + (slot || 0);
        }

        return cleverapps.config.name + cleverapps.platform.getLocalStoragePreffix() + "_level_" + slot;
    },

    findSave: function (key) {
        return this.gamesData.filter(function (save) {
            return Object.keys(save)[0] === key;
        })[0];
    },

    load: function (slot) {
        var key = this.convertToStoreKey(slot);
        var saveData = this.findSave(key);
        // console.log('saveData', saveData)
        saveData = saveData && JSON.parse(saveData[key]);

        if (!saveData) {
            saveData = cleverapps.DataLoader.load(key);
            if (saveData) {
                this.saveInfo(slot, saveData);
            }
        }
        return saveData;
    },

    loadProperty: function (slot, propertyCode) {
        var stored = cleverapps.GameSaver.load(slot);
        return stored && stored[propertyCode];
    },

    reset: function () {
        cleverapps.GameSaver.gamesData = [];

        cleverapps.episodes.listAllLevels().forEach(function (data) {
            var slot = cleverapps.GameSaver.getStoreSlot(data.episodeNo, data.levelNo);
            cleverapps.GameSaver.removeSave(slot, {});
            cleverapps.GameSyncer.addUpdateTask(slot);
        });
    },

    saveInfo: function (slot, gameData, fromServer) {
        var key = this.convertToStoreKey(slot);
        var existingSave = this.findSave(key);
        if (existingSave) {
            this.gamesData[this.gamesData.indexOf(existingSave)][key] = JSON.stringify(gameData);
        } else {
            while (this.gamesData.length >= cleverapps.DataLoader.FIFO_LIMIT) {
                this.gamesData.shift();
            }

            var saveData = {};
            saveData[key] = JSON.stringify(gameData);
            this.gamesData.push(saveData);
        }
        cleverapps.DataLoader.save(key, gameData, {
            fifoKey: cleverapps.DataLoaderTypes.GAME_SAVE_FIFO
        });

        if (!fromServer) {
            cleverapps.GameSyncer.addUpdateTask(slot);
        }
    },

    removeSave: function (slot) {
        var key = this.convertToStoreKey(slot);
        var save = this.findSave(key);
        if (save) {
            this.gamesData.splice(this.gamesData.indexOf(save), 1);
        }
        cleverapps.DataLoader.remove(key, cleverapps.DataLoaderTypes.GAME_SAVE_FIFO);
    }
};
