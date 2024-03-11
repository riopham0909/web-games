/**
 * Created by Andrey Popov on 06.05.22
 */

var TeaserIcon = function (type) {
    SideBarIcon.call(this, {
        animation: Missions[type].sideBarJson,
        priority: SideBar.PRIORITY_REDUNDANT,
        progressIconJson: Missions[type].sideBarProgressIconJson
    });

    this.type = type;
    this.available = true;

    this.resetState();
};

TeaserIcon.prototype = Object.create(SideBarIcon.prototype);
TeaserIcon.prototype.constructor = TeaserIcon;

TeaserIcon.prototype.resetState = function () {
    this.available = MissionManager.hasProperParent(Missions[this.type]);

    if (this.available) {
        this.setLocked(true);
        this.setAttention(false);
        this.setFinger(false);

        this.setTitle(Messages.get("IconLocked.TextDefault", {
            levelNo: this.getLockedTipData()
        }));
    }
};

TeaserIcon.prototype.getLockedTipData = function () {
    if (Missions[this.type].available) {
        return cleverapps.humanReadableNumber({ floatLevel: Missions[this.type].available.level });
    }
};
