/**
 * Created by vladislav on 21.02.2022
 */

var BreakViews = cleverapps.Layout.extend({
    ctor: function (isSmall, font) {
        var styles = cleverapps.styles.BreakViews;

        var breaks = cleverapps.ListBreaks().map(function (data) {
            return new BreakView(data, isSmall, font);
        });

        this._super(breaks, {
            margin: isSmall ? styles.small.margin : styles.margin,
            direction: isSmall ? cleverapps.UI.HORIZONTAL : cleverapps.UI.VERTICAL
        });
    }
});

cleverapps.styles.BreakViews = {
    margin: 10,

    small: {
        margin: 20
    }
};