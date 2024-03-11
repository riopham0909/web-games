/**
 * Created by vladislav on 09.02.2022
 */

var DailyTaskTimer = cleverapps.Layout.extend({
    ctor: function (onFinish, onBg) {
        var styles = cleverapps.styles.DailyTaskTimer;

        var text = cleverapps.UI.generateOnlyText(
            "DailyTasksWindow.TimeToRefresh",
            onBg ? cleverapps.styles.FONTS.DAILY_TASK_CTA : cleverapps.styles.FONTS.WINDOW_TEXT
        );
        text.fitTo(styles.text.width);

        var timer = new Timer(cleverapps.dailyTasks.getTimeLeft(), onFinish);

        this._super([text, timer], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin,
            padding: styles.padding
        });

        this.setCascadeOpacityEnabled(true);
        timer.setCascadeOpacityEnabled(true);
        timer.y += styles.offsetY;
    }
});

cleverapps.styles.DailyTaskTimer = {
    margin: 20,

    offsetY: 0,

    text: {
        width: 450
    }
};
