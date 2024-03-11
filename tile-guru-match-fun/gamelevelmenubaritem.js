/**
 * Created by Andrey Popov on 07.06.2021
 */

var GameLevelMenuBarItem = function (config) {
    MenuBarItem.call(this, config);

    this.onChangeLevelNo = function () {};
    this.onChangeExpProgress = function () {};
};

GameLevelMenuBarItem.prototype = Object.create(MenuBarItem.prototype);
GameLevelMenuBarItem.prototype.constructor = GameLevelMenuBarItem;

GameLevelMenuBarItem.prototype.customInit = function () {
    cleverapps.gameLevel.on("changeLevel", function () {
        this.onChangeLevelNo();
    }.bind(this), this);
    cleverapps.exp.on("changeExp", function () {
        this.onChangeExpProgress();
    }.bind(this), this);

    if (cleverapps.gameLevel.withOwnLevel) {
        this.worldTitle = "TravelBook.title." + cleverapps.travelBook.getCurrentPage().id;
    } else {
        delete this.worldTitle;
    }
};

GameLevelMenuBarItem.prototype.debugAction = function () {
    Game.currentGame.addReward("exp", cleverapps.gameLevel.nextLevelThreshold());
};

GameLevelMenuBarItem.prototype.getCurrentValue = function () {
    return {
        level: cleverapps.gameLevel.getLevel(),
        amount: cleverapps.exp.getExp(),
        total: cleverapps.gameLevel.nextLevelThreshold()
    };
};