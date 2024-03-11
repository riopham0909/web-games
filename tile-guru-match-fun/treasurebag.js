/**
 * Created by razial on 18.12.2022
 */

var TreasureBag = function () {
    this.visible = false;

    this.onShow = function () {};
    this.onHide = function () {};
};

TreasureBag.prototype.isVisible = function () {
    return this.visible;
};

TreasureBag.prototype.show = function () {
    if (!this.visible) {
        this.visible = true;
        this.onShow();
    }
};

TreasureBag.prototype.hide = function () {
    if (this.visible) {
        this.visible = false;
        this.onHide();
    }
};
