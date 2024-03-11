/**
 * Created by andrey on 28.05.2021.
 */

var Version = {
    compare: function (a, b) {
        if (!a || !b) {
            return !!a - !!b;
        }

        var arrayA = a.split(".");
        var arrayB = b.split(".");

        for (var i = 0; i < Math.min(arrayA.length, arrayB.length); i++) {
            var v1 = parseInt(arrayA[i]);
            var v2 = parseInt(arrayB[i]);
            if (v1 !== v2) {
                return v1 - v2;
            }
        }

        return arrayA.length - arrayB.length;
    },

    isVersion: function (version) {
        if (typeof version !== "string") {
            return false;
        }
        var parts = version.split(".");
        return parts.length === 3 && parts.every(function (part) {
            return /^\d+$/.test(part);
        });
    },

    isMinorEquals: function (v1, v2) {
        return v1.split(".").slice(0, 2).join(".") === v2.split(".").slice(0, 2).join(".");
    },

    incPatch: function (version) {
        var parts = version.split(".");
        parts[2] = +parts[2] + 1;
        return parts.join(".");
    },

    incMinor: function (version) {
        var parts = version.split(".");
        parts[1] = +parts[1] + 1;
        parts[2] = 0;
        return parts.join(".");
    },

    getMinor: function (version) {
        return +(version.split(".")[1]);
    },

    getPatch: function (version) {
        return +(version.split(".")[2]);
    }
};

if (typeof cc === "undefined") {
    module.exports = Version;
}
