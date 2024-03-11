/**
 * Created by slava on 3/31/17.
 */

var NotificationView = cc.Scale9Sprite.extend({
    ctor: function (model, message, options) {
        var frame = bundles.notification.frames.notification_bg;

        this._super(frame, cleverapps.UI.getScale9Rect(frame, cleverapps.UI.Scale9Rect.TwoPixelXY));

        this.model = model;

        var styles = cleverapps.styles.NotificationView;

        this.setLocalZOrder(UpMenuContainer.ZORDER + 1);
        var content = cleverapps.UI.generateOnlyText(message, cleverapps.styles.FONTS.NOTIFICATION_TEXT, options.toReplace);
        var maxWidth = Math.min(cleverapps.UI.getSceneSize().width * 0.85, styles.maxWidth);

        var image = options.image;

        if (image) {
            if (!(image instanceof cc.Node)) {
                image = new cc.Sprite(image);
            }
            cleverapps.UI.fitToBox(image, styles.image);
            maxWidth -= image.width * image.scale + styles.image.margin;
        }

        var textHeight = styles.text.height;
        if (options.progress) {
            var bar = this.bar = ScaledProgressBar.Types[styles.progress.type].create({
                barText: {
                    text: options.progress.amount >= options.progress.total ? Messages.get("done") : options.progress.amount + "/" + options.progress.total,
                    font: cleverapps.styles.FONTS.NOTIFICATION_PROGRESS_FONT
                }
            });
            bar.setLength(styles.progress.width);
            bar.setPercentage(options.progress.amount / options.progress.total * 100);
            bar.setAnchorPoint2();
            cleverapps.UI.fitToBox(bar, { height: styles.progress.height });
            textHeight -= bar.height * bar.scale + styles.progress.margin;
        }

        if (content.width > maxWidth) {
            content.setDimensions(maxWidth, 0);
            content.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        }
        content.fitTo(undefined, textHeight);

        if (this.bar) {
            content = new cleverapps.Layout([content, this.bar], {
                margin: styles.progress.margin,
                direction: cleverapps.UI.VERTICAL
            });
        }

        if (image) {
            content = new cleverapps.Layout([image, content], {
                margin: styles.image.margin,
                direction: cleverapps.UI.HORIZONTAL
            });
        }

        this.addChild(content);

        var width = Math.max(styles.minWidth, content.width + 2 * styles.padding.x);
        var height = Math.max(styles.minHeight, (content.height + styles.padding.y) * 2);

        this.setContentSize(width, height);
        content.setPositionRound(content.width / 2 + styles.padding.x, content.height / 2 + styles.padding.y);

        this.updatePosition();

        if (!options.noSound) {
            cleverapps.audio.playSound(bundles.main.urls.notification_effect);
        }

        this.show();

        this.onShowListener = function () {
            if (options.progress && options.progress.newAmount) {
                this.updateProgress(options.progress.newAmount, options.progress.total, 0.5);
            } else {
                this.delayAndHide();
            }
        }.bind(this);

        this.model.onRemove = this.createListener(this.removeFromParent.bind(this));
        this.model.onUpdateProgress = this.createListener(this.updateProgress.bind(this));

        if (options.debugInfo) {
            this.setLocalZOrder(10000);
            this.model.onRemove = function () {};

            this.alwaysOn = true;

            cleverapps.UI.onPressed(this, function () {
                if (cleverapps.meta.isFocused()) {
                    new ErrorWindow(options);
                } else {
                    cleverapps.meta.display({
                        focus: "ErrorWindow",
                        action: function (f) {
                            new ErrorWindow(options);
                            cleverapps.meta.onceNoWindowsListener = f;
                        }
                    });
                }
            });
        }
    },

    updatePosition: function () {
        var styles = cleverapps.styles.NotificationView;
        var winSize = cleverapps.UI.getSceneSize();
        this.base = cc.p(winSize.width / 2, winSize.height + this.height / 2);
        this.target = cc.p(winSize.width / 2, winSize.height - styles.offsetY);

        if (!this.showInProgress && !this.hideInProgress) {
            this.setPositionRound(this.shown ? this.target : this.base);
        }

        if (this.showInProgress) {
            this.show();
        }

        if (this.hideInProgress) {
            this.hide();
        }
    },

    show: function () {
        if (this.shown) {
            return;
        }

        var duration = 0.2;
        if (this.showAction && !this.showAction.isDone()) {
            duration = Math.max(0, this.showAction.getDuration() - this.showAction.getElapsed());
            this.stopAction(this.showAction);
        }

        this.showInProgress = true;
        this.showAction = this.runAction(new cc.Sequence(
            new cc.MoveTo(duration, this.target),
            new cc.CallFunc(function () {
                this.shown = true;
                this.showInProgress = false;
                delete this.showAction;

                this.onShowListener();
            }.bind(this))
        ));
    },

    hide: function () {
        if (!this.shown) {
            return;
        }

        var duration = 0.5;
        if (this.hideAction && !this.hideAction.isDone()) {
            duration = Math.max(0, this.hideAction.getDuration() - this.hideAction.getElapsed());
            this.stopAction(this.hideAction);
        }

        this.hideInProgress = true;
        this.hideAction = this.runAction(new cc.Sequence(
            new cc.MoveTo(duration, this.base),
            new cc.CallFunc(function () {
                this.shown = false;
                this.hideInProgress = false;
                delete this.hideAction;

                this.model.reset();
                this.model.processQueue();
            }.bind(this))
        ));
    },

    delayAndHide: function () {
        this.runAction(new cc.Sequence(
            new cc.DelayTime(3),
            new cc.CallFunc(this.hide.bind(this))
        ));
    },

    updateProgress: function (progress, total, delay) {
        if (!this.bar || !this.shown) {
            return;
        }

        this.stopAllActions();
        delay = delay || 0;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.CallFunc(function () {
                this.delayAndHide();
                this.bar.animatedChange(progress / total * 100);

                var txt = progress + "/" + total;
                if (progress >= total) {
                    txt = Messages.get("done");
                    cleverapps.audio.playSound(bundles.notification.urls.task_done_sfx);

                    if (bundles.notification.jsons.bar_flash_json) {
                        var animation = new cleverapps.Spine(bundles.notification.jsons.bar_flash_json);
                        this.bar.addChild(animation);
                        animation.setPositionRound(cleverapps.styles.NotificationView.progress.animation);
                        animation.setAnimation(0, "animation", false);
                        animation.setCompleteListenerRemove();
                    }
                }
                this.bar.updateBarText(txt);
            }.bind(this))
        ));
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    NOTIFICATION_TEXT: {
        name: "nostroke",
        size: 50,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    }
});

cleverapps.styles.NotificationView = {
    offsetY: 10,

    text: {
        height: 100
    },

    image: {
        margin: 20,
        width: 200,
        height: 100,
        maxScale: 1.5
    },

    minWidth: 300,
    minHeight: 200,
    maxWidth: 750,

    padding: {
        x: 30,
        y: 40
    },

    progress: {
        margin: 10,
        width: 350,
        height: 30,
        type: "green",
        animation: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: -2 }
        }
    }
};

NotificationView.ZORDER = BaseWindow.WINDOWS_ZORDER + 2;

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    NOTIFICATION_PROGRESS_FONT: {
        name: "default",
        size: 26
    }
});
