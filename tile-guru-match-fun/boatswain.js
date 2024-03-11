/**
 * Created by slava on 7/11/17
 */

var Boatswain = function (level) {
    this.level = level;

    this.setIntent(Boatswain.RETURN_INTENT);
};

Boatswain.prototype.setIntent = function (intent) {
    this.intent = intent;
};

Boatswain.prototype.playIntent = function (f) {
    if (this.intent === Boatswain.NEXT_INTENT && !this.canNext()) {
        this.intent = Boatswain.RETURN_INTENT;
    }

    switch (this.intent) {
        case Boatswain.NEXT_INTENT:
            cleverapps.meta.compound(f, [
                function (f) {
                    if (this.level.episode.isDailyCup()) {
                        cleverapps.dailyCup.wantsToPlay(f);
                    } else if (this.level.isCurrentLevel()) {
                        cleverapps.meta.wantsToPlay(f);
                    } else {
                        var next = this.level.nextLevel();
                        cleverapps.meta.wantsToPlay(f, next);
                    }
                }.bind(this),

                function (f) {
                    if (cleverapps.environment.isGameScene() && !Game.currentGame) {
                        cleverapps.Plot.ReturnToMainScene(f, this.level);
                    } else {
                        f();
                    }
                }.bind(this)
            ]);
            break;

        case Boatswain.REPLAY_INTENT:
            cleverapps.meta.compound(f, [
                function (f) {
                    cleverapps.meta.wantsToReplay(f, this.level);
                }.bind(this),

                function (f) {
                    if (cleverapps.environment.isGameScene() && !Game.currentGame) {
                        cleverapps.Plot.ReturnToMainScene(f, this.level);
                    } else {
                        f();
                    }
                }.bind(this)
            ]);
            break;

        case Boatswain.RETURN_INTENT:
            if (this.level.episode.isDailyCup()) {
                cleverapps.scenes.replaceScene(new DailyCupScene(), f);
            } else {
                cleverapps.Plot.ReturnToMainScene(f, this.level);
            }
    }
};

Boatswain.prototype.prepareNext = function () {
    if (!cleverapps.isKnockoutGame()) {
        cleverapps.missionManager.run();
    }
};

Boatswain.prototype.canNext = function () {
    if (typeof match3 !== "undefined" && match3.heroes) {
        var color = match3.heroes.readyToOpen();
        if (color) {
            return false;
        }
    }

    if (this.level.episode.isDailyCup()) {
        return cleverapps.dailyCup.isRunning() && (!cleverapps.dailyCup.withLives() || !cleverapps.lives.isEmpty());
    }

    var canNext = this.level.isRegular() && !cleverapps.isKnockoutGame();
    if (!canNext) {
        return false;
    }

    if (cleverapps.forces.checkMainForces()
        || cleverapps.missionManager.skipNext()
        || cleverapps.missionManager.wantsToShowCompleted()
        || cleverapps.missionManager.pendingStartWindow()) {
        return false;
    }

    switch (cleverapps.meta.getType()) {
        case Metha.FARM:
            if (!cleverapps.farm.isCompleted()) {
                if (cleverapps.farm.getBuilding().getQuest().isCompleted() || cleverapps.farm.justCollectedDialogue) {
                    return false;
                }
            }
            break;
        case Metha.HOMEFIX:
            if (!cleverapps.home.isCompleted()) {
                var furniture = cleverapps.home.getFurnitureToUpgrade();
                if (furniture) {
                    var furnitureCost = furniture.getInfo().cost;
                    if (cleverapps.home.stars >= furnitureCost && cleverapps.home.stars - cleverapps.home.amountLevelStars(this.level) < furnitureCost) {
                        return false;
                    }
                }
            }
            break;
        case Metha.SIMPLE:
            if (cleverapps.simple.canMoveNext()) {
                return false;
            }
            break;
        case Metha.HOSE:
            if (cleverapps.starChest && cleverapps.starChest.stars >= cleverapps.StarChest.GOAL_AMOUNT) {
                return false;
            }

            if (this.level.isCurrentLevel() && (this.level.isLastLevelOnEpisode() || cleverapps.Plot.getDialogueAfterLevel(this.level))) {
                return false;
            }
            break;
    }
    return true;
};

var BoatswainAction = function () {
    cleverapps.meta.distract({
        focus: "boatswain",
        control: this.introControls(),
        action: function (f) {
            this.boatswain.playIntent(f);
        }.bind(this)
    });
};

Boatswain.RETURN_INTENT = 0;
Boatswain.NEXT_INTENT = 1;
Boatswain.REPLAY_INTENT = 2;
