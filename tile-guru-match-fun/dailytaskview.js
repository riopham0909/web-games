/**
 * Created by andrey on 06.06.18.
 */

var DailyTaskView = cc.Node.extend({
    ctor: function (task) {
        this._super();

        this.isWide = cleverapps.config.type === "merge";

        this.task = task;

        this.setAnchorPoint2();

        var styles = cleverapps.styles.DailyTaskView;

        this.icon = this.createIcon();
        this.title = this.createTitle();
        this.rewards = this.createRewards();

        var titleAndRewards = new cleverapps.Layout([this.title, this.rewards], {
            direction: cleverapps.UI.VERTICAL,
            align: cleverapps.UI.ALIGN_START
        });

        var titleAndRewardsNode = new cc.Node();
        titleAndRewardsNode.setAnchorPoint2();
        titleAndRewardsNode.setContentSize(this.isWide ? styles.titleAndRewards.wide.width : styles.titleAndRewards.width, styles.titleAndRewards.height);
        titleAndRewardsNode.addChild(titleAndRewards);
        titleAndRewards.setPositionRound(styles.titleAndRewards);

        var progressBlock = this.createProgressBlock();

        var items = [this.icon, titleAndRewardsNode, progressBlock];

        this.content = new cleverapps.Layout(items, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin,
            padding: styles.padding
        });
        this.addChild(this.content);

        this.background = this.createBackground();

        this.setContentSize2(this.background.getContentSize());
        this.background.setPositionRound(this.width / 2, this.height / 2);
        this.content.setPositionRound(this.width / 2, this.height / 2);

        this.createSwapButton();
        this.setCascadeOpacityEnabledRecursively(true);

        this.onUpdate();
        this.task.on("update", this.onUpdate.bind(this), this);
    },

    createProgressBlock: function () {
        var styles = cleverapps.styles.DailyTaskView;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(styles.progressBlock);

        this.progressBar = this.createProgressBar();
        this.progressBar.setAnchorPoint2();
        node.addChild(this.progressBar);
        this.progressBar.setPositionRound(node.width / 2, node.height / 2);

        this.check = new cc.Sprite(bundles.dailytasks.frames.daily_task_mark_png);
        node.addChild(this.check);
        this.check.setPositionRound(node.width / 2, node.height / 2);

        this.rewardButton = new cleverapps.UI.Button({
            width: styles.button.width,
            height: styles.button.height,
            type: cleverapps.styles.UI.Button.Images.small_button_green,
            text: "DailyTaskView.Get",
            onClicked: this.onRewardButtonClick.bind(this)
        });
        this.rewardButton.setCascadeOpacityEnabled(true);
        this.rewardButton.setLocalZOrder(1);

        node.addChild(this.rewardButton);
        this.rewardButton.setPositionRound(node.width / 2, node.height / 2);

        return node;
    },

    createBackground: function () {
        var background = cleverapps.UI.createScale9Sprite(bundles.dailytasks.frames.daily_task_bg_png);
        background.setContentSize2(this.content.getContentSize());
        this.addChild(background, -1);

        return background;
    },

    onRewardButtonClick: function () {
        if (!this.task.isFinished() || this.task.collected) {
            return;
        }

        if (cleverapps.config.type === "merge") {
            this.rewardsList.receiveRewards();
            this.rewardsList.receiveRewardsAnimation({
                noFadeOut: true,
                callback: cleverapps.dailyTasks.collectLastTask
            });
            cleverapps.dailyTasks.collect(this.task);
        } else {
            this.task.givePrize();
        }
    },

    createProgressBar: function () {
        var styles = cleverapps.styles.DailyTaskView;

        var bar = new ScaledProgressBar({
            progress: bundles.progress_bar.frames.bar_dailytask,
            background: bundles.progress_bar.frames.bg_dailytask,
            progressFrames: styles.progressBar.progressFrames,
            barText: {
                text: this.task.progress + "/" + this.task.goal,
                font: cleverapps.styles.FONTS.DAILY_TASK_PROGRESS_FONT,
                dy: styles.progressBar.text.dy
            }
        });
        bar.setAnchorPoint2(0, 0);
        bar.setLength(styles.progressBar.width);
        bar.setPercentage(0);

        return bar;
    },

    createRewards: function () {
        var reward = this.task.getReward();

        var styles = cleverapps.styles.DailyTaskView;

        var rewardsTitle = cleverapps.UI.generateOnlyText("RewardsListComponent.rewardTitle", cleverapps.styles.FONTS.DAILY_TASK_REWARD_FONT || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        var rewardsList = this.rewardsList = new RewardsListComponent(reward, {
            font: cleverapps.styles.FONTS.DAILY_TASK_REWARD_FONT || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT,
            margin: styles.reward.margin,
            noPrefix: true,
            textDirection: cleverapps.UI.HORIZONTAL,
            textMargin: styles.reward.textMargin,
            small: true,
            noShowControls: true
        });

        var rewards = new cleverapps.Layout([rewardsTitle, rewardsList], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.reward.margin.x
        });
        cleverapps.UI.fitToBox(rewards, {
            width: this.isWide ? styles.titleAndRewards.wide.width : styles.titleAndRewards.width,
            height: styles.titleAndRewards.height
        });

        return rewards;
    },

    createTitle: function () {
        var styles = cleverapps.styles.DailyTaskView;

        var titleNode = new cc.Node();
        titleNode.setAnchorPoint2();
        titleNode.setContentSize2(this.isWide ? styles.title.wide.width : styles.title.width, styles.title.height);
        titleNode.setCascadeOpacityEnabled(true);

        var titleOptions = this.task.getTitle();
        var title = cleverapps.UI.generateOnlyText(titleOptions.text, cleverapps.styles.FONTS.DAILY_TASK_FONT || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT, titleOptions.replace);
        title.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        title.setDimensions(this.isWide ? styles.title.wide.textWidth : styles.title.textWidth, 0);
        title.fitTo(undefined, titleNode.height);
        title.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);

        titleNode.addChild(title);
        title.setPositionRound(title.width / 2, titleNode.height / 2);

        return titleNode;
    },

    createIcon: function () {
        var styles = cleverapps.styles.DailyTaskView.icon;

        var icon = new cc.Node();
        icon.setAnchorPoint2();

        var image = this.task.getIcon();

        var bg = cleverapps.UI.createScale9Sprite(bundles.dailytasks.frames.daily_task_icon_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        if (styles.bg) {
            bg.setContentSize2(this.isWide ? styles.bg.wide.width : styles.bg.width, styles.bg.height);
        }
        icon.addChild(bg);
        icon.setContentSize2(bg.getContentSize());
        bg.setPositionRound(icon.width / 2, icon.height / 2);

        if (bundles.dailytasks.frames.daily_task_icon_frame_png) {
            var iconFrame = this.iconFrame = new cc.Scale9Sprite(bundles.dailytasks.frames.daily_task_icon_frame_png);
            iconFrame.setPositionRound(icon.width / 2, icon.height / 2);
            icon.addChild(iconFrame);
            iconFrame.setContentSize2(styles.frame);
        }

        image.setPositionRound(icon.width / 2, icon.height / 2);
        icon.addChild(image);

        icon.setCascadeOpacityEnabled(true);

        return icon;
    },

    updateProgress: function () {
        this.progressBar.setPercentage(this.task.progress / this.task.goal * 100);
        this.progressBar.updateBarText(this.task.progress + "/" + this.task.goal);
    },

    onUpdate: function () {
        this.rewardButton.setVisible(!this.task.collected && !this.task.expired && this.task.isFinished());

        var styles = cleverapps.styles.DailyTaskView;

        if (this.iconFrame) {
            this.iconFrame.setSpriteFrame(new cc.Sprite(this.task.isFinished() ? bundles.dailytasks.frames.daily_task_icon_frame_completed_png : bundles.dailytasks.frames.daily_task_icon_frame_png).getSpriteFrame());
            this.iconFrame.setContentSize2(styles.icon.frame);
        }

        if (this.check) {
            this.check.visible = this.task.isFinished() && this.task.collected;
        }

        this.updateProgress();

        if (this.task.isFinished()) {
            this.progressBar.setVisible(false);
            if (this.swapBtn) {
                this.swapBtn.removeFromParent();
                delete this.swapBtn;
            }

            if (this.task.collected) {
                if (bundles.dailytasks.frames.daily_task_bg_completed_png) {
                    this.background.setSpriteFrame(new cc.Sprite(bundles.dailytasks.frames.daily_task_bg_completed_png).getSpriteFrame());
                }

                [this.icon, this.background, this.title, this.rewards].forEach(function (item) {
                    item.setOpacity(140);
                });
            }
        }
    },

    createSwapButton: function () {
        if (!this.task.isSwappable() || this.task.isFinished()) {
            return;
        }

        var styles = cleverapps.styles.DailyTaskView;

        this.swapBtn = new DailytaskSwapButton(this.task, this.isWide);
        this.content.addChild(this.swapBtn);
        if (this.isWide) {
            this.swapBtn.setPositionRound(styles.swapButton.wide);
        } else {
            this.swapBtn.setPositionRound(styles.swapButton);
        }
    }
});

cleverapps.styles.DailyTaskView = {
    margin: 10,
    padding: {
        left: 10,
        right: 40,
        y: 10
    },

    titleAndRewards: {
        width: 394,
        height: 138,
        x: { align: "left" },
        y: { align: "center" },

        wide: {
            width: 606
        }
    },

    content: {
        x: { align: "center" },
        y: { align: "center" }
    },

    reward: {
        margin: {
            x: 10
        },
        textMargin: 0
    },

    progressBlock: {
        width: 230,
        height: 35
    },

    icon: {
        x: { align: "left", dx: 25 },
        y: { align: "center", dy: 0 },

        frame: {
            width: 142,
            height: 142
        }
    },

    title: {
        width: 300,
        textWidth: 300,

        wide: {
            width: 606,
            textWidth: 540
        },

        height: 80
    },

    button: {
        width: 168,
        height: 80
    },

    swapButton: {
        wide: {
            x: { align: "right", dx: -275 },
            y: { align: "center", dy: 0 }
        },

        x: { align: "right", dx: 0 },
        y: { align: "top", dy: 0 }
    },

    progressBar: {
        width: 230,

        text: {
            dy: 0
        }
    }
};
