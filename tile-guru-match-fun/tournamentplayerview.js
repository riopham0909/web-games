/**
 * Created by andrey on 27.02.18.
 */

var TournamentPlayerView = cc.Node.extend({
    ctor: function (player, competition) {
        this._super();
        this.player = player;
        this.competition = competition;
        this.game = Game.currentGame;

        var styles = cleverapps.styles.TournamentPlayerView;
        this.setContentSize2(styles.width, styles.height);
        this.setAnchorPoint2();
        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            this.setScale(0.8);
        }
        this.baseScale = this.getScale();

        this.colorNode = new cc.Node();
        this.colorNode.setContentSize2(this.getContentSize());
        this.colorNode.setAnchorPoint2();
        this.colorNode.setCascadeColorEnabled(true);
        this.colorNode.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(this.colorNode);

        var avatar = this.avatar = new cleverapps.UI.Avatar(player);
        avatar.setScale(styles.avatar.scale);
        avatar.setCascadeColorEnabled(false);
        this.colorNode.addChild(avatar);
        avatar.setLocalZOrder(-1);
        avatar.setPositionRound(styles.avatar);

        this.createName();

        this.addAmount();
        this.processPlaceAnimation();

        this.prevAmount = this.player.amount;

        this.setCascadeColorEnabled(true);
        this.addClickProcessing();
        this.competition.onChangeResultsListeners["player_" + this.player.id] = this.createListener(this.onChangeResults.bind(this));
        if (this.player.id === cleverapps.platform.getUserID()) {
            this.competition.onChangeResultsListeners.processPlaceAnimation = this.createListener(this.processPlaceAnimation.bind(this));
        }
    },

    createName: function () {
        var styles = cleverapps.styles.TournamentPlayerView;

        var name = this.player.name;

        if (!name) {
            cleverapps.throwAsync("No player name " + JSON.stringify(this.player));
            name = "Player_" + this.player.id.substr(-3);
        }

        if (name.indexOf(" ") > 0) {
            name = name.substring(0, name.indexOf(" "));
        }

        var nameBg = new cc.Sprite(bundles.tournament.frames.tournament_name_bg_png);
        this.colorNode.addChild(nameBg);
        nameBg.setPositionRound(styles.name.bg);
        this.name = cleverapps.UI.generateOnlyText(name, cleverapps.styles.FONTS.TOURNAMENT_PLAYER_TEXT);
        this.name.fitTo(nameBg.width - 2 * styles.name.padding.x);
        nameBg.addChild(this.name);
        this.name.setPositionRound(styles.name);
    },

    addClickProcessing: function () {
        if (cleverapps.config.debugMode) {
            cleverapps.UI.onClick(this, function () {
                Game.currentGame && Game.currentGame.discoverDebug(this.player);
            }.bind(this));
        }
    },

    addAmount: function () {
        var styles = cleverapps.styles.TournamentPlayerView.amount;

        var amountBg = new cc.Sprite(this.player.id === cleverapps.platform.getUserID() ? bundles.game.frames.tournament_mark_1_png : bundles.game.frames.tournament_mark_0_png);
        amountBg.setPositionRound(amountBg.width / 2, amountBg.height / 2);

        var amountNode = this.score = new cc.Node();
        amountNode.setAnchorPoint2();
        amountNode.setContentSize2(amountBg.getContentSize());
        amountNode.addChild(amountBg);
        amountNode.setCascadeColorEnabled(true);

        var amount = this.amountText = cleverapps.UI.generateImageText(this.player.amount + "", cleverapps.styles.FONTS.TOURNAMENT_PLAYER_TEXT);
        amountNode.addChild(amount);
        amount.setPositionRound(styles.text);

        this.colorNode.addChild(amountNode);
        amountNode.setPositionRound(styles);
        amountNode.setScale(styles.scale || 1);
    },

    onChangeResults: function (id) {
        if (id !== this.player.id) {
            return;
        }
        var styles = cleverapps.styles.TournamentPlayerView.amount;
        this.score.runAction(new cc.Sequence(
            new cc.Spawn(
                new cc.ScaleTo(0.4, 1.4).easing(cc.easeOut(3)),
                new cc.Sequence(
                    new cc.RotateTo(0.15, 15),
                    new cc.RotateTo(0.15, -15),
                    new cc.RotateTo(0.1, 0)
                )
            ),
            new cc.ScaleTo(0.15, styles.scale || 1)
        ));
        this.amountText.setString(this.player.amount + "");
    },

    processPlaceAnimation: function () {
        if (this.player.id !== cleverapps.platform.getUserID()) {
            return;
        }

        if (this.competition.calcPlace() < 3) {
            return;
        }

        if (this.competition.getFinishedOpponents().length === this.competition.results.length - 1) {
            return;
        }

        if (this.placeAnimationProcessing) {
            return;
        }

        var alarm = cleverapps.styles.COLORS.PLAYER_ALARM_COLOR;
        var white = cleverapps.styles.COLORS.WHITE;

        this.placeAnimationProcessing = true;
        this.colorNode.runAction(new cc.Sequence(
            new cc.TintTo(0.5, alarm.r, alarm.g, alarm.b),
            new cc.TintTo(0.5, white.r, white.g, white.b),
            new cc.CallFunc(function () {
                this.placeAnimationProcessing = false;
                this.processPlaceAnimation();
            }.bind(this))
        ));

        if (!this.framePulsation) {
            this.framePulsation = new cc.Sprite(bundles.tournament.frames.avatar_frame_red_png);
            this.avatar.addChild(this.framePulsation);
            this.framePulsation.setPositionRound(this.avatar.width / 2, this.avatar.height / 2);
            this.framePulsation.setLocalZOrder(-1);
            this.framePulsation.setColor(cc.color.RED);
            this.framePulsation.setContentSize2(this.avatar.width, this.avatar.height);
        }
        this.framePulsation.runAction(new cc.Sequence(
            new cc.ScaleTo(0.5, 1.2),
            new cc.ScaleTo(0.5, 1.0)
        ));
    },

    animateReorder: function (targetPosition) {
        var skipReorder = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? Math.abs(this.x - targetPosition.x) < 1 : Math.abs(this.y - targetPosition.y) < 1;
        if (skipReorder && this.player.amount === this.prevAmount && !this.reorderAnimationRunning) {
            return;
        }

        var isUp = targetPosition.y > this.y || this.player.amount > this.prevAmount;
        this.prevAmount = this.player.amount;

        this.reorderAnimationRunning = true;
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.Spawn(
                new cc.ScaleTo(0.2, this.baseScale * (isUp ? 1.2 : 0.9)),
                new cc.MoveTo(0.35, targetPosition).easing(cc.easeIn(1)),
                new cc.Sequence(
                    new cc.CallFunc(function () {
                        this.rotation = 0;
                    }.bind(this)),
                    new cc.DelayTime(0.08),
                    new cc.RotateBy(0.108, targetPosition.y > this.y ? 20 : 0).easing(cc.easeInOut(0.5)),
                    new cc.RotateBy(0.135, targetPosition.y > this.y ? -30 : 0),
                    new cc.RotateBy(0.027, targetPosition.y > this.y ? 10 : 0)
                ),
                new cc.Sequence(
                    new cc.DelayTime(0.3),
                    new cc.ScaleTo(0.2, this.baseScale)
                )
            ),
            new cc.CallFunc(function () {
                cleverapps.tooltipManager._hide();
                this.reorderAnimationRunning = false;
            }.bind(this))
        ));
    },

    animateResult: function (result) {
        var styles = cleverapps.styles.TournamentPlayerView;
        cleverapps.UI.animateDelta(result, {
            parent: this,
            font: cleverapps.styles.FONTS.TOURNAMENT_PLAYER_TEXT,
            x: this.width / 2 + styles.delta.x,
            y: this.height / 2 + styles.delta.y
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TOURNAMENT_PLAYER_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_BROWN
    }
});

cleverapps.styles.TournamentPlayerView = {
    width: 130,
    height: 110,
    scale: [1, 1, 1],

    avatar: {
        x: { align: "center" },
        y: { align: "center", dy: 10 },
        scale: 0.7
    },

    amount: {
        x: { align: "right", dx: 12 },
        y: { align: "bottom", dy: 3 },
        text: {
            x: { align: "center" },
            y: { align: "center" }
        }
    },

    name: {
        x: { align: "center" },
        y: { align: "center", dy: 3 },
        padding: {
            x: 17
        },
        bg: {
            width: 100,
            height: 40,
            x: { align: "center" },
            y: { align: "bottom" }
        }
    },

    delta: {
        x: 55,
        y: 0
    }
};