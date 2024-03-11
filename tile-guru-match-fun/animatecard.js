/**
 * Created by razial on 30.01.2023
 */

cleverapps.UI.animateCard = function (options) {
    options = options || {};

    var getTargetPosition = function () {
        var position = options.position;

        if (typeof position === "function") {
            position = position();
        }

        if (!position.parent) {
            var message = "Animation for removed card. Debug label: " + options.debugLabel + "Position: " + JSON.stringify(position.point);
            message = message + ", frame size: " + cc.view.getFrameSize().width + " by " + cc.view.getFrameSize().height;
            message = message + ", resolutionScale: " + resolutionScale;
            message = message + " level number: " + cleverapps.user.getHumanReadableNumber();
            cleverapps.throwAsync(message);
        }

        return position.parent.convertToWorldSpace(position.point);
    };

    var movingNode = cleverapps.scenes.getMovingNode(options.cardView);
    if (options.zOrder) {
        movingNode.setLocalZOrder(options.zOrder);
    }

    var cardView = options.cardView;

    cardView.realParent = cardView.parent === movingNode ? cardView.realParent : cardView.parent;
    var animationId = cardView.animationId = cardView.animationId + 1 || 1;

    var scale = options.scale || cardView.card.getScale();

    var position = getTargetPosition();
    var duration = options.duration || 0.7;

    var animation = options.animation;

    var isRightDirection = cardView.parent.convertToWorldSpace(cardView).x <= position.x;
    if (animation === cleverapps.UI.animateCard.ANIMATIION_BIT) {
        animation = isRightDirection ? "bit" : "bit2";
    }

    var actions = [];

    cardView.replaceParentSamePlace(movingNode, {
        keepScale: true
    });

    if (animation) {
        var animationTime = options.animationTime || duration;
        actions.push(new cc.SpineAction(cardView.animation, animation, animationTime, function () {
            cardView.setIdleAnimation();
        }));
    }

    if (options.delay) {
        actions.push(new cc.DelayTime(options.delay));
    }

    var finalP = movingNode.convertToNodeSpace(position);
    var spawn = [];
    if (options.midpoint) {
        var firstP = movingNode.convertToNodeSpace(cardView.parent.convertToWorldSpace(cardView));
        var secondP = cc.p(firstP.x + options.midpoint.x * (isRightDirection ? 1 : -1), firstP.y + options.midpoint.y);
        spawn.push(new cc.BezierTo(duration, [firstP, secondP, finalP]).easing(cc.easeIn(1)));
    } else {
        var move = new cc.MoveTo(duration, finalP);
        spawn.push(options.easing ? move.easing(options.easing) : move);
    }

    var moveScale = movingNode.adjustScaleTo(cardView.realParent);

    if (options.dynamicRatioOfParentScale) {
        moveScale.x /= options.dynamicRatioOfParentScale;
        moveScale.y /= options.dynamicRatioOfParentScale;
    }

    spawn.push(cleverapps.UI.animateScale({
        scale: {
            x: (scale.x || scale) / moveScale.x,
            y: (scale.y || scale) / moveScale.y
        },
        duration: duration,
        overScaling: options.overScaling
    }));

    actions.push(new cc.Spawn(spawn));

    if (options.replaceParentBack !== false) {
        actions.push(new cc.CallFunc(function () {
            if (animationId === cardView.animationId) {
                cardView.replaceParentSamePlace(cardView.realParent);
                cardView.setScale(scale);
            }
        }));
    }

    actions.push(new cc.CallFunc(function () {
        if (cardView.parent) {
            var position = cardView.parent.convertToNodeSpace(getTargetPosition());
            cardView.setPositionRound(position);
        }
    }));

    return new cc.Sequence(actions);
};

cleverapps.UI.animateCard.ANIMATIION_BIT = "bit";
