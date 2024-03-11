/**
 * Created by iamso on 09.03.2022
 */

var DailytaskSwapButton = cc.Node.extend({
    ctor: function (task, isWide) {
        this._super();
        this.setAnchorPoint2();
        this.setContentSize2(cleverapps.styles.DailytaskSwapButton);
        this.task = task;
        this.isWide = isWide;

        this.createButton();
        this.createTooltip();

        cleverapps.UI.applyHover(this, {
            onMouseOver: this.onMouseOver.bind(this),
            onMouseOut: this.onMouseOut.bind(this)
        });
    },

    createTooltip: function () {
        var styles = cleverapps.styles.DailytaskSwapButton.tooltip;

        var bg = this.tooltip = new cc.Scale9Sprite(bundles.tooltip.frames.tooltip_bg_png);
        bg.setContentSize2(styles);
        if (this.isWide) {
            bg.setPositionRound(this.width / 2, -bg.height / 2);
        } else {
            bg.setPositionRound(this.width - bg.width / 2, -bg.height / 2);
        }
        this.addChild(bg);

        var text = cleverapps.UI.generateOnlyText("DailyTasksWindow.swapTooltip", cleverapps.styles.FONTS.TOOLTIP_TEXT);
        text.fitTo(bg.width - styles.padding);
        bg.addChild(text);
        text.setPositionRound(bg.width / 2, bg.height / 2);

        bg.setVisible(false);
    },

    createButton: function () {
        if (this.isWide) {
            this.button = new cleverapps.UI.Button({
                width: cleverapps.styles.DailytaskSwapButton.width,
                height: cleverapps.styles.DailytaskSwapButton.height,
                content: new cc.Sprite(bundles.dailytasks.frames.swap_task_icon),
                type: cleverapps.styles.UI.Button.Images.small_button_blue,
                onClicked: this.onClicked.bind(this)
            });
        } else {
            this.button = new cc.Sprite(bundles.dailytasks.frames.swap_task_icon);
            cleverapps.UI.onClick(this.button, this.onClicked.bind(this));
            cleverapps.UI.applyHover(this.button);
            this.button.applyInteractiveScale();
        }
        this.addChild(this.button);
        this.button.setPositionRound(this.width / 2, this.height / 2);
    },

    onClicked: function () {
        cleverapps.dailyTasks.swapOutTask(this.task);

        this.tooltip.removeFromParent();
        delete this.tooltip;

        this.button.removeFromParent();
        delete this.button;
    },

    onMouseOver: function () {
        if (this.tooltip) {
            this.tooltip.setVisible(true);
        }
    },

    onMouseOut: function () {
        if (this.tooltip) {
            this.tooltip.setVisible(false);
        }
    }
});

cleverapps.styles.DailytaskSwapButton = {
    width: 70,
    height: 60,

    tooltip: {
        width: 300,
        height: 60,
        padding: 50
    }
};