/**
 * Created by andrey on 20.11.17.
 */

cc.Base = cc.Node;

cc.Scale9Sprite.prototype.ctor = cleverapps.extendFunc(cc.Scale9Sprite.prototype.ctor, function (frame) {
    checkBrokenLink(frame, arguments);
    var virtualFrameName = isVirtualLink(frame) ? frame : frame && frame.virtualFrameName;
    var spriteFrameName;

    if (arguments.length > 0) {
        if (typeof frame === "string") {
            frame = spriteFrameName = processVirtualImage(frame);
        }

        arguments[0] = frame;
    }

    this._super.apply(this, arguments);

    this.virtualFrameName = virtualFrameName;
    this.spriteFrameName = spriteFrameName;

    this._debugName = virtualFrameName || spriteFrameName;
});

cc.Scale9Sprite.prototype.setSpriteFrame = cleverapps.extendFunc(cc.Scale9Sprite.prototype.setSpriteFrame, function (frame) {
    checkBrokenLink(frame, arguments);

    this.virtualFrameName = isVirtualLink(frame) ? frame : frame && frame.virtualFrameName;
    this.spriteFrameName = typeof frame === "string" ? frame : frame && frame.spriteFrameName;

    return this._super.call(this, frame);
});

cc.textureCache.getTextureForKey = cleverapps.extendFunc(cc.textureCache.getTextureForKey, function (name, preferredBundles) {
    var virtualFrameName = isVirtualLink(name) ? name : "";

    name = processVirtualImage(name, preferredBundles);

    var texture = this._super.call(this, name);
    if (texture) {
        texture.spriteFrameName = name;
        texture.virtualFrameName = virtualFrameName;
    }
    return texture;
});

cc.spriteFrameCache.getSpriteFrame = cleverapps.extendFunc(cc.spriteFrameCache.getSpriteFrame, function (name, preferredBundles) {
    var virtualFrameName = isVirtualLink(name) ? name : "";

    name = processVirtualImage(name, preferredBundles);
    if (typeof name === "string" && name.indexOf("#") === 0) {
        name = name.substr(1, name.length - 1);
    }

    var frame = this._super.call(this, name);
    if (frame) {
        frame.spriteFrameName = name;
        frame.virtualFrameName = virtualFrameName;
    }
    return frame;
});

cleverapps.styles.FONTS.SYSTEM = {
    type: {
        name: "Arial"
    },
    size: 20,
    color: cleverapps.styles.COLORS.BLACK
};

cc.Base.prototype.replaceParent = function (newParent) {
    this.removeTemporarily(false);
    newParent.addChild(this);
};

cc.Base.GetHierarchyRotation = function (target) {
    var rotation = { x: 0, y: 0 };
    while (target) {
        rotation.x += target.getRotationX();
        rotation.y += target.getRotationY();
        target = target.parent;
    }
    return rotation;
};

cc.Base.prototype.adjustRotationTo = function (target) {
    var rotation = cc.Base.GetHierarchyRotation(target);
    rotation.x *= -1;
    rotation.y *= -1;

    var node = this;
    while (node) {
        rotation.x += node.getRotationX();
        rotation.y += node.getRotationY();
        node = node.parent;
    }
    return rotation;
};

cc.Base.GetHierarchyScale = function (target) {
    var scale = { x: 1, y: 1 };
    while (target) {
        scale.x *= target.scaleX;
        scale.y *= target.scaleY;
        target = target.parent;
    }
    return scale;
};

cc.Base.prototype.adjustScaleTo = function (target) {
    var scale = cc.Base.GetHierarchyScale(target);
    scale.x = 1 / scale.x;
    scale.y = 1 / scale.y;

    var node = this;
    while (node) {
        scale.x *= node.scaleX;
        scale.y *= node.scaleY;
        node = node.parent;
    }
    return scale;
};

cc.Base.prototype.replaceParentSamePlace = function (newParent, options) {
    if (options && options.keepScale) {
        var scale = this.adjustScaleTo(newParent);
        this.setScaleX(scale.x);
        this.setScaleY(scale.y);
    }
    if (options && options.keepRotation) {
        var rotation = this.adjustRotationTo(newParent);
        this.setRotationX(rotation.x);
        this.setRotationY(rotation.y);
    }
    var pos = newParent.convertToNodeSpace(this.parent.convertToWorldSpace(this.getPosition()));
    this.replaceParent(newParent);
    this.setPosition(pos);
};

cc.Base.prototype.createListener = function (listener) {
    var self = this;
    addCleaner(this, function () {
        self = undefined;
        listener = undefined;
    });
    return function () {
        if (listener && self && !self.stopListeners) {
            return listener.apply(self, arguments);
        }
    };
};

cc.Base.prototype.hasTouch = function (touch) {
    if (!this.visible) {
        return false;
    }
    var point = this.convertTouchToNodeSpace(touch);
    return cc.rectContainsPoint(cc.rect(0, 0, this.width, this.height), point);
};

cc.Base.prototype.createListener_onExitTransitionDidStart = cc.Base.prototype.onExitTransitionDidStart;
cc.Base.prototype.onExitTransitionDidStart = function () {
    this.stopListeners = true;
    this.createListener_onExitTransitionDidStart();

    if (this.avoidNode || this.updateDynamicPosition || this._globalZOrder) {
        var scene = cleverapps.scenes.getRunningScene();

        if (this.avoidNode && scene.removeAvoidNode) {
            scene.removeAvoidNode(this);
        }

        if (this.updateDynamicPosition && scene.removeDynamicNode) {
            scene.removeDynamicNode(this);
        }

        if (this._globalZOrder) {
            scene.removeGlobalZOrderNode(this);
        }
    }
};

cc.Base.prototype.onEnterTransitionDidFinish = cleverapps.extendFunc(cc.Base.prototype.onEnterTransitionDidFinish, function () {
    this.stopListeners = false;
    this._super.apply(this, arguments);

    if (this.avoidNode || this.updateDynamicPosition || this._globalZOrder) {
        var scene = cleverapps.scenes.getRunningScene();

        if (this.avoidNode && scene.addAvoidNode) {
            scene.addAvoidNode(this);
        }

        if (this.updateDynamicPosition && scene.addDynamicNode) {
            scene.addDynamicNode(this);
        }

        if (this._globalZOrder) {
            scene.addGlobalZOrderNode(this);
        }
    }
});

cc.Scale9Sprite.prototype.onEnterTransitionDidFinish = cleverapps.extendFunc(cc.Scale9Sprite.prototype.onEnterTransitionDidFinish, function () {
    this._super.apply(this, arguments);

    if (this.virtualFrameName) {
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.virtualFrameName, this.getPreferredBundles()));
    }
});

cc.Sprite.prototype.onEnterTransitionDidFinish = cleverapps.extendFunc(cc.Sprite.prototype.onEnterTransitionDidFinish, function () {
    this._super.apply(this, arguments);

    if (this.virtualFrameName) {
        if (getVirtualLinkType(this.virtualFrameName) === "url") {
            this.setTexture(this.virtualFrameName);

            return;
        }

        this.setSpriteFrame(this.virtualFrameName);
    }
});

cc.Base.prototype.cleanup = cleverapps.extendFunc(cc.Base.prototype.cleanup, function () {
    this.stopListeners = true;
    runCleaners(this);
    this._super();
});

cc.Base.prototype.runAction = cleverapps.extendFunc(cc.Base.prototype.runAction, function () {
    if (this.stopListeners && cleverapps.config.debugMode && !cleverapps.config.wysiwygMode) {
        cleverapps.throwAsync("runAction on stopped node");
    }

    if (this.saveStack) {
        this.actionStack = new Error().stack;
    }

    return this._super.apply(this, arguments);
});

cc.Base.prototype.addCleaner = function (callback) {
    addCleaner(this, callback);
};

cc.Base.prototype.addChild = cleverapps.extendFunc(cc.Base.prototype.addChild, function (node) {
    this._super.apply(this, arguments);

    if (node.alignment) {
        node.setPositionRound(node.alignment);
    }

    if (this.isRunning()) {
        var nodesForInit = [];
        node.performRecursive(function (child) {
            if (child.hidingNodeForInit) {
                nodesForInit.unshift(child.hidingNodeForInit);
            }
        });
        nodesForInit.forEach(function (node) {
            node.initialize();
        });
    }
});

cc.Base.prototype.calculatePositionRound = function (x, y, options) {
    if (Array.isArray(x)) {
        x = x[cleverapps.resolution.mode];
    }

    if (x.vertical && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
        x = x.vertical;
    }

    if (options === undefined) {
        options = typeof x === "object" ? (x.options || x) : {};
    }

    if (y === undefined) {
        y = x.y;
        x = x.x;
    }

    if (options.world) {
        return !this.parent ? { x: x, y: y, options: options }
            : this.parent.convertToNodeSpace(this.calculatePositionRound(x, y, { parentSize: cleverapps.UI.getBgSize() }));
    }

    if (typeof x === "object" || typeof y === "object") {
        var parentSize;
        var box = options.box;
        if (this.parent) {
            parentSize = this.parent.getContentSize();
        }
        if (this.hidingNode && this.hidingNode.parent) {
            parentSize = this.hidingNode.parent.getContentSize();
        }
        if (box) {
            parentSize = box;
        }
        if (options.parentSize) {
            parentSize = options.parentSize;
        }

        if (!parentSize) {
            return { x: x, y: y, options: options };
        }

        if (typeof x === "object") {
            x = this.calculateCoordinate(x, "x", parentSize.width) + (box && box.x || 0);
        }

        if (typeof y === "object") {
            y = this.calculateCoordinate(y, "y", parentSize.height) + (box && box.y || 0);
        }
    }

    return cc.p(Math.floor(x), Math.floor(y));
};

cc.Base.prototype.setPositionRound = function (x, y, options) {
    var position = this.calculatePositionRound(x, y, options);

    if ((typeof position.x === "object" || typeof position.y === "object" || position.options) && !this.parent) {
        this.alignment = position;
    } else {
        this.setPosition(position.x, position.y);
    }
};

cc.Base.prototype.calculateCoordinate = function (styles, coordinate, parentSize) {
    if (styles.random) {
        var start = styles.random.start !== undefined ? styles.random.start : 0;
        var end = styles.random.end !== undefined ? styles.random.end : parentSize;
        return Math.round(Math.random() * (end - start) + start);
    }

    var anchorPoint = coordinate === "x" ? this.getAnchorPoint().x : this.getAnchorPoint().y;

    var dcName = coordinate === "x" ? "dx" : "dy";
    var c = 0;
    Object.keys(styles).forEach(function (key) {
        if (key.indexOf(dcName) === 0) {
            c += styles[key];
        }
    });

    var dimension = coordinate === "x" ? this.width * Math.abs(this.scaleX) : this.height * Math.abs(this.scaleY);

    var align = styles.align || "center";
    switch (align) {
        case "left":
        case "bottom":
            if (Math.abs(anchorPoint) >= 0.1) {
                c += Math.abs(anchorPoint - 1) < 0.1 ? dimension : dimension / 2;
            }
            if (styles.anchor === "center") {
                c -= dimension / 2;
            } else if (styles.anchor === "top") {
                c -= dimension;
            }
            break;
        case "center":
            c += parentSize / 2;
            if (Math.abs(anchorPoint) < 0.1) {
                c += -dimension / 2;
            } else if (Math.abs(anchorPoint - 1) < 0.1) {
                c += dimension / 2;
            }
            if (styles.anchor === "top") {
                c -= dimension / 2;
            } else if (styles.anchor === "bottom") {
                c += dimension / 2;
            }
            break;
        case "right":
        case "top":
            c += parentSize;
            if (Math.abs(anchorPoint) < 0.1) {
                c += -dimension;
            } else if (Math.abs(anchorPoint - 1) > 0.1) {
                c += -dimension / 2;
            }
            if (styles.anchor === "center") {
                c += dimension / 2;
            } else if (styles.anchor === "bottom") {
                c += dimension;
            }
            break;
    }

    return c;
};

cc.Base.prototype.getRelativeCoordinates = function (target) {
    var node = target.hidingNode || target;
    return this.getParent().convertToNodeSpace(node.getParent().convertToWorldSpace(node.getPosition()));
};

cc.Node.prototype.getScale = function () {
    if (this.scaleX !== this.scaleY) {
        cleverapps.throwAsync("getScale with different scaleX=" + this.scaleX + " and scaleY=" + this.scaleY);
    }
    return this.scaleX;
};

cc.Base.prototype.setAnchorPoint2 = function (x, y) {
    if (x === undefined) {
        x = 0.5;
    }
    if (y === undefined) {
        y = 0.5;
    }

    if (this.width > 0) {
        x = Math.round(this.width * x) / this.width;
    }

    if (this.height > 0) {
        y = Math.round(this.height * y) / this.height;
    }

    this.setAnchorPoint(x, y);
};

cc.Base.prototype.setContentSize2 = function (width, height) {
    if (Array.isArray(width)) {
        width = width[cleverapps.resolution.mode];
    }

    if (Array.isArray(height)) {
        height = height[cleverapps.resolution.mode];
    }

    if (height === undefined) {
        height = width.height;
        width = width.width;
    }

    this.setContentSize(2 * Math.round(width / 2), 2 * Math.round(height / 2));
};

cc.Base.prototype.setScale2 = function (scale) {
    if (Array.isArray(scale)) {
        scale = scale[cleverapps.resolution.mode];
    }

    this.setScale(scale);
};

cc.Base.prototype.isDisplayed = function () {
    var node = this;

    while (node.isVisible() && node.parent) {
        node = node.parent;
    }

    return node.isVisible() && node === cleverapps.scenes.getRunningScene();
};

cc.Base.prototype.getCenterPos = function () {
    var boxPos = this.getBoundingBox();
    boxPos.x += boxPos.width / 2;
    boxPos.y += boxPos.height / 2;
    return { x: Math.round(boxPos.x), y: Math.round(boxPos.y) };
};

cc.Base.prototype.getBoundingBox = function () {
    var scaleX = this.scaleX;
    var scaleY = this.scaleY;
    var baseScaleX = this.baseScaleX || this.baseScale || scaleX;
    var baseScaleY = this.baseScaleY || this.baseScale || scaleY;
    var change = scaleX !== baseScaleX || scaleY !== baseScaleY;

    if (change) {
        this.setScale(baseScaleX, baseScaleY);
    }

    var rect = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
    var box = cc.rectApplyAffineTransform(rect, this.getNodeToParentTransform());

    if (change) {
        this.setScale(scaleX, scaleY);
    }

    return box;
};

cc.Base.prototype.getGlobalBoundingBox = function () {
    var rect = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
    var trans = this.getNodeToWorldTransform();
    return cc.rectApplyAffineTransform(rect, trans);
};

cc.Base.prototype.setCascadeOpacityEnabledRecursively = function (enabled) {
    this.performRecursive(function (node) {
        node.setCascadeOpacityEnabled(enabled);
    });
};

cc.Base.prototype.setRecCascadeColorEnabled = function () {
    this.performRecursive(function (node) {
        node.setCascadeColorEnabled(true);
    });
};

cc.Base.prototype.onChangeSize = function () {
    this.children.forEach(function (child) {
        if (child.completeAnimationOnResize) {
            child.completeAnimationOnResize();
        }
        child.onChangeSize();
    });

    this.updateSize && this.updateSize();
    this.completeAnimationOnResize && this.completeAnimationOnResize();
};

cc.Base.prototype.onChangePosition = function () {
    this.updatePosition && this.updatePosition();

    this.children.forEach(function (child) {
        child.onChangePosition();
    });
};

cc.Base.prototype.performRecursive = function (callback) {
    var q = [this];
    while (q.length > 0) {
        var t = q.pop();
        callback(t);
        q = q.concat(t.children);

        if (t.iterateTiles) {
            t.iterateTiles(function (tile) {
                if (tile instanceof cc.Node) {
                    q.push(tile);
                }
            });
        }
    }
};

cc.Base.prototype.getPreferredBundles = function () {
    if (this.bundles) {
        if (this.preferredBundles === undefined) {
            this.preferredBundles = this.bundles.reduce(function (result, name) {
                var bundle = bundles[name];
                return result.concat(bundle.injectTo || [name]);
            }, []);
        }

        return this.preferredBundles;
    }

    if (this.parent) {
        return this.parent.getPreferredBundles();
    }
};

cc.Base.prototype.getCropContainer = function () {

};

cc.Base.prototype.setInteractiveState = function (cause, state) {
    if (!this.interactiveStates) {
        this.interactiveStates = {};
    }

    if (!state) {
        state = undefined;
    }

    if (this.interactiveStates[cause] === state) {
        return false;
    }

    if (!state) {
        delete this.interactiveStates[cause];
    } else {
        this.interactiveStates[cause] = state;
    }
    return true;
};

cc.Base.prototype.getInteractiveStates = function () {
    var states = {};

    if (!this.interactiveStates) {
        return states;
    }

    for (var cause in this.interactiveStates) {
        states[this.interactiveStates[cause]] = true;
    }

    return states;
};

cc.Base.prototype.removeInteractiveStates = function (pattern) {
    if (!this.interactiveStates) {
        return;
    }

    for (var cause in this.interactiveStates) {
        if (cause.indexOf(pattern) === 0) {
            delete this.interactiveStates[cause];
        }
    }
};

cc.Base.prototype.applyInteractiveScale = function () {
    if (this.ignoreScale) {
        return;
    }

    var scaleX = this.baseScaleX || this.baseScale || 1;
    var scaleY = this.baseScaleY || this.baseScale || 1;

    var states = this.getInteractiveStates();
    if (states.pressed) {
        this.setScale(scaleX * 0.97, scaleY * 0.97);
    } else if (states.mouseover) {
        this.setScale(scaleX * 1.03, scaleY * 1.03);
    } else {
        this.setScale(scaleX, scaleY);
    }
};

cc.Base.prototype.convertTouchToNodeSpaceDisplacement = function (touch) {
    var startPosition = this.convertToNodeSpace(touch.getStartLocation());
    var currentPosition = this.convertToNodeSpace(touch.getLocation());

    var angleRadians = -(Math.PI / 180) * this.getRotation();
    [startPosition, currentPosition] = [startPosition, currentPosition].map(function (pos) {
        return {
            x: pos.x * Math.cos(angleRadians) - pos.y * Math.sin(angleRadians),
            y: pos.x * Math.sin(angleRadians) + pos.y * Math.cos(angleRadians)
        };
    });

    return cc.p(currentPosition.x - startPosition.x, currentPosition.y - startPosition.y);
};

cc.Base.prototype.removeTemporarily = function () {
    if (engine === "creator") {
        this._temporarilyRemoved = true;
    }

    this.removeFromParent.apply(this, arguments);
};

cc.Base.prototype.setGlobalZOrder = function (globalZOrder) {
    if (this._globalZOrder !== globalZOrder) {
        this._globalZOrder = globalZOrder;

        if (this.isRunning()) {
            var scene = cleverapps.scenes.getRunningScene();

            if (globalZOrder) {
                scene.addGlobalZOrderNode(this);
            } else {
                scene.removeGlobalZOrderNode(this);
            }
        }
    }
};

cc.Scene.prototype.ctor = cleverapps.extendFunc(cc.Scene.prototype.ctor, function () {
    this._globalZOrderNodes = [];
    this._reorderGlobalNodesDirty = false;

    this._super.apply(this, arguments);
});

cc.Scene.prototype.addGlobalZOrderNode = function (node) {
    if (engine === "creator") {
        node.pixiObject._static = true;
    }

    var index = this._globalZOrderNodes.indexOf(node);
    if (index === -1) {
        this._globalZOrderNodes.push(node);
    }

    cc.renderer.childrenOrderDirty = this._reorderGlobalNodesDirty = true;
};

cc.Scene.prototype.removeGlobalZOrderNode = function (node) {
    if (engine === "creator") {
        node.pixiObject._static = false;
    }

    var index = this._globalZOrderNodes.indexOf(node);
    if (index !== -1) {
        this._globalZOrderNodes.splice(index, 1);
    }

    cc.renderer.childrenOrderDirty = true;
};

cc.Scene.prototype.visit = function (parent) {
    var cmd = this._renderCmd, parentCmd = parent ? parent._renderCmd : null;

    if (!this._visible) {
        cmd._propagateFlagsDown(parentCmd);
        return;
    }

    cmd.visit(parentCmd);

    if (this._reorderChildDirty) {
        this.sortAllChildren();
    }

    if (this._reorderGlobalNodesDirty) {
        this._globalZOrderNodes.sort(function (a, b) {
            return a._globalZOrder - b._globalZOrder || a.arrivalOrder - b.arrivalOrder;
        });
        this._reorderGlobalNodesDirty = false;
    }

    this.visitCurrent();

    var lChildren = this._children, gChildren = this._globalZOrderNodes, lLen = lChildren.length, gLen = gChildren.length, globalZOrder;

    for (var i = 0, j = 0; i < lLen || j < gLen;) {
        var lChild = lChildren[i];
        var gChild = gChildren[j];

        if (!lChild || gChild && gChild._globalZOrder < lChild._localZOrder) {
            globalZOrder = gChild._globalZOrder;
            gChild._globalZOrder = 0;
            gChild.visit(gChild.parent);
            gChild._globalZOrder = globalZOrder;
            j++;
        } else {
            lChild.visit(this);
            i++;
        }
    }

    cmd._dirtyFlag = 0;
};

cc.Base.CHILDREN_ORDER_FN = function (child1, child2) {
    return (child1._localZOrder - child2._localZOrder) || (child1.arrivalOrder - child2.arrivalOrder);
};

cc.Base.EMPTY_COLOR = cc.color(255, 255, 255, 255);
