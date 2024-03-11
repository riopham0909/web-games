/**
 * Created by slava on 23.03.17.
 */

var FingerView = cc.Node.extend({
    ctor: function (options) {
        options = options || {};

        this._super();

        this.setAnchorPoint2();

        this.finger = new cc.Sprite(options.image || bundles.finger.frames.tutorial_hand_png);
        this.finger.setPositionRound(0, 0);
        this.addChild(this.finger);

        var styles = cleverapps.styles.FingerView;
        var anchors = styles[options.name] || styles.default;
        this.finger.setAnchorPoint2(anchors.anchorX, anchors.anchorY);

        if (cleverapps.gameModes.showFingerAnchor) {
            this.showAnchorPoint();
        }

        this.setCascadeOpacityEnabledRecursively(true);
        this.scheduleUpdateWithPriority(2);
    },

    clear: function () {
        delete this.actions;
        delete this.options;
    },

    updateSize: function () {
        this.reset();
    },

    reset: function () {
        this.finger.stopAllActions();
        this.finger.setVisible(false);
        this.pressed = false;

        if (this.pathNode) {
            this.pathNode.reset();
        }

        if (this.payload) {
            this.payload.stopAllActions();
            this.payload.setVisible(false);
        }

        if (this.path) {
            for (var i = 0; i < this.path.length; ++i) {
                var step = this.path[i];

                if (step.unselect) {
                    step.unselect();
                }
            }
        }

        this.play(this.options);
    },

    update: function () {
        var target = this.target;
        if (!target) {
            return;
        }

        if (!target.node.isRunning()) {
            FingerView.remove(this);
            return;
        }

        if (!this.skipLoop) {
            var visible = cleverapps.meta.checkEventNode(target.node) && target.node.isDisplayed();
            this.setVisible(visible);
        }

        var position = this.parent.convertToNodeSpace(target.node.convertToWorldSpace(target.position));
        this.setPosition(position.x + this.targetOffset.x, position.y + this.targetOffset.y);
    },

    rotateIfDoesNotFit: function (target) {
        for (var node = target.node; node; node = node.parent) {
            if (typeof Map2dView !== "undefined" && node instanceof Map2dView) {
                return;
            }
        }

        var clippingNode = cleverapps.scenes.getRunningScene();
        var clippingNodePos = clippingNode.convertToNodeSpace(target.node.convertToWorldSpace(target.position));
        clippingNodePos.y -= this.finger.height * this.finger.anchorY;
        clippingNodePos.x += this.finger.width * this.finger.anchorX;

        var rotation = 0;
        if (clippingNodePos.x >= clippingNode.width) {
            if (clippingNodePos.y <= 0) {
                rotation = 170;
            } else {
                rotation = 90;
            }
        } else if (clippingNodePos.y <= 0) {
            rotation = -80;
        }
        this.finger.setRotation(rotation);
    },

    enablePath: function (color) {
        this.pathNode = new cleverapps.Path(cc.color(color.r, color.g, color.b, FingerView.PATH_BASE_ALPHA));
        this.pathNode.lineWidth = FingerView.PATH_LINE_WIDTH;
        this.pathNode.setLocalZOrder(-2);
        this.addChild(this.pathNode);
        this.pathNode.runAction(new cc.RepeatForever(new cc.Sequence(
            new cc.DelayTime(0.02),
            new cc.CallFunc(function () {
                this.pathNode.draw(this.finger.getPosition());
            }.bind(this))
        )));
    },

    fadeIn: function () {
        var styles = cleverapps.styles.FingerView;

        this.finger.setOpacity(0);
        this.finger.setScale(1);

        return new cc.Spawn(
            new cc.Show(),
            new cc.MoveBy(0, 0, styles.offsetY),
            new cc.FadeIn(0.3),
            new cc.MoveBy(0.3, 0, -styles.offsetY)
        );
    },

    fadeOut: function () {
        var styles = cleverapps.styles.FingerView;

        return new cc.Sequence(
            new cc.Spawn(
                new cc.FadeOut(0.3),
                new cc.MoveBy(0.3, 0, styles.offsetY)
            ),
            new cc.Hide()
        );
    },

    press: function () {
        return new cc.Sequence(
            new cc.Spawn(
                new cc.RotateBy(0.2, FingerView.FINGER_CLICKED_ANGLE),
                new cc.ScaleTo(0.2, 0.7)
            ),
            new cc.CallFunc(function () {
                this.pressed = true;

                if (this.pathNode) {
                    this.pathNode.reset();
                    this.pathNode.push(this.finger.getPosition());
                }
            }.bind(this))
        );
    },

    release: function () {
        return new cc.Sequence(
            new cc.Spawn(
                new cc.RotateBy(0.2, -FingerView.FINGER_CLICKED_ANGLE),
                new cc.ScaleTo(0.2, 1)
            ),
            new cc.CallFunc(function () {
                this.pressed = false;

                if (this.pathNode) {
                    this.pathNode.animateFadeOut(400);
                }
            }.bind(this))
        );
    },

    moveTo: function (originOrDuration, target) {
        if (typeof originOrDuration !== "number") {
            originOrDuration = this.getMoveDuration(originOrDuration, target);
        }

        return new cc.Sequence(
            new cc.CallFunc(function () {
                var position = this.convertToNodeSpace(target.node.convertToWorldSpace(target.position));
                if (originOrDuration === 0) {
                    this.rotateIfDoesNotFit(target);
                }

                this.setTarget(target);

                if (this.payload) {
                    this.payload.runAction(new cc.MoveTo(originOrDuration, position));
                }
                this.finger.runAction(new cc.MoveTo(originOrDuration, position));
            }.bind(this)),
            new cc.DelayTime(originOrDuration),
            new cc.CallFunc(function () {
                if (this.pathNode && this.pressed) {
                    this.pathNode.push(this.finger.getPosition());
                }
            }.bind(this))
        );
    },

    prepareTarget: function (target) {
        if (target.node && target.position) {
            return {
                node: target.node,
                position: target.position
            };
        }

        if (target instanceof FingerView) {
            return {
                node: this,
                position: this.finger.getPosition()
            };
        }

        if (target instanceof cc.Node) {
            return {
                node: target,
                position: cc.p(target.width / 2, target.height / 2)
            };
        }

        if (typeof BaseBlock !== "undefined" && target instanceof BaseBlock) {
            return {
                node: cleverapps.scenes.getRunningScene().keypadView,
                position: BaseBlockView.alignInTheGrid(target.x, target.y),
                select: function () {
                    target.highlight();
                },
                unselect: function () {
                    target.unhighlight();
                }
            };
        }

        if (typeof DifferenceArea !== "undefined" && target instanceof DifferenceArea) {
            return {
                node: cleverapps.scenes.getRunningScene().photos.imageB,
                position: PhotoViews.FrameSizeAndPos(target)
            };
        }

        var mapView = Game.currentGame && Game.currentGame.map && Game.currentGame.map.getView();
        if (mapView) {
            return {
                node: mapView.animations,
                position: mapView.getUnitCenterPos(target.x, target.y)
            };
        }

        var battlefieldView = Game.currentGame && Game.currentGame.battlefield && Game.currentGame.battlefield.onGetView();
        if (battlefieldView) {
            return {
                node: battlefieldView,
                position: target
            };
        }

        var fieldView = Game.currentGame && Game.currentGame.fieldController && Game.currentGame.fieldController.fieldView;
        if (fieldView) {
            return {
                node: fieldView,
                position: Array.isArray(target) ? BaseCellView.alignInTheGrid(target[0], target[1]) : BaseCellView.alignInTheGrid(target.col, target.row)
            };
        }

        var gridView = Game.currentGame && Game.currentGame.grid && Game.currentGame.grid.getView();
        if (gridView) {
            return {
                node: gridView,
                position: GridView.cellToPosition(target)
            };
        }

        if (cleverapps.config.debugMode) {
            throw "unknown finger target";
        }

        return target;
    },

    setTarget: function (target) {
        this.target = target;
        this.targetOffset = cc.pSub(this.getPosition(), this.parent.convertToNodeSpace(target.node.convertToWorldSpace(target.position)));
    },

    zigzagTo: function (target) {
        var currentPoint = this.finger.getPosition();

        if (target instanceof cc.Node) {
            target = this.convertToNodeSpace(target.convertToWorldSpace(cc.p(target.width / 2, target.height / 2)));
        }

        var getMidpoint = function (start, end) {
            return cc.p(
                (start.x + end.x) / 2.0,
                (start.y + end.y) / 2.0
            );
        };

        var getPointLiesOnPerpendicularBisector = function (start, end, radius) {
            var midpoint = getMidpoint(start, end);

            var slope = -1.0 / ((end.y - start.y) / (end.x - start.x));

            return cc.p(
                midpoint.x + Math.cos(Math.atan(slope)) * radius,
                midpoint.y + Math.sin(Math.atan(slope)) * radius
            );
        };

        var distance = Math.sqrt(Math.pow(target.x - currentPoint.x, 2) + Math.pow(target.y - currentPoint.y, 2));
        var radius1 = distance * 0.618;
        var radius2 = -radius1 * 0.618;

        var m = getMidpoint(currentPoint, target);
        var secondPoint1 = getPointLiesOnPerpendicularBisector(currentPoint, m, radius1);
        var secondPoint2 = getPointLiesOnPerpendicularBisector(m, target, radius2);

        return new cc.Sequence(
            new cc.BezierTo(1.3, [currentPoint, secondPoint1, m]).easing(cc.easeSineIn()),
            new cc.BezierTo(0.8, [m, secondPoint2, target]).easing(cc.easeQuinticActionOut())
        );
    },

    relax: function (duration) {
        return new cc.MoveBy(duration, cc.p(80, -80)).easing(cc.easeBackOut()); // todo move offset to styles
    },

    dislodge: function (duration, deltaPos) { // todo whats for ?? delete
        return new cc.MoveBy(duration, deltaPos).easing(cc.easeBackOut(3));
    },

    circle: function () {
        return new cc.CallFunc(function () {
            if (!this.visible) {
                return;
            }

            var circle = new cc.Sprite(bundles.finger.frames.tutorial_click_png);
            circle.setPosition(this.finger.x, this.finger.y);
            circle.setScale(0);
            circle.setLocalZOrder(-1);
            this.addChild(circle);

            circle.runAction(new cc.Sequence(
                new cc.PlaySound(bundles.finger.urls.press_effect),
                new cc.DelayTime(0.2),
                new cc.FadeOut(0.3),
                new cc.RemoveSelf()
            ));
            circle.runAction(new cc.ScaleTo(0.5, 1));
        }.bind(this));
    },

    showPayload: function (options) {
        var payload = this.payload = options.payload;

        payload.replaceParentSamePlace(this, {
            keepScale: true
        });
        payload.setVisible(false);
        payload.setLocalZOrder(-1);

        var baseScale = payload.getScale();

        return new cc.TargetedAction(payload, new cc.Sequence(
            new cc.ScaleTo(0, baseScale),
            new cc.Show(),
            new cc.ScaleTo(0.2, options.payloadScale || baseScale * 1.3)
        ));
    },

    hidePayload: function (payload) {
        return new cc.TargetedAction(payload, new cc.Hide());
    },

    calculateActions: function (actions) {
        return actions.map(function (action) {
            if (typeof action === "function") {
                return action();
            }
            return action;
        });
    },

    play: function (options) {
        options = options || {};

        this.actions = options.actions || this.actions;

        if (!this.actions) {
            return;
        }

        var actions = this.calculateActions(this.actions);
        if (options.callback || options.runOnce) {
            actions.push(new cc.CallFunc(function () {
                if (!options.keepShown) {
                    FingerView.remove(this);
                }
                if (options.callback) {
                    options.callback();
                }
            }.bind(this)));
        }

        actions = new cc.Sequence(actions);

        if (options.callback || options.runOnce) {
            this.finger.runAction(actions);
        } else {
            this.stopAllActions();
            this.finger.runAction(
                new cc.Sequence(
                    new cc.DelayTime(options.repeatDelay || 0.8),
                    actions,
                    new cc.CallFunc(this.play.bind(this, options))
                )
            );
        }
    },

    hintClick: function (targets, options) {
        this.options = options = options || {};
        targets = cleverapps.toArray(targets).map(function (target) {
            return this.prepareTarget(target);
        }.bind(this));

        this.actions = [];

        this.setTarget(targets[0]);

        if (options.delay) {
            this.actions.push(new cc.DelayTime(options.delay));
        }

        if (options.loopFilter) {
            this.actions.push(new cc.CallFunc(function () {
                this.skipLoop = !options.loopFilter();
                if (this.skipLoop) {
                    this.setVisible(false);
                }
            }.bind(this)));
        }

        targets.forEach(function (target, index) {
            this.actions.push(new cc.DelayTime(0.2));
            this.actions.push(this.moveTo.bind(this, 0, target));
            this.actions.push(this.fadeIn());

            for (var i = 0; i < 2; i++) {
                this.actions.push(new cc.DelayTime(0.1));
                this.actions.push(this.press());
                this.actions.push(this.circle());
                this.actions.push(new cc.DelayTime(0.1));
                this.actions.push(this.release());
            }

            this.actions.push(this.fadeOut());

            if (index !== targets.length - 1) {
                this.actions.push(new cc.DelayTime(1.4));
            }
        }.bind(this));

        this.play(options);
    },

    hintDrag: function (path, options) {
        this.options = options = options || {};

        path = this.path = path.map(function (target) {
            return this.prepareTarget(target);
        }, this);

        this.actions = [];
        var step = path[0];

        this.setTarget(step);

        if (options.delay) {
            this.actions.push(new cc.DelayTime(options.delay));
        }

        this.actions.push(new cc.DelayTime(0.2));
        this.actions.push(this.moveTo.bind(this, 0, step));
        this.actions.push(new cc.DelayTime(0.1));
        this.actions.push(this.fadeIn());
        this.actions.push(this.press());
        this.actions.push(this.circle());

        if (step.select) {
            this.actions.push(new cc.CallFunc(step.select));
        }
        this.actions.push(new cc.DelayTime(0.2));

        if (options.payload) {
            this.actions.push(this.showPayload(options));
        }

        for (var i = 1; i < path.length; ++i) {
            step = path[i];

            this.actions.push(this.moveTo.bind(this, path[i - 1], step));

            if (step.select) {
                this.actions.push(new cc.CallFunc(step.select));
            }
        }

        this.actions.push(this.release());

        if (options.payload) {
            this.actions.push(this.hidePayload(options.payload));
        }

        for (i = 0; i < path.length; ++i) {
            step = path[i];

            if (step.unselect) {
                this.actions.push(new cc.CallFunc(step.unselect));
            }
        }

        this.actions.push(this.fadeOut());

        this.play(options);
    },

    getMoveDuration: function (origin, target, speed) {
        origin = this.convertToNodeSpace(origin.node.convertToWorldSpace(origin.position));
        target = this.convertToNodeSpace(target.node.convertToWorldSpace(target.position));

        var distance = cc.pDistance(origin, target);
        var duration = distance / (speed || cleverapps.styles.FingerView.speed);
        // sigmoid function: limit max duration to 1 but approx. liner under 0.5
        duration = Math.pow(2, 3 * duration);
        duration = (duration - 1) / (duration + 1);
        return duration;
    },

    showAnchorPoint: function () {
        var point = new cc.Sprite(bundles.wysiwyg.frames.pixel_png);
        point.setColor(cc.color(0, 255, 0, 0));
        point.setScale(15);
        this.finger.addChild(point);

        var pointX = this.finger.width * this.finger.anchorX * this.finger.scaleX;
        var pointY = this.finger.height * this.finger.anchorY * this.finger.scaleY;
        point.setPositionRound(pointX, pointY);
    }
});

FingerView.isRunning = function (finger) {
    return finger && FingerView.currentFinger === finger;
};

FingerView.remove = function (finger, silent) {
    if (!FingerView.isRunning(finger)) {
        return;
    }

    FingerView.currentFinger = undefined;

    if (finger.isRunning()) {
        finger.clear();
        finger.stopAllActions();
        finger.finger.stopAllActions();
        if (silent) {
            finger.removeFromParent();
            return;
        }

        finger.runAction(new cc.Sequence(
            new cc.FadeOut(0.2),
            new cc.RemoveSelf()
        ));
    }
};

FingerView.create = function (options) {
    options = options || {};

    var finger = new FingerView(options);

    FingerView.remove(FingerView.currentFinger);
    FingerView.currentFinger = finger;

    cleverapps.scenes.getRunningScene().addChild(finger);

    finger.setRotation(options.rotation || 0);
    finger.setScale(options.scale || 1);
    finger.setLocalZOrder(BaseWindow.WINDOWS_ZORDER + 10000);

    addCleaner(finger, function () {
        FingerView.remove(finger);
    });

    return finger;
};

FingerView.hintClick = function (target, options) {
    options = options || {};

    var finger = FingerView.create();
    finger.hintClick(target, options);

    return finger;
};

FingerView.hintDrag = function (steps, options) {
    options = options || {};

    var finger = FingerView.create();

    if (options.pathColor) {
        finger.enablePath(options.pathColor);
    }

    finger.hintDrag(steps, options);

    return finger;
};

FingerView.PATH_BASE_ALPHA = 255;
FingerView.PATH_LINE_WIDTH = 15;
FingerView.FINGER_CLICKED_ANGLE = 7;

cleverapps.styles.FingerView = {
    speed: 500,
    offsetY: 5,

    default: {
        anchorX: 0.1,
        anchorY: 0.9
    }
};
