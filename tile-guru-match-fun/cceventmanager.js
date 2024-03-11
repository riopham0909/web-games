/**
 * Created by andrey on 24.11.2020.
 */

cc.eventManager._sortEventListenersOfSceneGraphPriorityDes = function (l1, l2) {
    var locNodePriorityMap = cc.eventManager._nodePriorityMap;
    var node1 = l1._getSceneGraphPriority();
    var node2 = l2._getSceneGraphPriority();

    if (!l2 || !node2 || !locNodePriorityMap[node2.__instanceId]) {
        return -1;
    }

    if (!l1 || !node1 || !locNodePriorityMap[node1.__instanceId]) {
        return 1;
    }

    var diff = locNodePriorityMap[l2._getSceneGraphPriority().__instanceId] - locNodePriorityMap[l1._getSceneGraphPriority().__instanceId];
    return diff === 0 ? l2.__instanceId - l1.__instanceId : diff;
};
