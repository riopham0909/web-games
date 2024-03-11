/**
 * Created by vladislav on 19/12/2022
 */

var TileShuffleButtonBooster = BaseButtonBooster.extend({
    ctor: function (booster) {
        this._super({
            booster: booster,
            styles: cleverapps.styles.TileShuffleButtonBooster
        });
        this.test = true;
        this.setLocalZOrder(cleverapps.styles.TileShuffleButtonBooster.zOrder);
    },

    createIcon: function () {
        var icon = new cleverapps.Spine(bundles.buttons.jsons.shuffle_json);
        icon.setAnimation(0, "idle", false);
        return icon;
    },

    onExecute: function () {
        this.icon.setAnimation(0, "animation", false);
        cleverapps.audio.playSound(this.booster.executeEffect);
    }
});

cleverapps.styles.TileShuffleButtonBooster = {
    width: 200,
    height: 150,
    zOrder: 0,

    position: {
        x: [{ align: "left", dx: 50 },
            { align: "right", dx: -10 },
            { align: "right", dx: -10 }
        ],
        y: [{ align: "bottom", dy: 10 },
            { align: "bottom", dy: 590 },
            { align: "bottom", dy: 590 }
        ]
    },

    phone: {
        scale: 0.8
    },

    content: {
        layout: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 20 }
        },
        margin: -8,
        direction: cleverapps.UI.VERTICAL,
        freeBlock: {
            textWidth: 120,
            dx: 0
        }
    }
};