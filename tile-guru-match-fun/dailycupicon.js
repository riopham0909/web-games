/**
 * Created by vladislav on 1/30/19
 */

var DailyCupIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.dailycup_icon_json
    });

    cleverapps.dailyCup.onChangedIcon = function () {
        cleverapps.sideBar.resetByClassName(DailyCupIcon);
    };
};

DailyCupIcon.prototype = Object.create(SideBarIcon.prototype);
DailyCupIcon.prototype.constructor = DailyCupIcon;

DailyCupIcon.prototype.getForce = function () {
    return cleverapps.dailyCup.getForce();
};

DailyCupIcon.prototype.resetState = function () {
    this.available = cleverapps.dailyCup.isAvailable({
        future: true
    });

    var locked = this.available && !cleverapps.dailyCup.isAvailable();
    if (this.available && !locked) {
        this.available = cleverapps.dailyCup.isActive();
    }

    if (locked) {
        this.setLocked(true);
        this.setAttention(false);

        this.setTitle(Messages.get("IconLocked.TextDefault", {
            levelNo: this.getLockedTipData()
        }));
    } else {
        this.setLocked(false);
        this.setAttention(!this.locked && cleverapps.dailyCup.isFinished());

        var leftTime = cleverapps.dailyCup.getTimeLeft();
        if (leftTime > 0) {
            this.setLeftTime(leftTime);
            this.setTitle(undefined);
        } else {
            this.setLeftTime(0);
            this.setTitle("Finished");
        }
    }
};

DailyCupIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "DailyCupSceneFromIcon",
        action: function (f) {
            cleverapps.scenes.replaceScene(new DailyCupScene(), f);
        }
    });
};

DailyCupIcon.prototype.getLockedTipData = function () {
    var data = CupsConfig.TYPES[CupsConfig.TYPE_DAILY].available;
    return cleverapps.humanReadableNumber({ floatLevel: data.level });
};
