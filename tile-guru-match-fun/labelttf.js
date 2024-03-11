/**
 * Created by vladislav on 06.07.2021
 */

cleverapps.UI.LabelTTF = cc.LabelTTF.extend({
    ctor: function (text, font, wrapWidth) {
        this._wrapWidth = 0;
        this._strokeOpacity = 0;
        this._super("", font);

        this.setWrapWidth(wrapWidth);
    },

    fitTo: function (maxWidth, maxHeight) {
        cleverapps.UI.ImageFont.prototype.fitTo.apply(this, arguments);

        this.debugRegionForFitTo = { width: maxWidth, height: maxHeight };
    },

    canAttachLastLine: function () {
        var strings = this._renderCmd._strings;
        if (!strings || strings.length <= 1) {
            return false;
        }

        var last = strings[strings.length - 1];
        if (this._string.slice(this._string.length - last.length - 1) === "\n" + last) {
            return false;
        }

        return strings[strings.length - 2].length >= 10 && last.length <= 2;
    },

    setWrapWidth: function (width) {
        if (width > 0) {
            width = Math.min(width, this.maxWidth());
        } else {
            width = Math.min(cleverapps.styles.UI.TTFText.wrapWidth, this.maxWidth());
        }

        if (this._wrapWidth !== width) {
            this._wrapWidth = width;

            var oldString = this.getString();
            cc.LabelTTF.prototype.setString.call(this, "");
            cc.LabelTTF.prototype.setString.call(this, oldString);
        }
    },

    setDimensions: function (width, height) {
        if (height === undefined) {
            height = width.height;
            width = width.width;
        }

        if (!(width > 0)) {
            width = 0;
        }

        if (!(height > 0)) {
            height = 0;
        }

        width = Math.min(width, this.maxWidth());
        this._super(width, height);
    },

    setFontSize: function (fontSize) {
        if (cleverapps.styles.UI.glyphScale) {
            if (["ja", "zh", "ko"].indexOf(cleverapps.settings.language) !== -1) {
                fontSize = Math.round(fontSize * cleverapps.styles.UI.glyphScale.scale);
            }
        }
        this._super(fontSize);
    },

    setFont: function (font) {
        this.setFontFillColor(font.color || cleverapps.styles.COLORS.WHITE);
        this.setFontSize(font.size);

        if (font.shadow) {
            this.enableShadow(font.shadow.color, font.shadow.direction, font.shadow.blur);
        } else {
            this.disableShadow();
        }

        if (font.stroke) {
            this.enableStroke(font.stroke.color, font.stroke.size);
        } else {
            this.disableStroke();
        }

        if (font.lineHeight) {
            this.setLineHeight(font.lineHeight);
        }

        var oldString = this.getString();
        cc.LabelTTF.prototype.setString.call(this, "");
        cc.LabelTTF.prototype.setString.call(this, oldString);
    },

    enableStroke: function (strokeColor, strokeSize) {
        this._super(strokeColor, strokeSize);

        var strokeOpacity = strokeColor.a / 255;

        if (this._strokeOpacity !== strokeOpacity) {
            this._strokeOpacity = strokeOpacity;
            this._renderCmd._setColorsString();
        }
    },

    byLetterAnimation: function (options) {
        options = options || {};
        var oneLetterDelay = options.speed || 0.03;
        var firstLetterDelay = options.delay || 0.1;

        if (cc.sys.isMobile && !cc.sys.isNative) {
            this.setOpacity(0);
            this.runAction(new cc.Sequence(new cc.DelayTime(firstLetterDelay), new cc.FadeIn(0.3)));
            if (options.callback) {
                options.callback();
            }
            return;
        }

        this._fullString = this.getString();
        var amountLetters = 0;
        if (this._byLetterAnimationRunning) {
            this.stopAllActions();
        }
        this._byLetterAnimationRunning = true;
        this._byLetterAnimationDone = function (skipped) {
            if (this._byLetterAnimationRunning) {
                this.stopAllActions();
                this._byLetterAnimationRunning = false;
                cc.LabelTTF.prototype.setString.call(this, this._fullString);
                this._byLetterAnimationDone = undefined;
                if (options.callback) {
                    options.callback(skipped);
                }
            }
        }.bind(this);

        cc.LabelTTF.prototype.setString.call(this, "");
        var prevHeight = undefined;
        var addOneLetter = function (delay) {
            this.runAction(new cc.Sequence(new cc.DelayTime(delay), new cc.CallFunc(function () {
                var prevLetter = (amountLetters > 0) ? this._fullString[amountLetters - 1] : undefined;
                amountLetters++;
                var curLetter = this._fullString[amountLetters - 1];

                if (prevLetter === " " && curLetter !== " ") {
                    var endWord = amountLetters;
                    while (endWord < this._fullString.length && this._fullString[endWord] !== " ") {
                        endWord++;
                    }

                    cc.LabelTTF.prototype.setString.call(this, this._fullString.substr(0, endWord));

                    if (prevHeight && this.height !== prevHeight) {
                        this._fullString = this._fullString.substr(0, amountLetters - 2) + "\n" + this._fullString.substr(amountLetters - 1);
                    }
                }

                cc.LabelTTF.prototype.setString.call(this, this._fullString.substr(0, amountLetters));
                if (amountLetters < this._fullString.length) {
                    addOneLetter(oneLetterDelay);
                    prevHeight = this.height;
                } else if (this._byLetterAnimationDone) {
                    this._byLetterAnimationDone();
                }
            }.bind(this))));
        }.bind(this);

        addOneLetter(firstLetterDelay);
    },

    byLetterAnimationFinish: function () {
        if (this._byLetterAnimationRunning) {
            this._byLetterAnimationDone(true);
        }
    },

    setString: function (text, toReplace) {
        text = cleverapps.UI.LabelTTF.GetLocalizedText(text, toReplace);
        cc.LabelTTF.prototype.setString.call(this, text);

        if (cleverapps.config.debugMode) {
            this.debugTextCode = Messages.debugTextCodes[text.toLowerCase().replace(/\s/g, ".")];
        }
    },

    maxWidth: function () {
        if (cc._renderType !== cc.game.RENDER_TYPE_CANVAS) {
            return cc.configuration.getMaxTextureSize() / cc.view.getDevicePixelRatio();
        }
        return cleverapps.styles.UI.TTFText.wrapWidth;
    }
});

cleverapps.UI.LabelTTF.GetLocalizedText = function (text, toReplace) {
    if (typeof text === "number") {
        return text + "";
    }

    if (typeof text !== "string") {
        return (text || "") + "";
    }
    return Messages.get(text, toReplace);
};

(function () {
    if (engine === "cocos2d") {
        cc.LabelTTF.prototype.setLineHeight = function (lineHeight) {
            this._lineHeight = lineHeight;
            this._setUpdateTextureDirty();
        };

        cc.LabelTTF.prototype._setUpdateTextureDirty = function () {
            this._needUpdateTexture = true;
            this._needUpdateTTF = true;
            this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.textDirty);
        };

        cc.LabelTTF.RenderCmd.prototype._setColorsString = function () {
            var locDisplayColor = this._displayedColor, node = this._node,
                locShadowColor = node._shadowColor || this._displayedColor;
            var locStrokeColor = node._strokeColor, locFontFillColor = node._textFillColor;
            var dr = locDisplayColor.r / 255, dg = locDisplayColor.g / 255, db = locDisplayColor.b / 255;

            this._shadowColorStr = "rgba(" + (0 | (dr * locShadowColor.r)) + "," + (0 | (dg * locShadowColor.g)) + ","
            + (0 | (db * locShadowColor.b)) + "," + node._shadowOpacity + ")";
            this._fillColorStr = "rgba(" + (0 | (dr * locFontFillColor.r)) + "," + (0 | (dg * locFontFillColor.g)) + ","
            + (0 | (db * locFontFillColor.b)) + ", 1)";
            this._strokeColorStr = "rgba(" + (0 | (dr * locStrokeColor.r)) + "," + (0 | (dg * locStrokeColor.g)) + ","
            + (0 | (db * locStrokeColor.b)) + "," + node._strokeOpacity + ")";
        };

        cc.LabelTTF.WebGLRenderCmd.prototype._setColorsString = cc.LabelTTF.RenderCmd.prototype._setColorsString;
        cc.LabelTTF.CacheRenderCmd.prototype._setColorsString = cc.LabelTTF.RenderCmd.prototype._setColorsString;
        cc.LabelTTF.CanvasRenderCmd.prototype._setColorsString = cc.LabelTTF.RenderCmd.prototype._setColorsString;
        cc.LabelTTF.CacheCanvasRenderCmd.prototype._setColorsString = cc.LabelTTF.RenderCmd.prototype._setColorsString;

        cc.LabelTTF.RenderCmd.prototype._updateTTF = function () {
            var node = this._node;
            if (!node._needUpdateTTF) {
                return;
            }
            node._needUpdateTTF = false;

            var pixelRatio = cc.view.getDevicePixelRatio();
            var wrapWidth = node._wrapWidth * pixelRatio || 0;
            var dimensionsWidth = node._dimensions.width * pixelRatio || 0;
            var dimensionsHeight = node._dimensions.height * pixelRatio || 0;
            var i;

            this._measureConfig();

            var locStrokeShadowOffsetX = 0, locStrokeShadowOffsetY = 0;
            if (node._strokeEnabled) {
                locStrokeShadowOffsetX = locStrokeShadowOffsetY = node._strokeSize * 2;
            }

            if (node._shadowEnabled) {
                locStrokeShadowOffsetX += Math.abs(node._shadowOffset.x) * 2;
                locStrokeShadowOffsetY += Math.abs(node._shadowOffset.y) * 2;
            }

            locStrokeShadowOffsetX *= pixelRatio;
            locStrokeShadowOffsetY *= pixelRatio;

            var reservedWidth = locStrokeShadowOffsetX + 2 * pixelRatio;

            if (node._getFontStyle() !== "normal") {
                reservedWidth += Math.ceil(node._fontSize * 0.3);
            }

            var strings = this._strings = node._string.split("\n");

            var maxWidth = dimensionsWidth || wrapWidth;
            if (maxWidth > 0) {
                var lineWidth = Math.max(reservedWidth, maxWidth - reservedWidth);

                for (i = 0; i < strings.length; ++i) {
                    strings[i] = strings[i].trim();
                    this._checkWarp(strings, i, lineWidth);
                }

                maxWidth = dimensionsWidth;
            }

            this._isMultiLine = strings.length > 1;

            if (!maxWidth) {
                for (i = 0; i < strings.length; ++i) {
                    lineWidth = Math.ceil(this._measure(strings[i]));
                    if (lineWidth > maxWidth) {
                        maxWidth = lineWidth;
                    }
                }

                if (maxWidth === 0) {
                    reservedWidth = 0;
                }

                maxWidth += reservedWidth;
            }

            var locWidth = maxWidth;
            if (cc._renderType !== cc.game.RENDER_TYPE_CANVAS) {
                locWidth = Math.min(locWidth, cc.configuration.getMaxTextureSize());
            }

            var locHeight;

            if (dimensionsHeight) {
                locHeight = dimensionsHeight;
            } else {
                locHeight = node.getLineHeight() * pixelRatio * strings.length + locStrokeShadowOffsetY;
            }

            node.setContentSize(locWidth, locHeight);
            node._strokeShadowOffsetX = locStrokeShadowOffsetX;
            node._strokeShadowOffsetY = locStrokeShadowOffsetY;

            var locAP = node._anchorPoint;
            this._anchorPointInPoints.x = (reservedWidth * 0.5) + ((locWidth - reservedWidth) * locAP.x);
            this._anchorPointInPoints.y = (locStrokeShadowOffsetY * 0.5) + ((locHeight - locStrokeShadowOffsetY) * locAP.y);
        };

        cc.LabelTTF.WebGLRenderCmd.prototype._updateTTF = cc.LabelTTF.RenderCmd.prototype._updateTTF;
        cc.LabelTTF.CacheRenderCmd.prototype._updateTTF = cc.LabelTTF.RenderCmd.prototype._updateTTF;
        cc.LabelTTF.CanvasRenderCmd.prototype._updateTTF = cc.LabelTTF.RenderCmd.prototype._updateTTF;
        cc.LabelTTF.CacheCanvasRenderCmd.prototype._updateTTF = cc.LabelTTF.RenderCmd.prototype._updateTTF;

        cc.LabelTTF.RenderCmd.prototype._setFontStyle = function (fontNameOrFontDef, fontSize, fontStyle, fontWeight) {
            if (fontNameOrFontDef instanceof cc.FontDefinition) {
                this._fontStyleStr = fontNameOrFontDef._getCanvasFontStr();
            } else {
                this._fontStyleStr = fontStyle + " " + fontWeight + " " + cc.view.getDevicePixelRatio() * fontSize + "px '" + fontNameOrFontDef + "'";
            }

            this._fontProperties = cc.LabelTTF.__getFontProperties(fontNameOrFontDef, fontSize);
            this._fontClientHeight = this._fontProperties.ascent + this._fontProperties.descent;
        };

        cc.LabelTTF.WebGLRenderCmd.prototype._setFontStyle = cc.LabelTTF.RenderCmd.prototype._setFontStyle;
        cc.LabelTTF.CacheRenderCmd.prototype._setFontStyle = cc.LabelTTF.RenderCmd.prototype._setFontStyle;
        cc.LabelTTF.CanvasRenderCmd.prototype._setFontStyle = cc.LabelTTF.RenderCmd.prototype._setFontStyle;
        cc.LabelTTF.CacheCanvasRenderCmd.prototype._setFontStyle = cc.LabelTTF.RenderCmd.prototype._setFontStyle;

        cc.LabelTTF._textBaseline = ["alphabetic", "alphabetic", "alphabetic"];
        cc.LabelTTF.RenderCmd.prototype._saveStatus = function () {
            var node = this._node;
            var locStrokeShadowOffsetX = node._strokeShadowOffsetX, locStrokeShadowOffsetY = node._strokeShadowOffsetY;
            var locContentSizeHeight = node._contentSize.height - locStrokeShadowOffsetY, locVAlignment = node._vAlignment,
                locHAlignment = node._hAlignment;
            var dx = locStrokeShadowOffsetX * 0.5,
                dy = locContentSizeHeight + locStrokeShadowOffsetY * 0.5;
            var xOffset, yOffset, OffsetYArray = [];
            var locContentWidth = node._contentSize.width - locStrokeShadowOffsetX;

            var pixelRatio = cc.view.getDevicePixelRatio();
            var lineHeight = node.getLineHeight() * pixelRatio;
            var ascent = this._fontProperties.ascent * pixelRatio;
            var descent = this._fontProperties.descent * pixelRatio;

            ascent = ascent * lineHeight / (ascent + descent);
            descent = descent * lineHeight / (ascent + descent);

            if (locHAlignment === cc.TEXT_ALIGNMENT_RIGHT) {
                xOffset = locContentWidth;
            } else if (locHAlignment === cc.TEXT_ALIGNMENT_CENTER) {
                xOffset = locContentWidth / 2;
            } else {
                xOffset = 0;
            }

            if (this._isMultiLine) {
                var locStrLen = this._strings.length;
                if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
                    yOffset = -locContentSizeHeight + ascent;
                } else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
                    yOffset = -lineHeight * (locStrLen - 1) - descent;
                } else {
                    yOffset = -locContentSizeHeight / 2 - lineHeight * (locStrLen - 1) / 2 - (descent - ascent) / 2;
                }

                for (var i = 0; i < locStrLen; i++) {
                    var tmpOffsetY = lineHeight * i + yOffset;
                    OffsetYArray.push(tmpOffsetY | 0);
                }
            } else {
                if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
                    yOffset = -locContentSizeHeight + ascent;
                } else if (locVAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
                    yOffset = -descent;
                } else {
                    yOffset = -locContentSizeHeight / 2 - (descent - ascent) / 2;
                }
                OffsetYArray.push(yOffset | 0);
            }
            var tmpStatus = {
                contextTransform: cc.p(dx, dy),
                xOffset: xOffset,
                OffsetYArray: OffsetYArray
            };
            this._status.push(tmpStatus);
        };

        cc.LabelTTF.WebGLRenderCmd.prototype._saveStatus = cc.LabelTTF.RenderCmd.prototype._saveStatus;
        cc.LabelTTF.CacheRenderCmd.prototype._saveStatus = cc.LabelTTF.RenderCmd.prototype._saveStatus;
        cc.LabelTTF.CanvasRenderCmd.prototype._saveStatus = cc.LabelTTF.RenderCmd.prototype._saveStatus;
        cc.LabelTTF.CacheCanvasRenderCmd.prototype._saveStatus = cc.LabelTTF.RenderCmd.prototype._saveStatus;
    }

    cc.LabelTTF.METRICS_STRING = "|ÉÅÇعر";
    cc.LabelTTF.BASELINE_SYMBOL = "M";
    cc.LabelTTF.__labelPropertiesCanvas = document.createElement("canvas");
    cc.LabelTTF.__labelPropertiesContext = cc.LabelTTF.__labelPropertiesCanvas.getContext("2d");
    cc.LabelTTF.__fontPropertiesCache = {};
    cc.LabelTTF.__getFontProperties = function (fontNameOrFontDef, fontSize) {
        var key, fontStyleStr;

        if (fontNameOrFontDef instanceof cc.FontDefinition) {
            fontSize = fontNameOrFontDef.fontSize;
            key = fontNameOrFontDef._getCanvasFontStr();
            fontStyleStr = fontNameOrFontDef.fontStyle + " " + fontNameOrFontDef.fontWeight + " " + fontNameOrFontDef.fontSize + "px '" + fontNameOrFontDef.fontName + "'";
        } else if (fontSize === undefined) {
            key = fontNameOrFontDef;
            fontStyleStr = fontNameOrFontDef;
        } else {
            key = fontNameOrFontDef + "." + fontSize;
            fontStyleStr = fontSize + "px '" + fontNameOrFontDef + "'";
        }

        var properties = cc.LabelTTF.__fontPropertiesCache[key];
        if (properties) {
            return properties;
        }

        properties = {
            ascent: 0,
            descent: 0
        };

        var canvas = cc.LabelTTF.__labelPropertiesCanvas;
        var context = cc.LabelTTF.__labelPropertiesContext;
        context.font = fontStyleStr;

        var text = cc.LabelTTF.METRICS_STRING + cc.LabelTTF.BASELINE_SYMBOL;
        var textMetrics = context.measureText(text);

        if (textMetrics.actualBoundingBoxAscent && textMetrics.actualBoundingBoxDescent) {
            cc.LabelTTF.__fontPropertiesCache[key] = properties = {
                ascent: textMetrics.actualBoundingBoxAscent,
                descent: textMetrics.actualBoundingBoxDescent
            };
            return properties;
        }

        var canvasWidth = Math.ceil(textMetrics.width);
        var symbolMetrics = context.measureText(cc.LabelTTF.BASELINE_SYMBOL);
        var canvasHeight = Math.ceil(2 * symbolMetrics.width);
        var baseline = Math.ceil(1.4 * symbolMetrics.width);

        if (!canvasWidth || !canvasHeight) {
            return {
                ascent: Math.round(fontSize * 1.06),
                descent: Math.round(fontSize * 0.3)
            };
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.fillStyle = "#f00";
        context.fillRect(0, 0, canvasWidth, canvasHeight);

        context.font = fontStyleStr;

        context.textBaseline = "alphabetic";
        context.fillStyle = "#000";
        context.fillText(text, 0, baseline);

        var imagedata = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
        var line = canvasWidth * 4;

        var idx = 0;
        var stop = false;

        for (var i = 0; i < baseline; ++i) {
            for (var j = 0; j < line; j += 4) {
                if (imagedata[idx + j] !== 255) {
                    stop = true;
                    break;
                }
            }
            if (stop) {
                break;
            }
            idx += line;
        }
        properties.ascent = baseline - i;

        idx = imagedata.length - line;
        stop = false;

        for (i = canvasHeight; i > baseline; --i) {
            for (j = 0; j < line; j += 4) {
                if (imagedata[idx + j] !== 255) {
                    stop = true;
                    break;
                }
            }
            if (stop) {
                break;
            }
            idx -= line;
        }
        properties.descent = i - baseline;

        cc.LabelTTF.__fontPropertiesCache[key] = properties;
        return properties;
    };
}());

cleverapps.overrideStyles(cleverapps.styles.UI, {
    TTFText: {
        wrapWidth: 1000
    }
});
