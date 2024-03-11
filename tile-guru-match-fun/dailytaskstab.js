/**
 * Created by spepa on 19.04.2023
 */

var DailyTasksTab = cleverapps.Layout.extend({
    ctor: function (window) {
        var items = [];
        var styles = cleverapps.styles.DailyTasksTab;
        var completeAllViewTimer = cleverapps.config.ui === "tropical" && cleverapps.config.type === "merge";

        var timer = new DailyTaskTimer(window.close.bind(window), completeAllViewTimer);
        if (!completeAllViewTimer) {
            items.push(cleverapps.UI.wrapWithPadding(timer, styles.timer.padding));
        }
        items.push(new DailyTasksCompleteAllView(completeAllViewTimer && timer));
        items.push(this.createScroll());

        cleverapps.dailyTasks.onTaskSwappedOut = this.createListener(this.animateSwapOut.bind(this));

        this._super(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    },

    createScroll: function () {
        var styles = cleverapps.styles.DailyTasksTab;

        var tasks = this.createTasks();
        var scroll = this.scroll = new cleverapps.UI.ScrollView(tasks);
        scroll.setContentSize2(tasks.width + 2 * styles.scroll.paddingX, styles.scroll.height);
        scroll.setBarPadding(styles.scrollBarPadding);

        if (bundles.dailytasks.frames.foreground_png) {
            var foreground = cleverapps.UI.createScale9Sprite(bundles.dailytasks.frames.foreground_png);
            var isWide = cleverapps.config.type === "merge";
            foreground.setContentSize2(isWide ? styles.foreground.wide.width : styles.foreground.width, styles.foreground.height);
            scroll.addChild(foreground);
            foreground.setPositionRound(styles.foreground);
        }

        return scroll;
    },

    createTasks: function () {
        var taskViews = this.taskViews = [];
        var tasks = cleverapps.dailyTasks.getTasks().filter(function (task) {
            return task.type !== DailyTasks.COMPLETE_ALL;
        });

        tasks.forEach(function (task) {
            var taskView = new DailyTaskView(task);
            taskViews.push(taskView);
        }, this);

        var styles = cleverapps.styles.DailyTasksTab.tasks;
        var container = new cleverapps.Layout(taskViews, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
        container.visibilityCheckList = taskViews;

        return container;
    },

    onSelectTab: function () {
        cleverapps.dailyTasks.collectLastTask();

        if (this.wasAnimated) {
            return;
        }
        this.wasAnimated = true;
        this.scroll.scrollTo(cleverapps.UI.ScrollView.SCROLLS.LOWER_RIGHT);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.55),
            new cc.CallFunc(function () {
                var prizeTaskInd = 0;
                for (var i = 0; i < this.taskViews.length; i++) {
                    var task = this.taskViews[i].task;
                    if (task.isFinished() && !task.collected) {
                        prizeTaskInd = i;
                        break;
                    }
                }

                if (prizeTaskInd === 0) {
                    this.scroll.scrollTo(cleverapps.UI.ScrollView.SCROLLS.UPPER_LEFT, 1, {
                        easing: cc.easeBackInOut()
                    });
                } else if (prizeTaskInd === this.taskViews.length - 1) {
                    this.scroll.scrollTo(cleverapps.UI.ScrollView.SCROLLS.LOWER_RIGHT, 1, {
                        easing: cc.easeBackInOut()
                    });
                } else {
                    this.scroll.runAction(new cc.ScrollAction(this.taskViews[prizeTaskInd], {
                        duration: 1,
                        visibleBox: {
                            top: 0.6,
                            bottom: 0.6
                        }
                    }).easing(cc.easeBackInOut()));
                }
            }.bind(this))
        ));
    },

    animateSwapOut: function (slot) {
        var out = this.taskViews[slot];
        var targetPos = out.getPosition();

        var inTask = new DailyTaskView(cleverapps.dailyTasks.tasks[slot]);
        out.parent.addChild(inTask);
        inTask.setPosition(targetPos.x, targetPos.y + inTask.height * 0.8);
        inTask.setOpacity(0);
        inTask.setScale(1.02);

        inTask.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.Spawn(
                new cc.MoveTo(0.4, targetPos),
                new cc.FadeIn(0.4),
                new cc.Sequence(
                    new cc.DelayTime(0.3),
                    new cc.ScaleTo(0.2, 1)
                )
            )
        ));

        out.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, 1.035),
            new cc.DelayTime(0.05),
            new cc.Spawn(
                new cc.FadeOut(0.5),
                new cc.ScaleTo(0.5, 0.85),
                new cc.MoveBy(0.5, 0, -200)
            ),
            new cc.RemoveSelf()
        ));

        this.taskViews.splice(slot, 1, inTask);
    }
});

cleverapps.styles.DailyTasksTab = {
    margin: 0,
    padding: {
        x: 20,
        top: 140,
        bottom: 50
    },
    scroll: {
        paddingX: 20,
        height: 590
    },

    scrollBarPadding: {
        sidePadding: 8
    },

    timer: {
        padding: {
            x: 0,
            y: 0
        }
    },

    foreground: {
        width: 698,
        wide: {
            width: 698
        },
        height: 594,
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 }
    },

    tasks: {
        margin: 15,
        padding: { x: 0, y: 20 }
    }
};