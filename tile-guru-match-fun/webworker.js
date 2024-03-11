/**
 * Created by Andrey Popov on 5/12/23.
 */

var WebWorker = {
    IsAvailable: function () {
        return ["blocks"].indexOf(cleverapps.config.type) !== -1;
    },

    Build: function () {
        var webWorker;
        if (cleverapps.isLocalhost()) {
            webWorker = new Worker("cleverapps/levels/game/blocks/worker/blocksworker.js");
        } else {
            var workerTaskScript = document.getElementById("web-worker-task").innerHTML;
            webWorker = new Worker(window.URL.createObjectURL(new Blob([workerTaskScript], { type: "text/javascript" })));
        }

        webWorker.postMessage(Forms.ALL_POSSIBLE_VARIANTS);
        return webWorker;
    }
};
