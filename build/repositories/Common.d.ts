import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
export declare class CommonSQLite {
    addPagination<T extends SQLiteSelectQueryBuilder>(qb: T, page?: number, pageSize?: number): T;
}
