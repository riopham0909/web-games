/**
 * Created by andrey on 24.08.2021.
 *
 * base80 for map positions and numbers:
 * ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=!#$%&()*-<>?@^|
 *
 * reserve symbols: {}:,;" '.[\]_`~
 */

var Base80 = {
    expandNumber: function (value) {
        var result = 0;
        var base = 1;

        value.split("").reverse().forEach(function (char) {
            if (Base80.DECODE_NUMBERS[char] === undefined) {
                result = NaN;
            }
            result += Base80.DECODE_NUMBERS[char] * base;
            base *= 80;
        });

        return result;
    },

    compactNumber: function (number, length) {
        var result = "";

        if (number === 0) {
            result = Base80.STR.charAt(0);
        } else {
            while (number > 0 || !result) {
                result += Base80.ENCODE_NUMBERS[number % 80];
                number = Math.floor((number - number % 80) / 80);
            }
        }

        if (length) {
            while (result.length < length) {
                result += Base80.STR.charAt(0);
            }
        }

        return result.split("").reverse().join("");
    }
};

Base80.STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=!#$%&()*-<>?@^|";
Base80.ENCODE_NUMBERS = {};
Base80.DECODE_NUMBERS = {};

(function () {
    Base80.STR.split("").forEach(function (char, number) {
        Base80.ENCODE_NUMBERS[number] = char;
        Base80.DECODE_NUMBERS[char] = number;
    });
}());

if (typeof cc === "undefined") {
    module.exports = Base80;
}