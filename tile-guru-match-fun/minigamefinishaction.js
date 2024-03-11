/**
 * Created by andrey on 02.08.2022.
 */

var MinigameFinishAction = function (f) {
    var primaryMission = this.game.primaryMission;
    if (primaryMission && primaryMission.isMinigameReadyToFinish()) {
        var NudgeWindowClass = primaryMission.nudgeWindow;
        new NudgeWindowClass(primaryMission);
        cleverapps.meta.onceNoWindowsListener = f;
    } else {
        f();
    }
};