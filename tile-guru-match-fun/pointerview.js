/**
 * Created by Denis Kuzin on 17 july 2023
 */

var PointerView = cleverapps.Spine.extend({
    avoidNode: "PointerView",
    ctor: function (options) {
        this._super(bundles.finger.jsons.arrow_json);

        this.options = options || {};
        this.target = this.options.target;

        this.target.addChild(this);
        this.replaceParentSamePlace(cleverapps.scenes.getRunningScene(), { keepScale: true });

        this.afterResize();

        cleverapps.windows.on("openWindow", this.createListener(this.setVisible.bind(this, false)), this);
        cleverapps.windows.on("closeWindows", this.createListener(this.setVisible.bind(this, true)), this);

        this.setLocalZOrder(100);
    },

    definePosition: function (direction) {
        this.direction = direction;

        this.setAnimation(0, direction, true);
        var step = [PointerView.DIRECTIONS.DOWN, PointerView.DIRECTIONS.LEFT].indexOf(direction) !== -1 ? 1 : -1;
        if ([PointerView.DIRECTIONS.UP, PointerView.DIRECTIONS.DOWN].indexOf(direction) !== -1) {
            this.pointerPosition = cc.pMult(cc.p(0, (this.target.height + this.height) / 2 * step), this.scale);
        } else {
            this.pointerPosition = cc.pMult(cc.p((this.target.width + this.width) / 2 * step, 0), this.scale);
        }
    },

    guessDirection: function () {
        if (this.target instanceof MenuBarItemView) {
            return PointerView.DIRECTIONS.RIGHT;
        }
        if (typeof CardView !== "undefined" && this.target instanceof CardView) {
            return PointerView.DIRECTIONS.DOWN;
        }
        if (!this.target.getParent()) {
            return PointerView.DIRECTIONS.UP;
        }

        var scene = cleverapps.scenes.getRunningScene();
        var coords = scene.convertToNodeSpace(this.target.getPosition());

        if (coords.y > scene.height * 4 / 5) {
            return PointerView.DIRECTIONS.UP;
        }

        if (coords.x < scene.width / 5) {
            return PointerView.DIRECTIONS.RIGHT;
        }

        if (coords.x > scene.width * 4 / 5) {
            return PointerView.DIRECTIONS.LEFT;
        }

        return PointerView.DIRECTIONS.DOWN;
    },

    afterResize: function () {
        var targetParent = this.target.parent;
        if (!targetParent) {
            targetParent = cleverapps.scenes.getRunningScene();
        }

        var direction = this.guessDirection();
        if (direction !== this.direction) {
            this.definePosition(direction);
        }

        var centerTarget = this.parent.convertToNodeSpace(targetParent.convertToWorldSpace(this.target.getPosition()));
        this.setPosition(centerTarget.x + this.pointerPosition.x, centerTarget.y + this.pointerPosition.y);
    }
});

PointerView.create = function (options) {
    options = options || {};

    var pointer = new PointerView(options);

    PointerView.remove(PointerView.currentPointer);
    PointerView.currentPointer = pointer;

    addCleaner(pointer, function () {
        PointerView.remove(pointer);
    });

    return pointer;
};

PointerView.remove = function (pointer) {
    if (!pointer || PointerView.currentPointer !== pointer) {
        return;
    }

    PointerView.currentPointer = undefined;
    pointer.removeFromParent();
};

PointerView.DIRECTIONS = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
};