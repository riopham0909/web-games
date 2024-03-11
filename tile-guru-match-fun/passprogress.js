/**
 * Created by r4zi4l on 17.05.2021
 */

var PassProgress = cc.Node.extend({
    ctor: function (options) {
        this._super();
        this.passLogic = options.passLogic;

        var styles = cleverapps.styles.PassProgress;

        this.setContentSize2(options.width - 2 * styles.paddingX, styles.height);

        var tasks = this.createTasks();
        tasks.setPositionRound(styles.tasks);

        var progressBar = this.progressBar = new ScaledProgressBar({
            progress: bundles.progress_bar.frames.bar_passprogress,
            background: bundles.progress_bar.frames.bg_passprogress
        });
        progressBar.setLength(tasks.content.width - styles.tasks.width / 2 - styles.progressBar.offsetWidth);
        progressBar.setAnchorPoint2(0, 0.5);
        progressBar.setPositionRound(styles.progressBar);
        progressBar.setLocalZOrder(-1);
        progressBar.setPercentage(this.calcProgressPercentage(this.passLogic.shownProgress));
        tasks.content.addChild(progressBar);

        if (cleverapps.config.debugMode) {
            cleverapps.UI.onClick(progressBar, function () {
                this.passLogic.completeCurrentTask();
                this.passLogic.showProgress();
            }.bind(this));
        }

        this.addLines();

        var scroll = this.progressScroll = new cleverapps.UI.ScrollView(tasks, {
            childrenVisibility: cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_NONE,
            direction: cleverapps.UI.ScrollView.DIR_HORIZONTAL,
            scrollBarEnabled: false,
            outOfBoundaryScale: 0.05
        });
        scroll.setContentSize2(this.width + styles.scroll.offsetWidth, this.height + styles.scroll.offsetHeight);
        scroll.scrollTo(cleverapps.UI.ScrollView.SCROLLS.LOWER_RIGHT);
        scroll.setPositionRound(styles.scroll);
        this.addChild(scroll);

        this.passLogic.onAnimateProgressChange = this.createListener(this.animateProgressChange.bind(this));
        this.passLogic.onNextProgressStep = this.createListener(this.animateProgressStep.bind(this));
        this.passLogic.onShowFinger = this.createListener(this.showFinger.bind(this));
        this.passLogic.onShowWindowListeners.passProgress = this.createListener(this.onShow.bind(this));
    },

    createTasks: function () {
        var styles = cleverapps.styles.PassProgress.tasks;
        var tasks = this.passLogic.levels;

        var container = this.container = new cc.Node();
        container.setAnchorPoint2();
        container.setContentSize2(styles.width * tasks.length + styles.contentOffset, styles.height);

        var rewardIcons = this.rewardIcons = [];
        tasks.forEach(function (task, index) {
            var icons = PassRewardIcon.createIconsFromRewardsList(task.reward, task.level, false);
            var layout = this.addIcons(icons, styles.width * (0.5 + index), styles.reward.y);
            layout.setLocalZOrder(tasks.length - index);
            rewardIcons.push.apply(rewardIcons, icons);

            var premiumIcons = PassRewardIcon.createIconsFromRewardsList(task.premiumReward, task.level, true);
            var premiumLayout = this.addIcons(premiumIcons, styles.width * (0.5 + index), styles.premiumReward.y);
            premiumLayout.setLocalZOrder(tasks.length - index);
            rewardIcons.push.apply(rewardIcons, premiumIcons);
        }.bind(this));

        this.updateIcons();
        this.createTaskPoints();
        this.createTasksBgs();

        var wrap = cleverapps.UI.wrapWithPadding(container, { left: styles.contentOffset });
        wrap.content = container;

        return wrap;
    },

    createTaskPoints: function () {
        this.taskPoints = this.passLogic.levels.map(function (task, index) {
            var taskPoint = this.createTaskPoint(task, index);
            this.container.addChild(taskPoint);
            return taskPoint;
        }, this);
    },

    createTaskPoint: function (task, index) {
        var curLevel = this.passLogic.shownProgress.level;

        var isComplete = curLevel > task.level;

        if (isComplete) {
            return this.createCompletedTaskPoint(task, index);
        }

        return this.createUncompletedTaskPoint(task, index);
    },

    createCompletedTaskPoint: function (task, index) {
        var styles = cleverapps.styles.PassProgress.tasks;

        var isSalePass = this.passLogic.mission.type === Mission.TYPE_SALEPASS;

        var frame = isSalePass && bundles.passprogress.frames.sale_task_point_completed || bundles.passprogress.frames.task_point_completed;

        var taskPoint = new cc.Sprite(frame);
        taskPoint.setPositionRound(styles.width * (0.5 + index), styles.taskPoint.y);

        if (styles.completedLevelIcon) {
            var icon = new cc.Sprite(isSalePass ? bundles.passprogress.frames.progress_coin : bundles.passprogress.frames.progress_star);
            icon.setScale(styles.completedLevelIcon.scale);
            taskPoint.addChild(icon);
            icon.setPositionRound(taskPoint.width / 2, taskPoint.height / 2);
        } else {
            var numb = cleverapps.UI.generateImageText(index + 1, cleverapps.styles.FONTS.PASS_PROGRESS_POINT_COMPLETED);
            taskPoint.addChild(numb);
            numb.setPositionRound(taskPoint.width / 2, taskPoint.height / 2);
        }

        return taskPoint;
    },

    createUncompletedTaskPoint: function (task, index) {
        var styles = cleverapps.styles.PassProgress.tasks;

        var taskPoint = new cc.Sprite(bundles.passprogress.frames.task_point);
        taskPoint.setPositionRound(styles.width * (0.5 + index), styles.taskPoint.y);

        var numb = cleverapps.UI.generateImageText(index + 1, cleverapps.styles.FONTS.PASS_PROGRESS_POINT);

        taskPoint.addChild(numb);
        numb.setPositionRound(taskPoint.width / 2, taskPoint.height / 2);

        return taskPoint;
    },

    createTasksBgs: function () {
        var styles = cleverapps.styles.PassProgress;

        var createBg = function (prem, index) {
            var bg = cleverapps.UI.createScale9Sprite(bundles.passprogress.frames[prem ? "prize_bg_orange1" : "prize_bg_blue1"]);
            bg.setContentSize2(styles.tasks.bgs);
            bg.setPositionRound(styles.tasks.width * (0.5 + index), prem ? styles.line.first.y : styles.line.second.y);
            this.container.addChild(bg, -1);
        }.bind(this);

        this.passLogic.levels.forEach(function (task, index) {
            if (index % 2 === 0 && !bundles.passprogress.frames.prize_bg_single) {
                return;
            }
            createBg(true, index);
            createBg(false, index);
        }, this);
    },

    addIcons: function (icons, x, y) {
        var layout = new cleverapps.Layout(icons, {
            direction: cleverapps.UI.VERTICAL,
            reversed: true
        });
        layout.setAnchorPoint2();
        layout.setPositionRound(x, y);
        this.container.addChild(layout);
        return layout;
    },

    addLines: function () {
        var styles = cleverapps.styles.PassProgress.line;
        var createLine = function (img, pos) {
            var line = cleverapps.UI.createScale9Sprite(img, styles.scale9 ? styles.scale9 : undefined);
            line.setPositionRound(pos);
            line.setContentSize2(this.width, styles.height);
            this.addChild(line, -2);
        }.bind(this);

        if (bundles.passprogress.frames.prize_bg_single) {
            createLine(bundles.passprogress.frames.prize_bg_single, styles.single);
        } else {
            createLine(bundles.passprogress.frames.prize_bg_orange2, styles.first);
            createLine(bundles.passprogress.frames.prize_bg_blue2, styles.second);
        }
    },

    calcProgressPercentage: function (progress) {
        var total = this.passLogic.levels.length;

        if (progress.level >= total) {
            return 100;
        }

        if (progress.level === 0 && progress.progress === 0) {
            return 0;
        }

        var firstStageStep = 0.5 / total;
        var goal = progress.progress / this.passLogic.levels[progress.level].task.goal;

        if (progress.level === 0) {
            return firstStageStep * goal * 100;
        }
        return (firstStageStep + (1 - firstStageStep) / (total - 1) * (progress.level - 1 + goal)) * 100;
    },

    scrollToLevel: function (duration, level, options) {
        if (this.taskPoints[level]) {
            this.progressScroll.scrollTo(this.taskPoints[level].getPosition(), duration, options);
        }
    },

    animateProgressChange: function (nextProgress, f) {
        this.scrollToLevel(0.8, nextProgress.level);

        var percentage = this.calcProgressPercentage(nextProgress);
        this.progressBar.runAction(new ScaledProgressBarProgressTo(0.8, percentage).easing(cc.easeCubicActionOut()));

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.6),
            new cc.CallFunc(f)
        ));
    },

    animateProgressStep: function (finishedLevel, f) {
        var taskPoint = this.taskPoints[finishedLevel];

        var completedTaskPoint = this.createCompletedTaskPoint(this.passLogic.levels[finishedLevel], finishedLevel);
        this.container.addChild(completedTaskPoint);
        completedTaskPoint.setPositionRound(taskPoint.getPosition());
        this.taskPoints[finishedLevel] = completedTaskPoint;

        taskPoint.removeFromParent();

        completedTaskPoint.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, 1.15),
            new cc.ScaleTo(0.15, 1)
        ));

        completedTaskPoint.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, 1.15),
            new cc.PlaySound(bundles.passprogress.urls.task_done_sfx),
            new cc.CallFunc(function () {
                this.rewardIcons.filter(function (icon) {
                    return icon.options.level === finishedLevel;
                }).forEach(function (icon) {
                    icon.updateState(this.passLogic, finishedLevel + 1);
                    icon.openAnimation();
                }.bind(this));

                if (this.passLogic.levels[finishedLevel].energy) {
                    Game.currentGame.addReward("energy", this.passLogic.levels[finishedLevel].energy, completedTaskPoint);
                }
            }.bind(this)),
            new cc.ScaleTo(0.15, 1),
            new cc.CallFunc(f)
        ));
    },

    updateIcons: function () {
        this.rewardIcons.forEach(function (icon) {
            icon.updateState(this.passLogic, this.passLogic.shownProgress.level);
        }.bind(this));
    },

    showFinger: function () {
        var reward = this.getFirstShownReward();
        if (reward) {
            var icon = this.rewardIcons.filter(function (icon) {
                return icon.options.level === reward.level && icon.options.premium === reward.premium;
            })[0];
            this.finger = FingerView.hintClick(icon, {
                delay: 0.8,
                loopFilter: function () {
                    return cc.rectContainsRect(this.progressScroll.getGlobalBoundingBox(), icon.icon.getGlobalBoundingBox());
                }.bind(this)
            });
        }
    },

    hideFinger: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    },

    onShow: function () {
        var task = this.passLogic.shownProgress;
        var level = task.level;
        if (this.passLogic.isAllProgressShown()) {
            var reward = this.getFirstShownReward();
            if (reward !== undefined) {
                level = reward.level;
            }
        }

        this.hideFinger();
        this.updateIcons();

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.CallFunc(function () {
                this.scrollToLevel(0.8, level, {
                    easing: cc.easeBackInOut(),
                    callback: function () {
                        this.passLogic.showProgress();
                    }.bind(this)
                });
            }.bind(this))
        ));
    },

    getFirstShownReward: function () {
        for (var i = 0, l = this.passLogic.shownProgress.level; i < l; ++i) {
            if (this.passLogic.hasPremium() && this.passLogic.hasReward(i, true)) {
                return {
                    level: i,
                    premium: true
                };
            }

            if (this.passLogic.hasReward(i)) {
                return {
                    level: i,
                    premium: false
                };
            }
        }
        return undefined;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PASS_PROGRESS_POINT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE
    },

    PASS_PROGRESS_POINT_COMPLETED: {
        name: "nostroke",
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    }
});

cleverapps.styles.PassProgress = {
    paddingX: 148,
    height: 700,

    scroll: {
        x: { align: "center", dx: -1 },
        y: { align: "center", dy: 0 },
        offsetHeight: 100,
        offsetWidth: 0
    },

    progressBar: {
        offsetWidth: 5,
        x: { align: "left", dx: 0 },
        y: { align: "center", dy: 1 }
    },

    line: {
        first: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 159 }
        },
        second: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: -151 }
        },
        height: 311
    },

    tasks: {
        width: 220,
        height: 500,
        contentOffset: 30,

        taskPoint: {
            y: { align: "center" }
        },

        premiumReward: {
            y: { align: "center", dy: 208 }
        },

        reward: {
            y: { align: "center", dy: -120 }
        },

        bgs: {
            width: 220,
            height: 311
        }
    }
};
