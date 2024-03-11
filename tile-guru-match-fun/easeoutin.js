/**
 * Created by vladislav on 04/04/2023
 */

cc.easeOutIn = function (rate) {
    return {
        _rate: rate,
        easing: function (dt) {
            dt *= 2;
            if (dt < 1) {
                return 0.5 - 0.5 * Math.pow(1 - dt, this._rate);
            }
            return 0.5 + 0.5 * Math.pow(dt - 1, this._rate);
        },

        reverse: function () {
            return cc.easeOutIn(this._rate);
        }
    };
};