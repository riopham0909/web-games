/**
 * Created by vladislav on 17.09.2020
 */

var StarsProgressBar = cc.Node.extend({
    ctor: function (options) {
        this._super();

        this.options = options;

        this.stars = this.options.stars !== undefined ? this.options.stars : cleverapps.simple.stars;
        this.current = this.options.current !== undefined ? this.options.current : cleverapps.simple.current;

        var styles = cleverapps.styles.StarsProgressBar;

        this.setAnchorPoint2();

        this.setContentSize2(this.options.width, styles.bar.height);

        this.addProgressBar();

        if (this.options.withPresent) {
            this.addPresent();
        }

        cleverapps.simple.on("changeStars", function () {
            this.setStars(cleverapps.simple.pendingsStars > 0 ? (cleverapps.simple.stars - cleverapps.simple.pendingsStars) : cleverapps.simple.stars);
        }.bind(this));

        this.setStars(this.stars);
    },

    addProgressBar: function () {
        var styles = cleverapps.styles.StarsProgressBar.bar;

        var progressBar = this.bar = new ScaledProgressBar({
            background: bundles.progress_bar.frames.bg_simple,
            progress: bundles.progress_bar.frames.bar_simple,
            barText: {
                font: cleverapps.styles.FONTS.STARS_PROGRESS_BAR_TEXT,
                text: this.stars + "/" + cleverapps.simple.getRequiredStars(this.current),
                icon: bundles.simple.frames.star_png,
                iconBeforeText: true,
                iconMargin: styles.iconMargin,
                dy: styles.dy
            }
        });
        progressBar.setLength(this.options.width + 2 * styles.offsetX);
        progressBar.setPercentage(0);
        progressBar.setPositionRound(this.width / 2, this.height / 2);

        this.addChild(this.bar);
        progressBar.background.setLocalZOrder(-10);
    },

    addPresent: function () {
        var styles = cleverapps.styles.StarsProgressBar;

        this.present = new cleverapps.Spine(bundles.windows.jsons.present_json);
        this.addChild(this.present);
        this.present.setScale(styles.present.scale);
        this.present.setSkin(styles.present.skin);
        this.present.setAnimation(0, styles.present.animation, true);
        this.present.setPositionRound(styles.present);
        this.present.setLocalZOrder(10);

        cleverapps.tooltipManager.create(this.present, {
            text: "OpenBackgroundTooltip",
            rewards: Simple.CalcReward(),
            position: cleverapps.styles.UI.Tooltip.LOCATION.below,
            size: cleverapps.styles.UI.Tooltip.SIZE.medium
        });
    },

    setStars: function (stars) {
        this.stars = stars;

        this.bar.updateBarText(stars + "/" + cleverapps.simple.getRequiredStars(this.current));
        this.bar.setPercentage(stars * 100 / cleverapps.simple.getRequiredStars(this.current));
    },

    updateProgress: function (addedStars) {
        var styles = cleverapps.styles.StarsProgressBar;

        if (!this.barAnimation) {
            this.barAnimation = new cleverapps.Spine(bundles.simple.jsons.progress_bar_json);
            this.bar.addChild(this.barAnimation);
        }
        this.stars += addedStars;

        this.bar.updateBarText(this.stars + "/" + cleverapps.simple.getRequiredStars(this.current));

        var percentage = this.stars / cleverapps.simple.getRequiredStars() * 100;

        this.barAnimation.setPositionRound(this.bar.getPercentage() / 100 * this.bar.totalWidth + styles.barAnimation.offsetX, this.bar.totalHeight / 2);
        this.barAnimation.setAnimation(0, "animation", false);
        this.barAnimation.runAction(
            new cc.MoveTo(0.8, percentage / 100 * this.bar.totalWidth + styles.barAnimation.offsetX, this.barAnimation.y).easing(cc.easeOut(2))
        );

        this.bar.animatedChange(percentage);
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    STARS_PROGRESS_BAR_TEXT: {
        name: "default",
        size: 36
    }
});

cleverapps.styles.StarsProgressBar = {
    bar: {
        offsetX: 15,
        iconMargin: 6,
        height: 80,
        dy: 5
    },

    barAnimation: {
        offsetX: -15
    },

    present: {
        scale: 0.7,
        x: { align: "right", dx: 90 },
        y: { align: "center", dy: 5 },
        skin: "green",
        animation: "animation"
    }
};