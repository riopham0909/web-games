/**
 * https://doc.gravity-engine.com/turbo-integrated/mini-program/wechat/mp-sdk.html
 * https://doc.gravity-engine.com/turbo-integrated/before_deploy.html
 *
 * Created by vladislav on 12/25/2023
 */

var GravityEngine = function () {
    this.connected = false;

    this.queue = [];

    this.connect();

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, this.connect.bind(this));
    cleverapps.timeouts.setInterval(this.connect.bind(this), cleverapps.parseInterval("2 minutes"));
};

GravityEngine.prototype.updateUserId = function () {
    this.connected = false;

    this.connect();
};

GravityEngine.prototype.connect = function () {
    if (cleverapps.platform.haveTmpId() || this.connected || this.connecting) {
        return;
    }

    this.connecting = true;

    var config = {
        accessToken: cleverapps.config.wechat.gravityEngine.accessToken,
        clientId: cleverapps.platform.getUserID(),
        autoTrack: {
            appLaunch: true,
            appShow: true,
            appHide: true
        },
        name: "ge",
        sendTimeout: 20000,
        debugMode: cleverapps.config.debugMode && "debug"
    };

    this.gravityEngine = new GravityEngineAPI(config);
    this.gravityEngine.setupAndStart();

    this.gravityEngine.initialize({
        name: cleverapps.platform.getUserID(),
        version: GravityEngine.VERSION,
        openid: cleverapps.platform.getUserID()
    })
        .then(function (res) {
            this.connecting = false;
            this.connected = true;

            console.log("GravityEngine.initialize success " + JSON.stringify(res));

            if (this.connectionError) {
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.GRAVITY_RECONNECT);
            }

            this.gravityEngine.registerEvent();

            for (var i = 0; i < this.queue.length; i++) {
                this.send(this.queue[i].method, this.queue[i].properties);
            }
            this.queue = [];
        }.bind(this))
        .catch(function (err) {
            this.connecting = false;

            if (!this.connectionError) {
                this.connectionError = true;

                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.GRAVITY_INIT_ERROR);
            }

            console.log("GravityEngine.initialize failed " + JSON.stringify(err));

            if (cleverapps.config.debugMode) {
                cleverapps.notification.create("GravityEngine.initialize failed" + JSON.stringify(err));
            }
        }.bind(this));
};

GravityEngine.prototype.logPurchase = function (product, purchase) {
    this.send("payEvent", { product: product, purchase: purchase });
};

GravityEngine.prototype.logAd = function (name) {
    this.send("adShowEvent", { name: name });
};

GravityEngine.prototype.send = function (method, properties) {
    if (!this.connected) {
        this.queue.push({ method: method, properties: properties });
        if (this.queue.length > GravityEngine.QUEUE_LIMIT) {
            this.queue.shift();
        }
        return;
    }

    switch (method) {
        case "payEvent":
            var product = properties.product || {};
            var purchase = properties.purchase || {};

            console.log("GravityEngine.payEvent", product.loadedPriceAmount * 100, "CNY", purchase.paymentId, "" + product.key);
            this.gravityEngine.payEvent(product.loadedPriceAmount * 100, "CNY", purchase.paymentId, "" + product.key, "WeChat");
            break;
        case "adShowEvent":
            console.log("GravityEngine.adShowEvent", properties.name, cleverapps.config.wechat.rewarded);
            this.gravityEngine.adShowEvent(properties.name, cleverapps.config.wechat.rewarded);
            break;
    }
};

GravityEngine.QUEUE_LIMIT = 100;

GravityEngine.VERSION = 475;

GravityEngine.IsAvailable = function () {
    return cleverapps.platform.oneOf(Wechat) && cleverapps.config.wechat && cleverapps.config.wechat.gravityEngine;
};