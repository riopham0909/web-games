/**
 * Created by andrey on 29.05.17.
 */

var LevelView = cc.Node.extend({
    ctor: function (level, parent) {
        this._super();

        this.level = level;

        if (parent !== undefined) {
            this.calculatePosition(parent);
        }
        if (parent === undefined || !parent.episode.isComingSoon()) {
            this.levelBg = this.addLevelBg();
            this.addLevelId();
        } else {
            this.setPosition(cleverapps.styles.LevelView.coming_soon[0]);
        }

        if (this.level.isInteractive()) {
            if (this.level.isClickable()) {
                this.addTouchListener();
                cleverapps.UI.applyHover(this.levelBg || this);
            } else if (this.level.type === Level.TYPE_NOTPASSED || !this.level.episode.isAvailableToPlay() && this.level.episode.episodeNo >= levels.user.episode) {
                cleverapps.tooltipManager.create(this, {
                    text: Messages.get("LevelNotPassedTooltip"),
                    position: cleverapps.styles.UI.Tooltip.LOCATION.below
                });
            }
        }

        if (this.level.getReward && this.level.getReward() && this.level.type !== Level.TYPE_PASSED) {
            this.createReward(this.level.getReward());
        }

        if (parent === undefined || !parent.episode.isComingSoon()) {
            this.customize();
        }
    },

    createReward: function (reward) {
        var styles = cleverapps.styles.LevelView;

        var bg = new cc.Scale9Sprite(bundles.level.frames.prize_bg_png);
        bg.setContentSize2(styles.prize);

        var arrow = new cc.Sprite(bundles.level.frames.prize_arrow_png);
        bg.addChild(arrow);
        arrow.setPositionRound(styles.prize.arrow);

        var type = Object.keys(reward)[0];
        var text = new TextWithIcon(TextWithIcon.ICONS_BY_NAME[type] + " x" + reward[type].factor, {
            font: cleverapps.styles.FONTS.LEVEL_REWARD_TEXT
        });
        bg.addChild(text);
        text.setPositionRound(bg.width / 2 + styles.prize.offset.x, bg.height / 2 + styles.prize.offset.y);

        this.addChild(bg);
        bg.setPositionRound(styles.prize);

        bg.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.MoveBy(1, 0, styles.prize.animation.dy).easing(cc.easeInOut(1.7)),
                new cc.MoveBy(1, 0, -styles.prize.animation.dy).easing(cc.easeInOut(1.7))
            )
        ));
    },

    calculatePosition: function () {
        var styles = cleverapps.styles.LevelView;
        var levelPositions = styles[this.level.episode.getBundle().episode.levelPositions || "levels_1"];
        var position = levelPositions[this.level.levelNo];
        if (this.level.levelNo < Episode.LEVELS_PER_EPISODE || position) {
            this.setPosition(position);
        }
    },

    customize: function () {

    },

    getAnimationName: function () {
        var animation = this.level.isHard() ? ["hard_past", "hard_current", "hard_future"] : ["past", "current", "future"];
        return animation[this.level.type];
    },

    getImage: function () {
        var bgImagesNames = ["level_past_png", "level_current_png", "level_future_png"];
        var bgImageName = bgImagesNames[this.level.type];
        if (this.level.isHard()) {
            bgImageName = "level_hard_png";
        } else if (this.level.isBonus()) {
            bgImageName = "level_bonus_png";
        }
        var bg = new cc.Sprite(bundles.level.frames[bgImageName]);
        bg.setAnchorPoint(0.5, 0.5);

        var stars = this.getStars();
        if (stars !== undefined && this.level.type === Level.TYPE_PASSED) {
            var starsImageName = "star_" + this.getStars() + "_png";
            var starsImage = new cc.Sprite(bundles.level.frames[starsImageName]);
            starsImage.setAnchorPoint(0.5, 0.5);
            starsImage.setPositionRound(cleverapps.styles.LevelView.stars);
            bg.addChild(starsImage);
        }

        return bg;
    },
    
    getStars: function () {
        if (cleverapps.config.type !== "match3" || cleverapps.config.rpg) {
            return undefined;
        }

        if (!this.level.episode.isAvailableToPlay()) {
            return;
        }

        if (this.level.type === Level.TYPE_CURRENT) {
            return;
        }

        if (this.level.type === Level.TYPE_PASSED) {
            var stars = this.level.stars !== undefined ? this.level.stars : 0;
            return stars;
        }
    },

    addLevelBg: function () {
        var styles = cleverapps.styles.LevelView;
        var levelBg = new cc.Node();
        levelBg.setAnchorPoint(0.5, 0.5);
        levelBg.setContentSize(styles.clickSize);
        this.setContentSize(levelBg.getContentSize());
        var bgImage;
        if (bundles.level.jsons.level_json) {
            var animationName = this.getAnimationName();
            bgImage = new cleverapps.Spine(bundles.level.jsons.level_json);
            bgImage.setAnimation(0, animationName, true);
        } else {
            bgImage = this.getImage();
            if (this.level.type === Level.TYPE_CURRENT && this.level.isInteractive()) {
                levelBg.runAction(new cc.RepeatForever(
                    new cc.Sequence(
                        new cc.ScaleTo(0.83, 1.19),
                        new cc.ScaleTo(0.5, 1)
                    )
                ));
            }
        }
        bgImage.setPosition(levelBg.width / 2, levelBg.height / 2 + styles.dy);
        levelBg.addChild(bgImage);
        levelBg.setPositionRound(this.width / 2, this.height / 2);
        this.setAnchorPoint2();
        this.addChild(levelBg);
        return levelBg;
    },

    addLevelId: function () {
        if (!((this.level.isHard() || this.level.isBonus()) && cleverapps.styles.LevelView.hidableLevelNo)) {
            LevelView.generateLevelId(this.levelBg, this.level.type, this.level.getHumanReadableNumber());
        }
    },

    addTouchListener: function () {
        cleverapps.UI.onClick(this, this.onPressed.bind(this));
    },

    onPressed: function () {
        cleverapps.audio.playSound(bundles.main.urls.click_effect);
        this.level.onPressed();
    }
});

LevelView.generateLevelId = function (parent, type, levelNumber) {
    var styles = cleverapps.styles.LevelView.LevelId;

    if (!cleverapps.config.editorMode && styles.showTypes.indexOf(type) === -1) {
        return;
    }

    var font = cleverapps.styles.FONTS.LEVEL_TITLE_TEXT;
    if (type === Level.TYPE_NOTPASSED) {
        font = cleverapps.styles.FONTS.LEVEL_NOT_PASSED_TITLE_TEXT;
    }
    if (type === Level.TYPE_CURRENT && cleverapps.styles.FONTS.LEVEL_CURRENT_TITLE_TEXT) {
        font = cleverapps.styles.FONTS.LEVEL_CURRENT_TITLE_TEXT;
    }
    if (type === Level.TYPE_PASSED && cleverapps.styles.FONTS.LEVEL_PASSED_TITLE_TEXT) {
        font = cleverapps.styles.FONTS.LEVEL_CURRENT_TITLE_TEXT;
    }
    var levelId = cleverapps.UI.generateImageText(levelNumber, font);

    var scale;
    if (levelNumber >= 1000) {
        scale = cleverapps.styles.FONTS.LEVEL_TITLE_TEXT.alternativeSizes[1];
    } else if (levelNumber >= 100) {
        scale = cleverapps.styles.FONTS.LEVEL_TITLE_TEXT.alternativeSizes[0];
    }
    if (scale) {
        levelId.setScale(levelId.scale * scale);
    }

    if (styles.scale && levelNumber % 2) {
        levelId.setScale(levelId.scale * styles.scale);
    }

    parent.addChild(levelId);
    parent.levelId = levelId;

    var position = styles;
    levelId.setPositionRound(position.x, position.y);
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    LEVEL_TITLE_TEXT: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        alternativeSizes: [0.9, 0.8]
    },

    LEVEL_NOT_PASSED_TITLE_TEXT: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        alternativeSizes: [0.9, 0.8]
    },

    LEVEL_REWARD_TEXT: {
        size: 40,
        name: "nostroke",
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }
});

cleverapps.styles.LevelView = {
    dy: -10,
    coming_soon: [{ x: -60, y: -200 }],

    LevelId: {
        x: { dx: 0 },
        y: { dy: 0 },
        showTypes: [Level.TYPE_PASSED, Level.TYPE_CURRENT, Level.TYPE_NOTPASSED]
    },

    clickSize: {
        width: 90,
        height: 75
    },
    
    stars: {
        x: { align: "center" },
        y: { align: "center", dy: 50 }
    },

    prize: {
        width: 170,
        height: 130,

        x: { align: "center" },
        y: { align: "top", dy: 140 },

        arrow: {
            x: { align: "center" },
            y: { align: "bottom", dy: -27 }
        },

        animation: {
            dy: 20
        },

        offset: {
            x: -7,
            y: 7
        }
    }
};