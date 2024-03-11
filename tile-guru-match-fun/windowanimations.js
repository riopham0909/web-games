/**
 * Created by iamso on 29.05.19.
 */

var WINDOW_ANIMATIONS = {
    default: {
        open: function (callback) {
            var baseScale = this.window.scale;
            this.window.setScale(0.8 * baseScale);
            this.window.runAction(new cc.Sequence(
                new cc.ScaleTo(0.3, baseScale).easing(cc.easeBackOut()),
                new cc.CallFunc(callback)
            ));
        },

        close: function (callback) {
            callback();
        }
    },

    fallIn: {
        open: function (callback) {
            var baseScale = this.window.scale;

            this.window.setScale(3.2 * baseScale);
            this.performRecursive(function (node) {
                if (node !== this) {
                    node.setCascadeOpacityEnabled(true);
                }
            });
            this.window.setOpacity(30);

            this.window.runAction(new cc.Sequence(
                new cc.Spawn(
                    new cc.ScaleTo(0.5, baseScale).easing(cc.easeIn(1.5)),
                    new cc.FadeIn(0.5).easing(cc.easeIn(2))
                ),
                new cc.CallFunc(callback)
            ));
        },

        close: function (callback) {
            callback();
        }
    },

    fromLeft: {
        open: function (callback) {
            var originalPos = this.window.basePosition;
            this.window.setPositionX(-originalPos.x);
            this.window.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, originalPos.x, originalPos.y).easing(cc.easeBackOut()),
                new cc.CallFunc(callback)
            ));
        },

        close: function (callback) {
            this.window.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, -this.window.x, this.window.y).easing(cc.easeBackIn()),
                new cc.CallFunc(callback)
            ));
        }
    },

    fromBelow: {
        open: function (callback) {
            var originalPos = this.window.basePosition;
            this.window.setPositionY(0);
            this.window.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, originalPos.x, originalPos.y).easing(cc.easeBackOut()),
                new cc.CallFunc(callback)
            ));
        },

        close: function (callback) {
            this.window.runAction(new cc.Sequence(
                new cc.MoveTo(0.4, this.window.x, 0).easing(cc.easeBackIn()),
                new cc.CallFunc(callback)
            ));
        }
    },

    fromLeftToRight: {
        open: function (callback) {
            var originalPos = this.window.basePosition;
            this.window.setPositionX(-this.window.width / 2);
            this.window.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, originalPos.x, originalPos.y).easing(cc.easeBackOut()),
                new cc.CallFunc(callback)
            ));
        },

        close: function (callback) {
            this.window.runAction(new cc.Sequence(
                new cc.MoveTo(0.3, this.width + this.window.width / 2, this.window.y).easing(cc.easeBackIn()),
                new cc.CallFunc(callback)
            ));
        }
    },

    bezierCircle: {
        open: function (callback) {
            var target = cc.p(this.window.basePosition.x, this.window.basePosition.y);
            var first = cc.p(target.x + this.width * 0.2, this.height - this.window.height / 2);
            var second = cc.p(target.x + this.width * 0.35, target.y - this.window.height / 6);

            var baseScale = this.window.scale;
            this.window.setScale(0.3 * baseScale);
            this.window.setPosition(first);
            var time = 0.25;

            this.window.runAction(new cc.Sequence(
                new cc.Spawn(
                    new cc.BezierTo(time, [first, second, target]),
                    new cc.ScaleTo(time, baseScale).easing(cc.easeIn(3))
                ),
                new cc.CallFunc(callback)
            ));
        },

        close: function (callback) {
            var target = cc.p(this.window.basePosition.x, this.window.basePosition.y);
            var first = cc.p(target.x - this.width * 0.2, this.height - this.window.height / 2);
            var second = cc.p(target.x - this.width * 0.35, target.y - this.window.height / 2);

            this.window.setPosition(target);
            var time = 0.25;

            this.window.runAction(new cc.Sequence(
                new cc.Spawn(
                    new cc.BezierTo(time, [target, second, first]),
                    new cc.ScaleTo(time, 0.3).easing(cc.easeOut(0.33))
                ),
                new cc.CallFunc(callback)
            ));
        }
    },

    instant: {
        open: function (callback) {
            callback();
        },

        close: function (callback) {
            callback();
        }
    },

    force: {
        open: function (callback) {
            callback();
        },

        close: function (callback) {
            this.dialogue.close(callback);
        }
    }
};