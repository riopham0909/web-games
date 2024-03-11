/**
 * Created by andrey on 05.10.2023
 */

var WebViewConsole = {
    init: function () {
        console.log = WebViewConsole.createMethod("ConsolePlugin.log");
        console.warn = WebViewConsole.createMethod("ConsolePlugin.warn");
        console.debug = WebViewConsole.createMethod("ConsolePlugin.debug");
        console.info = WebViewConsole.createMethod("ConsolePlugin.info");
        console.error = WebViewConsole.createMethod("ConsolePlugin.error");
    },

    createMethod: function (method) {
        return function () {
            for (var i = 0; i < arguments.length; i++) {
                if (cleverapps.isNodeOrElement(arguments[i])) {
                    return;
                }
            }

            cleverapps.platform.callNative(method, {
                message: arguments[0],
                params: Array.from(arguments).slice(1)
            });
        };
    }
    
};