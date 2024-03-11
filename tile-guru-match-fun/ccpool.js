/**
 * Created by vladislav on 26.08.2021
 */

cc.pool = {
    _pool: {},

    putInPool: function (obj) {
        var ObjClass = obj.constructor;
        var args = [ObjClass].concat(Array.prototype.slice.call(arguments, 0));
        var pid = this.getPoolId.apply(this, args);

        if (!this._pool[pid]) {
            this._pool[pid] = [];
        }

        obj.unuse && obj.unuse();

        if (!ObjClass.PoolLimit || this._pool[pid].length < ObjClass.PoolLimit) {
            this._pool[pid].push(obj);
        }
    },

    getPoolId: function (objClass) {
        var pid = objClass.prototype.__pid;
        if (!pid) {
            var desc = { writable: true, enumerable: false, configurable: true };
            desc.value = ClassManager.getNewID();
            Object.defineProperty(objClass.prototype, "__pid", desc);
        }

        if (objClass.GetPoolId) {
            var args = Array.prototype.slice.call(arguments, 1);
            pid = objClass.GetPoolId.apply(objClass, args);
        }
        return pid;
    },

    hasObject: function () {
        var pid = this.getPoolId.apply(this, arguments);
        return this._pool[pid] && this._pool[pid].length > 0;
    },

    getFromPool: function () {
        if (this.hasObject.apply(this, arguments)) {
            var key = this.getPoolId.apply(this, arguments);
            var list = this._pool[key];
            var args = Array.prototype.slice.call(arguments, 1);
            var obj = list.pop();

            obj.reuse && obj.reuse.apply(obj, args);
            delete obj.stopListeners;

            return obj;
        }
    },

    drainAllPools: function () {
        this._pool = {};
    }
};