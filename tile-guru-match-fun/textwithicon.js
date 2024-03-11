/**
 * Created by vladislav on 06.12.2021
 */

var TextWithIcon = cleverapps.Layout.extend({
    ctor: function (text, options) {
        this._super([], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: cleverapps.styles.TextWithIcon.margin,
            align: options && options.align
        });

        this.textOptions = options || {};
        this.customIcons = this.textOptions.icons || {};
        this.font = this.textOptions.font || cleverapps.styles.FONTS.BUTTON_TEXT;
        this.fontSize = this.font.size;

        this.setString(text);
    },

    calcCurrentSize: function () {
        var styles = cleverapps.styles.TextWithIcon;

        return this.items.reduce(function (size, part, index) {
            size.width += part.width * part.scale;
            if (index > 0) {
                size.width += styles.margin;
            }
            size.height = Math.max(size.height, part.height * part.scale);

            return size;
        }, cc.size(0, 0));
    },

    setFontSize: function (fontSize) {
        this.fontSize = fontSize;

        this._updateFontSize();
    },

    _updateFontSize: function () {
        this.items.forEach(function (item) {
            if (item.isIcon) {
                item.setScale(this.getIconScale(item));
            } else if (item.isSpace) {
                item.width = this.getSpaceWidth();
            } else {
                item.setFontSize(this.fontSize);
            }

            item.setPosition(0, 0);
        }, this);

        this.reshape();
    },

    getFontSize: function () {
        return this.fontSize;
    },

    fitTo: function (maxWidth, maxHeight) {
        for (var i = 0; i < 10; i++) {
            var size = this.calcCurrentSize();
            var offLimits = maxWidth && size.width > maxWidth || maxHeight && size.height > maxHeight;
            if (!offLimits) {
                break;
            }

            var scaleX = 1;
            var scaleY = 1;
            if (maxWidth && size.width > maxWidth) {
                scaleX = maxWidth / size.width;
            }

            if (maxHeight && size.height > maxHeight) {
                scaleY = maxHeight / size.height;
            }

            var scale = 0.9;
            var minScale = Math.min(scaleX, scaleY);
            if (minScale > 0.9 && minScale < 1) {
                scale = minScale;
            }

            var fontSize = Math.floor(this.getFontSize() * scale);
            var minimumHit = false;
            if (fontSize < cleverapps.UI.ImageFont.getFontSizeThreshold()) {
                minimumHit = true;
                fontSize = cleverapps.UI.ImageFont.getFontSizeThreshold();
            }

            this.setFontSize(fontSize);
            if (minimumHit) {
                break;
            }
        }
    },

    createItems: function (parts) {
        return parts.map(function (part) {
            if (TextWithIcon.ICONS[part] || this.customIcons[part]) {
                return this.createIcon(part);
            }
            if (part === " ") {
                return this.createSpace();
            }
            return this.createText(part);
        }, this);
    },

    getIconScale: function (icon) {
        var minHeight = this.fontSize * (this.textOptions.iconMinHeight || 1);
        var maxHeight = this.fontSize * (this.textOptions.iconMaxHeight || 1);

        if (icon.height < minHeight) {
            return minHeight / icon.height;
        }

        if (icon.height > maxHeight) {
            return maxHeight / icon.height;
        }

        return 1;
    },

    getSpaceWidth: function () {
        return this.fontSize * 0.2;
    },

    createIcon: function (key) {
        var image = this.chooseImage(key);

        var icon;
        if (typeof image === "string") {
            icon = new cc.Sprite(image);
        } else {
            icon = image;
        }

        icon.setScale(this.getIconScale(icon));
        icon.isIcon = true;

        return icon;
    },

    createSpace: function () {
        var space = new cc.Node();
        space.setAnchorPoint2();
        space.setContentSize(this.getSpaceWidth(), 1);
        space.isSpace = true;
        return space;
    },

    createText: function (string) {
        var text;
        if (this.textOptions.notLocalized) {
            text = cleverapps.UI.__generateNotLocalizedText(string, this.font);
        } else if (cleverapps.UI.ImageFont.IsApplicable(this.font, string)) {
            text = cleverapps.UI.generateImageText(string, this.font);
        } else {
            text = cleverapps.UI.generateOnlyText(string, this.font);
        }

        text.setFontSize(this.fontSize);

        return text;
    },

    parseText: function (string) {
        string = string.trim();
        string = string.replace(/ +/, " ");

        var parts = [];
        var keys = Object.keys(TextWithIcon.ICONS).concat(Object.keys(this.customIcons));

        var lastIndex = 0;

        while (true) {
            var minIndex = string.length, minKey = undefined;

            for (var i = 0; i < keys.length && minIndex !== lastIndex; ++i) {
                var key = keys[i];
                var index = string.indexOf(key, lastIndex);
                if (index >= 0 && index < minIndex) {
                    minIndex = index;
                    minKey = key;
                }
            }

            parts.push(string.slice(lastIndex, minIndex));

            if (!minKey) {
                break;
            }

            parts.push(minKey);
            lastIndex = minIndex + minKey.length;
        }

        var result = [];

        for (var current = 0; current < parts.length; ++current) {
            var part = parts[current];

            if (part.length === 0) {
                continue;
            }

            if (part.length === 1) {
                result.push(part);
                continue;
            }

            if (part[0] === " ") {
                result.push(" ");
            }

            result.push(part.trim());

            if (part[part.length - 1] === " ") {
                result.push(" ");
            }
        }

        return result;
    },

    chooseImage: function (key) {
        if (this.customIcons[key]) {
            return this.customIcons[key];
        }

        var options = TextWithIcon.ICONS[key].filter(function (imageOption) {
            return cleverapps.bundleLoader.isLoaded(imageOption.bundle);
        }).sort(function (imageOptionA, imageOptionB) {
            var scaleA = Math.abs(1 - this.fontSize / imageOptionA.size);
            var scaleB = Math.abs(1 - this.fontSize / imageOptionB.size);

            return scaleA - scaleB;
        });

        var selected = options[0];
        return bundles[selected.bundle].frames[selected.name];
    },

    setString: function (text) {
        this.originalString = text;

        var parts = this.parseText("" + text);
        this.items = this.createItems(parts);

        if (this.textOptions.width) {
            this.fitTo(this.textOptions.width, this.textOptions.height);
        }

        this.removeAllChildren();
        this.items.forEach(function (item) {
            this.addChild(item);
        }, this);
        this.reshape();
    },

    setFont: function (font) {
        this.font = font;
        this.fontSize = font.size;

        this.setString(this.originalString);
    }
});

TextWithIcon.IsApplicable = function (text, customIcons) {
    if (customIcons) {
        return true;
    }

    text += "";

    for (var key in TextWithIcon.ICONS) {
        if (text.indexOf(key) !== -1) {
            return true;
        }
    }

    return false;
};

TextWithIcon.ICONS_BY_NAME = {
    rubies: "$$",
    hard: "$$",
    gold: "$$",
    energy: "%%",
    coins: "@@",
    soft: "@@",
    wands: "++"
};

TextWithIcon.ICONS = {
    "$$": [
        {
            name: "gold_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        },
        {
            name: "big_gold_icon_png",
            bundle: "big_buttons",
            size: 90
        }
    ],
    "@@": [
        {
            name: "coin_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        },
        {
            name: "big_coin_icon_png",
            bundle: "big_buttons",
            size: 90
        }
    ],
    "##": [
        {
            name: "ad_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        },
        {
            name: "big_ad_icon_png",
            bundle: "big_buttons",
            size: 90
        }
    ],
    "**": [
        {
            name: "ok_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "&&": [
        {
            name: "yandex_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "}}": [
        {
            name: "playhop_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "{{": [
        {
            name: "kred_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "%%": [
        {
            name: "energy_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "^^": [
        {
            name: "instant_worker_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "++": [
        {
            name: "wand_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "--": [
        {
            name: "worker_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    ">>": [
        {
            name: "speedup_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ],
    "<<": [
        {
            name: "feed_icon_png",
            bundle: "buttons_inlined_icons",
            size: 50
        }
    ]
};

cleverapps.styles.TextWithIcon = {
    margin: 0
};
