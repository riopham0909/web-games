/**
 * Created by vladislav on 02.10.2020
 */

var EyeBoosterView = cc.Node.extend({
    ctor: function (booster, boardView) {
        this._super();

        this.booster = booster;
        this.boardView = boardView;
        this.board = this.boardView.board;

        this.setAnchorPoint2();

        this.soundNode = new cc.Node();
        this.addChild(this.soundNode);

        this.booster.on("giveBonus", this.giveBonus.bind(this), this);

        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            EyeBoosterView.ANIMATION_TIME_SCALE = 0.6;
            EyeBoosterView.SINGLE_PASS_TIME = 2.25;
        }
    },

    giveBonus: function () {
        this.boardView.toggleElements(false);

        var scene = cleverapps.scenes.getRunningScene();

        var animation = new cleverapps.Spine(bundles.game.jsons.eye_booster_json);
        scene.addChild(animation);
        animation.setLocalZOrder(110);
        animation.setPositionRound(scene.width / 2, scene.height / 2);
        animation.setAnimation(0, "show", false);
        animation.setCompleteListener(function () {
            animation.setAnimation(0, "activate", false);
            animation.setCompleteListenerRemove();
            animation.setTimeScale(EyeBoosterView.ANIMATION_TIME_SCALE);

            var elements = [];
            this.boardView.placeholders.forEach(function (wordPlaceholders, wordIndex) {
                wordPlaceholders.forEach(function (placeholder, letterIndex) {
                    if (!this.board.foundWordsSet[this.board.words[wordIndex]]) {
                        var letterSprite = this.boardView.createLetter(this.board.words[wordIndex][letterIndex].toUpperCase());
                        this.boardView.grid.addChild(letterSprite);
                        letterSprite.updatePosition = function () {
                            letterSprite.setPositionRound(this.boardView.placeholders[wordIndex][letterIndex].x, this.boardView.placeholders[wordIndex][letterIndex].y + cleverapps.styles.BoardView.Letter.paddingBottom);
                        }.bind(this);
                        letterSprite.updatePosition();
                        elements.push(letterSprite);
                    }
                }.bind(this));
            }.bind(this));

            elements.sort(function (a, b) {
                return a.x - b.x;
            });

            this.soundNode.runAction(new cc.RepeatForever(new cc.Sequence(
                new cc.PlaySound(bundles.game.urls.eye_booster_effect),
                new cc.DelayTime(2.4)
            )));

            this.runPass(elements, 0);
        }.bind(this));

        cleverapps.audio.playSound(bundles.game.urls.eye_booster_start_effect);
    },

    runPass: function (elements, index) {
        if (index === EyeBoosterView.PASSES_COUNT) {
            this.onAllPassesFinished(elements);
            return;
        }

        var styles = cleverapps.styles.EyeBoosterView;
        var MIN_OPACITY_OFFSET = styles.MIN_OPACITY_OFFSET;
        var MAX_OPACITY_OFFSET = styles.MAX_OPACITY_OFFSET;

        var minX = elements[0].x - MIN_OPACITY_OFFSET;
        var maxX = elements[elements.length - 1].x + MIN_OPACITY_OFFSET;
        var dist = maxX - minX;

        var cb = cleverapps.wait(elements.length, this.runPass.bind(this, elements, index + 1));

        elements.forEach(function (placeholder) {
            var x;
            if (index % 2 === 0) {
                x = placeholder.x;
            } else {
                x = maxX - placeholder.x;
            }

            var delay = (x - MIN_OPACITY_OFFSET - minX) / dist * EyeBoosterView.SINGLE_PASS_TIME;
            var duration = (x - MAX_OPACITY_OFFSET - minX) / dist * EyeBoosterView.SINGLE_PASS_TIME - delay;
            placeholder.setOpacity(0);
            placeholder.runAction(new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.FadeIn(duration),
                new cc.FadeOut(duration),
                new cc.CallFunc(cb)
            ));
        });
    },

    onAllPassesFinished: function (elements) {
        this.soundNode.stopAllActions();

        elements.forEach(function (element) {
            element.removeFromParent();
        });

        this.boardView.toggleElements(true);
        this.boardView.showUpLettersAnimation();
        this.boardView.showUpCoinsAnimation();
        this.boardView.showUpStarsAnimation();
    }
});

EyeBoosterView.ANIMATION_TIME_SCALE = 0.8;
EyeBoosterView.SINGLE_PASS_TIME = 1.8;
EyeBoosterView.PASSES_COUNT = 2;

cleverapps.styles.EyeBoosterView = {
    MIN_OPACITY_OFFSET: 300,
    MAX_OPACITY_OFFSET: 100
};