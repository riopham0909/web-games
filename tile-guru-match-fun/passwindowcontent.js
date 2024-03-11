/**
 * Created by Andrey Popov on 2/1/22.
 */

var PassWindowContent = cc.Node.extend({
    ctor: function (options) {
        this._super();

        this.setAnchorPoint2();
        this.setContentSize2(options.width, options.styles.height);

        options.components.forEach(function (description) {
            var styles = options.styles[description.name];

            var parameters = Object.assign(description.params || {}, {
                passLogic: options.passLogic,
                width: options.width,
                styles: styles
            });

            if (description.class.IsActive && !description.class.IsActive(parameters)) {
                return;
            }

            // eslint-disable-next-line new-cap
            var component = new description.class(parameters);
            component.setPositionRound(styles);
            this.addChild(component, styles.zOrder);
        }.bind(this));

        var visibleControls = ["MenuBarGoldItem", "MenuBarLivesItem"];

        cleverapps.meta.showControlsWhileFocused(visibleControls);
    }
});