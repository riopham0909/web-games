/**
 * Created by vladislav on 20/02/2023
 */

cleverapps.UI.CarouselView = cc.Node.extend({
    ctor: function (items, options) {
        this._super(items, options);

        this.items = items;

        this.items.forEach(function (item, index) {
            cleverapps.UI.onClick(item, function () {
                this.setCurrent(index);
            }.bind(this));
        }, this);

        this.amount = items.length;
        this.direction = options.direction;
        this.onChange = options.onChange;

        this.content = new cleverapps.Layout(items, options);
        this.setAnchorPoint2();
        var size = this.content.getContentSize();
        var sceneSize = cleverapps.UI.getSceneSize();
        if (this.direction === cleverapps.UI.HORIZONTAL) {
            size.width = Math.min(sceneSize.width, size.width * 2);
        } else {
            size.height = Math.min(sceneSize.height, size.height * 2);
        }
        this.setContentSize2(size);
        this.addChild(this.content);
        this.content.setPositionRound(this.width / 2, this.height / 2);
        this.content.setAnchorPoint2(0, 0.5);

        var stopDrag = false;
        cleverapps.UI.onDrag(this, {
            onDragStart: function () {
                stopDrag = false;
                return true;
            },
            onDragMove: function (touch) {
                if (stopDrag) {
                    return;
                }

                var styles = cleverapps.styles.CarouselView;
                var displacement = this.convertTouchToNodeSpaceDisplacement(touch);

                var dist = this.direction === cleverapps.UI.HORIZONTAL ? displacement.x : displacement.y;
                if (Math.abs(dist) > styles.minDist) {
                    this.setCurrent(this.current - cleverapps.sign(dist));
                    stopDrag = true;
                }
            }.bind(this)
        });

        this.setCurrent(0, true);
    },

    setCurrent: function (index, silent) {
        if (index > this.amount - 1 || index < 0) {
            return;
        }

        if (this.current === index) {
            return;
        }

        var currentItem = this.items[index];

        var targetPos = cc.p(this.width / 2, this.height / 2);
        if (this.direction === cleverapps.UI.HORIZONTAL) {
            targetPos.x = this.width / 2 - currentItem.x;
        } else {
            targetPos.y = this.height / 2 - currentItem.y;
        }

        if (silent) {
            this.content.setPositionRound(targetPos);
            if (this.current !== undefined) {
                this.items[this.current].setScale(1);
                this.items[this.current].baseScale = 1;
            }
            this.items[index].setScale(1.2);
            this.items[index].baseScale = 1.2;
        } else {
            var dist = cc.pDistance(targetPos, this.content.getPosition());
            var duration = Math.min(dist / cleverapps.styles.CarouselView.speed, 0.3);

            this.content.runAction(new cc.MoveTo(duration, targetPos));
            this.items[this.current].runAction(new cc.ScaleTo(duration, 1));
            this.items[this.current].baseScale = 1;
            this.items[index].runAction(new cc.ScaleTo(duration, 1.2));
            this.items[index].baseScale = 1.2;
        }

        this.current = index;

        this.onChange(index, silent);
    }
});

cleverapps.styles.CarouselView = {
    minDist: 100,

    speed: 1500
};