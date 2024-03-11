/**
 * Created by spepa on 10.04.2023
 */

var Achievements = function () {
    this.tasks = [];
    this.load();

    cleverapps.eventBus.on("taskEvent", this.onTaskEvent.bind(this));
    cleverapps.eventBus.on("gameEvent", this.onGameEvent.bind(this));
    cleverapps.eventBus.on("unitAvailable", function (unit) {
        this.onGameEvent(Merge.OPEN_UNIT, { unit: unit });
    }.bind(this), this);
};

Achievements.prototype.load = function (serverData) {
    var value = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ACHIEVEMENTS) || 0;
    if (serverData !== undefined) {
        value = serverData;
    }
    var completed = cleverapps.fromBit(value);

    this.wantsPastCheck = true;
    this.tasks = AchievementsConfig.map(function (config, ind) {
        return new Achievement(config, completed.includes(ind));
    });
};

Achievements.prototype.getInfo = function () {
    var completed = [];
    this.tasks.forEach(function (task, ind) {
        if (task.isComplete()) {
            completed.push(ind);
        }
    });
    return cleverapps.toBit(completed);
};

Achievements.prototype.save = function (updateServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.ACHIEVEMENTS, this.getInfo());

    if (updateServer !== false) {
        cleverapps.synchronizer.addUpdateTask("achievements");
    }
};

Achievements.prototype.listCompleted = function () {
    return this.tasks.filter(function (task) {
        return task.isComplete();
    });
};

Achievements.prototype.listTasks = function () {
    return this.tasks;
};

Achievements.prototype.checkPastFeats = function () {
    this.wantsPastCheck = false;

    if (cleverapps.config.type === "match3") {
        this.onTaskEvent(DailyTasks.PASS_LEVEL);
        this.onTaskEvent(DailyTasks.UPGRADE_HERO);
    } else if (cleverapps.config.type === "merge") {
        this.onTaskEvent(DailyTasks.LEVEL_UP);
        this.onGameEvent(Merge.OPEN_UNIT);
    }
};

Achievements.prototype.onGameEvent = function (type, options) {
    this.tasks.forEach(function (task) {
        if (task.type === type) {
            switch (type) {
                case Merge.MERGE:
                    if (task.config.amount <= options.affected.length) {
                        task.complete();
                    }
                    break;
                case Merge.OPEN_UNIT:
                    if (cleverapps.unitsLibrary.isOpened(task.config.unit)) {
                        task.complete();
                    }
                    break;
                case Merge.BUILD:
                    if (task.config.castle && options.affected.isCastle()) {
                        task.complete();
                    }
                    break;
                default:
                    task.complete();
                    break;
            }
        }
    });
};

Achievements.prototype.onTaskEvent = function (type) {
    this.tasks.forEach(function (task) {
        if (task.type === type) {
            switch (type) {
                case DailyTasks.PASS_LEVEL:
                    if (cleverapps.user.getHumanReadableNumber() >= task.config.level) {
                        task.complete();
                    }
                    break;
                case DailyTasks.LEVEL_UP:
                    if (task.config.level <= cleverapps.user.level) {
                        task.complete();
                    }
                    break;
                case DailyTasks.UPGRADE_HERO:
                    if (task.config.allOpen) {
                        if (Heroes.AVAILABLE_HEROES.every(function (color) {
                            return match3.heroes.getLevel(color) >= 1;
                        })) {
                            task.complete();
                        }
                    } else if (match3.heroes.getLevel(task.config.hero.color) >= task.config.hero.level) {
                        task.complete();
                    }
                    break;
                default:
                    task.complete();
                    break;
            }
        }
    });
};
