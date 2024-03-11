/**
 * Created by andrey on 04.05.17.
 */

cleverapps.Environment = function () {
    this.episodeNo = levels.user.episode;
    this.levelNo = levels.user.level;

    this.scene = undefined;
};

cleverapps.Environment.prototype.setScene = function (name) {
    this.scene = name;

    if (cleverapps.firebase) {
        cleverapps.firebase.setScreenName(this.getScreen(), this.getScene());
    }
};

cleverapps.Environment.prototype.isDailyCupScene = function () {
    return this.scene === cleverapps.Environment.SCENE_DAILY_CUP;
};

cleverapps.Environment.prototype.isMainScene = function () {
    return this.scene === cleverapps.Environment.SCENE_MAIN;
};

cleverapps.Environment.prototype.isLoaderScene = function () {
    return this.scene === cleverapps.Environment.SCENE_LOADER;
};

cleverapps.Environment.prototype.isHeroesScene = function () {
    return this.scene === cleverapps.Environment.SCENE_HEROES;
};

cleverapps.Environment.prototype.isGameScene = function () {
    return this.scene === cleverapps.Environment.SCENE_GAME;
};

cleverapps.Environment.prototype.isEditorScene = function () {
    return this.scene === cleverapps.Environment.SCENE_EDITOR;
};

cleverapps.Environment.prototype.isChatScene = function () {
    return this.scene === cleverapps.Environment.SCENE_CHAT;
};

cleverapps.Environment.prototype.isMineScene = function () {
    return this.scene === cleverapps.Environment.SCENE_MINE;
};

cleverapps.Environment.prototype.isAdministratorScene = function () {
    return this.scene === cleverapps.Environment.SCENE_ADMINISTRATOR;
};

cleverapps.Environment.prototype.isSceneWithPreview = function () {
    return this.scene === cleverapps.Environment.SCENE_EDITOR || this.scene === cleverapps.Environment.SCENE_ADMINISTRATOR || this.scene === cleverapps.Environment.SCENE_WYSIWYG;
};

cleverapps.Environment.prototype.isWysiwygScene = function () {
    return this.scene === cleverapps.Environment.SCENE_WYSIWYG;
};

cleverapps.Environment.prototype.isAtlasAnalyzerScene = function () {
    return this.scene === cleverapps.Environment.SCENE_ATLAS_ANALYZER;
};

cleverapps.Environment.prototype.isBonusWorldScene = function () {
    return this.scene === cleverapps.Environment.SCENE_BONUS_WORLD;
};

cleverapps.Environment.prototype.isSlotMachineScene = function () {
    return this.scene === cleverapps.Environment.SCENE_SLOT_MACHINE;
};

cleverapps.Environment.prototype.isComicsScene = function () {
    return this.scene === cleverapps.Environment.SCENE_COMICS;
};

cleverapps.Environment.prototype.onOpenWindow = function () {
    if (cleverapps.firebase) {
        cleverapps.firebase.setScreenName(this.getScreen(), this.getScene());
    }
};

cleverapps.Environment.prototype.onCloseWindow = function () {
    if (cleverapps.firebase) {
        cleverapps.firebase.setScreenName(this.getScreen(), this.getScene());
    }
};

cleverapps.Environment.prototype.getActiveWindow = function () {
    var currentWindow = cleverapps.windows && cleverapps.windows.currentWindow();
    if (currentWindow && currentWindow.name) {
        return currentWindow.name;
    }
};

cleverapps.Environment.prototype.getScreen = function () {
    return this.getActiveWindow() || this.getScene();
};

cleverapps.Environment.prototype.getScene = function () {
    return this.scene;
};

cleverapps.Environment.prototype.hasScene = function (scenes) {
    return scenes.indexOf(this.scene) !== -1;
};

cleverapps.Environment.prototype.hasEpisode = function (episodes) {
    return cleverapps.toArray(episodes).indexOf(String(this.episodeNo)) !== -1;
};

cleverapps.Environment.SCENE_LOADER = "loaderScene";
cleverapps.Environment.SCENE_MAIN = "main";
cleverapps.Environment.SCENE_GAME = "game";
cleverapps.Environment.SCENE_EDITOR = "editor";
cleverapps.Environment.SCENE_ADMINISTRATOR = "administrator";
cleverapps.Environment.SCENE_COMICS = "comics";
cleverapps.Environment.SCENE_HEROES = "heroes";
cleverapps.Environment.SCENE_DAILY_CUP = "dailycup";
cleverapps.Environment.SCENE_TRIPEAKS = "tripeaks";
cleverapps.Environment.SCENE_CHAT = "chat";
cleverapps.Environment.SCENE_WYSIWYG = "wysiwyg";
cleverapps.Environment.SCENE_BONUS_WORLD = "bonusworld";
cleverapps.Environment.SCENE_SLOT_MACHINE = "slotmachine";
cleverapps.Environment.SCENE_MINE = "mine";
cleverapps.Environment.SCENE_ATLAS_ANALYZER = "atlasanalyzer";
