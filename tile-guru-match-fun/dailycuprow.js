/**
 * Created by vladislav on 2/4/19
 */

cleverapps.DailyCupRow = cleverapps.Row.extend({
    ctor: function (params) {
        this._super(params, {
            dataIcon: bundles.tablerow_icons.frames.dailycup
        });
    },

    createPrizeIcon: function (place) {
        return cleverapps.DailyCupRow.choosePrizeIcon(cleverapps.dailyCup, place);
    },

    getRewards: function () {
        var rewards = cleverapps.dailyCup.listRewards();
        return rewards[this.currentPlace - 1];
    },

    getPrizeTooltipText: function () {
        if (this.currentPlace <= 3) {
            return "Cup" + this.currentPlace + "PlaceTooltip";
        }

        return "CupRewardTooltip";
    }
});

cleverapps.DailyCupRow.choosePrizeIcon = function (cup, place) {
    var rewards = cup.listRewards();
    if (rewards[place - 1]) {
        return new cc.Sprite(bundles.table.frames["prize_" + place] || bundles.table.frames.prize_5);
    }
};