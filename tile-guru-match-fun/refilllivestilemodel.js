/**
 * Created by iamso on 24.04.19.
 */

var RefillLivesTileModel = function (data) {
    TileModel.call(this, data);
    this.product.reward = this.getReward();
};

RefillLivesTileModel.prototype = Object.create(TileModel.prototype);
RefillLivesTileModel.prototype.constructor = RefillLivesTileModel;

RefillLivesTileModel.prototype.getReward = function () {
    return {
        lives: cleverapps.lives.getMaxLives()
    };
};

RefillLivesTileModel.prototype.getProductDescription = function () {
    return {
        reward: true
    };
};
