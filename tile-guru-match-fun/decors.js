/**
 * Created by vlad on ???
 */

var Decors = function (window, styles) {
    styles = styles || {};
    this.styles = styles;
    this.decors = {};
    this.parent = window;

    if (!cleverapps.styles.Decorators) {
        return;
    }

    var ids = Object.keys(styles).filter(function (id) {
        if (styles[id] !== true) {
            return false;
        }

        var decorator = cleverapps.styles.Decorators[id];

        if (!decorator) {
            return false;
        }

        if (decorator.lovesBackground && !window.withBg) {
            return false;
        }

        if (decorator.lovesBackgroundAndForeground && !window.withBg && !window.foreground) {
            return false;
        }

        if (decorator.fearHigh && window.window) {
            var height = window.window.height * window.window.scale / cleverapps.UI.getSceneSize().height;
            if (height > 0.8) {
                return false;
            }
        }

        if (decorator.lovesTitle && (!window.windowTitle || decorator.lovesTitle !== true && window.windowTitle.type !== cleverapps.styles.WindowTitle.Types[decorator.lovesTitle])) {
            return false;
        }

        return true;
    });

    this.init(ids);
};

Decors.prototype.add = function (id) {
    var item = cleverapps.styles.Decorators[id];
    if (item) {
        var parent = this.getParent(item);
        var decor;
        switch (item.type) {
            case Decors.TYPE_IMAGE:
                decor = this.addImage(item);
                break;
            case Decors.TYPE_ANIMATION:
                decor = this.addAnimation(item);
                break;
            case Decors.TYPE_SCALE9:
                decor = this.addScale9(item, parent);
                break;
            case Decors.TYPE_REPEATABLE:
                decor = this.addPattern(item);
                break;
        }

        if (decor) {
            var pos = this.getPos(item);
            parent.addChild(decor);
            decor.setPositionRound(pos);
            this.decors[id] = decor;
            return decor;
        }
    }
};

Decors.prototype.init = function (ids) {
    ids.forEach(this.add, this);
};

Decors.prototype.initTitleDecorators = function () {
    var ids = Object.keys(this.styles).filter(function (id) {
        return this.styles[id] === true && cleverapps.styles.Decorators[id] && cleverapps.styles.Decorators[id].lovesTitle;
    }.bind(this));

    this.init(ids);
};

Decors.prototype.getDecorById = function (id) {
    if (this.decors[id]) {
        return this.decors[id];
    }
};

Decors.prototype.setVisible = function (id, visible) {
    var decor = this.getDecorById(id);
    if (!decor) {
        return false;
    }
    if (!visible) {
        decor.stopAllActions();
    }
    decor.setVisible(visible);
    return true;
};

Decors.prototype.getParent = function (item) {
    if (item.lovesTitle) {
        return this.parent.windowTitle;
    }

    if (item.lovesBackground) {
        return this.parent.bg;
    }

    if (item.lovesBackgroundAndForeground && (this.parent.foreground || this.parent.bg)) {
        return this.parent.foreground || this.parent.bg;
    }

    if (item.lovesWindow) {
        return this.parent;
    }

    if (item.lovesButton && this.parent.button) {
        return this.parent.button;
    }

    return this.parent.window;
};

Decors.prototype.addScale9 = function (item, parent) {
    var image = cleverapps.UI.createScale9Sprite(bundles.main.frames[item.image] || item.image);
    image.setContentSize2(item.width === "parent" ? parent.width : image.width, item.height === "parent" ? parent.height : image.height);
    image.setScale(Array.isArray(item.scale) ? item.scale[cleverapps.resolution.mode] : item.scale);
    image.baseScale = image.scale;
    image.setLocalZOrder(item.zOrder);
    if (item.rotation !== undefined) {
        image.setRotation(item.rotation);
    }
    return image;
};

Decors.prototype.addImage = function (item) {
    var image = new cc.Sprite(bundles.main.frames[item.image] || item.image);
    var scale = item.scale;
    if (Array.isArray(scale)) {
        scale = scale[cleverapps.resolution.mode];
    }
    if (typeof scale === "number") {
        image.scale = scale;
    } else {
        image.scaleX = scale.x;
        image.scaleY = scale.y;
    }
    
    image.baseScale = Math.abs(image.scaleX);
    image.baseScaleX = image.scaleX;
    image.baseScaleY = image.scaleY;
    image.setLocalZOrder(item.zOrder);
    if (item.rotation !== undefined) {
        image.setRotation(item.rotation);
    }
    return image;
};

Decors.prototype.addAnimation = function (item) {
    var json = bundles.main.jsons[item.json] || item.json;
    var animation = new cleverapps.Spine(json);
    if (item.scale) {
        if (item.scale.x) {
            animation.setScale(item.scale.x, item.scale.y);
        } else {
            animation.setScale(item.scale);
        }
    }
    var looped = item.looped !== undefined ? item.looped : true;
    animation.setLocalZOrder(item.zOrder);
    animation.setVisible(true);

    if (item.delay !== undefined) {
        animation.runAction(new cc.Sequence(
            new cc.DelayTime(item.delay),
            new cc.CallFunc(function () {
                animation.setAnimation(0, item.animation, looped);
            })
        ));
    } else if (item.idle) {
        animation.setAnimationAndIdleAfter(item.animation, item.idle);
    } else {
        animation.setAnimation(0, item.animation, looped);
    }

    return animation;
};

Decors.prototype.addPattern = function (item) {
    var frame = bundles.main.frames[item.image] || item.image;
    var parent = this.getParent(item);

    var count, xstep, ystep;
    if (item.direction === cleverapps.UI.HORIZONTAL) {
        count = Math.ceil(parent.width / item.step) - 1;
        xstep = item.step;
        ystep = 0;
    } else {
        count = Math.ceil(parent.height / item.step) - 1;
        xstep = 0;
        ystep = item.step;
    }

    var container = new cc.Node();
    container.setAnchorPoint2();
    container.setLocalZOrder(item.zOrder || 0);

    for (var i = 0; i < count; ++i) {
        var image = new cc.Sprite(frame);
        image.setAnchorPoint2();
        image.setPositionRound(i * xstep, -i * ystep);
        container.addChild(image);
    }

    return container;
};

Decors.prototype.getPos = function (item) {
    if (item.position && Array.isArray(item.position)) {
        return item.position[cleverapps.resolution.mode];
    }
    return cc.p(item.x, item.y);
};

Decors.prototype.updateAll = function () {
    for (var id in this.decors) {
        var decor = this.decors[id];
        var decorStyle = cleverapps.styles.Decorators[id];
        var pos = this.getPos(decorStyle);
        decor.setPositionRound(pos.x, pos.y);
    }
};

Decors.prototype.hideAll = function () {
    for (var id in this.decors) {
        var item = cleverapps.styles.Decorators[id];
        if (item && item.type === Decors.TYPE_ANIMATION) {
            var decor = this.decors[id];
            var fadeoutAnimation = item.animation + "_fadeout";
            if (decor && decor.hasAnimation && decor.hasAnimation(fadeoutAnimation)) {
                decor.setAnimation(0, fadeoutAnimation, false);
                decor.setCompleteListenerRemove();
            }
        }
    }
};

Decors.TYPE_IMAGE = 0;
Decors.TYPE_ANIMATION = 1;
Decors.TYPE_SCALE9 = 2;
Decors.TYPE_REPEATABLE = 3;

cleverapps.styles.Decorators = {

};
