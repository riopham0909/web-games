/**
 * Created by mac on 12/08/22
 */

var TileGameScene = GameSceneBase.extend({
    onSceneLoaded: function () {
        this._super();

        if (this.game.pagination.getTotal() > 1) {
            var paginationView = new PaginationView(this.game.pagination);
            this.addChild(paginationView);

            this.paginationControl = new HidingNode(paginationView, cleverapps.UI.VERTICAL);
            cleverapps.meta.registerControl("pagination", paginationView);
        }

        this.cardTableView = new CardTableView(this.game.table);
        this.addChild(this.cardTableView);

        this.game.pagination.on("changePage", this.animateNextPage.bind(this));
    },

    animateNextPage: function () {
        var position = this.cardTableView.getPosition();
        this.cardTableView.x -= cleverapps.UI.getSceneSize().width;
        this.cardTableView.runAction(
            new cc.Sequence(
                new cc.PlaySound(bundles.game.urls.next_screen_effect),
                new cc.MoveTo(0.7, position).easing(cc.easeBackOut())
            )
        );
    },

    scaleGameField: function () {
        var scene = cleverapps.scenes.getRunningScene();
        if (scene.paginationControl) {
            scene.paginationControl.target.updateRelativePosition();
            scene.paginationControl.updatePosition();
        }
        this.cardTableView && this.cardTableView.setTableScale();
    }
});
