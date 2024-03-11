/**
 * Created by vladislav on 03.03.2020
 */

var RoundResultsComponent = cc.Node.extend({
    ctor: function (round, options) {
        this._super();

        this.round = round;
        options = options || {};

        this.setAnchorPoint2();

        var styles = cleverapps.styles.RoundResultsComponent;

        var players = Game.currentGame.competition.getResults().sort(function (a) {
            return a.player ? -1 : 1;
        });

        this.perWordTime = 0.05;
        this.maxWords = Math.max(players[0].amount, players[1].amount);

        this.views = players.map(function (player) {
            var name = cleverapps.UI.generateTTFText(
                GridPlayerNameView.FormatName(player.name),
                options.victory ? cleverapps.styles.FONTS.SMALL_WHITE_TEXT : cleverapps.styles.FONTS.WINDOW_SMALL_TEXT
            );
            var avatar = new cleverapps.UI.Avatar(player);

            var openedWords = player.amount;

            var time = 0;
            if (openedWords > 0) {
                time = this.perWordTime * (this.maxWords / openedWords);
            }
            if (time > 0.2) {
                time = 0.2;
            }

            var isWinner = this.round.isWinner(player.id);

            var view;
            var words = new AnimatedCounterComponent({
                from: 0,
                to: openedWords,
                font: options.victory ? cleverapps.styles.FONTS.WHITE_TEXT : cleverapps.styles.FONTS.WINDOW_TEXT,
                time: time,
                onFinish: function () {
                    if (isWinner) {
                        this.runWinAnimation(view);
                    } else {
                        this.runLoseAnimation(view);
                    }
                }.bind(this)
            });

            if (!isWinner) {
                avatar.setCascadeColorEnabled(true);
                avatar.runAction(new cc.TintTo(this.perWordTime * this.maxWords, 120, 120, 120));
            }

            view = new cleverapps.Layout([name, avatar, words], {
                direction: cleverapps.UI.VERTICAL,
                margin: styles.view.margin
            });

            view.avatar = avatar;
            view.words = words;
            view.name = name;
            view.player = player;

            return view;
        }, this);

        this.user = this.views[0];
        this.opponent = this.views[1];

        this.content = new cleverapps.Layout(this.views, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin,
            padding: styles.padding
        });

        this.setContentSize2(this.content.getContentSize());
        this.addChild(this.content);
        this.content.setPositionRound(this.width / 2, this.height / 2);

        this.runAnimation();
    },

    runAnimation: function () {
        this.views.forEach(function (view) {
            view.words.runAnimation();
        }, this);
    },

    runWinAnimation: function (view) {
        var styles = cleverapps.styles.RoundResultsComponent.animation.user;

        view.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.Spawn(
                new cc.ScaleTo(0.4, 1.3).easing(cc.easeOut(2)),
                new cc.MoveTo(0.6, cc.p(this.content.width / 2, view.y + styles.dy))
            )
        ));
    },

    runLoseAnimation: function (view) {
        var scene = cleverapps.scenes.getRunningScene();

        var delay = 0;
        if (view.player.amount === 0) {
            delay = this.perWordTime * this.maxWords;
        }
        view.runAction(new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.CallFunc(function () {
                view.name.setVisible(false);
                view.words.setVisible(false);

                view.avatar.replaceParentSamePlace(scene);
                view.avatar.setLocalZOrder(100);

                view.avatar.runAction(new cc.RepeatForever(
                    new cc.RotateBy(1, 180)
                ));

                view.avatar.runAction(new cc.Sequence(
                    new cc.MoveTo(1.2, cc.p(view.avatar.x, -view.avatar.height / 2)).easing(cc.easeIn(2)),
                    new cc.RemoveSelf()
                ));

                cleverapps.audio.playSound(bundles.game.urls.tournament_player_lose_effect);
            })
        ));
    }
});

cleverapps.styles.RoundResultsComponent = {
    animation: {
        user: {
            dy: -30
        }
    },
    view: {
        margin: 10
    },
    margin: 90,
    padding: {
        bottom: 80
    }
};