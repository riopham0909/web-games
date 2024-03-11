/**
 * Created by iamso on 16.08.2021
 */

var RestoreProgress = function () {
    this.onShow = function () {};
    this.onHide = function () {};

    this.visible = false;
    this.opened = false;

    this.update();
};

RestoreProgress.prototype.isAvailable = function () {
    if (cleverapps.config.adminMode || cleverapps.config.editorMode || cleverapps.config.wysiwygMode) {
        return false;
    }

    if (!cleverapps.platform.isConnected(Platform.SOCIAL) || cleverapps.flags.nologin || cleverapps.social.isLoggedIn()) {
        return false;
    }

    if (cleverapps.config.importMode && cleverapps.flags.isLoggedIn) {
        return false;
    }

    if (cleverapps.config.type === "merge") {
        return cleverapps.user.level < 2;
    }

    return cleverapps.user.getFloatLevel() < 0.5;
};

RestoreProgress.prototype.isVisible = function () {
    if (!cleverapps.environment.isMainScene() && !cleverapps.environment.isGameScene() && !cleverapps.environment.isComicsScene()) {
        return false;
    }

    return true;
};

RestoreProgress.prototype.isOpened = function () {
    return this.opened;
};

RestoreProgress.prototype.update = function () {
    var visible = this.isAvailable() && this.isVisible() && !this.isOpened();
    if (visible === this.visible) {
        return;
    }

    this.visible = visible;

    if (visible) {
        this.onShow();
    } else {
        this.onHide();
    }
};

RestoreProgress.prototype.restore = function () {
    if (cleverapps.windows.currentWindow() instanceof FbConnectWindow) {
        return;
    }

    var actions = [
        function (f) {
            this.opened = true;
            this.update();

            new FbConnectWindow({
                restoreProgress: true,
                onClose: f
            });
        }.bind(this),

        function (f) {
            this.opened = false;
            this.update();
            f();
        }.bind(this)
    ];

    if (cleverapps.meta.isFocused()) {
        cleverapps.meta.distract({
            focus: "RestoreProgress",
            restore: true,
            keepControls: true,
            actions: actions
        });
    } else {
        cleverapps.meta.display({
            focus: "RestoreProgress",
            actions: actions
        });
    }
};
