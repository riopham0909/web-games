/**
 * Created by spepa on 15.12.2020
 */

cleverapps.styles.COLORS = cleverapps.overrideColors(cleverapps.styles.COLORS, {
    COLOR_WINDOW_TEXT: new cc.Color(169, 61, 32, 255),
    DARK_TEXT_COLOR: new cc.Color(169, 61, 32, 255),

    MOVES_DANGER: new cc.Color(255, 0, 0, 255),
    PATH_COLOR: new cc.Color(255, 230, 180, 255),
    LETTER: new cc.Color(94, 24, 89, 255),

    COLOR_LIGHTBROWN: new cc.Color(200, 171, 124, 255),

    COLOR_LIGHT_WINDOW_TEXT: new cc.Color(160, 100, 70, 255),

    COLOR_VICTORY: new cc.Color(253, 217, 61, 255),

    GOAL_NOT_DONE_COLOR: new cc.Color(255, 100, 100, 255),

    BOMB_TIMER_DANGER_COLOR: new cc.Color(255, 50, 50, 255),

    HARD: new cc.Color(255, 241, 226, 255),

    GROWTH_FUND_LEVEL_TITLE_COLOR: new cc.Color(171, 121, 89, 255),
    GROWTH_FUND_LEVEL_REWARD_COLOR: new cc.Color(234, 219, 206, 255),

    CELL_COLORS: {
        a: new cc.Color(20, 160, 237, 255),
        b: new cc.Color(20, 200, 0, 255),
        c: new cc.Color(195, 61, 225, 255),
        d: new cc.Color(255, 11, 28, 255),
        e: new cc.Color(234, 199, 48, 255),
        w: new cc.Color(50, 200, 255, 255)
    },

    GREEN: new cc.Color(90, 166, 58, 255),
    DARK_BLUE: new cc.Color(15, 100, 172, 255),
    COLOR_BROWN: new cc.Color(187, 91, 45, 255),
    COLOR_BROWN_2: new cc.Color(173, 61, 0, 255),
    COLOR_DARK_YELLOW: new cc.Color(255, 194, 9, 255),
    COLOR_VIOLET: new cc.Color(255, 30, 252, 255),
    COLOR_DARK_VIOLET: new cc.Color(139, 0, 156, 255),
    LIGHT_PURPLE: new cc.Color(208, 0, 255, 255),
    ORANGE: new cc.Color(255, 115, 0, 255),
    COLOR_BONUS: new cc.Color(215, 169, 255, 255),

    LIGHT_TEXT_COLOR: new cc.Color(255, 255, 255, 255)

});

cleverapps.overrideStyles(cleverapps.styles.UI.Button, {
    keepRadius: true
});

cleverapps.overrideStyles(cleverapps.styles.DECORATORS, {
    WINDOW_TITLE_STROKE: {
        color: new cc.Color(168, 28, 54, 255),
        size: 4
    },
    TITLE_TEXT_SHADOW: {
        color: cleverapps.styles.COLORS.BLACK,
        direction: cc.size(0, -4),
        blur: 5
    },
    IMAGE_FONT_STROKE: {
        color: cleverapps.styles.COLORS.BLACK_STROKE,
        size: 2
    },
    IMAGE_FONT_STROKE_THIN: {
        color: cleverapps.styles.COLORS.BLACK_STROKE,
        size: 1
    },

    BROWN_STROKE: {
        color: cleverapps.styles.COLORS.COLOR_BROWN_2,
        size: 3
    },

    BUTTON_TEXT_STROKE: {
        color: new cc.Color(217, 0, 68, 255),
        size: 3
    },

    TILE_SHOP_BADGE_STROKE: {
        color: new cc.Color(84, 174, 33, 255),
        size: 3
    }
});

cleverapps.styles.FONTS = cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    LOADING_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE
    },
    WHITE_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.WHITE
    },
    MENUBAR_TEXT_DELTA: {
        size: 40,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },
    SMALL_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    WINDOW_BIG_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    TOOLBAR_ITEM_TIMER_TEXT: {
        size: 30
    },
    WAIT_WINDOW_TEXT: {
        size: 50,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },
    TILE_SHOP_OFFER_TEXT: {
        name: "nostroke",
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    SHOP_WINDOW_LIVES_TEXT: {
        name: "nostroke",
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    LANTERN_TIMER_FONT: {
        name: "nostroke",
        size: 35,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    TILE_REWARDS: {
        name: "nostroke",
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    TILE_REWARDS_HEADER: {
        size: 35,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },

    PRODUCT_TILE_LIMIT_TEXT: {
        name: "nostroke",
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    MENUBAR_TEXT: {
        name: "nostroke",
        size: 52,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    MENUBAR_LEVEL_TEXT: {
        name: "nostroke",
        size: 66,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    MENUBAR_WORLD_TITLE_TEXT: {
        name: "nostroke",
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    TILE_SHOP_BADGE_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.WHITE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },

    TILE_SHOP_BADGE_BIG: {
        size: 50,
        color: cleverapps.styles.COLORS.WHITE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },

    SHOP_WINDOW_TILE_TITLE: {
        size: 55,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },

    SHOP_WINDOW_SMALL_TILE_TITLE: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },

    SIDEBAR_ICON_TEXT: {
        name: "nostroke",
        size: 38,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    EPISODE_CLOUD_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.DARK_BLUE
    },

    INC_MOVES_TEXT: {
        name: "default",
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_BROWN
    },

    SWITCH_BUTTON_ON: {
        size: 28,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.BUTTON_TEXT_STROKE
    },

    SWITCH_BUTTON_OFF: {
        size: 28,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    BUSTER_NOTIFICATION_TEXT: {
        size: 34,
        color: cleverapps.styles.COLORS.WHITE
    },

    CONGRATE_TEXT: {
        size: 100,
        color: cleverapps.styles.COLORS.COLOR_DARK_YELLOW,
        stroke: cleverapps.styles.DECORATORS.BROWN_STROKE
    },

    REWARDS_LIST_TEXT: {
        name: "nostroke",
        size: 36,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    MENUBAR_TIMER_TEXT: {
        name: "nostroke",
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    SHOP_LIVES_PRODUCT_TILE_DESCRIPTION_TEXT: {
        name: "nostroke",
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    TILE_SHOP_COINS_OFFER: {
        size: 60,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },

    DAILY_TASK_PROGRESS_FONT: {
        name: "default",
        size: 28,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    VICTORY_CHEST_TEXT: {
        name: "nostroke",
        size: 48,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    // ---

    VERY_BIG_TEXT: {
        name: "nostroke",
        size: 80,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    EPISODE_TITLE_TEXT: {
        size: 80,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    DESCRIPTION_TEXT: {
        size: 23,
        color: cleverapps.styles.COLORS.COLOR_LIGHTBROWN
    },

    ADDMOVES_GOAL_RED_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.GOAL_NOT_DONE_COLOR
    },

    TIMER_TEXT: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.WHITE
    },

    DEC_MOVES_TEXT: {
        name: "default",
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_RED
    },

    SUBSCRIPTION_BUTTON_TITLE: {
        size: 22,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    SUBSCRIPTION_MAIN_TEXT: {
        size: 32,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    TERMS_LINK_TEXT: {
        size: 26,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    TERMS_TEXT: {
        size: 22,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    GAME_MESSAGE_TEXT: {
        size: 86,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    TRANSITION_LOADING_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },
    REWARDS_TEXT: {
        name: "nostroke",
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    PACKWINDOW_TITLE_TEXT: {
        size: 90,
        lineHeight: 10,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.PACKWINDOW_LABEL_STROKE
    },
    PACKWINDOW_LABEL_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },
    BOMB_TIMER_TEXT: {
        name: "nostroke",
        color: cleverapps.styles.COLORS.RIDDLES_BROWN,
        size: 30
    },
    BOMB_TIMER_DANGER_TEXT: {
        name: "nostroke",
        size: 30,
        color: cleverapps.styles.COLORS.BOMB_TIMER_DANGER_COLOR
    },
    CELL_LIVES: {
        size: 35,
        name: "nostroke",
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    DAILY_TASK_CTA: {
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    DAILY_TASKS_BAR: {
        name: "default",
        size: 30
    },
    LOSE_WINDOW_TEXT: {
        color: cleverapps.styles.COLORS.WHITE,
        size: 50
    },
    WINDOW_SMALL_TEXT: {
        name: "nostroke",
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    TOURNAMENT_PLAYER_TEXT: {
        name: "nostroke",
        size: 30,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    TEXT: {
        name: "nostroke",
        size: 45,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    WINDOW_TITLE_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.WINDOW_TITLE_STROKE
    },
    BUTTON_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.WHITE,
        shadow: cleverapps.styles.DECORATORS.BUTTON_TEXT_SHADOW,
        stroke: undefined
    },
    BUTTON_SMALL_TEXT: {
        size: 34,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TRANSPARENT_BLACK_2PX
    },
    WINDOW_TEXT: {
        name: "nostroke",
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    FBCONNECT_WINDOW_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    HERO_UPGRADE: {
        size: 36,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE_THIN
    },
    FORCE_MESSAGE_TEXT: {
        size: 39,
        color: cleverapps.styles.COLORS.COLOR_BROWN
    },
    MENUBAR_PROGRESS_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR
    },
    QUEST_PROGRESS_TEXT: {
        name: "nostroke",
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },
    DIALOGUE_PERSON_TITLE_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.WHITE,
        shadow: undefined,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE
    },
    LIGHT_TITLE_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.WINDOW_TITLE_STROKE,
        shadow: undefined
    },
    QUEST_DETAILS_TEXT: {
        name: "nostroke",
        size: 54,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },
    STARTQUESTWINDOW_TILE_TASK_TEXT: {
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },
    UNITICON_LEVEL: {
        size: 30,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },
    HERODETAILS_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },
    DARK_TEXT: {
        name: "nostroke",
        size: 45,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },
    LIGHT_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },
    UNIT_PROB: {
        size: 35,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },
    UNIT_AMOUNT: {
        size: 50,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },
    BUYINGREDIENTSWINDOW_TITLE: {
        name: "default",
        size: 45,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },
    ORDERS_PLACEHOLDER_TEXT: {
        name: "nostroke",
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    UNITSSHOP_CART_AMOUNT: {
        name: "nostroke",
        size: 40,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },
    TRAVEL_BOOK_MESSAGE_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },
    TRAVEL_BOOK_BOTTOM_TEXT: {
        name: "default",
        size: 35,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    TRAVEL_BOOK_TITLE_TEXT: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    PASS_PROGRESS_TEXT: {
        size: 42,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    PASS_PROGRESS_IMAGE_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.WHITE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    PASS_TITLE_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    ROW_DATA_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE
    },

    CLANS_ROW_NAME_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },

    CLANS_ROW_LEADER_TEXT: {
        size: 60
    },

    CLAN_CHAT_PHRASE: {
        size: 40,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    CLAN_CHANGE_EMBLEM_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    CLAN_PROPERTY_TEXT: {
        size: 52,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },

    CLAN_SETTING_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    TABS_TEXT_FONT: {
        size: 40,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        shadow: undefined,
        stroke: undefined
    },

    TABS_TEXT_FONT_DISABLED: {
        size: 40,
        color: new cc.Color(254, 241, 226, 255),
        shadow: undefined,
        stroke: {
            color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
            size: 1
        }
    },

    DELETE_ACCOUNT_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },
    GOAL_TEXT: {
        size: 30
    },

    CLOVERS_TEXT: {
        size: 30
    },

    MOVES_CELL_TEXT: {
        size: 35
    },

    GROWTH_FUND_LEVEL_TITLE: {
        size: 35,
        color: cleverapps.styles.COLORS.GROWTH_FUND_LEVEL_TITLE_COLOR,
        stroke: undefined,
        shadow: undefined
    },

    GROWTH_FUND_LEVEL_TITLE_REACHED: {
        size: 35,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },

    GROWTH_FUND_LEVEL_REWARD: {
        size: 35,
        color: cleverapps.styles.COLORS.GROWTH_FUND_LEVEL_REWARD_COLOR
    },

    GROWTH_FUND_LEVEL_REWARD_REACHED: {
        name: "nostroke",
        size: 35,
        color: cleverapps.styles.COLORS.GREEN,
        stroke: undefined,
        shadow: undefined
    },

    GROWTH_FUND_LEVEL_VALUE_REACHED: {
        name: "nostroke",
        size: 35,
        color: cleverapps.styles.COLORS.GREEN,
        stroke: undefined,
        shadow: undefined
    },

    GROWTH_FUND_CTA2: {
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR,
        stroke: undefined,
        shadow: undefined
    },

    GROWTH_FUND_CTA1: {
        color: new cc.Color(255, 198, 0, 255),
        stroke: {
            color: new cc.Color(191, 117, 0, 255),
            size: 2
        },
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    },

    GROWTH_FUND_LEVEL_VALUE: {
        name: "nostroke",
        size: 35,
        color: cleverapps.styles.COLORS.GROWTH_FUND_LEVEL_REWARD_COLOR
    },

    SHOP_USER_GOLD_TEXT: {
        name: "nostroke",
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT
    },

    BONUSBG_TITLE: {
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: {
            color: new cc.Color(74, 255, 255, 255),
            direction: cc.size(0, 0),
            blur: 10
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.UI, {
    Avatar: {
        x: 4,
        top: 4,
        bottom: 8
    },

    Tooltip: {
        rewards: {
            extraWidth: 40
        }
    },

    ImageFont: {
        fixedNumberWidth: {
            stretch: 0.9
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.MenuBar, {
    smallMargin: 16,
    margin: 24
});

if (cleverapps.styles.BackgroundsWindow) {
    cleverapps.overrideStyles(cleverapps.styles.BackgroundsWindow, {
        padding: {
            bottom: -26,
            right: -20,
            left: -10
        },

        item: {
            size: {
                vertical: {
                    width: 443,
                    height: 633
                },
                horizontal: {
                    width: 600,
                    height: 350
                }
            },
            bg: {
                padding: {
                    x: 13,
                    y: 14
                },
                x: { align: "center" },
                y: { align: "center", dy: 4 }
            }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.MenuBarItem, {
    noColoredText: true,

    bg: {
        width: 299,
        height: 90,
        minWidth: 247,
        padding: {
            right: 16
        }
    },

    icon: {
        x: 15
    },

    plusButton: {
        offset: {
            x: -16,
            y: 6
        }
    },

    iconText: {
        position: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 6 }
        }
    },

    timer: {
        height: 55,
        padding: {
            x: 30
        },

        position: {
            x: { align: "right", dx: -26 },
            y: { align: "bottom", dy: -44 }
        },

        text: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 },
            width: 200
        }
    },

    attention: {
        x: { align: "right", dx: 0 },
        y: { align: "bottom", dy: -24 }
    },

    premiumSticker: {
        x: { align: "center", dx: 95 },
        y: { align: "center", dy: 58 },

        text: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 1 },
            width: 125,
            rotation: 10
        }
    }
});

cleverapps.override(cleverapps.styles.SettingsWindow, {
    button: {
        width: 480,
        width2: 230,
        width3: 150,

        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.CloseButton, {
    x: { align: "right", dx: -45 },
    y: { align: "top", dy: -40 }
});

cleverapps.overrideStyles(cleverapps.styles.Window, {
    minHeight: 400,
    minWidth: 300,

    padding: {
        top: 164,
        left: 56,
        right: 56,
        bottom: 58
    },

    HelpButton: {
        x: { align: "left", dx: 35 },
        y: { align: "top", dy: -35 },
        zOrder: 3
    },

    BottomButton: {
        height: 110
    },

    Foreground: {
        padding: {
            top: 124,
            left: 29,
            right: 30,
            bottom: 32
        }
    },

    BoundingBoxPadding: {
        x: 25,
        y: 25
    }
});

cleverapps.overrideStyles(cleverapps.styles.Tabs, {
    margin: 10,

    buttons: {
        width: 127,
        height: 96,

        padding: {
            bottom: 15
        },

        disabled: {
            opacity: 255
        }
    },

    attention: {
        x: { align: "left", dx: -20 },
        y: { align: "top", dy: -5 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.SideBarIconView, {
    text: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -5 },
        width: 148,
        height: 56,
        offsetY: 1,

        titleIcon: {
            x: { align: "left", dx: -55 }
        }
    },

    lock: {
        x: { align: "right", dx: -5 },
        y: { align: "center", dy: -5 }
    },

    mark: {
        x: { align: "right", dx: -10 },
        y: { align: "top", dy: -10 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.SideBarSlot, {
    margin: 25,

    padding: {
        top: 240
    }
});

cleverapps.overrideStyles(cleverapps.styles.TileRewardsBlock, {
    colMargin: 7,
    amountMargin: 3
});

cleverapps.overrideStyles(cleverapps.styles.TileIcon, {
    wrap: {
        dy: 20
    },
    sweetPack: {
        wrap: { dy: 40 }
    },
    jamPack: {
        wrap: { dy: 30 }
    },
    gold25000: {
        wrap: { dy: -50 }
    },
    gold6000: {
        wrap: { dy: -20 }
    },
    tastyPack: {
        wrap: {
            dy: 20
        }
    },

    honeyPack: {
        wrap: { dy: 15 }
    },

    hardForVideo: {
        wrap: {
            dy: -15
        }
    },
    refillLives: {
        wrap: {
            dy: 20
        }
    },

    livesForVideo: {
        wrap: {
            dy: -15
        }
    },

    unlimitedLives: {
        wrap: {
            dy: -10
        }
    }

});

cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, {
    width: 460,
    height: 820,

    background: {
        adjustBackgroundCapInsets: true
    },

    badge: {
        x: { align: "right", dx: 40 },
        y: { align: "top", dy: 35 }
    },

    limit: {
        y: -10
    },

    title: {
        width: 494,
        height: 120,

        text: {
            y: { align: "center", dy: 8 }
        }
    },

    description: {
        y: 11,
        bg: {
            y: { align: "center", dy: -15 }
        }
    },

    content: {
        y: { align: "bottom", dy: 70 },
        margin: 15
    }
});

cleverapps.overrideStyles(cleverapps.styles.TileBadge, {
    x: { align: "center", dx: 0 },
    y: { align: "center", dy: 5 },
    width: 115,
    rotation: 20
});

cleverapps.overrideStyles(cleverapps.styles.PackProductTile, {

    title: {
        text: {
            y: { align: "center", dy: 13 }
        }
    },
    limit: {
        y: -60
    }
});

cleverapps.overrideStyles(cleverapps.styles.CoinsProductTile, {
    title: {
        y: 15,
        text: {
            y: { align: "center", dy: 15 }
        }
    },

    icon: {
        y: 60
    },

    description: undefined,

    limit: {
        y: -20
    },

    content: {
        margin: 30
    },

    decorators: [
        cleverapps.styles.Decorators.shop_bonusSale_decor
    ]
});

if (cleverapps.styles.UnitsShopTile) {
    cleverapps.overrideStyles(cleverapps.styles.UnitsShopTile, {
        width: 408,
        height: 720,

        button: {
            height: 110
        },

        title: {
            height: 120,
            width: 446,

            amount: {
                y: {
                    align: "center",
                    dy: 10
                }
            },

            x: { align: "center", dx: 0 },

            y: {
                align: "center",
                dy: -30
            }
        },

        description: {
            y: {
                align: "center",
                dy: -130
            }
        },

        leftText: {
            y: {
                align: "center",
                dy: 280
            }
        },

        guideButton: {
            x: {
                align: "center",
                dx: -130
            },
            y: {
                align: "center",
                dy: 290
            }
        },

        adBubble: {
            x: {
                align: "right",
                dx: 10
            }
        }

    });
}

cleverapps.overrideStyles(cleverapps.styles.TableView, {
    barPadding: {
        cornerPadding: 5
    }
});

if (cleverapps.styles.LivesProductTile) {
    cleverapps.overrideStyles(cleverapps.styles.LivesProductTile, {

        content: {
            margin: 30
        },

        icon: {
            height: 165
        },

        button: {
            height: 110
        },

        title: {
            text: {
                y: { align: "center", dy: 10 }
            }

        },

        limit: {
            y: -88
        },

        description: {
            width: 300,
            height: 100,

            y: 10
        },

        badge: {
            x: { align: "right", dx: 30 },
            y: { align: "top", dy: 37 }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.ShopWindow, {
    wrap: {
        paddingY: 220
    },
    mobile: {
        offsetY: -40
    },
    margin: { x: 60, y: 30 }
});

cleverapps.overrideStyles(cleverapps.styles.DailyTasksCompleteAllView, {
    bar: {
        dy: 2,

        height: 35,

        padding: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        }
    },

    prize: {
        y: { align: "bottom", dy: -14 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.PrizeBarComponent, {
    prize: {
        width: 80,
        height: 80,

        present: {
            dy: 5
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.FingerView, {
    anchorX: 0.3,
    anchorY: 0.9
});

cleverapps.overrideStyles(cleverapps.styles.PackWindow, {
    button: {
        height: 110
    },

    discountLabel: undefined,

    Title: {
        dx: -14,
        dy: 300,

        fitTo: {
            width: 700,
            height: 100
        },

        delay: 0.7,
        duration: 0.675
    },

    animation: {
        default: {
            idleDelay: 0,
            dx: 0,
            dy: -50
        },

        starterPack0: {
            idleAnimation: "0_idle",
            introAnimation: "0_start"
        },

        starterPack: {
            idleAnimation: "1_idle",
            introAnimation: "1_start"
        },

        starterPack2: {
            idleAnimation: "2_idle",
            introAnimation: "2_start"
        }
    },

    rewards: {
        delay: 1.5,
        duration: 0.675,
        fitTo: {
            width: 166
        },

        positions: {
            default: {
                hard: {
                    x: 190,
                    y: -288
                },
                energy: {
                    x: -190,
                    y: -288
                },
                wands: {
                    x: -256,
                    y: -88
                },
                soft: {
                    x: 4,
                    y: -254
                },
                worker: {
                    x: -190,
                    y: 173
                }
            },

            starterPack: {
                energy: {
                    x: -180,
                    y: -6
                },
                hard: {
                    x: 180,
                    y: -6
                },
                wands: {
                    x: -180,
                    y: -352
                },
                worker: {
                    x: 180,
                    y: -350
                }
            },

            starterPack2: {
                energy: {
                    x: -250,
                    y: -22
                },
                hard: {
                    x: 250,
                    y: -22
                },
                wands: {
                    x: -290,
                    y: -377
                },
                worker: {
                    x: 290,
                    y: -375
                }
            }
        }
    },

    windowShowUpAnimation: {
        name: "default",
        force: true
    }
});

cleverapps.overrideStyles(cleverapps.styles.DailyTaskTimer, {
    text: {
        width: 360
    }
});

cleverapps.overrideStyles(cleverapps.styles.Timer, {
    width: 280
});

cleverapps.overrideStyles(cleverapps.styles.DailyTasksWindow, {
    tabs: {
        x: { align: "left", dx: -84 },
        y: { align: "top", dy: -210 },
        height: 150
    }
});

cleverapps.overrideStyles(cleverapps.styles.DailyTasksTab, {
    foreground: {
        width: 780,
        height: 684,
        y: { align: "center", dy: 2 }
    },

    timer: {
        padding: {
            y: 40
        }
    },

    padding: {
        x: 30
    }
});

cleverapps.overrideStyles(cleverapps.styles.DailyTaskView, {
    padding: {
        left: 20,
        right: 40,
        top: 20,
        bottom: 30
    },

    titleAndRewards: {
        width: 350
    },

    progressBar: {
        height: 35
    },

    button: {
        height: 70
    }
});

cleverapps.overrideStyles(cleverapps.styles.DailyTasksCompleteAllView, {
    textLayout: {
        width: cleverapps.config.type === "merge" ? 700 : 450
    }
});

if (cleverapps.styles.AchievementsTab) {
    cleverapps.overrideStyles(cleverapps.styles.AchievementsTab, {
        scroll: {
            paddingY: 170,
            y: { align: "center", dy: -40 }
        },

        margin: {
            x: 0,
            y: 0
        },

        gridPadding: {
            x: 0,
            y: 30
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.CloversView, {
    width: 125,
    height: 125,

    text: {
        x: { align: "center", dx: 30 },
        y: { align: "center", dy: -30 }
    },

    positions: [
        {
            x: { align: "center", dx: 255 },
            y: { align: "center", dy: 14 }
        },
        {
            x: { align: "center", dx: 255 },
            y: { align: "center", dy: 14 }
        },
        {
            x: { align: "left", dx: 25 },
            y: { align: "bottom", dy: 7 }
        }
    ]
});

cleverapps.overrideStyles(cleverapps.styles.TileButton, {
    height: 110,
    width: 220,
    y: { align: "center", dy: 15 }
});

cleverapps.overrideStyles(cleverapps.styles.SubscriptionButtons, {
    buttonHeight: 110
});

cleverapps.overrideStyles(cleverapps.styles.LevelStartWindow, {
    Button: {
        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.LoseWindow, {
    noBackground: true,
    button: {
        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.PassHeader, {
    amount: {
        star: {
            y: 5
        },
        progressAmount: {
            y: 3
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.LevelPassWindow, {
    window: {
        padding: {
            left: 25,
            right: 25
        }
    },

    progress: {
        x: { align: "right", dx: -6 }
    },

    description: {
        x: { align: "center" },
        y: { align: "bottom", dy: 1 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.PassLastChanceWindow, {
    rewards: {
        text: {
            rotation: 0,
            width: 270,
            height: 70,
            y: { align: "center", dy: 0 },
            x: { align: "center", dx: 0 }
        },

        ribbon: {
            x: { align: "left", dx: -13 },
            y: { align: "top", dy: -20 }
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.LotteryIcon, {
    positions: {
        bottom: {
            x: { align: "center", dx: 20 }
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.MinimalDialogue, {
    person: {
        margin: 20
    },

    text: {
        arrow: {
            left: {
                x: { align: "left", dx: -24 },
                y: { align: "center", dy: 0 }
            },
            right: {
                x: { align: "right", dx: 24 },
                y: { align: "center", dy: 0 }
            }
        }
    }
});

if (cleverapps.styles.BoosterBeforeAmountView) {
    cleverapps.overrideStyles(cleverapps.styles.BoosterBeforeAmountView, {
        amount: {
            x: { align: "center", dx: 2 },
            y: { align: "center", dy: 4 }
        }
    });
}

if (cleverapps.styles.BoosterBeforeView) {
    cleverapps.overrideStyles(cleverapps.styles.BoosterBeforeView, {
        bonus: {
            x: { align: "left", dx: -10 }
        },

        amount: {
            x: { align: "right", dx: 10 }
        },

        icon: {
            5: { dy: 3 },
            6: { dy: 4 },
            7: { dy: 5 }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.SubscriptionTile, {
    icon: {
        y: -28
    },

    description: {
        rewardsMargin: {
            y: 5
        },
        margin: 5
    },

    title: {
        text: {
            y: { align: "center", dy: 14 }
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.RateWindow, {
    width: 700,
    height: 240,

    button: {
        width: 300,
        height: 110
    },

    stars: {
        x: { align: "center", dx: 0 },
        y: { align: "top", dy: 280 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.ShopUserGoldView, {
    textNode: {
        margin: 0,
        boostersItemsMargin: {
            y: 0
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.DailyCupView, {
    title: {
        width: 610,

        bg: {
            x: { align: "center" },
            y: { align: "center", dy: -45 }
        },

        text: {
            width: 500,

            y: { align: "center", dy: -18 }
        }
    }
});

if (cleverapps.styles.ExtendUnlimitedLivesWindow) {
    cleverapps.overrideStyles(cleverapps.styles.ExtendUnlimitedLivesWindow, {
        animation: {
            height: 250,

            y: { align: "center", dy: -20 }
        },
        button: {
            height: 110
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.AllDoneWindow, {
    button: {
        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.ChatHeader, {
    text: {
        offsetY: 10
    }
});

cleverapps.overrideStyles(cleverapps.styles.DailytaskSwapButton, {
    height: 70
});

if (cleverapps.styles.TreasureSearchWindow) {
    cleverapps.overrideStyles(cleverapps.styles.TreasureSearchWindow, {
        padding: {
            x: -29
        },

        window: {
            padding: {
                top: 206,
                left: 100,
                right: 100
            }
        }
    });
}

if (cleverapps.styles.TreasureSearchView) {
    cleverapps.overrideStyles(cleverapps.styles.TreasureSearchView, {
        bg: {
            x: { align: "center" },
            y: { align: "top", dy: 116 }
        }
    });
}

if (cleverapps.styles.ProlongationOfferView) {
    cleverapps.overrideStyles(cleverapps.styles.ProlongationOfferView, {
        button: { height: 110 },

        label: {
            amount: {
                x: { align: "center", dx: 0 },
                y: { align: "center", dy: 0 }
            }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.WindowTitle.Types, {
    default: {
        background: undefined,

        position: {
            y: { align: "top", anchor: "center", dy: -80 }
        },

        padding: {
            x: 16
        }
    },

    alternative: {
        padding: {
            x: 90
        },
        textPosition: {
            x: { align: "center" },
            y: { align: "center", dy: 5 }
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.CrossPromoWindow, {
    button: {
        width: 250,
        height: 110
    },

    badge: {
        dy: -32
    }
});

cleverapps.overrideStyles(cleverapps.styles.MenuBarGameLevelView, {
    value: {
        offset: {
            y: -1
        }
    },

    level: {
        offset: {
            x: 5
        }
    }
});

if (cleverapps.styles.UnitsLibraryWindow) {
    cleverapps.overrideStyles(cleverapps.styles.UnitsLibraryWindow, {
        width: 1900,
        height: 1100,

        padding: {
            x: 50,
            y: 35
        },

        tabs: {
            x: { align: "left", dx: -79 },
            y: { align: "top", dy: -70 },
            direction: cleverapps.UI.VERTICAL,
            width: 120,
            height: 130
        },

        window: {
            Foreground: {
                padding: {
                    left: 30,
                    right: 30,
                    top: 25,
                    bottom: 31
                }
            }
        }
    });
}

if (cleverapps.styles.OrdersWindow) {
    cleverapps.overrideStyles(cleverapps.styles.OrdersWindow, {
        width: 1580,
        height: 800,

        noPadding: false,

        tabs: {
            x: { align: "left", dx: -135 },
            y: { align: "top", dy: -70 },
            direction: cleverapps.UI.VERTICAL,
            width: 120,
            height: 150
        }
    });
}

if (cleverapps.styles.FamilyLayout) {
    cleverapps.overrideStyles(cleverapps.styles.FamilyLayout, {
        title: {
            x: { align: "center" },
            y: { align: "top", dy: 10 },

            padding: {
                x: 70,
                y: 4
            }
        },

        grid: {
            padding: {
                x: 70,
                top: 85,
                bottom: 100
            }
        },

        rings: [{
            x: { align: "left", dx: 90 },
            y: { align: "top", dy: -10 }
        }, {
            x: { align: "right", dx: -90 },
            y: { align: "top", dy: -10 }
        }]
    });
}

if (cleverapps.styles.HeroDetailsLayout) {
    cleverapps.overrideStyles(cleverapps.styles.HeroDetailsLayout, {
        height: 600,

        buttonInfo: {
            x: { align: "right", dx: -10 },
            y: { align: "top", dy: -10 }
        },

        infoHeroText: {
            x: { align: "center" },
            y: { align: "center", dy: -20 }
        },

        grid: {
            width: 1760,

            x: { align: "left", dx: 20 },
            y: { align: "center", dy: -25 }
        }
    });
}

if (cleverapps.styles.UnitLibraryIcon) {
    cleverapps.overrideStyles(cleverapps.styles.UnitLibraryIconBg, {
        width: 240,
        height: 320,

        title: {
            x: { align: "center" },
            y: { align: "center", dy: 105 }
        }
    });

    cleverapps.overrideStyles(cleverapps.styles.UnitLibraryIconFooter, {
        width: 200,
        height: 80,

        collectButton: {
            height: 70,
            type: cleverapps.styles.UI.Button.Images.small_button_green
        }
    });
}

if (cleverapps.styles.HeroesTab) {
    cleverapps.overrideStyles(cleverapps.styles.HeroesTab, {
        details: {
            x: { align: "center" },
            y: { align: "top", dy: -30 }
        },

        scroll: {
            width: 1812,

            x: { align: "center" },
            y: { align: "bottom" },

            padding: {
                x: 60,
                top: 105,
                bottom: 65
            },

            margin: 40
        }
    });
}

if (cleverapps.styles.UnitsTab) {
    cleverapps.overrideStyles(cleverapps.styles.UnitsTab, {
        padding: {
            x: 0,
            y: 40
        }
    });
}

if (cleverapps.styles.HeroIcon) {
    cleverapps.overrideStyles(cleverapps.styles.HeroIcon, {
        icon: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: 19 },

            closed: {
                color: new cc.Color(159, 93, 75, 255),
                opacity: 255,
                notForUnknown: true
            }
        }
    });
}

if (cleverapps.styles.PrizeView) {
    cleverapps.overrideStyles(cleverapps.styles.PrizeView, {
        width: 106,
        height: 97,

        padding: {
            x: 18,
            y: 14
        },

        pointer: {
            dy: 2
        },

        animation: {
            x: { align: "center" },
            y: { align: "center", dy: 0 }
        }
    });
}

if (cleverapps.styles.QuestsWindow) {
    cleverapps.overrideStyles(cleverapps.styles.QuestsWindow, {
        width: 1580,
        height: 750,

        details: {
            width: 1580,
            height: 460,

            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 0 },

            rings: [{
                x: { align: "left", dx: 90 },
                y: { align: "top", dy: -10 }
            }, {
                x: { align: "right", dx: -90 },
                y: { align: "top", dy: -10 }
            }],

            icon: {
                x: { align: "left", dx: 75 },
                y: { align: "center", dy: 10 },
                scale: 1
            },

            items: {
                x: { align: "center", dx: 133 },
                y: { align: "center", dy: -100 },

                background: {
                    width: 130,
                    height: 130
                },

                icon: {
                    width: 90,
                    height: 90,
                    maxScale: 1.3
                },

                margin: {
                    x: 40
                }
            },

            title: {
                x: { align: "center", dx: 0 },
                y: { align: "center", dy: 140 },
                fitTo: {
                    width: 820,
                    height: 110
                }
            },

            button: {
                x: { align: "right", dx: -80 },
                y: { align: "center", dy: 50 },
                noItemsDelta: 50
            },

            rewards: {
                x: { align: "center", dx: 0 },
                y: { align: "center", dy: 40 }
            }
        },

        select: {
            width: 1610,

            x: { align: "left", dx: -13 },
            y: { align: "top", dy: -440 },
            margin: 70,

            padding: {
                x: 30,
                y: 40
            }
        }
    });
}

if (cleverapps.styles.QuestIcon) {
    cleverapps.overrideStyles(cleverapps.styles.QuestIcon, {
        background: {
            width: 280,
            height: 280
        }
    });
}

if (cleverapps.styles.BonusWorkerWindow) {
    cleverapps.overrideStyles(cleverapps.styles.BonusWorkerWindow, {
        button: {
            height: 110
        },

        person: {
            x: { align: "center", dx: -650 },
            y: { align: "bottom", dy: -190 }
        }
    });
}

if (cleverapps.styles.ExpInfoWindow) {
    cleverapps.overrideStyles(cleverapps.styles.ExpInfoWindow, {
        button: {
            height: 110
        }
    });
}

if (cleverapps.styles.HeroWindow) {
    cleverapps.overrideStyles(cleverapps.styles.HeroWindow, {
        button: {
            height: 110
        }
    });
}

if (cleverapps.styles.CanUpgradeHeroWindow) {
    cleverapps.overrideStyles(cleverapps.styles.CanUpgradeHeroWindow, {
        button: {
            height: 110
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.LanguageButton, {
    height: 110
});

if (cleverapps.styles.StarChestWindow) {
    cleverapps.overrideStyles(cleverapps.styles.StarChestWindow, {
        content: {
            y: { align: "top", dy: -96 }
        },

        button: {
            height: 110
        },

        bar: {
            padding: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2
            }
        },

        text: {
            width: 600
        },

        chest: {
            y: { align: "center", dy: -30 }
        }
    });
}

if (cleverapps.styles.ConfirmSpeedUpWindow) {
    cleverapps.overrideStyles(cleverapps.styles.ConfirmSpeedUpWindow, {
        buttons: {
            button: {
                height: 110
            }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.BandButton, {
    icon: {
        x: { align: "center" },
        y: { align: "bottom", dy: 45 }
    },

    position: {
        y: { align: "top", dy: 30 }
    }
});

if (cleverapps.styles.ChestPrizeProbWindow) {
    cleverapps.overrideStyles(cleverapps.styles.ChestPrizeProbWindow, {
        padding: {
            left: -12,
            right: -16,
            top: 0,
            bottom: 0
        }
    });
}

if (cleverapps.styles.BuyIngredientsWindow) {
    cleverapps.overrideStyles(cleverapps.styles.BuyIngredientsWindow, {
        tile: {
            amountBackground: {
                width: 260,
                height: 104,
                x: { align: "center", dx: 0 },
                y: { align: "center", dy: -120 }
            },

            amountText: {
                x: { align: "center" },
                y: { align: "center", dy: -115 },
                width: 170
            },

            icon: {
                x: { align: "center" },
                y: { align: "center", dy: 45 }
            },

            title: {
                width: 260,
                x: { align: "center" },
                y: { align: "center", dy: 170 }
            }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.VIPRewardedWindow, {
    button: {
        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.ConfirmExitWindow, {
    button: {
        height: 110
    }
});

if (cleverapps.styles.PiggyBankWindow) {
    cleverapps.overrideStyles(cleverapps.styles.PiggyBankWindow, {
        button: {
            height: 110
        }
    });
}

if (cleverapps.styles.IngredientOrderIcon) {
    cleverapps.styles.IngredientOrderIcon = {
        width: 160,
        height: 160,

        padding: {
            x: 8,
            y: 2
        },

        icon: {
            x: { align: "center", dx: -10 },
            y: { align: "bottom", dy: 0 },
            scale: 2
        },

        text: {
            width: 130,
            x: { align: "right", dx: 0 },
            y: { align: "bottom", dy: -10 }
        }
    };
}

if (cleverapps.styles.IngredientsTab) {
    cleverapps.overrideStyles(cleverapps.styles.IngredientsTab, {
        grid: {
            columns: 8,

            x: { align: "left", dx: 10 },
            y: { align: "top", dy: -10 },

            margin: {
                x: 50,
                y: 50
            }
        },

        shelves: undefined
    });
}

if (cleverapps.styles.OrdersTab) {
    cleverapps.overrideStyles(cleverapps.styles.OrdersTab, {
        table: undefined,

        placeholder: {
            x: { align: "center", dx: -340 },
            y: { align: "center", dy: 0 },
            width: 800
        },

        grid: {
            x: { align: "left", dx: -30 },
            y: { align: "top", dy: 35 },
            height: 860,
            columns: 3,

            margin: {
                x: 30,
                y: 70
            },
            padding: {
                x: 60,
                y: 60
            },

            border: undefined
        },

        details: {
            x: { align: "right", dx: 5 },
            y: { align: "center", dy: 5 }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.SoftCurrencyTile, {
    title: {
        text: {
            y: { align: "center", dy: 12 }
        }
    },

    content: {
        y: { align: "bottom", dy: 100 },
        margin: 50
    },

    limit: {
        y: -60
    }
});

cleverapps.overrideStyles(cleverapps.styles.DialogueView, {
    text: {
        arrow: {
            y: { align: "top", dy: 46 }
        },

        padding: {
            fromWallX: 60,
            x: 90,
            y: 60
        }
    },

    persons: {
        dy: -14
    },

    widthPadding: 10
});

cleverapps.overrideStyles(cleverapps.styles.PassRewardIcon, {
    claimButton: {
        height: 70,
        y: { align: "bottom", dy: -80 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.Row, {
    button: {
        type: cleverapps.styles.UI.Button.Images.small_button_green
    }
});

if (cleverapps.config.type === "merge") {
    cleverapps.overrideStyles(cleverapps.styles.Row, {
        width: 790
    });
}

cleverapps.overrideStyles(cleverapps.styles.NewVersionWindow, {
    button: {
        width: 220,
        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.PassBuyTicketWindow, {
    rewards: {
        icon: {
            dy: 8
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.PassTicket, {
    button: {
        height: 70
    }
});

cleverapps.overrideStyles(cleverapps.styles.PlayButtonView, {
    height: 110
});

cleverapps.overrideStyles(cleverapps.styles.LeadersWindow, {
    margin: 10,

    padding: {
        x: 0
    }
});

cleverapps.overrideStyles(cleverapps.styles.MissionWindow, {
    button: {
        height: 110
    }
});

if (cleverapps.styles.ExpeditionPageView) {
    cleverapps.overrideStyles(cleverapps.styles.ExpeditionPageView, {
        height: 650,

        message: {
            height: 100,
            width: 280,

            x: { align: "center", dx: 24 },
            y: { align: "top", dy: -110 },

            text: {
                x: { align: "center", dx: 20 },

                height: 85
            },

            icon: {
                width: 70,
                height: 70
            },

            iconBg: {
                x: { align: "left", dx: -40 }
            }
        },

        button: {
            height: 110
        },

        image: {
            y: { align: "center", dy: 25 }
        },

        current: {
            y: { align: "bottom", dy: 45 }
        },

        timer: {
            y: { align: "bottom", dy: 155 }
        }
    });
}

if (cleverapps.styles.TravelBookWindow) {
    cleverapps.overrideStyles(cleverapps.styles.TravelBookWindow, {
        window: {
            padding: {
                top: 130
            }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.NoConnectionWindow, {
    button: {
        height: 110
    }
});

if (cleverapps.styles.SnapshotBarView) {
    cleverapps.overrideStyles(cleverapps.styles.SnapshotBarView, {
        buttons: {
            width: 110,
            height: 110
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.DeleteAccountWindow, {
    info: {
        padding: {
            x: 60,
            y: 60
        }
    }
});

if (cleverapps.styles.StartEpisodeWindow) {
    cleverapps.overrideStyles(cleverapps.styles.StartEpisodeWindow, {
        button: {
            height: 110
        }
    });
}

if (cleverapps.styles.FinisherWindow) {
    cleverapps.overrideStyles(cleverapps.styles.FinisherWindow, {
        button: {
            height: 110
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.GrowthFundTile, {
    content: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: 70 },
        margin: 0
    },

    icon: {
        y: 50
    },

    description: {
        height: 146,
        y: 38
    },

    title: {
        width: 495,
        x: 0,
        y: 63,
        text: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 6 }
        }
    }
});
if (cleverapps.styles.LandMarkWindow) {
    cleverapps.overrideStyles(cleverapps.styles.LandMarkWindow, {
        sideOffset: 500,

        grid: {
            width: 900,
            height: 800,

            margin: {
                x: 40,
                y: 40
            },

            padding: {
                x: 15,
                y: 25
            }
        },

        window: {
            padding: {
                top: 130,
                bottom: 40
            }
        }
    });
}
if (cleverapps.styles.LandMarkUnit) {
    cleverapps.overrideStyles(cleverapps.styles.LandMarkUnit, {
        title: {
            y: {
                align: "center",
                dy: 90
            }
        },

        checkmark: {
            x: {
                align: "right",
                dx: -15
            },
            y: {
                align: "bottom",
                dy: -10
            }
        },

        minimal_dialogue: {
            scale: 0.6
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.GrowthFundWindow, {
    margin: 10,
    padding: {
        top: 5
    },

    window: {
        padding: {
            left: 40,
            right: 40,
            top: 140,
            bottom: 40
        }
    },

    top: {
        width: 970,
        height: 350,
        align: cleverapps.UI.ALIGN_CENTER,

        text: {
            x: { align: "center", dx: 155 },
            y: { align: "center", dy: 80 }
        },

        icon: {
            x: { align: "center", dx: -150 },
            y: { align: "center", dy: -20 }
        },

        button: {
            height: 110,
            x: { align: "right", dx: -53 },
            y: { align: "bottom", dy: 70 }
        },

        mark: {
            x: { align: "right", dx: -140 },
            y: { align: "bottom", dy: 70 }
        }
    },

    scroll: {
        margin: 10,
        width: 1000,
        height: 710,

        top: {
            width: 1078,
            height: 52,
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 35 }
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.GrowthFundLevelView, {
    width: 970,
    height: 170,

    iconBg: {
        x: { align: "left", dx: 0 },
        y: { align: "center", dy: 0 },
        width: 260,
        height: 200
    },

    title: {
        x: { align: "left", dx: 295 },
        y: { align: "center", dy: 25 }
    },

    icon: {
        x: { align: "left", dx: 55 },
        y: { align: "center", dy: 0 }
    },

    rewards: {
        x: { align: "left", dx: 295 },
        y: { align: "center", dy: -25 }
    },

    button: {
        width: 230,
        height: 110,
        x: { align: "right", dx: -52 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.GrowthFundBuyWindow, {
    button: {
        height: 110
    }
});

cleverapps.overrideStyles(cleverapps.styles.PeriodicSaleWindow, {
    lotsPadding: {
        top: 210
    },

    content: {
        y: { align: "center", dy: -30 },

        title: {
            y: { align: "top", dy: -80 },
            text: {
                width: 630,
                height: 130
            }
        },

        timer: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: 86 }
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.BonusSaleLot, {
    height: 840
});

cleverapps.overrideStyles(cleverapps.styles.VkLotteryIcon, {
    positions: {
        bottom: {
            x: { align: "left", dx: -12 },
            y: { align: "top", dy: 39 }
        },
        icon: {
            x: { align: "center", dx: -42 }
        },
        iconTimer: {
            x: { align: "left", dx: -30 },
            y: { align: "bottom", dy: 12 }
        }
    }
});

if (cleverapps.styles.ProgressView) {
    cleverapps.overrideStyles(cleverapps.styles.ProgressView, {
        person: {
            animation: {
                x: { align: "center", dx: 15 },
                y: { align: "center", dy: 35 }
            },
            width: 400,
            height: 570,
            zOrder: -1,
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 541 }
        },
        icon: {
            bg: {
                padding: {
                    x: 12,
                    y: 15
                }
            }
        }
    });
}

if (cleverapps.styles.CustomersWindow) {
    cleverapps.overrideStyles(cleverapps.styles.CustomersWindow, {
        height: 820,
        tabs: {
            x: { align: "left", dx: -140 },
            y: { align: "top", dy: -100 },
            height: 130
        }
    });
}

if (cleverapps.styles.CaravanTileView) {
    cleverapps.overrideStyles(cleverapps.styles.CaravanTileView, {
        width: 600,
        height: 1000,

        amount: {
            x: { align: "center" },
            y: { align: "bottom", dy: 185 }
        },

        title: {
            x: { align: "center", dx: -2 },
            y: { align: "center", dy: 15 },

            help: {
                x: { align: "center", dx: 7 },
                y: { align: "center", dy: -225 }
            },

            bg: {
                width: 620
            }
        },

        button: {
            height: 110,

            y: { align: "bottom", dy: 70 }
        },

        rewardsBlock: {
            y: { align: "bottom", dy: 192 },

            bg: {
                width: 487
            },

            icon: {
                x: { align: "center", dx: -100 }
            },

            rewards: {
                x: { align: "right", dx: -20 }
            }
        },

        person: {
            y: { align: "bottom", dy: 555 }
        }
    });
}

if (cleverapps.styles.BarrelAdsWindow) {
    cleverapps.overrideStyles(cleverapps.styles.BarrelAdsWindow, {
        item: {
            iconNode: {
                x: { align: "center" },
                y: { align: "center", dy: 100 },
                shining: false
            },

            strip: {
                width: 330,
                x: { align: "center", dx: 0 },

                amount: {
                    x: { align: "center" },
                    y: { align: "center", dy: 4 }
                }
            }
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.FakeLoginWindow, {
    padding: {
        x: 85,
        top: 200,
        bottom: 100
    }
});

cleverapps.overrideStyles(cleverapps.styles.DialoguePersonTitleView, {
    mobileY: { align: "top", anchor: "center", dy: -10 },

    text: {
        padding: {
            x: 40,
            y: 10
        },
        offset: {
            y: 7
        }
    }
});

if (cleverapps.styles.AddBombMovesWindow) {
    cleverapps.overrideStyles(cleverapps.styles.AddBombMovesWindow, {
        button: {
            height: 110
        }
    });
}

cleverapps.overrideStyles(cleverapps.styles.FONTS, {
    TOOLBAR_ITEM_REWARD_TEXT: {
        size: 23
    }
});

cleverapps.overrideStyles(cleverapps.styles.SceneControlButtonsView, {
    controlButtons: {
        y: { align: "center", dy: -9 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.MenuBarItem, {
    timer: {
        icon: false
    }
});