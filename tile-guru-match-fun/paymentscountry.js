/**
 * Created by andrey on 06.06.2023.
 */

var PaymentsCountry = function () {
    HasInitialized.call(this);

    this.load();

    this.update();

    if (cleverapps.platform.oneOf(CleverApps)) {
        this.updateIpCode();
    }

    if (PaymentsCountry.isApplicable()) {
        cleverapps.timeouts.setTimeout(this.setInitialized.bind(this, true), cleverapps.parseInterval("1 minute"));
    } else {
        this.setInitialized(true);
    }
};

PaymentsCountry.prototype = Object.create(HasInitialized.prototype);
PaymentsCountry.prototype.constructor = PaymentsCountry;

PaymentsCountry.prototype.updateIpCode = function () {
    cleverapps.RestClient.get("/country/getbyip", {}, function (response) {
        var countryCode = response && response.countryCode;

        console.log("countryCode", countryCode);

        this.setIpCode(countryCode);
    }.bind(this));
};

PaymentsCountry.prototype.setCurrency = function (currency) {
    if (currency && this.currency !== currency) {
        this.currency = currency;
        this.save();

        this.update();
    }

    if (currency) {
        this.setInitialized(true);
    }
};

PaymentsCountry.prototype.setIpCode = function (ipCode) {
    if (ipCode && this.ipCode !== ipCode) {
        this.ipCode = ipCode;
        this.save();

        this.update();
    }

    if (ipCode) {
        this.setInitialized(true);
    }
};

PaymentsCountry.prototype.getCode = function () {
    return this.code;
};

PaymentsCountry.prototype.isRussia = function () {
    return this.code === "RU";
};

PaymentsCountry.prototype.update = function () {
    var code = this.calculateCode();

    if (this.code === code) {
        return;
    }

    this.code = code;

    this.updateDependents();
};

PaymentsCountry.prototype.setInitialized = function (initialized) {
    HasInitialized.prototype.setInitialized.call(this, initialized);

    this.updateDependents();
};

PaymentsCountry.prototype.updateDependents = function () {
    if (PaymentsCountry.isApplicable()) {
        cleverapps.paymentsManager && cleverapps.paymentsManager.onUpdateCountry();
        cleverapps.abTest && cleverapps.abTest.updateGroups();
    }
};

PaymentsCountry.prototype.calculateCode = function () {
    var byLanguage = WebViewPayments.DEBUG_IDFA.includes(cleverapps.platform.device.idfa) || XsollaPayments.DEBUG_IDS.includes(cleverapps.platform.getUserID());
    if (byLanguage) {
        return cleverapps.settings.language === PlatformInfo.LANGUAGE_RUSSIAN ? PaymentsCountry.RU : PaymentsCountry.OTHER;
    }

    if (this.ipCode) {
        return this.ipCode;
    }

    return PaymentsCountry.RUB === this.currency ? PaymentsCountry.RU : PaymentsCountry.OTHER;
};

PaymentsCountry.prototype.load = function () {
    var info = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.PAYMENTS_COUNTRY) || {};
    this.currency = info.currency;
    this.ipCode = info.ipCode;
};

PaymentsCountry.prototype.save = function () {
    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.PAYMENTS_COUNTRY, {
        currency: this.currency,
        ipCode: this.ipCode
    });
};

PaymentsCountry.isApplicable = function () {
    return cleverapps.platform.oneOf(AndroidPlatform, Rustore)
        || cleverapps.platform.oneOf(CleverApps) && !cleverapps.isLocalhost();
};

PaymentsCountry.RUB = "RUB";

PaymentsCountry.RU = "RU";
PaymentsCountry.OTHER = "other";
