/**
 * Created by ivan on 11.04.18.
 */

var DailyTasksToolbarItem = function () {
    ToolbarItem.call(this, ToolbarItem.DAILY_TASKS);

    this.countdown = new cleverapps.CountDown(cleverapps.dailyTasks.getTimeLeft(), {
        permanent: true
    });

    this.enable();

    cleverapps.dailyTasks.onChangeStateListener = this.onChangeState.bind(this);
    this.onChangeState();
};

DailyTasksToolbarItem.prototype = Object.create(ToolbarItem.prototype);
DailyTasksToolbarItem.prototype.constructor = DailyTasksToolbarItem;

DailyTasksToolbarItem.prototype.onChangeState = function () {
    var waiting = cleverapps.dailyTasks.getNotCollectedTasks().length > 0;
    if (waiting) {
        this.mark();
    } else {
        this.unmark();
    }

    this.countdown.resetTimeLeft(cleverapps.dailyTasks.getTimeLeft());
    this.countdown.nextSecond(Date.now());
    this.onChangeStateListener();
};

DailyTasksToolbarItem.prototype.isVisible = function () {
    return cleverapps.dailyTasks.isAvailable();
};

DailyTasksToolbarItem.prototype.onClick = function () {
    cleverapps.meta.display({
        focus: "DailyTasksWindow",
        action: function (f) {
            cleverapps.dailyTasks.update();
            new DailyTasksWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};