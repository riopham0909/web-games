/**
 * Created by slava on 29/11/18
 */

cleverapps.Layout = cc.Node.extend({
    ctor: function (children, options) {
        this._super();

        this.options = options;

        if (children.length) {
            this.setItems(children);
        }
    },

    setItems: function (items, cleanup) {
        this.removeAllChildren(cleanup);

        items.forEach(function (item) {
            if (item) {
                this.addChild(item);
            }
        }, this);

        this.reshape();
    },

    reshape: function () {
        this.children.forEach(function (child) {
            child.setPositionRound(0, 0);
        });

        cleverapps.UI.arrangeWithMargins(this.children, this.options);

        cleverapps.UI.wrap(this, {
            considerRotation: true
        });

        if (this.options.padding) {
            cleverapps.UI.wrapWithPadding(this, this.options.padding, true);
        }

        if (this.options.dimensions) {
            cleverapps.UI.setDimensions(this, this.options.dimensions);
        }

        return this;
    },

    setOptions: function (options) {
        cleverapps.override(this.options, options);
    }
});

cleverapps.Layout.AsyncChild = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint2();
    }
});

cleverapps.Layout.AsyncChild.prototype.reshape = function (content) {
    this.setContentSize2(content.width * content.scaleX, content.height * content.scaleY);
    this.addChild(content);
    content.setPositionRound(this.width / 2, this.height / 2);

    if (this.alignment) {
        this.setPositionRound(this.alignment);
    }
    if (this.parent && this.parent.reshape) {
        this.parent.reshape();
    }
};
