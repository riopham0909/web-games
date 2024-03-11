/**
 * Created by iamso on 10.06.19.
 */

var ComicsPlayer = function (stages, animation) {
    this.stages = stages;
    this.animation = animation;

    this.stage = -1;
};

ComicsPlayer.prototype.onChangeStage = function () {
    if (this.dialogueStages === undefined || this.dialogueStages < 1) {
        this.next();
        this.dialogueStages = this.comics.dialogueStages || 1;
    }
    this.dialogueStages--;
};

ComicsPlayer.prototype.next = function () {
    this.stage++;
    if (this.stage >= this.stages.length) {
        return;
    }
    this.comics = this.stages[this.stage];
    this.runAnimation();
};

ComicsPlayer.prototype.completeShowAnimation = function () {
    if (this.inAnimation) {
        if (this.comics.idleAnimation) {
            this.animation.setCompleteListener();
            this.inAnimation = false;
            this.animation.setAnimation(0, this.comics.idleAnimation, true);
        }
    }
};

ComicsPlayer.prototype.runAnimation = function () {
    if (this.comics.showAnimation) {
        this.inAnimation = true;
        this.animation.setAnimation(0, this.comics.showAnimation, false);
        this.animation.setCompleteListener(this.animation.createListener(this.completeShowAnimation.bind(this)));
    } else {
        this.inAnimation = false;
        this.animation.setAnimation(0, this.comics.idleAnimation, true);
    }
};

var ComicsScene = cleverapps.FixedWidthScene.extend({
    ctor: function (data, f) {
        this.data = data;
        this.callback = f;

        this._super();
    },

    onSceneLoaded: function () {
        this._super(cleverapps.Environment.SCENE_COMICS);

        var data = this.data;
        var f = this.callback;

        this.createBg();

        var dialogue = this.dialogue = new Dialogue(data.dialogue, {
            autoClose: true,
            autoScroll: 3
        });

        var player = new ComicsPlayer(data.stages, this.createAnimation(data));

        dialogue.on("afterClose", f);
        dialogue.on("changedStage", player.onChangeStage.bind(player));

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0),
            new cc.CallFunc(function () {
                new DialogueView(dialogue, {
                    window: {
                        shadow: false
                    }
                });
            })
        ));
    },

    updateSize: function () {
        this._super();
        if (this.bg) {
            this.bg.baseScale = Math.max(this.width / this.bg.width, this.height / this.bg.height);
            this.bg.setScale(this.bg.baseScale);
        }
        if (this.animationNode) {
            this.animationNode.setScale(1);
        }
    },

    updatePosition: function () {
        this._super();
        this.bg && this.bg.setPositionRound(this.width / 2, this.height / 2);
        this.animationNode && this.animationNode.setPositionRound(this.width / 2, this.height / 2);
    },

    createAnimation: function (data) {
        var animationNode = this.animationNode = new cc.Node();
        animationNode.setAnchorPoint2();
        animationNode.setContentSize(this.getContentSize());
        animationNode.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(animationNode);

        var animation = this.animation = new cleverapps.Spine(data.json);
        animationNode.addChild(animation);
        animation.setPositionRound(animationNode.width / 2, animationNode.height / 2);

        return animation;
    },

    createBg: function () {
        if (!bundles.comicses.urls.bg) {
            return;
        }

        var bg = this.bg = new cc.Sprite(bundles.comicses.urls.bg);
        this.addChild(bg);
        bg.setPositionRound(this.width / 2, this.height / 2);
        this.bg.baseScale = Math.max(this.width / bg.width, this.height / bg.height);
        bg.setScale(this.bg.baseScale);

        bg.setLocalZOrder(-10);
    },

    listBundles: function () {
        var bundles = ["dialogues"];
        if (this.data.bundles) {
            bundles = bundles.concat(this.data.bundles);
        }
        return bundles;
    }
});

ComicsScene.showComics = function (f, comics) {
    cleverapps.scenes.replaceScene(new ComicsScene(comics, f), function () {
        cleverapps.meta.setEventNodes([cleverapps.scenes.getRunningScene()]);
    });
};
