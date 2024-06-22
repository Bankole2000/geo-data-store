"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonSQLite = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
class CommonSQLite {
    constructor() {
        this.db = db_1.db;
    }
    addPagination(qb, page = 1, pageSize = 10) {
        return qb.limit(pageSize).offset((page - 1) * pageSize);
    }
    getWhereOptions(filter) {
        const conditions = [];
        const filterOperation = (filter === null || filter === void 0 ? void 0 : filter.operation) === 'or' ? drizzle_orm_1.or : drizzle_orm_1.and;
        // Dynamically generate conditions based on filter fields
        for (const key in filter) {
            if (filter.hasOwnProperty(key) && key !== 'operation' && key !== 'subfilters' && key !== 'suboperation') {
                const value = filter[key];
                if (value !== undefined) {
                    conditions.push(this.createCondition(key, value));
                }
            }
        }
        if (filter.subfilters) {
            const subConditions = filter.subfilters.map(subfilter => this.getWhereOptions(subfilter));
            const filterOperation = filter.suboperation === 'or' ? drizzle_orm_1.or : drizzle_orm_1.and;
            conditions.push(filterOperation(...subConditions));
        }
        return filterOperation(...conditions);
    }
    createCondition(field, value) {
        switch (field) {
            case 'name':
            case 'state_name':
            case 'country_name':
            case 'wikiDataId':
            case 'nationality':
            case 'phone_code':
            case 'capital':
            case 'currency':
            case 'currency_name':
            case 'currency_symbol':
            case 'tld':
            case 'native':
            case 'nationality':
                return (0, drizzle_orm_1.like)(this.table[field], `%${value}%`);
            case 'id':
            case 'state_id':
            case 'state_code':
            case 'country_code':
            case 'country_id':
            case 'region_id':
            case 'subregion_id':
            case 'iso2':
            case 'iso3':
            case 'number_code':
                return (0, drizzle_orm_1.eq)(this.table[field], value);
            default:
                throw new Error(`Unsupported field: ${String(field)}`);
        }
    }
}
exports.CommonSQLite = CommonSQLite;
