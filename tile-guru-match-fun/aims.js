/**
 * Created by razial on 05.12.2022
 */

var Aims = function () {
    this.targets = {};
    this.timeouts = {};
};

Aims.prototype.clear = function () {
    for (var type in this.targets) {
        this.targets[type].forEach(this.clearHideTimeout.bind(this));
        this.targets[type] = [];
    }

    this.onceAllHiddenCallback = undefined;
};

Aims.prototype.registerTarget = function (types, target, options) {
    options = Object.assign({}, options);
    types = cleverapps.toArray(types);

    if (!types || !types.length) {
        cleverapps.throwAsync("no type specified for aim");
        return;
    }

    if (!target) {
        cleverapps.throwAsync("no target specified for aim");
        return;
    }

    if (target.aim) {
        cleverapps.throwAsync("target already registered as an aim");
        return;
    }

    options.types = types;
    options.priority = options.priority || 0;
    target.aim = options;

    types.forEach(function (type) {
        if (!this.targets[type]) {
            this.targets[type] = [];
        }

        var targets = this.targets[type];
        targets.push(target);

        for (var i = targets.length - 1; i > 0 && target.aim.priority < targets[i - 1].aim.priority; --i) {
            var tmp = targets[i - 1];
            targets[i - 1] = targets[i];
            targets[i] = tmp;
        }
    }.bind(this));

    target.addCleaner(this.removeTarget.bind(this, target));
};

Aims.prototype.removeTarget = function (target) {
    if (!target.aim) {
        return;
    }

    target.aim.types.forEach(function (type) {
        var index = this.targets[type].indexOf(target);
        if (index !== -1) {
            this.targets[type].splice(index, 1);
        }
    }.bind(this));

    this.clearHideTimeout(target);
    target.aim = undefined;
};

Aims.prototype.clearHideTimeout = function (target) {
    var timeout = this.timeouts[target.__instanceId];
    if (timeout) {
        cleverapps.timeouts.clearTimeout(timeout);
        delete this.timeouts[target.__instanceId];
    }
};

Aims.prototype.getTarget = function (types, options) {
    if (types instanceof cc.Node) {
        return types;
    }

    options = options || {};

    types = cleverapps.toArray(types) || [];

    if (!options.noDefault) {
        types.push("default");
    }

    for (var j = 0; j < types.length; ++j) {
        var type = types[j];
        var targets = this.targets[type];
        if (targets) {
            var target = this.chooseTarget(targets);
            if (target) {
                return target;
            }
        }
    }
};

Aims.prototype.chooseTarget = function (targets) {
    for (var i = targets.length - 1; i >= 0; --i) {
        var target = targets[i];
        var aim = target.aim;

        if (!aim) {
            continue;
        }

        if (aim.filter && !aim.filter()) {
            continue;
        }

        if (!cleverapps.UI.isNodeOnScene(target, 0.3, 0.3)) {
            if (!aim.treasureBag && !aim.toggle && !aim.controls
                && !(aim.scrollsToTarget && aim.scrollsToTarget())) {
                continue;
            }
        }

        return target;
    }
};

Aims.prototype.showTarget = function (target) {
    if (!target || !target.aim) {
        return;
    }

    var wasVisible = true;

    if (target.aim.toggle) {
        wasVisible = false;
        target.aim.toggle(true, false);
    } else if (target.aim.controls) {
        wasVisible = false;
        cleverapps.meta.showControlsTemporary(target.aim.controls);
    } else if (target.aim.treasureBag) {
        wasVisible = cleverapps.treasureBag.isVisible();
        cleverapps.treasureBag.show();
    }

    if (this.timeouts[target.__instanceId]) {
        wasVisible = false;
        this.clearHideTimeout(target);
    }

    if (!wasVisible) {
        this.timeouts[target.__instanceId] = cleverapps.timeouts.setTimeout(this.hideTarget.bind(this, target), Aims.SHOW_DURATION);
    }
};

Aims.prototype.hideTarget = function (target) {
    this.clearHideTimeout(target);
    this.onceAllHidden();

    if (!target.aim) {
        return;
    }

    if (target.aim.toggle) {
        target.aim.toggle(false, false);
    } else if (target.aim.controls) {
        cleverapps.meta.hideControlsTemporary(target.aim.controls);
    } else if (target.aim.treasureBag) {
        cleverapps.treasureBag.hide();
    }
};

Aims.prototype.hasShownTargets = function () {
    return !!Object.keys(this.timeouts).length;
};

Aims.prototype.whenAllHidden = function (callback) {
    this.onceAllHiddenCallback = callback;
    this.onceAllHidden();
};

Aims.prototype.onceAllHidden = function () {
    if (this.onceAllHiddenCallback && !this.hasShownTargets()) {
        cleverapps.timeouts.setTimeout(this.onceAllHiddenCallback, Aims.HIDE_ANIMATION_DURATION);
        this.onceAllHiddenCallback = undefined;
    }
};

Aims.SHOW_DURATION = 1600;
Aims.HIDE_ANIMATION_DURATION = 200;
