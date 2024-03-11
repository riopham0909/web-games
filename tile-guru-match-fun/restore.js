/**
 * Created by andrey on 20.08.2020.
 */

var Restore = cc.Node.extend({
    ctor: function (parentWindow) {
        this._super();

        this.parentWindow = parentWindow;

        var text = cleverapps.UI.generateOnlyText("RestorePurchases", cleverapps.styles.FONTS.TERMS_LINK_TEXT);
        this.addChild(text);

        cleverapps.UI.wrap(this);

        cleverapps.UI.applyHover(this);
        cleverapps.UI.onClick(this, this.onPressed.bind(this));
    },

    onPressed: function () {
        var waitWindow = new WaitWindow();
        var stopWait = cleverapps.waitNoMore(5000, function () {
            if (waitWindow) {
                waitWindow.close();
                waitWindow = undefined;
            }
        });

        cleverapps.payments.restoreSubscriptions();
        cleverapps.subscription.on("update", this.createListener(function () {
            stopWait && stopWait();

            if (cleverapps.subscription.isActive()) {
                this.parentWindow.close();
                new SubscriptionWindow();
            }
        }.bind(this)), this);
    }
});