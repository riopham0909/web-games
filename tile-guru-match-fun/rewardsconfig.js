/**
 * Created by Andrey Popov on 09.10.20
 */

var RewardsConfig = {
    Packs: [],
    Tournament: {},

    DailyCup: [],
    WeeklyCup: [],
    ClanCup: [],

    BonusWorld: [
        {
            level: 3,
            reward: {
                boosters: {
                    13: 1,
                    14: 1
                }
            }
        },
        {
            level: 8,
            reward: {
                hard: 50,
                boosters: {
                    13: 1,
                    14: 1
                }
            }
        },
        {
            level: 15,
            reward: {
                hard: 200,
                boosters: {
                    13: 1,
                    14: 1,
                    15: 1
                }
            }
        }
    ],

    ShortMeta: {
        5: {
            hard: { factor: 3 }
        },

        9: {
            hard: { factor: 3 }
        }
    },

    PeriodicBonusSale: [
        {
            id: 0, product: "gold500", profit: "+60%", reward: { hard: 300 }
        },
        {
            id: 1, product: "gold1800", profit: "+56%", reward: { hard: 1000 }
        },
        {
            id: 2, product: "gold3800", profit: "+53%", reward: { hard: 2000 }
        },
        {
            id: 3, product: "gold6000", profit: "+50%", reward: { hard: 3000 }
        },
        {
            id: 4, product: "gold25000", profit: "+40%", reward: { hard: 10000 }
        }
    ]
};

if (cleverapps.config.type === "battlefield") {
    RewardsConfig.ShortMeta = {
        5: {
            soft: { factor: 3 }
        },

        9: {
            soft: { factor: 3 }
        }
    };

    RewardsConfig.Packs = {
        0: {
            hard: 100,
            soft: 500,
            troopCards: {
                probabilities: [100, 0, 0],
                amount: 5
            }
        },
        1: {
            hard: 500,
            soft: 2500,
            troopCards: {
                probabilities: [0, 100, 0],
                amount: 7
            }
        },
        2: {
            hard: 2000,
            soft: 10000,
            troopCards: {
                probabilities: [0, 0, 100],
                amount: 10
            }
        }
    };
}

if (cleverapps.config.type === "board") {
    RewardsConfig.Tournament = {
        places: [{
            hard: 300
        }, {
            hard: 250
        }, {
            hard: 200
        }, {
            hard: 100
        }, {
            hard: 50
        }]
    };

    RewardsConfig.TreasureSearch = {
        hard: 100
    };

    RewardsConfig.StickersCollection = {
        hard: 100
    };

    RewardsConfig.DailyTask = {
        easy: [
            {
                hard: 80
            }
        ],
        medium: [
            {
                hard: 120
            }
        ],
        hard: [
            {
                hard: 160
            }
        ],
        completeAll: [
            {
                hard: 180
            }
        ]
    };

    RewardsConfig.DailyCup = [
        {
            hard: 400
        },
        {
            hard: 250
        },
        {
            hard: 150
        },
        {
            hard: 50
        },
        {
            hard: 50
        },
        {
            hard: 50
        },
        {
            hard: 50
        },
        {
            hard: 50
        },
        {
            hard: 50
        },
        {
            hard: 50
        }
    ];

    RewardsConfig.Packs = [{
        hard: 800
    }, {
        hard: 2600
    }, {
        hard: 17000
    }];

    RewardsConfig.Subscription = {
        hard: 600
    };

    RewardsConfig.MiniGame = [
        {
            hard: 50
        },

        {
            hard: 100
        }
    ];

    RewardsConfig.MiniGameNovice = [
        {
            hard: 50
        }
    ];

    RewardsConfig.CookieJar = {
        hard: 50
    };
}

if (cleverapps.config.type === "match3") {
    RewardsConfig.MiniGame = [
        {
            hard: 50
        },

        {
            boosters: {
                5: 1
            },
            hard: 50
        },

        {
            boosters: {
                5: 1
            }
        },

        {
            hard: 50
        },

        {
            boosters: {
                6: 1
            }
        },

        {
            boosters: {
                6: 1
            },
            hard: 50
        },

        {
            hard: 50
        },

        {
            boosters: {
                7: 1
            }
        },

        {
            boosters: {
                7: 1
            },
            hard: 50
        }
    ];

    RewardsConfig.MiniGameBeginner = [
        {
            unlimitedLives: "30 minutes"
        }
    ];

    RewardsConfig.MiniGameNovice = [
        {
            hard: 50
        }
    ];

    RewardsConfig.Tournament = {
        places: [{
            boosters: {
                5: 2,
                6: 2,
                7: 2
            },
            unlimitedLives: "12 hours"
        }, {
            boosters: {
                6: 1,
                7: 1
            },
            unlimitedLives: "6 hour"
        }, {
            boosters: {
                5: 1,
                6: 1
            },
            unlimitedLives: "1 hour"
        }, {
            boosters: {
                6: 1
            },
            unlimitedLives: "45 minutes",
            exp: 5
        }, {
            boosters: {
                5: 1
            },
            unlimitedLives: "30 minutes",
            exp: 3
        }]
    };

    RewardsConfig.DailyTask = {
        easy: [
            {
                unlimitedLives: "15 minutes"
            }
        ],
        medium: [
            {
                boosters: { 6: 1 },
                exp: 1
            }
        ],
        hard: [
            {
                unlimitedLives: "30 minutes"
            }
        ],
        completeAll: [
            {
                boosters: { 0: 1, 1: 1 },
                exp: 5
            }
        ]
    };

    RewardsConfig.TreasureSearch = {
        unlimitedLives: "12 hours",
        stars: 10,
        exp: 20
    };

    RewardsConfig.DailyCup = [
        {
            unlimitedLives: "1 day",
            boosters: {
                5: 5,
                6: 5,
                7: 5
            }
        },
        {
            unlimitedLives: "6 hours",
            boosters: {
                5: 4,
                6: 4,
                7: 4
            }
        },
        {
            unlimitedLives: "3 hours",
            boosters: {
                5: 3,
                6: 3,
                7: 3
            }
        },
        {
            unlimitedLives: "2 hour",
            boosters: {
                5: 1,
                6: 1,
                7: 1
            }
        },
        {
            boosters: {
                5: 1,
                6: 1
            },
            unlimitedLives: "2 hour"
        },
        {
            boosters: {
                5: 1,
                6: 1
            },
            unlimitedLives: "2 hour"
        },
        {
            boosters: {
                5: 1,
                6: 1
            },
            unlimitedLives: "2 hour"
        },
        {
            boosters: {
                5: 1
            },
            unlimitedLives: "1 hour"
        },
        {
            boosters: {
                5: 1
            },
            unlimitedLives: "1 hour"
        },
        {
            boosters: {
                5: 1
            },
            unlimitedLives: "1 hour"
        }];

    RewardsConfig.Packs = [
        {
            boosters: {
                5: 1,
                6: 1,
                7: 1
            },
            hard: 500,
            unlimitedLives: "1 day"
        },
        {
            boosters: {
                5: 2,
                6: 2,
                7: 2
            },
            hard: 1800,
            unlimitedLives: "3 day"
        },
        {
            boosters: {
                5: 14,
                6: 14,
                7: 14
            },
            hard: 12000,
            unlimitedLives: "9 day"
        }
    ];

    RewardsConfig.Subscription = {
        hard: 300,
        exp: 1,
        unlimitedLives: "2 hours",
        boosters: {
            0: 3
        }
    };

    RewardsConfig.BonusWorld = [
        {
            level: 3,
            reward: {
                unlimitedLives: "1 hour"
            }
        },
        {
            level: 8,
            reward: {
                unlimitedLives: "1 hours",
                exp: 5,
                boosters: {
                    5: 1,
                    6: 1
                }
            }
        },
        {
            level: 15,
            reward: {
                hard: 150,
                unlimitedLives: "24 hours",
                boosters: {
                    5: 1,
                    6: 1,
                    7: 1
                }
            }
        }
    ];

    RewardsConfig.PeriodicBonusSale = [
        {
            id: 0,
            product: "gold500",
            profit: "+98%",
            reward: {
                hard: 150,
                unlimitedLives: "6 hours",
                boosters: {
                    7: 2
                }
            }
        },
        {
            id: 1,
            product: "gold1800",
            profit: "+67%",
            reward: {
                hard: 400,
                unlimitedLives: "48 hours",
                boosters: {
                    7: 3
                }
            }
        },
        {
            id: 2,
            product: "gold3800",
            profit: "+53%",
            reward: {
                hard: 700,
                unlimitedLives: "72 hours",
                boosters: {
                    7: 5
                }
            }
        },
        {
            id: 3,
            product: "gold6000",
            profit: "+51%",
            reward: {
                hard: 1000,
                unlimitedLives: "120 hours",
                boosters: {
                    7: 7
                }
            }
        },
        {
            id: 4,
            product: "gold25000",
            profit: "+35%",
            reward: {
                hard: 5000,
                unlimitedLives: "168 hours",
                boosters: {
                    7: 14
                }
            }
        }
    ];
}

if (cleverapps.config.type === "solitaire") {
    RewardsConfig.MiniGame = [
        {
            hard: 50,
            randomBoosters: {
                types: [10, 11, 12],
                amount: 1
            }
        },
        {
            hard: 50,
            randomBoosters: {
                types: [10, 11, 12],
                amount: 2
            }
        },
        {
            randomBoosters: {
                types: [10, 11, 12],
                amount: 1
            }
        },
        {
            // betGold: 500,
            randomBoosters: {
                types: [10, 11, 12],
                amount: 2
            }
        }
    ];

    RewardsConfig.MiniGameBeginner = [
        {
            hard: 50
        },
        {
            hard: 100
        }
    ];

    RewardsConfig.MiniGameNovice = [
        {
            hard: 50,
            randomBoosters: {
                types: [10, 11, 12],
                amount: 1
            }
        }
    ];

    RewardsConfig.TreasureSearch = {
        unlimitedLives: "12 hours",
        boosters: {
            10: 1,
            11: 1,
            12: 1
        }
    };

    RewardsConfig.Tournament = {
        places: [{
            boosters: {
                10: 2,
                11: 2,
                12: 2
            },
            unlimitedLives: "3 hours"
        }, {
            boosters: {
                11: 2,
                12: 2
            },
            unlimitedLives: "1 hour"
        }, {
            boosters: {
                10: 1,
                11: 1,
                12: 1
            },
            unlimitedLives: "30 minutes"
        }, {
            boosters: {
                11: 1,
                12: 1
            },
            unlimitedLives: "15 minutes"
        }, {
            boosters: {
                10: 1,
                11: 1
            },
            unlimitedLives: "15 minutes"
        }]
    };

    RewardsConfig.DailyTask = {
        easy: [
            {
                unlimitedLives: "15 minutes"
            }
        ],
        medium: [
            {
                boosters: {
                    12: 1
                }
            }
        ],
        hard: [
            {
                unlimitedLives: "30 minutes"
            }
        ],
        completeAll: [
            {
                boosters: {
                    10: 1,
                    11: 1
                },
                unlimitedLives: "30 minutes"
            }
        ]
    };

    RewardsConfig.DailyCup = [
        {
            unlimitedLives: "1 day",
            // betGold: 2400,
            boosters: {
                10: 5,
                11: 5,
                12: 5
            }
        },
        {
            unlimitedLives: "6 hours",
            boosters: {
                10: 4,
                11: 4,
                12: 4
            }
        },
        {
            unlimitedLives: "3 hours",
            boosters: {
                10: 3,
                11: 3,
                12: 3
            }
        },
        {
            unlimitedLives: "1 hour",
            boosters: {
                10: 2,
                11: 2,
                12: 2
            }
        },
        {
            unlimitedLives: "30 minutes",
            boosters: {
                10: 1,
                11: 1,
                12: 1
            }
        },
        {
            unlimitedLives: "30 minutes",
            boosters: {
                10: 1,
                11: 1,
                12: 1
            }
        },
        {
            unlimitedLives: "30 minutes",
            boosters: {
                10: 1,
                11: 1,
                12: 1
            }
        },
        {
            unlimitedLives: "15 minutes",
            // betGold: 50,
            boosters: {
                10: 1,
                11: 1,
                12: 1
            }
        },
        {
            unlimitedLives: "15 minutes",
            // betGold: 50,
            boosters: {
                10: 1,
                11: 1,
                12: 1
            }
        },
        {
            unlimitedLives: "15 minutes",
            // betGold: 50,
            boosters: {
                10: 1,
                11: 1,
                12: 1
            }
        }
    ];

    RewardsConfig.Packs = [{
        boosters: {
            10: 2,
            11: 2,
            12: 2
        },
        hard: 200
    }, {
        boosters: {
            10: 6,
            11: 6,
            12: 6
        },
        hard: 800
    }, {
        boosters: {
            10: 30,
            11: 30,
            12: 30
        },
        hard: 8000
    }];

    RewardsConfig.Subscription = {
        boosters: {
            10: 2,
            11: 2,
            12: 2
        },
        hard: 250,
        unlimitedLives: "3 hours"
    };

    RewardsConfig.PeriodicBonusSale = [
        {
            id: 0,
            product: "gold500",
            profit: "+98%",
            reward: {
                hard: 150,
                unlimitedLives: "6 hours",
                boosters: {
                    12: 2
                }
            }
        },
        {
            id: 1,
            product: "gold1800",
            profit: "+67%",
            reward: {
                hard: 400,
                unlimitedLives: "48 hours",
                boosters: {
                    12: 3
                }
            }
        },
        {
            id: 2,
            product: "gold3800",
            profit: "+53%",
            reward: {
                hard: 700,
                unlimitedLives: "72 hours",
                boosters: {
                    12: 5
                }
            }
        },
        {
            id: 3,
            product: "gold6000",
            profit: "+51%",
            reward: {
                hard: 1000,
                unlimitedLives: "120 hours",
                boosters: {
                    12: 7
                }
            }
        },
        {
            id: 4,
            product: "gold25000",
            profit: "+35%",
            reward: {
                hard: 5000,
                unlimitedLives: "168 hours",
                boosters: {
                    12: 14
                }
            }
        }
    ];
}

if (cleverapps.config.type === "differences") {
    RewardsConfig.Tournament = {
        places: [{
            boosters: {
                8: 3,
                9: 3
            },
            unlimitedLives: "3 hours"
        }, {
            boosters: {
                8: 2,
                9: 2
            },
            unlimitedLives: "1 hour"
        }, {
            boosters: {
                8: 1,
                9: 1
            },
            unlimitedLives: "30 minutes"
        }, {
            boosters: {
                8: 1
            },
            unlimitedLives: "15 minutes"
        }, {
            boosters: {
                9: 1
            },
            unlimitedLives: "15 minutes"
        }]
    };

    RewardsConfig.DailyTask = {
        easy: [
            {
                unlimitedLives: "15 minutes"
            }
        ],
        medium: [
            {
                boosters: {
                    8: 1
                }
            }
        ],
        hard: [
            {
                unlimitedLives: "30 minutes"
            }
        ],
        completeAll: [
            {
                unlimitedLives: "15 minutes",
                boosters: {
                    8: 1,
                    9: 1
                }
            }
        ]
    };

    RewardsConfig.MiniGame = [
        {
            hard: 50,
            randomBoosters: {
                types: [8, 9],
                amount: 1
            }
        },
        {
            hard: 100
        }
    ];

    RewardsConfig.MiniGameBeginner = [
        {
            hard: 50,
            randomBoosters: {
                types: [8, 9],
                amount: 1
            }
        },
        {
            hard: 100
        }
    ];

    RewardsConfig.MiniGameNovice = [
        {
            hard: 50,
            randomBoosters: {
                types: [8, 9],
                amount: 1
            }
        }
    ];

    RewardsConfig.TreasureSearch = {
        unlimitedLives: "12 hours",
        boosters: {
            8: 1,
            9: 2
        }
    };

    RewardsConfig.DailyCup = [
        {
            unlimitedLives: "1 day",
            boosters: {
                2: 1
            }
        },
        {
            unlimitedLives: "6 hours",
            boosters: {
                1: 1
            }
        },
        {
            unlimitedLives: "3 hours",
            boosters: {
                0: 1
            }
        },
        {
            unlimitedLives: "1 hour"
        },
        {
            unlimitedLives: "30 minutes"
        },
        {
            unlimitedLives: "30 minutes"
        },
        {
            unlimitedLives: "30 minutes"
        },
        {
            unlimitedLives: "15 minutes"
        },
        {
            unlimitedLives: "15 minutes"
        },
        {
            unlimitedLives: "15 minutes"
        }
    ];

    RewardsConfig.Packs = [{
        boosters: {
            8: 2,
            9: 2
        },
        hard: 200
    }, {
        boosters: {
            8: 6,
            9: 6
        },
        hard: 800
    }, {
        boosters: {
            8: 30,
            9: 30
        },
        hard: 8000
    }];

    RewardsConfig.Subscription = {
        unlimitedLives: "3 hours",
        hard: 250,
        boosters: {
            8: 3,
            9: 3
        }
    };
}

if (cleverapps.config.name === "olympics") {
    RewardsConfig.Tournament = {
        places: [{
            hard: 300,
            unlimitedLives: "1 hour"
        }, {
            hard: 250,
            unlimitedLives: "45 minutes"
        }, {
            hard: 200,
            unlimitedLives: "30 minutes"
        }, {
            hard: 100,
            unlimitedLives: "15 minutes"
        }, {
            hard: 50,
            unlimitedLives: "5 minutes"
        }]
    };

    RewardsConfig.Subscription = {
        hard: 600,
        unlimitedLives: "3 hours"
    };

    RewardsConfig.TreasureSearch = {
        unlimitedLives: "12 hours"
    };

    RewardsConfig.WeeklyCup = [
        {
            hard: 3000
        },
        {
            hard: 2000
        },
        {
            hard: 1000
        },
        {
            hard: 200
        },
        {
            hard: 200
        },
        {
            hard: 200
        },
        {
            hard: 200
        },
        {
            hard: 200
        },
        {
            hard: 200
        },
        {
            hard: 200
        }
    ];

    RewardsConfig.DailyTask = {
        easy: [
            {
                hard: 80,
                unlimitedLives: "10 minutes"
            }
        ],
        medium: [
            {
                hard: 120,
                unlimitedLives: "15 minutes"
            }
        ],
        hard: [
            {
                hard: 160,
                unlimitedLives: "30 minutes"
            }
        ],
        completeAll: [
            {
                hard: 180,
                unlimitedLives: "30 minutes"
            }
        ]
    };
}

if (cleverapps.config.name === "scramble") {
    RewardsConfig.Tournament = {
        places: [{
            boosters: {
                13: 2,
                14: 2,
                15: 2
            }
        }, {
            boosters: {
                14: 2,
                15: 2
            }
        }, {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            }
        }, {
            boosters: {
                14: 1,
                15: 1
            }
        }, {
            boosters: {
                13: 1,
                14: 1
            }
        }]
    };

    RewardsConfig.Packs = [{
        boosters: {
            13: 2,
            14: 2,
            15: 2
        },
        hard: 200
    }, {
        boosters: {
            13: 6,
            14: 6,
            15: 6
        },
        hard: 800
    }, {
        boosters: {
            13: 30,
            14: 30,
            15: 30
        },
        hard: 8000
    }];

    RewardsConfig.DailyTask = {
        easy: [
            {
                boosters: {
                    13: 1
                }
            }
        ],
        medium: [
            {
                boosters: {
                    14: 1
                }
            }
        ],
        hard: [
            {
                boosters: {
                    15: 1
                },
                hard: 15
            }
        ],
        completeAll: [
            {
                boosters: {
                    14: 1,
                    15: 1
                },
                hard: 25
            }
        ]
    };

    RewardsConfig.DailyCup = [
        {
            boosters: {
                13: 5,
                14: 5,
                15: 5
            },
            hard: 300
        },
        {
            boosters: {
                13: 4,
                14: 4,
                15: 4
            },
            hard: 200
        },
        {
            boosters: {
                13: 3,
                14: 3,
                15: 3
            },
            hard: 100
        },
        {
            boosters: {
                13: 2,
                14: 2,
                15: 2
            },
            hard: 50
        },
        {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            },
            hard: 50
        },
        {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            },
            hard: 50
        },
        {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            },
            hard: 50
        },
        {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            }
        },
        {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            }
        },
        {
            boosters: {
                13: 1,
                14: 1,
                15: 1
            }
        }
    ];

    RewardsConfig.MiniGame = [
        {
            hard: 50,
            randomBoosters: {
                types: [14, 15],
                amount: 1
            }
        },
        {
            hard: 50,
            randomBoosters: {
                types: [14, 15],
                amount: 2
            }
        },
        {
            randomBoosters: {
                types: [14, 15],
                amount: 1
            }
        },
        {
            randomBoosters: {
                types: [14, 15],
                amount: 2
            }
        }
    ];

    RewardsConfig.MiniGameBeginner = [
        {
            hard: 50
        },
        {
            hard: 100
        }
    ];

    RewardsConfig.MiniGameNovice = [
        {
            hard: 50,
            randomBoosters: {
                types: [13, 14, 15],
                amount: 1
            }
        }
    ];

    RewardsConfig.Subscription = {
        hard: 250,
        boosters: {
            13: 2,
            14: 2,
            15: 2
        }
    };

    RewardsConfig.TreasureSearch = {
        hard: 100,
        boosters: {
            13: 1,
            14: 1,
            15: 1
        }
    };

    RewardsConfig.CookieJar = {
        hard: 15
    };
}

if (cleverapps.config.type === "merge") {
    RewardsConfig.Packs = [
        {
            hard: 50,
            energy: 200
        },
        {
            hard: 100,
            energy: 350,
            wands: 250,
            worker: "3 day"
        },
        {
            hard: 1000,
            energy: 1500,
            wands: 500,
            soft: 3000,
            worker: "5 day"
        }
    ];

    RewardsConfig.LivesFeast = {
        places: [{
            unit: [
                { code: "treasure", stage: 2, amount: 1 },
                { code: "energytree", stage: 2, amount: 1 }
            ]
        }, {
            unit: [
                { code: "treasure", stage: 1, amount: 1 },
                { code: "energytree", stage: 1, amount: 1 }
            ]
        }, {
            unit: [
                { code: "treasure", stage: 0, amount: 1 },
                { code: "energytree", stage: 0, amount: 1 }
            ]
        }],

        offer: {
            energy: 250,
            worker: Product.FormatTimePeriod("1 day", true)
        }
    };

    RewardsConfig.SoftFeast = {
        places: [{
            unit: [
                { code: "treasure", stage: 2, amount: 1 },
                { code: "coinstree", stage: 2, amount: 1 }
            ]
        }, {
            unit: [
                { code: "treasure", stage: 1, amount: 1 },
                { code: "coinstree", stage: 1, amount: 1 }
            ]
        }, {
            unit: [
                { code: "treasure", stage: 0, amount: 1 },
                { code: "coinstree", stage: 0, amount: 1 }
            ]
        }],

        offer: {
            soft: 1000,
            energy: 100
        }
    };

    RewardsConfig.KrakenFeast = {
        places: [{
            unit: { code: "energytree", stage: 2, amount: 1 }
        }, {
            unit: { code: "energytree", stage: 1, amount: 1 }
        }, {
            unit: { code: "energytree", stage: 0, amount: 1 }
        }],

        offer: {
            kraken: true,
            unit: [
                { code: "wands", stage: 4, amount: 2 },
                { code: "sacks", stage: 2, amount: 3 }
            ]
        }
    };

    RewardsConfig.ExpeditionFeast = {
        places: [{
            unit: { code: "treasure", stage: 2, amount: 1 }
        }, {
            unit: { code: "treasure", stage: 1, amount: 1 }
        }, {
            unit: { code: "treasure", stage: 0, amount: 1 }
        }]
    };

    RewardsConfig.SnailFeast = {
        places: [{
            unit: [{ code: "seasonchest", stage: 2, amount: 1 },
                { code: "sacks", stage: 2, amount: 1 },
                { code: "coins", stage: 5, amount: 1 }]
        }, {
            unit: [{ code: "seasonchest", stage: 1, amount: 1 },
                { code: "sacks", stage: 1, amount: 1 },
                { code: "coins", stage: 1, amount: 1 }]
        }, {
            unit: [{ code: "seasonchest", stage: 0, amount: 1 },
                { code: "sacks", stage: 0, amount: 1 }]
        }]
    };

    RewardsConfig.BuildPass = {
        offer: {
            unit: [
                { code: "crystal", stage: 3, amount: 2 },
                {
                    code: "bppointsstar", stage: 0, amount: 1, pointsValue: 250
                }
            ]
        }
    };

    RewardsConfig.SalePass = {
        offer: {
            unit: [
                {
                    code: "bppointscrystal", stage: 0, amount: 1, pointsValue: 250
                }
            ],
            soft: 1200
        }
    };

    RewardsConfig.Subscription = {
        worker: {
            subscription: true
        },
        energy: 100,
        unit: { code: "treasure", stage: 2, amount: 1 }
    };

    RewardsConfig.SubscriptionInstant = {
        energy: 50,
        unit: { code: "treasure", stage: 1, amount: 1 }
    };

    RewardsConfig.DragoniaPack = {
        hard: 1200,
        unit: [{ code: "dragonpack", stage: 0, amount: 1 }]
    };

    RewardsConfig.Dragonia2Pack = {
        hard: 1200,
        unit: [{ code: "dr2dragonpack", stage: 0, amount: 1 }]
    };

    RewardsConfig.HalloweenPack = {
        hard: 1200,
        unit: [{ code: "hlpack", stage: 0, amount: 1 }]
    };

    RewardsConfig.UnderseaPack = {
        hard: 1200,
        unit: [{ code: "underseapack", stage: 0, amount: 1 }]
    };

    RewardsConfig.Undersea2Pack = {
        hard: 1200,
        unit: [{ code: "sea2pack", stage: 0, amount: 1 }]
    };

    RewardsConfig.ClanCup = [{
        soft: 800
    }, {
        soft: 400
    }, {
        soft: 270
    }, {
        soft: 200
    }, {
        soft: 130
    }];

    RewardsConfig.SnailPack = {
        unit: [{
            code: "seasnailhouse", stage: 0, amount: 1
        }]
    };

    RewardsConfig.SnailHouseDragoniaPack = {
        unit: [{
            code: "drsnailhouse", stage: 0, amount: 1
        }]
    };

    RewardsConfig.RapunzelPack = {
        hard: 800,
        energy: 300
    };

    RewardsConfig.XmasPack = {
        hard: 1200,
        unit: [{ code: "xmpack", stage: 0, amount: 1 }]
    };

    RewardsConfig.ChinaPack = {
        hard: 600,
        energy: 600
    };

    RewardsConfig.PeriodicPack = {
        hard: 1300,
        soft: 1300
    };

    RewardsConfig.EasterPack = {
        hard: 800,
        energy: 300
    };

    RewardsConfig.DailyTask = {
        easy: [
            {
                soft: 15
            }
        ],
        medium: [
            {
                soft: 30
            }
        ],
        hard: [
            {
                soft: 45,
                exp: 100
            }
        ],
        completeAll: [
            {
                unit: { code: "dailytaskchest", stage: 0, amount: 1 }
            }
        ]
    };

    RewardsConfig.PeriodicBonusSale = [
        {
            id: 0, product: "gold500", profit: "+42%", reward: { hard: 20, soft: 100, energy: 100 }
        },
        {
            id: 1, product: "gold1800", profit: "+32%", reward: { hard: 100, soft: 300, energy: 200 }
        },
        {
            id: 2, product: "gold3800", profit: "+37%", reward: { hard: 300, soft: 800, energy: 400 }
        },
        {
            id: 3, product: "gold6000", profit: "+39%", reward: { hard: 500, soft: 1500, energy: 600 }
        },
        {
            id: 4, product: "gold25000", profit: "+43%", reward: { hard: 3000, soft: 7000, energy: 1000 }
        }
    ];
}

if (cleverapps.config.type === "tile3") {
    RewardsConfig.MiniGame = [
        {
            soft: 50
        }
    ];

    RewardsConfig.MiniGameBeginner = [
        {
            soft: 50
        }
    ];

    RewardsConfig.MiniGameNovice = [
        {
            soft: 50
        }
    ];

    RewardsConfig.DailyTask = {
        easy: [
            {
                unlimitedLives: "15 minutes"
            }
        ],
        medium: [
            {
                unlimitedLives: "15 minutes"
            }
        ],
        hard: [
            {
                unlimitedLives: "15 minutes"
            }
        ],
        completeAll: [
            {
                unlimitedLives: "15 minutes"
            }
        ]
    };

    RewardsConfig.Tournament = {
        places: [{
            soft: 300,
            unlimitedLives: "3 hours"
        }, {
            soft: 200,
            unlimitedLives: "1 hour"
        }, {
            soft: 100,
            unlimitedLives: "30 minutes"
        }, {
            unlimitedLives: "15 minutes"
        }, {
            unlimitedLives: "15 minutes"
        }]
    };

    RewardsConfig.Packs = [
        {
            hard: 200,
            soft: 800
        },
        {
            hard: 800,
            soft: 2500
        },
        {
            hard: 5000,
            soft: 10000
        }
    ];

    RewardsConfig.PeriodicBonusSale = [
        {
            id: 0, product: "gold500", profit: "+78%", reward: { hard: 50, soft: 500 }
        },
        {
            id: 1, product: "gold1800", profit: "+52%", reward: { hard: 150, soft: 1500 }
        },
        {
            id: 2, product: "gold3800", profit: "+45%", reward: { hard: 300, soft: 3000 }
        },
        {
            id: 3, product: "gold6000", profit: "+43%", reward: { hard: 550, soft: 4500 }
        },
        {
            id: 4, product: "gold25000", profit: "+40%", reward: { hard: 3000, soft: 12000 }
        }
    ];

    RewardsConfig.kit3 = {
        soft: 300,
        boosters: {
            17: 3,
            23: 3
        }
    };

    RewardsConfig.kit10 = {
        soft: 2000,
        boosters: {
            23: 5,
            18: 5
        }
    };
    RewardsConfig.ChainSale = [
        {
            reward: { soft: 300 }
        },
        {
            reward: {
                boosters: {
                    18: 1,
                    17: 1
                } 
            }
        },
        {
            product: "kit3",
            reward: RewardsConfig.kit3
        },
        {
            reward: {
                soft: 100,
                boosters: {
                    18: 1,
                    23: 1
                }
            }
        },
        {
            reward: {
                soft: 150,
                boosters: {
                    18: 3,
                    17: 1
                }
            }
        },
        {
            product: "kit10",
            reward: RewardsConfig.kit10
        },
        {
            reward: {
                hard: 200,
                lives: 3
            }
        },
        {
            reward: {
                boosters: {
                    18: 3,
                    17: 2,
                    23: 1
                } 
            }
        }
    ];
}

if (cleverapps.config.type === "blocks") {
    RewardsConfig.PeriodicBonusSale = [
        {
            id: 0, product: "gold500", profit: "+78%", reward: { hard: 50, soft: 500 }
        },
        {
            id: 1, product: "gold1800", profit: "+52%", reward: { hard: 150, soft: 1500 }
        },
        {
            id: 2, product: "gold3800", profit: "+45%", reward: { hard: 300, soft: 3000 }
        },
        {
            id: 3, product: "gold6000", profit: "+43%", reward: { hard: 550, soft: 4500 }
        },
        {
            id: 4, product: "gold25000", profit: "+40%", reward: { hard: 3000, soft: 12000 }
        }
    ];
}