/**
 * Created by andrey on 25.07.17.
 */

var LanguagesWindow = Window.extend({
    onWindowLoaded: function () {
        this._super({
            title: "Language",
            name: "languageswindow",
            content: this.createContent() 
        });
    },

    createContent: function () {
        var styles = cleverapps.styles.LanguagesWindow;

        var columns = 3;
        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            columns = 2;
        }

        this.buttonsPerLanguage = {};

        var buttons = cleverapps.config.languages.map(function (language) {
            var button = new LanguageButton(language, this.buttonClicked.bind(this));
            this.buttonsPerLanguage[language] = button;
            return button;
        }, this);

        return new cleverapps.GridLayout(buttons, {
            columns: columns,
            margin: {
                x: styles.margin,
                y: styles.margin
            }
        });
    },

    buttonClicked: function (language) {
        var currentLanguage = cleverapps.settings.language;

        if (language !== currentLanguage) {
            cleverapps.meta.distract({
                focus: "LanguageChanged",
                action: function (f) {
                    cleverapps.settings.setLanguage(language);
                    cleverapps.settings.updateDependents();

                    this.buttonsPerLanguage[currentLanguage].updateEnabled();

                    Messages.preload(language, function () {
                        this.setTitle("Language");

                        if (cleverapps.environment.isGameScene() && cleverapps.config.type !== "merge") {
                            if (!cleverapps.lives) {
                                cleverapps.meta.wantsToPlay(f);
                            } else {
                                f();
                                this.close();
                            }
                        } else {
                            this.close();

                            cleverapps.travelBook.gotoMainScene(f);
                        }
                    }.bind(this));
                }.bind(this)
            });
        }
    }
});

cleverapps.styles.LanguagesWindow = {
    margin: 20
};