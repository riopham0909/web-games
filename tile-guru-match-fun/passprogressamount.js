/**
 * Created by r4zi4l on 08.11.2021
 */

var PassProgressAmount = cleverapps.Layout.extend({
    ctor: function (options) {
        this.passLogic = options.passLogic;

        var styles = cleverapps.styles.PassProgressAmount;

        var text, icon, amount;
        if (this.passLogic.isAllTasksCompleted() && this.passLogic.isAllProgressShown()) {
            text = cleverapps.UI.generateOnlyText("PassWindow.completed", cleverapps.styles.FONTS.PASS_PROGRESS_TEXT);
        } else {
            text = cleverapps.UI.generateOnlyText("PassWindow.progress", cleverapps.styles.FONTS.PASS_PROGRESS_TEXT);

            icon = new cc.Sprite(bundles.passprogress.frames[this.passLogic.mission.type === Mission.TYPE_SALEPASS ? "progress_coin" : "progress_star"]);

            var task = this.passLogic.shownProgress;
            var goal = this.passLogic.levels[task.level].task.goal;
            amount = this.amount = cleverapps.UI.generateImageText(task.progress + " / " + goal, cleverapps.styles.FONTS.PASS_PROGRESS_IMAGE_TEXT);
            this.baseAmountScale = amount.scale;
            amount.setAnchorPoint2(0, 0.5);
        }

        this._super([text, icon, amount].filter(Boolean), {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });

        this.passLogic.onAnimateAmountChange = this.createListener(this.animateChange.bind(this));
        this.passLogic.onNextAmountStep = this.createListener(this.animateStep.bind(this));
    },

    animateChange: function (currentProgress, nextProgress, goal) {
        this.amount.runAction(new ImageFontCountTo(0.8, nextProgress.progress, goal));
    },

    animateStep: function (nextProgress) {
        var levels = this.passLogic.levels;
        var progress, goal;

        if (nextProgress.level < levels.length) {
            progress = 0;
            goal = levels[nextProgress.level].task.goal;
        } else {
            progress = goal = levels[levels.length - 1].task.goal;
        }

        this.amount.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, this.baseAmountScale * 1.2),
            new cc.ScaleTo(0.2, this.baseAmountScale),
            new ImageFontCountTo(0, progress, goal)
        ));
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PASS_PROGRESS_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    PASS_PROGRESS_IMAGE_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }

});

cleverapps.styles.PassProgressAmount = {
    margin: 10
};
