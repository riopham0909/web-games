/**
 * Created by vladislav on 21.02.2022
 */

cleverapps.ListBreaks = function () {
    var lantern = Lantern.Get();

    var boosterIcons = [bundles.game.frames.cellbooster_small_png, bundles.game.frames.linebooster_small_png, bundles.game.frames.colorbooster_small_png];

    var secondaryMission = Game.currentGame.secondaryMission;

    return [
        {
            text: "AddMovesWindow.booster",
            amount: 1,
            isActive: Game.currentGame.rewards.boosters,
            icon: Game.currentGame.rewards.boosters && boosterIcons[Object.keys(Game.currentGame.rewards.boosters)[0]]
        },
        {
            text: "AddMovesWindow.mission." + (secondaryMission && secondaryMission.getName()),
            amount: Game.currentGame.rewards.clover,
            isActive: secondaryMission && secondaryMission.isRunning() && Game.currentGame.rewards.clover > 0,
            icon: secondaryMission && secondaryMission.getIcon()
        },
        {
            text: "AddMovesWindow.lantern",
            amount: lantern && lantern.isActive(Game.currentGame.level) && lantern.getCurrentStreak(),
            isActive: lantern && lantern.isActive(Game.currentGame.level) && lantern.getCurrentStreak() > 0,
            icon: bundles.game.frames.lantern_streak_icon
        },
        {
            text: "AddMovesWindow.collectedGold",
            amount: Game.currentGame.rewards[GameBase.REWARD_HARD],
            isActive: !["board"].includes(cleverapps.config.type) && Game.currentGame.rewards[GameBase.REWARD_HARD] && Game.currentGame.rewards[GameBase.REWARD_HARD] > 0,
            icon: bundles.game.frames.collected_gold_png
        }
    ].filter(function (data) {
        return data.isActive;
    });
};