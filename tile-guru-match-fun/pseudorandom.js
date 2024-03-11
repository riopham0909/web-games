/**
 * Created by mac on 5/8/17.
 */

if (typeof module !== "undefined") {
    if (typeof cleverapps === "undefined") {
        var cleverapps = require("./utils");
    }
}

cleverapps.Random = {
    state: 0,

    m: 0x80000000, // 2**31;
    a: 1103515245,
    c: 12345,

    seed: function (seed) {
        if (typeof seed === "number") {
            cleverapps.Random.state = Math.abs(parseInt(seed) || 0) % cleverapps.Random.m;
            return cleverapps.Random.state;
        }

        if (typeof seed === "string") {
            return cleverapps.Random.seed(cleverapps.hashCode(seed));
        }

        cleverapps.throwAsync("Expecting string as seed");
    },

    randomSeed: function () {
        cleverapps.Random.state = Math.floor(Math.random() * cleverapps.Random.m);
        var state = cleverapps.Random.state;
        var loop = [];
        for (var i = 0; i < 100; i++) {
            x = this.nextInt();
            if (loop.indexOf(x) >= 0) {
                this.randomSeed();
                return;
            }
            loop.push(x);
        }
        cleverapps.Random.state = state;
    },

    shuffle: function (arr, seed) {
        var res = [], i;

        var indexes = [];
        for (i = 0; i < arr.length; i++) {
            indexes.push(i);
        }

        var oldState;
        if (seed !== undefined) {
            oldState = cleverapps.Random.state;
            cleverapps.Random.seed(seed);
        }

        for (i = 0; i < arr.length; i++) {
            var index = cleverapps.Random.random(indexes.length);
            res.push(arr[indexes[index]]);
            indexes.splice(index, 1);
        }

        if (oldState !== undefined) {
            cleverapps.Random.seed(oldState);
        }

        return res;
    },

    nextInt: function () {
        cleverapps.Random.state = (cleverapps.Random.a * cleverapps.Random.state + cleverapps.Random.c) % cleverapps.Random.m;
        return cleverapps.Random.state;
    },

    nextDouble: function () {
        return cleverapps.Random.nextInt() / cleverapps.Random.m;
    },

    seededDouble: function (seed) {
        var oldState = cleverapps.Random.state;
        cleverapps.Random.seed(seed);
        var res = cleverapps.Random.nextDouble();

        if (oldState !== undefined) {
            cleverapps.Random.seed(oldState);
        }
        return res;
    },

    mathChoose: function (array) {
        if (array.length === 0) {
            return;
        }

        var s = Math.floor(Math.random() * array.length);
        return array[s];
    },

    chooseAmount: function (array, amount, seed) {
        var chosen = [];

        var oldState;
        if (seed !== undefined) {
            oldState = cleverapps.Random.state;
            cleverapps.Random.seed(seed !== false ? seed : Math.floor(Math.random() * 1000000));
        }

        for (var i = 0; i < amount && array.length; i++) {
            var item = this.choose(array);
            chosen.push(item);
            array.splice(array.indexOf(item), 1);
        }

        if (oldState !== undefined) {
            cleverapps.Random.seed(oldState);
        }

        return chosen;
    },

    choose: function (array, seed) {
        if (array.length === 0) {
            return;
        }

        var s = cleverapps.Random.random(0, array.length - 1, seed);
        return array[s];
    },

    probability: function (n, p, units) {
        if (Array.isArray(n)) {
            n = cleverapps.Random.random(n[0], n[1]);
        }

        if (p.length < units.length) {
            var rem = units.length - p.length;

            var cur = 0;
            for (var t = 0; t < p.length; t++) {
                cur += p[t];
            }

            for (var i = 0; i < rem; i++) {
                p.push((1 - cur) / rem);
            }
        }

        var indexes = [];
        for (var j = 0; j < n; j++) {
            var item = cleverapps.Random.pickOne(p);
            if (item !== undefined) {
                indexes.push(item);
            }
        }

        indexes.sort();

        return indexes.map(function (index) {
            return units[index];
        });
    },

    pickOne: function (p) {
        var flipCoin = cleverapps.Random.nextDouble();
        for (var k = 0; k < p.length; k++) {
            flipCoin -= p[k];
            if (flipCoin < 0) {
                return k;
            }
        }
    },

    random: function (start, end, seed) {
        var oldState;
        if (seed !== undefined) {
            oldState = cleverapps.Random.state;
            cleverapps.Random.seed(seed !== false ? seed : Math.floor(Math.random() * 1000000));
        }

        if (end === undefined) {
            end = start - 1;
            start = 0;
        }
        var rangeSize = end - start + 1;
        var randomUnder1 = cleverapps.Random.nextInt() / cleverapps.Random.m;
        var result = start + Math.floor(randomUnder1 * rangeSize);

        if (oldState !== undefined) {
            cleverapps.Random.seed(oldState);
        }

        return result;
    }
};

cleverapps.Random.randomSeed();

if (typeof module !== "undefined") {
    module.exports = cleverapps.Random;
}
