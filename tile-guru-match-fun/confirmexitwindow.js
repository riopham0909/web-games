/**
 * Created by andrey on 22.08.17.
 */

var ConfirmExitWindow = Window.extend({
    onWindowLoaded: function (options) {
        options = options || {};
        this.action = options.action || function () {};

        var styles = cleverapps.styles.ConfirmExitWindow;

        var text = this.createText(options);

        if (bundles.confirmexit_window.jsons.confirmexit_window_json) {
            var animation = this.createAnimation();
        }

        if (options.reward) {
            var rewardList = new RewardsListComponent(options.reward, {
                font: cleverapps.styles.FONTS.WINDOW_TEXT,
                margin: styles.reward.margin
            });
        }

        if (typeof BreakViews !== "undefined" && Game.currentGame && cleverapps.environment.isGameScene()) {
            var breaks = new BreakViews();
        }

        var content = new cleverapps.Layout([animation, text, breaks, rewardList], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });

        this._super({
            closeByBackButton: true,
            title: "ConfirmExitWindow.title",
            name: "confirmexitwindow",
            content: content,
            buttons: this.getButtons()
        });
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "sad"
        };
    },

    createAnimation: function () {
        var styles = cleverapps.styles.ConfirmExitWindow;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize(styles.animation);

        var animation = new cleverapps.Spine(bundles.confirmexit_window.jsons.confirmexit_window_json);
        node.addChild(animation);

        if (animation.hasAnimation("open")) {
            animation.setAnimationAndIdleAfter("open", "idle");
        } else {
            animation.setAnimation(0, "sad", true);
        }

        animation.setPositionRound(styles.animation);

        return node;
    },

    createText: function (options) {
        var styles = cleverapps.styles.ConfirmExitWindow;

        var message = options.text || "AreYouSure";
        if (cleverapps.environment.isGameScene() && cleverapps.config.type !== "merge") {
            if (cleverapps.lives) {
                message = "ConfirmExitWindow.message";
            }
            if (Game.currentGame.level.episode.isBonusRound()) {
                message = "ConfirmExitWindow.BonusRound.message";
            }
        }

        var text = cleverapps.UI.generateOnlyText(message, cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setAnchorPoint2();
        text.setDimensions(styles.text.width, 0);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.fitTo(undefined, styles.text.height);

        return text;
    },

    getButtons: function () {
        var styles = cleverapps.styles.ConfirmExitWindow;

        var button = new cleverapps.UI.Button({
            text: "PlayOn",
            onClicked: function () {
                this.close();
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height
        });

        var exitButton = new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_red,
            text: "Exit",
            onClicked: function () {
                this.closeAnimationCallbacks.push(this.action);
                this.close();
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height
        });

        return [exitButton, button];
    },

    listBundles: function () {
        return ["confirmexit_window"];
    }
});

cleverapps.styles.ConfirmExitWindow = {
    margin: 20,

    padding: {
        bottom: 40
    },

    animation: {
        width: 400,
        height: 400,

        x: { align: "center" },
        y: { align: "center" }
    },

    text: {
        width: 500
    },

    button: {
        width: 300,
        height: 100
    },

    reward: {
        margin: {
            x: 100
        }
    }
};
