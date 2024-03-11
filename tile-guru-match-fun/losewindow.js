/**
 * Created by slava on 02.08.17.
 */

var LoseWindow = Window.extend({
    onWindowLoaded: function (game, boatswain) {
        this.level = game.level;

        var styles = cleverapps.styles.LoseWindow;

        var options = {
            name: "losewindow",
            content: this.createContent(),
            title: {
                text: "LoseWindow.title",
                font: cleverapps.styles.FONTS.LOSE_WINDOW_TITLE_TEXT
            },
            noBackground: styles.noBackground,
            openSound: bundles.lose_window.urls.lose_effect
        };

        var canTryAgain = !cleverapps.isKnockoutGame();
        if (canTryAgain) {
            var onSuccess = cleverapps.once(this.createListener(function () {
                if (boatswain) {
                    boatswain.setIntent(Boatswain.REPLAY_INTENT);
                }

                this.close();
            }.bind(this)));

            options.button = {
                text: "TryAgain",
                width: styles.button.width,
                height: styles.button.height,
                onPressed: function () {
                    if (cleverapps.lives && cleverapps.lives.isEmpty()) {
                        new LivesShopWindow({
                            onBought: onSuccess
                        });
                        return;
                    }

                    onSuccess();
                }
            };
        } else {
            options.tapToContinue = true;
        }

        this._super(options);

        if (cleverapps.lives) {
            cleverapps.lives.onChangeAmountListeners.losewindow = this.createListener(this.updateWindow.bind(this));
        }

        if (styles.hardLevel && this.level.isHard()) {
            var hardLevelIcon = new HardLevelWindowIcon();
            hardLevelIcon.setPositionRound(styles.hardLevel);
            hardLevelIcon.pulseAnimation();
            this.window.addChild(hardLevelIcon);
        }
    },

    onShow: function () {
        var delay = 0;

        this.content.children.forEach(function (component) {
            if (component.showUp) {
                delay += component.showUp();
            }
        });

        this._super(delay / 1000 + 0.5);
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "sad"
        };
    },

    createAnimationNode: function () {
        var styles = cleverapps.styles.LoseWindow;

        var animationNode = new cc.Node();
        animationNode.setAnchorPoint2();
        animationNode.setContentSize2(styles.animation);

        this.animation = new cleverapps.Spine(bundles.lose_window.jsons.lose_json);
        var animationName = cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed() ? "open_unlim" : "open";
        this.animation.setAnimationAndIdleAfter(animationName, "idle");

        animationNode.addChild(this.animation);
        this.animation.setPositionRound(styles.animation);

        return animationNode;
    },

    createLivesLayout: function (withAnimation) {
        var styles = cleverapps.styles.LoseWindow;

        var items = [];
        for (var i = 0; i < cleverapps.lives.getMaxLives(); i++) {
            var icon;
            if (i === cleverapps.lives.amount && withAnimation) {
                icon = new cleverapps.Spine(bundles.lose_window.jsons.level_failed_small_hearts_json);
                icon.setAnimation(0, "animation", false);
            } else {
                var heartSpriteName = i < cleverapps.lives.amount ? bundles.lose_window.frames.level_failed_heart_png : bundles.lose_window.frames.level_failed_heart_empty_png;

                icon = new cc.Sprite(heartSpriteName);
            }

            items.push(icon);
        }
        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.heartsMargin
        });
    },

    createLivesLeftBlock: function () {
        var styles = cleverapps.styles.LoseWindow;

        var items = [];

        var textFont = cleverapps.styles.FONTS.LOSE_WINDOW_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT;

        var text;
        if (cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed()) {
            text = cleverapps.UI.generateOnlyText("LoseWindow.livesLeftUnlimited", textFont);
            text.setDimensions(styles.livesLeftText.width, 0);
            text.fitTo(undefined, styles.livesLeftText.height);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            items.push(text);
        } else {
            text = cleverapps.UI.generateOnlyText("LoseWindow.livesLeft", textFont);
            text.fitTo(styles.livesLeftText.width, styles.livesLeftText.height);
            items.push(text);

            this.heartsNode = this.createLivesLayout(true);
            items.push(this.heartsNode);
        }

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.livesLeftMargin
        });
    },

    createContent: function () {
        var styles = cleverapps.styles.LoseWindow;

        var items = [];

        if (cleverapps.lives) {
            var animationNode = this.createAnimationNode();
            items.push(animationNode);

            this.livesLeftBlock = this.createLivesLeftBlock();
            items.push(this.livesLeftBlock);
        }

        if (cleverapps.highscore) {
            items.push(new VictoryScoreComponent());
            items.push(new ScoreStatsComponent());
        }

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.content.margin,
            padding: styles.content.padding
        });
    },

    updateWindow: function () {
        if (this.heartsNode) {
            var heartsNode = this.createLivesLayout();
            var position = this.heartsNode.getPosition();
            var parent = this.heartsNode.getParent();

            this.heartsNode.removeFromParent();

            parent.addChild(heartsNode);
            heartsNode.setPositionRound(position);

            this.heartsNode = heartsNode;
        }
    },

    listBundles: function () {
        return ["lose_window"];
    }
});

cleverapps.styles.LoseWindow = {
    heartsMargin: 5,
    livesLeftMargin: 15,

    livesLeftText: {
        width: 800,
        height: 180
    },

    content: {
        margin: 40,

        padding: {
            x: 80,
            bottom: 50,
            top: 50
        }
    },

    animation: {
        width: 300,
        height: 300,

        x: { align: "center" },
        y: { align: "center" }
    },

    button: {
        width: 300,
        height: 100
    }
};