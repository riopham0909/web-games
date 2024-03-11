/**
 * Created by iamso on 16.10.18.
 */

var ShareCheckBox = cleverapps.UI.CheckBox.extend({
    ctor: function (shareId, window) {
        this.window = window;
        this.shareId = shareId;

        this._super({
            onChange: this.onChange.bind(this),
            isSelected: this.isWindowChecked(),
            label: {
                text: "Share",
                font: this.window.withBg ? cleverapps.styles.FONTS.WINDOW_TEXT : cleverapps.styles.FONTS.WHITE_TEXT,
                clickable: true
            },
            styles: cleverapps.styles.ShareCheckBox
        });

        this.updateState();
        this.setCascadeOpacityEnabledRecursively(true);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SHARE_PROPOSED + shareId);
    },

    onChange: function (state) {
        ShareCheckBox.UNCHECKED[this.window.name] = !state;
    },

    updateState: function () {
        this.setSelected(this.isWindowChecked());
    },

    onWindowClose: function (f) {
        if (this.isWindowChecked()) {
            Share.show(this.shareId, f);
        } else {
            f && f();
        }
    },

    isWindowChecked: function () {
        return !ShareCheckBox.UNCHECKED[this.window.name];
    },

    hide: function (silent) {
        this.stopAllActions();

        if (silent) {
            this.setVisible(false);
            return;
        }

        this.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.Hide()
        ));
    },

    show: function () {
        this.stopAllActions();
        this.setOpacity(0);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(1.5),
            new cc.Show(),
            new cc.FadeTo(0.3, 200)
        ));
    }
});

ShareCheckBox.UNCHECKED = {

};

cleverapps.styles.ShareCheckBox = {
    margin: 15,
    padding: {
        x: 0,
        y: 0
    }
};