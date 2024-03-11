/**
 * Created by ivan on 16.04.18.
 */

var FriendRequestsWindow = Window.extend({
    onWindowLoaded: function () {
        var content = new cc.Node();
        content.setAnchorPoint2();
        this.content = content;

        this.createViews();

        this._super({
            name: "friendrequestswindow",
            content: content,
            noBackground: true,
            loginOrInvite: true
        });
    },

    createViews: function () {
        var styles = cleverapps.styles.FriendRequestsWindow;
        this.requestsViews = [];
        this.requestsIds = [];
        this.pendingViews = [];
        this.pendingIds = [];

        var requestViews = [];
        for (var i = 0; i < levels.friendRequests.notProcessed.length; i++) {
            var view = this.createRequestView(levels.friendRequests.notProcessed[i]);
            if (view) {
                requestViews.push(view);
            }
        }

        requestViews.forEach(function (requestView) {
            if (this.requestsViews.length < FriendRequestsWindow.MAX_SHOW_REQUESTS) {
                this.content.addChild(requestView);
                this.requestsViews.push(requestView);
                this.requestsIds.push(requestView.model.getId());
            } else {
                this.content.addChild(requestView);
                requestView.setVisible(false);
                this.pendingViews.push(requestView);
                this.pendingIds.push(requestView.model.getId());
            }
        }, this);

        var totalHeight = cleverapps.UI.arrangeWithMargins(this.requestsViews.slice().reverse(), {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            x: styles.width / 2,
            y: styles.y
        });
        this.content.setContentSize2(styles.width, totalHeight);
    },

    createRequestView: function (request) {
        var id = request.getId();
        var RequestViewClass = request.getView();
        if (!RequestViewClass) {
            return;
        }
        return new RequestViewClass(request, this, function () {
            var order = this.getRequestIdViewOrder(id);
            var lastPosition = this.requestsViews[0].getPosition();
            if (order !== false) {
                for (var i = order - 1; i >= 0; --i) {
                    if (this.requestsViews[i].isRunning()) {
                        this.requestsViews[i].runAction(new cc.MoveTo(this.getMoveTime(), this.requestsViews[i + 1].getPosition()));
                    }
                }
                this.requestsIds.splice(order, 1);
                this.requestsViews.splice(order, 1);
            }
            if (this.requestsViews.length === 0 && this.pendingViews.length === 0) {
                this.close();
            } else if (this.pendingViews.length > 0) {
                var nextRequestView = this.pendingViews[0];
                var nextRequestId = this.pendingIds[0];
                this.pendingViews.splice(0, 1);
                this.pendingIds.splice(0, 1);
                this.requestsViews.splice(0, 0, nextRequestView);
                this.requestsIds.splice(0, 0, nextRequestId);
                nextRequestView.setVisible(true);
                nextRequestView.setScale(0);
                nextRequestView.setPosition(lastPosition);
                nextRequestView.runAction(new cc.ScaleTo(this.getMoveTime(), 1));
            }
        }.bind(this));
    },

    getRequestIdViewOrder: function (requestId) {
        for (var i = 0; i < this.requestsIds.length; i++) {
            if (this.requestsIds[i] === requestId) {
                return i;
            }
        }
        return false;
    },

    getMoveTime: function () {
        return 0.3;
    },

    onClose: function () {
        cleverapps.toolbar.updateItems();
    }
});

FriendRequestsWindow.MAX_SHOW_REQUESTS = 4;

cleverapps.styles.FriendRequestsWindow = {
    width: 400,
    margin: 15,
    y: 0
};