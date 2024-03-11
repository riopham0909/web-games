/**
 * Created by andrey on 05.06.18.
 */

var DailyTask = function () {
    cleverapps.EventEmitter.call(this);

    this.type = undefined;
    this.goal = undefined;
    this.progress = 0;
    this.collected = false;
    this.difficulty = undefined;
    this.data = undefined;
};

DailyTask.prototype = Object.create(cleverapps.EventEmitter.prototype);
DailyTask.prototype.constructor = DailyTask;

DailyTask.prototype.isSwappable = function () {
    var SWAPPABLE_TASKS = [DailyTasks.WATCH_ADS];
    return SWAPPABLE_TASKS.indexOf(this.type) !== -1;
};

DailyTask.CreateCompleteAll = function () {
    var task = new DailyTask();

    task.type = DailyTasks.COMPLETE_ALL;
    task.goal = 5;
    task.icon = "daily_task_icon_complete_all_png";
    task.data = {};

    return task;
};

DailyTask.Create = function (config) {
    var task = new DailyTask();

    task.type = config.type;
    task.goal = config.goal;
    task.difficulty = config.difficulty;

    task.data = {};
    Object.keys(config).forEach(function (key) {
        if (["type", "goal", "difficulty"].indexOf(key) === -1) {
            task.data[key] = config[key];
        }
    });

    return task;
};

DailyTask.prototype.load = function (data, slot) {
    this.type = data.type;
    this.goal = data.goal;
    this.progress = data.progress;
    this.lastProgress = data.lastProgress;
    this.collected = data.collected;
    this.data = data.data || {};

    if (this.data.color && DailyTasks.CELL_COLORS.indexOf(this.data.color) === -1) {
        this.data.color = cleverapps.Random.choose(DailyTasks.CELL_COLORS);
    }
    if (this.data.cardValue && DailyTasks.CARD_VALUES.indexOf(this.data.cardValue) === -1) {
        this.data.cardValue = cleverapps.Random.choose(DailyTasks.CARD_VALUES);
    }

    this.difficulty = this.guessDifficulty(slot);
};

DailyTask.prototype.guessDifficulty = function (slot) {
    if (slot <= 1) {
        return DailyTask.EASY;
    }

    if (slot >= 2 && slot <= 3) {
        return DailyTask.MEDIUM;
    }

    return DailyTask.HARD;
};

DailyTask.prototype.getSaveInfo = function () {
    return {
        type: this.type,
        goal: this.goal,
        progress: this.progress,
        lastProgress: this.lastProgress,
        collected: this.collected,
        data: this.data
    };
};

DailyTask.prototype.addProgress = function (amount, options) {
    options = typeof amount === "object" ? amount : options;
    amount = typeof amount !== "number" ? 1 : amount;

    if (amount > 0) {
        return this.setProgress(this.progress + amount, options);
    }
};

DailyTask.prototype.isApplicable = function (options) {
    switch (this.type) {
        case DailyTasks.COLLECT_COLOR_CELLS:
            return this.data.color === options.color;
        case DailyTasks.GUESS_WORDS_WITH_LETTER:
            return this.data.letter === options.letter;
        case DailyTasks.COLLECT_CARDS_BY_VALUE:
            return this.data.cardValue === options.cardValue;
        case DailyTasks.COLLECT_CARDS_BY_SUIT:
            return this.data.cardSuit === options.cardSuit;
        case DailyTasks.COLLECT_HERO_CELLS:
            return this.data.color === options.color;
        case DailyTasks.MERGE:
            return this.data.mergeAmount <= options.mergeAmount;
    }
    return true;
};

DailyTask.prototype.notifyProgress = function () {
    if (this.progress === this.lastProgress) {
        return;
    }

    if (this.lastProgress === undefined) {
        this.lastProgress = 0;
    }

    var title = this.getTitle();
    cleverapps.notification.create(title.text, {
        toReplace: title.replace,
        image: bundles.notification.frames.icon,
        progress: {
            amount: this.lastProgress,
            newAmount: this.progress,
            total: this.goal
        }
    });

    this.lastProgress = this.progress;
};

DailyTask.prototype.setProgress = function (amount, options) {
    if (!this.isApplicable(options) || this.isFinished()) {
        return;
    }
    amount = typeof amount !== "number" ? 1 : amount;

    if (amount > this.goal) {
        amount = this.goal;
    }

    if (amount !== this.progress) {
        this.progress = amount;

        this.trigger("update");
        this.save();

        if (this.isFinished()) {
            cleverapps.dailyTasks.taskWasFinished(this);
        }

        if (this.type !== DailyTasks.COMPLETE_ALL) {
            setTimeout(this.notifyProgress.bind(this), 0);
        }
    }
};

DailyTask.prototype.isFinished = function () {
    return this.progress >= this.goal;
};

DailyTask.prototype.collect = function () {
    if (this.isFinished() && !this.collected) {
        this.collected = true;
        this.save();

        this.trigger("update");

        cleverapps.dailyTasks.onChangeStateListener();
    }
};

DailyTask.prototype.givePrize = function () {
    if (this.isFinished() && !this.collected) {
        cleverapps.dailyTasks.collect(this);
        RewardWindow.createDailyTaskWindow(this);
    }
};

DailyTask.prototype.save = function () {
    cleverapps.dailyTasks.save();
};

DailyTask.prototype.getTitle = function () {
    var replace = {};

    if (DailyTasks.COLLECT_COLOR_CELLS === this.type) {
        replace.color = Messages.get("ColorCell." + this.data.color + ".Title");
    }

    if (DailyTasks.GUESS_WORDS_WITH_LETTER === this.type && this.data.letter) {
        replace.letter = this.data.letter.toUpperCase();
    }

    if (DailyTasks.COLLECT_HERO_CELLS === this.type) {
        replace.heroes = Messages.get("DailyTask.24." + this.data.color);
    }

    if (DailyTasks.COLLECT_CARDS_BY_VALUE === this.type) {
        var value = parseInt(this.data.cardValue) || this.data.cardValue;

        replace.cards = typeof value === "number" ? value : Messages.get("DailyTask.25." + value);
    }

    if (DailyTasks.COLLECT_CARDS_BY_SUIT === this.type) {
        replace.cards = Messages.get("DailyTask.26." + this.data.cardSuit);
    }

    if (DailyTasks.MERGE === this.type) {
        replace.amount = this.data.mergeAmount;
    }

    if ([DailyTasks.SPEND_HARD, DailyTasks.SPEND_SOFT].indexOf(this.type) !== -1) {
        replace.amount = this.goal;
    }

    var text = "DailyTask." + this.type + ".Title";

    return {
        text: text,
        replace: replace
    };
};

DailyTask.prototype.getIcon = function () {
    if (DailyTasks.GUESS_WORDS_WITH_LETTER === this.type) {
        var char = CharView.Create(this.data.letter, {
            bgImage: bundles.dailytasks.frames.letter_bg_png
        });
        // TODO: fitInBox in icon, rm this
        if (cleverapps.config.name === "scramble") {
            char.setScale(0.8);
        }
        return char;
    }

    var icon = DailyTasks.CONFIG[this.type].icon;

    if (typeof icon === "object") {
        icon = icon[this.data.color || this.data.cardValue || this.data.cardSuit];
    }

    return new cc.Sprite(bundles.dailytasks.frames[icon]);
};

DailyTask.prototype.getReward = function () {
    if (this.data.customReward) {
        return this.data.customReward;
    }

    var reward;

    if (this.type === DailyTasks.COMPLETE_ALL) {
        reward = RewardsConfig.DailyTask.completeAll;
    } else {
        var keys = ["easy", "medium", "hard"];
        reward = RewardsConfig.DailyTask[keys[this.difficulty]];
    }

    reward = cleverapps.Random.choose(reward);

    if (["board", "match3"].indexOf(cleverapps.config.type) !== -1) {
        reward = cleverapps.user.prepareRewardByRich(reward);
    }

    return reward;
};

DailyTask.EASY = 0;
DailyTask.MEDIUM = 1;
DailyTask.HARD = 2;