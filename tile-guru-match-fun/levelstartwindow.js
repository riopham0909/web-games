/**
 * Created by andrey on 22.08.17.
 */

var LevelStartWindow = Window.extend({
    onWindowLoaded: function (options) {
        this.level = options.level;
        this.stars = this.level.stars;
        if (cleverapps.config.features.includes("boosters_before") && WindowBoostersBefore.isAvailable()) {
            this.boostersBefore = new WindowBoostersBefore(this.level);
            cleverapps.meta.showControlsWhileFocused("MenuBarGoldItem");
        }
        this.isHardLevel = this.level.isHard() && !this.level.episode.isDailyLevel();

        var styles = cleverapps.styles.LevelStartWindow;

        var content = new cleverapps.Layout(this.listContent(), {
            direction: cleverapps.UI.VERTICAL,
            reversed: true,
            margin: styles.margin,
            padding: styles.padding
        });

        this._super({
            title: this.getTitle(),
            name: "levelstartwindow",
            content: content,
            button: this.getButton(),
            level: this.level
        });

        if (styles.hardLevel && this.isHardLevel) {
            var hardLevelIcon = new HardLevelWindowIcon();
            hardLevelIcon.setPositionRound(styles.hardLevel);
            hardLevelIcon.pulseAnimation();
            this.window.addChild(hardLevelIcon);
        }
    },

    getPerson: function () {
        return "hero";
    },

    onPopUpAnimationFinished: function () {
        if (this.boostersBefore) {
            this.boostersBefore.showTutorialSteps();
        }
    },

    getTitle: function () {
        var levelNo = "";
        if (this.level.isRegular()) {
            if (cleverapps.meta.getType() === Metha.HOSE && !this.level.isCurrentLevel()) {
                levelNo = this.level.getHumanReadableNumber();
            } else {
                levelNo = cleverapps.user.getVirtualDisplayLevel();
            }
        }

        return {
            text: this.getTitleText(),
            font: cleverapps.styles.FONTS.WINDOW_TITLE_TEXT,
            toReplace: {
                levelNo: levelNo
            }
        };
    },

    getTitleText: function () {
        if (this.level.episode.isDailyCup()) {
            return "Cups.daily.title";
        }
        if (this.isHardLevel) {
            return "message.hardLevel";
        }
        if (this.level.isTricky()) {
            return "message.trickyLevel";
        }
        if (this.level.isBonus()) {
            return "message.bonusLevel";
        }
        if (this.level.episode.isDailyLevel()) {
            return "DailyLevelWindow.title";
        }
        if (cleverapps.user.isPassedAll() && cleverapps.meta.getType() === Metha.HOSE && this.level.isCurrentLevel()) {
            return "LevelStartWindow.ComingSoonTitle";
        }

        return "LevelStartWindow.title";
    },

    getButton: function () {
        var playButton = {
            button_png: bundles.buttons_main.frames.play_button_png,
            button_on_png: bundles.buttons_main.frames.play_button_on_png
        };

        if (this.isHardLevel) {
            playButton = {
                button_png: bundles.buttons.frames.red_button,
                button_on_png: bundles.buttons.frames.red_button_on
            };
        }

        if (this.level.isTricky()) {
            playButton = {
                button_png: bundles.buttons.frames.blue_button_png,
                button_on_png: bundles.buttons.frames.blue_button_png
            };
        }

        var startGame = cleverapps.once(function () {
            cleverapps.meta.distract({
                focus: "LevelStartFromLevelStartWindow",
                action: function (f) {
                    this.close();
                    this.level.play(f, {
                        boostersBefore: this.boostersBefore && this.boostersBefore.listActivatedBoosters()
                    });
                }.bind(this)
            });
        }.bind(this));

        var params = {
            width: cleverapps.styles.LevelStartWindow.Button.width,
            height: cleverapps.styles.LevelStartWindow.Button.height,
            type: playButton,
            onPressed: function () {
                if (cleverapps.lives && cleverapps.lives.isEmpty()) {
                    new LivesShopWindow();
                } else {
                    startGame();
                }
            }
        };

        params.text = Messages.get("Play").toUpperCase();
        return params;
    },

    listContent: function () {
        var styles = cleverapps.styles.LevelStartWindow;
        var data = [];

        if (this.boostersBefore) {
            var boostersBefore = new BoostersBeforeComponent(this.boostersBefore, this.level);
            data.push(boostersBefore);
        }

        if (this.level.isBonus()) {
            var coins = new cc.Sprite(bundles.level_start_window.frames.pot_coins_png);
            if (styles.coinsBg) {
                var bg = new cc.Scale9Sprite(bundles.level_start_window.frames.coins_bg_png);
                bg.setContentSize2(styles.coinsBg);
                bg.addChild(coins);
                coins.setPositionRound({ align: "center" }, { align: "center" });
                data.push(bg);
            } else {
                data.push(coins);
            }
        }

        return data;
    }
});

LevelStartWindow.isAvailable = function (episodeNo, levelNo) {
    var boostersBefore = cleverapps.boosters.listBoostersBefore();
    if (boostersBefore.length === 0) {
        return false;
    }

    if (episodeNo === 0 && levelNo === 0) {
        return false;
    }

    if (cleverapps.config.subtype === "stacks") {
        return !cleverapps.GameSaver.load(cleverapps.GameSaver.getStoreSlot(episodeNo, levelNo)) && WindowBoostersBefore.isAvailable();
    }

    if (cleverapps.config.type === "solitaire") {
        return WindowBoostersBefore.isAvailable();
    }

    return true;
};

LevelStartWindow.prototype.listBundles = function (options) {
    var bundles = ["level_start_window"];

    if (cleverapps.config.features.includes("boosters_before") && WindowBoostersBefore.isAvailable() && Lantern.GetStreak(options.level) > 0) {
        bundles.push("lantern_element");
    }

    return bundles;
};

cleverapps.styles.LevelStartWindow = {
    Button: {
        width: 300,
        height: 100
    },

    margin: 40
};
