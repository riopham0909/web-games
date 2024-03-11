/**
 * Created by mac on 10/28/20
 */

var ScrollChildrenFullCheckVisibility = function (scroll) {
    this.scroll = scroll;
};

ScrollChildrenFullCheckVisibility.prototype.visibleIds = function () {
    var ids = [];
    var children = this.scroll.visibilityCheckList;

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var rect;

        if (child.parent && child.parent !== this.scroll.innerContent) {
            var box = child.getBoundingBox();
            var boxCenter = cc.p(box.x + box.width / 2, box.y + box.height / 2);
            var posInInner = this.scroll.innerContent.convertToNodeSpace(child.parent.convertToWorldSpace(boxCenter));
            rect = cc.rect(posInInner.x, posInInner.y, box.width, box.height);
        } else {
            rect = child;
        }

        if (this.isRectVisible(rect)) {
            ids.push(i);
        }
    }
    return ids;
};

ScrollChildrenFullCheckVisibility.prototype.isRectVisible = function (rect) {
    var zoom = this.scroll.zoom;
    var padding = this.scroll.options.childrenVisibilityPadding || 0;

    var cx = rect.x - this.scroll.innerContent.width / 2;
    var cy = rect.y - this.scroll.innerContent.height / 2;

    if (-this.scroll.innerContent.x - this.scroll.width / zoom / 2 - rect.width / 2 - padding <= cx && cx <= -this.scroll.innerContent.x + this.scroll.width / zoom / 2 + rect.width / 2 + padding &&
        -this.scroll.innerContent.y - this.scroll.height / zoom / 2 - rect.height / 2 - padding <= cy && cy <= -this.scroll.innerContent.y + this.scroll.height / zoom / 2 + rect.height / 2 + padding) {
        return true;
    }
    return false;
};