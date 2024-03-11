/**
 * Created by vladislav on 24.12.2019
 */

var SceneDecors = {
    add: function (parent, decors) {
        decors = cleverapps.toArray(decors);
        if (decors && decors.length) {
            return this.createDecors(parent, decors);
        }
    },

    createDecors: function (parent, decors) {
        return decors.map(function (decorStyle) {
            var decor;

            if (decorStyle.json) {
                decor = new cleverapps.Spine(decorStyle.json);
                decor.setAnimation(0, decorStyle.animation, true);
            } else {
                decor = new cc.Sprite(decorStyle.image);
            }

            parent.addChild(decor, decorStyle.zOrder || 0);

            if (decorStyle.scale) {
                if (decorStyle.scale.x) {
                    decor.setScale(decorStyle.scale.x, decorStyle.scale.y);
                } else {
                    decor.setScale(decorStyle.scale);
                }
            }

            decor.setPositionRound(decorStyle);

            return decor;
        });
    }
};

cleverapps.styles.SceneDecors = {

};