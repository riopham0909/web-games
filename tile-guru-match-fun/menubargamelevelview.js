/**
 * Created by rvvslv on 13.01.21.
 */

var MenuBarGameLevelView = MenuBarItemView.extend({
    ctor: function (item) {
        this._super(item);

        item.onChangeLevelNo = this.createListener(this.onChangeLevelNo.bind(this));
        item.onChangeExpProgress = this.createListener(this.onChangeExpProgress.bind(this));
    },

    reset: function () {
        var styles = cleverapps.styles.MenuBarGameLevelView;

        this.removeAllChildren();

        this.setContentSize2(styles.width, styles.height);

        var level = this.level = this.createLevel();
        var progress = this.progress = this.createProgress(level);

        this.addChild(progress);
        this.addChild(level);

        cleverapps.UI.wrap(this);

        SceneDecors.add(this, cleverapps.skins.getSlot("menuBarLevelItem"));

        this.onChangeLevelNo();
        this.updateProgress(true);

        this.addAction();

        if (this.item.worldTitle) {
            this.createWorldTitle();
        }
    },

    getIcon: function () {
        return this.crown;
    },

    createWorldTitle: function () {
        var styles = cleverapps.styles.MenuBarGameLevelView;

        this.worldTitle = cleverapps.UI.createScale9Sprite(bundles.menubar.frames.bar_timer_png);
        var width = this.progress.width - 2 * styles.worldTitle.padding.x;
        this.worldTitle.setContentSize2(width, styles.worldTitle.height);
        this.worldTitle.setPositionRound(styles.worldTitle.position);
        this.progress.addChild(this.worldTitle, -1);

        var title = cleverapps.UI.generateOnlyText(this.item.worldTitle, cleverapps.styles.FONTS.MENUBAR_WORLD_TITLE_TEXT);
        title.fitTo(width * 0.9);
        this.worldTitle.addChild(title);
        title.setPositionRound(styles.worldTitle.content);
    },

    checkLevelBundle: function (e) {
        var imageFont = this.level && this.level.value;

        if (!imageFont || imageFont.bundle !== "big_digits") {
            return;
        }

        var message = [
            "GameLevel has bundle big_digits",
            "level preferred bundles - " + imageFont.getPreferredBundles(),
            "this preferred bundles - " + this.getPreferredBundles()
        ].join(" ");
        cleverapps.throwAsync(message, e);
    },

    createLevel: function () {
        var styles = cleverapps.styles.MenuBarGameLevelView;

        var background = new cc.Scale9Sprite(bundles.menubar.frames.menubar_round_bg_png);
        background.setPositionRound(background.width / 2, background.height / 2);

        var container = new cc.Node();
        container.setAnchorPoint2();
        container.setContentSize(background.width, background.height);
        container.setPositionRound(container.width / 2 + styles.level.offset.x, this.height / 2 + styles.level.offset.y);
        container.addChild(background);

        var value = cleverapps.UI.generateImageText("", cleverapps.styles.FONTS.MENUBAR_LEVEL_TEXT);

        var id = cleverapps.travelBook.getCurrentPage().id;

        var offset = styles.value.offset[id] || styles.value.offset;
        value.setPositionRound(container.width / 2 + offset.x, container.height / 2 + offset.y);

        var crownOffset = styles.crown.offset[id] || styles.crown.offset;
        var crown = this.crown = new cleverapps.Spine(bundles.menubar.jsons.crown_json);
        crown.setPositionRound(crownOffset.x, container.height + crownOffset.y);
        crown.setAnimation(0, "idle", true);

        container.value = value;
        container.crown = crown;

        container.addChild(value);
        container.addChild(crown);

        setTimeout(this.createListener(this.checkLevelBundle.bind(this, new Error("checkLevelBundle"))), 100);

        return container;
    },

    createProgress: function (level) {
        var styles = cleverapps.styles.MenuBarGameLevelView;

        var bar = ScaledProgressBar.Types.green_large;
        if (cleverapps.gameLevel.withOwnLevel) {
            bar = ScaledProgressBar.Types.blue_large_round;
        }
        var progress = bar.create();
        progress.setAnchorPoint(0, 0.5);
        progress.setLength(this.width - level.width - styles.margin);
        progress.setPositionRound(level.width + styles.margin, this.height / 2);

        var exp = cleverapps.UI.generateImageText("", cleverapps.styles.FONTS.MENUBAR_PROGRESS_TEXT);
        exp.setPositionRound(progress.width / 2 + styles.exp.offset.x, progress.height / 2 + styles.exp.offset.y);

        progress.exp = exp;
        progress.addChild(exp);

        return progress;
    },

    updateProgress: function (silent) {
        var styles = cleverapps.styles.MenuBarGameLevelView;
        var progress = this.progress;

        var value = this.item.getCurrentValue();
        var currentExp = value.amount;
        var thresholdExp = value.total;

        var percentage = currentExp / thresholdExp * 100;
        if (silent) {
            progress.setPercentage(percentage);
        } else {
            progress.animatedChange(percentage);
        }
        progress.exp.setString(currentExp + "/" + thresholdExp);
        progress.exp.setFontSize(progress.exp.font.size);
        progress.exp.fitTo(progress.width - styles.exp.padding.x, progress.height - styles.exp.padding.y);
    },

    onChangeExpProgress: function () {
        this.updateProgress();

        this.progress.exp.stopAllActions();
        this.progress.exp.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.menubar.urls.exp_fly_finish_effect),
            new cc.ScaleTo(0.2, 1.4),
            new cc.ScaleTo(0.2, 1)
        ));

        this.animateIcon();
    },

    onChangeLevelNo: function () {
        var styles = cleverapps.styles.MenuBarGameLevelView;
        var level = this.level;

        level.value.setString(this.item.getCurrentValue().level);
        level.value.fitTo(level.width - styles.value.padding.x * 2, level.height - styles.value.padding.y * 2);
    },

    animateIcon: function () {
        this.crown.setAnimationAndIdleAfter("animation", "idle");
    },

    addAction: function () {
        if (cleverapps.config.debugMode) {
            cleverapps.UI.onClick(this, this.item.debugAction);
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    MENUBAR_LEVEL_TEXT: {
        name: "default",
        size: 86
    },

    MENUBAR_PROGRESS_TEXT: {
        name: "default",
        size: 52
    },

    MENUBAR_WORLD_TITLE_TEXT: {
        name: "nostroke",
        size: 30
    }
});

cleverapps.styles.MenuBarGameLevelView = {
    width: 455,
    height: 65,
    margin: -52,

    level: {
        offset: {
            x: 23,
            y: 0
        }
    },

    bar: {
        offset: {
            x: -1,
            y: 3
        }
    },

    exp: {
        offset: {
            x: 16,
            y: 3
        },

        padding: {
            x: 80,
            y: 13
        }
    },

    value: {
        padding: {
            x: 26,
            y: 13
        },

        offset: {
            x: 1,
            y: 10,

            collections: {
                x: 0,
                y: 0
            }
        }
    },

    crown: {
        offset: {
            x: 9,
            y: -13,

            collections: {
                x: 11,
                y: -21
            }
        }
    },

    worldTitle: {
        content: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        },

        position: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -50 }
        },

        padding: {
            x: 40
        },
        height: 59
    }
};
