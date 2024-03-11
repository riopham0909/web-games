/**
 * Created by Ivan on 23.04.2023
 */

var PrizeBarComponent = cc.Node.extend({
    ctor: function (options) {
        this._super();
        this.options = options;

        this.addProgressBar();

        this.setAnchorPoint2();
        this.setContentSize2(this.progressBar.getContentSize());

        if (this.options.collected) {
            this.setCollected();
        }

        this.updateProgress(this.options.currentValue, this.options.goalValue);
    },

    setCollected: function () {
        this.setState(PrizeBarComponent.STATE_COLLECTED);
    },

    setState: function (state) {
        if (this.state === state || this.state === PrizeBarComponent.STATE_COLLECTED) {
            return;
        }
        this.state = state;

        if (this.state === PrizeBarComponent.STATE_COLLECTED) {
            this.onCollect();
        } else {
            if (!this.prize) {
                this.addPrize();
            }
            if (this.state === PrizeBarComponent.STATE_FULL) {
                this.onFull();
            }
        }
    },

    onCollect: function () {
        this.addMark();
        this.removeLighting();
        this.removePrize();
    },

    onFull: function () {
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.1),
            new cc.CallFunc(function () {
                cleverapps.tooltipManager.remove(this.prize);
                cleverapps.audio.playSound(bundles.prize.urls.prize_view_created_effect);

                this.addLighting();
                this.addFinger();
                this.addShine();

                cleverapps.UI.applyHover(this.present);
                cleverapps.UI.onClick(this.prize, this.options.onCollect);

                this.present.setAnimation(0, "animation", true);
            }.bind(this))
        ));
    },

    addMark: function () {
        var mark = this.mark = new cc.Sprite(bundles.prize.frames.mark_png);
        mark.setPositionRound(cleverapps.styles.PrizeBarComponent.mark);
        this.addChild(mark);
    },

    addLighting: function () {
        var lightning = this.lightning = new cleverapps.Spine(bundles.progress_bar.jsons.flash_json);
        lightning.setAnimation(0, "animation");
        this.progressBar.addChild(lightning);

        lightning.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.CallFunc(function () {
                    lightning.setVisible(true);
                    lightning.setPositionRound(lightning.width / 2, this.progressBar.height / 2);
                    lightning.setAnimation(0, "animation");
                }.bind(this)),
                new cc.MoveTo(0.4, this.progressBar.width + this.prize.width / 2 - lightning.width / 2, this.progressBar.height / 2),
                new cc.CallFunc(function () {
                    lightning.setVisible(false);
                }),
                new cc.DelayTime(2)
            )
        ));
        return lightning;
    },

    removeLighting: function () {
        if (this.lightning) {
            this.lightning.removeFromParent();
            delete this.lightning;
        }
    },

    addProgressBar: function () {
        var styles = cleverapps.styles.PrizeBarComponent;

        var progressBar = this.progressBar = new ScaledProgressBar({
            progress: bundles.progress_bar.frames.bar_dailytask,
            background: bundles.progress_bar.frames.bg_dailytask,
            barText: {
                text: this.options.currentValue + "/" + this.options.goalValue,
                font: cleverapps.styles.FONTS.SMALL_WHITE_TEXT
            }
        });
        progressBar.setLength(this.options.width || styles.progressBar.length);
        progressBar.setPositionRound(progressBar.width / 2, progressBar.height / 2);
        this.addChild(progressBar);
    },

    addPrize: function () {
        var styles = cleverapps.styles.PrizeBarComponent.prize;

        var prize = this.prize = new cc.Node();

        this.present = new cleverapps.Spine(bundles.prize.jsons.prize_json);

        this.present.setAnimation(0, "idle", true);

        prize.addChild(this.present);
        prize.setAnchorPoint2();
        prize.setContentSize2(styles);

        cleverapps.UI.fitToBox(this.present, styles);
        this.present.setPositionRound(prize.width / 2, prize.height / 2 + styles.present.dy);

        cleverapps.tooltipManager.create(prize, {
            text: "Reward",
            rewards: this.options.reward,
            position: cleverapps.styles.UI.Tooltip.LOCATION.below,
            size: cleverapps.styles.UI.Tooltip.SIZE.short
        });
        prize.setPositionRound(styles);
        this.addChild(prize);
    },

    removePrize: function () {
        if (this.prize) {
            this.stopAllActions();
            this.prize.removeFromParent();
            delete this.prize;
        }
    },

    addFinger: function () {
        var styles = cleverapps.styles.PrizeBarComponent.prize;
        FingerView.hintClick(this.present, {
            delay: 0.8,
            scale: styles.finger.scale,
            rotation: styles.finger.rotation
        });
    },

    addShine: function () {
        var shining = this.shine = new cleverapps.Spine(bundles.prize.jsons.prize_shine_json);
        shining.setPositionRound(this.prize.width / 2, this.prize.height / 2);
        shining.setAnimation(0, "idle", true);
        this.prize.addChild(shining, -1);
    },

    updateProgress: function (progress, goal) {
        this.progressBar.setPercentage(progress / goal * 100);
        this.progressBar.updateBarText(progress + "/" + goal);

        if (this.state !== PrizeBarComponent.STATE_COLLECTED) {
            this.setState(progress >= goal ? PrizeBarComponent.STATE_FULL : PrizeBarComponent.STATE_ACTIVE);
        }
    }
});

PrizeBarComponent.STATE_ACTIVE = 0;
PrizeBarComponent.STATE_FULL = 1;
PrizeBarComponent.STATE_COLLECTED = 2;

cleverapps.styles.PrizeBarComponent = {
    progressBar: {
        length: 400
    },
    prize: {
        x: { align: "right", dx: 50 },
        y: { align: "center", dy: 0 },
        width: 110,
        height: 110,
        maxScale: 1.4,
        flyY: 10,

        finger: {
            scale: 0.7,
            rotation: 20
        },

        present: {
            dy: 0
        }
    },
    mark: {
        x: { align: "right", dx: 80 },
        y: { align: "center", dy: 0 }
    }
};
