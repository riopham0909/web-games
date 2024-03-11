/**
 * Created by andrey on 21.04.17.
 */

var VersionChecker = function () {
    this.serverVersion = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SERVER_VERSION, { raw: true });
    this.clientVersion = undefined;
};

VersionChecker.prototype.check = function () {
    cleverapps.RestClient.get("/", {}, function (response) {
        this.serverVersion = response;
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SERVER_VERSION, response, { raw: true });
    }.bind(this), function () {
        console.log("Error getting server version in VersionChecker!");
    });
};

VersionChecker.prototype.needUpdate = function () {
    if (!this.serverVersion) {
        return false;
    }

    // need update if first number increase - major version
    var client = parseInt(cleverapps.config.version);
    var server = parseInt(this.serverVersion);
    return client < server;
};

VersionChecker.prototype.isNewClientVersionAvailable = function () {
    return this.clientVersion && this.clientVersion !== cleverapps.config.version;
};

VersionChecker.prototype.isClientVersionActual = function () {
    return this.clientVersion && this.clientVersion === cleverapps.config.version;
};

VersionChecker.prototype.loadClientVersion = function (callback) {
    callback = callback || function () {};

    if (cc.sys.isNative || cleverapps.isLocalhost() || cleverapps.platform.oneOf(Instant, GDCom, Huzcom)) {
        this.clientVersion = cleverapps.config.version;
        callback();
        return;
    }

    var versionPath = cleverapps.config.staticUrl + "version.json";

    cleverapps.RestClient.get(versionPath, {}, function (json) {
        console.log("loaded current client version - " + json.version);
        this.clientVersion = json.version;
        callback();
    }.bind(this), function () {
        console.log("error loading client version from path - " + versionPath);
        callback();
    });
};
