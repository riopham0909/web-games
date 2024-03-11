/**
 * Created by iamso on 04.06.19.
 */

var TransitionAnimation = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint2();
        this.setLocalZOrder(TransitionAnimation.ZORDER);

        this.curtains = new cleverapps.Spine(bundles.transition.jsons.transition_curtains_json);
        this.addChild(this.curtains);

        this.person = new cleverapps.Spine(bundles.transition.jsons.transition_person_json);
        this.addChild(this.person);

        var skins = cleverapps.Spine.getSkins(bundles.transition.jsons.transition_curtains_json);
        if (skins.length > 0) {
            var skin = skins[levels.user.getVirtualLevel() % skins.length];
            this.curtains.setSkin(skin);
        }
    },

    updateSize: function () {
        var scene = cleverapps.scenes.getRunningScene();
        var curtainsScale = 1.1 * Math.max(scene.height / this.curtains.height, scene.width / this.curtains.width);

        if (curtainsScale > 1) {
            this.curtains.setScale(curtainsScale);
        }
    },

    updatePosition: function () {
        this.setPositionRound(this.parent.width / 2, this.parent.height / 2);
    },

    closeCurtains: function (f, silent) {
        var actions = [
            function (f) {
                f = cleverapps.once(f);

                this.curtains.setAnimation(0, "close", false);
                this.curtains.setCompleteListener(f);
                this.person.setAnimation(0, "close", false);

                if (silent) {
                    this.curtains.clearTrack(0);
                    this.person.clearTrack(0);
                    f();
                } else {
                    this.runAction(new cc.Sequence(
                        new cc.DelayTime(cleverapps.styles.TransitionAnimation.open.delay),
                        new cc.CallFunc(f)
                    ));
                }
            }.bind(this),

            function (f) {
                this.showLoadingAnimation(silent);

                cc.eventManager.removeListeners(this);
                f();
            }.bind(this)

        ];

        new ActionPlayer(actions).play(f);
    },

    openCurtains: function (f, silent) {
        f = cleverapps.once(f);

        this.curtains.setAnimation(0, "open", false);
        this.curtains.setCompleteListener(f);
        this.person.setAnimation(0, "open", false);

        this.hideLoading();

        if (silent) {
            f();
            return;
        }

        this.runAction(new cc.Sequence(
            new cc.DelayTime(cleverapps.styles.TransitionAnimation.open.delay),
            new cc.CallFunc(f)
        ));
    },

    showLoadingAnimation: function (silent) {
        var json = bundles.main.jsons.wait_transition_json;
        var styles = cleverapps.styles.TransitionAnimation.loading;

        if (!json || !cleverapps.bundleLoader.isLoaded(cleverapps.Spine.listBundles(json))) {
            return;
        }

        var loading = this.loading = new cc.Node();
        this.addChild(loading);

        var animation = new cleverapps.Spine(json);
        loading.addChild(animation);
        animation.setAnimation(0, "idle", true);

        var text = cleverapps.UI.generateOnlyText("Loading", cleverapps.styles.FONTS.TRANSITION_LOADING_TEXT);
        loading.addChild(text);
        text.setPositionRound(styles.textPos);

        cleverapps.UI.wrap(loading);

        loading.setAnchorPoint2();
        loading.setPositionRound(styles);

        if (silent) {
            return;
        }

        loading.setVisible(false);
        loading.setScale(0);
        loading.runAction(new cc.Sequence(
            new cc.Show(),
            new cc.ScaleTo(0.3, 1)
        ));
    },

    hideLoading: function () {
        if (this.loading) {
            this.loading.removeFromParent();
            this.loading = undefined;
        }
    }
});

TransitionAnimation.ZORDER = 1000;

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TRANSITION_LOADING_TEXT: {
        size: 50,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.TransitionAnimation = {
    loading: {
        x: { align: "center" },
        y: { align: "center", dy: -400 },

        textPos: {
            x: { align: "center" },
            y: { align: "center", dy: 60 }
        }
    },

    open: {
        delay: 1.5
    }
};
