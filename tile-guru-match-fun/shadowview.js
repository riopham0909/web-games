/**
 * Created by iamso on 19.08.19.
 */

var ShadowView = cc.Node.extend({
    ctor: function () {
        this._super();

        this.shadow = new ShadowLayer();
        this.shadow.setOpacity(0);
        this.addChild(this.shadow);
        this.shadow.visible = false;
        this.show = false;

        this.loading = WaitWindow.prototype.showLoading.call(this);
        this.addChild(this.loading);
        this.loading.setLocalZOrder(1000);
        this.loading.visible = false;

        if (!cleverapps.windows) {
            throw new Error("No cleverapps.windows cleverapps.allInitialized - " + cleverapps.allInitialized);
        }

        cleverapps.windows.onHideShadow = this.createListener(this.deleteShadow.bind(this));
        cleverapps.windows.onShowShadow = this.createListener(this.createShadow.bind(this));
        cleverapps.windows.onMoveShadowUp = this.createListener(this.moveUp.bind(this));
        cleverapps.windows.onMoveShadowDown = this.createListener(this.moveDown.bind(this));

        cleverapps.windows.onHideLoading = this.createListener(this.hideLoading.bind(this));
        cleverapps.windows.onShowLoading = this.createListener(this.showLoading.bind(this));
    }
});

ShadowView.prototype.updatePosition = function () {
    var scene = cleverapps.scenes.getRunningScene();
    var position = this.convertToNodeSpaceAR(cc.p(scene.width / 2, scene.height / 2));
    this.loading.setPositionRound(position);
};

ShadowView.prototype.updateSize = function () {
    this.updatePosition();
};

ShadowView.prototype.hideLoading = function () {
    this.deleteShadow();
    this.moveDown();
    this.loading.stopAllActions();
    this.loading.setVisible(false);
};

ShadowView.prototype.showLoading = function () {
    this.loading.stopAllActions();
    this.moveUp();
    this.loading.runAction(new cc.Sequence(
        new cc.DelayTime(0.1),
        new cc.Show(),
        new cc.DelayTime(0.90),
        new cc.CallFunc(this.createShadow.bind(this, true))
    ));
};

ShadowView.prototype.createShadow = function (slow) {
    if (this.show) {
        return;
    }

    this.show = true;
    this.shadow.stopAllActions();
    this.shadow.visible = true;

    var styles = cleverapps.styles.ShadowView;
    var duration = slow ? styles.slowDuration : styles.duration;

    this.shadow.updateSize();
    this.shadow.runAction(new cc.FadeTo(duration, styles.opacity));
};

ShadowView.prototype.deleteShadow = function () {
    if (!this.show) {
        return;
    }

    this.show = false;
    this.shadow.stopAllActions();

    var styles = cleverapps.styles.ShadowView;

    this.shadow.runAction(new cc.Sequence(
        new cc.FadeTo(styles.duration, 0),
        new cc.CallFunc(function () {
            this.shadow.visible = false;
        }.bind(this))
    ));
};

ShadowView.prototype.moveUp = function () {
    this.setLocalZOrder(30);
};

ShadowView.prototype.moveDown = function () {
    this.setLocalZOrder(BaseWindow.WINDOWS_ZORDER - 3);
};

cleverapps.styles.ShadowView = {
    duration: 0.3,
    slowDuration: 0.6,
    opacity: 150
};
