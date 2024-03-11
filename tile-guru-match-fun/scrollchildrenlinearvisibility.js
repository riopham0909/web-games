/**
 * Created by mac on 10/28/20
 */

var ScrollChildrenLinearVisibility = function (scroll) {
    this.scroll = scroll;
};

ScrollChildrenLinearVisibility.prototype.visibleIds = function () {
    var offset, length;

    var children = this.scroll.visibilityCheckList;

    if (children.length <= 1) {
        offset = 0;
        length = children.length;
    } else {
        var n = children.length - 1;
        var aChildRect = this.getChildRect(children[0]);
        var bChildRect = this.getChildRect(children[n]);

        var a = aChildRect.getPosition();
        var b = bChildRect.getPosition();

        b.x -= a.x;
        b.x /= n;
        b.y -= a.y;
        b.y /= n;

        var step, padding;
        //a + k(b-a) - this.innerContent.width / 2
        if (b.y !== 0) {
            step = b.y;
            padding = aChildRect.height / 2;
            offset = (-this.scroll.innerContent.y - a.y + this.scroll.innerContent.height / 2 - this.scroll.height / 2) / step;
            length = (this.scroll.height + 2 * padding) / step;
        } else {
            step = b.x;
            padding = aChildRect.width / 2;
            offset = (-this.scroll.innerContent.x - a.x + this.scroll.innerContent.width / 2 - this.scroll.width / 2) / step;
            length = (this.scroll.width + 2 * padding) / step;
        }

        if (length < 0) {
            length = -length;
            offset -= length;
        }

        offset = Math.ceil(offset - padding / Math.abs(step));
        length = Math.floor(length + 2 * padding / Math.abs(step));
    }

    var ids = [];
    for (var i = 0; i < length; i++) {
        if (children[offset + i]) {
            ids.push(offset + i);
        }
    }

    return ids;
};

ScrollChildrenLinearVisibility.prototype.getChildRect = function (child) {
    if (child.parent && child.parent !== this.scroll.innerContent) {
        var box = child.getBoundingBox();
        var boxCenter = cc.p(box.x + box.width / 2, box.y + box.height / 2);
        var posInInner = this.scroll.innerContent.convertToNodeSpace(child.parent.convertToWorldSpace(boxCenter));
        return cc.rect(posInInner.x, posInInner.y, box.width, box.height);
    }

    return child;
};