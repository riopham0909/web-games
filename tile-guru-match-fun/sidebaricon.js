/**
 * Created by mac on 2/23/20
 */

var SideBarIcon = function (options) {
    this.available = false;
    this.animation = undefined;
    this.locked = false;
    this.disabled = false;
    this.lottery = false;
    this.attention = false;
    this.title = undefined;
    this.titleIcon = undefined;
    this.leftTime = undefined;
    this.priority = SideBar.PRIORITY_NORMAL;

    Object.assign(this, options);

    this.clearListeners();
};

SideBarIcon.prototype.clearListeners = function () {
    this.onShowIconListener = function () {};

    this.onUnlockListener = function () {};

    this.onEnableListener = function () {};
    this.onDisableListener = function () {};

    this.onAddLotteryListener = function () {};
    this.onRemoveLotteryListener = function () {};

    this.onAttentionOnListener = function () {};
    this.onAttentionOffListener = function () {};

    this.onFingerOnListener = function () {};
    this.onFingerOffListener = function () {};

    this.onChangeTitleListener = function () {};

    this.onStartTimerListener = function () {};
    this.onRemoveTimerListener = function () {};
};

SideBarIcon.prototype.getTargetTypes = function () {
    return this.targets;
};

SideBarIcon.prototype.setAnimation = function (animation, skin) {
    if (this.animation !== animation) {
        this.animation = animation;
        this.skin = skin;
        this.onShowIconListener();
    }
};

SideBarIcon.prototype.setIcon = function (icon) {
    if (this.icon !== icon) {
        this.icon = icon;
        this.onShowIconListener();
    }
};

SideBarIcon.prototype.setDisabled = function (disabled) {
    disabled = !!disabled;

    if (this.disabled !== disabled) {
        this.disabled = disabled;

        if (this.disabled) {
            this.onDisableListener();
        } else {
            this.onEnableListener();
        }
    }
};

SideBarIcon.prototype.setLocked = function (locked) {
    locked = !!locked;
    if (this.locked !== locked) {
        this.locked = locked;

        if (!this.locked) {
            this.onUnlockListener();
        }
    }
};

SideBarIcon.prototype.setLottery = function (lottery) {
    lottery = !!lottery;
    if (this.lottery !== lottery) {
        this.lottery = lottery;

        if (lottery) {
            this.onAddLotteryListener();
        } else {
            this.onRemoveLotteryListener();
        }
    }
};

SideBarIcon.prototype.setAttention = function (attention) {
    attention = !!attention;
    if (this.attention !== attention) {
        this.attention = attention;

        if (attention) {
            this.onAttentionOnListener();
        } else {
            this.onAttentionOffListener();
        }
    }
};

SideBarIcon.prototype.setFinger = function (finger) {
    finger = !!finger;
    if (this.finger !== finger) {
        this.finger = finger;

        if (finger) {
            this.onFingerOnListener();
        } else {
            this.onFingerOffListener();
        }
    }
};

SideBarIcon.prototype.setTitle = function (title) {
    if (this.title !== title) {
        this.title = title;

        this.onChangeTitleListener();
    }
};

SideBarIcon.prototype.setLeftTime = function (leftTime) {
    if (this.leftTime !== leftTime) {
        this.leftTime = leftTime;
    }

    if (this.leftTime > 0) {
        this.onStartTimerListener();
    } else {
        this.onRemoveTimerListener();
    }
};

SideBarIcon.prototype.resetState = function () {

};

SideBarIcon.prototype.getLockedTipData = function () {
    return undefined;
};

SideBarIcon.prototype.onPressed = function () {

};

SideBarIcon.prototype.getForce = function () {
    return undefined;
};

SideBarIcon.prototype.removeFromSideBar = function () {
    cleverapps.sideBar.removeIcon(this);
};

SideBarIcon.prototype.getTitle = function () {
    if (this.locked) {
        if (this.locked.lockedEvent) {
            return Messages.get("Soon");
        }

        return Messages.get("IconLocked.TextDefault", {
            levelNo: cleverapps.humanReadableNumber({ floatLevel: this.locked.level })
        });
    }

    return this.title;
};

SideBarIcon.prototype.getToolTip = function () {
    if (this.locked) {
        return {
            position: cleverapps.styles.UI.Tooltip.LOCATION.above,
            text: Messages.get("IconLocked.TipDefault", {
                level: this.getLockedTipData()
            })
        };
    }
};
