/**
 * Created by vladislav on 1/26/2024
 */

var InstantLogic = function () {
    PlatformLogic.call(this);

    cleverapps.platform.on("changeStatus:" + Platform.PLATFORM, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            console.log("Request entrypoint");
            FBInstant.getEntryPointAsync().then(function (entrypoint) {
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.ENTRY_POINT + (entrypoint || "empty"));

                if (cleverapps.config.debugMode) {
                    console.log("Instant entrypoint: " + entrypoint);
                    setTimeout(function () {
                        cleverapps.notification.create("Instant entrypoint: " + entrypoint);
                    }, 2000);
                }
            });

            FBInstant.player.getASIDAsync().then(function (asid) {
                console.log("Instant ASID: " + asid);

                if (asid) {
                    cleverapps.info.setKeyValue("asid", asid, true);
                }
            });

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.LOCALE + (FBInstant.getLocale() || "empty"));
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PLATFORM + (FBInstant.getPlatform() || "empty"));

            var entryPointData = FBInstant.getEntryPointData() || {};
            if (entryPointData.push_code) {
                cleverapps.localPushes.logClickEvent(entryPointData.push_code);
            }
        }
    });
};

InstantLogic.prototype = Object.create(PlatformLogic.prototype);
InstantLogic.prototype.constructor = InstantLogic;