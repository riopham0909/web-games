/**
 * Created by Slava Ivanov 13.10.22
 */

var TapToContinue = cc.Node.extend({
    ctor: function (options) {
        this._super();

        var text = typeof options.text === "string" ? options.text : "Window.ClickToClose";

        var tapToContinue = cleverapps.UI.generateOnlyText(text, cleverapps.styles.FONTS.CLOSE_TEXT);
        tapToContinue.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            tapToContinue.setWrapWidth(cc.view.getFrameSize().width);
        }
        tapToContinue.setPositionRound(tapToContinue.width / 2, tapToContinue.height / 2);

        this.setAnchorPoint2();
        this.setContentSize(tapToContinue.getContentSize());
        this.addChild(tapToContinue);

        this.setCascadeOpacityEnabled(true);
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

    hideAndRemove: function () {
        this.stopAllActions();

        this.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.Hide(),
            new cc.RemoveSelf()
        ));
    },

    show: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.FadeTo(0, 0),
            new cc.Show(),
            new cc.FadeIn(0.3)
        ));
    }
});

cleverapps.styles.TapToContinue = {
    x: { align: "center" },
    y: { align: "bottom", dy: 250 }
};
