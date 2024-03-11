/**
 * Created by slava on 02.02.17.
 */

cleverapps.Scenes = function () {
    this.onAvoidNodeVisibilityChanged = function () {};
};

cleverapps.refreshScene = function () {
    var sceneChange = function (f) {
        var scene = cleverapps.scenes.getRunningScene();
        scene.refreshFromTool = true;

        if (scene instanceof MainScene) {
            cleverapps.travelBook.gotoMainScene(f);
        } else if (typeof EditorScene !== "undefined" && scene instanceof EditorScene) {
            EditorScene.open({ level: scene.level, callback: f });
        } else if (scene instanceof GameScene) {
            if (cleverapps.config.editorMode) {
                f();
                LevelManager.getInstance().setLevel({
                    levelNo: cleverapps.environment.levelNo,
                    episodeNo: cleverapps.environment.episodeNo
                });
                LevelManager.getInstance().editLevel();
            } else if (cleverapps.config.type === "merge") {
                cleverapps.travelBook.gotoMainScene(f);
            } else {
                cleverapps.meta.wantsToPlay(f);
            }
        } else if (typeof HeroesScene !== "undefined" && scene instanceof HeroesScene) {
            cleverapps.scenes.replaceScene(new HeroesScene(), f);
        } else if (scene instanceof DailyCupScene) {
            cleverapps.scenes.replaceScene(new DailyCupScene(), f);
        } else if (scene instanceof BonusWorldScene) {
            cleverapps.travelBook.gotoMainScene(function () {
                cleverapps.scenes.replaceScene(new BonusWorldScene(cleverapps.missionManager.findRunningMission(Mission.TYPE_BONUS_WORLD)), f);
            });
        }
    };

    if (cleverapps.meta.isFocused()) {
        cleverapps.meta.distract({
            focus: "sceneRefresh",
            action: sceneChange
        });
    } else {
        cleverapps.meta.display({
            focus: "sceneRefresh",
            action: sceneChange
        });
    }
};

cleverapps.Scenes.prototype.getMovingNode = function (target) {
    for (; target; target = target.parent) {
        if (target.movingNode) {
            return target.movingNode;
        }
    }

    return cleverapps.scenes.getRunningScene().movingNode;
};

cleverapps.Scenes.prototype.getRunningScene = function () {
    return cc.director.getRunningScene();
};

cleverapps.Scenes.prototype.replaceScene = function (scene, f) {
    if (!cleverapps.meta.isFocused()) {
        cleverapps.meta.debugMessage("Trying to replace scene without user focus! " + scene.sceneName);
    }

    if (Game.currentGame) {
        Game.currentGame.stop();
        Game.currentGame = undefined;
    }

    cleverapps.sideBar.clearListeners();

    f = f || function () {};

    if (cleverapps.config.editorMode || cleverapps.config.demoMode) {
        cleverapps.silentIntro = true;
    }

    var current = cleverapps.scenes.getRunningScene();
    cleverapps.notification.clear();

    FingerView.remove(FingerView.currentFinger, true);

    PointerView.remove(PointerView.currentPointer);

    var start = Date.now();

    cleverapps.meta.compound(f, [
        function (f) {
            cleverapps.menuBar.clean();
            cleverapps.aims.clear();
            cleverapps.meta.clearTempControls();

            current.dynamicNodesDirty = false;
            current.updateDynamicNodes = cleverapps.EMPTY_FUNCTION;

            current.performRecursive(function (node) {
                cc.eventManager.removeListeners(node);
                node.stopAllActions();
                if (node instanceof cleverapps.Spine) {
                    node.setCompleteListener();
                }
            });
            f();
        },

        function (f) {
            if (scene.prepareBundles) {
                scene.prepareBundles();
            }

            f();
        },

        function (f) {
            this.createTransition(current, scene);

            if (current.onTransitionAnimationDidStart) {
                current.onTransitionAnimationDidStart();
            }

            this.transition && this.transition.performRecursive(function (node) {
                node._transitionChild = true;
            });

            current.performRecursive(function (node) {
                if (node !== current && !node._transitionChild) {
                    if (node.updateSize) {
                        node.updateSize = cleverapps.EMPTY_FUNCTION;
                    }

                    if (node.updatePosition) {
                        node.updatePosition = cleverapps.EMPTY_FUNCTION;
                    }
                }
                delete node._transitionChild;
            });

            if (this.transition && this.transition.closeCurtains) {
                this.transition.closeCurtains(f, cleverapps.silentIntro);
            } else {
                f();
            }
        }.bind(this),

        function (f) {
            if (this.transition) {
                this.transition.replaceParent(scene);
            }

            var currentSize = current.getContentSize();

            cc.director.runScene(scene);
            cc.director.setNextScene();
            if (currentSize.width !== scene.width || currentSize.height !== scene.height) {
                cleverapps.resolution.setupDesignResolution();
                scene.setPositionRound(cleverapps.UI.getBgSize().width - scene.width, cleverapps.UI.getBgSize().height - scene.height);
            }

            f();
        }.bind(this),

        function (f) {
            if (current.unload) {
                current.unload(scene);
            }

            var q = [current];
            while (q.length > 0) {
                var t = q.pop();
                q = q.concat(t.children);

                if (t.iterateTiles) {
                    t.iterateTiles(function (tile) {
                        if (tile instanceof cc.Node) {
                            q.push(tile);
                        }
                    });
                }

                t.removeAllChildren();
            }

            current = undefined;

            if (engine === "creator") {
                cc.SkeletonCache.sharedCache.clear();
            }

            f();
        },

        function (f) {
            var callback = cleverapps.wait(2, f);

            cleverapps.rewardedAdsManager.showPreroll(callback);

            if (scene.load) {
                scene.load(callback);
            } else {
                callback();
            }
        },

        function (f) {
            if (scene.onSceneLoaded) {
                scene.onSceneLoaded();
            }

            if (scene.setLoadingFinished) {
                scene.setLoadingFinished();
            }

            if (scene.updateDynamicNodes) {
                scene.updateDynamicNodes(true);
            }

            if (scene.cachedBundles) {
                var cachedBundles = scene.cachedBundles().filter(function (name) {
                    return name && bundles[name];
                });
                cleverapps.bundleLoader.cacheBundles(cachedBundles);
            }

            f();
        },

        function (f) {
            if (cleverapps.config.debugMode && LoaderScene.start) {
                console.log("scene loading time", (Date.now() - LoaderScene.start) / 1000);
                LoaderScene.start = undefined;
            }

            if (cleverapps.toolModel && typeof ToolView !== "undefined" && scene.movingNode) {
                cleverapps.toolModel.reset();
                scene.toolMenu = new ToolView();
                scene.movingNode.addChild(scene.toolMenu);
                scene.toolMenu.addOpener();
            }

            if (this.transition && this.transition.openCurtains) {
                this.transition.openCurtains(f, cleverapps.silentIntro);
            } else {
                f();
            }
        }.bind(this),

        function (f) {
            this.removeTransition();
            f();
        }.bind(this),

        function (f) {
            if (cc.game.isPaused()) {
                cc.game.step();
            }

            cleverapps.ConsoleStream.sendLoadingTime("scene " + cleverapps.environment.scene + " " + (Date.now() - start) + "ms");

            f();
        }
    ]);
};

cleverapps.Scenes.prototype.createTransition = function (current, scene) {
    this.removeTransition();

    if (cleverapps.flags.noTransitionAnimation) {
        return;
    }

    if (current.createTransition && scene.canTransitionFast && scene.canTransitionFast()) {
        this.transition = current.createTransition();
    }

    if (!this.transition) {
        this.transition = new TransitionAnimation();
        current.addChild(this.transition);
        this.transition.updateSize();
        this.transition.updatePosition();
    }

    if (this.transition.transitionBundles) {
        cleverapps.bundleLoader.loadBundles(this.transition.transitionBundles);
    }
};

cleverapps.Scenes.prototype.removeTransition = function () {
    if (this.transition) {
        this.transition.removeFromParent();

        if (this.transition.transitionBundles) {
            cleverapps.bundleLoader.deleteBundles(this.transition.transitionBundles);
        }

        this.transition = undefined;
    }
};

cleverapps.Scenes.prototype.reset = function () {
    this.removeTransition();
};

cleverapps.Scenes.prototype.sceneRefresh = function () {
    cleverapps.flags.reset();
    cleverapps.episodes.reset();

    if (cleverapps.hose) {
        cleverapps.hose.reset();
        cleverapps.hose.setCurrentEpisode(levels.user.episode);
    }

    if (levels.tutorial) {
        levels.tutorial.stop();
    }

    if (cleverapps.social.isLoggedIn()) {
        cleverapps.social.onLogin();
    } else {
        cleverapps.synchronizer.syncWhenReady();
    }

    cleverapps.windows.reset();
    cleverapps.scenes.reset();

    if (cleverapps.isKnockoutGame()) {
        cleverapps.meta.getMainObject().knockoutGame.stopRumble();
    }

    cleverapps.meta.distract({
        focus: "sceneRefresh",
        action: function (f) {
            cleverapps.travelBook.gotoMainScene(f);
        }
    });
};
