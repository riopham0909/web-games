/**
 * Created by mac on 8/26/20
 */

cleverapps.UI.Tooltip = cc.Node.extend({
    ctor: function (target, options) {
        this._super();
        this.options = options;
        this.target = target;
        this.duration = options.duration || 4.0;

        var styles = cleverapps.styles.UI.Tooltip;

        var size = options.size || styles.SIZE.medium;
        if (options.rewards) {
            this.setContentSize2(size.width + styles.rewards.extraWidth, size.height + styles.rewards.extraHeight);
        } else {
            this.setContentSize2(size);
        }

        this.setAnchorPoint2();
        if (options.zOrder) {
            this.setLocalZOrder(options.zOrder);
        }
        this.bg = new cc.Scale9Sprite(bundles.tooltip.frames.tooltip_bg_png);
        this.addChild(this.bg);

        this.bg.setContentSize2(this.getContentSize());

        if (options.arrow === undefined) {
            options.arrow = (options.position === styles.LOCATION.below) ? styles.ARROW.top : styles.ARROW.bottom;
        }
        this.drawArrow(options.arrow);

        if (options.content) {
            this.content = options.content;
            this.bg.addChild(this.content);
            var scale = Math.min(
                this.width / (this.content.width * this.content.scaleX + styles.content.padding),
                this.height / (this.content.height * this.content.scaleY + styles.content.padding)
            );
            if (scale < 1) {
                this.content.setScale(this.content.scaleX * scale, this.content.scaleY * scale);
            }
            this.content.setPositionRound(this.width / 2, this.height / 2 + styles.content.offset.y);
        } else {
            var text = this.text = cleverapps.UI.generateOnlyText(options.text, cleverapps.styles.FONTS.TOOLTIP_TEXT);
            text.fitTo(this.width - styles.content.padding);

            var content = text;
            if (options.rewards) {
                var rewardsView = new RewardsListComponent(options.rewards, {
                    columns: 5,
                    font: cleverapps.styles.FONTS.TOOLTIP_FONT,
                    noPrefix: true,
                    iconWrap: styles.rewards.iconWrap,
                    noShowControls: true
                });

                cleverapps.UI.fitToBox(rewardsView, {
                    width: this.width - styles.content.padding
                });

                content = new cleverapps.Layout([text, rewardsView], {
                    direction: cleverapps.UI.VERTICAL,
                    margin: styles.rewards.margin
                });
            }
            content.setPositionRound(this.width / 2, this.height / 2 + styles.content.offset.y);
            this.bg.addChild(content);
        }

        if (options.control) {
            cleverapps.meta.registerControl(options.control, this.createListener(function (visible) {
                if (visible) {
                    this.show();
                } else {
                    this.hide();
                }
            }.bind(this)));
        } else {
            this.show();
        }

        this.updatePosition();
    },

    hide: function () {
        this.stopAllActions();

        var duration = 0.2 * this.scale;

        this.runAction(
            new cc.Sequence(
                new cc.ScaleTo(duration, 0),
                new cc.CallFunc(function () {
                    if (this.content) {
                        this.content.removeFromParent();
                    }
                }.bind(this)),
                new cc.RemoveSelf()
            )
        );
    },

    updatePosition: function () {
        var scene = cleverapps.scenes.getRunningScene();

        var position = this.options.rewards ? this.options.position.rewards : this.options.position;
        position = this.calculatePositionRound(position.x, position.y, { box: this.target.getGlobalBoundingBox() });

        this.setPositionRound(scene.convertToNodeSpace(position));
        this.bg.setPositionRound(this.width / 2, this.height / 2);

        if (this.x - this.width / 2 < 0) {
            this.bg.x += this.width / 2 - this.x + cleverapps.styles.UI.Tooltip.bgPadding;
        }
        if (this.x + this.width / 2 > cleverapps.scenes.getRunningScene().width) {
            this.bg.x -= this.width / 2 - cleverapps.scenes.getRunningScene().width + this.x + cleverapps.styles.UI.Tooltip.bgPadding;
        }
    },

    show: function () {
        this.stopAllActions();

        this.setVisible(false);
        this.runAction(new cc.Sequence(
            new cc.ScaleTo(0, 0.2),
            new cc.Show(),
            new cc.ScaleTo(0.1, 1)
        ));
        this.runAction(new cc.Sequence(
            new cc.DelayTime(this.duration),
            new cc.CallFunc(function () {
                this.hide();
            }.bind(this))
        ));
    },

    drawArrow: function (arrowPosition) {
        var arrow = arrowPosition === cleverapps.styles.UI.Tooltip.ARROW.bottom
            ? new cc.Scale9Sprite(bundles.tooltip.frames.tooltip_shadow_arrow_png)
            : new cc.Scale9Sprite(bundles.tooltip.frames.tooltip_arrow_png);
        this.addChild(arrow);

        arrow.setRotation(arrowPosition.rotation);
        arrow.setPositionRound(arrowPosition);
    }
});

cleverapps.styles.UI.Tooltip = {
    content: {
        padding: 40,
        offset: {
            y: -4
        }
    },

    bgPadding: 10,

    rewards: {
        extraWidth: 0,
        extraHeight: 110,
        margin: 10,
        iconWrap: {
            width: 60,
            height: 60
        }
    },

    SIZE: {
        short: {
            width: 360,
            height: 100
        },
        medium: {
            width: 480,
            height: 100
        },
        long: {
            width: 600,
            height: 100
        }
    },

    LOCATION: {
        above: {
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 100 },
            rewards: {
                x: { align: "center", dx: 0 },
                y: { align: "top", dy: 220 }
            }
        },
        below: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -112 },
            rewards: {
                x: { align: "center", dx: 0 },
                y: { align: "bottom", dy: -222 }
            }
        }
    },

    ARROW: {
        top: {
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 18 },
            rotation: 180
        },
        bottom: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -16 },
            rotation: 0
        },
        left: {
            x: { align: "left", dx: -22 },
            y: { align: "center", dy: 0 },
            rotation: 90
        },
        right: {
            x: { align: "right", dx: 22 },
            y: { align: "center", dy: 0 },
            rotation: -90
        }
    }
};
