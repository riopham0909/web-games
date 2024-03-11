/**
 * Created by vtbelo on 10.04.18.
 */

var LeadersLoading = cc.Node.extend({
    ctor: function () {
        this._super();

        var waitStyles = cleverapps.styles.WaitWindow;
        var loading = this.loading = new cleverapps.Spine(bundles.main.jsons.wait_json, 1.5);
        loading.setAnimation(0, "idle", true);
        this.addChild(loading);

        if (waitStyles.text) {
            var loadingText = this.loadingText = cleverapps.UI.generateTTFText((Messages.get("Loading") || "Loading"), cleverapps.styles.FONTS.WINDOW_TEXT);
            loadingText.setPosition(0, waitStyles.text.y);
            this.addChild(loadingText);
        }
    },

    remove: function () {
        this.loading.runAction(new cc.RemoveSelf());
        if (this.loadingText) {
            this.loadingText.removeFromParent();
        }
    }
});

var LeadersWindow = Window.extend({
    onWindowLoaded: function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.LEADERS_WINDOW_OPEN);

        this.currentLeague = levels.user.league;

        this.leaguesLeaders = {};

        this.content = this.createContent();
        this.addArrows();

        this._super.call(this, {
            name: "leaderswindow",
            content: this.content,
            title: "League" + levels.user.league
        });

        this.loadData();
        this.updateArrows();
    },

    addArrows: function () {
        var styles = cleverapps.styles.LeadersWindow;

        this.decLeagueButton = new cleverapps.UI.Button({
            type: {
                button_png: bundles.main.frames.league_arrow_png,
                button_on_png: bundles.main.frames.league_arrow_png
            },
            onClicked: this.decLeague.bind(this)
        });
        this.decLeagueButton.baseScaleX = -1;
        this.decLeagueButton.baseScaley = 1;
        this.decLeagueButton.setPositionRound(styles.arrows.dec);
        this.decLeagueButton.setScaleX(-1);
        this.decLeagueButton.setLocalZOrder(1);
        this.content.addChild(this.decLeagueButton);

        this.incLeagueButton = new cleverapps.UI.Button({
            type: {
                button_png: bundles.main.frames.league_arrow_png,
                button_on_png: bundles.main.frames.league_arrow_png
            },
            onClicked: this.incLeague.bind(this)
        });
        this.incLeagueButton.setPositionRound(styles.arrows.inc);
        this.incLeagueButton.setLocalZOrder(1);
        this.content.addChild(this.incLeagueButton);
    },

    createHead: function () {
        var styles = cleverapps.styles.LeadersWindow;

        var rank = cleverapps.UI.generateOnlyText("LeadersWindow.rank", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        rank.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        rank.setDimensions(styles.head.text.width, 0);

        var player = cleverapps.UI.generateOnlyText("LeadersWindow.player", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        player.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        player.setDimensions(styles.head.text.width, 0);

        var rating = cleverapps.UI.generateOnlyText("LeadersWindow.rating", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        rating.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        rating.setDimensions(styles.head.text.width, 0);

        return new cleverapps.Layout([rank, player, rating], {
            margin: styles.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
    },

    createContent: function () {
        var styles = cleverapps.styles.LeadersWindow;

        var head = this.createHead();

        this.table = this.createTable();

        return new cleverapps.Layout([head, this.table], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL,
            padding: styles.padding
        });
    },

    loadData: function () {
        this.loading = new LeadersLoading();
        this.loading.setPositionRound(this.content.width / 2, this.content.height / 2);
        this.content.addChild(this.loading);

        this.loading.setVisible(false);
        this.loading.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.Show()
        ));

        var onLoad = cleverapps.accumulate(300, this.createListener(function (response) {
            this.loading.removeFromParent();
            this.loading = undefined;

            this.leaguesLeaders = {};
            for (var i = 0; i < response.length; i++) {
                this.leaguesLeaders[response[i].leagueId] = JSON.parse(response[i].data);
                this.leaguesLeaders[response[i].leagueId].forEach(function (leader) {
                    leader.league = response[i].leagueId;
                });
            }

            for (i = 0; i < this.getAmountLeagues(); i++) {
                if (!this.leaguesLeaders[i]) {
                    this.leaguesLeaders[i] = [];
                }
            }

            this.updateArrows();
            this.updateTable();
        }.bind(this)));

        var path = "/leaders/" + cleverapps.settings.language + "/";
        if (cleverapps.config.debugMode) {
            path = "https://wordsoup.labsystech.ru/wordsoup-rest" + path;
        }

        cleverapps.RestClient.get(path, {}, onLoad, function () {
            cleverapps.notification.create("LeadersLoadFailed");
        }, {
            ignoreNoRest: cleverapps.config.importMode
        });
    },

    decLeague: function () {
        if (this.currentLeague > 0) {
            this.currentLeague--;
            this.updateArrows();
            this.updateTable();
            this.updateTitle();
        }
    },

    incLeague: function () {
        if (this.currentLeague < this.getAmountLeagues() - 1) {
            this.currentLeague++;
            this.updateArrows();
            this.updateTable();
            this.updateTitle();
        }
    },

    getAmountLeagues: function () {
        var amountLeagues = 1;
        if (cleverapps.config.leagues) {
            amountLeagues = cleverapps.config.leagues.length;
        }
        return amountLeagues;
    },

    updateArrows: function () {
        if (this.decLeagueButton) {
            this.decLeagueButton.setVisible(!this.loading && this.currentLeague > 0);
        }

        if (this.incLeagueButton) {
            this.incLeagueButton.setVisible(!this.loading && this.currentLeague < this.getAmountLeagues() - 1);
        }
    },

    updateTitle: function () {
        if (this.window) {
            this.setTitle("League" + this.currentLeague);
        }
    },

    getTop: function () {
        var top = this.leaguesLeaders[this.currentLeague] || [];
        this.removePlayerFromTop(top);
        if (levels.user.league === this.currentLeague) {
            this.addPlayerToTop(top);
        }

        while (top.length > LeadersWindow.TOP_LIMIT && top[top.length - 1].id !== cleverapps.platform.getUserID()) {
            top.pop();
        }

        return top;
    },

    updateTable: function () {
        var currentLeague = this.currentLeague;

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.01),
            new cc.CallFunc(function () {
                if (currentLeague !== this.currentLeague) {
                    return;
                }

                var position = this.table.getPosition();
                var parent = this.table.getParent();

                this.table.removeFromParent();
                this.table = this.createTable();
                parent.addChild(this.table);
                this.table.setPositionRound(position);
            }.bind(this))
        ));
    },

    removePlayerFromTop: function (top) {
        for (var i = 0; i < top.length; i++) {
            if (top[i].id === cleverapps.platform.getUserID()) {
                top.splice(i, 1);
                break;
            }
        }
    },

    addPlayerToTop: function (top) {
        top.push({
            id: cleverapps.platform.getUserID(),
            rating: levels.user.getVirtualLevel(),
            name: cleverapps.friends.getPlayer().name,
            avatar: cleverapps.friends.getPlayer().avatar,
            you: true,
            league: levels.user.league
        });

        top.sort(function (a, b) {
            if (a.rating === b.rating) {
                if (a.id === cleverapps.platform.getUserID()) {
                    return -1;
                }
                if (b.id === cleverapps.platform.getUserID()) {
                    return 1;
                }
                return 0;
            }
            return b.rating - a.rating;
        });
    },

    createTable: function () {
        var top = this.getTop();

        var results = [];
        for (var i = 0; i < top.length; i++) {
            var result = {
                text: top[i].name,
                place: (i + 1),
                id: top[i].id,
                avatar: {
                    id: top[i].id,
                    avatar: top[i].avatar
                },
                player: top[i].id === cleverapps.platform.getUserID(),
                amount: top[i].rating
            };
            results.push(result);
        }

        cleverapps.leagueLeadersTable.resetResults("leadersWindow");

        return cleverapps.leagueLeadersTable.createTableView({
            id: "leadersWindow",
            data: results,
            rowConstructor: cleverapps.LeadersRow
        });
    }
});

cleverapps.styles.LeadersWindow = {
    margin: 20,

    head: {
        text: {
            width: 200
        }
    },

    padding: {
        x: -30
    },

    arrows: {
        dec: {
            x: { align: "left", dx: -45 },
            y: { align: "center", dy: -30 }
        },

        inc: {
            x: { align: "right", dx: 45 },
            y: { align: "center", dy: -30 }
        }
    },

    window: {
        decors: {
        }
    }
};

LeadersWindow.TOP_LIMIT = 100;
