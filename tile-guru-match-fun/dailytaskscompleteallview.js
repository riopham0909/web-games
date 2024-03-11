/**
 * Created by iamso on 28.07.2021
 */

var DailyTasksCompleteAllView = cc.Node.extend({
    ctor: function (timer) {
        this._super();

        this.timer = timer;

        this.setAnchorPoint2();

        this.task = cleverapps.dailyTasks.getCompleteAllTask();

        var bg = cleverapps.UI.createScale9Sprite(bundles.dailytasks.frames.complete_all_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        this.addChild(bg);

        this.content = this.createContent();
        this.addChild(this.content);

        bg.setContentSize2(this.content.getContentSize());
        this.setContentSize2(bg.getContentSize());
        bg.setPositionRound(this.width / 2, this.height / 2);
        this.content.setPositionRound(this.width / 2, this.height / 2);

        this.setLocalZOrder(1);

        this.onUpdate();
        this.task.on("update", this.onUpdate.bind(this), this);
    },

    createContent: function () {
        var styles = cleverapps.styles.DailyTasksCompleteAllView;

        var textLayout = this.createTextLayout();

        var icon = this.task.getIcon();

        return new cleverapps.Layout([icon, textLayout], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin,
            padding: styles.padding,
            align: styles.align
        });
    },

    createTextLayout: function () {
        var styles = cleverapps.styles.DailyTasksCompleteAllView;

        var items = [];

        var text = this.createText();
        items.push(text);

        if (this.timer) {
            items.push(this.timer);
        }

        this.prize = new PrizeBarComponent({
            currentValue: this.task.progress,
            goalValue: this.task.goal,
            collected: this.task.collected,
            reward: cleverapps.config.type !== "merge" && this.task.getReward(),
            width: styles.textLayout.width,
            onCollect: this.task.givePrize.bind(this.task)
        });

        items.push(this.prize);
        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.textLayout.margin,
            padding: styles.textLayout.padding
        });
    },

    createText: function () {
        var styles = cleverapps.styles.DailyTasksCompleteAllView;

        var text = cleverapps.UI.generateOnlyText("DailyTasksWindow.CTA", cleverapps.styles.FONTS.DAILY_TASK_CTA || cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.textLayout.width, 0);
        text.fitTo(undefined, styles.textLayout.height);

        return text;
    },

    onUpdate: function () {
        this.prize.updateProgress(this.task.progress, this.task.goal);
        if (this.task.collected) {
            this.prize.setCollected();
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    DAILY_TASKS_BAR: {
        name: "default",
        size: 35
    }
});

cleverapps.styles.DailyTasksCompleteAllView = {
    margin: 30,

    padding: {
        left: 75,
        right: 110,
        top: 15,
        bottom: 30
    },

    align: cleverapps.UI.ALIGN_CENTER,

    textLayout: {
        width: cleverapps.config.type === "merge" ? 700 : 400,
        height: 90,
        margin: 40,
        padding: {
            bottom: 30
        }
    },

    prize: {
        x: { align: "right", dx: -100 },
        y: { align: "bottom", dy: -24 }
    },

    mark: {
        x: { align: "right", dx: 75 },
        y: { align: "center" }
    }
};
