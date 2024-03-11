/**
 * Created by slava on 5/3/19
 */

(function () {
    var guessPlatformURL = function (config, debugMode, source) {
        switch (source) {
            case "facebook":
                var data = config.facebook;
                return data && "https://apps.facebook.com/" + (data.shortname ? data.shortname : data.appId);
            case "android":
                return config.android && "https://play.google.com/store/apps/details?id=" + config.android.package;
            case "amazon":
                return config.amazon && "https://www.amazon.com/dp/" + config.amazon.id;
            case "macos":
            case "ios":
                return config.ios && "https://apps.apple.com/app/id" + config.ios.id;
            case "instant":
                return config.instant && "https://www.facebook.com/instantgames/play/" + config.instant.appId;
            case "web_ok":
                return config.ok && "https://ok.ru/game/" + (config.ok.shortname || config.ok.appId);
            case "mobile_ok":
                return config.ok && "https://m.ok.ru/game/" + (config.ok.shortname || config.ok.appId);
            case "web_vk":
                return config.vk && "https://vk.com/" + (config.vk.shortname || config.vk.appId);
            case "mobile_vk":
                return config.vk && "vk://vk.com/" + (config.vk.shortname || config.vk.appId);
            case "web_mm":
                return config.mm && "https://my.mail.ru/apps/" + config.mm.appId;
            case "mobile_mm":
                return config.mm && "https://m.my.mail.ru/apps/" + config.mm.appId;
            case "mbga":
                if (debugMode) {
                    return config.mbga && "https://sb.yahoo-mbga.jp/game/" + config.mbga.appId + "/play";
                }
                return config.mbga && "https://yahoo-mbga.jp/game/" + config.mbga.appId + "/play";
            case "sp_mbga":
                return config.mbga && "http://sp.mbga.jp/_pf_install?game_id=" + config.mbga.appId;
            case "draugiem":
                return config.draugiem && "https://www.draugiem.lv/" + (parseInt(config.draugiem.appId) ? "applications/" : "") + config.draugiem.appId;
            case "fotostrana":
                return config.fotostrana && "https://fotostrana.ru/app/" + config.fotostrana.appId;
            case "yandex":
                return config.yandex && "https://yandex.ru/games/play/" + config.yandex.appId;
            case "gdcom":
                return config.gdcom && "https://revision.gamedistribution.com/" + config.gdcom.appId;
            case "plng":
                return config.plng && "https://revision.gamedistribution.com/" + config.plng.appId;
            case "msstart":
                return config.msstart && "https://www.msn.com/en-us/play/" + (config.msstart.name.replaceAll(" ", "-") + "/cg-" + config.msstart.appId).toLowerCase();
            case "kongregate":
                return config.kongregate && "https://www.kongregate.com/games/CleverApps/" + config.kongregate.name;
            case "crazy":
                return config.crazy && "https://www.crazygames.com/game/" + config.crazy.name;
            case "xsolla":
                return config.deployment + (debugMode ? "/publish/html5-staging/" : "/publish/html5/") + "?source=cleverapps";
            case "test":
                return config.deployment + (debugMode ? "/publish/html5-staging/" : "/publish/html5/");
        }
    };

    if (typeof cc === "undefined") {
        module.exports = guessPlatformURL;
    } else {
        Platform.guessPlatformURL = guessPlatformURL;
    }
}());
