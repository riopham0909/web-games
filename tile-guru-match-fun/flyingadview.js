/**
 * Created by vladislav on 13.11.2020
 */

var FlyingAdView = cc.Node.extend({
    ctor: function () {
        this._super();

        this.setAnchorPoint2();

        var styles = cleverapps.styles.FlyingAdView;

        this.setContentSize2(styles);

        this.createAnimation();

        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            this.setScale(styles.mobile.scale);
            this.baseScale = this.scale;
        }

        cleverapps.UI.applyHover(this, {
            filter: this.isClickAvailable.bind(this),

            onMouseOver: function () {
                this.animation.setSkin(cleverapps.flyingAd.getSkin() + "_hover");
            }.bind(this),

            onMouseOut: function () {
                this.animation.setSkin(cleverapps.flyingAd.getSkin() + "_normal");
            }.bind(this)
        });

        cleverapps.UI.onClick(this, cleverapps.flyingAd.onClick.bind(cleverapps.flyingAd), {
            filter: this.isClickAvailable.bind(this)
        });

        this.setLocalZOrder(10);

        if (cleverapps.flyingAd.enabled) {
            this.enable();
        } else {
            this.disable();
        }

        cleverapps.flyingAd.on("disable", this.createListener(this.disable.bind(this)));
        cleverapps.flyingAd.on("enable", this.createListener(this.enable.bind(this)));
        cleverapps.flyingAd.on("disappear", this.createListener(this.disappear.bind(this)));
        cleverapps.flyingAd.on("toggle", this.createListener(this.toggle.bind(this)));
        cleverapps.flyingAd.on("changeType", this.createListener(this.changeType.bind(this)));
    },

    isClickAvailable: function () {
        return this.isVisible() && cleverapps.flyingAd.isClickAvailable();
    },

    updatePosition: function () {
        if (cleverapps.flyingAd.enabled) {
            var interruptedPosition = this.getPosition();
            this.stopAllActions();
            this.runMoveAnimation(interruptedPosition);
        }
    },

    createAnimation: function () {
        var styles = cleverapps.styles.FlyingAdView;

        this.animation = new cleverapps.Spine(bundles.flying_ad.jsons.flying_ad_json);
        this.addChild(this.animation);
        this.animation.setPositionRound(styles.animation);
    },

    changeType: function () {
        this.animation.setSkin(cleverapps.flyingAd.getSkin() + "_normal");
    },

    toggle: function (visible) {
        if (this.isVisible() === visible) {
            return;
        }

        this.setVisible(visible);

        if (visible) {
            this.animation.runAction(new cc.RepeatForever(new cc.Sequence(
                new cc.PlaySound(bundles.flying_ad.urls.fly_effect),
                new cc.DelayTime(3.8)
            )));
        } else {
            this.animation.stopAllActions();
        }
    },

    disappear: function () {
        this.stopAllActions();
        this.animation.setAnimation(0, "application", false);
        this.animation.setCompleteListener(function () {
            this.animation.setCompleteListener();
            this.toggle(false);
        }.bind(this));
    },

    runMoveAnimation: function (startPosition) {
        var scene = cleverapps.scenes.getRunningScene();
        startPosition = startPosition || { x: scene.width / 2, y: scene.height / 2 + cleverapps.styles.FlyingAdView.yOffset };
        if (startPosition.x > scene.width - cleverapps.styles.FlyingAdView.xBorderOffset) {
            startPosition.x = scene.width - cleverapps.styles.FlyingAdView.xBorderOffset;
        }
        this.setPositionRound(startPosition);
        this._runMoveAnimation(1);
    },

    _runMoveAnimation: function (dir) {
        var scene = cleverapps.scenes.getRunningScene();

        var styles = cleverapps.styles.FlyingAdView;

        var isVertical = cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition()
            && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;
        var point;
        var xBorderOffset = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.mobile.xBorderOffset : styles.xBorderOffset;
        var yOffsetBottom = styles.yOffsetBottom;
        var yOffsetTop = styles.yOffsetTop;
        if (dir > 0) {
            if (isVertical) {
                point = cc.p(scene.width / 2, scene.height - yOffsetTop);
            } else {
                point = cc.p(scene.width - xBorderOffset, this.y);
            }
        } else if (isVertical) {
            point = cc.p(scene.width / 2, yOffsetBottom);
        } else {
            point = cc.p(xBorderOffset, this.y);
        }

        var speed = cleverapps.styles.FlyingAdView.speed;
        var time = cc.pDistance(this.getPosition(), point) / speed;
        var times = Math.round(time / 7);
        var flyAnimation = new cc.MoveBy(time, cc.p(point.x - this.x, point.y - this.y));

        var dx = 0, dy = 0;
        if (isVertical) {
            dx = cleverapps.styles.FlyingAdView.animation.dx;
        } else {
            dy = cleverapps.styles.FlyingAdView.animation.dy;
        }
        if (times > 0) {
            var yflyes = [];
            var oneFlyTime = time / times / 2;
            for (var i = 0; i < times; i++) {
                yflyes.push(new cc.MoveBy(oneFlyTime / 2, cc.p(dx / 2, dy / 2)));
                yflyes.push(new cc.MoveBy(oneFlyTime, cc.p(-dx, -dy)));
                yflyes.push(new cc.MoveBy(oneFlyTime / 2, cc.p(dx / 2, dy / 2)));
            }
            flyAnimation = new cc.Spawn(
                flyAnimation,
                new cc.Sequence(yflyes)
            );
        }

        this.runAction(new cc.Sequence(
            flyAnimation,
            new cc.CallFunc(function () {
                this._runMoveAnimation(-dir);
            }.bind(this))
        ));
    },

    enable: function () {
        this.stopAllActions();
        this.animation.setCompleteListener();
        this.toggle(!cleverapps.meta.isFocused());
        this.animation.setAnimationAndIdleAfter("appearance", "idle");
        this.runMoveAnimation();
        cleverapps.audio.playSound(bundles.flying_ad.urls.show_up_effect);
    },

    disable: function () {
        this.stopAllActions();
        this.toggle(false);
    }
});

cleverapps.styles.FlyingAdView = {
    width: 200,
    height: 200,

    mobile: {
        xBorderOffset: 160,
        scale: 0.8
    },

    animation: {
        x: { align: "center" },
        y: { align: "center", dy: -30 },
        dy: 60,
        dx: 200
    },

    yOffset: 375,
    xBorderOffset: 300,
    yOffsetBottom: 500,
    yOffsetTop: 150,
    speed: 80
};