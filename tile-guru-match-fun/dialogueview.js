/**
 * Created by Andrey Popov on 3/16/21.
 */

var DialogueView = Window.extend({
    onWindowLoaded: function (dialogue, options) {
        this.options = options || {};

        this.dialogue = dialogue;
        var styles = cleverapps.styles.DialogueView;

        this._super({
            name: "DialogueViewWindow",
            closeButton: false,
            closeByBackButton: false,
            noBackground: true,
            styles: cleverapps.overrideStyles(styles.Window, this.options.window, true),
            noScaleAdjustment: true,
            openSound: bundles.dialogues.urls.dialogue_effect
        });

        this.generateContent();
        this.updateSize();
        this.updatePosition();

        dialogue.on("showUp", this.showUp.bind(this), this);
        dialogue.on("close", this.close.bind(this), this);

        dialogue.on("addPerson", this.addPerson.bind(this), this);
        dialogue.on("hidePerson", this.hidePerson.bind(this), this);
        dialogue.on("updateActive", this.updateActive.bind(this), this);
        dialogue.on("updatePersonTitle", this.updatePersonTitle.bind(this), this);
        dialogue.on("changeText", this.changeText.bind(this), this);
        dialogue.on("finishTyping", this.byLetterAnimationFinish.bind(this), this);
    },

    onShow: function () {
        if (!this.dialogue.isStarted()) {
            this.dialogue.run();
        }
    },

    updateSize: function () {
        this.adjustBaseWindow();

        var styles = cleverapps.styles.DialogueView;
        this.contentWrap.setContentSize(cleverapps.UI.getSceneSize());
        var x = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? 0 : styles.widthPadding;
        this.content.setContentSize2(this.contentWrap.width - 2 * x, styles.size[cleverapps.resolution.mode].height + cleverapps.UI.getBgOffset());
        this.content.baseContentSize = this.content.getContentSize();

        [this.leftPersonView, this.rightPersonView].forEach(function (person) {
            if (person) {
                person.stopAllActions();
                person.setVisible(true);
                this.updatePersonSize(person);
            }
        }.bind(this));

        cleverapps.UI.wrap(this.dialogueContent, { keepPosition: true });
    },

    updatePersonSize: function (person) {
        var styles = cleverapps.styles.DialogueView;
        var scale = 1;
        if (cleverapps.resolution.mode !== cleverapps.WideMode.HORIZONTAL) {
            scale = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.persons.mobileScale : styles.persons.squareScale;
        }

        var scaleX = scale;
        if (person.getOrientation() !== "left") {
            scaleX = -scaleX;
        }
        person.setScale(scaleX, scale);
    },

    updatePosition: function () {
        // this.adjustBaseWindow();
        
        var styles = cleverapps.styles.DialogueView;
        var contentWrapPosition = styles.position;
        var dialogueContentPosition = styles.contentPosition;

        this.contentWrap.setPositionRound(contentWrapPosition);
        this.dialogueContent.setPositionRound(dialogueContentPosition);

        var x = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? 0 : styles.widthPadding;
        this.content.stopAllActions();
        this.content.setOpacity(255);
        this.content.setPositionRound(this.content.parent.convertToNodeSpace(cc.p(x, styles.offsetY)));

        [this.leftPersonView, this.rightPersonView].forEach(function (person) {
            if (person) {
                this.updatePersonPosition(person);
            }
        }.bind(this));
    },

    updatePersonPosition: function (person) {
        var styles = cleverapps.styles.DialogueView;

        var y = styles.persons.aboveContent ? this.content.y + this.content.height : 0;
        if (styles.persons.aboveContent) {
            var dy = cleverapps.styles.WindowPersons.position.dy[person.role] || styles.persons.dy;
            y += dy;
        }

        var personScale = Math.abs(person.getScaleX());

        if ([cleverapps.WideMode.SQUARE, cleverapps.WideMode.VERTICAL].includes(cleverapps.resolution.mode)) {
            var offsetY = person.height / 2 - person.height / 2 * personScale;
            if (y + offsetY < this.content.y + this.content.height) {
                y += offsetY;
            }

            y += cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.persons.mobileOffsetY : styles.persons.squareOffsetY;
        }

        var x;
        if (person.getOrientation() === "left") {
            var leftX = person.calculateCoordinate(styles.persons.left[cleverapps.resolution.mode].x, "x", this.contentWrap.width);
            x = Math.min(leftX, this.contentWrap.width / 2 - styles.persons.padding / 2 - person.width / 2 * personScale);
        } else {
            var rightX = person.calculateCoordinate(styles.persons.right[cleverapps.resolution.mode].x, "x", this.contentWrap.width);
            x = Math.max(rightX, this.contentWrap.width / 2 + styles.persons.padding / 2 + person.width / 2 * personScale);
        }

        person.basePosition = { x: x, y: y };
        person.setPositionRound(x, y);
    },

    generateContent: function () {
        var content = this.content = cleverapps.UI.createScale9Sprite(bundles.dialogues.frames.bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        content.setAnchorPoint2(0, 0);
        content.setCascadeOpacityEnabled(true);

        var dialogueContent = this.dialogueContent = new cc.Node();
        dialogueContent.avoidNode = "DialogueView";
        dialogueContent.setVisible(false);
        dialogueContent.addChild(content);

        var contentWrap = this.contentWrap = new cc.Node();
        contentWrap.setAnchorPoint(0, 0.5);
        contentWrap.addChild(dialogueContent);

        cleverapps.UI.onClick(contentWrap, function () {
            this.dialogue.screenClicked();
            return true;
        }.bind(this), {
            ignoreScale: true
        });
        contentWrap.setContentSize(cleverapps.UI.getSceneSize());
        contentWrap.setLocalZOrder(1);
        this.addChild(contentWrap);
    },

    showUp: function (silent, onShow) {
        var animationStyle = cleverapps.styles.DialogueView.showAnimation;
        if (silent) {
            this.dialogueContent.setVisible(true);
            onShow();
            return;
        }

        if (animationStyle === "fromBelow") {
            this.showUpFromBelow(onShow);
        } else {
            this.showUpFromSides(onShow);
        }
    },

    showUpFromSides: function (onShow) {
        var baseContentSize = this.content.getContentSize();
        this.content.setContentSize(baseContentSize.width * 0.6, baseContentSize.height);
        this.content.setOpacity(0);
        if (this.textBgArrow) {
            this.textBgArrow.setVisible(false);
        }

        [this.leftPersonView, this.rightPersonView].forEach(function (person) {
            if (!person) {
                return;
            }
            var basePosition = person.basePosition;
            var startPosition;
            if (person.getOrientation() === "left") {
                startPosition = cc.p(-person.width / 2, basePosition.y);
            } else {
                startPosition = cc.p(this.contentWrap.width + person.width / 2, basePosition.y);
            }
            var delay = person.isActive ? 0 : 0.25;
            person.setVisible(false);
            person.setPosition(startPosition);
            person.runAction(new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.Show(),
                new cc.MoveTo(0.25, basePosition).easing(cc.easeBackOut())
            ));
        }.bind(this));

        this.content.runAction(new cc.Sequence(
            new cc.DelayTime(0.25),
            new cc.Spawn(
                new cc.FadeTo(0.25, 255),
                new Scale9SpriteResizeTo(0.25, baseContentSize)
            )
        ));

        this.dialogueContent.runAction(new cc.Sequence(
            new cc.DelayTime(0.25),
            new cc.Show(),
            new cc.DelayTime(0.25),
            new cc.CallFunc(function () {
                onShow();
                if (this.textBgArrow) {
                    this.textBgArrow.setVisible(true);
                }
            }.bind(this))
        ));
    },

    showUpFromBelow: function (onShow) {
        var styles = cleverapps.styles.DialogueView;
        var basePosition = this.content.getPosition();
        var startPosition = cc.p(basePosition.x, -this.content.height);
        this.content.setPositionRound(startPosition);
        this.content.runAction(new cc.Sequence(
            new cc.DelayTime(this.options.delay || 0),
            new cc.MoveTo(0.2, basePosition.x, basePosition.y + styles.showUp.offset),
            new cc.MoveTo(0.1, basePosition)
        ));

        this.dialogueContent.runAction(new cc.Sequence(
            new cc.DelayTime(this.options.delay || 0),
            new cc.Show(),
            new cc.DelayTime(0.3),
            new cc.CallFunc(onShow)
        ));

        [this.leftPersonView, this.rightPersonView].forEach(function (person) {
            if (!person) {
                return;
            }
            var basePersonPosition = person.basePosition;
            person.setVisible(false);
            person.setPosition(basePersonPosition.x, startPosition.y + this.content.height);
            person.runAction(new cc.Sequence(
                new cc.DelayTime(this.options.delay || 0),
                new cc.Show(),
                new cc.MoveTo(0.2, cc.p(basePersonPosition.x, basePersonPosition.y + styles.showUp.offset)),
                new cc.MoveTo(0.1, basePersonPosition.x, basePersonPosition.y)
            ));
        }.bind(this));
    },

    addPerson: function (person, silent) {
        var role = Person.ParseOptions(person).role;
        if (!PersonsLibrary.getPerson(role)) {
            cleverapps.throwAsync("Person is undefined - " + role);
            return;
        }

        var personView = new Person(person);
        personView.setAnchorPoint2(0.5, 0);
        personView.setActive(person.active);

        this.dialogueContent.addChild(personView);

        if (personView.getOrientation() === "left") {
            this.leftPersonView = personView;
        } else {
            this.rightPersonView = personView;
        }

        this.updatePersonSize(personView);
        this.updatePersonPosition(personView);

        var basePosition = personView.basePosition;

        if (!silent) {
            if (personView.getOrientation() === "left") {
                personView.setPosition(cc.p(-personView.width / 2, basePosition.y));
            } else {
                personView.setPosition(cc.p(this.contentWrap.width + personView.width / 2, basePosition.y));
            }

            personView.setVisible(false);
            personView.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.Show(),
                new cc.MoveTo(0.25, basePosition).easing(cc.easeBackOut())
            ));
        }
    },

    updateActive: function (orientation) {
        var isLeft = orientation === "left";

        if (this.leftPersonView) {
            this.leftPersonView.setActive(isLeft);
            this.leftPersonView.setSpeaking(isLeft);
        }

        if (this.rightPersonView) {
            this.rightPersonView.setActive(!isLeft);
            this.rightPersonView.setSpeaking(!isLeft);
        }
    },

    updatePersonTitle: function (activePersonInfo) {
        var styles = cleverapps.styles.DialogueView;

        if (!this.personTitle) {
            this.personTitle = new DialoguePersonTitleView();
            this.content.addChild(this.personTitle, 1);
        }

        if (!activePersonInfo) {
            this.personTitle.hide();
            if (this.textBgArrow) {
                this.textBgArrow.setVisible(false);
            }
            return;
        }

        var titleText = Messages.has("Dialogue.person." + activePersonInfo.role) && Messages.get("Dialogue.person." + activePersonInfo.role);
        if (!titleText) {
            if (cleverapps.config.debugMode) {
                console.error("person has no name! Dialogue.person." + activePersonInfo.role + " is missing in localization");
            }

            titleText = Messages.get("Dialogue.person.noName");
        }

        var isLeft = activePersonInfo.orientation === "left";
        this.personTitle.update(titleText, isLeft ? this.leftPersonView : this.rightPersonView, function () {
            var arrowStyle = styles.text.arrow;
            if (arrowStyle) {
                if (!this.textBgArrow) {
                    this.textBgArrow = new cc.Sprite(bundles.dialogues.frames.dialogue_arrow_png);
                    this.content.addChild(this.textBgArrow);
                }

                this.textBgArrow.setVisible(true);
                this.textBgArrow.setScaleX(isLeft ? 1 : -1);
                this.textBgArrow.updatePosition = function () {
                    if (arrowStyle.offsetX === "relative") {
                        var personX, titleX;
                        if (this.leftPersonView && this.leftPersonView.isActive) {
                            personX = this.content.convertToNodeSpace(this.leftPersonView.parent.convertToWorldSpace(this.leftPersonView.basePosition)).x;
                            personX += this.leftPersonView.getBoundingBox().width / 2;

                            titleX = this.content.convertToNodeSpace(this.personTitle.parent.convertToWorldSpace(this.personTitle.getPosition())).x;
                            titleX += this.personTitle.getBoundingBox().width / 2;

                            this.textBgArrow.setPositionRound((personX > titleX ? personX : titleX) + this.textBgArrow.width / 2, arrowStyle.y);
                        } else if (this.rightPersonView && this.rightPersonView.isActive) {
                            personX = this.content.convertToNodeSpace(this.rightPersonView.parent.convertToWorldSpace(this.rightPersonView.basePosition)).x;
                            personX -= this.rightPersonView.getBoundingBox().width / 2;

                            titleX = this.content.convertToNodeSpace(this.personTitle.parent.convertToWorldSpace(this.personTitle.getPosition())).x;
                            titleX -= this.personTitle.getBoundingBox().width / 2;

                            this.textBgArrow.setPositionRound((personX < titleX ? personX : titleX) - this.textBgArrow.width / 2, arrowStyle.y);
                        }
                    } else {
                        this.textBgArrow.setPositionRound(isLeft ? arrowStyle.offsetX : this.content.width - arrowStyle.offsetX, arrowStyle.y);
                    }
                }.bind(this);
                this.textBgArrow.updatePosition();
            }
        }.bind(this));
    },

    hidePerson: function (position) {
        var startPosition, endPosition, personView;

        if (position !== "right" && this.leftPersonView) {
            startPosition = this.leftPersonView.getPosition();
            endPosition = cc.p(-this.leftPersonView.width / 2, startPosition.y);
            personView = this.leftPersonView;
            delete this.leftPersonView;
        }

        if (position === "right" && this.rightPersonView) {
            startPosition = this.rightPersonView.getPosition();
            endPosition = cc.p(this.contentWrap.width + this.rightPersonView.width / 2, startPosition.y);
            personView = this.rightPersonView;
            delete this.rightPersonView;
        }

        if (personView) {
            personView.runAction(new cc.Sequence(
                new cc.MoveTo(0.25, endPosition).easing(cc.easeIn(5)),
                new cc.RemoveSelf()
            ));
        }
    },

    changeText: function (text, isWallAtRight) {
        var styles = cleverapps.styles.DialogueView;

        if (this.text) {
            this.text.removeFromParent();
        }

        this.text = cleverapps.UI.generateOnlyText(text, cleverapps.styles.FONTS.DIALOGUE_MESSAGE_TEXT || cleverapps.styles.FONTS.FORCE_MESSAGE_TEXT);
        this.text.initTextSize = this.text.getFontSize();
        this.content.addChild(this.text, 1);
        this.text.updatePosition = function () {
            var textStyles = styles.text;
            var padding = textStyles.padding;
            var alignment = styles.text.alignment;
            if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
                padding = textStyles.verticalPadding;
                alignment = styles.text.verticalAlignment;
            }
            this.text.setHorizontalAlignment(alignment);
            var rightX = this.content.width - padding.fromWallX;
            var leftX = padding.x;
            if (isWallAtRight) {
                rightX = this.content.width - padding.x;
                leftX = padding.fromWallX;
            }
            var topY = this.content.height - padding.y;
            var bottomY = padding.y;

            var textScale = 1;
            var textWidth = rightX - leftX;
            var textHeight = topY - bottomY;

            if (textWidth > textStyles.optimization.width) {
                // text rendering optimization
                textScale = 1.5;
                textWidth /= textScale;
                textHeight /= textScale;
            }
            this.text.setFontSize(Math.round(this.text.initTextSize / textScale));

            this.text.setDimensions(textWidth, 0);
            this.text.fitTo(undefined, textHeight);
            this.text.setScale(textScale);
            this.text.setAnchorPoint2(0.5, 1.0);
            this.text.setPositionRound((leftX + rightX) / 2, topY);
            if (this.text._byLetterAnimationRunning) {
                this.text._byLetterAnimationDone();
                this.text.setString(text);
            }
        }.bind(this);
        this.text.updatePosition();
        this.text.byLetterAnimation({ callback: this.dialogue.finishTyping.bind(this.dialogue) });
    },

    close: function (silent) {
        this.byLetterAnimationFinish();
        this.content.stopAllActions();
        var onClose = function () {
            this.dialogue.trigger("beforeClose");
            Window.prototype.close.apply(this, arguments);
            this.dialogue.finishClose();
        }.bind(this);
        if (silent) {
            onClose();
            return;
        }
        var animationStyle = cleverapps.styles.DialogueView.showAnimation;
        if (animationStyle === "fromBelow") {
            this.closeToBelow(onClose);
        } else {
            this.closeToSides(onClose);
        }
    },

    closeToSides: function (onClose) {
        if (this.text) {
            this.text.removeFromParent();
        }
        if (this.textBgArrow) {
            this.textBgArrow.setVisible(false);
        }
        [this.leftPersonView, this.rightPersonView].forEach(function (person) {
            if (!person) {
                return;
            }
            var basePosition = person.getPosition();
            var startPosition;
            if (person.getOrientation() === "left") {
                startPosition = cc.p(-person.width / 2, basePosition.y);
            } else {
                startPosition = cc.p(this.contentWrap.width + person.width / 2, basePosition.y);
            }

            var delay = person.isActive ? 0.25 : 0;
            person.runAction(new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.MoveTo(0.25, startPosition)
            ));
        }.bind(this));

        this.content.runAction(new cc.Spawn(
            new cc.FadeTo(0.5, 0),
            new Scale9SpriteResizeTo(0.5, this.content.width * 0.6, this.content.height)
        ));

        this.dialogueContent.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.CallFunc(onClose)
        ));
    },

    closeToBelow: function (onClose) {
        var styles = cleverapps.styles.DialogueView;
        var startPosition = cc.p(this.content.x, -this.content.height);
        this.content.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.MoveTo(0.15, cc.p(this.content.x, this.content.y + styles.showUp.offset)),
            new cc.MoveTo(0.15, startPosition),
            new cc.CallFunc(onClose),
            new cc.RemoveSelf()
        ));
        [this.leftPersonView, this.rightPersonView].forEach(function (person) {
            if (!person) {
                return;
            }
            person.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.MoveTo(0.15, cc.p(person.x, person.y + styles.showUp.offset)),
                new cc.MoveTo(0.15, person.x, startPosition.y + this.content.height)
            ));
        }.bind(this));
    },

    byLetterAnimationFinish: function (skipped) {
        if (this.text) {
            this.text.updatePosition();
            this.text.byLetterAnimationFinish();
        }

        [this.leftPersonView, this.rightPersonView].forEach(function (personView) {
            if (personView) {
                personView.setSpeaking(false, skipped);
            }
        });
    },

    listBundles: function (dialogue) {
        return dialogue.bundlesToLoad.slice();
    }
});

cleverapps.styles.DialogueView = {
    position: {
        x: { align: "left", dx: 0 },
        y: { align: "center", dy: 0 }
    },
    contentPosition: {
        x: { align: "left", dx: 0 },
        y: { align: "bottom", dy: 0 }
    },
    size: [
        { height: 240 },
        { height: 280 },
        { height: 280 }
    ],
    widthPadding: 0,
    offsetY: 20,
    showAnimation: "fromSides",

    showUp: {
        offset: 75
    },

    text: {
        alignment: cc.TEXT_ALIGNMENT_LEFT,
        verticalAlignment: cc.TEXT_ALIGNMENT_CENTER,
        arrow: {
            y: { align: "top", dy: 23 },
            offsetX: "relative"
        },

        padding: {
            fromWallX: 30,
            x: 30,
            y: 30
        },
        verticalPadding: {
            fromWallX: 50,
            x: 50,
            y: 40
        },

        optimization: {
            width: 1000
        }
    },

    persons: {
        aboveContent: true,
        dy: 0,
        mobileOffsetY: 0,
        squareOffsetY: 0,
        mobileScale: 0.8,
        squareScale: 1,

        left: [
            { x: { align: "left", dx: 20 } },
            { x: { align: "left", dx: 75 } },
            { x: { align: "left", dx: 75 } }
        ],
        right: [
            { x: { align: "right", dx: -20 } },
            { x: { align: "right", dx: -75 } },
            { x: { align: "right", dx: -75 } }
        ],

        padding: 100
    },

    Window: {
        windowShowUpAnimation: false
    }
};
