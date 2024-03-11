/**
 * Created by slava on 3/5/19
 */

var Actor = cc.Node.extend({
    ctor: function (options) {
        this._super();
        this.options = options;
        this.setAnchorPoint2();
        this.updateSize();
        this.spine = new cleverapps.Spine(options.spine);
        this.currSpine = options.spine;
        this.currSpineId = options.spineId;
        this.currSfx = options.sfx;
        
        this.addChild(this.spine);

        if (options.skin) {
            this.spine.setSkin(options.skin);
            this.currSkin = options.skin;
        }

        this.spine.setAnimation(0, Actor.ANIMATIONS.IDLE, true);

        this.alive = true;
        this.positionStyles = options.boostersAmountPosition ? options.boostersAmountPosition[Game.currentGame.boosters.amountAvailable()] : options;
        this.updatePosition();
    },

    updateSize: function () {
        this.setContentSize(this.options.size);
        this.baseScaleX = this.baseScaleY = 1;
        if (this.options.scales) {
            this.baseScaleX = this.baseScaleY = this.options.scales[cleverapps.resolution.mode];
        }
        if (this.options.scaleX) {
            this.baseScaleX *= this.options.scaleX;
        }
        if (this.options.scaleY) {
            this.baseScaleY *= this.options.scaleY;
        }
        this.setScale(this.baseScaleX, this.baseScaleY);
    },

    updatePosition: function () {
        var pos = cleverapps.clone(this.positionStyles, true);
        if (pos.wideModePositions) {
            pos = pos.wideModePositions[cleverapps.resolution.mode];
        } else {
            pos = pos.position;
        }

        this.setPositionRound(pos);

        if (this.options.spinePosition) {
            this.spine.setPositionRound(this.width / 2 + this.options.spinePosition.x, this.height / 2 + this.options.spinePosition.y);
        } else {
            this.spine.setPositionRound(this.width / 2, 0);
        }
    },

    shake: function () {
        this.stopAllActions();
        this.setScale(this.baseScaleX, this.baseScaleY);
        this.runAction(new cc.Sequence(new cc.ScaleTo(0.1, this.baseScaleX * 1.07, this.baseScaleY * 0.93), new cc.ScaleTo(0.05, this.baseScaleX, this.baseScaleY)));
    },

    showUpAnimation: function () {
        this.runStartAnimation();
        var finishAnimation = cleverapps.once(function () {
            if (!this.isStartAnimationInProgress) {
                return;
            }
            this.runAction(new cc.CallFunc(function () {
                this.finishStartAnimation();
            }.bind(this)));
        }.bind(this));

        this.runAction(new cc.Sequence(new cc.DelayTime(2.5), new cc.CallFunc(finishAnimation)));
    },

    completeAnimationOnResize: function () {
        if (this.isStartAnimationInProgress) {
            this.stopAllActions();
            this.isStartAnimationInProgress = false;
        }
    },

    runStartAnimation: function () {
        var styles = cleverapps.styles.Actor;
        this.isStartAnimationInProgress = true;
        var scene = cleverapps.scenes.getRunningScene();

        this.basePosition = this.getPosition();
        var playerTargetPosition = this.getParent().convertToNodeSpace(cc.p(
            scene.width / 2 + styles.animation.playerPositions.x,
            scene.height / 2 + styles.animation.playerPositions.y
        ));
        if (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
            playerTargetPosition.x -= styles.animation.mobileOffsetX;
        }

        this.setVisible(true);
        this.setPositionRound(playerTargetPosition.x + this.width, playerTargetPosition.y);

        this.runAction(new cc.MoveTo(0.4, playerTargetPosition).easing(cc.easeElasticOut(2.0)));
        cleverapps.meta.showControlsWhileFocused("panel_controls");

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.9),
            new cc.CallFunc(function () {
                this.animate(Actor.ANIMATIONS.HURT);
            }.bind(this)),
            new cc.DelayTime(1.2),
            new cc.CallFunc(function () {
                this.animate(Actor.ANIMATIONS.HURT);
            }.bind(this)),
            new cc.DelayTime(0.4)
        ));
    },

    finishStartAnimation: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.MoveTo(0.8, this.basePosition),
            new cc.CallFunc(function () {
                this.isStartAnimationInProgress = false;
            }.bind(this))
        ));
    },

    animate: function (animation, options) {
        options = options || {};

        if (!this.alive) {
            if (animation === Actor.ANIMATIONS.REVIVE) {
                this.alive = true;
            } else {
                return;
            }
        }

        if ([Actor.ANIMATIONS.DIE, Actor.ANIMATIONS.DIE_IDLE].indexOf(animation) !== -1) {
            this.alive = false;
        }

        if ([Actor.ANIMATIONS.HURT, Actor.ANIMATIONS.HURT2].indexOf(animation) !== -1) {
            if ([Actor.ANIMATIONS.ATTACK1, Actor.ANIMATIONS.ATTACK2, Actor.ANIMATIONS.ATTACK3, Actor.ANIMATIONS.ATTACK4].indexOf(this.animationRunning) !== -1) {
                this.animationRunning = false;
            }
            if ([Actor.ANIMATIONS.HURT, Actor.ANIMATIONS.HURT2].indexOf(this.animationRunning) !== -1 && this.animationStarted < Date.now() - 300) {
                this.animationRunning = false;
            }
        }

        if ([Actor.ANIMATIONS.DIE, Actor.ANIMATIONS.DIE_IDLE, Actor.ANIMATIONS.REVIVE, Actor.ANIMATIONS.HEAL, Actor.ANIMATIONS.ENEMY_ATTACK].indexOf(animation) !== -1) {
            this.animationRunning = false;
        }

        if (this.animationRunning) {
            return;
        }

        var sfx;
        if (this.currSfx && !options.noSFX) {
            sfx = this.currSfx[animation];
        }
        
        if (sfx) {
            this.runAction(new cc.Sequence(
                new cc.DelayTime(options.sfxDelay || cleverapps.styles.Actor.sfx.delay),
                new cc.CallFunc(function () {
                    cleverapps.audio.playSound(sfx);
                })
            ));
        }

        this.animationRunning = animation;
        this.animationStarted = Date.now();
        this.spine.setAnimation(0, animation, false);
        this.spine.setCompleteListener(function () {
            this.animationRunning = false;
            this.spine.setCompleteListener();

            var idleAnimation;
            if (options.idleAnimation) {
                idleAnimation = options.idleAnimation;
            } else if ([Actor.ANIMATIONS.DIE, Actor.ANIMATIONS.DIE_IDLE].indexOf(animation) !== -1) {
                idleAnimation = Actor.ANIMATIONS.DIE_IDLE;
            } else {
                idleAnimation = Actor.ANIMATIONS.IDLE;
            }

            this.spine.setAnimation(0, idleAnimation, true);

            options.callback && options.callback();
        }.bind(this));
    }
});

Actor.ANIMATIONS = {};
Actor.ANIMATIONS.ENEMY_ATTACK = "attack";
Actor.ANIMATIONS.ATTACK1 = "attack1";
Actor.ANIMATIONS.ATTACK2 = "attack2";
Actor.ANIMATIONS.ATTACK3 = "attack3";
Actor.ANIMATIONS.ATTACK4 = "attack4";
Actor.ANIMATIONS.IDLE = "idle";
Actor.ANIMATIONS.HURT = "hurt";
Actor.ANIMATIONS.HURT2 = "hurt2";
Actor.ANIMATIONS.DIE = "die";
Actor.ANIMATIONS.DIE_IDLE = "die_idle";
Actor.ANIMATIONS.HEAL = "heal";
Actor.ANIMATIONS.REVIVE = "revive";

cleverapps.styles.Actor = {
    sfx: {
        delay: 0.7
    },
    animation: {
        mobileOffsetX: 180,
        playerPositions: {
            x: 350,
            y: -20
        }
    }
};