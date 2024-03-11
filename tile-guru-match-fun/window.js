/**
 * Created by slava on 24.03.17.
 */

var Window = BaseWindow.extend({
    onWindowLoaded: function (options) {
        options = options || {};

        this.onWindowLoadedOptions = options;
        this.showSound = options.showSound;
        this.contentPadding = options.contentPadding;

        var styles = cleverapps.styles.Window;
        if (options.styles) {
            styles = cleverapps.overrideStyles(styles, options.styles, true);
        }
        this.styles = styles;

        this.name = options.name || options.title || "window";

        this.content = options.content;
        if (this.content) {
            this.withBg = !options.noBackground && !styles.noBackground;

            this.buttons = this.createWindowButtons(options);

            if (options.shareId && Share.isAvailable()) {
                this.shareCheckBox = new ShareCheckBox(options.shareId, this);
            }

            if (options.closeButton !== false && styles.closeButton !== false) {
                this.closeButton = this.createCloseButton();
            }

            if (options.loginOrInvite) {
                this.loginOrInvite = cleverapps.FBLoginOrInvite();
            }

            if (this.withBg) {
                this.createWindowWithBg(options);
            } else {
                this.createWindowWithoutBg();
            }

            this.debugId = this.name;

            this.windowSize = this.window.getContentSize();

            if (options.title) {
                this.windowTitle = new WindowTitle(this, options.title, styles.HelpButton.lovesTitle && options.help);
                this.window.addChild(this.windowTitle);
            }

            if (options.help && !styles.HelpButton.lovesTitle) {
                this.helpButton = this.createHelpButton(options.help);
                this.window.addChild(this.helpButton);
            }

            if (options.homeButton) {
                this.homeButton = this.createHomeButton();
                this.addChild(this.homeButton);
            }

            if (this.closeButton instanceof BandButton) {
                this.addChild(this.closeButton);
            } else if (this.closeButton instanceof CloseButton) {
                this.window.addChild(this.closeButton);
            }

            var decorStyles = cleverapps.skins.getSlot("windowDecors", {
                decors: styles.decors,
                window: this,
                level: options.level
            });
            if (decorStyles) {
                this.decors = new Decors(this, decorStyles);
            }

            this.adjustWindow();
        }

        if (options.closeButton !== false || options.closeByBackButton) {
            this.closeByBackButton = this.createListener(function () {
                if (cleverapps.meta.checkEventNode(this)) {
                    this.close();
                }
            }.bind(this));
        }

        if (options.fireworks) {
            this.fireworks = new Fireworks(this.window, options.fireworks);
            this.fireworks.setPositionRound(this.width / 2, this.height / 2);
            this.fireworks.setLocalZOrder(options.fireworks.zOrder || 0);
            this.addChild(this.fireworks);
        }

        var person = this.getPerson && this.getPerson();
        if (person) {
            this.persons = new WindowPersons(person, this);
        }

        this.closeAnimationCallbacks = [];
        this.customize();

        cleverapps.audio.playSound(options.openSound || bundles.main.urls.window_effect);
    },

    createWindowButtons: function (options) {
        var items = [];

        if (options.button) {
            options.button.onClicked = options.button.onPressed || this.close.bind(this);
            items.push(new BottomButton(options.button));
        }

        if (options.buttons) {
            items = items.concat(options.buttons);
        }

        if (items.length) {
            return new Buttons(items);
        }
    },

    createWindowWithoutBg: function () {
        var tapToContinueItems = [];

        if (this.buttons) {
            tapToContinueItems.push(this.buttons);
        }

        if (this.closeButton instanceof TapToContinue) {
            tapToContinueItems.push(this.closeButton);
        }

        if (tapToContinueItems.length) {
            this.tapToContinue = new cleverapps.Layout(tapToContinueItems, {
                direction: cleverapps.UI.VERTICAL,
                margin: this.styles.Footer.margin
            });
            this.tapToContinue.setLocalZOrder(2);
            this.addChild(this.tapToContinue);
        }

        this.window = new cleverapps.Layout([this.content], {
            direction: cleverapps.UI.VERTICAL
        });
        this.window.setLocalZOrder(1);

        this.wrapper = cleverapps.UI.wrapWithPadding(this.window);
        this.wrapper.setLocalZOrder(1);
        this.addChild(this.wrapper);

        var footerItems = [];

        if (this.shareCheckBox) {
            this.shareCheckBox.setOpacity(180);
            footerItems.push(this.shareCheckBox);
        }

        if (this.loginOrInvite) {
            footerItems.push(this.loginOrInvite);
        }

        if (footerItems.length) {
            this.windowFooter = new cleverapps.Layout(footerItems, {
                direction: cleverapps.UI.VERTICAL,
                margin: this.styles.Footer.margin
            });
            this.windowFooter.setPositionRound(this.styles.Footer);
            this.windowFooter.setLocalZOrder(2);
            this.addChild(this.windowFooter);
        }
    },

    createWindowWithBg: function (options) {
        var windowItems = [this.content, this.shareCheckBox, this.buttons].filter(Boolean);

        this.window = new cleverapps.Layout(windowItems, {
            margin: this.styles.margin,
            direction: cleverapps.UI.VERTICAL,
            padding: !options.noPadding && this.styles.padding
        });
        this.window.setLocalZOrder(1);

        var minWidth = options.minWidth !== undefined ? options.minWidth : cleverapps.styles.Window.minWidth;
        var minHeight = options.minHeight !== undefined ? options.minHeight : cleverapps.styles.Window.minHeight;

        var diffX = minWidth - this.window.width;
        var diffY = minHeight - this.window.height;
        if (diffX > 0 || diffY > 0) {
            cleverapps.UI.wrapWithPadding(this.window, {
                x: diffX > 0 && diffX,
                y: diffY > 0 && diffY
            }, true);
        }

        this.bg = this.createBackground(options);
        this.window.addChild(this.bg);
        this.bg.setLocalZOrder(-1000);
        this.bg.setPositionRound(this.window.width / 2, this.window.height / 2);

        this.wrapper = cleverapps.UI.wrapWithPadding(this.window);
        this.wrapper.setLocalZOrder(1);
        this.addChild(this.wrapper);

        if (options.foreground) {
            this.foreground = this.createForeground(options.foreground);
            this.window.addChild(this.foreground);
        }

        if (this.loginOrInvite) {
            this.windowFooter = this.loginOrInvite;
            this.windowFooter.setPositionRound(this.styles.Footer);
            this.windowFooter.setLocalZOrder(2);
            this.addChild(this.windowFooter);
        }
    },

    adjustWrapper: function () {
        var windowBox = this.window.getGlobalBoundingBox();

        var nodes = [
            this.windowTitle && !this.windowTitle.fixedScenePosition ? this.windowTitle : undefined,
            this.tabs && this.tabs.isVisible() ? this.tabs : undefined
        ].filter(Boolean);

        var unionBox = nodes.reduce(function (sum, node) {
            return cc.rectUnion(sum, node.getGlobalBoundingBox());
        }, windowBox);

        this.wrapper.setContentSize2(unionBox.width, unionBox.height);
        this.window.setPositionRound(
            this.window.width / 2 + windowBox.x - unionBox.x,
            this.window.height / 2 + windowBox.y - unionBox.y
        );
    },

    adjustTapToContinue: function (options) {
        if (!this.tapToContinue) {
            return;
        }

        var footerBox = this.windowFooter ? this.windowFooter.getBoundingBox() : undefined;
        var footerTop = footerBox ? footerBox.y + footerBox.height : 0;

        this.tapToContinue.setScale(1);
        this.tapToContinue.setPositionRound(this.wrapper.x, footerTop + this.tapToContinue.height / 2);

        if (options && options.inflate) {
            var wrapperBottom = this.wrapper.getBoundingBox().y;
            var padding = this.getContentPadding();
            cleverapps.UI.inflateToBoundaries(this.tapToContinue, this.getOverlappingNodes().concat(this.wrapper), {
                padding: cc.padding(0, padding.right, 0, padding.left),
                viewRect: this.tapToContinue.getGlobalBoundingBox(),
                maxScale: this.wrapper.getScale(),
                lovesPosition: this.convertToWorldSpace(cc.p(this.wrapper.x, footerTop + (wrapperBottom - footerTop) * 3 / 5))
            });
        }
    },

    adjustWindow: function () {
        if (!this.windowSize) {
            return;
        }

        var options = this.onWindowLoadedOptions || {};

        this.windowScale = 1;
        this.wrapper.setScale(1);
        this.wrapper.setPositionRound(this.width / 2, this.height / 2);

        if (this.windowTitle) {
            this.windowTitle.adjustPosition();
        }

        this.adjustWrapper();
        this.adjustTapToContinue();
        this.closeButton && this.closeButton.updatePosition && this.closeButton.updatePosition();

        if (!options.noScaleAdjustment) {
            cleverapps.UI.inflateToBoundaries(this.wrapper, this.getOverlappingNodes(), {
                padding: this.getContentPadding(),
                viewRect: this.wrapper.getGlobalBoundingBox(),
                lovesPosition: this.convertToWorldSpace(cc.p(this.width / 2, this.height / 2))
            });
        }

        if (this.windowTitle) {
            this.windowTitle.adjustPosition();
        }
        
        this.adjustTapToContinue({ inflate: true });

        this.windowScale = this.wrapper.getScale();
        this.wrapper.basePosition = this.wrapper.getPosition();
    },

    getOverlappingNodes: function () {
        var scene = cleverapps.scenes.getRunningScene();
        var options = this.onWindowLoadedOptions || {};
        var withCloseButton = this.closeButton instanceof BandButton && !options.canOverlapCloseButton;

        var withMenubar = cleverapps.meta.isControlEnabled([
            "MenuBarGoldItem", "MenuBarGameLevelItem", "MenuBarLivesItem",
            "MenuBarCoinsItem", "MenuBarWandsItem", "MenuBarWorkersItem"]);

        return [
            withMenubar ? scene.upMenuContainer : undefined,
            this.windowTitle && this.windowTitle.fixedScenePosition && this.windowTitle.isVisible() ? this.windowTitle : undefined,
            this.goldInfo,
            this.bottomLine,
            this.windowFooter,
            withCloseButton ? this.closeButton : undefined
        ].filter(Boolean);
    },

    getContentPadding: function () {
        var sceneSize = cleverapps.UI.getSceneSize();

        var padding = this.contentPadding;

        if (padding === cleverapps.UI.DOCK_RIGHT) {
            padding = { left: sceneSize.width / 2 };
        } else if (padding === cleverapps.UI.DOCK_LEFT) {
            padding = { right: sceneSize.width / 2 };
        }

        return cc.paddingAddPadding(cc.padding(padding), this.getBackgroundPadding());
    },

    getBackgroundPadding: function () {
        var styles = this.styles || cleverapps.styles.Window;
        var vertical = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL && cleverapps.config.type !== "merge";

        var padding = cc.padding(styles.Background.padding);
        if (vertical && styles.Background.vertical) {
            padding = cc.padding(padding, styles.Background.vertical.padding);
        }

        return padding;
    },

    updateSize: function () {
        this._super();

        this.adjustWindow(this.onWindowLoadedOptions);

        if (this.decors) {
            this.decors.updateAll();
        }

        if (this.fireworks) {
            this.fireworks.setPositionRound(this.width / 2, this.height / 2);
        }
    },

    updatePosition: function () {
        this._super();

        if (this.windowFooter) {
            this.windowFooter.setPositionRound(this.styles.Footer);
        }

        if (this.persons) {
            this.persons.update();
        }
    },

    createCloseButton: function () {
        var ConstructorClass = BandButton;
        var options = {
            onClicked: this.close.bind(this),
            styles: this.styles.CloseButton
        };

        if (this.withBg && !this.onWindowLoadedOptions.bandButton) {
            ConstructorClass = CloseButton;
        }

        if (!this.withBg && this.onWindowLoadedOptions.tapToContinue) {
            ConstructorClass = TapToContinue;
            options = {
                text: this.onWindowLoadedOptions.tapToContinue
            };
        }

        return new ConstructorClass(options);
    },

    createHelpButton: function (callback) {
        var helpButtonStyles = this.styles.HelpButton;
        var helpButton = new cleverapps.UI.HelpButton(callback, { window: true });
        helpButton.setPositionRound(helpButtonStyles);
        helpButton.setLocalZOrder(helpButtonStyles.zOrder);
        return helpButton;
    },

    createHomeButton: function () {
        var homeButton = new cleverapps.UI.Button({
            type: {
                button_png: bundles.controlbuttons.frames.back_button_png,
                button_on_png: bundles.controlbuttons.frames.back_button_on_png
            },
            onClicked: function () {
                if (this.boatswain) {
                    this.boatswain.setIntent(Boatswain.RETURN_INTENT);
                }

                this.close();
            }.bind(this),
            content: new cc.Sprite(bundles.buttons_main.frames.home_icon)
        });
        homeButton.avoidNode = "HomeButton";
        homeButton.updatePosition = function () {
            homeButton.setPositionRound(this.styles.HomeButton.position);
        }.bind(this);
        homeButton.updatePosition();
        return homeButton;
    },

    customize: function () {
    },

    onShow: function (closeButtonDelay) {
        if (this.shareCheckBox) {
            this.shareCheckBox.updateState();
        }

        if (this.fireworks) {
            this.fireworks.start();
        }

        if (this.persons) {
            this.persons.showUp();
        }

        var delay = closeButtonDelay || 0;

        if (this.onWindowLoadedOptions.closeButtonDelay === true) {
            delay = 1.5;
        }

        if (this.closeButton instanceof TapToContinue) {
            if (this.homeButton) {
                this.homeButton.stopAllActions();
                this.homeButton.setCascadeOpacityEnabledRecursively(true);
                this.homeButton.setVisible(false);
                this.homeButton.runAction(new cc.Sequence(
                    new cc.FadeTo(0, 0),
                    new cc.DelayTime(delay),
                    new cc.Show(),
                    new cc.FadeIn(0.4).easing(cc.easeOut(1.2))
                ));
            }

            this.tapToContinue.children.forEach(function (item) {
                item.stopAllActions();
                item.setVisible(true);
            });

            this.tapToContinue.setCascadeOpacityEnabledRecursively(true);
            this.tapToContinue.setVisible(false);
            this.tapToContinue.runAction(new cc.Sequence(
                new cc.FadeTo(0, 0),
                new cc.DelayTime(delay),
                new cc.Show(),
                new cc.CallFunc(function () {
                    cleverapps.audio.playSound(bundles.windows.urls.tap_to_continue_show_effect);
                }),
                new cc.FadeIn(0.4).easing(cc.easeOut(1.2)),
                new cc.CallFunc(function () {
                    this.enableTouchInShadow();
                }.bind(this))
            ));
        } else if (this.closeButton) {
            this.closeButton.hide(true);

            this.closeButton.runAction(new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.CallFunc(function () {
                    this.closeButton.show();
                    this.enableTouchInShadow();
                }.bind(this))
            ));
        }

        if (this.windowFooter) {
            this.windowFooter.setCascadeOpacityEnabledRecursively(true);
            this.windowFooter.setVisible(false);
            this.windowFooter.runAction(new cc.Sequence(
                new cc.FadeTo(0, 0),
                new cc.DelayTime(delay + 0.5),
                new cc.Show(),
                new cc.FadeIn(0.4).easing(cc.easeOut(1.2))
            ));
        }

        if (this.showSound) {
            cleverapps.audio.playSound(this.showSound);
        }
    },

    onHide: function () {
        if (this.fireworks) {
            this.fireworks.stop();
        }

        if (this.touchListener) {
            cc.eventManager.removeListener(this.touchListener);
            this.touchListener = undefined;
        }
    },

    createBackground: function (options) {
        var styles = this.styles.Background;

        var sprite = styles.image;

        var image = cleverapps.skins.getSlot("windowBg", {
            image: sprite,
            level: options.level
        });

        var bg = cleverapps.UI.createScale9Sprite(image, styles.scale9);

        bg.setContentSize2(this.window.getContentSize());
        if (styles.opacity) {
            bg.setOpacity(styles.opacity);
        }

        bg.setLocalZOrder(-1000);
        bg.setPositionRound(this.window.width / 2, this.window.height / 2);

        return bg;
    },

    createForeground: function (image) {
        this.foreground = cleverapps.UI.createScale9Sprite(image, cleverapps.UI.Scale9Rect.TwoPixelXY);
        if (cleverapps.config.debugMode) {
            this.foreground.isExcluded = true;
        }
        this.foreground.setAnchorPoint2(0, 0);
        this.foreground.setLocalZOrder(1);

        var rect = cc.rect(0, 0, this.window.width, this.window.height);
        rect = cc.rectSubPadding(rect, cc.padding(this.styles.Foreground && this.styles.Foreground.padding));

        this.foreground.setPositionRound(rect.x, rect.y);
        this.foreground.setContentSize2(rect.width, rect.height);

        return this.foreground;
    },

    onTouchInShadow: function () {
        if (!this.onWindowLoadedOptions.notCloseByTouchInShadow) {
            cleverapps.audio.playSound(bundles.main.urls.click_effect);
            this.close();
        }
    },

    setTitle: function (title, toReplace) {
        if (this.windowTitle) {
            this.windowTitle.setTitle(title, toReplace);
        }
    },

    getMinimalDialogueRects: function () {
        var styles = cleverapps.styles.Window;
        var rects = [
            cc.rectSubPadding(this.window.getGlobalBoundingBox(), cc.padding(styles.BoundingBoxPadding))
        ];
        if (this.windowTitle) {
            rects.push(cc.rectSubPadding(this.windowTitle.getGlobalBoundingBox(), cc.padding(styles.BoundingBoxPadding.Title)));
        }
        return rects;
    },

    enableTouchInShadow: function () {
        cleverapps.UI.onClick(this, function (touch) {
            if (this.window && !(this.closeButton instanceof TapToContinue)) {
                var size = this.window.getContentSize();
                var rect = cc.rect(0, 0, size.width, size.height);

                if (cc.rectContainsPoint(rect, this.window.convertToNodeSpace(touch.getLocation()))
                    || cc.rectContainsPoint(rect, this.window.convertToNodeSpace(touch.getStartLocation()))) {
                    return;
                }
            }

            this.onTouchInShadow();
        }.bind(this), {
            ignoreScale: true
        });
    }
});

Window.prototype.onPopUpAnimationFinished = function () {
};

Window.prototype.popUpAnimation = function () {
    var animation = this.chooseAnimation();
    if (animation) {
        if (this.window) {
            this.window.stopAllActions();
        }
        animation.open.call(this, this.onPopUpAnimationFinished.bind(this));
    } else {
        this.onPopUpAnimationFinished();
    }
};

Window.prototype.stop = function () {
    BaseWindow.prototype.stop.apply(this);

    if (this.window) {
        this.window.stopAllActions();
    }
};

Window.prototype.closeAnimation = function (callback) {
    cleverapps.audio.playSound(bundles.main.urls.close_window_effect || bundles.main.urls.window_effect);

    var animation = this.chooseAnimation();

    if (!animation || (cleverapps.windows.list.length > 1 && !this.styles.windowShowUpAnimation.force)) {
        callback();
    } else {
        animation.close.call(this, callback);
    }
};

Window.prototype.chooseAnimation = function () {
    var styles = this.styles || cleverapps.styles.Window;
    if (styles.windowShowUpAnimation && (this.window || this instanceof ForceView)) {
        if (!this.bg && !styles.windowShowUpAnimation.force) {
            return WINDOW_ANIMATIONS.default;
        }
        return WINDOW_ANIMATIONS[styles.windowShowUpAnimation.name];
    }
};

Window.prototype.closeDuration = function () {
    var styles = this.styles || cleverapps.styles.Window;
    return styles.closeAnimation.duration;
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CLOSE_TEXT: {
        size: 46,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    WINDOW_TITLE_TEXT: {
        size: 70,
        color: cleverapps.styles.COLORS.COLOR_BROWN
    }
});

cleverapps.styles.Window = {
    shadow: true,
    margin: 30,
    padding: {
        x: 85,
        top: 160,
        bottom: 50
    },

    HelpButton: {
        zOrder: 1,
        x: { align: "left", dx: 70 },
        y: { align: "top", dy: -45 }
    },
    BottomButton: {
        width: 200,
        height: 90
    },
    HomeButton: {
        position: {
            x: { align: "right", dx: -40 },
            y: { align: "top", dy: -15 }
        }
    },

    minHeight: 200,
    minWidth: 240,

    windowShowUpAnimation: {
        name: "default",
        force: false
    },

    Background: {
        image: bundles.windows.frames.window_bg_png,
        scale9: cleverapps.UI.Scale9Rect.TwoPixelXY,
        padding: {
            x: 15,
            y: 70
        }
    },

    closeAnimation: {
        duration: 200
    },

    Footer: {
        x: { align: "center" },
        y: { align: "bottom", dy: 60 },

        margin: 20
    },

    BoundingBoxPadding: {
        x: 30,
        y: 30,
        Title: {
            x: 30,
            y: 30
        }
    }
};
