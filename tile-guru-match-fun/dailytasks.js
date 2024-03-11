/**
 * Created by andrey on 23.04.18.
 */

var DailyTasks = function () {
    this.onChangeStateListener = function () {};
    this.onTaskSwappedOut = function () {};

    this.tasks = [];
    this.whenStart = -1;

    if (!this.isAvailable()) {
        this.save();
    } else {
        this.load();
    }

    cleverapps.whenAllInitialized(this.update.bind(this));
    cleverapps.user.on("incLevel", this.update.bind(this));

    cleverapps.eventBus.on("gameEvent", this.onGameEvent.bind(this));
    cleverapps.eventBus.on("taskEvent", this.onTaskEvent.bind(this));
};

DailyTasks.prototype.getInfo = function () {
    return {
        whenStart: this.whenStart,
        tasks: this.tasks.map(function (task) {
            return task.getSaveInfo();
        })
    };
};

DailyTasks.prototype.load = function (serverData) {
    if (!this.isAvailable()) {
        this.tasks = [];
        this.whenStart = -1;
        return;
    }

    var data = serverData || cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.DAILY_TASKS) || {};
    this.tasks = [];
    this.whenStart = data.whenStart !== undefined ? data.whenStart : -1;

    if (this.whenStart > this.getStartTime()) {
        this.whenStart = this.getStartTime();
    }

    var SHOULD_HAVE = 6;
    if (data.tasks && data.tasks.length === SHOULD_HAVE && data.tasks.every(function (taskData) {
        return DailyTasks.CONFIG[taskData.type];
    })) {
        this.tasks = data.tasks.map(function (taskData, slot) {
            var task = new DailyTask();
            task.load(taskData, slot);
            return task;
        });
    } else {
        this.whenStart = -1;
    }
};

DailyTasks.prototype.save = function (updateServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.DAILY_TASKS, this.getInfo());

    if (updateServer !== false) {
        cleverapps.synchronizer.addUpdateTask("dailytasks");
    }
};

DailyTasks.prototype.collect = function (task) {
    if (task.collected) {
        return;
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DAILY_TASK_REWARD + (task.difficulty || 3));
    cleverapps.playSession.inc(cleverapps.EVENTS.SESSION_DAILY_TASK_REWARD);

    task.collect();
    cleverapps.social.sendActivity(cleverapps.Social.ACTIVITY.DAILY_TASK, {
        userName: cleverapps.friends.getPlayer().name
    });
};

DailyTasks.prototype.collectLastTask = function () {
    var lastTask = cleverapps.dailyTasks.getCompleteAllTask();
    if (lastTask.progress === lastTask.goal && !lastTask.collected && cleverapps.dailyTasks.getNotCollectedTasks().length === 1) {
        lastTask.givePrize();
    }
};

DailyTasks.prototype.pick5Pack = function () {
    var easy = cleverapps.Random.chooseAmount(this.listTaskByDifficulty(DailyTask.EASY).slice(), 2);
    var medium = cleverapps.Random.chooseAmount(this.listTaskByDifficulty(DailyTask.MEDIUM).slice(), 2);
    var hard = cleverapps.Random.chooseAmount(this.listTaskByDifficulty(DailyTask.HARD).slice(), 1);

    var res = easy.concat(medium).concat(hard);
    res.push(DailyTask.CreateCompleteAll());

    return res.map(function (config) {
        return new DailyTask.Create(config);
    });
};

if (cleverapps.config.debugMode) {
    DailyTasks.GuessName = function (id) {
        return Object.keys(DailyTasks).find(function (name) {
            return DailyTasks[name] === id;
        });
    };
}

DailyTasks.prototype.listTaskByDifficulty = function (difficulty) {
    if (!this._generatedTasks) {
        this._generatedTasks = this.generateAllTasks();
    }

    return this._generatedTasks[difficulty];
};

DailyTasks.prototype.generateAllTasks = function () {
    var doNotCreate = [DailyTasks.COMPLETE_ALL];

    var res = [[], [], []];

    Object.keys(DailyTasks.CONFIG).forEach(function (type) {
        var id = +type;

        if (doNotCreate.indexOf(id) !== -1) {
            return false;
        }

        var config = DailyTasks.CONFIG[id].generate();

        if (config === undefined) {
            return;
        }

        if (!Array.isArray(config)) {
            config = [config];
        }

        config.forEach(function (config) {
            config.type = id;
            res[config.difficulty].push(config);
        });
    });

    return res;
};

DailyTasks.prototype.getStartTime = function () {
    var date = new Date();
    var timezone = date.getTimezoneOffset() * 1000 * 60;
    return date.getTime() - (date.getTime() - timezone) % DailyTasks.INTERVAL;
};

DailyTasks.prototype.startNewTasks = function () {
    this.tasks = this.pick5Pack();
    this.whenStart = this.getStartTime();
    this.save();

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DAILY_TASKS_START);
};

DailyTasks.prototype.getNotCollectedTasks = function () {
    return this.tasks.filter(function (task) {
        return task.isFinished() && !task.collected;
    });
};

DailyTasks.prototype.isAllTasksFinished = function () {
    return cleverapps.dailyTasks.getActiveTasks().length === 0;
};

DailyTasks.prototype.getActiveTasks = function () {
    return this.tasks.filter(function (task) {
        return !task.isFinished();
    });
};

DailyTasks.prototype.getFinishedTasks = function () {
    return this.tasks.filter(function (task) {
        return task.isFinished();
    });
};

DailyTasks.prototype.swapOutTask = function (taskToSwap, suggested) {
    var targetSlot = this.tasks.indexOf(taskToSwap);

    if (!suggested) {
        var configs = this.listTaskByDifficulty(taskToSwap.difficulty);

        var currentTasks = this.tasks.map(function (task) {
            return task.type;
        });

        var candidates = configs.filter(function (config) {
            return currentTasks.indexOf(config.type) === -1;
        });

        suggested = cleverapps.Random.choose(candidates);
    }

    this.tasks[targetSlot] = new DailyTask.Create(suggested);
    this.onTaskSwappedOut(targetSlot);
    this.save();
};

DailyTasks.prototype.addProgress = function (type, amount, options) {
    var tasks = this.getActiveTasks().filter(function (activeTask) {
        return activeTask.type === type;
    });
    if (tasks.length === 0) {
        return;
    }
    if (type === DailyTasks.SPEND_HARD) {
        tasks = [tasks[0]];
    }
    tasks.forEach(function (task) {
        task.addProgress(amount, options);
    });
};

DailyTasks.prototype.getTimeLeft = function () {
    var duration = DailyTasks.INTERVAL;
    return Math.max(0, this.whenStart + duration - Date.now());
};

DailyTasks.prototype.isAvailable = function (options) {
    return levels.user.checkAvailable(cleverapps.Availables.DAILY_TASKS, options);
};

DailyTasks.prototype.update = function () {
    clearTimeout(this.finishTimeout);

    if (!this.isAvailable()) {
        return;
    }

    if (this.getTimeLeft() === 0) {
        this._generatedTasks = undefined;
        this.startNewTasks();
    }

    this.finishTimeout = new cleverapps.LongTimeout(this.update.bind(this), this.getTimeLeft());

    this.onChangeStateListener();
};

DailyTasks.prototype.getTasks = function () {
    return this.tasks;
};

DailyTasks.prototype.processDiscoverWord = function (word) {
    cleverapps.unique(word.split("")).forEach(function (letter) {
        cleverapps.dailyTasks.addProgress(DailyTasks.GUESS_WORDS_WITH_LETTER, 1, { letter: letter });
    });

    if (word.length >= 7) {
        cleverapps.dailyTasks.addProgress(DailyTasks.GUESS_LONG_WORDS, 1);
    }
};

DailyTasks.prototype.processOpenCard = function (playedCard) {
    if (cleverapps.config.type === "solitaire") {
        this.addProgress(DailyTasks.COLLECT_CARDS_BY_VALUE, 1, {
            cardValue: playedCard.getRank()
        });

        this.addProgress(DailyTasks.COLLECT_CARDS_BY_SUIT, 1, {
            cardSuit: playedCard.getSuit()
        });
    }
};

DailyTasks.prototype.getCompleteAllTask = function () {
    return this.getTasks().filter(function (task) {
        return task.type === DailyTasks.COMPLETE_ALL;
    })[0];
};

DailyTasks.prototype.taskWasFinished = function (task) {
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DAILY_TASK_FINISH_AMOUNT + this.getFinishedTasks().length);

    if (task.type !== DailyTasks.COMPLETE_ALL) {
        this.addProgress(DailyTasks.COMPLETE_ALL);
    }

    this.preparePush();
    this.onChangeStateListener();
};

DailyTasks.prototype.preparePush = function () {
    if (this.getFinishedTasks().length < 2) {
        return;
    }

    var timeout;
    if (this.getActiveTasks().length > 0 && this.getTimeLeft() > DailyTasks.PUSH_UNTIL_RESET_TIME) {
        timeout = this.getTimeLeft() - DailyTasks.PUSH_UNTIL_RESET_TIME;
    }

    cleverapps.localPushes.sendPush(cleverapps.LocalPushes.TYPES.DAILY_TASKS_UNCOMPLETED, timeout);
};

DailyTasks.prototype.onTaskEvent = function (type, amount, options) {
    options = typeof amount === "object" ? amount : options;
    amount = typeof amount !== "number" ? 1 : amount;
    cleverapps.dailyTasks.addProgress(type, amount, options);
};

DailyTasks.prototype.onGameEvent = function (type, options) {
    if (cleverapps.config.type === "merge") {
        switch (type) {
            case Merge.MINE:
                var data = options.affected.getData();
                if (data.source && data.mineable) {
                    cleverapps.dailyTasks.addProgress(DailyTasks.DESTROY_ENT);
                }
                break;
            case Merge.COMPLETE_MINING:
                if (options.task.energy) {
                    cleverapps.dailyTasks.addProgress(DailyTasks.USE_WORKER);
                }
                break;
            case Merge.BUILD:
                cleverapps.dailyTasks.addProgress(DailyTasks.USE_WORKER);
                cleverapps.dailyTasks.addProgress(DailyTasks.BUILD);
                break;
            case Merge.MERGE:
                cleverapps.dailyTasks.addProgress(DailyTasks.MERGE, 1, { mergeAmount: options.affected.length });

                if (options.affected.some(function (unit) {
                    return unit.code === "crystal" && unit.isLast();
                })) {
                    cleverapps.dailyTasks.addProgress(DailyTasks.USE_RAINBOW);
                }
                break;
            case Merge.HARVEST:
                if (options.affected.getType() === "fruit") {
                    cleverapps.dailyTasks.addProgress(DailyTasks.HARVEST_FRUITS);
                }
                break;
            case Merge.PRIZE_HARVESTED:
                if (options.affected.getData().chest === true) {
                    cleverapps.dailyTasks.addProgress(DailyTasks.OPEN_CHEST);
                }
                break;
            case Merge.SPAWN:
                var spawnCheck = function (spawned, filter) {
                    if (Array.isArray(options.affected)) {
                        var mergeSource = options.affected.filter(filter);
                        if (mergeSource.length > 0) {
                            return spawned.stage > mergeSource[0].stage;
                        }
                    }
                };

                if (options.unit.getType() === "fruit" && options.unit.stage < 4) {
                    if (!options.affected || (!Array.isArray(options.affected) && ["chest", "fruit", "source"].indexOf(options.affected.getType()) !== -1)) {
                        cleverapps.dailyTasks.addProgress(DailyTasks.GROW_PLANT);
                    }
                } else if (options.unit.getType() === "source") {
                    if (spawnCheck(options.unit, function (unit) {
                        return unit.getType() === "source";
                    })) {
                        cleverapps.dailyTasks.addProgress(DailyTasks.CREATE_SOURCE);
                    }
                } else if (options.unit.code === "wands") {
                    if (spawnCheck(options.unit, function (unit) {
                        return unit.code === "wands";
                    })) {
                        cleverapps.dailyTasks.addProgress(DailyTasks.MERGE_SOLDIERS);
                    }
                }

                break;
            case Merge.OPENFOG:
                cleverapps.dailyTasks.addProgress(DailyTasks.OPEN_FOG);

                break;
        }
    }
};

DailyTasks.INTERVAL = cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minutes" : "1 day");
DailyTasks.PUSH_UNTIL_RESET_TIME = cleverapps.parseInterval("5 hours");