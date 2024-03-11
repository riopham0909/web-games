/**
 * Created by andrey on 19.09.18.
 */

var Buttons = cc.Node.extend({
    ctor: function (buttons) {
        this._super();

        buttons = Buttons.filter(buttons);

        if (buttons.length === 0) {
            return;
        }

        this.buttons = {};
        buttons.forEach(function (button) {
            this.buttons[button.__instanceId] = button;
            this.addChild(button);
        }, this);

        this.arrange();
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        this.arrange();
    },

    arrange: function () {
        var styles = cleverapps.styles.Buttons;
        var margin = styles.margin.x;
        var y = 0;

        if (this.children.length > 1 && this.parent) {
            var availableWidth = this.parent.width - 2 * styles.padding.x;
            var childrenWidth = 0;
            this.children.forEach(function (child) {
                childrenWidth += child.width;
                y = Math.max(y, child.height / 2);
            });
            var maxMargin = Math.round((availableWidth - childrenWidth) / (this.children.length - 1));
            margin = Math.max(margin, maxMargin);
        }
        this.margin = margin;

        cleverapps.UI.arrangeWithMargins(this.children, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: margin,
            y: y + styles.padding.y
        });

        cleverapps.UI.wrap(this);

        this.setAnchorPoint2();
    },

    add: function (button) {
        if (Buttons.filter([button]).length === 0) {
            return;
        }

        this.buttons[button.__instanceId] = button;
        this.addChild(button);

        this.arrange();
    },

    remove: function (button) {
        button = this.buttons[button.__instanceId];

        if (!button) {
            return;
        }

        button.stopAllActions();
        button.runAction(new cc.Sequence(new cc.ScaleTo(0.3, 0), new cc.RemoveSelf()));

        this.children.forEach(function (child) {
            if (child.x > button.x) {
                child.stopAllActions();
                child.runAction(new cc.Sequence(
                    new cc.DelayTime(0.3),
                    new cc.MoveBy(0.3, -button.width - this.margin, 0)
                ));
            }
        });

        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.MoveBy(0.3, (button.width + this.margin) / 2, 0)
        ));
    },

    removeAll: function () {
        for (var id in this.buttons) {
            this.buttons[id].removeFromParent();
        }
    },

    onShow: function () {
        this.children.forEach(function (button) {
            button.stopAllActions();
            var scale = button.scale;
            button.setScale(0);
            button.runAction(new cc.ScaleTo(0.7, scale).easing(cc.easeBackOut()));
        });
    }
});

Buttons.filter = function (buttons) {
    return buttons.filter(function (button) {
        return button && button.onMouseOver;
    });
};

Buttons.choose = function (buttons) {
    buttons = Buttons.filter(buttons);

    if (buttons.length === 0) {
        return;
    }

    return buttons[Math.floor(Math.random() * buttons.length)];
};

Buttons.remove = function (button) {
    if (button.parent instanceof Buttons && button.parent.buttons[button.__instanceId]) {
        var buttons = button.parent;
        if (buttons.children.length > 1) {
            buttons.remove(button);
        }
    } else {
        button.removeFromParent();
    }
};

cleverapps.styles.Buttons = {
    margin: {
        x: 20
    },
    padding: {
        x: 70,
        y: 60
    }
};
