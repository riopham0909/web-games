/**
 * Created by iamso on 08.07.2021
 */

var InviteIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.invite_icon_json,
        priority: SideBar.PRIORITY_REDUNDANT
    });
};

InviteIcon.prototype = Object.create(SideBarIcon.prototype);
InviteIcon.prototype.constructor = InviteIcon;

InviteIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "InviteIcon",
        action: function (f) {
            cleverapps.platform.inviteFriends(function (code) {
                if (code === cleverapps.CODE_SUCCEED) {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.INVITE_ICON_INVITE);
                }
                f();
            });
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

InviteIcon.prototype.resetState = function () {
    this.available = levels.user.checkAvailable(cleverapps.Availables.INVITE_FRIENDS_ICON)
        && !cleverapps.flags.noinvites;

    if (this.available) {
        if (cleverapps.config.type === "merge") {
            this.available = cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition();
        }
    }
};
