/**
 * Created by Denis Kuzin on 04 october 2022
 */

var TravelBookHintView = cc.Node.extend({
    ctor: function () {
        this._super();

        cleverapps.travelBookHint.onShowHint = this.createListener(this.showHint.bind(this));
        cleverapps.travelBookHint.onHideHint = this.createListener(this.hideHint.bind(this));
    },

    showHint: function (message) {
        var toolbarBox = cleverapps.scenes.getRunningScene().downToolBarControl.getBoundingBox();

        this.dialogue = new MinimalDialogue({
            text: message,
            rects: [toolbarBox],
            person: "king"
        });
        this.addChild(this.dialogue);

        this.dialogue.display();

        var travelBookToolbarItem = cleverapps.toolbar.getItem(ToolbarItem.TRAVEL_BOOK.type);
        travelBookToolbarItem.setFinger(true, cleverapps.parseInterval("4 seconds"));
    },

    hideHint: function () {
        if (this.dialogue) {
            this.dialogue.remove();
        }
    }
});