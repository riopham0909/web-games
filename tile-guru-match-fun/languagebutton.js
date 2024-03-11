/**
 * Created by vladislav on 13.01.2022
 */

var LanguageButton = cleverapps.UI.Button.extend({
    ctor: function (language, callback) {
        this.language = language;
        this.callback = callback;

        var styles = cleverapps.styles.LanguageButton;

        this._super({
            type: {
                button_png: bundles.buttons.frames.button_png,
                button_on_png: bundles.buttons.frames.button_on_png,
                button_off_png: bundles.buttons.frames.button_on_png
            },
            text: this.language,
            textOff: "%%" + this.language,
            icons: {
                "%%": bundles.checkbox.frames.check_mark_png
            },
            width: styles.width,
            height: styles.height,
            onClicked: this.onClicked.bind(this)
        });

        if (this.isCurrentLanguage()) {
            this.disable();
        }
    },

    onClicked: function () {
        this.callback(this.language);

        this.disable();
    },

    isCurrentLanguage: function () {
        return cleverapps.settings.language === this.language;
    },

    updateEnabled: function () {
        if (this.isCurrentLanguage()) {
            this.disable();
        } else {
            this.enable();
        }
    }
});

cleverapps.styles.LanguageButton = {
    width: 260,
    height: 100
};