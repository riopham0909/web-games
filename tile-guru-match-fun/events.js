/**
 * Created by andrey on 31.05.17.
 */

var cleverappsEvents = {
    GENERAL: {
        TUTORIAL_COMPLETE: "tutorial_complete",
        LEVEL_UP: "level_up"
    },

    TARGET_FOR_BUYING: {
        DAY_1_WATCHED_15_ADS: "day_1_watched_15_ads",
        DAY_1_ADS_COUNT: "day_1_ads_count",
        DAY_1_ADS_VALUE: "day_1_ads_value",

        BASE_WATCH_5: "base_watch_5",

        BASE_REACH_5: "base_reach_5",
        BASE_REACH_6: "base_reach_6",
        BASE_REACH_7: "base_reach_7",
        BASE_REACH_8: "base_reach_8",
        BASE_REACH_10: "base_reach_10",
        BASE_REACH_15: "base_reach_15",
        BASE_REACH_20: "base_reach_20",
        BASE_REACH_25: "base_reach_25",
        BASE_REACH_30: "base_reach_30",
        BASE_REACH_35: "base_reach_35",
        BASE_REACH_40: "base_reach_40",
        BASE_REACH_45: "base_reach_45",
        BASE_REACH_50: "base_reach_50",
        BASE_REACH_60: "base_reach_60",
        BASE_REACH_70: "base_reach_70",
        BASE_REACH_80: "base_reach_80",
        BASE_REACH_90: "base_reach_90",
        BASE_REACH_100: "base_reach_100",

        BASE_PLAY_WATCH: "base_play_watch",

        RETENTION_1: "ret1",
        RETENTION_2: "ret2",
        RETENTION_3: "ret3",
        AD_START: "ad_start",

        WATCHED_5: "watched5",
        WATCHED_10: "watched10",
        WATCHED_20: "watched20",
        WATCHED_30: "watched30"
    },

    EARN: {
        HARD: "ehard",
        SOFT: "esoft",
        FLYING: "flying",
        PROMO: "promo",
        GROWTH_FUND: "fund",
        COOKIE_JAR: "cookie",
        CHEST: "chest",
        BOARD_COIN: "board",
        MAGNIFIER: "magnifier",
        FRIEND_REQUEST: "request",
        RETURN: "return",
        OTHER: "other",
        CRYPTEX: "cryptex",
        LEVEL_REWARD: "reward",
        LIVES: "lives"
    },

    SPENT: {
        HARD: "shard",
        BOOSTER: "booster",
        BOOSTER_BEFORE: "before",
        BARREL: "barrel",
        RUIN: "ruin",
        SPECIAL_OFFER: "special",
        PAY_ISLAND: "island",
        WORKER: "worker",
        SKIP_VIP: "skip_vip",

        LIVES: "lives",
        SOFT: "ssoft",
        UNIT: "unit",
        PAID_UNIT: "paid_unit",
        REFRESH: "refresh",
        SEASON: "season",
        CLAN: "clan",

        CONTINUE: "continue",

        TACTICAL_EXTEND: "tactical_extend",
        HERO_UPGRADE: "upgrade",
        BOMB_MOVES: "bomb",
        SLOT_MACHINE: "slot",
        HOMEFIX_CHOICE: "choice",

        INGREDIENT: "ingredient",
        MISSION_OFFER: "offer_",
        REFILL_TANK: "tank",
        GENIE_ENERGY: "genie",
        MINESWEEPER: "miner",
        PACK: "pack_",
        ORDER: "order",
        ENERGY_LOTTERY: "lottery",
        BATTLE_PASS: "battlepass",
        LAST_CHANCE: "lastchance",
        SPEED_UP: "speedup",
        FRUIT: "fruit",
        RESET: "reset",
        UNLOCK: "unlock",
        CARAVAN: "caravan",
        PERIODIC_LOT: "per_lot",
        CHAIN_LOT: "chain_lot",
        CUSTOMER: "customer",
        RECIPE_INGREDIENT: "ingred",
        FACTORY: "factory",

        TROOP_CARDS: "troop",
        PIGGY_BANK: "piggy",
        LUCKY_BONUS: "lucky_bonus"
    },

    ADS: {
        START: "ad_start",
        FINISH: "ad_finish",
        SESSION_FINISH: "ad_session_finish",
        COST: "ad_cost",
        CACHE: "ad_cache",
        READY: "ad_ready",

        TYPE: "ad-"
    },

    EXPEDITIONS: {
        PLAY: "play_",
        SPEND: "payments_",
        TOTAL: "total_"
    },

    STATS: {
        APP_INITIALIZE: "app_initialize",
        LOADER_PROGRESS: "loader_progress_",
        LEVEL_START: "level_start",
        SHOP_OPEN: "shop_open",
        SHOP_CLOSE: "shop_close",
        PRODUCT_BUY: "product_bought", // deprecated; kept for backward compatibility
        BUY_ITEM: "buy_item",
        PAYMENTS: "payments",
        VIDEO_PRODUCT_BUY: "video_product_buy",
        RATE_WINDOW: "rate_window",
        RATE_SEND: "rate_send",
        SOCIAL_REVIEW: "social_review_",
        NATIVE_REVIEW: "native_review_",
        TUTORIAL_BEGIN: "tutorial_begin",
        TUTORIAL_STEP: "tutorial_step_",
        LEVEL_PASS_EVENT: "level_passed",
        LEVEL_FINISH: "level_finish",
        LEVEL_LEFT_MOVES: "level_left_moves",
        LEVEL_PASSED_TIME: "level_passed_time",
        LEVEL_STARS: "level_stars",
        UNIQUE_FINISH: "lev_finish",
        UNIQUE_START: "lev_start",
        USE_ENERGY: "use_energy",
        PROMO: "promo_",
        PROMO_SHOW: "promo_show_",
        PROMO_ERROR: "promo_error_",
        LOGIN: "login",
        CHAIN_SALE_OPEN: "chain_sale_open",

        // Metrics
        DAU: "dau",
        DAU_COUNTRY: "dau_country_",
        PAYER_DAU: "payer_dau",
        DAY_1_DAU: "day_1_dau",
        DAY_1_ADS_COUNT_DAU: "day_1_ads_count_dau",
        REWARDED_AVAILABLE_DAU: "rewarded_available_dau",
        REWARDED_LOADED_DAU: "rewarded_loaded_dau",
        REWARDED_NOADS_DAU: "rewarded_noads_dau",
        NOADS_ERROR: "noads_error-",
        REWARDED_DAU: "rewarded_dau",
        REWARDED_ERROR_DAU: "rewarded_error_dau",
        VIP_REWARDED_WATCHED: "vip_rewarded_watched",
        VIP_REWARDED_DAU: "vip_rewarded_dau",
        RETENTION_0: "retention_0",
        RETENTION_1: "retention_1",
        RETENTION_2: "retention_2",
        RETENTION_3: "retention_3",
        RETENTION_7: "retention_7",
        RETENTION_14: "retention_14",
        RETENTION_30: "retention_30",
        ACTIVE_TIME: "active_time",
        ACTIVE_TIME_DAU: "active_time_dau",
        GAME_LEVEL_CONVERSION_DAYS: "gamelevel_conversion_d",
        USER_WANDS_DAU: "user_wands_dau",
        USER_WANDS_DAU_AMOUNT: "user_wands_dau_amount",

        ERROR_AMOUNT: "error_amount",
        ERROR_CONTEXT_LOST: "context_lost",

        LEVEL_FPS: "level_fps",
        RESOLUTION: "resolution_",
        WEBP: "webp_",
        APP_TRACKING: "app_tracking_",
        APP_LOVIN_ADS: "app_lovin_ads",
        ADMOB_ADS: "admob_ads",
        YANDEX_APP_ADS: "yandex_app_ads",

        GIFT_COINS_EARNED: "gift_coins_earned",

        INSTANT: {
            SHORTCUT_SHOW: "instant_shortcut_show",
            SHORTCUT: "instant_shortcut",

            BOT_SHOW: "instant_bot_show",
            BOT_ERROR: "instant_bot_error",
            BOT: "instant_bot",

            PAGE_SHOW: "instant_page_show",
            PAGE_ERROR: "instant_page_error",
            PAGE: "instant_page",

            REQUEST: "instant_request",
            PAYMENT: "instant_payment-",
            CATALOG: "instant_catalog-",
            SUBSCRIPTION_CATALOG: "instant_subs_cat-",
            CONSUME: "instant_consume-",
            LIST_PURCHASES: "instant_list-",
            ADS_LOAD: "instant-",
            ADS_PLAY: "instant_play-",

            SUBSCRIPTION: "instant_subscr-",
            SUBSCRIPTION_LIST: "instant_sublist-",
            SUBSCRIPTION_API: "instant_subscr_api",

            LOCALE: "instant_locale-",
            PLATFORM: "instant_platform-",
            ENTRY_POINT: "instant_epoint-"
        },

        YANDEX: {
            ADS_PLAY: "yandex_play-"
        },

        PUSHES: {
            SEND: "push_send-",
            CLICK: "push_click-",
            CLICK_ANDROID: "pusha_click-",
            PERMITTED_DAU: "push_permitted_dau",
            MOBILE_OK_CLICK: "push_mobile_ok_click",
            ANDROID_OK_CLICK: "push_android_ok_click"
        },

        OKADS: {
            PLAY: "okads_play-",
            RESULT: "okads_result-"
        },

        OK: {
            JOIN_GROUP: "ok_join_group_"
        },

        PRODUCT: {
            OPEN: "product_open",
            SUCCESS: "product_success",
            RESTORE: "product_restore"
        },

        YOOKASSA: {
            DAU: "yookassa_dau",
            OPEN: "yookassa_open",
            PAID_COUNT: "yookassa_paid_count",
            PAID_AMOUNT: "yookassa_paid_amount"
        },

        GDCOM: {
            ADS_EVENT: "gdcom_ae-"
        },

        BANNER: {
            DAU: "banner_dau",
            LOADING: "banner_loading",
            SHOWN: "banner_shown",
            HIDDEN: "banner_hidden"
        },

        XSOLLA: {
            INIT_WIDGET_FAILED: "xsolla_init_widget_failed",
            OPEN_WIDGET: "xsolla_open_widget"
        },

        PAY_RESULT: "pay_result"
    },

    DEBUG: {
        CLEARANCE: {
            DATALOADER_CHECKSUM_MATCH: "dataloader_checksum_match",
            DATALOADER_CHECKSUM_DIFFERENT: "dataloader_checksum_different",
            LOCALSTORAGE_CLEARED: "localstorage_cleared",
            LOCALSTORAGE_ERROR_SET_ITEM: "localstorage_error_set_item",
            LOCALSTORAGE_SESSION_EXPIRED: "localstorage_session_expired"
        },

        FAIL_BUNDLE: "fail_bundle_",
        WEBVIEW_ONERROR_RELOAD_SILENT: "webview_onerror_reload_silent",
        WEBVIEW_ONERROR_RELOAD_WINDOW: "webview_onerror_reload_window",
        GDCOM_INIT_ERROR: "gdcom_init_error",
        PLINGA_INIT_ERROR: "plinga_init_error",
        KONGREGATE_INIT_ERROR: "kongregate_init_error",
        CRAZY_INIT_ERROR: "crazy_init_error",
        GRAVITY_INIT_ERROR: "gravity_init_error",
        GRAVITY_RECONNECT: "gravity_reconnect",

        MERGE: {
            RESTORE_MULTICELL_BODY: "restore_multicellbody",
            RESTORE_KICKOUT: "restore_kickout_",
            UNITS_RESET: "units_reset",
            UNKNOWN_UNIT_DAU: "unknown_unit_dau"
        },

        UNKNOWN_MISSION_DAU: "unknown_mission_dau",
        PENDING_REQUESTS_FREEZE: "pending_requests_freeze",
        SECOND_LOGIN: "second_login",

        RENDER_TYPE: "render_type_",

        AUDIO_PLAY_PAUSED_GAME: "audio_play_paused_game",

        MISSION_REPLACED: "mission_replaced-",
        MISSION_REPLACED_REMOVED: "mission_replaced_removed-",
        MISSION_REPLACED_UNAVAILABLE: "mission_replaced_unavailable-",
        MISSION_REPLACED_PAST: "mission_replaced_past-",

        OK_SESSION_EXPIRED: "ok_session_expired",
        OK_SESSION_RESTORED: "ok_session_restored"
    },

    // Missions
    MISSION: "mission_",
    MISSION_DAU: "mission_dau",

    PASS_FINISH_TASK: "pass_finish_task",
    PASS_RECEIVED: "pass_received",
    PASS_RECEIVED_PREMIUM: "pass_received_premium",

    MISSION_FINISH: "mission_finish",
    TOURNAMENT_LEVEL_PLACE: "tournament_level_place",

    EXPEDITION_DAU: "expedition_dau",
    EXPEDITION_FOG: "exp_",

    BONUS_WORLD_LEVEL: "bonus_world_level",
    BONUS_WORLD_DAU: "bonus_world_dau",
    BONUS_WORLD_LEVEL_DAU: "bonus_world_level_dau",
    BONUS_WORLD_REWARD: "BONUS_WORLD_REWARD",
    BONUS_WORLD_PAYMENTS: "bonus_world_payments_",

    // Features
    METHA_ITEM: "metha_item",
    METHA_LEVEL: "metha_level",
    SIMPLE_METHA_BACKGROUND: "simple_metha_background",

    MAKE_CHOICE: "make_choice",
    REDO_CHOICE: "redo_choice",
    WIN_KNOCKOUT: "win_knockout",
    LOSE_KNOCKOUT: "lose_knockout",

    MINIGAME_FINISH: "minigame_finish",
    MINIGAME_REWARD: "minigame_reward",
    MINESWEEPER_START: "minesweeper_start",
    MINESWEEPER_VICTORY: "minesweeper_victory",
    DAILY_BONUS: "daily_bonus",

    HELP_BY_FIVE_ATTEMPTS: "help_by_five_attemts",
    HELP_BY_ATTEMPTS_DAU: "help_by_attemts_dau",
    HELP_BY_ATTEMPTS_ONE_AND_MORE: "help_by_attemts_1_and_more",
    HELP_BY_ATTEMPTS_THREE_AND_MORE: "help_by_attemts_3_and_more",
    HELP_BY_ATTEMPTS_FIVE_AND_MORE: "help_by_attemts_5_and_more",
    TACTICAL_EXTEND_SHOW: "tactical_extend_show",

    MESSAGE_SENT_FRIEND: "message_friend",
    MESSAGE_SENT_INVITE: "message_invite",
    MESSAGE_SENT_PREFIX: "message_sent_",
    MESSAGE_CANCEL_PREFIX: "message_cancel_",
    MESSAGE_ERROR: "message_error",

    INVITE_ICON_INVITE: "invite_icon_invite",

    SESSION_DAILY_TASK_AVAILABLE: "session_daily_task_available",
    SESSION_DAILY_TASK_FINISH: "session_daily_task_finish",
    SESSION_DAILY_TASK_REWARD: "session_daily_task_reward",
    SESSION_DAILY_TASK_OPEN_WINDOW: "session_daily_task_open_window",
    DAILY_TASK_REWARD: "daily_task_rewarded",
    DAILY_TASK_FINISH_AMOUNT: "daily_task_finish_amount",
    DAILY_TASKS_OPEN_WINDOW: "daily_tasks_open_window",
    DAILY_TASKS_START: "daily_tasks_start",

    SUBSCRIPTION_WINDOW_OPEN: "subscription_window_open",
    SUBSCRIPTION_REWARD: "subscription_reward",
    SUBSCRIPTION_BOUGHT: "subscription_bought",
    SUBSCRIPTION_CANCELLED: "subscription_cancelled",

    CRYPTEX_FAIL: "cryptex_fail",

    CUP_REWARD: "cup_reward_",
    CUP_DAU: "cup_dau_",
    CUP_PLAYERS: "cup_players_",

    FUND_BUY: "bought_fund",
    FUND_DAU: "growth_fund_dau",
    FUND_GOLD: "growth_fund_gold",

    SHARE_PROPOSED: "share_proposed_",
    SHARE: "share_",

    LEADERS_WINDOW_OPEN: "leaders_window_open",
    NEW_LEAGUE: "new_league",

    PACKWINDOW_OPENED: "packwindow_opened",
    PACK_STARTED: "pack_started",

    MOVES_SHOW: "moves_show",
    MOVES_BOUGHT: "moves_bought",
    MOVES_USED_FORCE: "moves_used_force",

    BOOSTERS_EXECUTE: "boosters_execute",

    HINT_USED: "hint_used",

    DAILY_LEVEL_CHANNEL: "daily_level_channel_",
    DAILY_LEVEL_PASSED: "daily_level_passed_",

    PIGGY_BANK: "pig",

    RETURNBONUS_CHECK: "returnbonus_check",
    RETURNBONUS_REWARD: "returnbonus_reward",

    // match3
    STAR_CHEST_OPEN: "star_chest_open",
    PLAY_TIMES: "play_times",
    BOOSTER_CELL_ADDED: "booster_cell_added",
    BOOSTER_CELL_COLLECTED: "booster_cell_collected",
    BOOSTER_CELL_RECEIVED: "booster_cell_recevied",
    BOOSTER_COMBO_NO_PLACE: "booster_combo_no_place",
    BOOSTER_MULTICOLOR_NO_PLACE: "booster_multicolor_no_place",

    // tripeaks
    UNDO_USED_FORCE: "undo_force",

    // merge
    MERGE_START: "merge_start",
    CURRENT_RESOURCE: "current_resource_",
    COMPLETE_RESOURCES: "complete_resources",
    CURRENT_ORDER: "current_order_",
    COMPLETE_ORDERS: "complete_orders",
    SEASON_START: "season_start",
    CURRENT_SEASON: "current_season_",
    COMPLETE_SEASON: "complete_season_",
    CURRENT_HERO: "current_hero_",
    COMPLETE_HEROES: "complete_heroes",
    CAMPAIGN: "campaign_",
    CURRENT_PET: "curr_pet_",
    CURRENT_PETRARE: "curr_petr_",
    CURRENT_PETLEGEND: "curr_petl_",
    COMPLETE_PET: "comp_pet",
    COMPLETE_PETRARE: "comp_petr",
    COMPLETE_PETLEGEND: "comp_petl",
    PET_RATE: "pet_rate_",
    CURRENT_EVENT: "curr_event_",
    COMPLETE_EVENT: "comp_event_",

    UNITS_SHOP_COINS: "units_shop_coins",
    UNITS_SHOP_ITEM: "units_shop_item",

    SOFT_CURRENCY_BUY: "soft_buy",
    SOFT_CURRENCY_COST: "soft_cost",
    UNITS_SOLD: "units_sold",

    SPEND_WANDS: "spend_wands",

    MONSTER_SPAWN: "monster_spawn",
    MONSTER_DIE: "monster_die",

    BANK_COINS: "bank_coins",

    BATTLE_REGULAR: "battle_regular",
    BATTLE_BONUS: "battle_bonus",

    SPECIAL_OFFER_COUNT: "special_offer_count",

    UNIT_VALUE: "value_",

    CLANS_DAU: "clans_dau",

    UNITS_AMOUNT: "units_amount",
    UNITS_AMOUNT_DAU: "units_amount_dau",
    EARNED_COINSPLANT: "earned_coinsplant",
    EARNED_RUBIESPLANT: "earned_rubiesplant",
    EARNED_ENERGYPLANT: "earned_energyplant",
    EARNED_MAGICPLANT: "earned_magicplant",
    CASTLE_PRIZES: "castle_prizes",

    LANDMARKS: {
        OPEN: "landmark_open",
        REPLACE: "landmark_replace"
    },

    // for sources
    FAKEFB_BY_TIMEOUT: "fakefb_by_timeout",
    FAKEFB_BY_SCRIPT_ERROR: "fakefb_by_script_error",
    FACEBOOK_INITED: "facebook_inited"
};

if (typeof module !== "undefined") {
    module.exports = cleverappsEvents;
}
