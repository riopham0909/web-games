/**
 * Created by Denis Kuzin on 27 july 2022
 */

cc.CollectAnimation = cc.BezierBy.extend({
    ctor: function (duration, flyTo, options) {
        this.flyTo = flyTo;
        this.endPosition = this.getEndPosition(flyTo);
        this.options = options || {};

        this._super(duration, []);
    },

    startWithTarget: function (target) {
        this._super(target);

        if (this.flyTo.isRunning()) {
            this.endPosition = this.getEndPosition(this.flyTo);
        }

        var points = cc.CollectAnimation.calc3Points(target, this.endPosition, this.options);
        points[2] = cc.pSub(points[2], points[0]);
        points[1] = cc.pSub(points[1], points[0]);
        points[0] = cc.p(0, 0);

        this._config = points;
    },

    getEndPosition: function (flyTo) {
        return flyTo.convertToWorldSpace(cc.p(flyTo.width / 2, flyTo.height / 2));
    },

    update: function (dt) {
        if (this.flyTo.isRunning()) {
            var endPosition = this.getEndPosition(this.flyTo);

            var locConfig = this._config;
            locConfig[2] = cc.pAdd(locConfig[2], cc.pSub(this.target.parent.convertToNodeSpace(endPosition), this.target.parent.convertToNodeSpace(this.endPosition)));

            this.endPosition = endPosition;
        }

        this._super(dt);
    }
});

cc.CollectAnimation.calc3Points = function (targetNode, endPosition, options) {
    options = options || {};
    var first = targetNode.getPosition();
    var third = targetNode.parent.convertToNodeSpace(endPosition);
    var second;

    if (options.jump) {
        second = cc.p(first.x, third.y);
    } else {
        var diff = cc.pSub(third, first);
        var height = Math.min(cleverapps.styles.CollectAnimation.height, cc.pLength(diff) * 1.5);
        if (options.randomPath) {
            height *= (Math.random() + 0.5);
        }
        var opposite = cc.pMult(cc.pNormalize(cc.pPerp(diff)), height);

        var m = cc.pMidpoint(first, third);

        var second1 = cc.pAdd(m, opposite);
        var second2 = cc.pSub(m, opposite);

        var scene = cleverapps.scenes.getRunningScene();
        var center = targetNode.parent.convertToNodeSpace(cc.p(scene.width / 2, scene.height / 2));

        var dist1 = cc.pDistance(second1, center);
        var dist2 = cc.pDistance(second2, center);

        var back = options.randomPath ? m : cc.pSub(first, cc.pMult(diff, 0.33));

        second = dist1 < dist2 ? cc.pAdd(back, opposite) : cc.pSub(back, opposite);
    }

    return [first, second, third];
};

cc.CollectAnimation.calcDuration = function (params) {
    var points = params.points;
    if (!points) {
        var endPosition = cc.CollectAnimation.prototype.getEndPosition(params.to);
        points = cc.CollectAnimation.calc3Points(params.targetNode, endPosition, params);
    }

    var distance = cc.pDistance(points[0], points[1]) + cc.pDistance(points[1], points[2]);
    var speed = params.speed || cleverapps.styles.CollectAnimation.speed;

    return Math.min(1, Math.max(0.3, distance / speed));
};

cleverapps.styles.CollectAnimation = {
    height: 700,
    speed: 2600
};