/**
 * Created by vladislav on 9/6/2022
 */

var SPMobage = function (options) {
    Platform.call(this, options, "sp_mbga");

    this.info.isInApp = true;
    this.info.isMobile = true;
};

SPMobage.prototype = Object.create(Platform.prototype);
SPMobage.prototype.constructor = SPMobage;

SPMobage.prototype._connect = function (callback) {
    var onSuccess = function () {
        this.createFooter();

        callback(Platform.STATUS_CONNECTED);
    }.bind(this);

    var onFailure = function (reason) {
        if (reason === "timeout") {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_TIMEOUT);
        } else {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_SCRIPT_ERROR);
        }

        callback(Platform.STATUS_DISCONNECTED);
    };

    var sdkPath = cleverapps.config.debugMode ? cleverapps.SPMobageSocial.MOBAGE_API.SANDBOX : cleverapps.SPMobageSocial.MOBAGE_API.PRODUCTION;
    cleverapps.loadSdk(sdkPath, { onFailure: onFailure, crossorigin: false });

    document.addEventListener("mobageReady", function () {
        try {
            mobage.init({
                clientId: cleverapps.social.clientData.clientId,
                redirectUri: cleverapps.social.clientData.redirectUrl
            });
            onSuccess();
        } catch (e) {
            console.log("Mobage init fail", e);
            onFailure();
        }
    });
};

SPMobage.prototype.getLocalStoragePreffix = function () {
    return "_sp_mbga";
};

SPMobage.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_JAPANESE];
};

SPMobage.prototype.createFooter = function () {
    var getContentHtml = function () {
        var styles = "style='display: table-cell;\n"
            + "width: 25%;\n"
            + "text-align: center;\n"
            + "vertical-align: middle;\n"
            + "border-right: 1px solid #5f5f5f;\n"
            + "font-size: 80%;\n"
            + "color: #5f5f5f;\n"
            + "line-height: normal;\n"
            + "font-weight: bold;'";

        return "<div " + styles + " onclick='mobage.ui.show(\"portal\", {});'>Mobage</div>"
            + "<div " + styles + " onclick='mobage.ui.show(\"inquiry\", {});'>お問い合わせ</div>"
            + "<div " + styles + " onclick='mobage.ui.open(\"client_configuration\", {}, function() {});'>設定変更</div>"
            + "<div " + styles + " onclick='mobage.ui.show(\"commercial_transaction\");'>特定商取引法</div>";
    };

    var footer = document.createElement("div");
    footer.style.position = "absolute";
    footer.style.zIndex = "2";
    footer.style.bottom = "0";
    footer.style.height = "27px";
    footer.style.width = "100%";
    footer.style.background = "#e3e3e3";
    footer.style.display = "table";
    footer.innerHTML = getContentHtml();

    document.body.appendChild(footer);

    cleverapps.resolution.setContainerPadding({
        bottom: 27
    });
};