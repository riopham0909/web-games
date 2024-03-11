/**
 * Created by mac on 10/21/22
 */

var ExpeditionPage = function (data) {
    this.id = data.id;
    this.prefix = data.prefix;
    this.missionType = data.missionType;
    this.slot = data.slot || CustomSyncers.SLOT_MAIN;
    this.episode = data.episode;
    this.level = data.level || 0;
    this.energy = data.energy;
    this.gameLevel = data.gameLevel;
    this.permanent = data.permanent;
    this.available = data.available;
    this.disableNew = data.disableNew;

    this.attentionEvent = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TRAVEL_BOOK_ATTENTION + this.id) || false;
};

ExpeditionPage.TYPE_SKIP = 0;
ExpeditionPage.TYPE_ACTIVE = 1;
ExpeditionPage.TYPE_UPCOMING = 2;

ExpeditionPage.prototype.isMain = function () {
    return this.id === "main";
};

ExpeditionPage.prototype.getStartTime = function () {
    var mission = cleverapps.missionManager.findByType(this.missionType);
    return mission && mission.isRunning() && mission.started || 0;
};

ExpeditionPage.prototype.getTimeLeft = function () {
    var mission = cleverapps.missionManager.findByType(this.missionType);
    return mission && mission.isRunning() && mission.getTimeLeft() || 0;
};

ExpeditionPage.prototype.updateState = function () {
    var prevState = this.state;
    this.state = this.calcState();

    if (this.isPermanent() && this.isActive() && prevState !== this.state) {
        var stored = cleverapps.GameSaver.load(this.slot);
        if (!stored || Object.keys(stored).length === 0) {
            cleverapps.travelBook.startNewExpedition(this);
        }
    }

    this.title = "TravelBook.title." + this.id;
    if (this.isUpcoming()) {
        this.title = "TravelBook.soon";
    }

    this.forceText = "TravelBookForce." + this.id;

    this.events = this.listEvents();

    if (this.events[0]) {
        this.message = typeof this.events[0].message === "function" ? this.events[0].message(this) : this.events[0].message;
        var events = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TRAVEL_BOOK_EVENTS + this.id) || {};
        events[this.events[0].type] = undefined;
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.TRAVEL_BOOK_EVENTS + this.id, events);
    } else {
        this.message = undefined;
    }

    if (this.isCompleted()) {
        this.setAttentionEvent(ExpeditionPage.EVENT_FINISH);
    }

    this.attention = !this.isCurrent() && this.events.find(function (event) {
        return event.type === this.attentionEvent;
    }, this);
};

ExpeditionPage.prototype.resetEvents = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.TRAVEL_BOOK_EVENTS + this.id, {});
};

ExpeditionPage.prototype.setNew = function (isNew) {
    this.isNew = isNew;
};

ExpeditionPage.prototype.setAttentionEvent = function (attentionEvent) {
    if (this.attentionEvent === attentionEvent) {
        return;
    }

    this.attentionEvent = attentionEvent;

    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.TRAVEL_BOOK_ATTENTION + this.id, attentionEvent);
};

ExpeditionPage.prototype.planEvent = function (type, time) {
    var events = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TRAVEL_BOOK_EVENTS + this.id) || {};

    events[type] = {
        time: time
    };

    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.TRAVEL_BOOK_EVENTS + this.id, events);
};

ExpeditionPage.prototype.listEvents = function () {
    if (cleverapps.config.type !== "merge") {
        return [];
    }

    if (!this.isActive()) {
        return [];
    }

    var events = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TRAVEL_BOOK_EVENTS + this.id) || {};

    return ExpeditionPage.EVENTS.filter(function (event) {
        if (event.filter) {
            return event.filter(this);
        }

        return events[event.type] && events[event.type].time && events[event.type].time < Date.now();
    }, this);
};

ExpeditionPage.prototype.isPassed = function () {
    return cleverapps.missionManager.isMissionPassed(this.missionType);
};

ExpeditionPage.prototype.calcState = function () {
    if (this.isMain()) {
        return ExpeditionPage.TYPE_ACTIVE;
    }

    if (this.isPermanent()) {
        return cleverapps.user.checkAvailable(this.available) ? ExpeditionPage.TYPE_ACTIVE : ExpeditionPage.TYPE_UPCOMING;
    }

    var missionConfig = Missions[this.missionType];
    if (!missionConfig) {
        return ExpeditionPage.TYPE_SKIP;
    }

    if (cleverapps.missionManager.findByType(this.missionType)) {
        return ExpeditionPage.TYPE_ACTIVE;
    }

    if (this.isPassed()) {
        return ExpeditionPage.TYPE_SKIP;
    }

    if (missionConfig.feature) {
        var isAvailable = cleverapps.missionManager.isAvailableByType(this.missionType, { skipFeatures: true });
        var nextEvent = cleverapps.eventManager.getNextFeatureEvent(missionConfig.feature);
        if (!isAvailable || !nextEvent || nextEvent.getTimeBeforeStart() > cleverapps.parseInterval("3 days")) {
            return ExpeditionPage.TYPE_SKIP;
        }
    }

    if (missionConfig.disableNew) {
        return ExpeditionPage.TYPE_SKIP;
    }

    return ExpeditionPage.TYPE_UPCOMING;
};

ExpeditionPage.prototype.gotoExpedition = function (f) {
    cleverapps.travelBook.setCurrentPage(this);

    this.setAttentionEvent(false);

    if (this.isMain()) {
        var MainSceneClass = cleverapps.meta.getMainScene();
        cleverapps.scenes.replaceScene(new MainSceneClass(), f);
    } else {
        var mission = cleverapps.missionManager.findByType(this.missionType);

        var scene = new GameScene({
            level: this.getCurrentLevel()
        });

        cleverapps.scenes.replaceScene(scene, function () {
            if (mission && mission.isCompleted()) {
                mission.displayCompleted(f);
            } else {
                f();
            }
        });
    }
};

ExpeditionPage.prototype.isActive = function () {
    return this.state === ExpeditionPage.TYPE_ACTIVE;
};

ExpeditionPage.prototype.isUpcoming = function () {
    return this.state === ExpeditionPage.TYPE_UPCOMING;
};

ExpeditionPage.prototype.isSeasonal = function () {
    return Missions[this.missionType] && Missions[this.missionType].feature;
};

ExpeditionPage.prototype.isPermanent = function () {
    return Boolean(this.permanent);
};

ExpeditionPage.prototype.isCompleted = function () {
    var mission = cleverapps.missionManager.findByType(this.missionType);
    return mission && mission.isCompleted();
};

ExpeditionPage.prototype.isCurrent = function () {
    return cleverapps.travelBook.getCurrentPage() === this;
};

ExpeditionPage.prototype.withEnergy = function () {
    return this.isMain() || this.energy;
};

ExpeditionPage.prototype.withWands = function () {
    return this.isMain() || !["rapunzel", "rapunzel2", "easter", "china"].includes(this.id);
};

ExpeditionPage.prototype.withWorkers = function () {
    return this.isMain() || !["rapunzel", "rapunzel2", "easter", "collections", "china"].includes(this.id);
};

ExpeditionPage.prototype.getCurrentLevel = function () {
    return new Episode(this.episode, this.level).getLevel();
};

ExpeditionPage.prototype.getButtonMsg = function () {
    if (this.isUpcoming()) {
        if (this.isPermanent() && this.levelsUntil() > 0) {
            return Messages.get("UnlockOnLevel", { level: Math.floor(this.available.level + 1) });
        }
        return "Soon";
    }
    return "Go";
};

ExpeditionPage.prototype.getTooltipMsg = function () {
    if (this.isPermanent() && this.levelsUntil() > 0) {
        return Messages.get("UnlockOnLevel", { level: Math.floor(this.available.level + 1) });
    }
    return Messages.get("TravelBook.soonTooltip");
};

ExpeditionPage.prototype.levelsUntil = function () {
    return Math.floor(this.available.level) - Math.floor(cleverapps.user.getFloatLevel());
};

ExpeditionPage.prototype.isRunning = function () {
    if (this.isMain()) {
        return true;
    }

    if (this.isPermanent()) {
        return cleverapps.user.checkAvailable(this.available);
    }

    return Boolean(cleverapps.missionManager.findRunningMission(this.missionType));
};

ExpeditionPage.EVENT_START = "start";
ExpeditionPage.EVENT_FINISH = "finish";
ExpeditionPage.EVENT_ENERGY = "energy";
ExpeditionPage.EVENT_KEYS = "keys";
ExpeditionPage.EVENT_BUILT = "built";

ExpeditionPage.EVENTS = [
    {
        type: ExpeditionPage.EVENT_START,
        message: {
            text: "TravelBook.message.welcome"
        },
        filter: function (page) {
            return page.isNew;
        }
    },
    {
        type: ExpeditionPage.EVENT_FINISH,
        message: function () {
            return {
                text: "TravelBook.message.finished",
                icon: bundles.travel_book.frames.icon_finish
            };
        },
        filter: function (page) {
            return page.isCompleted();
        }
    },
    {
        type: ExpeditionPage.EVENT_BUILT,
        message: function () {
            return {
                text: "TravelBook.message.built",
                icon: bundles.travel_book.frames.icon_built
            };
        }
    },
    {
        type: ExpeditionPage.EVENT_KEYS,
        message: function (page) {
            return {
                icon: bundles.travel_book.frames["icon_key_" + page.id],
                text: "TravelBook.message.keys." + page.id
            };
        }
    },
    {
        type: ExpeditionPage.EVENT_ENERGY,
        message: function (page) {
            return {
                icon: bundles.travel_book.frames["icon_energy_" + page.id],
                text: "TravelBook.message.energy"
            };
        },
        filter: function (page) {
            return page.withEnergy() && cleverapps.livesBySlots[page.slot].isFull();
        }
    }
];
