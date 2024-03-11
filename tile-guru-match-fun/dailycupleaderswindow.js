/**
 * Created by vladislav on 2/20/19
 */

var DailyCupLeadersWindow = Window.extend({
    onWindowLoaded: function () { 
        var styles = cleverapps.styles.DailyCupLeadersWindow;

        this.content = new cc.Node();
        this.content.setAnchorPoint2();
        this.content.setContentSize(styles.width, styles.height);

        this._super({
            title: "DailyCupLeadersWindow.Title",
            name: "dailycupleaderswindow",
            content: this.content
        });

        var results = cleverapps.cupsLeadersTable.getResults("cache");
        if (results) {
            this.leadersOnLoad(results[0]);
        } else {
            this.loading = new LeadersLoading();
            this.loading.setPosition(this.content.width / 2, this.content.height / 2);
            this.content.addChild(this.loading);

            cleverapps.RestClient.get("/dailycup/leaders/" + encodeURIComponent(cleverapps.platform.getUserID()), {}, this.createListener(this.leadersOnLoad.bind(this)), function () {
                cleverapps.notification.create("LeadersLoadFailed");
            });
        }
    },

    leadersOnLoad: function (data) {
        if (this.loading) {
            this.loading.remove();
            cleverapps.cupsLeadersTable.updateResults("cache", [data]);
        }

        var results = data.leaders, playerFound = false;
        for (var i = 0; i < results.length; i++) {
            if (results[i].id === cleverapps.platform.getUserID()) {
                playerFound = true;
                results[i].player = true;
                break;
            }
        }
        if (!playerFound) {
            var user = {
                id: cleverapps.platform.getUserID(),
                firstPlace: data.playerResult.firstPlace,
                secondPlace: data.playerResult.secondPlace,
                thirdPlace: data.playerResult.thirdPlace,
                player: true,
                avatar: cleverapps.friends.getPlayer().avatar,
                text: cleverapps.friends.getPlayer().name,
                notInTop: true
            };
            results.push(user);
        }

        results.forEach(function (player, index) {
            player.place = index + 1;
        });

        var tableView = this.table = cleverapps.cupsLeadersTable.createTableView({
            id: "dailyCupLeadersWindow",
            data: results,
            rowConstructor: cleverapps.DailyCupLeadersRow
        });
        tableView.setPositionRound(this.content.width / 2, this.content.height / 2);
        this.content.addChild(tableView);
    }
});

cleverapps.styles.DailyCupLeadersWindow = {
    width: 650,
    height: 750
};