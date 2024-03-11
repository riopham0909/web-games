/**
 * Created by vladislav on 11/10/2023
 */

var PrivacyWindow = Window.extend({
    onWindowLoaded: function (title, text) {
        this._super({
            title: title,
            name: "privacywindow",
            content: this.createContent(this.splitTextIntoChunks(text)),
            foreground: bundles.windows.frames.window_foreground_png,
            noPadding: true
        });
    },

    splitTextIntoChunks: function (text) {
        var maxLength = 1000;
        var lines = text.split("\n");

        var chunks = [];
        var currentChunk = "";
        for (var i = 0; i < lines.length; i++) {
            currentChunk += lines[i];
            if (currentChunk.length >= maxLength) {
                chunks.push(currentChunk);
                currentChunk = "";
            } else {
                currentChunk += "\n";
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks;
    },

    createContent: function (textChunks) {
        var styles = cleverapps.styles.PrivacyWindow;

        var chunks = textChunks.map(function (textChunk) {
            var text = cleverapps.UI.__generateNotLocalizedText(textChunk, cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
            text.setDimensions(styles.text.width, 0);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);

            return text;
        });

        var layout = new cleverapps.Layout(chunks, {
            margin: 0,
            direction: cleverapps.Layout.VERTICAL
        });

        var scroll = new cleverapps.UI.ScrollView(layout, {
            direction: cleverapps.UI.ScrollView.DIR_VERTICAL
        });
        scroll.setContentSize2(styles);
        scroll.setBarPadding(styles.scroll.barPadding);
        scroll.scrollTo(cleverapps.UI.ScrollView.SCROLLS.UPPER_LEFT);

        return cleverapps.UI.wrapWithPadding(scroll, styles.scroll.padding);
    }
});

cleverapps.styles.PrivacyWindow = {
    width: 2000,
    height: 900,
    text: {
        width: 1900
    },
    scroll: {
        padding: {
            x: 85,
            top: 136,
            bottom: 38,
            left: 20,
            right: 20
        },
        barPadding: {
            cornerPadding: 20,
            sidePadding: 40
        }
    }
};