/**
 * Created by Ivan on 29.12.2023
 */

var CollectionContainerView = cc.Node.extend({
    ctor: function () {
        this._super();

        this.updatePosition();
    },

    updatePosition: function () {
        var scene = cleverapps.scenes.getRunningScene();

        var boxes = [
            scene.comboBarControl && scene.comboBarControl.getGlobalBoundingBox(),
            scene.rewardGoldControl && scene.rewardGoldControl.getGlobalBoundingBox()
        ].filter(Boolean);

        var box = boxes.length === 2 ? cc.rectUnion(boxes[0], boxes[1]) : boxes[0];

        this.setPositionRound(scene.convertToNodeSpace(cc.p(0, box.y)));
        this.setContentSize(scene.width, box.height);
    }
});