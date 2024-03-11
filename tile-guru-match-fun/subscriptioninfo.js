/**
 * Created by Oleg on 28.02.2020.
 */

var SubscriptionInfo = cleverapps.Layout.extend({
    ctor: function () {
        var styles = cleverapps.styles.SubscriptionInfo;
        var content = cleverapps.UI.generateOnlyText("SubscriptionWindow.MainText", cleverapps.styles.FONTS.SUBSCRIPTION_MAIN_TEXT);
        content.setDimensions(cleverapps.styles.SubscriptionWindow.width, 0);
        content.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        if (cleverapps.clans && Clans.IsAvailable()) {
            var icon = new cc.Sprite(bundles.reward_icons.frames.clan_gift_png);

            var gift = new TextWithIcon("** ClanGift.Text", {
                font: cleverapps.styles.FONTS.SUBSCRIPTION_MAIN_TEXT,
                icons: {
                    "**": icon
                },
                iconMaxHeight: 2
            });
        }

        this._super([content, gift].filter(Boolean), {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    }
});

cleverapps.styles.SubscriptionInfo = {
    margin: 15,
    padding: {
        x: 0,
        y: 10
    }
};