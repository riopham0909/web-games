/**
 * Created by slava on 16/4/19
 */

var SceneControlButton = cleverapps.UI.Button.extend({
    ctor: function (options) {
        options = options || {};

        this.options = options;

        var styles = cleverapps.styles.SceneControlButton;

        var defaultType = {
            button_png: bundles.controlbuttons.frames.control_button_png,
            button_on_png: bundles.controlbuttons.frames.control_button_on_png
        };

        var type = options.type ? options.type : defaultType;
        type.mark = styles.mark;

        this._super({
            type: type,
            onClicked: options.logic.onClicked.bind(this),
            content: new cc.Sprite(options.icon)
        });

        SceneDecors.add(this, cleverapps.skins.getSlot("sceneControlButton", { target: this }));

        if (options.logic.updateAttention) {
            options.logic.onUpdateAttention = this.createListener(this.setAttention.bind(this));
            options.logic.updateAttention();
        }
    }
});

cleverapps.styles.SceneControlButton = {
    mark: {
        x: { align: "right", dx: 5 },
        y: { align: "top", dy: -5 }
    }
};
