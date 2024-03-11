/**
 * Created by vladislav on 29.04.2022
 */

var WindowTitle = cc.Node.extend({
    ctor: function (window, options, help) {
        this._super();
        this.setAnchorPoint2();
        this.setLocalZOrder(2);

        this.window = window;
        this.type = this.window.withBg ? cleverapps.styles.WindowTitle.Types.default : cleverapps.styles.WindowTitle.Types.alternative;
        this.fixedScenePosition = !this.window.withBg;
        this.help = help;

        if (this.type.background) {
            this.background = cleverapps.UI.createScale9Sprite(this.type.background.image);
            this.addChild(this.background);

            if (this.window.decors) {
                this.window.decors.initTitleDecorators();
            }
        }

        this.text = cleverapps.UI.generateOnlyText("", cleverapps.styles.FONTS.WINDOW_TITLE_TEXT);
        this.maxTextHeight = this.text.getFontSize() * 1.5;
        this.addChild(this.text, 1);

        var text = options;
        if (options.text) {
            text = options.text;
        }

        var toReplace = {};
        if (options.toReplace) {
            toReplace = options.toReplace;
        }

        if (this.window.withBg && this.help) {
            this.helpButton = new cleverapps.UI.HelpButton(this.help, { window: true });
            this.addChild(this.helpButton);
        }

        this.setTitle(text, toReplace);

        this.setCascadeOpacityEnabledRecursively(true);
    },

    adjustPosition: function () {
        var position = cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL && this.type.mobilePosition
            || this.type.position;
        this.setPositionRound(position.x, position.y, { world: this.fixedScenePosition });
    },

    setTitle: function (msg, toReplace) {
        this.text.setString(msg, toReplace);

        var maxTextWidth = cleverapps.UI.getSceneSize().width;
        if (this.window.withBg) {
            maxTextWidth = this.window.window.width - 2 * this.type.windowOffsetX;
            if (this.help) {
                maxTextWidth -= 2 * this.type.helpButton.padding.x;
            }
        } else {
            maxTextWidth -= this.type.scenePaddingX * 2;
        }
        this.text.fitTo(maxTextWidth, this.maxTextHeight);

        if (this.background) {
            var paddingX = 2 * this.type.padding.x;
            if (this.helpButton) {
                paddingX += 2 * this.type.helpButton.padding.x;
            }
            var width2 = Math.max(this.text.width + paddingX, this.type.background.minWidth);
            this.background.setContentSize2(width2, this.type.background.height);

            this.setContentSize2(this.background.getContentSize());

            this.background.setPositionRound(this.width / 2, this.height / 2);

            if (this.window.decors) {
                this.window.decors.updateAll();
            }
        } else {
            this.setContentSize2(this.text.getContentSize());
        }

        this.text.setPositionRound(this.type.textPosition);
        if (this.helpButton) {
            this.text.x += this.type.helpButton.padding.x;
            this.helpButton.setPositionRound(this.type.helpButton);
        }
    },

    hide: function () {
        if (!this.window.withBg) {
            this.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.Hide()
            ));
        }
    }
});

cleverapps.styles.WindowTitle = {
};

cleverapps.styles.WindowTitle.Types = {
    default: {
        background: {
            image: bundles.windows.frames.window_title_bg_png,
            height: 147,
            minWidth: 350
        },
        windowOffsetX: 190,
        padding: {
            x: 60
        },
        textPosition: {
            x: { align: "center" },
            y: { align: "center", dy: 12 }
        },
        position: {
            x: { align: "center" },
            y: { align: "top", anchor: "center", dy: -2 }
        },
        helpButton: {
            x: { align: "left", dx: 20 },
            y: { align: "center", dy: 3 },
            padding: {
                x: 30
            }
        }
    },

    alternative: {
        background: {
            image: bundles.windows.frames.window_title_bg_secondary_png,
            height: 122,
            minWidth: 600
        },
        padding: {
            x: 195
        },
        textPosition: {
            x: { align: "center" },
            y: { align: "center", dy: 8 }
        },
        position: {
            x: { align: "center" },
            y: { align: "top", dy: -165 }
        },
        scenePaddingX: 150
    }
};
