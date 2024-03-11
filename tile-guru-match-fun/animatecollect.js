/**
 * Created by razial on 30.01.2023
 */

cleverapps.UI.animateCollect = function (source, target, options) {
    options = options || {};
    target = cleverapps.aims.getTarget(target);

    var movingNode = cleverapps.scenes.getMovingNode(target);

    var actions = [];

    if (options.replaceParentOnStart) {
        actions.push(new cc.ReplaceParent(movingNode));
    } else {
        source.replaceParentSamePlace(movingNode, {
            keepScale: true
        });
    }

    var duration = options.duration || cc.CollectAnimation.calcDuration({ targetNode: source, to: target });
    var baseScaleX = source.baseScaleX || source.baseScale || 1;
    var baseScaleY = source.baseScaleY || source.baseScale || 1;
    var targetScale = options.scale;

    if (options.adjustToTarget) {
        targetScale = Math.min(target.width / source.width, target.height / source.height, 1);
    }

    if (options.path) {
        actions.push(new cc.CallFunc(function () {
            var path = new cleverapps.Particles(bundles.particle.jsons.particles_collect_json, bundles.particle.urls.particle_texture);
            path.setPositionRound(movingNode.convertToNodeSpace(source.convertToWorldSpace(cc.p(source.width / 2, source.height / 2))));
            movingNode.addChild(path, -1);
            path.followTarget(source);
        }));
    }

    actions.push(new cc.CallFunc(function () {
        cleverapps.aims.showTarget(target);
    }));

    var collectAnimation = new cc.CollectAnimation(duration, target, {
        randomPath: options.randomPath
    });

    if (options.easing) {
        collectAnimation = collectAnimation.easing(options.easing);
    }

    actions.push(new cc.Spawn(
        collectAnimation,
        new cc.Sequence(
            new cc.ScaleTo(duration * 0.4, baseScaleX * 1.3, baseScaleY * 1.3),
            new cc.ScaleTo(duration * 0.6, targetScale || baseScaleX, targetScale || baseScaleY)
        )
    ));

    var sound = options.sound;
    if (!sound && target.aim && target.aim.treasureBag) {
        sound = bundles.main.urls.win_reward_box_effect;
    }
    if (sound) {
        actions.push(new cc.PlaySound(sound, { throttle: 0 }));
    }
    if (options.collectEffect) {
        actions.push(new cc.CollectEffect(target));
    }

    if (options.collectDelta) {
        actions.push(new cc.AnimateDelta(target, options.collectDelta, {
            x: cleverapps.styles.Reward.sidebarDelta.x,
            y: cleverapps.styles.Reward.sidebarDelta.y
        }));
    }

    if (actions.length === 1) {
        return actions[0];
    }

    return new cc.Sequence(actions);
};
