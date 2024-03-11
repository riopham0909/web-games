/**
 * Created by mac on 12/08/22
 */

var Tile3Scene = TileGameScene.extend({
    onSceneLoaded: function () {
        this._super();

        var openCardsView = new OpenCardsView(this.game.open);
        this.addChild(openCardsView);

        if (!(cleverapps.gameModes.threeOpenCards && cleverapps.gameModes.noControls)) {
            this.openCardsControl = new HidingNode(openCardsView, cleverapps.UI.VERTICAL);
            cleverapps.meta.registerControl("opencards", openCardsView);
        }

        var shuffleBooster = cleverapps.boosters.getBoosterById(cleverapps.Boosters.TYPE_TILE_SHUFFLE);
        if (shuffleBooster && shuffleBooster.isAvailable()) {
            var shuffleButton = new TileShuffleButtonBooster(shuffleBooster);
            this.addChild(shuffleButton);

            this.shuffleButton = new HidingNode(shuffleButton, cleverapps.UI.HORIZONTAL);
            cleverapps.meta.registerControl(shuffleButton.getControlId(), shuffleButton);
        }

        var undoBooster = cleverapps.boosters.getBoosterById(cleverapps.Boosters.TYPE_UNDO);
        if (undoBooster && undoBooster.isAvailable()) {
            var undoButton = new UndoButtonBooster(undoBooster);
            this.addChild(undoButton);

            this.undoButton = new HidingNode(undoButton, cleverapps.UI.HORIZONTAL);
            cleverapps.meta.registerControl(undoButton.getControlId(), undoButton);
        }

        var vacuumBooster = cleverapps.boosters.getBoosterById(cleverapps.Boosters.TYPE_VACUUM);
        if (vacuumBooster && vacuumBooster.isAvailable()) {
            var vacuumButton = new VacuumButtonBooster(vacuumBooster);
            this.addChild(vacuumButton);

            this.vacuumButton = new HidingNode(vacuumButton, cleverapps.UI.HORIZONTAL);
            cleverapps.meta.registerControl(vacuumButton.getControlId(), vacuumButton);
        }
    }
});

GameScene = Tile3Scene;
