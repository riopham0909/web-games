/**
 * Created by slava on 4/12/17
 */

var ResolutionManager = function () {
    this.frameWidth = window.innerWidth;
    this.frameHeight = window.innerHeight;

    this.isRotated = false;
    this.shown = false;
    this.containerPadding = cc.padding();
    this.safePadding = cc.padding();
    this.bottomBgPadding = 0;
    this.mode = cleverapps.WideMode.VERTICAL;

    cc.view.adjustViewPort(true);
    cc.view._devicePixelRatio = Math.min(2, window.devicePixelRatio || 1);

    var counter = 0;
    var timeoutHandler = undefined;
    var timeouts = [50, 100, 200, 300, 500, 1000, 2000, 4000];

    var checkResize = cleverapps.accumulate(cleverapps.platform.oneOf(VKPlatform) ? ResolutionManager.RESIZE_THROTTLE_VK : ResolutionManager.RESIZE_THROTTLE, function () {
        var size = this.getFrameSize();
        if (size.width !== this.frameWidth || size.height !== this.frameHeight) {
            if (cleverapps.config.wysiwygMode) {
                console.log("ignore resolution update (controlled by wysiwyg)");
            } else {
                console.log("update resolution - " + JSON.stringify(size));
                this.setupDesignResolution();
            }
        }
    }.bind(this));

    var scheduleCheck = function () {
        if (counter === timeouts.length) {
            timeoutHandler = undefined;
            return;
        }

        if (timeoutHandler) {
            cleverapps.timeouts.clearTimeout(timeoutHandler);
        }

        timeoutHandler = cleverapps.timeouts.setTimeout(function () {
            checkResize();

            counter++;
            scheduleCheck();
        }, timeouts[counter]);
    };

    var resizeHandler = function () {
        checkResize();

        counter = 0;
        scheduleCheck();
    };

    if (cleverapps.platform instanceof Wechat) {
        var style = document.createElement("style");
        style.innerHTML = ".rotate-container {\n"
            + "    transform: rotate(-90deg);\n"
            + "    -webkit-transform: rotate(-90deg);\n"
            + "    transform-origin: 0px 0px 0px;\n"
            + "    -webkit-transform-origin: 0px 0px 0px;\n"
            + "}";
        document.head.appendChild(style);
    }

    window.addEventListener("resize", resizeHandler, false);
    window.addEventListener("orientationchange", resizeHandler, false);

    if (cleverapps.platform.oneOf(Wechat)) {
        wx.onDeviceOrientationChange(resizeHandler);

        wx.onWindowResize(resizeHandler);
    }
};

ResolutionManager.prototype.showCanvas = function () {
    if (this.shown) {
        return;
    }
    this.shown = true;

    if (window.wechatFirstScreen) {
        window.wechatFirstScreen.end();
        delete window.wechatFirstScreen;

        var scene = cc.director.getRunningScene();
        if (scene) {
            scene._canvas.active = true;
        }
    }

    if (cc.container) {
        var gameContainer = cc.container;
        gameContainer.style.display = "block";
    }

    var gameCanvas = cc.game.canvas;
    gameCanvas.style.display = "block";
    gameCanvas.style.left = null;
    gameCanvas.style.top = null;

    var cocosLoading = document.getElementById("cocosLoading");
    if (cocosLoading) {
        document.body.removeChild(cocosLoading);
    }

    this.setupDesignResolution();
};

ResolutionManager.prototype.isInitialized = function () {
    return this.resolutionName !== undefined;
};

ResolutionManager.prototype.setupResolutionScale = function () {
    if (!this.resolutionName || !resolutions[this.resolutionName]) {
        this.resolutionName = this._calcResolution();
    }

    resolutionScale = resolutions[this.resolutionName].scale;

    cleverapps.UI.updateSizes(resolutionScale);

    cleverapps.UI.selectSkinResources(this.resolutionName);

    cleverapps.skins && cleverapps.skins.prepareBundlesSkins();

    cleverapps.home && cleverapps.home.setupResolution();
    cleverapps.farm && cleverapps.farm.setupResolution();

    this.setupDesignResolution();
};

ResolutionManager.prototype.setBottomBgPadding = function (padding) {
    this.bottomBgPadding = padding || 0;

    if (cleverapps.config.wysiwygMode && this.bottomBgPadding > 0) {
        return;
    }

    this.setupDesignResolution();
};

ResolutionManager.prototype.setContainerPadding = function (padding) {
    padding = padding || {};
    this.containerPadding = cc.padding(padding);
    this.setupDesignResolution();
};

ResolutionManager.prototype.setSafePadding = function (padding) {
    this.safePadding = cc.padding(padding);
    this.setupDesignResolution();
};

ResolutionManager.prototype.getSafePadding = function () {
    return this.safePadding;
};

ResolutionManager.prototype.getFrameSize = function () {
    if (cleverapps.platform.oneOf(Wechat)) {
        return cc.view.getFrameSize();
    }
    return this.isRotated ? cc.size(window.innerHeight, window.innerWidth) : cc.size(window.innerWidth, window.innerHeight);
};

ResolutionManager.prototype.isLandscapeOrientation = function () {
    return window.innerHeight < window.innerWidth;
};

ResolutionManager.prototype.resizeFont = function (font) {
    var coef = 1;
    if (this.mode === cleverapps.WideMode.VERTICAL) {
        coef = 25 / 40;
    } else if (this.mode === cleverapps.WideMode.SQUARE) {
        coef = 34 / 40;
    }

    return {
        name: font.name,
        size: coef * font.size,
        color: font.color,
        stroke: font.stroke
    };
};

ResolutionManager.prototype.setupDesignResolution = function (customFrameSize) {
    if (!(cleverapps.platform instanceof Wechat)) {
        if (this._needRotate()) {
            cc.container.classList.add("rotate-container");
            this.isRotated = true;
        } else {
            cc.container.classList.remove("rotate-container");
            this.isRotated = false;
        }
    }

    var frameSize = customFrameSize || this.getFrameSize();
    this.frameWidth = Math.max(frameSize.width, cleverapps.MIN_FRAME_SIZE);
    this.frameHeight = Math.max(frameSize.height, cleverapps.MIN_FRAME_SIZE);

    // OK triggers resize after return to our frame with values width = 1 (invalid value), height = 700, it breaks everything below
    // fotostrana request window width 300 height 700
    if (Math.min(this.frameWidth, this.frameHeight) < cleverapps.SETUP_RESOLUTION_MIN_FRAME_SIZE) {
        this.bgSize = this.bgSize || cc.size(this.frameWidth, this.frameHeight);
        this.sceneSize = this.sceneSize || cc.size(this.frameWidth, this.frameHeight);
        return;
    }

    var sceneSize = this._calculateSceneSize(customFrameSize !== undefined);
    this.sceneSize = sceneSize;

    this._updateEngine();

    this.mode = cleverapps.WideMode.VERTICAL;
    if (sceneSize.width > cleverapps.styles.SQUARE_MODE_WIDTH) {
        this.mode = cleverapps.WideMode.SQUARE;
    }
    if (sceneSize.width > cleverapps.styles.HORIZONTAL_MODE_WIDTH) {
        this.mode = cleverapps.WideMode.HORIZONTAL;
    }

    cleverapps.bannerAd && cleverapps.bannerAd.onResize();

    var scene = cleverapps.scenes.getRunningScene();
    if (scene) {
        scene.setContentSize2(sceneSize);

        var movedUpNodes = [PointerView.currentPointer, FingerView.currentFinger, cleverapps.forces && cleverapps.forces.getRunningForce(),
            Game.currentGame && Game.currentGame.tutorial].filter(Boolean);

        if (cleverapps.config.wysiwygMode) {
            movedUpNodes = [];
        }

        movedUpNodes.forEach(function (node) {
            if (!(node instanceof cc.Node) || node.isRunning && node.isRunning()) {
                node.beforeResize && node.beforeResize();
            }
        });

        if (scene.isAllLoaded || scene instanceof LoaderScene) {
            scene.updateSize();
            scene.updatePosition();
            scene.completeAnimationOnResize();
        }

        scene.children.forEach(function (child) {
            child.onChangeSize();
        });
        scene.children.forEach(function (child) {
            child.onChangePosition();
        });

        if (scene.scaleGameField) {
            scene.scaleGameField();
        }

        if (scene.updateDynamicNodes) {
            scene.updateDynamicNodes(true);
        }

        movedUpNodes.forEach(function (node) {
            if (!(node instanceof cc.Node) || node.isRunning && node.isRunning()) {
                node.afterResize && node.afterResize();
            }
        });
    }
};

ResolutionManager.prototype._calculateSceneSize = function (doNotLimit) {
    var padding = cc.padding(this.containerPadding);
    var containerRect = this.isRotated ? cc.rect(
        padding.top,
        padding.left,
        this.frameWidth - padding.top - padding.bottom,
        this.frameHeight - padding.left - padding.right
    ) : cc.rect(
        padding.left,
        padding.top,
        this.frameWidth - padding.left - padding.right,
        this.frameHeight - padding.top - padding.bottom
    );

    var devicePixelRatio = cc.view.getDevicePixelRatio();
    var c = containerRect.width / containerRect.height;

    var heightBgScale = containerRect.height / (containerRect.height - this.bottomBgPadding);
    var h = cleverapps.styles.SCENE_HEIGHT * heightBgScale;
    var w = h * c;

    if (w < cleverapps.styles.SCENE_MIN_WIDTH && !doNotLimit) {
        w = cleverapps.styles.SCENE_MIN_WIDTH;
        h = w / c;
    }

    if (w > cleverapps.styles.SCENE_MAX_WIDTH && !doNotLimit) {
        w = cleverapps.styles.SCENE_MAX_WIDTH;
    }

    cc.view._viewPortRect = cc.rect(0, 0, this.frameWidth * devicePixelRatio, this.frameHeight * devicePixelRatio);
    cc.view._visibleRect = cc.rect(0, 0, w, h);
    cc.winSize.width = cc.director._winSizeInPoints.width = w;
    cc.winSize.height = cc.director._winSizeInPoints.height = h;

    var scale = containerRect.height / h;
    cc.view._scaleX = cc.view._scaleY = devicePixelRatio * scale;

    var containerW = w * scale;
    var containerH = containerRect.height;

    if (cc.sys.isInApp && cleverapps.platform.oneOf(Instant)) {
        document.body.style.width = "100vw";
        document.body.style.height = "100vh";
    }

    var contStyle = cc.game.container.style;
    contStyle.width = cc.game.canvas.style.width = Math.round(containerW) + "px";
    contStyle.height = cc.game.canvas.style.height = containerH + "px";
    contStyle.left = Math.round(padding.left) + "px";
    contStyle.top = Math.round(padding.top + (this.isRotated ? containerRect.width : 0)) + "px";
    contStyle.padding = "0 " + Math.round((containerRect.width - containerW) / 2) + "px";

    cc.game.canvas.width = Math.round(containerW * devicePixelRatio);
    cc.game.canvas.height = containerH * devicePixelRatio;

    w = 2 * Math.round(w / 2);
    h = 2 * Math.round(h / 2);

    this.bgSize = cc.size(w, h);

    if (this.isRotated) {
        w /= heightBgScale;
        w = 2 * Math.round(w / 2);
    } else {
        h /= heightBgScale;
        h = 2 * Math.round(h / 2);
    }

    return cc.size(w, h);
};

ResolutionManager.prototype._needRotate = function () {
    var isOrientationMismatch = window.innerWidth > window.innerHeight && cleverapps.config.orientation !== "horizontal"
        || window.innerWidth < window.innerHeight && cleverapps.config.orientation === "horizontal";

    var frameSize = this.getFrameSize();
    var isTablet = Math.min(frameSize.width, frameSize.height) > Math.max(frameSize.width, frameSize.height) * 0.65;

    return cc.sys.isMobile && !cc.sys.isNative && !isTablet && isOrientationMismatch;
};

ResolutionManager.prototype._calcResolution = function () {
    var height = this.frameHeight;
    if (window.screen && window.screen.height) {
        height = Math.max(height, window.screen.height);
    }
    if (cleverapps.platform instanceof Mobage) {
        height = cleverapps.MobageSocial.HEIGHT;
    }
    var pixelSizeHeight = height * cc.view.getDevicePixelRatio();

    var names = Object.keys(resolutions);
    var webpNames = names.filter(function (name) {
        return resolutions[name].webp;
    });

    if (webpNames.length > 0) {
        if (cleverapps.config.webpSupport) {
            names = webpNames;
        } else if (webpNames.length < names.length) {
            names = cleverapps.substract(names, webpNames);
        }
    }

    names = names.sort(function (a, b) {
        return resolutions[a].scale - resolutions[b].scale;
    });

    var calcResValue = function (resolution) {
        var h = resolution.scale * cleverapps.styles.SCENE_HEIGHT;
        return h >= pixelSizeHeight ? (h - pixelSizeHeight) : ((pixelSizeHeight - h) * 100);
    };

    var bestId = 0;
    var bestDiff = calcResValue(resolutions[names[bestId]]);

    for (var i = 1; i < names.length; i++) {
        var diff = calcResValue(resolutions[names[i]]);

        if (diff < bestDiff) {
            bestDiff = diff;
            bestId = i;
        }
    }

    return names[bestId];
};

ResolutionManager.prototype._updateEngine = function () {
    if (engine === "creator") {
        creator.director.root.resize(cc.game.canvas.width, cc.game.canvas.height, 1);
        return;
    }

    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        // reset director's member variables to fit visible rect
        cc.director.setGLDefaultValues();
    } else if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
        cc.renderer._allNeedDraw = true;
    }
    cc.visibleRect && cc.visibleRect.init(cc.view._visibleRect);
    cc._renderContext.resetCache && cc._renderContext.resetCache();

    cc.view._initFrameSize();
    if (cc.sys.isMobile) {
        cc.view._adjustViewportMeta();
    }
};

if (engine === "cocos2d") {
    cc.EGLView.prototype.convertToLocationInView = function (tx, ty, relatedPos) {
        var x = this.getDevicePixelRatio() * (tx - relatedPos.left);
        var y = this.getDevicePixelRatio() * (relatedPos.top + relatedPos.height - ty);
        var padding = cleverapps.resolution ? cleverapps.resolution.containerPadding.left + cleverapps.resolution.containerPadding.right : 0;
        var sidePaddings = this.getDevicePixelRatio() * padding;

        return cleverapps.resolution && cleverapps.resolution.isRotated ? { x: y, y: this._viewPortRect.height - x - sidePaddings } : { x: x, y: y };
    };
}

cleverapps.WideMode = {
    VERTICAL: 0,
    SQUARE: 1,
    HORIZONTAL: 2
};

ResolutionManager.RESIZE_THROTTLE = 0;
ResolutionManager.RESIZE_THROTTLE_VK = 50;
