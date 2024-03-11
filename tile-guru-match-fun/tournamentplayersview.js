/**
 * Created by andrey on 27.02.18.
 */

var TournamentPlayersView = cc.Node.extend({
    ctor: function (competition) {
        this._super();

        this.competition = competition;
        this.players = competition.results;

        this.competition.calcPlace();

        this.views = this.players.map(function (player) {
            return new TournamentPlayerView(player, competition);
        });

        var styles = cleverapps.styles.TournamentPlayersView;

        var layout = this.layout = new cleverapps.Layout(this.views, {
            direction: cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? cleverapps.UI.HORIZONTAL : cleverapps.UI.VERTICAL,
            reversed: cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });

        this.setContentSize2(layout.getContentSize());
        this.addChild(layout);

        this.positions = {};
        this.views.forEach(function (view, index) {
            this.positions[index] = view.getPosition();
        }.bind(this));

        this.createBg();
        this.setAnchorPoint2();
        this.updatePosition();
        this.setLocalZOrder(1);

        competition.onChangeResultsListeners.tournamentPlayers = cleverapps.whenGameActiveListener(this.createListener(cleverapps.timeredThrottle(10, this.onChangeResults.bind(this))));
        this.onChangeResults();

        Game.currentGame.on("stop", this.createListener(this.afterOnChangeOutcome.bind(this)), this);

        this.competition.onAnimateResults = this.createListener(this.animateResults.bind(this));
    },

    updateSize: function () {
        this.layout.setOptions({
            direction: cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? cleverapps.UI.HORIZONTAL : cleverapps.UI.VERTICAL,
            reversed: cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL
        });
        this.layout.reshape();
        this.setContentSize2(this.layout.getContentSize());
        this.setContentSize2(this.layout.getContentSize());
        this.bg.setContentSize2(this.getContentSize());

        this.views.forEach(function (view, index) {
            this.positions[index] = view.getPosition();
        }.bind(this));
    },

    updatePosition: function () {
        var styles = cleverapps.styles.TournamentPlayersView.position;

        this.layout.setPositionRound(this.width / 2, this.height / 2);
        this.setPositionRound(this.width / 2, this.height / 2);
        this.setPositionRound(styles);
        this.bg.setPositionRound(this.width / 2, this.height / 2);
    },

    afterOnChangeOutcome: function () {
        var width = cleverapps.UI.getSceneSize().width;
        var dx = -width / 2 * 0.025;
        this.runAction(
            new cc.MoveBy(1, dx, 0).easing(cc.easeInOut(1.5))
        );
    },

    createBg: function () {
        var bg = this.bg = new cc.Scale9Sprite(bundles.tournament.frames.tournament_bg_png);
        this.addChild(bg);
        bg.setLocalZOrder(-1);
        bg.setContentSize2(this.getContentSize());
    },

    onChangeResults: function () {
        this.competition.calcPlace();

        this.views.sort(function (v1, v2) {
            var idx1 = this.competition.results.indexOf(v1.player);
            var idx2 = this.competition.results.indexOf(v2.player);
            var result = idx2 - idx1;
            if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
                result *= -1;
            }
            return result;
        }.bind(this));

        this.views.forEach(function (view, index) {
            view.setLocalZOrder(index + 1);
            view.animateReorder(this.positions[index]);
        }.bind(this));
    },

    animateResults: function (playerResult) {
        this.views.forEach(function (view) {
            if (view.player.player) {
                view.animateResult(playerResult);
            }
        });
    },

    withinBoardView: function () {
        return cleverapps.isRumble();
    }
});

cleverapps.styles.TournamentPlayersView = {
    position: [
        {
            x: { align: "center" },
            y: { align: "top", dy: -120 }
        },
        {
            x: { align: "left", dx: -20 },
            y: { align: "top", dy: -165 }
        },
        {
            x: { align: "left", dx: -20 },
            y: { align: "top", dy: -165 }
        }
    ],

    padding: {
        x: 15,
        y: 20
    },
    margin: 10
};