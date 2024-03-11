/**
 * Created by ivan on 16.04.18.
 */

var LeaderBoardToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.LEADER_BOARD);

    this.enable();
};

LeaderBoardToolbarItem.prototype = Object.create(ToolbarItem.prototype);
LeaderBoardToolbarItem.prototype.constructor = FriendRequestsToolbarItem;

LeaderBoardToolbarItem.prototype.onClick = function () {
    if (cleverapps.social instanceof cleverapps.MobileVkSocial) {
        cleverapps.social.showLeaderBoardBox({
            userResult: levels.user.getHumanReadableNumber()
        }, function () {});
        return;
    }

    cleverapps.meta.display({
        focus: "LeadersWindow",
        action: function (f) {
            new LeadersWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

LeaderBoardToolbarItem.prototype.isVisible = function () {
    if (!cleverapps.rewardedAdsManager.isEnabled()) {
        return false;
    }

    if (cleverapps.flags.norest && !cleverapps.config.importMode) {
        return false;
    }

    return ToolbarItem.prototype.isVisible.call(this) && levels.user.checkAvailable(cleverapps.Availables.LEADER_BOARD);
};
