# Geolocation Data Utils

A Collection of utility functions, classes and data to help with building geolocation apps.

## Installation

Usable on any __nodejs__ project with either JavaScript or Typescript on the frontend or backend.

> [!WARNING] Important
> To use, download this [__`sqlite.db`__](https://github.com/Bankole2000/geo-data-store/blob/main/sqlite.db) raw file from [this repo](https://github.com/Bankole2000/geo-data-store) and place at the root of your project, then install the package

```sh
# install package in your project
npm install @neoncoder/geolocation-data
```

## Usage

The `sqlite.db` consists of 5 tables - `Region`, `Subregion`, `Country`, `State`, `City`, all related with foreign keys. This package itself exposes 3 main resources:

- ___Drizzle ORM insance `db`___ - with schema and sql utility fxns for quering the database
- ___Resource Classes___ - with readable methods for typical use cases
- ___Utility Functions___ - For geolocation computations

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
    orderBy: (city => city.name)
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

- __*`get[PlacePlural]`*__ - Paginated, takes in `pagination`, `filter`, `sort` and `include` options. returns paginated Array of `[Place]`
- __*`getAll[PlacePlural]`*__ - NOT Paginated, takes in `filter`, `sort` and `include` options. returns non-paginated Array of `[Place]`
- __*`find[Place]ById`*__ - Takes `id` and (optional) `include` parameters. returns Array of single `[Place]` record if found, else returns empty array
- __*`create[Place]`*__ - creates new `[Place]` record in the database
- __*`update[Place]`*__ - updates existing `[Place]` record in the database
- __*`delete[Place]`*__ - deletes existing `[Place]` record from the database

 where __*`[Place]`*__ is one of `Region`, `Subregion`, `Country`, `State`, or `City`, and
 __*`[Place_Plural]`*__ is plural from of place (e.g. Country plural is Countries.)

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

#### repository usage examples

 ```ts
import { 
  regionRepository as regionRepo, 
  stateRepository as stateRepo 
} from '@neoncoder/geolocation-data'

 (async() => {
  // get all regions, counting subregions and countries in each region
  const regions = await regionRepo.getAllRegions({include: {count: true}})

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
    filters: {country_code: 'US', name: searchTerm},
    sort: {field: 'name', direction: 'asc'},
    include: {count: true, country: true, cities: true}
  })
})()
 ```
