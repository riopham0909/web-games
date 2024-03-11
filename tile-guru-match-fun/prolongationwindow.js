/**
 * Created by andrey on 29.06.2020
 */

var ProlongationWindow = Window.extend({
    onWindowLoaded: function (options) {
        options = options || {};

        this.prolongation = Game.currentGame.prolongation;

        this.type = options.type || Prolongation.TYPES.MOVES;
        this.onSuccess = options.onSuccess || function () {};
        this.onGiveUp = options.onGiveUp || function () {};
        this.canGiveUp = cleverapps.config.type !== "klondike";
        this.offer = options.offer || this.prolongation.getOffer(this.type);

        if (cleverapps.gameModes.skipProlongation) {
            this.onGiveUp();
            return;
        }

        this.prolongation.onCompleteOffer = function () {
            this.canGiveUp = true;
            this.skipAlert = true;
            this.close();
        }.bind(this);

        this.haveForce = (this.offer.priceType === "free");

        var allowExit = !this.haveForce;

        this._super({
            title: options.title || "ProlongationWindow.title",
            name: "prolongationwindow",
            content: this.createContent(),
            styles: cleverapps.styles.ProlongationWindow.window,
            closeButton: allowExit,
            notCloseByTouchInShadow: true,
            openSound: bundles.prolongation_window.urls.continue_effect
        });

        this.prolongation.onAddMoves = this.createListener(this.onAddMoves.bind(this));
        var currencyControl = cleverapps.config.soft ? "MenuBarCoinsItem" : "MenuBarGoldItem";
        cleverapps.meta.showControlsWhileFocused(currencyControl);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.MOVES_SHOW);

        cleverapps.windows.list.forEach(function (window) {
            if (window.name === "confirmexitwindow") {
                window.close();
            }
        });
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "sad"
        };
    },

    close: function () {
        if (!this.skipAlert) {
            this.skipAlert = true;

            var message = this.prolongation.getAlertMessage();
            if (message) {
                this.showGiveUpAlert(message);
                return;
            }
        }

        this._super();
    },

    createContent: function () {
        var styles = cleverapps.styles.ProlongationWindow;

        var items = [];

        var question = cleverapps.UI.generateTTFText(this.prolongation.getText(this.type), cleverapps.styles.FONTS.WINDOW_TEXT);
        question.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        question.setDimensions(styles.question.width, 0);
        question.fitTo(undefined, styles.question.height);
        items.push(question);

        if (cleverapps.config.type === "match3" && this.type !== Prolongation.TYPES.BOMB) {
            items.push(this.createGoals());
        }

        this.offerView = new ProlongationOfferView(this.prolongation, this.offer);

        items.push(this.offerView);

        return new cleverapps.Layout(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    },

    addFinger: function () {
        if (FingerView.isRunning(this.finger) || this.haveForce) {
            return;
        }

        this.finger = FingerView.hintClick(this.offerView.button, {
            delay: 0.8
        });
    },

    removeFinger: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    },

    createGoals: function () {
        var styles = cleverapps.styles.ProlongationWindow.goals;

        var views = this.createGoalIcons();

        var layout = new cleverapps.Layout(views, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin,
            padding: styles.padding
        });

        if (bundles.prolongation_window.frames.goals_bg_png) {
            var background = new cc.Scale9Sprite(bundles.prolongation_window.frames.goals_bg_png);
            background.setContentSize(layout.getContentSize());
            background.setPositionRound({ align: "center" }, { align: "center" });
            background.setLocalZOrder(-1);
            layout.addChild(background);
        }

        return layout;
    },

    showGiveUpAlert: function (message) {
        var rects = [];

        if (this.offerView.button) {
            rects.push(this.offerView.button.getGlobalBoundingBox());
        }

        var alertView = new MinimalDialogue({
            items: [message, new BreakViews(true, cleverapps.styles.FONTS.FORCE_MESSAGE_TEXT)],
            rects: rects
        });
        this.addChild(alertView);
        alertView.display();

        cleverapps.audio.playSound(bundles.game.urls.giveup_alert_effect);
    },

    onShow: function () {
        if (this.closed) {
            return;
        }

        if (!Game.currentGame || Game.currentGame.outcome !== GameBase.OUTCOME_UNKNOWN) {
            this.close();
            return;
        }

        this._super();

        this.offerView.onShow();

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.CallFunc(this.addFinger.bind(this))
        ));
    },

    onHide: function () {
        this.removeFinger();

        this.offerView.stopAllActions();

        this._super();
    },

    onClose: function () {
        this.removeFinger();

        if (this.canGiveUp) {
            this.onGiveUp();
        }
    },

    onAddMoves: function (moves, options) {
        this.skipAlert = true;
        this.canGiveUp = false;

        if (cleverapps.config.type === "match3") {
            this.animateAddMoves(moves, options);
        }

        if (this.hint) {
            this.hint.close();
        }

        this.onSuccess();
        this.close();
    },

    animateAddMoves: function (movesAmount, options) {
        if (this.collectAnimationFinished) {
            return;
        }

        this.collectAnimationFinished = true;

        var moves;
        if (cleverapps.config.name === "runes") {
            moves = new cc.Sprite(bundles.moves.frames.moves_icon);
        } else {
            moves = cleverapps.UI.generateOnlyText(movesAmount, cleverapps.styles.FONTS.MOVES_TEXT);
        }
        moves.setPosition(this.window.width / 2, this.offerView.y);
        this.window.addChild(moves);

        moves.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.main.urls.shop_buy_effect),
            cleverapps.UI.animateCollect(moves, "moves", {
                scale: 1.5,
                duration: options.delay / 1000
            }),
            new cc.RemoveSelf()
        ));
    },

    createGoalIcons: function () {
        var styles = cleverapps.styles.ProlongationWindow.goals;

        var goalIcons = [];
        for (var type in Game.currentGame.goals.elements) {
            var curElem = Game.currentGame.goals.elements[type];
            var goalView = curElem.getView();
            var options = {};
            if (goalView.actor) {
                options.skin = goalView.actor.currSkin;
                options.spine = goalView.actor.currSpine;
                options.scales = styles.scales;
            }
            var icon = GoalViewFactory.createView(curElem, options);
            goalIcons.push(new WindowGoalView(curElem, icon));
        }
        return goalIcons;
    },

    getPreferredBundles: function () {
        return ["game"];
    }
});

cleverapps.styles.ProlongationWindow = {
    margin: 20,

    padding: {
        bottom: 20
    },

    goals: {
        margin: 30,
        padding: {
            x: 30,
            y: 20
        },

        scales: undefined
    },

    question: {
        width: 600,
        height: 200,
        x: { align: "center" },
        y: { align: "center", dy: 125 }
    },

    underline: {
        x: { align: "left", dx: 0 },
        y: { align: "bottom", dy: -2 },
        height: 3
    }
};
