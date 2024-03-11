/**
 * Created by andrey on 20.01.2023
 */

var DraugiemProducts = {
    heroes: {
        "buyExp10": 3846,
        "buyExp150": 3847,
        "addMoves1": 3848,
        "addMoves2": 3849,
        "addMoves3": 3850,
        "addMoves5": 3851,
        "piggybank500": 3852,
        "piggybank1800": 3853,
        "piggybank6000": 3854,
        "piggybank25000": 3855,
        "gold500": 3857,
        "gold1800": 3858,
        "gold3800": 3859,
        "gold6000": 3860,
        "gold25000": 3861,
        "starterPack0": 3862,
        "starterPack": 3863,
        "starterPack2": 3864,
        "battlepass": 3869,
        "unlimitedLives": 3872,
        "sweetPack": 3873,
        "jamPack": 3874,
        "tastyPack": 3875,
        "honeyPack": 3876,
        "epicPack": 3877
    },

    riddles: {
        "buyExp10": 3750,
        "buyExp150": 3751,
        "addMoves1": 3741,
        "addMoves2": 3752,
        "addMoves3": 3753,
        "addMoves5": 3754,
        "piggybank500": 3755,
        "piggybank1800": 3756,
        "piggybank6000": 3757,
        "piggybank25000": 3758,
        "gold500": 3768,
        "gold1800": 3774,
        "gold3800": 3747,
        "gold6000": 3775,
        "gold25000": 3746,
        "starterPack0": 3740,
        "starterPack": 3748,
        "starterPack2": 3749,
        "battlepass": 3824,
        "unlimitedLives": 3769,
        "sweetPack": 3772,
        "jamPack": 3761,
        "tastyPack": 3764,
        "honeyPack": 3762,
        "epicPack": 3763
    },
    
    zenmatch: {
        "gold500": 4083,
        "gold1800": 4084,
        "gold3800": 4085,
        "gold6000": 4086,
        "gold25000": 4087,
        "starterPack0": 4088,
        "starterPack": 4089,
        "starterPack2": 4090
    },

    mergecraft: {
        "gold500": 3982,
        "gold1800": 3984,
        "gold3800": 3988,
        "gold6000": 3986,
        "gold25000": 3989,
        "starterPack0": 3987,
        "starterPack": 3983,
        "starterPack2": 3990,
        "growthFund": 3985,
        "expeditionPack": 4003,
        "kit3": 4104,
        "kit10": 4105,
        "kit50": 4106
    },

    wondermerge: {
        "gold500": 3992,
        "gold1800": 3993,
        "gold3800": 3994,
        "gold6000": 3995,
        "gold25000": 3996,
        "starterPack0": 3997,
        "starterPack": 3998,
        "starterPack2": 3999,
        "growthFund": 3991,
        "expeditionPack": 4004
    }
};

var DraugiemProductsStaging = {
    riddles: {
        "buyExp10": 4051,
        "buyExp150": 4052,
        "addMoves1": 4053,
        "addMoves2": 4054,
        "addMoves3": 4055,
        "addMoves5": 4056,
        "piggybank500": 4057,
        "piggybank1800": 4058,
        "piggybank6000": 4059,
        "piggybank25000": 4060,
        "gold500": 4061,
        "gold1800": 4062,
        "gold3800": 4063,
        "gold6000": 4064,
        "gold25000": 4065,
        "starterPack0": 4066,
        "starterPack": 4067,
        "starterPack2": 4068,
        "battlepass": 4069,
        "unlimitedLives": 4070,
        "sweetPack": 4071,
        "jamPack": 4072,
        "tastyPack": 4073,
        "honeyPack": 4074,
        "epicPack": 4075
    }
};

if (cleverapps.config.debugMode) {
    Object.assign(DraugiemProducts, DraugiemProductsStaging);
}
