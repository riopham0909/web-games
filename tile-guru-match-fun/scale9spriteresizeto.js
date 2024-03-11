/**
 * Created by r4zi4l on 23.06.2022
 */

var Scale9SpriteResizeTo = cc.ActionInterval.extend({
    ctor: function (duration, width, height) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._form = cc.size();
        this._to = cc.size();

        this.initWithDuration(duration, cc.size(width, height));
    },

    initWithDuration: function (duration, to) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._to = to;
            return true;
        }
        return false;
    },

    clone: function () {
        return new Scale9SpriteResizeTo(this._duration, this._to);
    },

    reverse: function () {
        cc.log("Scale9SpriteResizeTo.reverse(): reverse hasn't been supported.");
        return null;
    },

    startWithTarget: function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._from = target.getContentSize();
    },

    update: function (time) {
        time = this._computeEaseTime(time);
        this.target.setContentSize(this._from.width + (this._to.width - this._from.width) * time, this._from.height + (this._to.height - this._from.height) * time);
    }
});