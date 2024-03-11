/**
 * Created by Denis Kuzin on 04 october 2022
 */

var TravelBookHint = function () {
    this.nextTime = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.TRAVEL_BOOK_HINT_TIME) || 0;

    this.onShowHint = function () {};
    this.onHideHint = function () {};
};

TravelBookHint.prototype.canShow = function () {
    return !cleverapps.meta.isFocused() && cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition()
        && Game.currentGame && !Game.currentGame.stopped && Game.currentGame.showUpFinished;
};

TravelBookHint.prototype.check = function () {
    if (Date.now() < this.nextTime || !this.canShow() || this.running) {
        return;
    }

    var mission = cleverapps.travelBook.pages.map(function (page) {
        return page.missionType && cleverapps.missionManager.findByType(page.missionType);
    }).filter(function (mission) {
        return mission;
    }).sort(function (m1, m2) {
        return m1.getTimeLeft() - m2.getTimeLeft();
    })[0];

    if (mission) {
        this.checkMission(mission);
    }
};

TravelBookHint.prototype.checkMission = function (mission) {
    var page = cleverapps.travelBook.findExpeditionByMission(mission);

    if (!page || !this.canShow()) {
        return;
    }

    var message;
    var remaining = Math.ceil(mission.getTimeLeft() / cleverapps.parseInterval("1 day"));

    if (mission.isCompleted()) {
        message = Messages.get("ExpeditionProgressHint.completed", { name: page.title });
        
        if (page.isUpcoming()) {
            cleverapps.throwAsync("completed mission with upcoming page " + (mission && mission.type) + " " + page.id + " " + page.missionType);
        }
    } else if (mission.isRunning() && remaining <= 3) {
        message = Messages.get("ExpeditionProgressHint.remaining", { name: page.title, remaining: remaining });
    }

    if (!message) {
        return;
    }

    this.hideHint();

    this.running = true;
    this.onShowHint(message);

    Game.currentGame.counter.setTimeout(this.hideHint.bind(this), TravelBookHint.DURATION);
    this.setNextTime(Date.now() + TravelBookHint.TIMEOUT);
};

TravelBookHint.prototype.hideHint = function () {
    this.onHideHint();
    this.running = false;
};

TravelBookHint.prototype.setNextTime = function (nextTime) {
    this.nextTime = nextTime;
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.TRAVEL_BOOK_HINT_TIME, nextTime);
};

TravelBookHint.DURATION = 4000;
TravelBookHint.TIMEOUT = cleverapps.parseInterval("1 day");