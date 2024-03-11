/**
 * Created by mac on 1/21/23
 */

var UndoHistory = function (savedHistory) {
    this.commands = [];
    this.pointer = 0;

    if (savedHistory && savedHistory.moves) {
        this.commands = savedHistory.moves.map(function (move) {
            return Game.currentGame.getCommand(move);
        });
        this.pointer = savedHistory.pointer;
    }

    this.onChangeListener = function () {};
};

UndoHistory.prototype.add = function (command) {
    this.commands.splice(this.pointer);

    this.commands.push(command);

    this.redo();
};

UndoHistory.prototype.hasUndo = function () {
    return this.pointer !== 0;
};

UndoHistory.prototype.hasRedo = function () {
    return this.commands[this.pointer] !== undefined;
};

UndoHistory.prototype.undo = function () {
    if (!this.hasUndo()) {
        return;
    }

    this.pointer--;
    var command = this.commands[this.pointer];

    command.undo();

    this.onChangeListener(this.hasUndo(), this.hasRedo());
};

UndoHistory.prototype.redo = function () {
    if (!this.hasRedo()) {
        return;
    }

    var command = this.commands[this.pointer];
    this.pointer++;

    command.redo();

    this.onChangeListener(this.hasUndo(), this.hasRedo());
};

UndoHistory.prototype.reset = function () {
    this.commands = [];
    this.pointer = 0;
    this.onChangeListener(this.hasUndo(), this.hasRedo());
};

UndoHistory.prototype.getInfo = function () {
    return {
        moves: this.commands.map(function (command) {
            return command.move;
        }),
        pointer: this.pointer
    };
};