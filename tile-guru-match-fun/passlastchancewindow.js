/**
 * Created by r4zi4l on 28.05.2021
 */

var PassLastChanceWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.mission = mission;
        this.price = this.calcPrice();

        this._super({
            name: "battlepasslastchancewindow",
            title: "PassLastChanceWindow.title",
            content: this.createContent(),
            buttons: this.createButtons(),
            notCloseByTouchInShadow: true,
            closeButtonDelay: true
        });

        this.addOfferBadge();
    },

    createContent: function () {
        var styles = cleverapps.styles.PassLastChanceWindow;

        var upperText = cleverapps.UI.generateOnlyText(
            "PassLastChanceWindow.upperText",
            cleverapps.styles.FONTS.DARK_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT
        );
        upperText.setAnchorPoint2();
        upperText.setDimensions(styles.texts.width, 0);
        upperText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var rewards = this.createRewards();
        rewards.setLocalZOrder(1);

        var lowerText = cleverapps.UI.generateOnlyText(
            "PassLastChanceWindow.lowerText",
            cleverapps.styles.FONTS.DARK_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT
        );
        lowerText.setAnchorPoint2();
        lowerText.setDimensions(styles.texts.width, 0);
        lowerText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var content = new cleverapps.Layout([upperText, rewards, lowerText], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });

        return content;
    },

    createRewards: function () {
        var styles = cleverapps.styles.PassLastChanceWindow.rewards;
        var level = this.mission.logic.levels[this.mission.logic.shownProgress.level];

        var icons = PassRewardIcon.createIconsFromRewardsList(level.reward, level.level, false).map(function (icon) {
            return this.createReward(icon, false);
        }, this);

        if (this.mission.logic.hasPremium()) {
            icons.push.apply(icons, PassRewardIcon.createIconsFromRewardsList(level.premiumReward, level.level, true).map(function (icon) {
                return this.createReward(icon, true);
            }, this));
        }

        return new cleverapps.Layout(icons, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
    },

    addOfferBadge: function () {
        var styles = cleverapps.styles.PassLastChanceWindow;

        var badge = new TileBadge({
            text: Messages.get("PassLastChanceWindow.badgeText").replace(/ /g, "\n"),
            rotation: styles.offerBadge.rotation
        });
        badge.setPositionRound(this.mission.details && this.mission.details.premium ? styles.premiumOfferBadge : styles.offerBadge);
        this.window.addChild(badge);
    },

    createButtons: function () {
        var styles = cleverapps.styles.PassLastChanceWindow.buttons;

        var buyButton = new UseGoldButton({
            type: cleverapps.styles.UI.Button.Images.button_blue,
            price: this.price,
            onClicked: this.buyReward.bind(this),
            eventName: cleverapps.EVENTS.SPENT.LAST_CHANCE,
            width: styles.width,
            height: styles.height
        });

        return [buyButton];
    },

    createReward: function (icon, premium) {
        var styles = cleverapps.styles.PassLastChanceWindow.rewards;

        var background = cleverapps.UI.createScale9Sprite(bundles.passlastchance_window.frames.icon_background, cleverapps.UI.Scale9Rect.TwoPixelXY);
        background.setAnchorPoint2();
        background.setContentSize2(styles.background);

        icon.setScale(1.3);
        icon.setAnchorPoint2();
        icon.setPositionRound(styles.icon);
        background.addChild(icon);

        if (premium) {
            var ribbon = new cc.Sprite(bundles.passlastchance_window.frames.icon_ribbon);
            ribbon.setPositionRound(styles.ribbon);
            background.addChild(ribbon);

            var text = cleverapps.UI.generateOnlyText("PassRewardIcon.ribbonText", cleverapps.styles.FONTS.BP_LAST_CHANCE_RIBBON);
            text.setPositionRound(styles.text);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setDimensions(styles.text.width, 0);
            text.fitTo(undefined, styles.text.height);
            text.setRotation(styles.text.rotation);
            ribbon.addChild(text);

            var ticket = new cleverapps.Spine(this.mission.type === Mission.TYPE_SALEPASS ? bundles.passlastchance_window.jsons.purchase_ticket_json : bundles.passlastchance_window.jsons.ticket_json);
            ticket.setAnimation(0, "animation", true);
            ticket.setAnchorPoint2();
            ticket.setScale(styles.ticket.scale);
            ticket.setPositionRound(styles.ticket);
            background.addChild(ticket);
        }

        return background;
    },

    calcPrice: function () {
        return 100;
    },

    buyReward: function () {
        this.mission.logic.completeCurrentTask();
        this.close();
        var View = this.mission.view;
        new View(this.mission);
    },

    listBundles: function () {
        return ["passlastchance_window"];
    },

    getPreferredBundles: function () {
        return ["passlastchance_window"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BP_LAST_CHANCE_RIBBON: {
        size: 45,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.PassLastChanceWindow = {
    margin: 40,

    texts: {
        width: 800
    },

    buttons: {
        width: 300,
        height: 110
    },

    offerBadge: {
        x: { align: "right", dx: -190 },
        y: { align: "center", dy: 220 },
        rotation: 15
    },

    premiumOfferBadge: {
        x: { align: "right", dx: 0 },
        y: { align: "center", dy: 220 },
        rotation: 15
    },

    rewards: {
        margin: 30,

        background: {
            width: 416,
            height: 416
        },

        icon: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 10 }
        },

        ribbon: {
            x: { align: "left", dx: 1 },
            y: { align: "top", dy: 4 }
        },

        text: {
            x: { align: "center", dx: -26 },
            y: { align: "center", dy: 36 },
            width: 120,
            height: 74,
            rotation: -45
        },

        ticket: {
            x: { align: "right", dx: 109 },
            y: { align: "bottom", dy: -100 },
            scale: 1.3
        }
    }
};
