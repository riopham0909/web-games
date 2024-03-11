/**
 * Created by vladislav on 20.09.2019
 */

var LotteryIcon = cc.Sprite.extend({
    ctor: function (parent, position, isExpensive) {
        this._super();

        var styles = this.styles = cleverapps.styles.LotteryIcon;

        var lottery = cleverapps.eventManager.getFeatureEvent("lottery");

        var isOk = cleverapps.platform.oneOf(MobileOK, OKPlatform) && lottery.options.okLottery !== false;
        var isOk10k = isOk && lottery.options.lottery10k && isExpensive;
        var isVk = cleverapps.platform.oneOf(VKPlatform, MobileVk) && lottery.options.vkSaleDay;

        if (isOk) {
            styles = cleverapps.overrideStyles(styles, cleverapps.styles.OkLotteryIcon, true);
        } else if (isVk) {
            styles = this.styles = cleverapps.overrideStyles(styles, cleverapps.styles.VkLotteryIcon, true);
        }

        var image;
        if (isVk) {
            image = bundles.lottery.frames.vk_lottery;
            styles = cleverapps.overrideStyles(styles, cleverapps.styles.VkLotteryIcon, true);
        } else if (isOk) {
            if (isOk10k) {
                image = bundles.lottery.frames.ok_lottery_10k;
            } else {
                image = bundles.lottery.frames.ok_lottery;
            }
            styles = cleverapps.overrideStyles(styles, cleverapps.styles.OkLotteryIcon, true);
        } else {
            image = bundles.lottery.frames["lottery_" + cleverapps.settings.language] || bundles.lottery.frames.lottery_en;
        }

        this._super(image);
        parent.addChild(this);

        position = position || "bottom";
        this.setScale(styles.positions[position].scale || styles.scale || 1.0);
        this.baseScale = this.scale;

        this.setPositionRound(styles.positions[position]);
        if (styles.anchor) {
            this.setAnchorPoint2(styles.anchor.x, styles.anchor.y);
        }
    }
});

cleverapps.styles.VkLotteryIcon = {
    anchor: { x: 1, y: 1 },
    positions: {
        bottom: {
            x: { align: "left", dx: -22 },
            y: { align: "top", dy: 45 }
        },
        menu: {
            x: { align: "left", dx: 15 },
            y: { align: "bottom", dy: -20 }
        },
        icon: {
            x: { align: "center", dx: -54 },
            y: { align: "bottom", dy: -6 }
        },
        iconTimer: {
            x: { align: "left", dx: -24 },
            y: { align: "bottom", dy: 28 }
        }
    }
};

cleverapps.styles.OkLotteryIcon = {

};

cleverapps.styles.LotteryIcon = {
    positions: {
        menu: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -70 }
        },
        bottom: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -70 }
        },
        top: {
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 55 }
        },
        icon: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -20 }
        },
        iconTimer: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -20 }
        },
        icon_top: {
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 0 }
        },
        bottom_right: {
            x: { align: "right", dx: 30 },
            y: { align: "bottom", dy: -70 }
        }
    }
};
