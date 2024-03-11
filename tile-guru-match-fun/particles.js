/**
 * Created by mac on 2019-10-24
 */

cleverapps.Particles = cc.ParticleSystem.extend({
    ctor: function (json, image) {
        var data = cc.loader.getRes(processVirtualJson(json));
        data.textureFileName = image;

        this._super(data);
    },

    stop: function (callback) {
        callback = callback || function () {};
        delete this.target;
        this.setAutoRemoveOnFinish(true);
        this.stopSystem();
        this.runAction(new cc.Sequence(
            new cc.DelayTime(3),
            new cc.CallFunc(callback),
            new cc.RemoveSelf()
        ));
    },

    followTarget: function (target) {
        // this.setEmitterMode(cc.ParticleSystem.MODE_RADIUS);
        this.setPositionType(cc.ParticleSystem.TYPE_RELATIVE);
        this.target = target;

        this.updateRelativePosition();

        addCleaner(target, this.createListener(function () {
            if (this.target === target) {
                this.stop();
            }
        }.bind(this)));
    },

    updateRelativePosition: function () {
        if (this.target && this.getParent() && this.target.getParent()) {
            var pos = this.getRelativeCoordinates(this.target);
            this.setPositionRound(pos);
        }
    },

    update: function (dt) {
        this.updateRelativePosition();

        this._super(dt);
    }
});
