/**
 * Created by mac on 7/8/18
 * @return {boolean}
 */

var InviteButton = cleverapps.UI.Button.extend({
    ctor: function (options) {
        this.options = options || {};

        this.options.onSuccess = this.options.onSuccess || function () {};

        var styles = cleverapps.styles.InviteButton;

        this._super({
            type: this.options.type,
            width: this.options.width || styles.width,
            height: this.options.height || styles.height,
            onClicked: this.onClicked.bind(this),
            text: "InviteButton.Text"
        });
    },

    onClicked: function () {
        cleverapps.platform.inviteFriends(function (code) {
            if (code === cleverapps.CODE_SUCCEED) {
                this.options.onSuccess();
            }
        }.bind(this));
    }
});

cleverapps.styles.InviteButton = {
    width: 200,
    height: 110
};
