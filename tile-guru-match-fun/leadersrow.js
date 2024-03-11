/**
 * Created by slava on 8/8/18
 */

cleverapps.LeadersRow = cleverapps.Row.extend({
    ctor: function (params) {
        this._super(params, {
            prizes: false
        });
    }
});

cleverapps.styles.LeadersRow = {};