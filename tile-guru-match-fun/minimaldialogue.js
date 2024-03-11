/**
 * Created by Andrey Popov on 3/15/21.
 */

var MinimalDialogue = cc.Node.extend({
    avoidNode: "MinimalDialogue",

    ctor: function (options) {
        this._super();
        this.options = options || {};
        this.targetRect = this.options.targetRect || this.options.rects && this.options.rects[0];
        this.setAnchorPoint2();
        this.setLocalZOrder(20);

        if (this.options.text) {
            this.items = [this.options.text];
        }

        if (this.options.items) {
            this.items = this.options.items;
        }

        if (options.control) {
            cleverapps.meta.registerControl(options.control, this.createListener(function (visible) {
                if (visible) {
                    this.showUp();
                } else {
                    this.hide(undefined, true);
                }
            }));
        }
    },

    display: function () {
        this.createContent({ person: true });

        if (!this.calculatePosition()) {
            var maxDimensions = this.calcMaxDimensions();

            this.createContent({ person: true, maxDimensions: maxDimensions });

            if (!this.calculatePosition()) {
                this.createContent({ person: false, maxDimensions: maxDimensions });

                if (!this.calculatePosition()) {
                    this.logError();
                }
            }
        }

        if (this.debugInfo) {
            this.debugInfo.show();
        }

        if (!this.options.hidden) {
            if (MinimalDialogue.lastShown && MinimalDialogue.lastShown + 30000 > Date.now()) {
                this.options.shortAnimations = true;
            }
            MinimalDialogue.lastShown = Date.now();

            this.showUp();
        }
    },

    updatePosition: function () {
        this.calculatePosition();
    },

    updateOrientation: function () {
        var scene = cleverapps.scenes.getRunningScene();
        var styles = cleverapps.styles.MinimalDialogue;
        if (this.x > scene.width / 2 + 3) {
            if (this.personNode) {
                this.textBgArrow.setPositionRound(styles.text.arrow.right);
                this.textBgArrow.setScaleX(-1);
                this.personNode.setScaleX(-Math.abs(this.personNode.getScaleX()));
                this.personNode.setPositionRound({ align: "right" }, { align: "center" });
            }
            this.bg.setAnchorPoint(1, 0.5);
            this.bg.setPositionRound({ align: "left" }, { align: "center" });
        } else {
            if (this.personNode) {
                this.textBgArrow.setPositionRound(styles.text.arrow.left);
                this.textBgArrow.setScaleX(1);
                this.personNode.setScaleX(Math.abs(this.personNode.getScaleX()));
                this.personNode.setPositionRound({ align: "left" }, { align: "center" });
            }
            this.bg.setAnchorPoint(0, 0.5);
            this.bg.setPositionRound({ align: "right" }, { align: "center" });
        }
    },

    logError: function () {
        var frameSize = cc.view.getFrameSize();

        var msg = "Could not position minimal dialog.";

        var rects = this.listRects();

        msg = msg + " rects: " + JSON.stringify(rects);

        var dialogRects = this.listDialogueRects();

        msg = msg + " dialogRects: " + JSON.stringify(dialogRects);

        var itemsInfo = this.items.map(function (item, index) {
            var contentItem = this.contentItems[index];
            if (typeof item === "string") {
                return JSON.stringify({
                    text: item,
                    fontSize: contentItem.getFontSize(),
                    font: contentItem.font,
                    checkFont: document.fonts && document.fonts.check(contentItem.font),
                    width: contentItem.width,
                    height: contentItem.height
                });
            }

            var data = {};
            if (item.debugInfo) {
                data = item.debugInfo;
            }

            return JSON.stringify(Object.assign(data, {
                width: item.width,
                height: item.height,
                scale: item.scale
            }));
        }, this);

        msg = msg + ", items: " + itemsInfo.join(" + ");

        msg = msg + ", frame size:" + frameSize.width + " by " + frameSize.height;

        var scene = cleverapps.scenes.getRunningScene();
        msg = msg + ", scene size:" + scene.width + " by " + scene.height;

        msg = msg + ", resolutionScale:" + resolutionScale;

        msg = msg + ", dpr:" + window.devicePixelRatio;

        if ((scene.width + scene.height) > 800) {
            cleverapps.throwAsync(msg);
        }
    },

    removeContent: function () {
        if (this.options.items) {
            this.options.items.forEach(function (item) {
                if (item.parent) {
                    item.removeFromParent(true);
                    item.setPosition(0, 0);
                }
            });
        }

        if (this.bg) {
            this.bg.removeAllChildren();
            this.bg.removeFromParent(true);
        }

        if (this.personNode) {
            this.personNode.removeFromParent();
            this.personNode = undefined;
        }

        delete this.personBackground;
        delete this.personAnimation;
    },

    createContent: function (options) {
        this.removeContent();

        var styles = cleverapps.styles.MinimalDialogue;

        var personSize = cc.size(0, 0);
        var personNode;

        if (options.person) {
            personNode = this.personNode = this.createPerson();
            var margin = styles.person.margin;
            personSize = cc.size(personNode.width * personNode.scale + margin, personNode.height * personNode.scale);
        }

        var scene = cleverapps.scenes.getRunningScene();
        var availableRect = cc.rectSubPadding(scene.getGlobalBoundingBox(), cc.padding(styles.padding));
        availableRect.width = Math.min(availableRect.width, styles.maxWidth);

        var availableBgRect = cc.rect(
            availableRect.x,
            availableRect.y,
            availableRect.width - personSize.width,
            Math.min(availableRect.height, styles.text.maxHeight)
        );

        if (options.maxDimensions) {
            availableBgRect.width = Math.min(availableRect.width, options.maxDimensions.width);
            availableBgRect.height = Math.min(availableRect.height, options.maxDimensions.height);
        }

        var textPadding = cc.padding(cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL
            ? styles.text.verticalPadding : styles.text.padding);
        var availableTextRect = cc.rectSubPadding(availableBgRect, textPadding);

        var items = this.items.map(function (item) {
            if (typeof item === "string") {
                var font = cleverapps.resolution.resizeFont(cleverapps.styles.FONTS.FORCE_MESSAGE_TEXT);
                var text = cleverapps.UI.generateOnlyText(item, font);
                text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                if (text.width > availableTextRect.width) {
                    text.setDimensions(availableTextRect.width, 0);
                }
                return text;
            }

            cleverapps.UI.fitToBox(item, {
                width: availableTextRect.width,
                maxScale: item.scale
            });

            return item;
        });

        var height = items.reduce(function (height, item) {
            return height + item.height * item.scaleY;
        }, 0);

        if (height > availableTextRect.height) {
            items.forEach(function (item) {
                var itemHeight = item.height * availableTextRect.height / height;
                if (item.fitTo) {
                    item.fitTo(availableTextRect.width, itemHeight);
                } else {
                    cleverapps.UI.fitToBox(item, {
                        width: availableTextRect.width,
                        height: itemHeight
                    });
                }
            });
        }

        this.contentItems = items;
        var direction = this.options.direction !== "undefined" ? this.options.direction : cleverapps.UI.VERTICAL;
        this.content = new cleverapps.Layout(items, {
            margin: styles.margin,
            direction: direction
        });

        var contentHeight = Math.max(this.content.height, styles.text.minHeight);
        var bgRect = cc.rectAddPadding(cc.rect(0, 0, this.content.width, contentHeight), textPadding);
        this.bg = cleverapps.UI.createScale9Sprite(bundles.dialogues_minimal.frames.bg_minimal_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        this.bg.setContentSize2(bgRect);

        this.bg.addChild(this.content);

        if (styles.text.arrow && personNode) {
            this.textBgArrow = new cc.Sprite(bundles.dialogues_minimal.frames.mini_arrow_bg_png);
            this.bg.addChild(this.textBgArrow);
        }

        this.content.setPositionRound(
            textPadding.left + this.content.width / 2,
            textPadding.bottom + contentHeight / 2
        );

        this.bg.setCascadeOpacityEnabledRecursively(true);
        this.bg.setOpacity(0);
        this.content.setCascadeOpacityEnabledRecursively(true);

        this.setContentSize2(personSize.width + bgRect.width, Math.max(personSize.height, bgRect.height));

        this.addChild(this.bg);

        if (personNode) {
            this.addChild(personNode);
        }

        this.updateOrientation();
        this.setVisible(false);
    },

    createPerson: function () {
        var personNode = new cc.Node();
        personNode.setAnchorPoint2();

        var personBackground = this.personBackground = new cleverapps.Spine(bundles.dialogues_minimal.jsons.bg_person);
        personNode.setContentSize2(personBackground.width, personBackground.height);
        personBackground.setPositionRound(personNode.width / 2, personNode.height / 2);
        personNode.addChild(personBackground);

        var role = "hero";
        if (this.options.person && PersonsLibrary.getMinimalJson(this.options.person)) {
            role = cleverapps.skins.getSlot(this.options.person) || this.options.person;
        }
        var json = PersonsLibrary.getMinimalJson(role);

        this.personAnimation = new cleverapps.Spine(json);
        this.personAnimation.setPositionRound(personNode.width / 2, personNode.height / 2);
        personNode.addChild(this.personAnimation);

        var skinSlot = role + "_minimal";
        var skin = cleverapps.skins.getSlot(skinSlot);
        if (skin) {
            this.personAnimation.setSkin(skin);
        }

        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            personNode.setScale(0.8);
        }

        return personNode;
    },

    calculatePosition: function () {
        var winSize = cleverapps.UI.getSceneSize();
        var styles = cleverapps.styles.MinimalDialogue;

        if (this.options.forcePosition) {
            if (this.options.forcePosition === Dialogue.POSITIONS.TOP) {
                this.setPositionRound(winSize.width / 2, winSize.height - this.height / 2 - styles.positions.top.y);
            } else if (this.options.forcePosition === Dialogue.POSITIONS.TOP_LOWER) {
                this.setPositionRound(winSize.width / 2, winSize.height - this.height / 2 - styles.positions.topLower.y);
            } else if (this.options.forcePosition === Dialogue.POSITIONS.BOTTOM) {
                this.setPositionRound(winSize.width / 2, this.height / 2 + styles.positions.bottom.y);
            } else if (this.options.forcePosition === Dialogue.POSITIONS.CENTER) {
                this.setPositionRound(winSize.width / 2, winSize.height / 2);
            } else {
                this.setPositionRound(this.options.forcePosition);
            }
        } else if (this.options.rects && this.options.rects.length) {
            return this.calcDynamicPosition();
        } else {
            this.setPositionRound(winSize.width / 2, this.height / 2 + styles.positions.bottom.y);
        }
        return true;
    },

    listRects: function () {
        var styles = cleverapps.styles.MinimalDialogue;
        var rectsOffset = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.rectsOffsetMobile : styles.rectsOffset;
        var targetOffset = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.targetOffsetMobile : styles.targetOffset;

        return this.options.rects.map(function (rect) {
            if (rect === this.targetRect) {
                return cc.rect(rect.x - rectsOffset, rect.y - rectsOffset, rect.width + rectsOffset * 2, rect.height + rectsOffset * 2);
            }
            return cc.rect(rect.x - targetOffset.left, rect.y - targetOffset.down, rect.width + targetOffset.left + targetOffset.right, rect.height + targetOffset.down + targetOffset.up);
        });
    },

    listAllPositions: function (rects) {
        var scene = cleverapps.scenes.getRunningScene();
        var available = cc.rectSubPadding(scene.getGlobalBoundingBox(), cc.padding(this.height / 2, this.width / 2));

        var positions = [];
        for (var i = 0; i < rects.length; i++) {
            var rect = rects[i];
            var slots = this.calcPositionSlots(rect);

            for (var j = 0; j < slots.length; j++) {
                positions.push(cc.nearestToRect(available, slots[j]));
            }
        }

        return positions;
    },

    listDialogueRects: function (options) {
        options = options || {};

        var dialogueRects = [
            this.bg.getGlobalBoundingBox()
        ];

        if (this.personNode && !options.withoutPerson) {
            dialogueRects.unshift(this.personNode.getGlobalBoundingBox());
        }

        return dialogueRects;
    },

    calcIntersection: function (dialogueRects, rects) {
        var maxIntersectionArea = 0;
        var maxIntersectionRect;

        var bannerRect = cleverapps.bannerAd.getGlobalBoundingBox();
        if (bannerRect) {
            rects = [].concat(rects).concat([bannerRect]);
        }

        dialogueRects.forEach(function (dialogueRect) {
            rects.forEach(function (rect) {
                var intersection = cc.rectIntersection(dialogueRect, rect);

                var area = intersection.width > 2 && intersection.height > 2 ? intersection.width * intersection.height : 0;
                if (area > maxIntersectionArea) {
                    maxIntersectionArea = area;
                    maxIntersectionRect = intersection;
                }
            }, this);
        }, this);

        if (maxIntersectionArea > 0) {
            return {
                area: maxIntersectionArea,
                rect: maxIntersectionRect
            };
        }
    },

    calcMaxDimensions: function () {
        var rects = this.listRects();
        var dialogueRect = this.listDialogueRects({ withoutPerson: true }).reduce(function (dialogueRect, rect) {
            return cc.rectUnion(dialogueRect, rect);
        });

        var cumulative = cc.size();
        var center = cc.rectGetCenter(dialogueRect);

        rects.forEach(function (rect) {
            var intersection = cc.rectIntersection(dialogueRect, rect);
            var intCenter = cc.rectGetCenter(intersection);

            var height = intersection.y - dialogueRect.y + intersection.height;
            if (intCenter.y > center.y) {
                height = dialogueRect.height - intersection.y - dialogueRect.y;
            }

            var width = intersection.x - dialogueRect.x + intersection.width;
            if (intCenter.x > center.x) {
                width = dialogueRect.width - intersection.x - dialogueRect.x;
            }

            cumulative.width = width > cumulative.width ? width : cumulative.width;
            cumulative.height = height > cumulative.height ? height : cumulative.height;
        });

        if (cumulative.width / dialogueRect.width < cumulative.height / dialogueRect.height) {
            cumulative.height = 0;
        } else {
            cumulative.width = 0;
        }

        return cc.size(
            dialogueRect.width - cumulative.width,
            dialogueRect.height - cumulative.height
        );
    },

    pickVariant: function (variants) {
        var scene = cleverapps.scenes.getRunningScene();
        var centerScene = cc.p(scene.width / 2, scene.height / 2);
        var centerRect = cc.rectGetCenter(this.targetRect);
        var epsilon = 30;

        var invalidVariants = variants.filter(function (variant) {
            return variant.intersection;
        });

        var validVariants = variants.filter(function (variant) {
            return !variant.intersection;
        });
        if (validVariants.length > 0) {
            validVariants.sort(function (a, b) {
                var diffToRectCenter = cc.pDistance(a.position, centerRect) - cc.pDistance(b.position, centerRect);
                if (Math.abs(diffToRectCenter) > epsilon) {
                    return diffToRectCenter;
                }
                return cc.pDistance(a.position, centerScene) - cc.pDistance(b.position, centerScene);
            });

            return validVariants[0];
        }

        invalidVariants.sort(function (a, b) {
            return a.intersection.area - b.intersection.area;
        });

        return invalidVariants[0];
    },

    calcDynamicPosition: function () {
        var rects = this.listRects();

        var variants = [];

        this.listAllPositions(rects).forEach(function (position) {
            var localPosition = this.getParent().convertToNodeSpace(position);
            this.setPositionRound(localPosition);

            var dialogueRects = this.listDialogueRects();

            variants.push({
                localPosition: localPosition,
                position: position,
                dialogueRects: dialogueRects,
                intersection: this.calcIntersection(dialogueRects, rects)
            });
        }, this);

        var pickedVariant = this.pickVariant(variants);

        if (cleverapps.flags.debugMinimalDialogue) {
            if (!this.debugInfo) {
                this.debugInfo = new MinimalDialogueDebug(this);
            }

            this.debugInfo.addVariants(variants);
            this.debugInfo.setPickedVariant(pickedVariant);
        }

        this.setPositionRound(pickedVariant.localPosition);
        this.updateOrientation();
        return !pickedVariant.intersection;
    },

    calcPositionSlots: function (rect) {
        var left = { x: rect.x - this.width / 2, y: rect.y + rect.height / 2 },
            right = { x: rect.x + rect.width + this.width / 2, y: rect.y + rect.height / 2 },
            up = { x: rect.x + rect.width / 2, y: rect.y + rect.height + this.height / 2 },
            down = { x: rect.x + rect.width / 2, y: rect.y - this.height / 2 };

        return [up, down, left, right];
    },

    showUp: function () {
        if (this.shown) {
            return;
        }
        this.shown = true;
        this.stopAllActions();
        this.bg.stopAllActions();
        this.content.stopAllActions();
        this.bg.setOpacity(0);
        this.bg.setVisible(true);
        var styles = cleverapps.styles.MinimalDialogue;

        this.runAction(new cc.Sequence(
            new cc.DelayTime(this.options.delay !== undefined ? this.options.delay : 0.5),
            new cc.Show(),
            new cc.CallFunc(function () {
                var showUpAnimation = "minimal_showup";

                if (this.options.shortAnimations) {
                    showUpAnimation = "minimal_short_showup";
                    var finalPosition = this.getPosition();
                    this.setPosition(finalPosition.x, finalPosition.y - styles.moveY);
                    this.runAction(new cc.MoveTo(0.3, finalPosition).easing(cc.easeOut(2)));
                    this.fadeInShowUp();
                } else {
                    this.bubbleShowUp();
                }

                if (this.personAnimation) {
                    this.personAnimation.setVisible(true);
                    this.personAnimation.setAnimationAndIdleAfter(showUpAnimation, "talk_minimal");

                    this.personBackground.setVisible(true);
                    this.personBackground.setAnimationAndIdleAfter(showUpAnimation, "minimal_idle");
                }

                cleverapps.audio.playSound(bundles.dialogues.urls.dialogue_effect);
            }.bind(this))
        ));
    },

    fadeInShowUp: function () {
        this.bg.runAction(new cc.FadeIn(0.3));
    },

    fadeOutHide: function () {
        this.bg.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.Hide()
        ));
    },

    bubbleShowUp: function () {
        this.bg.setScale(0.46);

        this.bg.runAction(new cc.Sequence(
            new cc.DelayTime(0.15),
            new cc.ScaleTo(0.3, 1.16, 1.26).easing(cc.easeIn(1)),
            new cc.ScaleTo(0.2, 1).easing(cc.easeOut(1))
        ));

        this.bg.runAction(new cc.Sequence(
            new cc.DelayTime(0.15),
            new cc.FadeIn(0.17)
        ));
    },

    bubbleHide: function () {
        this.bg.runAction(new cc.Sequence(
            new cc.DelayTime(0.13),
            new cc.ScaleTo(0.17, 1.16, 1.26).easing(cc.easeIn(1)),
            new cc.ScaleTo(0.17, 0).easing(cc.easeOut(1)),
            new cc.Hide()
        ));
    },

    hide: function (callback, silent) {
        if (!this.shown) {
            callback && callback();
            return;
        }

        this.stopAllActions();
        this.bg.stopAllActions();
        this.content.stopAllActions();

        if (silent) {
            this.bg.setOpacity(0);
            this.bg.setVisible(false);

            this.personBackground && this.personBackground.setVisible(false);
            this.personAnimation && this.personAnimation.setVisible(false);

            this.shown = false;

            callback && callback();

            return;
        }

        if (this.options.shortAnimations) {
            this.runAction(new cc.MoveBy(0.3, 0, -cleverapps.styles.MinimalDialogue.moveY).easing(cc.easeIn(2)));

            this.fadeOutHide();

            if (this.personAnimation) {
                this.personAnimation.setAnimation(0, "minimal_short_hide", false);
                this.personBackground.setAnimation(0, "minimal_short_hide", false);
            }
        } else {
            this.bubbleHide();

            if (this.personAnimation) {
                this.personAnimation.setAnimation(0, "minimal_hide", false);
                this.personBackground.setAnimation(0, "minimal_hide", false);
            }
        }

        if (this.personAnimation) {
            this.personAnimation.setCompleteListenerOnce(function () {
                this.personAnimation.setVisible(false);
                this.personBackground.setVisible(false);
            }.bind(this));
        }

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.6),
            new cc.CallFunc(function () {
                callback && callback();
            })
        ));

        this.shown = false;
    },

    remove: function (callback, silent) {
        this.hide(function () {
            this.removeFromParent();

            callback && callback();
        }.bind(this), silent);
    }
});

cleverapps.styles.MinimalDialogue = {
    rectsOffset: 10,
    rectsOffsetMobile: 5,
    targetOffset: {
        left: 30, right: 40, up: 30, down: 50
    },
    targetOffsetMobile: {
        left: 15, right: 20, up: 15, down: 25
    },

    maxWidth: 1000,
    margin: 10,

    moveY: 20,

    padding: {
        x: 10,
        y: 10
    },

    person: {
        margin: 10
    },

    text: {
        maxHeight: 450,
        minHeight: 90,
        padding: {
            top: 35,
            bottom: 35,
            left: 40,
            right: 40
        },
        verticalPadding: {
            top: 25,
            bottom: 25,
            left: 30,
            right: 30
        }
    },

    positions: {
        topLower: {
            y: 200
        },
        top: {
            y: 100
        },
        bottom: {
            y: 20
        }
    }
};

if (cleverapps.config.debugMode) {
    var MinimalDialogueDebug = function (minimal) {
        minimal.addCleaner(this.hide.bind(this));

        this.minimal = minimal;
        this.rects = minimal.listRects();
        this.variants = [];
        this.pickedVariant = undefined;
    };

    MinimalDialogueDebug.prototype.addVariants = function (variants) {
        this.variants = this.variants.concat(variants);
    };

    MinimalDialogueDebug.prototype.setPickedVariant = function (pickedVariant) {
        this.pickedVariant = pickedVariant;
    };

    MinimalDialogueDebug.prototype.show = function () {
        this.currentNodes = [];

        this.currentStep = this.variants.indexOf(this.pickedVariant);
        this.drawCurrentStep();

        this.keyboardListener = cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if (keyCode === cc.KEY.right) {
                    if (this.currentStep < this.variants.length - 1) {
                        this.currentStep++;
                        this.drawCurrentStep();
                    }
                }
                if (keyCode === cc.KEY.left) {
                    if (this.currentStep > 0) {
                        this.currentStep--;
                        this.drawCurrentStep();
                    }
                }
            }.bind(this)
        }, this.minimal);
    };

    MinimalDialogueDebug.prototype.drawCurrentStep = function () {
        this.clearCurrentStep();

        var step = this.variants[this.currentStep];

        this.rects.forEach(function (rect) {
            this.currentNodes.push(this.drawRect(rect, new cc.Color(0, 0, 255, 255)));
        }, this);

        step.dialogueRects.forEach(function (rect) {
            var color = step.intersection && step.intersection.rect ? new cc.Color(255, 0, 0, 255) : new cc.Color(0, 255, 0, 255);
            this.currentNodes.push(this.drawRect(rect, color));
        }, this);

        if (step.intersection && step.intersection.rect) {
            this.currentNodes.push(this.drawRect(step.intersection.rect, new cc.Color(255, 0, 0, 255), new cc.Color(255, 0, 0, 255)));
        }
    };

    MinimalDialogueDebug.prototype.clearCurrentStep = function () {
        this.currentNodes.forEach(function (node) {
            node.removeFromParent();
        });

        this.currentNodes = [];
    };

    MinimalDialogueDebug.prototype.drawRect = function (rect, color, fillColor) {
        fillColor = fillColor || new cc.Color(0, 0, 0, 0);

        var node = new cc.DrawNode();
        node.setAnchorPoint(0, 0);
        node.setContentSize2(rect.width, rect.height);
        node.setPositionRound(rect.x, rect.y);
        node.drawRect(cc.p(0, 0), cc.p(rect.width, rect.height), fillColor, 3, color);
        node.setLocalZOrder(1000);
        cleverapps.scenes.getRunningScene().addChild(node);

        return node;
    };

    MinimalDialogueDebug.prototype.hide = function () {
        cc.eventManager.removeListener(this.keyboardListener);
        delete this.keyboardListener;

        this.clearCurrentStep();
    };
}
