/**
 * Created by Aleksandr on 23.08.2023
 */

(function () {
    var getPlatformConfig = function (game, source) {
        switch (source) {
            case "macos":
                return projects[game].ios;
            case "web_ok":
            case "mobile_ok":
                return projects[game].ok;
            case "web_vk":
            case "mobile_vk":
                return projects[game].vk;
            case "web_mm":
            case "mobile_mm":
                return projects[game].mm;
            case "mbga":
            case "sp_mbga":
                return projects[game].mbga;
            default:
                return projects[game][source];
        }
    };

    if (typeof cc === "undefined") {
        module.exports = getPlatformConfig;
    } else {
        Platform.getPlatformConfig = getPlatformConfig;
    }
}());
