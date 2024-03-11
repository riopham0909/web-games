/**
 * Created by andrey on 25.08.2022.
 */

var PassTicket = cc.Node.extend({
    ctor: function (options) {
        this.premium = options.premium;
        this.passLogic = options.passLogic;
        this.closeWindowCallback = options.close;

        this._super();

        var styles = cleverapps.styles.PassTicket;

        this.setContentSize2(styles.width, styles.height);
        this.setAnchorPoint2();

        if (bundles.passtickets.frames.ticket_background) {
            var background = cleverapps.UI.createScale9Sprite(bundles.passtickets.frames.ticket_background, cleverapps.UI.Scale9Rect.TwoPixelXY);
            background.setContentSize2(styles.width, styles.height);
            background.setPositionRound(styles.width / 2, styles.height / 2);
            this.addChild(background);
        }

        if (bundles.passtickets.frames.order_rings) {
            styles.rings.forEach(function (position) {
                var ring = new cc.Sprite(bundles.passtickets.frames.order_rings);
                ring.setPositionRound(position);
                this.addChild(ring);
            }, this);
        }

        var titleSize = this.premium && styles.premium.text || styles.text;
        var title = cleverapps.UI.generateOnlyText(
            this.premium ? "PassWindow.ticket.hint" : "PassWindow.ticket.freeHint",
            this.premium ? cleverapps.styles.FONTS.PASS_TICKET_TEXT : cleverapps.styles.FONTS.PASS_TICKET_SMALL_TEXT
        );
        title.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        title.fitTo(titleSize.width, titleSize.height);
        var iconNode = new cc.Node();
        iconNode.setAnchorPoint2();
        iconNode.setContentSize2(this.premium && styles.premium.icon || styles.icon);
        var animationName = this.passLogic.mission.type === Mission.TYPE_SALEPASS ? "purchase_ticket_json" : "ticket_json";
        var icon = new cleverapps.Spine(bundles.passtickets.jsons[animationName]);
        icon.setAnimation(0, this.premium ? "animation" : "animation2", true);
        icon.setPositionRound(iconNode.width / 2, iconNode.height / 2);
        iconNode.addChild(icon);

        var buyTicketButton, checkmark;

        if (this.premium && !this.passLogic.hasPremium()) {
            buyTicketButton = this.createTicketButton();

            cleverapps.UI.onClick(iconNode, function () {
                if (this.passLogic.canBuyPremium()) {
                    new PassBuyTicketWindow(this.passLogic);
                }
            }.bind(this));
        } else {
            checkmark = new cc.Sprite(bundles.passtickets.frames.attention_png);
            if (styles.checkmark) {
                checkmark.setPositionRound(styles.checkmark);
                iconNode.addChild(checkmark);
            }
        }

        var items = [title, iconNode, buyTicketButton, checkmark];
        if (cleverapps.config.ui === "tropical") {
            items = [title, buyTicketButton, iconNode];
        }
        var itemsLayout = new cleverapps.Layout(items, {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL
        });
        itemsLayout.setPositionRound(styles.icon);
        this.addChild(itemsLayout);
    },

    createTicketButton: function () {
        var styles = cleverapps.styles.PassTicket.button;

        if (this.passLogic.hasPremium()) {
            return new cc.Sprite(bundles.passtickets.frames.attention_png);
        }

        return new UseGoldButton({
            type: cleverapps.styles.UI.Button.Images.small_button_green,
            price: PassMissionLogic.GetPrice(this.passLogic.mission),
            onClicked: this.buyTicket.bind(this),
            eventName: cleverapps.EVENTS.SPENT.BATTLE_PASS,
            disabled: !this.passLogic.canBuyPremium(),
            width: styles.width,
            height: styles.height
        });
    },

    buyTicket: function () {
        this.passLogic.setPremium();

        this.closeWindowCallback();

        // eslint-disable-next-line new-cap
        new this.passLogic.mission.view(this.passLogic.mission);
        new RewardWindow({
            battlePass: {
                missionType: this.passLogic.mission.type
            }
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PASS_TICKET_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    PASS_TICKET_SMALL_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }
});

cleverapps.styles.PassTicket = {
    width: 300,
    height: 624,
    margin: -50,

    text: {
        width: 210,
        height: 90
    },

    icon: {
        width: 160,
        height: 240,
        x: { align: "center" },
        y: { align: "center" }
    },

    premium: {
        icon: {
            width: 160,
            height: 220
        }
    },

    button: {
        width: 170,
        height: 60,
        scale: 1.2
    }
};
