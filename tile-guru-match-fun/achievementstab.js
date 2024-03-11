/**
 * Created by spepa on 20.04.2023
 */

var AchievementsTab = cc.Node.extend({
    ctor: function (window) {
        this._super();
        this.setAnchorPoint2();
        this.setContentSize(window.dailyTasksTab.getContentSize());
        this.window = window;

        this.createScroll();
    },

    createScroll: function () {
        var styles = cleverapps.styles.AchievementsTab.scroll;

        var scroll = this.scroll = new cleverapps.UI.ScrollView(this.createGrid(), {
            direction: cleverapps.UI.ScrollView.DIR_VERTICAL,
            scrollBarEnabled: false
        });
        scroll.setContentSize2(this.width, this.height - styles.paddingY);
        scroll.setPositionRound(styles);
        scroll.scrollToPercent(100);
        this.addChild(scroll);

        if (styles.foreground) {
            var foreground = cleverapps.UI.createScale9Sprite(bundles.dailytasks.frames.foreground_png);
            var isWide = cleverapps.config.type === "merge";
            foreground.setContentSize2(isWide ? styles.foreground.wide.width : styles.foreground.width, scroll.height + styles.foreground.paddingY);
            this.addChild(foreground);
            foreground.setPositionRound(scroll.getPosition());
        }
    },

    createGrid: function () {
        var styles = cleverapps.styles.AchievementsTab;
        return new cleverapps.GridLayout(this.createItems(), {
            columns: cleverapps.config.type === "merge" ? 5 : 4,
            margin: styles.margin,
            padding: styles.gridPadding
        });
    },

    createItems: function () {
        var styles = cleverapps.styles.AchievementsTab.item;
        var tasks = cleverapps.achievements.listTasks();
        var items = [];

        for (var i = 0; i < AchievementsTab.MIN_AMOUNT; i++) {
            var bg = !tasks[i] || !tasks[i].isComplete() ? bundles.achievements.frames.bg_off : bundles.achievements.frames.bg;
            var view = cleverapps.UI.createScale9Sprite(bg, cleverapps.UI.Scale9Rect.TwoPixelXY);
            view.setContentSize2(styles);

            var icon = tasks[i] ? tasks[i].getIcon() : new cc.Sprite(bundles.achievements.frames.unknown);
            view.addChild(icon);
            icon.setPositionRound(view.width / 2, view.height / 2);

            if (tasks[i] && !tasks[i].isComplete()) {
                icon.setColor(cc.color(130, 130, 130));
            }

            cleverapps.UI.onClick(view, this.itemClick.bind(this, tasks[i]), {
                ignoreScale: true
            });
            items.push(view);
        }

        return items;
    },

    itemClick: function (task) {
        this.window.showHint(task ? task.getDescription() : "Achievements.unknown");
    }
});

cleverapps.styles.AchievementsTab = {
    scroll: {
        paddingY: 10,
        x: { align: "center" },
        y: { align: "center" }
    },

    margin: {
        x: 5,
        y: 5
    },

    gridPadding: {
        x: 0,
        y: 80
    },

    item: {
        width: 200,
        height: 200
    }
};

AchievementsTab.MIN_AMOUNT = 30;
