/**
 * Created by mac on 7/26/18
 */

var RewardWindow = Window.extend({
    ctor: function (reward, options) {
        this.options = options = options || {};

        this.reward = new RewardsList(reward, options);
        this.reward.receiveRewards();

        cleverapps.DataLoader.processSaveQueue();

        this._super();
    },

    onWindowLoaded: function () {
        this._super({
            title: this.options.title || "RewardWindow.title",
            name: this.options.name || "rewardwindow",
            content: this.createContent(),
            noBackground: true,
            tapToContinue: "Window.ClickToClaim",
            shareId: this.options.shareId || this.reward.isBigReward() && "reward",
            showSound: this.options.sound || bundles.main.urls.reward_window_effect
        });

        this.adjustRewardList();

        this.rewardsList.showUp();
    },

    adjustRewardList: function () {
        var width = this.rewardsList.width * this.rewardsList.scale;
        if (width > this.window.width) {
            this.rewardsList.setScale(this.rewardsList.scale * this.window.width / width);
        }
    },

    createContent: function () {
        var styles = cleverapps.styles.RewardWindow;

        if (this.options.text) {
            var text = this.rewardText = cleverapps.UI.generateTTFText(this.options.text, cleverapps.styles.FONTS.REWARDWINDOW_TITLE_TEXT);
            text.setWrapWidth(styles.textWidth);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        }

        this.rewardsList = this.createRewardsList();

        return new cleverapps.Layout([text, this.rewardsList].filter(Boolean), {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    onShow: function () {
        this._super(this.reward.listRewards().length * 0.3);
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "happy"
        };
    },

    createRewardsList: function () {
        var styles = cleverapps.styles.RewardWindow.rewards;

        return new RewardsListComponent(this.reward, {
            font: cleverapps.styles.FONTS.REWARDWINDOW_VALUE_TEXT,
            iconWrap: styles.iconWrap,
            margin: styles.margin,
            textMargin: styles.textMargin,
            toMainWorld: this.options.toMainWorld,
            shine: true
        });
    },

    onClose: function () {
        if (this.reward) {
            this.reward.onAnimationFinished();
            this.reward = undefined;
        }
    },

    beforeCloseAnimation: function (callback) {
        if (!this.reward) {
            callback();
            return;
        }

        var reward = this.reward;
        this.reward = undefined;

        this.rewardsList.receiveRewardsAnimation({
            callback: callback
        });
        var index = reward.underShadowRewardIndex();

        this.runAction(new cc.Spawn(
            new cc.Sequence(
                new cc.DelayTime(0.2 + 0.3 * index),
                new cc.CallFunc(function () {
                    if (this.persons) {
                        this.persons.hide();
                    }

                    if (this.rewardText) {
                        this.rewardText.runAction(new cc.FadeOut(0.3));
                    }

                    if (this.windowTitle) {
                        this.windowTitle.hide();
                    }

                    if (this.styles.shadow) {
                        cleverapps.windows.onHideShadow();
                    }
                }.bind(this)),
                new cc.DelayTime(0.3),
                new cc.FadeOut(0.3),
                new cc.CallFunc(this.hideSelf.bind(this))
            )
        ));
    },

    onPressed: function () {
        this.close();
    },

    listBundles: function () {
        return this.reward.listBundles();
    },

    getPreferredBundles: function () {
        if (cleverapps.config.type === "merge") {
            return ["game", "main"];
        }
        return this._super();
    }
});

RewardWindow.createStarChestWindow = function (reward) {
    return new RewardWindow(reward, {
        title: "StarChestRewardWindow.title",
        name: "starchestrewardwindow"
    });
};

RewardWindow.createPurchaseWindow = function (reward) {
    return new RewardWindow(reward, {
        title: "PurchaseRewardWindow.title",
        name: "purchaserewardwindow"
    });
};

RewardWindow.createCupsWindow = function (reward, type) {
    return new RewardWindow(reward, {
        name: "cupsrewardwindow",
        title: "Cups." + type + ".title",
        text: "Cups." + type + ".reward"
    });
};

RewardWindow.createDailyTaskWindow = function (task) {
    return new RewardWindow(task.getReward(), {
        title: "DailyTaskRewardWindow.title",
        name: "dailytaskrewardwindow",
        text: "DailyTaskRewardWindow.text"
    });
};

RewardWindow.createMiniGameWindow = function (reward) {
    return new RewardWindow(reward, {
        title: "MiniGameRewardWindow.title",
        name: "minigamerewardwindow",
        text: "MiniGameRewardWindow.text"
    });
};

RewardWindow.createMissionWindow = function (reward, missionData, options) {
    options = options || {};

    return new RewardWindow(reward, {
        shareId: options.shareId || missionData.rewardShareId,
        title: missionData.rewardTitle,
        text: missionData.rewardText,
        toMainWorld: missionData.mainWorldReward
    });
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    REWARDWINDOW_TITLE_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    REWARDWINDOW_VALUE_TEXT: {
        size: 56,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.RewardWindow = {
    textWidth: 800,
    margin: 40,

    rewards: {
        iconWrap: {
            height: 160
        },

        margin: {
            x: 100,
            y: 60
        },

        textMargin: 0
    }
};
