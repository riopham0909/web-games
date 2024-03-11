/**
 * Created by mac on 10/28/20
 */

cleverapps.UI.ScrollBarContainer = cc.Node.extend({
});

cleverapps.UI.ScrollView = ccui.Layout.extend({
    ctor: function (content, options) {
        this.options = options || {};
        this.dir = cleverapps.UI.ScrollView.DIR_NONE;

        this.onUpdatePositionListener = function () {};
        this.onUpdateZoomListener = function () {};

        this.options.childrenVisibility = this.options.childrenVisibility === undefined ? cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_FULLCHECK : this.options.childrenVisibility;
        this.options.childrenVisibilityPadding = this.options.childrenVisibilityPadding || 0;
        switch (this.options.childrenVisibility) {
            case cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_LINEAR:
                this.childrenVisibility = new ScrollChildrenLinearVisibility(this);
                break;
            case cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_FULLCHECK:
                this.childrenVisibility = new ScrollChildrenFullCheckVisibility(this);
                break;
        }
        this._super();

        if (this.options.clipping === undefined || this.options.clipping) {
            this.setClippingEnabled(true);
        }
        this.setAnchorPoint2();

        this.centerNode = new cc.Node();
        this.addChild(this.centerNode);

        if (this.options.scrollBarEnabled !== false) {
            this.barContainer = new cleverapps.UI.ScrollBarContainer();
            this.addChild(this.barContainer, 2);
            this.barContainer.setCascadeOpacityEnabled(true);
            this.barContainer.setOpacity(0);
            this.barContainer.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.FadeTo(0.3, 255)
            ));
            this.barHandler = new ScrollBarHandler(this);
        }

        this.zoom = 1;
        if (this.options.zoom) {
            this.zoomHandler = new cleverapps.UI.ZoomHandler(this, this.options.zoom);
        }

        var ScrollHandlerClass = (options && options.scrollHandler) || cleverapps.UI.ScrollHandler;
        this.scrollHandler = new ScrollHandlerClass(this, {
            mouseScroll: !this.options.zoom,
            outOfBoundaryScale: this.options.outOfBoundaryScale,
            inertialScrollFactor: this.options.inertialScrollFactor
        });

        if (content) {
            this.setInnerContent(content);
        }
        this.scheduleUpdate();
    },

    isEmpty: function () {
        return !this.innerContent || !this.innerContent.children.length;
    },

    setContentSize: function (width, height) {
        var oldWidth = this.width;
        var oldHeight = this.height;

        var p = this.innerContent && this.innerContent.getPosition();

        this._super(width, height);

        if (oldWidth !== this.width || oldHeight !== this.height) {
            if (this.barContainer) {
                this.barContainer.setContentSize(this.getContentSize());
            }

            if (this.centerNode) {
                this.centerNode.setPosition(this.width / 2, this.height / 2);
            }

            if (this.innerContent) {
                this.calcBorders();
                this.scrollToPoint(cc.p(-p.x, -p.y));
            }
        } else if (this.width === 0 && this.height === 0) {
            this.min = cc.p(0, 0);
            this.max = cc.p(0, 0);
        }
    },

    updateVisibility: function () {
        if (this.innerContent.setVisibleRect) {
            this.innerContent.setVisibleRect(this.getVisibleRect());
        }

        if (!this.childrenVisibility || !this.currentVisibleChildIds || this.isEmpty() || this.width + this.height === 0) {
            return;
        }

        var visibleIds = this.childrenVisibility.visibleIds();

        var i, child;
        for (i = 0; i < this.currentVisibleChildIds.length; i++) {
            this.visibilityCheckList[this.currentVisibleChildIds[i]].hideDirty = true;
        }

        for (i = 0; i < visibleIds.length; i++) {
            child = this.visibilityCheckList[visibleIds[i]];
            delete child.hideDirty;
            delete child.beyondScroll;
            child.visible = true;
        }

        for (i = 0; i < this.currentVisibleChildIds.length; i++) {
            child = this.visibilityCheckList[this.currentVisibleChildIds[i]];
            if (child.hideDirty) {
                delete child.hideDirty;
                child.visible = false;
                child.beyondScroll = true;
            }
        }

        this.currentVisibleChildIds = visibleIds;
    },

    getVisibleRect: function () {
        return cc.rect(
            Math.round(this.innerContent.width / 2 - this.width / this.zoom / 2 - this.innerContent.x),
            Math.round(this.innerContent.height / 2 - this.height / this.zoom / 2 - this.innerContent.y),
            Math.round(this.width / this.zoom),
            Math.round(this.height / this.zoom)
        );
    },

    isVisiblePoint: function (point) {
        var rect = this.getVisibleRect();
        return cc.rectContainsPoint(rect, point);
    },

    calcBorders: function () {
        if (this.isEmpty()) {
            this.min = cc.p(0, 0);
            this.max = cc.p(0, 0);
            return;
        }

        this.min = cc.p(
            -this.innerContent.width / 2 + this.width / this.zoom / 2,
            -this.innerContent.height / 2 + this.height / this.zoom / 2
        );
        if (this.min.x > 0) {
            this.min.x = 0;
        }
        if (this.min.y > 0) {
            this.min.y = 0;
        }
        this.max = cc.p(
            this.innerContent.width / 2 - this.width / this.zoom / 2,
            this.innerContent.height / 2 - this.height / this.zoom / 2
        );
        if (this.max.x < 0) {
            this.max.x = 0;
        }
        if (this.max.y < 0) {
            this.max.y = 0;
        }

        this.setDirection();
        if (this.barHandler) {
            this.barHandler.reset();
        }
    },

    setInnerContent: function (innerContent) {
        if (this.innerContent) {
            this.innerContent.removeFromParent();
        }

        this.innerContent = innerContent;
        this.innerContent.setAnchorPoint2();
        this.innerContent.setPositionRound(0, 0);
        this.centerNode.addChild(innerContent);

        this.visibilityCheckList = innerContent.visibilityCheckList || innerContent.children;

        if (this.width && this.height) {
            this.updateInnerContent();
            this.scrollToDefault();
        } else {
            this.initChildrenVisibility();
        }
    },

    scrollToDefault: function () {
        if (this.innerContent) {
            this.scrollTo(cleverapps.UI.ScrollView.SCROLLS.UPPER_LEFT);
        }
    },

    initChildrenVisibility: function () {
        if (this.childrenVisibility) {
            this.currentVisibleChildIds = [];
            for (var i = 0; i < this.visibilityCheckList.length; i++) {
                this.currentVisibleChildIds.push(i);
            }
        }
    },

    updateInnerContent: function () {
        this.calcBorders();
        this.initChildrenVisibility();
        this.scrollToPoint(this.normalizePoint(this.getContainerPosition()));
    },

    borderTouchScrollIteration: function (touch, speed, percentage) {
        percentage *= 0.01;
        var w = this.width / this.zoom / 2 * percentage, h = this.height / this.zoom / 2 * percentage;
        speed /= this.zoom;

        var banner = cleverapps.bannerAd.getGlobalBoundingBox();
        var bannerH = 0;
        var touchLocation = touch.getLocation();
        if (banner && banner.x <= touchLocation.x && touchLocation.x <= banner.x + banner.width) {
            bannerH = this.centerNode.convertToNodeSpace(cc.p(0, banner.height)).y - this.centerNode.convertToNodeSpace(cc.p(0, 0)).y;
        }

        var touchPos = this.centerNode.convertTouchToNodeSpace(touch);
        var dx = 0, dy = 0;
        var containerPos = this.getContainerPosition();
        if (touchPos.x < -w) {
            dx = containerPos.x - speed >= this.min.x ? -speed : this.min.x - containerPos.x;
        }
        if (touchPos.x > w) {
            dx = containerPos.x + speed <= this.max.x ? speed : this.max.x - containerPos.x;
        }
        if (touchPos.y < -h + bannerH) {
            dy = containerPos.y - speed >= this.min.y ? -speed : this.min.y - containerPos.y;
        }
        if (touchPos.y > h) {
            dy = containerPos.y + speed <= this.max.y ? speed : this.max.y - containerPos.y;
        }
        if (dx || dy) {
            this.scrollToPoint(cc.p(containerPos.x + dx, containerPos.y + dy));
            return true;
        }

        return false;
    },

    calcNodeDelta: function (target, options) {
        var visibleBox = Object.assign({
            left: 1,
            right: 1,
            top: 1,
            bottom: 1
        }, options.visibleBox);

        var oldZoom = this.zoom;
        if (this.zoomHandler && options.zoom) {
            this.zoomHandler.setZoom(options.zoom, true);
        }

        var box = target.getBoundingBox();

        var bottomLeft = cc.p(box.x, box.y);
        var topRight = cc.p(box.x + box.width, box.y + box.height);

        bottomLeft = this.centerNode.convertToNodeSpace(target.getParent().convertToWorldSpace(bottomLeft));
        topRight = this.centerNode.convertToNodeSpace(target.getParent().convertToWorldSpace(topRight));

        var visibleBottomLeft = cc.p(-this.width / this.zoom / 2 * visibleBox.left, -this.height / this.zoom / 2 * visibleBox.bottom);
        var visibleTopRight = cc.p(this.width / this.zoom / 2 * visibleBox.right, this.height / this.zoom / 2 * visibleBox.top);

        var delta = cc.p(0, 0);
        if (bottomLeft.x < visibleBottomLeft.x) {
            delta.x = -(visibleBottomLeft.x - bottomLeft.x);
        }
        if (topRight.x > visibleTopRight.x) {
            delta.x = topRight.x - visibleTopRight.x;
        }

        if (bottomLeft.y < visibleBottomLeft.y) {
            delta.y = -(visibleBottomLeft.y - bottomLeft.y);
        }
        if (topRight.y > visibleTopRight.y) {
            delta.y = topRight.y - visibleTopRight.y;
        }

        delta = cc.pAdd(delta, this.scrollHandler.getHowMuchOutOfBoundary(delta));

        if (this.zoomHandler && options.zoom) {
            this.zoomHandler.setZoom(oldZoom, true);
        }

        return delta;
    },

    targetToPoint: function (target, padding) {
        padding = padding || { x: 0, y: 0 };
        switch (target) {
            case cleverapps.UI.ScrollView.SCROLLS.UPPER_LEFT:
                target = cc.p(this.min.x + padding.x, this.max.y + padding.y);
                break;
            case cleverapps.UI.ScrollView.SCROLLS.CENTER:
                target = cc.p(padding.x, padding.y);
                break;
            case cleverapps.UI.ScrollView.SCROLLS.LOWER_RIGHT:
                target = cc.p(this.max.x + padding.x, this.min.y + padding.y);
                break;
            default:
                if (target instanceof cc.Node || target instanceof Map2dCellView) {
                    target = this.innerContent.convertToNodeSpace(target.getParent().convertToWorldSpace(target.getPosition()));
                }

                target.x -= this.innerContent.width / 2 + padding.x;
                target.y -= this.innerContent.height / 2 + padding.y;
                break;
        }

        return target;
    },

    scrollTo: function (target, duration, options) {
        options = options || {};
        var callback = options.callback || function () {};

        if (target === undefined) {
            callback();
            return;
        }

        target = this.normalizePoint(this.targetToPoint(target, options.padding));

        if (!duration) {
            this.scrollToPoint(target);
            callback();
        } else {
            options.duration = duration;
            options.targetPoint = true;
            var easing = options.easing || cc.easeBackInOut();
            this.runAction(new cc.Sequence(
                new cc.ScrollAction(target, options).easing(easing),
                new cc.CallFunc(callback)
            ));
        }
    },

    scrollBy: function (delta, duration, options) {
        var target = cc.pAdd(delta, this.getContainerPosition());
        target.x += this.innerContent.width / 2;
        target.y += this.innerContent.height / 2;
        this.scrollTo(target, duration, options);
    },

    update: function (dt) {
        this._super(dt);
        this.scrollHandler.processAutoScroll(dt);
    },

    getCurrentScroll: function () {
        if (!this.innerContent) {
            return {
                x: 0,
                y: 0
            };
        }

        var fullX = this.max.x - this.min.x;
        var fullY = this.max.y - this.min.y;

        return {
            x: fullX !== 0 ? (this.innerContent.x - this.min.x) / fullX : 0,
            y: fullY !== 0 ? (this.innerContent.y - this.min.y) / fullY : 0
        };
    },

    normalizePoint: function (p) {
        return {
            x: Math.max(this.min.x, Math.min(this.max.x, p.x)),
            y: Math.max(this.min.y, Math.min(this.max.y, p.y))
        };
    },

    getContainerPosition: function () {
        return cc.p(-this.innerContent.x, -this.innerContent.y);
    },

    getCurrentPosition: function () {
        var p = this.innerContent.getPosition();
        return {
            x: -p.x + this.innerContent.width / 2,
            y: -p.y + this.innerContent.height / 2
        };
    },

    scrollToPoint: function (p) {
        this.innerContent.setPosition(-p.x, -p.y);

        this.updateVisibility();
        if (this.barHandler) {
            this.barHandler.updatePos();
        }

        if (this.options.containerMovedListener) {
            this.options.containerMovedListener();
        }

        this.onUpdatePositionListener();
    },

    scrollToPercent: function (percent, duration) {
        percent = Math.min(100, Math.max(0, percent));
        var target;

        if (this.dir & cleverapps.UI.ScrollView.DIR_VERTICAL) {
            var newY = (this.max.y - this.min.y) * percent / 100 + this.min.y;

            target = cc.p(this.innerContent.x, newY);
        } else {
            var newX = (this.max.x - this.min.x) * percent / 100 + this.min.x;
            target = cc.p(newX, this.innerContent.y);
        }

        if (!duration) {
            this.scrollToPoint(target);
        } else {
            this.runAction(new cc.ScrollAction(target, {
                duration: duration,
                targetPoint: true
            }).easing(cc.easeBackInOut()));
        }
    },

    stopScrollAction: function () {
        if (this._scrollActionRunning) {
            cc.ScrollAction._UID++;
            this._scrollActionRunning = false;
            this.scrollHandler.afterContainerMove();
        }
    },

    stopAutoScroll: function () {
        this.stopScrollAction();
        this.scrollHandler.stopAutoScroll();
    },

    setDirection: function () {
        if (this.options.direction) {
            this.dir = this.options.direction;
        } else {
            this.dir = cleverapps.UI.ScrollView.DIR_BOTH;
            if (this.min.y === this.max.y) {
                this.dir ^= cleverapps.UI.ScrollView.DIR_VERTICAL;
            }
            if (this.min.x === this.max.x) {
                this.dir ^= cleverapps.UI.ScrollView.DIR_HORIZONTAL;
            }
        }
    },

    getInnerContainer: function () {
        return this.innerContent;
    },

    setBarPadding: function (padding) {
        if (this.barHandler) {
            this.barHandler.setPadding(padding);
        }
    },

    getCropContainer: function () {
        return cc.rect(0, 0, this.width, this.height);
    }
});

cleverapps.UI.ScrollView.SCROLLS = {
    UPPER_LEFT: 0,
    CENTER: 1,
    LOWER_RIGHT: 2
};

cleverapps.UI.ScrollView.DIR_NONE = 0;
cleverapps.UI.ScrollView.DIR_VERTICAL = 1;
cleverapps.UI.ScrollView.DIR_HORIZONTAL = 2;
cleverapps.UI.ScrollView.DIR_BOTH = cleverapps.UI.ScrollView.DIR_VERTICAL | cleverapps.UI.ScrollView.DIR_HORIZONTAL;

cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_NONE = 0;
cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_LINEAR = 1;
cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_FULLCHECK = 2;