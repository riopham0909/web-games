/**
 * Created by ivan on 24.01.18.
 */

var BreakView = cleverapps.Layout.extend({
    ctor: function (data, isSmall, font) {
        this.data = data;

        var styles = cleverapps.styles.BreakView;

        if (!isSmall) {
            var text = cleverapps.UI.generateOnlyText(data.text, font || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        }

        var amount = this.createAmount(font);

        this._super(isSmall ? [amount] : [text, amount], {
            margin: styles.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
    },

    getPreferredBundles: function () {
        return ["game"];
    },

    createAmount: function (font) {
        return new TextWithIcon("!!x" + this.data.amount, {
            font: font || cleverapps.styles.FONTS.BREAK_AMOUNT_TEXT,
            icons: {
                "!!": this.data.icon
            }
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BREAK_AMOUNT_TEXT: {
        name: "nostroke",
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }
});

cleverapps.styles.BreakView = {
    margin: 10
};