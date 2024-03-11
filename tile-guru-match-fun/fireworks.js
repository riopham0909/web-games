/**
 * Created by andrey on 24.05.17.
 */

var Fireworks = cc.Node.extend({
    ctor: function (window, options) {
        this._super();

        options = options || {};

        this.count = 0;
        this.state = Date.now();
        this.window = window;
        this.type = options.type || "confetti";

        switch (this.type) {
            case "fireworks":
                this.sound = options.sound || bundles.fireworks.urls.fireworks_effect;
                this.json = options.json || bundles.fireworks.jsons.fireworks_json;
                break;
            case "confetti":
                this.sound = options.sound || bundles.fireworks.urls.confetti_effect;
                this.json = options.json || bundles.fireworks.jsons.confetti_json;
                break;
        }

        this.setAnchorPoint2();

        this.started = false;
        this.ready = false;

        this.updateSize();
        this.updatePosition();
    },

    start: function (delay) {
        if (this.started) {
            return;
        }
        this.started = true;
        this.ready = false;

        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay || 0),
            new cc.CallFunc(function () {
                this.ready = true;
                this.process();
            }.bind(this))
        ));
    },

    stop: function () {
        if (this.started) {
            this.stopAllActions();
            this.started = false;
        }
    },

    onEnter: function () {
        this._super();

        cleverapps.bundleLoader.loadBundle("fireworks", {
            onSuccess: function () {
                this.process();
            }.bind(this)
        });
    },

    onExit: function () {
        this._super();

        cleverapps.bundleLoader.deleteBundle("fireworks");
    },

    updateSize: function () {
        var sceneSize = cleverapps.UI.getSceneSize();
        var deltaX = (sceneSize.width - this.width) / 2;
        var deltaY = (sceneSize.height - this.height) / 2;

        this.setContentSize(sceneSize);

        this.children.forEach(function (child) {
            child.setPosition(child.x + deltaX, child.y + deltaY);
        });
    },

    updatePosition: function () {
        var sceneSize = cleverapps.UI.getSceneSize();
        this.setPositionRound(sceneSize.width / 2, sceneSize.height / 2);
    },

    process: function () {
        if (!this.started || !this.ready || !cleverapps.bundleLoader.isLoaded("fireworks")) {
            return;
        }

        var delayToNext;

        if (this.type === "confetti") {
            delayToNext = this.confettiAnimation();
        } else if (this.type === "fireworks") {
            delayToNext = this.fireworksAnimation();
        }

        this.count += 1;

        if (delayToNext) {
            this.stopAllActions();
            this.runAction(new cc.Sequence(
                new cc.DelayTime(delayToNext),
                new cc.CallFunc(this.process.bind(this))
            ));
        }
    },

    confettiAnimation: function () {
        var fireworks = new cleverapps.Spine(this.json);

        if (["heroes", "tropical"].indexOf(cleverapps.config.ui) === -1) {
            cleverapps.UI.fitToBox(fireworks, {
                minScale: 0.6,
                width: this.parent.width
            });
        }

        fireworks.setAnimation(0, "animation1", false);
        fireworks.setCompleteListenerRemove();
        fireworks.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(fireworks);

        cleverapps.audio.playSound(this.sound);

        return undefined;
    },

    fireworksAnimation: function () {
        var styles = cleverapps.styles.Fireworks.fireworks;

        var oldState = cleverapps.Random.state;
        cleverapps.Random.seed(this.state);

        if (!this.delays || !this.delays.length) {
            this.delays = cleverapps.arrayFill(cleverapps.Random.random(5, 10), 0).map(function (value, index) {
                if (index === 0) {
                    return Fireworks.DELAYS.intermission + cleverapps.Random.random(0, 2000);
                }

                return Fireworks.DELAYS.sequentBase + cleverapps.Random.random(0, Fireworks.DELAYS.sequentRandom);
            });
        }

        var delay = this.delays.pop();
        delay *= cleverapps.Random.random(0.8, 1.1, 0.1);
        delay /= 1000;

        var rect = cc.rect(
            this.count % 2 ? (this.width + this.window.width) / 2 : 0,
            this.height / 2 - styles.bottom,
            (this.width - this.window.width) / 2,
            styles.bottom + styles.top
        );

        if (rect.width < styles.minWidth) {
            return delay;
        }

        var fireworks = new cleverapps.Spine(this.json);
        fireworks.setCascadeColorEnabled(true);
        fireworks.setColor(cleverapps.Random.choose(Fireworks.COLORS));
        fireworks.setAnimation(0, cleverapps.Random.choose(fireworks.listAnimations()), false);
        fireworks.setCompleteListenerRemove();
        this.addChild(fireworks);

        rect = cc.rectSubPadding(rect, cc.padding(fireworks.height / 2, fireworks.width / 2));

        var randomScale = cleverapps.Random.choose([-1, 1]);
        var randomX = cleverapps.Random.random(rect.x, rect.x + rect.width);
        var randomY = cleverapps.Random.random(rect.y, rect.y + rect.height);

        fireworks.setScaleX(randomScale);
        fireworks.setAnchorPoint2();
        fireworks.setPositionRound(randomX, randomY);

        this.state = cleverapps.Random.state;
        cleverapps.Random.state = oldState;

        cleverapps.audio.playSound(this.sound, {
            throttle: 0
        });

        return delay;
    }
});

Fireworks.DELAYS = {
    sequentBase: 3000,
    sequentRandom: 500,
    intermission: 12000
};

Fireworks.COLORS = [
    cc.color(50, 245, 247, 255), // blue
    cc.color(160, 255, 114, 255), // green
    cc.color(255, 255, 0, 255), // yellow
    cc.color(255, 54, 54, 255), // red
    cc.color(255, 164, 248, 255) // pink
];

cleverapps.styles.Fireworks = {
    fireworks: {
        top: 500,
        bottom: 150,
        minWidth: 400
    }
};
