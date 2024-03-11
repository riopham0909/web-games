/**
 * Created by Aleksandr on 20.03.2023
 */

var Score = function (points) {
    cleverapps.EventEmitter.call(this);

    this.points = points || 0;
};

Score.prototype = Object.create(cleverapps.EventEmitter.prototype);
Score.prototype.constructor = Score;

Score.prototype.getPoints = function () {
    return this.points;
};

Score.prototype.setPoints = function (amount, isBigValue) {
    if (amount < 0) {
        amount = 0;
    }
    this.points = amount;

    this.trigger("onChange", this.points, isBigValue);
};

Score.prototype.hide = function () {
    this.trigger("onHide");
};

Score.prototype.show = function () {
    this.trigger("onShow");
};

Score.prototype.addPoints = function (amount, isBigValue) {
    this.setPoints(this.points + amount, isBigValue);
};