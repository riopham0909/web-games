/**
 * Created by iamso on 19.08.19.
 */

var BottomButton = cleverapps.UI.Button.extend({
    ctor: function (options) {
        var styles = cleverapps.styles.Window.BottomButton;

        options.width = options.width || styles.width;
        options.height = options.height || styles.height;

        this._super(options);
    }
});