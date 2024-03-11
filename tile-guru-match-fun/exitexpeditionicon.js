/**
 * Created by Andrey Popov on 26.10.2021
 */

var ExitExpeditionIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.exit_expedition_json,
        targets: "mainWorld",
        control: "ExitExpeditionIcon"
    });
};

ExitExpeditionIcon.prototype = Object.create(SideBarIcon.prototype);
ExitExpeditionIcon.prototype.constructor = ExitExpeditionIcon;

ExitExpeditionIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "ExitExpeditionIconClicked",
        actions: [
            function (f) {
                setTimeout(f, 300);
            },

            function (f) {
                cleverapps.travelBook.gotoMainScene(f);
            }
        ]
    });
};

ExitExpeditionIcon.prototype.resetState = function () {
    this.available = cleverapps.travelBook.isExpedition() && !cleverapps.config.editorMode;
    if (this.available) {
        this.setTitle(Messages.get("Exit"));

        var pocket = new Pocket();
        this.setAttention(!pocket.isEmpty());
    }
};
