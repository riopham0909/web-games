/**
 * Created by mac on 7/8/18
 * @return {boolean}
 */

var LoginButton = cleverapps.UI.Button.extend({
    ctor: function (options) {
        this.options = options || {};

        this.options.onSuccess = this.options.onSuccess || function () {};
        this.options.onFailure = this.options.onFailure || function () {};

        this.source = this.options.source || cleverapps.platform.source;
        var styles = cleverapps.styles.LoginButton;
        var settings = {
            type: this.options.type,
            width: this.options.width || styles.width,
            height: this.options.height || styles.height,
            onClicked: this.onClicked.bind(this),

            text: this.getText(),
            icons: {
                "%%": this.getIcon()
            }
        };

        var isCustom = styles.content[this.source] !== undefined;
        if (isCustom) {
            settings.height = styles.customHeight;
            settings.content = this.getContent();
            settings.text = undefined;
            settings.icons = undefined;
            settings.type = {
                button_png: bundles.buttons.frames.sign_in_button_png,
                button_on_png: bundles.buttons.frames.sign_in_button_on_png,
                button_off_png: bundles.buttons.frames.sign_in_button_png,
                keepRadius: false
            };
        }

        this._super(settings);
    },

    getContent: function () {
        return new cc.Sprite(cleverapps.styles.LoginButton.content[this.source]);
    },

    getIcon: function () {
        return cleverapps.styles.LoginButton.icon.image[this.source];
    },

    getText: function () {
        return (this.getIcon() ? "%% " : "") + "SignIn";
    },

    onClicked: function () {
        if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
            cleverapps.notification.create("SocialManager.Initialization");
            return;
        }

        var callback = function () {
            cleverapps.social.login(function (code) {
                if (code === cleverapps.CODE_SUCCEED) {
                    this.options.onSuccess();
                } else {
                    this.options.onFailure();

                    cleverapps.SocialManager.onFailedLogin();
                }
            }.bind(this), {
                source: this.source
            });
        }.bind(this);

        if (this.options.multiSocials && cc.sys.isNative) {
            this.stopAllActions();
            this.setScale(0.95);
            this.runAction(new cc.Sequence(
                new cc.DelayTime(0.05),
                new cc.CallFunc(callback),
                new cc.ScaleTo(0.15, 1).easing(cc.easeBackInOut())
            ));
        } else {
            callback();
        }
    }
});

cleverapps.styles.LoginButton = {
    width: 200,
    height: 110,

    icon: {
        image: {
            mobile_ok: bundles.main.frames.login_ok_icon_png,
            web_ok: bundles.main.frames.login_ok_icon_png,
            mobile_vk: bundles.main.frames.login_vk_icon_png,
            web_vk: bundles.main.frames.login_vk_icon_png,
            mbga: bundles.main.frames.login_mobage_icon_png,
            sp_mbga: bundles.main.frames.login_mobage_icon_png,
            draugiem: bundles.main.frames.login_draugiem_icon_png,
            web_mm: bundles.main.frames.login_mm_icon_png,
            mobile_mm: bundles.main.frames.login_mm_icon_png,
            fotostrana: bundles.main.frames.login_fs_icon_png,
            plinga: bundles.main.frames.login_plinga_icon_png,
            kongregate: bundles.main.frames.login_kongregate_icon_png
        }
    },

    customHeight: 100,
    content: {
        facebook: bundles.social_buttons.frames.sign_in_facebook,
        microsoft: bundles.social_buttons.frames.sign_in_facebook,
        androidsocial: bundles.social_buttons.frames.sign_in_google,
        applesocial: bundles.social_buttons.frames.sign_in_apple
    }
};
