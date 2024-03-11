/**
 * Created by vladislav on 29/05/2023
 */

cleverapps.NodeDebugCommands = {
    parentCell: {
        description: "Parent cell",
        key: cc.KEY.c,
        filter: function () {
            return typeof EditorMap2dDecoratorView !== "undefined"
                && this instanceof EditorMap2dDecoratorView;
        },
        action: function (arrowKey) {
            var dx, dy;
            var mapView = Game.currentGame.map.getView();
            var cell = mapView.getCell(this.decorator.x, this.decorator.y);

            switch (arrowKey) {
                case cc.KEY.down: cell = mapView.getCell(this.decorator.x, this.decorator.y + 1); break;
                case cc.KEY.left: cell = mapView.getCell(this.decorator.x - 1, this.decorator.y); break;
                case cc.KEY.up: cell = mapView.getCell(this.decorator.x, this.decorator.y - 1); break;
                case cc.KEY.right: cell = mapView.getCell(this.decorator.x + 1, this.decorator.y); break;
                default: return;
            }

            mapView.addTile(this.decorator.getLayerId(), cell.cell.x, cell.cell.y, this);

            dx = Math.round((this.x - cell.x) / resolutionScale);
            dy = Math.round((this.y - cell.y) / resolutionScale);
            this.decorator.updateCell(cell.cell.x, cell.cell.y, dx, dy);
            this.unselect();
            this.select();
        }
    },
    anchor: {
        description: "Anchor",
        noDisplayUpdate: true,
        filter: function () {
            return cleverapps.flags.keyboardAnchorsMode || this.debugEditUnitAnchorsMode;
        },
        action: function (arrowKey) {
            switch (arrowKey) {
                case cc.KEY.left: (this.sprite || this).anchorX += 0.01; this.debugBorderDx += 0.01; break;
                case cc.KEY.right: (this.sprite || this).anchorX -= 0.01; this.debugBorderDx -= 0.01; break;
                case cc.KEY.down: this.anchorY += 0.01; this.debugBorderDy += 0.01; break;
                case cc.KEY.up: this.anchorY -= 0.01; this.debugBorderDy -= 0.01; break;
            }

            console.log("anchors: " + Math.floor((this.sprite || this).anchorX * 100) / 100 + " x " + Math.floor(this.anchorY * 100) / 100
                + "\toffsets: " + Math.floor(this.debugBorderDx * 100) / 100 + " x " + Math.floor(this.debugBorderDy * 100) / 100);

            if (typeof UnitView !== "undefined" && this instanceof UnitView) {
                cleverapps.git.edit("anchors", {
                    code: this.unit.code,
                    stage: this.unit.stage,
                    anchorX: Math.floor((this.sprite || this).anchorX * 100) / 100,
                    anchorY: Math.floor(this.anchorY * 100) / 100
                });
            }
        }
    },
    rotate: {
        description: "Rotate",
        key: cc.KEY.r,
        action: function (arrowKey) {
            switch (arrowKey) {
                case cc.KEY.down:
                case cc.KEY.left: --this.rotation; break;
                case cc.KEY.up:
                case cc.KEY.right: ++this.rotation; break;
            }

            this.onChangeRotation && this.onChangeRotation(this.rotation);
        }
    },
    scale: {
        description: "Scale",
        key: cc.KEY.s,
        action: function (arrowKey) {
            var valueToFixed = function (value) {
                return +(value).toFixed(2);
            };

            var scaleDeltaX = 0;
            var scaleDeltaY = 0;

            switch (arrowKey) {
                case cc.KEY.up:
                case cc.KEY.right:
                    scaleDeltaX = this.scaleX > 0 ? 0.05 : -0.05;
                    scaleDeltaY = this.scaleY > 0 ? 0.05 : -0.05;
                    break;
                case cc.KEY.down:
                case cc.KEY.left:
                    scaleDeltaX = this.scaleX > 0 ? -0.05 : 0.05;
                    scaleDeltaY = this.scaleY > 0 ? -0.05 : 0.05;
                    break;
            }

            this.scaleX = valueToFixed(this.scaleX + scaleDeltaX);
            this.scaleY = valueToFixed(this.scaleY + scaleDeltaY);

            this.onChangeScale && this.onChangeScale(scaleDeltaX, scaleDeltaY);
        }
    },
    mirror: {
        description: "Mirror",
        key: cc.KEY.m,
        action: function (arrowKey) {
            var valueToFixed = function (value) {
                return +(value).toFixed(2);
            };

            var scaleDeltaX = 0;
            var scaleDeltaY = 0;

            switch (arrowKey) {
                case cc.KEY.up:
                case cc.KEY.down:
                    scaleDeltaX = 0;
                    scaleDeltaY = -this.scaleY * 2;
                    break;
                case cc.KEY.left:
                case cc.KEY.right:
                    scaleDeltaX = -this.scaleX * 2;
                    scaleDeltaY = 0;
                    break;
            }

            this.scaleX = valueToFixed(this.scaleX + scaleDeltaX);
            this.scaleY = valueToFixed(this.scaleY + scaleDeltaY);

            this.onChangeScale && this.onChangeScale(scaleDeltaX, scaleDeltaY);
        }
    },
    width: {
        description: "Width",
        key: cc.KEY.w,
        filter: function () {
            return typeof EditorMap2dDecoratorView === "undefined" || !(this instanceof EditorMap2dDecoratorView);
        },
        action: function (arrowKey) {
            switch (arrowKey) {
                case cc.KEY.up: this.width++; break;
                case cc.KEY.down: this.width--; break;
            }
        }
    },
    height: {
        description: "Height",
        key: cc.KEY.h,
        filter: function () {
            return typeof EditorMap2dDecoratorView === "undefined" || !(this instanceof EditorMap2dDecoratorView);
        },
        action: function (arrowKey) {
            switch (arrowKey) {
                case cc.KEY.up: this.height++; break;
                case cc.KEY.down: this.height--; break;
            }
        }
    },
    fontSize: {
        description: "Font size",
        key: cc.KEY.f,
        filter: function () {
            return this instanceof cc.LabelTTF;
        },
        action: function (arrowKey) {
            switch (arrowKey) {
                case cc.KEY.up: this.setFontSize(this.getFontSize() + 1); break;
                case cc.KEY.down: this.setFontSize(this.getFontSize() - 1); break;
            }
        }
    },
    textDimensions: {
        description: "Text dimensions",
        key: cc.KEY.d,
        filter: function () {
            return this instanceof cc.LabelTTF;
        },
        action: function (arrowKey) {
            var dim = this.getDimensions();
            switch (arrowKey) {
                case cc.KEY.up: this.setDimensions(dim.width, dim.height + 1); break;
                case cc.KEY.down: this.setDimensions(dim.width, dim.height - 1); break;
                case cc.KEY.left: this.setDimensions(dim.width - 1, dim.height); break;
                case cc.KEY.right: this.setDimensions(dim.width + 1, dim.height); break;
            }
        }
    },
    move: {
        description: "Move",
        key: undefined,
        action: function (arrowKey) {
            var dt = cleverapps.keyboardController.isPressed(cc.KEY.shift) ? 10 : 1;
            switch (arrowKey) {
                case cc.KEY.left: this.x -= dt; this.debugBorderDx -= dt; break;
                case cc.KEY.right: this.x += dt; this.debugBorderDx += dt; break;
                case cc.KEY.down: this.y -= dt; this.debugBorderDy -= dt; break;
                case cc.KEY.up: this.y += dt; this.debugBorderDy += dt; break;
            }

            if (typeof EditorMap2dDecoratorView !== "undefined" && this instanceof EditorMap2dDecoratorView) {
                var cell = Game.currentGame.map.getView().getCell(this.decorator.x, this.decorator.y);
                var dx = Math.round((this.x - cell.x) / resolutionScale);
                var dy = Math.round((this.y - cell.y) / resolutionScale);
                this.decorator.updatePosition(dx, dy, this.decorator.rotation);
            }
        }
    }
};
