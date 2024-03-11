/**
 * Created by razial on 12.12.2023
 */

var ReplaceOldMissionWindow = Window.extend({
    onWindowLoaded: function (type) {
        this.missionData = Missions[type];

        this._super({
            title: "ReplaceOldMissionWindow.title",
            name: "ReplaceOldMissionWindow",
            content: this.createContent(),
            buttons: this.createButtons(),
            closeButton: false,
            notCloseByTouchInShadow: true
        });
    },

    getPerson: function () {
        return {
            role: "king",
            emotion: "happy"
        };
    },

    createContent: function () {
        var styles = cleverapps.styles.ReplaceOldMissionWindow;

        var banner = new cc.Sprite(bundles.replaceoldmissionwindow.urls.banner);

        var name = [
            "TravelBook.title." + this.missionData.id,
            "Missions." + this.missionData.name + ".Title"
        ].find(function (name) {
            return Messages.has(name);
        });

        var text = cleverapps.UI.generateOnlyText("ReplaceOldMissionWindow.text", cleverapps.styles.FONTS.REPLACE_OLD_MISSION_WINDOW_TEXT, {
            name: Messages.get(name)
        });
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(banner.width, 0);

        return new cleverapps.Layout([banner, text], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    createButtons: function () {
        var styles = cleverapps.styles.ReplaceOldMissionWindow.button;

        var restartButton = new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_green,
            text: "ReplaceOldMissionWindow.restart",
            onClicked: this.close.bind(this),
            width: styles.width,
            height: styles.height
        });

        return [restartButton];
    },

    listBundles: function () {
        return ["replaceoldmissionwindow"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    REPLACE_OLD_MISSION_WINDOW_TEXT: {
        name: "nostroke",
        size: 35,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    }
});

cleverapps.styles.ReplaceOldMissionWindow = {
    margin: 20,

    button: {
        width: 300,
        height: 100
    }
};
