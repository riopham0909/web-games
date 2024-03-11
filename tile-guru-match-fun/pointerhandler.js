/**
 * Created by razial on 02.05.2023
 */

var PointerHandler = cc.Class.extend({
    ctor: function (target, options) {
        options = options || {};

        this.touches = {};
        this.target = target;
        this.swallowEvents = options.swallowEvents;
        this.filter = options.filter || function () {
            return true;
        };

        this.onMouseZoom = options.onMouseZoom;
        this.onPinchZoom = options.onPinchZoom;

        this.usesPress = Boolean(options.onPressed);
        if (this.usesPress) {
            this.onPressed = options.onPressed;
        }

        this.onOuterTouch = options.onOuterTouch;

        this.usesClick = Boolean(options.onClick || options.onLongClick || options.onDoubleClick);
        if (this.usesClick) {
            this.onClick = options.onClick;
            if (cleverapps.config.debugMode) {
                this.target.clickPointerHandler = this;
            }

            this.onLongClick = options.onLongClick;
            this.onDoubleClick = options.onDoubleClick;

            this.longClickDuration = PointerHandler.LONG_CLICK_TIMEOUT;
            this.doubleClickDuration = PointerHandler.DOUBLE_CLICK_WAIT;
        }

        this.usesDrag = Boolean(options.followPointer || options.onDragStart || options.onDragMove || options.onDragEnd);
        if (this.usesDrag) {
            this.onDragStart = options.onDragStart || function () {
                return true;
            };
            this.onDragMove = cleverapps.throttle(PointerHandler.DRAG_THROTTLE, options.onDragMove || function () {});
            this.onDragEnd = options.onDragEnd || function () {};

            if (typeof options.followPointer === "function") {
                this.followPointer = options.followPointer;
            } else if (options.followPointer) {
                this.followPointer = function (touch) {
                    this.target.setPositionRound(this.target.parent.convertTouchToNodeSpace(touch));
                }.bind(this);
            }

            this.instantDrag = options.instantDrag;
            this.dragHoldTime = options.holdForDrag ? PointerHandler.DRAG_HOLD_TIME : 0;
        }

        this.ignoreScale = this.onPinchZoom || this.usesDrag || this.usesPress || options.ignoreScale;

        if (this.usesPress || this.usesClick || this.usesDrag || this.onPinchZoom || this.swallowEvents) {
            this.touchListener = cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function (touch, event) {
                    if (this.handleTouchBegan(touch, event)) {
                        return true;
                    }

                    if (this.onOuterTouch) {
                        this.onOuterTouch(touch, event);
                    }
                }.bind(this),
                onTouchMoved: function (touch, event) {
                    this.handleTouchMoved(touch, event);
                }.bind(this),
                onTouchEnded: function (touch, event) {
                    this.handleTouchEnded(touch, event);
                }.bind(this),
                onTouchCancelled: this.handleTouchCancelled.bind(this)
            }, target);
        }

        this.useHover = Boolean(options.hover || options.onMouseOver || options.onMouseOut);
        if (this.useHover) {
            this.onMouseOver = options.onMouseOver || function () {
                target.applyInteractiveScale();
            };

            this.onMouseOut = options.onMouseOut || function () {
                target.applyInteractiveScale();
            };
        }

        if (this.useHover || this.onMouseZoom || this.swallowEvents) {
            this.hoverListener = cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: this.onMouseMove.bind(this),
                onMouseScroll: this.onMouseScroll.bind(this)
            }, target);
        }

        this.isLabelTTF = target instanceof cc.LabelTTF;
    },

    remove: function () {
        if (this.touchListener) {
            cc.eventManager.removeListener(this.touchListener);
            this.touchListener = undefined;
        }

        if (this.hoverListener) {
            cc.eventManager.removeListener(this.hoverListener);
            this.hoverListener = undefined;
        }

        if (!this.ignoreScale) {
            this.target.removeInteractiveStates(this.__instanceId + "_");
            this.target.applyInteractiveScale();
        }
    },

    setEnabled: function (enabled) {
        if (this.touchListener) {
            this.touchListener.setEnabled(enabled);
        }

        if (this.hoverListener) {
            this.hoverListener.setEnabled(enabled);
        }

        if (!enabled) {
            this.target.removeInteractiveStates(this.__instanceId + "_");
            this.target.applyInteractiveScale();
        }
    },

    isTouchApplicable: function (touch) {
        var point = this.target.convertToNodeSpace(touch.getLocation());
        var rect;
        if (this.target.clickRect) {
            rect = this.target.clickRect;
        } else {
            rect = cc.rect(0, 0, this.target.width, this.target.height);
        }
        if (this.isLabelTTF) {
            rect.x *= cc.view.getDevicePixelRatio();
            rect.y *= cc.view.getDevicePixelRatio();
            rect.width *= cc.view.getDevicePixelRatio();
            rect.height *= cc.view.getDevicePixelRatio();
        }

        if (!cc.rectContainsPoint(rect, point)) {
            return false;
        }

        if (!this.target.isDisplayed()) {
            return false;
        }

        if (!cleverapps.meta.checkEventNode(this.target)) {
            return false;
        }

        for (var node = this.target; node.parent; node = node.parent) {
            point = cc.pointApplyAffineTransform(point, node.getNodeToParentTransform());

            var cropContainer = node.parent.getCropContainer();
            if (cropContainer) {
                if (!cc.rectContainsPoint(cropContainer, point)) {
                    return false;
                }
            }
        }

        return true;
    },

    isInClickThreshold: function (touch) {
        var threshold = cleverapps.styles.PointerHandler.clickThreshold;
        return cc.pDistanceSQ(touch.getStartLocation(), touch.getLocation()) < threshold * threshold;
    },

    bubblesFromInnerNode: function (touch) {
        if (touch.nodes && !touch.nodes[this.target.__instanceId]) {
            return false;
        }

        if (!touch.nodes) {
            touch.nodes = {};
            touch.innermost = this.__instanceId;

            for (var node = this.target; node; node = node.parent) {
                touch.nodes[node.__instanceId] = true;
            }
        }

        return true;
    },

    captureTouch: function (touch) {
        touch.handler = this.__instanceId;
    },

    canCaptureTouch: function (touch) {
        return !touch.handler || touch.handler === this.__instanceId;
    },

    needProcessTouch: function (touch) {
        if (!this.canCaptureTouch(touch)) {
            return false;
        }

        if (!this.isTouchApplicable(touch)) {
            return false;
        }

        if (!this.filter(touch)) {
            return false;
        }

        return this.bubblesFromInnerNode(touch);
    },

    handleTouchBegan: function (touch, event) {
        if (!this.needProcessTouch(touch)) {
            return false;
        }

        if (this.swallowEvents) {
            this.captureTouch(touch);
        }

        var state = PointerHandler.STATE_NONE;
        if (this.usesDrag) {
            state = PointerHandler.STATE_DRAG_START;
        } else if (this.usesClick) {
            state = PointerHandler.STATE_CLICK;
        }

        if (this.onPressed && this.onPressed(touch, event)) {
            state = PointerHandler.STATE_NONE;
            this.captureTouch(touch);
        } else if (this.onPinchZoom) {
            var secondTouch = cleverapps.values(this.touches).find(function (data) {
                return this.canCaptureTouch(data.touch) && !data.touch.pinchTouch;
            }.bind(this));
            if (secondTouch) {
                secondTouch = secondTouch.touch;

                state = PointerHandler.STATE_NONE;

                touch.pinchTouch = secondTouch;
                touch.pinchPrevPosition = touch.getLocation();
                this.captureTouch(touch);

                secondTouch.pinchTouch = touch;
                secondTouch.pinchPrevPosition = secondTouch.getLocation();
                this.captureTouch(secondTouch);
            }
        }

        this.touches[touch.__instanceId] = {
            touch: touch,
            state: state,
            startTime: cleverapps.timeouts.getTime()
        };

        if (!this.ignoreScale && touch.innermost === this.__instanceId) {
            this.target.setInteractiveState(this.__instanceId + "_" + touch.__instanceId, "pressed");
            this.target.applyInteractiveScale();
        }

        if (this.usesClick || this.onPinchZoom) {
            touch.useThreshold = true;
        }

        if (this.instantDrag) {
            this.handleTouchMoved(touch);
        }

        return true;
    },

    handleTouchMoved: function (touch, event) {
        var data = this.touches[touch.__instanceId];

        if (!cleverapps.meta.checkEventNode(this.target)) {
            return;
        }

        if (!data || !this.canCaptureTouch(touch)) {
            return;
        }

        if (touch.pinchTouch) {
            var secondTouch = touch.pinchTouch;

            var prevDistance = this.calcPinchDistance(touch.pinchPrevPosition, secondTouch.pinchPrevPosition);
            var currentDistance = this.calcPinchDistance(touch.getLocation(), secondTouch.getLocation());
            var diffDistance = currentDistance - prevDistance;

            if (Math.abs(diffDistance) > 3) {
                touch.pinchPrevPosition = touch.getLocation();
                secondTouch.pinchPrevPosition = secondTouch.getLocation();
                this.onPinchZoom(diffDistance * 0.00085);
            }
            return;
        }

        if (data.state === PointerHandler.STATE_DRAG_START) {
            if (data.startTime + this.dragHoldTime > cleverapps.timeouts.getTime()) {
                return;
            }

            if (touch.useThreshold && !this.instantDrag && this.isInClickThreshold(touch)) {
                return;
            }

            if (this.handleDragStart(touch, event, data)) {
                data.state = PointerHandler.STATE_DRAG_MOVE;
                this.captureTouch(touch);
            } else {
                data.state = PointerHandler.STATE_CLICK;
            }
        }

        if (data.state === PointerHandler.STATE_DRAG_MOVE) {
            if (this.followPointer) {
                this.followPointer(touch, event);
            }

            this.handleDragMove(touch, event);
        }
    },

    handleTouchEnded: function (touch, event) {
        cleverapps.playSession.notifyActive();
        cleverapps.payments.notifyActive();

        var data = this.touches[touch.__instanceId];
        delete this.touches[touch.__instanceId];

        if (!this.ignoreScale && touch.innermost === this.__instanceId) {
            this.target.setInteractiveState(this.__instanceId + "_" + touch.__instanceId);
            this.target.applyInteractiveScale();
        }

        if (!cleverapps.meta.checkEventNode(this.target)) {
            return;
        }

        if (!data || !this.canCaptureTouch(touch)) {
            return;
        }

        if (touch.pinchTouch) {
            var secondTouch = touch.pinchTouch;

            secondTouch.pinchTouch = undefined;
            secondTouch.pinchPrevPosition = undefined;

            touch.pinchTouch = undefined;
            touch.pinchPrevPosition = undefined;
        }

        if (data.state === PointerHandler.STATE_DRAG_START) {
            data.state = PointerHandler.STATE_CLICK;
        }

        if (data.state === PointerHandler.STATE_DRAG_MOVE) {
            this.handleDragMove(touch, event);
            this.handleDragEnd(touch, event, data);

            if (this.instantDrag && this.isInClickThreshold(touch)) {
                data.state = PointerHandler.STATE_CLICK;
            } else {
                data.state = PointerHandler.STATE_NONE;
            }
        }

        if (data.state === PointerHandler.STATE_CLICK && !this.usesClick) {
            data.state = PointerHandler.STATE_NONE;
        }

        if (data.state === PointerHandler.STATE_CLICK) {
            data.state = PointerHandler.STATE_NONE;

            if (!this.isTouchApplicable(touch)) {
                return;
            }

            this.captureTouch(touch);

            if (this.onLongClick && data.startTime + this.longClickDuration <= cleverapps.timeouts.getTime()) {
                this.onLongClick(touch, event);
                return;
            }

            if (this.onDoubleClick) {
                if (this.lastClick) {
                    var lastClick = this.lastClick;
                    this.lastClick = undefined;

                    clearTimeout(lastClick.timeout);

                    if (this.isInClickThreshold(lastClick.touch)) {
                        this.onDoubleClick(touch, event);
                        return;
                    }
                }

                var lastClickTimeout = setTimeout(function () {
                    clearTimeout(this.lastClick.timeout);
                    this.lastClick = undefined;
                    this.handleClick(touch, event);
                }.bind(this), this.doubleClickDuration);

                this.lastClick = {
                    touch: touch,
                    timeout: lastClickTimeout
                };

                return;
            }

            this.handleClick(touch, event);
        }
    },

    handleTouchCancelled: function (touch, event) {
        return this.handleTouchEnded(touch, event);
    },

    handleClick: function (touch, event) {
        if (this.onClick) {
            this.onClick(touch, event);
        }
    },

    handleDragStart: function (touch, event, data) {
        if (this.onDragStart(touch, event)) {
            cleverapps.meta.display({
                focus: "dragging",
                keepControls: true,
                action: function (f) {
                    cleverapps.meta.setEventNodes([this.target]);
                    data.freeFocus = f;
                }.bind(this)
            });
            return true;
        }
    },

    handleDragMove: function (touch, event) {
        this.onDragMove(touch, event);
    },

    handleDragEnd: function (touch, event, data) {
        if (data.freeFocus) {
            data.freeFocus();
            data.freeFocus = undefined;
        }

        this.onDragEnd(touch, event);
    },

    onMouseMove: function (event) {
        if (cleverapps.UI.disableHover) {
            return;
        }

        if (!this.canCaptureTouch(event)) {
            return;
        }

        if (this.swallowEvents) {
            this.captureTouch(event);
        }

        var time = cleverapps.timeouts.getTime();
        if (this.lastMouseMoveTime === time) {
            return;
        }
        this.lastMouseMoveTime = time;

        if (this.useHover) {
            this.handleMouseMove(event);
        }
    },

    onMouseScroll: function (event) {
        if (!this.canCaptureTouch(event)) {
            return;
        }

        if (this.swallowEvents) {
            this.captureTouch(event);
        }

        var time = cleverapps.timeouts.getTime();
        if (this.lastMouseScrollTime === time) {
            return;
        }
        this.lastMouseScrollTime = time;

        if (this.onMouseZoom) {
            this.handleMouseScroll(event);
        }
    },

    handleMouseMove: function (event) {
        var state = this.isTouchApplicable(event) && this.filter() ? "mouseover" : undefined;
        var changed = this.target.setInteractiveState(this.__instanceId + "_mouseover", state);
        if (changed) {
            if (state) {
                this.onMouseOver();
            } else {
                this.onMouseOut();
            }
        }
    },

    handleMouseScroll: function (event) {
        if (!this.isTouchApplicable(event) || !this.filter()) {
            return;
        }

        var scrollY = event.getScrollY();
        if (scrollY !== 0) {
            if (scrollY > 0) {
                scrollY = 0.1;
            } else {
                scrollY = -0.1;
            }
            this.onMouseZoom(scrollY);
        }
    },

    calcPinchDistance: function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
});

PointerHandler.STATE_NONE = 0;
PointerHandler.STATE_CLICK = 1;
PointerHandler.STATE_DRAG_START = 2;
PointerHandler.STATE_DRAG_MOVE = 3;

PointerHandler.DRAG_THROTTLE = 50;
PointerHandler.LONG_CLICK_TIMEOUT = 400;
PointerHandler.DOUBLE_CLICK_WAIT = 300;
PointerHandler.DRAG_HOLD_TIME = 300;

cleverapps.styles.PointerHandler = {
    clickThreshold: 20
};
