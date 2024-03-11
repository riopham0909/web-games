/**
 * Created by slava on 25/12/19
 */

var Metha = function () {
    this.stack = [];

    this.pushState({
        focus: false,
        controls: [],
        eventNodes: []
    });
    this.pushState({
        focus: "initialize",
        controls: [],
        eventNodes: []
    });

    this.focusHistory = [];
    this.tempControls = {};

    // for cleverapps.windows callback
    this.onceNoWindowsListener = undefined;

    this.lastControlsVisible = {};
    this.onControlsListeners = {};
    this.controlsOptions = {};

    this.pendingListeners = [];
};

Metha.prototype.showControlsTemporary = function (controls) {
    cleverapps.toArray(controls).forEach(function (control) {
        this.tempControls[control] = true;
        if (!this.lastControlsVisible[control] && this.onControlsListeners[control]) {
            this.onControlsListeners[control](true);
            this.lastControlsVisible[control] = true;
        }
    }.bind(this));
};

Metha.prototype.hideControlsTemporary = function (controls) {
    cleverapps.toArray(controls).forEach(function (control) {
        delete this.tempControls[control];
        if (this.lastControlsVisible[control] && this.onControlsListeners[control] && this.controls.indexOf(control) === -1) {
            this.onControlsListeners[control](false);
            this.lastControlsVisible[control] = false;
        }
    }.bind(this));
};

Metha.prototype.clearTempControls = function () {
    this.tempControls = {};
};

Metha.prototype.registerControl = function (name, listener, hiddenByDefault) {
    if (typeof listener === "object") {
        listener = listener.createListener(listener.toggle.bind(listener));
    }

    if (hiddenByDefault) {
        this.controlsOptions[name] = {
            hiddenByDefault: hiddenByDefault
        };
    }

    this.onControlsListeners[name] = listener;

    listener(false, true);
    this.lastControlsVisible[name] = false;

    this.setControlsVisible(true);
};

Metha.prototype.removeControl = function (name) {
    delete this.onControlsListeners[name];
    delete this.lastControlsVisible[name];
};

Metha.prototype.updateControlsVisibility = function (silent) {
    for (var key in this.onControlsListeners) {
        var visible = this.controls.indexOf(key) !== -1 || this.tempControls[key];

        if (this.lastControlsVisible[key] !== visible) {
            this.onControlsListeners[key](visible, silent);
            this.lastControlsVisible[key] = visible;
        }
    }
};

Metha.prototype.setControlsVisible = function (silent) {
    this.clearUpdateTimeout();

    if (!this.isFocused() && !cleverapps.gameModes.noControls) {
        this.setControls(Object.keys(this.onControlsListeners).filter(function (control) {
            return this.shouldBeVisible(control);
        }.bind(this)));
    }

    if (silent) {
        this.updateControlsVisibility(true);
    } else {
        this.updateTimeout = setTimeout(this.updateControlsVisibility.bind(this), 100);
    }
};

Metha.prototype.shouldBeVisible = function (control) {
    return !this.isFocused() && (!this.controlsOptions[control] || !this.controlsOptions[control].hiddenByDefault || !cleverapps.environment.hasScene(this.controlsOptions[control].hiddenByDefault));
};

Metha.prototype.clearUpdateTimeout = function () {
    if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = undefined;
    }
};

Metha.prototype.debugMessage = function (message) {
    if (cleverapps.config.debugMode && !cc.sys.isNative) {
        throw message;
    } else {
        cleverapps.throwAsync(message);
    }
};

Metha.prototype.displayWhenFreeFocus = function (options) {
    if (!this.isFocused()) {
        this.display(options);
    } else {
        this.whenFreeFocus(this.display.bind(this, options));
    }
};

Metha.prototype.whenFreeFocus = function (listener) {
    if (!this.isFocused()) {
        listener();
    } else {
        this.pendingListeners.push(listener);
    }
};

Metha.prototype.distract = function (options) {
    if (!this.isFocused()) {
        this.debugMessage("Distract without focus! " + options.focus);
    }

    if (this.focus === options.focus) {
        this.debugMessage("Distract same focus!" + options.focus);
        return;
    }

    if (options.filter && !options.filter()) {
        return;
    }

    if (!options.restore) {
        while (this.stack.length > 1) {
            this.popState();
        }
    }

    this.grabFocus(options.focus, options);
    this.compound(this.freeFocus.bind(this, options.focus), options.actions || [options.action]);
};

Metha.prototype.display = function (options) {
    if (this.isFocused()) {
        return;
    }

    if (options.filter && !options.filter()) {
        return;
    }

    this.grabFocus(options.focus, options);
    this.compound(this.freeFocus.bind(this, options.focus), options.actions || [options.action]);
};

Metha.prototype.compound = function (f, actions, index, state) {
    index = index || 0;
    state = state || this.stack[this.stack.length - 1];

    if (this.stack[this.stack.length - 1] !== state) {
        state.action = this.compound.bind(this, f, actions, index, state);
        return;
    }

    if (actions.length === index) {
        f();
        return;
    }

    this.setEventNodes([]);

    actions[index](cleverapps.once(this.compound.bind(this, f, actions, index + 1, state)));
};

Metha.prototype.showControlsWhileFocused = function (controls, silent) {
    cleverapps.toArray(controls).forEach(function (control) {
        if (this.controls.indexOf(control) === -1) {
            this.controls.push(control);
            if (!this.lastControlsVisible[control] && this.onControlsListeners[control]) {
                this.onControlsListeners[control](true, silent);
                this.lastControlsVisible[control] = true;
            }
        } else if (silent && this.onControlsListeners[control]) {
            this.onControlsListeners[control](true, silent);
        }
    }, this);
};

Metha.prototype.isControlEnabled = function (control) {
    return cleverapps.intersect(this.controls, control).length > 0;
};

Metha.prototype.hideAllControls = function (silent) {
    this.setControls([]);
    this.updateControlsVisibility(silent);
};

Metha.prototype.hideControlsWhileFocused = function (controls) {
    cleverapps.toArray(controls).forEach(function (control) {
        var index = this.controls.indexOf(control);
        if (index !== -1 && !this.shouldBeVisible(control)) {
            this.controls.splice(index, 1);
            if (this.lastControlsVisible[control] && this.onControlsListeners[control] && !this.tempControls[control]) {
                this.onControlsListeners[control](false);
                this.lastControlsVisible[control] = false;
            }
        }
    }, this);
};

Metha.prototype.trigger = cleverapps.accumulate(0, function () {
    if (this.isFocused()) {
        return;
    }

    while (this.pendingListeners.length > 0) {
        var first = this.pendingListeners.shift();
        first();
        if (this.isFocused()) {
            return;
        }
    }

    this.onFocusLostListenerPlacements();
});

Metha.prototype.checkEventNode = function (node) {
    if (node.alwaysOn) {
        return true;
    }

    var scene = cleverapps.scenes.getRunningScene();

    if (!this.isFocused()) {
        return true;
    }

    var eventNodes = this.eventNodes;

    if (scene.toolMenu) {
        eventNodes = eventNodes.concat(scene.toolMenu, scene.toolMenu.opener);
    }

    if (scene.snapshotBar) {
        eventNodes = eventNodes.concat(scene.snapshotBar);
    }

    if (!eventNodes.length) {
        return false;
    }

    if (eventNodes[0] === scene) {
        return true;
    }

    while (node) {
        if (eventNodes.indexOf(node) !== -1) {
            return true;
        }
        node = node.parent;
    }
    return false;
};

Metha.prototype.setEventNodes = function (eventNodes) {
    var state = this.stack[this.stack.length - 1];
    state.eventNodes = this.eventNodes = eventNodes;
};

Metha.prototype.setControls = function (controls) {
    var state = this.stack[this.stack.length - 1];
    state.controls = this.controls = controls;
};

Metha.prototype.grabFocus = function (name, options) {
    options = options || {};

    console.log("Grab focus: " + name);

    var controls = cleverapps.toArray(options.control || []);
    if (options.keepControls) {
        controls = this.controls;
    }

    this.saveHistory("+" + name);
    this.pushState({
        focus: name,
        controls: controls.slice(),
        eventNodes: []
    });

    this.setControlsVisible(cleverapps.silentIntro);
    this.trigger();

    cleverapps.eventBus.trigger("changeFocus");
};

Metha.prototype.freeFocus = function (name) {
    if (this.focus !== name) {
        console.log("Wrong focus clearing: " + this.focus + " > " + name);
        return;
    }

    console.log("Focus freed: " + this.focus);

    this.saveHistory("-" + this.focus);
    this.popState();

    this.setControlsVisible(cleverapps.silentIntro);
    this.trigger();

    cleverapps.eventBus.trigger("changeFocus");

    cleverapps.bundleLoader.clearUnusedResources();

    this.resumeCompound();
};

Metha.prototype.saveHistory = function (focus) {
    this.focusHistory.push(focus);
    this.focusHistory = this.focusHistory.slice(-20);
};

Metha.prototype.pushState = function (state) {
    this.stack.push(state);

    this.focus = state.focus;
    this.setControls(state.controls);
    this.setEventNodes(state.eventNodes);
};

Metha.prototype.popState = function () {
    if (this.stack.length === 1) {
        this.debugMessage("Attempt to free default state");
        return;
    }

    var state = this.stack.pop();
    state.controls = [];
    state.eventNodes = [];
    state.action = undefined;

    state = this.stack[this.stack.length - 1];
    this.focus = state.focus;
    this.setControls(state.controls);
    this.setEventNodes(state.eventNodes);
};

Metha.prototype.resumeCompound = function () {
    var state = this.stack[this.stack.length - 1];

    var action = state.action;
    state.action = undefined;

    if (action) {
        action();
    }
};

Metha.prototype.isFocused = function () {
    return this.focus !== false;
};

Metha.prototype.getFocus = function () {
    return this.focus;
};

Metha.prototype.getType = function () {
    if (cleverapps.config.source === "playable") {
        return Metha.NONE;
    }

    switch (cleverapps.config.meta) {
        case "farm":
            return Metha.FARM;
        case "homefix":
            return Metha.HOMEFIX;
        case "shortmeta":
            return Metha.SHORTMETA;
        case "simple":
            return Metha.SIMPLE;
        case "none":
            return Metha.NONE;
        case "fishdom":
            return Metha.FISHDOM;
    }

    return Metha.HOSE;
};

Metha.prototype.getMainScene = function () {
    if (cleverapps.config.source === "playable") {
        return PlayableAdsScene;
    }

    switch (this.getType()) {
        case Metha.FARM:
            return FarmScene;

        case Metha.HOMEFIX:
            return HomefixScene;

        case Metha.FISHDOM:
            return FishdomScene;

        case Metha.SHORTMETA:
            return ShortMetaScene;

        case Metha.SIMPLE:
            return SimpleMainScene;

        case Metha.NONE:
            return GameScene;

        default:
            return HoseScene;
    }
};

Metha.prototype.getRumble = function () {
    return this.getMainObject().knockoutGame.rumble;
};

Metha.prototype.stopRumble = function () {
    return this.getMainObject().knockoutGame.stopRumble();
};

Metha.prototype.getMainObject = function () {
    switch (this.getType()) {
        case Metha.FARM:
            return cleverapps.farm;

        case Metha.FISHDOM:
            return cleverapps.fishdom;

        case Metha.HOMEFIX:
            return cleverapps.home;

        case Metha.SHORTMETA:
            return cleverapps.shortmeta;

        case Metha.SIMPLE:
            return cleverapps.simple;

        case Metha.HOSE:
            return cleverapps.hose;

        case Metha.NONE:
            return NoMetha;
    }
};

Metha.prototype.wantsToPlay = function (f, level) {
    if (cleverapps.lives && cleverapps.lives.isEmpty()) {
        new LivesShopWindow();
        cleverapps.meta.onceNoWindowsListener = f;
        return;
    }

    var mainObject = this.getMainObject();

    if (this.getType() === Metha.FARM) {
        var building = level && level.building && level.building.canStillProvideQuestItems()
            ? level.building
            : mainObject.findBuildingForActiveItem() || cleverapps.Random.mathChoose(mainObject.listAvailableProvidesBuildings());

        level = MethaHelper.getCurrentLevel(building);
    } else {
        level = level || MethaHelper.getCurrentLevel();
    }

    if (this.getType() === Metha.HOSE) {
        cleverapps.Plot.isPassedAllEpisodes = levels.user.isPassedAll();
    }

    if (mainObject.knockoutGame) {
        mainObject.knockoutGame.wantsToPlay(f, level);
    } else {
        MethaHelper.start(f, level);
    }
};

Metha.prototype.wantsToReplay = function (f, level) {
    MethaHelper.start(f, level);
};

Metha.HOSE = 0;
Metha.FARM = 1;
Metha.HOMEFIX = 2;
Metha.SHORTMETA = 3;
Metha.SIMPLE = 4;
Metha.NONE = 5;
Metha.FISHDOM = 6;
