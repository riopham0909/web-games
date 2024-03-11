/**
 * Created by iamso on 05.03.19.
 */

var SideBar = function () {
    this.icons = [];
    this.availableIcons = this.loadAvailable();
    this.savePositions();
    this.clearListeners();
};

SideBar.prototype.loadAvailable = function () {
    var icons = [];

    if (cleverapps.config.type === "merge") {
        icons.push(ExitExpeditionIcon);
        icons.push(QuestsSideBarIcon);
        if (bundles.sidebar.jsons.free_rubies_json && cleverapps.platform.oneOf(IOSCh)) {
            icons.push(FreeRubiesIcon);
        }
        icons.push(DailyTasksIcon);
        icons.push(PackIcon);
        icons.push(ClansCupIcon);

        icons.push(InviteIcon);
        icons.push(LandmarkDonorIcon);
        icons.push(PawBoxIcon);
    } else {
        if (cleverapps.config.features.includes("dailylevel")) {
            icons.push(DailyLevelIcon);
        }

        if (cleverapps.starChest) {
            icons.push(StarChestIcon);
        }

        if (typeof match3 !== "undefined" && match3.heroes) {
            icons.push(HeroesIcon);
        }

        icons.push(PackIcon);

        if (cleverapps.config.features.includes("piggybank")) {
            icons.push(PiggyBankIcon);
        }

        icons.push(DailyCupIcon);

        icons.push(InviteIcon);
    }

    return icons.map(function (ClassName) {
        return new ClassName();
    });
};

SideBar.prototype.savePositions = function () {
    this.availableIcons.forEach(function (icon, id) {
        icon.availableIndex = id;
    });
};

SideBar.PRIORITY_NORMAL = 1;
SideBar.PRIORITY_REDUNDANT = 0;

SideBar.prototype.clearListeners = function () {
    this.onAddIcon = function () {};
    this.onMoveIcon = function () {};
    // eslint-disable-next-line no-unused-vars
    this.onRemoveIcon = function (index) {};
    // eslint-disable-next-line no-unused-vars
    this.onForceIcon = function (index) {};

    for (var i = 0; i < this.icons.length; i++) {
        this.icons[i].clearListeners();
    }
};

SideBar.prototype.getDefaultIconByClassName = function (ClassName) {
    for (var i = 0; i < this.availableIcons.length; i++) {
        if (this.availableIcons[i] instanceof ClassName) {
            return this.availableIcons[i];
        }
    }
};

SideBar.prototype.getIconByClassName = function (ClassName) {
    for (var i = 0; i < this.icons.length; i++) {
        if (this.icons[i] instanceof ClassName) {
            return this.icons[i];
        }
    }
};

SideBar.prototype.resetByClassName = function (ClassName) {
    var icon = this.getDefaultIconByClassName(ClassName);

    if (icon) {
        icon.resetState();

        if (icon.available && this.icons.indexOf(icon) === -1) {
            this.addIcon(icon);
        }

        if (!icon.available && this.icons.indexOf(icon) !== -1) {
            this.removeIcon(icon);
        }
    }
};

SideBar.prototype.refreshAllIcons = function () {
    var icons = this.availableIcons;
    icons.forEach(function (icon) {
        icon.resetState();
    });
    icons.forEach(function (icon) {
        if (!icon.available && this.icons.indexOf(icon) !== -1) {
            this.removeIcon(icon);
        }
    }, this);
    icons.forEach(function (icon) {
        if (icon.available && this.icons.indexOf(icon) === -1) {
            this.addIcon(icon);
        }
    }, this);
};

SideBar.prototype.anyIconWithForceIndex = function () {
    for (var i = 0; i < this.icons.length; i++) {
        var icon = this.icons[i];
        if (!icon.locked && i < SideBar.SLOTS.length) {
            var force = icon.getForce();
            if (force && !cleverapps.forces.isShown(force.id)) {
                return i;
            }
        }
    }

    return undefined;
};

SideBar.prototype.showAnyForce = function () {
    var index = this.anyIconWithForceIndex();
    if (index === undefined) {
        return;
    }

    cleverapps.meta.display({
        focus: "sidebarIconForce",
        control: this.icons[index].name,
        actions: [
            function (f) {
                cleverapps.timeouts.setTimeout(f, 1100);
            },

            function (f) {
                index = this.anyIconWithForceIndex();
                if (index === undefined) {
                    f();
                    return;
                }

                this.onForceIcon(index);

                cleverapps.forces.onceForceClosed = f;
            }.bind(this)
        ]
    });
};

SideBar.prototype.addTemporaryIcon = function (icon) {
    this.availableIcons.push(icon);

    for (var i = this.availableIcons.length - 2; i >= 0 && icon.priority > this.availableIcons[i].priority; i--) {
        this.availableIcons[i + 1] = this.availableIcons[i];
        this.availableIcons[i] = icon;
    }

    this.savePositions();

    if (icon.available) {
        this.addIcon(icon);
    }
};

SideBar.prototype.removeTemporaryIcon = function (icon) {
    var index = this.availableIcons.indexOf(icon);
    if (index !== -1) {
        this.availableIcons.splice(index, 1);
        this.savePositions();
    }
    this.removeIcon(icon);
};

SideBar.prototype.addIcon = function (icon) {
    var insertId = this.icons.length;
    for (var i = this.icons.length - 1; i >= 0; i--) {
        if (this.icons[i].availableIndex < icon.availableIndex) {
            break;
        }
        insertId--;
    }

    for (i = this.icons.length - 1; i >= insertId; i--) {
        this.icons[i + 1] = this.icons[i];
        this.onMoveIcon(i + 1, i);
    }
    this.icons[insertId] = icon;

    this.onAddIcon(insertId);
};

SideBar.prototype.findMissionIcon = function (type) {
    for (var i = 0; i < this.availableIcons.length; i++) {
        var icon = this.availableIcons[i];
        if (icon instanceof MissionIcon && icon.mission.type === type) {
            return icon;
        }
    }

    return undefined;
};

SideBar.prototype.findOfferIcon = function (type) {
    for (var i = 0; i < this.availableIcons.length; i++) {
        var icon = this.availableIcons[i];
        if (icon instanceof OfferIcon && icon.offer.type === type) {
            return icon;
        }
    }

    return undefined;
};

SideBar.prototype.getTeaserIcon = function () {
    return this.availableIcons.filter(function (icon) {
        return icon instanceof TeaserIcon;
    })[0];
};

SideBar.prototype.removeIcon = function (icon) {
    var i = this.icons.indexOf(icon);
    if (i === -1) {
        return;
    }

    this.onRemoveIcon(i);

    for (; i < this.icons.length - 1; i++) {
        this.icons[i] = this.icons[i + 1];
        this.onMoveIcon(i, i + 1);
    }

    this.icons.pop();
};

SideBar.LEFT_COLUMN = 0;
SideBar.RIGHT_COLUMN = 1;

SideBar.SLOTS = [{
    row: 0,
    col: SideBar.LEFT_COLUMN
}, {
    row: 1,
    col: SideBar.LEFT_COLUMN
}, {
    row: 2,
    col: SideBar.LEFT_COLUMN
}, {
    row: 0,
    col: SideBar.RIGHT_COLUMN
}, {
    row: 1,
    col: SideBar.RIGHT_COLUMN
}, {
    row: 2,
    col: SideBar.RIGHT_COLUMN
}, {
    row: 3,
    col: SideBar.LEFT_COLUMN
}, {
    row: 3,
    col: SideBar.RIGHT_COLUMN
}, {
    row: 4,
    col: SideBar.LEFT_COLUMN
}, {
    row: 4,
    col: SideBar.RIGHT_COLUMN
}];

SideBar.ICONS = [];
