/**
 * Created by andrey on 21.05.2020
 */

var BoostersBeforeComponent = function (boosters) {
    var styles = cleverapps.styles.BoostersBeforeComponent;

    var title = cleverapps.UI.generateOnlyText(
        "BoostersBeforeComponent.Title",
        cleverapps.styles.FONTS.WINDOW_BIG_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT
    );

    var views = boosters.list.map(function (booster) {
        return new BoosterBeforeView(booster, boosters.level);
    });

    var boostersViews = new cleverapps.Layout(views, {
        padding: styles.padding,
        margin: styles.margin,
        direction: cleverapps.UI.HORIZONTAL
    });

    views.forEach(function (view, index) {
        view.showUp(0.2 + index * 0.2);
    });

    var content = new cleverapps.Layout([title, boostersViews], {
        margin: styles.contentMargin,
        direction: cleverapps.UI.VERTICAL
    });

    var hasLantern = boosters.list.some(function (booster) {
        return booster.isLantern();
    });

    var lantern = Lantern.Get();

    if (hasLantern && lantern) {
        var view = new LanternView(lantern, content);
        content.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.CallFunc(function () {
                view.show();
            }),
            new cc.DelayTime(0.2),
            new cc.CallFunc(function () {
                view.replaceParentSamePlace(cleverapps.windows.currentWindow());
                view.setLocalZOrder(20);
            }),
            new cc.DelayTime(0.6),
            new cc.CallFunc(function () {
                view.hide();
            })
        ));
    }

    return content;
};

cleverapps.styles.BoostersBeforeComponent = {
    padding: {
        bottom: 20
    },
    contentMargin: 50,
    margin: 25
};