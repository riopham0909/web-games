/**
 * Created by vladislav on 30/12/2022
 */

var MultiScreenArrows = cleverapps.Spine.extend({
    ctor: function (table) {
        this._super(bundles.game.jsons.multiscreen_json);

        this.table = table;

        this.setPositionRound(cleverapps.styles.MultiScreenArrows.position);

        Game.currentGame.pagination.on("lastPage", this.hideArrows.bind(this));
        Game.currentGame.pagination.on("changePage", this.nextScreen.bind(this));

        this.runAction(new cc.Sequence(
            new cc.DelayTime(3),
            new cc.CallFunc(this.showArrows.bind(this))
        ));
    },

    updateSize: function () {
        this.setPositionRound(cleverapps.styles.MultiScreenArrows.position);
    },

    nextScreen: function () {
        this.setAnimation(0, this.getArrowsAnimation(), true);

        var originalPosition = this.getPosition();

        var offsetX = cleverapps.UI.getSceneSize().width / 2 - this.table.rect.x * resolutionScale;

        this.setPositionRound(originalPosition.x + offsetX, originalPosition.y);

        this.runAction(
            new cc.MoveTo(1, originalPosition)
        );
    },

    showArrows: function () {
        var styles = cleverapps.styles.MultiScreenArrows;

        var animation = this.getArrowsAnimation();
        if (animation) {
            this.setAnimation(0, animation, true);
            this.runAction(new cc.MoveBy(0.6, styles.transitionIn));
        }
    },

    hideArrows: function () {
        this.runAction(new cc.Sequence(
            new cc.MoveBy(0.6, cleverapps.styles.MultiScreenArrows.transitionOut),
            new cc.Hide()
        ));
    },

    getArrowsAnimation: function () {
        if (Game.currentGame.pagination.getTotal() > 1 && Game.currentGame.pagination.isLast()) {
            return "finish_idle";
        }

        if (!Game.currentGame.pagination.isLast()) {
            return "animation";
        }
    }
});

cleverapps.styles.MultiScreenArrows = {
    position: {
        x: { align: "right", dx: 0 },
        y: { align: "center", dy: 0 }
    },
    transitionIn: {
        x: -170,
        y: 0
    },
    transitionOut: {
        x: 170,
        y: 0
    }
};