/**
 * Created by mac on 5/6/17.
 */

// switch off pool - load 1x1 images instead of some real images
window.ENABLE_IMAEG_POOL = false;

cleverapps.EVENTS = cleverappsEvents;

cleverapps.whenAllInitialized = function (callback) {
    if (cleverapps.allInitialized) {
        callback();
    }

    if (!cleverapps.__whenAllInitializedCallbacks) {
        cleverapps.__whenAllInitializedCallbacks = [];
    }
    cleverapps.__whenAllInitializedCallbacks.push(callback);
};

cleverapps.afterAllLoadingFinish = function () {
    cleverapps.allInitialized = true;

    cleverapps.timeStart = Date.now();

    if (cleverapps.__whenAllInitializedCallbacks) {
        cleverapps.__whenAllInitializedCallbacks.forEach(function (callback) {
            callback();
        });
    }
};

cleverapps.askPermissionsAndInit = function () {
    new ActionPlayer([
        function (f) {
            cleverapps.paymentsCountry.whenInitialized("rewardedAdsManager", f);
        },

        function (f) {
            cleverapps.platform.registerPlugin(Platform.ADS, cleverapps.rewardedAdsManager.createPlugin.bind(cleverapps.rewardedAdsManager));
            cleverapps.rewardedAdsManager.askPermission(f);
        },

        function (f) {
            cleverapps.platform.connect();
            f();
        },

        function (f) {
            cleverapps.appTracking.askPermission(f);
        },

        function (f) {
            cleverapps.localPushes.askPermission(f);
        },

        function (f) {
            cleverapps.whenAllInitialized(f);
        },

        function (f) {
            cleverapps.rewardedAdsManager.init();
            cleverapps.localPushes.initialize();
            f();
        }
    ]).play();
};

cleverapps.afterResourceLoaded = function () {
    if (typeof document !== "undefined") {
        document.title = Messages.get(cleverapps.config.title);
    }

    if (LogTimeStart.active) {
        LogTimeStart.active.stop();
    }

    cleverapps.LocalizationManager.run();

    if (typeof GitManager !== "undefined") {
        cleverapps.git = new GitManager();
        cleverapps.git.load();
    }

    if (cleverapps.hose) {
        cleverapps.hose.setCurrentEpisode(cleverapps.user.episode);
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.APP_INITIALIZE);
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.RENDER_TYPE + (cc._renderType === cc.game.RENDER_TYPE_CANVAS ? "canvas" : "webgl"));

    if (cleverapps.DataLoader.checksumMatch !== undefined) {
        cleverapps.eventLogger.logEvent(cleverapps.DataLoader.checksumMatch ? cleverapps.EVENTS.DEBUG.CLEARANCE.DATALOADER_CHECKSUM_MATCH : cleverapps.EVENTS.DEBUG.CLEARANCE.DATALOADER_CHECKSUM_DIFFERENT);
    }

    cleverapps.Shaders.initialize();

    if (cleverapps.config.debugMode) {
        cleverapps.administrator = new Administrator();
        if (typeof CardBlockHandler !== "undefined") {
            cleverapps.cardBlockHandler = new CardBlockHandler();
        }
        cleverapps.toolModel = new ToolModel();
        cleverapps.shortcuts = new Shortcuts();
        cleverapps.sceneDebugger = new SceneDebugger();
        cleverapps.drawCallsDebugger = new DrawCallsDebugger();
        cleverapps.debugSlider = new DebugSlider();
        cleverapps.debugStats = new DebugStats();
    }

    cleverapps.flags.update();
    cleverapps.returnBonus = new ReturnBonus();

    cleverapps.placements = new Placements();

    cc.renderer.assignedZStep = 1 / 100000;

    if (cleverapps.config.type === "board") {
        levels.gameHints = new levels.GameHints();
        levels.cookieJar = new cleverapps.CookieJar();
        levels.tutorial = new cleverapps.Tutorial();
    } else if (cleverapps.config.type === "match3") {
        levels.levelAttempts = new levels.LevelAttempts();
    }

    cleverapps.bannerAd = new BannerAd();

    cleverapps.giveUsersGifts();

    cleverapps.meta.distract({
        focus: "afterAllLoadingFinish",
        actions: [
            function (f) {
                cleverapps.resolution.showCanvas();

                if (cleverapps.platform.oneOf(Instant, Samsung)) {
                    cleverapps.platform.removeLoadingProgress(f);
                } else {
                    f();
                }
            },

            function (f) {
                cleverapps.afterAllLoadingFinish();

                cleverapps.userDelete.checkDeletion(f);
            },

            function (f) {
                if (cleverapps.loadedSnapshot && cleverapps.loadedSnapshot.scene) {
                    var scene = cleverapps.loadedSnapshot.scene;
                    var episode = new Episode(scene.episodeNo);
                    var level = episode.getLevel(scene.levelNo);
                    var page = cleverapps.travelBook.getPageById(level.expedition) || cleverapps.travelBook.getPageById("main");
                    cleverapps.travelBook.setCurrentPage(page);

                    var mainObject = cleverapps.meta.getMainObject();
                    if (mainObject.knockoutGame) {
                        mainObject.knockoutGame.rumble = new Rumble();
                        mainObject.knockoutGame.rumble.whenInitialize(function () {
                            level.play(f);
                        });
                        return;
                    }

                    level.play(f);
                    return;
                }

                cleverapps.Plot.onStartup(f);
            }
        ]
    });
};

cleverapps.createGlobalObjects = function () {
    if (cleverapps.importSnapshot) {
        cleverapps.importSnapshot();
    }
    if (cleverapps.unitsDemoMode) {
        cleverapps.unitsDemoMode();
    }

    cleverapps.bundleLoader = new BundleLoader();
    cleverapps.timeouts = new Timeouts();
    cleverapps.platform.registerPlugin(Platform.SOCIAL, SocialHelper.create);
    cleverapps.flags = new cleverapps.Flags();
    cleverapps.gameModes = new GameModes();
    cleverapps.eventBus = new cleverapps.EventEmitter();
    cleverapps.notification = new cleverapps.Notification();
    cleverapps.aims = new Aims();
    cleverapps.resolution = new ResolutionManager();

    cleverapps.DataLoader.init();
    cleverapps.gameModes.load();
    cleverapps.instantTournament = new InstantTournament();

    if (typeof Snapshots !== "undefined") {
        cleverapps.snapshots = new Snapshots();
    }

    cleverapps.userDelete = new UserDelete();

    if (cleverapps.config.type === "merge") {
        Families.initialize();
        Pocket.initialize();
        Landmarks.initialize();
    }

    Missions.initialize();
    Offers.initialize();
    Products.initialize();
    VirtualProducts.initialize();
    RewardedAdsManager.initialize();
    RewardedAdOverlay.initialize();
    cleverapps.PaymentsHistory.initialize();

    cleverapps.synchronizer = new cleverapps.Synchronizer();
    cleverapps.eventLogger = new cleverapps.EventsLogger();

    cleverapps.meta = new Metha();

    PersonsLibrary.initialize();

    cleverapps.playSession = new PlaySession();
    cleverapps.info = new cleverapps.Information();
    cleverapps.episodes = new Episodes();

    cleverapps.expBySlots = {};
    CustomSyncers.SLOTS.forEach(function (slot) {
        cleverapps.expBySlots[slot] = new Exp(slot);
    });
    cleverapps.exp = cleverapps.expBySlots[CustomSyncers.SLOT_MAIN];

    if (cleverapps.config.type === "merge") {
        cleverapps.gameLevel = new GameLevel();
    }

    var isNewUser = cleverapps.DataLoader.haveSavedData() === false;

    if (isNewUser) {
        console.log("Creating new user");
        cleverapps.synchronizer.reset();
    }

    cleverapps.user = levels.user = new levels.User(isNewUser);

    cleverapps.restoreProgress = new RestoreProgress();

    cleverapps.consoleStream = new cleverapps.ConsoleStream();
    cleverapps.abTest = new cleverapps.ABTest();

    cleverapps.scenes = new cleverapps.Scenes();
    cleverapps.environment = new cleverapps.Environment();

    cleverapps.skins = new cleverapps.SkinManager();
    cleverapps.windows = new Windows();
    cleverapps.settings = new cleverapps.Settings(isNewUser);
    cleverapps.audio = new cleverapps.Audio();

    cleverapps.versionChecker = new VersionChecker();

    cleverapps.info.reportPhone();
    cleverapps.info.reportUserAgent();
    cleverapps.info.reportAppVersion();
    cleverapps.info.reportMaxTextureSize();
    cleverapps.info.reportSysLanguage();

    cleverapps.firebase = cleverapps.FirebaseManager.run();
    cleverapps.firebase.init();

    cleverapps.googleAnalytics = GoogleAnalyticsManager.run();
    cleverapps.googleAnalytics.init();

    if (cleverapps.meta.getType() === Metha.FARM) {
        cleverapps.farm = new Farm();
        MethaHelper.prepare();
    } else if (cleverapps.meta.getType() === Metha.HOMEFIX) {
        cleverapps.home = new Home();
        MethaHelper.prepare();
    } else if (cleverapps.meta.getType() === Metha.SHORTMETA) {
        cleverapps.shortmeta = new ShortMeta();
    } else if (cleverapps.meta.getType() === Metha.FISHDOM) {
        cleverapps.fishdom = new Fishdom();
    } else if (cleverapps.meta.getType() === Metha.SIMPLE) {
        cleverapps.simple = new Simple();
    } else if (cleverapps.meta.getType() === Metha.HOSE) {
        cleverapps.hose = new Hose();
    }

    cleverapps.crossPromo = new cleverapps.CrossPromo();

    if (cleverapps.Adjust.IS_AVAILABLE()) {
        cleverapps.adjust = new cleverapps.Adjust();
    }
    if (AdOcean.IsAvailable()) {
        cleverapps.adOcean = new AdOcean();
    }

    cleverapps.fbPixel = new cleverapps.FbPixel();
    cleverapps.nativeFbEventsLogger = new cleverapps.NativeFbEventsLogger();

    cleverapps.paymentsCountry = new PaymentsCountry();
    cleverapps.friends = new FriendsCache();
    cleverapps.invitalbleFriends = new FriendsCache(true);

    cleverapps.paymentsManager = new PaymentsManager();

    cleverapps.platform.registerPlugin(Platform.PAYMENTS, cleverapps.paymentsManager.createPayments.bind(cleverapps.paymentsManager));

    cleverapps.paymentsHistory = new cleverapps.PaymentsHistory();

    cleverapps.userIdsHistory = new UserIdsHistory();

    cleverapps.localPushes = new cleverapps.LocalPushes();

    cleverapps.serverFlags = new cleverapps.ServerFlags();

    if (["merge", "blocks"].indexOf(cleverapps.config.type) === -1) {
        cleverapps.periodicBonus = new cleverapps.MiniGame(isNewUser);
    }

    if (cleverapps.isKnockoutGame()) {
        cleverapps.knockoutTutorial = new KnockoutTutorial();
    }

    if (cleverapps.config.lives) {
        cleverapps.unlimitedLives = new UnlimitedLives();
    }

    if (cleverapps.config.lives || cleverapps.config.energy) {
        cleverapps.livesBySlots = {};
        CustomSyncers.SLOTS.forEach(function (slot) {
            cleverapps.livesBySlots[slot] = new cleverapps.Lives(isNewUser, slot);
        });

        cleverapps.lives = cleverapps.livesBySlots[CustomSyncers.SLOT_MAIN];
    }

    cleverapps.boosters = new cleverapps.Boosters(isNewUser);

    cleverapps.forces = new Forces();

    cleverapps.packManager = new PackManager();

    if (cleverapps.config.features.includes("piggybank")) {
        cleverapps.piggyBank = new PiggyBank();
    }

    cleverapps.subscription = new Subscription();

    if (["mergecraft", "wondermerge", "fairy"].indexOf(cleverapps.config.name) !== -1) {
        cleverapps.growthFund = new GrowthFund();
    }

    if (typeof Heroes !== "undefined") {
        match3.heroes = new Heroes();
    }

    if (cleverapps.config.type === "match3") {
        cleverapps.starChest = new cleverapps.StarChest();
    }

    levels.friendSorter = new FriendSorter();
    levels.friendRequests = new levels.FriendRequests();

    cleverapps.eventManager = new EventManager();
    cleverapps.competitionPlayers = new CompetitionPlayers();
    cleverapps.competitionStatistics = new CompetitionStatistics();

    cleverapps.leagueLeadersTable = new cleverapps.Table();
    cleverapps.cupsLeadersTable = new cleverapps.Table();
    cleverapps.cupsTopTable = new cleverapps.Table();

    cleverapps.dailyCup = new Cup(CupsConfig.TYPE_DAILY);
    cleverapps.weeklyCup = new Cup(CupsConfig.TYPE_WEEKLY);
    cleverapps.clanCupInner = new Cup(CupsConfig.TYPE_CLAN_INNER);
    cleverapps.clanCup = new Cup(CupsConfig.TYPE_CLAN, cleverapps.clanCupInner);

    if (["merge", "match3", "differences", "solitaire", "board"].indexOf(cleverapps.config.type) !== -1) {
        cleverapps.dailyTasks = new DailyTasks(isNewUser);
    }

    if (cleverapps.BonusRoundChest !== undefined) {
        cleverapps.bonusRoundChest = new cleverapps.BonusRoundChest(isNewUser);
    }

    if (cleverapps.config.features.includes("dailylevel")) {
        cleverapps.dailyLevel = new DailyLevel();
    }

    cleverapps.rewardedAdsManager = new RewardedAdsManager();

    cleverapps.travelBook = new TravelBook();

    cleverapps.adsLimits = new AdsLimits();
    cleverapps.toolbar = new Toolbar();
    cleverapps.sideBar = new SideBar();
    cleverapps.menuBar = new MenuBar();
    cleverapps.treasureBag = new TreasureBag();

    cleverapps.offerManager = new OfferManager();

    if (WebWorker.IsAvailable()) {
        cleverapps.webWorker = WebWorker.Build();
    }

    if (cleverapps.config.type === "merge") {
        cleverapps.travelBookHint = new TravelBookHint();
    }

    cleverapps.missionManager = new MissionManager();
    cleverapps.missionManager.init();
    cleverapps.travelBook.init();

    if (cleverapps.config.type === "merge") {
        cleverapps.unitSavers = new UnitSavers();
        cleverapps.unitsShop = new UnitsShop();
        cleverapps.unitsLibrary = new UnitsLibrary();

        cleverapps.userClan = new UserClan();
        cleverapps.clans = new Clans();
        cleverapps.clanMessages = new ClanMessages();
    }

    if (typeof Achievements !== "undefined") {
        cleverapps.achievements = new Achievements();
    }

    if (cleverapps.config.type === "battlefield") {
        cleverapps.barracks = new Barracks();
        cleverapps.formation = new Formation();
        cleverapps.troopCards = new TroopCards();
        cleverapps.armyLibrary = new ArmyLibrary();
        cleverapps.army = new Army();
        if (cleverapps.user.level === 0 && cleverapps.user.episode === 0 && cleverapps.formation.isEmpty()) {
            cleverapps.formation.initForNewPlayer();
        }
    }

    if (ThinkingData.IsAvailable()) {
        cleverapps.thinkingData = new ThinkingData();
    }

    if (GravityEngine.IsAvailable()) {
        cleverapps.gravityEngine = new GravityEngine();
    }

    cleverapps.exclamation = new Exclamation();
    cleverapps.gameMessage = new GameMessage();
    cleverapps.tooltipManager = new TooltipManager();

    if (PlayButton.IsAvailable()) {
        cleverapps.playButton = new PlayButton();
    }

    cleverapps.chat = new Chat();
    cleverapps.chat.load();

    cleverapps.keyboardController = new KeyboardController();

    if (FlyingAd.IsAvailable()) {
        cleverapps.flyingAd = new FlyingAd();
    }

    cleverapps.appTracking = new AppTracking();

    cleverapps.offerManager.initialize();
    if (cleverapps.config.debugMode) {
        cleverapps.snapshotBar = new SnapshotBar();
    }

    if (cleverapps.config.features.includes("highscore")) {
        cleverapps.highscore = new Highscore();
    }

    return isNewUser;
};

cleverapps.checkWebpSupport = function (done) {
    if (cleverapps.config.webpSupport !== undefined) {
        done();
        return;
    }

    if (cleverapps.platform.oneOf(Wechat) && cc.sys.os === cc.sys.OS_ANDROID) {
        var canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;

        var context = canvas.getContext && canvas.getContext("2d");

        cleverapps.config.webpSupport = context && canvas.toDataURL("image/webp").startsWith("data:image/webp");

        done();

        return;
    }

    // https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=="
    };

    var count = 0;
    var supported = 0;

    var callback = cleverapps.waitNoMore(5000, cleverapps.once(function () {
        cleverapps.config.webpSupport = supported === Object.keys(kTestImages).length;
        done();
    }));

    Object.keys(kTestImages).forEach(function (feature) {
        cc.loader.loadImg("data:image/webp;base64," + kTestImages[feature], function (status, img) {
            var result = !status && img && (img.width > 0) && (img.height > 0);

            if (!result) {
                console.log("webp " + feature + " not supported");
            }

            count++;
            if (result) {
                supported++;
            }

            if (!result || count === Object.keys(kTestImages).length) {
                callback();
            }
        });
    });
};

cleverapps.onStart = function () {
    if (typeof document !== "undefined") {
        document.title = cleverapps.config.title;
    }

    cleverapps.platform = PlatformManager.create({
        config: cleverapps.config,
        dataLoader: cleverapps.DataLoader
    });

    cleverapps.platformLogic = PlatformLogic.create();

    if (cleverapps.config.debugMode && !cleverapps.isLocalhost() && !cc.sys.isNative && window.location.protocol !== "https:") {
        throw "https required: " + window.location;
    }

    cleverapps.platform.initialize(function () {
        cleverapps.platformLogic.onInitialize();

        cleverapps.onPlatformStart();
    });
};

cleverapps.onPlatformStart = function () {
    var isNewUser = cleverapps.createGlobalObjects();

    cleverapps.askPermissionsAndInit();

    var resumeFrame = -1000;
    var showListener = cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
        resumeFrame = cc.director.getTotalFrames();
    });

    var done = cleverapps.wait(3, function () {
        if (isNewUser && cleverapps.settings.language !== cleverapps.Settings.getDefaultLanguage() && !cleverapps.config.importMode) {
            cleverapps.settings.setLanguage(cleverapps.Settings.getDefaultLanguage());
        }

        Messages.preload(cleverapps.settings.language, function () {
            cc.eventManager.removeListener(showListener);

            cleverapps.silentIntro = cc.game.isPaused()
                || (cc.director.getTotalFrames() - resumeFrame) <= 60
                || cleverapps.loadedSnapshot;

            cleverapps.afterResourceLoaded(isNewUser);
        });
    });

    var firstSyncCallback = cleverapps.once(done);
    if (cleverapps.flags.norest) {
        firstSyncCallback();
    } else {
        cleverapps.synchronizer._onceFirstSyncCompletedListener = firstSyncCallback;
    }

    var startLoadingResources = function () {
        cleverapps.resolution.setupResolutionScale();

        if (cc.sys.isNative && !cleverapps.config.webpSupport && resolutions[cleverapps.resolution.resolutionName].webp) {
            alert("Error no webp supported");
            cleverapps.throwAsync("Error no webp supported");
        }

        cleverapps.Spine.prepare();

        var start = Date.now();

        var loaderScene = new LoaderScene(ResourceProcessor.calcProbablyNeed(), function () {
            cleverapps.bundleLoader.loadBundles(ResourceProcessor.calcAlwaysNeed(), {
                onSuccess: function () {
                    if (cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.THROWERROR)) {
                        cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.THROWERROR);
                        throw "test error on load";
                    }

                    cleverapps.ConsoleStream.sendLoadingTime("loaderScene " + (Date.now() - start) + "ms");

                    done();
                }
            });
        });

        cc.director.runScene(loaderScene);
        cc.director.setNextScene();
    };

    var waitPlatformAndSocial = function () {
        if (!cleverapps.config.importMode) {
            var waitLonger = cleverapps.social.isLoggedIn() && cleverapps.user.level === 0 && cleverapps.user.episode === 0;
            setTimeout(firstSyncCallback, waitLonger ? 10000 : 3000);
        }

        cleverapps.versionChecker.check();

        if (!cleverapps.social.isLoggedIn()) {
            if (!cleverapps.platform.haveTmpId() && !cleverapps.platform.haveDeviceId() && cleverapps.social instanceof CrazySocial) {
                cleverapps.DataLoader.cleanAll();
                cleverapps.DataLoader.setEnabled(false);
                window.location.reload();
            } else {
                cleverapps.synchronizer.syncWhenReady();
            }
        }

        done();
    };

    cleverapps.platform.on("login", function (params) {
        cleverapps.SocialManager.onLogin(params);
    });

    cleverapps.platform.once("changeStatus:" + Platform.SOCIAL, waitPlatformAndSocial);
    cleverapps.platform.start();

    cleverapps.platformLogic.onStart();

    var connectThrottled = cleverapps.timeredThrottle(10000, cleverapps.platform.connect.bind(cleverapps.platform));

    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, connectThrottled);

    cleverapps.timeouts.setInterval(connectThrottled, cleverapps.parseInterval("5 minutes"));

    cleverapps.checkWebpSupport(startLoadingResources);
};
