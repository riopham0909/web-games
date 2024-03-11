/**
 * Created by slava on 24.03.17.
 */

var WaitWindow = Window.extend({
    onWindowLoaded: function () {
        var content = this.showLoading();

        content.setCascadeOpacityEnabled(true);
        content.setOpacity(0);
        content.setVisible(false);

        var styles = cleverapps.styles.WaitWindow;

        this._super({
            name: "waitwindow",
            noBackground: true,
            content: content,
            closeButton: false,
            styles: styles
        });

        content.runAction(
            new cc.Sequence(
                new cc.DelayTime(styles.delay),
                new cc.CallFunc(function () {
                    content.setVisible(true);
                }),
                new cc.FadeTo(0.3, 255)
            )
        );

        this.oldEventNodes = cleverapps.meta.eventNodes;
        cleverapps.meta.setEventNodes([]);
    },

    showLoading: function () {
        var styles = cleverapps.styles.WaitWindow;
        var content = new cleverapps.Spine(bundles.main.jsons.wait_json);
        content.setAnimation(0, "idle", true);

        if (styles.text) {
            var loadingText;
            if (Messages.get("Loading")) {
                loadingText = cleverapps.UI.generateOnlyText("Loading", cleverapps.styles.FONTS.WAIT_WINDOW_TEXT);
            } else {
                loadingText = cleverapps.UI.__generateNotLocalizedText("Loading", cleverapps.styles.FONTS.WAIT_WINDOW_TEXT);
            }
            loadingText.setPositionRound(styles.text);
            content.addChild(loadingText, 1);
        }

        return content;
    },

    closeByBackButton: function () {
        // do nothing
    },

    popUpAnimation: function () {

    },

    closeAnimation: function (callback) {
        callback();
    },

    onClose: function () { 
        if (this.isRunning()) {
            cleverapps.meta.setEventNodes(this.oldEventNodes);
        }
    }
});

WaitWindow.show = function () {
    if (this.instance) {
        this.counter += 1;
        return;
    }

    this.instance = new WaitWindow();
    this.counter = 1;
};

WaitWindow.hide = function () {
    this.counter -= 1;

    if (this.counter === 0) {
        this.instance.close();
        this.instance = undefined;
    }
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    WAIT_WINDOW_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.WINDOW_WHITE_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.WHITE_TEXT_SHADOW
    }
});

cleverapps.styles.WaitWindow = {
    delay: 0.2,

    text: {
        x: { align: "center" },
        y: { align: "center" }
    }
};