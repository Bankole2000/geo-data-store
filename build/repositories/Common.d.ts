import { SQL } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { BaseFilter } from "../utils/customtypes";
export declare abstract class CommonSQLite<T> {
    protected abstract table: T;
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("../db/schema")>;
    addPagination<T extends SQLiteSelectQueryBuilder>(qb: T, page?: number, pageSize?: number): T;
    getWhereOptions<K extends BaseFilter>(filter: K): SQL<unknown>;
    private createCondition;
}
