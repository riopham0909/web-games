/**
 * Created by vladislav on 9/6/2022
 */

var PlatformManager = {
    create: function (options) {
        var platforms = {
            microsoft: Microsoft,
            msstart: MSStart,
            gdcom: GDCom,
            instant: Instant,
            mobile_ok: MobileOK,
            web_ok: OKPlatform,
            mobile_mm: MobileMyMailRu,
            web_mm: MyMailRu,
            mobile_vk: MobileVk,
            web_vk: VKPlatform,
            sp_mbga: SPMobage,
            mbga: Mobage,
            draugiem: Draugiem,
            fotostrana: FotoStrana,
            cleverapps: CleverApps,
            yandex: Yandex,
            macos: MacOS,
            ios: IOS,
            gpg: GPG,
            android: AndroidPlatform,
            pliega: Pliega,
            plng: Plinga,
            kongregate: Kongregate,
            crazy: Crazy,
            ton: Ton,
            wortal: WortalPlatform,
            rustore: Rustore,
            amazon: Amazon,
            mygames: Mygames,
            samsung: Samsung,
            ios_ch: IOSCh,
            huzcom: Huzcom,
            facebook: FacebookCanvas,
            xiaomi: Xiaomi,
            pwa: PWA,
            wechat: Wechat,
            test: TestPlatform
        };

        var source = this.getSource();

        console.log(source);

        if (cleverapps.config[source] && cleverapps.config[source].adsense !== undefined) {
            cleverapps.config.adsense = cleverapps.config[source].adsense;
        }

        if (cleverapps.config[source] && cleverapps.config[source].xsolla !== undefined) {
            cleverapps.config.xsolla = cleverapps.config[source].xsolla;
        }

        var PlatformClass = platforms[source] || FacebookCanvas;
        return new PlatformClass(options);
    },

    getSource: function () {
        var existParameterByName = function (name) {
            return window.location.href.indexOf(name) !== -1;
        };

        if (cleverapps.config.source === "msstart" && !existParameterByName("msstart_sdk_init")) {
            return "pwa";
        }

        if (cleverapps.config.debugMode && cleverapps.config.source === "plinga") {
            return "plng";
        }

        if (cleverapps.config.source) {
            return cleverapps.config.source;
        }

        var paramsSource = new URLSearchParams(window.location.search).get("source");
        if (["android", "amazon", "ios", "macos", "plng", "pliega", "rustore", "ios_ch", "gdcom", "mygames",
            "kongregate", "msstart", "microsoft", "crazy", "facebook", "xiaomi", "cleverapps", "wortal", "samsung"].includes(paramsSource)) {
            return paramsSource;
        }

        if (existParameterByName("msstart_sdk_init")) {
            return "msstart";
        }

        if (existParameterByName("dr_auth_code")) {
            return "draugiem";
        }

        if (existParameterByName("logged_user_id")) {
            if (existParameterByName("mob=true")) {
                return "mobile_ok";
            }
            return "web_ok";
        }

        if (existParameterByName("api.vk.")) {
            if (existParameterByName("vkmobile=true")) {
                return "mobile_vk";
            }
            return "web_vk";
        }

        var yandexAppId = cleverapps.config.yandex && cleverapps.config.yandex.appId;
        if (existParameterByName("yandex") || existParameterByName("playhop.com")
            || yandexAppId && existParameterByName("app-id=" + yandexAppId)) {
            return "yandex";
        }

        if (existParameterByName("fotostrana.ru")) {
            return "fotostrana";
        }

        if (existParameterByName("source=spmobage")) {
            return "sp_mbga";
        }

        if (existParameterByName("mbga-platform.jp")) {
            return "mbga";
        }

        if (existParameterByName("source=xsolla")) {
            return "cleverapps";
        }

        if (cleverapps.config.mm && existParameterByName("app_id=" + cleverapps.config.mm.appId)) {
            if (existParameterByName("view=app_mobile")) {
                return "mobile_mm";
            }
            return "web_mm";
        }

        if (existParameterByName("telegram=true")) {
            return "ton";
        }

        if (cleverapps.isLocalhost() || cleverapps.isStaging()) {
            return "test";
        }

        if (cleverapps.config.facebook && cleverapps.config.facebook.appId) {
            return "facebook";
        }

        return "cleverapps";
    }
};
