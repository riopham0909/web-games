/**
 * Created by Andrey Popov on 6/3/21
 */

var MenuBar = function () {
    this.items = cleverapps.MenuBarItems().map(function (itemConfig) {
        var ModelClass = itemConfig.modelClass;
        return itemConfig.modelClass ? new ModelClass(itemConfig) : new MenuBarItem(itemConfig);
    });
};

MenuBar.prototype.getSceneItems = function () {
    if (cleverapps.environment.isEditorScene()) {
        return [];
    }

    var items = [];
    this.items.forEach(function (item) {
        if (item.isAvailableOnScene()) {
            item.init();
            items.push(item);
        } else {
            item.clean();
        }
    });
    return items;
};

MenuBar.prototype.stopItems = function () {
    this.items.forEach(function (item) {
        item.stop();
    });
};

MenuBar.prototype.showForce = function (name) {
    var result;

    var item = this.items.find(function (item) {
        return item.name === name;
    });

    cleverapps.meta.display({
        focus: name + "MenuBarItemForce",
        control: "MenuBar" + name,
        actions: [
            function (f) {
                result = true;
                cleverapps.timeouts.setTimeout(f, 500);
            },

            function (f) {
                item.onShowForce(item.config.force);
                
                cleverapps.forces.onceForceClosed = f;
            }
        ]
    });

    return result;
};

MenuBar.prototype.clean = function () {
    this.items.forEach(function (item) {
        item.clean();
    });
};