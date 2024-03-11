/**
 * Created by vladislav on 17.09.2020
 */

var Simple = function () {
    cleverapps.EventEmitter.call(this);

    this.stars = 0;
    this.current = 0;

    this.pendingsStars = 0;

    this.bgsAmount = 0;
    while (bundles["simple_background_" + this.bgsAmount] || bundles["simple_background_horizontal_" + this.bgsAmount] || bundles["simple_background_vertical_" + this.bgsAmount]) {
        this.bgsAmount++;
    }

    if (cleverapps.isKnockoutGame()) {
        this.knockoutGame = new KnockoutGame();
    }

    this.load();
};

Simple.prototype = Object.create(cleverapps.EventEmitter.prototype);
Simple.prototype.constructor = Simple;

Simple.prototype.earnStars = function (stars, silent) {
    this.stars += stars;
    if (!silent) {
        this.pendingsStars += stars;
        this.trigger("changeStars");
    }
    this.save();
};

Simple.prototype.getCurrent = function () {
    if (this.isPassedAll()) {
        return this.bgsAmount - 1;
    }
    return this.current;
};

Simple.prototype.isPassedAll = function () {
    return this.current >= this.bgsAmount - 1;
};

Simple.prototype.canMoveNext = function () {
    return this.stars >= this.getRequiredStars() && this.current < this.bgsAmount - 1;
};

Simple.prototype.getIconBundle = function (index) {
    if (index >= this.bgsAmount) {
        return "simple_background_icon_coming_soon";
    }

    return "simple_background_icon_" + index;
};

Simple.prototype.getBackgroundBundle = function (index) {
    return [
        "simple_background_" + index,
        (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? "simple_background_vertical_" : "simple_background_horizontal_") + index,
        "simple_background_" + cleverapps.config.orientation + "_" + index
    ].find(function (bundleName) {
        return bundles[bundleName];
    });
};

Simple.prototype.getBundles = function (index) {
    return [
        this.getBackgroundBundle(index),
        this.getIconBundle(index),
        this.getIconBundle(index + 1)
    ];
};

Simple.prototype.moveNext = function (cb) {
    var bundles = this.getBundles(this.current + 1);
    cleverapps.bundleLoader.loadBundles(bundles);

    cleverapps.meta.compound(cb, [
        function (f) {
            if (this.isForceAvailable()) {
                this.showForce(f);
            } else {
                cleverapps.meta.hideControlsWhileFocused("play_button");
                cleverapps.timeouts.setTimeout(f, 500);
            }
        }.bind(this),
        function (f) {
            if (this.canMoveNext()) {
                this.current++;
                this.stars = 0;
                this.save();
            }
            cleverapps.social.markAchievement({});
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SIMPLE_METHA_BACKGROUND);

            new BackgroundsWindow({ moveNext: true });
            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this),
        function (f) {
            new RewardWindow(Simple.CalcReward());
            cleverapps.meta.onceNoWindowsListener = f;
        },
        function (f) {
            cleverapps.meta.hideAllControls();
            cleverapps.aims.whenAllHidden(f);
        },
        function (f) {
            cleverapps.scenes.replaceScene(new SimpleMainScene(), f);
            cleverapps.bundleLoader.deleteBundles(bundles);
        }
    ]);
};

Simple.prototype.updateProgress = function (f) {
    this.trigger("updateProgress", this.pendingsStars);

    if (f) {
        setTimeout(f, this.pendingsStars * 1000 + 1300);
    }

    this.pendingsStars = 0;
};

Simple.prototype.amountLevelStars = function (level) {
    if (cleverapps.highscore) {
        return Game.currentGame.isSuccessfull() ? 3 : 1;
    }

    if (level.isHard()) {
        return 3;
    }
    if (level.isTricky()) {
        return 2;
    }
    return 1;
};

Simple.prototype.getCurrentPercent = function () {
    var total = this.getRequiredStars();
    var percent = this.stars / total * 100;
    return (percent < 100) ? percent : 100;
};

Simple.prototype.getRequiredStars = function (current) {
    current = current !== undefined ? current : this.current;

    var stars = [5, 10, 20, 30, 30, 40, 40, 40, 40, 40].concat(
        [50, 50, 50, 50, 50, 70, 70, 70, 70, 70]
    ).concat(
        [100, 100, 100, 100, 100, 125, 125, 125, 125, 125]
    ).concat(
        [150, 150, 150, 150, 150, 175, 175, 175, 175, 175]
    ).concat(
        [200, 200, 200, 200, 200, 225, 225, 225, 225, 225]
    );

    if (current < stars.length) {
        return stars[current];
    }

    return stars[stars.length - 1];
};

Simple.prototype.isForceAvailable = function () {
    return cleverapps.user.episode === 0 && !cleverapps.forces.isShown(Forces.SIMPLE.id);
};

Simple.prototype.showForce = function (f) {
    this.trigger("showForce");
    cleverapps.forces.onceForceClosed = f;
};

Simple.prototype.gamePlayed = function (outcome, game) {
    if (outcome === GameBase.OUTCOME_VICTORY) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.METHA_LEVEL);
        cleverapps.playSession.set(cleverapps.EVENTS.METHA_LEVEL, true);
    }
    if (cleverapps.highscore) {
        cleverapps.highscore.gamePlayed(outcome, game);
    }
};

Simple.prototype.updateInfo = function (serverData) {
    this.updateData(serverData);
    this.save(true);

    if (cleverapps.highscore) {
        cleverapps.highscore.updateInfo(serverData);
        cleverapps.highscore.save(true);
    }
};

Simple.prototype.getData = function () {
    var data = {
        stars: this.stars,
        current: this.current
    };

    if (this.knockoutGame) {
        data.knockoutLevel = this.knockoutGame.getLevel();
    }

    return data;
};

Simple.prototype.getInfo = function () {
    var data = this.getData();

    if (cleverapps.highscore) {
        Object.assign(data, cleverapps.highscore.getInfo());
    }

    return data;
};

if (cleverapps.config.debugMode) {
    Simple.prototype.reset = function () {
        this.stars = 0;
        this.current = 0;

        if (this.knockoutGame) {
            this.knockoutGame.reset();
        }

        this.save();
    };
}

Simple.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SIMPLE, this.getData());
    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("metha");
    }

    if (this.knockoutGame) {
        this.knockoutGame.load();
    }
};

Simple.prototype.load = function () {
    if (this.knockoutGame) {
        this.knockoutGame.load();
    }

    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SIMPLE);
    this.updateData(data);
};

Simple.prototype.updateData = function (data) {
    data = data || {};

    this.stars = data.stars || 0;
    this.current = data.current || 0;

    if (this.knockoutGame) {
        var knockoutLevel;

        if (data.knockoutLevel !== undefined) {
            knockoutLevel = data.knockoutLevel;
        } else if (data.cups !== undefined) {
            knockoutLevel = data.cups;
        } else {
            knockoutLevel = cleverapps.user.getVirtualProgress();
        }

        this.knockoutGame.setLevel(knockoutLevel);
    }
};

Simple.CalcReward = function () {
    var reward = cleverapps.config.soft ? { soft: 50 } : { hard: 50 };
    reward.boosters = {};

    var found = 0;
    var boosters = cleverapps.boosters.listBoostersBefore();
    if (cleverapps.config.name === "differences") {
        boosters = cleverapps.boosters.listBoosters();
    }

    boosters.forEach(function (booster) {
        if (found < 3 && booster.isAvailable()) {
            reward.boosters[booster.id] = 1;
            found++;
        }
    });

    return reward;
};