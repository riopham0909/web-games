/**
 * Created by vladislav on 10.02.2022
 */

var DailyCupView = cc.Node.extend({
    ctor: function () {
        this._super();

        var styles = cleverapps.styles.DailyCupView;

        var title = this.createTitle();
        var timerBlock = this.createTimerBlock();
        var table = this.createTable();

        var topLayout = new cleverapps.Layout([title, timerBlock, table], {
            margin: styles.topLayout.margin,
            direction: cleverapps.UI.VERTICAL
        });

        var helpButton = this.createHelpButton();
        var leadersButton = this.createLeadersButton();
        var playButton = this.playButton = this.createPlayButton();

        var buttonsLayout = this.buttonsLayout = new cleverapps.Layout([helpButton, playButton, leadersButton], {
            margin: styles.buttonsLayout.margin,
            direction: cleverapps.UI.HORIZONTAL
        });

        var layout = new cleverapps.Layout([topLayout, buttonsLayout], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL
        });

        this.setAnchorPoint2();
        this.setContentSize2(layout.width, layout.height);
        layout.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(layout);

        var noConnectionInfo = this.noConnectionInfo = this.createNoConnectionInfo();
        noConnectionInfo.setPositionRound(layout.width / 2, layout.height / 2);
        layout.addChild(noConnectionInfo, 1);

        this.updateState();

        cleverapps.dailyCup.reload();

        cleverapps.dailyCup.onChangedView = this.createListener(this.updateState.bind(this));
        this.updateSize();
        this.updatePosition();

        new HidingNode(this.buttonsLayout, cleverapps.UI.VERTICAL);
        cleverapps.meta.registerControl("dailyCupButtons", this.buttonsLayout);
    },

    updatePosition: function () {
        var styles = cleverapps.styles.DailyCupView;
        this.setPositionRound(styles.position);
    },

    updateSize: function () {
        var styles = cleverapps.styles.DailyCupView;
        var scene = cleverapps.scenes.getRunningScene();
        var width = scene && scene.width || cleverapps.UI.getSceneSize().width;
        this.setScale(width < styles.baseWidth ? width / styles.baseWidth : 1);
    },

    updateState: function () {
        if (this.animationRunning) {
            return;
        }

        if (cleverapps.dailyCup.isRunning()) {
            this.finishedText.setVisible(false);
            this.timer.setVisible(true);
            this.timer.countDown.resetTimeLeft(cleverapps.dailyCup.getTimeLeft());

            this.playButton.setString("Play");
            this.playButton.enable();
        } else {
            this.finishedText.setVisible(true);
            this.timer.setVisible(false);

            if (cleverapps.dailyCup.getReward()) {
                this.playButton.setString("Claim");
                this.playButton.enable();
            } else if (cleverapps.dailyCup.isActive() && cleverapps.dailyCup.isFinished()) {
                this.playButton.setString("Next");
                this.playButton.enable();
            } else {
                this.playButton.setString("Play");
                this.playButton.disable();
            }
        }

        if (cleverapps.dailyCup.hasConnection()) {
            this.noConnectionInfo.setVisible(false);
        } else {
            this.noConnectionInfo.setVisible(true);
            this.playButton.disable();
        }
    },

    createTitle: function () {
        var styles = cleverapps.styles.DailyCupView.title;

        var titleNode = new cc.Node();
        titleNode.setAnchorPoint2();
        titleNode.setContentSize2(styles);

        var titleBg = new cc.Scale9Sprite(bundles.daily_cup.frames.daily_cup_title_bg_png);
        titleBg.setContentSize2(styles);

        titleNode.addChild(titleBg);
        titleBg.setPositionRound(styles.bg);

        var title = cleverapps.UI.generateOnlyText("Cups.daily.title", cleverapps.styles.FONTS.DAILY_CUP_TITLE_TEXT);
        title.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        title.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        title.fitTo(styles.text.width);
        titleNode.addChild(title);
        title.setPositionRound(styles.text);

        return titleNode;
    },

    createTimerBlock: function () {
        var styles = cleverapps.styles.DailyCupView;

        var container = new cc.Node();
        container.setAnchorPoint2();
        container.setContentSize2(styles.timerBlock);

        this.timer = this.createTimer();
        container.addChild(this.timer);
        this.timer.setPositionRound(container.width / 2, container.height / 2);

        this.finishedText = this.createFinishedText();
        container.addChild(this.finishedText);
        this.finishedText.setPositionRound(container.width / 2, container.height / 2);

        return container;
    },

    createTimer: function () {
        var styles = cleverapps.styles.DailyCupView;

        var leftTime = cleverapps.dailyCup.getTimeLeft();

        var timerBg = new cc.Scale9Sprite(bundles.timer.frames.timer_bg_png);
        timerBg.setContentSize2(styles.timer.bg);

        return new cleverapps.CountDownView(new cleverapps.CountDown(leftTime), {
            font: cleverapps.styles.FONTS.DAILY_CUP_TIMER_TEXT,
            background_content: timerBg
        });
    },

    createFinishedText: function () {
        var styles = cleverapps.styles.DailyCupView;

        var textBg = new cc.Scale9Sprite(bundles.timer.frames.timer_bg_png);
        textBg.setContentSize2(styles.finishedText);

        var text = cleverapps.UI.generateOnlyText("Cups.daily.finished", cleverapps.styles.FONTS.WHITE_TEXT);
        textBg.addChild(text);
        text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        text.fitTo(textBg.width - 2 * styles.finishedText.padding.x, textBg.height - 2 * styles.finishedText.padding.y);
        text.setPositionRound(textBg.width / 2, textBg.height / 2);

        return textBg;
    },

    createTable: function () {
        return new CupTableView(cleverapps.dailyCup, function () {
            return cleverapps.cupsTopTable.createTableView({
                id: cleverapps.dailyCup.type,
                data: cleverapps.dailyCup.listParticipants(),
                rowConstructor: cleverapps.DailyCupRow,
                height: cleverapps.styles.DailyCupView.height
            });
        });
    },

    createHelpButton: function () {
        return new cleverapps.UI.HelpButton(function () {
            cleverapps.meta.display({
                focus: "DailyCupRulesWindow",
                action: function (f) {
                    new GuideWindow({ name: "DailyCupRulesWindow", title: "DailyCupRulesWindow.title" });
                    cleverapps.meta.onceNoWindowsListener = f;
                }
            });
        });
    },

    createPlayButton: function () {
        var styles = cleverapps.styles.DailyCupView;

        return new cleverapps.UI.Button({
            text: "Play",
            width: styles.playButton.width,
            height: styles.playButton.height,
            onClicked: function () {
                if (this.animationRunning) {
                    return;
                }

                cleverapps.meta.display({
                    focus: "PlayDailyCup",
                    actions: [
                        function (f) {
                            this.animationRunning = true;

                            if (cleverapps.dailyCup.isRunning()) {
                                cleverapps.dailyCup.wantsToPlay(f);
                            } else if (cleverapps.dailyCup.getReward()) {
                                cleverapps.dailyCup.receiveReward(f);
                            } else if (cleverapps.dailyCup.isActive() && cleverapps.dailyCup.isFinished()) {
                                cleverapps.dailyCup.next();
                                f();
                            } else {
                                f();
                            }
                        }.bind(this),

                        function (f) {
                            f();
                            this.animationRunning = false;
                            this.updateState();
                        }.bind(this)
                    ]
                });
            }.bind(this)
        });
    },

    createLeadersButton: function () {
        var styles = cleverapps.styles.DailyCupView;

        var leadersButton = new cc.Sprite(bundles.daily_cup.frames.daily_cup_leaders_icon_png);
        cleverapps.UI.fitToBox(leadersButton, styles.leadersButton);
        leadersButton.baseScale = leadersButton.scale;

        cleverapps.UI.applyHover(leadersButton);
        cleverapps.UI.onClick(leadersButton, function () {
            cleverapps.meta.display({
                focus: "DailyCupLeadersWindow",
                action: function (f) {
                    new DailyCupLeadersWindow();
                    cleverapps.meta.onceNoWindowsListener = f;
                }
            });
        });

        return leadersButton;
    },

    createNoConnectionInfo: function () {
        var styles = cleverapps.styles.DailyCupView.noConnectionInfo;

        var background = new cc.Scale9Sprite(bundles.timer.frames.timer_bg_png);
        background.setContentSize2(styles.bg);

        var text = cleverapps.UI.generateOnlyText("InternetConnectionError", cleverapps.styles.FONTS.WHITE_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setPositionRound(background.width / 2, background.height / 2);
        text.setDimensions(background.width, 0);
        text.fitTo(undefined, background.height);
        background.addChild(text);

        return background;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    DAILY_CUP_TIMER_TEXT: {
        name: "default",
        color: cleverapps.styles.COLORS.WHITE,
        size: 40,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },
    DAILY_CUP_TITLE_TEXT: {
        name: "default",
        color: cleverapps.styles.COLORS.WHITE,
        size: 60,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.DailyCupView = {
    height: 640,
    margin: 40,

    baseWidth: 800,

    position: {
        x: { align: "center" },
        y: { align: "center", dy: -30 }
    },

    topLayout: {
        margin: 20
    },

    title: {
        width: 500,
        height: 150,

        bg: {
            x: { align: "center" },
            y: { align: "center", dy: -30 }
        },

        text: {
            width: 250,

            x: { align: "center" },
            y: { align: "center", dy: -10 }
        }
    },

    table: {
        height: 650,

        paddingX: 20
    },

    timerBlock: {
        width: 300,
        height: 100
    },

    timer: {
        bg: {
            width: 270,
            height: 55
        }
    },

    finishedText: {
        width: 400,
        height: 80,

        padding: {
            x: 10,
            y: 5
        }
    },

    buttonsLayout: {
        margin: 20
    },

    playButton: {
        width: 300,
        height: 125
    },

    leadersButton: {
        width: 100,
        height: 100
    },

    noConnectionInfo: {
        bg: {
            width: 480,
            height: 120
        }
    }
};
