/**
 * Created by iamso on 11.03.2022
 */

var RestoreProgressButton = cleverapps.UI.Button.extend({
    alwaysOn: true,

    ctor: function () {
        var styles = cleverapps.styles.RestoreProgressButton;
        var size = styles.size ? styles.size[cleverapps.resolution.mode] : styles;
        this.contentFont = cleverapps.styles.FONTS.BUTTON_TEXT;

        var content = this.content = cleverapps.UI.generateOnlyText("RestoreProgress", this.contentFont);
        content.setDimensions(size.width, 0);
        content.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        content.fitTo(undefined, size.height);

        this._super({
            width: size.width,
            height: size.height,
            content: content,
            type: cleverapps.styles.UI.Button.Images.button_blue,
            onClicked: function () {
                cleverapps.restoreProgress.restore();
            }
        });

        this.content.setPositionRound(styles.content);

        this.setCascadeOpacityEnabledRecursively(true);
        this.setOpacity(0);
        this.setVisible(false);
        this.setLocalZOrder(BaseWindow.WINDOWS_ZORDER + 2); // higher than scene film effect

        cleverapps.restoreProgress.onShow = this.createListener(this.onShow.bind(this));
        cleverapps.restoreProgress.onHide = this.createListener(this.onHide.bind(this));

        if (cleverapps.restoreProgress.visible) {
            this.runAction(new cc.CallFunc(this.onShow.bind(this)));
        }

        this.updateSize();
    },

    updateSize: function () {
        if (!cleverapps.styles.RestoreProgressButton.size) {
            return;
        }

        var styles = cleverapps.styles.RestoreProgressButton;
        var size = styles.size[cleverapps.resolution.mode];
        this.resize(size.width, size.height);
        this.content.setFontSize(this.contentFont.size);
        this.content.setDimensions(size.width, 0);
        this.content.fitTo(undefined, size.height);

        this.content.setPositionRound(styles.content);
    },

    updateDynamicPosition: function (silent) {
        var styles = cleverapps.styles.RestoreProgressButton;

        var scene = cleverapps.scenes.getRunningScene();
        var overlappingNodes = scene.getAvoidNodes(["HidingNode", "DialogueView", "FieldView", "MenuBarItemView", "MinimalDialogue",
            "PaginationView", "Panel", "Person", "PlayButtonView", "BoardView", "KeypadView", "CurrentView", "BandButton"
        ]).filter(function (node) {
            return node.isShown !== false;
        });

        if (cleverapps.gameModes.showAvoidRects) {
            cleverapps.scenes.getRunningScene().drawRects(overlappingNodes.map(function (node) {
                var rect = node.getBoundingBoxToWorld();
                rect.name = node.avoidNode;
                return rect;
            }));
        }

        var position = cleverapps.UI.findPosition(this, styles.position, overlappingNodes);
        if (cc.pointEqualToPoint(this.getPosition(), position, 0.5)) {
            return;
        }

        if (!cleverapps.restoreProgress.visible || silent) {
            this.setPosition(position.x, position.y);
            return;
        }

        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.MoveTo(0, position.x, position.y),
            new cc.FadeIn(0.3)
        ));
    },

    onShow: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.Show(),
            new cc.FadeIn(0.3)
        ));
    },

    onHide: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.1),
            new cc.FadeOut(0.3),
            new cc.Hide()
        ));
    }
});

cleverapps.styles.RestoreProgressButton = {
    width: 300,
    height: 110,

    position: [
        {
            x: { align: "left", dx: 20 },
            y: { align: "bottom", dy: 20 }
        },
        {
            x: { align: "right", dx: -20 },
            y: { align: "bottom", dy: 20 }
        },
        {
            x: { align: "right", dx: -20 },
            y: { align: "top", dy: -110 }
        }
    ],
    content: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 }
    }
};
