/**
 * Created by iamso on 15.01.2020.
 */

var AllDoneWindow = Window.extend({
    onWindowLoaded: function () {
        this._super({
            title: "AllDoneWindow.title",
            name: "alldonewindow",
            content: this.getContent(),
            button: {
                width: cleverapps.styles.AllDoneWindow.button.width,
                height: cleverapps.styles.AllDoneWindow.button.height,
                text: "Play",
                onPressed: function () {
                    this.close();

                    cleverapps.meta.distract({
                        focus: "PlayButton",
                        action: function (f) {
                            cleverapps.meta.wantsToPlay(f);
                        }
                    });
                }.bind(this)
            }
        });

        AllDoneWindow.showed = true;
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "happy"
        };
    },

    getContent: function () {
        return this.getText();
    },

    getText: function () {
        var styles = cleverapps.styles.AllDoneWindow;

        var text = cleverapps.UI.generateOnlyText("AllDoneWindow.text", cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);
        text.fitTo(undefined, styles.text.height);

        return text;
    }
});

cleverapps.styles.AllDoneWindow = {
    text: {
        width: 550,
        height: 400
    },

    button: {
        width: 300,
        height: 100
    }
};
