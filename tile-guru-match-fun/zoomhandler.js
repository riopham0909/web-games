/**
 * Created by vladislav on 29.12.2020
 */

cleverapps.UI.ZoomHandler = function (target, options) {
    options = options || {};

    this.target = target;
    this.minZoom = options.minZoom || 0.8;
    this.maxZoom = options.maxZoom || 2.0;

    new PointerHandler(this.target, {
        onMouseZoom: function (delta) {
            var speed = 1;
            if (this.target.zoom <= 0.3) {
                speed = 0.3;
            } else if (this.target.zoom <= 0.5) {
                speed = 0.5;
            }

            this.target.stopScrollAction();
            this.setZoom(this.target.zoom + delta * speed);
        }.bind(this),

        onPinchZoom: cc.sys.capabilities.touches && function (delta) {
            this.target.stopScrollAction();
            this.setZoom(this.target.zoom + delta);
        }.bind(this)
    });
};

cleverapps.UI.ZoomHandler.prototype.normalizeZoom = function (zoom) {
    zoom = Math.round(zoom * 100) / 100;
    return Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
};

cleverapps.UI.ZoomHandler.prototype.setZoom = function (zoom, skipNormalization) {
    this.target.zoom = skipNormalization ? zoom : this.normalizeZoom(zoom);
    this.target.centerNode.setScale(this.target.zoom);
    this.target.updateVisibility();
    this.target.calcBorders();

    this.target.scrollHandler.afterContainerScale();
    this.target.onUpdateZoomListener();
};

cleverapps.UI.ZoomHandler.ZOOM_DIRECTION_IN = 0;
cleverapps.UI.ZoomHandler.ZOOM_DIRECTION_OUT = 1;
