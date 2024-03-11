/**
 * Created by vladislav on 05.03.2020
 */

cleverapps.UI.Button = cc.Node.extend({
    ctor: function (settings) {
        this._super();

        this.setAnchorPoint2();

        this.settings = settings;

        if (!settings.type && cleverapps.environment.isEditorScene()) {
            settings.type = cleverapps.styles.UI.Button.Images.editor;
        }

        if (!settings.textVariant && cleverapps.environment.isEditorScene()) {
            settings.textVariant = "strict";
        }

        if (!settings.type || !settings.type.button_png) {
            settings.type = cleverapps.styles.UI.Button.Images.button_green;
        }

        this.bright = true;
        this.createBackground();

        if (settings.text || settings.textOff) {
            this.font = this.workFont(settings.textVariant);
        }

        if (settings.text && settings.type.widthByContent) {
            settings.content = this.createText(settings.text, settings);

            var padding = this.calcPadding();
            var width = Math.min(settings.content.width + padding.left + padding.right, 0.9 * cleverapps.UI.getSceneSize().width);
            this.resize(width, settings.content.height);

            delete settings.text;
        }

        this.content = settings.content;
        this.contentOff = settings.contentOff;

        var innerRect = this.calcInnerRect();

        [this.content, this.contentOff].forEach(function (content) {
            if (content) {
                cleverapps.UI.fitToBox(content, {
                    width: innerRect.width,
                    height: innerRect.height
                });
            }
        }, this);

        if (settings.text) {
            this.content = this.createText(settings.text, settings, innerRect);
        }

        if (settings.textOff) {
            this.contentOff = this.createText(settings.textOff, settings, innerRect);
        }

        [this.content, this.contentOff].forEach(function (content) {
            if (content) {
                this.addChild(content);

                content.setPositionRound(innerRect.x + innerRect.width / 2, innerRect.y + innerRect.height / 2);
            }
        }, this);

        this._toggleContent(true);

        if (this.content instanceof cleverapps.UI.LabelTTF) {
            this.text = this.content;
        }

        if (this.contentOff instanceof cleverapps.UI.LabelTTF) {
            this.textOff = this.contentOff;
        }

        this.hoverHandler = cleverapps.UI.applyHover(this, {
            filter: settings.filter,
            onMouseOver: this.onMouseOver.bind(this),
            onMouseOut: this.onMouseOut.bind(this)
        });

        this.clickHandler = cleverapps.UI.onClick(this, function () {
            this.action();
        }.bind(this), {
            filter: settings.filter
        });

        if (settings.mark) {
            this.setAttention(true);
        }

        if (settings.disabled) {
            this.disable();
        }
    },

    setAttention: function (attention) {
        if (attention && this.mark) {
            return;
        }

        if (!attention) {
            if (this.mark) {
                this.mark.removeFromParent();
                delete this.mark;
            }

            return;
        }

        this.mark = new Attention();
        this.mark.setPositionRound(this.settings.type.mark || cleverapps.styles.UI.Button.mark);
        this.addChild(this.mark);
    },

    calcInnerRect: function () {
        var padding = this.calcPadding();
        return cc.rect(padding.left, padding.bottom, this.width - padding.left - padding.right, this.height - padding.bottom - padding.top);
    },

    calcPadding: function () {
        var padding = this.settings.type.SKIP_RESOLUTION ? this.settings.type.SKIP_RESOLUTION.padding : cleverapps.styles.UI.Button.SKIP_RESOLUTION.padding;

        return {
            left: Math.floor(this.height * padding.left),
            right: Math.floor(this.height * padding.right),
            bottom: Math.floor(this.height * padding.bottom),
            top: Math.floor(this.height * padding.top)
        };
    },

    createText: function (string, settings, rect) {
        if (TextWithIcon.IsApplicable(string, settings.icons)) {
            return new TextWithIcon(string, {
                font: this.font,
                width: rect && rect.width,
                height: rect && rect.height,
                icons: settings.icons,
                iconMinHeight: settings.iconMinHeight,
                iconMaxHeight: settings.iconMaxHeight
            });
        }
        var text = cleverapps.UI.generateOnlyText(string, this.font);
        if (rect) {
            text.fitTo(rect.width, rect.height);
        }

        return text;
    },

    guessFontSize: function () {
        var styles = cleverapps.styles.UI.Button;

        var size = Math.round(this.height * cleverapps.styles.FONTS.BUTTON_TEXT.size / styles.defaultSize);

        return Math.min(styles.maxFontSize, size);
    },

    showAlert: function () {
        if (!this.disabled && this.settings.spine && this.background.hasAnimation("alert")) {
            this.background.addAnimation(0, "alert", false);
        }
    },

    setMarkVisible: function (visible) {
        if (this.mark) {
            this.mark.setVisible(visible);
        }
    },

    showHint: function (hintText) {
        var action = new cc.Sequence(
            new cc.DelayTime(1),
            new cc.CallFunc(function () {
                if (!this.disabled && this.isDisplayed() && !this.hint) {
                    this.hint = new cleverapps.UI.Tooltip(this.background, {
                        text: hintText,
                        size: cleverapps.styles.UI.Button.tooltipSize,
                        position: this.settings.hintPosition || cleverapps.styles.UI.Tooltip.LOCATION.above
                    });
                    this.addChild(this.hint);
                    this.hint.setPositionRound(this.settings.hintPosition || cleverapps.styles.UI.Tooltip.LOCATION.above);
                    this.hint.replaceParentSamePlace(cleverapps.scenes.getRunningScene());
                }
            }.bind(this))
        );

        action.setTag(cleverapps.UI.Button.HINT_ACTION_TAG);
        this.runAction(action);
    },

    hideHint: function () {
        this.stopActionByTag(cleverapps.UI.Button.HINT_ACTION_TAG);

        if (this.hint) {
            this.hint.removeFromParent();
            this.hint = undefined;
        }
    },

    createBackground: function () {
        if (this.settings.noBg) {
            this.setContentSize2(this.settings.width, this.settings.height);
            return;
        }

        var width;
        var height;

        if (this.settings.spine) {
            width = this.settings.width;
            height = this.settings.height;
            this.background = new cleverapps.Spine(this.settings.spine);
            if (this.settings.skin) {
                this.background.setSkin(this.settings.skin);
            }
            this.background.setAnimation(0, "idle", true);
        } else {
            this.background = cleverapps.UI.createScale9Sprite(this.settings.type.button_png, this.settings.scale9Rect !== undefined ? this.settings.scale9Rect : cleverapps.UI.Scale9Rect.TwoPixelX);
            width = this.settings.width || this.background.width;
            height = this.settings.height || this.background.height;
        }

        this.addChild(this.background);
        this.resize(width, height);
    },

    workFont: function (textVariant) {
        var font = cleverapps.clone(cleverapps.UI.Button.WorkFont(textVariant));

        var size = this.guessFontSize();
        if (size) {
            font.size = size;
        }

        return font;
    },

    setString: function (string) {
        this._setString(this.content, this.text, string);
    },

    setStringOff: function (string) {
        this._setString(this.contentOff, this.textOff, string);
    },

    _setString: function (content, text, string) {
        var innerRect = this.calcInnerRect();

        if (content instanceof TextWithIcon) {
            content.setString(string);
        } else {
            text.setFont(this.font);
            text.setString(string);
            text.fitTo(innerRect.width, innerRect.height);
        }
    },

    setTextVariant: function (textVariant) {
        if (this.text) {
            this.font = this.workFont(textVariant);

            this.text.setFont(this.font);

            this.setString(this.text.getString());
        }

        if (this.content instanceof TextWithIcon) {
            this.font = this.workFont(textVariant);

            this.content.setFont(this.font);
        }
    },

    setType: function (type) {
        if (!type || !type.button_png) {
            type = cleverapps.styles.UI.Button.Images.button_green;
        }
        this.settings.type = type;

        this._innerUpdateBgContent();
    },

    resize: function (width, height) {
        this.setContentSize2(width, height);
        if (!this.settings.spine) {
            if (this.settings.type.keepRadius || cleverapps.styles.UI.Button.keepRadius && this.settings.type.keepRadius !== false || this.settings.keepRadius) {
                this.background.setScale(height / this.background.height);
                this.background.setContentSize2(width / this.background.scale, this.background.height);
            } else {
                this.background.setContentSize2(width, height);
            }
        }
        this.background.setPositionRound(this.width / 2, this.height / 2);
    },

    applyInteractiveScale: function () {
        if (this.disabled) {
            return;
        }

        var scaleX = this.baseScaleX || this.baseScale || 1;
        var scaleY = this.baseScaleY || this.baseScale || 1;

        var states = this.getInteractiveStates();
        if (states.mouseover || states.pressed) {
            this.setScale(scaleX * 1.03, scaleY * 1.03);
        } else {
            this.setScale(scaleX, scaleY);
        }

        this._innerUpdateBgContent();
    },

    action: function () {
        if (this.disabled) {
            return;
        }
        if (!this._isAncestorsVisible(this)) {
            return;
        }

        cleverapps.audio.playSound(this.settings.click_effect || bundles.main.urls.click_effect);

        this.settings.onClicked();
        if (this.settings.selectOnClick) {
            this.selected = !this.selected;
            this._innerUpdateBgContent();
        }
    },

    setBright: function (bright) {
        this.bright = bright;

        this._innerUpdateBgContent();
    },

    disable: function () {
        if (this.disabled) {
            return;
        }

        this.onMouseOut();
        this.setMarkVisible(false);
        this.disabled = true;
        this.clickHandler.setEnabled(false);
        this._innerUpdateBgContent();
    },

    enable: function () {
        if (!this.disabled) {
            return;
        }

        this.disabled = false;
        this.setMarkVisible(true);
        this.clickHandler.setEnabled(true);
        this._innerUpdateBgContent();
    },

    onMouseOver: function () {
        if (this.disabled) {
            return;
        }

        if (this.settings.onMouseOver) {
            this.settings.onMouseOver();
        } else {
            this.applyInteractiveScale();

            if (this.settings.hint) {
                this.showHint(this.settings.hint);
            }
        }
    },

    onMouseOut: function () {
        if (this.disabled) {
            return;
        }

        if (this.settings.onMouseOut) {
            this.settings.onMouseOut();
        } else {
            this.applyInteractiveScale();

            if (this.settings.hint) {
                this.hideHint();
            }
        }
    },

    _toggleContent: function (on) {
        if (this.content && this.contentOff) {
            if (on) {
                this.content.setVisible(true);
                this.contentOff.setVisible(false);
            } else {
                this.content.setVisible(false);
                this.contentOff.setVisible(true);
            }
        }
    },

    _innerUpdateBgContent: function () {
        var bright = this.bright && !this.disabled;
        var states = this.getInteractiveStates();

        if (this.settings.spine) {
            var animation = "idle";
            if (states.pressed && this.background.hasAnimation("idle_on")) {
                animation = "idle_on";
            } else if (!bright && this.background.hasAnimation("idle_off")) {
                animation = "idle_off";
            }

            this.background.setAnimation(0, animation, true);
        } else {
            if (this.background) {
                var spriteFrame = this.settings.type.button_off_png;
                if (states.pressed || this.selected) {
                    spriteFrame = this.settings.type.button_on_png;
                } else if (bright) {
                    spriteFrame = this.settings.type.button_png;
                }
                this.background.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(spriteFrame, this.getPreferredBundles()));
            }
            this._toggleContent(bright);
        }
    },

    _isAncestorsVisible: function (node) {
        if (node == null) {
            return true;
        }

        var parent = node.getParent();

        if (parent && !parent.isVisible()) {
            return false;
        }
        return this._isAncestorsVisible(parent);
    }
});

cleverapps.UI.Button.HINT_ACTION_TAG = 2;

cleverapps.UI.Button.TEXT_REGULAR = "regular";
cleverapps.UI.Button.TEXT_EMPHASIS = "emphasis";

cleverapps.UI.Button.WorkFont = function (textVariant) {
    if (!cleverapps.UI.Button.Fonts) {
        cleverapps.UI.Button.Fonts = {
            regular: {
                size: 0
            },
            emphasis: {
                size: 0
            },
            strict: {
                size: 0
            },
            strict_white: {
                size: 0
            },
            strict_black: {
                size: 0
            },
            strict_blue: {
                size: 0
            }
        };
        cleverapps.overrideFonts(cleverapps.UI.Button.Fonts, {
            regular: cleverapps.styles.FONTS.BUTTON_TEXT,
            emphasis: cleverapps.styles.FONTS.BUTTON_TEXT,
            strict: cleverapps.styles.FONTS.STRICT_TEXT,
            strict_white: cleverapps.styles.FONTS.STRICT_WHITE_TEXT,
            strict_black: cleverapps.styles.FONTS.STRICT_BLACK_TEXT,
            strict_blue: cleverapps.styles.FONTS.STRICT_BLUE_TEXT
        });

        cleverapps.UI.Button.Fonts.emphasis.color = cleverapps.styles.COLORS.COLOR_RED;
    }

    return textVariant && cleverapps.UI.Button.Fonts[textVariant] || cleverapps.UI.Button.Fonts.regular;
};

cleverapps.styles.UI.Button = {
    keepRadius: false,
    maxFontSize: 65,
    SKIP_RESOLUTION: {
        padding: {
            left: 0.3,
            right: 0.3,
            top: 0.05,
            bottom: 0.05
        }
    },
    defaultSize: 90,
    tooltipSize: {
        width: 300,
        height: 80
    },
    mark: {
        x: { align: "right", dx: 15 },
        y: { align: "top", dy: 10 }
    }
};

cleverapps.styles.UI.Button.Images = cleverapps.overrideTemplates({}, {
    button_green: {
        button_png: bundles.buttons.frames.button_png,
        button_on_png: bundles.buttons.frames.button_on_png,
        button_off_png: bundles.buttons.frames.button_disabled_png
    },

    button_blue: {
        button_png: bundles.buttons.frames.blue_button_png,
        button_on_png: bundles.buttons.frames.blue_button_on_png,
        button_off_png: bundles.buttons.frames.button_disabled_png
    },

    button_red: {
        button_png: bundles.buttons.frames.red_button,
        button_on_png: bundles.buttons.frames.red_button_on,
        button_off_png: bundles.buttons.frames.button_disabled_png
    },

    button_purple: {
        button_png: bundles.buttons.frames.purple_button_png,
        button_on_png: bundles.buttons.frames.purple_button_on_png,
        button_off_png: bundles.buttons.frames.button_disabled_png
    },

    small_button_blue: {
        button_png: bundles.buttons.frames.small_blue_button,
        button_on_png: bundles.buttons.frames.small_blue_button_on,
        button_off_png: bundles.buttons.frames.small_button_off
    },

    small_button_green: {
        button_png: bundles.buttons.frames.small_button,
        button_on_png: bundles.buttons.frames.small_button_on,
        button_off_png: bundles.buttons.frames.small_button_off
    },

    chat: {
        button_png: bundles.chat.frames.accept_button,
        button_on_png: bundles.chat.frames.accept_button_on
    },

    chat_categories: {
        button_png: bundles.chat.frames.category_bg,
        button_on_png: bundles.chat.frames.category_bg_on,
        button_off_png: bundles.chat.frames.active_category_bg,
        widthByContent: true
    },

    field_button_green: {
        button_png: bundles.buttons.frames.field_green_button,
        button_on_png: bundles.buttons.frames.field_green_button_on,
        button_off_png: bundles.buttons.frames.field_button_off
    },

    field_button_blue: {
        button_png: bundles.buttons.frames.field_blue_button,
        button_on_png: bundles.buttons.frames.field_blue_button_on,
        button_off_png: bundles.buttons.frames.field_button_off
    }
});

if (cleverapps.config.debugMode) {
    cleverapps.overrideTemplates(cleverapps.styles.UI.Button.Images, {
        git: {
            button_png: bundles.git.frames.button,
            button_on_png: bundles.git.frames.button_on,
            button_off_png: bundles.git.frames.button_off,
            SKIP_RESOLUTION: {
                padding: {
                    left: 0.1,
                    right: 0.1,
                    top: 0.1,
                    bottom: 0.1
                }
            }
        },

        editor: {
            button_png: bundles.editor_buttons.frames.button,
            button_on_png: bundles.editor_buttons.frames.button_on,
            button_off_png: bundles.editor_buttons.frames.button_off,
            SKIP_RESOLUTION: {
                padding: {
                    left: 0.1,
                    right: 0.1,
                    top: 0.1,
                    bottom: 0.1
                }
            }
        },

        editor_plus: {
            button_png: bundles.admin.frames.plus_button,
            button_on_png: bundles.admin.frames.plus_button,
            button_off_png: bundles.admin.frames.plus_button
        },

        wysiwyg: {
            button_png: bundles.wysiwyg.frames.button_on,
            button_on_png: bundles.wysiwyg.frames.button_on,
            button_off_png: bundles.wysiwyg.frames.button_off,
            SKIP_RESOLUTION: {
                padding: {
                    left: 0.05,
                    right: 0.05,
                    top: 0.05,
                    bottom: 0.05
                }
            }
        }
    });
}
