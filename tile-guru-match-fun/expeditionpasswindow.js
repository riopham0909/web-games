/**
 * Created by r4zi4l on 09.11.2021
 */

var ExpeditionPassWindow = Window.extend({
    ctor: function (options) {
        this.mission = options;
        this._super.apply(this, arguments);
    },

    onWindowLoaded: function (mission) {
        var options = {
            name: "ExpeditionPassWindow",
            title: "ExpeditionPassWindow.title",
            content: new PassWindowContent({
                components: [{
                    name: "progress",
                    class: PassProgress
                }, {
                    name: "tickets",
                    class: PassTickets,
                    params: { close: this.close.bind(this) }
                },
                {
                    name: "header",
                    class: ExpeditionPassHeader
                }],
                width: cleverapps.styles.ExpeditionPassWindow.width,
                styles: cleverapps.styles.ExpeditionPassWindow,
                passLogic: mission.logic
            }),
            foreground: bundles.passforeground.frames.window_foreground_png,
            closeButton: true,
            noPadding: true
        };

        var parentType = Mission.ParseCompoundType(mission.type).parentType;

        if ([Mission.TYPE_RAPUNZEL_EXPEDITION, Mission.TYPE_RAPUNZEL2_EXPEDITION, Mission.TYPE_EASTER_EXPEDITION, Mission.TYPE_CHINA_EXPEDITION].indexOf(parentType) === -1) {
            options.help = function () {
                new GuideWindow(mission.rulesOptions);
            };
        }

        this._super(options);
    },

    getPerson: function () {
        var parentType = Mission.ParseCompoundType(this.mission.type).parentType;
        if (parentType === Mission.TYPE_UNDERSEA2_EXPEDITION) {
            return "capitannemo";
        }
    },

    onShow: function () {
        this._super();
        this.mission.logic.handleShowWindow();
    },

    onClose: function () {
        cleverapps.meta.hideControlsWhileFocused(["MenuBarGoldItem", "MenuBarLivesItem"]);
    },

    listBundles: function () {
        return ["expeditionpass_" + cleverapps.skins.getSlot("skinName")];
    },

    getPreferredBundles: function () {
        return ["expeditionpass_" + cleverapps.skins.getSlot("skinName")];
    }

});

ExpeditionPassWindow.LEVELS = [
    {
        task: {
            goal: 100
        },
        reward: {
            unit: { code: "worker", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 1, amount: 1 }
        }
    }, // 1
    {
        task: {
            goal: 175
        },
        reward: {
            unit: { code: "sacks", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 1, amount: 1 }
        }
    }, // 2
    {
        task: {
            goal: 300
        },
        reward: {
            unit: { code: "wands", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "wands", stage: 2, amount: 1 }
        }
    }, // 3
    {
        task: {
            goal: 750
        },
        reward: {
            unit: { code: "coins", stage: 2, amount: 1 }
        },
        premiumReward: {
            unit: { code: "rubies", stage: 2, amount: 1 }
        }
    }, // 4
    {
        task: {
            goal: 1500
        },
        reward: {
            unit: { code: "crystal", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "crystal", stage: 1, amount: 2 }
        }
    }, // 5
    {
        task: {
            goal: 3500
        },
        reward: {
            unit: { code: "treasure", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 2, amount: 1 }
        }
    }, // 6
    {
        task: {
            goal: 4500
        },
        reward: {
            unit: { code: "sacks", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 2, amount: 1 }
        }
    }, // 7
    {
        task: {
            goal: 5200
        },
        reward: {
            unit: { code: "herochest", stage: 0, amount: 1 }
        },
        premiumReward: {
            unit: { code: "herochest", stage: 1, amount: 1 }
        }
    }, // 8
    {
        task: {
            goal: 6000
        },
        reward: {
            unit: { code: "coins", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "rubies", stage: 3, amount: 1 }
        }
    }, // 9
    {
        task: {
            goal: 8000
        },
        reward: {
            unit: { code: "herochest", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "herochest", stage: 2, amount: 1 }
        }
    }, // 10
    {
        task: {
            goal: 10000
        },
        reward: {
            unit: { code: "worker", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 4, amount: 1 }
        }
    }, // 11
    {
        task: {
            goal: 12000
        },
        reward: {
            unit: { code: "magicplant", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "magicplant", stage: 5, amount: 1 }
        }
    }, // 12
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "sacks", stage: 2, amount: 1 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 2, amount: 3 }
        }
    }, // 13
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "worker", stage: 3, amount: 1 }
        },
        premiumReward: {
            unit: { code: "worker", stage: 4, amount: 1 }
        }
    }, // 14
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "herochest", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "herochest", stage: 2, amount: 2 }
        }
    }, // 15
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "wands", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "wands", stage: 2, amount: 3 }
        }
    }, // 16
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "coins", stage: 3, amount: 2 }
        },
        premiumReward: {
            unit: { code: "rubies", stage: 3, amount: 2 }
        }
    }, // 17
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "treasure", stage: 1, amount: 1 }
        },
        premiumReward: {
            unit: { code: "treasure", stage: 2, amount: 1 }
        }
    }, // 18
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "crystal", stage: 2, amount: 1 }
        },
        premiumReward: {
            unit: { code: "crystal", stage: 3, amount: 1 }
        }
    }, // 19
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "sacks", stage: 2, amount: 2 }
        },
        premiumReward: {
            unit: { code: "sacks", stage: 2, amount: 3 }
        }
    }, // 20
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "coins", stage: 4, amount: 3 }
        },
        premiumReward: {
            unit: { code: "rubies", stage: 4, amount: 3 }
        }
    }, // 21
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "herochest", stage: 1, amount: 2 }
        },
        premiumReward: {
            unit: { code: "herochest", stage: 2, amount: 2 }
        }
    }, // 22
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "worker", stage: 4, amount: 1 }
        },
        premiumReward: {
            unit: { code: "magicplant", stage: 6, amount: 1 }
        }
    }, // 23
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "magicplant", stage: 4, amount: 1 }
        },
        premiumReward: {
            unit: { code: "coinstree", stage: 3, amount: 1 }
        }
    }, // 24
    {
        task: {
            goal: 15000
        },
        reward: {
            unit: { code: "magicplant", stage: 5, amount: 1 }
        },
        premiumReward: {
            unit: { code: "energytree", stage: 3, amount: 1 }
        }
    }// 25
];
 
cleverapps.styles.ExpeditionPassWindow = {
    width: 1770,
    height: 901,

    progress: {
        x: { align: "right", dx: -27 },
        y: { align: "bottom", dy: -7 }
    },

    header: {
        x: { align: "center" },
        y: { align: "top", dy: -4 }
    },

    tickets: {
        x: { align: "left", dx: 24 },
        y: { align: "center", dy: -106 }
    }
};
