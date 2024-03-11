/**
 * Created by slava on 5/8/17.
 */

cleverapps.DataLoader = {
    enabled: true,
    corrupted: false,
    _onSavedCallbacks: [],
    data: {},
    checksum: 0,
    _queue: {},
    localStorage: window.localStorage,

    setAlerted: function (alerted) {
        this.alerted = alerted;
    },

    setEnabled: function (enabled) {
        this.enabled = enabled;
    },

    setCorrupted: function (corrupted) {
        this.corrupted = corrupted;
    },

    haveSavedData: function () {
        var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ID);
        if (cleverapps.platform.oneOf(GDCom)) {
            return Boolean(data && data.id === cleverapps.platform.getUserID());
        }
        return data !== undefined;
    },

    save: function (key, data, options) {
        this._queue[key] = {
            data: data,
            options: options
        };
        this._runSaveTimeout();
    },

    onSaved: function (callback) {
        if (this._saveTimeout === undefined) {
            callback();
        } else {
            this._onSavedCallbacks.push(callback);
        }
    },

    processSaveQueue: function () {
        for (var key in this._queue) {
            if (this._queue[key].data === cleverapps.DataLoader.REMOVE) {
                this._removeProcess(key, this._queue[key].options);
            } else {
                this._saveProcess(key, this._queue[key].data, this._queue[key].options);
            }
        }
        this._queue = {};
        this._saveTimeout = undefined;
        for (var i = 0; i < this._onSavedCallbacks.length; i++) {
            this._onSavedCallbacks[i]();
        }
        this._onSavedCallbacks = [];

        this.saveChecksum();
    },

    _runSaveTimeout: function () {
        if (this._saveTimeout === undefined) {
            this._saveTimeout = setTimeout(this.processSaveQueue.bind(this), 1000);
        }
    },

    _saveProcess: function (key, data, options) {
        options = options || {};
        var limit = options.limit || cleverapps.DataLoader.FIFO_LIMIT;
        var fifoKey = options.fifoKey;
        var raw = options.raw;

        if (!fifoKey || this.hasKey(key)) {
            var string = raw ? (data + "") : JSON.stringify(data);
            this.addChecksum(key, this.data[key]);
            this.addChecksum(key, string);
            this.data[key] = string;

            if (key !== cleverapps.DataLoaderTypes.GIT && (!this.enabled || this.corrupted)) {
                return;
            }

            if (key !== cleverapps.DataLoaderTypes.CLIENT_SESSION) {
                this.checkClientSession();
                if (this.corrupted) {
                    return;
                }
            }

            try {
                if (cleverapps.DataLoader.CLIENT_SESSION !== undefined && key !== cleverapps.DataLoaderTypes.CLIENT_SESSION && !cleverapps.DataLoader.localStorage.getItem(cleverapps.DataLoaderTypes.CLIENT_SESSION)) {
                    cleverapps.eventLogger && cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.CLEARANCE.LOCALSTORAGE_CLEARED);
                    throw 1;
                }

                if (string && string.length > cleverapps.DataLoader.VALUE_LENGTH_LIMIT) {
                    cleverapps.throwAsync("Attempt to save huge value (" + string.length + ") to localstorage key - " + key);
                }

                cleverapps.DataLoader.localStorage.setItem(key, string);

                if (!cc.sys.isNative && cleverapps.DataLoader.localStorage.getItem(key) !== string) {
                    if (key !== cleverapps.DataLoaderTypes.CLIENT_SESSION) {
                        cleverapps.eventLogger && cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.CLEARANCE.LOCALSTORAGE_ERROR_SET_ITEM);
                    }
                    throw 2;
                }
            } catch (e) {
                cleverapps.DataLoader.localStorage.removeItem(cleverapps.DataLoaderTypes.SESSION_SAVE_KEY);
                this.corrupted = true; // not save data to localstorage anymore
            }

            return;
        }

        var fifo = this.load(fifoKey) || [];
        while (fifo.length >= limit) {
            this.remove(fifo[0], fifoKey);
            fifo = this.load(fifoKey);
        }
        fifo.push(key);
        this._saveProcess(fifoKey, fifo);

        this._saveProcess(key, data);
    },

    getCharValues: function (params) {
        var values = [];
        var charCode;
        for (var i = 0; i < params.str.length; i++) {
            charCode = params.str.charCodeAt(i);
            if (params.encode) {
                values.push(charCode <= 65517 ? charCode + 18 : charCode);
            } else {
                values.push(charCode <= 65535 ? charCode - 18 : charCode);
            }
        }
        return values;
    },

    hasKey: function (key) {
        var stored;
        if (this._queue[key]) {
            stored = this._queue[key].data;
        } else {
            // eslint-disable-next-line no-prototype-builtins
            if (!this.data.hasOwnProperty(key)) {
                this.data[key] = cleverapps.DataLoader.localStorage.getItem(key);
            }
            stored = this.data[key];
        }
        return stored !== null && stored !== undefined;
    },

    checkClientSession: function () {
        if (cleverapps.isLocalhost()) {
            return true;
        }

        if (cleverapps.DataLoader.CLIENT_SESSION !== undefined) {
            var curSession = cleverapps.DataLoader.localStorage.getItem(cleverapps.DataLoaderTypes.CLIENT_SESSION);
            if (curSession !== cleverapps.DataLoader.CLIENT_SESSION && curSession) {
                this.corrupted = true;
                cleverapps.eventLogger && cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.CLEARANCE.LOCALSTORAGE_SESSION_EXPIRED);
                if (cleverapps.synchronizer) {
                    cleverapps.synchronizer.clientSessionExpired();
                }
                return false;
            }
        }
        return true;
    },

    load: function (key, options) {
        if (this._queue[key]) {
            var data = this._queue[key].data;
            if (data === cleverapps.DataLoader.REMOVE) {
                return undefined;
            }

            var queueRaw = this._queue[key].options && this._queue[key].options.raw;
            var optionsRaw = options && options.raw;

            data = queueRaw ? (data + "") : data;
            return optionsRaw && !queueRaw ? JSON.stringify(data) : data;
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!this.data.hasOwnProperty(key) && (this.enabled || key === cleverapps.DataLoaderTypes.GIT)) {
            this.data[key] = cleverapps.DataLoader.localStorage.getItem(key);
        }
        var stored = this.data[key];
        if (stored !== null && stored !== undefined && stored !== "undefined" && !(cleverapps.platform instanceof Wechat && stored === "")) {
            if (options && options.raw) {
                return stored;
            }
            var storedData = JSON.parse(stored);
            if (storedData.dataCodes) {
                var values = this.getCharValues({ str: storedData.dataCodes });
                storedData = JSON.parse(String.fromCharCode.apply(null, values));
            }
            return storedData;
        }

        return undefined;
    },

    remove: function (key, fifoKey) {
        this._queue[key] = {
            data: cleverapps.DataLoader.REMOVE,
            options: fifoKey
        };
        this._runSaveTimeout();
    },

    _removeProcess: function (key, fifoKey) {
        if (this._queue[key]) {
            delete this._queue[key];
        }
        this.addChecksum(key, this.data[key]);
        delete this.data[key];

        if (this.enabled && !this.corrupted) {
            cleverapps.DataLoader.localStorage.removeItem(key);
        }

        if (fifoKey) {
            var fifo = this.load(fifoKey);
            if (fifo) {
                var index = fifo.indexOf(key);
                if (index >= 0) {
                    fifo.splice(index, 1);
                    this.save(fifoKey, fifo);
                }
            }
        }
    },

    cleanAll: function () {
        clearTimeout(this._saveTimeout);
        this._saveTimeout = undefined;

        this._queue = {};
        this.data = {};
        this.checksum = 0;
        this.saveChecksum();

        console.log("Clearing LOCALSTORAGE");

        if (cleverapps.DataLoader.localStorage !== window.localStorage) {
            cleverapps.DataLoader.localStorage.clear();
        } else {
            var prefix = this.getLocalStoragePrefix();

            for (var storedKey in window.localStorage) {
                if (storedKey.indexOf(prefix) === 0) {
                    console.log("Clearing LOCALSTORAGE:" + storedKey);
                    cleverapps.DataLoader.localStorage.removeItem(storedKey);
                }
            }
        }

        this.resetClientSession();
    },

    isEnabled: function () {
        if (!cc.sys.isNative) {
            try {
                window.localStorage.setItem("test", "testValue");
                if (window.localStorage.getItem("test") !== "testValue") {
                    return false;
                }
                window.localStorage.removeItem("test");
                return true;
            } catch (e) {
                return false;
            }
        }
        return true;
    },

    addChecksum: function (key, value) {
        if (key === cleverapps.DataLoaderTypes.CHECKSUM) {
            return;
        }

        // eslint-disable-next-line no-bitwise
        this.checksum ^= cleverapps.hashCode(value);
    },

    loadChecksum: function () {
        return cleverapps.castType(cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.CHECKSUM));
    },

    saveChecksum: function () {
        cleverapps.DataLoader._saveProcess(cleverapps.DataLoaderTypes.CHECKSUM, this.checksum);
    },

    getLocalStoragePrefix: function () {
        return cleverapps.config.name + cleverapps.platform.getLocalStoragePreffix();
    }
};

cleverapps.DataLoader.REMOVE = -12345;
cleverapps.DataLoader.FIFO_LIMIT = 10;
cleverapps.DataLoader.VALUE_LENGTH_LIMIT = 10 * 1000 * 1000;

cleverapps.DataLoader.resetClientSession = function () {
    cleverapps.DataLoader.CLIENT_SESSION = undefined;
    cleverapps.DataLoader.setEnabled(true);
    cleverapps.DataLoader.setCorrupted(false);
    if (!cc.sys.isNative) {
        cleverapps.DataLoader.CLIENT_SESSION = (Math.floor(Math.random() * 1000000000) + 1) + "";
        cleverapps.DataLoader._saveProcess(cleverapps.DataLoaderTypes.CLIENT_SESSION, cleverapps.DataLoader.CLIENT_SESSION, { raw: true });
        cleverapps.DataLoader.saveChecksum();
        if (cleverapps.DataLoader.corrupted) {
            cleverapps.DataLoader.setEnabled(false);
            cleverapps.DataLoader.setCorrupted(false);
            cleverapps.DataLoader.CLIENT_SESSION = undefined;
        }
    }
};

cleverapps.DataLoaderTypes = {
    ID: "",
    HISTORY: "_history",
    CLIENT_SESSION: "_client_session",
    USERS_SYNCS: "_users_syncs",
    CHECKSUM: "_checksum",

    SETTINGS: "_settings",
    DAILY_CHEST: "_periodicBonus",
    BONUS_GAME_CHEST: "_bonus_game_chest",
    TUTORIAL: "_tutorial",
    LEVEL_HINTS: "_level_hints",
    PRODUCT_VIDEO_PROGRESS: "_v_p_",
    GAME_SAVE_FIFO: "_game_save_fifo",
    USER_IDS_HISTORY: "_ids_history",
    PAYMENTS_HISTORY_5_PRICE: "_my_payments_5_price",
    SALE_MANAGER: "_sale_manager",
    SALE: "_sale",
    SERVER_VERSION: "_server_version",
    SESSION_SAVE_KEY: "_session",
    PROMOTION: "_promotion",
    LOCALIZATION_MANAGER: "_localization_manager",

    LIVES: "_lives",
    BOOSTERS: "_boosters_counter",
    STAR_CHEST: "_star_chest",

    BONUS_EPISODES_PROGRESS: "_bonus_episodes_progress",

    VIP_LEVEL: "vip_level",

    SERVER_FLAGS: "_server_flags",
    BUY_MOVES_WINDOW: "_buy_moves_window",
    FORCES: "_forces",

    FREE_BOMB_MOVES: "_free_bomb_moves",

    UNLIMITED_LIVES: "_temp_goods",

    SORTER: "_sorter",

    FRIEND_REQUESTS: "_friend_requests",
    FAKE_REQUESTS: "_fake_request_time",
    ASKED_LIVES: "_asked_lives",
    ASKED_STARS: "_asked_stars",

    PACK: "_pack",
    DAILY_TASKS: "_daily_tasks",
    ACHIEVEMENTS: "_achievements",

    WIN_STREAK: "_win_seria",

    LOCAL_PUSHES: "_local_pushes",

    TOURNAMENT_COMPETITORS: "_tournament_competitors",
    TOURNAMENT_PLAYERS: "_tournament_players",
    TOURNAMENT_RECORD: "_tournament_record",

    PLAY_SESSION: "_play_session",

    AD_ICON: "_adicon",

    SPECIAL_LIVES_OFFER_LAST_TIME: "_special_energy_offer_last_time",

    SPECIAL_OFFER_LAST_TIME: "_special_offer_last_time",

    LEVEL_ATTEMPTS: "_level_attempts",

    MONSTER_PLANNER: "_monster_planner",
    GROWINGS_PLANNER: "_growings_planner",

    LAST_VIEWED_FRIEND_REQUEST: "_last_viewed_friend_request",

    MISSIONS: "_missions",
    COMPETITION: "_competition",
    COMPETITION_PLAYERS: "_competition_players",
    COMPETITION_STATISTICS: "_competition_statistics",

    PLACEMENTS: "_placements",

    PIGGY_BANK: "_piggy_bank",

    SUBSCRIPTION: "_subscription",
    GROWTHFUND: "_growthfund",

    INSTANT_BOT_CREATED: "_instant_bot_created",

    HEROES: "_heroes",

    CUP: "_cup",
    CUP_RULES: "cup_rules",

    MINI_GAME_RECORD: "_mini_game_record",

    INFORMATION: "_info",
    SYNC: "_sync",
    LAST_SYNC_IN: "_last_sync_in",

    FRIDAY_SALE: "_friday_sale",

    LANTERN: "_lantern",

    FARM: "_clockmaker_a",
    FISHDOM: "_fishdom",
    HOMEFIX: "_home",

    DAILY_LEVEL: "_daily_level",

    KNOCKOUT: "_knockout",
    SHORTMETA: "_short",

    COOKIE_JAR: "_cookie_jar",

    RATED: "_rated",

    SIMPLE: "_simple",
    HIGHSCORE: "_loop", // backward compatibility

    JACKPOT_LAST_APPEAR_TIME: "_jackpot_last_appear_time",

    ADMIN_CHART: "_admin_chart",

    SCROLL: "_scroll",
    MAP2D: "_map2d",

    QUESTS: "_quests",
    QUESTS_LOCAL: "_quests_local",

    UNIT_SAVER_KICKOUTS: "_unit_saver_kickouts",

    UNITS_LIBRARY: "_units_library",
    UNITS_SHOP: "_units_shop",
    WORKERS: "_workers",
    HARVESTED: "_harvested",
    FOGS: "_fogs",
    POCKET: "_pocket",

    ARMY_LIBRARY: "_armylib",

    CHAT: "_chat",
    CONSOLE_STREAM_START_TIME: "_console_stream_start_time",

    RESET_REPORT: "_reset_report",

    ADS_LIMITS_DATA: "_ads_limits_data",
    ENERGY_PRODUCTS: "_energy_products",

    GAME_DATA: "_game_data",

    ABTEST: "_abtest",

    BARREL_PLANNER: "_barrel_planner",
    PIXELS_PLANNER: "_pixels_planner",
    SPECIALOFFERS_PLANNER: "_specialoffers_planner",

    BUBBLES: "_bubbles",

    TRAVEL_BOOK_EVENTS: "_travel_book_events_",
    TRAVEL_BOOK_ATTENTION: "_travel_book_attention_",

    EXPEDITION_PUSH_PLANNING_TIME: "_expedition_push_planning_time",

    UNKNOWN_UNIT_TEST: "_unknown_unit_test",
    USER_CLAN: "_user_clan",

    SNAPSHOT_TIME_DELTA: "_snapshot_time_delta",

    ARMY: "_army",

    TROOP_CARDS: "_troop_cards",

    TRAVEL_BOOK_HINT_TIME: "_travel_book_hint_time",

    USER_DELETE: "_user_delete",

    OFFER_PURCHASE_TIME: "_offer_purchase_time_",

    GAME_MODES: "_game_modes",
    ADS_SKINS: "_ads_skins",

    LANDMARK_INFO: "_landmark_info",
    INSTANT_TOURNAMENT: "_instcup",

    THROWERROR: "_debug_throwerror",

    TEST_SOUNDS: "_test_sounds",

    LAST_SUCCESSFUL_SHARE: "_last_successful_share",

    AD_OCEAN_TOKEN: "_ad_ocean_token",

    GIT: "_git",

    UNLOCKED_TILES_STAGES: "_unlocked_tiles_number"
};

cleverapps.DataLoader.init = function () {
    var prefix = cleverapps.DataLoader.getLocalStoragePrefix();

    Object.keys(cleverapps.DataLoaderTypes).forEach(function (key) {
        cleverapps.DataLoaderTypes[key] = prefix + cleverapps.DataLoaderTypes[key];
    });

    if (typeof cleverapps.DataLoader.localStorage.getData === "function") {
        console.log("DataLoader.getData read single batch");
        cleverapps.DataLoader.data = cleverapps.DataLoader.localStorage.getData();
    } else if (!cc.sys.isNative || cleverapps.platform.oneOf(Microsoft, Mygames)) {
        try {
            if (typeof window.localStorage !== "undefined" && window.localStorage) {
                Object.keys(window.localStorage).forEach(function (key) {
                    if (key.indexOf(prefix) === 0) {
                        this.data[key] = cleverapps.DataLoader.localStorage.getItem(key);
                    }
                }.bind(this));
            }
        } catch (e) {
            console.warn("DataLoader.getData cant read all data", e);
        }
    } else {
        console.log("DataLoader.getData cant read all data");
    }

    var storageChecksum = this.loadChecksum();

    for (var key in this.data) {
        this.addChecksum(key, this.data[key]);
    }

    var userInfo = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ID);
    var hasChecksum = cleverapps.DataLoader.hasKey(cleverapps.DataLoaderTypes.CHECKSUM)
        || Version.compare("1.237.0", userInfo && userInfo.version) < 0;
    if (hasChecksum) {
        this.checksumMatch = this.checksum === storageChecksum;
        if (!this.checksumMatch) {
            if (cleverapps.config.debugMode) {
                console.error("checksum different storage - " + storageChecksum + ", actual - " + this.checksum);
            } else {
                console.log("checksum different");
            }
        }
    }
    this.saveChecksum();

    cleverapps.DataLoader.resetClientSession();
};
