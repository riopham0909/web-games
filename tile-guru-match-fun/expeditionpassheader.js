/**
 * Created by razial on 03.11.2021
 */

var ExpeditionPassHeader = cc.Node.extend({
    ctor: function (options) {
        this.passLogic = options.passLogic;

        var styles = cleverapps.styles.ExpeditionPassHeader;

        this._super();
        this.setAnchorPoint2();
        this.setContentSize2(options.width, styles.height);

        var bg = new cleverapps.Spine(bundles["expeditionpass_" + cleverapps.skins.getSlot("skinName")].jsons.top_bg);
        bg.setAnimation(0, "animation", true);
        bg.setPositionRound(options.width / 2, this.height / 2);

        this.addChild(bg);

        var title = cleverapps.UI.generateOnlyText("ExpeditionPassWindow.header", cleverapps.styles.FONTS.EXPEDITIONS_PASS_TITLE_TEXT);
        title.setDimensions(styles.titleWidth, 0);
        title.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        title.setPositionRound(styles.title);
        this.addChild(title);

        var amount = this.amount = new PassProgressAmount(options);
        amount.setPositionRound(styles.amount);
        this.addChild(amount);
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    EXPEDITIONS_PASS_TITLE_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.ExpeditionPassHeader = {
    x: { align: "center" },
    y: { align: "top", dy: -20 },

    height: 222,

    titleWidth: 900,

    title: {
        x: { align: "center" },
        y: { align: "center", dy: 10 }
    },

    amount: {
        x: { align: "center" },
        y: { align: "center", dy: -85 }
    }
};
