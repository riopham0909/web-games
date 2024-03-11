/**
 * Created by Aleksandr on 27.04.2023
 */

var PawBoxIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.pawbox_icon_json,
        titleIcon: bundles.sidebar.frames.pawbox_titleIcon,
        control: "PawBoxIcon",
        targets: ["pawsPoints"]
    });
};

PawBoxIcon.prototype = Object.create(SideBarIcon.prototype);
PawBoxIcon.prototype.constructor = PawBoxIcon;

PawBoxIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "PawBoxIconClicked",
        action: function (f) {
            new GuideWindow({
                name: "PawBoxGuideWindow",
                getBundleName: function () {
                    return "pawbox_guide_window";
                }
            });
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

PawBoxIcon.prototype.resetState = function () {
    this.available = false;
    if (cleverapps.config.wysiwygMode || cleverapps.config.editorMode || !cleverapps.travelBook.isExpedition() || !Game.currentGame || !Game.currentGame.pawBox) {
        return;
    }

    if (Game.currentGame && Game.currentGame.pawBox && PawBox.IsIconActive()) {
        this.available = true;
    }

    this.setTitle(Game.currentGame.pawBox.getPoints() + "/" + PawBox.GOAL);
};
