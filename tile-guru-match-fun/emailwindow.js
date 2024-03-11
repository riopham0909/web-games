/**
 * Created by andrey on 09.06.2023
 */

var EmailWindow = Window.extend({
    onWindowLoaded: function (onSuccess, onCancel) {
        this.onSuccess = onSuccess;
        this.onCancel = onCancel;

        this._super({
            title: "EmailWindow.title",
            content: this.createContent(),
            button: {
                text: "OK",
                onPressed: this.onPressed.bind(this)
            },
            notCloseByTouchInShadow: true
        });
    },

    onPressed: function () {
        var email = this.editBox.getString().toLowerCase().trim();

        if (!cleverapps.validateEmail(email)) {
            cleverapps.notification.create("EmailWindow.error");
            return;
        }

        this.success = true;
        cleverapps.info.setKeyValue("email", email);
        this.close();
    },

    onClose: function () {
        if (this.success) {
            this.onSuccess && this.onSuccess();
        } else {
            this.onCancel && this.onCancel();
        }
    },

    createContent: function () {
        var styles = cleverapps.styles.EmailWindow;

        var text = cleverapps.UI.generateOnlyText("EmailWindow.text", cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        text.setDimensions(styles.text.width, 0);

        var placeHolder = cleverapps.paymentsCountry.isRussia() || cleverapps.payments instanceof YooKassaPayments
            ? "your_email@yandex.ru"
            : "your_email@gmail.com";

        var editBoxBg = new cc.Scale9Sprite(bundles.windows.frames.editbox_bg_png);
        var editBox = this.editBox = new cc.EditBox(styles.editBox, editBoxBg, true);

        editBox.setPlaceholderFontColor(cleverapps.styles.FONTS.EMAIL_WINDOW_PLACEHOLDER_TEXT.color);
        editBox.setPlaceholderFont(cleverapps.UI.getFontName(), cleverapps.styles.FONTS.EMAIL_WINDOW_PLACEHOLDER_TEXT.size);
        editBox.setPlaceHolder(placeHolder);

        editBox.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        editBox.setMaxLength(100);
        editBox.stayOnTop(true);
        editBox.setTouchEnabled();
        editBox.setFontColor(cleverapps.styles.FONTS.EMAIL_WINDOW_EDITBOX_TEXT.color);
        editBox.setFont(cleverapps.UI.getFontName(), cleverapps.styles.FONTS.EMAIL_WINDOW_EDITBOX_TEXT.size);

        var email = cleverapps.info.getValue("email");
        if (email) {
            editBox.setString(email);
        }

        return new cleverapps.Layout([text, editBox], {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin,
            padding: styles.padding
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    EMAIL_WINDOW_EDITBOX_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.WHITE
    },

    EMAIL_WINDOW_PLACEHOLDER_TEXT: {
        size: 30,
        color: cc.color.GRAY
    }
});

cleverapps.styles.EmailWindow = {
    margin: 60,
    padding: {
        top: 70,
        bottom: 40
    },

    text: {
        width: 650
    },

    editBox: {
        width: 550,
        height: 50
    }
};