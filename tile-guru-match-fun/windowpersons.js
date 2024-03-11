/**
 * Created by vladislav on 08.08.2022
 */

var WindowPersons = function (persons, window) {
    this.window = window;

    this.visible = true;
    var left, right;

    if (persons.left || persons.right) {
        left = persons.left;
        right = persons.right;
    } else {
        left = persons;
    }

    if (left) {
        this.leftPerson = this.createPerson(left);
    }

    if (right) {
        if (typeof right === "string") {
            right = {
                role: right
            };
        }
        right.orientation = "right";

        this.rightPerson = this.createPerson(right);
    }
};

WindowPersons.prototype.update = function () {
    var isVisible = this.positionPersons();

    this.toggleVisible(isVisible);
};

WindowPersons.prototype.positionPersons = function () {
    var styles = cleverapps.styles.WindowPersons;

    var nodes = [this.window.wrapper, this.window.tapToContinue].filter(Boolean);
    var widestNode = nodes[0];

    for (var i = 1; i < nodes.length; ++i) {
        var node = nodes[i];

        if (node.width * node.scale > widestNode.width * widestNode.scale) {
            widestNode = node;
        }
    }

    var isVisible = true;
    [this.leftPerson, this.rightPerson].filter(Boolean).forEach(function (person) {
        var orientation = person.getOrientation();
        person.setPositionRound(styles.position[orientation]);

        if (widestNode) {
            var distanceBetweenObjects = Math.abs(person.x - widestNode.x);
            var sumWidth = (person.width + widestNode.width * widestNode.scale) / 2 + styles.offset;

            if (distanceBetweenObjects < sumWidth) {
                person.x = widestNode.x + sumWidth * (orientation === "left" ? -1 : 1);
            }
        }

        person.originalPosition = person.getPosition();

        isVisible = isVisible
            && person.x >= person.width * 0.2
            && person.x <= (cleverapps.UI.getSceneSize().width - person.width * 0.2);
    }, this);

    return isVisible;
};

WindowPersons.prototype.createPerson = function (options) {
    var person = new Person(options);
    person.setVisible(this.visible);
    person.setAnchorPoint2(0.5, 0);
    person.setLocalZOrder(3);
    this.window.addChild(person);

    return person;
};

WindowPersons.prototype.getHidePosition = function (person) {
    var position;

    if (person.getOrientation() === "left") {
        position = cc.p(-person.width, person.y);
    } else {
        position = cc.p(cleverapps.scenes.getRunningScene().width + person.width, person.y);
    }
    return position;
};

WindowPersons.prototype.showPerson = function (person) {
    person.stopAllActions();
    person.setPositionRound(this.getHidePosition(person));
    person.runAction(new cc.Sequence(
        new cc.MoveTo(0.6, person.originalPosition).easing(cc.easeBackOut())
    ));
};

WindowPersons.prototype.hidePerson = function (person) {
    person.stopAllActions();

    person.runAction(new cc.Sequence(
        new cc.MoveTo(0.6, this.getHidePosition(person)).easing(cc.easeBackIn()),
        new cc.RemoveSelf()
    ));
};

WindowPersons.prototype.showUp = function () {
    [this.leftPerson, this.rightPerson].forEach(function (person) {
        if (person) {
            this.showPerson(person);
        }
    }, this);
};

WindowPersons.prototype.hide = function () {
    [this.leftPerson, this.rightPerson].forEach(function (person) {
        if (person) {
            this.hidePerson(person);
        }
    }, this);
};

WindowPersons.prototype.toggleVisible = function (visible) {
    if (this.visible === visible) {
        return;
    }

    this.visible = visible;

    [this.leftPerson, this.rightPerson].forEach(function (person) {
        if (person) {
            person.setVisible(visible);
            person.isShown = visible;
            cleverapps.scenes.onAvoidNodeVisibilityChanged();
        }
    });
};

WindowPersons.prototype.setLeftPerson = function (person) {
    person = Person.ParseOptions(person);

    if (this.leftPerson && this.leftPerson.getRole() === person.role) {
        return;
    }

    if (this.leftPerson) {
        this.hidePerson(this.leftPerson);
    }

    this.leftPerson = this.createPerson(person);

    this.positionPersons();

    this.showPerson(this.leftPerson);
};

WindowPersons.prototype.setRightPerson = function (person) {
    person = Person.ParseOptions(person);
    person.orientation = "right";

    if (this.rightPerson && this.rightPerson.getRole() === person.role) {
        return;
    }

    if (this.rightPerson) {
        this.hidePerson(this.rightPerson);
    }

    this.rightPerson = this.createPerson(person);
    this.showPerson(this.rightPerson);
};

cleverapps.styles.WindowPersons = {
    offset: 50,
    position: {
        left: {
            x: { align: "left", dx: 50 },
            y: { align: "bottom" },
            world: true
        },

        right: {
            x: { align: "right", dx: -50 },
            y: { align: "bottom" },
            world: true
        },
        dy: {}
    }
};
