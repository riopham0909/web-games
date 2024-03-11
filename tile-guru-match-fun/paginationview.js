/**
 * Created by Denis Kuzin on 22 december 2022
 */

var PaginationView = cleverapps.Spine.extend({
    avoidNode: "PaginationView",

    ctor: function (pagination) {
        this.pagination = pagination;
        this._super(bundles.pagination.jsons[this.getJsonName()]);

        this.setAnimation(0, this.getIdleAnimationName());

        this.pagination.on("changePage", this.createListener(this.changePage.bind(this)));

        this.updateRelativePosition();
    },

    changePage: function () {
        this.setAnimationAndIdleAfter("open_" + this.pagination.page, this.getIdleAnimationName());
    },

    getJsonName: function () {
        return "pagination_" + this.pagination.total + "_json";
    },

    getIdleAnimationName: function () {
        return "idle_" + this.pagination.page;
    },

    updateRelativePosition: function () {
        var styles = cleverapps.styles.PaginationView;
        var scene = cleverapps.scenes.getRunningScene();

        var position = this.calculatePositionRound(styles.x, styles.y, { box: scene.getGlobalBoundingBox() });

        [scene.upMenuContainer && scene.upMenuContainer.menuBar, scene.comboBarControl].filter(Boolean).forEach(function (node) {
            var nodeRect = cc.rectAddPadding(node.getGlobalBoundingBox(), cc.padding(styles.padding));
            var thisRect = cc.rect(position.x - this.width / 2, position.y - this.height / 2, this.width, this.height);
            if (cc.rectIntersectsRect(nodeRect, thisRect)) {
                position.y = nodeRect.y - thisRect.height / 2;
            }
        }.bind(this));

        this.setPositionRound(scene.convertToNodeSpace(position));
    }
});

cleverapps.styles.PaginationView = {
    x: { align: "center", dx: 0 },
    y: { align: "top", dy: -30 },
    padding: 25
};
