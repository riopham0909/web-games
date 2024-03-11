/**
 * Created by olga on 22.12.2023
 */

var TilesUnlockAction = function (f) {
    if (cleverapps.config.type === "tile3" && this.game.outcome === GameBase.OUTCOME_VICTORY && TilesUnlockWindow.areUnlockedTilesAvailable()) {
        var unlockTilesStage = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.UNLOCKED_TILES_STAGES) || 0;
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.UNLOCKED_TILES_STAGES, unlockTilesStage + 1);
        new TilesUnlockWindow();
        cleverapps.meta.onceNoWindowsListener = f;
    } else {
        f();
    }
};
