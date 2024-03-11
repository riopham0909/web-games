/**
 * Created by r4zi4l on 21.06.2021
 */

var VIPRewardedWindow = Window.extend({
    onWindowLoaded: function (onReward, onCancel) {
        this.onReward = onReward;
        this.onCancel = onCancel;

        this.isVertical = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;

        var levelData = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.VIP_LEVEL) || { l: 0, t: 0 };
        this.level = Math.max(levelData.l - Math.floor(Math.max(Date.now() - levelData.t, 0) / VIPRewardedWindow.LEVEL_INTERVAL), 0);

        this._super({
            name: "VIPRewardedWindow",
            title: "VIPRewardedWindow.title",
            content: this.createContent(),
            noBackground: true
        });

        cleverapps.meta.showControlsWhileFocused("MenuBarGoldItem");
    },

    getPerson: function () {
        return {
            role: PersonsLibrary.hasRole("king") ? "king" : "hero",
            emotion: "happy"
        };
    },

    skip: function (price) {
        if (cleverapps.user.spendHard(cleverapps.EVENTS.SPENT.SKIP_VIP, price)) {
            if (this.onReward) {
                this.onReward();
            }
            this.incLevel();
            this.onReward = undefined;
            this.onCancel = undefined;
            this.close();
        }
    },

    incLevel: function () {
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.VIP_LEVEL, {
            l: this.level + 1,
            t: Date.now()
        });
    },

    createContent: function () {
        var styles = cleverapps.styles.VIPRewardedWindow;

        var animationNode = new cc.Node();
        animationNode.setAnchorPoint2();
        animationNode.setContentSize2(styles.animation);
        var icon = new cleverapps.Spine(bundles.vip_window.jsons.vip_icon_json);
        icon.setAnimation(0, "animation", true);
        animationNode.addChild(icon);
        icon.setPositionRound(animationNode.width / 2, animationNode.height / 2);

        var description = cleverapps.UI.generateOnlyText("VIPRewardedWindow.description", cleverapps.styles.FONTS.VIPREWARDEDWINDOW_DESCRIPTION_TEXT);
        description.setDimensions(this.isVertical ? styles.description.verticalWidth : styles.description.width, 0);
        description.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var progress = this.createProgress();

        var cancelButton = new cleverapps.UI.Button({
            width: styles.button.width,
            height: styles.button.height,
            text: "Cancel",
            onClicked: this.close.bind(this),
            type: cleverapps.styles.UI.Button.Images.button_red
        });

        var skipPrice = this.calcPrice();

        var skipButton = new cleverapps.UI.Button({
            width: styles.button.width,
            height: styles.button.height,
            text: "Skip$$" + skipPrice,
            onClicked: this.skip.bind(this, skipPrice),
            type: cleverapps.styles.UI.Button.Images.button_green
        });

        if (!cleverapps.user.canTakeHard(skipPrice)) {
            skipButton.disable();
        }

        var buttons = new cleverapps.Layout([skipButton, cancelButton], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.button.margin
        });

        var vipPeriod = cleverapps.paymentsHistory.getVIPStatus().end;

        var remainingDays = Math.ceil((vipPeriod - Date.now()) / cleverapps.parseInterval("1 day"));
        if (remainingDays > 30) {
            remainingDays = 30;
        }

        var note = cleverapps.UI.generateOnlyText("VIPRewardedWindow.note", cleverapps.styles.FONTS.VIPREWARDEDWINDOW_NOTE_TEXT, {
            price: cleverapps.paymentsHistory.calculateMinimalVipSum(),
            remaining: remainingDays
        });
        note.setOpacity(200);
        note.setDimensions(this.isVertical ? styles.note.verticalWidth : styles.note.width, 0);
        note.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var content = new cleverapps.Layout([animationNode, description, progress, buttons, note], {
            direction: cleverapps.UI.VERTICAL,
            padding: styles.padding,
            margin: this.isVertical ? styles.verticalMargin : styles.margin
        });
        content.y += 200;
        return content;
    },

    onClose: function () {
        if (this.onCancel) {
            this.onCancel();
        }
        this.onReward = undefined;
        this.onCancel = undefined;
    },

    calcDuration: function () {
        return VIPRewardedWindow.BASE_DURATION + VIPRewardedWindow.LEVEL_DURATION * this.level;
    },

    calcPrice: function () {
        return Math.round(this.calcDuration() / cleverapps.parseInterval("1 second") * (cleverapps.config.type === "merge" ? VIPRewardedWindow.SKIP_SECOND_PRICE : VIPRewardedWindow.SKIP_WHEN_NO_SOFT_SECOND_PRICE));
    },

    createProgress: function () {
        var styles = cleverapps.styles.VIPRewardedWindow.progress;

        var progress = new ScaledProgressBar({
            background: bundles.progress_bar.frames.bg_vip,
            progress: bundles.progress_bar.frames.bar_vip
        });
        progress.setLength(styles.width);
        progress.setPercentage(10);

        var duration = this.calcDuration();
        progress.runAction(new ScaledProgressBarProgressTo(duration / 1000, 100));

        var countdown = new cleverapps.CountDown(duration, {
            onFinish: function () {
                if (this.onReward) {
                    this.onReward();
                }
                this.incLevel();
                cleverapps.playSession.inc(cleverapps.EVENTS.STATS.VIP_REWARDED_WATCHED);
                this.onReward = undefined;
                this.onCancel = undefined;
                this.close();
            }.bind(this)
        });

        var timer = new cleverapps.CountDownView(countdown, {
            font: cleverapps.styles.FONTS.VIPREWARDEDWINDOW_TIMER_TEXT
        });
        timer.setPositionRound(styles.timer);
        progress.addChild(timer);

        return progress;
    },

    listBundles: function () {
        return ["vip_window"];
    }
});

VIPRewardedWindow.BASE_DURATION = cleverapps.parseInterval("12 seconds");
VIPRewardedWindow.LEVEL_DURATION = cleverapps.parseInterval("2 seconds");
VIPRewardedWindow.SKIP_SECOND_PRICE = 1 / 7;
VIPRewardedWindow.SKIP_WHEN_NO_SOFT_SECOND_PRICE = 15 / 12;
VIPRewardedWindow.LEVEL_INTERVAL = cleverapps.parseInterval("300 seconds");

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    VIPREWARDEDWINDOW_DESCRIPTION_TEXT: {
        size: 42
    },

    VIPREWARDEDWINDOW_TIMER_TEXT: {
        size: 60
    },

    VIPREWARDEDWINDOW_NOTE_TEXT: {
        size: 22
    }
});

cleverapps.styles.VIPRewardedWindow = {
    margin: 40,
    verticalMargin: 80,

    padding: {
        top: 60
    },

    animation: {
        width: 300,
        height: 300
    },

    description: {
        width: 1000,
        verticalWidth: 800
    },

    progress: {
        width: 600,

        timer: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 2 }
        }
    },

    button: {
        width: 300,
        height: 100,
        margin: 80
    },

    note: {
        width: 1000,
        verticalWidth: 800
    }
};
