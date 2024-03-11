/**
 * Created by mac on 2019-08-25
 */

var BaseWindow = cc.Node.extend({
    listBundles: function () {
        return [];
    },

    ctor: function () {
        this._super();

        var args = arguments;

        cleverapps.scenes.getRunningScene().addChild(this);

        this.adjustBaseWindow();
        this.setLocalZOrder(BaseWindow.WINDOWS_ZORDER);

        cleverapps.windows.add(this);

        this.openTime = Date.now();

        this.bundles = this.listBundles.apply(this, arguments) || [];
        if (cleverapps.skins.getBundles()) {
            this.bundles = this.bundles.concat(cleverapps.skins.getBundles());
        }
        var personsBundles = this.getPersonBundles();
        if (personsBundles) {
            this.bundles = this.bundles.concat(personsBundles);
        }
        this.bundles.push("windows");
        this.bundles = cleverapps.unique(this.bundles);
        this.bundles = this.bundles.filter(function (name) {
            return bundles[name];
        });
        if (this.bundles.length === 0) {
            this.runWindow(args);
            return;
        }

        var start = Date.now();

        var onSuccess = this.createListener(function () {
            this.runWindow(args);

            cleverapps.ConsoleStream.sendLoadingTime("window " + this.name + " " + (Date.now() - start) + "ms");
        }.bind(this));

        var onFailure = this.createListener(function () {
            this.deleteSelf();

            new RestartWindow();
        }.bind(this));

        cleverapps.meta.clearUpdateTimeout();
        this.load(onSuccess, onFailure);
    },

    getPerson: function () {
        return undefined;
    },

    getPersonBundles: function () {
        var personBundles = [];
        var person = this.getPerson();
        if (person) {
            var left, right;

            if (person.left || person.right) {
                left = person.left;
                right = person.right;
            } else {
                left = person;
            }

            [left, right].filter(Boolean).forEach(function (personRole) {
                var personObject = PersonsLibrary.getPerson(personRole.role || personRole);
                if (personObject && personObject.bundle) {
                    personBundles.push(personObject.bundle);
                }
            });
        }

        return personBundles;
    },

    load: function (onSuccess, onFailure) {
        cleverapps.bundleLoader.loadBundles(this.bundles, { onSuccess: onSuccess, onFailure: onFailure });
    },

    onChangeSize: function () {
        if (this.initializedSuccess && !this.closed) {
            this._super();
        }
    },

    onChangePosition: function () {
        if (this.initializedSuccess && !this.closed) {
            this._super();
        }
    },

    updateSize: function () {
        this.adjustBaseWindow();
    },

    updatePosition: function () {

    },

    adjustBaseWindow: function () {
        var scene = cleverapps.scenes.getRunningScene();
        this.setScale(1 / scene.getScale());
        this.setContentSize(scene.width, scene.height);

        if (cleverapps.config.wysiwygMode) {
            this.setPositionRound(0, 0);
        } else {
            this.setPositionRound(scene.convertToNodeSpace(cc.p(0, cleverapps.UI.getBgOffset())));
        }
    },

    isCurrent: function () {
        return cleverapps.windows.currentWindow() === this;
    },

    runWindow: function (args) {
        this.adjustBaseWindow();

        this.onWindowLoaded.apply(this, args);

        this.initializedSuccess = true;

        this.displaySelf();
    },

    hideSelf: function () {
        if (cleverapps.windows.currentWindow() === this) {
            this.setVisible(false);

            if (this.styles.shadow) {
                cleverapps.windows.onHideShadow();
            }

            this.onHide();
        }
    },

    grabFocus: function () {
        cleverapps.meta.setEventNodes([this]);
    },

    displaySelf: function () {
        if (this.initializedSuccess && cleverapps.windows.currentWindow() === this) {
            this.adjustWindow();
            this.updatePosition();

            cleverapps.windows.onHideLoading();
            cleverapps.meta.updateControlsVisibility();

            this.setVisible(true);
            this.grabFocus();

            if (this.styles.shadow) {
                cleverapps.windows.onShowShadow();
            } else {
                cleverapps.windows.onHideShadow();
            }

            if (this instanceof ForceView) {
                cleverapps.windows.onMoveShadowUp();
            }

            if (cleverapps.environment) {
                cleverapps.environment.onOpenWindow();
            }

            this.popUpAnimation();
            this.onShow();
        }
    },

    deleteSelf: function () {
        cleverapps.windows.delete(this);
        this.removeFromParent();
    },

    stop: function () {
        cc.eventManager.removeListeners(this, true);
    },

    beforeCloseAnimation: function (callback) {
        callback();
    },

    close: function () {
        if (this.closed === true) {
            cleverapps.throwAsync("Closing already closed window: " + this.name);
        }

        if (!this.initializedSuccess || this.closed) {
            return;
        }

        if (this.closeButton instanceof BandButton) {
            this.closeButton.hide();
        }

        if (this.shareCheckBox && !this.withBg) {
            this.shareCheckBox.hide();
        }

        if (this.tapToContinue) {
            this.tapToContinue.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.Hide()
            ));
        }

        if (this.homeButton) {
            this.homeButton.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.Hide()
            ));
        }

        if (this.windowFooter) {
            this.windowFooter.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.Hide()
            ));
        }

        if (this.windowTitle) {
            this.windowTitle.hide();
        }

        if (this.decors) {
            this.decors.hideAll();
        }

        if (this.content) {
            this.content.children.forEach(function (component) {
                if (component.hide) {
                    component.hide();
                }
            });
        }

        cleverapps.windows.remove(this);
    },

    onClose: function () {

    }
});

BaseWindow.WINDOWS_ZORDER = 22;
