/**
 * Created by slava on 24.03.17.
 */

var SettingsWindow = Window.extend({
    onWindowLoaded: function () {
        var social = [], game = [];

        if (!cleverapps.flags.noinvites) {
            social.push(this.createInviteButton());
        }

        if (!cleverapps.platform.oneOf(
            Mobage, 
            SPMobage, 
            GDCom,
            Plinga,
            Huzcom, 
            Amazon,
            Pliega,
            Rustore, 
            IOSCh, 
            Yandex, 
            Microsoft,
            Mygames,
            Ton,
            WortalPlatform,
            Wechat
        )) {
            social.push(this.addHelpButton());
        }

        social.push(this.createCopyId());

        if (cleverapps.userDelete.isAvailable()) {
            social.push(this.addDeleteAccountButton());
        }

        game.push(this.addSoundIcons());

        if (cleverapps.config.languages.length > 1 && (cleverapps.config.type === "merge" || !cleverapps.environment.isGameScene())) {
            game.push(this.addLanguages());
        }

        if ((["merge", "blocks"].indexOf(cleverapps.config.type) !== -1 || !Game.currentGame) && Chat.IsAvailable()) {
            game.push(this.addSupportButton());
        }

        if (SettingsWindow.IsExitButtonAvailable() && cleverapps.environment.isMainScene()) {
            game.push(this.addExitButton());
        }

        if (Game.currentGame && Game.currentGame.outcome === undefined && cleverapps.environment.isGameScene() && ["match3", "tile3", "blocks"].indexOf(cleverapps.config.type) !== -1) {
            game.push(this.addGiveUpButton());
        }

        var styles = cleverapps.styles.SettingsWindow;
        var isVertical = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;

        social = this.createGroup(social);
        game = this.createGroup(game);

        var groups = isVertical ? [game, social] : [social, game];

        var buttons = new cleverapps.Layout(groups, {
            direction: isVertical ? cleverapps.UI.VERTICAL : cleverapps.UI.HORIZONTAL,
            align: cleverapps.UI.ALIGN_END,
            margin: styles.margin
        });

        if (!cleverapps.flags.nologin) {
            if (!cleverapps.social.isLoggedIn()) {
                var loginButtons = this.createLoginButtons();
            } else if (cleverapps.platform.oneOf(TestPlatform)) {
                var logoutButton = this.createLogoutButtons();
            }
        }

        var content = new cleverapps.Layout([buttons, loginButtons, logoutButton, this.createVersion()].filter(Boolean), {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.version.margin
        });

        this._super({
            title: "SettingsWindow.title",
            name: "settingswindow",
            content: content,
            styles: styles.window,
            help: cleverapps.platform.oneOf(TestPlatform, FacebookCanvas, AndroidPlatform, IOS, Wechat) ? function () {
                new AboutWindow();
            } : undefined
        });
    },

    getPerson: function () {
        return cleverapps.styles.SettingsWindow.person;
    },

    createGroup: function (buttons) {
        var styles = cleverapps.styles.SettingsWindow.groups;

        var group = new cleverapps.Layout(buttons, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });

        var background = cleverapps.UI.createScale9Sprite(bundles.windows.frames.windows_group_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        background.setContentSize(group.width, group.height);
        background.setPositionRound(group.width / 2, group.height / 2);
        group.addChild(background, -1);

        return group;
    },

    addGiveUpButton: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_red,
            text: "%% GiveUp",
            icons: {
                "%%": bundles.buttons_main.frames.giveup_icon
            },
            onClicked: function () {
                this.close();

                cleverapps.meta.whenFreeFocus(function () {
                    var scene = cleverapps.scenes.getRunningScene();
                    scene.closeAction();
                });
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height
        });
    },

    addExitButton: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_red,
            text: "%% Exit",
            icons: {
                "%%": bundles.buttons_main.frames.exit_icon
            },
            onClicked: function () {
                cleverapps.meta.distract({
                    focus: "ConfirmExitWindow",
                    action: function (f) {
                        new ConfirmExitWindow({
                            action: cleverapps.platform.closeApplication
                        });

                        cleverapps.meta.onceNoWindowsListener = f;
                    }
                });

                this.close();
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height
        });
    },

    addHelpButton: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new cleverapps.UI.Button({
            text: "%% Help",
            icons: {
                "%%": bundles.buttons_main.frames.community_icon
            },
            onClicked: function () {
                cleverapps.platform.showOfficialPage();
            },
            width: styles.button.width,
            height: styles.button.height,
            type: cleverapps.styles.UI.Button.Images.button_blue
        });
    },

    addSupportButton: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new cleverapps.UI.Button({
            text: "%% SupportButton",
            icons: {
                "%%": bundles.buttons_main.frames.support_icon
            },
            onClicked: function () {
                cleverapps.meta.distract({
                    focus: "ChatScene",
                    action: function (f) {
                        this.close();

                        cleverapps.scenes.replaceScene(new ChatScene(cleverapps.chat), f);
                    }.bind(this)
                });
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height,
            type: cleverapps.styles.UI.Button.Images.button_blue,
            mark: cleverapps.chat.hasUnread
        });
    },

    addLanguages: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new cleverapps.UI.Button({
            text: "%% Language",
            icons: {
                "%%": bundles.buttons_main.frames.language_icon,
                "##": bundles.buttons_main.frames.support_icon
            },
            onClicked: function () {
                new LanguagesWindow();
                this.close();
            }.bind(this),
            width: styles.button.width,
            height: styles.button.height
        });
    },

    addSoundIcons: function () {
        var buttonsData = [
            {
                icons: {
                    "%%": bundles.buttons_main.frames.sound_on_png,
                    "^^": bundles.buttons_main.frames.sound_off_png
                },
                toggle: cleverapps.settings.toggleSound.bind(cleverapps.settings),
                settings: "sound",
                listener: "onChangeSoundListener"
            },
            {
                icons: {
                    "%%": bundles.buttons_main.frames.music_on_png,
                    "^^": bundles.buttons_main.frames.music_off_png
                },
                toggle: cleverapps.settings.toggleMusic.bind(cleverapps.settings),
                settings: "music",
                listener: "onChangeMusicListener"
            }
        ];

        var styles = cleverapps.styles.SettingsWindow;

        var width = this.getButtonWidth(buttonsData);

        var buttons = buttonsData.map(function (buttonData) {
            var button = new cleverapps.UI.Button({
                text: "%%",
                textOff: "^^",
                icons: buttonData.icons,
                width: width,
                height: styles.button.height,
                onClicked: buttonData.toggle
            });

            button.setBright(cleverapps.settings[buttonData.settings]);
            cleverapps.settings[buttonData.listener] = button.createListener(function () {
                button.setBright(cleverapps.settings[buttonData.settings]);
            });

            return button;
        });

        return new cleverapps.Layout(buttons, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.button.margin
        });
    },

    getButtonWidth: function (buttons) {
        var styles = cleverapps.styles.SettingsWindow.button;

        if (buttons.length === 3) {
            return styles.width3;
        }
        return buttons.length === 2 ? styles.width2 : styles.width;
    },

    createLoginButtons: function () {
        var styles = cleverapps.styles.SettingsWindow;

        var sources = cleverapps.social.getCodes();

        var buttons = sources.map(function (source) {
            return new LoginButton({
                multiSocials: sources.length > 1,
                width: styles.loginButton.width,
                height: styles.loginButton.height,
                source: source,
                onSuccess: this.closeWindow.bind(this)
            });
        }.bind(this));

        var isVertical = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL;

        var footnote = cleverapps.UI.generateOnlyText("SettingsWindow.SignIn.Footnote", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        footnote.setOpacity(170);
        footnote.fitTo(cleverapps.styles.SettingsWindow.button.width);

        var buttonsLayout = new cleverapps.GridLayout(buttons, {
            margin: styles.loginButton.margin,
            direction: cleverapps.UI.VERTICAL,
            columns: isVertical ? 1 : 2
        });

        return new cleverapps.Layout([footnote, buttonsLayout], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.loginButton.text.margin
        });
    },

    createLogoutButtons: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_blue,
            width: styles.loginButton.width,
            height: styles.loginButton.height,
            text: "%% SettingsWindow.Logout",
            icons: {
                "%%": bundles.buttons_main.frames.exit_icon
            },
            onClicked: function () {
                cleverapps.social.logout();
                this.closeWindow();
            }.bind(this)
        });
    },

    createInviteButton: function () {
        var styles = cleverapps.styles.SettingsWindow;

        return new InviteButton({
            width: styles.button.width,
            height: styles.button.height,
            type: cleverapps.styles.UI.Button.Images.button_blue,
            onSuccess: this.closeWindow.bind(this)
        });
    },

    createCopyId: function () {
        var styles = cleverapps.styles.SettingsWindow.button;

        return new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_blue,
            width: styles.width,
            height: styles.height,
            text: "%% SettingsWindow.UserID.copy",
            icons: {
                "%%": bundles.buttons_main.frames.copyid_icon
            },
            onClicked: function () {
                cleverapps.copyToClipboard(cleverapps.platform.getUserID(), function () {
                    cleverapps.notification.create("SettingsWindow.UserID.copied");
                });
            }
        });
    },

    createVersion: function () {
        var text = cleverapps.UI.generateOnlyText("v" + cleverapps.config.version, cleverapps.styles.FONTS.SETTINGS_WINDOW_ID_TEXT || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        text.fitTo(cleverapps.styles.SettingsWindow.button.width);
        text.setOpacity(170);
        return text;
    },

    addDeleteAccountButton: function () {
        var styles = cleverapps.styles.SettingsWindow.button;

        return new cleverapps.UI.Button({
            type: cleverapps.styles.UI.Button.Images.button_blue,
            text: "%% DeleteAccount",
            icons: {
                "%%": bundles.buttons_main.frames.delete_icon
            },
            onClicked: function () {
                new DeleteAccountWindow();
            },
            width: styles.width,
            height: styles.height
        });
    },

    closeWindow: function () {
        if (!this.closed) {
            this.close();
        }
    },

    listBundles: function () {
        return ["social_buttons"];
    }
});

SettingsWindow.IsExitButtonAvailable = function () {
    return [cc.sys.OS_ANDROID].indexOf(cc.sys.os) !== -1 && cc.sys.isNative && cleverapps.platform.closeApplication;
};

cleverapps.styles.SettingsWindow = {
    margin: 20,

    groups: {
        margin: 19,
        padding: {
            x: 30,
            y: 30
        }
    },

    button: {
        margin: 19,

        width: 563,
        width2: 269,
        width3: 175,

        height: 125
    },

    loginButton: {
        height: 100,
        width: 475,
        margin: {
            x: 80,
            y: 20
        },
        text: {
            margin: 7
        }
    },

    version: {
        margin: 10
    }
};
