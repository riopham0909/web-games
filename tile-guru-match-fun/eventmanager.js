/**
 * Created by iamso on 03.05.19.
 */

cleverapps.Event = function (data) {
    this.features = data.features || [];
    this.options = data.options || {};
    this.projects = data.projects;
    this.networks = data.networks;

    this.start = this.convertTimezone(data.start);
    this.finish = this.convertTimezone(data.finish);
    this.toolApplicable = data.toolApplicable;
};

cleverapps.Event.prototype.convertTimezone = function (utcString) {
    var utc = new Date(utcString);
    utc.setMinutes(utc.getMinutes() + utc.getTimezoneOffset());
    return utc;
};

cleverapps.Event.prototype.isRunning = function () {
    return this.start.getTime() <= Date.now() && Date.now() <= this.finish.getTime();
};

cleverapps.Event.prototype.getTimeBeforeStart = function () {
    return Math.max(0, this.start.getTime() - Date.now());
};

cleverapps.Event.prototype.getTimeAfterFinish = function () {
    return Math.max(0, Date.now() - this.finish.getTime());
};

cleverapps.Event.prototype.getTimeLeft = function () {
    return this.finish.getTime() - Date.now();
};

cleverapps.Event.prototype.getStartTime = function () {
    return this.start.getTime();
};

cleverapps.Event.prototype.isAvailable = function () {
    if (this.networks) {
        if (Array.isArray(this.networks) && !this.networks.includes(cleverapps.platform.source)) {
            return false;
        }
        if (this.networks.except && this.networks.except.includes(cleverapps.platform.source)) {
            return false;
        }
    }

    if (this.projects && this.projects.indexOf(cleverapps.config.name) === -1) {
        return false;
    }

    return true;
};

var EventManager = function () {
    this.currentFeatures = {};
    this.events = [];

    if (bundles.main.jsons.friday_schedule) {
        this.events = cc.loader.getRes(bundles.main.jsons.friday_schedule).filter(function (eventData) {
            return !eventData.debug || cleverapps.config.debugMode;
        }).map(function (eventData) {
            return new cleverapps.Event(eventData);
        });
    }

    this.setCurrentFeatures();
};

EventManager.prototype.isActive = function (feature) {
    return this.currentFeatures[feature] && this.currentFeatures[feature].isRunning();
};

EventManager.prototype.listCurrentFeatures = function () {
    return Object.keys(this.currentFeatures).filter(function (feature) {
        return this.currentFeatures[feature].isRunning();
    }, this);
};

EventManager.prototype.getFeatureEvent = function (feature) {
    return this.currentFeatures[feature];
};

EventManager.prototype.isEventApplicable = function (event) {
    if (cleverapps.config.debugMode && event.toolApplicable !== undefined) {
        return event.toolApplicable;
    }

    return event.isRunning() && event.isAvailable();
};

EventManager.prototype.setCurrentFeatures = function () {
    var candidates = this.events.filter(this.isEventApplicable.bind(this));

    this.currentFeatures = {};

    candidates.forEach(function (event) {
        event.features.forEach(function (feature) {
            this.currentFeatures[feature] = event;
        }.bind(this));
    }, this);
};

EventManager.prototype.listFeatureEvents = function (feature) {
    return this.events.filter(function (event) {
        return event.features.includes(feature) && event.isAvailable();
    });
};

EventManager.prototype.getNextFeatureEvent = function (feature) {
    var candidates = this.listFeatureEvents(feature).filter(function (event) {
        return event.getTimeBeforeStart() > 0;
    }).sort(function (a, b) {
        return a.getTimeBeforeStart() - b.getTimeBeforeStart();
    });

    return candidates[0];
};

EventManager.prototype.getLastFeatureEvent = function (feature) {
    var candidates = this.listFeatureEvents(feature).filter(function (event) {
        return event.getTimeAfterFinish() > 0;
    }).sort(function (a, b) {
        return a.getTimeAfterFinish() - b.getTimeAfterFinish();
    });

    return candidates[0];
};

EventManager.prototype.setCustomFeature = function (feature, duration) {
    var newEvent = {
        features: [feature],
        start: undefined,
        finish: undefined
    };

    var date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    date.setSeconds(date.getSeconds() - 1);
    newEvent.start = date.toISOString();

    date.setMilliseconds(date.getMilliseconds() + duration);
    newEvent.finish = date.toISOString();

    var events = this.events.filter(function (event) {
        return event.features.indexOf(feature) !== -1;
    });

    if (!events.length) {
        this.events.push(new cleverapps.Event(newEvent));
    } else {
        events.forEach(function (event) {
            event.start = event.convertTimezone(newEvent.start);
            event.finish = event.convertTimezone(newEvent.finish);
        });
    }

    this.setCurrentFeatures();
};
