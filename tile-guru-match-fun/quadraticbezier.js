/**
 * Created by vladislav on 04/04/2023
 */

// Same as cc.BezierTo but without the "easing" effect
cc.QuadraticBezier = cc.ActionInterval.extend({
    ctor: function (t, c) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._config = [];
        this._startPosition = cc.p(0, 0);
        this._previousPosition = cc.p(0, 0);

        c && this.initWithDuration(t, c);
    },

    initWithDuration: function (t, c) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
            this._config = c;
            return true;
        }
        return false;
    },

    clone: function () {
        var action = new cc.QuadraticBezier();
        this._cloneDecoration(action);
        var newConfigs = [];
        for (var i = 0; i < this._config.length; i++) {
            var selConf = this._config[i];
            newConfigs.push(cc.p(selConf.x, selConf.y));
        }
        action.initWithDuration(this._duration, newConfigs);
        return action;
    },

    startWithTarget: function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._previousPosition.x = target.x;
        this._previousPosition.y = target.y;
        this._startPosition.x = target.x;
        this._startPosition.y = target.y;

        this._config[0] = cc.pSub(this._config[0], this._startPosition);
        this._config[1] = cc.pSub(this._config[1], this._startPosition);
        this._config[2] = cc.pSub(this._config[2], this._startPosition);
    },

    bezierAt: function (p0, p1, p2, t) {
        var q = Math.pow(1 - t, 2);
        var p = 2 * (1 - t) * t;
        var r = Math.pow(t, 2);

        return p0 * q + p1 * p + p2 * r;
    },

    update: function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            var x = this.bezierAt(this._config[0].x, this._config[1].x, this._config[2].x, dt);
            var y = this.bezierAt(this._config[0].y, this._config[1].y, this._config[2].y, dt);

            var locStartPosition = this._startPosition;
            if (cc.ENABLE_STACKABLE_ACTIONS) {
                var targetX = this.target.getPositionX();
                var targetY = this.target.getPositionY();
                var locPreviousPosition = this._previousPosition;

                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                x += locStartPosition.x;
                y += locStartPosition.y;
                locPreviousPosition.x = x;
                locPreviousPosition.y = y;
                this.target.setPosition(x, y);
            } else {
                this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
            }
        }
    },

    reverse: function () {
        var locConfig = this._config;
        var r = [
            cc.pAdd(locConfig[1], cc.pNeg(locConfig[2])),
            cc.pAdd(locConfig[0], cc.pNeg(locConfig[2])),
            cc.pNeg(locConfig[2])];
        var action = new cc.BezierBy(this._duration, r);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});