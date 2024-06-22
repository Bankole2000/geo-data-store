import { SQLWrapper, like, eq, or, and, SQL } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { BaseFilter } from "../utils/customtypes";
import { db } from "../db";
export abstract class CommonSQLite <T>{
  protected abstract table: T
  db = db

  addPagination<T extends SQLiteSelectQueryBuilder>(
    qb: T,
    page: number = 1,
    pageSize: number = 10,
  ) {
    return qb.limit(pageSize).offset((page - 1) * pageSize);
  }
  getWhereOptions<K extends BaseFilter>(filter: K): SQL<unknown> {
    const conditions: SQLWrapper[] = [];
    const filterOperation = filter?.operation === 'or' ? or : and;

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
      const filterOperation = filter.suboperation === 'or' ? or : and;
      conditions.push(filterOperation(...subConditions)!);
    }

    return filterOperation(...conditions)!;
  }

  private createCondition(field: string, value: any): SQLWrapper {
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
        return like((this.table as any)[field], `%${value}%`);
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
        return eq((this.table as any)[field], value);
      default:
        throw new Error(`Unsupported field: ${String(field)}`);
    }
  }
}