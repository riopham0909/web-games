/**
 * Created by vladislav on 19/12/2022
 */

cc.MoveInCircle = cc.ActionInterval.extend({
    ctor: function (duration, center, position) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._center = center;
        this.position = position;

        this.initWithDuration(duration, center);
    },

    initWithDuration: function (duration, center) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._center = center;

            return true;
        }
        return false;
    },

    clone: function () {
        cc.log("MoveInCircle.clone(): clone hasn't been supported.");
        return null;
    },

    reverse: function () {
        cc.log("MoveInCircle.reverse(): reverse hasn't been supported.");
        return null;
    },

    startWithTarget: function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._startPosition = target.getPosition();
        this._startAngle = Math.atan2(this._startPosition.y - this._center.y, this._startPosition.x - this._center.x);
        this._radius = cc.pDistance(this._startPosition, this._center);

        this._toAngle = Math.atan2(
            this.position.y - this._center.y,
            this.position.x - this._center.x
        );

        if (this._toAngle <= 0) {
            this._toAngle += 2 * Math.PI;
        }
        this._toAngle += 2 * Math.PI;
    },

    update: function (time) {
        time = this._computeEaseTime(time);
        var angle = this._startAngle + (this._toAngle - this._startAngle) * time;

        this.target.x = Math.cos(angle) * this._radius + this._center.x;
        this.target.y = Math.sin(angle) * this._radius + this._center.y;
    }
});