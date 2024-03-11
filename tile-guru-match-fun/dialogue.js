/**
 * Created by vladislav on 29.08.2019
 */

var Dialogue = function (data, options) {
    cleverapps.EventEmitter.call(this);

    this.options = options || {};
    this.parentScene = options.parentScene;

    this.autoScroll = 3;
    if (this.options.autoScroll !== undefined) {
        this.autoScroll = this.options.autoScroll;
    }
    this.data = Array.isArray(data) ? data : [data];
    this.stage = -1;

    this.stageData = this.data[0];
    this.personSlots = [undefined, undefined];

    var personsBundles = [];
    data.forEach(function (step) {
        ["person", "person2"].forEach(function (key) {
            if (!step[key]) {
                return;
            }
            var person = PersonsLibrary.getPerson(step[key].role || step[key]);
            personsBundles.push(person && person.bundle || step[person]);
        });
    });

    this.bundlesToLoad = cleverapps.unique(["dialogues"].concat(personsBundles).concat(this.options.bundles || [])).filter(function (name) {
        return bundles[name];
    });
};

Dialogue.prototype = Object.create(cleverapps.EventEmitter.prototype);
Dialogue.prototype.constructor = Dialogue;

Dialogue.prototype.run = function () {
    if (!cleverapps.meta.isFocused()) {
        console.log("Dialogue:", this.data);
        cleverapps.meta.debugMessage("Trying to show dialogue without user focus!");
    }

    this.focus = cleverapps.meta.focus;

    this.next();
};

Dialogue.prototype.isStarted = function () {
    return this.stage !== -1;
};

Dialogue.prototype.finishClose = function () {
    if (this.closeCallback) {
        this.closeCallback();
        delete this.closeCallback;
    }
    this.trigger("afterClose");
};

Dialogue.prototype.close = function (callback) {
    if (this.closing) {
        return;
    }
    this.closing = true;

    this.closeCallback = callback;
    this.trigger("close", !this.options.showUp);
};

Dialogue.prototype.next = function (delay) {
    clearTimeout(this.nextTimeout);

    if (cleverapps.meta.focus !== false && cleverapps.meta.focus !== this.focus) {
        return;
    }

    if (delay) {
        this.nextTimeout = this.createTimeout(this.next.bind(this), delay * 1000);
        return;
    }

    if (this.typing) {
        this.finishTyping();
        return;
    }

    if (this.stage < this.data.length - 1) {
        this.incStage();
    } else if (this.options.autoClose) {
        this.close();
    }
};

Dialogue.prototype.incStage = function () {
    this.stage++;
    this.stageData = this.data[this.stage];
    this.onChangeStage();
};

Dialogue.prototype.createTimeout = function (callback, delay) {
    return new cleverapps.CountDown(delay, {
        onFinish: function () {
            if (!this.closing) {
                callback();
            }
        }.bind(this)
    });
};

Dialogue.prototype.onChangeStage = function () {
    if (this.stageData.person === undefined) {
        this.stageData.person = "hero";
    }
    var active = this.stageData.person && Person.ParseOptions(this.stageData.person);
    if (active) {
        active.active = true;
    }
    var inactive = this.stageData.person2 && Person.ParseOptions(this.stageData.person2);
    if (inactive) {
        inactive.active = false;
    }
    if (active.orientation === "left") {
        var persons = [active, inactive];
    } else {
        persons = [inactive, active];
    }

    persons.forEach(function (person, index) {
        var oldPerson = this.personSlots[index];
        if (!this.areSamePersons(person, oldPerson)) {
            if (oldPerson) {
                this.trigger("hidePerson", oldPerson.orientation);
            }
            if (person) {
                var silent = this.stage === 0;
                this.trigger("addPerson", person, silent);
            }
        }
    }, this);

    this.trigger("updateActive", active && active.orientation);
    this.trigger("updatePersonTitle", active);
    this.trigger("changedStage");

    this.personSlots = persons;

    if (this.stage === 0) {
        this.trigger("showUp", !this.options.showUp, this.onTyping.bind(this));
    } else {
        this.onTyping();
    }
};

Dialogue.prototype.onTyping = function (active) {
    this.typing = true;
    this.trigger("changeText", this.stageData.text, active);
};

Dialogue.prototype.areSamePersons = function (person1, person2) {
    return person1 && person2 && person1.orientation === person2.orientation
        && person1.role === person2.role;
};

Dialogue.prototype.finishTyping = function (skipped) {
    this.typing = false;
    this.trigger("finishTyping", skipped);

    if (this.autoScroll) {
        this.next(this.autoScroll);
    }
};

Dialogue.prototype.screenClicked = function () {
    this.trigger("screenClicked");
    this.next();
};

Dialogue.POSITIONS = {
    TOP: "top",
    TOP_LOWER: "top_lower",
    BOTTOM: "bottom",
    CENTER: "center"
};
