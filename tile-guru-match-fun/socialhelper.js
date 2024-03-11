/**
 * Created by vladislav on 1/30/2024
 */

var SocialHelper = {
    NoSocialPlatforms: [Pliega, Rustore, Huzcom, IOSCh, Playable, GDCom, Xiaomi, PWA],

    create: function () {
        if (cleverapps.platform.oneOf(SocialHelper.NoSocialPlatforms)) {
            cleverapps.social = new cleverapps.NoSocial();
            return cleverapps.social;
        }

        if (WebViewFacebook.isAvailable() && (cleverapps.AndroidSocial.isAvailable() || cleverapps.AppleSocial.isAvailable())) {
            cleverapps.social = new cleverapps.SelectSocial();
            return cleverapps.social;
        }

        var socials = TestSocial.isAppropriate() ? {
            default: TestSocial
        } : {
            instant: cleverapps.InstantSocial,
            mobile_ok: cleverapps.OKSocial,
            web_ok: cleverapps.OKSocial,
            mobile_mm: cleverapps.MobileMyMailRuSocial,
            web_mm: cleverapps.MyMailRuSocial,
            mobile_vk: cleverapps.MobileVkSocial,
            web_vk: cleverapps.VKSocial,
            sp_mbga: cleverapps.SPMobageSocial,
            mbga: cleverapps.MobageSocial,
            draugiem: cleverapps.DraugiemSocial,
            fotostrana: cleverapps.FotoStranaSocial,
            cleverapps: cleverapps.XsollaSocial,
            yandex: cleverapps.YandexSocial,
            macos: cleverapps.AppleSocial,
            gpg: cleverapps.AndroidSocial,
            amazon: WebViewFacebook,
            samsung: cleverapps.SamsungSocial,
            mygames: cleverapps.MygamesSocial,
            microsoft: cleverapps.MicrosoftFacebook,
            msstart: cleverapps.MSStartSocial,
            plng: cleverapps.PlingaSocial,
            kongregate: cleverapps.KongregateSocial,
            crazy: CrazySocial,
            ton: cleverapps.TonSocial,
            wortal: cleverapps.WortalSocial,
            wechat: cleverapps.WechatSocial,
            default: cleverapps.FacebookCanvasSocial
        };

        var Constuctor = socials[cleverapps.platform.source] || socials.default;

        cleverapps.social = new Constuctor();

        return cleverapps.social;
    }
};