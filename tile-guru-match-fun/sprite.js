/**
 * Created by andrey on 11.07.2023
 */

cc.Sprite.prototype.ctor = cleverapps.extendFunc(cc.Sprite.prototype.ctor, function (frame) {
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
});

cc.Sprite.prototype.setTexture = cleverapps.extendFunc(cc.Sprite.prototype.setTexture, function (texture) {
    checkBrokenLink(texture, arguments);
    this.virtualFrameName = isVirtualLink(texture) ? texture : texture && texture.virtualFrameName;

    texture = processVirtualImage(texture, this.getPreferredBundles());

    this.spriteFrameName = texture && texture.spriteFrameName || texture;

    return this._super.call(this, texture);
});

cc.Sprite.prototype.setSpriteFrame = cleverapps.extendFunc(cc.Sprite.prototype.setSpriteFrame, function (frame) {
    checkBrokenLink(frame, arguments);
    this.virtualFrameName = isVirtualLink(frame) ? frame : frame && frame.virtualFrameName;

    frame = processVirtualImage(frame, this.getPreferredBundles());
    frame = frame && frame.spriteFrameName || frame;

    if (this.spriteFrameName === frame) {
        return;
    }
    this.spriteFrameName = frame;

    if (typeof frame === "string" && frame.indexOf("#") === 0) {
        frame = frame.substr(1, frame.length - 1);
    }

    if (typeof frame === "string" ? !cc.spriteFrameCache.getSpriteFrame(frame) : !frame) {
        if (!cleverapps.config.wysiwygMode) {
            cleverapps.throwAsync("broken frame: " + frame);
        }
        return false;
    }

    return this._super.call(this, frame);
});

cc.Sprite.prototype.getSpriteFrame = cleverapps.extendFunc(cc.Sprite.prototype.getSpriteFrame, function () {
    var frame = this._super.call(this);
    if (frame) {
        frame.spriteFrameName = this.spriteFrameName;
        frame.virtualFrameName = this.virtualFrameName;
    }
    return frame;
});

cc.Sprite.prototype.unuse = function () {
    this.removeTemporarily();
};

cc.Sprite.prototype.reuse = function () {
    this.setScale(1);
    this.setRotation(0);
    this.setAnchorPoint(0.5, 0.5);
    this.setPosition(0, 0);
    this.setOpacity(255);
    this.setColor(cc.Base.EMPTY_COLOR);
    this.setCascadeColorEnabled(false);
    this.setCascadeOpacityEnabled(false);
};

cc.Sprite.GetPoolId = function (obj) {
    if (obj instanceof cc.Sprite) {
        obj = obj.spriteFrameName;
    }
    return "sprite_" + obj;
};

cc.Sprite.GetFromPool = function (frame) {
    frame = isVirtualLink(frame) ? processVirtualImage(frame) : frame;

    var res = cc.pool.getFromPool(cc.Sprite, frame) || new cc.Sprite(frame);
    return res;
};