/**
 * Created by vladislav on 25/11/2022
 */

var RoundTabs = cleverapps.Layout.extend({
    ctor: function (tabsArray, onClick) {
        this.onClickCallback = onClick;

        this.contentByTab = {};

        var styles = cleverapps.styles.RoundTabs;

        this.tabs = {};
        for (var i = 0; i < tabsArray.length; i++) {
            var tab = tabsArray[i];
            this.tabs[tab.id] = this.createTab(tab);
        }

        this._super(cleverapps.values(this.tabs), {
            margin: styles.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
    },

    getCurrentTab: function () {
        return this.currentTab;
    },

    createTab: function (data) {
        var tab = new cc.Sprite(bundles.tabs.frames.round_tab_bg);

        var icon = new cc.Sprite(data.icon);
        icon.setPositionRound(tab.width / 2, tab.height / 2);
        tab.addChild(icon);
        tab.icon = icon;

        tab.hoverHandler = cleverapps.UI.applyHover(tab);
        tab.clickHandler = cleverapps.UI.onClick(tab, this.onClick.bind(this, data.id));

        tab.generator = data.generator;

        return tab;
    },

    onClick: function (id) {
        this.setTab(id);

        if (this.onClickCallback) {
            this.onClickCallback(id);
        }
    },

    setTab: function (id) {
        if (this.currentTab !== undefined) {
            this.tabs[this.currentTab].setSpriteFrame(bundles.tabs.frames.round_tab_bg);
            this.tabs[this.currentTab].icon.setColor(new cc.Color(255, 255, 255, 255));
            this.tabs[this.currentTab].icon.setOpacity(255);

            this.tabs[this.currentTab].clickHandler = cleverapps.UI.onClick(this.tabs[this.currentTab], this.setTab.bind(this, this.currentTab));

            if (!this.tabs[this.currentTab].hoverHandler) {
                this.tabs[this.currentTab].hoverHandler = cleverapps.UI.applyHover(this.tabs[this.currentTab]);
            }
        }

        if (this.contentByTab[this.currentTab]) {
            this.contentByTab[this.currentTab].setVisible(false);
        }

        this.currentTab = id;

        this.tabs[id].setSpriteFrame(bundles.tabs.frames.round_tab_bg_selected);
        this.tabs[id].icon.setColor(new cc.Color(180, 180, 180, 255));
        this.tabs[id].icon.setOpacity(180);

        if (this.tabs[id].clickHandler) {
            this.tabs[id].clickHandler.remove();
            this.tabs[id].clickHandler = undefined;
        }

        if (this.tabs[id].hoverHandler) {
            this.tabs[id].hoverHandler.remove();
            this.tabs[id].hoverHandler = undefined;
        }

        if (this.tabs[id].generator && !this.contentByTab[id]) {
            this.contentByTab[id] = this.tabs[id].generator();
        }

        if (this.contentByTab[this.currentTab]) {
            this.contentByTab[this.currentTab].setVisible(true);
        }
    },

    show: function () {
        for (var id in this.tabs) {
            this.tabs[id].setScale(0);
            this.tabs[id].runAction(new cc.Sequence(
                new cc.DelayTime(0.1),
                new cc.ScaleTo(0.3, 1)
            ));
        }
    },

    hide: function () {
        for (var id in this.tabs) {
            this.tabs[id].runAction(new cc.Sequence(
                new cc.DelayTime(0.1),
                new cc.ScaleTo(0.2, 0)
            ));
        }
    }
});

cleverapps.styles.RoundTabs = {
    margin: 50
};