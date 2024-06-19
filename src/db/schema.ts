import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { TTimezone, TTranslation } from '../utils/customtypes'

export const region = sqliteTable("region", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}).notNull(),
  translations: text("translations", {mode: "json"}),
  wikiDataId: text("wikiDataId", {mode: 'text'}),
})

export const regionRelations = relations(region, ({many}) => ({
  subregions: many(subregion),
  countries: many(country),
}))

export const subregion = sqliteTable("subregion", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}).notNull(),
  region_id: integer("region_id", {mode: "number"}).references(() => region.id).notNull(),
  translations: text("translations", {mode: "json"}),
  wikiDataId: text("wikiDataId", {mode: 'text'}),
})

export const subregionRelations = relations(subregion, ({one, many}) => ({
  region: one(region, {
    fields: [subregion.region_id],
    references: [region.id]
  }),
  countries: many(country)
}))

export const country = sqliteTable("country", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}).notNull(),
  iso3: text("iso3", {mode: 'text', length: 3}).notNull(),
  iso2: text("iso2", {mode: 'text', length: 2}).notNull(),
  numeric_code: text("numeric_code", {mode: 'text'}).notNull(),
  phone_code: text("phone_code", {mode: 'text'}).notNull(),
  capital: text("capital", {mode: 'text'}).notNull(),
  currency: text("currency", {mode: 'text', length: 3}).notNull(),
  currency_name: text("currency_name", {mode: 'text'}).notNull(),
  currency_symbol: text("currency_symbol", {mode: 'text'}).notNull(),
  tld: text("tld", {mode: 'text'}).notNull(),
  native: text("native", {mode: 'text'}).notNull(),
  region_id: integer("region_id", {mode: 'number'}).references(() => region.id).notNull(),
  subregion_id: integer("subregion_id", {mode: 'number'}).references(() => subregion.id).notNull(),
  nationality: text("nationality", {mode: 'text'}).notNull(),
  timezones: text("timezones", {mode: "json"}).$type<Array<TTimezone>>(),
  translations: text("translations", {mode: "json"}).$type<TTranslation>(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  emoji: text("emoji", {mode: 'text'}).notNull(),
  emojiU: text("emojiU", {mode: 'text'}).notNull(),
})

export const countryRelations = relations(country, ({one, many}) => ({
  region: one(region, {
    fields: [country.region_id], 
    references: [region.id]
  }),
  subregion: one(subregion, {
    fields: [country.subregion_id],
    references: [subregion.id]
  }),
  states: many(state),
  cities: many(city),
}))

export const state = sqliteTable("state", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}).notNull(),
  country_id: integer("country_id", {mode: "number"}).references(() => country.id).notNull(),
  country_code: text("country_code", {mode: 'text', length: 2}).notNull(),
  country_name: text("country_name", {mode: 'text'}).notNull(),
  state_code: text("state_code", {mode: 'text', length: 3}).notNull(),
  type: text("type", {mode: "text"}),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
})

export const stateRelations = relations(state, ({one, many}) => ({
  country: one(country, {
    fields: [state.country_id],
    references: [country.id],
  }),
  cities: many(city)
}))

export const city = sqliteTable("city", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}).notNull(),
  state_id: integer("state_id", {mode: "number"}).references(() => state.id).notNull(),
  state_code: text("state_code", {mode: "text"}).notNull(),
  state_name: text("state_name", {mode: "text"}).notNull(),
  country_id: integer("country_id", {mode: "number"}).references(() => country.id).notNull(),
  country_code: text("country_code", {mode: 'text', length: 2}).notNull(),
  country_name: text("country_name", {mode: 'text'}).notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  wikiDataId: text("wikiDataId", {mode: 'text'}),
})

export const cityRelations = relations(city, ({one}) => ({
  state: one(state, {
    fields: [city.state_id],
    references: [state.id],
  }),
  country: one(country, {
    fields: [city.country_id],
    references: [country.id],
  })
}))