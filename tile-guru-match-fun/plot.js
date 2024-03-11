/**
 * Created by andrey on 20.11.17.
 */

cleverapps.Plot = {
    ReturnToMainScene: function (f, level) {
        var willChangeEpisodeAnimate = this.isEpisodeFinished(level) && cleverapps.meta.getType() === Metha.HOSE && !cleverapps.Plot.isPassedAllEpisodes;

        var actions = [];

        var heroColor = typeof match3 !== "undefined" && match3.heroes.readyToOpen();
        if (heroColor) {
            actions.push(function (f) {
                match3.heroes.incLevel(heroColor);

                new HeroWindow({
                    color: heroColor,
                    type: "unlocked"
                });
                cleverapps.meta.onceNoWindowsListener = f;
            });

            var heroComics = match3.heroes.getComics(heroColor);
            if (heroComics) {
                actions.push(function (f) {
                    ComicsScene.showComics(f, heroComics);
                });
            }
        }

        if (this.isEpisodeFinished(level) && !cleverapps.Plot.isPassedAllEpisodes) {
            var finishedEpisodeNo = levels.user.episode - 1;

            var comics = cleverapps.styles.comicses["finishEpisode" + finishedEpisodeNo] || cleverapps.styles.comicses.finishEpisode;
            if (comics) {
                actions.push(function (f) {
                    ComicsScene.showComics(f, comics);
                });
            }
        }

        if (cleverapps.isKnockoutGame() && level.isRegular()) {
            var rumble = cleverapps.meta.getRumble();

            if (rumble.outcome === Rumble.OUTCOME_UNKNOWN) {
                actions.push(function (f) {
                    cleverapps.meta.wantsToPlay(f);
                });
            } else {
                if (rumble.outcome === Rumble.OUTCOME_WIN) {
                    actions.push(function (f) {
                        cleverapps.meta.getMainObject().knockoutGame.openWindow(f);
                    });

                    actions.push(function (f) {
                        new KnockoutVictoryWindow();
                        cleverapps.meta.onceNoWindowsListener = f;
                    });
                }

                actions.push(function (f) {
                    cleverapps.meta.stopRumble();

                    f();
                });

                actions.push(function (f) {
                    cleverapps.travelBook.gotoMainScene(f);
                });
            }
        } else {
            actions.push(function (f) {
                var missionWithIntent = cleverapps.missionManager.getMissionWithIntent();
                if (!willChangeEpisodeAnimate && missionWithIntent && missionWithIntent.logic.willUseIntent(level)) {
                    missionWithIntent.useMissionIntent(f);
                } else {
                    cleverapps.travelBook.gotoMainScene(f);
                }
            });
        }

        if (willChangeEpisodeAnimate) {
            cleverapps.hose.changeEpisodeAnimation = true;

            var finishedEpisode = levels.user.episode - 1;
            var newEpisode = finishedEpisode + 1;

            actions.push(function (f) {
                cleverapps.meta.compound(f, [
                    function (f) {
                        cleverapps.Plot.onFinishEpisode(f, {
                            episode: cleverapps.hose.episodes[finishedEpisode]
                        });
                    },

                    function (f) {
                        cleverapps.hose.changeEpisodeAnimation = false;
                        cleverapps.hose.gotoNextEpisode(f, true, newEpisode);
                    },

                    function (f) {
                        cleverapps.Plot.onStartEpisode(f, {
                            episode: cleverapps.hose.episodes[newEpisode]
                        });
                    }
                ]);
            });
        }

        if (level.isRegular() && level.isPassed && level.isCurrentLevel()) {
            if (cleverapps.Plot.getDialogueAfterLevel(level)) {
                actions.push(function (f) {
                    cleverapps.Plot.finishLevelDialogue(f, level);
                });
            }
        }

        cleverapps.meta.compound(f, actions);
    },

    onFinishEpisode: function (f, options) {
        cleverapps.meta.compound(f, [
            function (f) {
                new FinishEpisodeWindow(options.episode.episodeNo);

                cleverapps.meta.onceNoWindowsListener = f;
            },

            function (f) {
                options.episode.animatePass(f);
            }
        ]);
    },

    onStartup: function (f, returnClassOnly) {
        if (levels.user.episode === 0 && levels.user.level === 0) {
            return this.onFirstInit(f, returnClassOnly);
        } 
        if (returnClassOnly) {
            return cleverapps.meta.getMainScene();
        }
        if (cleverapps.dailyLevel && cleverapps.dailyLevel.isStartFromPortlet()) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DAILY_LEVEL_CHANNEL + cleverapps.dailyLevel.getCurrentEvent());
            cleverapps.dailyLevel.start(f);
            return;
        }
        cleverapps.travelBook.gotoMainScene(f);
    },

    onFirstInit: function (focus, returnClassOnly) {
        var actions = [];

        if (cleverapps.styles.comicses && cleverapps.styles.comicses.begin && cleverapps.config.source !== "playable") {
            if (returnClassOnly) {
                return {
                    scene: ComicsScene,
                    options: [cleverapps.styles.comicses.begin]
                };
            }
            actions.push(function (f) {
                ComicsScene.showComics(f, cleverapps.styles.comicses.begin);
            });
        } else if (this.hasStartEpisodeWindow()) {
            if (returnClassOnly) {
                return cleverapps.meta.getMainScene();
            }
            actions.push(function (f) {
                cleverapps.travelBook.gotoMainScene(f);
            });
            actions.push(function (f) {
                this.onStartEpisode(f, {
                    episode: cleverapps.hose.getCurrentEpisode()
                });
            }.bind(this));

            cleverapps.meta.compound(focus, actions);
            return;
        }

        if ((cleverapps.meta.getType() === Metha.HOSE || cleverapps.meta.getType() === Metha.SIMPLE) && cleverapps.config.source !== "playable") {
            if (returnClassOnly) {
                return GameScene;
            }
            actions.push(function (f) {
                cleverapps.meta.wantsToPlay(f);
            });
        } else {
            if (returnClassOnly) {
                return cleverapps.meta.getMainScene();
            }
            actions.push(function (f) {
                cleverapps.travelBook.gotoMainScene(f);
            });
        }

        cleverapps.meta.compound(focus, actions);
    },

    hasStartEpisodeWindow: function () {
        return cleverapps.meta.getType() === Metha.HOSE && cleverapps.config.name === "riddles" && cleverapps.config.source !== "playable";
    },

    onStartEpisode: function (f, options) {
        if (options.episode.isComingSoon()) {
            new FinisherWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        } else {
            var actions = [];

            actions.push(function (f) {
                options.episode.animateOpen(f);
            });

            if (this.hasStartEpisodeWindow()) {
                actions.push(function (f) {
                    new StartEpisodeWindow(options.episode);
                    cleverapps.meta.onceNoWindowsListener = f;
                });
            }

            cleverapps.meta.compound(f, actions);
        }
    },

    isEpisodeFinished: function (level) {
        return level.isRegular() && level.isPassed && level.isLastLevelOnEpisode() && level.isCurrentLevel();
    },

    getDialogueAfterLevel: function (level) {
        if (!cleverapps.styles.dialogues || !level.isRegular()) {
            return false;
        }

        var passedNo = cleverapps.user.getHumanReadableNumber() - 1;
        return cleverapps.styles.dialogues["finishLevel" + passedNo];
    },

    finishLevelDialogue: function (f, level) {
        var styles = this.getDialogueAfterLevel(level);
        if (!styles) {
            return;
        }

        var scene = cleverapps.scenes.getRunningScene();

        cleverapps.meta.compound(f, [
            function (f) {
                if (styles.bundles) {
                    cleverapps.bundleLoader.loadBundles(styles.bundles, {
                        onSuccess: function () {
                            f();
                        },
                        blocked: true
                    });
                } else {
                    f();
                }
            },
            function (f) {
                var scale = 1.2;
                var dy = scene.height * (scale - 1);
                scene.createFilmEffect({
                    scale: scale,
                    layerTimeout: 0.3,
                    scaleTimeout: 1,
                    moveBy: { y: dy },
                    onShow: f
                });
            },
            function (f) {
                var dialogue = new Dialogue(styles.dialogue, {
                    autoClose: true,
                    autoScroll: 3,
                    parentScene: true,
                    showUp: true
                });
                dialogue.on("afterClose", f);

                var dialogueView = new DialogueView(dialogue);
                dialogueView.setLocalZOrder(51);
            },
            function (f) {
                scene.removeFilmEffect(0.4, f);
            }
        ]);
    }
};

cleverapps.styles.comicses = {};