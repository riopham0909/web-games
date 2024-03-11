/**
 * Created by andrey on 01.08.2022
 */

var HideAnimations = {
    Victory: function (f) {
        f();
    },

    Lose: function (f) {
        HideAnimations.Victory.call(this, f);
    },

    GiveUp: function (f) {
        HideAnimations.Lose.call(this, f);
    }
};