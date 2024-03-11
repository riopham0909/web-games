/**
 * Created by andrey on 25.07.17.
 */

cleverapps.LocalizationManager = {
    run: function () {
        var save = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LOCALIZATION_MANAGER);
        if (save === undefined && this.hasInconsistentLanguage() || this.hasFirstInitLanguageWindow()) {
            this.displayLanguageWindow();
        }
    },

    hasInconsistentLanguage: function () {
        var language = cleverapps.settings.language;
        var availableLanguages = cleverapps.config.languages;
        var defaultLanguage = cleverapps.Settings.getDefaultLanguage();

        return language !== defaultLanguage && availableLanguages.indexOf(defaultLanguage) >= 0;
    },

    hasFirstInitLanguageWindow: function () {
        return levels.user.episode === 0 && levels.user.level === 0 && cleverapps.platform.oneOf(GDCom) && cleverapps.config.name === "riddles";
    },

    displayLanguageWindow: function () {
        cleverapps.meta.displayWhenFreeFocus({
            focus: "displayInconsistentLanguage",
            filter: function () {
                return cleverapps.config.source !== "playable" && !cleverapps.config.importMode && !cleverapps.config.wysiwygMode;
            },
            action: function (f) {
                cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LOCALIZATION_MANAGER, 1);
                new LanguagesWindow();

                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    }
};
