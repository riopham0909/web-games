/**
 * Created by andrey on 07.05.2021.
 */

var WebViewAudio = function (url, loop) {
    this.url = url;
    this.loop = loop;
    this.startPlaying = Date.now();
};

WebViewAudio.prototype.getPlaying = function () {
    return Date.now() < this.startPlaying + cleverapps.parseInterval(WebViewAudio.FAKE_DURATION);
};
 
WebViewAudio.FAKE_DURATION = "1 second";