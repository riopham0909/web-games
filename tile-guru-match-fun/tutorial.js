/**
 * Created by slava on 4/4/17.
 */

cleverapps.Tutorial = function () {
    this.tutorialSteps = new cleverapps.TutorialSteps();
    this.steps = this.tutorialSteps.list(this.nextStep.bind(this));
};

cleverapps.Tutorial.prototype.setGame = function (game) {
    this.game = game;
    this.tutorialSteps.setGame(this.game);
};

cleverapps.Tutorial.prototype.stop = function () {
    if (this.running) {
        this.running = false;
        this.step = this.steps.length;

        this.finishCallback();
        this.finishCallback = undefined;
    }
};

cleverapps.Tutorial.prototype.start = function (f) {
    this.running = true;
    this.finishCallback = f;
    this.setStep(0);
};

cleverapps.Tutorial.prototype.remindStep = function () {
    if (this.isRunning()) {
        this.steps[this.step].call(this, this.game);
    }
};

cleverapps.Tutorial.prototype.setStep = function (step) {
    this.step = step;
    
    var params = { "step": step };

    if (this.step >= this.steps.length) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.GENERAL.TUTORIAL_COMPLETE, params);
        this.stop();
        return;
    }

    var eventName = cleverapps.EVENTS.STATS.TUTORIAL_STEP + (step + 1);
    cleverapps.eventLogger.logEvent(eventName, params);
    if (step === 0) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.TUTORIAL_BEGIN);
    }

    this.remindStep();
};

cleverapps.Tutorial.prototype.nextStep = function () {
    if (this.isRunning()) {
        this.setStep(this.step + 1);
    }
};

cleverapps.Tutorial.prototype.isRunning = function () {
    return this.running;
};