/**
 * Created by mac on 8/26/20
 */

var TooltipManager = function () {
    this.active = undefined;

    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: function () {
            this.onClick();
        }.bind(this)
    }), -1);

    if ("mouse" in cc.sys.capabilities) {
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseScroll: function () {
                this.onClick();
            }.bind(this)
        }), -1);
    }
};

TooltipManager.prototype.create = function (target, options) {
    if (target.tooltipHandler) {
        this.remove(target);
    }

    target.baseScaleX = target.scaleX;
    target.baseScaleY = target.scaleY;
    target.tooltipHandler = cleverapps.UI.onClick(target, function (touch) {
        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }

        if (options.clickableArea) {
            var clickPosition = options.clickableArea.convertTouchToNodeSpace(touch);
            if (cc.rectContainsPoint(cc.rect(0, 0, options.clickableArea.width, options.clickableArea.height), clickPosition)) {
                cleverapps.tooltipManager.onClick(target, options);
            }
        } else {
            cleverapps.tooltipManager.onClick(target, options);
        }
    });
};

TooltipManager.prototype.remove = function (target) {
    if (target.tooltipHandler) {
        target.tooltipHandler.remove();
        target.tooltipHandler = undefined;
    }
};

TooltipManager.prototype.onClick = cleverapps.accumulate(0, function (target, options) {
    if (!target && !this.active) {
        return;
    }

    options = options || {};
    var oldTarget = this.active && this.active.target;
    var needShow = target && oldTarget !== target;

    this._hide();
    if (needShow || options.forceShow) {
        this._show(target, options);
    }
});

TooltipManager.prototype._show = function (target, options) {
    var tooltip = new cleverapps.UI.Tooltip(target, options);

    cleverapps.scenes.getRunningScene().movingNode.addChild(tooltip);
    addCleaner(tooltip, function () {
        if (this.active === tooltip) {
            delete this.active;
        }
    }.bind(this));

    this.active = tooltip;
};

TooltipManager.prototype._hide = function () {
    if (this.active) {
        this.active.hide();
    }
};