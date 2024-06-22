# Geolocation Data Utils

A Collection of utility functions, classes and data to help with building geolocation apps.

## Features

- Up-to-date and customizable database of **Regions** (continents), **Subregions**, **Countries**, **States**, and **Cities**.
- Resource Repositories with methods for querying, filtering and CRUDing the data
- Drizzle ORM instance and schema for more complex queries and filtering conditions
- Utility functions for geolocation computations (distance, nearest cities, etc)

## Installation

Usable on any **nodejs** project with either JavaScript or Typescript on the frontend or backend.

> [!NOTE] Important
> To use, download this [**`sqlite.db`**](https://github.com/Bankole2000/geo-data-store/blob/main/sqlite.db) raw file from [this repo](https://github.com/Bankole2000/geo-data-store) and place at the root of your project, then install the package

```sh
# download sqlite.db file
wget -c https://github.com/Bankole2000/geo-data-store/raw/main/sqlite.db

# install package in your project
npm install @neoncoder/geolocation-data
```

## Usage

The `sqlite.db` consists of 5 tables - `Region`, `Subregion`, `Country`, `State`, `City`, all related with foreign keys. This package itself exposes 3 main resources:

- _**Drizzle ORM insance `db`**_ - with schema and sql utility fxns for quering the database
- _**Resource Classes**_ - with readable methods for typical use cases
- _**Utility Functions**_ - For geolocation computations

### Using the `db` drizzle orm instance

```js
import { db } from '@neoncoder/geolocation-data'

// async IIFE (in case no top-level await)
(async() => {
  // Get all countries - 250
  const countries = await db.query.country.findMany()

  // Get all cities in britain (iso2 - GB)
  const citiesInTheUK = await db.query.city
  .findMany({ 
    where: (city, {eq}) => eq(city.country_code, 'GB'),
    // include country and state data
    with: {country: true, state: true}
  })
  
  // find state in the US that contains searchTerm
  const searchTerm = 'flor'
  const floridaSearch = await db.query.state
  .findFirst({ 
    where: (state, {eq, and, like}) => {
    return and(
      eq(state.country_code, 'US'),
      like(state.name, `%${searchTerm}%`)
    )
  }, with: {country: true, cities: true}})

  // find all cities in either Lagos or Abuja, Nigeria
  // Order by city name, paginate results;
  let page = 2, per_page = 10;
  const citySearch = await db.query.city
  .findMany({ 
    where: (city, {eq, or, and, like}) => {
      return and(
      eq(city.country_code, 'NG'), 
      or(
        like(city.state_name, `%Abuja%`), 
        like(city.state_name, `%Lagos%`)
        )
      )
    },
    limit: per_page,
    offset: (page - 1) * per_page,
    orderBy: ((city, {asc}) => asc(city.name))
  })
})()
```

see the [drizzle ORM documentation](https://orm.drizzle.team/docs/rqb) for more details on using the db instance

### Using Resource Classes

5 repository classes are provided `RegionRepository`, `SubregionRepository`, `CountryRepository`, `StateRepository`, `CityRepository`

```ts
// import Classes and instantiate or
// import and rename already instantiated classes
import {
  RegionRepository, // or { regionRepository as regionRepo }
  SubregionRepository, // or { subregionRepository as subRepo }
  CountryRepository, // or { countryRepository as countryRepo }
  StateRepository, // or { stateRepository as stateRepo }
  CityRepository // or { cityRepository as cityRepo }
} from '@neoncoder/geolocation-data'

const regionRepo = new RegionRepository()
const subRepo = new SubregionRepository()
const countryRepo = new CountryRepository()
const stateRepo = new StateRepository()
const cityRepo = new CityRepository()
```

 All repository classes provide the same attendant methods to each class i.e.

- _**`get[PlacePlural]`**_ - Paginated, takes in `pagination`, `filter`, `sort` and `include` options. returns paginated Array of `[Place]`
- _**`getAll[PlacePlural]`**_ - NOT Paginated, takes in `filter`, `sort` and `include` options. returns non-paginated Array of `[Place]`
- _**`find[Place]ById`**_ - Takes `id` and (optional) `include` parameters. returns Array of single `[Place]` record if found, else returns empty array
- _**`create[Place]`**_ - creates new `[Place]` record in the database
- _**`update[Place]`**_ - updates existing `[Place]` record in the database
- _**`delete[Place]`**_ - deletes existing `[Place]` record from the database

 where _**`[Place]`**_ is one of `Region`, `Subregion`, `Country`, `State`, or `City`, and
 _**`[Place_Plural]`**_ is plural from of place (e.g. Country plural is Countries.)

#### Example using `CountryRespository` class

 ```ts
 import { countryRepository as cr } from '@neoncoder/geolocation-data'

// method examples using countryRepository
(async() => {
  // get countries paginated
  const countriesPaginated = await cr.getCountries(countryQueryOptions + pagination)
  // get countries not paginated
  const countriesNotPaginated = await cr.getAllCountries(countryQueryOptions)
  // get singular country by Id
  const countryById = await cr.findCountryById(id)
  // create new country record
  const newCountry = await cr.createCountry(createData)
  // update existing country record
  const updatedCountry = await cr.updateCountry(id, updateData)
  // delete country record
  const deleted = await cr.deleteCountry(id)
})()
// The same methods are available on all the other repositories, e.g.
// cityRepository.getAllCities(cityQueryOptions)
// stateRepository.getAllStates(stateQueryOptions)
 ```

#### Repository usage examples

 ```ts
import { 
  regionRepository as regionRepo, 
  countryRepository as countryRepo,
  stateRepository as stateRepo,
  cityRepository as cityRepo
} from '@neoncoder/geolocation-data'

 (async() => {
  // get all regions, counting subregions and countries in each region
  const regions = await regionRepo.getAllRegions({include: {count: true}})

  // get countries paginated, counting states and cities in each country
  const countries = await countryRepo.getCountries({
    page: 1, limit: 20
    // also include region and subregion data for each country
    include: {count: true, subregion: true, region: true}
  })

  // get first 20 cities in britain (iso2 - GB) - Paginated, sort by name in 
  // descending order, include country and state data
  const {data: cities, meta} = await cityRepo.getCities({
    page: 1, limit: 20,
    filter: {country_code: 'GB'}, 
    sort: {field: 'name', direction: 'desc'},
    include: {country: true, state: true}
  })
  // For no pagination use the `cityRepo.getAllCities` method

  // find state in the US that contains searchTerm
  const searchTerm = 'flor'
  const floridaSearch = await stateRepo.getStates({
    page: 1, limit: 1
    // filter operation is AND by default and fields can't be 
    // repeated on the top level (object unique key constraint)
    filters: {country_code: 'US', name: searchTerm},
    sort: {field: 'name', direction: 'asc'},
    include: {count: true, country: true, cities: true}
  })

  // find all cities in either Lagos or Abuja, Nigeria
  // Order by city name, paginate results;
  let page = 2, per_page = 10;
  const citySearch = await cityRepo.getCities({
    page: page, limit: per_page, 
    filter: {
      operation: 'and', // AND (country_code, subfilters)
      country_code: 'NG',
      suboperation: 'or',
      subfilters: [ // OR suboperation is applied here
        {state_name: 'Abuja'}, 
        {state_name: 'Lagos'}
      ]
    },
    sort: {field: 'name', direction: 'asc'}
  })
  // // This above is essentially the same as
  // db.query.city.findMany({ 
  //   where: (city, {eq, or, and, like}) => {
  //     return and(
  //     eq(city.country_code, 'NG'), 
  //     or(
  //       like(city.state_name, `%Abuja%`), 
  //       like(city.state_name, `%Lagos%`)
  //       )
  //     )
  //   },
  //   limit: per_page,
  //   offset: (page - 1) * per_page,
  //   orderBy: ((city, {asc}) => asc(city.name))
})()
 ```

 > [!TIP]
 >
 > ####  _drizzle orm_ `db`  instance vs `ClassRepository`. Which should you use and what's the difference?
 >
 > You can basically use either in most scenarios, but here are recommendations due to their different implementations
 >
 > - To _create_, _update_, or _delete_ records, use the Class Repositories
 > - To use filter operations other than `eq` or `like` (e.g. `lte`, `gte`, `not` etc) use the `db` instance
 > - To conveniently count related records (in __1-n__ relationships) use the classRepository
 > - To run custom _SQL_ queries, or if you're very familiar with Drizzle orm, use the `db` instance

### Using Utility Functions

4 Utility functions are provided - `haversine` (or `calculateDistanceBetweenPoints`), `findClosestCity`, `findClosestCities`, `findEntitiesWithinRadius`

- _**haversine**_ - aliased as `calculateDistanceBetweenPoints`, given 2 `GeoPoint`s (i.e. geolocation coordinates `{lat: number, lng: number}`) returns the straight line distance in `meters` (the unit can be changed) using the haversing formula
- _**findClosestCity**_ - given a `GeoPoint` returns the nearest `City`, `State` and `Country`, also returns distance from the nearest city in `meters` (unit changeable)
- _**findClosestCities**_ - Given a `GeoPoint` and a number `x`, returns `x` number of cities closest to that location
- _**findEntitiesWithinRadius**_ - Given a `GeoPoint` and a number `x`, returns all cities in `x`km radius around that location (the unit is customizable)

```ts
import { 
  calculateDistanceBetweenPoints, 
  findClosestCity, 
  findClosestCities, 
  findEntitiesWithinRadius 
} from '@neoncoder/geolocation-data'

// Heathrow Airport Coords
const pointA = {lat: 51.46852608063078, lng: -0.4548364232750391}
// Abuja Int'l Airport Coords
const pointB = {lat: 9.007318554723346, lng: 7.269119361911654}

// Straight line distance between Heathrow & Abuja Airport
const distance = calculateDistanceBetweenPoints(pointA, pointB) 
// return { distance: 4774031.17315101, unit: 'm', unitInWords: 'meters' },

// Nearest city to Heathrow, return distance in miles
const nearestCity = findClosestCity(pointA, 'mi')
// return { name: 'West Drayton', unit: 'mi', unitInWords: 'miles', ...cityDetails}

// Nearest 3 cities to Abuja Airport, distance in kilometers
const nearest3Cities = findClosestCities(pointB, 3, 'km')
// returns {cities: City[3], states: State[], country: Country[]}
// 'Madala', 'Zuba', 'Kuje'

// Cities within a 3 mile radius of Heathrow Airport
const citiesIn3MileRadius = findEntitiesWithinRadius(pointA, 3, 'mi');
// returns {cities: City[3], states: State[], country: Country[]}
// 'West Drayton', 'Feltham', 'Iver'

// All results are returned in order of distance
```

## Acknowledgements

Special thanks to [@dr5hn](https://github.com/dr5hn) and all contributors to the [Countries-state-cities-database](https://github.com/dr5hn/countries-states-cities-database) project. This package would not be possible without their hard work 🙌.
