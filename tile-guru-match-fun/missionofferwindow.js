/**
 * Created by iamso on 31.08.2021
 */

var MissionOfferWindow = Window.extend({
    ctor: function (options) {
        this.offerType = options.type;
        this._super.apply(this, arguments);
    },

    onWindowLoaded: function (offer) {
        this.offer = offer;
        this.bundle = bundles[offer.bundle];
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        this.withCustomTitle = [Offers.TYPES.KRAKENFEAST, Offers.TYPES.BUILDPASS, Offers.TYPES.SALEPASS,
            Offers.TYPES.DRAGONIA, Offers.TYPES.DRAGONIA2, Offers.TYPES.DRAGONIA3, Offers.TYPES.UNDERSEA, Offers.TYPES.UNDERSEA2, Offers.TYPES.SNAILFEAST,
            Offers.TYPES.SNAILFEAST_DRAGONIA2, Offers.TYPES.SNAILFEAST_DRAGONIA3, Offers.TYPES.HALLOWEEN, Offers.TYPES.RAPUNZEL, Offers.TYPES.RAPUNZEL2,
            Offers.TYPES.XMAS, Offers.TYPES.EASTER, Offers.TYPES.PERIODIC_PACK, Offers.TYPES.CHINA].indexOf(this.offer.type) === -1;

        if (cleverapps.config.ui === "tropical" && [Offers.TYPES.LIVESFEAST, Offers.TYPES.SOFTFEAST].indexOf(this.offer.type) !== -1) {
            this.withCustomTitle = false;
        }

        var mission = cleverapps.missionManager.findRunningMission(offer.mission);
        if (mission) {
            mission.offerWindowShown = true;
        }

        this._super({
            name: "MissionOfferWindow",
            content: this.createContent(),
            noBackground: true,
            notCloseByTouchInShadow: true,
            closeButtonDelay: true,
            title: !this.withCustomTitle && "MissionOfferWindow." + this.offer.name + ".title",
            openSound: this.bundle.urls.offer_showup_effect
        });

        var title = this.title || this.windowTitle;
        title.setOpacity(0);
        title.runAction(new cc.Spawn(
            new cc.FadeIn(0.7),
            new cc.Sequence(
                new cc.ScaleTo(0.23, 1.1),
                new cc.ScaleTo(0.21, 1)
            ),
            new cc.Sequence(
                new cc.MoveBy(0.23, 0, styles.title.offsetY),
                new cc.MoveBy(0.21, 0, -styles.title.offsetY)
            )
        ));

        var hide = ["MenuBarCoinsItem", "MenuBarLivesItem"];
        var show = ["MenuBarGoldItem"];
        if (offer.reward.energy) {
            show.push(hide.pop());
        }
        cleverapps.meta.showControlsWhileFocused(show);
        cleverapps.meta.hideControlsWhileFocused(hide);

        this.offer.onBought = this.createListener(this.close.bind(this));
    },

    getPerson: function () {
        var person = cleverapps.styles.MissionOfferWindow[this.offerType].person;
        if (person) {
            person = PersonsLibrary.hasRole(person.role) ? person : {
                role: "worker",
                emotion: "happy"
            };
        }
        return person;
    },

    createContent: function () {
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        var content = this.content = new cc.Node();
        content.setAnchorPoint2();
        content.setContentSize2(styles.width, styles.height);

        this.createOffer();
        if (this.withCustomTitle) {
            this.createTitle();
        }
        this.createBuyButton();
        this.createFootnote();
        this.createBadges();

        return content;
    },

    createTitle: function () {
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        this.title = cleverapps.UI.generateOnlyText("MissionOfferWindow." + this.offer.name + ".title", styles.title.font);
        this.title.setPositionRound(styles.title);
        this.title.fitTo(styles.title.width);
        this.content.addChild(this.title, 1);
    },

    createOffer: function () {
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        var animation = new cleverapps.Spine(this.bundle.jsons.offer_json);
        if (this.offerType === Offers.TYPES.KRAKENFEAST && cleverapps.config.name === "mergecraft") {
            animation.setSkin("0");
        }
        animation.setAnimationAndIdleAfter("open", "idle");
        animation.setPositionRound(styles.offer);
        this.content.addChild(animation);

        for (var reward in this.offer.reward) {
            if (reward === "unit" && styles.rewards[reward]) {
                this.offer.reward[reward].forEach(function (unit) {
                    if (styles.rewards[reward][unit.code]) {
                        this.createReward(reward, unit);
                    }
                }, this);
            } else {
                this.createReward(reward, this.offer.reward[reward]);
            }
        }
    },

    createReward: function (type, value) {
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];
        var rewardsStyles = styles.rewards[type];
        if (!rewardsStyles) {
            return;
        }

        if (type === "worker") {
            value = value.title;
        }

        if (type === "unit") {
            rewardsStyles = rewardsStyles[value.code];
            value = value.pointsValue || value.amount || 1;
        }

        var msg = typeof value === "number" ? "x" + value : value;
        if (Messages.has("MissionOfferWindow." + this.offer.name + ".reward." + type)) {
            msg = Messages.get("MissionOfferWindow." + this.offer.name + ".reward." + type);
        }

        var text;
        if (cleverapps.UI.ImageFont.IsApplicable(styles.rewards.font, msg)) {
            text = cleverapps.UI.generateImageText(msg, styles.rewards.font);
        } else {
            text = cleverapps.UI.generateOnlyText(msg, styles.rewards.font);
        }
        text.setPositionRound(rewardsStyles);
        text.fitTo(rewardsStyles.width);
        text.setRotation(rewardsStyles.rotation);
        this.content.addChild(text);

        if (rewardsStyles.delay) {
            text.setOpacity(0);
            text.runAction(new cc.Sequence(
                new cc.DelayTime(rewardsStyles.delay),
                new cc.FadeIn(0.5)
            ));
        }
    },

    createBuyButton: function () {
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        var button = new cleverapps.UI.Button({
            text: this.offer.getPriceText(),
            width: styles.button.width,
            height: styles.button.height,
            onClicked: this.offer.buy.bind(this.offer)
        });

        button.performRecursive(function (node) {
            node.setCascadeOpacityEnabled(true);
        });

        button.setOpacity(0);
        button.setScale(0.3);
        button.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.Spawn(
                new cc.FadeIn(0.3),
                new cc.ScaleTo(0.3, 1).easing(cc.easeBackOut())
            )
        ));

        this.content.addChild(button);
        button.setPositionRound(styles.button);
    },

    createFootnote: function () {
        var txtCode = "MissionOfferWindow." + this.offer.name + ".footnote";
        if (!Messages.has(txtCode)) {
            return;
        }

        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        var note = cleverapps.UI.generateOnlyText(txtCode, cleverapps.styles.FONTS.WHITE_TEXT);
        note.setPositionRound(styles.footNote);
        note.setDimensions(styles.footNote.width, 0);
        note.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        note.fitTo(undefined, styles.footNote.height);
        this.content.addChild(note);

        note.setOpacity(0);
        note.runAction(new cc.Sequence(
            new cc.DelayTime(styles.footNote.delay),
            new cc.FadeIn(0.7)
        ));
    },

    createBadges: function () {
        var styles = cleverapps.styles.MissionOfferWindow[this.offerType];

        if (!styles.badges) {
            return;
        }

        for (var i = 0; i < styles.badges.length; i++) {
            var badgeStyle = styles.badges[i];
            var badge = new TileBadge({
                text: "MissionOfferWindow." + this.offer.name + ".badge" + (i + 1),
                rotation: badgeStyle.rotation,
                largeFont: badgeStyle.largeFont
            });
            badge.setPositionRound(badgeStyle);
            this.content.addChild(badge);
        }
    },

    chooseAnimation: function () {

    },

    listBundles: function (offer) {
        return [offer.bundle];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    MISSION_OFFER_ENERGY_TITLE: {
        size: 75,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.BROWN_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    MISSION_OFFER_DESCRIPTION: {
        size: 35,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    MISSION_OFFER_SOFT_TITLE: {
        size: 115,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.BROWN_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    MISSION_OFFER_REWARD: {
        name: "default",
        size: 80,
        color: cleverapps.styles.COLORS.COLOR_BROWN_2,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    MISSION_OFFER_REWARD2: {
        name: "default",
        size: 80,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    MISSION_OFFER_SALE_REWARD: {
        name: "default",
        size: 72,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    MISSION_OFFER_BADGE: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.MissionOfferWindowTemplate = {
    width: 800,
    height: 840,

    title: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 570 },
        width: 480,
        offsetY: 23,
        font: cleverapps.styles.FONTS.WINDOW_TITLE_TEXT,

        background: {
            x: { align: "center", dx: 10 },
            y: { align: "top", dy: 120 },
            scale: 1.3
        }
    },

    offer: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD
    },

    button: {
        width: 300,
        height: 125,
        x: { align: "center", dx: -5 },
        y: { align: "bottom", dy: -50 }
    },

    footNote: {
        delay: 2.5,
        width: 920,
        height: 85,
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -170 }
    }
};

cleverapps.styles.MissionOfferWindow = {};

cleverapps.styles.MissionOfferWindow[Offers.TYPES.LIVESFEAST] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1400,

    title: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 325 },
        width: 600,
        font: cleverapps.styles.FONTS.MISSION_OFFER_ENERGY_TITLE,
        background: undefined
    },

    person: {
        role: "seller",
        emotion: "idle"
    },

    rewards: {
        energy: {
            x: { align: "center", dx: -535 },
            y: { align: "center", dy: -195 },
            width: 170,
            rotation: -5
        },

        worker: {
            x: { align: "center", dx: 535 },
            y: { align: "center", dy: -195 },
            width: 170,
            rotation: 5
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.SOFTFEAST] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1400,

    title: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 325 },
        width: 600,
        font: cleverapps.styles.FONTS.MISSION_OFFER_SOFT_TITLE,
        background: undefined
    },

    person: {
        role: "seller",
        emotion: "idle"
    },

    rewards: {
        energy: {
            x: { align: "center", dx: -535 },
            y: { align: "center", dy: -195 },
            width: 170,
            rotation: -5
        },

        soft: {
            x: { align: "center", dx: 535 },
            y: { align: "center", dy: -195 },
            width: 170,
            rotation: 5
        }
    },

    button: {
        x: { align: "center", dx: -5 },
        y: { align: "bottom", dy: -95 }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.KRAKENFEAST] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    height: 740,

    button: {
        y: { align: "bottom", dy: -25 }
    },

    footNote: {
        y: { align: "bottom", dy: -140 }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.BUILDPASS] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    badges: [
        {
            x: { align: "left", dx: 66 },
            y: { align: "top", dy: -11 },
            width: 125,
            rotation: 10
        }
    ]

}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.SALEPASS] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    offer: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 210 }
    },
    badges: [
        {
            x: { align: "right", dx: -22 },
            y: { align: "top", dy: -58 },
            width: 125,
            rotation: 10
        }
    ],

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            bppointscrystal: {
                x: { align: "center", dx: -284 },
                y: { align: "center", dy: -262 },
                width: 250,
                font: cleverapps.styles.FONTS.MISSION_OFFER_SALE_REWARD,
                rotation: 0
            }
        },

        soft: {
            x: { align: "center", dx: 273 },
            y: { align: "center", dy: -262 },
            width: 250,
            font: cleverapps.styles.FONTS.MISSION_OFFER_SALE_REWARD,
            rotation: 0
        }
    },

    person: {
        role: "hunter",
        emotion: "happy"
    },

    button: {
        x: { align: "center", dx: -9 },
        y: { align: "bottom", dy: -60 }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.DRAGONIA] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    button: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -40 }
    },

    badges: [
        {
            x: { align: "center", dx: 613 },
            y: { align: "center", dy: -250 },
            width: 125
        }
    ],

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            dragonpack: {
                delay: 0.8,
                x: { align: "center", dx: -440 },
                y: { align: "center", dy: -370 },
                width: 240,
                rotation: 4
            }
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 440 },
            y: { align: "center", dy: -350 },
            width: 240,
            rotation: -2
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.DRAGONIA2] = cleverapps.styles.MissionOfferWindow[Offers.TYPES.DRAGONIA3] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    button: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -40 }
    },

    badges: [
        {
            x: { align: "center", dx: 613 },
            y: { align: "center", dy: -250 },
            width: 125
        }
    ],

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            dr2dragonpack: {
                delay: 0.8,
                x: { align: "center", dx: -440 },
                y: { align: "center", dy: -370 },
                width: 240,
                rotation: 4
            }
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 440 },
            y: { align: "center", dy: -350 },
            width: 240,
            rotation: -2
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.UNDERSEA] = cleverapps.styles.MissionOfferWindow[Offers.TYPES.UNDERSEA2] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1600,

    button: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -30 }
    },

    badges: false,

    offer: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 100 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            underseapack: {
                delay: 0.8,
                x: { align: "center", dx: -625 },
                y: { align: "center", dy: -315 },
                width: 240,
                rotation: 0
            },
            sea2pack: {
                delay: 0.8,
                x: { align: "center", dx: -625 },
                y: { align: "center", dy: -315 },
                width: 240,
                rotation: 0
            }
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 673 },
            y: { align: "center", dy: -315 },
            width: 240,
            rotation: 0
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.SNAILFEAST] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1600,

    button: {
        x: { align: "center" },
        y: { align: "bottom", dy: -50 }
    },

    badges: false,

    person: {
        role: "capitannemo"
    },

    offer: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 5 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            seasnailhouse: {
                delay: 0.8,
                x: { align: "center" },
                y: { align: "center", dy: -325 },
                width: 240,
                rotation: 0
            }
        }
    },

    footNote: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: -48 },
        height: 90
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.SNAILFEAST_DRAGONIA2] = cleverapps.styles.MissionOfferWindow[Offers.TYPES.SNAILFEAST_DRAGONIA3] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1600,

    button: {
        x: { align: "center" },
        y: { align: "bottom", dy: -50 }
    },

    badges: false,

    person: {
        role: "hero"
    },

    offer: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 5 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            drsnailhouse: {
                delay: 0.8,
                x: { align: "center" },
                y: { align: "center", dy: -325 },
                width: 240,
                rotation: 0
            }
        }
    },

    footNote: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: -48 },
        height: 90
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.HALLOWEEN] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1650,

    offer: {
        y: { align: "center", dy: 2 }
    },

    button: {
        x: { align: "center", dx: -197 },
        y: { align: "bottom", dy: -20 }
    },

    title: {
        y: { align: "center", dy: 460 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            hlpack: {
                delay: 0.8,
                x: { align: "center", dx: -604 },
                y: { align: "center", dy: -298 },
                width: 240,
                rotation: 0
            }
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 608 },
            y: { align: "center", dy: -298 },
            width: 240,
            rotation: 0
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.RAPUNZEL] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1650,

    offer: {
        y: { align: "center", dy: 25 }
    },

    button: {
        x: { align: "center" },
        y: { align: "bottom", dy: -50 },

        height: 115
    },

    title: {
        y: { align: "center", dy: 460 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        energy: {
            delay: 0.8,
            x: { align: "center", dx: -477 },
            y: { align: "center", dy: -365 },
            width: 240,
            rotation: 0
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 477 },
            y: { align: "center", dy: -365 },
            width: 240,
            rotation: 0
        }
    }
}, true);
cleverapps.styles.MissionOfferWindow[Offers.TYPES.RAPUNZEL2] = cleverapps.styles.MissionOfferWindow[Offers.TYPES.RAPUNZEL];

cleverapps.styles.MissionOfferWindow[Offers.TYPES.XMAS] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1650,

    offer: {
        y: { align: "center", dy: -70 }
    },

    button: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -20 }
    },

    title: {
        y: { align: "center", dy: 460 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        unit: {
            xmpack: {
                delay: 0.8,
                x: { align: "center", dx: -609 },
                y: { align: "center", dy: -268 },
                width: 240,
                rotation: 0
            }
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 621 },
            y: { align: "center", dy: -268 },
            width: 240,
            rotation: 0
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.PERIODIC_PACK] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1650,

    badges: [
        {
            x: { align: "right", dx: -324 },
            y: { align: "top", dy: 30 },
            rotation: 15,
            largeFont: true
        }
    ],

    button: {
        x: { align: "center", dx: 60 },
        y: { align: "bottom", dy: -140 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        hard: {
            x: { align: "center", dx: -228 },
            y: { align: "center", dy: -303 },
            width: 220,
            rotation: 0
        },

        soft: {
            x: { align: "center", dx: 340 },
            y: { align: "center", dy: -303 },
            width: 220,
            rotation: 0
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.EASTER] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    width: 1650,

    offer: {
        y: { align: "center", dy: 25 }
    },

    button: {
        x: { align: "center" },
        y: { align: "bottom", dy: -50 },

        height: 115
    },

    title: {
        y: { align: "center", dy: 460 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        energy: {
            delay: 0.8,
            x: { align: "center", dx: -477 },
            y: { align: "center", dy: -365 },
            width: 240,
            rotation: 0
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 477 },
            y: { align: "center", dy: -365 },
            width: 240,
            rotation: 0
        }
    }
}, true);

cleverapps.styles.MissionOfferWindow[Offers.TYPES.CHINA] = cleverapps.overrideStyles(cleverapps.styles.MissionOfferWindowTemplate, {
    button: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -40 }
    },

    rewards: {
        font: cleverapps.styles.FONTS.MISSION_OFFER_REWARD2,
        energy: {
            delay: 0.8,
            x: { align: "center", dx: -544 },
            y: { align: "center", dy: -395 },
            width: 240,
            rotation: 5
        },
        hard: {
            delay: 0.8,
            x: { align: "center", dx: 573 },
            y: { align: "center", dy: -372 },
            width: 240,
            rotation: -2
        }
    }
}, true);