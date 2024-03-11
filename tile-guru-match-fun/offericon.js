/**
 * Created by r4zi4l on 04.05.2022
 */

var OfferIcon = function (offer) {
    SideBarIcon.call(this, {
        animation: offer.sideBarJson,
        priority: SideBar.PRIORITY_REDUNDANT
    });

    this.offer = offer;

    this.resetState();
};

OfferIcon.prototype = Object.create(SideBarIcon.prototype);
OfferIcon.prototype.constructor = OfferIcon;

OfferIcon.prototype.resetState = function () {
    if (cleverapps.config.editorMode) {
        this.available = false;
        return;
    }

    this.available = this.offer.hasProperMission();

    if (this.available) {
        var timeLeft = this.offer.getTimeLeft();
        this.setLeftTime(timeLeft);
        this.setTitle(undefined);
    }
};

OfferIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: this.offer.name + "IconClicked",
        action: function (f) {
            new MissionOfferWindow(this.offer);
            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this)
    });
};

OfferIcon.prototype.getForce = function () {
    return this.offer.force;
};