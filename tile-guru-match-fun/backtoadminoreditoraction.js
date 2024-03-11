/**
 * Created by andrey on 02.08.2022.
 */

var BackToAdminOrEditorAction = function () {
    var params = cleverapps.getRequestParameters(location.hash);
    if (params.mode === "editor") {
        cleverapps.setUrlHash({ playLevel: undefined });

        this.level.edit();
        return true;
    }

    if (params.mode === "admin") {
        cleverapps.setUrlHash({ playLevel: undefined });

        AdministratorScene.open();
        return true;
    }
    return false;
};