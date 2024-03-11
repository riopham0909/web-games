/**
 * Created by olga on 22.12.2023
 */

var TilesUnlockWindow = Window.extend({
    onWindowLoaded: function () {
        this.tilesCreated = false;
        var content = this.createContent();

        this._super({
            content: content,
            name: "tilesunlockwindow",
            noBackground: true,
            tapToContinue: "Window.ClickToClose"
        });
    },

    onShow: function () {
        this._super(2.5);
    },

    createContent: function () {
        var styles = cleverapps.styles.TilesUnlockWindow;

        var content = new cc.Node();
        content.setAnchorPoint2();
        content.setContentSize(styles.width, styles.height);

        var text = cleverapps.UI.generateOnlyText("TilesUnlockWindow.text", cleverapps.styles.FONTS.TILES_UNLOCK_WINDOW_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);
        text.fitTo(undefined, styles.text.height);
        content.addChild(text);
        text.setPositionRound(styles.text);

        var animation = this.animation = new cleverapps.Spine(bundles.tiles_unlock_window.jsons.tiles_unlock_json);
        animation.setAnimationAndIdleAfter("open", "idle");
        cleverapps.audio.playSound(bundles.game.urls.tiles_unlock_effect);

        animation.setPositionRound(styles.animation);
        content.addChild(animation);
        var tiles = this.tiles = this.createTiles();
        tiles.forEach(function (tile) {
            content.addChild(tile);
        });

        return content;
    },

    createTiles: function () {
        var newSkins = Game.currentGame.generator.getAvailableSkins().new;

        var tiles = newSkins.map(function (skin) {
            var view = CardView.createCardView(new Card({
                value: skin
            }));

            view.onTouchHandler.remove();
            view.onTouchHandler = undefined;

            view.hide = undefined;

            return view;
        });

        var first = true;
        var callback = cleverapps.wait(2, function () {
            this.tilesCreated = true;
        }.bind(this));

        tiles.forEach(function (tile) {
            var actions = [];

            actions.push(tile.unlockSpawnAnimate(first, callback));
            actions.push(new cc.CallFunc(callback));

            actions.push(tile.unlockIdleAnimate(first));

            tile.runAction(new cc.Sequence(actions));

            first = false;
        });

        return tiles;
    },

    beforeCloseAnimation: function (callback) {
        callback = cleverapps.wait(2, callback);

        var first = true;
        this.animation.setAnimation(0, "close", false);
        this.animation.setCompleteListenerRemove();

        this.tiles.forEach(function (tile) {
            tile.stopAllActions();
            tile.unlockEndAnimate(callback, first);

            first = false;
        });
    },

    close: function () {
        if (this.tilesCreated) {
            this._super();
        }
    },

    listBundles: function () {
        return ["tiles_unlock_window"];
    }
});

TilesUnlockWindow.getUnlockedTiles = function () {
    var game = Game.currentGame;
    var newTilesSkins = game.generator.getAvailableSkins().new;
    if (newTilesSkins.length) {
        return newTilesSkins;
    }
};

TilesUnlockWindow.areUnlockedTilesAvailable = function () {
    return cleverapps.user.level === 0 && cleverapps.user.episode > 0 && TilesUnlockWindow.getUnlockedTiles();
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TILES_UNLOCK_WINDOW_TEXT: {
        size: 60,
        color: new cc.Color(255, 255, 83, 255),
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: {
            color: cleverapps.styles.COLORS.COLOR_BROWN,
            direction: cc.size(0, -5)
        }
    }
});

cleverapps.styles.TilesUnlockWindow = {
    width: 650,
    height: 900,

    animation: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: 0 }
    },

    tiles: {
        offset: 125,
        scale: 1.7
    },

    text: {
        width: 800,
        height: 600,

        x: { align: "center" },
        y: { align: "top" }
    }
};
