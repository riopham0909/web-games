/**
 * Created by Oleg on 19/12/18
 */

var SubscriptionWindow = Window.extend({
    onWindowLoaded: function () {
        this.weekProduct = Product.Create("subsWeek");
        this.monthProduct = Product.Create("subsMonth");

        if (cleverapps.platform.oneOf(Microsoft) && cleverapps.config.debugMode) {
            this.weekProduct = Product.Create("subsWeekTest");
            this.monthProduct = Product.Create("subsMonthTest");
        }

        this._super({
            name: "SubscriptionWindow",
            content: this.createContent(),
            noBackground: true,
            title: "SubscriptionWindow.Title",
            notCloseByTouchInShadow: true,
            closeButtonDelay: true
        });

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SUBSCRIPTION_WINDOW_OPEN);

        Lottery.addText(this);
    },

    getPerson: function () {
        return cleverapps.config.type !== "merge" && {
            role: "hero",
            emotion: "happy"
        };
    },

    buySubscription: function (product) {
        cleverapps.subscription.buy(product, this.createListener(function () {
            this.close();
        }.bind(this)));
    },

    createContent: function () {
        var styles = cleverapps.styles.SubscriptionWindow;
        var prizesView = this.prizesView = this.createRewardsList();

        var layoutItems = [];
        layoutItems.unshift(this.createFooter());

        layoutItems.unshift(new SubscriptionButtons({
            monthProduct: this.monthProduct,
            weekProduct: this.weekProduct,
            buySubscription: this.buySubscription.bind(this)
        }));

        layoutItems.unshift(new SubscriptionInfo());
        layoutItems.unshift(prizesView);

        var subtitle = cleverapps.UI.generateOnlyText("SubscriptionRewardsList.subtitle", cleverapps.styles.FONTS.SUBSCRIPTION_PRIZE_SUBTITLE);
        subtitle.fitTo(styles.subtitle.width, styles.subtitle.height);
        layoutItems.unshift(subtitle);

        return new cleverapps.Layout(layoutItems, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    },

    createFooter: function () {
        var terms = new Terms();
        var styles = cleverapps.styles.SubscriptionWindow;

        if (terms.width > 0.9 * styles.width) {
            terms.setScale(styles.width * 0.9 / terms.width);
        }

        if (!cleverapps.subscription.isActive() && cleverapps.platform.oneOf(IOS, MacOS)) {
            var restore = new Restore(this);
            restore.setScale(terms.getScale());
        }

        return new cleverapps.Layout([terms, restore], {
            direction: cleverapps.UI.VERTICAL
        });
    },

    onShow: function () {
        this._super();
        if (this.prizesView.showUp) {
            this.prizesView.showUp();
        }
    },

    createRewardsList: function () {
        var styles = cleverapps.overrideStyles(cleverapps.styles.RewardWindow.rewards, cleverapps.styles.SubscriptionWindow.rewards, true);
        return new RewardsListComponent(Subscription.CalcReward(), {
            font: cleverapps.styles.FONTS.REWARDWINDOW_VALUE_TEXT,
            iconWrap: styles.iconWrap,
            margin: styles.margin,
            textMargin: styles.textMargin
        });
    },

    getPreferredBundles: function () {
        return ["game"];
    }
});

cleverapps.overrideStyles(cleverapps.styles.DECORATORS, {
    SUBSCRIPTION_WINDOW_GOLD_OFFER_STROKE: {
        color: new cc.Color(46, 83, 26, 255),
        size: 2
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    SUBSCRIPTION_PRIZE_SUBTITLE: {
        size: 48,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.SubscriptionWindow = {
    width: 600,
    margin: 15,
    padding: {
        top: 20
    },

    rewards: {
        margin: {
            y: 20
        },
        textMargin: -10
    },

    subtitle: {
        width: 600,
        height: 70
    }
};
