/**
 * Created by iamso on 05.11.2020.
 */

var ScrollBarHandler = function (scroll) {
    this.scroll = scroll;
};

ScrollBarHandler.prototype.reset = function () {
    if (!this.barY && (this.scroll.dir & cleverapps.UI.ScrollView.DIR_VERTICAL) && this.scroll.min.y !== this.scroll.max.y) {
        this.barY = new ScrollBar(this.scroll, cleverapps.UI.ScrollView.DIR_VERTICAL);
    }
    if (!this.barX && (this.scroll.dir & cleverapps.UI.ScrollView.DIR_HORIZONTAL) && this.scroll.min.x !== this.scroll.max.x) {
        this.barX = new ScrollBar(this.scroll, cleverapps.UI.ScrollView.DIR_HORIZONTAL);
    }

    if (this.barX) {
        this.barX.reset();
    }
    if (this.barY) {
        this.barY.reset();
    }

    this.updatePos();
};

ScrollBarHandler.prototype.setAutoHide = function (enable) {
    if (this.barX) {
        this.barX.setAutoHideEnabled(enable);
    }
    if (this.barY) {
        this.barY.setAutoHideEnabled(enable);
    }
};

ScrollBarHandler.prototype.setPadding = function (padding) {
    this.barPadding = padding;
    if (this.barX) {
        this.barX.setPadding(this.barPadding);
    }
    if (this.barY) {
        this.barY.setPadding(this.barPadding);
    }
};

ScrollBarHandler.prototype.updatePos = function () {
    var outOfBoundary = this.scroll.scrollHandler.getHowMuchOutOfBoundary();
    if (this.barY) {
        this.barY.onScrolled(outOfBoundary);
    }
    if (this.barX) {
        this.barX.onScrolled(outOfBoundary);
    }
};

ScrollBarHandler.prototype.onTouchBegan = function () {
    if (this.barY) {
        this.barY.onTouchBegan();
    }
    if (this.barX) {
        this.barX.onTouchBegan();
    }
};

ScrollBarHandler.prototype.onTouchEnded = function () {
    if (this.barY) {
        this.barY.onTouchEnded();
    }
    if (this.barX) {
        this.barX.onTouchEnded();
    }
};

var ScrollBar = cc.Node.extend({
    ctor: function (scroll, dir) {
        this._super();

        this.scroll = scroll;
        this.dir = dir;

        this._touching = false;
        this._autoHideRemainingTime = 0;
        this._marginFromBoundary = ScrollBar.DEFAULT_MARGIN;
        this._marginForLength = ScrollBar.DEFAULT_MARGIN;
        this.opacity = 255 * ScrollBar.DEFAULT_SCROLLBAR_OPACITY;
        this.autoHideTime = ScrollBar.DEFAULT_AUTO_HIDE_TIME;
        this._autoHideEnabled = true;

        this.init();

        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);

        scroll.barContainer.addChild(this);

        this.setAutoHideEnabled(false);

        this.setPadding(this.scroll.barHandler.barPadding);
        this.addControls();
        this.setWidth(cleverapps.styles.ScrollBar.barWidth);
    },

    init: function () {
        this.bar = new cc.Scale9Sprite(bundles.scrollbar.frames.scrollbar_png);
        this.bar.setAnchorPoint2(0.5, 0);
        this.addChild(this.bar);

        this.setColor(ScrollBar.DEFAULT_COLOR);
        this.onScrolled(cc.p(0, 0));
        cc.Node.prototype.setOpacity.call(this, 0);
        this._autoHideRemainingTime = 0;

        if (this.dir === cleverapps.UI.ScrollView.DIR_HORIZONTAL) {
            this.setRotation(90);
        }
    },

    setPositionFromCorner: function (positionFromCorner) {
        if (this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL) {
            this._marginForLength = positionFromCorner.y;
            this._marginFromBoundary = positionFromCorner.x;
        } else {
            this._marginForLength = positionFromCorner.x;
            this._marginFromBoundary = positionFromCorner.y;
        }
    },

    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.scheduleUpdate();
    },

    getPositionFromCorner: function () {
        if (this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL) {
            return cc.p(this._marginFromBoundary, this._marginForLength);
        }
        
        return cc.p(this._marginForLength, this._marginFromBoundary);
    },

    setWidth: function (width) {
        this.bar.width = width;
    },

    setAutoHideEnabled: function (autoHideEnabled) {
        this._autoHideEnabled = autoHideEnabled;

        if (!this._autoHideEnabled && !this._touching && this._autoHideRemainingTime <= 0) {
            cc.Node.prototype.setOpacity.call(this, this.opacity);
        } else {
            cc.Node.prototype.setOpacity.call(this, 0);
        }
    },

    isAutoHideEnabled: function () {
        return this._autoHideEnabled;
    },

    setOpacity: function (opacity) {
        this._opacity = opacity;
    },

    getOpacity: function () {
        return this._opacity;
    },

    _updateLength: function (length) {
        this.bar.height = length;
    },

    _processAutoHide: function (dt) {
        if (!this._autoHideEnabled || this._autoHideRemainingTime <= 0) {
            return;
        }
        if (this._touching) {
            // If it is touching, don't auto hide.
            return;
        }

        this._autoHideRemainingTime -= dt;
        if (this._autoHideRemainingTime <= this.autoHideTime) {
            this._autoHideRemainingTime = Math.max(0, this._autoHideRemainingTime);
            cc.Node.prototype.setOpacity.call(this, this._opacity * (this._autoHideRemainingTime / this.autoHideTime));
        }
    },

    update: function (dt) {
        this._processAutoHide(dt);
    },

    onTouchBegan: function () {
        if (!this._autoHideEnabled) {
            return;
        }
        this._touching = true;
    },

    onTouchEnded: function () {
        if (!this._autoHideEnabled) {
            return;
        }
        this._touching = false;

        if (this._autoHideRemainingTime <= 0) {
            // If the remaining time is 0, it means that it didn't moved after touch started so scroll bar is not showing.
            return;
        }
        this._autoHideRemainingTime = this.autoHideTime;
    },

    _calculateLength: function (innerContainerMeasure, scrollViewMeasure, outOfBoundaryValue) {
        var denominatorValue = innerContainerMeasure;
        if (outOfBoundaryValue !== 0) {
            // If it is out of boundary, the length of scroll bar gets shorter quickly.
            var GETTING_SHORTER_FACTOR = 20;
            denominatorValue += (outOfBoundaryValue > 0 ? outOfBoundaryValue : -outOfBoundaryValue) * GETTING_SHORTER_FACTOR;
        }

        var lengthRatio = scrollViewMeasure / denominatorValue;
        return Math.abs(scrollViewMeasure - 2 * this._marginForLength) * lengthRatio;
    },

    _calculatePosition: function (innerContainerMeasure, scrollViewMeasure, innerContainerPosition, outOfBoundaryValue, length) {
        var denominatorValue = innerContainerMeasure - scrollViewMeasure;
        if (outOfBoundaryValue !== 0) {
            denominatorValue += Math.abs(outOfBoundaryValue);
        }

        var positionRatio = 0;

        if (denominatorValue !== 0) {
            positionRatio = innerContainerPosition / denominatorValue;
            positionRatio = Math.max(positionRatio, 0);
            positionRatio = Math.min(positionRatio, 1);
        }

        var position = (scrollViewMeasure - length - 2 * this._marginForLength) * positionRatio + this._marginForLength;

        if (this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL) {
            return cc.p(this.scroll.width - this._marginFromBoundary, position);
        }
        
        return cc.p(position, this._marginFromBoundary);
    },

    setPadding: function (data) {
        data = data || {};
        var styles = cleverapps.styles.ScrollBar;

        var cornerPadding = data.cornerPadding !== undefined ? data.cornerPadding : styles.cornerPadding;
        var sidePadding = data.sidePadding !== undefined ? data.sidePadding : styles.sidePadding;

        var padding = cc.p(
            this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL ? sidePadding : cornerPadding,
            this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL ? cornerPadding : sidePadding
        );
        this.setPositionFromCorner(padding);
        this.onScrolled(this.scroll.scrollHandler.getHowMuchOutOfBoundary());
    },

    reset: function () {
        var isActive = this.scroll.dir & this.dir;
        if (isActive) {
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    },

    onScrolled: function (outOfBoundary) {
        if (this._autoHideEnabled) {
            this._autoHideRemainingTime = this.autoHideTime;
            cc.Node.prototype.setOpacity.call(this, this.opacity);
        }

        var innerContainer = this.scroll.getInnerContainer();

        var innerContainerMeasure = 0;
        var scrollViewMeasure = 0;
        var outOfBoundaryValue = 0;
        var innerContainerPosition = 0;

        if (this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL) {
            innerContainerMeasure = innerContainer.height;
            scrollViewMeasure = this.scroll.height;
            outOfBoundaryValue = outOfBoundary.y;
            innerContainerPosition = -innerContainer.getPositionY() + (this.scroll.max.y - this.scroll.min.y) / 2;
        } else if (this.dir === cleverapps.UI.ScrollView.DIR_HORIZONTAL) {
            innerContainerMeasure = innerContainer.width;
            scrollViewMeasure = this.scroll.width;
            outOfBoundaryValue = outOfBoundary.x;
            innerContainerPosition = -innerContainer.getPositionX() + (this.scroll.max.x - this.scroll.min.x) / 2;
        }

        var length = this._calculateLength(innerContainerMeasure, scrollViewMeasure, outOfBoundaryValue);
        var position = this._calculatePosition(innerContainerMeasure, scrollViewMeasure, innerContainerPosition, outOfBoundaryValue, length);
        this._updateLength(length);
        this.setPosition(position);
    },

    getActualContentSize: function () {
        return this.bar.getContentSize();
    },

    addControls: function () {
        cleverapps.UI.onDrag(this.bar, {
            instantDrag: true,

            onDragStart: function () {
                this.scroll.scrollHandler.stopAutoScroll();
                return true;
            }.bind(this),

            followPointer: function (touch) {
                var point = this.convertToNodeSpace(touch.getLocation());
                var prevPoint = this.convertToNodeSpace(touch.getPreviousLocation());
                var delta = cc.pSub(point, prevPoint);

                var percent = this.getPosToPercent(delta);
                this.scroll.scrollToPercent(percent);
            }.bind(this)
        });
    },

    getPosToPercent: function (delta) {
        var range;
        if (this.dir === cleverapps.UI.ScrollView.DIR_VERTICAL) {
            range = this.scroll.height - this.getPositionFromCorner().y * 2 - this.getActualContentSize().height;
            return (this.y + delta.y - this.getPositionFromCorner().y) / range * 100;
        }

        range = this.scroll.width - this.getPositionFromCorner().x * 2 - this.getActualContentSize().height;
        return (this.x + delta.y - this.getPositionFromCorner().x) / range * 100;
    }
});

Object.defineProperty(ScrollBar.prototype, "opacity", {
    get: function () {
        return this.getOpacity();
    },
    set: function (opacity) {
        this.setOpacity(opacity);
    }
});

cleverapps.styles.ScrollBar = {
    barWidth: 12,
    cornerPadding: 20,
    sidePadding: 20
};

ScrollBar.DEFAULT_COLOR = new cc.Color(52, 65, 87);
ScrollBar.DEFAULT_MARGIN = 20;
ScrollBar.DEFAULT_AUTO_HIDE_TIME = 0.2;
ScrollBar.DEFAULT_SCROLLBAR_OPACITY = 0.4;
ScrollBar.BASE_WIDTH = 12;