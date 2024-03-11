/**
 * Created by Andrey Popov on 14.02.2023
 */

cleverapps.UI.animateScale = function (options) {
    options = options || {};

    if (typeof options.scale !== "object") {
        options.scale = { x: options.scale, y: options.scale };
    }

    if (!options.overScaling) {
        return new cc.ScaleTo(options.duration, options.scale.x, options.scale.y);
    }

    return new cc.Sequence(
        new cc.ScaleTo(4 * options.duration / 5, options.scale.x * options.overScaling, options.scale.y * options.overScaling).easing(cc.easeIn(1)),
        new cc.ScaleTo(options.duration / 5, options.scale.x, options.scale.y).easing(cc.easeOut(1))
    );
};