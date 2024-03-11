/**
 * Created by Andrey Popov 20 apr 2020
 */

var TileButton = cc.Node.extend({
    ctor: function (tileModel, options) {
        this._super();

        this.tileModel = tileModel;
        this.options = options || {};

        var styles = cleverapps.styles.TileButton;

        var button = this.button = new cleverapps.UI.Button({
            text: options.text || this.getText(),
            textOff: options.textOff || this.getText(true),
            width: options.width || styles.width,
            height: options.height || styles.height,
            type: options.type,
            onClicked: options.onClicked.bind(options, tileModel),
            mark: this.tileModel.isAttention()
        });

        if (tileModel.constructor === TileModel) {
            Lottery.addIcon(button, undefined, tileModel.product.itemId === "gold25000");
        }

        this.setAnchorPoint2();
        this.setContentSize2(button.getContentSize());
        this.addChild(button);
        button.setPositionRound(styles);
    },

    setString: function (string) {
        this.button.setString(string);
    },

    setStringOff: function (string) {
        this.button.setStringOff(string);
    },

    getText: function (disabled) {
        var free = !disabled && this.tileModel.getPrice() === 0;

        var text;
        if (this.options.buyParams && this.options.buyParams.videoBonus) {
            text = "##x2";
        } else if (disabled) {
            text = this.tileModel.getDisabledPrice();
        } else if (free) {
            text = "FREE";
        }

        return text || this.tileModel.getCurrentPrice();
    },

    enable: function () {
        this.button.enable();
    },

    disable: function () {
        this.button.disable();
    }
});

cleverapps.styles.TileButton = {
    x: { align: "center" },
    y: { align: "center", dy: -5 },
    width: 220,
    height: 90
};