/**
 * Created by Denis Kuzin on 22 december 2022
 */

cleverapps.Pagination = function (n, savedPage) {
    cleverapps.EventEmitter.call(this);

    this.page = savedPage || 0;
    this.total = n;
};

cleverapps.Pagination.prototype = Object.create(cleverapps.EventEmitter.prototype);
cleverapps.Pagination.prototype.constructor = cleverapps.Pagination;

cleverapps.Pagination.prototype.isLast = function () {
    return this.page === this.total - 1;
};

cleverapps.Pagination.prototype.getCurrent = function () {
    return this.page;
};

cleverapps.Pagination.prototype.getTotal = function () {
    return this.total;
};

cleverapps.Pagination.prototype.nextPage = function () {
    if (this.isLast()) {
        this.trigger("lastPage");
        return;
    }

    this.setPage(this.page + 1);
};

cleverapps.Pagination.prototype.setPage = function (page) {
    this.page = page;

    this.trigger("changePage", this.page);
};

cleverapps.Pagination.prototype.addPage = function () {
    this.total++;

    this.trigger("addPage");
};

cleverapps.Pagination.prototype.removePage = function (page) {
    if (this.total <= 1) {
        return;
    }

    if (this.page > page) {
        this.page--;
    }

    if (this.page === page) {
        if (this.page === 0) {
            this.setPage(1);
            this.page = 0;
        } else {
            this.setPage(this.page - 1);
        }
    }

    this.total--;

    this.trigger("removePage", page);
};