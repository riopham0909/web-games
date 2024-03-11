/**
 * Created by r4zi4l on 09.11.2021
 */

var PassTickets = cc.Node.extend({
    ctor: function (options) {
        this.options = options;
        
        var styles = cleverapps.styles.PassTickets;

        this._super();
        this.setAnchorPoint2();

        if (bundles.passtickets.frames.tickets_layout_background) {
            var background = cleverapps.UI.createScale9Sprite(bundles.passtickets.frames.tickets_layout_background, cleverapps.UI.Scale9Rect.TwoPixelXY);
            background.setContentSize2(cleverapps.styles.PassTicket.width, background.height);
            background.setPositionRound(background.width / 2, background.height / 2);
            this.setContentSize2(background.width, background.height);
            this.addChild(background);
        }

        var free = new PassTicket(options);
        free.setPositionRound(styles.free);
        this.addChild(free);

        this.addPremiumTicket();

        options.passLogic.onShowWindowListeners.passTickets = this.createListener(this.addPremiumTicket.bind(this));
    },

    addPremiumTicket: function () {
        if (this.premium) {
            this.premium.removeFromParent();
        }

        this.premium = new PassTicket(Object.assign({}, this.options, {
            premium: true
        }));
        this.premium.setPositionRound(cleverapps.styles.PassTickets.premium);
        this.addChild(this.premium);
    }

});

cleverapps.styles.PassTickets = {
    free: {
        x: { align: "center", dx: -20 },
        y: { align: "center", dy: -170 }
    },

    premium: {
        x: { align: "center", dx: -20 },
        y: { align: "center", dy: 145 }
    }
};
