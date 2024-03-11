/**
 * Created by vladislav on 09.08.2022
 */

var ExpeditionPageView = cc.Scale9Sprite.extend({
    ctor: function (page) {
        this.page = page;

        var styles = cleverapps.styles.ExpeditionPageView;

        this._super(bundles.travel_book.frames.bg_png);

        this.setContentSize2(styles);

        this.createImage();

        this.createTitle();

        if (this.page.isCurrent()) {
            this.createCurrentText();
        } else {
            this.createButton();
        }

        if (this.page.isActive() && !this.page.isMain() && this.page.getTimeLeft()) {
            this.createTimer();
        }

        if (this.page.message) {
            this.createMessage();
        }

        if (this.page.isActive() && !this.page.isCurrent()) {
            cleverapps.UI.onClick(this, this.gotoExpedition.bind(this), {
                ignoreScale: true
            });
        }
    },

    createImage: function () {
        var styles = cleverapps.styles.ExpeditionPageView;

        var image = new cc.Sprite(bundles.travel_book.frames[this.page.id + "_png"]);
        this.addChild(image);
        image.setPositionRound(styles.image);

        if (this.page.isUpcoming()) {
            image.setColor(new cc.Color(130, 130, 130, 255));
        }
    },

    createTitle: function () {
        var styles = cleverapps.styles.ExpeditionPageView;

        if (bundles.travel_book.frames.title_bg_png) {
            var titleBg = new cc.Scale9Sprite(bundles.travel_book.frames.title_bg_png);
            titleBg.setContentSize2(styles.title.bg);
            this.addChild(titleBg);
            titleBg.setPositionRound(styles.title.bg);
        }

        var title = cleverapps.UI.generateOnlyText(this.page.title, cleverapps.styles.FONTS.TRAVEL_BOOK_TITLE_TEXT);
        title.fitTo(styles.title.width);
        this.addChild(title);
        title.setPositionRound(styles.title);
    },

    createCurrentText: function () {
        var styles = cleverapps.styles.ExpeditionPageView;

        var text = cleverapps.UI.generateOnlyText("TravelBook.current", cleverapps.styles.FONTS.TRAVEL_BOOK_BOTTOM_TEXT);
        text.fitTo(styles.current.text.width);

        var checkmark = new cc.Sprite(bundles.travel_book.frames.mark_png);

        var layout = new cleverapps.Layout([text, checkmark], {
            margin: styles.current.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
        this.addChild(layout);
        layout.setPositionRound(styles.current);
    },

    createTimer: function () {
        var styles = cleverapps.styles.ExpeditionPageView;

        var timeLeft = this.page.getTimeLeft();
        var timer = new Timer(timeLeft, function () {}, {
            width: styles.timer.width
        });
        this.addChild(timer);
        timer.setPositionRound(styles.timer);
    },

    createButton: function () {
        var styles = cleverapps.styles.ExpeditionPageView;

        var button = this.button = new cleverapps.UI.Button({
            text: this.page.getButtonMsg(),
            onClicked: this.gotoExpedition.bind(this),
            width: styles.button.width,
            height: styles.button.height,
            mark: this.page.attention
        });
        this.addChild(button);
        button.setPositionRound(styles.button);

        if (this.page.isUpcoming()) {
            button.disable();

            cleverapps.tooltipManager.create(button, {
                text: this.page.getTooltipMsg(),
                position: cleverapps.styles.UI.Tooltip.LOCATION.above
            });
        }

        if (cleverapps.travelBook.isChosenForForce(this.page)) {
            this.showHint();
        }
    },

    showHint: function () {
        FingerView.hintClick(this.button);
    },

    createMessage: function () {
        var styles = cleverapps.styles.ExpeditionPageView;

        var bgImage = bundles.travel_book.frames.key_text_bg_png;
        if (!this.page.message.icon && bundles.travel_book.frames.key_text_bg_no_icon_png) {
            bgImage = bundles.travel_book.frames.key_text_bg_no_icon_png;
        }

        var textBg = new cc.Scale9Sprite(bgImage);
        textBg.setContentSize2(this.page.message.icon ? styles.message.width : styles.message.noIcon.width, styles.message.height);

        var text = cleverapps.UI.generateOnlyText(
            this.page.message.text,
            cleverapps.styles.FONTS.TRAVEL_BOOK_MESSAGE_TEXT
        );
        textBg.addChild(text);
        text.setPositionRound(
            this.page.message.icon ? styles.message.text.x : styles.message.text.noIcon.x,
            styles.message.text.y
        );
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.message.text.width, 0);
        text.fitTo(undefined, styles.message.text.height);

        if (this.page.message.icon) {
            var iconBg = new cc.Sprite(bundles.travel_book.frames.key_icon_bg_png);

            var icon = new cc.Sprite(this.page.message.icon);
            cleverapps.UI.fitToBox(icon, styles.message.icon);
            iconBg.addChild(icon);
            icon.setPositionRound(styles.message.icon);

            textBg.addChild(iconBg);
            iconBg.setPositionRound(styles.message.iconBg);
        }

        this.addChild(textBg);
        textBg.setPositionRound(
            this.page.message.icon ? styles.message.x : styles.message.noIcon.x,
            styles.message.y
        );
    },

    gotoExpedition: function () {
        cleverapps.meta.distract({
            focus: "TravelBook.gotoExpedition",
            action: function (f) {
                this.page.gotoExpedition(f);
            }.bind(this)
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TRAVEL_BOOK_BOTTOM_TEXT: {
        name: "default",
        size: 35,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    TRAVEL_BOOK_TITLE_TEXT: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    TRAVEL_BOOK_MESSAGE_TEXT: {
        name: "default",
        size: 30,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.ExpeditionPageView = {
    width: 380,
    height: 630,

    message: {
        noIcon: {
            x: { align: "center" },

            width: 300
        },

        x: { align: "center", dx: 28 },
        y: { align: "top", dy: -100 },

        text: {
            width: 210,
            height: 75,

            noIcon: {
                x: { align: "center" }
            },

            x: { align: "center", dx: 10 },
            y: { align: "center", dy: 2 }
        },

        width: 270,
        height: 86,

        icon: {
            width: 80,
            height: 80,

            x: { align: "center" },
            y: { align: "center" }
        },

        iconBg: {
            x: { align: "left", dx: -50 },
            y: { align: "center" }
        }
    },

    image: {
        x: { align: "center" },
        y: { align: "center", dy: 20 }
    },

    title: {
        x: { align: "center" },
        y: { align: "top", dy: -45, anchor: "center" },

        width: 340
    },

    current: {
        margin: 10,

        x: { align: "center" },
        y: { align: "bottom", dy: 35 },

        text: {
            width: 250
        }
    },

    timer: {
        margin: 10,

        width: 200,

        x: { align: "center" },
        y: { align: "bottom", dy: 140 }
    },

    button: {
        width: 300,
        height: 90,

        x: { align: "center" },
        y: { align: "bottom", dy: 23 }
    }
};
