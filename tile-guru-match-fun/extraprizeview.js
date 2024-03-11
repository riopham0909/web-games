/**
 * Created by slava on 7/10/19
 */

var ExtraPrizeView = cc.Node.extend({
    ctor: function (extraPrize) {
        this.extraPrize = extraPrize;

        this._super();

        var bg = new cc.Sprite(cleverapps.skins.getSlot("sidebarBg") || bundles.extra_prizes.frames.icon_bg);
        SceneDecors.add(bg, cleverapps.skins.getSlot("sidebarIcon"));

        this.setAnchorPoint2();
        this.setContentSize(bg.width, bg.height);

        bg.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(bg);

        this.addIcon();
        this.addTitle();
    },

    addIcon: function () {
        var params = this.extraPrize.getIcon();
        var icon;

        if (params.json) {
            icon = new cleverapps.Spine(params.json);
            if (params.open) {
                icon.setAnimation(0, params.open, false);
                icon.addAnimation(0, params.idle, params.repeat !== false);
            } else {
                icon.setAnimation(0, params.idle, params.repeat !== false);
            }
        } else {
            cleverapps.throwAsync("Extra prize icon is undefined - " + this.extraPrize.type);
            icon = new cc.Node();
        }

        this.icon = icon;
        icon.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(icon);
    },

    addTitle: function () {
        var styles = cleverapps.styles.SideBarIconView.text;

        var background = this.titleBackground = cleverapps.UI.createScale9Sprite(bundles.extra_prizes.frames.icon_text_bg, cleverapps.UI.Scale9Rect.TwoPixelXY);
        background.setContentSize2(styles);
        background.setPositionRound(styles);
        this.addChild(background);

        var title = this.title = new cc.Node();
        title.setAnchorPoint2();
        title.setPositionRound(background.width / 2, background.height / 2 + styles.offsetY);
        background.addChild(title);

        this.updateTitleText();
    },

    updateTitleText: function () {
        var styles = cleverapps.styles.SideBarIconView.text;

        if (this.title) {
            this.title.removeAllChildren();
        }

        var value = this.extraPrize.getText();
        if (value.text) {
            var text = cleverapps.UI.generateTTFText(value.text, cleverapps.styles.FONTS.SIDEBAR_ICON_TEXT);

            text.fitTo(styles.width * 0.86, styles.height * 0.86);
            text.baseScale = text.scale;
        }

        text.setPositionRound(this.title.width / 2, this.title.height / 2);
        this.title.addChild(text);
    },

    showUp: function (delay) {
        this.setVisible(false);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay / 1000),
            new cc.ScaleTo(0, 0),
            new cc.Show(),
            new cc.ScaleTo(0.23, 1.1).easing(cc.easeInOut(1.2)),
            new cc.PlaySound(bundles.main.urls.reward_icon_show_effect, { throttle: 0 }),
            new cc.ScaleTo(0.1, 1).easing(cc.easeInOut(1.2))
        ));
    },

    collectReward: function (delay) {
        this.setCascadeOpacityEnabledRecursively(true);

        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay / 1000),
            new cc.ScaleTo(0.2, 0.9).easing(cc.easeOut(1.5)),
            new cc.ScaleTo(0.2, 1.2).easing(cc.easeOut(1.5)),
            new cc.Spawn(
                new cc.ScaleTo(0.2, 0.5),
                new cc.FadeOut(0.2)
            ),
            new cc.Hide()
        ));

        this.icon.runAction(new cc.Sequence(
            new cc.DelayTime(delay / 1000),
            cleverapps.UI.animateCollect(this.icon, "default", {
                duration: 0.7,
                collectEffect: true,
                replaceParentOnStart: true,
                sound: bundles.menubar.urls.exp_fly_finish_effect
            }),
            new cc.RemoveSelf()
        ));
    }
});
