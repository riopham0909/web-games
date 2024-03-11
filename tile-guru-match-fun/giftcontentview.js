/**
 * Created by Andrey Popov on 4/2/21.
 */

var GiftContentView = cleverapps.Layout.extend({
    ctor: function (chatMessage) {
        this.chatMessage = chatMessage;

        var styles = cleverapps.styles.GiftContentView;

        this.chatMessage.parseGift();

        var contentWidth = Math.min(0.6 * cleverapps.UI.getSceneSize().width, styles.width);
        var items = [];

        var bg = cleverapps.UI.createScale9Sprite(bundles.chat.frames.gift_bg);
        var mark = new cc.Sprite(bundles.chat.frames.checkmark_gift);
        var markHeight = this.chatMessage.isGiftTaken() ? mark.height : 0;
        var text, msg;

        var itemsFromCompletedExpedition = false;
        if (this.chatMessage.presents && this.chatMessage.presents.expedition) {
            var page = cleverapps.travelBook.getPageById(this.chatMessage.presents.expedition);
            itemsFromCompletedExpedition = !page || !page.isActive();
        }

        if (this.chatMessage.progress || this.chatMessage.metha || this.chatMessage.restoreProgressId || itemsFromCompletedExpedition) {
            if (this.chatMessage.metha) {
                if (this.chatMessage.metha.simple) {
                    var bgIndex = parseInt(this.chatMessage.metha.simple.current);
                    if (bgIndex < cleverapps.simple.bgsAmount) {
                        text = cleverapps.UI.generateOnlyText("AdminSetMethaProgress.Text", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT, { bgIndex: bgIndex });
                    } else {
                        text = cleverapps.UI.generateOnlyText("AdminSetMethaProgress.Text.Unavailable", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
                    }
                } else if (this.chatMessage.metha.farm) {
                    var buildingId = parseInt(this.chatMessage.metha.farm.building);
                    var building = cleverapps.farm.buildings[buildingId];
                    var questId = parseInt(this.chatMessage.metha.farm.quest);

                    if (building && questId < building.quests.length) {
                        var buildingName = Messages.get("building." + cleverapps.farm.buildings[buildingId].name);
                        msg = Messages.get(questId > 0 ? "AdminSetFarmProgress.Text.Quest" : "AdminSetFarmProgress.Text", {
                            buildingName: buildingName,
                            questName: Messages.get(building.quests[questId].title)
                        });
                        text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
                    } else {
                        text = cleverapps.UI.generateOnlyText("AdminSetFarmProgress.Text.Unavailable", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
                    }
                } else if (this.chatMessage.metha.home) {
                    var furnitureIndex = parseInt(this.chatMessage.metha.home.furniture);
                    var furniture = cleverapps.home.furniture[furnitureIndex];
                    var stage = parseInt(this.chatMessage.metha.home.stage);

                    if (furniture && stage < furniture.stages.length) {
                        var furnitureName = Messages.get("building." + furniture.name);
                        msg = Messages.get(stage > 0 ? "AdminSetHomeProgress.Text.Stage" : "AdminSetHomeProgress.Text", {
                            furnitureName: furnitureName,
                            stageName: Messages.get(furniture.stages[stage].title)
                        });
                        text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
                    } else {
                        text = cleverapps.UI.generateOnlyText("AdminSetHomeProgress.Text.Unavailable", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
                    }
                }
            } else if (this.chatMessage.restoreProgressId) {
                text = cleverapps.UI.generateOnlyText("AdminRestoreProgress.Text", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT, { userId: this.chatMessage.restoreProgressId });
            } else if (itemsFromCompletedExpedition) {
                text = cleverapps.UI.generateOnlyText("ItemsFromCompletedExpedition", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
            } else {
                var levelNo = cleverapps.humanReadableNumber(parseInt(this.chatMessage.progress.episode), parseInt(this.chatMessage.progress.level));
                text = cleverapps.UI.generateOnlyText("AdminSetProgress.Text", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT, { levelNo: levelNo });
            }

            text.setDimensions(contentWidth, 0);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

            bg.setContentSize(contentWidth + styles.bg.padding, Math.max(styles.minHeight, text.height + styles.bg.padding + markHeight));
            bg.addChild(text);
            text.setPositionRound(bg.width / 2, bg.height / 2 + markHeight / 2);
            items.push(bg);
        } else if (this.chatMessage.presents || this.chatMessage.harvested) {
            var heroesGift = this.chatMessage.presents && this.chatMessage.presents.herolevels && this.chatMessage.presents.herolevels.length > 0;
            text = cleverapps.UI.generateOnlyText(heroesGift ? "AdminGiftsHeroes" : "AdminGiftsText", cleverapps.styles.FONTS.CHAT_MESSAGE_TEXT);
            text.setDimensions(contentWidth, 0);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            items.push(text);

            var rewards = cleverapps.clone(this.chatMessage.presents, true);
            if (this.chatMessage.harvested) {
                rewards = {
                    unit: Object.keys(this.chatMessage.harvested).map(function (unitCode) {
                        return {
                            code: unitCode,
                            amount: this.chatMessage.harvested[unitCode],
                            stage: 4
                        };
                    }.bind(this))
                };
            }

            delete rewards.expedition;

            var rewardsList = new RewardsListComponent(rewards, {
                columns: heroesGift ? 3 : 2,
                font: cleverapps.styles.FONTS.CHAT_REWARD_COUNT_TEXT,
                textDirection: cleverapps.UI.HORIZONTAL
            });

            var scale = Math.min(0.9 * contentWidth / rewardsList.width, 1);
            rewardsList.setScale(scale);

            bg.setContentSize(contentWidth + styles.bg.padding, Math.max(styles.minHeight, rewardsList.height * scale + markHeight + styles.bg.padding));
            bg.addChild(rewardsList);
            rewardsList.setPositionRound(bg.width / 2, bg.height / 2 + markHeight / 2);
            items.push(bg);
        }

        if (this.chatMessage.isGiftTaken()) {
            mark.setPositionRound(styles.checkmark);
            bg.addChild(mark);
        } else if (this.chatMessage.isApplicable()) {
            var noButton;
            if (this.chatMessage.progress !== undefined || this.chatMessage.metha !== undefined) {
                noButton = new cleverapps.UI.Button({
                    text: "No",
                    type: cleverapps.styles.UI.Button.Images.chat,
                    onClicked: function () {
                        cleverapps.chat.acceptGift(this.chatMessage, false);
                    }.bind(this),
                    textVariant: "strict_black",
                    width: styles.buttons.width,
                    height: styles.buttons.height
                });
            }

            var yesButton = new cleverapps.UI.Button({
                text: this.chatMessage.progress !== undefined ? "Yes" : "Accept",
                type: cleverapps.styles.UI.Button.Images.chat,
                onClicked: function () {
                    cleverapps.chat.acceptGift(this.chatMessage, true);
                }.bind(this),
                textVariant: "strict_black",
                width: styles.buttons.width,
                height: styles.buttons.height
            });

            items.push(new cleverapps.Layout([noButton, yesButton], {
                direction: cleverapps.UI.HORIZONTAL,
                margin: styles.margin
            }));
        }

        this._super(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    }
});

cleverapps.styles.GiftContentView = {
    width: 840,
    minHeight: 220,

    margin: 10,
    padding: {
        x: 10,
        y: 10
    },

    buttons: {
        width: 200,
        height: 60
    },

    checkmark: {
        x: { align: "right", dx: -6 },
        y: { align: "bottom", dy: 10 }
    },

    bg: {
        padding: 20
    }
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CHAT_REWARD_COUNT_TEXT: {
        size: 56,
        color: cleverapps.styles.COLORS.COLOR_BROWN,
        font: bundles.chat.urls.strict_font_ttf,
        name: "nostroke"
    }
});