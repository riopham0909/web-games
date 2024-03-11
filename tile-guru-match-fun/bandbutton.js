/**
 * Created by Oleg on 26/02/18
 */

var BandButton = cc.Node.extend({
    avoidNode: "BandButton",
    ctor: function (options) {
        this._super();

        var styles = cleverapps.styles.BandButton;

        this.options = options;

        var contentSize = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL && styles.mobileSize
            ? styles.mobileSize
            : styles;

        contentSize = {
            width: contentSize.width,
            height: contentSize.height + cleverapps.resolution.getSafePadding().top
        };

        this.setAnchorPoint2();
        this.setContentSize2(contentSize);
        this.setLocalZOrder(3);

        this.updatePosition();

        var bg = cleverapps.UI.createScale9Sprite(bundles.buttons_main.frames.scene_exit_button, cleverapps.UI.Scale9Rect.TwoPixelXY);
        bg.setContentSize2(contentSize);
        this.addChild(bg);
        bg.setPositionRound(this.width / 2, this.height / 2);

        var icon = new cc.Sprite(bundles.buttons_main.frames.close_band_icon);
        this.addChild(icon);
        icon.setPositionRound(styles.icon);

        cleverapps.UI.applyHover(this);
        cleverapps.UI.onClick(this, function () {
            this.action();
        }.bind(this));
    },

    updatePosition: function () {
        this.setPositionRound(this._calcPosition());
    },

    action: function () {
        cleverapps.audio.playSound(bundles.main.urls.click_effect);
        this.options.onClicked();
    },

    hide: function (silent) {
        this.stopAllActions();

        if (silent) {
            this.setPositionRound(this._calcPosition(true));
            this.setVisible(false);
            return;
        }

        this.runAction(new cc.Sequence(
            this._animate("close"),
            new cc.Hide()
        ));
    },

    show: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.Show(),
            this._animate("open")
        ));
    },

    _animate: function (direction) {
        var easing = direction === "open" ? cc.easeBackOut(10) : cc.easeBackIn(10);
        var target = this._calcPosition(direction !== "open");
        return new cc.MoveTo(0.3, target).easing(easing);
    },

    _calcPosition: function (forHide) {
        var styles = cleverapps.styles.BandButton;

        var position = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL && styles.mobilePosition
            ? styles.mobilePosition
            : styles.position;

        position = cleverapps.clone(position, true);
        position.x.dx = (position.x.dx || 0) - cleverapps.resolution.getSafePadding().right;
        if (forHide) {
            position.y.dy = (position.y.dy || 0) + 1.1 * this.height;
        }

        return this.calculatePositionRound(position);
    }
});

cleverapps.styles.BandButton = {
    width: 85,
    height: 190,

    position: {
        x: { align: "right", dx: -40 },
        y: { align: "top", dy: 10 }
    },

    icon: {
        x: { align: "center" },
        y: { align: "bottom", dy: 25 }
    }
};
