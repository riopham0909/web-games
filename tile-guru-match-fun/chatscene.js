/**
 * Created by Andrey Popov on 12/1/20.
 */

var ChatScene = cleverapps.FixedWidthScene.extend({
    ctor: function (chat) {
        this._super();

        this.chat = chat;
    },

    onSceneLoaded: function () {
        this._super(cleverapps.Environment.SCENE_CHAT);

        var chatHeader = new ChatHeader(this.chat);
        this.addChild(chatHeader);

        var chatView = new ChatView(this.chat);
        this.addChild(chatView);

        var chatInput = new ChatInput(this.chat);
        this.addChild(chatInput);

        cleverapps.placements.run(Placements.INTERMEDIATE);

        if (this.chat.hasUnread) {
            this.chat.markAsRead();
        }
    },

    getBackgroundStyles: function () {
        return {
            bundle: "chat",
            patternId: "window_bg"
        };
    },

    listBundles: function () {
        var bundles = ["chat"];
        if (typeof match3 !== "undefined") {
            bundles.push("heroes_game");
        }
        if (cleverapps.config.type === "merge") {
            bundles.push("episode_0");
            bundles.push("game");
            bundles.push("units_main");
            bundles.push("landmarks");

            cleverapps.chat.messages.forEach(function (message) {
                if (!message.hasGift()) {
                    return;
                }

                var gift = JSON.parse(message.message);
                var page = cleverapps.travelBook.getPageById(gift.expedition);
                if (page) {
                    bundles.push(Map2d.getUnitsTexture(page.getCurrentLevel()));
                }
            });
        }
        return bundles;
    }
});
