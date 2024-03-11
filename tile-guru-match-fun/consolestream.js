/**
 * Created by Andrey Popov on 6/21/21.
 */

cleverapps.ConsoleStream = function () {
    this.messages = [];
    this.enabled = false;

    if (cleverapps.ConsoleStream.DEBUG_USERS[cleverapps.platform.getUserID()]
        || cleverapps.platform.oneOf(Samsung) && cleverapps.config.debugMode && !cleverapps.isLocalhost()) {
        this.permanent = true;
    }

    if (this.permanent || cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.CONSOLE_STREAM_START_TIME)) {
        this.enable();
    }
};

cleverapps.ConsoleStream.prototype.enable = function (expiredCallback) {
    var startTime = cleverapps.castType(cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.CONSOLE_STREAM_START_TIME, { raw: true }));
    if (!startTime) {
        startTime = Date.now();
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.CONSOLE_STREAM_START_TIME, startTime);
    }

    if (this.permanent || startTime + cleverapps.ConsoleStream.CONSOLE_STREAM_MAX_DURATION > Date.now()) {
        if (this.enabled) {
            return;
        }

        this.enabled = true;
        this.overrideConsole();
    } else {
        expiredCallback && expiredCallback();
    }
};

cleverapps.ConsoleStream.prototype.disable = function () {
    if (this.permanent) {
        return;
    }

    cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.CONSOLE_STREAM_START_TIME);

    if (!this.enabled) {
        return;
    }
    this.enabled = false;

    if (this.baseConsoleLog) {
        console.log = this.baseConsoleLog;
        this.baseConsoleLog = undefined;
    }

    if (this.baseConsoleError) {
        console.error = this.baseConsoleError;
        this.baseConsoleError = undefined;
    }
};

cleverapps.ConsoleStream.prototype.sendMessages = function () {
    if (this.messages.length === 0) {
        return;
    }

    cleverapps.ConsoleStream.sendMessages("CONSOLE OUTPUT REDIRECT", this.messages);

    this.baseConsoleLog && this.baseConsoleLog("sended console " + this.messages.length + " messages");

    this.messages = [];
};

cleverapps.ConsoleStream.sendMessages = function (group, messages) {
    var message = cleverapps.ErrorHandler.formatMessage([group].concat(messages));

    if (!cleverapps.isLocalhost()) {
        cleverapps.RestClient.sendRaw(cleverapps.RestClient.METHODS.POST, cleverapps.LOG_ERROR_URL, message);
    }
};

cleverapps.ConsoleStream.sendLoadingTime = function (message) {
    if (cleverapps.config.sendLoadingTime) {
        cleverapps.ConsoleStream.sendMessages("LOADING TIME", [message]);
        console.log(message);
    }
};

cleverapps.ConsoleStream.prototype.overrideConsole = function () {
    this.baseConsoleLog = console.log;
    this.baseConsoleError = console.error;

    console.error = console.log = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (cleverapps.isNodeOrElement(arguments[i])) {
                return;
            }
        }

        var message = Array.from(arguments).map(function (argument) {
            return JSON.stringify(argument, cleverapps.ConsoleStream.serializer());
        }).join("\n");
        this.messages.push(message);

        this.sendMessages();

        this.baseConsoleLog.apply(this, arguments);
    }.bind(this);
};

cleverapps.ConsoleStream.serializer = function (replacer, cycleReplacer) {
    var stack = [];
    var keys = [];

    if (cycleReplacer == null) {
        cycleReplacer = function (key, value) {
            if (stack[0] === value) {
                return "[Circular ~]";
            }
            return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
        };
    }

    return function (key, value) {
        if (value instanceof cc.Node) {
            value = "[cc.Node " + value.__instanceId + "]";
        }
        if (stack.length > 0) {
            var thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
            if (~stack.indexOf(value)) {
                value = cycleReplacer.call(this, key, value);
            }
        } else {
            stack.push(value);
        }

        return replacer == null ? value : replacer.call(this, key, value);
    };
};

cleverapps.ConsoleStream.CONSOLE_STREAM_MAX_DURATION = cleverapps.parseInterval("3 day");

cleverapps.ConsoleStream.DEBUG_USERS = cleverapps.createSet([
    // FB
    "4993716770646895", // Petr Isakov
    "6644221842301610", // Petr Isakov (indonesia)
    // OK
    // "576593702177", Andrey Kargapolov
    "534942129934", // Petr Isakov
    "580731438762",
    "577203420866",
    "585959187481",
    "564566964211",
    "573870870859",
    "590442871830",
    // VK
    "519644122", // Petr Isakov
    "59691942",
    "__259527704018596"
]);
