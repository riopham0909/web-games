/**
 * Created by vladislav on 16.09.2019
 */

var Lottery = {
    isActive: function () {
        return cleverapps.eventManager.isActive("lottery") && !cleverapps.flags.videoAdsMainMonetization;
    },

    addIcon: function (parent, position, isExpensive) {
        if (this.isActive()) {
            var icon = parent.lotteryIcon = new LotteryIcon(parent, position, isExpensive);

            icon.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.DelayTime(3.0),
                    new cc.RotateTo(0.2, 10),
                    new cc.RotateTo(0.2, -10),
                    new cc.RotateTo(0.2, 10),
                    new cc.RotateTo(0.2, -10),
                    new cc.RotateTo(0.2, 0)
                )
            ));
        }
    },

    addText: function (parent) {
        if (this.isActive()) {
            var styles = cleverapps.styles.Lottery;

            var msg = "Lottery.info";
            var lottery = cleverapps.eventManager.getFeatureEvent("lottery");
            if (cleverapps.platform.oneOf(MobileVk, VKPlatform) && lottery.options.vkSaleDay) {
                msg = "Lottery.infoSaleDay";
            }
            var text = cleverapps.UI.generateTTFText(msg, styles.text.font);
            parent.addChild(text);
            text.setPositionRound(styles.text);
            text.fitTo(parent.width);
        }
    }
};

cleverapps.styles.Lottery = {
    text: {
        font: cleverapps.styles.FONTS.SMALL_WHITE_TEXT,
        x: { align: "center" },
        y: { align: "bottom", dy: 5 }
    }
};
