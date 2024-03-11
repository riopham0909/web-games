/**
 * Created by vladislav on 2/4/19
 */

cleverapps.DailyCupLeadersRow = cleverapps.Row.extend({
    ctor: function (params) {
        this._super(params, {
            badges: false,
            prizes: false
        });
    },

    generateMedalAmount: function (place, amount) {
        var styles = cleverapps.styles.DailyCupLeadersRow;

        var medal = new cc.Sprite(bundles.table.frames['badge_' + place]);
        medal.setScale(0.7);

        var amountText = cleverapps.UI.generateImageText(amount, cleverapps.styles.FONTS.SMALL_WHITE_TEXT);
        amountText.setAnchorPoint2(0, 0.5);
        amountText.fitTo(styles.text.width);

        var amountWrap = new cc.Node();
        amountWrap.setAnchorPoint2();
        amountWrap.setContentSize2(styles.text.width, amountText.height);
        amountWrap.addChild(amountText);
        amountText.setPositionRound(0, amountText.height / 2);

        return new cleverapps.Layout([medal, amountWrap], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.iconMargin
        });
    },

    createDataContent: function (params) {
        var styles = cleverapps.styles.DailyCupLeadersRow;

        var items = [];
        items.push(this.generateMedalAmount(1, params.firstPlace));
        items.push(this.generateMedalAmount(2, params.secondPlace));
        items.push(this.generateMedalAmount(3, params.thirdPlace));

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
    }
});

cleverapps.styles.DailyCupLeadersRow = {
    text: {
        width: 50
    },

    iconMargin: 2,
    margin: 4
};