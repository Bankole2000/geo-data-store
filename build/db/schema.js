"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRelations = exports.city = exports.stateRelations = exports.state = exports.countryRelations = exports.country = exports.subregionRelations = exports.subregion = exports.regionRelations = exports.region = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.region = (0, sqlite_core_1.sqliteTable)("region", {
    id: (0, sqlite_core_1.integer)("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name", { mode: 'text' }),
    translations: (0, sqlite_core_1.text)("translations", { mode: "json" }),
    wikiDataId: (0, sqlite_core_1.text)("wikiDataId", { mode: 'text' }),
});
exports.regionRelations = (0, drizzle_orm_1.relations)(exports.region, ({ many }) => ({
    subregions: many(exports.subregion),
    countries: many(exports.country),
}));
exports.subregion = (0, sqlite_core_1.sqliteTable)("subregion", {
    id: (0, sqlite_core_1.integer)("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name", { mode: 'text' }),
    region_id: (0, sqlite_core_1.integer)("region_id", { mode: "number" }).references(() => exports.region.id),
    translations: (0, sqlite_core_1.text)("translations", { mode: "json" }),
    wikiDataId: (0, sqlite_core_1.text)("wikiDataId", { mode: 'text' }),
});
exports.subregionRelations = (0, drizzle_orm_1.relations)(exports.subregion, ({ one, many }) => ({
    region: one(exports.region, {
        fields: [exports.subregion.region_id],
        references: [exports.region.id]
    }),
    countries: many(exports.country)
}));
exports.country = (0, sqlite_core_1.sqliteTable)("country", {
    id: (0, sqlite_core_1.integer)("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name", { mode: 'text' }),
    iso3: (0, sqlite_core_1.text)("iso3", { mode: 'text', length: 3 }),
    iso2: (0, sqlite_core_1.text)("iso2", { mode: 'text', length: 2 }),
    numeric_code: (0, sqlite_core_1.text)("numeric_code", { mode: 'text' }),
    phone_code: (0, sqlite_core_1.text)("phone_code", { mode: 'text' }),
    capital: (0, sqlite_core_1.text)("capital", { mode: 'text' }),
    currency: (0, sqlite_core_1.text)("currency", { mode: 'text', length: 3 }),
    currency_name: (0, sqlite_core_1.text)("currency_name", { mode: 'text' }),
    currency_symbol: (0, sqlite_core_1.text)("currency_symbol", { mode: 'text' }),
    tld: (0, sqlite_core_1.text)("tld", { mode: 'text' }),
    native: (0, sqlite_core_1.text)("native", { mode: 'text' }),
    region_id: (0, sqlite_core_1.integer)("region_id", { mode: 'number' }).references(() => exports.region.id),
    subregion_id: (0, sqlite_core_1.integer)("subregion_id", { mode: 'number' }).references(() => exports.subregion.id),
    nationality: (0, sqlite_core_1.text)("nationality", { mode: 'text' }),
    timezones: (0, sqlite_core_1.text)("timezones", { mode: "json" }).$type(),
    translations: (0, sqlite_core_1.text)("translations", { mode: "json" }).$type(),
    latitude: (0, sqlite_core_1.real)("latitude"),
    longitude: (0, sqlite_core_1.real)("longitude"),
    emoji: (0, sqlite_core_1.text)("emoji", { mode: 'text' }),
    emojiU: (0, sqlite_core_1.text)("emojiU", { mode: 'text' }),
});
exports.countryRelations = (0, drizzle_orm_1.relations)(exports.country, ({ one, many }) => ({
    region: one(exports.region, {
        fields: [exports.country.region_id],
        references: [exports.region.id]
    }),
    subregion: one(exports.subregion, {
        fields: [exports.country.subregion_id],
        references: [exports.subregion.id]
    }),
    states: many(exports.state),
    cities: many(exports.city),
}));
exports.state = (0, sqlite_core_1.sqliteTable)("state", {
    id: (0, sqlite_core_1.integer)("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name", { mode: 'text' }),
    country_id: (0, sqlite_core_1.integer)("country_id", { mode: "number" }).references(() => exports.country.id),
    country_code: (0, sqlite_core_1.text)("country_code", { mode: 'text', length: 2 }),
    country_name: (0, sqlite_core_1.text)("country_name", { mode: 'text' }),
    state_code: (0, sqlite_core_1.text)("state_code", { mode: 'text', length: 3 }),
    type: (0, sqlite_core_1.text)("type", { mode: "text" }),
    latitude: (0, sqlite_core_1.real)("latitude"),
    longitude: (0, sqlite_core_1.real)("longitude"),
});
exports.stateRelations = (0, drizzle_orm_1.relations)(exports.state, ({ one, many }) => ({
    country: one(exports.country, {
        fields: [exports.state.country_id],
        references: [exports.country.id],
    }),
    cities: many(exports.city)
}));
exports.city = (0, sqlite_core_1.sqliteTable)("city", {
    id: (0, sqlite_core_1.integer)("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: (0, sqlite_core_1.text)("name", { mode: 'text' }),
    state_id: (0, sqlite_core_1.integer)("state_id", { mode: "number" }).references(() => exports.state.id),
    state_code: (0, sqlite_core_1.text)("state_code", { mode: "text" }),
    state_name: (0, sqlite_core_1.text)("state_name", { mode: "text" }),
    country_id: (0, sqlite_core_1.integer)("country_id", { mode: "number" }).references(() => exports.country.id),
    country_code: (0, sqlite_core_1.text)("country_code", { mode: 'text', length: 2 }),
    country_name: (0, sqlite_core_1.text)("country_name", { mode: 'text' }),
    latitude: (0, sqlite_core_1.real)("latitude"),
    longitude: (0, sqlite_core_1.real)("longitude"),
    wikiDataId: (0, sqlite_core_1.text)("wikiDataId", { mode: 'text' }),
});
exports.cityRelations = (0, drizzle_orm_1.relations)(exports.city, ({ one }) => ({
    state: one(exports.state, {
        fields: [exports.city.state_id],
        references: [exports.state.id],
    }),
    country: one(exports.country, {
        fields: [exports.city.country_id],
        references: [exports.country.id],
    })
}));
