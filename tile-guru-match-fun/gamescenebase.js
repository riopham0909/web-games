/**
 * Created by slava on 10/8/18
 */

var GameSceneBase = cleverapps.FixedWidthScene.extend({
    ctor: function (options) {
        this.options = options || {};

        this._super(options);

        this.styling = this.level ? GameSceneBase.ChooseStyling(this.level) : {};
    },

    onSceneLoaded: function (sceneName) {
        cleverapps.environment.levelNo = this.level.levelNo;
        cleverapps.environment.episodeNo = this.level.episodeNo;
        cleverapps.environment.setScene(sceneName || cleverapps.Environment.SCENE_GAME);

        var level = this.level;
        var game = this.game = new Game(level, this.options.gameOptions);

        this._super(sceneName || cleverapps.Environment.SCENE_GAME);

        if (levels.cookieJar && levels.cookieJar.shouldBeVisible()) {
            levels.cookieJar.setVisible();
        }

        if (this.game.competition && cleverapps.isKnockoutGame()) {
            this.playersView = new KnockoutPlayersView(this.game.competition, cleverapps.meta.getRumble().getCurrentRound());
            this.addChild(this.playersView);
        }

        if (game.combo) {
            var comboView = new ComboBarView(game.combo);
            this.addChild(comboView);

            this.comboBarControl = new HidingNode(comboView, cleverapps.UI.HORIZONTAL);
            cleverapps.meta.registerControl("comboBar", comboView);
        }

        if (cleverapps.config.type === "match3") {
            this.infoPanel = new InfoPanel();
            this.addChild(this.infoPanel);

            this.controlsPanel = new ControlsPanel();
            if (!cleverapps.restoreProgress.isAvailable() || cleverapps.config.rpg) {
                this.addChild(this.controlsPanel);
            }
        }

        game.on("outcome", this.createListener(this.onChangeOutcome.bind(this)), this);

        this.boatswain = new Boatswain(level);

        cc.pool.drainAllPools();
        this.game.initPool();

        if (cleverapps.lives && cleverapps.lives.amount > cleverapps.lives.getMaxLives()) {
            this.game.moreThenMaxRegenLife = true;
        }
        if (cleverapps.config.type !== "merge") {
            this.takeLife(true);
        }
        this.customize();

        if (this.game.levelWithCoins) {
            var rewardGoldView = new RewardGoldView();
            this.addChild(rewardGoldView);

            this.rewardGoldControl = new HidingNode(rewardGoldView, cleverapps.UI.HORIZONTAL);
            cleverapps.meta.registerControl("rewardElementGold", rewardGoldView);
        }

        if (this.comboBarControl || this.rewardGoldControl) {
            this.collectionContainer = new CollectionContainerView();
            this.addChild(this.collectionContainer);
        }

        if (this.game.secondaryMission) {
            var cloversView = new CloversView();
            if (cloversView.withinInfoPanel) {
                this.infoPanel.addChild(cloversView);
                this.cloversControl = cloversView;
            } else {
                this.addChild(cloversView);

                this.cloversControl = new HidingNode(cloversView, cleverapps.UI.AUTO);
                cleverapps.meta.registerControl(
                    "rewardElementClover",
                    cloversView,
                    cleverapps.config.type !== "match3" && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? [cleverapps.Environment.SCENE_GAME] : undefined
                );
            }
        }

        if (this.level.isRegular() || this.level.episode.isBonusWorldLevel()) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_START, {
                hash: this.level.hash
            });
        }

        if (this.game.tournament) {
            var playersView = new TournamentPlayersView(this.game.competition);
            this.addChild(playersView);

            this.playersView = new HidingNode(playersView, cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL ? cleverapps.UI.HORIZONTAL : cleverapps.UI.VERTICAL);
            cleverapps.meta.registerControl("tournamentPlayersView", playersView);
        }

        cleverapps.gameMessage.onShowMessage = this.createListener(this.onGameMessage.bind(this));

        var exclamationView = this.exclamationView = ExclamationViewBase.Create();
        this.addChild(exclamationView, 20);
        exclamationView.setPositionRound(cleverapps.styles.GameScene.exclamation);

        if (cleverapps.flyingAd) {
            this.addChild(new FlyingAdView());
        }

        game.on("stop", this.onStop.bind(this), this);
    },

    onGameMessage: function (message, options) {
        var messageView = new GameMessageView(message, options);
        this.addChild(messageView);
    },

    onStop: function () {
    },

    calcHash: function () {
        return RecursiveHasher(this.level.content, ["episodeNo", "levelNo", "version", "hard", "paint", "extra", "gold", "bundles"]);
    },

    introControls: function () {
        return "panel_info";
    },

    getBgIntroScale: function () {
        return cleverapps.styles.GameScene.startAnimation.scale;
    },

    playIntro: function (f, silent) {
        this.game.playIntro(f, silent);
    },

    _closeAction: function () {
        if (BackToAdminOrEditorAction.call(this) || !this.game) {
            return;
        }

        cleverapps.meta.display({
            focus: "GameSceneCloseAction",
            action: function (f) {
                this.game.leave(f);
            }.bind(this)
        });
    },

    customize: function () {

    },

    takeLife: function (silent) {
        if (cleverapps.unlimitedLives && !cleverapps.unlimitedLives.checkBuyed()) {
            if (this.level.episode.isDailyCup() && !cleverapps.dailyCup.withLives()) {
                return;
            }
            cleverapps.lives.take(silent);
        }
    },

    giveLife: function () {
        if (cleverapps.unlimitedLives && !cleverapps.unlimitedLives.checkBuyed()) {
            if (this.level.episode.isDailyCup() && !cleverapps.dailyCup.withLives()) {
                return;
            }

            if (this.game.moreThenMaxRegenLife || cleverapps.lives.amount < cleverapps.lives.getMaxLives()) {
                cleverapps.lives.give();
            }
        }
    },

    onChangeOutcome: function () {
        cleverapps.audio.fadeOut();
        this.level.isPassed = (this.game.outcome === GameBase.OUTCOME_VICTORY);

        BeforeWinAction.call(this);

        this.wantPlayChangeOutcome = true;
        this.playChangeOutcome();
    },

    playChangeOutcome: function () {
        var outcome = this.game.outcome;
        var controls = cleverapps.toArray(this.introControls());

        if (this.level.episode.isBonusRound() && outcome === GameBase.OUTCOME_LOST) {
            controls.push("MenuBarBonusRoundTimerItem");
        }
        if (outcome === GameBase.OUTCOME_VICTORY && cleverapps.config.type === "solitaire") {
            controls.push("opencards");
        }

        var getKey = function (outcome) {
            if (GameBase.OUTCOME_LOST === outcome) {
                return "Lose";
            } if (GameBase.OUTCOME_GAVEUP === outcome) {
                return "GiveUp";
            }
            return "Victory";
        };

        cleverapps.meta.display({
            focus: "ChangeOutcome",
            control: controls,

            filter: function () {
                return this.wantPlayChangeOutcome;
            }.bind(this),

            actions: [
                VictoryMessageAction,

                function (f) {
                    if (this.game.needTapToSkip()) {
                        this.createTapToSkip(f);
                    }
                    this.game.animateBeforeWin(f);
                }.bind(this),

                function (f) {
                    HideAnimations[getKey(this.game.outcome)].call(this, f);
                }.bind(this),

                function (f) {
                    if (this.game.needAnimateBonus()) {
                        if (!this.game.skipBonusAnimations) {
                            this.createBonusChest();
                        }

                        this.game.animateBonus(f);
                    } else {
                        f();
                    }
                }.bind(this),

                function (f) {
                    if (cleverapps.config.type === "solitaire") {
                        this.game.addBasicReward();
                        if (this.bonusChest) {
                            this.bonusChest.addGold();
                        }
                    }

                    f();
                }.bind(this),

                function (f) {
                    if (this.tapToSkip) {
                        this.tapToSkip.hideAndRemove();
                    }

                    if (this.bonusChest) {
                        this.bonusChest.animationLeave(f);
                    } else {
                        f();
                    }
                }.bind(this),

                function (f) {
                    if (this.infoPanel) {
                        this.infoPanel.hide();
                    }
                    f();
                }.bind(this),

                function (f) {
                    this.wantPlayChangeOutcome = false;
                    this.game.stop();
                    f();
                }.bind(this),

                SaveFinalResultsAction.bind(this),
                this.game.introZoom.bind(this.game),

                function (f) {
                    if (this.level.isCurrentLevel()) {
                        if (outcome === GameBase.OUTCOME_VICTORY) {
                            cleverapps.eventBus.trigger("taskEvent", DailyTasks.PASS_LEVEL, { level: this.level.getHumanReadableNumber() });

                            if (this.level.isHard()) {
                                cleverapps.eventBus.trigger("taskEvent", DailyTasks.PASS_LEVEL_HARD);
                            }
                        }

                        if (cleverapps.isKnockoutGame()) {
                            if (cleverapps.meta.getRumble().outcome === Rumble.OUTCOME_WIN) {
                                cleverapps.user.incLevel();
                            }
                        } else if (outcome === GameBase.OUTCOME_VICTORY && cleverapps.meta.getType() !== Metha.FARM) {
                            cleverapps.user.incLevel();
                        }
                    }
                    cleverapps.restoreProgress.update();

                    f();
                }.bind(this),

                function (f) {
                    if (outcome !== GameBase.OUTCOME_VICTORY || cleverapps.user.isPassedAll()) {
                        f();
                        return;
                    }

                    var nextEpisodeNo = cleverapps.user.episode;
                    var episode = new Episode(nextEpisodeNo);
                    episode.loadData(function () {
                        episode.destructor();
                    });

                    f();
                },

                function (f) {
                    this.boatswain.prepareNext();
                    f();
                }.bind(this),

                InterstitialAction.bind(this),
                ShowOutcomeWindow.bind(this),
                UpdateScoreAction.bind(this),
                TilesUnlockAction.bind(this),

                RateWindowAction.bind(this),
                NewLeagueWindowAction.bind(this),
                MinigameFinishAction.bind(this),

                PurgeOldGameAction.bind(this),

                BoatswainAction.bind(this)
            ]
        });
    },

    getBackgroundStyles: function () {
        var options = cleverapps.skins.getSlot("gameSceneBg") || this.styling;

        var urls = bundles[options.bundle].urls;
        options.backgroundId = urls[options.backgroundId] ? options.backgroundId : "background";
        options.animation = bundles[options.bundle].jsons.background_spine || options.animation;

        return options;
    },

    getAudioStyles: function () {
        return {
            res: cleverapps.skins.getSlot("gameAudio") || this.styling.music,
            fadeIn: cleverapps.styles.GameScene.sound.fadeIn,
            delay: cleverapps.config.wysiwygMode ? 0 : cleverapps.styles.GameScene.sound.delay
        };
    },

    updateSize: function () {
        this._super();

        this.exclamationView && this.exclamationView.setPositionRound(cleverapps.styles.GameScene.exclamation);
    },

    listBundles: function () {
        var level = this.level;
        var styling = this.styling;

        var gameBundles = ["game"];

        if (cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL) {
            gameBundles.push("game_background_horizontal");
        } else {
            gameBundles.push("game_background_vertical");
        }

        if (styling) {
            gameBundles.push(styling.bundle);
        }

        if (level) {
            gameBundles.push(level.getImageBundle());

            var cellSkins = level.getLevelCellSkins();
            if (cellSkins) {
                cleverapps.values(cellSkins).forEach(function (skin) {
                    if (bundles[skin]) {
                        var baseSkin = skin.substring(0, skin.indexOf("_reskin"));
                        var baseInd = gameBundles.indexOf(baseSkin);
                        gameBundles.splice(baseInd, baseInd > 0 ? 1 : 0, skin);
                    }
                });
            }

            if (cleverapps.config.rpg) {
                gameBundles.push("enemies");
            }
        }

        if (cleverapps.config.subtype === "stacks") {
            gameBundles.push("extra_" + cleverapps.settings.language);
        }

        if (bundles["letters_" + cleverapps.settings.language]) {
            gameBundles.push("letters_" + cleverapps.settings.language);
        }

        return gameBundles.filter(function (bundle) {
            return bundle && bundles[bundle];
        });
    },

    animateZoom: function (scale, duration, f) {
        if (!duration) {
            if (this.background) {
                this.background.setScale(scale * this.background.baseScale);
            }
            f();
            return;
        }

        if (this.background) {
            this.background.runAction(new cc.ScaleTo(duration, scale * this.background.baseScale));
        }

        this.runAction(new cc.Sequence(
            new cc.DelayTime(duration),
            new cc.CallFunc(f)
        ));
    },

    createBonusChest: function () {
        this.bonusChest = new ChestVictoryAnimation();
        this.bonusChest.setPositionRound(cleverapps.styles.ChestVictoryAnimation.chestPosition);

        this.addChild(this.bonusChest);
    },

    createTapToSkip: function (f) {
        var tapToSkip = this.tapToSkip = new TapToContinue({
            text: "TapToSkip"
        });
        tapToSkip.setPositionRound(cleverapps.styles.TapToContinue);
        tapToSkip.setLocalZOrder(30);

        tapToSkip.setVisible(false);
        tapToSkip.show();
        this.addChild(tapToSkip);

        cleverapps.UI.onClick(tapToSkip, function () {
        }, {
            ignoreScale: true,
            onOuterTouch: cleverapps.once(function () {
                this.game.skipBonusAnimations = true;

                tapToSkip.hideAndRemove();
                this.tapToSkip = undefined;

                f();
            }.bind(this))
        });
    }
});

GameSceneBase.ChooseStyling = function (level) {
    if (bundles[level.episode.bundleId()] && bundles[level.episode.bundleId()].urls.background) {
        return {
            bundle: level.episode.bundleId()
        };
    }

    if (cleverapps.environment.isEditorScene() && cleverapps.styles.GameScene.STYLING.editor) {
        return cleverapps.styles.GameScene.STYLING.editor;
    }

    var styling = cleverapps.styles.GameScene.STYLING;

    var data = styling.regular[(level.getHumanReadableNumber()) % styling.regular.length];

    if (level.episode.isBonusRound() || level.isBonus()) {
        data = styling.bonus;
    } else if (level.isHard() || cleverapps.isRumble() && cleverapps.meta.getRumble().getCurrentRound().isLast()) {
        data = styling.hard;
    } else if (level.isTricky()) {
        data = styling.tricky;
    }

    data = cleverapps.clone(data);

    var bundle = data.bundle;
    if (cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL) {
        bundle = bundle.replace("_vertical", "_horizontal");
    }
    data.bundle = bundles[bundle] ? bundle : data.bundle.replace("_vertical", "_" + cleverapps.config.orientation);

    if (level.episode.isBonusWorldLevel()) {
        var mission = cleverapps.missionManager.findRunningMission(Mission.TYPE_BONUS_WORLD);
        if (mission) {
            data.bundle = mission.bonusWorld.backgroundBundleId();
            data.music = bundles[data.bundle].urls.game_music || bundles[data.bundle].urls.music;
            data.skin = undefined;
        }
    }

    return data;
};

cleverapps.styles.GameScene = {
    exclamation: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 }
    },

    actor: undefined,
    startAnimation: {
        scale: 1.05
    },

    sound: {
        delay: 1
    },

    debugLevelNo: {
        x: { align: "right", dx: -100 },
        y: { align: "bottom", dy: 100 }
    }
};

cleverapps.styles.GameScene.STYLING = {
    bonus: {
        backgroundId: "background_bonus",
        bundle: "game_background_vertical",
        music: bundles.game_music.urls.background_music_game
    },

    hard: {
        backgroundId: "background_hard",
        bundle: "game_background_vertical",
        music: bundles.game_music.urls.background_music_hard
    },

    regular: [
        {
            bundle: "game_background_vertical",
            music: bundles.game_music.urls.background_music_game
        }
    ]
};

if (["wordsoup", "olympics"].indexOf(cleverapps.config.name) !== -1) {
    cleverapps.styles.GameScene.STYLING.bonus.patternId = "background_bonus";
}

if (["wordsoup", "olympics", "differences"].indexOf(cleverapps.config.name) !== -1) {
    cleverapps.styles.GameScene.STYLING.hard.patternId = "background_hard";
    cleverapps.styles.GameScene.STYLING.regular[0].patternId = "background";
}

(function () {
    if (bundles.editor && bundles.editor.urls.background) {
        cleverapps.styles.GameScene.STYLING.editor = {
            bundle: "editor"
        };
    }

    var example = cleverapps.styles.GameScene.STYLING.regular[0];

    for (var i = 2; ; i++) {
        if (!bundles.game_background_vertical) {
            if (!bundles.game_background_horizontal.urls["background_" + i]) {
                break;
            }
        } else if (!bundles.game_background_vertical.urls["background_" + i]) {
            break;
        }

        cleverapps.styles.GameScene.STYLING.regular.push({
            backgroundId: "background_" + i,
            bundle: example.bundle,
            music: example.music,
            patternId: example.patternId
        });
    }
}());
