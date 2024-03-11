/**
 * Created by slava on 4/21/17.
 */

var MobileMyMailRuPayments = function () {
    MyMailRuPayments.call(this);
};

MobileMyMailRuPayments.prototype = Object.create(MyMailRuPayments.prototype);
MobileMyMailRuPayments.prototype.constructor = MobileMyMailRuPayments;

MobileMyMailRuPayments.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};

MobileMyMailRuPayments.prototype.stopPurchaseActions = function () {
    RestPayments.prototype.stopPurchaseActions.apply(this, arguments);

    this.closeWidgetWindow();
    this.stopWidgetChecker();
};

MobileMyMailRuPayments.prototype.purchaseOpen = function (product, callback) {
    this.setCancelTimeout(cleverapps.parseInterval("30 minutes"), callback);

    var request = cleverapps.getRequestParameters();
    var params = {
        appid: cleverapps.config.mm.appId,
        session_key: request.session_key,
        service_id: product.id.mymailru,
        service_name: product.title,
        mailiki_price: parseInt(product.loadedPrice),
        mob: 1
    };

    var query = [];
    for (var key in params) {
        if (key === "service_name") {
            var param = key + "=" + params[key].split("").map(function (char) {
                if (char.match(/[а-я]/i)) {
                    return char;
                }
                return encodeURIComponent(char);
            }).join("");
            query.push(param);
        } else {
            query.push(key + "=" + encodeURIComponent(params[key]));
        }
    }

    this.openWidgetWindow("http://m.my.mail.ru/cgi-bin/app/paymentm?" + query.join("&"));
    this.startWidgetChecker(product, callback);
};

MobileMyMailRuPayments.prototype.closeWidgetWindow = function () {
    if (this.widgetWindow) {
        this.widgetWindow.close();
        delete this.widgetWindow;
    }
};

MobileMyMailRuPayments.prototype.openWidgetWindow = function (query) {
    this.closeWidgetWindow();

    this.widgetWindow = window.open(query);
};

MobileMyMailRuPayments.prototype.stopWidgetChecker = function () {
    clearInterval(this.widgetChecker);
    delete this.widgetChecker;
};

MobileMyMailRuPayments.prototype.startWidgetChecker = function (product, callback) {
    this.stopWidgetChecker();

    var onWidgetProcessed = function () {
        this.closeWidgetWindow();
        this.stopWidgetChecker();

        if (this.getPurchaseState() === PaymentsManager.STATE_PURCHASE) {
            this.startPurchaseChecker(product, callback, {
                timeouts: cleverapps.arrayFill(15, "1 seconds")
            });
            this.setCancelTimeout(15000, callback);
        }
    }.bind(this);

    this.widgetChecker = setInterval(function () {
        try {
            var widgetWindow = this.widgetWindow;
            if (widgetWindow && widgetWindow.location
                && (!widgetWindow.location.href || widgetWindow.location.href.indexOf("vid=") >= 0)) {
                onWidgetProcessed();
            }
            // eslint-disable-next-line no-empty
        } catch (e) {
        }
    }.bind(this), 500);
};

MobileMyMailRuPayments.isAppropriate = function () {
    return cleverapps.platform instanceof MobileMyMailRu;
};
