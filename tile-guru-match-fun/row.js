/**
 * Created by slava on 8/8/18
 */

cleverapps.Row = cc.Scale9Sprite.extend({
    ctor: function (params, options) {
        this.options = options || {};

        this.cup = params.cup;
        this.player = !!params.player;
        this.leader = !!params.leader;
        this.notInTop = params.notInTop;
        this.clickableArea = params.clickableArea;
        this.currentPlace = params.place;

        var bgImage;
        if (this.player) {
            bgImage = this.options.row_you_png || bundles.table.frames.row_you_png;
        } else {
            bgImage = this.options.row_player_png || bundles.table.frames.row_player_png;
        }

        this._super(bgImage);

        var styles = cleverapps.styles.Row;

        var rowWidth = this.options.rowWidth;
        var rowHeight = this.options.rowHeight;
        this.setContentSize2(rowWidth || styles.width, rowHeight || styles.height);

        var items = [];

        this.placeNode = this.createPlace(params.place);
        items.push(this.placeNode);

        if (params.emblem) {
            items.push(this.createEmblem(params.emblem));
        } else {
            items.push(this.createAvatar(params.avatar));
        }

        var nameIndex = items.length;

        if (this.options.prizes !== false) {
            this.prizeNode = this.createPrize(params.place);
            items.push(this.prizeNode);
        }

        items.push(this.createData(params));

        if (this.options.buttonData) {
            items.push(this.createButton(this.options.buttonData));
        }

        var width = items.reduce(function (width, item) {
            return width + item.width * item.scaleX + styles.content.margin;
        }, 0);

        var textWidth = this.width - width - 2 * styles.paddingX;
        var name = this.createName(params.text, params.id, textWidth);
        items.splice(nameIndex, 0, name);

        this.content = new cleverapps.Layout(items, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.content.margin
        });
        this.addChild(this.content);
        this.content.setPositionRound(styles.content);
    },

    createPlace: function (place) {
        var styles = cleverapps.styles.Row;

        var placeNode = new cc.Node();
        placeNode.setAnchorPoint2();

        var content;
        var badgeIcon = bundles.table.frames["badge_" + place];
        if (this.options.badges !== false && badgeIcon) {
            content = new cc.Sprite(badgeIcon);
        } else {
            content = this.createPlaceText(place);
        }

        placeNode.setContentSize2(this.options.badges !== false ? styles.place.withBadge.width : styles.place.width, styles.content.height);

        placeNode.addChild(content);
        content.setPositionRound(placeNode.width / 2, placeNode.height / 2);

        return placeNode;
    },

    createPlaceText: function (place) {
        var font = this.player ? cleverapps.styles.FONTS.ROW_PLAYER_TEXT : cleverapps.styles.FONTS.ROW_TEXT;
        var text = place;
        if (this.notInTop) {
            text = "-";
        }
        return cleverapps.UI.generateImageText(text, font);
    },

    createAvatar: function (options) {
        var styles = cleverapps.styles.Row;

        var avatar = new cleverapps.UI.Avatar(options);
        cleverapps.UI.fitToBox(avatar, {
            height: styles.content.height
        });
        return avatar;
    },

    createEmblem: function (emblem) {
        var styles = cleverapps.styles.Row;

        var icon = new cc.Sprite(bundles.tablerow_icons.frames["emblem_" + emblem]);
        cleverapps.UI.fitToBox(icon, {
            height: styles.emblem.height
        });
        return icon;
    },

    createName: function (name, id, width) {
        var styles = cleverapps.styles.Row;

        var nameNode = new cc.Node();
        nameNode.setAnchorPoint2();
        nameNode.setContentSize2(width, styles.content.height);

        var textString = name || "";
        if (!textString && typeof id === "string") {
            textString = "Player_" + id.substr(-3);
        }
        textString = cleverapps.UI.cutPlayerName(textString, this.getMaxTextLength());

        var font = this.player ? cleverapps.styles.FONTS.ROW_PLAYER_TEXT : cleverapps.styles.FONTS.ROW_TEXT;

        var text = cleverapps.UI.generateOnlyText(textString, font);
        text.fitTo(width, styles.name.height);

        nameNode.addChild(text);
        text.setPositionRound(styles.name);

        return nameNode;
    },

    createPrize: function (place) {
        var styles = cleverapps.styles.Row;

        var prizeNode = new cc.Node();
        prizeNode.setAnchorPoint2();
        prizeNode.setContentSize2(styles.prize.width, styles.content.height);

        var prize = this.createPrizeIcon(place);
        if (prize) {
            cleverapps.UI.fitToBox(prize, {
                height: styles.content.height
            });
            prizeNode.addChild(prize);
            prize.setPositionRound(prizeNode.width / 2, prizeNode.height / 2);

            this.addPrizeBannerTooltip(prizeNode);
        }

        return prizeNode;
    },

    createPrizeIcon: function (place) {
        var iconsAmount = cleverapps.config.type === "merge" ? 3 : 5;
        if (place <= iconsAmount) {
            return new cc.Sprite(bundles.table.frames["prize_" + place]);
        }
    },

    addPrizeBannerTooltip: function (target) {
        var text = this.getPrizeTooltipText();
        var styles = cleverapps.styles.Row.tooltip;

        var position = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? styles.mobilePosition : styles.position;
        if (!position) {
            position = cleverapps.styles.UI.Tooltip.LOCATION.above;
        }

        cleverapps.tooltipManager.create(target, {
            rewards: this.getRewards(),
            text: text,
            position: position,
            clickableArea: this.clickableArea
        });
    },

    getPrizeTooltipText: function () {
        return Messages.get("PrizeTooltip");
    },

    getRewards: function () {
        return undefined;
    },

    createData: function (params) {
        var styles = cleverapps.styles.Row;

        var image = this.player ? bundles.table.frames.amount_bg_you_png : bundles.table.frames.amount_bg_png;

        var content = this.createDataContent(params);

        var dataBg = new cc.Scale9Sprite(image);
        dataBg.setContentSize2(content.width + 2 * styles.data.paddingX, styles.data.bg.height);

        if (this.getTooltipText()) {
            cleverapps.tooltipManager.create(dataBg, {
                text: this.getTooltipText(),
                position: cleverapps.styles.UI.Tooltip.LOCATION.below,
                clickableArea: this.clickableArea
            });
        }

        dataBg.addChild(content);
        content.setPositionRound(styles.data.content);
        dataBg.y = styles.data.offsetY;

        this.updateAmount(params.amount, true);

        return dataBg;
    },

    createDataContent: function (params) {
        var styles = cleverapps.styles.Row.data;

        var items = [];
        var icon = params.dataIcon || this.options.dataIcon;
        if (icon) {
            var dataIcon = new cc.Sprite(icon);
            if (styles.icon.rotation) {
                dataIcon.setRotation(styles.icon.rotation);
            }
            items.push(dataIcon);
        }

        this.dataTextWidth = icon ? styles.text.width : styles.text.withoutIcon.width;
        this.dataTextHeight = styles.text.height;

        this.dataAmount = cleverapps.UI.generateImageText("222", cleverapps.styles.FONTS.ROW_DATA_TEXT);
        this.dataAmount.fitTo(this.dataTextWidth, this.dataTextHeight);

        items.push(this.dataAmount);

        return new cleverapps.Layout(items, {
            margin: styles.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
    },

    createButton: function (data) {
        var styles = cleverapps.styles.Row;

        return new cleverapps.UI.Button({
            type: styles.button.type,
            text: data.text,
            width: styles.button.width,
            height: styles.button.height,
            disabled: data.disabled,
            onClicked: data.action
        });
    },

    updateParams: function (params) {
        this.notInTop = params.notInTop;
    },

    getTooltipText: function () {
        return Messages.get("ResultTooltip");
    },

    updatePlace: function (place, silent) {
        if (this.currentPlace !== place) {
            this.currentPlace = place;
            this.refreshPlace(this.currentPlace, silent);
            this.refreshPrize(this.currentPlace, silent);
        }
    },

    updateAmount: function (amount, silent) {
        if (this.dataAmount && this.currentAmount !== amount) {
            this.currentAmount = amount;
            this.dataAmount.stopAllActions();
            this.dataAmount.setString(this.currentAmount);
            this.dataAmount.fitTo(this.dataTextWidth, this.dataTextHeight);
            if (!silent) {
                this.dataAmount.runAction(new cc.Sequence(
                    new cc.ScaleTo(0.2, 1.5),
                    new cc.ScaleTo(0.2, 1)
                ));
            }
        }
    },

    refreshPrize: function (place) {
        if (!this.prizeNode) {
            return;
        }

        var position = this.prizeNode.getPosition();
        this.prizeNode.removeFromParent(true);

        this.prizeNode = this.createPrize(place);
        this.prizeNode.setPositionRound(position);
        this.content.addChild(this.prizeNode);
    },

    refreshPlace: function (place) {
        var position = this.placeNode.getPosition();

        this.placeNode.removeFromParent(true);

        this.placeNode = this.createPlace(place);
        this.content.addChild(this.placeNode);
        this.placeNode.setPositionRound(position);
    },

    getMaxTextLength: function () {
        return 12;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    ROW_DATA_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },
    ROW_PLAYER_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },
    ROW_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.Row = {
    width: 700,
    height: 82,

    paddingX: 15,

    content: {
        height: 62,
        margin: 10,
        x: { align: "center" },
        y: { align: "center" }
    },

    place: {
        withBadge: {
            width: 100
        },

        width: 50
    },

    avatar: {
        scale: 0.6
    },

    emblem: {
        height: 100
    },

    name: {
        height: 50,

        x: { align: "center" },
        y: { align: "center", dy: -3 }
    },

    prize: {
        width: 80
    },

    data: {
        paddingX: 10,

        offsetY: 0,

        bg: {
            height: 60
        },

        margin: 7,

        content: {
            x: { align: "center" },
            y: { align: "center", dy: 2 }
        },

        icon: {
            rotation: -10
        },

        text: {
            withoutIcon: {
                width: 100
            },

            width: 65,
            height: 50
        }
    },

    button: {
        width: 196,
        height: 75,
        type: cleverapps.styles.UI.Button.Images.button_green
    },

    tooltip: {
        position: undefined,
        mobilePosition: undefined
    }
};