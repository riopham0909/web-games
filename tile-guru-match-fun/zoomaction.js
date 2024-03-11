/**
 * Created by vtbelo on 09.08.2022
 */

cc.ZoomAction = cc.ActionInterval.extend({
    ctor: function (duration, params) {
        cc.ActionInterval.prototype.ctor.call(this);
        this._params = params;
        cc.ActionInterval.prototype.initWithDuration.call(this, duration);
    },

    startWithTarget: function (target) {
        cc.ZoomAction._UID++;
        this._UID = cc.ZoomAction._UID;

        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        var zoomHandler = this.getZoomHandler();
        this._startZoom = zoomHandler.target.zoom;

        this._targetZoom = this._params.zoom;
        if (this._params.zoomKoef) {
            this._targetZoom = zoomHandler.normalizeZoom(this._startZoom * this._params.zoomKoef);
        }
        if (this._params.maxZoom && this._targetZoom > this._params.maxZoom) {
            this._targetZoom = this._params.maxZoom;
        }

        if (this._params.direction === cleverapps.UI.ZoomHandler.ZOOM_DIRECTION_IN && this._targetZoom < this._startZoom) {
            this._targetZoom = this._startZoom;
        }
        if (this._params.direction === cleverapps.UI.ZoomHandler.ZOOM_DIRECTION_OUT && this._targetZoom > this._startZoom) {
            this._targetZoom = this._startZoom;
        }

        if (this._params.zoomFocus) {
            this._zoomFocusStartPosition = this.target.getContainerPosition();
            this._zoomFocusTargetPosition = this.target.targetToPoint(this._params.zoomFocus, this._params.zoomFocusPadding);
        }
    },

    clone: function () {
        return new cc.ZoomAction(this._duration, this._params);
    },

    getZoomHandler: function () {
        return this.target.zoomHandler;
    },

    stop: function () {
        this.getZoomHandler()._zoomRunning = false;
        this.target.onUpdateZoomListener();
    },

    update: function (time) {
        if (cc.ZoomAction._UID === this._UID) {
            time = this._computeEaseTime(time);
            if (this._zoomFocusTargetPosition) {
                this.target.scrollToPoint(this.target.normalizePoint(cc.pAdd(this._zoomFocusStartPosition, cc.pMult(cc.pSub(this._zoomFocusTargetPosition, this._zoomFocusStartPosition), time))));
            }
            this.getZoomHandler().setZoom(this._startZoom + (this._targetZoom - this._startZoom) * time, true);
            this.getZoomHandler()._zoomRunning = true;
        }
    }
});

cc.ZoomAction._UID = 0;