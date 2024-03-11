/**
 * Created by Ivan on 05.10.2023
 */

var VacuumButtonBooster = BaseButtonBooster.extend({
    ctor: function (booster) {
        this._super({
            booster: booster,
            styles: cleverapps.styles.VacuumButtonBooster
        });

        this.setLocalZOrder(cleverapps.styles.VacuumButtonBooster.zOrder);
    },

    createIcon: function () {
        return new cc.Sprite(bundles.buttons.frames.vacuum_png);
    }
});

cleverapps.styles.VacuumButtonBooster = {
    width: 200,
    height: 150,
    zOrder: 0,

    position: {
        x: [{ align: "right", dx: -50 },
            { align: "right", dx: -10 },
            { align: "right", dx: -10 }
        ],
        y: [{ align: "bottom", dy: 10 },
            { align: "bottom", dy: 210 },
            { align: "bottom", dy: 210 }
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
        margin: -8,
        direction: cleverapps.UI.VERTICAL,
        freeBlock: {
            textWidth: 120,
            dx: 0
        }
    }
};