/**
 * Created by slava on 8/8/18
 */

cleverapps.TableView = cc.Node.extend({
    setupRowPosition: function (row, place, callback) {
        var cb = function () {
            if (row.view.currentPlace === row.data.place && row.data.place > this.amountRows) {
                row.view.removeFromParent();
                delete this.rows[row.data.id];
            } else if (this.scroll) {
                this.setRowVisibility(row);
            }
            if (callback) {
                callback();
            }
        }.bind(this);

        place = this.amountRows - place;
        var pos = cc.p(this.innerPadding, this.innerPadding + (this.styles.margin + row.view.height) * place + row.view.height / 2);
        row.view.setLocalZOrder(place);
        if (!callback || (!this.isVisiblePosition(row.view.y, row.view.height) && !this.isVisiblePosition(pos.y, row.view.height))) {
            row.view.setPositionRound(pos);
            cb();
        } else {
            row.view.runAction(new cc.Sequence(new cc.MoveTo(0.2, pos), new cc.CallFunc(cb)));
        }
    },

    isVisiblePosition: function (position, height) {
        position -= this.scroll.innerContent.height / 2;
        return -this.scroll.innerContent.y - this.scroll.height / 2 - height / 2 <= position && position <= -this.scroll.innerContent.y + this.scroll.height / 2 + height / 2;
    },

    finishAnimation: function () {
        this.inSwapAnimation--;
        if (this.inSwapAnimation === 0) {
            this.swapIfNeed();
        }
    },

    startAnimation: function (amountAnimations) {
        if (!amountAnimations) {
            amountAnimations = 1;
        }
        this.inSwapAnimation += amountAnimations;
    },

    swapPairIfNeed: function (row1, row2) {
        var place1 = row1.view.currentPlace, place2 = row2.view.currentPlace;
        this.startAnimation(2);
        row1.view.updatePlace(place2);
        row2.view.updatePlace(place1);
        this.setupRowPosition(row1, place2, this.finishAnimation.bind(this));
        this.setupRowPosition(row2, place1, this.finishAnimation.bind(this));

        var scrollTo;
        if (row1.data.player) {
            scrollTo = this.rows[row2.id] ? row2.view : row1.view;
        } else if (row2.data.player) {
            scrollTo = this.rows[row1.id] ? row1.view : row2.view;
        }

        if (scrollTo) {
            this.scroll.runAction(new cc.ScrollAction(scrollTo, {
                duration: 0.2,
                visibleBox: {
                    top: 0.8,
                    bottom: 0.8
                }
            }).easing(cc.easeInOut(1)));
        }
    },

    findRowWithPlace: function (place) {
        for (var i in this.rows) {
            if (this.rows[i].view.currentPlace === place) {
                return this.rows[i];
            }
        }
        return false;
    },

    swapIfNeed: function () {
        if (this.inSwapAnimation !== 0) {
            return;
        }

        var best = this.amountRows + 2, bestRow, i;
        for (i in this.rows) {
            if (this.rows[i].view.currentPlace > this.rows[i].data.place && this.rows[i].data.place < best) {
                best = this.rows[i].data.place;
                bestRow = this.rows[i];
            }
        }

        if (bestRow) {
            var rowWithPlace = this.findRowWithPlace(bestRow.view.currentPlace - 1);
            if (rowWithPlace) {
                this.swapPairIfNeed(rowWithPlace, bestRow);
            }
        }
        for (i in this.rows) {
            if (this.rows[i].data.place <= best) {
                this.rows[i].view.updateAmount(this.rows[i].data.amount);
            }
        }
    },

    setRowVisibility: function (row) {
        if (row && row.view) {
            row.view.setVisible(this.isVisiblePosition(row.view.y, row.view.height));
        }
    },

    setRowsVisibility: function () {
        for (var i in this.rows) {
            this.setRowVisibility(this.rows[i]);
        }
    },

    cloneResults: function (results) {
        var data = [], i;
        for (i = 0; i < results.length; i++) {
            data.push(cleverapps.clone(results[i]));
        }
        return data;
    },

    updateResults: function (newResults) {
        if (this.amountRows !== newResults.length) {
            return false;
        }

        var data = this.cloneResults(newResults), i;

        var notInTablePlace = this.amountRows + 1;
        for (i in this.rows) {
            this.rows[i].data.place = notInTablePlace;
        }

        for (i = 0; i < data.length; i++) {
            if (this.rows[data[i].id]) {
                this.rows[data[i].id].data = data[i];
                this.rows[data[i].id].view.updateParams(data[i]);
            } else {
                if (this.dataIcon) {
                    data[i].dataIcon = this.dataIcon;
                }
                var viewData = cleverapps.clone(data[i]);
                viewData.place = notInTablePlace;
                this.rows[data[i].id] = {
                    view: new this.RowConstructor(viewData, this.rowOptions),
                    data: data[i]
                };
                this.rows[data[i].id].view.setAnchorPoint2(0, 0.5);
                this.node.addChild(this.rows[data[i].id].view);
                this.setupRowPosition(this.rows[data[i].id], viewData.place);
            }
        }

        this.swapIfNeed();
        return true;
    },

    findPlayerView: function () {
        for (var i in this.rows) {
            if (this.rows[i].data.player) {
                return this.rows[i].view;
            }
        }
        return undefined;
    },
    
    ctor: function (data, previousData, RowConstructor, dataIcon, options) {
        this.options = options || {};
        this.rows = {};
        this.amountRows = 0;
        this.inSwapAnimation = 0;
        this.startAnimation();

        if (previousData && data.length !== previousData.length) {
            previousData = undefined;
        }

        data = this.cloneResults(data);
        if (!previousData) {
            previousData = data;
        }
        previousData = this.cloneResults(previousData);

        if (!RowConstructor) {
            RowConstructor = cleverapps.Row;
        }
        this.RowConstructor = RowConstructor;
        this.dataIcon = dataIcon;
        this.rowOptions = this.options.rowOptions;

        var i;
        for (i = 0; i < previousData.length; i++) {
            if (this.dataIcon) {
                previousData[i].dataIcon = this.dataIcon;
            }
            previousData[i].clickableArea = this;
            this.rows[previousData[i].id] = {
                view: new this.RowConstructor(previousData[i], this.rowOptions),
                data: previousData[i]
            };
            this.amountRows++;
        }

        var styles = this.styles = cleverapps.styles.TableView;
        this.innerPadding = this.options.innerPadding || styles.innerPadding;
        
        this._super();
        this.setAnchorPoint2();

        var node = this.node = new cc.Node();
        node.setAnchorPoint2();
        var width = this.styles.width;
        var height = 0;

        for (i in this.rows) {
            this.rows[i].view.setAnchorPoint2(0, 0.5);
            node.addChild(this.rows[i].view);
            width = this.rows[i].view.width;
            height = this.rows[i].view.height;
            this.setupRowPosition(this.rows[i], this.rows[i].data.place);
        }

        height = this.contentHeight = this.amountRows * height + (this.amountRows - 1) * styles.margin + 2 * this.innerPadding;
        node.setContentSize2(width + 2 * this.innerPadding, height);

        this.scroll = new cleverapps.UI.ScrollView(node, {
            childrenVisibility: cleverapps.UI.ScrollView.CHILDREN_VISIBILITY_NONE,
            containerMovedListener: this.createListener(this.setRowsVisibility.bind(this))
        });
        this.scroll.setBarPadding(styles.barPadding);

        this.scroll.setAnchorPoint2(0, 0);
        this.addChild(this.scroll);

        if (options.bg !== false) {
            this.bg = new cc.Scale9Sprite(bundles.table.frames.table_bg_png);
            this.addChild(this.bg);
            this.bg.setLocalZOrder(-1);
        }

        this.updateSize();

        this.runAction(new cc.Sequence(new cc.DelayTime(0.7), new cc.CallFunc(this.finishAnimation.bind(this))));

        this.updateResults(data);

        this.setRowsVisibility();
    },

    updateSize: function () {
        var styles = this.styles = cleverapps.styles.TableView;
        var height = this.options.height || styles.height;
        if (Array.isArray(this.options.height)) {
            height = this.options.height[cleverapps.resolution.mode].height;
        }

        var dy = 0, maxHeight = (height || styles.height) + 2 * this.innerPadding;
        if (this.contentHeight <= maxHeight) {
            dy = maxHeight - this.contentHeight;
        }
        this.scroll.setContentSize2(this.node.width, dy === 0 ? maxHeight : (this.contentHeight + 1));
        if (this.options.scroll !== undefined) {
            this.scroll.scrollTo(this.options.scroll);
        } else if (dy === 0) {
            this.scroll.scrollTo(this.findPlayerView());
        }
        this.setContentSize2(this.scroll.width + 2 * styles.padding, maxHeight + 2 * styles.padding);
        this.scroll.setPosition(styles.padding, styles.padding + dy);
        if (this.options.bg !== false) {
            this.bg.setContentSize2(this.getContentSize());
            this.bg.setPositionRound(this.width / 2, this.height / 2);
        }
    }
});

cleverapps.styles.TableView = {
    width: 500,
    height: 732,

    margin: 4,
    padding: 6,
    innerPadding: 6,
    barPadding: {
        cornerPadding: 20,
        sidePadding: 5
    }
};