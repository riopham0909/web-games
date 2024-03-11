/**
 * Created by vladislav on 17.09.2020
 */

var ProgressView = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint2();
        this.hoverContainer = new cc.Node();
        this.hoverContainer.setAnchorPoint2();
        this.addChild(this.hoverContainer);

        this.addProgressBar();
        this.addArrows();
        this.addIcons();
        cleverapps.UI.wrap(this.hoverContainer);
        this.setContentSize2(this.hoverContainer.getContentSize());
        this.hoverContainer.setPositionRound(this.width / 2, this.height / 2);

        this.addPerson();

        cleverapps.UI.wrap(this);

        cleverapps.UI.applyHover(this.hoverContainer);
        cleverapps.UI.onClick(this.hoverContainer, this.onClick.bind(this));

        this.updatePosition();

        cleverapps.aims.registerTarget("simpleStar", this, {
            controls: ["progress_view", "play_button"],
            withoutDelta: true,
            noTargetDelta: true,
            flyingUnderShadow: true,
            flyingAnimation: Reward.NO_ANIMATION
        });

        cleverapps.simple.on("updateProgress", this.updateProgress.bind(this), this);
        cleverapps.simple.on("showForce", this.showForce.bind(this), this);

        SceneDecors.add(this.hoverContainer, cleverapps.skins.getSlot("progressViewDecor"));
    },

    updatePosition: function () {
        this.setPositionRound(cleverapps.styles.ProgressView);
    },

    onClick: function () {
        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }

        cleverapps.audio.playSound(bundles.main.urls.click_effect);

        cleverapps.meta.display({
            focus: "BackgroundsWindow",
            action: function (f) {
                new BackgroundsWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    },

    showForce: function () {
        cleverapps.forces.create(this.hoverContainer, Forces.SIMPLE);
    },

    addPerson: function () {
        var styles = cleverapps.styles.ProgressView.person;
        if (!styles) {
            return;
        }

        this.person = new cc.Node();
        this.person.setAnchorPoint(0.5, 0);
        this.person.setPositionRound(styles);
        this.person.setContentSize2(styles);
        this.person.setLocalZOrder(styles.zOrder || 0);
        this.person.baseScale = this.person.scale;
        this.addChild(this.person);

        var person = new Person("hero");
        person.setPositionRound(styles.animation);
        this.person.addChild(person);

        cleverapps.UI.onClick(this.person, this.onClick.bind(this));
    },

    runProgressAnimation: function () {
        var styles = cleverapps.styles.ProgressView;

        var progressBarAnimation = new cleverapps.Spine(bundles.simple.jsons.progress_bar_spark_json);
        this.hoverContainer.addChild(progressBarAnimation);
        progressBarAnimation.setPositionRound(styles.bar.spark);
        progressBarAnimation.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.CallFunc(function () {
                progressBarAnimation.setAnimation(0, "animation", false);
                progressBarAnimation.setCompleteListenerRemove();
            })
        ));
    },

    runAvatarAnimation: function () {
        var avatarAnimation = new cleverapps.Spine(bundles.simple.jsons.avatar_spark_json);
        this.hoverContainer.addChild(avatarAnimation);
        avatarAnimation.setPositionRound(this.nextIcon.getPosition());
        avatarAnimation.setCompleteListenerRemove();
        avatarAnimation.runAction(new cc.Sequence(
            new cc.DelayTime(0.7),
            new cc.CallFunc(function () {
                avatarAnimation.setAnimation(0, "animation", false);
                cleverapps.audio.playSound(bundles.simple.urls.simple_win_effect);
            })
        ));
    },

    runStarAnimation: function (delay, timeScale, speed, callback) {
        var styles = cleverapps.styles.ProgressView;

        var scene = cleverapps.scenes.getRunningScene();

        var target = this.progressBar.bar.icon;
        var targetPos = scene.convertToNodeSpace(target.getParent().convertToWorldSpace(target.getPosition()));

        targetPos.x += styles.star.x;
        targetPos.y += styles.star.y;

        var star = new cleverapps.Spine(bundles.simple.jsons.star_json);
        scene.addChild(star);
        star.setPositionRound(targetPos.x, scene.height / 2);
        star.setLocalZOrder(10);
        star.setTimeScale(timeScale);

        star.runAction(new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.CallFunc(function () {
                star.setAnimation(0, "collect", false);
                star.setCompleteListenerRemove();
            }),
            new cc.MoveTo(speed, targetPos).easing(cc.easeIn(2)),
            new cc.PlaySound(bundles.simple.urls.star_collect_effect),
            new cc.CallFunc(function () {
                this.progressBar.updateProgress(1);

                callback();
            }.bind(this))
        ));
    },

    updateProgress: function (addedStars) {
        var styles = cleverapps.styles.ProgressView;

        cleverapps.meta.showControlsWhileFocused(["play_button"], true);

        var onStarsFinished = cleverapps.wait(addedStars, function () {
            if (!cleverapps.simple.isPassedAll() && cleverapps.simple.canMoveNext()) {
                this.runProgressAnimation();

                this.runAvatarAnimation();
            }

            var delta = cleverapps.UI.animateDelta(addedStars, {
                x: styles.delta.x,
                y: styles.delta.y,
                font: cleverapps.styles.FONTS.SCENE_ANIMATE_DELTA_TEXT,
                parent: this.progressBar
            });
            delta.replaceParentSamePlace(this);
        }.bind(this));

        var maxTime = 5;
        var baseDelay = 0.4;

        var delay = baseDelay;
        if (baseDelay * addedStars > maxTime) {
            delay = maxTime / addedStars;
        }

        var timeScale = baseDelay / delay;
        var speed = delay / baseDelay;

        for (var i = 0; i < addedStars; i++) {
            this.runStarAnimation(i * delay, timeScale, speed, onStarsFinished);
        }
    },

    addProgressBar: function () {
        var styles = cleverapps.styles.ProgressView;

        this.progressBar = new StarsProgressBar({
            width: styles.bar.width,
            stars: cleverapps.simple.pendingsStars > 0 ? cleverapps.simple.stars - cleverapps.simple.pendingsStars : undefined
        });
        this.hoverContainer.addChild(this.progressBar);
    },

    addArrows: function () {
        var styles = cleverapps.styles.ProgressView.arrows;

        var arrowWidth = new cc.Sprite(bundles.simple.frames.arrow_png).width;
        var amount = (this.progressBar.width - styles.widthOffset) / (arrowWidth + styles.margin);

        var arrows = [];
        for (var i = 0; i < amount; i++) {
            arrows.push(new cc.Sprite(bundles.simple.frames.arrow_png));
        }

        var layout = new cleverapps.Layout(arrows, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });

        layout.setLocalZOrder(-1);

        this.progressBar.bar.addChild(layout);
        layout.setPositionRound(styles);
    },

    addIcons: function () {
        var styles = cleverapps.styles.ProgressView;

        var currentIcon = this.currentIcon = this.createIcon();
        this.hoverContainer.addChild(currentIcon);
        currentIcon.setPositionRound(-styles.bar.width / 2 - styles.icon.offset.x, this.height / 2 + styles.icon.offset.y);
        currentIcon.setRotation(-styles.icon.rotation || 0);

        var nextIcon = this.nextIcon = this.createIcon(true);
        nextIcon.setRotation(styles.icon.rotation || 0);
        this.hoverContainer.addChild(nextIcon);
        nextIcon.setPositionRound(styles.bar.width / 2 + styles.icon.offset.x, this.height / 2 + styles.icon.offset.y);
        if (cleverapps.simple.current === cleverapps.simple.bgsAmount - 1) {
            nextIcon.addChild(this.createLock());
        }
    },

    createIcon: function (isNext) {
        var icon;
        if (isNext) {
            icon = new cc.Sprite(bundles[cleverapps.simple.getIconBundle(cleverapps.simple.current + 1)].urls.icon);
        } else {
            icon = new cc.Sprite(bundles[cleverapps.simple.getIconBundle(cleverapps.simple.current)].urls.icon);
        }

        var iconBg = this.createIconBg(icon, isNext);

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(iconBg.getContentSize());
        node.addChild(icon);
        node.addChild(iconBg);
        node.setLocalZOrder(10);

        icon.setPositionRound(node.width / 2, node.height / 2);

        return node;
    },

    createLock: function () {
        var styles = cleverapps.styles.ProgressView;

        var lock = new cc.Sprite(bundles.simple.frames.lock_png);
        lock.setLocalZOrder(10);
        lock.setScale(styles.comingSoon.lock.scale);
        lock.setPositionRound(styles.comingSoon.lock);

        return lock;
    },

    createIconBg: function (icon, isNext) {
        var styles = cleverapps.styles.ProgressView.icon.bg;

        var iconBg = new cc.Scale9Sprite(isNext ? bundles.simple.frames.frame_next_png || bundles.simple.frames.frame_silver_png : bundles.simple.frames.frame_current_png || bundles.simple.frames.frame_gold_png);

        if (styles.flipped) {
            styles = styles.flipped;

            if (isNext) {
                iconBg.setScaleX(-1);
            }
            iconBg.setPositionRound(isNext ? styles.right : styles.left);
        } else {
            iconBg.setContentSize2(icon.width * icon.scaleX + 2 * styles.padding.x, icon.height * icon.scaleY + 2 * styles.padding.y);
            iconBg.setPositionRound(styles);
        }

        return iconBg;
    }
});

cleverapps.styles.ProgressView = {
    x: { align: "center" },
    y: { align: "bottom", dy: 250 },

    person: false,

    bar: {
        width: 350,

        spark: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        }
    },

    star: {
        x: 0,
        y: -12
    },

    arrows: {
        x: { align: "center" },
        y: { align: "center", dy: 4 },
        widthOffset: 40,
        margin: 15
    },

    icon: {
        offset: {
            y: 6,
            x: 52
        },
        bg: {
            padding: {
                x: 11,
                y: 12
            },
            x: { align: "center" },
            y: { align: "center", dy: -2 }
        }
    },

    comingSoon: {
        lock: {
            x: { align: "center" },
            y: { align: "center" },
            scale: 0.3
        },
        icon: {
            width: 96,
            height: 92
        }
    },

    delta: {
        x: { align: "center" },
        y: { align: "top", dy: 50 }
    }
};
