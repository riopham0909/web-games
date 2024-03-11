/**
 * Created by mac on 11/10/20
 */

var RecursiveHasher = function(obj, filter, hashState) {
    if (typeof obj !== "object") {
        if (typeof obj === "number") {
            hashState.hash("" + obj);
        } else {
            hashState.hash(obj);
        }
        return;
    }

    if (hashState === undefined) {
        hashState = new MurmurHash3();
        filter = cleverapps.createSet(filter);
    }

    if (Array.isArray(obj)) {
        hashState.hash("" + obj.length);
        for (var i = 0; i < obj.length; i ++) {
            RecursiveHasher(obj[i], filter, hashState);
        }
    } else {
        var keys = Object.keys(obj).sort();
        keys.forEach(function(key) {
            if (!filter[key] && obj[key]) {
                hashState.hash(key);

                RecursiveHasher(obj[key], filter, hashState);
            }
        });
    }

    return hashState.result();
};