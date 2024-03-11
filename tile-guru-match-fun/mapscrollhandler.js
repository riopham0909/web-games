/**
 * Created by iamso on 30.01.2020.
 */

cleverapps.UI.MapScrollHandler = function (target) {
    this.target = target;
    this.bounceEnabled = false;

    this.initAutoScrollParams();
};

cleverapps.UI.MapScrollHandler.prototype.initAutoScrollParams = function () {
    this._outOfBoundaryAmountDirty = true;
    this._outOfBoundaryAmount = cc.p(0, 0);
};

cleverapps.UI.MapScrollHandler.prototype.afterContainerMove = function () {
    this._outOfBoundaryAmountDirty = true;
};

cleverapps.UI.MapScrollHandler.prototype.handlePress = function () {
    this._autoScrolling = false;

    this._touchMovePreviousTimestamp = Date.now();
    this._touchMoveDisplacements = [];
    this._touchMoveTimeDeltas = [];
};

cleverapps.UI.MapScrollHandler.prototype.gatherMoveData = function (deltaMove) {
    var outOfBoundary = this.getHowMuchOutOfBoundary(deltaMove);
    deltaMove.x += outOfBoundary.x;
    deltaMove.y += outOfBoundary.y;

    while (this._touchMoveDisplacements.length >= 5) {
        this._touchMoveDisplacements.splice(0, 1);
        this._touchMoveTimeDeltas.splice(0, 1);
    }
    this._touchMoveDisplacements.push(deltaMove);

    var timestamp = Date.now();
    this._touchMoveTimeDeltas.push((timestamp - this._touchMovePreviousTimestamp) / 1000);
    this._touchMovePreviousTimestamp = timestamp;
};

cleverapps.UI.MapScrollHandler.prototype.handleRelease = function (deltaMove) {
    this.gatherMoveData(deltaMove);

    var touchVelocity = this.calcTouchVelocity();
    if (touchVelocity.x !== 0 || touchVelocity.y !== 0) {
        this.startInertialScroll(touchVelocity);
    }
};

cleverapps.UI.MapScrollHandler.prototype.processAutoScroll = function (deltaTime) {
    if (!this._autoScrolling) {
        return;
    }

    var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
    var brakingFactor = (this.isNecessaryAutoScrollBrake() ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1);

    this._autoScrollAccumulatedTime += deltaTime * (1 / brakingFactor);

    var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
    if (this._autoScrollAttenuate) {
        percentage -= 1;
        percentage = percentage * percentage * percentage * percentage * percentage + 1;
    }

    var newPosition = cc.pAdd(this._autoScrollStartPosition, cc.pMult(this._autoScrollTargetDelta, percentage));
    var reachedEnd = Math.abs(percentage - 1) <= 0.0001;

    var moveDelta = cc.pSub(newPosition, this.target.getContainerPosition());
    var outOfBoundary = this.getHowMuchOutOfBoundary(moveDelta);
    if (!this.fltEqualZero(outOfBoundary)) {
        newPosition.x += outOfBoundary.x;
        newPosition.y += outOfBoundary.y;
        reachedEnd = true;
    }

    if (reachedEnd) {
        this._autoScrolling = false;
    }
    this.target.moveContainer(cc.pSub(newPosition, this.target.getContainerPosition()));
};

cleverapps.UI.MapScrollHandler.prototype.isOutOfBoundary = function () {
    var outOfBoundary = this.getHowMuchOutOfBoundary();
    return !this.fltEqualZero(outOfBoundary);
};

cleverapps.UI.MapScrollHandler.prototype.calcTouchVelocity = function () {
    var totalTime = this._touchMoveTimeDeltas.reduce(function (a, b) {
        return a + b;
    }, 0);
    if (totalTime === 0 || totalTime >= this._touchTotalTimeThreshold) {
        return cc.p(0, 0);
    }

    var totalMovement = cc.p(0, 0);
    this._touchMoveDisplacements.forEach(function (point) {
        totalMovement.x += point.x;
        totalMovement.y += point.y;
    });

    return cc.pMult(totalMovement, 1 / totalTime);
};

cleverapps.UI.MapScrollHandler.prototype.isNecessaryAutoScrollBrake = function () {
    if (this._autoScrollBraking) {
        return true;
    }

    if (this.isOutOfBoundary()) {
        if (!this._autoScrollCurrentlyOutOfBoundary) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            this._autoScrollBraking = true;
            this._autoScrollBrakingStartPosition = this.getContainerPosition();
            return true;
        }
    } else {
        this._autoScrollCurrentlyOutOfBoundary = false;
    }
    return false;
};

cleverapps.UI.MapScrollHandler.prototype.startInertialScroll = function (touchVelocity) {
    var MOVEMENT_FACTOR = 0.7;
    var inertiaTotalMovement = cc.pMult(touchVelocity, MOVEMENT_FACTOR);
    var time = this.calculateAutoScrollTimeByInitialSpeed(cc.pLength(touchVelocity));
    this.startAutoScroll(inertiaTotalMovement, time, true);
};

cleverapps.UI.MapScrollHandler.prototype.calculateAutoScrollTimeByInitialSpeed = function (initialSpeed) {
    return Math.sqrt(Math.sqrt(initialSpeed / 5));
};

cleverapps.UI.MapScrollHandler.prototype.fltEqualZero = function (point) {
    return (Math.abs(point.x) <= 0.0001 && Math.abs(point.y) <= 0.0001);
};

cleverapps.UI.MapScrollHandler.prototype.startAutoScroll = function (deltaMove, timeInSec) {
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
        }
    }
};

cleverapps.UI.MapScrollHandler.prototype.stopAutoScroll = function () {
    this._autoScrolling = false;
};

cleverapps.UI.MapScrollHandler.prototype.getHowMuchOutOfBoundary = function (deltaMove) {
    if (deltaMove === undefined) {
        deltaMove = cc.p(0, 0);
    }

    if (deltaMove.x === 0 && deltaMove.y === 0 && !this._outOfBoundaryAmountDirty) {
        return this._outOfBoundaryAmount;
    }

    var outOfBoundaryAmount = cc.p(0, 0);
    var contBox = this.target.container.getBoundingBox();

    if (contBox.x + deltaMove.x > 0) {
        outOfBoundaryAmount.x = -(contBox.x + deltaMove.x);
    } else if ((contBox.width + contBox.x) + deltaMove.x < this.target.width) {
        outOfBoundaryAmount.x = this.target.width - ((contBox.width + contBox.x) + deltaMove.x);
    }

    if ((contBox.height + contBox.y) + deltaMove.y < this.target.height) {
        outOfBoundaryAmount.y = this.target.height - ((contBox.height + contBox.y) + deltaMove.y);
    } else if (contBox.y + deltaMove.y > 0) {
        outOfBoundaryAmount.y = -(contBox.y + deltaMove.y);
    }

    if (deltaMove.x === 0 && deltaMove.y === 0) {
        this._outOfBoundaryAmount = outOfBoundaryAmount;
        this._outOfBoundaryAmountDirty = false;
    }
    return outOfBoundaryAmount;
};