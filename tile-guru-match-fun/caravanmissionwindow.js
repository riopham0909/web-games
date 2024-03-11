/**
 * Created by vladislav on 04/04/2022
 */

var CaravanMissionWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.mission = mission;

        this._super({
            name: "CaravanMissionWindow",
            content: this.createContent(),
            noBackground: true,
            title: "CaravanMissionWindow.Title",
            notCloseByTouchInShadow: true,
            closeButtonDelay: true
        });

        cleverapps.meta.showControlsWhileFocused("MenuBarGoldItem");
    },

    getPerson: function () {
        return {
            left: cleverapps.config.name === "mergecraft" ? "seller" : "camel",
            right: "camel"
        };
    },

    createContent: function () {
        var styles = cleverapps.styles.CaravanMissionWindow;

        var productViews = Caravan.PRODUCTS.map(function (productId, index) {
            var product = Product.Create(productId);
            var cupData = Families.caravanbox.units[index].cup;

            var tileView = new CaravanTileView(product, cupData, this.buyProduct.bind(this, product));
            tileView.setLocalZOrder(-index);

            return tileView;
        }, this);

        productViews.forEach(function (view, index) {
            view.runAction(new cc.Sequence(
                new cc.DelayTime(0.7 + 0.3 * index),
                new cc.CallFunc(function () {
                    view.onHelpButtonClicked();
                })
            ));
        });

        return new cleverapps.Layout(productViews, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin
        });
    },

    buyProduct: function (product) {
        this.mission.logic.buyProduct(product);

        this.close();
    },

    listBundles: function () {
        return ["caravan"];
    }
});

cleverapps.styles.CaravanMissionWindow = {
    margin: 20
};
