import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

export class CommonSQLite {
  addPagination<T extends SQLiteSelectQueryBuilder>(
    qb: T,
    page: number = 1,
    pageSize: number = 10,
  ) {
    return qb.limit(pageSize).offset((page - 1) * pageSize);
  }
}