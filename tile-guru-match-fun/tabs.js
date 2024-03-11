/**
 * Created by slava on 6/9/18
 */

var Tabs = cleverapps.Layout.extend({
    ctor: function (tabsInfo, options) {
        this.buttons = {};

        var styles = cleverapps.styles.Tabs;
        this.direction = options.direction === undefined ? styles.direction : options.direction;
        this.images = options.type || this.direction === cleverapps.UI.VERTICAL && Tabs.Types.tabs_vertical || Tabs.Types.tabs_horizontal;
        this.canChangeIconColor = !(typeof LandMarkDonorWindow !== "undefined"
            && cleverapps.windows.currentWindow() instanceof LandMarkDonorWindow
        && cleverapps.config.name === "fairy");

        this.onTabChanged = function () {};

        var buttons = Object.keys(tabsInfo).map(function (id, index) {
            return this.createButton(id, tabsInfo[id], -(index + 1), options);
        }, this);

        this._super(buttons, {
            direction: this.direction,
            margin: options.margin === undefined ? styles.margin : options.margin
        });
    },

    createButton: function (id, info, order, options) {
        var styles = cleverapps.styles.Tabs.buttons;
        var width = options.width || styles.width;
        var height = options.height || styles.height;
        var margin = options.margin || styles.margin || 0;
        var rect = cc.rectSubPadding(cc.rect(0, 0, width, height), cc.padding(styles.padding, options.padding));

        var button = this.buttons[id] = cleverapps.UI.createScale9Sprite(this.images.off_png);
        button.info = info;
        button.baseScale = 1;
        button.baseZOrder = order;
        button.setLocalZOrder(button.baseZOrder);
        button.setContentSize(width, height);

        var icon;

        if (info.icon) {
            icon = button.icon = new cc.Sprite(info.icon);
        }

        if (info.node) {
            icon = info.node;
        }

        if (info.text) {
            var text = button.text = cleverapps.UI.generateOnlyText(info.text, cleverapps.styles.FONTS.TABS_TEXT_FONT);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        }

        var content;

        if (icon && text) {
            text.setDimensions(rect.width - icon.width - margin, 0);
            text.fitTo(undefined, rect.height);
            text.setDimensions(text.width, rect.height);

            content = new cleverapps.Layout([icon, text], {
                direction: cleverapps.UI.HORIZONTAL,
                margin: margin
            });
        } else if (icon) {
            content = icon;
        } else if (text) {
            content = text;
            text.fitTo(rect.width, rect.height);
        }

        if (text) {
            text.baseFontSzie = text.getFontSize();
        }

        content.setPositionRound(rect.x + rect.width / 2, rect.y + rect.height / 2);
        button.addChild(content);

        if (!info.disabled) {
            button.clickHandler = cleverapps.UI.onClick(button, function () {
                if (this.selectedId !== id) {
                    this.activateTab(id);
                    return;
                }

                if (info.content.onClickTab) {
                    info.content.onClickTab();
                }
            }.bind(this));
            cleverapps.UI.applyHover(button);
        }

        button.setRecCascadeColorEnabled(true);
        button.setCascadeOpacityEnabledRecursively(true);

        if (info.disabled) {
            cleverapps.UI.convertToGrayScale(button);
        }

        if (info.tooltip) {
            cleverapps.tooltipManager.create(button, info.tooltip);
        }

        if (info.attention) {
            this.setAttention(id, info.attention);
        }

        return button;
    },

    getActive: function () {
        return this.selectedId;
    },

    activeTab: function () {
        return this.buttons[this.selectedId].info.content;
    },

    activateTab: function (selectedId, params) {
        selectedId = selectedId.toString();

        if (this.selectedId === selectedId) {
            return;
        }

        cleverapps.audio.playSound(bundles.main.urls.click_effect);

        Object.keys(this.buttons).forEach(function (id) {
            if (id === selectedId) {
                this.onSelectTab(id, params);
            } else {
                this.onUnSelectTab(id);
            }
        }, this);

        this.onTabChanged(this.selectedId);
    },

    onSelectTab: function (id, params) {
        var button = this.buttons[id];
        var info = button.info;

        button.ignoreScale = true;
        button.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.images.on_png));

        button.setLocalZOrder(1);

        button.baseScale = 1.03;
        button.applyInteractiveScale();

        if (info.updateTitle) {
            info.updateTitle();
        }

        if (button.text) {
            button.text.setFont(cleverapps.styles.FONTS.TABS_TEXT_FONT);
            button.text.setFontSize(button.text.baseFontSzie);
            button.text.setOpacity(255);
        }

        if (button.icon) {
            if (this.canChangeIconColor) {
                button.icon.setColor(cleverapps.styles.FONTS.TABS_TEXT_FONT.color);
            }
            button.icon.setOpacity(255);
        }

        if (info.content === undefined) {
            info.content = info.generator();
        }

        info.content.setVisible(true);

        if (info.content.onSelectTab) {
            info.content.onSelectTab(params);
        }

        this.selectedId = id;
    },

    onUnSelectTab: function (id) {
        var button = this.buttons[id];
        var info = button.info;

        button.ignoreScale = false;
        button.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.images.off_png));

        button.setLocalZOrder(button.baseZOrder);

        button.baseScale = 1;
        button.applyInteractiveScale();

        if (button.text) {
            button.text.setFont(cleverapps.styles.FONTS.TABS_TEXT_FONT_DISABLED);
            button.text.setFontSize(button.text.baseFontSzie);
            button.text.setOpacity(cleverapps.styles.Tabs.buttons.disabled.opacity);
        }

        if (button.icon) {
            if (this.canChangeIconColor) {
                button.icon.setColor(cleverapps.styles.FONTS.TABS_TEXT_FONT_DISABLED.color);
                button.icon.setOpacity(cleverapps.styles.Tabs.buttons.disabled.opacity);
            } else {
                button.icon.setOpacity(cleverapps.styles.Tabs.buttons.disabled.colorIconOpacity);
            }
        }

        if (info.content === undefined) {
            return;
        }

        info.content.setVisible(false);
        info.content.stopAllActions();

        if (info.content.onUnSelectTab) {
            info.content.onUnSelectTab();
        }
    },

    setAttention: function (id, attention) {
        var styles = cleverapps.styles.Tabs.attention;
        var button = this.buttons[id];

        if (button.attention) {
            button.attention.removeFromParent();
            delete button.attention;
        }

        if (attention) {
            button.attention = new Attention();
            button.attention.setPositionRound(styles);

            button.addChild(button.attention);
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TABS_TEXT_FONT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    TABS_TEXT_FONT_DISABLED: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

Tabs.Types = cleverapps.overrideTemplates({}, {
    tabs_vertical: {
        off_png: bundles.tabs.frames.vertical_shop_tab_off,
        on_png: bundles.tabs.frames.vertical_shop_tab_on
    },

    tabs_horizontal: {
        off_png: bundles.tabs.frames.shop_tab_off,
        on_png: bundles.tabs.frames.shop_tab_on
    },

    tabs_custom: {
        off_png: bundles.tabs.frames.custom_tab_off,
        on_png: bundles.tabs.frames.custom_tab_on
    }
});

cleverapps.styles.Tabs = {
    margin: 0,
    direction: cleverapps.UI.HORIZONTAL,

    attention: {
        x: 0,
        y: 0
    },

    buttons: {
        width: 135,
        height: 240,
        margin: 5,
        padding: {
            x: 15,
            y: 10
        },

        disabled: {
            opacity: 127,
            colorIconOpacity: 127
        }
    }
};
