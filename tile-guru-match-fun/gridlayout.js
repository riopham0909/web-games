/**
 * Created by razial on 09.01.2021
 */

cleverapps.GridLayout = cc.Node.extend({
    ctor: function (items, options) {
        this._super();

        this.items = items.slice();

        this.setAnchorPoint2();
        this.prepareOptions(options);
        this.reshape();
    },

    prepareOptions: function (options) {
        options = options || {};
        options.padding = options.padding || {};
        options.margin = options.margin || {};
        options.align = options.align || {};
        options.separator = options.separator || {};

        this.options = {
            columns: options.columns || 1,
            reverseRows: options.reverseRows || false,
            margin: {
                x: options.margin.x || 0,
                y: options.margin.y || 0
            },
            padding: {
                left: options.padding.left || options.padding.x || 0,
                right: options.padding.right || options.padding.x || 0,
                top: options.padding.top || options.padding.y || 0,
                bottom: options.padding.bottom || options.padding.y || 0
            },
            align: {
                x: options.align.x || cleverapps.GridLayout.ALIGN_CENTER,
                y: options.align.y || cleverapps.GridLayout.ALIGN_CENTER
            },
            cell: options.cell && {
                width: options.cell.width || 0,
                height: options.cell.height || 0
            },
            separator: {
                horizontal: options.separator.horizontal,
                map: options.separator.map
            },
            ascZOrder: options.ascZOrder
        };
    },

    setItems: function (items) {
        this.items = items.slice();

        this.reshape(false);
    },

    addItems: function (items) {
        items = cleverapps.toArray(items);

        this.setItems(this.items.concat(items));
    },

    removeItems: function (items) {
        items = cleverapps.toArray(items);

        this.setItems(cleverapps.substract(this.items, items, function (item) {
            return item.__instanceId;
        }));
    },

    sortItems: function (sortingFunc) {
        this.items = this.items.slice().sort(sortingFunc);

        this.reshape(false);
    },

    calcCellsSize: function () {
        var columnsWidth = this.columnsWidth = [];
        var rowsHeight = this.rowsHeight = [];

        if (this.options.cell) {
            for (var i = 0; i < this.rows.length; ++i) {
                rowsHeight[i] = this.options.cell.height;
            }
            for (i = 0; i < this.options.columns; ++i) {
                columnsWidth[i] = this.options.cell.width;
            }
        } else {
            for (i = 0; i < this.rows.length; ++i) {
                for (var j = 0, row = this.rows[i]; j < row.length; ++j) {
                    var child = row[j];
                    columnsWidth[j] = Math.max(child.width * child.scaleX, columnsWidth[j] || 0);
                    rowsHeight[i] = Math.max(child.height * child.scaleY, rowsHeight[i] || 0);
                }
            }
        }
    },

    splitItemsInRows: function () {
        var rows = this.rows = [];
        for (var i = 0; i < this.items.length; i += this.options.columns) {
            rows.push(this.items.slice(i, i + this.options.columns));
        }

        if (!this.options.reverseRows) {
            rows.reverse();
        }
    },

    reshape: function (cleanUp) {
        this.removeAllChildren(cleanUp);
        this.splitItemsInRows();
        this.calcCellsSize();

        var options = this.options;
        var curX, curY = options.padding.bottom;

        for (var i = 0; i < this.rows.length; ++i) {
            curX = options.padding.left;
            var row = this.rows[i];

            for (var j = 0; j < row.length; ++j) {
                this.insertChild(row[j], curX, curY, i, j);

                if (options.separator.horizontal && j !== row.length - 1) {
                    if (!row[j].skipSeparator) {
                        this.addSeparator(options.separator.horizontal, curX + this.columnsWidth[j], curY, options.margin.x, this.rowsHeight[i]);
                    }
                }
                curX += this.columnsWidth[j] + options.margin.x;
            }

            curY += this.rowsHeight[i] + options.margin.y;
        }

        var width = this.columnsWidth.reduce(function (acc, value) {
            return acc + value + options.margin.x; 
        }, 0) + options.padding.left + options.padding.right - options.margin.x;
        var height = curY + options.padding.top - options.margin.y;

        this.setContentSize2(width, height);
    },

    insertChild: function (child, curX, curY, row, col) {
        var anchor = {}, position = {};

        switch (this.options.align.x) {
            case cleverapps.GridLayout.ALIGN_START:
                anchor.x = 0;
                position.x = curX;
                break;

            case cleverapps.GridLayout.ALIGN_END:
                anchor.x = 1;
                position.x = curX + this.columnsWidth[col];
                break;

            default:
                anchor.x = 0.5;
                position.x = curX + this.columnsWidth[col] / 2;
                break;
        }

        switch (this.options.align.y) {
            case cleverapps.GridLayout.ALIGN_START:
                anchor.y = 0;
                position.y = curY;
                break;

            case cleverapps.GridLayout.ALIGN_END:
                anchor.y = 1;
                position.y = curY + this.rowsHeight[row];
                break;

            default:
                anchor.y = 0.5;
                position.y = curY + this.rowsHeight[row] / 2;
                break;
        }

        this.addChild(child);
        child.setAnchorPoint2(anchor.x, anchor.y);
        child.setPositionRound(position.x, position.y);
    },

    addSeparator: function (styles, x, y, width, height) {
        var separator = new cc.Sprite(styles.icon || bundles.merge.frames.next_arrow);
        separator.setAnchorPoint2();
        separator.setPositionRound(
            x + (styles.x ? separator.calculateCoordinate(styles.x, "x", width) : width / 2),
            y + (styles.y ? separator.calculateCoordinate(styles.y, "y", height) : height / 2)
        );
        this.addChild(separator);
    }
});
cleverapps.GridLayout.ALIGN_CENTER = 0;
cleverapps.GridLayout.ALIGN_START = 1;
cleverapps.GridLayout.ALIGN_END = 2;
