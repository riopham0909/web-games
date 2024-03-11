/**
 * Created by iamso on 07.08.19.
 */

var TellWindow = Window.extend({
    onWindowLoaded: function (params) {
        var content = this.createText(params.text);

        this._super({
            content: content,
            name: "tellwindow",
            title: params.title,
            fireworks: cleverapps.environment.isBonusWorldScene(),
            button: {
                text: params.buttonText || "OK",
                onPressed: function () {
                    this.close();
                    if (params.onPressed) {
                        params.onPressed();
                    }
                }.bind(this)
            }
        });
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "talk"
        };
    },

    createText: function (message) {
        var styles = cleverapps.styles.TellWindow;

        var text = cleverapps.UI.generateOnlyText(message, cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);
        text.fitTo(undefined, styles.text.height);

        return text;
    }
});

cleverapps.styles.TellWindow = {
    text: {
        width: 650,
        height: 400
    }
};
