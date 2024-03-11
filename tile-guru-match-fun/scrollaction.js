/**
 * Created by vtbelo on 09.08.2022
 */

cc.ScrollAction = cc.ActionInterval.extend({
    ctor: function (targetNode, params) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._params = params || {};

        var duration = this._params.duration === undefined ? cc.ScrollAction.SCROLL_TO_DURATION : this._params.duration;
        if (this._params.silent) {
            duration = 0;
        }

        this._creationStack = new Error().stack;

        this._targetNode = targetNode;

        cc.ActionInterval.prototype.initWithDuration.call(this, duration);
    },

    startWithTarget: function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        this._startPosition = this.target.getContainerPosition();

        if (target.isMapScroll && cleverapps.meta.isFocused() && !this._params.allowScrollWithFocus && !Game.currentGame.tutorial.isActive()) {
            if (!this._params.skipFocusReport) {
                cleverapps.throwAsync("Trying to scroll with focus, stack - " + this._creationStack);
            }

            return;
        }

        if ((this._targetNode instanceof cc.Node) && !this._targetNode.isRunning()) {
            return;
        }

        target.stopAutoScroll();
        cc.ScrollAction._UID++;
        this._UID = cc.ScrollAction._UID;

        if (typeof this._targetNode === "number") {
            this._targetPosition = this.target.normalizePoint(this.target.targetToPoint(this._targetNode, this._params.padding));
        } else if (!this._targetNode || typeof this._targetNode === "object" && this._targetNode.stopListeners) {
            this._targetPosition = this._startPosition;
        } else if (this._params.targetPoint) {
            this._targetPosition = this._targetNode;
        } else if (this._params.visibleBox) {
            var delta = this.target.calcNodeDelta(this._targetNode, this._params);
            this._targetPosition = cc.pAdd(this._startPosition, delta);
        } else {
            this._targetPosition = this.target.normalizePoint(this.target.targetToPoint(this._targetNode, this._params.padding));
        }
    },

    clone: function () {
        return new cc.ScrollAction(this._targetNode, this._params);
    },

    stop: function () {
        if (cc.ScrollAction._UID === this._UID) {
            this.target._scrollActionRunning = false;
        }
    },

    update: function (time) {
        if (cc.ScrollAction._UID === this._UID) {
            time = this._computeEaseTime(time);
            this.target.scrollToPoint(cc.pAdd(this._startPosition, cc.pMult(cc.pSub(this._targetPosition, this._startPosition), time)));
            this.target._scrollActionRunning = true;
        }
    }
});

cc.ScrollAction._UID = 0;
cc.ScrollAction.SCROLL_TO_DURATION = 1;