/**
 * Created by mac on 7/23/18
 */

var MissionManager = function () {
    this.missions = [];
    this.teaser = undefined;
    this.unknownMissionsData = [];
    this.oldMissions = [];
    this.lastRemoved = {};
    this.table = new cleverapps.Table();

    this.semaphoresOnHold = 0;
};

MissionManager.prototype.isObsoleteMissionType = function (type) {
    var parentType = Mission.GetParentType(type);
    if (parentType !== undefined && this.isObsoleteMissionType(parentType)) {
        return true;
    }

    return Mission.OBSOLETE_TYPES.indexOf(Mission.GetChildType(type)) !== -1;
};

MissionManager.prototype.isPastEventMission = function (type, started) {
    var feature = Missions[type].feature;
    var event = feature && cleverapps.eventManager.getFeatureEvent(feature);
    return event && event.isRunning() && started < event.getStartTime();
};

MissionManager.prototype.canCreateType = function (type) {
    var missionData = Missions[type];
    if (!missionData) {
        return false;
    }

    var existingTypes = cleverapps.createSet(this.getExistingTypes());
    if (!existingTypes[type]) {
        return false;
    }

    var available = missionData.available || {};

    if (available.projectName && cleverapps.toArray(available.projectName).indexOf(cleverapps.config.name) === -1) {
        return false;
    }

    if (cleverapps.config.demoMode) {
        return true;
    }

    if (available.debugMode && !cleverapps.config.debugMode) {
        return false;
    }

    if (available.disabled) {
        return false;
    }

    var parentType = Mission.GetParentType(type);
    if (parentType !== undefined && !this.canCreateType(parentType)) {
        return false;
    }

    return true;
};

MissionManager.prototype.init = function () {
    // Object.keys(Missions).forEach(function (type) {
    //     var missionData = Missions[type];
    //     if (missionData && missionData.feature && !this.isObsoleteMissionType(type) && !this.isOldMission(type) && this.canCreateType(type)) {
    //         var events = cleverapps.eventManager.listFeatureEvents(missionData.feature);
    //         if (!events.length) {
    //             cleverapps.throwAsync("no feature " + missionData.feature + " in schedule for mission " + missionData.type);
    //         }
    //     }
    // }.bind(this));

    this.reset();
    this.load(cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.MISSIONS));
};

MissionManager.prototype.migrateOldData = function (data) {
    var replacedVersions = {};

    if (["wondermerge", "fairy"].indexOf(cleverapps.config.name) !== -1) {
        replacedVersions[40] = "40v1";
    }

    if (["mergecraft", "fairy"].indexOf(cleverapps.config.name) !== -1) {
        replacedVersions[32] = "32v1";
        replacedVersions[46] = "46v1";
    }

    var missions = Array.isArray(data) ? data : data.missions || [];

    var expedition = missions.filter(function (mission) {
        return [Mission.TYPE_DRAGONIA_EXPEDITION, Mission.TYPE_UNDERSEA_EXPEDITION].indexOf(mission.type) !== -1 && mission.lastRemoved === undefined;
    })[0];

    for (var index = 0; index < missions.length; index++) {
        var mission = missions[index];

        if (Mission.TYPE_SLOT2_PASS === mission.type && expedition) {
            mission.type = Mission.CompoundType(Mission.TYPE_EXPEDITION_PASS, expedition.type);
        } else if (Mission.TYPE_SLOT2_FEAST === mission.type && expedition) {
            mission.type = Mission.CompoundType(Mission.TYPE_EXPEDITION_FEAST, expedition.type);
        }

        var compound = Mission.ParseCompoundType(mission.type);

        if (replacedVersions[compound.type] !== undefined) {
            mission.type = replacedVersions[compound.type];
        }
        if (replacedVersions[compound.parentType] !== undefined) {
            mission.type = Mission.CompoundType(compound.type, replacedVersions[compound.parentType]);
        }
    }

    Object.keys(data.lastRemoved || {}).forEach(function (type) {
        missions.push({
            type: cleverapps.castType(type),
            lastRemoved: data.lastRemoved[type]
        });
    });

    return missions;
};

MissionManager.prototype.load = function (data, fromServer) {
    if (!data) {
        return;
    }

    var droppedParents = [];
    var missions = this.migrateOldData(data);

    for (var index = 0; index < missions.length; index++) {
        var mission = missions[index];
        var parentType = Mission.GetParentType(mission.type);

        if (parentType !== undefined && droppedParents.includes(parentType)) {
            continue;
        }

        if (this.isObsoleteMissionType(mission.type)) {
            continue;
        }

        if (this.isOldMission(mission.type)) {
            this.pushToOldMission(mission);
            continue;
        }

        if (!this.canCreateType(mission.type)) {
            this.handleUnknownType(mission);
            continue;
        }

        if (this.findByType(mission.type)) {
            continue;
        }

        if (mission.lastRemoved !== undefined) {
            this.lastRemoved[mission.type] = mission.lastRemoved;
            continue;
        }

        if (mission.started === -1) {
            this.teaser = mission.type;
            continue;
        }

        if (!this.canUseSemaphore(mission.type)) {
            droppedParents.push(mission.type);
            continue;
        }

        this.add(mission.type, mission, fromServer);
        delete this.lastRemoved[mission.type];
    }
};

MissionManager.prototype.isOldMission = function (type) {
    var parentType = Mission.GetParentType(type);
    return Mission.OLD_VERSIONS[type] !== undefined || Mission.OLD_VERSIONS[parentType] !== undefined;
};

MissionManager.prototype.pushToOldMission = function (missionData) {
    var index = 0;

    for (; index < this.oldMissions.length; ++index) {
        if (this.oldMissions[index].type === missionData.type) {
            break;
        }
    }

    if (index === this.oldMissions.length) {
        this.oldMissions.push(missionData);
    }

    var mission = this.oldMissions[index];

    if (missionData.lastRemoved !== undefined) {
        this.oldMissions[index] = missionData;
    } else if (mission.lastRemoved !== undefined) {
        this.oldMissions[index] = mission;
    } else {
        this.oldMissions[index] = Object.assign(mission, missionData);
    }
};

MissionManager.prototype.handleUnknownType = function (data) {
    this.unknownMissionsData.push(data);
    cleverapps.playSession.set(cleverapps.EVENTS.DEBUG.UNKNOWN_MISSION_DAU, true);
};

MissionManager.prototype.getPlayableMissions = function () {
    return this.missions.filter(function (mission) {
        return mission.isRunning() && mission.canPlayMinigame();
    });
};

MissionManager.prototype.findLocalExpedition = function () {
    for (var i = 0; i < this.missions.length; i++) {
        var mission = this.missions[i];
        if (mission.logic instanceof ExpeditionMissionLogic && cleverapps.travelBook.getCurrentPage().id === mission.id && mission.isRunning()) {
            return mission;
        }
    }

    return undefined;
};

MissionManager.prototype.findLocalPass = function () {
    for (var i = 0; i < this.missions.length; i++) {
        var mission = this.missions[i];
        if (mission.logic instanceof PassMissionLogic && MissionManager.hasProperParent(mission) && mission.isRunning()) {
            return mission;
        }
    }

    return undefined;
};

MissionManager.prototype.findRunningMission = function (type) {
    var types = cleverapps.createSet(cleverapps.toArray(type) || []);

    for (var i = 0; i < this.missions.length; i++) {
        if (this.missions[i].isRunning() && types[this.missions[i].type]) {
            return this.missions[i];
        }
    }

    return undefined;
};

MissionManager.prototype.findBySemaphore = function (semaphore) {
    for (var i = 0; i < this.missions.length; ++i) {
        var mission = this.missions[i];
        // eslint-disable-next-line no-bitwise
        if (mission.isRunning() && (mission.semaphore & semaphore)) {
            return mission;
        }
    }
};

MissionManager.prototype.findByType = function (type) {
    type = cleverapps.castType(type);

    for (var i = 0; i < this.missions.length; i++) {
        if (this.missions[i].type === type) {
            return this.missions[i];
        }
    }

    return undefined;
};

MissionManager.prototype.skipNext = function () {
    return this.missions.filter(function (mission) {
        return mission.skipNext();
    }).length > 0;
};

MissionManager.prototype.getMissionWithIntent = function () {
    for (var i in this.missions) {
        var mission = this.missions[i];
        if (mission.logic && mission.logic.hasIntent && mission.logic.hasIntent()) {
            return mission;
        }
    }
    return undefined;
};

MissionManager.prototype.dispatchEvent = function (missionOrType, options) {
    var mission = (typeof missionOrType === "object") ? missionOrType : this.findByType(missionOrType);

    if (mission && mission.isRunning()) {
        mission.logic.processEvent(options);
        return true;
    }

    return false;
};

MissionManager.prototype.reset = function () {
    for (var i = 0; i < this.missions.length; ++i) {
        var mission = this.missions[i];

        var icon = cleverapps.sideBar.findMissionIcon(mission.type);
        if (icon) {
            cleverapps.sideBar.removeTemporaryIcon(icon);
        }

        this.refreshOffer(mission);
    }

    this.table.reset();

    this.missions = [];
    this.teaser = undefined;
    this.unknownMissionsData = [];
    this.oldMissions = [];
    this.lastRemoved = {};
    this.semaphoresOnHold = 0;
};

MissionManager.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.MISSIONS, this.getInfo());
    if (!fromServer) {
        this.addUpdateTask();
    }
};

MissionManager.prototype.sendUpdateTask = function () {
    if (MissionManager.sendUpdateTimeout !== undefined) {
        clearTimeout(MissionManager.sendUpdateTimeout);
        MissionManager.sendUpdateTimeout = undefined;
    }
    cleverapps.synchronizer.addUpdateTask("missions");
};

MissionManager.prototype.addUpdateTask = function () {
    if (cleverapps.config.type !== "merge" && Game.currentGame && Game.currentGame.outcome === GameBase.OUTCOME_UNKNOWN) {
        if (MissionManager.sendUpdateTimeout === undefined && !cleverapps.environment.isSceneWithPreview()) {
            MissionManager.sendUpdateTimeout = setTimeout(this.sendUpdateTask.bind(this), cleverapps.parseInterval("1 minute"));
        }

        if (!Game.currentGame.missionManagerStopHandler) {
            Game.currentGame.missionManagerStopHandler = Game.currentGame.on("stop", function () {
                if (MissionManager.sendUpdateTimeout !== undefined) {
                    this.sendUpdateTask();
                }
            }.bind(this));
        }
        return;
    }
    this.sendUpdateTask();
};

MissionManager.prototype.getInfo = function () {
    var missions = [];
    var used = {};

    this.missions.forEach(function (mission) {
        missions.push(mission.save());
        used[mission.type] = true;
    });

    this.unknownMissionsData.forEach(function (mission) {
        missions.push(mission);
    });

    this.oldMissions.forEach(function (mission) {
        missions.push(mission);
    });

    Object.keys(this.lastRemoved).forEach(function (type) {
        if (used[type]) {
            return;
        }
        missions.push({
            type: cleverapps.castType(type),
            lastRemoved: this.lastRemoved[type]
        });
        used[type] = true;
    }, this);

    return missions;
};

MissionManager.prototype.updateInfo = function (data, fromServer) {
    console.log("updateInfo", data);

    this.reset();
    this.load(data, fromServer);
    this.save(fromServer);
};

MissionManager.prototype.removeSilents = function () {
    while (true) {
        var hasSilent = false;

        for (var i = 0; i < this.missions.length; i++) {
            var mission = this.missions[i];
            if (mission.isCompleted() && mission.canRemoveSilently()) {
                hasSilent = true;
                this.remove(mission);
                break;
            }
        }

        if (!hasSilent) {
            break;
        }
    }
};

MissionManager.prototype.wantsToShowCompleted = function () {
    return this.missions.find(function (mission) {
        if (!mission.isCompleted() || mission.canRemoveSilently() || mission.wasDisplayedCompleted) {
            return false;
        }

        return mission.logic && mission.logic.canShowCompleted ? mission.logic.canShowCompleted()
            : MissionManager.hasProperParent(mission);
    });
};

MissionManager.prototype.pendingStartWindow = function () {
    for (var i = 0; i < this.missions.length; i++) {
        var mission = this.missions[i];
        if (this.hasPendingStartWindow(mission) && (!Missions[mission.type].available || cleverapps.user.checkAvailable(Missions[mission.type].available))) {
            return mission;
        }
    }
};

MissionManager.prototype.hasPendingStartWindow = function (mission) {
    return mission && mission.needShowStartWindow && mission.startWindow && MissionManager.hasProperParent(mission);
};

MissionManager.prototype.showStartWindow = function (mission) {
    cleverapps.meta.display({
        focus: "missionStartWindow_" + mission.type,
        actions: [
            function (f) {
                if (!mission.logic || !mission.logic.unitStory) {
                    f();
                    return;
                }

                var unitStory = mission.logic.unitStory.story;
                var unit = mission.logic.unitStory.unit;
                mission.logic.unitStory = undefined;

                var ship = unit.findComponent(Ship);
                if (ship) {
                    ship.onCustomSpawn(cc.ScrollAction.SCROLL_TO_DURATION);
                }

                Game.currentGame.unitStories.showUnitStory(f, unitStory.dialogue, {
                    unit: unit,
                    delay: 2000
                });
            },

            function (f) {
                mission.needShowStartWindow = false;
                if (mission.startWindow === MissionRulesOptionsBuilder) {
                    new GuideWindow(MissionRulesOptionsBuilder.build(mission));

                    cleverapps.meta.onceNoWindowsListener = f;
                } else {
                    cleverapps.meta.compound(f, [
                        function (f) {
                            var StartWindow = mission.startWindow;
                            new StartWindow(mission);

                            cleverapps.meta.onceNoWindowsListener = f;
                        },
                        function (f) {
                            var offer = cleverapps.offerManager.findOffer({ mission: mission.type });

                            if (offer && !mission.offerWindowShown) {
                                new MissionOfferWindow(offer);

                                cleverapps.meta.onceNoWindowsListener = f;
                            } else {
                                f();
                            }
                        }
                    ]);
                }
            },

            function (f) {
                if (mission.tutorial && Game.currentGame && Game.currentGame.tutorial) {
                    Game.currentGame.tutorial.showTutorial(mission.tutorial, f);
                } else {
                    f();
                }
            }
        ]
    });
};

MissionManager.prototype.getExistingTypes = function () {
    var types = this._getExistingTypes();

    return types.filter(function (type) {
        // if (cleverapps.config.name === "fairy") {
        //     if ([Mission.TYPE_KRAKENFEAST, Mission.TYPE_BOOSTTIME, Mission.TYPE_CHESTTIME, Mission.TYPE_CARAVAN].indexOf(type) !== -1) {
        //         return cleverapps.ABTest.NEW_MISSIONS();
        //     }
        // }

        if (cleverapps.platform.oneOf(GDCom) && cleverapps.platform.isCoolmathgames()) {
            return [Mission.TYPE_LETTER, Mission.TYPE_STICKERS_COLLECTION, Mission.TYPE_LIVESFEAST, Mission.TYPE_SOFTFEAST,
                Mission.TYPE_KRAKENFEAST, Mission.TYPE_SNAIL_FEAST, Mission.TYPE_EXPEDITION_FEAST, Mission.TYPE_SLOT_MACHINE].indexOf(type) === -1;
        }
        return true;
    });
};

MissionManager.prototype._getExistingTypes = function () {
    if (this.existingTypes) {
        return this.existingTypes;
    }

    var types = [];
    if (cleverapps.config.type === "board") {
        types.push(Mission.TYPE_LETTER);
    } else if (cleverapps.config.type === "solitaire") {
        types.push(Mission.TYPE_LETTER);
    } else if (cleverapps.config.type === "differences") {
        types.push(Mission.TYPE_LETTER);
    } else if (cleverapps.config.type === "tile3") {
        types.push(Mission.TYPE_LETTER);
        types.push(Mission.TYPE_CHAIN_SALE);
    } else if (cleverapps.config.type === "match3") {
        types.push(Mission.TYPE_COMBO);
        types.push(Mission.TYPE_COLLECT_MARK);
        types.push(Mission.TYPE_BURN_NEARBY);
        types.push(Mission.TYPE_LANTERN);
    }

    types.push(Mission.TYPE_TREASURE_SEARCH);

    if (["wordsoup", "crocword", "magicwords"].indexOf(cleverapps.config.name) !== -1) {
        types.push(Mission.TYPE_STICKERS_COLLECTION);
    }

    if (["scramble", "riddles", "heroes"].indexOf(cleverapps.config.name) !== -1) {
        types.push(Mission.TYPE_BONUS_WORLD);
    }

    if (["scramble"].indexOf(cleverapps.config.name) !== -1) {
        types.push(Mission.TYPE_SLOT_MACHINE);
    }

    if (cleverapps.config.type === "merge") {
        types = [Mission.TYPE_LIVESFEAST, Mission.TYPE_BUILDPASS, Mission.TYPE_SOFTFEAST, Mission.TYPE_BOOSTTIME,
            Mission.TYPE_CHESTTIME, Mission.TYPE_SALEPASS, Mission.TYPE_KRAKENFEAST,
            Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_EXPEDITION_FEAST, Mission.TYPE_CARAVAN, Mission.TYPE_SNAIL_FEAST,
            Mission.TYPE_PERIODIC_PACK].concat(TravelBook.LIST_IN_ORDER_EXPEDITIONS());
    }

    types.push(Mission.TYPE_PERIODIC_SALE);

    var existingTypes = cleverapps.createSet(types);
    types = types.reduce(function (types, type) {
        if (Missions[type]) {
            (Missions[type].implementations || [type]).forEach(function (type) {
                var parent = Mission.GetParentType(type);
                if (parent === undefined || (existingTypes[parent] && Missions[parent])) {
                    types.push(type);
                }
            });
        }
        return types;
    }, []);

    this.existingTypes = types;
    return this.existingTypes;
};

MissionManager.prototype.isAvailableByType = function (type, options) {
    options = options || {};

    if (Missions[type].disableNew) {
        return false;
    }

    var feature = Missions[type].feature;
    if (feature && !options.skipFeatures && !cleverapps.eventManager.isActive(feature)) {
        return false;
    }

    var available = cleverapps.clone(Missions[type].available || {}, true);

    if (options.teaser) {
        if (cleverapps.config.type === "merge") {
            available.level--;
        } else {
            available.level -= 0.66;
            if (available.level < 0) {
                available.level = 0;
            }
        }
    }

    return cleverapps.user.checkAvailable(available);
};

MissionManager.prototype.refreshTeaser = function () {
    var teaserIcon = cleverapps.sideBar.getTeaserIcon();

    if (teaserIcon && (teaserIcon.type !== this.teaser || !MissionManager.hasProperParent(Missions[this.teaser]))) {
        cleverapps.sideBar.removeTemporaryIcon(teaserIcon);
        teaserIcon = undefined;
    }

    if (this.teaser && !teaserIcon && MissionManager.hasProperParent(Missions[this.teaser])) {
        var icon = new TeaserIcon(this.teaser);
        cleverapps.sideBar.addTemporaryIcon(icon);
    }
};

MissionManager.prototype.canUseSemaphore = function (type) {
    var usedSemaphore = 0;
    for (var i = 0; i < this.missions.length; i++) {
        usedSemaphore |= this.missions[i].semaphore;
    }
    for (i = 0; i < this.unknownMissionsData.length; i++) {
        usedSemaphore |= this.unknownMissionsData[i].semaphore || 0;
    }
    if (this.semaphoresOnHold) {
        usedSemaphore |= this.semaphoresOnHold;
    }
    return (usedSemaphore & Missions[type].semaphore) === 0;
};

MissionManager.prototype.canCreateTypes = function () {
    var existingTypes = this.getExistingTypes();

    var availableTypes = existingTypes.filter(function (type) {
        return this.isAvailableByType(type);
    }.bind(this));

    var availableTeasers = existingTypes.filter(function (type) {
        return Missions[type].teaser && availableTypes.indexOf(type) === -1 && this.isAvailableByType(type, { teaser: true });
    }.bind(this));

    var availableBots = cleverapps.competitionPlayers.getAmount();

    var filterTypes = function (type) {
        var missionData = Missions[type];

        if (missionData.semaphore === 0 && this.findByType(type)) {
            return false;
        }

        if (missionData.manualStart) {
            return false;
        }

        if (!MissionManager.hasProperParent(missionData)) {
            return false;
        }

        var lastRemoved = this.getLastRemoved(type);
        if (lastRemoved) {
            if (missionData.oneShot) {
                return false;
            }
            var cooldown = missionData.cooldown && cleverapps.parseInterval(missionData.cooldown);
            if (cooldown && (lastRemoved + cooldown > Date.now())) {
                return false;
            }
        }

        var semaphoreCooldown = Missions.SEMAPHORE_COOLDOWNS[missionData.semaphore];
        if (semaphoreCooldown) {
            var lastRemovedSemaphore = 0;

            for (var finishedType in this.lastRemoved) {
                if (Missions[finishedType].semaphore === missionData.semaphore) {
                    lastRemoved = this.getLastRemoved(finishedType);
                    if (lastRemoved > lastRemovedSemaphore) {
                        lastRemovedSemaphore = lastRemoved;
                    }
                }
            }

            if (lastRemovedSemaphore + cleverapps.parseInterval(semaphoreCooldown) > Date.now()) {
                return false;
            }
        }

        var needBots = missionData.competition && missionData.competition.amount[1] || 0;
        return this.canUseSemaphore(type) && needBots <= availableBots;
    }.bind(this);

    var sortTypes = function (type1, type2) {
        if (this.teaser === type1) {
            return -1;
        }
        if (this.teaser === type2) {
            return 1;
        }

        var lastRemoved1 = this.lastRemoved[type1] || 0;
        var lastRemoved2 = this.lastRemoved[type2] || 0;
        return lastRemoved1 - lastRemoved2;
    }.bind(this);

    availableTypes = availableTypes.filter(filterTypes);
    availableTypes.sort(sortTypes);

    availableTeasers = availableTeasers.filter(filterTypes);
    availableTeasers.sort(sortTypes);

    return {
        missions: availableTypes,
        teasers: availableTeasers
    };
};

MissionManager.hasProperParent = function (mission) {
    if (!mission) {
        return false;
    }

    if (cleverapps.environment.isEditorScene()) {
        return false;
    }

    var parentType = Mission.GetParentType(mission.type);
    var parent = Missions[parentType];

    if (parentType && !parent) {
        return false;
    }

    var expedition = cleverapps.travelBook.getCurrentExpedition();
    return cleverapps.config.type === "merge" && expedition
        ? (mission.episode === "all") || (parent !== undefined && parent.id && expedition.id === parent.id)
        : parent === undefined;
};

MissionManager.prototype.planMission = function (missionType) {
    this.next = missionType;
};

MissionManager.prototype.run = function () {
    var available = this.canCreateTypes();

    var mission = this.next === undefined ? available.missions[0] : this.next;
    this.next = undefined;

    if (mission !== undefined) {
        this.add(mission);

        if (this.teaser === mission) {
            this.teaser = undefined;
        }

        this.save();
    }

    var teaser = available.teasers.length > 0 && available.teasers[0];
    if (teaser && (!mission || teaser.semaphore !== mission.semaphore)) {
        this.teaser = teaser;
    }

    this.refreshTeaser();

    this.runManualMissions();
};

MissionManager.prototype.runManualMissions = function () {
    this.getExistingTypes().forEach(function (type) {
        this.manualStart(type);
    }, this);
};

MissionManager.prototype.manualStart = function (type, options) {
    var missionData = Missions[type];
    var starter = missionData.manualStart;

    if (!starter || !MissionManager.hasProperParent(missionData)) {
        return;
    }

    if (this.findByType(type) !== undefined) {
        return;
    }

    if (missionData.available && !cleverapps.user.checkAvailable(missionData.available)) {
        return;
    }

    if (starter(type, options)) {
        this.add(type);
        this.save();
    }
};

MissionManager.prototype.remove = function (mission) {
    mission.beforeRemove();

    var index = this.missions.indexOf(mission);
    if (index === -1) {
        return;
    }

    if (mission.semaphore) {
        // eslint-disable-next-line no-bitwise
        this.semaphoresOnHold |= mission.semaphore;
        setTimeout(function () {
            // release semaphore after short time
            // eslint-disable-next-line no-bitwise
            if (this.semaphoresOnHold & mission.semaphore) {
                this.semaphoresOnHold -= mission.semaphore;
            }
        }.bind(this), cleverapps.parseInterval("1 minute"));
    }

    this.table.resetResults(mission.type);

    this.missions.splice(index, 1);

    var finishDate = mission.oncePerEvent ? mission.eventFinishTime : Date.now();
    this.lastRemoved[mission.type] = finishDate;

    this.updateOldMissions(mission.type, finishDate);
    this.clearChildLastRemoved(mission);

    this.save();

    var icon = cleverapps.sideBar.findMissionIcon(mission.type);
    if (icon) {
        cleverapps.sideBar.removeTemporaryIcon(icon);
    }

    this.refreshOffer(mission);

    if (cleverapps.toolModel) {
        cleverapps.toolModel.refresh();
    }
};

MissionManager.prototype.add = function (type, data, fromServer) {
    var mission = new Mission(type, data, fromServer);
    this.missions.push(mission);

    this.updateOldMissions(type, Date.now());

    if (mission.logic && mission.logic.onAdded) {
        mission.logic.onAdded();
    }

    if (mission.sideBarJson !== false) {
        var icon = new MissionIcon(mission);
        cleverapps.sideBar.addTemporaryIcon(icon);
    }

    this.refreshOffer(mission);
    this.clearChildLastRemoved(mission);

    cleverapps.playSession.set(cleverapps.EVENTS.MISSION_DAU + "_" + mission.getName(), true);

    if (cleverapps.toolModel) {
        cleverapps.toolModel.refresh();
    }

    return mission;
};

MissionManager.prototype.clearChildLastRemoved = function (mission) {
    mission.getChildMissionTypes().forEach(function (childType) {
        delete this.lastRemoved[childType];
    }, this);
};

MissionManager.prototype.refreshOffer = function (mission) {
    cleverapps.offerManager.refreshByMission(mission.type);
};

MissionManager.prototype.isMissionPassed = function (missionType) {
    return Missions[missionType] && Missions[missionType].oneShot && Boolean(this.getLastRemoved(missionType));
};

MissionManager.prototype.getLastRemoved = function (type) {
    var lastRemoved = this.lastRemoved[type];
    if (lastRemoved !== undefined) {
        return lastRemoved;
    }

    var version = Mission.ParseTypeVersion(type);
    if (version) {
        var oldMissions = {};

        this.oldMissions.forEach(function (oldMission) {
            oldMissions[oldMission.type] = oldMission;
        });

        for (version -= 1; version >= 0; --version) {
            var oldMission = oldMissions[Mission.VersionType(type, version)];
            if (oldMission && oldMission.lastRemoved < MissionManager.COMPATIBILITY_DATE) {
                return oldMission.lastRemoved;
            }
        }
    }
    return 0;
};

MissionManager.prototype.updateOldMissions = function (type, date) {
    for (var version = Mission.ParseTypeVersion(type) - 1; version >= 0; --version) {
        this.pushToOldMission({
            type: Mission.VersionType(type, version),
            lastRemoved: MissionManager.COMPATIBILITY_DATE + date
        });
    }
};

MissionManager.prototype.getUnfinishedOldMission = function () {
    return this.oldMissions.find(function (mission) {
        return mission.lastRemoved === undefined;
    });
};

MissionManager.prototype.replaceOldMission = function () {
    var oldMission = this.getUnfinishedOldMission();
    if (!oldMission) {
        return;
    }

    var newType = Mission.OLD_VERSIONS[oldMission.type];
    if (newType === undefined) { // parent mission has new version
        this.oldMissions = this.oldMissions.filter(function (mission) {
            return mission !== oldMission;
        });
        this.save();
        return;
    }

    var newMission = this.findByType(newType);
    if (newMission || this.lastRemoved[newType]) {
        this.updateOldMissions(newType, Date.now());
        this.save();
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.MISSION_REPLACED_REMOVED + oldMission.type + "-" + newType);
        return;
    }

    if (!this.isAvailableByType(newType)) {
        this.updateOldMissions(newType, Date.now());
        this.save();
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.MISSION_REPLACED_UNAVAILABLE + oldMission.type + "-" + newType);
        return;
    }

    if (this.isPastEventMission(newType, oldMission.started)) {
        this.updateOldMissions(newType, Date.now());
        this.save();
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.MISSION_REPLACED_PAST + oldMission.type + "-" + newType);
        return;
    }

    cleverapps.meta.display({
        focus: "replaceOldMission" + oldMission.type,
        actions: [
            function (f) {
                new ReplaceOldMissionWindow(newType);
                cleverapps.meta.onceNoWindowsListener = f;
            },

            function (f) {
                this.planMission(newType);
                this.run();

                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.MISSION_REPLACED + oldMission.type + "-" + newType);

                f();

                newMission = this.findByType(newType);

                if (this.hasPendingStartWindow(newMission)) {
                    this.showStartWindow(newMission);
                }
            }.bind(this)
        ]
    });
};

MissionManager.COMPATIBILITY_DATE = 4102444800000; // 01.01.2100
