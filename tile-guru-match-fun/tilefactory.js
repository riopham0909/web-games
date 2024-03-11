/**
 * Created by Andrey Popov on 12.05.2020
 */

var TileFactory = {
    Create: function (item, options) {
        options = options || {};

        if (!("components" in item) && ["tile3"].includes(cleverapps.config.type) && !item.feature) {
            TileFactory.addRegularComponents(item);
        }

        var card = TileFactory.Construct(item);

        if (!options.noMarks && !("marks" in item) && !card.feature && !["tile3"].includes(cleverapps.config.type)) {
            TileFactory.addRegularMarks(card);
        }

        return card;
    },

    Construct: function (item) {
        switch (item.feature) {
            case "curtain":
                return new CurtainCard(item);
        }
        return new Card(item);
    },

    addRegularMarks: function (card) {
        if (cleverapps.config.editorMode || cleverapps.config.wysiwygMode || card.marks.length) {
            return;
        }

        if (Game.currentGame.getMissionType() === Mission.TYPE_LETTER && Math.random() < 0.1) {
            card.marks.push(new Mark("mission"));
            return;
        }

        if (Game.currentGame.levelWithCoins && Math.random() < 0.1) {
            card.marks.push(new Mark("coin"));
        }
    },

    addRegularComponents: function (item) {
        if (cleverapps.config.editorMode || cleverapps.config.wysiwygMode) {
            return;
        }

        item.components = item.components || [];

        if (Game.currentGame.getMissionType() === Mission.TYPE_LETTER && Game.currentGame.pagination.isLast() && Math.random() < 0.15) {
            item.components.push({ name: "plate" });
        }
    }
};