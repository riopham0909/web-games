/**
 * Created by Andrey Popov on 08.04.2020
 */

var ShopProductSource = {
    listProducts: function (tab) {
        var products = ShopProductSource.ITEMS[tab] || [];
        var coinPayerProducts = ShopProductSource.ITEMS.CoinsPayer;

        var payerClass = cleverapps.paymentsHistory.classify();
        if (tab === ShopWindow.TABS.HARD_CURRENCY && payerClass > cleverapps.PaymentsHistory.BRACKET_WEAK) {
            products = coinPayerProducts;
        }

        if (tab === ShopWindow.TABS.HARD_CURRENCY) {
            products = products.filter(function (id) {
                var product = cleverapps.config.products[id] || VirtualProducts[id];

                if (!product) {
                    return false;
                }

                if (product.pack && cleverapps.config.type === "merge") {
                    return false;
                }

                return !product.mainSceneOnly || cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition();
            });
        }

        return products;
    },

    listTileModels: function (tab) {
        var products;

        if (cleverapps.unitsShop && cleverapps.unitsShop.tabs[tab]) {
            products = cleverapps.unitsShop.tabs[tab].generateProducts();
        } else {
            products = ShopProductSource.listProducts(tab).map(function (id) {
                return Product.Create(id);
            });
        }

        products = products.filter(function (product) {
            if (!product) {
                return false;
            }

            if (product.reward && product.reward.unlimitedLives && cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed()) {
                return false;
            }

            var limit = product.adsLimit ? product.adsLimit() : undefined;
            return !limit || cleverapps.adsLimits.state(limit) !== AdsLimits.STATE_DISABLED;
        });

        var tileModels = products.map(function (product) {
            return TileModel.Create(product);
        }).filter(function (tileModel) {
            return tileModel.isEnabled();
        });

        if (tab === ShopWindow.TABS.HARD_CURRENCY && !cleverapps.flags.videoAdsMainMonetization) {
            var maxPrice = 0;
            tileModels.forEach(function (tileModel) {
                if (tileModel.getPrice && tileModel.getPrice() > maxPrice) {
                    maxPrice = tileModel.getPrice();
                }
            });

            for (var i = 0; i < tileModels.length; i++) {
                if (tileModels[i].getPrice() === maxPrice) {
                    tileModels[i].badge = { type: "save" };
                    break;
                }
            }
        }

        var payerClass = cleverapps.paymentsHistory.classify();
        if (payerClass === cleverapps.PaymentsHistory.BRACKET_UNDECIDED) {
            payerClass = cleverapps.PaymentsHistory.BRACKET_NONE;
        }

        if (tab !== ShopWindow.TABS.HARD_CURRENCY || !cleverapps.flags.videoAdsMainMonetization) {
            var bestSellers = ShopProductSource.ITEMS.bestSellersByPayerClass[payerClass];
            for (i = 0; i < tileModels.length; i++) {
                if (bestSellers.indexOf(tileModels[i].getItemId()) !== -1 && !tileModels[i].badge) {
                    tileModels[i].badge = { type: "bestSeller" };
                    break;
                }
            }
        }

        return tileModels;
    }
};

ShopProductSource.ITEMS = {
    CoinsPayer: ["hardForVideo", "jamPack", "tastyPack", "honeyPack", "epicPack", "gold500", "gold1800", "gold3800", "gold6000", "gold25000", "subsMonth"],

    bestSellersByPayerClass: [
        ["sweetPack", "gold500"],
        ["jamPack", "gold1800"],
        ["tastyPack", "gold3800"],
        ["honeyPack", "gold6000"],
        ["honeyPack", "gold25000"]
    ]
};

ShopProductSource.ITEMS[ShopWindow.TABS.HARD_CURRENCY] = ["hardForVideo", "sweetPack", "jamPack", "tastyPack", "honeyPack", "gold500", "gold1800", "gold3800", "gold6000", "gold25000", "subsMonth"];
ShopProductSource.ITEMS[ShopWindow.TABS.LIVES] = ["refillLives", "unlimitedLives", "askLives", "livesForVideo", "buyLife"];
ShopProductSource.ITEMS[ShopWindow.TABS.SOFT_CURRENCY] = ["softCurrencyVerySmall", "softCurrencySmall", "softCurrencyMedium", "softCurrencyLarge"];

if (cleverapps.config.type === "merge") {
    ShopProductSource.ITEMS[ShopWindow.TABS.LIVES] = ["energyLottery", "buyEnergy350", "buyEnergy700", "buyEnergy", "energyForVideo", "energyForVideoShort"];
    ShopProductSource.ITEMS[ShopWindow.TABS.SOFT_CURRENCY] = ["softCurrencyVerySmall", "softCurrencySmall", "softCurrencyMedium", "softCurrencyLarge"];

    if (["mergecraft", "wondermerge", "fairy"].indexOf(cleverapps.config.name) !== -1) {
        ShopProductSource.ITEMS.CoinsPayer = ["hardForVideo", "gold500", "gold1800", "gold3800",
            "gold6000", "gold25000", "subsMonth", "growthFund"];
        ShopProductSource.ITEMS[ShopWindow.TABS.HARD_CURRENCY] = ["hardForVideo", "gold500",
            "gold1800", "gold3800", "gold6000", "gold25000", "subsMonth", "growthFund"];
    }
}
