/**
 * Created by slava on 6/8/17.
 */

cleverapps.Path = cc.Node.extend({
    ctor: function (pathColor, lineWidth) {
        this._super();

        this.baseColor = pathColor;
        this.pathColor = cc.color(this.baseColor);

        this.lineWidth = lineWidth || cleverapps.styles.Path.lineWidth;

        this.segments = [];
        for (var i = 0; i < cleverapps.Path.MAX_SEGMENTS; ++i) {
            this.segments.push(cleverapps.UI.createScale9Sprite(bundles.path.frames.line_png));
            this.segments[i].setAnchorPoint2(0, 0.5);
            this.segments[i].visible = false;
            this.addChild(this.segments[i]);
        }

        this.path = [];

        this.animatingInterval = undefined;

        this.drawTrailing = true;

        this.setCascadeOpacityEnabled(true);

        this.setLocalZOrder(-1);
    },

    clear: function () {
        this.segments.forEach(function (segment) {
            segment.visible = false;
        });
    },

    reset: function () {
        if (this.animatingInterval) {
            clearInterval(this.animatingInterval);
            this.animatingInterval = undefined;
        }
        this.clearFadeInInterval();

        this.path = [];
        this.pathColor = cc.color(this.baseColor);
        this.opacity = 255;
        this.draw();
    },

    clearFadeInInterval: function () {
        if (this.animateFadeInInterval !== undefined) {
            clearInterval(this.animateFadeInInterval);
            this.animateFadeInInterval = undefined;
        }
    },

    push: function (point) {
        this.path.push(point);

        this.draw();
    },

    pop: function () {
        this.path.pop();

        this.draw();
    },

    setPath: function (path) {
        this.path = path.map(function (pathItem) {
            return pathItem;
        });
    },

    listPath: function () {
        return this.path;
    },

    onExitTransitionDidStart: function () {
        this.reset();
        this._super();
    },

    drawSegment: function (from, to, index) {
        var d = 15 * resolutionScale / 2 * 0.9;
        var dist = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)) + d * 2;
        var segment = this.segments[index];
        segment.setColor(this.pathColor);
        segment.setContentSize2(dist, this.lineWidth);
        var angle = Math.round(Math.atan2(to.y - from.y, to.x - from.x) * 100) / 100;
        segment.setPositionRound(from.x - d * Math.cos(angle), from.y - d * Math.sin(angle));
        segment.rotation = -angle * 180 / Math.PI;
        segment.visible = true;
    },

    draw: function (trailing) {
        this.clear();

        if (this.path.length > 0) {
            var path = (this.drawTrailing && trailing) ? this.path.concat(trailing) : this.path;
            for (var i = 0; i < path.length - 1; i++) {
                this.drawSegment(path[i], path[i + 1], i);
            }
        }
    },

    stopAnimation: function () {
        if (this.animatingInterval) {
            this.reset();
        }
    },

    animateFadeIn: function (timeout) {
        timeout = timeout || 300;

        var t = 0, drawStep = 16;
        var drawLine = this.createListener(function () {
            this.opacity = Math.min(255, Math.floor(255 * (1 - (timeout - t) / timeout)));
            this.draw();
            t += drawStep;
            if (t >= timeout) {
                this.clearFadeInInterval();
            }
        });
        this.animateFadeInInterval = setInterval(drawLine, drawStep);
        drawLine();
    },

    animateFadeOut: function (timeout) {
        timeout = timeout || 300;

        var t = 0, drawStep = 16;
        var drawLine = this.createListener(function () {
            if (t >= timeout) {
                this.reset();
            } else {
                this.opacity = Math.floor(Math.min(155, this.baseColor.a) * (timeout - t) / timeout);
                this.draw();
                t += drawStep;
            }
        });

        this.stopAnimation();

        this.animatingInterval = setInterval(drawLine, drawStep);
        drawLine();
    }
});

cleverapps.Path.MAX_SEGMENTS = 10;

cleverapps.styles.Path = {
    lineWidth: 17
};