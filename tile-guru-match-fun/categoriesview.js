/**
 * Created by Andrey Popov on 25/2/20.
 */

var CategoriesView = cc.Node.extend({
    ctor: function (chatMessage) {
        this._super();

        this.chatMessage = chatMessage;

        this.setAnchorPoint2(0, 0.5);

        this.captionText = cleverapps.UI.generateOnlyText("ChatCategory.Select", cleverapps.styles.FONTS.STRICT_TEXT);
        this.captionText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.captionText);

        this.updateSize();
    },

    updateSize: function () {
        var styles = cleverapps.styles.CategoriesView;

        var rows = this.createCategoriesRows();
        this.setContentSize2(cleverapps.UI.getSceneSize().width, this.captionText.height
            + rows.length * (styles.margin + styles.button.height) + styles.padding);

        if (this.categoriesLayout) {
            this.categoriesLayout.removeFromParent();
        }
        this.categoriesLayout = new cleverapps.Layout(rows, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
        this.categoriesLayout.setPositionRound(styles.categories);
        this.addChild(this.categoriesLayout);

        this.captionText.setDimensions(cleverapps.UI.getSceneSize().width - styles.padding, 0);
        this.captionText.setPositionRound(styles.caption);
    },

    createCategoriesRows: function () {
        var styles = cleverapps.styles.CategoriesView;
        var clickHandler = function (category) {
            cleverapps.chat.selectCategory(category.tag, Messages.get(category.placeholder));
        };

        var categoriesViews = Chat.CATEGORIES.map(function (category) {
            var button = new cleverapps.UI.Button({
                text: category.message,
                type: cleverapps.styles.UI.Button.Images.chat_categories,
                onClicked: clickHandler.bind(this, category),
                textVariant: "strict_black",
                height: styles.button.height
            });
            button.setBright(category.tag !== cleverapps.chat.categoryTag);

            if (category.tag === cleverapps.chat.categoryTag) {
                var closeMark = new cc.Sprite(bundles.chat.frames.active_category_close);
                closeMark.setPositionRound(styles.closeButton);
                cleverapps.UI.applyHover(closeMark);
                cleverapps.UI.onClick(closeMark, clickHandler.bind(this, category));
                button.addChild(closeMark);
            }

            return button;
        });

        var rows = [], currentRow = [];
        for (var i = 0; i < categoriesViews.length; i++) {
            var currentRowWidth = currentRow.reduce(function (acc, val) {
                return acc + val.width; 
            }, 0);

            if (currentRowWidth + categoriesViews[i].width > 0.8 * cleverapps.UI.getSceneSize().width) {
                rows.push(currentRow);
                currentRow = [];
            }
            currentRow.push(categoriesViews[i]);
        }
        rows.push(currentRow);

        return rows.map(function (categories) {
            return new cleverapps.Layout(categories, {
                direction: cleverapps.UI.HORIZONTAL,
                margin: styles.margin
            });
        });
    }
});

cleverapps.styles.CategoriesView = {
    padding: 50,
    margin: 14,

    caption: {
        x: { align: "center" },
        y: { align: "top", dy: -20 }
    },

    categories: {
        x: { align: "center" },
        y: { align: "top", dy: -70 }
    },

    button: {
        height: 80
    },

    closeButton: {
        x: { align: "right", dx: 6 },
        y: { align: "top", dy: 6 }
    }
};