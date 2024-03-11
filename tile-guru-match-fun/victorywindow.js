/**
 * Created by slava on 24.03.17.
 */

var VictoryWindow = Window.extend({
    ctor: function (game, boatswain) {
        this.game = game;
        this.boatswain = boatswain;
        this.next = undefined;

        var gameRewards = this.game.rewards;

        if (cleverapps.meta.getType() === Metha.SIMPLE && game.level.isRegular()) {
            gameRewards.simpleStar = cleverapps.simple.amountLevelStars(game.level);
        }

        if (cleverapps.meta.getType() === Metha.HOMEFIX && game.level.isRegular()) {
            gameRewards.homeStar = cleverapps.home.amountLevelStars(game.level);
        }

        var extraPrizes = [];

        if (game.rewards[GameBase.REWARD_PRIMARY] !== undefined) {
            var type = game.primaryMission.type;

            if (type === Mission.TYPE_TREASURE_SEARCH) {
                gameRewards.mission = {
                    missionType: type,
                    amount: game.rewards[GameBase.REWARD_PRIMARY]
                };
                gameRewards[GameBase.REWARD_PRIMARY] = undefined;
            } else {
                extraPrizes.push(new ExtraPrize("mission", {
                    type: game.primaryMission.type,
                    amount: game.rewards[GameBase.REWARD_PRIMARY]
                }));
            }
        }

        var rewards = new RewardsList(gameRewards, {
            event: cleverapps.EVENTS.EARN.LEVEL_REWARD
        });

        rewards.receiveRewards();

        rewards.filter(function (reward) {
            return [GameBase.REWARD_PRIMARY, "lantern"].indexOf(reward.type) === -1;
        });

        this.rewards = rewards;

        if (this.game.rewards.lantern !== undefined) {
            extraPrizes.push(new ExtraPrize("lantern", this.game.rewards.lantern));
        }

        this.extraPrizes = extraPrizes;

        this._super();
    },

    onWindowLoaded: function () {
        var styles = cleverapps.styles.VictoryWindow;

        this.rumble = cleverapps.isRumble() && cleverapps.meta.getRumble();
        if (this.rumble) {
            this.rumbleRound = this.rumble.getPrevRound();

            if (!this.rumbleRound) {
                cleverapps.throwAsync("can't find round for rumble [" + this.rumble.rounds.map(function (round) {
                    return round.players && round.players.join(",");
                }).join("],[") + "]");
            }
        }

        this._super({
            name: "victorywindow",
            title: this.getTitleText(),
            shareId: !this.rumble && !cleverapps.instantTournament.isInTournament() && "victory",
            styles: styles,
            content: this.createContent(),
            homeButton: !this.rumble,
            fireworks: !cleverapps.isKnockoutGame() && this.game.outcome === GameBase.OUTCOME_VICTORY,
            noBackground: true,
            tapToContinue: true
        });

        if (this.boatswain) {
            this.boatswain.setIntent(this.boatswain.canNext() ? Boatswain.NEXT_INTENT : Boatswain.RETURN_INTENT);
        }
    },

    onShow: function () {
        if (this.silentShow) {
            return;
        }

        var styles = cleverapps.styles.VictoryWindow;

        this.runAction(new cc.Sequence(
            new cc.DelayTime(styles.soundDelay || 0),
            new cc.PlaySound(bundles.victory_window.urls.win_effect),
            new cc.PlaySound(bundles.victory_window.urls.win_effect_2)
        ));

        this.runAction(new cc.Sequence(
            new cc.DelayTime(2.0),
            new cc.CallFunc(function () {
                this.runAction(new cc.RepeatForever(
                    new cc.Sequence(
                        new cc.PlaySound(bundles.victory_window.urls.victory_looped_effect),
                        new cc.DelayTime(4.0)
                    )
                ));
            }.bind(this))
        ));

        var delay = 200;
        this.rewardsList.showUp();
        this.extraPrizesList.forEach(function (extraPrizeView) {
            extraPrizeView.showUp(delay);
            delay += 300;
        });

        if (this.fireworks) {
            this.fireworks.start((delay + 300) / 1000);
        }

        this.content.children.forEach(function (component) {
            if (component.showUp) {
                delay += component.showUp();
            }
        });

        this.silentShow = true;
        this._super(delay / 1000 + 0.5);
    },

    getPerson: function () {
        return this.game.outcome === GameBase.OUTCOME_VICTORY && {
            role: "hero",
            emotion: "happy"
        };
    },

    getTitleText: function () {
        if (this.rumble) {
            return this.rumbleRound && this.rumbleRound.isLast()
                ? "KnockoutWindow.Title.Final"
                : Messages.get("KnockoutWindow.Title.Round", { roundId: (this.rumbleRound && this.rumbleRound.id || 0) + 1 });
        }

        if (this.game.outcome === GameBase.OUTCOME_LOST) {
            return "LoseWindow.title";
        }

        return "VictoryWindow.Victory";
    },

    createContent: function () {
        var styles = cleverapps.styles.VictoryWindow;

        var data = [];

        if (cleverapps.config.type === "battlefield") {
            data.push(new BattleStatsComponent());
        }

        if (cleverapps.highscore) {
            data.push(new VictoryScoreComponent());
            data.push(new ScoreStatsComponent());
        }

        data.push(this.createRewards());

        var extraPrizes = this.createExtraPrizes();
        if (extraPrizes) {
            data.push(extraPrizes);
        }

        if (this.rumbleRound) {
            data.push(new RoundResultsComponent(this.rumbleRound, { victory: true }));
            data.push(new RoundCountdownComponent(function () {
                if (!this.closed) {
                    this.close();
                }
            }.bind(this)));
        }

        return new cleverapps.Layout(data, {
            direction: cleverapps.UI.VERTICAL,
            padding: styles.padding,
            margin: styles.margin
        });
    },

    createRewards: function () {
        var styles = cleverapps.styles.VictoryWindow.rewards;

        var columns = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? 3 : 5;

        var rewardsList = this.rewardsList = new RewardsListComponent(this.rewards, {
            columns: columns,
            iconWrap: styles.iconWrap,
            textMargin: styles.textMargin,
            font: cleverapps.styles.FONTS.REWARDWINDOW_VALUE_TEXT,
            noShowControls: false
        });
        rewardsList.setLocalZOrder(2);
        return rewardsList;
    },

    createExtraPrizes: function () {
        var styles = cleverapps.styles.VictoryWindow.extra;

        var extraPrizes = this.extraPrizesList = this.extraPrizes.map(function (extraPrize) {
            return new ExtraPrizeView(extraPrize);
        });

        if (!extraPrizes.length) {
            return;
        }

        var extraPrizesList = new cleverapps.Layout(extraPrizes, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
        extraPrizesList.setLocalZOrder(2);
        return extraPrizesList;
    },

    beforeCloseAnimation: function (callback) {
        this.rewardsList.receiveRewardsAnimation();

        var rewardsCount = this.rewardsList.targets.length;
        var extraPrizesCount = this.extraPrizesList.length;
        var delay = rewardsCount * 300;

        this.extraPrizesList.forEach(function (extraPrizeView, index) {
            delay += 300;
            extraPrizeView.collectReward(delay, rewardsCount + extraPrizesCount - index);
        });

        delay += 100;

        this.content.children.forEach(function (item) {
            item.beforeWinClose && item.beforeWinClose();
        });

        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay / 1000),
            new cc.CallFunc(function () {
                cleverapps.aims.whenAllHidden(callback);
            })
        ));
    },

    getPreferredBundles: function () {
        return ["game"];
    },

    listBundles: function () {
        return ["victory_window"];
    }
});

cleverapps.styles.VictoryWindow = {
    margin: 40,
    padding: {
        bottom: 40
    },

    rewards: {
        textMargin: 0,

        iconWrap: {
            width: 130,
            height: 130
        },

        margin: 30,

        padding: {
            x: 0,
            y: 0
        }
    },

    extra: {
        margin: 60
    }
};
