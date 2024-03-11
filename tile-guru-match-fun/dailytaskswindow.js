/**
 * Created by andrey on 23.04.18.
 */

var DailyTasksWindow = Window.extend({
    onWindowLoaded: function () {
        this.showMenubar();
        this.createContent();

        this._super({
            name: "dailytaskswindow",
            title: cleverapps.dailyTasks.isAllTasksFinished() ? "DailyTasksWindow.finished.title" : "DailyTasksWindow.title",
            content: this.content,
            foreground: bundles.windows.frames.window_foreground_png,
            noPadding: true
        });

        this.tabs.activateTab("tasks");

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DAILY_TASKS_OPEN_WINDOW);
        cleverapps.playSession.set(cleverapps.EVENTS.SESSION_DAILY_TASK_OPEN_WINDOW, true);
    },

    getPerson: function () {
        return cleverapps.config.type === "merge" && (cleverapps.unitsLibrary.getActiveHero() || "dwarf");
    },

    showMenubar: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        var controls = [];
        cleverapps.dailyTasks.tasks.forEach(function (task) {
            new RewardsList(task.getReward()).rewards.forEach(function (reward) {
                reward.listControls().forEach(function (control) {
                    if (controls.indexOf(control) === -1) {
                        controls.push(control);
                    }
                });
            });
        });
        cleverapps.meta.showControlsWhileFocused(controls);
    },

    onClose: function () {
        var task = cleverapps.dailyTasks.getCompleteAllTask();
        if (task && task.isFinished() && !task.collected) {
            task.givePrize();
        }
    },

    createTabs: function () {
        var create = function (TabClass) {
            var tab = new TabClass(this);
            this.content.addChild(tab);
            tab.setPositionRound(tab.width / 2, tab.height / 2);
            return tab;
        }.bind(this);

        this.dailyTasksTab = create(DailyTasksTab);
        this.tabsInfo = {
            tasks: {
                content: this.dailyTasksTab,
                icon: bundles.tabs.frames.dailytasks_icon
            }
        };

        if (DailyTasksWindow.HasAchievements()) {
            this.tabsInfo.achievements = {
                content: create(AchievementsTab),
                icon: bundles.tabs.frames.achievements_icon
            };
        }
    },

    createContent: function () {
        var styles = cleverapps.styles.DailyTasksWindow;

        var content = this.content = new cc.Node();
        content.setAnchorPoint2();
        this.createTabs();
        content.setContentSize2(this.dailyTasksTab.getContentSize());

        var tabs = this.tabs = new Tabs(this.tabsInfo, styles.tabs);
        content.addChild(tabs);
        tabs.setPositionRound(styles.tabs);
        tabs.setVisible(Object.keys(this.tabsInfo).length > 1);
    },

    showHint: function (text) {
        if (this.minimal) {
            this.stopAction(this.minimalAction);
            this.minimal.remove();
        }

        this.minimal = new MinimalDialogue({
            delay: 0,
            text: text,
            rects: this.getMinimalDialogueRects()
        });
        this.addChild(this.minimal);
        this.minimal.display();

        this.minimalAction = this.runAction(new cc.Sequence(
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                this.minimal.remove();
                delete this.minimal;
            }.bind(this))
        ));
    },

    listBundles: function () {
        return ["dailytasks"];
    }
});

DailyTasksWindow.HasAchievements = function () {
    return cleverapps.achievements && cleverapps.config.debugMode;
};

cleverapps.styles.DailyTasksWindow = {
    tabs: {
        height: 130,
        direction: cleverapps.UI.VERTICAL,
        x: { align: "left", dx: -115 },
        y: { align: "top", dy: -85 }
    }
};
