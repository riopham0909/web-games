/**
 * Created by iamso on 05.11.2020.
 */

cleverapps.UI.ScrollHandler = function (target, options) {
    options = options || {};
    this.target = target;
    this.bounceEnabled = true;
    this.outOfBoundaryScale = options.outOfBoundaryScale === undefined ? 0.5 : options.outOfBoundaryScale;
    this.inertialScrollFactor = options.inertialScrollFactor || 1;

    this.initAutoScrollParams();
    if (options.mouseScroll !== false) {
        this.enableMouseWheelScroll();
    }
    this.enableTouchScroll();
};

cleverapps.UI.ScrollHandler.prototype.enableMouseWheelScroll = function () {
    if ("mouse" in cc.sys.capabilities) {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseScroll: function (event) {
                if (this.target.isDisplayed() && cc.rectContainsPoint(cc.rect(0, 0, this.target.width, this.target.height), this.target.convertToNodeSpace(event.getLocation()))) {
                    if (cleverapps.meta.checkEventNode(this.target)) {
                        this.handleMouseWheel(event.getScrollY());
                        event.stopPropagation();
                    }
                }
            }.bind(this)
        }, this.target);
    }
};

cleverapps.UI.ScrollHandler.prototype.handleMouseWheel = function (dy) {
    // eslint-disable-next-line no-bitwise
    if ((this.target.dir & cleverapps.UI.ScrollView.DIR_VERTICAL) === 0) {
        return;
    }

    var dir = dy > 0 ? 1 : -1;
    var outOfBoundary = this.getHowMuchOutOfBoundary({ y: dir });
    if (!this.fltEqualZero(outOfBoundary)) {
        if (outOfBoundary.y < 0 && dy > 0 || outOfBoundary.y > 0 && dy < 0) {
            return;
        }
    }

    if (this.lastMouseWheelTime && this.lastMouseWheelTime > Date.now() - 100) {
        return;
    }

    if (!this.mouseWheelSpeed || this.lastMouseWheelTime < Date.now() - 500 || dy * this.mouseWheelSpeed < 0) {
        this.mouseWheelSpeed = 0;
    }

    // fix for iOS
    if (Math.abs(dy) < 65 && this.lastMouseWheelTime && this.lastMouseWheelTime > Date.now() - 2000) {
        return;
    }

    this.mouseWheelSpeed += cleverapps.styles.ScrollHandler.mouseWheelAcceleration * cleverapps.sign(dy);
    if (Math.abs(this.mouseWheelSpeed) > cleverapps.styles.ScrollHandler.mouseWheelMaxSpeed) {
        this.mouseWheelSpeed = cleverapps.sign(this.mouseWheelSpeed) * cleverapps.styles.ScrollHandler.mouseWheelMaxSpeed;
    }
    if (Math.abs(this.mouseWheelSpeed) < cleverapps.styles.ScrollHandler.mouseWheelMinSpeed) {
        this.mouseWheelSpeed = cleverapps.sign(this.mouseWheelSpeed) * cleverapps.styles.ScrollHandler.mouseWheelMinSpeed;
    }

    this.startInertialScroll(cc.p(0, this.mouseWheelSpeed));

    this.lastMouseWheelTime = Date.now();
};

cleverapps.UI.ScrollHandler.prototype.enableTouchScroll = function () {
    cleverapps.UI.onDrag(this.target, {
        onPressed: function () {
            this.stopAutoScroll();
        }.bind(this),
        onDragStart: this.onTouchBegan.bind(this),
        followPointer: this.onTouchMoved.bind(this),
        onDragEnd: this.onTouchEnded.bind(this)
    });
};

cleverapps.UI.ScrollHandler.prototype.onTouchBegan = function (touch) {
    if (this.target.touchScrollDisabled) {
        return false;
    }

    this.target.stopScrollAction();
    this.handlePress(touch);
    return true;
};

cleverapps.UI.ScrollHandler.prototype.onTouchMoved = function (touch) {
    if (this.target.touchScrollDisabled) {
        return;
    }

    this.handleMove(touch);
};

cleverapps.UI.ScrollHandler.prototype.onTouchEnded = function (touch) {
    if (this.target.touchScrollDisabled) {
        return;
    }

    this.handleRelease(touch);
};

cleverapps.UI.ScrollHandler.prototype.getTouchDelta = function (touch, onTouchEnd) {
    var point = this.target.convertToNodeSpace(touch.getLocation());
    var prevPoint = this.target.convertToNodeSpace(touch.getPreviousLocation());
    if (onTouchEnd && !cc.rectContainsPoint(cc.rect(0, 0, this.target.width, this.target.height), point)) {
        point = prevPoint;
    }
    var delta = cc.pMult(cc.pSub(prevPoint, point), 1 / this.target.zoom);
    // eslint-disable-next-line no-bitwise
    if ((this.target.dir & cleverapps.UI.ScrollView.DIR_HORIZONTAL) === 0) {
        delta.x = 0;
    }
    // eslint-disable-next-line no-bitwise
    if ((this.target.dir & cleverapps.UI.ScrollView.DIR_VERTICAL) === 0) {
        delta.y = 0;
    }
    return delta;
};

cleverapps.UI.ScrollHandler.prototype.initAutoScrollParams = function () {
    this._outOfBoundaryAmountDirty = true;
    this._outOfBoundaryAmount = cc.p(0, 0);
};

cleverapps.UI.ScrollHandler.prototype.afterContainerScale = function () {
    this._outOfBoundaryAmountDirty = true;

    var outOfBoundary = this.getHowMuchOutOfBoundary();
    if (!this.fltEqualZero(outOfBoundary)) {
        this.startAutoScroll(outOfBoundary, 0);
    }
};

cleverapps.UI.ScrollHandler.prototype.afterContainerMove = function () {
    this._outOfBoundaryAmountDirty = true;

    if (this.target.barHandler) {
        this.target.barHandler.updatePos();
    }
    if (this.bounceEnabled && !this.inTouch && !this._autoScrolling) {
        this.startBounceBackIfNeeded();
    }
};

cleverapps.UI.ScrollHandler.prototype.startBounceBackIfNeeded = function () {
    if (!this.bounceEnabled) {
        return false;
    }
    var bounceBackAmount = this.getHowMuchOutOfBoundary();
    if (this.fltEqualZero(bounceBackAmount)) {
        return false;
    }
    var BOUNCE_BACK_DURATION = 1.0;
    this.startAutoScroll(bounceBackAmount, BOUNCE_BACK_DURATION);
    return true;
};

cleverapps.UI.ScrollHandler.prototype.handlePress = function (touch) {
    this.inTouch = true;

    this.stopAutoScroll();

    this._touchMovePreviousTimestamp = touch.getLastModified();
    this._touchMoveDisplacements = [];
    this._touchMoveTimeDeltas = [];

    if (this.target.barHandler) {
        this.target.barHandler.onTouchBegan();
    }
};

cleverapps.UI.ScrollHandler.prototype.handleMove = function (touch) {
    var delta = this.getTouchDelta(touch);

    var outOfBoundary;

    if (this.bounceEnabled) {
        outOfBoundary = this.getHowMuchOutOfBoundary(delta);
        delta.x *= (outOfBoundary.x === 0 ? 1 : this.outOfBoundaryScale);
        delta.y *= (outOfBoundary.y === 0 ? 1 : this.outOfBoundaryScale);
    } else {
        outOfBoundary = this.getHowMuchOutOfBoundary(delta);
        delta.x += outOfBoundary.x;
        delta.y += outOfBoundary.y;
    }

    this.gatherMoveData(delta, touch);

    var newPos = cc.pAdd(this.target.getContainerPosition(), delta);
    this.moveContainer(newPos);
};

cleverapps.UI.ScrollHandler.prototype.gatherMoveData = function (deltaMove, touch) {
    while (this._touchMoveDisplacements.length >= 5) {
        this._touchMoveDisplacements.splice(0, 1);
        this._touchMoveTimeDeltas.splice(0, 1);
    }
    this._touchMoveDisplacements.push(deltaMove);

    var timestamp = touch.getLastModified();
    this._touchMoveTimeDeltas.push((timestamp - this._touchMovePreviousTimestamp) / 1000);
    this._touchMovePreviousTimestamp = timestamp;
};

cleverapps.UI.ScrollHandler.prototype.handleRelease = function (touch) {
    this.inTouch = false;

    var deltaMove = this.getTouchDelta(touch, true);

    this.gatherMoveData(deltaMove, touch);

    var bounceBackStarted = this.startBounceBackIfNeeded();
    if (!bounceBackStarted) {
        var touchVelocity = this.calcTouchVelocity();
        if (touchVelocity.x !== 0 || touchVelocity.y !== 0) {
            this.startInertialScroll(touchVelocity);
        }
    }

    if (this.target.barHandler) {
        this.target.barHandler.onTouchEnded();
    }
};

cleverapps.UI.ScrollHandler.prototype.calcAutoScrollPercentage = function () {
    var percentage = this._autoScrollAccumulatedTime < this._autoScrollTotalTime ? this._autoScrollAccumulatedTime / this._autoScrollTotalTime : 1;
    if (this._autoScrollAttenuate) {
        percentage -= 1;
        percentage = percentage * percentage * percentage * percentage * percentage + 1;
    }
    return percentage;
};

cleverapps.UI.ScrollHandler.prototype.processAutoScroll = function (deltaTime) {
    if (!this._autoScrolling || this.inTouch) {
        return;
    }

    var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
    var brakingFactor = 1;
    var percentage = this.calcAutoScrollPercentage();
    if (percentage >= 0 && percentage <= 1 && this.isNecessaryAutoScrollBrake()) {
        brakingFactor = OUT_OF_BOUNDARY_BREAKING_FACTOR;
    }

    this._autoScrollAccumulatedTime += deltaTime * (1 / brakingFactor);

    percentage = this.calcAutoScrollPercentage();

    var reachedEnd = Math.abs(percentage - 1) <= 0.0001;
    if (reachedEnd) {
        percentage = 1;
        this.stopAutoScroll();
    }

    var newPosition = cc.pAdd(this._autoScrollStartPosition, cc.pMult(this._autoScrollTargetDelta, percentage));
    newPosition = cc.pAdd(this._autoScrollBrakingStartPosition, cc.pMult(cc.pSub(newPosition, this._autoScrollBrakingStartPosition), brakingFactor));

    this.moveContainer(newPosition);
};

cleverapps.UI.ScrollHandler.prototype.moveContainer = function (newPos) {
    this.target.scrollToPoint(newPos);

    this.afterContainerMove();
};

cleverapps.UI.ScrollHandler.prototype.isOutOfBoundary = function () {
    var outOfBoundary = this.getHowMuchOutOfBoundary();
    return !this.fltEqualZero(outOfBoundary);
};

cleverapps.UI.ScrollHandler.prototype.calcTouchVelocity = function () {
    var totalTime = this._touchMoveTimeDeltas.reduce(function (a, b) {
        return a + b;
    }, 0);
    if (totalTime === 0 || totalTime >= 0.5) {
        return cc.p(0, 0);
    }

    var totalMovement = cc.p(0, 0);
    this._touchMoveDisplacements.forEach(function (point) {
        totalMovement.x += point.x;
        totalMovement.y += point.y;
    });

    return cc.pMult(totalMovement, 1 / totalTime);
};

cleverapps.UI.ScrollHandler.prototype.isNecessaryAutoScrollBrake = function () {
    if (this._autoScrollBraking) {
        return true;
    }

    if (this.isOutOfBoundary()) {
        if (!this._autoScrollCurrentlyOutOfBoundary) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            this._autoScrollBraking = true;
            this._autoScrollBrakingStartPosition = this.target.getContainerPosition();
            return true;
        }
    } else {
        this._autoScrollCurrentlyOutOfBoundary = false;
    }
    return false;
};

cleverapps.UI.ScrollHandler.prototype.startInertialScroll = function (touchVelocity) {
    var MOVEMENT_FACTOR = 0.7 * this.inertialScrollFactor;
    var inertiaTotalMovement = cc.pMult(touchVelocity, MOVEMENT_FACTOR);
    var time = this.calculateAutoScrollTimeByInitialSpeed(cc.pLength(touchVelocity));
    this.startAutoScroll(inertiaTotalMovement, time);
};

cleverapps.UI.ScrollHandler.prototype.calculateAutoScrollTimeByInitialSpeed = function (initialSpeed) {
    return Math.sqrt(Math.sqrt(initialSpeed / 5)) * this.inertialScrollFactor;
};

cleverapps.UI.ScrollHandler.prototype.fltEqualZero = function (point) {
    return (Math.abs(point.x) <= 0.0001 && Math.abs(point.y) <= 0.0001);
};

cleverapps.UI.ScrollHandler.prototype.startAutoScroll = function (deltaMove, timeInSec) {
    this._autoScrolling = true;
    this._autoScrollTargetDelta = deltaMove;
    this._autoScrollAttenuate = true;
    this._autoScrollStartPosition = this.target.getContainerPosition();
    this._autoScrollTotalTime = timeInSec;
    this._autoScrollAccumulatedTime = 0;
    this._autoScrollBraking = false;
    this._autoScrollBrakingStartPosition = cc.p(0, 0);

    var currentOutOfBoundary = this.getHowMuchOutOfBoundary();
    if (!this.fltEqualZero(currentOutOfBoundary)) {
        this._autoScrollCurrentlyOutOfBoundary = true;
        var afterOutOfBoundary = this.getHowMuchOutOfBoundary(deltaMove);
        if (currentOutOfBoundary.x * afterOutOfBoundary.x > 0 || currentOutOfBoundary.y * afterOutOfBoundary.y > 0) {
            this._autoScrollBraking = true;
            this._autoScrollBrakingStartPosition = this.target.getContainerPosition();
        }
    }
};

cleverapps.UI.ScrollHandler.prototype.stopAutoScroll = function () {
    this._autoScrolling = false;
};

cleverapps.UI.ScrollHandler.prototype.getHowMuchOutOfBoundary = function (deltaMove) {
    if (deltaMove === undefined) {
        deltaMove = cc.p(0, 0);
    }

    if (deltaMove.x === 0 && deltaMove.y === 0 && !this._outOfBoundaryAmountDirty) {
        return this._outOfBoundaryAmount;
    }

    var outOfBoundaryAmount = cc.p(0, 0);
    var contPos = this.target.getContainerPosition();

    if (contPos.x + deltaMove.x > this.target.max.x) {
        outOfBoundaryAmount.x = this.target.max.x - (contPos.x + deltaMove.x);
    } else if (contPos.x + deltaMove.x < this.target.min.x) {
        outOfBoundaryAmount.x = this.target.min.x - (contPos.x + deltaMove.x);
    }

    if (contPos.y + deltaMove.y < this.target.min.y) {
        outOfBoundaryAmount.y = this.target.min.y - (contPos.y + deltaMove.y);
    } else if (contPos.y + deltaMove.y > this.target.max.y) {
        outOfBoundaryAmount.y = this.target.max.y - (contPos.y + deltaMove.y);
    }

    if (deltaMove.x === 0 && deltaMove.y === 0) {
        this._outOfBoundaryAmount = outOfBoundaryAmount;
        this._outOfBoundaryAmountDirty = false;
    }
    return outOfBoundaryAmount;
};

cleverapps.UI.ScrollHandler.prototype.isProcessing = function () {
    return this.inTouch || this._autoScrolling;
};

cleverapps.styles.ScrollHandler = {
    mouseWheelAcceleration: 200,
    mouseWheelMinSpeed: 500,
    mouseWheelMaxSpeed: 2000
};
