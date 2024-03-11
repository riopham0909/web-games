/**
 * Created by razial on 03.11.2021
 */

var PassHeader = cc.Node.extend({
    ctor: function (options) {
        this._super();
        this.options = options;
        this.mission = options.passLogic.mission;
        var styles = cleverapps.styles.PassHeader;

        this.setAnchorPoint2();
        this.setContentSize2(options.width - 2 * styles.paddingX, styles.height);

        var bg;
        if (options.bg_json) {
            bg = new cleverapps.Spine(options.bg_json);
            bg.setAnimation(0, "animation", true);
            this.addChild(bg);
            bg.setPositionRound(this.width / 2, this.height / 2);

            var offer = cleverapps.offerManager.findOffer({ mission: this.mission.type });
            if (offer) {
                this.createPack(offer);
            }

            var decor = new cleverapps.Spine(options.decor_json);
            decor.setAnimation(0, "animation", true);
            this.addChild(decor);
            decor.setPositionRound(styles.decor);
        } else if (options.json) {
            var animation = new cleverapps.Spine(options.json);
            animation.setAnimation(0, "animation", true);
            animation.setPositionRound(this.width / 2, this.height / 2);
            this.addChild(animation);
        } else if (bundles.passheader.frames.details_background) {
            bg = cleverapps.UI.createScale9Sprite(bundles.passheader.frames.details_background, cleverapps.UI.Scale9Rect.TwoPixelXY);
            bg.setContentSize2(this.width, this.height);
            bg.setPositionRound(this.width / 2, this.height / 2);
            this.addChild(bg);
        }

        if (!this.mission.isCompleted()) {
            var timer = this.createTimer();
            timer.setPositionRound(styles.timer);
            this.addChild(timer);
        } else {
            var title = cleverapps.UI.generateOnlyText("PassWindow.finished", cleverapps.styles.FONTS.PASS_TITLE_TEXT);
            title.setPositionRound(styles.timer);
            this.addChild(title);
        }
        var amount = this.amonut = new PassProgressAmount(options);
        amount.setPositionRound(styles.amount);
        this.addChild(amount);
    },

    createPack: function (offer) {
        var styles = cleverapps.styles.PassHeader;
        var missionStyles = this.mission.type === Mission.TYPE_SALEPASS ? styles.salepass : undefined;

        var pack = new cleverapps.Spine(this.options.pack_json);
        pack.setAnimation(0, "animation", true);
        this.addChild(pack);
        pack.setPositionRound(styles.pack);

        var badge = new cc.Sprite(bundles.passheader.frames.badge_png);
        pack.addChild(badge);
        badge.setPositionRound(missionStyles && missionStyles.pack.badge || styles.pack.badge);

        var price = new TextWithIcon(offer.getPriceText());
        badge.addChild(price);
        price.fitTo(styles.pack.badge.text.width);
        price.setRotation(styles.pack.badge.text.rotation);
        price.setPositionRound(styles.pack.badge.text);
        var packOnClick = function () {
            new MissionOfferWindow(offer);
            this.options.close();
        }.bind(this);
        cleverapps.UI.onClick(pack, packOnClick);
        cleverapps.UI.onClick(badge, packOnClick);

        cleverapps.UI.applyHover(pack);
    },

    createTimer: function () {
        var styles = cleverapps.styles.PassHeader.timer;

        var items = [];

        if (!styles.tooltip) {
            var title = cleverapps.UI.generateOnlyText("PassWindow.timer", cleverapps.styles.FONTS.PASS_TITLE_TEXT);
            title.setDimensions(styles.title.width, 0);
            title.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            title.fitTo(undefined, styles.title.height);
            items.push(title);
        }

        var background = new cc.Scale9Sprite(bundles.passheader.frames.timer_substrate);
        background.setContentSize2(styles);

        if (styles.tooltip) {
            cleverapps.tooltipManager.create(background, {
                text: "PassWindow.timer",
                position: cleverapps.styles.UI.Tooltip.LOCATION.below
            });
        }

        var timeLeft = this.mission.getTimeLeft();
        if (timeLeft > 0) {
            timeLeft = new cleverapps.CountDown(timeLeft);
        }

        var countdown = new cleverapps.CountDownView(timeLeft, {
            font: cleverapps.styles.FONTS.PASS_TIMER_TEXT,
            background_content: background,
            icon: bundles.passheader.frames.timer_icon
        });
        countdown.fitTo(styles.countdown.width, 0);
        items.push(countdown);

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PASS_TITLE_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    PASS_TIMER_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.WHITE
    }
});

cleverapps.styles.PassHeader = {
    paddingX: 50,
    height: 200,

    timer: {
        tooltip: true,
        width: 250,
        height: 66,
        margin: 20,
        x: { align: "center" },
        y: { align: "center", dy: 22 },

        countdown: {
            width: 180
        },

        title: {
            width: 450,
            height: 60
        }
    },

    decor: {
        x: { align: "center", dx: -650 },
        y: { align: "center", dy: 0 }
    },

    pack: {
        x: { align: "right", dx: -30 },
        y: { align: "center", dy: 0 },

        badge: {
            x: { align: "right", dx: 141 },
            y: { align: "center", dy: 11 },
            text: {
                x: { align: "center", dx: 40 },
                y: { align: "center", dy: 7 },
                rotation: -17,

                width: 130
            }
        }
    },

    salepass: {
        pack: {
            badge: {
                x: { align: "right", dx: 181 },
                y: { align: "center", dy: -8 }
            }
        }
    },

    amount: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: -90 }
    }
};
