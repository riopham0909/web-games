/**
 * Created by Andrey Popov on 12/1/20.
 */

var Chat = function () {
    this.messages = [];

    cleverapps.EventEmitter.call(this);

    this.editingMode = false;
    this.closing = false;
    this.hasUnread = false;
    this.wasUnreadMessages = false;
    this.activeDialogueId = undefined;
    this.categoryTag = undefined;

    this.loadSave();

    setInterval(this.reload.bind(this), cleverapps.parseInterval(Chat.RELOAD_INTERVAL));
};

Chat.prototype = Object.create(cleverapps.EventEmitter.prototype);
Chat.prototype.constructor = Chat;

Chat.IsAvailable = function () {
    if (cleverapps.config.wysiwygMode) {
        return false;
    }

    if (cleverapps.chat.hasUnread) {
        return true;
    }

    if (cleverapps.platform.oneOf(Mobage, SPMobage, GDCom, Huzcom, Pliega)) {
        return false;
    }

    if (cleverapps.paymentsHistory.classify() > 0) {
        return true;
    }

    var conditions = {};
    if (cleverapps.config.type === "merge") {
        var startLevel = cleverapps.platform.oneOf(Instant) ? 6 : 9;
        if (Game.currentGame && cleverapps.gameLevel.getLevel() < startLevel) {
            return false;
        }
    } else {
        conditions.level = 1;
    }
    conditions.registered = "3 days";

    return levels.user.checkAvailable(conditions);
};

Chat.prototype.loadSave = function () {
    var info = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.CHAT) || {};

    this.processed = info.processed || {};
};

Chat.prototype.storeSave = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.CHAT, {
        processed: this.processed
    });
};

Chat.prototype.load = function (callback, errorCallback) {
    cleverapps.RestClient.get(
        "/chat/messages/" + encodeURIComponent(cleverapps.platform.getUserID()),
        {},
        function (messages) {
            this.processMessages(Array.isArray(messages) ? messages : []);

            MenuControlButton.updateAttention();

            if (callback) {
                callback();
            }
        }.bind(this),

        function (error) {
            MenuControlButton.updateAttention();
            
            if (errorCallback) {
                errorCallback(error);
            } else {
                this.printConnectionError(error);
            }
        }.bind(this)
    );
};

Chat.prototype.processMessages = function (messages) {
    var serverMessages = messages.map(ChatMessage.fromData);

    this.messages = [];
    this.hasUnread = false;

    var dateStr = undefined;
    var changeConsoleStreamMode = undefined;
    var dialogueId = undefined;

    serverMessages.forEach(function (message) {
        if (dialogueId && message.dialogueId !== dialogueId) {
            this.messages.push(ChatMessage.createSeparator(dialogueId));
        }
        dialogueId = message.dialogueId;

        var messageDate;
        try {
            messageDate = new Date(message.postDate).toLocaleDateString(cleverapps.settings.language || "en-US", { year: "numeric", month: "long", day: "numeric" });
        } catch (e) {
            messageDate = new Date(message.postDate).toDateString();
        }

        if (messageDate !== dateStr) {
            dateStr = messageDate;
            this.messages.push(ChatMessage.createServiceMessage(messageDate));
        }

        if (message.isResponse === 1 && message.readByUser === 0 || message.hasGift() && !message.isGiftTaken() && message.isApplicable()) {
            this.hasUnread = true;
            this.wasUnreadMessages = true;
        }

        if (message.hasGift() && this.processed[message.id]) {
            if (message.isGiftTaken()) {
                delete this.processed[message.id];
                this.storeSave();
            } else {
                cleverapps.RestClient.post("/chat/acceptGift", { id: message.id });
            }
        }

        if (message.isTurningOnConsoleStream()) {
            changeConsoleStreamMode = true;
            this.messages.push(ChatMessage.createServiceMessage("ChatConsoleStreamSwitchOn", message.id));
        } else if (message.isTurningOffConsoleStream()) {
            changeConsoleStreamMode = false;
            this.messages.push(ChatMessage.createServiceMessage("ChatConsoleStreamSwitchOff", message.id));
        } else {
            this.messages.push(message);
        }
    }.bind(this));

    if (changeConsoleStreamMode !== undefined && changeConsoleStreamMode) {
        cleverapps.consoleStream.enable(this.postMessage.bind(this, "Disable console stream", "stream_off", true));
    } else if (changeConsoleStreamMode !== undefined && !changeConsoleStreamMode) {
        cleverapps.consoleStream.disable();
    }

    var showCategories = false;

    if (this.messages.length === 0) {
        this.messages.push(ChatMessage.createServiceMessage("ChatGreetingMessage"));
        showCategories = !this.wasUnreadMessages;
    } else if (this.getLastMessage() && ["resolved", "no answer needed"].indexOf(this.getLastMessage().status) !== -1) {
        this.messages.push(ChatMessage.createSeparator(dialogueId));
        showCategories = !this.wasUnreadMessages;
    } else {
        this.activeDialogueId = dialogueId;
    }

    if (showCategories) {
        this.messages.push(ChatMessage.createCategoryButtons());
    }

    if (!this.closing) {
        this.trigger("removeMessagesByType", ChatMessage.MESSAGE_TYPE.TEMPORARY);
        this.trigger("messagesUpdated");
    }
};

Chat.prototype.postMessage = function (message, categoryTag, silent) {
    var tmpMessage = ChatMessage.createTemporaryMessage(message);
    this.messages.push(tmpMessage);
    if (!silent) {
        this.trigger("messagesUpdated");
    }

    var playerName = cleverapps.friends.getPlayer().name;
    if (playerName === Messages.get("Friends.You")) {
        playerName = Messages.get("LeadersWindow.player");
    }

    var payerLevel = cleverapps.paymentsHistory.classify();
    if (payerLevel <= cleverapps.PaymentsHistory.BRACKET_NONE && cleverapps.paymentsHistory.isPayer()) {
        payerLevel = cleverapps.PaymentsHistory.BRACKET_WEAK;
    }

    var level = cleverapps.user.getHumanReadableNumber();
    if (cleverapps.user.isPassedAll()) {
        var chosen = Episode.LevelChooseAlgorithm({
            start: 5,
            seed: cleverapps.user.getPassAllProgress()
        });
        level = cleverapps.humanReadableNumber(chosen.episodeNo, chosen.levelNo);
    }

    cleverapps.RestClient.post(
        "/chat/message",
        {
            message: message,
            userid: cleverapps.platform.getUserID(),
            isresponse: 0,
            payerlevel: payerLevel,
            name: playerName,
            language: cleverapps.settings.language,
            source: cleverapps.platform.source,
            categoryTag: categoryTag || this.categoryTag,
            level: level
        },
        function () {
            this.categoryTag = undefined;
            this.trigger("updatePlaceholder", undefined);

            this.load(function () {
                this.trigger("removeMessagesByType", ChatMessage.MESSAGE_TYPE.CATEGORIES);
            }.bind(this));
        }.bind(this),
        function () {
            var index = this.messages.indexOf(tmpMessage);
            if (index !== -1) {
                this.messages.splice(index, 1);
            }

            if (!silent) {
                this.trigger("removeMessagesByType", ChatMessage.MESSAGE_TYPE.TEMPORARY);
                this.trigger("returnMessageBack", message);
                this.printConnectionError();
            }
        }.bind(this)
    );
};

Chat.prototype.selectCategory = function (categoryTag, placeholder) {
    if (this.categoryTag === categoryTag) {
        this.categoryTag = undefined;
        this.trigger("updatePlaceholder", "");
    } else {
        this.categoryTag = categoryTag;
        this.trigger("updatePlaceholder", placeholder);
    }

    this.trigger("messagesUpdated");
};

Chat.prototype.getLastMessage = function () {
    var chatMessages = cleverapps.chat.messages.filter(function (dialogueMessage) {
        return dialogueMessage.dialogueId && dialogueMessage.status;
    });

    return chatMessages[chatMessages.length - 1];
};

Chat.prototype.markAsRead = function () {
    cleverapps.RestClient.post("/chat/markAsRead", { userid: cleverapps.platform.getUserID() });
};

Chat.prototype.acceptGift = function (message, take) {
    if (this.processed[message.id]) {
        this.reload();
        return;
    }

    var useRewardWindow = false;

    if (take) {
        if (message.progress) {
            cleverapps.user.level = parseInt(message.progress.level);
            cleverapps.user.episode = parseInt(message.progress.episode);
            cleverapps.user.save();

            if (cleverapps.hose) {
                cleverapps.hose.reset();
                cleverapps.hose.setCurrentEpisode(levels.user.episode);
            }
        } else if (message.restoreProgressId) {
            cleverapps.synchronizer.getProgress(message.restoreProgressId);
        } else if (message.presents) {
            useRewardWindow = true;
            var reward = cleverapps.clone(message.presents, true);
            delete reward.expedition;
            cleverapps.chatPresents = {
                reward: reward,
                callback: function () {
                    cleverapps.chat.processed[message.id] = true;
                    cleverapps.chat.storeSave();
                    cleverapps.RestClient.post("/chat/acceptGift", { id: message.id }, function () {
                        cleverapps.chat.reload();
                    });
                }
            };
            this.closing = true;

            var page = cleverapps.travelBook.getPageById(message.presents.expedition);
            if (page) {
                cleverapps.meta.display({
                    focus: "closeScene",
                    action: function (f) {
                        page.gotoExpedition(f);
                    }
                });
            } else {
                cleverapps.scenes.getRunningScene().closeAction();
            }
        } else if (message.metha) {
            if (message.metha.simple) {
                cleverapps.simple.current = message.metha.simple.current;
                cleverapps.simple.stars = 0;
                cleverapps.simple.save();
            } else if (message.metha.farm) {
                Farm.Reset();
                var newData = Farm.GetBuildingProgress(message.metha.farm.building, message.metha.farm.quest);
                cleverapps.farm.load(newData);
                cleverapps.farm.save();
            } else if (message.metha.home) {
                cleverapps.home.load(Home.GetFurnitureProgress(message.metha.home.furniture, message.metha.home.stage));
                cleverapps.home.save();
            }
        } else if (message.harvested) {
            var harvested = new Harvested(CustomSyncers.SLOT_MAIN);
            Object.keys(message.harvested).forEach(function (code) {
                if (cleverapps.unitsLibrary.listAvailableByType("fruit").indexOf(code) !== -1) {
                    harvested.add(code, message.harvested[code]);
                    cleverapps.user.incProgressCompare();
                }
            });
        }

        cleverapps.audio.playSound(bundles.main.urls.shop_buy_effect);
    }

    if (!useRewardWindow) {
        this.processed[message.id] = true;
        this.storeSave();
        cleverapps.RestClient.post("/chat/acceptGift", { id: message.id }, this.reload.bind(this));
    }
};

Chat.prototype.printConnectionError = function () {
    this.messages.push(ChatMessage.createServiceMessage(Messages.get("RestartWindow.AnErrorOccured"), "error_" + Date.now()));
    this.trigger("messagesUpdated");
};

Chat.prototype.reload = function () {
    if (!Chat.IsAvailable() && this.notFirstLoad) {
        return;
    }

    if (!cleverapps.environment.hasScene([cleverapps.Environment.SCENE_MAIN, cleverapps.Environment.SCENE_CHAT])) {
        return;
    }

    this.load();
    this.notFirstLoad = true;
};

Chat.prototype.giveRewards = function () {
    var unit = cleverapps.config.type === "merge" && cleverapps.chatPresents.reward.unit;
    if (unit) {
        var left = unit.amount - Game.currentGame.map.countEmptySlots();
        if (left > 0) {
            delete cleverapps.chatPresents;
            Game.currentGame.centerHint.createTextHint("Spawn.nospace", { left: left });
            return;
        }

        if (!this.canAcceptUnit(unit)) {
            delete cleverapps.chatPresents;
            Game.currentGame.centerHint.createTextHint("RestartWindow.OnError");
            return;
        }
    }

    cleverapps.meta.display({
        focus: "chatPresentsWindow",
        action: function (f) {
            new RewardWindow(cleverapps.chatPresents.reward);
            cleverapps.meta.onceNoWindowsListener = f;

            cleverapps.chatPresents.callback();
            delete cleverapps.chatPresents;
        }
    });
};

Chat.prototype.canAcceptUnit = function (unit) {
    return cleverapps.unitsLibrary.isOpened(unit)
        || Families[unit.code].units[unit.stage].climbable
        || ["clpet", "clpetrare", "clpetlegend", "xmproduct0", "xmproduct1", "xmproduct2", "drproduct0", "drproduct1", "drproduct2"].includes(Families[unit.code].type)
        || ["landmark", "dragonpack", "underseapack", "sea2pack", "hlpack", "xmpack", "rpcampaign", "dr2campaign", "dr2dragonpack",
            "hlcampaign", "hlgnome", "hlcandle", "hlspider", "hlflittermouse"].includes(unit.code);
};

Chat.RELOAD_INTERVAL = "1 minute";

Chat.CATEGORIES = [{
    message: "ChatCategory.ProblemWithPayment",
    tag: "payment",
    placeholder: "ChatCategory.ProblemWithPaymentPlaceholder"
}, {
    message: "ChatCategory.QuestionAboutTheRules",
    tag: "FAQ",
    placeholder: "ChatCategory.QuestionAboutTheRulesPlaceholder"
}, {
    message: "ChatCategory.ReportABag",
    tag: "bug",
    placeholder: "ChatCategory.ReportABagPlaceholder"
}, {
    message: "ChatCategory.AdsProblem",
    tag: "no ads",
    placeholder: "ChatCategory.AdsProblemPlaceholder"
}, {
    message: "ChatCategory.Suggestions",
    tag: "suggestion",
    placeholder: "ChatCategory.SuggestionsPlaceholder"
}, {
    message: "ChatCategory.OtherQuestions",
    tag: "other",
    placeholder: "ChatCategory.OtherQuestionsPlaceholder"
}];
