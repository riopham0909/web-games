/**
 * Created by vladislav on 11.01.2022
 */

var AdBubbleView = cleverapps.Spine.extend({
    ctor: function (adBubble) {
        this.adBubble = adBubble;

        this._super(bundles.ads_bubble.jsons.ads_bubble_json);

        var styles = cleverapps.styles.AdBubbleView;

        this.setContentSize2(styles);
        this.spine.setPositionRound(this.width / 2, this.height / 2);

        this.setSkin(this.adBubble.getSkin());

        cleverapps.UI.onClick(this, this.adBubble.onClick.bind(this.adBubble));
        cleverapps.UI.applyHover(this);

        this.adBubble.on("update", this.createListener(this.updateVisibility.bind(this)), this);
        this.adBubble.on("pop", this.createListener(this.pop.bind(this)), this);

        this.updateVisibility(this.adBubble.isActive());
    },

    updateVisibility: function (isActive) {
        if (isActive) {
            this.show();
        } else {
            this.hide();
        }
    },

    hide: function () {
        this.setVisible(false);
    },

    show: function () {
        this.setCompleteListener();
        this.setAnimationAndIdleAfter("showup", "idle");
    },

    pop: function () {
        this.setAnimation(0, "hide", false);
        this.setCompleteListenerOnce(function () {
            this.setVisible(false);
        }.bind(this));
    },

    onExit: function () {
        this.adBubble.onExit();
    }
});

cleverapps.styles.AdBubbleView = {
    width: 150,
    height: 150
};