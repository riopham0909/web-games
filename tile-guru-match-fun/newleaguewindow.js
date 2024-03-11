/**
 * Created by vtbelo on 12.04.18.
 */

var NewLeagueWindow = Window.extend({
    onWindowLoaded: function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.NEW_LEAGUE);

        var styles = cleverapps.styles.NewLeagueWindow;

        var text = this.createText();

        var content = new cc.Node();
        content.setAnchorPoint2();
        content.setContentSize2(styles);
        content.addChild(text);
        text.setPositionRound(content.width / 2, content.height / 2);

        this._super({
            title: "NewLeagueWindow.Title",
            name: "newleaguewindow",
            content: content,
            closeButton: false,
            fireworks: true,
            button: {
                width: styles.button.width,
                height: styles.button.height,
                text: "OK",
                onClicked: this.close.bind(this)
            }
        });
    },

    getPerson: function () {
        return {
            role: "hero",
            emotion: "happy"
        };
    },

    createText: function () {
        var styles = cleverapps.styles.NewLeagueWindow;

        var league = levels.user.league;

        var text = cleverapps.UI.generateOnlyText("NewLeagueWindow.text", cleverapps.styles.FONTS.WINDOW_TEXT, {
            league: Messages.get("League" + league)
        });
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.width, 0);
        text.fitTo(undefined, styles.height);

        return text;
    }
});

var NewLeagueWindowAction = function (f) {
    if (!levels.user.isLeagueChanged || cleverapps.flags.norest || this.game.outcome !== GameBase.OUTCOME_VICTORY) {
        f();
        return;
    }

    delete levels.user.isLeagueChanged;

    cleverapps.meta.compound(f, [
        function (f) {
            new NewLeagueWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        },

        function (f) {
            new LeadersWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    ]);
};

cleverapps.styles.NewLeagueWindow = {
    width: 550,
    height: 500,

    button: {
        width: 280,
        height: 110
    }
};
