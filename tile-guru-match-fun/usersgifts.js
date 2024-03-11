/**
 * Created by andrey on 10.02.2023.
 */

cleverapps.giveUsersGifts = function () {
    if (cleverapps.config.name === "tripeaks"
        && cleverapps.platform.oneOf(Mobage, SPMobage)
        && ["mbga.jp:63100202", "sb.mbga.jp:63100202"].includes(cleverapps.platform.getUserID())
        && cleverapps.user.getHumanReadableNumber() < 1000) {
        cleverapps.user.episode = Math.floor(999 / 15);
        cleverapps.user.level = 999 % 15;
        cleverapps.user.gold += 50000;
        cleverapps.user.save();

        cleverapps.boosters.add(cleverapps.Boosters.TYPE_MAGNET, 20);
        cleverapps.boosters.add(cleverapps.Boosters.TYPE_DICE, 20);
        cleverapps.boosters.add(cleverapps.Boosters.TYPE_JOKERS, 20);

        cleverapps.unlimitedLives.buy("240 hours");
    }
};