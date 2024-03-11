/**
 * Created by vladislav on 17.09.2020
 */

var BackgroundsWindow = Window.extend({
    onWindowLoaded: function (options) {
        this.options = options || {};

        this.current = this.options.moveNext ? (cleverapps.simple.getCurrent() - 1) : cleverapps.simple.getCurrent();
        this.stars = this.options.moveNext ? cleverapps.simple.getRequiredStars(this.current) : cleverapps.simple.stars;

        var content = this.createContent();

        this._super({
            content: content,
            title: "BackgroundsWindow.title",
            name: "backgroundswindow",
            foreground: bundles.windows.frames.window_foreground_png
        });

        if (this.options.moveNext) {
            this.changeCurrent();
        }
    },

    updateSize: function () {
        this._super();
        if (this.scroll.dir === cleverapps.UI.ScrollView.DIR_HORIZONTAL && this.isVertical()
            || this.scroll.dir === cleverapps.UI.ScrollView.DIR_VERTICAL && !this.isVertical()) {
            this.window.removeFromParent();
            this.onWindowLoaded(this.options);
        }
    },

    isVertical: function () {
        return cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;
    },

    changeCurrent: function () {
        var prevBg = this.bgs[cleverapps.simple.current - 1];
        var currentBg = this.bgs[cleverapps.simple.current];
        var nextBg = this.bgs[cleverapps.simple.current + 1];
        if (cleverapps.simple.current === this.bgs.length - 2) {
            nextBg = false;
        }

        prevBg.progressBar.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.ScaleTo(0.3, 1.2 * prevBg.progressBar.baseScale).easing(cc.easeOut(2)),
            new cc.ScaleTo(0.3, 0).easing(cc.easeIn(2)),
            new cc.DelayTime(1.3)
        ));

        this.addTape(prevBg);
        prevBg.tape.setScale(0);
        prevBg.tape.runAction(new cc.Sequence(
            new cc.DelayTime(0.7),
            new cc.ScaleTo(0.5, 1.0).easing(cc.easeBackInOut(0.6)),
            new cc.CallFunc(function () {
                cleverapps.audio.playSound(bundles.simple.urls.simple_complete_bg_effect);
            })
        ));

        currentBg.lock.runAction(new cc.Sequence(
            new cc.DelayTime(1.2),
            new cc.ScaleTo(0.4, currentBg.lock.scale * 1.3).easing(cc.easeInOut(3)),
            new cc.ScaleTo(0.4, 0).easing(cc.easeIn(3)),
            new cc.RemoveSelf()
        ));

        currentBg.layerColor.runAction(new cc.Sequence(
            new cc.DelayTime(1.4),
            new cc.FadeOut(0.5)
        ));

        this.runAction(new cc.Sequence(
            new cc.DelayTime(1.3),
            new cc.CallFunc(function () {
                this.scroll.scrollTo(currentBg, 1.4);

                cleverapps.audio.playSound(bundles.simple.urls.simple_transition_effect);
            }.bind(this))
        ));

        if (nextBg) {
            nextBg.closedImage.runAction(new cc.Sequence(
                new cc.DelayTime(1.4),
                new cc.FadeOut()
            ));

            this.addLayerColor(nextBg);
            nextBg.layerColor.setOpacity(150);
        }

        this.addPresent(currentBg);

        if (currentBg.name) {
            this.runAction(new cc.Sequence(
                new cc.DelayTime(1.6),
                new cc.CallFunc(function () {
                    currentBg.name.setFont(cleverapps.styles.FONTS.BACKGROUNDS_WINDOW_NAME_TEXT);
                })
            ));
        }
    },

    createContent: function () {
        var styles = cleverapps.styles.BackgroundsWindow;

        var msg = Messages.get("BackgroundsWindow.text");
        if (this.options.moveNext && ["scramble", "differences"].indexOf(cleverapps.config.name) !== -1) {
            msg = Messages.get("BackgroundsWindow.moveNextText", {
                place: Messages.get("background_name_" + cleverapps.simple.getCurrent())
            });
        }

        var text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(this.isVertical() ? styles.text.vertical.width : styles.text.width, 0);
        text.fitTo(undefined, this.isVertical() ? styles.text.vertical.height : styles.text.height);

        this.bgs = [];
        var index = 0;

        var curView = undefined;
        while (bundles["backgrounds_window_" + index]) {
            var view = this.createItem(index);
            if (index === this.current) {
                curView = view;
            }
            this.bgs.push(view);

            index++;
        }

        this.bgs.push(this.createItem(index));

        var bgsLayout = new cleverapps.Layout(this.bgs, {
            childrenVisibility: cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_NONE,
            direction: this.isVertical() ? cleverapps.UI.VERTICAL : cleverapps.UI.HORIZONTAL,
            margin: styles.scroll.margin,
            padding: styles.scroll.padding
        });

        var scroll = this.scroll = new cleverapps.UI.ScrollView(bgsLayout);
        if (this.isVertical()) {
            scroll.setContentSize2(bgsLayout.width, styles.scroll.height);
        } else {
            scroll.setContentSize2(styles.scroll.width, bgsLayout.height);
        }

        scroll.scrollTo(curView);

        return new cleverapps.Layout([text, scroll.bg || scroll], {
            direction: cleverapps.UI.VERTICAL,
            margin: this.isVertical() ? styles.verticalMargin : styles.margin,
            padding: styles.padding
        });
    },

    getItemSize: function () {
        var styles = cleverapps.styles.BackgroundsWindow;
        var size = styles.item.size;
        return this.isVertical() ? size.horizontal : size.vertical;
    },

    createItem: function (index) {
        var styles = cleverapps.styles.BackgroundsWindow;

        var container = new cc.Node();
        container.setAnchorPoint2();
        var size = this.getItemSize();
        container.setContentSize2(size.width + 2 * styles.item.bg.padding.x, size.height + 2 * styles.item.bg.padding.y);

        var img = index <= this.current ? bundles.simple.frames.frame_gold_png : bundles.simple.frames.frame_silver_png;
        var frame = cleverapps.UI.createScale9Sprite(img, cleverapps.UI.Scale9Rect.TwoPixelXY);
        frame.setContentSize2(container.getContentSize());
        container.addChild(frame);
        frame.setPositionRound(container.width / 2, container.height / 2);
        frame.setLocalZOrder(10);

        if (index < this.current) {
            this.addTape(container);

            this.addBg(container, index);
        } else if (index === this.current) {
            this.addProgressBar(container, this.current, this.stars);

            this.addBg(container, index);
        } else if (index < cleverapps.simple.bgsAmount) {
            var lock = container.lock = new cc.Sprite(bundles.simple.frames.lock_png);
            container.addChild(lock);
            lock.setPositionRound(styles.lock);

            if (index === this.current + 1) {
                this.addBg(container, index);

                this.addLayerColor(container);
                container.layerColor.setOpacity(150);
            } else {
                this.addClosedImage(container);
            }

            if (this.options.moveNext && index === this.current + 2) {
                this.addBg(container, index);
            }
        } else {
            this.addClosedImage(container);

            var comingSoonText = cleverapps.UI.generateTTFText(
                "BackgroundsWindow.ComingSoonTitle",
                cleverapps.styles.FONTS.BACKGROUNDS_WINDOW_NAME_COMING_SOON
            );
            comingSoonText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            comingSoonText.setDimensions(size.width * 0.8, 0);
            container.addChild(comingSoonText);
            comingSoonText.setPositionRound(styles.comingSoon);
        }

        return container;
    },

    addPresent: function (container) {
        var styles = cleverapps.styles.BackgroundsWindow;

        var presentNode = new cc.Node();
        presentNode.setAnchorPoint2();
        presentNode.setContentSize2(styles.present);
        container.addChild(presentNode);
        presentNode.setPositionRound(styles.present);
        cleverapps.UI.applyHover(presentNode);
        presentNode.setScale(0);

        var animation = new cleverapps.Spine(bundles.main.jsons.reward_spine_json);
        presentNode.addChild(animation);
        animation.setScale(styles.present.animation.scale);
        animation.setPositionRound(styles.present.animation);
        animation.setAnimation(0, "animation", true);

        var present = new cleverapps.Spine(bundles.windows.jsons.present_json);
        presentNode.addChild(present);
        present.setScale(styles.present.scale);
        present.setSkin("green");
        present.setPositionRound(presentNode.width / 2, presentNode.height / 2);
        present.setLocalZOrder(10);
        present.setAnimation(0, "animation", true);

        var button = new cleverapps.UI.Button({
            width: styles.present.button.width,
            height: styles.present.button.height,
            type: cleverapps.styles.UI.Button.Images.small_button_green,
            text: "BackgroundsWindow.Get",
            onClicked: function () {}
        });
        present.addChild(button);
        button.setPositionRound(styles.present.button);

        presentNode.runAction(new cc.Sequence(
            new cc.DelayTime(2.1),
            new cc.ScaleTo(0.2, 1.2).easing(cc.easeOut(2)),
            new cc.CallFunc(function () {
                cleverapps.audio.playSound(bundles.simple.urls.metha_present_effect);
            }),
            new cc.ScaleTo(0.2, 1).easing(cc.easeIn(2)),
            new cc.CallFunc(function () {
                FingerView.hintClick(button);

                var node = new cc.Node();
                node.setAnchorPoint2();
                this.addChild(node);
                node.setLocalZOrder(1000);
                node.setContentSize2(this.width, this.height);
                node.setPositionRound(this.width / 2, this.height / 2);

                cleverapps.UI.onClick(node, function () {
                    this.close();
                }.bind(this), {
                    ignoreScale: true
                });
            }.bind(this))
        ));
    },

    addProgressBar: function (container, current, stars) {
        var styles = cleverapps.styles.BackgroundsWindow;

        var progressBar = container.progressBar = new StarsProgressBar({
            width: styles.bar.width,
            stars: stars,
            current: current,
            withPresent: !this.options.moveNext && !cleverapps.simple.isPassedAll()
        });
        container.addChild(progressBar);
        progressBar.setScale(styles.bar.scale);
        progressBar.baseScale = styles.bar.scale;
        progressBar.setPositionRound(styles.bar);
    },

    addTape: function (container) {
        var styles = cleverapps.styles.BackgroundsWindow;

        var tape = container.tape = new cc.Sprite(bundles.simple.frames.tape_png);
        tape.setLocalZOrder(11);
        container.addChild(tape);
        var pos = styles.name ? styles.tape.withName : styles.tape;
        tape.setPositionRound(pos);

        if (styles.tape.text) {
            var tapeText = cleverapps.UI.generateTTFText(Messages.get("BackgroundsWindow.tapeText").toUpperCase(), cleverapps.styles.FONTS.BACKGROUNDS_WINDOW_TAPE_TEXT);
            tapeText.setLocalZOrder(12);
            tape.addChild(tapeText);
            tapeText.fitTo(styles.tape.text.width);
            tapeText.setPositionRound(styles.tape.text);
        }
    },

    addLayerColor: function (container) {
        var styles = cleverapps.styles.BackgroundsWindow;

        container.layerColor = new cc.Scale9Sprite(bundles.pixel.frames.pixel_png);
        container.layerColor.setColor(cleverapps.styles.COLORS.CLOSED_BACKGROUND_COLOR);
        container.layerColor.setContentSize2(this.getItemSize());
        container.layerColor.setAnchorPoint2(0, 0);
        container.layerColor.setLocalZOrder(-9);
        container.addChild(container.layerColor);
        container.layerColor.setPositionRound(
            container.width / 2 - container.layerColor.width / 2 + styles.layerColor.offsetX,
            container.height / 2 - container.layerColor.height / 2 + styles.layerColor.offsetY
        );
    },

    addClosedImage: function (container) {
        var styles = cleverapps.styles.BackgroundsWindow;
        var image = this.isVertical() ? bundles.simple.frames.closed_bg_png : bundles.simple.frames.closed_bg_vertical_png;

        container.closedImage = new cc.Sprite(image);
        container.closedImage.setLocalZOrder(-9);
        container.addChild(container.closedImage);
        container.closedImage.setPositionRound(styles.item.bg);
    },

    addBg: function (container, index) {
        var styles = cleverapps.styles.BackgroundsWindow;
        var name = "backgrounds_window_";
        if (!this.isVertical()) {
            name += "vertical_";
        }

        var bg = container.bg = new cc.Sprite(bundles[name + index].urls.background);
        bg.setLocalZOrder(-10);
        container.addChild(bg);
        bg.setPositionRound(styles.item.bg);

        this.addNameText(container, index);
    },

    addNameText: function (container, index) {
        var styles = cleverapps.styles.BackgroundsWindow;
        if (!styles.name) {
            return;
        }

        var font = cleverapps.styles.FONTS.BACKGROUNDS_WINDOW_NAME_TEXT;
        var msg = "background_name_" + index;
        var name = container.name = cleverapps.UI.generateTTFText(msg, font);
        name.setPositionRound(styles.name);

        var bgImage = bundles.simple.frames.blue_background;
        if (bgImage) {
            var bg = cleverapps.UI.createScale9Sprite(bgImage, cleverapps.UI.Scale9Rect.TwoPixelXY);
            bg.addChild(name);
            bg.setPositionRound(styles.name.bg);
            bg.setContentSize2(container.width, bg.height);
            container.addChild(bg);
            name.setPositionRound(styles.name);
        } else {
            container.addChild(name, 11);
        }

        if (index === this.current + 1) {
            container.lock.setPositionRound(styles.lockWithName);
        }
    },

    listBundles: function (options) {
        options = options || {};

        var bundles = [];

        var bgsToLoad = cleverapps.simple.current + 1;
        if (options.moveNext) {
            bgsToLoad++;
        }

        for (var i = 0; i <= bgsToLoad; i++) {
            bundles.push("backgrounds_window_" + i);
        }

        return bundles;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BACKGROUNDS_WINDOW_TAPE_TEXT: {
        size: 60,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: {
            color: new cc.Color(168, 28, 54, 255),
            size: 2
        }
    },

    BACKGROUNDS_WINDOW_NAME_COMING_SOON: {
        size: 60,
        color: new cc.Color(255, 232, 72, 255),
        stroke: {
            size: 1,
            color: new cc.Color(198, 90, 22, 255)
        },
        shadow: {
            direction: cc.size(0, -4),
            color: new cc.Color(198, 90, 22, 255),
            blur: 1
        }
    },

    BACKGROUNDS_WINDOW_NAME_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});
cleverapps.overrideColors(cleverapps.styles.COLORS, {
    CLOSED_BACKGROUND_COLOR: new cc.Color(0, 8, 38, 255)
});

cleverapps.styles.BackgroundsWindow = {
    margin: -10,
    verticalMargin: 5,

    padding: {
        bottom: -26,
        right: -46,
        left: -48
    },

    text: {
        width: 1700,
        height: 100,
        vertical: {
            width: 600,
            height: 200  
        }
    },

    lock: {
        x: { align: "center" },
        y: { align: "center", dy: 8 }
    },

    tape: {
        x: { align: "right", dx: 16 },
        y: { align: "top", dy: -25 },
        withName: {
            x: { align: "right", dx: 16 },
            y: { align: "top", dy: -120 }
        },
        text: {
            x: 147,
            y: 58,
            width: 220
        }
    },

    layerColor: {
        offsetX: 0,
        offsetY: 0
    },

    comingSoon: {
        x: { align: "center" },
        y: { align: "center" }
    },

    bar: {
        width: 300,
        scale: 0.8,
        x: { align: "center", dx: -25 },
        y: { align: "bottom", dy: 80 }
    },

    item: {
        size: {
            vertical: {
                width: 443,
                height: 633
            },
            horizontal: {
                width: 600,
                height: 350
            }
        },
        bg: {
            padding: {
                x: 13,
                y: 15
            },
            x: { align: "center" },
            y: { align: "center" }
        }
    },

    scroll: {
        x: { align: "center" },
        y: { align: "center", dy: -1 },
        height: 800,
        width: 1800,
        margin: 15,

        padding: {
            x: 35,
            y: 40
        },
        
        rightHorizontalFrame: {
            x: { align: "right", dx: 2 },
            y: { align: "center" },
            padding: 30
        },
        
        leftHorizontalFrame: {
            x: { align: "left" },
            y: { align: "center" },
            padding: 30
        }
    },

    present: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: -30 },
        width: 200,
        height: 200,
        scale: 1,
        animation: {
            scale: 0.5,
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        },
        button: {
            width: 150,
            height: 80,
            x: { align: "center" },
            y: { align: "bottom" }
        }
    }
};
