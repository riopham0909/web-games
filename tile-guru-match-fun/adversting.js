/**
 * Created by andrey on 11.07.18.
 */

cleverapps.Adversting = {
    postbackUnity: function (idfa) {
        if (!cleverapps.platform.oneOf(Amazon, AndroidPlatform)) {
            return;
        }

        var gameId = cleverapps.config.android.unityGameId;
        if (cleverapps.platform.oneOf(IOS)) {
            gameId = cleverapps.config.ios.unityGameId;
        }

        var url = "https://postback.unityads.unity3d.com/games/" + gameId + "/install?advertisingTrackingId=" + idfa;
        cleverapps.RestClient.get(url, {}, function () {
        });
    },

    getInstallReferrer: function () {
        if (!cleverapps.platform.oneOf(AndroidPlatform, Amazon)) {
            return;
        }

        cleverapps.platform.callNative("AdverstingPlugin.getInstallReferrer", function (code, response) {
            var referrerUrl = response && response.referrerUrl;
            if (!referrerUrl || referrerUrl.indexOf("&") === -1) {
                return;
            }

            referrerUrl.split("&").forEach(function (paramWithValue) {
                if (paramWithValue.indexOf("utm_campaign") !== -1) {
                    var channel = paramWithValue.split("=")[1];

                    console.log("channel extracted " + channel);
                    cleverapps.user.setChannel(channel);
                } else if (paramWithValue.indexOf("utm_content") !== -1) {
                    // https://developers.facebook.com/docs/app-ads/install-referrer
                    var content = paramWithValue.split("=")[1];

                    console.log("Encrytped Referrer Data " + content);

                    if (cleverapps.config.name === "mergecraft") {
                        cleverapps.RestClient.post("/users/decodereferrer", { content: content }, function (response) {
                            if (response.channel) {
                                cleverapps.user.setChannel(response.channel);
                            } else {
                                console.log("Failed decode referrer: " + content);
                            }
                        });
                    }
                }
            });
        });
    }
};
