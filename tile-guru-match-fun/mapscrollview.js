/**
 * Created by iamso on 23.01.2020.
 */

var MapScrollView = cc.Node.extend({
    ctor: function () {
        this._super();

        this.container = new cc.Node();
        this.addChild(this.container);
        this.scheduleUpdate();

        this.scrollHandler = new cleverapps.UI.MapScrollHandler(this);

        this.zoom = 1;
        this.updateChildren = cleverapps.throttle(25, this.checkChildrenVisibility.bind(this));
    },

    zoomTo: function (options) {
        var startZoom = this.zoom;
        var timeStart = Date.now();

        var speed = (options.zoom - startZoom) / options.timeout;

        this._zoomInterval = setInterval(this.createListener(function () {
            var timeDiff = Date.now() - timeStart;
            if (timeDiff >= options.timeout) {
                this.setZoom(options.zoom);
                clearInterval(this._zoomInterval);

                if (options.onComplete) {
                    options.onComplete();
                }
                return;
            }
            this.setZoom(startZoom + speed * timeDiff, options.centerPoint);
        }), 13);
    },

    setZoom: function (zoom, centerPoint) {
        this.scrollHandler.stopAutoScroll();

        var size = cleverapps.UI.getBgSize();
        var innerContainerSize = this.getContainerSize();
        zoom = Math.max(zoom, cleverapps.styles.WorldMap.zoom.minScale, size.width / innerContainerSize.width, size.height / innerContainerSize.height);
        zoom = Math.min(zoom, 1.1);

        var oldZoom = this.zoom;
        this.zoom = zoom;
        this.setScale(this.zoom);
        var containerPosition = this.getContainerPosition();
        this.setContentSize2(Math.ceil(size.width / this.zoom), Math.ceil(size.height / this.zoom));

        var deltaWidth = 0;
        var deltaHeight = 0;

        if (oldZoom) {
            deltaWidth = Math.ceil(size.width / this.zoom) - Math.ceil(size.width / oldZoom);
            deltaHeight = Math.ceil(size.height / this.zoom) - Math.ceil(size.height / oldZoom);
        }

        if (centerPoint) {
            var miscenteredX = Math.abs(centerPoint.x) + size.width / 2 - innerContainerSize.width / 2;
            if (miscenteredX > 0) {
                if (centerPoint.x > 0) {
                    deltaWidth -= miscenteredX;
                } else {
                    deltaWidth += miscenteredX;
                }
            }

            var miscenteredY = Math.abs(centerPoint.y) + size.height / 2 - innerContainerSize.height / 2;
            if (miscenteredY > 0) {
                if (centerPoint.y > 0) {
                    deltaHeight -= miscenteredY;
                } else {
                    deltaHeight += miscenteredY;
                }
            }
        }

        this.setContainerPosition(this.availableScrollPosition({
            x: containerPosition.x + deltaWidth / 2,
            y: containerPosition.y + deltaHeight / 2
        }), this.zoom < oldZoom);
    },

    setContainerSize: function (size) {
        this.innerWidth = size.width;
        this.innerHeight = size.height;
        this.container.setContentSize2(size);
    },

    getContainerSize: function () {
        return this.container.getContentSize();
    },

    getContainerPosition: function () {
        return this.container.getPosition();
    },

    setContainerPosition: function (position, forceUpdate) {
        if (position.x === this.container.getPositionX() && position.y === this.container.getPositionY() && !forceUpdate) {
            return;
        }
        this.container.setPosition(position);

        this.updateChildren();
        this.scrollHandler.afterContainerMove();
    },

    update: function (dt) {
        this._super(dt);
        this.scrollHandler.processAutoScroll(dt);
    },

    onEnter: function () {
        this._super();

        this.addControls();
    },
    
    checkChildrenVisibility: function () {
        this.container.getChildren().forEach(function (child) {
            if (!child.visible && this.isInContainer(child)) {
                child.visible = true;
            } else if (child.visible && !this.isInContainer(child)) {
                child.visible = false;
            }
        }, this); 
    },

    isInContainer: function (node) {
        var padding = cleverapps.styles.MapScrollView.visiblePadding;

        var containerPos = this.getContainerPosition();
        var size = this.getContentSize();

        var rect = cc.rect(-containerPos.x, -containerPos.y, size.width, size.height);

        var nodeRect = node.getBoundingBox();
        nodeRect.x -= padding.width / 2;
        nodeRect.y -= padding.height / 2;
        nodeRect.width += padding.width / 2;
        nodeRect.height += padding.height / 2;

        var intersection = cc.rectIntersection(rect, nodeRect);
        return intersection.width > 0 && intersection.height > 0;
    },

    addControls: function () {
        cleverapps.UI.onDrag(this, {
            onMouseZoom: function (delta) {
                var speed = 1;
                if (this.zoom <= 0.3) {
                    speed = 0.3;
                } else if (this.zoom <= 0.5) {
                    speed = 0.5;
                }

                this.setZoom(this.zoom + delta * speed);
            }.bind(this),

            onPinchZoom: cc.sys.capabilities.touches && function (delta) {
                this.setZoom(this.zoom + delta);
            }.bind(this),

            onPressed: function () {
                this.scrollHandler.stopAutoScroll();
            }.bind(this),

            onClick: this.onClick && this.onClick.bind(this),

            onDragStart: this.onTouchBegan.bind(this),
            followPointer: this.onTouchMoved.bind(this),
            onDragEnd: this.onTouchEnded.bind(this)
        });
    },

    onTouchBegan: function () {
        this.container.stopAllActions();
        this.scrollHandler.handlePress();
        return true;
    },

    onTouchMoved: function (touch) {
        var point = this.convertToNodeSpace(touch.getLocation());
        var prevPoint = this.convertToNodeSpace(touch.getPreviousLocation());
        var delta = cc.pSub(point, prevPoint);

        this.scrollHandler.gatherMoveData(delta);
        this.moveContainer(delta);
    },

    onTouchEnded: function (touch) {
        var point = this.convertToNodeSpace(touch.getLocation());
        var prevPoint = this.convertToNodeSpace(touch.getPreviousLocation());
        var deltaMove = cc.pSub(point, prevPoint);
        this.scrollHandler.handleRelease(deltaMove);
    },

    moveContainer: function (delta) {
        var newPos = cc.pAdd(this.getContainerPosition(), delta);
        this.setContainerPosition(newPos);
    }
});

cleverapps.styles.MapScrollView = {
    visiblePadding: {
        width: 40,
        height: 40
    }
};