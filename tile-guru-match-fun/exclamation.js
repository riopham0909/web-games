/**
 * Created by mac on 4/7/20
 */

var Exclamation = function () {
    cleverapps.EventEmitter.call(this);
};

Exclamation.prototype = Object.create(cleverapps.EventEmitter.prototype);
Exclamation.prototype.constructor = Exclamation;

Exclamation.prototype.show = function (message, type) {
    this.trigger("show", message, type || Exclamation.Types.Normal);
};

Exclamation.prototype.remove = function () {
    this.trigger("hide");
};

Exclamation.prototype.getCongratulations = function () {
    if (["heroes", "runes"].indexOf(cleverapps.config.name) !== -1) {
        return ["wow", "super", "yay", "yeah", "ohyeah", "oh"];
    } 
    return Messages.get("congratulations");
};

Exclamation.Types = {
    Normal: 100,
    Warning: 101,
    Congrats: 102
};