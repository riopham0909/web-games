/**
 * Created by Evgeny on 20/12/2023.
 */

var getRadius = function (targets, center) {
    var maxDistance = 0;
    targets.forEach(function (target) {
        var distance = cc.pDistance(target, center);
        maxDistance = Math.max(maxDistance, distance);
    });

    return maxDistance / 2;
};

var getCenter = function (targets) {
    var spinCenter = {
        x: 0,
        y: 0
    };

    targets.forEach(function (target) {
        spinCenter.x += target.x;
        spinCenter.y += target.y;
    });

    spinCenter.x /= targets.length;
    spinCenter.y /= targets.length;

    return spinCenter;
};

cleverapps.UI.animateShuffle = function (targets, callback) {
    var duration = 1.5;
    var center = getCenter(targets);
    var radius = getRadius(targets, center);
    callback = callback || function () {};

    targets.forEach(function (target) {
        var randRadius = (0.8 + 0.4 * Math.random()) * radius;
        var finishPosition = target.getShuffleFinishPosition();
        var midpoint = cc.pAdd(cc.pMult(cc.pNormalize(cc.p(target.x - center.x, target.y - center.y)), randRadius), center);

        target.runAction(
            new cc.Sequence(
                new cc.MoveTo(duration / 4, midpoint).easing(cc.easeIn(3)),
                new cc.MoveInCircle(duration / 2, center, finishPosition).easing(cc.easeOut(1.1)),
                new cc.CallFunc(callback.bind(target)),
                new cc.MoveTo(duration / 4, finishPosition).easing(cc.easeInOut(3))
            )
        );
    });
};
