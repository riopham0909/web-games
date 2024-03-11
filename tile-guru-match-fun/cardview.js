/**
 * Created by slava on 4/3/20
 */

CardView.prototype.screenShowUp = function (f, silent) {
    if (silent) {
        this.visible = true;
        f();
        return;
    }

    var originalPosition = this.getPosition();
    var distance = cleverapps.UI.getSceneSize().height + cleverapps.styles.CardView.showUpOffset;
    var showUpTime = distance / 1800;

    this.y += distance;
    this.visible = true;

    this.runAction(
        new cc.Sequence(
            new cc.MoveTo(showUpTime, originalPosition).easing(cc.easeIn(5)),
            new cc.CallFunc(f)
        )
    );
};

CardView.prototype.createAnimation = function () {
    this.animation = new cc.Sprite(bundles.card.frames.tile);
    this.fitAnimationScale();
    this.icon = new cc.Sprite(bundles.card.frames.skin_0);
    this.icon.setScale(this.animation.getScale());
    this.icon.setPosition(this.width / 2, this.height / 2);
    this.addChild(this.icon);
    this.onChangeValue();
    this.animation.setAnchorPoint(0, 1);
    this.animation.setPosition(0, this.height);

    this.animation.setCascadeColorEnabled(true);

    if (!cleverapps.environment.isAdministratorScene() && !cleverapps.environment.isEditorScene()) {
        if (this.onTouchHandler) {
            this.onTouchHandler.remove();
            this.onTouchHandler = undefined;
        }

        this.onTouchHandler = cleverapps.UI.onPressed(this.animation, this.card.onClickListener.bind(this.card));
    }
};

CardView.prototype.onChangeValue = function () {
    var image = this.card.getSkin();
    if (!bundles.card.frames[image]) {
        image = "skin_0";
        this.card.value = 0;
    }
    this.icon.setSpriteFrame(bundles.card.frames[image]);

    // if (cleverapps.config.debugMode) {
    //     if (this.randomSign) {
    //         this.randomSign.removeFromParent();
    //     }
    //
    //     if (this.card.random) {
    //         this.randomSign = new cc.Sprite(bundles.card.frames.skin_random);
    //         this.randomSign.setPosition(this.animation.width / 2, this.animation.height / 2);
    //         this.animation.addChild(this.randomSign);
    //     }
    // }
};

CardView.prototype.highlight = function () {
    var highlight = new cleverapps.Spine(bundles.card.jsons.explode_json);
    highlight.setLocalZOrder(-1);
    highlight.setPosition(this.width / 2, this.height / 2);
    highlight.setAnimation(0, "highlight", false);
    highlight.setCompleteListenerRemove();
    this.addChild(highlight);
};

CardView.prototype.explode = function () {
    var explode = new cleverapps.Spine(bundles.card.jsons.explode_json);
    this.addChild(explode);
    explode.setLocalZOrder(100);
    explode.setPosition(this.width / 2, this.height / 2);
    explode.replaceParentSamePlace(this.getParent().getParent());
    explode.setAnimation(0, "explode", false);
    explode.setCompleteListenerRemove();
    explode.runAction(new cc.ScaleTo(0.3, 1.25).easing(cc.easeIn(0.7)));
    var explosionScale = this.getScale() * 1.15;
    this.runAction(new cc.Sequence(
        new cc.Spawn(
            new cc.MoveBy(0.28, 0, 25),
            new cc.ScaleTo(0.28, explosionScale).easing(cc.easeIn(0.7))
        ),
        new cc.RemoveSelf()
    ));
};

CardView.prototype.onFlip = function (silent) {
    var target = this.card.isOpen() ? cleverapps.styles.COLORS.WHITE : cleverapps.styles.COLORS.DARK_TILE_COLOR;
    var r = target.r, g = target.g, b = target.b;
    if (silent) {
        this.setColor(target);
    } else {
        this.runAction(
            new cc.TintTo(0.2, r, g, b)
        );
    }
};

cleverapps.overrideColors(cleverapps.styles.COLORS, {
    DARK_TILE_COLOR: new cc.Color(150, 150, 150, 255)
});
