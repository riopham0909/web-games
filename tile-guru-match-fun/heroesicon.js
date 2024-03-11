/**
 * Created by mac on 7/25/18
 */

var HeroesIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.heroes_icon_json
    });
};

HeroesIcon.prototype = Object.create(SideBarIcon.prototype);
HeroesIcon.prototype.constructor = HeroesIcon;

HeroesIcon.prototype.resetState = function () {
    this.available = typeof match3 !== "undefined" && match3.heroes && match3.heroes.available({
        future: true
    });

    var locked = this.available && !match3.heroes.available();

    if (locked) {
        this.setLocked(true);
        this.setAttention(false);
        this.setTitle(Messages.get("IconLocked.TextDefault", {
            levelNo: this.getLockedTipData()
        }));
    } else {
        this.setLocked(false);
        this.setAttention(match3.heroes.canUpgradeSomebody());
        this.setTitle(undefined);
    }
};

HeroesIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "HeroesSceneFromIcon",
        action: function (f) {
            cleverapps.scenes.replaceScene(new HeroesScene(), f);
        }
    });
};

HeroesIcon.prototype.getForce = function () {
    return Forces.HEROES_AVAILABLE;
};

HeroesIcon.prototype.getLockedTipData = function () {
    return cleverapps.humanReadableNumber({ floatLevel: Heroes.AVAILABLE.level });
};
