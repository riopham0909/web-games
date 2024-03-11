/**
 * Created by andrey on 07.12.2020.
 */

var Episodes = function () {
    this.onResetListener = function () {};
};

Episodes.prototype.reset = function () {
    delete this.amountEpisodes;
    this.onResetListener();
};

Episodes.prototype.getAmountEpisodes = function () {
    if (this.amountEpisodes === undefined) {
        this.amountEpisodes = this._calcAmountEpisodes();
    }
    return this.amountEpisodes;
};

Episodes.prototype._calcAmountEpisodes = function (withDebug) {
    var amountEpisodes = 0;

    for (var cnt = 0; bundles[Episode.BundleId(cnt)] !== undefined; cnt++) {
        var episodeRes = bundles[Episode.BundleId(cnt)];
        if (!episodeRes.jsons || !episodeRes.jsons.levels) {
            break;
        }

        if (!episodeRes.debug || withDebug) {
            amountEpisodes++;
        }
    }

    return amountEpisodes;
};

Episodes.prototype.listAllLevels = function () {
    var levels = [];

    Object.keys(bundles).forEach(function (bundleName) {
        var bundle = bundles[bundleName];
        if (!bundle || !bundle.episode || !bundle.episode.levels || !bundles[Episode.BundleId(bundle.episode.episodeNo)]) {
            return;
        }

        bundle.episode.levels.forEach(function (data, levelNo) {
            levels.push({
                episodeNo: bundle.episode.episodeNo,
                levelNo: levelNo
            });
        });
    });

    return levels;
};