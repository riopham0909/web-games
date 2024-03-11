/**
 * Created by slava on 24.03.17.
 */

var ForceView = Window.extend({
    ctor: function (element, force, options) {
        this.forceConfig = force;
        this.options = options || {};
        this.force = force;
        this.element = element;

        var actives = this.options.actives || [];
        if (element !== ForceView.NO_ELEMENT) {
            actives.push(element);
        }
        this.actives = [];
        actives.forEach(function (active) {
            if (!this._existParent(active, actives)) {
                this.actives.push(active);
            }
        }, this);

        var highlights = this.options.highlights || [];
        this.actives.forEach(function (active) {
            highlights.push(active);
        });
        this.highlights = [];
        highlights.forEach(function (highlight) {
            if (!this._existParent(highlight, highlights)) {
                this.highlights.push(highlight);
            }
        }, this);

        this._super(element, force);
    },

    grabFocus: function () {
        cleverapps.meta.setEventNodes(this.actives);
    },

    beforeResize: function () {
        if (this.element) {
            this.backNodesFromForce();
        }
    },

    afterResize: function () {
        if (this.element) {
            this.upNodesForForce();
            if (this.text) {
                this.createDialogue();
            }
        }
    },

    moveNodeAndKeepScale: function (node) {
        if (!node.isRunning()) {
            return;
        }

        var parent = node.getParent();
        var scale = parent.adjustScaleTo(this);

        var container = new cc.Node();
        container.setScale(scale.x, scale.y);
        container.setLocalZOrder(node.getLocalZOrder());
        this.content.addChild(container);

        node.forceParent = parent;
        node.forcePosition = node.getPosition();
        node.replaceParentSamePlace(container);
    },

    upNodesForForce: function () {
        if (this.lifted) {
            return;
        }
        this.lifted = true;

        this.highlights.forEach(function (node) {
            this.moveNodeAndKeepScale(node);
        }, this);
    },

    backNodesFromForce: function () {
        if (!this.lifted) {
            return;
        }
        this.lifted = false;

        this.highlights.forEach(function (node) {
            this.returnNode(node);
        }, this);
    },

    _existParent: function (node, nodes) {
        node = node.getParent();
        while (node) {
            if (nodes.indexOf(node) >= 0) {
                return true;
            }
            node = node.getParent();
        }
        return false;
    },

    returnNode: function (node) {
        if (node.parent && node.parent.parent === this.content) {
            node.replaceParentSamePlace(node.forceParent);
            node.setPosition(node.forcePosition);
        }

        node.forceParent = undefined;
        node.forcePosition = undefined;
    },

    listRects: function () {
        var rects = [];
        if (this.options.importantNodes) {
            this.options.importantNodes.forEach(function (node) {
                rects.push(node.getGlobalBoundingBox());
            });
        }

        if (this.pointer) {
            rects.push(this.pointer.getGlobalBoundingBox());
        }

        this.actives.forEach(function (active) {
            rects.push(active.getGlobalBoundingBox());
        });

        return rects;
    },

    onWindowLoaded: function (element, force) {
        this.id = force.id;

        this._super({
            content: new cc.Node(),
            noBackground: true,
            name: "forcewindow" + this.id,
            closeButton: false,
            styles: cleverapps.styles.Force
        });

        if (force.controls) {
            cleverapps.meta.showControlsWhileFocused(force.controls, true);
        }

        this.setLocalZOrder(BaseWindow.WINDOWS_ZORDER + 9);

        cleverapps.toolbar.freezeUpdates();

        this.element = element;

        this.upNodesForForce();

        if (element !== ForceView.NO_ELEMENT && force.finger !== false) {
            var fingerDelay;

            if (force.finger) {
                var fingerStyle = force.finger;
                if (typeof fingerStyle === "function") {
                    fingerStyle = fingerStyle();
                }
                if (fingerStyle.mobile && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
                    fingerStyle = fingerStyle.mobile;
                }
                if (fingerStyle.delay) {
                    fingerDelay = fingerStyle.delay;
                }
            }

            this.finger = FingerView.hintClick(element, {
                delay: fingerDelay
            });
        }
        if (element !== ForceView.NO_ELEMENT && force.pointer) {
            this.pointer = PointerView.create({
                target: element
            });
        }

        this.text = typeof (force.text) === "function" ? force.text(force, element) : force.text;

        if (element === ForceView.NO_ELEMENT || this.forceConfig.closeByTouchInShadow) {
            this.addCloseByTouchInShadow();
        }

        if (element !== ForceView.NO_ELEMENT) {
            this.watchElementInterval = setInterval(function () {
                // console.log('watchElementInterval', this.element.parent)
                if (!this.element.parent || !this.element.visible) {
                    if (cleverapps.forces.isRunningForce()) {
                        cleverapps.forces.closeRunningForce();
                    } else {
                        this.close();
                        cleverapps.forces.clearForce(this.id);
                    }
                }
            }.bind(this), 5000);
        }

        if (this.text) {
            this.createDialogue();
        }
    },

    createDialogue: function () {
        if (this.dialogue) {
            this.dialogue.removeFromParent();
        }

        this.dialogue = new MinimalDialogue({
            text: this.text,
            person: this.force.person,
            targetRect: this.element && this.element !== ForceView.NO_ELEMENT && this.element.getGlobalBoundingBox(),
            rects: this.listRects(),
            forcePosition: typeof (this.force.position) === "function" ? this.force.position() : this.force.position
        });
        this.addChild(this.dialogue);
        this.dialogue.display();
    },

    onClose: function () {
        if (this.watchElementInterval) {
            clearInterval(this.watchElementInterval);
        }
        this.backNodesFromForce();

        FingerView.remove(this.finger);
        PointerView.remove(this.pointer);
        this.pointer = undefined;
        this.finger = undefined;

        cleverapps.toolbar.unfreezeUpdates();
    },

    addCloseByTouchInShadow: function () {
        this.clickArea = new cc.Node();
        this.clickArea.setContentSize(this.getContentSize());
        this.addChild(this.clickArea);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                if (cleverapps.forces.isRunningForce()) {
                    cleverapps.forces.closeRunningForce();
                }
            }
        }, this.clickArea);
    },

    stop: function () {
    }
});

cleverapps.styles.Force = {
    windowShowUpAnimation: {
        name: "instant",
        force: true
    }
};

ForceView.NO_ELEMENT = "emptyForceElement";
