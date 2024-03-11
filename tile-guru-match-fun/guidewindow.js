/**
 * Created by r4zi4l on 15.03.2021
 */

var GuideWindow = Window.extend({
    onWindowLoaded: function (options, unit) {
        this.stages = [];
        this.arrows = [];
        this.unit = unit;
        this.bundleName = this.listBundles(options, unit)[0];
        this.name = options.name;
        this.stagesContent = options.stagesContent ? options.stagesContent.call(this, unit) : this.createSpineStages();

        this._super({
            name: options.name,
            title: this.unit ? cleverapps.unitsLibrary.getUnitName(this.unit) : options.title || options.name + ".title",
            content: this.createContent(),
            noBackground: true,
            closeButton: true
        });
    },

    isVertical: function () {
        return cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;
    },

    onShow: function () {
        this._super();
        this.showStages();
        this.showArrows();

        if (this.description) {
            this.description.setVisible(false);
            this.description.runAction(new cc.Sequence(
                new cc.ScaleTo(0, 0),
                new cc.Show(),
                new cc.ScaleTo(0.5, this.description.scale).easing(cc.easeBackOut())
            ));
        }
    },

    showStages: function () {
        var delay = 0.3;
        this.stages.forEach(function (stage) {
            stage.setVisible(false);
            stage.runAction(new cc.Sequence(
                new cc.ScaleTo(0, 0),
                new cc.Show(),
                new cc.DelayTime(delay),
                new cc.ScaleTo(0.5, stage.scale).easing(cc.easeBackOut())
            ));

            delay += 0.2;
        }, this);
    },

    showArrows: function () {
        var delay = 0;
        this.arrows.forEach(function (arrow, index) {
            var animation = this.isVertical() ? "vertical" : "horizontal";
            if (index === 1 && cleverapps.resolution.mode === cleverapps.WideMode.SQUARE) {
                animation = "diagonal";
            }

            arrow.runAction(new cc.Sequence(
                new cc.Hide(),
                new cc.DelayTime(delay),
                new cc.CallFunc(function () {
                    arrow.setAnimation(0, animation);
                }),
                new cc.Show()
            ));
            delay += 0.2;
        }, this);
    },

    createContent: function () {
        var styles = cleverapps.styles.GuideWindow;

        var stage1 = this.createStage(this.stagesContent[0], this.name + ".firstStage");
        var stage2 = this.createStage(this.stagesContent[1], this.name + ".secondStage");
        var stage3 = this.createStage(this.stagesContent[2], this.name + ".thirdStage");

        var arrow1 = this.createArrow();
        var arrow2 = this.createArrow();

        this.stages = [stage1, stage2, stage3];
        this.arrows = [arrow1, arrow2];

        var stages;
        if (cleverapps.resolution.mode === cleverapps.WideMode.SQUARE) {
            var row1 = new cleverapps.Layout([stage1, arrow1, stage2], { direction: cleverapps.UI.HORIZONTAL, margin: styles.stages.margin });
            var alignNode = new cc.Node();
            alignNode.setContentSize(arrow2.getContentSize());
            var row2 = new cleverapps.Layout([alignNode, stage3, arrow2], { direction: cleverapps.UI.HORIZONTAL, align: cleverapps.UI.ALIGN_END });
            stages = new cleverapps.Layout([row1, row2], { direction: cleverapps.UI.VERTICAL });
        } else {
            stages = new cleverapps.Layout([stage1, arrow1, stage2, arrow2, stage3], {
                direction: this.isVertical() ? cleverapps.UI.VERTICAL : cleverapps.UI.HORIZONTAL,
                margin: styles.stages.margin
            });
        }

        cleverapps.UI.onClick(stages, this.close.bind(this), {
            ignoreScale: true
        });

        return stages;
    },

    createArrow: function () {
        var arrowStyles = cleverapps.styles.GuideWindow.arrow;
        var spine = new cleverapps.Spine(bundles[this.bundleName].jsons.arrows);
        spine.setAnchorPoint2();
        spine.setPositionRound(arrowStyles);
        spine.setLocalZOrder(10);
        return spine;
    },

    createStage: function (stageView, descriptionText) {
        var styles = cleverapps.styles.GuideWindow.stages;

        var description = cleverapps.UI.generateOnlyText(descriptionText, cleverapps.styles.FONTS.GUIDE_WINDOW_STAGE_TEXT);
        description.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        description.setDimensions(this.isVertical() ? styles.description.verticalWidth : styles.description.width, 0);
        description.fitTo(undefined, styles.description.height);
        description.setAnchorPoint2();

        var layout = new cleverapps.Layout([stageView, description], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
        layout.setLocalZOrder(11);

        return layout;
    },

    initStage: function (styles, callback) {
        var stage = new cc.Node();
        stage.setAnchorPoint2();
        stage.setContentSize2(cleverapps.styles.GuideWindow.stages);

        var container = new cc.Node();
        container.setAnchorPoint2();
        container.setPositionRound(styles.container.x, styles.container.y);
        stage.addChild(container);

        callback(styles, container);

        return stage;
    },

    addUnitIcon: function (parent, code, stage, styles) {
        var icon = UnitView.getUnitImage({ code: code, stage: stage }, { alignAnchorX: true, preferStatic: true, alignAnchorY: styles.alignAnchorY });
        icon.setPositionRound(styles);

        var size = cc.size(styles.width, styles.height);
        if (styles.padding) {
            size = cc.rectSubPadding(cc.rect(0, 0, cleverapps.styles.GuideWindow.stages.width, cleverapps.styles.GuideWindow.stages.height), cc.padding(styles.padding));
        }

        if (size.width || size.height) {
            cleverapps.UI.fitToBox(icon, {
                width: size.width,
                height: size.height,
                maxScale: styles.scale
            });
        } else if (styles.scale) {
            icon.setScale(styles.scale);
        }

        parent.addChild(icon);
        return icon;
    },

    addSprite: function (parent, resource, styles) {
        if (styles === false || !styles) {
            return new cc.Node();
        }
        var sprite = new cc.Sprite(resource);
        sprite.setAnchorPoint2();
        sprite.setPositionRound(styles.x, styles.y);
        if (styles.scale) {
            sprite.setScale(styles.scale);
        }
        if (styles.rotation) {
            sprite.setRotation(styles.rotation);
        }
        parent.addChild(sprite, styles.zOrder);
        return sprite;
    },

    createSpineStages: function (jsons) {
        var maxWidth = 0, maxHeight = 0;

        var spines = [1, 2, 3].map(function (index) {
            var spine = new cleverapps.Spine(jsons && jsons[index - 1] || bundles[this.bundleName].jsons["guide_stages_" + index] || bundles[this.bundleName].jsons.guide_stages);
            spine.setAnimation(0, "stage" + index, true);
            spine.setAnchorPoint2();

            var contentSize = spine.getContentSize();
            if (contentSize.width > maxWidth) {
                maxWidth = contentSize.width;
            }
            if (contentSize.height > maxHeight) {
                maxHeight = contentSize.height;
            }

            return spine;
        }, this);

        return spines.map(function (spine) {
            var node = new cc.Node();
            node.setContentSize(maxWidth, maxHeight);
            node.setAnchorPoint2();
            node.addChild(spine);
            spine.setPosition(node.width / 2, node.height / 2);
            return node;
        });
    },

    listBundles: function (options) {
        return [options.getBundleName ? options.getBundleName() : options.name.toLowerCase()];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    GUIDE_WINDOW_STAGE_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.WHITE,
        lineHeight: 40
    },
    GUIDE_WINDOW_CLOSE_TEXT: {
        size: 26,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },
    GUIDEWINDOW_DESCRIPTION_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.WHITE,
        lineHeight: 40
    }
});

cleverapps.styles.GuideWindow = {
    stages: {
        width: 400,
        height: 520,
        margin: 30,

        description: {
            width: 320,
            verticalWidth: 500,
            height: 156
        }
    },

    arrow: {
        x: { align: "center" },
        y: { align: "center", dy: 20 }
    },

    closeText: {
        x: { align: "center" },
        y: { align: "bottom", dy: -126 }
    },

    description: {
        width: 1160,
        verticalWidth: 700
    }
};
