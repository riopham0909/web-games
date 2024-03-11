levels.FPS = {
    run: function (episode, level) {
        if (!levels.FPS.fpsInterval) {
            levels.FPS.episode = episode;
            levels.FPS.level = level;
            levels.FPS.fpsStatistics = [];
            levels.FPS.fpsTotalFrames = cc.director.getTotalFrames();
            levels.FPS.fpsInterval = setInterval(function () {
                if (levels.FPS.fpsStatistics.length < levels.FPS.FPS_STATISTICS_MAX_LENGTH) {
                    var tf = cc.director.getTotalFrames();
                    var fps = Math.round((tf - levels.FPS.fpsTotalFrames) * 1000 / levels.FPS.FPS_STATISTICS_INTERVAL);
                    if (fps > 60) {
                        fps = 60;
                    } 
                    levels.FPS.fpsStatistics.push(fps);
                    levels.FPS.fpsTotalFrames = tf;
                } else {
                    levels.FPS.stop();
                }
            }, levels.FPS.FPS_STATISTICS_INTERVAL);
        }
    },

    stop: function () {
        if (levels.FPS.fpsInterval) {
            clearInterval(levels.FPS.fpsInterval);
            levels.FPS.fpsInterval = false;
        }
        if (levels.FPS.fpsStatistics && levels.FPS.fpsStatistics.length) {
            levels.FPS.fpsStatistics.sort();
            var percentFps = levels.FPS.fpsStatistics[Math.floor(levels.FPS.fpsStatistics.length * levels.FPS.FPS_STATISTICS_PERCENT_VALUE)];
            console.log("SAVE FPS: " + percentFps);

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_FPS, {
                episode: levels.FPS.episode,
                level: levels.FPS.level,
                fps: percentFps
            });
            levels.FPS.fpsStatistics = false;
        }
    }
};

levels.FPS.FPS_STATISTICS_MAX_LENGTH = 15;
levels.FPS.FPS_STATISTICS_PERCENT_VALUE = 0.1;
levels.FPS.FPS_STATISTICS_INTERVAL = 500;
levels.FPS.FPS_SWITCH_TO_LOW = 40;