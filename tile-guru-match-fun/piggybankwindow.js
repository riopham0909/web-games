/**
 * Created by slava on 11/9/18
 */

var PiggyBankWindow = Window.extend({
    onWindowLoaded: function () {
        var leftTime = cleverapps.piggyBank.getLeftTime();

        if (leftTime <= 0) {
            return;
        }

        var styles = cleverapps.styles.PiggyBankWindow;

        var animation = this.createAnimation();

        var balance = this.createBalance();

        var timer = this.createTimer(leftTime);

        var topText = this.createTopText();

        var emptyMargin = new cc.Node();
        emptyMargin.setContentSize2(0, styles.amount.margin);

        var content = new cleverapps.Layout([topText, emptyMargin, balance, animation, timer], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });

        this._super({
            name: "piggybankwindow",
            title: cleverapps.piggyBank.isFull() ? "PiggyBankWindow.Title.Full" : "PiggyBankWindow.Title",
            content: content,
            button: {
                width: styles.button.width,
                height: styles.button.height,
                text: cleverapps.piggyBank.getCurrentPrice(),
                onPressed: function () {
                    cleverapps.piggyBank.buy(this.close.bind(this));
                }.bind(this)
            },
            help: function () {
                new GuideWindow({
                    name: "PiggyBankRulesWindow"
                });
            },
            styles: cleverapps.styles.PiggyBankWindow,
            openSound: bundles.main.urls.shop_buy_effect
        });

        Lottery.addIcon(this.button);
        Lottery.addText(this);
    },

    createAnimation: function () {
        var pig = new cleverapps.Spine(bundles.piggy_bank.jsons.piggy_bank_json);
        pig.setAnimation(0, cleverapps.piggyBank.isFull() ? "piggy_full" : "piggy_bank", true);

        return pig;
    },

    createBalance: function () {
        var styles = cleverapps.styles.PiggyBankWindow;

        var savingsText = cleverapps.UI.generateOnlyText("Balance", cleverapps.styles.FONTS.WINDOW_TEXT);
        savingsText.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        savingsText.setDimensions(0, styles.text.height);

        var goldAmountBg = cleverapps.UI.createScale9Sprite(bundles.timer.frames.timer_bg_png);
        goldAmountBg.setContentSize2(styles.amount.width, styles.amount.height);

        var coinAndAmount = new TextWithIcon((cleverapps.piggyBank.getCurrentAmount()), {
            font: cleverapps.styles.FONTS.WHITE_TEXT
        });

        coinAndAmount.setPositionRound(goldAmountBg.width / 2, goldAmountBg.height / 2);
        goldAmountBg.addChild(coinAndAmount);

        return new cleverapps.Layout([savingsText, goldAmountBg], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.timer.margin.x
        });
    },

    createTimer: function (leftTime) {
        var styles = cleverapps.styles.PiggyBankWindow;

        var text = cleverapps.UI.generateOnlyText("PiggyBankWindow.text2", cleverapps.styles.FONTS.WINDOW_TEXT);
        text.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.fitTo(styles.timer.text.width);

        var timerBg = cleverapps.UI.createScale9Sprite(bundles.timer.frames.timer_bg_png);
        timerBg.setContentSize2(styles.timer.width, styles.timer.height);
        var stylesCountdownView = {
            background_content: timerBg,
            font: cleverapps.styles.FONTS.SMALL_WHITE_TEXT,
            timerPosition: styles.timer
        };

        var timer = new cleverapps.CountDownView(new cleverapps.CountDown(leftTime, {
            onFinish: function () {
                this.close();
            }.bind(this)
        }), stylesCountdownView);

        timer.y = styles.timer.offsetY;

        return new cleverapps.Layout([text, timer], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.timer.margin.x
        });
    },

    createTopText: function () {
        var styles = cleverapps.styles.PiggyBankWindow;

        var msg = cleverapps.piggyBank.isFull() ? "PiggyBankWindow.text1.Full" : "PiggyBankWindow.text1";

        var product = cleverapps.piggyBank.getProduct();

        var text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.WINDOW_TEXT, {
            price: Product.ReplaceIconCodes(product.getCurrentPrice())
        });

        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);
        text.fitTo(undefined, styles.text.height);
        return text;
    }
});

PiggyBankWindow.prototype.listBundles = function () {
    return ["piggy_bank_window"];
};

cleverapps.styles.PiggyBankWindow = {
    margin: 20,

    amount: {
        width: 260,
        height: 64,

        margin: 10
    },

    text: {
        width: 640,
        height: 150
    },

    button: {
        width: 300,
        height: 100
    },

    timer: {
        text: {
            width: 400
        },
        width: 220,
        height: 50,
        margin: {
            x: 30
        },
        offsetY: -5,
        x: 0,
        y: 0
    }
};
