/**
 * Created by Andrey Popov on 12/1/20.
 */

var ChatMessage = function () {
};

ChatMessage.fromData = function (messageData) {
    var message = new ChatMessage();

    message.id = messageData.id;
    message.userId = messageData.userId;
    message.postDate = messageData.postDate;
    message.message = messageData.message;
    message.isResponse = messageData.isResponse;
    message.readByUser = messageData.readByUser;
    message.tag = messageData.tag;
    message.status = messageData.status;
    message.dialogueId = messageData.dialogueId;

    message.type = ChatMessage.MESSAGE_TYPE.CHAT;
    return message;
};

ChatMessage.createServiceMessage = function (text, id) {
    var message = new ChatMessage();
    message.id = id || "service_" + text;
    message.message = text;
    message.type = ChatMessage.MESSAGE_TYPE.SERVICE;
    return message;
};

ChatMessage.createSeparator = function (id) {
    var message = new ChatMessage();
    message.id = "separator_" + id;
    message.type = ChatMessage.MESSAGE_TYPE.SEPARATOR;
    return message;
};

ChatMessage.createTemporaryMessage = function (text) {
    var message = new ChatMessage();
    message.id = "tmp_" + text;
    message.message = text;
    message.type = ChatMessage.MESSAGE_TYPE.TEMPORARY;
    message.postDate = new Date().toString();
    return message;
};

ChatMessage.createCategoryButtons = function () {
    var message = new ChatMessage();
    message.id = "category_buttons";
    message.type = ChatMessage.MESSAGE_TYPE.CATEGORIES;
    return message;
};

ChatMessage.prototype.hasGift = function () {
    return this.tag === "gift" || this.tag === "takengift";
};

ChatMessage.prototype.isGiftTaken = function () {
    return this.tag === "takengift";
};

ChatMessage.prototype.isTurningOnConsoleStream = function () {
    return this.tag === "stream_on";
};

ChatMessage.prototype.isTurningOffConsoleStream = function () {
    return this.tag === "stream_off";
};

ChatMessage.prototype.isFromActiveOrUnreadDialogue = function () {
    if (cleverapps.chat.activeDialogueId === this.dialogueId) {
        return true;
    }

    var activeDialogueId = (cleverapps.chat.getLastMessage() || {}).dialogueId;
    return cleverapps.chat.wasUnreadMessages && this.dialogueId === activeDialogueId;
};

ChatMessage.prototype.isApplicable = function () {
    this.parseGift();

    if (this.metha) {
        if (this.metha.farm) {
            var buildingId = parseInt(this.metha.farm.building);
            var building = cleverapps.farm.buildings[buildingId];
            var questId = parseInt(this.metha.farm.quest);

            if (!building || questId >= building.quests.length) {
                return false;
            }
        } else if (this.metha.simple) {
            return parseInt(this.metha.simple.current) < cleverapps.simple.bgsAmount;
        }
    }

    if (this.harvested) {
        return Object.keys(this.harvested).filter(function (code) {
            return cleverapps.unitsLibrary.listAvailableByType("fruit").indexOf(code) !== -1;
        }).length > 0;
    }

    if (this.presents && this.presents.expedition) {
        var page = cleverapps.travelBook.getPageById(this.presents.expedition);
        return page && page.isActive();
    }

    return true;
};

ChatMessage.prototype.parseGift = function () {
    if (this.parsed) {
        return;
    }
    this.parsed = true;

    var gifts = JSON.parse(this.message);

    if (gifts.presents) {
        var reward = this.presents = {};

        if (gifts.expedition) {
            reward.expedition = gifts.expedition;
        }

        gifts.presents.forEach(function (present) {
            if (typeof present !== "object" || present.type === undefined || present.amount === undefined) {
                return;
            }

            var name = present.type;

            // migration from old present types
            if (name === "coins") {
                name = "soft";
            } else if (name === "gold") {
                name = "hard";
            } else if (name === "lives2") {
                name = "lives";
            }

            if (["hard", "unlimitedLives", "stars", "exp", "lives", "soft", "wands", "worker", "unit", "growthFund"].indexOf(name) === -1
                && name.indexOf("booster") !== 0 && name.indexOf("hl") !== 0) {
                return;
            }
            var amount = present.amount;
            if (name.indexOf("booster") === 0) {
                if (reward.boosters === undefined) {
                    reward.boosters = [];
                }
                reward.boosters[parseInt(name.replace("booster", ""))] = amount;
            } else if (name === "unlimitedLives") {
                reward.unlimitedLives = amount + " hour";
            } else if (name === "worker") {
                reward.worker = amount + " hour";
            } else if (name.indexOf("hl") !== -1) {
                if (!reward.herolevels) {
                    reward.herolevels = [];
                }
                reward.herolevels.push([name.replace("hl", ""), present.amount]);
            } else if (name === "unit") {
                reward.unit = {
                    code: present.code,
                    stage: present.stage,
                    amount: amount || 1
                };
            } else {
                reward[name] = amount;
            }
        });
    } else if (gifts.progress) {
        this.progress = gifts.progress;
    } else if (gifts.restoreProgressId) {
        this.restoreProgressId = gifts.restoreProgressId;
    } else if (gifts.metha) {
        this.metha = gifts.metha;
    } else if (gifts.harvested) {
        this.harvested = gifts.harvested;
    }
};

ChatMessage.MESSAGE_TYPE = {
    CHAT: 0,
    SERVICE: 1,
    TEMPORARY: 2,
    SEPARATOR: 3,
    CATEGORIES: 4
};
