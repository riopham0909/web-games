/**
 * Created by andrey on 02.02.2021.
 */

cc.getCenter = function (points) {
    if (!points || points.length === 0) {
        return;
    }

    var x = 0, y = 0;
    points.forEach(function (pos) {
        x += pos.x;
        y += pos.y;
    });
    return cc.p(x / points.length, y / points.length);
};

cc.getCenterPoint = function (points) {
    if (!points || points.length === 0) {
        return;
    }

    var x = 0, y = 0;
    points.forEach(function (pos) {
        x += pos.x;
        y += pos.y;
    });
    var center = cc.p(x / points.length, y / points.length);

    var res = points[0];
    var minDist = cc.pDistance(res, center);
    points.forEach(function (p) {
        var dist = cc.pDistance(p, center);
        if (dist < minDist) {
            res = p;
            minDist = dist;
        }
    });
    return res;
};

cc.getDistanceChebyshev = function (p1, p2) {
    return Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
};

cc.rectScale = function (rect, scale) {
    return cc.rect(
        rect.x + rect.width / 2 * (1 - scale),
        rect.y + rect.height / 2 * (1 - scale),
        rect.width * scale,
        rect.height * scale
    );
};

cc.rectGetCenter = function (rect) {
    return cc.p(rect.x + rect.width / 2, rect.y + rect.height / 2);
};

cc.padding = function (top, right, bottom, left) {
    if (typeof right === "object") {
        var p1 = cc.padding(top), p2 = cc.padding(right);
        right = p2.right || p1.right;
        bottom = p2.bottom || p1.bottom;
        left = p2.left || p1.left;
        top = p2.top || p1.top;
    } else if (right === undefined && top !== undefined) {
        right = top.right || top.x;
        bottom = top.bottom || top.y;
        left = top.left || top.x;
        top = top.top || top.y;
    } else if (bottom === undefined && right !== undefined && top !== undefined) {
        bottom = top;
        left = right;
    }

    return {
        top: top || 0,
        right: right || 0,
        bottom: bottom || 0,
        left: left || 0
    };
};

cc.rectAddPadding = function (rect, padding) {
    return cc.rect(rect.x - padding.left, rect.y - padding.bottom, rect.width + padding.left + padding.right, rect.height + padding.bottom + padding.top);
};

cc.rectSubPadding = function (rect, padding) {
    return cc.rect(
        rect.x + padding.left,
        rect.y + padding.bottom,
        Math.max(rect.width - padding.left - padding.right, 0),
        Math.max(rect.height - padding.bottom - padding.top, 0)
    );
};

cc.multPadding = function (padding, factor) {
    return {
        top: padding.top * factor,
        right: padding.right * factor,
        bottom: padding.bottom * factor,
        left: padding.left * factor
    };
};

cc.paddingAddPadding = function (padding1, padding2) {
    return {
        top: padding1.top + padding2.top,
        right: padding1.right + padding2.right,
        bottom: padding1.bottom + padding2.bottom,
        left: padding1.left + padding2.left
    };
};

cc.nearestToRect = function (rect, point) {
    var x, y;

    if (point.x <= rect.x) {
        x = rect.x;
    } else if (point.x >= rect.x + rect.width) {
        x = rect.x + rect.width;
    } else {
        x = point.x;
    }

    if (point.y <= rect.y) {
        y = rect.y;
    } else if (point.y >= rect.y + rect.height) {
        y = rect.y + rect.height;
    } else {
        y = point.y;
    }

    return cc.p(x, y);
};
