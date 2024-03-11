/**
 * Created by andrey on 01.07.2020
 */

var Terms = cc.Node.extend({
    ctor: function () {
        this._super();

        var terms = new cc.Node();
        terms.addChild(cleverapps.UI.generateTTFText("Terms.TermsOfService", cleverapps.styles.FONTS.TERMS_LINK_TEXT));
        cleverapps.UI.wrap(terms);
        this.addChild(terms);

        var and = cleverapps.UI.generateTTFText(" " + Messages.get("Terms.and") + " ", cleverapps.styles.FONTS.TERMS_TEXT);
        this.addChild(and);

        var privacy = new cc.Node();
        privacy.addChild(cleverapps.UI.generateTTFText("Terms.PrivacyPolicy", cleverapps.styles.FONTS.TERMS_LINK_TEXT));
        cleverapps.UI.wrap(privacy);
        this.addChild(privacy);

        cleverapps.UI.arrangeWithMargins(this.children, {
            direction: cleverapps.UI.HORIZONTAL,
            margin: cleverapps.styles.Terms.margin
        });
        cleverapps.UI.wrap(this);

        cleverapps.UI.applyHover(terms);
        cleverapps.UI.applyHover(privacy);

        cleverapps.UI.onClick(terms, function () {
            cc.sys.openURL(Terms.TERMS_URL);
        });
        cleverapps.UI.onClick(privacy, function () {
            cc.sys.openURL(Terms.PRIVACY_URL);
        });
    }
});

cleverapps.overrideColors(cleverapps.styles.COLORS, {
    TERMS_LINK_COLOR: new cc.Color(97, 167, 221, 255),
    TERMS_TEXT_COLOR: new cc.Color(55, 80, 58, 255)
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TERMS_TEXT: {
        size: 25,
        color: cleverapps.styles.COLORS.TERMS_TEXT_COLOR
    },

    TERMS_LINK_TEXT: {
        size: 25,
        color: cleverapps.styles.COLORS.TERMS_LINK_COLOR
    }
});

Terms.TERMS_URL = "https://cleverappssg.com/legal/terms.html";
Terms.PRIVACY_URL = "https://cleverappssg.com/legal/privacy.html";

cleverapps.styles.Terms = {
    margin: 6
};