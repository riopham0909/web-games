/**
 * Created by olga on 18.01.2023
 */

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PACKWINDOW_LABEL_TEXT: {
        size: 45
    },
    CLOVERS_TEXT: {
        name: "nostroke",
        size: 44,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    }
});

cleverapps.overrideStyles(cleverapps.styles.GameScene, {
    sound: {
        delay: 3.5
    }
});

cleverapps.overrideStyles(cleverapps.styles.PackWindow, {
    rewards: {
        delay: 1.5,
        duration: 0.675,
        fitTo: {
            width: 200
        },

        positions: {
            default: {
                hard: {
                    x: -190,
                    y: -352
                },
                soft: {
                    x: 190,
                    y: -352
                }
            },

            starterPack0: undefined,
            starterPack: undefined,
            starterPack2: undefined
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.CloversView, {
    width: 235,
    height: 82,

    icon: {
        x: { align: "left", dx: -20 }
    },

    positions: [
        {
            x: { align: "left", dx: 40 },
            y: { align: "top", dy: -140 }
        },
        {
            x: { align: "left", dx: 40 },
            y: { align: "top", dy: -140 }
        },
        {
            x: { align: "left", dx: 40 },
            y: { align: "top", dy: -140 }
        }
    ],

    text: {
        x: { align: "center", dx: 30 },
        y: { align: "center", dy: 0 }
    }
});

cleverapps.overrideStyles(cleverapps.styles.RestoreProgressButton, {
    width: 260,
    height: 100
});