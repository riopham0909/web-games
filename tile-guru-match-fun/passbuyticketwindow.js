/**
 * Created by r4zi4l on 20.07.2021
 */

var PassBuyTicketWindow = Window.extend({
    onWindowLoaded: function (passLogic) {
        this.passLogic = passLogic;

        this._super({
            name: "PassBuyTicketWindow",
            title: "PassBuyTicketWindow.title",
            content: this.createContent(),
            closeButton: true,
            contentPadding: cleverapps.styles.PassBuyTicketWindow.contentPadding
        });
        this.createBadge();
    },

    createContent: function () {
        var styles = cleverapps.styles.PassBuyTicketWindow;

        var ticket = this.createTicket();

        var lowerMsg = Messages.get("PassBuyTicketWindow.lowerText");
        lowerMsg = cleverapps.splitHalfByWord(lowerMsg).join("\n");

        var lowerText = cleverapps.UI.generateOnlyText(lowerMsg, cleverapps.styles.FONTS.GOLDEN_TICKET_TEXT);
        lowerText.fitTo(styles.texts.width);
        lowerText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var rewards = this.createRewards();
        var buttons = this.createButtons();

        return new cleverapps.Layout([ticket, rewards, lowerText, buttons], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    },

    createTicket: function () {
        var styles = cleverapps.styles.PassBuyTicketWindow.ticket;
        var animationName = this.passLogic.mission.type === Mission.TYPE_SALEPASS ? "purchase_ticket_json" : "ticket_json";
        var ticket = new cleverapps.Spine(bundles.passbuyticket_window.jsons[animationName], 1.3);
        ticket.setPositionRound({ align: "center" }, { align: "center" });
        ticket.setAnimation(0, "animation", true);

        var container = new cc.Node();
        container.setAnchorPoint2();
        container.setContentSize2(styles);
        container.addChild(ticket);

        return container;
    },

    createRewards: function () {
        var styles = cleverapps.styles.PassBuyTicketWindow.rewards;

        var iconsBgs = this.passLogic.levels.map(function () {
            var background = new cc.Scale9Sprite(bundles.passbuyticket_window.frames.icon_background);
            background.setContentSize2(styles.background);
            return background;
        });

        var layout = new cleverapps.GridLayout(iconsBgs, {
            columns: iconsBgs.length >= 12 ? Math.ceil(iconsBgs.length / 3) : 5,
            margin: styles.margin,
            padding: styles.padding
        });

        iconsBgs.forEach(function (bg, ind) {
            var icon = PassRewardIcon.createIconsFromRewardsList(this.passLogic.levels[ind].premiumReward, this.passLogic.levels[ind].level, true)[0];
            icon.setPositionRound(bg.x + styles.icon.dx, bg.y + styles.icon.dy);
            cleverapps.UI.fitToBox(icon, styles.icon);
            layout.addChild(icon);

            if (icon.rewardName) {
                cleverapps.tooltipManager.create(icon, {
                    text: icon.rewardName,
                    position: cleverapps.styles.UI.Tooltip.LOCATION.below
                });
            }
        }, this);

        if (bundles.passbuyticket_window.frames.rewards_background_special) {
            var background = cleverapps.UI.createScale9Sprite(bundles.passbuyticket_window.frames.rewards_background_special, cleverapps.UI.Scale9Rect.TwoPixelXY);
            background.setContentSize2(layout.width, layout.height);
            background.setPositionRound(layout.width / 2, layout.height / 2);
            layout.addChild(background, -1);
        }

        return layout;
    },

    createButtons: function () {
        var styles = cleverapps.styles.PassBuyTicketWindow.buttons;

        var buyButton = new UseGoldButton({
            type: cleverapps.styles.UI.Button.Images.button_green,
            price: PassMissionLogic.GetPrice(this.passLogic.mission),
            onClicked: this.buyTicket.bind(this),
            eventName: cleverapps.EVENTS.SPENT.BATTLE_PASS,
            width: styles.width,
            height: styles.height
        });

        return buyButton;
    },

    createBadge: function () {
        var styles = cleverapps.styles.PassBuyTicketWindow;

        var badge = new TileBadge({
            type: "value",
            value: "200%",
            rotation: styles.badge.rotation
        });
        this.window.addChild(badge, 2);
        badge.setPositionRound(styles.badge);
    },

    buyTicket: function () {
        this.passLogic.setPremium();

        this.close();

        new RewardWindow({
            battlePass: {
                missionType: this.passLogic.mission.type
            }
        });
    },

    listBundles: function () {
        return ["passbuyticket_window"];
    },

    getPreferredBundles: function () {
        return ["passbuyticket_window"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    GOLDEN_TICKET_TEXT: {
        size: 40,
        color: new cc.Color(121, 75, 57, 255)
    }
});

cleverapps.styles.PassBuyTicketWindow = {
    margin: 40,
    padding: {
        x: 10,
        top: -20
    },

    texts: {
        width: 800
    },

    buttons: {
        width: 300,
        height: 110
    },

    ticket: {
        width: 180,
        height: 200,
        x: { align: "center" },
        y: { align: "center" }
    },

    badge: {
        rotation: -15,
        x: { align: "left", dx: -60 },
        y: { align: "top", dy: 50 }
    },

    rewards: {
        width: 1000,
        margin: {
            x: 10,
            y: 10
        },

        padding: {
            x: 25,
            top: 20,
            bottom: 30
        },

        background: {
            width: 120,
            height: 120
        },

        icon: {
            width: 100,
            height: 100,
            maxScale: 1,
            dx: 0,
            dy: 0
        }
    },

    contentPadding: {
        left: 50,
        right: 50
    }
};
