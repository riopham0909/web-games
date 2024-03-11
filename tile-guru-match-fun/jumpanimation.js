/**
 * Created by Denis Kuzin on 28 july 2022
 */

cc.JumpAnimation = function (duration, start, end, h) {
    var first = cc.p(start.x, start.y);
    var third = cc.p(start.x + end.x, start.y + end.y);
    var second = cc.pMidpoint(first, third);
    second.y += h;

    return new cc.BezierTo(duration, [first, second, third]).easing(cc.easeIn(1));
};
