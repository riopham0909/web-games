/**
 * Created by Oleg on 03.03.2020.
 */

cleverapps.Table = function () {
    this.results = {};
};

cleverapps.Table.prototype.reset = function () {
    this.results = {};
};

cleverapps.Table.prototype.updateResults = function (id, data) {
    this.results[id] = [];
    for (var i = 0; i < data.length; i++) {
        this.results[id].push(cleverapps.clone(data[i]));
    }
};

cleverapps.Table.prototype.resetResults = function (id) {
    this.results[id] = undefined;
};

cleverapps.Table.prototype.getResults = function (id) {
    return this.results[id];
};

cleverapps.Table.prototype.createTableView = function (options) {
    var tableView = new cleverapps.TableView(options.data, this.results[options.id], options.rowConstructor, options.dataIcon, options);
    this.updateResults(options.id, options.data);
    return tableView;
};
