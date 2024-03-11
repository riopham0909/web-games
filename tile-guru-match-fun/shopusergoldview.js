/**
 * Created by iamso on 28.08.2019.
 */

var ShopUserGoldView = MinimalDialogue.extend({
    ctor: function () {
        this._super({
            items: this.listItems()
        });

        var scene = cleverapps.scenes.getRunningScene();
        scene.addChild(this);
        this.display();
        this.setPositionRound(cleverapps.styles.ShopUserGoldView);
    },

    listItems: function () {
        var textItems = [this.createGoldBlock()];

        var boosters = ShopUserGoldView.ListBoosters();
        if (boosters.length > 0) {
            textItems.push(this.createBoostersBlock(boosters));
        }

        return textItems;
    },

    createGoldBlock: function () {
        var text = cleverapps.UI.generateOnlyText("YouHaveAmount", cleverapps.styles.FONTS.SHOP_USER_GOLD_TEXT);

        if (cleverapps.config.type !== "match3" || !cleverapps.environment.isGameScene()) {
            return text;
        }

        var styles = cleverapps.styles.ShopUserGoldView;

        var goldItem = this.createItem(levels.user.gold, RewardTypes.hard.smallIcon, styles.items.gold);

        var goldBlock = new cleverapps.Layout([text, goldItem], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.textNode.goldItemsMargin
        });
        return goldBlock;
    },

    createBoostersBlock: function (boosters) {
        var styles = cleverapps.styles.ShopUserGoldView;

        var boosterItems = boosters.map(function (booster) {
            return this.createItem(booster.getAmount(), RewardTypes.boosters.smallIcon[booster.id], styles.items.boosters);
        }.bind(this));

        return new cleverapps.WrapGridLayout(boosterItems, {
            direction: cleverapps.UI.HORIZONTAL,
            columns: 3,
            margin: styles.textNode.boostersItemsMargin,
            align: {
                x: cleverapps.GridLayout.ALIGN_CENTER
            }
        });
    },

    createItem: function (amount, iconImage, itemStyles) {
        var styles = cleverapps.styles.ShopUserGoldView;

        var amountText = cleverapps.UI.generateImageText(cleverapps.formatAmount(amount), cleverapps.styles.FONTS.SHOP_USER_GOLD_TEXT);
        var icon = new cc.Sprite(iconImage);
        icon.y += itemStyles.dy || 0;

        return new cleverapps.Layout([amountText, icon], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.items.margin
        });
    },

    getPreferredBundles: function () {
        return ["tile_shop", "prolongation_window"];
    }
});

ShopUserGoldView.ListBoosters = function () {
    if (["differences", "match3"].indexOf(cleverapps.config.type) !== -1) {
        return cleverapps.boosters.listAll();
    }

    return cleverapps.boosters.listBoostersBefore();
};

ShopUserGoldView.IsAvailable = function () {
    return cleverapps.user.checkAvailable(cleverapps.config.features.includes("boosters_before") && WindowBoostersBefore.AVAILABLE, { ignoreProgress: true }) && ShopUserGoldView.ListBoosters().length;
};

cleverapps.styles.ShopUserGoldView = {
    x: { align: "center" },
    y: { align: "bottom", dy: 20 },

    textNode: {
        margin: 10,
        goldItemsMargin: 10,
        boostersItemsMargin: {
            x: 15,
            y: 15
        }
    },

    items: {
        margin: 5,

        gold: {
            dy: 5
        },

        boosters: {
            dy: 5
        }
    }
};
