/**
 * Created by slava on 4/21/17.
 */

var FotoStranaPayments = function () {
    RestPayments.call(this);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];

        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = itemId;
    }
};

FotoStranaPayments.prototype = Object.create(RestPayments.prototype);
FotoStranaPayments.prototype.constructor = FotoStranaPayments;

FotoStranaPayments.prototype.calcLoadedPrice = function (price) {
    var loadedPrice = price + " ФМ";
    return loadedPrice.replace(".", ",");
};

FotoStranaPayments.prototype.purchaseOpen = function (product, callback) {
    var isDebug = FotoStranaPayments.DEBUG_USERS.includes(cleverapps.platform.getUserID()) ? 1 : 0;

    FSClient.event("buyItemCallback", function (response) {
        callback(response.result === "success" ? cleverapps.CODE_SUCCEED : cleverapps.CODE_CANCELLED);
    }, {
        itemId: product.id.mymailru,
        name: product.description,
        forwardData: product.itemId,
        picUrl: cleverapps.platform.getExternalUrl(product.image.replace("fbproducts", "fsproducts")),
        priceFmCents: Math.floor(product.price * 100),
        isDebug: isDebug
    });
};

FotoStranaPayments.isAppropriate = function () {
    return cleverapps.platform instanceof FotoStrana;
};

FotoStranaPayments.DEBUG_USERS = [
    "FS_113127743", // CleverApps
    "FS_113139202", // Anna Diduk
    "FS_113154744" // Andrey Kargapolov
];