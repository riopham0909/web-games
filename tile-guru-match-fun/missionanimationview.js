/**
 * Created by mac on 8/03/17.
 */

var MissionAnimationView = cc.Node.extend({
    ctor: function (params) {
        this._super();

        this.usePool = true;
        var clover = this.clover = new cc.Sprite(this.getIcon(params));
        clover.setScale(cleverapps.styles.MissionAnimationView.scale);
        this.addChild(clover);

        this.setLocalZOrder(100);
        this.setCascadeOpacityEnabled(true);
        this.initialize(params);
    },

    initialize: function (params) {
        var alg = this.getFieldAlgorithm();

        alg(this, params);
    },

    reuse: function (params) {
        this.stopListeners = false;
        this.initialize(params);
    },

    remove: function () {
        if (this.usePool) {
            cc.pool.putInPool(this);
        } else {
            this.unuse();
        }
    },

    unuse: function () {
        this.removeFromParent();
    }
});

var MissionAnimationCloverView = MissionAnimationView.extend({
    getIcon: function () {
        return bundles.tournament_icon.frames.fly_clover_png;
    },

    getFieldAlgorithm: function () {
        return MissionAnimationView.SimpleFlyAlgorithm;
    }
});

var MissionAnimationRoseView = MissionAnimationView.extend({
    getIcon: function (params) {
        if (params.icon) {
            return params.icon;
        } 
        return cleverapps.skins.getSlot("missionMarkIcon", {
            type: Mission.TYPE_COLLECT_MARK
        });
    },

    getFieldAlgorithm: function () {
        return MissionAnimationView.flyToAlgorithm;
    },

    reuse: function (params) {
        this._super(params);

        this.clover.setSpriteFrame(this.getIcon(params));
    }
});

var MissionAnimationTulpanView = MissionAnimationView.extend({
    getIcon: function () {
        return cleverapps.skins.getSlot("missionIcon", {
            type: Mission.TYPE_BURN_NEARBY
        });
    },

    getFieldAlgorithm: function () {
        return MissionAnimationView.flyToAlgorithm;
    }
});

MissionAnimationView.flyToAlgorithm = function (node, params) {
    var styles = cleverapps.styles.MissionAnimationView;

    var upY = styles.upY;
    var beginPosition = params.beginPos;
    var targetPosition = params.targetPos;
    node.setPosition(beginPosition);
    beginPosition.y += upY;
    node.setScale(params.beginScale);
    node.setOpacity(255);

    var bezierSecondPoint = cc.p(targetPosition.x, targetPosition.y + styles.flyTo.second.y);
    var bezierFirstPoint = cc.p((beginPosition.x + bezierSecondPoint.x) / 2, (beginPosition.y + bezierSecondPoint.y) / 2 + styles.flyTo.first.y);

    var bezierPoints = [bezierFirstPoint, bezierSecondPoint, targetPosition];
    var dx = Math.abs(targetPosition.x - beginPosition.x);
    var dy = Math.abs(targetPosition.y - beginPosition.y) + styles.flyTo.first.y + styles.flyTo.second.y;
    var duration = Math.sqrt(dx * dx + dy * dy);
    duration /= styles.flySpeed;
    if (!params.targetScale) {
        params.targetScale = params.beginScale;
    }
    if (!params.finalScale) {
        params.finalScale = params.targetScale;
    }

    node.runAction(new cc.Sequence(
        new cc.Spawn(new cc.ScaleTo(0.3, params.targetScale), new cc.MoveBy(0.3, cc.p(0, upY))),
        new cc.Spawn(new cc.ScaleTo(duration, params.finalScale), new cc.BezierTo(duration, bezierPoints).easing(cc.easeIn(1))),
        new cc.CallFunc(function () {
            cleverapps.audio.playSound(bundles.game.urls.cell_collect_effect, { throttle: 20 });
            node.remove();
            if (params.callback) {
                params.callback();
            }
        })
    ));
};

MissionAnimationView.SimpleFlyAlgorithm = function (node, params) {
    var beginPosition = params.beginPos;
    node.setPosition(beginPosition);
    node.setScale(0);
    node.setOpacity(255);

    var l = cleverapps.styles.MissionAnimationView.bezierLength;
    var d = Math.random() * l;
    if (d < l / 2) {
        d -= l;
    }
    var targetPosition = cc.p(beginPosition.x + d, beginPosition.y - 2 * l);
    var bezierSecondPoint = cc.p(targetPosition.x, targetPosition.y + l);
    var bezierFirstPoint = cc.p(beginPosition.x, beginPosition.y + l * (1.5 + Math.random() * 0.5));

    var bezierPoints = [bezierFirstPoint, bezierSecondPoint, targetPosition];

    var dt = 0.2;
    if (dt * params.amount > 3) {
        dt = 3 / params.amount;
    }

    node.runAction(new cc.Sequence(
        new cc.DelayTime(params.id * dt),
        new cc.CallFunc(function () {
            cleverapps.audio.playSound(bundles.game.urls.boom_effect, { throttle: 20 });
        }),
        new cc.Spawn(new cc.ScaleTo(0.3, 0.8), new cc.BezierTo(2, bezierPoints), new cc.RotateBy(2, d < 0 ? -360 : 360), new cc.Sequence(new cc.DelayTime(1.5), new cc.FadeOut(0.5))),
        new cc.CallFunc(function () {
            node.remove();
        })
    ));
};

MissionAnimationCloverView.factory = function (params) {
    return cc.pool.hasObject(MissionAnimationCloverView) ? cc.pool.getFromPool(MissionAnimationCloverView, params) : new MissionAnimationCloverView(params);
};

MissionAnimationRoseView.factory = function (params) {
    return cc.pool.hasObject(MissionAnimationRoseView) ? cc.pool.getFromPool(MissionAnimationRoseView, params) : new MissionAnimationRoseView(params);
};

MissionAnimationTulpanView.factory = function (params) {
    return cc.pool.hasObject(MissionAnimationTulpanView) ? cc.pool.getFromPool(MissionAnimationTulpanView, params) : new MissionAnimationTulpanView(params);
};

MissionAnimationView.show = function (mission, parent, params) {
    if (!params.amount) {
        params.amount = 1;
    }

    for (var i = 0; i < params.amount; i++) {
        params.id = i;
        switch (mission) {
            case Mission.TYPE_COMBO:
                parent.addChild(MissionAnimationCloverView.factory(params));
                break;
            case Mission.TYPE_COLLECT_MARK:
                parent.addChild(MissionAnimationRoseView.factory(params));
                break;
            case Mission.TYPE_BURN_NEARBY:
                parent.addChild(MissionAnimationTulpanView.factory(params));
                break;
        }
    }
};

cleverapps.styles.MissionAnimationView = {
    bezierLength: 250,
    flySpeed: 1500,
    upY: 100,

    flyTo: {
        first: {
            y: 300
        },

        second: {
            y: 300
        }
    },

    scale: 1.0
};