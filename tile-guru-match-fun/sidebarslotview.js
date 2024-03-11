/**
 * Created by iamso on 05.03.19.
 */

var SideBarSlotView = cc.Node.extend({
    ctor: function (slot, parent) {
        this._super();

        var styles = cleverapps.styles.SideBarSlot;
        this.setAnchorPoint2();
        this.setContentSize2(styles.width, styles.height);

        this.sideBar = parent;
        this.row = slot.row;
        this.col = slot.col;

        this.updatePosition();

        this.debugId = "SideBarSlot" + this.row + this.col;
    },

    updatePosition: function () {
        this.stopAllActions();
        this.visible = true;

        var styles = cleverapps.styles.SideBarSlot;

        this.setScale(cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.mobileScale : 1);

        var padding = styles.wideModePadding && styles.wideModePadding[cleverapps.resolution.mode] || styles.padding;
        var hideX = this.width / 2 * this.scale;
        var moveX = (this.width + padding.horizontal) * this.scale;
        var safePaddingTop = cleverapps.resolution.getSafePadding().top;
        var slotY = this.sideBar.height - padding.top - this.row * (styles.margin + this.height * this.scale) - safePaddingTop;

        if (this.col === SideBar.LEFT_COLUMN) {
            this.hidePosition = { x: -hideX, y: slotY };
            this.showPosition = { x: this.hidePosition.x + moveX, y: slotY };
        } else {
            this.hidePosition = { x: this.sideBar.width + hideX, y: slotY };
            this.showPosition = { x: this.hidePosition.x - moveX, y: slotY };
        }

        var controlName = this.iconView && (this.iconView.model.control || this.getControlName());

        if (cleverapps.meta.lastControlsVisible[controlName]) {
            this.isShown = true;
            this.setPositionRound(this.showPosition);
        } else {
            this.isShown = false;
            this.visible = false;
            this.setPositionRound(this.hidePosition);
        }
    },

    getControlName: function () {
        return "sideBarSlot_" + this.row + "_" + this.col;
    },

    insert: function (icon) {
        this.iconView = icon;
        this.addChild(icon);
        icon.setPositionRound(this.width / 2, this.height / 2);

        cleverapps.meta.registerControl(icon.model.control || this.getControlName(), this, cleverapps.values(cleverapps.Environment).filter(function (scene) {
            return scene !== cleverapps.Environment.SCENE_MAIN;
        }));
    },

    eject: function () {
        cleverapps.meta.removeControl(this.iconView.model.control || this.getControlName());

        this.iconView.removeFromParent();
        this.iconView = undefined;
    },

    release: function () {
        cleverapps.meta.removeControl(this.iconView.model.control || this.getControlName());

        this.iconView.removeTemporarily(false);
        var icon = this.iconView;
        this.iconView = undefined;
        return icon;
    },

    showForce: function () {
        cleverapps.meta.showControlsWhileFocused(this.iconView.model.control || this.getControlName(), true);
        this.iconView.showForce();
    },

    toggle: function (visible, silent) {
        if (visible) {
            this.show(silent);
        } else {
            this.hide(silent);
        }
    },

    show: function (silent) {
        this.isShown = true;
        this.sideBar.updateZOrder();

        if (this.iconView) {
            this.iconView.showAttentionAnimation();
        } else {
            silent = true;
        }

        this.stopAllActions();
        if (silent) {
            this.visible = true;
            this.setPositionRound(this.showPosition);
        } else {
            this.runAction(new cc.Sequence(
                new cc.DelayTime(0.3 + 0.1 * this.row),
                new cc.Show(),
                new cc.MoveTo(1, this.showPosition).easing(cc.easeElasticOut(0.6))
            ));
        }

        cleverapps.scenes.onAvoidNodeVisibilityChanged();
    },

    hide: function (silent) {
        this.isShown = false;

        if (!this.iconView) {
            silent = true;
        }

        this.stopAllActions();
        if (silent) {
            this.visible = false;
            this.setPositionRound(this.hidePosition);
        } else {
            this.runAction(new cc.Sequence(
                new cc.MoveTo(0.15, this.hidePosition).easing(cc.easeBackIn()),
                new cc.Hide()
            ));
        }

        cleverapps.scenes.onAvoidNodeVisibilityChanged();
    }
});

cleverapps.styles.SideBarSlot = {
    width: 200,
    height: 200,
    margin: 20,
    mobileScale: 0.8,
    padding: {
        top: 220,
        horizontal: 15
    }
};
