/**
 * Created by spepa on 24.10.2022
 */

var LandmarkDonorIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.landmarkdonor_icon_json
    });

    this.resetState();
};

LandmarkDonorIcon.prototype = Object.create(SideBarIcon.prototype);
LandmarkDonorIcon.prototype.constructor = LandmarkDonorIcon;

LandmarkDonorIcon.prototype.resetState = function () {
    this.available = false;
    if (cleverapps.config.editorMode || !cleverapps.environment.isMainScene()) {
        return;
    }

    var landmark = this.findWithProgress();
    if (landmark) {
        this.available = true;
        this.setAttention(Game.currentGame.landmarks.getPendingProgress(landmark));
        this.setLeftTime(Game.currentGame.landmarks.getTimeLeft(landmark));
    }
};

LandmarkDonorIcon.prototype.findWithProgress = function () {
    var landmarks = Game.currentGame && Game.currentGame.landmarks && Game.currentGame.landmarks.listActiveLandmarks() || [];

    for (var i = 0; i < landmarks.length; ++i) {
        var landmark = landmarks[i];

        if (Game.currentGame.landmarks.getPendingProgress(landmark)) {
            return landmark;
        }
    }

    return landmarks[0];
};

LandmarkDonorIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "LandmarkDonorIconClicked",
        action: function (f) {
            new LandMarkDonorWindow(this.findWithProgress());
            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this)
    });
};

LandmarkDonorIcon.prototype.getForce = function () {
    return Landmarks.getForce(cleverapps.travelBook.getCurrentPage().id);
};
