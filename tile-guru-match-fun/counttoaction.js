/**
 * Created by razial on 06.09.2023
 */

var ImageFontCountTo = cc.ActionInterval.extend({
    ctor: function (duration, to, total) {
        cc.ActionInterval.prototype.ctor.call(this, duration);

        this._to = to;
        this._total = total;
    },

    startWithTarget: function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        this._from = parseFloat(target.getString().split(" / ")[0]);
    },

    update: function (time) {
        time = this._computeEaseTime(time);

        var string = this._from + Math.floor((this._to - this._from) * time);
        if (this._total) {
            string += " / " + this._total;
        }

        this.target.setString(string);
    }
});