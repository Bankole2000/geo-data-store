"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonSQLite = void 0;
class CommonSQLite {
    addPagination(qb, page = 1, pageSize = 10) {
        return qb.limit(pageSize).offset((page - 1) * pageSize);
    }
}
exports.CommonSQLite = CommonSQLite;
