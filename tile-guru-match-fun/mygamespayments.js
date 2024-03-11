/**
 * Created by spepa on 23.08.2022
 */

var MygamesPayments = function () {
    RestPayments.call(this);
    this.currency = (new URLSearchParams(window.location.search)).get("ui_currency") || "RUB";

    for (var id in cleverapps.config.products) {
        var product = cleverapps.config.products[id];
        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = id;
    }
};

MygamesPayments.prototype = Object.create(RestPayments.prototype);
MygamesPayments.prototype.constructor = MygamesPayments;

MygamesPayments.prototype.calcLoadedPrice = function (price) {
    var rate = cleverapps.EXCHANGE_RATES[this.currency];
    if (this.currency === "RUB") {
        price = Math.floor(price * cleverapps.RUB_DISCOUNTED_RATE);
    } else if (rate) {
        price = Math.ceil(price * rate);
    }

    if (MygamesPayments.TESTERS.indexOf(cleverapps.platform.getUserID()) !== -1) {
        price = Math.ceil(price / 1000);
    }

    var symbol = Product.CURRENCY_SIGNS[this.currency] || this.currency;
    return price + " " + symbol;
};

MygamesPayments.prototype.purchaseOpen = function (product, callback) {
    var data = {
        uid: cleverapps.platform.getUserID(),
        currency: this.currency,
        item_id: product.key,
        amount: parseFloat(product.loadedPrice),
        additional_param: "",
        description: product.description
    };

    cleverapps.RestClient.post("/mygamespayments", data, function (res) {
        if (res.error) {
            console.log(res.error);
            callback(cleverapps.CODE_FAILED);
        } else {
            window.electronApi.showPayment(res.url);
        }
    });
};

MygamesPayments.isAppropriate = function () {
    return cleverapps.platform instanceof Mygames;
};

MygamesPayments.TESTERS = [
    "223914816",
    "224977482",
    // "224974534",
    "224977211",
    "224977565"
];