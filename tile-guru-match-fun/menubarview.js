/**
 * Created by slava on 23.03.17.
 */

var MenuBarView = cc.Node.extend({
    ctor: function () {
        this._super();

        var styles = cleverapps.styles.MenuBar;
        var views = cleverapps.menuBar.getSceneItems().filter(function (item) {            
            if (item.name === "CoinsItem" && cleverapps.gameModes.hideMenuBarCoinsItem) {
                return false;
            }

            return true;
        }).map(function (item) {
            var ViewClass = item.getViewClass();
            return new ViewClass(item);
        });
        var layout = this.layout = new cleverapps.Layout(views, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });

        this.addChild(layout);

        this.views = views.map(function (view) {
            var controlView = new HidingNode(view, cleverapps.UI.VERTICAL);
            var hiddenByDefault = view.item.hiddenByDefault;
            if (view.item.name === "GoldItem" && cleverapps.gameModes.showMenuBarGoldItem) {
                hiddenByDefault = undefined;
            }
            cleverapps.meta.registerControl(view.item.getControlName(), view, hiddenByDefault);
            return controlView;
        });

        this.updateContentSize();
    },

    reshape: function (totalWidth, maxWidth) {
        var styles = cleverapps.styles.MenuBar;
        var layout = this.layout;

        layout.options.margin = styles.margin;
        layout.reshape();

        if (layout.width > maxWidth) {
            layout.options.margin = styles.smallMargin;
            layout.reshape();
        }

        var centerItem = this.views[1];

        if (layout.width < maxWidth && centerItem && centerItem.target && centerItem.target.centerAlign
            && centerItem.x < totalWidth / 2 && totalWidth / 2 + centerItem.width / 2 <= maxWidth) {
            centerItem.x = totalWidth / 2;
            layout.width = centerItem.x + centerItem.width / 2;
        }

        this.updateContentSize();
    },

    updateContentSize: function () {
        this.setContentSize2(this.layout.width * this.layout.scale, this.layout.height * this.layout.scale);
        this.layout.setPositionRound(this.width / 2, this.height / 2);
    }
});

cleverapps.styles.MenuBar = {
    margin: 16,
    smallMargin: 12
};
