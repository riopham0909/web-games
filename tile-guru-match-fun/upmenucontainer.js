/**
 * Created by Denis Kuzin on 16 june 2023
 */

var UpMenuContainer = cc.Node.extend({
    ctor: function () {
        this._super();

        if (!cleverapps.environment.isWysiwygScene() && !cleverapps.environment.isAtlasAnalyzerScene()) {
            this.menuBar = new MenuBarView();
            this.addChild(this.menuBar);
        }

        this.setLocalZOrder(UpMenuContainer.ZORDER);
        this.updateSize();
        this.updatePosition();
    },

    addControlButtons: function (controlButtons) {
        this.removeControlButtons();

        this.controlButtons = controlButtons;
        this.addChild(this.controlButtons);
        this.updateSize();
        this.updatePosition();
    },

    removeControlButtons: function () {
        if (this.controlButtons) {
            this.controlButtons.removeFromParent();
            delete this.controlButtons;

            this.updateSize();
            this.updatePosition();
        }
    },

    updateSize: function () {
        var styles = cleverapps.styles.UpMenuContainer;

        var scale = styles.scale[cleverapps.resolution.mode];
        if (cleverapps.environment.isWysiwygScene() || cleverapps.environment.isAtlasAnalyzerScene()) {
            scale = 0.5;
        }

        var availableWidth = cleverapps.UI.getSceneSize().width;
        availableWidth -= styles.padding.x * 2;
        if (cleverapps.environment.isWysiwygScene()) {
            availableWidth -= cleverapps.styles.InspectorView.width;
        }

        availableWidth /= scale;

        availableWidth -= cleverapps.resolution.getSafePadding().right;

        var width = 0;
        var height = 0;
        var elements = 0;

        if (this.controlButtons) {
            height = Math.max(height, this.controlButtons.height * this.controlButtons.scaleY);
            width += this.controlButtons.width * this.controlButtons.scaleX;
            elements += 1;
        }

        if (this.menuBar) {
            this.menuBar.reshape(availableWidth, availableWidth - width);

            height = Math.max(height, this.menuBar.height * this.menuBar.scaleY);
            width += this.menuBar.width * this.menuBar.scaleX;
            elements += 1;
        }

        width += styles.margin * Math.max(0, elements - 1);

        if (width > availableWidth) {
            scale *= availableWidth / width;
            availableWidth = width;
        }

        this.setScale(scale);
        this.setContentSize(availableWidth, height);
    },

    updatePosition: function () {
        var styles = cleverapps.styles.UpMenuContainer;

        var offsetY = -styles.padding.y;
        offsetY -= cleverapps.resolution.getSafePadding().top;
        this.setPositionRound({ align: "left", dx: styles.padding.x }, { align: "top", dy: offsetY });

        if (this.menuBar) {
            this.menuBar.setPositionRound(styles.menuBar);
        }
    }
});

UpMenuContainer.ZORDER = BaseWindow.WINDOWS_ZORDER + 1;

cleverapps.styles.UpMenuContainer = {
    scale: [0.8, 0.8, 1],

    margin: 14,

    padding: {
        x: 20,
        y: 10
    },

    menuBar: {
        x: { align: "left" },
        y: { align: "center" }
    }
};