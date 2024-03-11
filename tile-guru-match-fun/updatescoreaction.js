/**
 * Created by Andrey Popov on 21.04.2023
 */

var UpdateScoreAction = function (f) {
    cleverapps.instantTournament.updateScore();
    f();
};