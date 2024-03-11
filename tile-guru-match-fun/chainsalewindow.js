/**
 * Created by olga on 24.01.2024
 */

var ChainSaleWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.logic = mission.logic;

        this._super({
            title: "ChainSaleWindow.title",
            name: "ChainSaleWindow",
            noBackground: true,
            content: this.createContent(),
            openSound: bundles.chain_sale.urls.chain_sale_window_effect
        });

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.CHAIN_SALE_OPEN);

        mission.onChangeResults = this.createListener(this.onChangeResults.bind((this)));
    },

    createContent: function () {
        var styles = cleverapps.styles.ChainSaleWindow;
        var tilesNode = this.createTiles();
        var timer = this.timer = this.createTimer();
        var footnote = this.footnote = cleverapps.UI.generateTTFText("ChainSaleWindow.Footnote", cleverapps.styles.FONTS.CHAIN_SALE_FOOTNOTE_TEXT);
        footnote.setDimensions(styles.footnote.width, 0);
        footnote.fitTo(undefined, styles.footnote.height);
        footnote.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.content = new cleverapps.Layout([tilesNode, footnote, timer], {
            direction: cleverapps.UI.VERTICAL,
            margin: cleverapps.styles.ChainSaleWindow.margin
        });

        this.createBg();
        return this.content;
    },

    onChangeResults: function () {
        if (this.logic.isAllSold()) {
            this.runAction(new cc.Sequence(
                new cc.DelayTime(1.5),
                new cc.CallFunc(function () {
                    this.close();
                }.bind(this))
            ));
            return;
        }

        var lots = this.logic.currentLots();
        var newLot = lots[ChainSaleLogic.VISIBLE_LOTS - 1];

        var collectedTile = this.tiles[0];
        this.tiles = this.tiles.slice(1);
        collectedTile.hideAnimation(1.1);

        var slots = this.getTileSlots(lots.length);
        if (newLot) {
            var newTile = this.createTile(newLot);
            newTile.setPosition(slots[ChainSaleLogic.VISIBLE_LOTS - 1]);
            this.tilesNode.addChild(newTile);
            this.tiles.push(newTile);
            newTile.appearAnimation(1.55);
        }

        this.tiles.forEach(function (tile, index) {
            if (tile === newTile) {
                return;
            }
            var finishPosition = slots[index];
            tile.runAction(new cc.Sequence(
                new cc.DelayTime(1.3),
                new cc.MoveTo(0.3, finishPosition).easing(cc.easeBackIn()),
                new cc.CallFunc(function () {
                    if (index === 0) {
                        tile.open();
                    }
                })
            ));
        });
    },

    getTileSlots: function (length) {
        var slots = [];
        var styles = cleverapps.styles.ChainSaleWindow.tile;
        var x = styles.width / 2 + (this.tilesNode.width - (styles.width + styles.margin) * length - styles.margin) / 2;
        var y = styles.height / 2;
        for (var i = 0; i < length; i++) {
            slots.push(cc.p(x, y));
            x += styles.width + styles.margin;
        }

        return slots;
    },

    createTiles: function () {
        var tilesAmount = 3;
        var styles = cleverapps.styles.ChainSaleWindow.tile;
        var tilesNode = this.tilesNode = new cc.Node();
        tilesNode.setAnchorPoint(0.5, 0.5);
        tilesNode.setContentSize(styles.width * tilesAmount + styles.margin * (tilesAmount - 1), styles.height);
        this.tiles = [];
        var lots = this.logic.currentLots();
        var slots = this.getTileSlots(lots.length);
        for (var i = 0; i < lots.length; i++) {
            var view = this.createTile(lots[i]);
            view.setPositionRound(slots[i]);
            this.tiles.push(view);
            this.tilesNode.addChild(view);
        }
        return tilesNode;
    },

    createTile: function (stage) {
        return new ChainSaleLot(stage, this.logic);
    },

    createTimer: function () {
        var styles = cleverapps.styles.ChainSaleWindow.timer;

        var finishTimerText = cleverapps.UI.generateTTFText("ChainSaleWindow.FinishTimerText", cleverapps.styles.FONTS.CHAIN_SALE_FOOTNOTE_TEXT);
        finishTimerText.setVisible(false);

        var timeLeft = this.logic.mission.getTimeLeft();
        if (timeLeft > 0) {
            timeLeft = new cleverapps.CountDown(timeLeft, {
                onFinish: this.createListener(function () {
                    finishTimerText.setVisible(true);
                    this.countdown.setVisible(false);
                }.bind(this))
            });
        }

        var countdown = this.countdown = new cleverapps.CountDownView(timeLeft, {
            timerPosition: styles.text,
            font: cleverapps.styles.FONTS.CHAIN_SALE_TIMER_TEXT,
            icon: bundles.big_timer.frames.big_timer_png,
            background: {
                frame: bundles.big_timer.frames.big_timer_bg_png,
                width: styles.width,
                height: styles.height
            }
        });

        var wrapper = new cc.Node();
        wrapper.setContentSize2(countdown.getContentSize());
        wrapper.setAnchorPoint2();
        wrapper.addChild(countdown);
        countdown.setPositionRound(wrapper.width / 2, wrapper.height / 2);
        wrapper.addChild(finishTimerText);
        finishTimerText.setPositionRound(wrapper.width / 2, wrapper.height / 2);
        wrapper.setPositionRound(styles);

        return wrapper;
    },

    createBg: function () {
        var styles = cleverapps.styles.ChainSaleWindow.bg;
        var bg = new cleverapps.Spine(bundles.chain_sale.jsons.chain_sale_bg_json);
        bg.setAnimationAndIdleAfter("open", "idle");
        bg.setPositionRound(styles);
        bg.setLocalZOrder(-1);
        this.content.addChild(bg);
    },

    onShow: function () {
        var step = 0.2;
        for (var index = this.tiles.length - 1; index >= 0; index--) {
            var delay = 0.65 + step * index * 0.5;
            this.tiles[index].appearAnimation(delay);
        }

        this.windowTitle.setVisible(false);
        this.windowTitle.setScale(0.2, 1);
        this.windowTitle.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.Show(),
            new cc.ScaleTo(0.6, 1, 1).easing(cc.easeElasticOut(0.6))
        ));

        [this.timer, this.footnote].forEach(function (item) {
            item.setOpacity(0);
            item.setVisible(false);
            item.runAction(new cc.Sequence(
                new cc.DelayTime(0.95),
                new cc.Show(),
                new cc.FadeIn(0.15)
            ));
        });

        this._super();
    },

    beforeCloseAnimation: function (callback) {
        if (this.closeButton instanceof BandButton) {
            this.closeButton.hide();
        }

        [this.timer, this.footnote, this.windowTitle].forEach(function (item) {
            item.runAction(new cc.Sequence(
                new cc.FadeOut(0.15)
            ));
        });

        var step = 0.075;
        callback = cleverapps.wait(this.tiles.length, callback);
        for (var index = this.tiles.length - 1; index >= 0; index--) {
            this.tiles[index].runAction(new cc.Sequence(
                new cc.DelayTime(step * index * 0.5),
                new cc.Spawn(
                    new cc.ScaleTo(0.3, 0).easing(cc.easeBackIn()),
                    new cc.Sequence(
                        new cc.DelayTime(0.2),
                        new cc.FadeTo(0.1, 0.3)
                    )
                ),
                new cc.CallFunc(callback)
            ));
        }
    },

    listBundles: function () {
        return ["chain_sale"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CHAIN_SALE_FOOTNOTE_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE
    },
    CHAIN_SALE_TIMER_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.ChainSaleWindow = {
    margin: 20,
    timer: {
        text: {
            x: { align: "center", dx: -3 },
            y: { align: "center", dy: 2 }
        },
        width: 250,
        height: 67,
        x: { align: "center", dx: 0 },
        y: { align: "top", dy: -122 }
    },
    bg: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 }
    },

    tile: {
        width: 480,
        height: 700,
        margin: 10
    },

    tiles: {
        width: 1430,
        height: 700

    },

    footnote: {
        width: 1400,
        height: 60
    }
};
