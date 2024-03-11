/**
 * Created by Andrey Popov on 22/04/20
 */

var UseGoldButton = cleverapps.UI.Button.extend({
    ctor: function (options) {
        this.price = options.price;
        this.source = options.source;
        this.onFilterHandler = options.filter || function () {
            return true;
        };
        this.onClickHandler = function () {
            options.onClicked();
        };
        this.eventName = options.eventName;
        this.confirmWindowOptions = options.confirmWindowOptions;

        if (this.price && options.canCoins) {
            var mission = cleverapps.missionManager.findByType(Mission.TYPE_BOOSTTIME);
            if (mission && MissionManager.hasProperParent(mission)) {
                this.useCoins = true;
                this.price *= UseGoldButton.RUBY_COINS_RATE;
            }
        }

        this._super({
            width: options.width,
            height: options.height,
            text: this.getText(options.speedUp),
            onClicked: this.onClick.bind(this),
            type: options.type,
            disabled: options.disabled
        });
        this.adviceTarget = options.adviceTarget;
    },

    getText: function (speedUp) {
        if (!this.price) {
            return "UseGoldButton.free";
        }

        var string = this.useCoins ? "@@" + this.price : "$$" + this.price;

        if (speedUp) {
            string += ">>";
        }

        return string;
    },

    takeCurrency: function () {
        var source = this.source || this;
        return (this.useCoins) ? cleverapps.user.spendSoft(this.eventName, this.price, { source: source })
            : cleverapps.user.spendHard(this.eventName, this.price);
    },

    onClick: function () {
        if (this.confirmWindowOptions) {
            this.showConfirmWindow();
            return;
        }

        if (this.onFilterHandler() && this.takeCurrency()) {
            this.onClickHandler();
        }
    },

    showConfirmWindow: function () {
        var displayConfirmWindow = function () {
            new ConfirmSpeedUpWindow({
                price: this.confirmWindowOptions.price,
                timeLeft: this.confirmWindowOptions.timeLeft,
                totalDuration: this.confirmWindowOptions.totalDuration,
                eventName: this.eventName,
                callback: this.onClickHandler
            });
        }.bind(this);

        if (cleverapps.meta.isFocused()) {
            displayConfirmWindow();
            return;
        }

        cleverapps.meta.display({
            focus: "ConfirmSpeedUpWindow",
            action: function (f) {
                displayConfirmWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    }
});

UseGoldButton.RUBY_COINS_RATE = 5;