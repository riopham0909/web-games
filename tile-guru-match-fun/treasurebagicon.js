/**
 * Created by razial on 07.12.2022
 */

var TreasureBagIcon = cc.Node.extend({
    ctor: function () {
        this._super();

        var styles = cleverapps.styles.TreasureBag;

        var background = new cc.Sprite(bundles.treasurebag.frames.treasurebag_bg_png);
        background.setPositionRound(background.width / 2, background.height / 2);

        this.setAnchorPoint2();
        this.setContentSize2(background.width, background.height);
        this.addChild(background);

        var animation = new cleverapps.Spine(bundles.treasurebag.jsons.treasurebag_json);
        animation.setAnimation(0, "animation", true);
        animation.setPositionRound(styles.animation);
        this.addChild(animation);

        cleverapps.aims.registerTarget("default", this, {
            withoutDelta: true,
            treasureBag: true
        });

        cleverapps.treasureBag.onShow = this.createListener(this.show.bind(this));
        cleverapps.treasureBag.onHide = this.createListener(this.hide.bind(this));
    },

    updatePosition: function () {
        var styles = cleverapps.styles.TreasureBag;

        var sideBarStyles = cleverapps.styles.SideBarSlot;

        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            this.setScale(sideBarStyles.mobileScale);
        }

        this.baseScale = this.scale;

        var padding = sideBarStyles.wideModePadding && sideBarStyles.wideModePadding[cleverapps.resolution.mode] || sideBarStyles.padding;
        var hideX = this.width / 2 * this.scale;
        var hideY = this.height / 2 * this.scale + styles.offsetY;
        var moveX = (this.width + padding.horizontal) * this.scale;

        this.hidePosition = {
            x: this.parent.width + hideX,
            y: hideY
        };

        this.showPosition = {
            x: this.hidePosition.x - moveX,
            y: hideY
        };
    },

    show: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.Show(),
            new cc.MoveTo(0.5, this.calculatePositionRound(this.showPosition)).easing(cc.easeBackOut())
        ));
    },

    hide: function (silent) {
        if (silent) {
            this.setVisible(false);
            this.setPositionRound(this.hidePosition);
            return;
        }

        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.MoveTo(0.15, this.calculatePositionRound(this.hidePosition)),
            new cc.Hide()
        ));
    }
});

TreasureBagIcon.ZORDER = BaseWindow.WINDOWS_ZORDER + 1;

cleverapps.styles.TreasureBag = {
    animation: {
        x: { align: "center", dx: -2 },
        y: { align: "center", dy: -8 }
    },

    offsetY: 60
};