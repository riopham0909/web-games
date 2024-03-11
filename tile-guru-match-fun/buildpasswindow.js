/**
 * Created by r4zi4l on 13.05.2021
 */

var BuildPassWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.mission = mission;

        var components = [{
            name: "header",
            class: PassHeader,
            params: {
                bg_json: bundles.pass.jsons.bg_json,
                pack_json: bundles.pass.jsons.pack_json,
                decor_json: bundles.pass.jsons.decor_json,
                close: this.close.bind(this),
                passLogic: mission.logic
            }
        }, {
            name: "progress",
            class: PassProgress
        }, {
            name: "tickets",
            class: PassTickets,
            params: { close: this.close.bind(this) }
        }];

        this._super({
            name: "BuildPassWindow",
            title: "BuildPassWindow.title",
            content: new PassWindowContent({
                components: components,
                width: cleverapps.styles.BuildPassWindow.width,
                styles: cleverapps.styles.BuildPassWindow,
                passLogic: mission.logic
            }),
            help: function () {
                new GuideWindow(mission.rulesOptions);
            },
            foreground: bundles.passforeground.frames.window_foreground_png,
            contentPadding: cleverapps.styles.BuildPassWindow.contentPadding,
            closeButton: true,
            noPadding: true,
            styles: cleverapps.styles.BuildPassWindow.window
        });
    },

    onShow: function () {
        this._super();
        this.mission.logic.handleShowWindow();
    },

    listBundles: function () {
        return ["pass"];
    },

    getPreferredBundles: function () {
        return ["pass", "units"];
    }
});

BuildPassWindow.LEVELS = [
    {
        energy: 0,
        task: {
            goal: 30
        },
        reward: {
            unit: { code: "worker", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 0, amount: 1 }
        }
    },
    {
        energy: 5,
        task: {
            goal: 75
        },
        reward: {
            unit: { code: "herochest", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 3, amount: 1 }
        }
    },
    {
        energy: 5,
        task: {
            goal: 150
        },
        reward: {
            unit: { code: "seasonchest", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 0, amount: 2 }
        }
    },
    {
        energy: 5,
        task: {
            goal: 350
        },
        reward: {
            unit: { code: "sacks", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 2, amount: 1 }
        }
    },
    {
        energy: 10,
        task: {
            goal: 700
        },
        reward: {
            unit: { code: "crystal", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 2, amount: 2 }
        }
    },
    {
        energy: 10,
        task: {
            goal: 1500
        },
        reward: {
            unit: { code: "worker", stage: 2, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 3, amount: 1 }
        }
    },
    {
        energy: 10,
        task: {
            goal: 3000
        },
        reward: {
            unit: { code: "sacks", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 1, amount: 2 }
        }
    },
    {
        energy: 15,
        task: {
            goal: 5000
        },
        reward: {
            unit: { code: "worker", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "crystal", stage: 3, amount: 1 }
        }
    },
    {
        energy: 15,
        task: {
            goal: 8000
        },
        reward: {
            unit: { code: "treasure", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 2, amount: 1 }
        }
    },
    {
        energy: 15,
        task: {
            goal: 12000
        },
        reward: {
            unit: { code: "magicplant", stage: 4, amount: 1 }
        },
        premiumReward: {
            unit: { code: "coinstree", stage: 1, amount: 1 }
        }
    }];

cleverapps.styles.BuildPassWindow = {
    width: 1816,
    height: 935,
    paddingX: 50,

    window: {
        Foreground: {
            padding: {
                top: 300
            }
        }
    },

    contentPadding: {
        right: 80
    },

    progress: {
        x: { align: "right", dx: -26 },
        y: { align: "center", dy: -122 }
    },

    header: {
        x: { align: "center", dx: -2 },
        y: { align: "top", dy: -30 }
    },

    tickets: {
        x: { align: "left", dx: 24 },
        y: { align: "center", dy: -118 }
    }

};
