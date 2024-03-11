/**
 * Created by Andrey Popov on 9.11.20
 */

cleverapps.MissionRow = cleverapps.Row.extend({
    ctor: function (params, options) {
        this.mission = options.mission;

        this._super(params, options);
    },

    getRewards: function () {
        return this.mission.getPrizeByPlace(this.currentPlace - 1);
    }
});