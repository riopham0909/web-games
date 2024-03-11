/**
 * Created by slava on 23.03.17.
 */

cleverapps.FixedWidthScene = cc.Scene.extend({
    listBundles: function () {
        return [];
    },

    cachedBundles: function () {
        return [];
    },

    listBaseBundles: function () {
        cleverapps.eventManager.setCurrentFeatures();
        cleverapps.skins.update(this);

        var result = ["main"];

        if (cleverapps.config.debugMode) {
            result.push("dev_resources");
            result.push("orangery");
        }
        if (cleverapps.skins.getBundles()) {
            result = result.concat(cleverapps.skins.getBundles());
        }

        return result;
    },

    ctor: function (options) {
        this._super();

        this.level = options && options.level;
    },

    closeAction: function () {
        if (cleverapps.meta.isFocused()) {
            return;
        }

        if (cleverapps.git && !cleverapps.git.handleSceneClose()) {
            return;
        }

        this._closeAction();
    },

    _closeAction: function () {
        cleverapps.meta.display({
            focus: "closeScene",
            action: function (f) {
                cleverapps.travelBook.gotoMainScene(f);
            }
        });
    },

    prepareBundles: function () {
        this.bundles = this.listBundles().concat(this.listBaseBundles());
        this.bundles = cleverapps.unique(this.bundles.filter(function (name) {
            return name && bundles[name];
        }));
    },

    load: function (f) {
        var callback = cleverapps.wait(2, f);

        if (this.level) {
            this.level.load(callback);
        } else {
            callback();
        }

        var toLoad = cleverapps.substract(this.bundles, this.prevSceneBundles);

        cleverapps.bundleLoader.loadBundles(toLoad, {
            onSuccess: callback,
            onFailure: function () {
                var options = {
                    focus: "loadSceneBundlesFailure",
                    action: function () {
                        new RestartWindow();
                    }
                };

                if (cleverapps.meta.isFocused()) {
                    cleverapps.meta.distract(options);
                } else {
                    cleverapps.meta.display(options);
                }
            }
        });
    },

    setLoadingFinished: function () {
        this.isAllLoaded = true;

        if (cleverapps.bannerAd) {
            cleverapps.bannerAd.check(true);
        }
    },

    unload: function (nextScene) {
        if (this.level) {
            this.level.unload();
        }

        nextScene.prevSceneBundles = this.bundles;

        var toDelete = cleverapps.substract(this.bundles, nextScene.bundles);

        cleverapps.bundleLoader.deleteBundles(toDelete);
        cleverapps.bundleLoader.clearUnusedResources();
        cc.pool.drainAllPools();
    },

    canTransitionFast: function () {
        if (cc.game.isPaused()) {
            return true;
        }

        if (!this.bundles) {
            return false;
        }

        if (cleverapps.bundleLoader.isLoaded(this.bundles)) {
            return true;
        }

        if (cc.sys.isNative && this.bundles.every(function (name) {
            return !bundles[name].external;
        })) {
            return true;
        }

        return false;
    },

    onSceneLoaded: function (sceneName) {
        cleverapps.environment.setScene(sceneName);

        this.avoidNodes = {};
        this.dynamicNodes = {};
        this.introScale = this.getBgIntroScale();

        this.setContentSize(cleverapps.UI.getSceneSize());
        this.setPositionRound(0, cleverapps.UI.getBgOffset());

        this.movingNode = new cc.Node();
        this.movingNode.setLocalZOrder(BaseWindow.WINDOWS_ZORDER + 3);
        this.addChild(this.movingNode);

        var shadow = new ShadowView();
        this.addChild(shadow, BaseWindow.WINDOWS_ZORDER - 3);
        shadow.loading.replaceParentSamePlace(this, { keepScale: true });
        shadow.updatePosition();

        this.backgroundStyles = this.getBackgroundStyles();
        this.setBackground();

        this.addTreasureBag();

        this.addMenuContainer();
        this.addControlButtons();
        this.addSideBar();
        this.addToolbar();
        this.addDebugToolsBar();

        cleverapps.windows.reset();

        var styles = this.getAudioStyles();

        if (cleverapps.config.source !== "playable") {
            this.startOrRestartMusic(styles);
        }

        if (cleverapps.flyingAd) {
            cleverapps.flyingAd.reset();
        }

        if (cleverapps.restoreProgress.isAvailable()) {
            var restoreProgress = new RestoreProgressButton();
            this.addChild(restoreProgress);
        }

        cc.director.setClearColor(cleverapps.styles.FixedWidthScene.clearColor || cc.color.BLACK);
        this.debugId = "Scene";

        this.scheduleUpdateWithPriority(1);

        cleverapps.scenes.onAvoidNodeVisibilityChanged = this.createListener(function () {
            this.updateDynamicNodes();
        });
    },

    startOrRestartMusic: function (styles) {
        this.runAction(new cc.Sequence(
            new cc.DelayTime(styles.delay || 0),
            new cc.CallFunc(function () {
                cleverapps.audio.insertDisk(styles.res);
                cleverapps.audio.fadeIn(styles.fadeIn || 0);
            })
        ));
    },

    getAudioStyles: function () {
        return cleverapps.styles.FixedWidthScene.sound;
    },

    getBgIntroScale: function () {
        return 1;
    },

    introControls: function () {

    },

    playIntro: function (f) {
        f();
    },

    addMenuContainer: function () {
        if (this.upMenuContainer) {
            this.upMenuContainer.removeFromParent();
            delete this.upMenuContainer;
        }

        this.upMenuContainer = new UpMenuContainer();
        this.addChild(this.upMenuContainer);
    },

    addControlButtons: function () {
        if (this.controlButtons) {
            this.controlButtons.removeFromParent();
            delete this.controlButtons;
        }

        var controlButtons = new SceneControlButtonsView();
        if (SceneControlButtonsView.isOutsideMenu()) {
            this.upMenuContainer.removeControlButtons();

            this.addChild(controlButtons);
            controlButtons.updateSize();
            controlButtons.updatePosition();
        } else {
            this.upMenuContainer.addControlButtons(controlButtons);
            controlButtons.updatePosition();
        }

        this.controlButtons = new HidingNode(controlButtons, cleverapps.UI.VERTICAL);
        cleverapps.meta.registerControl("SceneControlButtonsView", controlButtons);
    },

    addSideBar: function () {
        if (this.sideBar) {
            this.sideBar.removeFromParent();
            delete this.sideBar;
        }
        var sideBarView = this.sideBar = new SideBarView();
        this.addChild(sideBarView);
    },

    addToolbar: function () {
        if (cleverapps.environment.isMainScene() && !cleverapps.gameModes.noControls) {
            var toolbarView = new ToolbarView();
            toolbarView.setLocalZOrder(1);
            this.addChild(toolbarView);

            this.downToolBarControl = new HidingNode(toolbarView, cleverapps.UI.VERTICAL);
            cleverapps.meta.registerControl("toolbar", toolbarView);
        }
    },

    addTreasureBag: function () {
        if (this.treasureBag) {
            this.treasureBag.removeFromParent();
            this.treasureBag = undefined;
        }

        this.treasureBag = new TreasureBagIcon();
        this.treasureBag.setLocalZOrder(TreasureBagIcon.ZORDER);
        this.addChild(this.treasureBag);

        this.treasureBag.updatePosition();
        this.treasureBag.hide(true);

        cleverapps.treasureBag.hide();
    },

    addDebugToolsBar: function () {
        if (!cleverapps.config.debugMode || cleverapps.config.wysiwygMode || !cleverapps.environment.isGameScene() && !cleverapps.environment.isMainScene()) {
            return;
        }

        var styles = cleverapps.styles.FixedWidthScene;

        this.snapshotBar = new SnapshotBarView();
        this.snapshotBar.setLocalZOrder(1000);
        this.snapshotBar.setPositionRound(styles.snapshotBar);
        this.addChild(this.snapshotBar);

        this.gitButtons = new GitButtonsView({
            hiddenByDefault: true
        });
        this.gitButtons.setLocalZOrder(1000);
        this.gitButtons.setPositionRound(styles.gitButtons);
        this.addChild(this.gitButtons);
    },

    getBackgroundStyles: function () {
        return cleverapps.skins.getSlot("sceneBg") || cleverapps.styles.FixedWidthScene.background;
    },

    setBackground: function () {
        var options = this.backgroundStyles;

        if (!options || cleverapps.gameModes.noBg) {
            return;
        }

        if (options.patternId) {
            var winSize = cleverapps.UI.getSceneSize();
            winSize.height += 2;

            this.background = new cc.Node();
            this.background.setAnchorPoint(0.5, 0.5);
            this.background.setContentSize(winSize);

            var pattern = cleverapps.UI.createPatternSprite(bundles[options.bundle].urls[options.patternId], winSize);
            this.background.addChild(pattern);
        } else if (options.horizontalPattern) {
            var layoutWidth = 0;
            var layoutItems = [];

            do {
                var bgSprite = new cc.Sprite(options.horizontalPattern);
                layoutItems.push(bgSprite);
                layoutWidth += bgSprite.width;
            } while (layoutWidth < this.width || layoutItems.length < 2);

            this.background = new cleverapps.Layout(layoutItems, {
                direction: cleverapps.UI.HORIZONTAL,
                margin: 0
            });
        } else if (options.scale9) {
            this.background = cleverapps.UI.createScale9Sprite(options.scale9, cleverapps.UI.Scale9Rect.TwoPixelXY);
        } else if (options.movableAnimation) {
            this.background = new cleverapps.Spine(options.movableAnimation);
            this.background.setAnimation(0, "animation", true);
        } else if (options.backgroundId) {
            this.background = new cc.Sprite(bundles[options.bundle].urls[options.backgroundId]);
        } else {
            return;
        }

        if (options.animation) {
            var animation = this.background.animation = new cleverapps.Spine(options.animation);
            animation.setAnimation(0, "animation", true);
            if (options.skin) {
                animation.setSkin(options.skin);
            }
            this.background.addChild(animation);
        }

        this.background.transitionBundles = cleverapps.toArray(options.bundle);

        this.updateBackgroundScale();
        this.updateBackgroundPosition();

        this.background.setScale(this.background.baseScale / this.introScale);

        this.background.setLocalZOrder(-10);
        this.addChild(this.background);
    },

    completeAnimationOnResize: function () {
        if (this.background) {
            this.updateBackgroundScale();
        }
        this.removeFilmEffect();
    },

    updateSize: function () {
        this.setContentSize(cleverapps.UI.getSceneSize());
        this.updateBackgroundScale();
    },

    updatePosition: function () {
        var styles = cleverapps.styles.FixedWidthScene;

        this.setPositionRound(0, cleverapps.UI.getBgOffset());
        this.updateBackgroundPosition();

        if (this.snapshotBar) {
            this.snapshotBar.setPositionRound(styles.snapshotBar);
        }

        if (this.gitButtons) {
            this.gitButtons.setPositionRound(styles.gitButtons);
        }
    },

    updateBackgroundPosition: function () {
        if (this.background && !(this.backgroundStyles && this.backgroundStyles.movableAnimation)) {
            var bgSize = cleverapps.UI.getBgSize();

            if (this.backgroundStyles && this.backgroundStyles.position) {
                this.background.setPositionRound(this.backgroundStyles.position);
                this.background.originalPosition = this.backgroundStyles.position;
            } else {
                this.background.setPositionRound(this.convertToNodeSpace(cc.p(bgSize.width / 2, bgSize.height / 2)));
            }
        }
    },

    updateBackgroundScale: function () {
        if (this.background && !(this.backgroundStyles && this.backgroundStyles.movableAnimation)) {
            var style = this.backgroundStyles;

            if (this.background instanceof cc.Scale9Sprite) {
                var size = cleverapps.UI.getSceneSize();
                size.width = size.width * this.introScale / this.scale + 2;
                size.height = size.height * this.introScale / this.scale + 2;
                this.background.setContentSize2(size.width, size.height);
            } else if (typeof style.scale === "number") {
                this.background.setScale(style.scale);
            } else {
                var backgroundSize = style.size || this.background.getContentSize();
                var scale = Math.max(
                    this.width / backgroundSize.width * this.introScale / this.scale,
                    cleverapps.UI.getBgSize().height / backgroundSize.height * this.introScale / this.scale
                );
                this.background.setScale(scale);
                if (cleverapps.platform.oneOf(Instant)) {
                    var realSizeHeight = backgroundSize.height / this.introScale * scale;
                    if (realSizeHeight > this.height) {
                        this.background.y = this.height / 2 + (realSizeHeight - this.height) / 3;
                    }
                }
                this.background.stopAllActions();
            }

            if (this.background.animation) {
                this.background.animation.setPositionRound(this.background.width / 2, this.background.height / 2);
            }

            this.background.baseScale = this.background.scale;
        }
    },

    onTransitionAnimationDidStart: function () {
        cleverapps.audio.fadeOut(0.1);
    },

    createTransition: function () {
        if (!this.background || !this.background.transitionBundles) {
            return;
        }

        var transition = this.background;
        this.background = undefined;

        transition.replaceParentSamePlace(this, {
            keepScale: true
        });
        transition.setLocalZOrder(1000);
        return transition;
    },

    getPreferredBundles: function () {
        var bundles = this._super();
        bundles = cleverapps.substract(bundles, ["dev_resources"]);
        return bundles;
    },

    addDynamicNode: function (node) {
        if (!this.dynamicNodes[node.__instanceId]) {
            this.dynamicNodes[node.__instanceId] = node;
        }
    },

    removeDynamicNode: function (node) {
        if (this.dynamicNodes[node.__instanceId]) {
            delete this.dynamicNodes[node.__instanceId];
        }
    },

    addAvoidNode: function (node) {
        if (!this.avoidNodes[node.__instanceId]) {
            this.avoidNodes[node.__instanceId] = node;
            this.updateDynamicNodes();
        }
    },

    removeAvoidNode: function (node) {
        if (this.avoidNodes[node.__instanceId]) {
            delete this.avoidNodes[node.__instanceId];
            this.updateDynamicNodes();
        }
    },

    updateDynamicNodes: function (silent) {
        this.dynamicNodesDirty = true;
        this.dynamicNodesSilent = silent;
    },

    getAvoidNodes: function (types) {
        types = cleverapps.createSet(types);

        return cleverapps.values(this.avoidNodes).filter(function (node) {
            return types[node.avoidNode];
        });
    },

    update: function () {
        if (this.dynamicNodesDirty) {
            this.dynamicNodesDirty = false;

            var silent = this.dynamicNodesSilent;
            this.dynamicNodesSilent = false;

            cleverapps.values(this.dynamicNodes).forEach(function (node) {
                node.updateDynamicPosition(silent);
            });
        }
    },

    createFilmEffect: function (options) {
        this.removeFilmEffect();

        this.filmEffect = new SceneFilmEffect(options);
        this.addChild(this.filmEffect);
    },

    removeFilmEffect: function (timeout, callback) {
        if (!this.filmEffect) {
            callback && callback();
            return;
        }

        this.filmEffect.hideAnimation(timeout, function () {
            delete this.filmEffect;
            callback && callback();
        }.bind(this));
    }
});

cleverapps.styles.FixedWidthScene = {
    sound: {
        res: bundles.main.urls.background_music_map,
        delay: 0.5
    },

    snapshotBar: {
        x: { align: "right" },
        y: { align: "bottom" }
    },

    gitButtons: {
        x: { align: "right", dx: -4 },
        y: { align: "bottom", dy: 90 }
    }
};
