/**
 * Created by ivan on 11.04.18.
 */

var FriendRequestsToolbarItem = function() {
    ToolbarItem.call(this, ToolbarItem.FRIEND_REQUESTS);
    this.lastNotProceedId = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LAST_VIEWED_FRIEND_REQUEST, { raw: true} );

    levels.friendRequests.onNewListener = function() {
        this.mark();
        cleverapps.toolbar.updateItems();
    }.bind(this);

    levels.friendRequests.onChangeListener = function() {
        if (!levels.friendRequests.existNotProcessed()) {
            this.unmark();
            cleverapps.toolbar.updateItems(true);
        }
    }.bind(this);

    this.enable();
    this.mark();
};

FriendRequestsToolbarItem.prototype = Object.create(ToolbarItem.prototype);
FriendRequestsToolbarItem.prototype.constructor = FriendRequestsToolbarItem;

FriendRequestsToolbarItem.prototype.mark = function() {
    var friends = cleverapps.friends.listFriends().concat(cleverapps.invitalbleFriends.listFriends());
    if (friends.length === 0) {
        return;
    }

    var lastNotProcessedId = levels.friendRequests.lastNotProcessedId();
    if (lastNotProcessedId === false || lastNotProcessedId === this.lastNotProceedId) {
        return;
    }

    ToolbarItem.prototype.mark.apply(this);
};

FriendRequestsToolbarItem.prototype.isVisible = function () {
    return levels.friendRequests.existNotProcessed();
};

FriendRequestsToolbarItem.prototype.onClick = function() {
    this.lastNotProceedId = levels.friendRequests.lastNotProcessedId();
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LAST_VIEWED_FRIEND_REQUEST, this.lastNotProceedId, {raw: true});
    this.unmark();

    cleverapps.meta.display({
        focus: 'FriendRequestsWindow',
        control: ['MenuBarGoldItem', 'MenuBarLivesItem'],
        action: function (f) {
            new FriendRequestsWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};