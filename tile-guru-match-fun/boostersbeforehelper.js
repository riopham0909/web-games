/**
 * Created by andrey on 15.07.2020
 */

var BoostersBeforeHelper = {
    animateAppear: function (sprite, options, success) {
        success = cleverapps.once(success || function () {});

        if (!sprite || !sprite.parent || !options.target || !options.target.parent) {
            success();
            return;
        }

        var target = options.target;
        var scene = cleverapps.scenes.getRunningScene();
        sprite.setPosition(sprite.getParent().convertToNodeSpace(target.getParent().convertToWorldSpace(target.getPosition())));
        sprite.replaceParentSamePlace(scene);
        sprite.setLocalZOrder(10);

        sprite.setScale(2);
        sprite.runAction(new cc.Sequence(
            new cc.ScaleTo(0.5, options.scale).easing(cc.easeBackOut()),
            new cc.CallFunc(function () {
                cleverapps.audio.playSound(bundles.main.urls.collect_coins_effect);
                if (options.remove !== false && sprite.parent) {
                    sprite.removeFromParent(true);
                }
            })
        ));
        sprite.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.CallFunc(success)
        ));

        BoostersBeforeHelper.animateStars(sprite);
    },

    animateStars: function (sprite) {
        var animation = new cleverapps.Spine(bundles.game.jsons.boosters_before_json);
        animation.setAnimation(0, "animation", false);
        animation.setPositionRound(sprite.x, sprite.y);
        sprite.parent.addChild(animation);
        animation.setLocalZOrder(sprite.getLocalZOrder() - 1);
        animation.setTimeScale(1.3);

        animation.runAction(new cc.Sequence(
            new cc.DelayTime(1.3),
            new cc.RemoveSelf()
        ));
    }
};