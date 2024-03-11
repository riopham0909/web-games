/**
 * Created by andrey on 11.02.2021.
 */

var QuestsSideBarIcon = function () {
    SideBarIcon.call(this, {
        animation: bundles.sidebar.jsons.quests_icon_json,
        targets: "quests",
        control: "QuestsSideBarIcon"
    });
};

QuestsSideBarIcon.prototype = Object.create(SideBarIcon.prototype);
QuestsSideBarIcon.prototype.constructor = QuestsSideBarIcon;

QuestsSideBarIcon.prototype.onPressed = function () {
    cleverapps.meta.display({
        focus: "QuestsIconClicked",
        action: function (f) {
            new QuestsWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

QuestsSideBarIcon.prototype.resetState = function () {
    this.available = Game.currentGame && Game.currentGame.quests && Game.currentGame.quests.getSelectedQuest()
        && Game.currentGame.quests.config && !cleverapps.config.editorMode;
};

QuestsSideBarIcon.prototype.getForce = function () {
    var available = Game.currentGame && Game.currentGame.quests && Game.currentGame.quests.count() > 4;
    if (available) {
        return Forces.QUEST_ICON;
    }
};
