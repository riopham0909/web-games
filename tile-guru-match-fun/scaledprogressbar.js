/**
 * Created by ivan on 24.01.18.
 */

var ScaledProgressBar = cc.Node.extend({
    ctor: function (options) {
        this._super();

        this.progressFrames = options.progressFrames;
        this.delimiters = options.delimiters;
        this.layout = options.layout || ScaledProgressBar.HORIZONTAL;

        this.sizeDirty = true;

        if (options.background) {
            this.background = cleverapps.UI.createScale9Sprite(options.background);
            this.background.setAnchorPoint(0, 0);
            this.addChild(this.background);
            this.applyCapInsets(this.background);
        }

        this.progress = cleverapps.UI.createScale9Sprite(options.progress);
        this.progress.setAnchorPoint(0, 0);
        this.addChild(this.progress);
        this.applyCapInsets(this.progress);

        var size = options.background ? cc.size(this.background.width, this.background.height) : cc.size(this.progress.width, this.progress.height);
        this.percentage = 0;
        this.setContentSize2(size.width, size.height);
        this.setAnchorPoint2();

        if (options.barText) {
            this.createBarText(options.barText);
        }

        this.minSize = options.minSize;

        this.onChange();
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        this.updateProgressFrame();
    },

    applyCapInsets: function (scale9Sprite) {
        if (this.layout === ScaledProgressBar.HORIZONTAL) {
            scale9Sprite.setCapInsets(cc.rect(scale9Sprite.width / 2 - 1, scale9Sprite.height / 3, 2, scale9Sprite.height / 3));
        } else {
            scale9Sprite.setCapInsets(cc.rect(scale9Sprite.width / 3, scale9Sprite.height / 2 - 1, scale9Sprite.width / 3, 2));
        }
    },

    onChange: function () {
        if (this.background && this.sizeDirty) {
            this.background.setContentSize2(this.width, this.height);
        }

        if (this.barTextBlock && this.sizeDirty) {
            this.updateBarTextPosition();
        }

        this.updateProgressFrame();

        var size = cc.size(this.width, this.height);
        var minSize = this.minSize || cc.size(this.progress._spriteFrame.getOriginalSize());

        if (this.layout === ScaledProgressBar.HORIZONTAL) {
            size.width = this.percentage ? Math.max(minSize.width, size.width * this.percentage / 100) : 0;
        } else {
            size.height = this.percentage ? Math.max(minSize.height, size.height * this.percentage / 100) : 0;
        }

        this.progress.setContentSize(size.width, size.height);

        this.sizeDirty = false;
    },

    animatedChange: function (percentage, options) {
        percentage = Math.max(Math.min(percentage, 100), 0);
        options = options || {};

        if (percentage === this.percentage) {
            return;
        }

        this.stopAnimatedChangeData();
        this.updateProgressFrame();

        var action = new ScaledProgressBarProgressTo(options.time || 0.8, percentage);

        if (options.easing !== false) {
            action.easing(options.easing || cc.easeCubicActionOut());
        }

        if (options.callback) {
            action = new cc.Sequence(
                action,
                new cc.CallFunc(options.callback)
            );
        }

        if (this.isRunning()) {
            this.animatedChangeAction = this.runAction(action);
            this.animatedChangeAction.setTag(ScaledProgressBar.ANIMATE_CHANGE_ACTION_TAG);
        }
    },

    updateProgressFrame: function () {
        if (this.progressFrames) {
            var newFrame;
            for (var percent in this.progressFrames) {
                if (this.percentage >= percent) {
                    newFrame = this.progressFrames[percent];
                }
            }

            newFrame = processVirtualImage(newFrame, this.getPreferredBundles());

            if (newFrame && this.currentFrame !== newFrame) {
                this.currentFrame = newFrame;
                this.progress.setSpriteFrame(new cc.Sprite(newFrame).getSpriteFrame());
            }
        }
    },

    setLength: function (length) {
        if (this.layout === ScaledProgressBar.VERTICAL) {
            this.setContentSize2(this.width, length);
        } else {
            this.setContentSize2(length, this.height);
        }
        this.sizeDirty = true;
        this.onChange();
    },

    setLayout: function (layout) {
        this.layout = layout;
        this.onChange();
    },

    stopAnimatedChangeData: function () {
        if (this.animatedChangeAction && !this.animatedChangeAction.isDone()) {
            this.stopActionByTag(ScaledProgressBar.ANIMATE_CHANGE_ACTION_TAG);
            delete this.animatedChangeAction;
        }
    },

    setPercentage: function (percentage) {
        this.stopAnimatedChangeData();

        percentage = Math.max(Math.min(percentage, 100), 0);

        if (this.percentage !== percentage) {
            this.percentage = percentage;
            this.onChange();
        }
    },

    getPercentage: function () {
        return this.percentage;
    },

    createBarText: function (options) {
        this.textOptions = options;
        this.textOptions.dx = this.textOptions.dx || 0;
        this.textOptions.dy = this.textOptions.dy || 0;

        var font = options.font || cleverapps.styles.FONTS.SMALL_WHITE_TEXT;
        this.barText = cleverapps.UI.generateImageText(options.text || "", font);
        this.barText.fontUsed = font;

        var items = [this.barText];
        if (options.icon) {
            var icon = this.icon = new cc.Sprite(options.icon);
            if (options.iconBeforeText) {
                items.unshift(icon);
            } else {
                items.push(icon);
            }

            this.barText.setAnchorPoint2(1, 0.5);
        }

        this.barTextBlock = new cleverapps.Layout(items, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: options.iconMargin
        });

        this.addChild(this.barTextBlock);
    },

    addDelimiters: function (val, total) {
        var delimiterFrame;
        for (var percent in this.delimiters) {
            if (this.percentage >= percent) {
                delimiterFrame = this.delimiters[percent];
            }
        }

        if (!delimiterFrame) {
            return false;
        }

        for (var i = 1; i <= Math.min(val, total - 1); i++) {
            var delimiterSprite = cleverapps.UI.createSprite(delimiterFrame);
            delimiterSprite.setAnchorPoint(0, 0);
            delimiterSprite.setPositionRound(i * this.width / total - delimiterSprite.width, 0);
            this.addChild(delimiterSprite);
        }

        return true;
    },

    updateBarTextPosition: function () {
        this.barTextBlock.setPositionRound(this.width / 2 + this.textOptions.dx, this.height / 2 + this.textOptions.dy);

        this.barTextBlock.reshape();
    },

    updateBarText: function (text) {
        if (this.barText) {
            var font = this.barText.fontUsed;

            cleverapps.UI.ImageFont.intertypeSetString({
                textObj: this.barText,
                string: text,
                font: font,
                recreateFunc: function () {
                    var newText = cleverapps.UI.ImageFont.IsApplicable(font, text) ? cleverapps.UI.generateImageText(text, font) : cleverapps.UI.generateOnlyText(text, font);

                    this.barText.parent.addChild(newText);
                    newText.fontUsed = font;

                    this.barText.removeFromParent();
                    this.barText = newText;
                }.bind(this)
            });

            this.updateBarTextPosition();
        }
    }
});

var ScaledProgressBarProgressTo = cc.ProgressTo.extend({
    update: function (time) {
        if (this.target instanceof ScaledProgressBar) {
            time = this._computeEaseTime(time);
            this.target.percentage = Math.max(Math.min(this._from + (this._to - this._from) * time, 100), 0);
            this.target.onChange();
        }
    }
});

ScaledProgressBar.HORIZONTAL = 0;
ScaledProgressBar.VERTICAL = 1;

ScaledProgressBar.ANIMATE_CHANGE_ACTION_TAG = "animateChange";

ScaledProgressBar.Types = cleverapps.overrideTemplates({}, {
    blue: {
        progress: bundles.progress_bar.frames.bar_blue,
        background: bundles.progress_bar.frames.bg_dark
    },

    blue_with_frames: {
        progress: bundles.progress_bar.frames.bar_blue,
        background: bundles.progress_bar.frames.bg_dark,
        progressFrames: {
            0: bundles.progress_bar.frames.bar_red,
            30: bundles.progress_bar.frames.bar_orange,
            70: bundles.progress_bar.frames.bar_blue
        },
        delimiters: {
            0: bundles.progress_bar.frames.delimiter_red,
            30: bundles.progress_bar.frames.delimiter_orange,
            70: bundles.progress_bar.frames.delimiter_blue
        }
    },

    blue_small: {
        progress: bundles.progress_bar.frames.bar_blue_small,
        background: bundles.progress_bar.frames.bg_dark_small
    },

    blue_small_with_frames: {
        progress: bundles.progress_bar.frames.bar_blue_small,
        background: bundles.progress_bar.frames.bg_dark_small,
        progressFrames: {
            0: bundles.progress_bar.frames.bar_red_small,
            30: bundles.progress_bar.frames.bar_orange_small,
            70: bundles.progress_bar.frames.bar_blue_small
        }
    },

    blue_large_with_frames: {
        progress: bundles.progress_bar.frames.bar_blue_large,
        background: bundles.progress_bar.frames.bg_dark_large,
        progressFrames: {
            0: bundles.progress_bar.frames.bar_red_large,
            30: bundles.progress_bar.frames.bar_orange_large,
            70: bundles.progress_bar.frames.bar_blue_large
        }
    },

    green: {
        progress: bundles.progress_bar.frames.bar_green,
        background: bundles.progress_bar.frames.bg_green
    },

    green_large: {
        progress: bundles.progress_bar.frames.bar_green_large,
        background: bundles.progress_bar.frames.bg_green_large
    },

    red: {
        progress: bundles.progress_bar.frames.bar_red,
        background: bundles.progress_bar.frames.bg_dark
    },

    red_small: {
        progress: bundles.progress_bar.frames.bar_red_small,
        background: bundles.progress_bar.frames.bg_dark_small
    },

    blue_large_round: {
        progress: bundles.progress_bar.frames.bar_blue_large_round,
        background: bundles.progress_bar.frames.bg_green_large
    }
});

cleverapps.values(ScaledProgressBar.Types).forEach(function (type) {
    type.create = function (options) {
        var data = cleverapps.clone(type);
        Object.assign(data, options || {});
        var bar = new ScaledProgressBar(data);
        bar.setAnchorPoint2(0, 0);
        return bar;
    };
});