/**
 * Created by vladislav on 9/6/2022
 */

var MobileMyMailRu = function (options) {
    MyMailRu.call(this, options, "mobile_mm");

    this.info.isInApp = true;
    this.info.isMobile = true;
};

MobileMyMailRu.prototype = Object.create(MyMailRu.prototype);
MobileMyMailRu.prototype.constructor = MobileMyMailRu;

MobileMyMailRu.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};

MobileMyMailRu.prototype.createHeaderAndFooter = function (callback) {
    var req = cleverapps.getRequestParameters();

    mailru.callhf = function (data) {
        var header = document.createElement("div");
        header.style.position = "absolute";
        header.style.top = "0";
        header.style.height = "48px";
        header.style.width = "100%";
        header.style.zIndex = "2";
        header.innerHTML = data.header;
        document.body.insertBefore(header, document.body.firstChild);

        var footer = document.createElement("div");
        footer.style.position = "absolute";
        footer.style.bottom = "0";
        footer.style.height = "27px";
        footer.style.width = "100%";
        footer.style.zIndex = "2";
        footer.innerHTML = data.footer;
        document.body.appendChild(footer);

        cleverapps.resolution.setContainerPadding({
            top: 48,
            bottom: 27
        });

        callback();
    };

    var params = {
        method: "mobile.getCanvas",
        app_id: req.app_id,
        cb: "mailru.callhf",
        session_key: req.session_key,
        mobile_spec: req.mobile_spec
    };
    params = mailru.utils.sign(params);

    mailru.utils.apiOverJSONP(params, "https://appsmail.ru/platform/api");
};