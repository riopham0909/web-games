/**
 * Created by vladislav on 11/1/2023
 */

var AdOcean = function () {
    this.queue = [];

    this.clueToken = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.AD_OCEAN_TOKEN);
};

AdOcean.prototype.requestClueToken = function () {
    if (this.clueToken) {
        return;
    }

    var clientToken = wx.getLaunchOptionsSync().query.clue_token || -1;

    var path = "/adocean/cluetoken/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/" + encodeURIComponent(clientToken);

    cleverapps.RestClient.get(path, {}, function (response) {
        if (response.errmsg || response.errcode) {
            this._logError("AdOcean.requestClueToken error: " + (response.errmsg || response.errcode));

            return;
        }

        var clueToken = response.clueToken;

        console.log("AdOcean.requestClueToken success token: " + clueToken + ", status: " + AdOcean.STATUS[response.status]);

        if (clueToken) {
            this.setClueToken(clueToken);
        }
    }.bind(this), function (response) {
        this._logError("AdOcean.requestClueToken fail clientToken: " + clientToken + ", response: " + JSON.stringify(response));
    }.bind(this));
};

AdOcean.prototype.setClueToken = function (clueToken) {
    this.clueToken = clueToken;

    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.AD_OCEAN_TOKEN, clueToken);

    for (var i = 0; i < this.queue.length; i++) {
        this.logEvent(this.queue[i].type, this.queue[i].data);
    }
    this.queue = [];
};

AdOcean.prototype.logEvent = function (type, data) {
    if (!this.clueToken) {
        if (this.queue.length < AdOcean.QUEUE_LIMIT) {
            this.queue.push({
                type: type,
                data: data
            });
        }

        return;
    }

    var path = "/adocean/event/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/" + encodeURIComponent(this.clueToken) + "/" + type;

    var props = {};
    if (type === AdOcean.EVENT_ACTIVE_PAY) {
        props.pay_amount = Math.floor(data.price * 100);
    }

    cleverapps.RestClient.post(path, { props: props }, function (response) {
        if (response.errmsg || response.errcode) {
            this._logError("AdOcean.reportEvent error: " + (response.errmsg || response.errcode) + ", clueToken: " + this.clueToken);

            return;
        }

        console.log("AdOcean.reportEvent success, type: " + type + ", data: " + JSON.stringify(data) + ", clueToken: " + this.clueToken);
    }.bind(this), function (response) {
        this._logError("AdOcean.reportEvent fail clueToken: " + this.clueToken + ", response: " + JSON.stringify(response));
    }.bind(this));
};

AdOcean.prototype._logError = function (message) {
    console.log(message);

    if (cleverapps.config.debugMode) {
        cleverapps.notification.create(message);
    }
};

AdOcean.STATUS = {};
AdOcean.STATUS[0] = "no clue token";
AdOcean.STATUS[1] = "found saved token";
AdOcean.STATUS[2] = "token activated";

AdOcean.EVENT_REGISTRATION = 1;
AdOcean.EVENT_ACTIVE_PAY = 2;
AdOcean.EVENT_NEXT_DAY_OPEN = 2;

AdOcean.EVENTS_MAP = {};
AdOcean.EVENTS_MAP[cleverapps.EVENTS.GENERAL.TUTORIAL_COMPLETE] = AdOcean.EVENT_REGISTRATION;
AdOcean.EVENTS_MAP[cleverapps.EVENTS.STATS.PAYMENTS] = AdOcean.EVENT_ACTIVE_PAY;
AdOcean.EVENTS_MAP[cleverapps.EVENTS.TARGET_FOR_BUYING.RETENTION_1] = AdOcean.EVENT_NEXT_DAY_OPEN;

AdOcean.QUEUE_LIMIT = 100;

AdOcean.IsAvailable = function () {
    return false;

    // return cleverapps.platform instanceof Wechat;
};