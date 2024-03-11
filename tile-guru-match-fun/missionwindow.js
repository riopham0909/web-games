/**
 * Created by mac on 7/26/18
 */

var MissionWindow = Window.extend({
    onWindowLoaded: function (mission) {
        var styles = cleverapps.styles.MissionWindow;

        this.mission = mission;

        this.wasFinished = !this.mission.isRunning();
        if (this.wasFinished) {
            this.prize = this.mission.getPrize();
        }

        this.content = this.createContent();

        SceneDecors.add(this.content, cleverapps.skins.getSlot("missionWindowDecors"));

        this.mission.onChangeResults = this.createListener(function () {
            var results = this.mission.getResults();
            this.tableView.updateResults(results);
            cleverapps.missionManager.table.updateResults(this.mission.type, results);
        }.bind(this));

        this._super({
            title: {
                text: "Missions." + mission.getName() + ".Title",
                font: cleverapps.skins.getSlot("missionWindowTitleFont")
            },
            name: " missionwindow",
            content: this.content,
            button: {
                width: styles.button.width,
                height: styles.button.height,
                text: this.getButtonText(),
                type: cleverapps.styles.UI.Button.Images.button_red,
                onPressed: this.onButtonPressed.bind(this)
            },
            help: this.wasFinished ? undefined : function () {
                new GuideWindow(MissionRulesOptionsBuilder.build(mission));
            }
        });
    },

    onButtonPressed: function () {
        this.close();

        if (!this.wasFinished) {
            cleverapps.meta.distract({
                focus: "MissionPlayButtonPressed",
                action: function (f) {
                    cleverapps.meta.wantsToPlay(f);
                }
            });
        }
    },

    getButtonText: function () {
        if (this.wasFinished) {
            return Messages.get(this.prize ? "ClaimPrize.Button.text" : "OK");
        }

        return Messages.get("Play").toUpperCase();
    },

    createContent: function () {
        var styles = cleverapps.styles.MissionWindow;

        this.tableView = this.createTable();

        var textAndTimerLayout = this.createTextAndTimer();

        var items = [textAndTimerLayout];

        if (cleverapps.config.type === "match3") {
            var animationBlock = this.createAnimationBlock(this.tableView.width);

            items.push(animationBlock);
        }
        items.push(this.tableView);

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    },

    createTable: function () {
        var styles = cleverapps.styles.MissionWindow;

        return cleverapps.missionManager.table.createTableView({
            id: this.mission.type,
            data: this.mission.getResults(),
            dataIcon: MissionWindow.getTableRowIcon(this.mission.type),
            height: cleverapps.config.type === "match3" ? styles.table.small.height : styles.table.height,
            rowConstructor: cleverapps.MissionRow,
            rowOptions: {
                mission: this.mission
            }
        });
    },

    createTextAndTimer: function () {
        var text = cleverapps.UI.generateOnlyText(
            this.mission.isRunning() ? "Missions.windowRunning" : "Missions.windowFinished",
            cleverapps.styles.FONTS.WINDOW_TEXT
        );
        var items = [text];

        if (this.mission.isRunning()) {
            var timeLeft = this.mission.getTimeLeft();
            if (timeLeft > 0) {
                timeLeft = new cleverapps.CountDown(timeLeft, {
                    onFinish: function () {
                        if (this.onFinishedSound && typeof this.onFinishedSound === "function") {
                            this.onFinishedSound(true);
                        }
                        this.close();
                    }.bind(this)
                });
            }

            var timer = new cleverapps.CountDownView(timeLeft, {
                font: cleverapps.styles.FONTS.MISSION_WINDOW_COUNTDOWN_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT
            });

            items.push(timer);
        }
        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL
        });
    },

    createAnimationBlock: function (width) {
        var styles = cleverapps.styles.MissionWindow;

        var bundle = bundles[this.mission.getWindowBundleName()];

        var animationBg = new cc.Scale9Sprite(bundles.table.frames.table_bg_png);
        animationBg.setContentSize2(width, styles.animation.height);

        var missionStatus;
        if (this.wasFinished) {
            if (this.prize) {
                missionStatus = "Win";
            } else {
                missionStatus = "Lose";
            }
        }

        var textMessage = "Missions.CommonText";
        if (missionStatus) {
            textMessage = "Missions." + this.mission.getName() + ".AnimationMainText" + missionStatus;
        }

        var texts = [
            "Missions." + this.mission.getName() + ".AnimationMainTextInfo0",
            "Missions." + this.mission.getName() + ".AnimationMainTextInfo1",
            textMessage
        ].filter(Messages.has);

        this.autoScrollText = new AutoScrollText(texts, {
            width: styles.autoScrollText.width,
            height: styles.autoScrollText.height,
            font: cleverapps.styles.FONTS.WHITE_TEXT
        });
        animationBg.addChild(this.autoScrollText);
        this.autoScrollText.setPositionRound(styles.autoScrollText);

        var heroAnimationNode = new cc.Node();
        heroAnimationNode.setContentSize2(styles.animation.width, styles.animation.height);
        heroAnimationNode.setAnchorPoint(0, 0);

        var heroAnimation = new cleverapps.Spine(bundle.jsons.json);
        heroAnimation.setAnimation(0, "finish", true);
        heroAnimation.setPositionRound(heroAnimationNode.width / 2, heroAnimationNode.height / 2);
        heroAnimationNode.addChild(heroAnimation);

        animationBg.addChild(heroAnimationNode);
        heroAnimationNode.setPositionRound(styles.animation);

        return animationBg;
    },

    onFinishedSound: function (isFinished) {
        if (isFinished && this.mission && !this.mission.finishTimeSoundPlayed && cleverapps.windows.currentWindow() === this) {
            this.mission.finishTimeSoundPlayed = true;
            cleverapps.audio.playSound(bundles.main.urls.mission_finish_effect);
        }
    },

    onShow: function () {
        this._super();

        if (this.onFinishedSound && typeof this.onFinishedSound === "function") {
            this.onFinishedSound(this.wasFinished);
        }
        if (this.autoScrollText) {
            this.autoScrollText.setTextByIndex(0);
            this.autoScrollText.reinitTimer();
        }
    },

    onClose: function () {
        if (this.mission.runningCompetition) {
            this.mission.runningCompetition.updateShownPlace();
            this.mission.updateMissionIcon();
        }
    }
});

MissionWindow.prototype.listBundles = function (mission) {
    var bundles = [];

    var windowBundle = mission.getWindowBundleName();
    if (windowBundle) {
        bundles.push(windowBundle);
    }

    return bundles;
};

cleverapps.styles.MissionWindow = {
    margin: 20,

    button: {
        width: 260,
        height: 100
    },
    
    table: {
        height: 725,

        small: {
            height: 450
        }
    },

    animation: {
        width: 250,
        height: 247,
        x: 0,
        y: 0
    },

    autoScrollText: {
        width: 400,
        height: 150,

        x: { align: "right", dx: -50 },
        y: { align: "center" }
    }
};

MissionWindow.getTableRowIcon = function (type) {
    var img = cleverapps.skins.getSlot("missionTableRowIcon", { type: type });

    if (!img) {
        switch (Mission.GetChildType(type)) {
            case Mission.TYPE_LETTER:
                return bundles.tablerow_icons.frames.letter_mission;
            case Mission.TYPE_COMBO:
                return bundles.tablerow_icons.frames.combo;
            case Mission.TYPE_COLLECT_MARK:
                return bundles.tablerow_icons.frames.collect_mark;
            case Mission.TYPE_BURN_NEARBY:
                return bundles.tablerow_icons.frames.burn_nearby;
            case Mission.TYPE_EXPEDITION_FEAST:
            case Mission.TYPE_LIVESFEAST:
                return bundles.tablerow_icons.frames.feast_energy;
            case Mission.TYPE_SOFTFEAST:
                return bundles.tablerow_icons.frames.feast_coin;
            case Mission.TYPE_KRAKENFEAST:
                return bundles.tablerow_icons.frames.feast_tentacle;
        }
    }

    return img;
};