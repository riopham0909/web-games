/**
 * Created by vladislav on 06.09.2019
 */

var AutoScrollText = cc.Node.extend({
    ctor: function (messages, options) {
        this._super();

        this.options = options || {};
        this.styles = cleverapps.styles.AutoScrollText;

        this.setAnchorPoint2();
        this.setContentSize2(options.width, options.height);

        this.createTexts(messages);
        this.createArrow();
        this.currentTextIndex = 0;
        this.texts[this.currentTextIndex].setVisible(true);
    },

    createTexts: function (messages) {
        this.texts = [];
        messages.forEach(function (message) {
            var text = cleverapps.UI.generateOnlyText(message, this.options.font || cleverapps.styles.FONTS.WINDOW_TEXT);
            this.addChild(text);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setDimensions(this.width, 0);
            text.fitTo(undefined, this.height);
            text.setPositionRound(this.width / 2, this.height / 2);
            text.setVisible(false);

            this.texts.push(text);
        }.bind(this));
    },
    createArrow: function () {
        var arrowText = cleverapps.UI.generateOnlyText("▼", this.options.font || cleverapps.styles.FONTS.WINDOW_TEXT);

        var arrowClickArea = new cc.Node();
        arrowClickArea.setContentSize2(this.styles.arrow.width, this.styles.arrow.height);
        arrowClickArea.setAnchorPoint2();
        this.addChild(arrowClickArea);
        arrowClickArea.setPositionRound(this.styles.arrow);
        arrowClickArea.addChild(arrowText);
        arrowText.setPositionRound(arrowClickArea.width / 2, arrowClickArea.height / 2);

        cleverapps.UI.onClick(arrowClickArea, function() {
            this.next();
            this.reinitTimer();
        }.bind(this));
    },
    next: function () {
        this.texts[this.currentTextIndex].setVisible(false);
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        this.texts[this.currentTextIndex].setVisible(true);
    },
    reinitTimer: function () {
        this.stopAllActions();
        this.runAction(new cc.RepeatForever(new cc.Sequence(
            new cc.DelayTime(5),
            new cc.CallFunc(this.next.bind(this))
        )));
    },
    setTextByIndex: function (index) {
        if (this.texts[this.currentTextIndex]) {
            this.texts[this.currentTextIndex].setVisible(false)
        }
        this.currentTextIndex = index;
        this.texts[this.currentTextIndex].setVisible(true);
    }
});

cleverapps.styles.AutoScrollText = {
    arrow: {
        x: {align: 'right', dx: 0},
        y: {align: 'bottom', dy: -30},

        width: 40,
        height: 40
    }
};