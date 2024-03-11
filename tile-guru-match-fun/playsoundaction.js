/**
 * Created by mac on 3/4/21
 */

cc.PlaySound = cc.ActionInstant.extend({
    sound: undefined,

    ctor: function (sound, options) {
        cc.ActionInstant.prototype.ctor.call(this);

        this.sound = sound;
        this.options = options;
    },

    update: function () {
        cleverapps.audio.playSound(this.sound, this.options);
    },

    reverse: function () {
        return this;
    },

    clone: function () {
        return new cc.PlaySound(this.sound, this.options);
    }
});