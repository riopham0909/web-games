/**
 * Created by slava on 5/8/17.
 */
resolutionScale = 1;

cleverapps.UI = {
    stableKeys: [
        "SKIP_RESOLUTION",
        "descent",
        "verticalAlignment",
        "opacity",
        "scale9",
        "parent",
        "scale",
        "minScale",
        "maxScale",
        "rotation",
        "baseScale",
        "zoomScale",
        "mobileScale",
        "innerScale",
        "squareScale",
        "zoom",
        "scaleX",
        "scaleY",
        "anchorX",
        "anchorY",
        "zIndex",
        "zOrder",
        "SIDEBAR_WIDTH",
        "MIN_SIDEBAR_X",
        "duration",
        "delay",
        "idleDelay",
        "visiblePages",
        "type",
        "hideDirection",
        "number",
        "dialogueStages",
        "skew",
        "anchor",
        "factorX",
        "factorY",
        "smallMargin",
        "threshold",
        "timeScale",
        "timeout",
        "fadeIn",
        "stretch",
        "columns",
        "align",
        "patternSize"
    ],

    needUpdateSizes: function (object, i, value) {
        if (value instanceof cc.Color) {
            return false;
        }
        if (i === "direction" && typeof value !== "object") {
            return false;
        }

        if (cleverapps.UI.stableKeys.indexOf(i) >= 0) {
            return false;
        }

        return true;
    },

    updateSizes: function (resolutionScale) {
        var changed = {};
        var updated = [];

        var update = function (object) {
            if (object.isUpdated) {
                return;
            }
            object.isUpdated = true;
            updated.push(object);

            for (var i in object) {
                var value = object[i];

                if (typeof value === "number") {
                    if (Array.isArray(object)) {
                        continue;
                    }
                    if (cleverapps.UI.needUpdateSizes(object, i, value)) {
                        changed[i] = true;
                        object[i] *= resolutionScale;
                        // if (i === "size")
                        object[i] = Math.round(object[i]);
                    }
                } else if (typeof value === "object") {
                    if (!cleverapps.UI.needUpdateSizes(object, i, value)) {
                        // console.log('Skip: ' + i);
                    } else {
                        update(value);
                    }
                }
            }
        };

        if (!cleverapps.styles.isUpdated) {
            update(cleverapps.styles);
            cleverapps.config.fonts.forEach(function (font) {
                font.originalSize = font.size + "";
            });
            update(cleverapps.config.fonts);
            cleverapps.values(Forces).forEach(function (force) {
                force.style && update(force.style);
                force.finger && update(force.finger);
            });

            updated.forEach(function (object) {
                delete object.isUpdated;
            });

            cleverapps.styles.isUpdated = true;
        }
    },

    selectSkinResources: function (skinSize) {
        var selectResources = function (object, skinSize, deep) {
            for (var i in object) {
                if (typeof object[i] === "string") {
                    object[i] = object[i].replace("/%r/", "/" + skinSize + "/");
                }

                if (deep && typeof object[i] === "object") {
                    selectResources(object[i], skinSize, deep);
                }
            }
        };

        for (var name in bundles) {
            var bundle = bundles[name];

            selectResources(bundle.urls, skinSize);
            selectResources(bundle.frames, skinSize);
            selectResources(bundle.jsons, skinSize);
        }

        for (var i in cleverapps.styles) {
            var object = cleverapps.styles[i];
            selectResources(object, skinSize, true);
        }

        if (typeof HeroesLibrary === "object") {
            selectResources(HeroesLibrary, skinSize, true);
        }

        if (typeof unpackedMap !== "undefined") {
            for (name in unpackedMap) {
                if (name.indexOf("/%r/") !== -1) {
                    unpackedMap[name.replace("/%r/", "/" + skinSize + "/")] = unpackedMap[name];
                    delete unpackedMap[name];
                }
            }
        }
    },

    HORIZONTAL: 0,
    VERTICAL: 1,
    AUTO: 2,

    ALIGN_START: 1,
    ALIGN_CENTER: 2,
    ALIGN_END: 3,

    DOCK_RIGHT: "right",
    DOCK_LEFT: "left",
    DOCK_LR: "lr",

    /**
     * @param list
     * @param options: margin, direction, x || y
     * @returns total Height or Width
     */
    arrangeWithMargins: function (list, options) {
        var margin = options.margin;

        if (margin === undefined) {
            margin = 0;
        }

        var total = 0;
        if (options.direction === cleverapps.UI.HORIZONTAL) {
            total = options.x || 0;
        } else {
            total = options.y || 0;
        }

        var iterator = options.iterator;
        if (!iterator) {
            iterator = function (object, x, y) {
                if (options.align === cleverapps.UI.ALIGN_START || options.align === cleverapps.UI.ALIGN_END) {
                    var size = (options.direction === cleverapps.UI.HORIZONTAL) ? object.height * object.scaleY / 2 : object.width * object.scaleX / 2;
                    if (options.align === cleverapps.UI.ALIGN_END) {
                        size = -size;
                    }

                    if (options.direction === cleverapps.UI.HORIZONTAL) {
                        y += size;
                    } else {
                        x += size;
                    }
                }

                object.setPositionRound(x, y);
            };
        }

        list.forEach(function (object, id) {
            if (options.direction === undefined || options.direction === cleverapps.UI.VERTICAL && !options.reversed) {
                object = list[list.length - 1 - id];
            }

            var scaleX = object.baseScaleX || object.baseScale || object.scaleX;
            var scaleY = object.baseScaleY || object.baseScale || object.scaleY;

            if (options.direction === cleverapps.UI.HORIZONTAL) {
                var y = object.y;
                if (options.y !== undefined) {
                    y = options.y - (0.5 - object.anchorY) * object.height * Math.abs(scaleY);
                }
                iterator(object, total + object.width * Math.abs(scaleX) * object.anchorX, y);
                total += object.width * Math.abs(scaleX);
            } else {
                var x = object.x;
                if (options.x !== undefined) {
                    x = options.x - (0.5 - object.anchorX) * object.width * Math.abs(scaleX);
                }
                iterator(object, x, total + object.height * Math.abs(scaleY) * object.anchorY);
                total += object.height * Math.abs(scaleY);
            }
            total += margin;
        });

        return total - margin;
    },

    calculateContentSize: function (node) {
        var width = 0, height = 0;
        node.children.forEach(function (child) {
            if (width < child.x + child.width * child.scaleX / 2) {
                width = child.x + child.width * child.scaleX / 2;
            }

            if (height < child.y + child.height * child.scaleY / 2) {
                height = child.y + child.height * child.scaleY / 2;
            }
        });

        return cc.size(Math.round(width), Math.round(height));
    },

    fitToBox: function (view, options) {
        var signX = view.scaleX < 0 ? -1 : 1;
        var signY = view.scaleY < 0 ? -1 : 1;

        var maxScale = options.maxScale || 1;
        var minScale = options.minScale || 0;
        var scaleX = signX * options.width / view.width || maxScale;
        var scaleY = signY * options.height / view.height || maxScale;

        var scale = Math.max(minScale, Math.min(scaleX, scaleY, maxScale));
        view.setScaleX(scale * signX);
        view.setScaleY(scale * signY);
    },

    calcBoundaries: function (overlappingList, options) {
        options = options || {};
        var scene = cleverapps.scenes.getRunningScene();
        var sceneSize = cleverapps.UI.getSceneSize();
        var bgSize = cleverapps.UI.getBgSize();

        var c = options.lovesPosition || options.centerPoint || scene.convertToWorldSpace(cc.p(sceneSize.width / 2, sceneSize.height / 2));
        var squareEdge = Math.min(sceneSize.width / 2, sceneSize.height / 2);
        var avail = cc.rect(c.x - squareEdge, c.y - squareEdge, 2 * squareEdge, 2 * squareEdge);

        var boxes = overlappingList.map(function (node) {
            var box = node.getGlobalBoundingBox();

            if (cleverapps.config.debugMode) {
                if (box.x < c.x && c.x < box.x + box.width && box.y < c.y && c.y < box.y + box.height) {
                    throw "Incorrect center point! Should be outside all boxes.";
                }
            }

            return box;
        });

        var bannerBox = cleverapps.bannerAd.getGlobalBoundingBox();
        if (bannerBox) {
            boxes.push(bannerBox);
        }

        boxes.forEach(function (box) {
            if (cc.rectIntersectsRect(avail, box)) {
                var nearest = cc.nearestToRect(box, c);
                if (nearest.x !== c.x) {
                    squareEdge = Math.min(Math.abs(nearest.x - c.x), squareEdge);
                }
                if (nearest.y !== c.y) {
                    squareEdge = Math.min(Math.abs(nearest.y - c.y), squareEdge);
                }
                avail = cc.rect(c.x - squareEdge, c.y - squareEdge, 2 * squareEdge, 2 * squareEdge);
            }
        });

        var order = (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) ? ["y", "x"] : ["x", "y"];

        var eps = 1e-6;

        var center = cc.p(avail.x + avail.width / 2, avail.y + avail.height / 2);
        order.forEach(function (coordinate) {
            var dimension = coordinate === "x" ? "width" : "height";

            avail[coordinate] = 0;
            avail[dimension] = bgSize[dimension];

            boxes.forEach(function (box) {
                if (!cc.rectIntersectsRect(avail, box)) {
                    return;
                }

                var intersection = cc.rectIntersection(avail, box);
                if (intersection.width < eps || intersection.height < eps) {
                    return;
                }

                if (box[coordinate] < c[coordinate]) {
                    avail[dimension] = (avail[coordinate] + avail[dimension]) - (box[coordinate] + box[dimension]);
                    avail[coordinate] = box[coordinate] + box[dimension];
                } else if (box[coordinate] > center[coordinate]) {
                    avail[dimension] = box[coordinate] - avail[coordinate];
                }
            });

            if (coordinate === "x") {
                var width = Math.min(center.x - avail.x, avail.x + avail.width - center.x);
                avail.x = center.x - width;
                avail.width = width * 2;
            }
        });

        return avail;
    },

    inflateToBoundaries: function (view, overlappingList, options) {
        var availableRect = cleverapps.UI.calcBoundaries(overlappingList, options);
        var viewRect = options.viewRect || view.calcRect();

        if (viewRect.width === 0 || viewRect.height === 0) {
            return;
        }

        if (options.padding) {
            availableRect = cc.rectSubPadding(availableRect, cc.padding(options.padding));
        }

        var newScale = Math.min(availableRect.width / viewRect.width, availableRect.height / viewRect.height, options.maxScale || 1);
        newScale = Math.max(newScale, options.minScale || 0.25);
        if (cleverapps.config.editorMode || (cleverapps.config.wysiwygMode && cleverapps.scenes.getRunningScene().scale !== 1)) {
            newScale = 1;
        }
        var newPosition = cc.rectGetCenter(availableRect);

        if (options.lovesPosition) {
            newPosition = cc.nearestToRect(
                cc.rectSubPadding(availableRect, cc.padding(viewRect.height * newScale / 2, viewRect.width * newScale / 2)),
                options.lovesPosition
            );
        }

        newPosition = view.parent.convertToNodeSpace(newPosition);

        view.newScale = newScale;

        var callback = function () {
            options.callback && options.callback(newScale);
        };

        if (!options.animate) {
            view.setScale(newScale);
            view.setPosition(newPosition);
            callback();
        } else {
            view.stopAllActions();
            view.runAction(new cc.Sequence(
                new cc.DelayTime(options.delay || 0),
                new cc.Spawn(
                    new cc.ScaleTo(0.3, newScale),
                    new cc.MoveTo(0.3, newPosition)
                ),
                new cc.CallFunc(callback)
            ));
        }
    },

    fitToBounds: function (positions, size, bounds, offset) {
        positions.map(function (position) {
            if (position.x < bounds.x) {
                position.x = bounds.x + offset.x;
            }

            if (position.x + size.width > bounds.x + bounds.width) {
                position.x = bounds.x + bounds.width - size.width - offset.x;
            }

            return position;
        });
        return positions;
    },

    findPositionsAroundRect: function (targetRect, avoidedRect, bounds, offset) {
        offset = offset || { x: 10, y: 10 };
        var positions = [];

        if (avoidedRect.y - targetRect.height - offset.y >= bounds.y) {
            positions.push({
                x: avoidedRect.x,
                y: avoidedRect.y - targetRect.height - offset.y
            });
        }

        if (avoidedRect.y + avoidedRect.height + targetRect.height + offset.y <= bounds.height) {
            positions.push({
                x: avoidedRect.x,
                y: avoidedRect.y + avoidedRect.height + offset.y
            });
        }

        positions.push({
            x: avoidedRect.x - targetRect.width - offset.x,
            y: avoidedRect.y
        });

        positions.push({
            x: avoidedRect.x + avoidedRect.width + offset.x,
            y: avoidedRect.y
        });

        return this.fitToBounds(positions, targetRect, bounds, offset);
    },

    rectsIntersection: function (targetRect, rects) {
        for (var i = 0; i < rects.length; i++) {
            var rect = rects[i];
            var intersection = cc.rectIntersectsRect(targetRect, rect);
            if (intersection) {
                return true;
            }
        }
        return false;
    },

    checkPositions: function (preferredPositions, rects, targetRect) {
        for (var i = 0; i < preferredPositions.length; i++) {
            var position = preferredPositions[i];

            targetRect.x = position.x;
            targetRect.y = position.y;

            var isIntersectionWithNodes = this.rectsIntersection(targetRect, rects);

            if (!isIntersectionWithNodes) {
                return position;
            }
        }
    },

    findPosition: function (view, preferredPositions, avoidedNodes) {
        var convertPositionToNodeSpace = function (newPosition) {
            newPosition = view.parent.convertToNodeSpace({
                x: newPosition.x + view.width * view.anchorX,
                y: newPosition.y + view.height * view.anchorY
            });
            return newPosition;
        };

        preferredPositions = preferredPositions.map(function (position) {
            position = view.calculatePositionRound(position);
            return view.parent.convertToWorldSpace({
                x: position.x - view.width * (1 - view.anchorX),
                y: position.y - view.height * (1 - view.anchorY)
            });
        });

        avoidedNodes = avoidedNodes.map(function (node) {
            return node.getBoundingBoxToWorld();
        });

        var targetRect = view.getBoundingBoxToWorld();
        var sceneSize = cleverapps.UI.getSceneSize();

        avoidedNodes.forEach(function (rect) {
            preferredPositions = preferredPositions.concat(this.findPositionsAroundRect(targetRect, rect, {
                x: 0, y: 270, width: sceneSize.width, height: sceneSize.height
            }));
        }.bind(this));

        var newPosition = this.checkPositions(preferredPositions, avoidedNodes, targetRect);
        if (newPosition) {
            return convertPositionToNodeSpace(newPosition);
        }

        newPosition = convertPositionToNodeSpace(preferredPositions[1]);

        return newPosition;
    },

    animateDelta: function (delta, options) {
        if (!delta) {
            return;
        }

        var content;
        if (typeof delta === "string") {
            content = cleverapps.UI.generateOnlyText(delta, options.font || cleverapps.styles.FONTS.WHITE_TEXT || cleverapps.styles.FONTS.TEXT);
        } else {
            content = cleverapps.UI.generateImageText(delta > 0 ? "+" + delta : "" + delta, options.font || cleverapps.styles.FONTS.WHITE_TEXT || cleverapps.styles.FONTS.TEXT);
        }

        var icon;
        if (options.icon instanceof cc.Node) {
            icon = options.icon;
        } else if (options.icon) {
            icon = new cc.Sprite(options.icon);
        }

        if (icon) {
            if (options.iconScale) {
                icon.setScale(options.iconScale);
            }

            content = new cleverapps.Layout([content, icon], {
                direction: cleverapps.UI.HORIZONTAL,
                margin: cleverapps.styles.UI.delta.margin
            });
            content.setCascadeOpacityEnabled(true);
        }

        if (options.parent) {
            options.parent.addChild(content);
        }
        content.setPositionRound(options);

        if (options.zOrder) {
            content.setLocalZOrder(options.zOrder);
        }

        var dy = options.dy ? options.dy : cleverapps.styles.UI.delta.y;

        options.delay = options.delay || 0;

        var duration = options.duration || 2;

        content.opacity = 0;
        content.runAction(new cc.Sequence(
            new cc.DelayTime(options.delay),
            new cc.CallFunc(function () {
                content.opacity = 255;
            }),
            new cc.Spawn(
                new cc.MoveBy(duration, cc.p(0, dy)).easing(cc.easeIn(0.7)),
                new cc.Sequence(
                    new cc.FadeTo(duration, 0),
                    new cc.RemoveSelf()
                )
            )
        ));

        return content;
    },

    getFontName: function (font) {
        if (cleverapps.config.source === "playable") {
            return "Playable-font";
        }

        if (font === undefined) {
            font = bundles.main.urls.basefont_ttf;
        }

        if (engine === "creator") {
            return cc.LabelTTF.getCreatorFontName(font.srcs[0]);
        }

        return font.name;
    },

    generateImageText: function (text, font, params, deprecated) {
        if (deprecated && cleverapps.config.debugMode) {
            throw "deprecated";
        }

        if (cleverapps.config.debugMode && !cleverapps.UI.ImageFont.IsApplicable(font, text)) {
            console.log(font);
            throw "Not applicable image font: " + text;
        }
        return new cleverapps.UI.ImageFont(text, font, params);
    },

    generateOnlyText: function (text, font, toReplace) {
        var content = new cleverapps.UI.LabelTTF("", cleverapps.UI.getFontName(font.font));
        content.setString(text, toReplace);
        content.setFont(font);

        return content;
    },

    __generateNotLocalizedText: function (text, font) {
        var content = new cleverapps.UI.LabelTTF("", cleverapps.UI.getFontName(font.font));
        cc.LabelTTF.prototype.setString.call(content, text);
        content.setFont(font);

        return content;
    },

    /*
     * @deprecated
     */
    generateTTFText: function (text, font, toReplace) {
        var content;

        if (cleverapps.UI.ImageFont.IsApplicable(font, text)) {
            content = new cleverapps.UI.ImageFont(text, font);
        } else {
            content = new cleverapps.UI.LabelTTF("", cleverapps.UI.getFontName(font.font));
            content.setString(text, toReplace);
            content.setFont(font);
        }

        return content;
    },

    drawUnderline: function (textNode, position) {
        var underline = new cc.Scale9Sprite(bundles.digits.frames.underline_png);
        underline.setContentSize2(textNode.width, position && position.height ? position.height : 1);
        underline.setPositionRound(position || { x: textNode.x + textNode.width / 10, y: textNode.y - textNode.height / 10 });
        underline.setAnchorPoint2();
        underline.setColor(textNode._getFillStyle() || cc.color.BLACK);
        return underline;
    },

    CheckBox: cc.Node.extend({
        ctor: function (options) {
            this._super();

            options = options || {};
            options.styles = options.styles || {};
            this.options = options;

            this.onChangeCallback = options.onChange || function () {};

            this.selected = false;

            var items = [];

            var checkBox = this.createCheckBox();
            items.push(checkBox);

            if (options.label) {
                this.createLabel();
                items.push(this.label);
            }

            var styles = this.getStyles();

            var layout = new cleverapps.Layout(items, {
                margin: styles.margin,
                padding: styles.padding,
                direction: options.direction !== undefined ? options.direction : cleverapps.UI.HORIZONTAL,
                reversed: options.direction === cleverapps.UI.VERTICAL
            });
            this.addChild(layout);

            if (this.label) {
                this.label.y += styles.label.offsetY;
            }

            this.setAnchorPoint2();
            this.setContentSize2(layout.getContentSize());

            layout.setPositionRound(this.width / 2, this.height / 2);

            cleverapps.UI.applyHover(this);

            if (this.options.label && this.options.label.clickable) {
                cleverapps.UI.onClick(this, this.onClick.bind(this));
            } else {
                cleverapps.UI.onClick(checkBox, this.onClick.bind(this));
            }

            this.setSelected(this.options.isSelected);
        },

        createCheckBox: function () {
            var checkBox = new cc.Sprite(this.options.bgImage || bundles.checkbox.frames.background_png);

            this.icon = new cc.Sprite(this.options.checkImage || bundles.checkbox.frames.check_mark_png);
            checkBox.addChild(this.icon);
            this.icon.setPositionRound(checkBox.width / 2, checkBox.height / 2);
            this.icon.setVisible(false);

            return checkBox;
        },

        createLabel: function () {
            this.label = cleverapps.UI.generateTTFText(this.options.label.text, this.options.label.font || cleverapps.styles.FONTS.WINDOW_TEXT);
        },

        onClick: function () {
            this.setSelected(!this.isSelected());

            cleverapps.audio.playSound(bundles.main.urls.click_effect);
        },

        isSelected: function () {
            return this.selected;
        },

        setSelected: function (selected) {
            if (this.selected === selected) {
                return;
            }

            this.selected = selected;

            this.icon.setVisible(selected);

            this.onChangeCallback(this.selected);
        },

        getStyles: function () {
            if (!this.styles) {
                this.styles = cleverapps.overrideStyles(cleverapps.styles.UI.CheckBox, this.options.styles, true);
            }
            return this.styles;
        }
    }),

    wrap: function (node, options) {
        options = options || {};

        if (node.children.length === 0) {
            return node;
        }

        var minY, maxY, minX, maxX;

        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];

            var scaleX = child.baseScaleX || child.baseScale || child.scaleX;
            var scaleY = child.baseScaleY || child.baseScale || child.scaleY;

            var height = child.height;
            var width = child.width;

            if (options.considerRotation) {
                height = child.getBoundingBox().height;
                width = child.getBoundingBox().width;
                scaleX = 1;
                scaleY = 1;
            }

            var bottom = child.y - height * scaleY * child.anchorY;
            var top = bottom + height * scaleY;

            if (minY === undefined || minY > bottom) {
                minY = bottom;
            }

            if (maxY === undefined || maxY < top) {
                maxY = top;
            }

            var left = child.x - width * scaleX * child.anchorX;
            var right = left + width * scaleX;

            if (minX === undefined || minX > left) {
                minX = left;
            }

            if (maxX === undefined || maxX < right) {
                maxX = right;
            }
        }

        if (maxX < 0) {
            maxX = 0;
        }

        if (maxY < 0) {
            maxY = 0;
        }

        if (minY > 0) {
            minY = 0;
        }

        if (minX > 0) {
            minX = 0;
        }

        minX = -minX;
        minY = -minY;

        node.setContentSize2(minX + maxX, minY + maxY);
        node.children.forEach(function (child) {
            child.x += minX;
            child.y += minY;
        });
        if (options.keepPosition) {
            node.setPositionRound(
                node.x + (node.anchorX - minX / node.width) * node.width,
                node.y + (node.anchorY - minY / node.height) * node.height
            );
        } else {
            node.setAnchorPoint2();
        }

        return node;
    },

    shake: function (target, params) {
        params = params || {};
        var delay = params.delay || 0;
        var power = params.power || 1;
        var moveTime = params.moveTime || 0;
        var t = params.delayTimeAfterMove !== undefined ? params.delayTimeAfterMove : 0.05;

        var strength = params.strength;
        if (!strength) {
            strength = cleverapps.styles.UI.shake;
        }

        var points = params.points || [
            { x: 2, y: 1, r: 0 },
            { x: -1, y: -2, r: -1 },
            { x: -3, y: 0, r: 1 },
            { x: 0, y: 2, r: 0 },
            { x: 1, y: -1, r: 1 },
            // {x: -1, y: 2, r: -1},
            { x: 0, y: 0, r: 0 }
        ];

        var base = params.base;

        if (!base) {
            base = {
                x: target.x,
                y: target.y,
                r: target.rotation
            };
        }

        var seq = points.map(function (point) {
            return new cc.Spawn(
                new cc.MoveTo(moveTime, base.x + point.x * strength.dx * power, base.y + point.y * strength.dy * power),
                new cc.RotateTo(moveTime, base.r + point.r)
            );
        });

        var r = [new cc.DelayTime(delay / 1000)];

        seq.forEach(function (action) {
            r.push(action);
            r.push(new cc.DelayTime(t));
        });

        if (params.afterShakeAction) {
            r.push(params.afterShakeAction);
        }

        target.stopAllActions();
        target.runAction(new cc.Sequence(r));
    },

    wrapWithPadding: function (node, padding, noNewNode) {
        padding = cc.padding(padding);

        if (noNewNode) {
            node.children.forEach(function (child) {
                child.x += padding.left;
                child.y += padding.bottom;
            });
            node.width += padding.left + padding.right;
            node.height += padding.top + padding.bottom;
            return node;
        }

        var res = new cc.Node();
        res.addChild(node);

        res.setContentSize2(node.width * node.scaleX + padding.left + padding.right, node.height * node.scaleY + padding.top + padding.bottom);
        res.setAnchorPoint2();
        node.setPosition(padding.left + node.width * node.scaleX / 2, padding.bottom + node.height * node.scaleY / 2);

        return res;
    },

    setDimensions: function (node, options) {
        var width = options.width || node.width * node.scaleX;
        var height = options.height || node.height * node.scaleY;

        cleverapps.UI.fitToBox(node, {
            width: width,
            height: height
        });

        var deltaX = Math.max(0, width - node.width * node.scaleX);
        var deltaY = Math.max(0, height - node.height * node.scaleY);

        if (deltaX || deltaY) {
            cleverapps.UI.wrapWithPadding(node, {
                x: deltaX / 2 / node.scaleX,
                y: deltaY / 2 / node.scaleY
            }, true);
        }
    },

    targetContainPoint: function (target, point, isometricCell) {
        if (isometricCell) {
            var bottomPadding = isometricCell.padding && isometricCell.padding.bottom || 0;

            if (!cc.rectContainsPoint(cc.rect(0, -bottomPadding, target.width, target.height + bottomPadding), point)) {
                return false;
            }
            point.x += (isometricCell.width - target.width) / 2;
            if (point.x < 0 || point.x > isometricCell.width) {
                return false;
            }

            var dw = isometricCell.width / 2, dh = isometricCell.height / 2;
            if (point.x > dw) {
                point.x = isometricCell.width - point.x;
            }

            point.y += bottomPadding;

            var h = target.height + bottomPadding;
            if (h < isometricCell.height) {
                h = isometricCell.height;
            }
            if (point.y > dh && point.y < h - dh) {
                return true;
            }
            if (point.y > dh) {
                point.y = h - point.y;
            }
            if (point.y < 0 || point.y > dh) {
                return false;
            }
            return (dw - point.x) * dh < point.y * dw;
        }
        var rect;
        if (target.clickRect) {
            rect = target.clickRect;
        } else {
            var pos = target.clickPosition || { x: 0, y: 0 };
            rect = cc.rect(pos.x, pos.y, target.width, target.height);
        }
        return cc.rectContainsPoint(rect, point);
    },

    onDrag: function (target, options) {
        options = options || {};
        return new PointerHandler(target, options);
    },

    onPressed: function (target, callback, options) {
        options = options || {};
        options.onPressed = callback;
        return new PointerHandler(target, options);
    },

    onClick: function (target, callback, options) {
        options = options || {};
        options.onClick = callback;
        return new PointerHandler(target, options);
    },

    applyHover: function (target, options) {
        options = options || {};
        options.hover = true;
        return new PointerHandler(target, options);
    },

    convertToGrayScale2: function (node, restore) {
        node.setColor(cleverapps.styles.COLORS.BLACK);
        node.setOpacity(100);

        if (restore) {
            node.setColor(cleverapps.styles.COLORS.WHITE);
            node.setOpacity(255);
        }
    },

    convertToGrayScale: function (node, restore) {
        if (typeof gl === "undefined") {
            return;
        }
        if (node.spine) {
            node = node.spine;
        }

        if (restore) {
            if (node.normalShader) {
                node.setShaderProgram(node.normalShader);
            } else {
                node.opacity = 255;
            }
        } else if (cc.shaderCache && cleverapps.Shaders && cc.shaderCache._programs[cleverapps.Shaders.GRAYSCALE_SPRITE_KEY]) {
            if (!node.normalShader) {
                node.normalShader = node.getShaderProgram();
            }
            console.log(222);
            node.setShaderProgram(cc.shaderCache.getProgram(cleverapps.Shaders.GRAYSCALE_SPRITE_KEY));
        } else {
            node.opacity = 150;
        }
    },

    _setShaderUpdate: function (node, programKey, shaderUpdate) {
        if (node._superUpdate) {
            node.update = node._superUpdate.bind(node);
            delete node._superUpdate;

            if (node.normalShader) {
                node.setShaderProgram(node.normalShader);
            }
        } else if (cc.shaderCache && cleverapps.Shaders && cc.shaderCache.getProgram(programKey)) {
            if (!node.normalShader) {
                node.normalShader = node.getShaderProgram();
            }

            node.setShaderProgram(cc.shaderCache.getProgram(programKey));
            var shader = node.getShaderProgram();

            node._superUpdate = node.update;
            node.scheduleUpdate();
            node.update = function (dt) {
                shaderUpdate(dt, shader);
            };
        }
    },

    toggleFlickering: function (node, options) {
        if (typeof gl === "undefined") {
            return;
        }

        options = options || {};
        var flickSpeed = options.flickSpeed || 2;
        var flickPause = options.flickPause || 0.2;
        var color = options.color;
        if (!color || !Array.isArray(color) || color.length < 3) {
            color = [0.35, 0.35, 0.35];
        }

        var flickerTime = 0;
        var flickerUpdate = function (dt, flickerShader) {
            node._superUpdate(dt);

            flickerShader.use();
            flickerTime += dt;

            var timeFunction = Math.abs(Math.sin(Math.max(flickerTime - flickPause, 0) * flickSpeed));
            timeFunction = Math.max(0, Math.min(1, timeFunction));
            flickerShader.setUniformLocationWith1f("sineTime", timeFunction);
            flickerShader.setUniformLocationWith3f("flickColor", color[0], color[1], color[2]);
        };

        this._setShaderUpdate(node, cleverapps.Shaders.FLICKER_SHADER_KEY, flickerUpdate);
    },

    toggleBlur: function (node, options) {
        options = options || {};
        options.animate = options.animate || {};

        if (typeof gl === "undefined") {
            options.animate && options.animate.callback && options.animate.callback();
            return;
        }

        var blurLength = options.blurLength || 0.005;
        var strength = options.strength || 1;

        var setParams = function (curStrength, curCurtain) {
            node.blurShader.use();
            node.blurShader.setUniformLocationWith1f("u_blurOffset", blurLength);
            node.blurShader.setUniformLocationWith1f("u_blurStrength", curStrength);
            node.blurShader.setUniformLocationWith1f("u_extent", curCurtain);
        };

        var animateAction = function (restore, callback) {
            callback = callback || function () {};
            var type = options.animate.type || cleverapps.UI.BLUR_ANIMATION.FADE;
            var blurTime = options.animate.time !== undefined ? options.animate.time : 0.2;
            var steps = options.animate.steps || 20;

            var curStrength = restore ? strength : 0;
            var curCurtain = restore ? 1 : 0;

            var strengthStep = strength / steps;
            var curtainStep = 1 / steps;

            node.blurAction = node.runAction(new cc.Sequence(
                new cc.Repeat(
                    new cc.Sequence(
                        new cc.CallFunc(function () {
                            if (type === cleverapps.UI.BLUR_ANIMATION.FADE) {
                                curStrength += restore ? -strengthStep : strengthStep;
                                setParams(curStrength, 1);
                            } else {
                                curCurtain += restore ? -curtainStep : curtainStep;
                                setParams(strength, curCurtain);
                            }
                        }),
                        new cc.DelayTime(blurTime / steps)
                    ),
                    steps
                ),
                new cc.CallFunc(callback)
            ));
            node.blurAction.whenDone = callback;
        };

        if (node.blurAction && !node.blurAction.isDone()) {
            node.stopAction(node.blurAction);
            node.blurAction.whenDone();
            delete node.blurAction;
        }

        if (node.normalShader) {
            var clear = function () {
                node.setShaderProgram(node.normalShader);
                delete node.normalShader;
                delete node.blurShader;
            };

            if (options.animate) {
                animateAction(true, function () {
                    clear();
                    options.animate.callback && options.animate.callback();
                });
            } else {
                clear();
            }
        } else if (cc.shaderCache && cleverapps.Shaders) {
            var programKey = cleverapps.Shaders.BLUR_FADE_KEY;
            if (options.animate.type === cleverapps.UI.BLUR_ANIMATION.CURTAIN) {
                programKey = options.animate.reverseCurtain ? cleverapps.Shaders.BLUR_CURTAIN_REVERSE_KEY : cleverapps.Shaders.BLUR_CURTAIN_KEY;
            }

            if (cc.shaderCache.getProgram(programKey)) {
                node.normalShader = node.getShaderProgram();

                node.setShaderProgram(cc.shaderCache.getProgram(programKey));
                node.blurShader = node.getShaderProgram();

                if (options.animate) {
                    animateAction(false, options.animate.callback);
                } else {
                    setParams(strength, 1);
                }
            }
        }
    },

    cutPlayerName: function (name, maxLength) {
        if (name.length > maxLength) {
            name = name.replace(/^[\s]+/, ""); // trim left
            var pos = name.lastIndexOf(" ", maxLength);
            if (pos <= 0) {
                pos = maxLength;
            }
            name = name.substr(0, pos);
        }
        return name;
    },

    getSceneSize: function () {
        return cc.size(cleverapps.resolution.sceneSize);
    },

    getBgSize: function () {
        return cc.size(cleverapps.resolution.bgSize);
    },

    getBgOffset: function () {
        return cleverapps.UI.getBgSize().height - cleverapps.UI.getSceneSize().height;
    },

    createPatternSprite: function (fileName, size) {
        if (size === undefined) {
            size = cleverapps.UI.getSceneSize();
        }

        var sprite = new cc.Sprite(fileName);
        if (size.width === "auto") {
            size.width = sprite.width - 2;
        }
        if (size.height === "auto") {
            size.height = sprite.height - 2;
        }

        if (typeof gl !== "undefined" && sprite.getTexture()) {
            sprite.getTexture().setTexParameters({
                minFilter: gl.NEAREST,
                magFilter: gl.NEAREST,
                wrapS: gl.REPEAT,
                wrapT: gl.REPEAT
            });

            var rect = sprite.getTextureRect();
            rect.width = size.width;
            rect.height = size.height;
            sprite.setTextureRect(rect);
        } else if (size.width && size.height) {
            sprite.setScale(size.width / sprite.width, size.height / sprite.height);
        }
        sprite.setPositionRound(size.width / 2, size.height / 2);
        return sprite;
    },

    createSprite: function (styles) {
        if (!styles) {
            return new cc.Sprite();
        }

        var image = styles && styles.image || styles;
        image = processVirtualImage(image);

        if (styles.scale9 !== undefined && styles.scale9 !== false) {
            var sprite = cleverapps.UI.createScale9Sprite(image, styles.scale9);
            var width, height;
            if (styles.sizes) {
                width = styles.sizes[cleverapps.resolution.mode].width;
                height = styles.sizes[cleverapps.resolution.mode].height;
            } else {
                width = styles.width;
                height = styles.height;
            }

            var rotation = styles.rotation;
            if (styles.rotations) {
                rotation = styles.rotations[cleverapps.resolution.mode];
            }

            if (rotation) {
                var tmp = height;
                height = width;
                width = tmp;

                sprite.setRotation(rotation);
            }

            sprite.setContentSize2(width, height);
            return sprite;
        }

        var spriteFrameName = image;
        image = new cc.Sprite(image);
        image.scale = styles.scale || 1;
        image.spriteFrameName = spriteFrameName;
        return image;
    },

    getScale9Rect: function (spriteFrameName, type) {
        var twoPixelsAnchors = {};

        if (type === cleverapps.UI.Scale9Rect.TwoPixelXY) {
            twoPixelsAnchors.x = 0.5;
            twoPixelsAnchors.y = 0.5;
        } else if (type === cleverapps.UI.Scale9Rect.TwoPixelX) {
            twoPixelsAnchors.x = 0.5;
        } else if (type === cleverapps.UI.Scale9Rect.TwoPixelY) {
            twoPixelsAnchors.y = 0.5;
        } else if (type) {
            twoPixelsAnchors.x = type.x;
            twoPixelsAnchors.y = type.y;
        }

        var spriteFrame = spriteFrameName instanceof cc.SpriteFrame ? spriteFrameName : cc.spriteFrameCache.getSpriteFrame(spriteFrameName);

        var spriteSize = spriteFrame.getOriginalSize();

        var isTwoPixelX = typeof twoPixelsAnchors.x === "number";
        var x = Math.round(isTwoPixelX ? (spriteSize.width - 2) * twoPixelsAnchors.x : spriteSize.width / 3);
        var width = Math.round(isTwoPixelX ? 2 : spriteSize.width / 3);

        var isTwoPixelY = typeof twoPixelsAnchors.y === "number";
        var y = Math.round(isTwoPixelY ? (spriteSize.height - 2) * twoPixelsAnchors.y : spriteSize.height / 3);
        var height = Math.round(isTwoPixelY ? 2 : spriteSize.height / 3);

        return cc.rect(x, y, width, height);
    },

    createScale9Sprite: function (spriteFrameName, type, innerRect) {
        var spriteFrame = spriteFrameName instanceof cc.SpriteFrame ? spriteFrameName : cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        if (!spriteFrame) {
            if (cleverapps.config.debugMode) {
                throw "No scale9 sprite: " + spriteFrameName;
            }
            return new cc.Scale9Sprite();
        }

        var result = new cc.Scale9Sprite(spriteFrameName, cleverapps.UI.getScale9Rect(spriteFrameName, type, innerRect));
        result.spriteFrameName = spriteFrameName;
        return result;
    },

    createAnimation: function (styles) {
        styles = styles.spine;

        var animation = new cleverapps.Spine(styles.json);
        animation.setAnimation(0, styles.openAnimation, false);

        if (styles.idleAnimation) {
            animation.setCompleteListener(function () {
                animation.setAnimation(0, styles.idleAnimation, true);
            });
        }

        return animation;
    },

    isNodeOnScene: function (node, widthPart, heightPart) {
        var scene = cleverapps.scenes.getRunningScene();
        var bottomLeft = scene.convertToNodeSpace(node.convertToWorldSpace(cc.p(0, 0)));
        var topRight = scene.convertToNodeSpace(node.convertToWorldSpace(cc.p(node.width, node.height)));
        var rect = cc.rect(bottomLeft.x, bottomLeft.y, topRight.x - bottomLeft.x, topRight.y - bottomLeft.y);

        widthPart = rect.width < scene.width && widthPart || 0;
        heightPart = rect.height < scene.height && heightPart || 0;

        if (rect.x + (1 - widthPart) * rect.width < 0 || rect.x + widthPart * rect.width > scene.width) {
            return false;
        }

        if (rect.y + (1 - heightPart) * rect.height < 0 || rect.y + heightPart * rect.height > scene.height) {
            return false;
        }

        return true;
    }
};

cleverapps.styles.UI = {
    delta: {
        y: 20,
        icon: {
            margin: 5
        }
    },

    Avatar: {
        x: 8,
        top: 8,
        bottom: 8,
        frame: {
            scale: 1,
            dx: 0,
            dy: 0
        }
    },

    shake: {
        dx: 1,
        dy: 1
    },

    CheckBox: {
        margin: 10,
        label: {
            offsetY: 0
        }
    }
};

cleverapps.UI.Scale9Rect = {
    Default: 0,
    TwoPixelX: 1,
    TwoPixelY: 2,
    TwoPixelXY: 3
};

cleverapps.UI.BLUR_ANIMATION = {
    "FADE": 1,
    "CURTAIN": 2
};
