/**
 * Created by vladislav on 07/04/2022
 */

var CaravanTileView = cc.Scale9Sprite.extend({
    ctor: function (product, cupData, callback) {
        this.product = product;
        this.callback = callback;

        this.cupData = cupData;
        this.units = Prizes.Generate([this.cupData], {
            listOnly: true
        });

        this._super(bundles.caravan.frames.tile_bg_png, cleverapps.UI.getScale9Rect(bundles.caravan.frames.tile_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY));

        var styles = cleverapps.styles.CaravanTileView;
        this.setContentSize(styles);

        this.title = this.createTitle();
        this.title.setLocalZOrder(1);
        this.addChild(this.title);
        this.title.setPositionRound(styles.title);

        this.grid = this.createGrid();
        this.grid.setOpacity(0);
        this.grid.setVisible(false);
        this.addChild(this.grid);
        this.grid.setPositionRound(styles.grid);

        this.unitsGrid = this.createUnitsGrid();
        this.unitsGrid.setOpacity(0);
        this.unitsGrid.setVisible(false);
        this.addChild(this.unitsGrid);
        this.unitsGrid.setPositionRound(styles.grid);

        this.amount = this.createAmount();
        this.amount.setOpacity(0);
        this.amount.setVisible(false);
        this.addChild(this.amount);
        this.amount.setPositionRound(styles.amount);

        this.person = new cc.Sprite(this.product.person);
        this.addChild(this.person);
        this.person.setPositionRound(styles.person);

        this.rewardsBlock = this.createRewardsBlock();
        this.addChild(this.rewardsBlock);
        this.rewardsBlock.setPositionRound(styles.rewardsBlock);

        this.helpButton = new cleverapps.UI.HelpButton(this.onHelpButtonClicked.bind(this));
        this.addChild(this.helpButton);
        this.helpButton.setPositionRound(styles.helpButton);

        if (product.value) {
            this.badge = new TileBadge({
                type: "value",
                value: product.value
            });
            this.badge.setScale(styles.badge.scale);
            this.addChild(this.badge);
            this.badge.setPositionRound(styles.badge);
        }

        var button = new UseGoldButton({
            price: this.product.price,
            eventName: cleverapps.EVENTS.SPENT.CARAVAN + this.product.order,
            width: styles.button.width,
            height: styles.button.height,
            filter: this.canBeBought.bind(this),
            onClicked: this.callback.bind(this)
        });
        this.addChild(button);
        button.setPositionRound(styles.button);

        this.onHelpButtonClicked(true);
    },

    canBeBought: function () {
        var units = cleverapps.toArray(this.product.reward.unit || this.product.reward.units || []);
        var slots = units.reduce(function (slots, unit) {
            return slots + (unit.amount === undefined ? 1 : unit.amount);
        }, 0);

        var slotsLacking = slots - Game.currentGame.map.countEmptySlots();
        if (slotsLacking > 0) {
            Game.currentGame.centerHint.createTextHint("Spawn.nospace", { left: slotsLacking });
            return false;
        }

        return true;
    },

    onHelpButtonClicked: function (silent) {
        this.isHelpShown = !this.isHelpShown;

        var styles = cleverapps.styles.CaravanTileView;

        this.helpButton.setType(
            this.isHelpShown
                ? {
                    button_png: bundles.caravan.frames.return_button_png,
                    button_on_png: bundles.caravan.frames.return_button_on_png
                }
                : {
                    button_png: bundles.buttons.frames.help_button_png,
                    button_on_png: bundles.buttons.frames.help_button_on_png
                }
        );

        var titlePosition = this.title.calculatePositionRound(this.isHelpShown ? styles.title.help : styles.title);
        this.title.stopAllActions();
        if (silent) {
            this.title.setPositionRound(titlePosition);
        } else {
            this.title.runAction(new cc.MoveTo(0.3, titlePosition));
        }

        var fadeInAction = function (node) {
            node.stopAllActions();

            if (silent) {
                node.setVisible(true);
                node.setOpacity(255);
                return;
            }

            node.runAction(new cc.Sequence(
                new cc.Show(),
                new cc.FadeIn(0.3)
            ));
        };

        var fadeOutAction = function (node) {
            node.stopAllActions();

            if (silent) {
                node.setOpacity(0);
                node.setVisible(false);
                return;
            }

            node.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.Hide()
            ));
        };

        if (this.isHelpShown) {
            [this.grid, this.unitsGrid, this.amount].forEach(fadeInAction);
            [this.rewardsBlock, this.person].forEach(fadeOutAction);

            if (this.badge) {
                this.badge.performRecursive(fadeOutAction);
            }
        } else {
            [this.rewardsBlock, this.person].forEach(fadeInAction);
            [this.grid, this.unitsGrid, this.amount].forEach(fadeOutAction);

            if (this.badge) {
                this.badge.performRecursive(fadeInAction);
            }
        }
    },

    createGrid: function () {
        var styles = cleverapps.styles.CaravanTileView.grid;

        this.slots = this.units.map(function () {
            var bg = new cc.Scale9Sprite(bundles.caravan.frames.inner_bg_png);
            bg.setContentSize(styles.unit.bg);
            return bg;
        });

        var grid = new cleverapps.GridLayout(this.slots, {
            columns: 3,
            margin: styles.margin
        });
        grid.setCascadeOpacityEnabledRecursively(true);
        return grid;
    },

    createUnitsGrid: function () {
        var styles = cleverapps.styles.CaravanTileView.grid;

        var unitsGrid = new cc.Node();
        unitsGrid.setAnchorPoint2();
        unitsGrid.setContentSize2(this.grid.getContentSize());
        unitsGrid.setCascadeOpacityEnabledRecursively(true);

        this.units.forEach(function (unit, index) {
            var unitImage = UnitView.getUnitImage({ code: unit.code, stage: unit.stage }, {
                preferStatic: true,
                alignAnchorX: true
            });
            cleverapps.UI.fitToBox(unitImage, {
                width: styles.unit.width,
                height: styles.unit.height,
                maxScale: 1.5
            });
            unitsGrid.addChild(unitImage);

            var slot = this.slots[index].getPosition();
            unitImage.setPositionRound(slot.x, slot.y);

            var probability = cleverapps.UI.generateOnlyText(Math.round(100 / 12) + "%", cleverapps.styles.FONTS.CARAVAN_PROBABILITY);
            probability.setLocalZOrder(1);
            unitsGrid.addChild(probability);
            probability.setPositionRound(slot.x + styles.probability.x, slot.y + styles.probability.y);
        }, this);

        return unitsGrid;
    },

    createTitle: function () {
        var styles = cleverapps.styles.CaravanTileView;

        var titleBg = new cc.Scale9Sprite(bundles.caravan.frames.title_bg_png);
        titleBg.setContentSize(styles.title.bg);

        var title = cleverapps.UI.generateOnlyText(this.product.title, cleverapps.styles.FONTS.WHITE_TEXT);
        title.fitTo(styles.title.text.width);
        titleBg.addChild(title);
        title.setPositionRound(styles.title.text);

        return titleBg;
    },

    createAmount: function () {
        var amount = cleverapps.UI.generateOnlyText("Caravan.ItemsAmount", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT, {
            amount: this.cupData.amount
        });
        amount.setCascadeOpacityEnabledRecursively(true);

        return amount;
    },

    createRewardsBlock: function () {
        var styles = cleverapps.styles.CaravanTileView.rewardsBlock;

        var bg = styles.withBg ? new cc.Scale9Sprite(bundles.caravan.frames.inner_bg_png) : new cc.Node();
        bg.setContentSize2(styles.bg);

        var icon = new cc.Sprite(this.product.icon);
        bg.addChild(icon);
        icon.setPositionRound(styles.icon);

        var plus = new cc.Sprite(bundles.caravan.frames.plus_png);
        bg.addChild(plus);
        plus.setPositionRound(styles.plus);

        var rewards = cleverapps.clone(this.product.reward);
        delete rewards.unit;

        var rewardsList = new RewardsListComponent(rewards, {
            columns: 1,
            small: true,
            textDirection: cleverapps.UI.HORIZONTAL,
            font: cleverapps.styles.FONTS.CARAVAN_REWARDS_BLOCK_TEXT,
            margin: {
                x: styles.margin,
                y: styles.margin
            },
            iconWrap: styles.iconWrap,
            textWrap: styles.textWrap
        });
        bg.addChild(rewardsList);
        rewardsList.setPositionRound(styles.rewards);
        bg.setCascadeOpacityEnabledRecursively(true);

        return bg;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CARAVAN_PROBABILITY: {
        size: 28,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    CARAVAN_REWARDS_BLOCK_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR
    }
});

cleverapps.styles.CaravanTileView = {
    width: 540,
    height: 940,

    amount: {
        x: { align: "center" },
        y: { align: "bottom", dy: 130 }
    },

    title: {
        x: { align: "center", dx: 7 },
        y: { align: "center", dy: -25 },

        help: {
            x: { align: "center", dx: 7 },
            y: { align: "center", dy: -245 }
        },

        bg: {
            width: 560,
            height: 126
        },

        text: {
            width: 400,

            x: { align: "center" },
            y: { align: "center", dy: 8 }
        }
    },

    button: {
        width: 300,
        height: 86,

        x: { align: "center" },
        y: { align: "bottom", dy: 30 }
    },

    grid: {
        x: { align: "center" },
        y: { align: "top", dy: -55 },

        margin: {
            x: 10,
            y: 6
        },

        probability: {
            x: 44,
            y: -50
        },

        unit: {
            width: 135,
            height: 135,

            bg: {
                width: 145,
                height: 145
            }
        }
    },

    rewardsBlock: {
        withBg: true,

        x: { align: "center" },
        y: { align: "bottom", dy: 130 },

        margin: 0,

        bg: {
            width: 447,
            height: 260
        },

        icon: {
            x: { align: "center", dx: -110 },
            y: { align: "center" }
        },

        plus: {
            x: { align: "center", dx: 15 },
            y: { align: "center" }
        },

        rewards: {
            x: { align: "right", dx: -10 },
            y: { align: "center" }
        },

        iconWrap: {
            width: 45,
            height: 65
        },

        textWrap: {
            width: 90,
            height: 65
        }
    },

    helpButton: {
        x: { align: "left", dx: -10 },
        y: { align: "top", dy: 10 }
    },

    badge: {
        x: { align: "right", dx: 13 },
        y: { align: "top", dy: 30 },
        scale: 0.7
    },

    person: {
        x: { align: "center" },
        y: { align: "bottom", dy: 475 }
    }
};