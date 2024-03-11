/**
 * Created by vladislav on 10.09.2019
 */

var LanternView = cc.Node.extend({
    ctor: function (lantern, parent) {
        this._super();

        this.lantern = lantern;

        this.setAnchorPoint2();
        this.setLocalZOrder(2);
        this.styles = cleverapps.styles.LanternView;

        this.animation = new cleverapps.Spine(bundles.lantern.jsons.lantern_json);
        this.addChild(this.animation);
        this.setContentSize2(this.animation.getContentSize());
        this.animation.setPositionRound(this.width / 2, this.height / 2);

        parent = parent || cleverapps.scenes.getRunningScene().fieldView;
        parent.addChild(this);
    },

    show: function () {
        this.animation.setAnimation(0, "idle_" + this.lantern.getCurrentStreak(), true);
        var startPosition = this.getParent().convertToNodeSpace(cc.p(-this.width, 0));
        if (!startPosition.x) {
            startPosition.x = 0;
        }
        startPosition.y = this.styles.show.y;
        var scale = 1 / this.parent.scale;
        var offsetX = this.styles.offset.x * (scale < 1 ? scale : 1);
        var offsetY = this.styles.offset.y * (scale < 1 ? scale : 1);
        var targetPosition = cc.p(this.parent.width / 2 + offsetX, this.parent.height / 2 + offsetY);
        this.setPositionRound(startPosition);

        if (cleverapps.config.name === "heroes") {
            this.runAction(new cc.MoveTo(0.5, targetPosition));
        } else {
            this.setRotation(45);
            this.runAction(new cc.Spawn(
                new cc.MoveTo(0.5, targetPosition),
                new cc.RotateTo(0.5, 0)
            ));
        }

        cleverapps.audio.playSound(bundles.lantern.urls.lanternshow_effect);
    },

    hide: function () {
        var hidePosition = this.getParent().convertToNodeSpace(cc.p(-this.width, 0));
        hidePosition.y = this.styles.hide.y;
        this.animation.setAnimation(0, "out_" + this.lantern.getCurrentStreak(), false);
        this.animation.setCompleteListener(function () {
            this.animation.setAnimation(0, "idle_" + this.lantern.getCurrentStreak(), true);

            var action = new cc.Spawn(
                new cc.MoveTo(0.5, hidePosition),
                new cc.RotateTo(0.4, -45)
            );
            if (cleverapps.config.name === "heroes") {
                action = new cc.MoveTo(0.5, hidePosition);
            }

            this.runAction(new cc.Sequence(
                action,
                new cc.RemoveSelf()
            ));
        }.bind(this));

        cleverapps.audio.playSound(bundles.lantern.urls.lanternhide_effect);
    }
});

cleverapps.styles.LanternView = {
    offset: {
        x: 0,
        y: 150
    },
    show: {
        y: 100
    },
    hide: {
        y: 1000
    }
};