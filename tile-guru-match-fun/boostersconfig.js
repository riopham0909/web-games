/**
 * Created by vladislav on 30.12.2021
 */

cleverapps.Boosters.CONFIG = {};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_CELL] = {
    model: CellBooster,
    price: {
        hard: 100
    },
    limit: AdsLimits.TYPES.BOOSTER_1,
    icon_moving: bundles.game.frames.cellbooster_moving_png,
    icon: bundles.game.frames.cellbooster_png,
    icon_active: bundles.game.frames.cellbooster_active_png,
    available: {
        level: 1.6
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_LINE] = {
    model: LineBooster,
    price: {
        hard: 150
    },
    limit: AdsLimits.TYPES.BOOSTER_2,
    icon_moving: bundles.game.frames.linebooster_moving_png,
    icon: bundles.game.frames.linebooster_png,
    icon_active: bundles.game.frames.linebooster_active_png,
    available: {
        level: 2.53
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_COLOR] = {
    model: ColorBooster,
    price: {
        hard: 200
    },
    limit: AdsLimits.TYPES.BOOSTER_3,
    icon_moving: bundles.game.frames.colorbooster_moving_png,
    icon: bundles.game.frames.colorbooster_png,
    icon_active: bundles.game.frames.colorbooster_active_png,
    available: {
        level: 3.33
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_HINT] = {
    model: HintBooster,
    price: {
        hard: (cleverapps.config.subtype === "stacks") ? 150 : 50
    },
    force: Forces.FREE_HINT_FORCE,
    limit: AdsLimits.TYPES.BOOSTER_1,
    available: {
        level: 0.07,
        olympics: {
            level: 0.25
        }
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_WILDCARD] = {
    model: WildcardBooster,
    price: {
        hard: 150
    },
    limit: AdsLimits.TYPES.BOOSTER_3,
    available: {
        level: 0.65
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_SHUFFLE] = {
    model: ShuffleBooster,
    force: Forces.FREE_SHUFFLE_FORCE,
    price: {
        hard: 100
    },
    limit: AdsLimits.TYPES.BOOSTER_2,
    available: {
        level: 0.25,
        projectName: ["scramble"]
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_BRUSH] = {
    model: BrushBooster,
    force: Forces.FREE_PAINT_FORCE,
    price: {
        hard: 200
    },
    limit: AdsLimits.TYPES.BOOSTER_3,
    available: {
        level: 0.8
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_DISCOVER] = {
    model: DiscoverBooster,
    force: Forces.FREE_HINT_FORCE,
    limit: AdsLimits.TYPES.BOOSTER_1,
    price: {
        hard: 50
    },
    available: {
        level: 0.8
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_TILE_SHUFFLE] = {
    model: TileShuffleBooster,
    force: Forces.FREE_SHUFFLE_FORCE,
    price: {
        soft: 40
    },
    executeEffect: bundles.game.urls.shuffle_booster_effect,
    limit: AdsLimits.TYPES.BOOSTER_2,
    available: {
        level: 0.91,
        types: ["tile3"]
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_UNDO] = {
    model: UndoBooster,
    force: Forces.FREE_UNDO_FORCE,
    price: {
        hard: 50,
        soft: 100
    },
    disableForceOnInactive: true,
    executeEffect: bundles.game.urls.undo_booster_effect,
    limit: AdsLimits.TYPES.BOOSTER_1,
    available: {
        level: 0.4
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_VACUUM] = {
    model: VacuumBooster,
    force: Forces.FREE_VACUUM_FORCE,
    disableForceOnInactive: true,
    price: {
        soft: 395
    },
    executeEffect: bundles.game.urls.return_booster_effect,
    limit: AdsLimits.TYPES.BOOSTER_3,
    available: {
        level: 1.6,
        types: ["tile3"]
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_REPLACE_ALL] = {
    model: ReplaceAllBooster,
    force: Forces.FREE_REPLACE_ALL_FORCE,
    disableForceOnInactive: true,
    price: {
        soft: 100
    },
    limit: AdsLimits.TYPES.BOOSTER_2,
    available: {
        level: 0.26,
        types: ["blocks"]
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_CLEAR_PIECES] = {
    model: ClearPiecesBooster,
    force: Forces.FREE_NEXT_PIECES_FORCE,
    disableForceOnInactive: true,
    price: {
        soft: 300
    },
    limit: AdsLimits.TYPES.BOOSTER_2,
    available: {
        level: 0.4,
        types: ["blocks"]
    }
};

cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_UNDO_PIECE] = {
    model: UndoPieceBooster,
    force: Forces.FREE_UNDO_PIECE,
    disableForceOnInactive: true,
    price: {
        soft: 50
    },
    limit: AdsLimits.TYPES.BOOSTER_1,
    available: {
        level: 0.13,
        types: ["blocks"]
    }
};

if (cleverapps.config.type === "klondike") {
    cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_UNDO].price = { hard: 0 };
    cleverapps.Boosters.CONFIG[cleverapps.Boosters.TYPE_HINT].price = { hard: 0 };
}
