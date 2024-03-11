/**
 * Created by mac on 12/10/21
 */

cleverapps.UI.HelpButton = cleverapps.UI.Button.extend({
    ctor: function (callback, options) {
        this.options = options || {};
        this._super({
            type: {
                button_png: bundles.buttons.frames.help_button_png,
                button_on_png: bundles.buttons.frames.help_button_on_png,
                button_off_png: bundles.buttons.frames.help_button_off_png
            },
            onClicked: callback
        });
    },
    getPreferredBundles: function () {
        if (this.options.window) {
            return ["main"];
        }
        return this._super();
    }
});