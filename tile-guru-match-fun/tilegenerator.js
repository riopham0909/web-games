/**
 * Created by mac on 6/22/20
 */

var TileGenerator = function () {
    this._index = -1;
    this._cache = [];
};

TileGenerator.prototype.reset = function (tiles, maxColors) {
    this._cache = cleverapps.Random.shuffle(this.listTiles(tiles, maxColors));
    this._index = -1;
};

TileGenerator.prototype.getAvailableSkins = function () {
    var initAvailable = 8;
    var openPerEpisode = 2;
    var unlockTilesStage = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.UNLOCKED_TILES_STAGES) || 0;

    var requiredForEpisode = initAvailable + unlockTilesStage * openPerEpisode;
    var availableSkins = this.getExistingSkins();

    var skins = availableSkins.default;

    if (cleverapps.gameModes.replaceTiles) {
        skins = cleverapps.Random.shuffle(availableSkins.event).concat(availableSkins.default);
        skins = skins.slice(0, requiredForEpisode);
        return {
            skins: skins,
            new: []
        };
    }

    var availableOnEpisode = Math.min(requiredForEpisode, skins.length);

    var countOfNewSkins = skins.length >= requiredForEpisode ? openPerEpisode : Math.max(skins.length - requiredForEpisode + openPerEpisode, 0);

    var openedSkins = skins.splice(0, availableOnEpisode);
    var newOnEpisode = openedSkins.splice(-countOfNewSkins, countOfNewSkins);
    openedSkins = cleverapps.Random.shuffle(openedSkins);
    return {
        new: newOnEpisode,
        skins: newOnEpisode.concat(openedSkins).concat(skins)
    };
};

TileGenerator.prototype.getExistingSkins = function () {
    var skins = { default: [] };
    var currSkin = 0;

    while (bundles.card.frames["skin_" + currSkin]) {
        skins.default.push(currSkin);
        currSkin++;
    }

    if (cleverapps.gameModes.replaceTiles) {
        skins.event = [];
        currSkin = 0;
        while (bundles.card.frames["skin_event_" + currSkin]) {
            skins.event.push("event_" + currSkin);
            currSkin++;
        }
    }

    return skins;
};

TileGenerator.prototype.listTiles = function (tiles, maxColors) {
    var cache = [];

    var skins = this.getAvailableSkins().skins;

    var existingAmounts = [];
    for (var j = 0; j < 100; j++) {
        existingAmounts.push(0);
    }
    tiles.forEach(function (data) {
        if (data.value !== undefined) {
            existingAmounts[data.value]++;
        }
    });

    var random = tiles.filter(function (data) {
        return data.value === undefined;
    }).length;

    for (j = 0; j < existingAmounts.length; j++) {
        if (existingAmounts[j] % 3 !== 0) {
            var remaining = 3 - (existingAmounts[j] % 3);
            for (var t = 0; t < remaining && random > 0; t++) {
                random--;
                cache.push(j);
            }
        }
    }

    for (var i = 0; i < random; i++) {
        var block = Math.floor(i / 3);
        var colorNumber = block % maxColors;
        cache.push((skins[colorNumber]));
    }

    return cache;
};

TileGenerator.prototype.next = function () {
    this._index++;
    if (this._index === this._cache.length) {
        this._index = 0;
    }
    return this._cache[this._index];
};

TileGenerator.prototype.clear = function () {
    delete this._cache;
};