/**
 * Created by Aleksandr on 03.05.2023
 */

cleverapps.UI.animateCube = function (options) {
    options = options || {};

    var movingNode = cleverapps.scenes.getMovingNode();

    var cubeView = options.cubeView;

    cubeView.realParent = cubeView.parent === movingNode ? cubeView.realParent : cubeView.parent;

    var position = options.position.parent.convertToWorldSpace(options.position.point);
    var duration = options.duration || 0.7;

    var actions = [];

    actions.push(new cc.ReplaceParent(movingNode));

    var finalP = movingNode.convertToNodeSpace(position);
    var firstP = movingNode.convertToNodeSpace(cubeView.parent.convertToWorldSpace(cubeView));
    var secondP = cc.p(firstP.x + cleverapps.Random.random(-100, 100), firstP.y + 600);
    actions.push(new cc.BezierTo(duration, [firstP, secondP, finalP]).easing(cc.easeIn(0.75)));

    return new cc.Sequence(actions);
};