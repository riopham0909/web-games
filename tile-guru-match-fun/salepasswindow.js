/**
 * Created by Andrey Popov on 2/1/22.
 */

var SalePassWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.mission = mission;

        var components = [{
            name: "header",
            class: PassHeader,
            params: {
                bg_json: bundles.salepass.jsons.bg_json,
                pack_json: bundles.salepass.jsons.pack_json,
                decor_json: bundles.salepass.jsons.decor_json,
                json: bundles.salepass.jsons.head_json,
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
            name: "SalePassWindow",
            title: "SalePassWindow.title",
            content: new PassWindowContent({
                components: components,
                width: cleverapps.styles.SalePassWindow.width,
                styles: cleverapps.styles.SalePassWindow,
                passLogic: mission.logic
            }),
            help: function () {
                new GuideWindow(mission.rulesOptions);
            },
            foreground: bundles.passforeground.frames.window_foreground_png,
            contentPadding: cleverapps.styles.SalePassWindow.contentPadding,
            closeButton: true,
            noPadding: true,
            styles: cleverapps.styles.SalePassWindow.window
        });
    },

    onShow: function () {
        this._super();
        this.mission.logic.handleShowWindow();
    },

    listBundles: function () {
        return ["salepass"];
    },

    getPreferredBundles: function () {
        return ["salepass"];
    }
});

SalePassWindow.LEVELS = [
    {
        energy: 0,
        task: {
            goal: 30
        },
        reward: {
            unit: { code: "crystal", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "crystal", stage: 0, amount: 3 }
        }
    },
    {
        energy: 5,
        task: {
            goal: 150
        },
        reward: {
            unit: { code: "treasure", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 1, amount: 2 }
        }
    },
    {
        energy: 5,
        task: {
            goal: 275
        },
        reward: {
            unit: { code: "coins", stage: 4, amount: 1 }
        },
        premiumReward: {
            unit: { code: "coins", stage: 5, amount: 1 }
        }
    },
    {
        energy: 5,
        task: {
            goal: 325
        },
        reward: {
            unit: { code: "treasure", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 4, amount: 2 }
        }
    },
    {
        energy: 10,
        task: {
            goal: 355
        },
        reward: {
            unit: { code: "worker", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 2, amount: 2 }
        }
    },
    {
        energy: 10,
        task: {
            goal: 400
        },
        reward: {
            unit: { code: "treasure", stage: 2, amount: 1 }
        },
        premiumReward: {
            unit: { code: "crystal", stage: 3, amount: 2 }
        }
    },
    {
        energy: 10,
        task: {
            goal: 475
        },
        reward: {
            unit: { code: "sacks", stage: 2, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 2, amount: 3 }
        }
    },
    {
        energy: 15,
        task: {
            goal: 525
        },
        reward: {
            unit: { code: "coins", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "rubies", stage: 4, amount: 1 }
        }
    },
    {
        energy: 15,
        task: {
            goal: 600
        },
        reward: {
            unit: { code: "worker", stage: 3, amount: 2 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 4, amount: 2 }
        }
    },
    {
        energy: 15,
        task: {
            goal: 750
        },
        reward: {
            unit: { code: "magicplant", stage: 5, amount: 1 }
        },
        premiumReward: {
            unit: { code: "energytree", stage: 1, amount: 1 }
        }
    }
];

cleverapps.styles.SalePassWindow = {
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
        right: 100
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
