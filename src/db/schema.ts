import { blob, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { TSubregionTranslation, TTimezone, TTranslaction } from '../utils/customtypes'

export const region = sqliteTable("region", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}),
  translations: text("translations", {mode: "json"}),
  wikiDataId: text("wikiDataId", {mode: 'text'}),
})

export const regionRelations = relations(region, ({many}) => ({
  subregions: many(subregion),
  countries: many(country),
}))

export const subregion = sqliteTable("subregion", {
  id: integer("id", {mode: "number"}).primaryKey({autoIncrement: true}),
  name: text("name", {mode: 'text'}),
  region_id: integer("region_id", {mode: "number"}).references(() => region.id),
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
  name: text("name", {mode: 'text'}),
  iso3: text("iso3", {mode: 'text', length: 3}),
  iso2: text("iso2", {mode: 'text', length: 2}),
  numeric_code: text("numeric_code", {mode: 'text'}),
  phone_code: text("phone_code", {mode: 'text'}),
  capital: text("capital", {mode: 'text'}),
  currency: text("currency", {mode: 'text', length: 3}),
  currency_name: text("currency_name", {mode: 'text'}),
  currency_symbol: text("currency_symbol", {mode: 'text'}),
  tld: text("tld", {mode: 'text'}),
  native: text("native", {mode: 'text'}),
  region_id: integer("region_id", {mode: 'number'}).references(() => region.id),
  subregion_id: integer("subregion_id", {mode: 'number'}).references(() => subregion.id),
  nationality: text("nationality", {mode: 'text'}),
  timezones: text("timezones", {mode: "json"}).$type<Array<TTimezone>>(),
  translations: text("translations", {mode: "json"}).$type<TTranslaction>(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  emoji: text("emoji", {mode: 'text'}),
  emojiU: text("emojiU", {mode: 'text'}),
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
  name: text("name", {mode: 'text'}),
  country_id: integer("country_id", {mode: "number"}).references(() => country.id),
  country_code: text("country_code", {mode: 'text', length: 2}),
  country_name: text("country_name", {mode: 'text'}),
  state_code: text("state_code", {mode: 'text', length: 3}),
  type: text("type", {mode: "text"}),
  latitude: real("latitude"),
  longitude: real("longitude"),
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
  name: text("name", {mode: 'text'}),
  state_id: integer("state_id", {mode: "number"}).references(() => state.id),
  state_code: text("state_code", {mode: "text"}),
  state_name: text("state_name", {mode: "text"}),
  country_id: integer("country_id", {mode: "number"}).references(() => country.id),
  country_code: text("country_code", {mode: 'text', length: 2}),
  country_name: text("country_name", {mode: 'text'}),
  latitude: real("latitude"),
  longitude: real("longitude"),
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