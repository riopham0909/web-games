/**
 * Created by Andrey Popov on 2/1/22.
 */

var LevelPassWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.mission = mission;

        this._super({
            name: "LevelPassWindow",
            title: "LevelPassWindow.title",
            content: this.createContent(),
            closeButton: true,
            styles: cleverapps.styles.LevelPassWindow.window,
            foreground: bundles.passforeground.frames.window_foreground_png,
            help: function () {
                new GuideWindow(mission.rulesOptions);
            }
        });
    },

    onShow: function () {
        this._super();
        this.mission.logic.handleShowWindow();
    },

    createContent: function () {
        var styles = cleverapps.styles.LevelPassWindow;
        var width = this.calcContentWidth();

        return new PassWindowContent({
            components: [{
                name: "progress",
                class: PassProgress
            }, {
                name: "header",
                class: PassHeader
            }, {
                name: "tickets",
                class: PassTickets,
                params: { close: this.close.bind(this) }
            }],
            width: width,
            styles: styles,
            passLogic: this.mission.logic
        });
    },

    calcContentWidth: function () {
        var styles = cleverapps.styles.LevelPassWindow;
        var width = cleverapps.UI.getSceneSize().width - 2 * styles.paddingX;
        if (width < styles.minWidth) {
            width = styles.minWidth;
        }
        if (width > styles.maxWidth) {
            width = styles.maxWidth;
        }
        return width;
    },

    listBundles: function () {
        return ["pass"];
    },

    getPreferredBundles: function () {
        return ["pass"];
    }
});

LevelPassWindow.LEVELS = [
    {
        level: 0,
        task: {
            goal: 3
        },
        reward: {
            unlimitedLives: "30 minutes"
        },
        premiumReward: {
            unlimitedLives: "12 hours"
        }
    },
    {
        level: 1,
        task: {
            goal: 5
        },
        reward: {
            boosters: {
                5: 1
            }
        },
        premiumReward: {
            boosters: {
                5: 3
            }
        }
    },
    {
        level: 2,
        task: {
            goal: 8
        },
        reward: {
            unlimitedLives: "1 hour"
        },
        premiumReward: {
            boosters: {
                0: 3
            }
        }
    },
    {
        level: 3,
        task: {
            goal: 12
        },
        reward: {
            boosters: {
                6: 1
            }
        },
        premiumReward: {
            unlimitedLives: "12 hours"
        }
    },
    {
        level: 4,
        task: {
            goal: 15
        },
        reward: {
            unlimitedLives: "2 hours"
        },
        premiumReward: {
            boosters: {
                1: 3
            }
        }
    },
    {
        level: 5,
        task: {
            goal: 20
        },
        reward: {
            exp: 20
        },
        premiumReward: {
            hard: 300
        }
    },
    {
        level: 6,
        task: {
            goal: 25
        },
        reward: {
            boosters: {
                7: 1
            }
        },
        premiumReward: {
            boosters: {
                2: 3
            }
        }
    },
    {
        level: 7,
        task: {
            goal: 30
        },
        reward: {
            boosters: {
                6: 2
            }
        },
        premiumReward: {
            unlimitedLives: "12 hours"
        }
    },
    {
        level: 8,
        task: {
            goal: 40
        },
        reward: {
            unlimitedLives: "2 hours"
        },
        premiumReward: {
            boosters: {
                0: 5
            }
        }
    },
    {
        level: 9,
        task: {
            goal: 50
        },
        reward: {
            boosters: {
                2: 1
            }
        },
        premiumReward: {
            hard: 500
        }
    }
];

cleverapps.styles.LevelPassWindow = {
    minWidth: 900,
    maxWidth: 1800,
    height: 900,
    paddingX: 50,

    window: {
        padding: {
            left: 0,
            right: 0,
            top: 160,
            bottom: 50
        }
    },

    progress: {
        x: { align: "right", dx: -25 },
        y: { align: "top", dy: -210 }
    },

    header: {
        x: { align: "center" },
        y: { align: "top", dy: -10 }
    },

    tickets: {
        x: { align: "left", dx: 10 },
        y: { align: "top", dy: -243 }
    }
};
