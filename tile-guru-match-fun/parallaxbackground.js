/**
 * Created by andrey on 15.03.19.
 */

var PagesViewParallax = function (styles, parent, direction) {
    this.parallaxBackgrounds = [];
    this.direction = direction;

    if (styles && styles.layers) {
        var sceneSize = cleverapps.UI.getSceneSize();
        var width = styles.width === "scene" ? sceneSize.width : styles.width;
        var height = styles.height === "scene" ? sceneSize.height : styles.height;

        for (var layer = 0; layer < styles.layers[cleverapps.resolution.mode]; layer++) {
            var bg = bundles.main.urls["episodes_bg_jpg_" + layer];
            
            if (!bg) {
                continue;
            }

            var parallaxBg = new ParallaxBackground(styles.speed[layer], this.direction, function () {
                var node = new cc.Node();
                node.setContentSize2(width, height);
                node.setAnchorPoint2();

                if (bg) {
                    var sprite = new cc.Sprite(bg);
                    sprite.setPositionRound(node.width / 2, node.height / 2);
                    this.parallaxBackgrounds.push(sprite);
                    node.addChild(sprite);
                }

                return node;
            }.bind(this));
            parallaxBg.setLocalZOrder(styles.zIndex[layer]);
            parent.addChild(parallaxBg);
        }
        this.updateScale();
    }
};

PagesViewParallax.prototype.updateScale = function () {
    var sceneSize = cleverapps.UI.getSceneSize();
    this.parallaxBackgrounds.forEach(function (background) {
        var scale = Math.max(sceneSize.width / background.width, sceneSize.height / background.height);
        background.setScale(scale);
    });
};

var ParallaxBackground = cc.Node.extend({
    ctor: function (ratio, direction, factory) {
        this._super();

        this.ratio = ratio;
        this.direction = direction;

        var frame1 = this.frame1 = new ParallaxFrame(factory(0), cc.p(0, 0), direction);
        this.addChild(frame1);
        var frame2 = this.frame2 = new ParallaxFrame(factory(1), cc.p(frame1.width - 2, frame1.height - 2), direction);
        this.addChild(frame2);

        this.scheduleUpdate();
    },

    onEnterTransitionDidFinish: function () {
        this._super();

        this.updatePosition();
    },

    update: function (dt) {
        this._super(dt);

        this.updatePosition();
    },

    updatePosition: function () {
        this.y = -this.parent.y * (1 - this.ratio);
        this.x = -this.parent.x * (1 - this.ratio);

        this.frame1.updatePosition();
        this.frame2.updatePosition();
    }
});

var ParallaxFrame = cc.Node.extend({
    ctor: function (frame, offset, direction) {
        this._super();

        this.direction = direction;
        this.offset = offset;

        this.frame = frame;
        this.addChild(frame);

        this.setContentSize2(frame.getContentSize());
        this.setAnchorPoint2();

        this.setPositionRound(this.width / 2, this.height / 2);
    },

    updatePosition: function () {
        var winSize = cleverapps.UI.getSceneSize();

        var frame = this.frame;

        var width = frame.width;
        var height = frame.height;

        if (this.direction === PagingScrollView.DIRECTIONS.Horizontal) {
            var zeroX = -(this.parent.parent.x + this.parent.x);
            frame.x = Math.floor(zeroX / width) * width + width / 2 + this.offset.x;
            frame.y = height / 2;

            frame.visible = (-zeroX + frame.x + width / 2) >= 0 && (-zeroX + frame.x - width / 2) < winSize.width;
        } else {
            var zeroY = -(this.parent.parent.y + this.parent.y);
            frame.x = width / 2;
            frame.y = Math.floor(zeroY / height) * height + height / 2 + this.offset.y;

            frame.visible = (-zeroY + frame.y + height / 2) >= 0 && (-zeroY + frame.y - height / 2) < winSize.height;
        }
    }
});