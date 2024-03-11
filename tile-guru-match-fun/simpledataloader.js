/**
 * Created by vladislav on 1/31/2024
 */

var SimpleDataLoader = function () {
    this.localStorage = window.localStorage;

    this.data = {};
};

SimpleDataLoader.prototype.load = function (key) {
    // eslint-disable-next-line no-prototype-builtins
    if (!this.data.hasOwnProperty(key)) {
        this.data[key] = this.localStorage.getItem(key);
    }

    var stored = this.data[key];

    if (stored !== null && stored !== undefined && stored !== "undefined" && !(cleverapps.platform instanceof Wechat && stored === "")) {
        return JSON.parse(stored);
    }

    return undefined;
};

SimpleDataLoader.prototype.save = function (key, data) {
    var string = JSON.stringify(data);

    this.data[key] = string;

    this.localStorage.setItem(key, string);
};

SimpleDataLoader.prototype.remove = function (key) {
    delete this.data[key];

    this.localStorage.removeItem(key);
};

SimpleDataLoader.INIT_TYPES = function (prefix) {
    for (var key in SimpleDataLoader.TYPES) {
        SimpleDataLoader.TYPES[key] = prefix + SimpleDataLoader.TYPES[key];
    }
};

SimpleDataLoader.TYPES = {
    USER_ID: "_user_id",
    SHORTCUT_CREATED: "_instant_shortcut_created",
    FRIENDS: "_friends",
    INVITABLE_FRIENDS: "_invitable_friends",
    PAYMENTS_HISTORY: "_my_payments",
    AD_WATCH_COUNTER: "_adviews",
    DRAUGIEM_AUTH_DATA: "_draugiem_auth_data",
    XSOLLA_ACCESS_TOKEN: "_xsolla_access_token",
    APPLE_SOCIAL: "_apple_social",
    MS_SOCIAL: "_ms_social",
    PAYMENTS_COUNTRY: "_payments_country",
    XSOLLA2_PAYMENTS_AUTH: "_xsolla2_payments_auth",
    PAYMENTS: "_payments",
    PREROLL_PLAYED: "_preroll_played"
};