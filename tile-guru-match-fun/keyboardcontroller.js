/**
 * Created by slava on 12/8/19
 */

var KeyboardController = function () {
    this.bindings = {};

    this.keyPressed = {};

    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: this.onKeyPressedHandler.bind(this),
        onKeyReleased: this.onKeyReleasedHandler.bind(this)
    }), 2);
};

KeyboardController.prototype.RETURN_THROTTLE = 250;
KeyboardController.prototype.THROTTLE_KEYS = cleverapps.createSet([cc.KEY.escape, cc.KEY.back]);
KeyboardController.prototype.KEYS = cleverapps.createSet([cc.KEY.ctrl, cc.KEY.shift]);

if (cleverapps.config.debugMode) {
    // cc.KEY.a - disable spines on ctrl + click
    KeyboardController.prototype.KEYS = cleverapps.createSet([cc.KEY.ctrl, cc.KEY.alt, cc.KEY.shift, cc.KEY.s, cc.KEY.d,
        cc.KEY.r, cc.KEY.j, cc.KEY.a, cc.KEY.Delete, cc.KEY.c, cc.KEY.h, cc.KEY.w, cc.KEY.m, cc.KEY.f, cc.KEY.q, cc.KEY.v, cc.KEY.y,
        cc.KEY.space, cc.KEY.l, cc.KEY.b, cc.KEY.x]);
}

KeyboardController.prototype.bindKeys = function (id, comboKeys, callback) {
    this.bindings[id] = {
        combo: comboKeys,
        callback: callback
    };
    return id;
};

KeyboardController.prototype.unbindKeys = function (id) {
    delete this.bindings[id];
};

KeyboardController.prototype.isPressed = function (key) {
    return this.keyPressed[key];
};

KeyboardController.prototype.onKeyPressedHandler = function (key) {
    if (this.keyPressed[key]) {
        return;
    }

    if (this.KEYS[key]) {
        this.keyPressed[key] = true;
    }

    var bindings = cleverapps.values(this.bindings).sort(function (a, b) {
        return b.combo.length - a.combo.length;
    });

    for (var i = 0; i < bindings.length; i++) {
        var ok = bindings[i].combo.every(function (comboKey) {
            if (this.KEYS[comboKey]) {
                if (!this.keyPressed[comboKey]) {
                    return false;
                }
            } else if (comboKey !== key) {
                return false;
            }

            return true;
        }, this);

        if (ok) {
            bindings[i].callback();
            break;
        }
    }
};

KeyboardController.prototype.onKeyReleasedHandler = function (key) {
    if (this.KEYS[key]) {
        this.keyPressed[key] = false;
    }

    if (this.THROTTLE_KEYS[key]) {
        this.returnAction();
    }
};

KeyboardController.prototype.returnAction = cleverapps.throttle(KeyboardController.prototype.RETURN_THROTTLE, function () {
    var currentWindow = cleverapps.windows.list[cleverapps.windows.list.length - 1];
    if (cleverapps.sceneDebugger && cleverapps.sceneDebugger.selectedNode) {
        if (typeof EditorMap2dDecoratorView !== "undefined" && cleverapps.sceneDebugger.selectedNode instanceof EditorMap2dDecoratorView) {
            cleverapps.sceneDebugger.selectedNode.unselect();
        } else {
            cleverapps.sceneDebugger.selectedNode.cleanupBorder();
            cleverapps.sceneDebugger.selectedNode = undefined;
        }
    } else if (currentWindow && currentWindow.closeByBackButton) {
        currentWindow.closeByBackButton();
    } else if (cleverapps.toolModel && !(cleverapps.scenes.getRunningScene() instanceof AdministratorScene)) {
        if (cleverapps.toolModel.isOpened()) {
            cleverapps.toolModel.hide();
        } else {
            cleverapps.toolModel.show();
        }
    } else {
        var scene = cleverapps.scenes.getRunningScene();
        if (scene && !(scene instanceof LoaderScene)) {
            scene.closeAction();
        }
    }
});
