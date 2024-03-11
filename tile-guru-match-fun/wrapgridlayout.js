/**
 * Created by iamso on 18.02.2022
 *
 * regular GridLayout supports only a rigid grid pattern https://gyazo.com/847b4fcb8763b8ff143504a1041ad469
 * WrapGridLayout is dynamic https://gyazo.com/b832fbb2997aa0ff70b9c55614c9981b
 */

cleverapps.WrapGridLayout = cleverapps.GridLayout.extend({
    reshape: function () {
        this.removeAllChildren();
        this.splitItemsInRows();

        var rowNodes = this.rows.map(function (rowItems, index) {
            var rowNode = new cleverapps.Layout(rowItems, {
                direction: cleverapps.UI.HORIZONTAL,
                margin: this.options.margin.x
            });
            if (this.options.ascZOrder) {
                rowNode.setLocalZOrder(this.rows.length - index);
            }

            return rowNode;
        }, this);

        var gridNode = new cleverapps.Layout(rowNodes, {
            direction: cleverapps.UI.VERTICAL,
            margin: this.options.margin.y,
            padding: this.options.padding,
            reversed: true
        });

        this.setContentSize(gridNode.getContentSize());
        this.addChild(gridNode);
        gridNode.setPositionRound(this.width / 2, this.height / 2);
    }
});