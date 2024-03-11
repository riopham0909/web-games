/**
 * Created by andrey on 17.08.18.
 */

var Placements = function () {
    this.data = this.initialize();
    this.sortKeys();

    this.load();

    cleverapps.whenAllInitialized(function () {
        this.run(Placements.STARTUP);
    }.bind(this));

    cleverapps.meta.onFocusLostListenerPlacements = function () {
        if (cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition()) {
            this.run(Placements.FREE_FOCUS_MAIN);
        } else if (cleverapps.environment.isGameScene()) {
            this.run(Placements.FREE_FOCUS_GAME);
        } else {
            this.run(Placements.FREE_FOCUS_OTHER);
        }
    }.bind(this);

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, cleverapps.throttle(1000, function () {
        this.run(Placements.ONSHOW);
    }.bind(this)));
};

Placements.prototype.sortKeys = function () {
    this.sortedKeys = Object.keys(this.data);
    this.sortedKeys.sort(function (a, b) {
        a = this.data[a];
        b = this.data[b];
        return (b.priority || 0) - (a.priority || 0);
    }.bind(this));

    this.keysByType = {};
};

Placements.prototype.listKeys = function (type) {
    if (this.keysByType[type]) {
        return this.keysByType[type];
    }

    var key = this.sortedKeys.filter(function (code) {
        var placement = this.data[code];
        return (placement.type & type) !== 0;
    }, this);
    this.keysByType[type] = key;
    return key;
};

Placements.prototype.initialize = function () {
    var typeMerge = cleverapps.config.type === "merge";
    return {
        recalculateFlags: {
            type: Placements.ONSHOW_OR_STARTUP | Placements.INTERMEDIATE_OR_AFTER_FINISH,
            action: function () {
                cleverapps.flags.update();
            }
        },

        versionCheck: {
            type: Placements.ONSHOW_OR_STARTUP,
            action: function () {
                cleverapps.versionChecker.check();
            },
            interval: "1 hour"
        },

        versionCheckAlert: {
            type: Placements.FREE_FOCUS,
            priority: 11,

            filter: function () {
                return cleverapps.versionChecker.needUpdate();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "VersionChecker.Alert",
                    action: function (f) {
                        new NewVersionWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        },

        displaySceneIntro: {
            type: Placements.FREE_FOCUS,
            priority: -1000,
            filter: function () {
                return !cleverapps.scenes.getRunningScene().introShown;
            },
            action: function () {
                var scene = cleverapps.scenes.getRunningScene();
                var actions = [];

                if (!cleverapps.config.wysiwygMode && cleverapps.silentIntro && cleverapps.loadedSnapshot && cleverapps.loadedSnapshot.actions) {
                    actions = cleverapps.loadedSnapshot.actions;
                }

                cleverapps.meta.display({
                    focus: "Scene.intro",
                    control: scene.introControls(),
                    actions: [
                        function (f) {
                            scene.introShown = true;
                            scene.playIntro(f, cleverapps.silentIntro);
                            cleverapps.silentIntro = false;
                        },

                        function (f) {
                            cleverapps.restoreProgress.update();

                            f();

                            if (actions.length) {
                                console.log("loaded snapshot played");
                                cleverapps.snapshots.playActions(actions);
                            }

                            if (cleverapps.clipPlayer) {
                                cleverapps.clipPlayer.run();
                            }
                        }
                    ]
                });
            }
        },

        packManager: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: 3,

            filter: function () {
                return cleverapps.packManager.needDisplayWindow();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "showPackWindow",
                    action: function (f) {
                        new PackWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            },
            delayFromStart: "5 minutes"
        },

        interstitialNoOutcomeGames: {
            type: Placements.FREE_FOCUS,
            priority: 0,

            filter: function () {
                return !cleverapps.config.wysiwygMode && typeMerge
                    && cleverapps.rewardedAdsManager.canShowInterstitial() && !cleverapps.platform.oneOf(Crazy);
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "PlacementInterstitial",
                    action: function (f) {
                        cleverapps.rewardedAdsManager.showInterstitial(f);
                    }
                });
            },

            interval: "1 minutes",
            delayFromStart: "3 minutes"
        },

        createShortcut: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.platform.canCreateShortcut() && levels.user.checkAvailable(cleverapps.Availables.CREATE_SHORTCUT);
            },
            action: function () {
                cleverapps.platform.createShortcut();
            },
            interval: "10 minutes"
        },

        joinGroup: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return levels.user.checkAvailable(cleverapps.Availables.JOIN_GROUP);
            },
            action: function () {
                cleverapps.platform.followOfficialPage();
            },
            interval: "7 days",
            delayFromStart: "10 minutes"
        },

        canUpgradeHeroes: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: -1,

            filter: function () {
                if (typeof match3 === "undefined" || match3.heroes === undefined) {
                    return false;
                }
                return match3.heroes.available() && cleverapps.forces.isShown(Forces.HEROES_AVAILABLE.id) && match3.heroes.canUpgradeSomebody();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "CanUpgradeHeroWindow",
                    action: function (f) {
                        new CanUpgradeHeroWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            },

            interval: "10 minutes"
        },

        piggyBankFull: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.piggyBank && cleverapps.piggyBank.isActive() && cleverapps.piggyBank.isFull();
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "PiggyBankWindow",
                    control: "MenuBarGoldItem",
                    action: function (f) {
                        new PiggyBankWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            },
            interval: "1 hour"
        },

        showRestore: {
            type: Placements.FREE_FOCUS,
            action: function () {
                cleverapps.paymentsManager.showRestore();
            }
        },

        subscriptionOffer: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.subscription.needDisplayWindow();
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "SubscriptionWindow",
                    action: function (f) {
                        new SubscriptionWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            },
            interval: (cleverapps.platform.oneOf(MobileOK, OKPlatform) ? "1 day" : "3 day"),
            delayFromStart: "10 minutes"
        },

        promotion: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: -1,
            filter: function () {
                return cleverapps.crossPromo.isReady();
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "CrossPromoWindow",
                    action: function (f) {
                        cleverapps.CrossPromo.ShowFirstAvailable();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            },
            interval: "3 days",
            delayFromStart: "10 seconds"
        },

        starChest: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.starChest && !cleverapps.starChest.locked;
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "StarChestWindow",
                    action: function (f) {
                        new StarChestWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        },

        unlimitedLivesStart: {
            type: Placements.ONSHOW_OR_STARTUP,
            filter: function () {
                return levels.user.episode === 0 && cleverapps.unlimitedLives && !cleverapps.unlimitedLives.checkBuyed();
            },

            action: function () {
                cleverapps.unlimitedLives.buy("3 hours");
                cleverapps.lives.onBuyUnlimitedLivesListener();
            }
        },

        unlimitedLivesWindow: {
            type: Placements.FREE_FOCUS,
            priority: 0,

            filter: function () {
                return cleverapps.unlimitedLives && cleverapps.environment.hasScene([cleverapps.Environment.SCENE_MAIN, cleverapps.Environment.SCENE_DAILY_CUP]);
            },

            action: function () {
                cleverapps.unlimitedLives.displayPromotionOnFinish();
            }
        },

        minigameNudge: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: 4,
            filter: function () {
                var missions = cleverapps.missionManager.getPlayableMissions();
                return missions.length > 0;
            },
            action: function () {
                var missions = cleverapps.missionManager.getPlayableMissions();

                for (var i = 0; i < missions.length; i++) {
                    var mission = missions[i];
                    if (mission.nudgeWindow && mission.started
                       && (mission.needShowStartWindow === undefined || mission.needShowStartWindow)) {
                        cleverapps.meta.display({
                            focus: "NudgeWindow",
                            action: function (f) {
                                var NudgeWindowClass = mission.nudgeWindow;
                                new NudgeWindowClass(mission);
                                cleverapps.meta.onceNoWindowsListener = f;
                            }
                        });
                        return;
                    }
                }
            },
            interval: "10 minutes"
        },

        localstorageDisabled: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: 8,
            filter: function () {
                return !cleverapps.DataLoader.enabled && !cleverapps.DataLoader.alerted;
            },
            action: function () {
                cleverapps.DataLoader.setAlerted(true);

                cleverapps.meta.display({
                    focus: "LocalStorageDisabledWindow",
                    action: function (f) {
                        new LocalStorageDisabledWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        },

        sideBarIcons: {
            type: Placements.FREE_FOCUS,

            action: function () {
                if (typeof ClansCupIcon !== "undefined") {
                    cleverapps.sideBar.resetByClassName(ClansCupIcon);
                }
                cleverapps.sideBar.resetByClassName(LandmarkDonorIcon);
            }
        },

        sideBarForce: {
            type: Placements.FREE_FOCUS,

            filter: function () {
                return !cleverapps.environment.isGameScene() && cleverapps.sideBar.anyIconWithForceIndex() !== undefined;
            },

            action: function () {
                cleverapps.sideBar.showAnyForce();
            }
        },

        cryptexForce: {
            type: Placements.FREE_FOCUS_GAME,
            priority: -1001,

            filter: function () {
                return Game.currentGame && Game.currentGame.cryptex && Game.currentGame.cryptex.canShowForce();
            },

            action: function () {
                Game.currentGame.cryptex.showForce();
            }
        },

        playChangeOutcome: {
            type: Placements.FREE_FOCUS_GAME,
            priority: 0,

            filter: function () {
                return cleverapps.scenes.getRunningScene().wantPlayChangeOutcome;
            },

            action: function () {
                cleverapps.scenes.getRunningScene().playChangeOutcome();
            }
        },

        heroesTutorial: {
            type: Placements.FREE_FOCUS_OTHER,

            filter: function () {
                return cleverapps.environment.isHeroesScene() && typeof match3 !== "undefined" && match3.heroes
                    && (match3.heroes.getUnlockTutorialHero() || match3.heroes.getUpgradeTutorialHero());
            },

            action: function () {
                match3.heroes.displayHeroForce(match3.heroes.getUnlockTutorialHero() || match3.heroes.getUpgradeTutorialHero());
            }
        },

        homefixNewTask: {
            type: Placements.FREE_FOCUS_MAIN,

            filter: function () {
                return cleverapps.meta.getType() === Metha.HOMEFIX && cleverapps.home.needNewTask();
            },

            action: function () {
                var toOpen = cleverapps.home.furniture.filter(function (furniture) {
                    return furniture.readyToOpen();
                });

                cleverapps.meta.display({
                    focus: "homefixNewTask",
                    actions: toOpen.map(function (furniture) {
                        return function (f) {
                            cleverapps.home.giveNewTask(f, furniture);
                        };
                    })
                });
            }
        },

        toolbarForce: {
            type: Placements.FREE_FOCUS_MAIN,

            filter: function () {
                return cleverapps.toolbar.anyItemWithForce();
            },

            action: function () {
                cleverapps.toolbar.showAnyForce();
            }
        },

        keypadForce: {
            priority: -1001,
            type: Placements.FREE_FOCUS_GAME,

            filter: function () {
                return Game.currentGame && Game.currentGame.keypad && Game.currentGame.keypad.getAvailableForce();
            },

            action: function () {
                var force = Game.currentGame.keypad.getAvailableForce();
                if (force) {
                    cleverapps.meta.display({
                        focus: "Keypad.force",
                        action: function (f) {
                            Game.currentGame.keypad.showForce(f, force);
                        }
                    });
                }
            }
        },

        knockoutTutorial: {
            priority: -1001,
            type: Placements.FREE_FOCUS,

            filter: function () {
                return cleverapps.isKnockoutGame() && cleverapps.knockoutTutorial.isAvailable();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "KnockoutTutorialStep" + cleverapps.knockoutTutorial.step,
                    control: cleverapps.knockoutTutorial.control,
                    action: function (f) {
                        cleverapps.knockoutTutorial.run(f);
                    }
                });
            }
        },

        missionFinished: {
            type: Placements.FREE_FOCUS,
            priority: 5,

            filter: function () {
                if (!cleverapps.config.demoMode) {
                    cleverapps.missionManager.removeSilents();
                    if (cleverapps.environment.isMainScene()) {
                        return cleverapps.missionManager.wantsToShowCompleted();
                    }
                }
            },

            action: function () {
                var mission = cleverapps.missionManager.wantsToShowCompleted();
                if (mission) {
                    cleverapps.meta.display({
                        focus: "missionCompleted" + mission.name,
                        action: function (f) {
                            mission.displayCompleted(f);
                        }
                    });
                }
            }
        },

        missionManagerProcess: {
            type: Placements.FREE_FOCUS,
            priority: 5,

            filter: function () {
                return cleverapps.environment.isMainScene() && !cleverapps.config.demoMode;
            },

            action: function () {
                cleverapps.missionManager.run();

                var mission = cleverapps.missionManager.pendingStartWindow();
                if (mission) {
                    cleverapps.missionManager.showStartWindow(mission);
                }
            },
            delayFromStart: "1 minutes"
        },

        missionStartWindow: {
            type: Placements.FREE_FOCUS,
            priority: 6,

            filter: function () {
                return cleverapps.environment.isMainScene() && cleverapps.missionManager.pendingStartWindow();
            },

            action: function () {
                cleverapps.missionManager.showStartWindow(cleverapps.missionManager.pendingStartWindow());
            }
        },

        missionReplaceOld: {
            type: Placements.FREE_FOCUS,
            priority: 7,

            filter: function () {
                return cleverapps.missionManager.getUnfinishedOldMission();
            },

            action: function () {
                cleverapps.missionManager.replaceOldMission();
            }
        },

        displayPassWindow: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                var mission = cleverapps.missionManager.findLocalPass();
                return mission && mission.logic.needDisplayWindow() && !cleverapps.config.demoMode;
            },
            action: function () {
                var mission = cleverapps.missionManager.findLocalPass();

                if (mission.isRunning()) {
                    mission.logic.displayWindow();
                } else {
                    cleverapps.meta.display({
                        focus: "missionCompleted" + mission.name,
                        action: function (f) {
                            mission.displayCompleted(f);
                        }
                    });
                }
            }
        },

        friendsCache: {
            type: Placements.ONSHOW_OR_STARTUP,
            filter: function () {
                return cc.sys.isNative;
            },
            action: function () {
                cleverapps.friends.reload();
                cleverapps.invitalbleFriends.reload();
            }
        },

        localPushes: {
            type: Placements.ONSHOW_OR_STARTUP,
            action: function () {
                cleverapps.localPushes.onShow();
            }
        },

        syncClientSessionExpiredWindow: {
            type: Placements.FREE_FOCUS,
            priority: 10000,
            filter: function () {
                return cleverapps.synchronizer.needClientSessionExpiredWindow();
            },
            action: function () {
                cleverapps.synchronizer.showClientSessionExpiredWindow();
            }
        },

        syncReloadWindow: {
            type: Placements.FREE_FOCUS,
            priority: 10001,
            filter: function () {
                return cleverapps.synchronizer._syncIn.needShowReloadWindow();
            },
            action: function () {
                cleverapps.synchronizer._syncIn.showReloadWindow();
            }
        },

        syncSocialConnectWindow: {
            type: Placements.FREE_FOCUS,
            priority: 11,
            filter: function () {
                return cleverapps.synchronizer.wantsSocialConnectWindow;
            },
            action: function () {
                cleverapps.synchronizer.displaySocialConnectWindow();
            }
        },

        sync: {
            type: Placements.ONSHOW,
            action: function () {
                cleverapps.synchronizer.syncWhenReady();
            },
            interval: "30 seconds"
        },

        checkConnection: {
            type: Placements.FREE_FOCUS,
            filter: function () {
                var available = { level: 1.13 };
                if (typeMerge) {
                    available = { level: 5 };
                }
                return !cleverapps.flags.nologin && !cleverapps.social.isLoggedIn() && cleverapps.user.checkAvailable(available);
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "checkConnection",
                    action: function (f) {
                        cleverapps.social.checkConnection(f, f, {
                            withWindow: true
                        });
                    }
                });
            },
            interval: "7 days"
        },

        checkConnectionStartup: {
            type: Placements.FREE_FOCUS,
            once: true,
            filter: function () {
                return !cleverapps.flags.nologin && !cleverapps.social.isLoggedIn() && (cleverapps.social instanceof CrazySocial);
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "checkConnection",
                    action: function (f) {
                        cleverapps.social.checkConnection(f, f, {
                            withWindow: true
                        });
                    }
                });
            }
        },

        mergeRateWindow: {
            type: Placements.FREE_FOCUS,
            filter: function () {
                return typeMerge && RateWindow.CanRate();
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "nativePlacementRate",
                    action: function (f) {
                        new RateWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        },

        subscriptionReload: {
            type: Placements.ONSHOW_OR_STARTUP,
            filter: function () {
                return cleverapps.subscription;
            },
            action: function () {
                cleverapps.subscription.reload();
            }
        },

        animatePassLevel: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: -2,

            filter: function () {
                return PlayButton.IsAvailable() && cleverapps.playButton.passedLevel && cleverapps.isLevels();
            },

            action: function () {
                cleverapps.playButton.animatePassLevel();
            }
        },

        simpleForce: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: 9,

            filter: function () {
                return cleverapps.meta.getType() === Metha.SIMPLE && cleverapps.simple.isForceAvailable();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "simpleForce",
                    control: ["play_button"],
                    actions: [
                        function (f) {
                            if (PlayButton.IsAvailable() && cleverapps.playButton.passedLevel) {
                                cleverapps.playButton.animatePassLevel();
                            }
                            if (cleverapps.simple.pendingsStars > 0) {
                                cleverapps.simple.updateProgress(f);
                            } else {
                                f();
                            }
                        },

                        function (f) {
                            cleverapps.simple.showForce(f);
                        }
                    ]
                });
            }
        },

        simpleUpdateProgress: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: -2,

            filter: function () {
                return cleverapps.meta.getType() === Metha.SIMPLE && cleverapps.simple.pendingsStars > 0 && !cleverapps.simple.canMoveNext();
            },

            action: function () {
                cleverapps.simple.updateProgress();
            }
        },

        simpleMoveNext: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: 10,

            filter: function () {
                return cleverapps.meta.getType() === Metha.SIMPLE && cleverapps.simple.canMoveNext();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "simpleMoveNext",
                    control: ["play_button"],
                    actions: [
                        function (f) {
                            if (PlayButton.IsAvailable() && cleverapps.playButton.passedLevel && cleverapps.config.name !== "woodenblock") {
                                cleverapps.playButton.animatePassLevel();
                            }
                            if (cleverapps.simple.pendingsStars > 0) {
                                cleverapps.simple.updateProgress(f);
                            } else {
                                f();
                            }
                        },

                        function (f) {
                            cleverapps.simple.moveNext(f);
                        }
                    ]
                });
            }
        },

        bonusWorldFinished: {
            type: Placements.FREE_FOCUS,

            filter: function () {
                return cleverapps.environment.isBonusWorldScene() && cleverapps.scenes.getRunningScene().bonusWorld.isFinished();
            },

            action: function () {
                var bonusWorld = cleverapps.scenes.getRunningScene().bonusWorld;

                cleverapps.meta.display({
                    focus: "bonusWorldFinished",
                    action: function (f) {
                        bonusWorld.finish(f);
                    }
                });
            }
        },

        bonusWorldReward: {
            type: Placements.FREE_FOCUS,
            priority: 2,

            filter: function () {
                return cleverapps.environment.isBonusWorldScene() && cleverapps.scenes.getRunningScene().bonusWorld.getAvailableReward();
            },

            action: function () {
                var bonusWorld = cleverapps.scenes.getRunningScene().bonusWorld;

                cleverapps.meta.display({
                    focus: "bonusWorldReward",
                    actions: [
                        function (f) {
                            if (bonusWorld.levelPassed) {
                                bonusWorld.animateChangeProgress();

                                setTimeout(f, 2000);
                            } else {
                                f();
                            }
                        },
                        function (f) {
                            bonusWorld.giveReward(f);
                        }
                    ]
                });
            }
        },

        bonusWorldProgress: {
            type: Placements.FREE_FOCUS,
            priority: 1,

            filter: function () {
                return cleverapps.environment.isBonusWorldScene() && cleverapps.scenes.getRunningScene().bonusWorld.levelPassed;
            },

            action: function () {
                var bonusWorld = cleverapps.scenes.getRunningScene().bonusWorld;

                bonusWorld.animateChangeProgress();
            }
        },

        runCounterStages: {
            type: Placements.FREE_FOCUS,
            priority: 1,

            action: function () {
                if (typeMerge && Game.currentGame && Game.currentGame.showUpFinished && !Game.currentGame.counter.isActive()) {
                    Game.currentGame.counter.trigger();
                }
            }
        },

        repeatedQuests: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: 1,
            filter: function () {
                return typeMerge && cleverapps.environment.isMainScene() && Game.currentGame && Game.currentGame.quests.isRepeatedQuestsAvailable();
            },

            action: function () {
                Game.currentGame.quests.runRepeatedQuests();
            },

            interval: cleverapps.config.debugMode ? "10 seconds" : "1 hour"
        },

        slotMachineForce: {
            type: Placements.FREE_FOCUS_OTHER,

            filter: function () {
                var mission = cleverapps.missionManager.findByType(Mission.TYPE_SLOT_MACHINE);
                return cleverapps.environment.isSlotMachineScene() && mission && mission.logic.isForceAvailable();
            },

            action: function () {
                var mission = cleverapps.missionManager.findByType(Mission.TYPE_SLOT_MACHINE);
                mission && mission.logic.showForce();
            }
        },

        slotMachineHelpForce: {
            priority: -10,
            type: Placements.FREE_FOCUS_OTHER,

            filter: function () {
                var mission = cleverapps.missionManager.findByType(Mission.TYPE_SLOT_MACHINE);
                return cleverapps.environment.isSlotMachineScene() && mission && mission.logic.isHelpForceAvailable();
            },

            action: function () {
                var mission = cleverapps.missionManager.findByType(Mission.TYPE_SLOT_MACHINE);
                mission && mission.logic.showHelpForce();
            }
        },

        runSpecialEnergyOffer: {
            type: Placements.FREE_FOCUS,

            filter: function () {
                return typeMerge
                    && cleverapps.environment.isMainScene()
                    && Game.currentGame.specialEnergyOffer.showPlacement;
            },

            action: function () {
                Game.currentGame.specialEnergyOffer.showPlacement = false;

                Game.currentGame.specialEnergyOffer.displayWindow();
            }
        },

        showChatPresents: {
            priority: 1,
            type: Placements.FREE_FOCUS,

            filter: function () {
                return cleverapps.chatPresents !== undefined
                    && (cleverapps.environment.isMainScene() || cleverapps.environment.isGameScene());
            },

            action: function () {
                cleverapps.chat.giveRewards();
            }
        },

        growthFund: {
            type: Placements.FREE_FOCUS_MAIN,
            priority: -2,

            filter: function () {
                return cleverapps.growthFund && cleverapps.growthFund.wantsAttention && cleverapps.growthFund.isActive();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "GrowthFundNudge",
                    action: function (f) {
                        new GrowthFundWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        },

        flyingAd: {
            type: Placements.FREE_FOCUS_MAIN,

            filter: function () {
                return cleverapps.flyingAd && cleverapps.flyingAd.needUpdate();
            },

            action: function () {
                cleverapps.flyingAd.update();
            }
        },

        subscriptionReward: {
            type: Placements.FREE_FOCUS_MAIN,
            interval: "1 day",

            filter: function () {
                return cleverapps.subscription && cleverapps.subscription.isRewardReady() && Subscription.IsAvailable();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "SubscriptionReward",
                    action: function (f) {
                        new ShopWindow({
                            tab: ShopWindow.TABS.HARD_CURRENCY, priorityType: SubscriptionTile, finger: true
                        });

                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });
            }
        },

        updateMissionTreeUnit: {
            type: Placements.FREE_FOCUS,

            filter: function () {
                return typeof MissionTree !== "undefined" && MissionTree.wantsToUpdateUnitStage;
            },

            action: function () {
                MissionTree.processStateChange();
            }
        },

        seasonWindow: {
            type: Placements.FREE_FOCUS_MAIN,

            filter: function () {
                return Game.currentGame && Game.currentGame.season && Game.currentGame.season.hasFresh();
            },

            action: function () {
                Game.currentGame.season.processFresh();
            }
        },

        returnBonus: {
            type: Placements.FREE_FOCUS,
            priority: 50,

            filter: function () {
                return cleverapps.returnBonus.shouldReward();
            },

            action: function () {
                cleverapps.returnBonus.giveReward();
            }
        },

        dailyCupReward: {
            type: Placements.FREE_FOCUS,
            filter: function () {
                return cleverapps.dailyCup.getReward();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "dailyCupReward",
                    action: function (f) {
                        cleverapps.dailyCup.receiveReward(f);
                    }
                });
            }
        },

        weeklyCupReward: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.weeklyCup.getReward();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "weeklyCupReward",
                    action: function (f) {
                        cleverapps.weeklyCup.receiveReward(f);
                    }
                });
            }
        },

        clanCupReward: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.clanCup.getReward();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "clanCupReward",
                    action: function (f) {
                        cleverapps.clanCup.receiveReward(f);
                    }
                });
            }
        },

        clanCupWindow: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.clanCup.wantsToShow;
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "ClansCupIcon",
                    actions: [
                        function (f) {
                            new GuideWindow({ name: "ClanCupGuideWindow" });
                            cleverapps.meta.onceNoWindowsListener = f;
                        },

                        function (f) {
                            new ClansCupWindow();
                            cleverapps.meta.onceNoWindowsListener = f;
                        }
                    ]
                });
            }
        },

        travelBook: {
            type: Placements.FREE_FOCUS,
            priority: 5,

            filter: function () {
                return typeMerge && cleverapps.environment.isMainScene();
            },

            action: function () {
                cleverapps.travelBook.updatePages();
                cleverapps.toolbar.resetByType(ToolbarItem.TRAVEL_BOOK);
            }
        },

        luckyBonus: {
            type: Placements.FREE_FOCUS_GAME,

            filter: function () {
                return cleverapps.troopCards && cleverapps.troopCards.isLuckyBonusReady();
            },

            action: function () {
                cleverapps.troopCards.showLuckyBonus();
            }
        },

        troopCardsForce: {
            type: Placements.FREE_FOCUS,
            priority: -1001,

            filter: function () {
                return cleverapps.troopCards && Game.currentGame && cleverapps.troopCards.isForceAvailable();
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "TroopCardsForce",
                    control: ["MenuBarCoinsItem"],
                    action: function (f) {
                        cleverapps.troopCards.showForce(f, Forces.TROOP_CARDS_FORCE);

                        cleverapps.forces.onceForceClosed = f;
                    }
                });
            }
        },

        newTroopWindow: {
            type: Placements.FREE_FOCUS_GAME,

            filter: function () {
                return cleverapps.config.type === "battlefield" && cleverapps.armyLibrary.getUnopenedAvailable() !== undefined;
            },

            action: function () {
                var code = cleverapps.armyLibrary.getUnopenedAvailable();

                cleverapps.meta.display({
                    focus: "NewTroopWindow",
                    actions: [
                        function (f) {
                            new NewTroopWindow(code);

                            cleverapps.meta.onceNoWindowsListener = f;
                        },
                        function (f) {
                            cleverapps.troopCards.showNewUnitForce(f, code);
                        }
                    ]
                });
            }
        },

        softForce: {
            type: Placements.FREE_FOCUS_GAME,

            filter: function () {
                return cleverapps.config.type === "battlefield"
                    && !cleverapps.forces.isShown(Forces.MENU_BAR_SOFT_FORCE.id)
                    && cleverapps.user.checkAvailable(Forces.MENU_BAR_SOFT_FORCE.available);
            },

            action: function () {
                cleverapps.menuBar.showForce("CoinsItem");
            }
        },

        playButtonForce: {
            type: Placements.FREE_FOCUS_MAIN,

            filter: function () {
                return cleverapps.config.type === "battlefield"
                    && !cleverapps.forces.isShown(Forces.METHA_PLAY_BUTTON.id);
            },

            action: function () {
                cleverapps.meta.display({
                    focus: "PlayButtonForce",
                    action: function (f) {
                        cleverapps.scenes.getRunningScene().showPlayButtonForce(f);
                    }
                });
            }
        },

        pastAchievements: {
            type: Placements.FREE_FOCUS_MAIN,
            filter: function () {
                return cleverapps.achievements && cleverapps.achievements.wantsPastCheck;
            },
            action: function () {
                cleverapps.achievements.checkPastFeats();
            }
        },

        loadOldUserId: {
            type: Placements.ONSHOW_OR_STARTUP,
            filter: function () {
                return cleverapps.platform.loadOldUserId && !cleverapps.platform.oldUserId;
            },
            action: function () {
                cleverapps.platform.loadOldUserId(function (oldUserId) {
                    if (oldUserId) {
                        console.log("old userId loaded", oldUserId);
                        cleverapps.platform.oldUserId = oldUserId;
                        cleverapps.userIdsHistory.add(oldUserId);
                    }
                });
            },
            interval: "1 day"
        },

        syncOldUserId: {
            type: Placements.FREE_FOCUS,
            priority: 12,
            filter: function () {
                return cleverapps.platform.oldUserId && cleverapps.synchronizer.isReady();
            },
            action: function () {
                cleverapps.synchronizer.getProgress(cleverapps.platform.oldUserId, {
                    acceptOnlyIfBetter: true,
                    callback: function () {
                        cleverapps.platform.oldUserId = undefined;
                    }
                });
            }
        },

        loginStatusChanged: {
            type: Placements.FREE_FOCUS,
            filter: function () {
                return cleverapps.platform.oneOf(Samsung) && cleverapps.social.loginStatusChanged;
            },
            action: function () {
                cleverapps.meta.display({
                    focus: "loginStatusChanged",
                    action: function () {
                        new RestartWindow({ contentMessage: "RestartWindow.OnChangeLoginStatus" });
                    }
                });
            }
        },

        notifyLoaded: {
            type: Placements.FREE_FOCUS,
            priority: 10002,

            filter: function () {
                return cleverapps.platform.notifyLoaded && !cleverapps.platform.notifyLoadedDone && cleverapps.platform.isConnected(Platform.PLATFORM);
            },

            action: function () {
                cleverapps.platform.notifyLoadedDone = true;

                cleverapps.platform.notifyLoaded();
            }
        }
    };
};

Placements.prototype.resetAllPlacements = function () {
    this.lastStarts = {};
    this.onceStarts = {};
    this.save();
};

Placements.prototype.run = function (type, options) {
    options = options || {};

    var keys = this.listKeys(type);
    for (var i = 0; i < keys.length; i++) {
        var code = keys[i];
        var placement = this.data[code];

        if (placement.once && this.onceStarts[code]) {
            continue;
        }

        if (placement.interval) {
            var interval = cleverapps.parseInterval(placement.interval);
            var lastStart = this.lastStarts[code] || 0;
            if (lastStart + interval > Date.now()) {
                continue;
            }
        }

        if (placement.delayFromStart && !options.skipDelayFromStart) {
            var delayFromStart = cleverapps.parseInterval(placement.delayFromStart);
            var start = cleverapps.user.visited || 0;
            if (start + delayFromStart > Date.now()) {
                continue;
            }
        }

        if (placement.filter && !placement.filter()) {
            continue;
        }

        var willUseFocus = (placement.type & Placements.FREE_FOCUS) !== 0;

        if (willUseFocus) {
            if (cleverapps.meta.isFocused()) {
                continue;
            }

            if (placement.priority === -1) {
                if (cleverapps.loadedSnapshot && !this.lastFreeFocusStart) {
                    continue;
                }

                if (this.lastFreeFocusStart + cleverapps.parseInterval("1 minute") > Date.now()) {
                    continue;
                }
            }
        }

        placement.action();
        this.lastStarts[code] = Date.now();

        if (placement.once) {
            this.onceStarts[code] = true;
        }

        if (willUseFocus) {
            if (cleverapps.meta.isFocused()) {
                this.lastFreeFocusStart = Date.now();
                break;
            }
        }
    }

    this.save();
};

Placements.prototype.load = function () {
    var info = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.PLACEMENTS) || {};
    this.onceStarts = info.onceStarts || {};
    this.lastStarts = info.lastStarts || {};
};

Placements.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.PLACEMENTS, this.getInfo());
};

Placements.prototype.getInfo = function () {
    return {
        lastStarts: this.lastStarts
    };
};

Placements.STARTUP = 1 << 0;
Placements.ONSHOW = 1 << 1;
Placements.INTERMEDIATE = 1 << 2;
Placements.AFTER_GAME_FINISH = 1 << 4;

Placements.FREE_FOCUS_MAIN = 1 << 5;
Placements.FREE_FOCUS_GAME = 1 << 6;
Placements.FREE_FOCUS_OTHER = 1 << 7;

Placements.ONSHOW_OR_STARTUP = Placements.ONSHOW | Placements.STARTUP;
Placements.INTERMEDIATE_OR_AFTER_FINISH = Placements.INTERMEDIATE | Placements.AFTER_GAME_FINISH;

Placements.FREE_FOCUS = Placements.FREE_FOCUS_MAIN | Placements.FREE_FOCUS_GAME | Placements.FREE_FOCUS_OTHER;
