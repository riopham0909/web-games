/**
 * Created by razial on 30.01.2023
 */

cc.ReplaceParent = cc.CallFunc.extend({
    ctor: function (parent) {
        this._super(function (target) {
            target.replaceParentSamePlace(parent, {
                keepScale: true
            });
        });
    }
});