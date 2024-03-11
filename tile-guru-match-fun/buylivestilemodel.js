/**
 * Created by vladislav on 10.09.2021
 */

var BuyLivesTileModel = function (data) {
    TileModel.call(this, data);
};

BuyLivesTileModel.prototype = Object.create(TileModel.prototype);
BuyLivesTileModel.prototype.constructor = BuyLivesTileModel;

BuyLivesTileModel.prototype.getProductDescription = function () {
    return {
        reward: true
    };
};