/**
 * Created by r4zi4l on 12.07.2021
 */

var Person = cleverapps.Spine.extend({
    avoidNode: "Person",

    ctor: function (options) {
        options = Person.ParseOptions(options);

        this.role = options.role;

        this.person = PersonsLibrary.getPerson(this.role);

        if (!this.person) {
            throw "Person is undefined - " + this.role;
        }

        this._super(this.person.json);

        this.setOrientation(options.orientation);

        if (!options.skin && this.hasSkin("regular")) {
            options.skin = "regular";
        }
        if (options.skin && this.hasSkin(options.skin)) {
            this.setSkin(options.skin);
        }

        this.emotion = options.emotion;
        this.setAnimation(0, this.emotion, true);

        if (cleverapps.config.debugMode && cleverapps.flags.showPersonSilhouette) {
            var dy = cleverapps.config.ui === "wooden" ? 280 : 0;
            cleverapps.bundleLoader.loadBundle("person_silhouette", {
                onSuccess: function () {
                    var silhouette = new cc.Sprite(bundles.person_silhouette.frames.silhouette);
                    silhouette.setAnchorPoint2(0.5, 0);
                    silhouette.setPositionRound(this.width / 2, dy);
                    this.addChild(silhouette);
                }.bind((this))
            });
        }
    },

    setSpeaking: function (isSpeaking, interrupt) {
        if (!this.hasAnimation("talk")) {
            return;
        }

        if (this.isSpeaking === isSpeaking) {
            return;
        }

        this.isSpeaking = isSpeaking;

        if (this.isSpeaking) {
            this.setAnimation(0, "talk", false);
            this.setCompleteListener(function () {
                this.setAnimation(0, this.isSpeaking ? "talk" : this.emotion, false);
            }.bind(this));
        } else if (interrupt) {
            this.setAnimation(0, this.emotion, true);
            this.setCompleteListener();
        } else {
            this.setCompleteListenerOnce(function () {
                this.setAnimation(0, this.emotion, true);
            }.bind(this));
        }
    },

    setActive: function (isActive) {
        if (this.isActive === isActive) {
            return;
        }

        this.isActive = isActive;

        this.setLocalZOrder(this.isActive ? -1 : -2);
    },

    getRole: function () {
        return this.role;
    },

    getOrientation: function () {
        return this.orientation;
    },

    setOrientation: function (orientation) {
        this.orientation = orientation;

        if (this.orientation === "right") {
            this.setScaleX(-1);
        } else {
            this.setScaleX(1);
        }
    }
});

Person.ParseOptions = function (options) {
    if (typeof options === "string") {
        options = {
            role: options
        };
    }

    options.emotion = options.emotion || "idle";
    options.orientation = options.orientation || "left";

    return options;
};

cleverapps.styles.Person = {
    width: 600,
    height: 800
};
