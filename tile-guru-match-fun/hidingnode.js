/**
 * Created by Andrey Popov on 11/21/23.
 */

var HidingNode = cc.Node.extend({
    avoidNode: "HidingNode",
    ctor: function (target, direction) {
        this._super();

        this.isShown = true;
        this.target = target;
        this.direction = direction;

        if (!target.hide) {
            target.hide = target.createListener(this.hide.bind(this));
        }

        if (!target.show) {
            target.show = target.createListener(this.show.bind(this));
        }

        target.isShown = target.createListener(function () {
            return this.isShown;
        }.bind(this));

        if (!target.hideAnimation) {
            target.hideAnimation = target.createListener(this.hideAnimation.bind(this));
        }
        if (!target.showAnimation) {
            target.showAnimation = target.createListener(this.showAnimation.bind(this));
        }

        if (!target.toggle) {
            target.toggle = target.createListener(this.toggle.bind(this));
        }

        this.initialize();
    },

    initialize: function () {
        if (this.target.hidingNode) {
            return;
        }

        var parent = this.target.getParent();
        if (!parent || !parent.isRunning()) {
            this.target.hidingNodeForInit = this;
            return;
        }
        this.target.hidingNodeForInit = undefined;

        parent.addChild(this);
        this.target.hidingNode = this;

        this.setLocalZOrder(this.target.getLocalZOrder());
        this.setPositionRound(this.target.getPosition());
        this.setAnchorPoint(this.target.getAnchorPoint());
        this.hidePosition = this.target.hidePosition;

        this.target.replaceParent(this);

        this.updateSize();

        if (this.isShown === false) {
            this.target.hideAnimation(true);
        } else {
            this.target.showAnimation(true);
        }

        if (cleverapps.gameModes.noControls) {
            this.hide(true);
        }
    },

    updateSize: function () {
        var contentSize = this.target.getContentSize();
        this.setContentSize2(contentSize.width * this.target.getScaleX(), contentSize.height * this.target.getScaleY());
    },

    onChangePosition: function () {
        this.updatePosition();
    },

    onChangePositionNext: function () {
        this.target.children.forEach(function (child) {
            child.onChangePosition();
        });
    },

    updatePosition: function () {
        if (!this.target.updatePosition && !this.target.updateRelativePosition) {
            this.onChangePositionNext();
            return;
        }

        if (this.showAction && !this.showAction.isDone()) {
            this.stopAction(this.showAction);

            if (this.isShown) {
                this.target.visible = true;
            }

            delete this.showAction;
        }

        this.target.updatePosition && this.target.updatePosition();
        this.setPositionRound(this.target.getPosition());
        this.target.setPositionRound(this.isShown ? this.getOriginalPosition() : this.calcHidePosition(this.direction));

        this.onChangePositionNext();
    },

    calcHidePosition: function (direction) {
        direction = direction !== undefined ? direction : cleverapps.UI.VERTICAL;
        if (this.hidePosition) {
            return this.convertToNodeSpace(this.calculatePositionRound(this.hidePosition));
        }

        var pos = this.getParent().convertToWorldSpace(this.getPosition());
        var winSize = cleverapps.UI.getBgSize();

        if (direction === cleverapps.UI.AUTO) {
            var position = this.getPosition();
            var box = this.getBoundingBox();
            this.setPositionRound(position);

            var deltaX = Math.max(0, Math.min(box.x, winSize.width - box.x - box.width));
            var deltaY = Math.max(0, Math.min(box.y, winSize.height - box.y - box.height));
            direction = deltaX > deltaY ? cleverapps.UI.VERTICAL : cleverapps.UI.HORIZONTAL;
        }

        var width = this.width * this.scaleX;
        var height = this.height * this.scaleY;
        var middle = cc.p(pos.x + width * (0.5 - this.anchorX), pos.y + height * (0.5 - this.anchorY));

        var hideMiddle, d;
        if (direction === cleverapps.UI.VERTICAL) {
            d = (pos.y > winSize.height / 2) ? (winSize.height - middle.y) : -middle.y;
            hideMiddle = cc.p(middle.x, middle.y + 2 * d);
        } else {
            d = (pos.x > winSize.width / 2) ? (winSize.width - middle.x) : -middle.x;
            hideMiddle = cc.p(middle.x + 2 * d, middle.y);
        }

        return this.convertToNodeSpace(cc.p(
            hideMiddle.x + width * (this.anchorX - 0.5),
            hideMiddle.y + height * (this.anchorY - 0.5)
        ));
    },

    getOriginalPosition: function () {
        return cc.p(this.width / 2, this.height / 2);
    },

    toggle: function (visible, silent) {
        if (visible) {
            this.show(silent);
        } else {
            this.hide(silent);
        }
    },

    showAnimation: function (silent, delay, params) {
        params = params || {};
        this.target.stopAllActions();

        if (silent) {
            this.target.setPosition(this.getOriginalPosition());
            this.target.visible = true;
            return;
        }

        this.showAction = this.target.runAction(
            new cc.Sequence(
                new cc.DelayTime(delay || 0),
                new cc.Show(),
                new cc.MoveTo(params.duration || 0.6, this.getOriginalPosition()).easing(cc.easeElasticOut(1.2))
            )
        );
    },

    hideAnimation: function (silent, delay, params) {
        params = params || {};
        this.target.stopAllActions();

        if (silent) {
            this.target.setPosition(this.calcHidePosition(this.direction));
            this.target.visible = false;
            return;
        }

        this.target.runAction(new cc.Sequence(
            new cc.DelayTime(delay || 0),
            new cc.MoveTo(params.duration || 0.15, this.calcHidePosition(this.direction)).easing(cc.easeBackIn()),
            new cc.CallFunc(function () {
                this.target.visible = false;
            }.bind(this))
        ));
    },

    show: function (silent, delay, params) {
        if (this.isShown === true && !silent) {
            return;
        }

        this.isShown = true;

        if (!this.target.hidingNode) {
            return;
        }

        if (this.target.onShow) {
            this.target.onShow(silent, delay, params);
        }
        this.target.showAnimation(silent, delay, params);

        cleverapps.scenes.onAvoidNodeVisibilityChanged();
    },

    hide: function (silent, delay, params) {
        var force = params && params.force;
        if (this.isShown === false && !silent && !force) {
            return;
        }

        this.isShown = false;

        if (!this.target.hidingNode) {
            return;
        }

        if (this.target.onHide) {
            this.target.onHide(silent, delay, params);
        }
        this.target.hideAnimation(silent, delay, params);

        cleverapps.scenes.onAvoidNodeVisibilityChanged();
    },

    setDirection: function (direction) {
        this.direction = direction;
    }
});
