/**
 * Created by slava on 25/10/17
 */

cleverapps.UI.ImageFont = cc.Node.extend({
    ctor: function (string, font, params) {
        this._super();
        this.params = params || {};

        this.letters = new cc.Node();
        this.letters.setAnchorPoint2(0, 0);
        this.letters.setCascadeOpacityEnabled(true);
        this.letters.setCascadeColorEnabled(true);
        this.addChild(this.letters);

        this.setFont(font);

        this.setAnchorPoint(0.5, 0.5);
        this.setCascadeOpacityEnabled(true);

        this.setString(string);

        this.setCascadeColorEnabled(true);
    },

    setHorizontalAlignment: function () {
    },

    setVerticalAlignment: function () {
    },

    setDimensions: function () {
    },

    fitTo: function (maxWidth, maxHeight) {
        var i = 0;
        while (i < 10) {
            var width = this.width;
            var height = this.height;
            var canAttachLastLine = this.canAttachLastLine();
            if (maxWidth && width > maxWidth || maxHeight && height > maxHeight || canAttachLastLine) {
                i++;

                var scaleX = 1;
                var scaleY = 1;
                if (maxWidth && width > maxWidth) {
                    scaleX = maxWidth / width;
                }

                if (maxHeight && height > maxHeight) {
                    scaleY = maxHeight / height;
                }

                var scale = 0.9;
                var minScale = Math.min(scaleX, scaleY);
                if (minScale > 0.9 && minScale < 1) {
                    scale = minScale;
                }

                this.setFontSize(Math.floor(this.getFontSize() * scale));
            } else {
                break;
            }
            
            if (this.getFontSize() < cleverapps.UI.ImageFont.getFontSizeThreshold()) {
                this.setFontSize(cleverapps.UI.ImageFont.getFontSizeThreshold());
                return;
            }
        }
    },

    countToAnimation: function (time, amount, total) {
        this.runAction(new ImageFontCountTo(time, amount, total));
    },

    canAttachLastLine: function () {
        return false;
    },

    setFont: function (font) {
        var lookUp = font.name ? font.name : "default";

        var options = cleverapps.config.fonts.filter(function (imageFont) {
            if (imageFont.name === lookUp) {
                return cleverapps.bundleLoader.isLoaded(imageFont.bundle);
            }

            return false;
        }).sort(function (imageFontA, imageFontB) {
            var scaleA = Math.abs(1 - font.size / imageFontA.size);
            var scaleB = Math.abs(1 - font.size / imageFontB.size);

            return scaleA - scaleB;
        });

        var selectedFont = options[0];

        var preferredBundles = this.getPreferredBundles();
        if (preferredBundles) {
            var preferredOptions = options.filter(function (imageFont) {
                var imageFontBundles = bundles[imageFont.bundle].injectTo || [imageFont.bundle];
                return cleverapps.intersect(imageFontBundles, preferredBundles).length > 0;
            });

            selectedFont = preferredOptions[0] || selectedFont;
        }

        if (selectedFont === undefined) {
            console.log(font);
            throw "No image font";
        }

        this.font = font;
        this.baseFont = selectedFont;

        this.bundle = selectedFont.bundle;
        this.prefix = selectedFont.name + selectedFont.originalSize + "pt_";

        this.strokeSize = font.stroke ? font.stroke.size : 0;
        this.shadowOffset = font.shadow ? cc.size(font.shadow.direction.width || font.shadow.direction.x || 0, font.shadow.direction.height || font.shadow.direction.y || 0) : cc.size(0, 0);

        this.setColor(font.color || cleverapps.styles.COLORS.WHITE);
        this.setFontSize(font.size);

        var string = this.getString();
        if (string) {
            this.setString(string);
        }
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        var fontSize = this.getFontSize();
        var fontColor = this.getColor();

        this.setFont(this.font);
        this.setFontSize(fontSize);
        this.setColor(fontColor);
    },

    setString: function (string) {
        if (this.stopListeners) {
            return;
        }

        this.string = "" + string;

        this.letters.removeAllChildren(true);

        var totalSize = cc.size(0, 0);
        this.string.split("").forEach(function (letter) {
            this.createLetter(letter, totalSize);
        }, this);

        this.letters.setContentSize2(totalSize);

        this.setFontSize(this.getFontSize());
    },

    createLetter: function (letter, totalSize) {
        if (cleverapps.UI.ImageFont.LETTERS_MAP[letter]) {
            letter = cleverapps.UI.ImageFont.LETTERS_MAP[letter];
        }

        var image = bundles[this.bundle].frames[this.prefix + letter];
        if (!image) {
            console.log(this);
            console.log("No image for letter: ", letter);
            cleverapps.throwAsync("No image for letter: " + letter + ", bundle - " + this.bundle + ", prefix - " + this.prefix);
        }

        var sprite = new cc.Sprite(image);

        var width = 2 * Math.round(sprite.width / 2);
        if (this.params.fixedNumberWidth && letter >= "0" && letter <= "9") {
            if (!this.baseFont.zeroLetterWidth) {
                var zeroWidth = new cc.Sprite(bundles[this.bundle].frames[this.prefix + "0"]).width;
                this.baseFont.zeroLetterWidth = 2 * Math.round(zeroWidth / 2);
            }

            width = this.baseFont.zeroLetterWidth * cleverapps.styles.UI.ImageFont.fixedNumberWidth.stretch;
        }

        sprite.setAnchorPoint2(0.5, 0);
        sprite.setPositionRound(totalSize.width + width / 2, 0);
        this.letters.addChild(sprite);

        totalSize.width += width;
        totalSize.height = Math.max(totalSize.height, sprite.height);
    },

    getString: function () {
        return this.string;
    },

    getFontSize: function () {
        return Math.floor(this.letters.scale * this.baseFont.size);
    },

    setFontSize: function (size) {
        var properties = this.properties = cc.LabelTTF.__getFontProperties(cleverapps.UI.getFontName(this.font.font), size);
        var scale = size / this.baseFont.size;

        this.letters.setScale(scale);
        this.letters.setPosition(0, properties.descent - Math.ceil(size * cleverapps.styles.UI.ImageFont.SKIP_RESOLUTION.DESCENTS[this.baseFont.folder]) + this.strokeSize + Math.abs(this.shadowOffset.height));

        this.setContentSize2(this.letters.width * this.letters.scale, properties.ascent + properties.descent + this.strokeSize * 2 + Math.abs(this.shadowOffset.height) * 2);
    }
});

cleverapps.UI.ImageFont.MAX_MAGNITUDE = 1.25;

cleverapps.UI.ImageFont.LETTERS_MAP = {
    "/": "slash",
    "+": "plus",
    "-": "minus",
    ":": "colon",
    "#": "sharp",
    ".": "point",
    " ": "space",
    "[": "left_square_bracket",
    "]": "right_square_bracket",
    "*": "asterisk",
    "%": "percent"
};

cleverapps.UI.ImageFont.getFontSizeThreshold = function () {
    var threshold = 8;
    if (!cc.sys.isMobile) {
        threshold = 5;
    }
    return threshold * resolutionScale;
};

cleverapps.UI.ImageFont.IsApplicable = function (font, text) {
    if (!text) {
        return true;
    }

    var lookUp = font.name ? font.name : "default";

    var bundle, prefix;
    for (var i = 0; i < cleverapps.config.fonts.length; i++) {
        var imageFont = cleverapps.config.fonts[i];

        if (imageFont.name === lookUp) {
            var isLoaded = cleverapps.bundleLoader.isLoaded(imageFont.bundle);

            if (isLoaded) {
                bundle = imageFont.bundle;
                prefix = imageFont.name + imageFont.originalSize + "pt_";
            }
        }
    }

    if (!bundle) {
        return false;
    }

    for (i = 0; i < text.length; i++) {
        var code = cleverapps.UI.ImageFont.LETTERS_MAP[text[i]] || text[i];
        if (!bundles[bundle].frames[prefix + code]) {
            return false;
        }
    }

    return true;
};

cleverapps.UI.ImageFont.intertypeSetString = function (params) {
    var isImage = params.textObj instanceof cleverapps.UI.ImageFont;
    var canImage = cleverapps.UI.ImageFont.IsApplicable(params.font, params.string);

    if (isImage === canImage) {
        params.textObj.setString(params.string);
    } else {
        params.recreateFunc(params.string);
    }
};

cleverapps.styles.UI.ImageFont = {
    SKIP_RESOLUTION: {
        DESCENTS: {
            "marvin-round": 0.1,
            "marvin-round-nostroke": 0.1,
            "formal": 0,
            "custom/custom_digits": 0.15,
            "bryndanwrite": 0.015,
            "bryndanwrite-nostroke": 0.015,
            "custom/heroes_custom_digits": 0
        }
    },

    fixedNumberWidth: {
        stretch: 1
    }
};