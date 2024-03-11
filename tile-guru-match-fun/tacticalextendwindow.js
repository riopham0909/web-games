/**
 * Created by slava on 24.03.17.
 */

var TacticalExtendWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.TacticalExtendWindow;

        var animation = this.createAnimation();

        var text = this.createText();

        var content = new cleverapps.Layout([text, animation], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL
        });

        this._super({
            title: "TacticalExtendWindow.title",
            name: "tacticalextendwindow",
            content: content,
            button: {
                width: styles.button.width,
                height: styles.button.height,
                text: "$$" + TacticalExtendWindow.PRICE,
                onPressed: this.onPressed.bind(this)
            }
        });
    },

    getPerson: function () {
        return "hero";
    },

    createText: function () {
        var styles = cleverapps.styles.TacticalExtendWindow;

        var text = cleverapps.UI.generateOnlyText("TacticalExtendWindow.text", cleverapps.styles.FONTS.WINDOW_TEXT, {
            amount: TacticalExtendWindow.AMOUNT
        });
        text.setDimensions(styles.text.width, 0);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);

        return text;
    },

    createAnimation: function () {
        var styles = cleverapps.styles.TacticalExtendWindow;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(styles.animation);

        var animation = new cleverapps.Spine(bundles.tactical_extend_window.jsons.tactical_extend);
        animation.setSkin(cleverapps.config.name);
        animation.setAnimation(0, "addmoves", true);
        node.addChild(animation);
        animation.setPositionRound(styles.animation);

        return node;
    },

    onPressed: function () {
        if (!Game.currentGame) {
            this.close();

            return;
        }

        if (cleverapps.user.spendHard(cleverapps.EVENTS.SPENT.TACTICAL_EXTEND, TacticalExtendWindow.PRICE)) {
            this.giveMoves();

            this.close();
        }
    },

    giveMoves: function () {
        var moves = cleverapps.UI.generateImageText(TacticalExtendWindow.AMOUNT, cleverapps.styles.FONTS.MOVES_TEXT);
        moves.setPositionRound(this.buttons);
        this.buttons.parent.addChild(moves);

        moves.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.main.urls.shop_buy_effect),
            cleverapps.UI.animateCollect(moves, "moves", {
                duration: 0.7,
                scale: 1.5,
                collectEffect: true
            }),
            new cc.RemoveSelf()
        ));

        Game.currentGame.counter.setTimeout(function () {
            Game.currentGame.setMoves(Game.currentGame.moves + TacticalExtendWindow.AMOUNT);
        }, 700);
    },

    listBundles: function () {
        var bundles = ["tactical_extend_window"];

        if (cleverapps.config.rpg) {
            bundles.push("dialogues");
        }

        return bundles;
    }
});

TacticalExtendWindow.canShow = function () {
    if (!cleverapps.user.checkAvailable(TacticalExtendWindow.AVAILABLE)) {
        return false;
    }

    if (!levels.user.canTakeHard(TacticalExtendWindow.PRICE)) {
        return false;
    }

    var lastTime = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.BUY_MOVES_WINDOW) || 0;

    return Date.now() - lastTime > cleverapps.parseInterval(TacticalExtendWindow.INTERVAL) && Math.random() < TacticalExtendWindow.PROBABILITY;
};

TacticalExtendWindow.show = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.BUY_MOVES_WINDOW, Date.now());

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TACTICAL_EXTEND_SHOW);

    return new TacticalExtendWindow();
};

TacticalExtendWindow.PROBABILITY = 0.12;
TacticalExtendWindow.PRICE = 50;
TacticalExtendWindow.AMOUNT = 3;
TacticalExtendWindow.INTERVAL = "1 hour";

if (cleverapps.config.debugMode) {
    TacticalExtendWindow.INTERVAL = "1 minute";
}

TacticalExtendWindow.AVAILABLE = {
    level: 1.2
};

if (cleverapps.config.type === "merge") {
    TacticalExtendWindow.AVAILABLE = {
        disabled: true
    };
}

cleverapps.styles.TacticalExtendWindow = {
    margin: 30,

    text: {
        width: 500
    },

    animation: {
        width: 300,
        height: 300,

        x: { align: "center" },
        y: { align: "center" }
    },

    button: {
        width: 320,
        height: 120
    }
};
