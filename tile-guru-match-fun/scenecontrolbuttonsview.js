/**
 * Created by Oleg on 06.03.2020.
 */

var SceneControlButtonsView = cleverapps.Layout.extend({
    ctor: function () {
        var styles = cleverapps.styles.SceneControlButtonsView;

        this.buttons = SceneControlButtonsView.controlButtons.filter(function (item) {
            return item.logic.isAvailableInEpisode();
        }).map(function (item) {
            return new SceneControlButton(item);
        });

        this._super(this.buttons, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });

        this.updatePosition();
    },

    updateSize: function () {
        var styles = cleverapps.styles.SceneControlButtonsView;

        if (SceneControlButtonsView.isOutsideMenu()) {
            this.setScale(styles.outsideMenu.scale);
        }
    },

    updatePosition: function () {
        var styles = cleverapps.styles.SceneControlButtonsView;

        if (SceneControlButtonsView.isOutsideMenu()) {
            this.setPositionRound(styles.outsideMenu);
        } else {
            this.setPositionRound(styles.controlButtons);
        }
    }
});

SceneControlButtonsView.isOutsideMenu = function () {
    return ["heroes", "riddles"].indexOf(cleverapps.config.name) !== -1
        && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL && cleverapps.environment.isGameScene();
};

SceneControlButtonsView.menuButtonData = {
    logic: MenuControlButton,
    icon: bundles.controlbuttons.frames.menu_icon_png
};

SceneControlButtonsView.controlButtons = [
    {
        logic: ExitControlButton,
        icon: bundles.controlbuttons.frames.back_icon_png,

        type: {
            button_png: bundles.controlbuttons.frames.back_button_png,
            button_on_png: bundles.controlbuttons.frames.back_button_on_png
        }
    },

    {
        logic: FullscreenControlButton,
        icon: bundles.controlbuttons.frames.fullscreen_icon_png
    },

    SceneControlButtonsView.menuButtonData,

    {
        logic: PauseControlButton,
        icon: bundles.controlbuttons.frames.pause_png
    }
];

cleverapps.styles.SceneControlButtonsView = {
    margin: 16,

    outsideMenu: {
        x: { align: "left", dx: 10 },
        y: { align: "bottom", dy: 10 },
        scale: 0.8
    },

    controlButtons: {
        x: { align: "right" },
        y: { align: "center", dy: -5 }
    }
};
