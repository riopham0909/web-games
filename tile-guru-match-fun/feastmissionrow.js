/**
 * Created by vladislav on 03.02.2022
 */

FeastMissionRow = cleverapps.MissionRow.extend({
    ctor: function (params, options) {
        this.amountTooltip = options.amountTooltip;
        this.missionName = options.mission.name;

        this._super(params, options);
    },

    getPrizeTooltipText: function () {
        var unit = this.getRewardUnit(this.currentPlace - 1);
        if (unit) {
            var tooltipText;
            if (Array.isArray(unit)) {
                var unitNames = [];
                unit.forEach(function (u) {
                    unitNames.push(cleverapps.unitsLibrary.getUnitName(u));
                });
                tooltipText = unitNames.join(", ");
            } else {
                tooltipText = cleverapps.unitsLibrary.getUnitName(unit);
            }
            return tooltipText;
        }

        return this._super();
    },

    getTooltipText: function () {
        return this.amountTooltip;
    },

    getRewardUnit: function (place) {
        var rewards = RewardsConfig[this.missionName];
        if (rewards && rewards.places) {
            var reward = rewards.places[place];
            if (reward && reward.unit) {
                return reward.unit;
            }
        }
    },

    getRewards: function () {
        return { units: this.getRewardUnit(this.currentPlace - 1) };
    }
});

cleverapps.styles.FeastMissionRow = {};