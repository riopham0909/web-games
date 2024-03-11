/**
 * Created by vladislav on 10.02.2022
 */

var CupTableView = cc.Node.extend({
    ctor: function (cup, tableConstructor, options) {
        options = options || {};

        this._super();
        this.cup = cup;
        this.tableConstructor = tableConstructor;
        this.table = this.tableConstructor();

        this.scaleDuration = options.scaleDuration;
        this.scaleEasing = options.scaleEasing;

        this.updateSize();
        this.setAnchorPoint2();

        this.updatePosition();
        this.addChild(this.table);

        this.cupStart = this.cup.start;
        this.updateState();

        this.cup.onChangedTable = this.createListener(this.updateState.bind(this));
    },

    updateSize: function () {
        this.setContentSize2(this.table.getContentSize());
    },

    updatePosition: function () {
        this.table.setPositionRound(this.width / 2, this.height / 2);
    },

    updateState: function () {
        if (this.animationRunning) {
            return;
        }

        if (this.cup.start === this.cupStart) {
            var participants = this.cup.listParticipants();

            if (this.table.updateResults(participants)) {
                cleverapps.cupsTopTable.updateResults(this.cup.type, participants);
                return;
            }

            this.cupStart = undefined;
            this.updateState();
            return;
        }

        this.animationRunning = true;

        this.hideTable(function () {
            cleverapps.cupsTopTable.updateResults(this.cup.type, this.cup.listParticipants());
            this.cupStart = this.cup.start;

            this.recreateTable();

            this.showTable(function () {
                this.animationRunning = false;
            }.bind(this));
        }.bind(this));
    },

    recreateTable: function () {
        var position = this.table.getPosition();
        this.table.removeFromParent();
        this.table = this.tableConstructor();
        this.table.setPositionRound(position);
        this.addChild(this.table);
    },

    showTable: function (callback) {
        this.table.setScale(0);
        this.table.runAction(new cc.Sequence(
            new cc.ScaleTo(this.scaleDuration || 0.5, 1).easing(this.scaleEasing || cc.easeBackOut()),
            new cc.CallFunc(callback)
        ));
    },

    hideTable: function (callback) {
        this.table.runAction(new cc.Sequence(
            new cc.ScaleTo(this.scaleDuration || 0.5, 0).easing(this.scaleEasing || cc.easeBackIn()),
            new cc.CallFunc(callback)
        ));
    }
});