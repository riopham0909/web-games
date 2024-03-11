/**
 * Created by vladislav on 13.07.20.
 */

var UndoButtonBooster = BaseButtonBooster.extend({
    ctor: function (booster) {
        this._super({
            booster: booster,
            styles: cleverapps.styles.UndoButtonBooster
        });

        this.setLocalZOrder(cleverapps.styles.UndoButtonBooster.zOrder);

        this.booster.updateState();
    },

    createIcon: function () {
        var icon = new cleverapps.Spine(bundles.buttons.jsons.undo_json);
        icon.setAnimation(0, "idle", false);
        return icon;
    },

    onExecute: function () {
        this.icon.setAnimation(0, "animation", false);
        cleverapps.audio.playSound(this.booster.executeEffect);
    }
});

cleverapps.styles.UndoButtonBooster = {
    width: 200,
    height: 150,
    zOrder: 0,

    position: {
        x: [{ align: "center", dx: 0 },
            { align: "right", dx: -10 },
            { align: "right", dx: -10 }
        ],
        y: [{ align: "bottom", dy: 10 },
            { align: "bottom", dy: 400 },
            { align: "bottom", dy: 400 }
        ]
    },

    phone: {
        scale: 0.8
    },

    content: {
        layout: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 24 }
        },
        margin: -15,
        direction: cleverapps.UI.VERTICAL,
        freeBlock: {
            textWidth: 120,
            dx: 0
        }
    }
};