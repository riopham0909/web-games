/**
 * Created by razial on 30.01.2023
 */

cleverapps.UI.animateJumpCollect = function (source, target, options) {
    options = options || {};
    target = cleverapps.aims.getTarget(target);

    var jumpMovingNode = cleverapps.scenes.getMovingNode(source);
    var collectMovingNode = options.collectMovingNode || cleverapps.scenes.getMovingNode(target);

    source.replaceParentSamePlace(jumpMovingNode, {
        keepScale: true
    });

    var duration = options.duration || cc.CollectAnimation.calcDuration({ targetNode: source, to: target, jump: true });

    var styles = cleverapps.styles.AnimateJumpCollect;

    var jumpScale = options.jumpScale || source.scale * 1.2;
    var collectScale = options.collectScale || source.scale;

    var jumpStyles = styles.both;
    if (options.jumpSide) {
        if (options.jumpSide === "left") {
            jumpStyles = styles.left;
        } else {
            jumpStyles = styles.right;
        }
    }

    var jumpOffset = options.jumpOffset || 0;

    var jumpPosition = cc.p(
        jumpStyles.x1 + (jumpStyles.x2 - jumpStyles.x1) * jumpOffset,
        jumpStyles.y1 + Math.random() * (jumpStyles.y2 - jumpStyles.y1)
    );

    var actions = [];

    actions.push(new cc.CallFunc(function () {
        cleverapps.aims.showTarget(target);
    }));

    actions.push(new cc.Spawn(
        new cc.JumpAnimation(0.4, source, jumpPosition, styles.height),
        new cc.ScaleTo(0.4, jumpScale),
        new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.PlaySound(bundles.main.urls.coins_drop_effect)
        )
    ));

    if (options.collectDelay) {
        actions.push(new cc.DelayTime(options.collectDelay));
    }

    actions.push(new cc.ReplaceParent(collectMovingNode));

    actions.push(new cc.Spawn(
        new cc.CollectAnimation(duration, target, {
            jump: true
        }),
        new cc.ScaleTo(duration, collectScale)
    ));

    actions.push(new cc.PlaySound(options.collectSound));

    if (options.collectEffect) {
        actions.push(new cc.CollectEffect(target));
    }

    if (actions.length === 1) {
        return actions[0];
    }

    return new cc.Sequence(actions);
};

cleverapps.styles.AnimateJumpCollect = {
    height: 200,

    right: {
        x1: 50,
        x2: 150,
        y1: -50,
        y2: -100
    },

    left: {
        x1: -50,
        x2: -150,
        y1: -50,
        y2: -100
    },

    both: {
        x1: -50,
        x2: 50,
        y1: -50,
        y2: -100
    }
};
