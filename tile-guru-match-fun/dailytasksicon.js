/**
 * Created by iamso on 08.07.2021
 */

var DailyTasksIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.dailytasks_json
    });

    cleverapps.dailyTasks.onChangeStateListener = function () {
        cleverapps.sideBar.resetByClassName(DailyTasksIcon);
    };
};

DailyTasksIcon.prototype = Object.create(SideBarIcon.prototype);
DailyTasksIcon.prototype.constructor = DailyTasksIcon;

DailyTasksIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "DailyTasksWindow",
        action: function (f) {
            cleverapps.dailyTasks.update();
            new DailyTasksWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

DailyTasksIcon.prototype.resetState = function () {
    if (cleverapps.config.type === "merge") {
        this.available = cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition() && cleverapps.dailyTasks.isAvailable({
            future: true
        });
    }

    if (!this.available) {
        return;
    }

    var locked = !cleverapps.dailyTasks.isAvailable();
    if (locked) {
        this.setLocked(true);
        this.setAttention(false);

        this.setTitle(Messages.get("IconLocked.TextDefault", {
            levelNo: this.getLockedTipData()
        }));
    } else {
        this.setLocked(false);
        var waiting = cleverapps.dailyTasks.getNotCollectedTasks().length > 0;
        this.setAttention(waiting);

        var completeAll = cleverapps.dailyTasks.getCompleteAllTask();
        this.setTitle(completeAll.progress + "/" + completeAll.goal);
    }
};

DailyTasksIcon.prototype.getForce = function () {
    return Forces.DAILY_TASKS_FORCE;
};

DailyTasksIcon.prototype.getLockedTipData = function () {
    var data = cleverapps.Availables.DAILY_TASKS;
    return cleverapps.humanReadableNumber({ floatLevel: data.level });
};
