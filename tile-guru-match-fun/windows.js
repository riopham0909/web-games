/**
 * Created by iamso on 19.08.19.
 */

var Windows = function () {
    cleverapps.EventEmitter.call(this);

    this.list = [];
    this.bundles = 0;

    // eslint-disable-next-line no-unused-vars
    this.onHideShadow = function (callback) {};
    // eslint-disable-next-line no-unused-vars
    this.onShowShadow = function (callback) {};
    this.onMoveShadowUp = function () {};
    this.onMoveShadowDown = function () {};

    this.onHideLoading = function () {};
    this.onShowLoading = function () {};

    this.onceNoWindowsListener = undefined;
};

Windows.prototype = Object.create(cleverapps.EventEmitter.prototype);
Windows.prototype.constructor = Windows;

Windows.prototype.isActive = function () {
    return this.list.length > 0 || this.bundles > 0;
};

Windows.prototype.reset = function () {
    this.list = [];
    this.bundles = 0;
    this.onHideShadow();
};

Windows.prototype.currentWindow = function () {
    return this.list[this.list.length - 1];
};

Windows.prototype.findWindow = function (WindowClass) {
    return this.list.find(function (window) {
        return window instanceof WindowClass;
    });
};

Windows.prototype.closeBottomWindows = function () {
    this.list.slice(0, this.list.length - 1).reverse().forEach(function (window) {
        if (!window.closed) {
            window.close();
        }
    });
};

Windows.prototype.closeAllWindows = function () {
    this.list.reverse().forEach(function (window) {
        if (!window.closed) {
            window.close();
        }
    });
};

Windows.prototype.add = function (window) {
    if (!cleverapps.meta.isFocused() && ["promptwindow"].indexOf(window.name) === -1) {
        cleverapps.meta.debugMessage("Trying to show window without user focus!");
    }

    if (window instanceof WaitWindow) {
        window.displaySelf();
        return;
    }

    if (this.list.length > 0) {
        var topWindow = this.list[this.list.length - 1];

        if (!(window instanceof ForceView)) {
            topWindow.setVisible(false);
            this.onHideShadow();
            if (topWindow.initializedSuccess) {
                topWindow.onHide();
            }
        }
    }

    this.onShowLoading();

    this.list.push(window);
    window.displaySelf();

    if (this.list.length === 1 && !(this.list[0] instanceof ForceView)
        || this.list.length === 2 && (this.list[0] instanceof ForceView)
    ) {
        this.trigger("openWindow");
    }
};

Windows.prototype.notifyMetha = function () {
    if (!this.isActive()) {
        if (cleverapps.meta.onceNoWindowsListener) {
            var f = cleverapps.meta.onceNoWindowsListener;
            cleverapps.meta.onceNoWindowsListener = undefined;
            f();
        }
        if (cleverapps.meta.tutorialNoWindowsListener) {
            cleverapps.meta.tutorialNoWindowsListener();
        }
    }
};

Windows.prototype.runClose = function (window) {
    new ActionPlayer([
        function (f) {
            window.beforeCloseAnimation(f);
        },

        function (f) {
            if (window.isCurrent()) {
                window.closeAnimation(f);
            } else {
                f();
            }
        },

        function (f) {
            if (window.shareCheckBox) {
                window.shareCheckBox.onWindowClose(f);
            } else {
                f();
            }
        },

        function (f) {
            this.delete(window);

            window.onClose();

            if (cleverapps.environment) {
                cleverapps.environment.onCloseWindow(window.name);
            }

            if (window.closeAnimationCallbacks) {
                window.closeAnimationCallbacks.forEach(function (callback) {
                    callback();
                });

                window.closeAnimationCallbacks = [];
            }

            f();
        }.bind(this),

        function (f) {
            window.removeFromParent();

            cleverapps.bundleLoader.deleteBundles(window.bundles);

            setTimeout(f, 0);
        },

        function (f) {
            this.notifyMetha();

            f();
        }.bind(this)
    ]).play();
};

Windows.prototype.remove = function (window) {
    if (window.closed) {
        return;
    }
    window.closed = true;

    window.stop();

    if (window.isCurrent()) {
        cleverapps.meta.setEventNodes([]);
    }

    this.runClose(window);
};

Windows.prototype.delete = function (window) {
    var isActiveWindow = (window === this.currentWindow());

    var index = this.list.indexOf(window);
    if (index !== -1) {
        this.list.splice(index, 1);
    }

    if (isActiveWindow) {
        if (!window.initializedSuccess) {
            this.onHideLoading();
        }

        if (this.list.length === 0) {
            if (window instanceof ForceView) {
                this.onMoveShadowDown();
            }
            this.onHideShadow();
            var scene = cleverapps.scenes.getRunningScene();
            if (scene && scene.onShow) {
                scene.onShow();
            }
            setTimeout(function () {
                if (this.list.length === 0) {
                    this.trigger("closeWindows");
                }
            }.bind(this), window.closeDuration());
        } else if (window instanceof ForceView) {
            this.onMoveShadowDown();
            setTimeout(function () {
                var currentWindow = this.currentWindow();
                if (currentWindow) {
                    cleverapps.meta.setEventNodes([currentWindow]);
                }
            }.bind(this), 150);
        } else {
            var topWindow = this.currentWindow();
            this.onShowLoading();
            topWindow.displaySelf();
            if (this.list.length === 1 && this.list[0] instanceof ForceView) {
                this.trigger("closeWindows");
            }
        }
    }
};
