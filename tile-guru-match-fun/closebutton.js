/**
 * Created by mac on 10/12/22
 */

var CloseButton = cleverapps.UI.Button.extend({
    ctor: function (options) {
        this._super({
            type: {
                button_png: bundles.buttons_main.frames.window_close_png,
                button_on_png: bundles.buttons_main.frames.window_close_on_png
            },
            onClicked: options.onClicked
        });

        this.setPositionRound(options.styles || cleverapps.styles.CloseButton);
        this.setLocalZOrder(3);
    },

    hide: function () {
        this.setVisible(false);
    },

    show: function () {
        this.runAction(
            new cc.Sequence(
                new cc.ScaleTo(0, 0.3),
                new cc.Show(),
                new cc.ScaleTo(0.4, 1).easing(cc.easeBackOut())
            )
        );
    }
});

cleverapps.styles.CloseButton = {
    x: { align: "right", dx: 20 },
    y: { align: "top", dy: 20 }
};