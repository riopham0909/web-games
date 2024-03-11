/**
 * Created by vladislav on 08.05.2020
 */

var NoConnectionWindow = Window.extend({
    onWindowLoaded: function () {
        var styles = cleverapps.styles.NoConnectionWindow;

        this._super({
            title: "NoConnectionWindow.title",
            name: "noconnectionwindow",
            content: this.getContent(),
            button: {
                width: styles.button.width,
                height: styles.button.height, 
                text: "OK",
                onPressed: function () {
                    this.close();
                }.bind(this)
            }
        });
    },

    getContent: function () {
        var styles = cleverapps.styles.NoConnectionWindow;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(styles.animation);
        var animation = new cleverapps.Spine(bundles.noconnection_window.jsons.no_connection_json);
        node.addChild(animation);
        animation.setPositionRound(node.width / 2, node.height / 2);
        animation.setAnimation(0, "animation", true);

        var text = cleverapps.UI.generateTTFText("RestartWindow.AnErrorOccured", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        text.setDimensions(styles.text.width, 0);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        var layout = new cleverapps.Layout([node, text], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });

        return layout;
    },

    listBundles: function () {
        return ["noconnection_window"];
    }
});

cleverapps.styles.NoConnectionWindow = {
    width: 500,
    height: 800,

    margin: 30,

    animation: {
        width: 400,
        height: 400
    },

    text: {
        width: 480
    },

    button: {
        width: 200,
        height: 100
    }
};