/**
 * Created by mac on 7/25/18
 */

var MissionIcon = function (mission) {
    var sideBarJson = Missions[mission.type].sideBarJson;
    var animation = (typeof sideBarJson === "function") ? sideBarJson(mission) : sideBarJson;
    var targets = ["mission" + mission.type];

    if (mission.isPassMission()) {
        targets.push("battlePass");
    }

    if (mission.isSlotMachineMission()) {
        targets.push("slotMachineTicket");
    }

    SideBarIcon.call(this, {
        animation: animation,
        targets: targets,
        progressIconJson: Missions[mission.type].sideBarProgressIconJson,
        control: mission.name + "MissionIcon",
        lottery: mission.type === Mission.TYPE_PERIODIC_SALE
    });
    this.mission = mission;

    this.resetState();
};

MissionIcon.prototype = Object.create(SideBarIcon.prototype);
MissionIcon.prototype.constructor = MissionIcon;

MissionIcon.prototype.resetState = function () {
    this.available = MissionManager.hasProperParent(this.mission) && !cleverapps.config.editorMode && this.mission.isAvailable();

    if (this.available) {
        this.setLocked(false);
        this.setAttention(this.isAttentionRequired());

        if (this.mission.isCompleted()) {
            this.setLeftTime(0);
            this.setTitle("Finished");
        } else {
            this.setLeftTime(this.mission.getTimeLeft());
            this.setTitle(undefined);
        }
    }
};

MissionIcon.prototype.getLockedTipData = function () {
    if (Missions[this.mission.type].available) {
        return cleverapps.humanReadableNumber({ floatLevel: Missions[this.mission.type].available.level });
    }
};

MissionIcon.prototype.isAttentionRequired = function () {
    if (this.mission.isMinigameMission()) {
        return this.mission.canPlayMinigame();
    }

    if (this.mission.isPassMission()) {
        return this.mission.logic.countAvailableRewards() > 0;
    }

    if (this.mission.isSlotMachineMission()) {
        return this.mission.logic.getTickets() > 0;
    }

    if (this.mission.runningCompetition && this.mission.runningCompetition.hasPlaceChanged()) {
        return true;
    }

    return this.mission.type === Mission.TYPE_BONUS_WORLD;
};

MissionIcon.prototype.getForce = function () {
    return this.mission.iconForce;
};

MissionIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: this.mission.name + "MissionIconClicked",
        action: function (f) {
            if (!this.mission.isRunning()) {
                this.mission.displayCompleted(f);
                return;
            }

            var ViewClass = this.mission.getViewClass();
            var ViewConstructor = this.mission.getViewConstructor();
            var view = ViewConstructor ? ViewConstructor(this.mission) : new ViewClass(this.mission);

            if (view instanceof cleverapps.FixedWidthScene) {
                cleverapps.scenes.replaceScene(view, f);
            } else {
                cleverapps.meta.onceNoWindowsListener = f;
            }
        }.bind(this)
    });
};
