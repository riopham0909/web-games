/**
 * Created by vladislav on 09.08.2022
 */

var TravelBook = function () {
    this.pages = [new ExpeditionPage(TravelBook.PAGES[0])];

    this.currentPage = this.pages[0];

    if (cleverapps.config.lives || cleverapps.config.energy) {
        CustomSyncers.SLOTS.forEach(function (slot) {
            cleverapps.livesBySlots[slot].onFullListener = this.onLivesFull.bind(this, slot);
        }, this);
    }
};

TravelBook.prototype.init = function () {
    var pages = TravelBook.PAGES.slice(1).filter(function (page) {
        return cleverapps.user.checkAvailable(page.available, { ignoreProgress: true }) && (!page.missionType || cleverapps.missionManager.canCreateType(page.missionType));
    }).map(function (page) {
        return new ExpeditionPage(page);
    });

    var main = this.pages.find(function (page) {
        return page.isMain();
    });

    this.pages = [main].concat(pages);

    this.updatePages();

    this.currentPage = main;
};

TravelBook.prototype.listDisplayedPages = function () {
    this.pages.forEach(function (page) {
        page.updateState();
    });

    var pages = this.pages.filter(function (page) {
        return page.isActive();
    });

    if (pages.length < TravelBook.DISPLAYED_PAGES) {
        pages = pages.concat(this.listUpcoming().slice(0, TravelBook.DISPLAYED_PAGES - pages.length));
    }

    return pages;
};

TravelBook.prototype.onLivesFull = function (slot) {
    this.pages.filter(function (page) {
        return page.slot === slot;
    }).forEach(function (page) {
        page.planEvent(ExpeditionPage.EVENT_ENERGY, Date.now());
        page.setAttentionEvent(ExpeditionPage.EVENT_ENERGY);
    });
};

TravelBook.prototype.gotoMainScene = function (f) {
    if (cleverapps.config.demoMode) {
        cleverapps.unitsDemoMode.gotoUnitsDemoScene(f);

        return;
    }

    var main = this.pages.find(function (page) {
        return page.isMain();
    });

    main.gotoExpedition(f);
};

TravelBook.prototype.getPageById = function (id) {
    return this.pages.find(function (page) {
        return page.id === id;
    });
};

TravelBook.prototype.setCurrentPage = function (page) {
    this.currentPage = page;
};

TravelBook.prototype.getCurrentPage = function () {
    return this.currentPage;
};

TravelBook.prototype.listAvailablePages = function () {
    return this.pages;
};

TravelBook.prototype.getCurrentExpedition = function () {
    return !this.currentPage.isMain() ? this.currentPage : undefined;
};

TravelBook.prototype.isExpedition = function () {
    return !this.currentPage.isMain();
};

TravelBook.prototype.updatePages = function () {
    this.pages.forEach(function (page) {
        page.updateState();
    });
};

TravelBook.prototype.onUpdateExpedition = function () {
    this.updateBuilt();

    this.currentPage.setNew(false);
};

TravelBook.prototype.onNewExpeditionMission = function (missionType) {
    var newExpedition = this.pages.find(function (page) {
        return page.missionType === missionType;
    });
    this.startNewExpedition(newExpedition);
};

TravelBook.prototype.startNewExpedition = function (newPage) {
    this.pages.filter(function (page) {
        return page.slot === newPage.slot;
    }).forEach(function (page) {
        page.resetEvents();
    });

    newPage.setNew(true);
    newPage.setAttentionEvent(ExpeditionPage.EVENT_START);

    cleverapps.forces.clearForce(Forces.TRAVEL_BOOK.id);
};

TravelBook.prototype.updateBuilt = function () {
    var worker = Game.currentGame.workers.findLeastBusy(Buildable);
    if (worker) {
        var timeReady = Date.now() + worker.getTimeLeft();

        this.currentPage.planEvent(ExpeditionPage.EVENT_BUILT, timeReady);
        this.currentPage.setAttentionEvent(ExpeditionPage.EVENT_BUILT);
    } else {
        this.currentPage.planEvent(ExpeditionPage.EVENT_BUILT, 0);
    }
};

TravelBook.prototype.listUpcoming = function () {
    var activeSlots = this.pages.filter(function (page) {
        return page.isActive();
    }).map(function (page) {
        return page.slot;
    });

    var permanent = this.pages.find(function (page) {
        return page.isUpcoming() && !activeSlots.includes(page.slot) && page.isPermanent();
    });
    var seasonal = this.pages.find(function (page) {
        return page.isUpcoming() && !activeSlots.includes(page.slot) && page.isSeasonal();
    });
    var regular = this.pages.find(function (page) {
        return page.isUpcoming() && !activeSlots.includes(page.slot) && !page.isSeasonal() && !page.isPermanent();
    });

    return [permanent, regular, seasonal].filter(Boolean);
};

TravelBook.prototype.findExpeditionByMission = function (mission) {
    return this.pages.find(function (page) {
        return mission && page.missionType === mission.type;
    });
};

TravelBook.prototype.needsAttention = function () {
    return this.pages.some(function (page) {
        return page.attention;
    });
};

TravelBook.prototype.isChosenForForce = function (page) {
    return this.chosenForForce === page;
};

TravelBook.prototype.chooseForce = function () {
    if (cleverapps.forces.isShown(Forces.TRAVEL_BOOK.id)) {
        return;
    }

    this.chosenForForce = this.pages.filter(function (page) {
        return page.isActive() && page.isNew && (page.missionType === undefined || cleverapps.missionManager.findRunningMission(page.missionType));
    }).sort(function (a, b) {
        return b.getStartTime() - a.getStartTime();
    })[0];
};

TravelBook.DISPLAYED_PAGES = 4;

TravelBook.AVAILABLE = {
    level: 6
};
