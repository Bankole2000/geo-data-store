# Geolocation Data Utils

A Collection of utility functions, classes and data to help with building geolocation apps.

## Features

- Up-to-date and customizable database of **Regions** (continents), **Subregions**, **Countries**, **States**, and **Cities**.
- Resource Repositories with methods for querying, filtering and CRUDing the data
- Drizzle ORM instance and schema for more complex queries and filtering conditions
- Utility functions for geolocation computations (distance, nearest cities, etc)

## Installation

Usable on any **nodejs** project with either JavaScript or Typescript on the frontend or backend.

> [!NOTE]
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

## Data structures

Main resource types:

```ts
type Region = {
    id: number;
    name: string;
    translations: {[key: string]: string};
    wikiDataId: string | null;
}

type Subregion = {
    id: number;
    name: string;
    region_id: number; // Foreign key referencing Region.id
    translations: unknown;
    wikiDataId: string | null;
}

type Country = {
    id: number;
    name: string;
    iso3: string; // Unique 3 char country code
    iso2: string; // Unique 2 char country code
    numeric_code: string;
    phone_code: string;
    capital: string;
    currency: string; // Unique 3 Char currency code e.g. USD
    currency_name: string;
    currency_symbol: string;
    tld: string; // e.g. .co.uk, .za, .pl etc
    native: string;
    region_id: number; // Foreign key referencing Region.id
    subregion_id: number; // Foreign key referencing Subregion.id
    nationality: string;
    timezones: Array<Timezone>
    translations: {[key:string]: string}
    latitude: number;
    longitude: number;
    emojiU: string;
}

type State = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country_id: number; // Foreign key referencing Country.id
    country_code: string; // Same as Country.iso2
    country_name: string; // Same as Country.name
    state_code: string; // Only unique within same Country
    type: string | null;
}

type City = {
    id: number;
    name: string;
    wikiDataId: string | null;
    latitude: number;
    longitude: number;
    country_id: number; // Foreign key references Country.id
    country_code: string; // same as Country.iso2
    country_name: string; // same as Country.name
    state_id: number; // Foreign key referencing State.id
    state_code: string; // same as State.code
    state_name: string; // same as State.name
}
```
Other Utility Types:

| Name | Structure        | Description         |
|------|------------------|---------------------|
| `GeoPoint`  | `{lat: number, lng: number}` | Single geolocation coordinate            | 
|`DistanceUnit` | one of `km`, `m`, `mi` |Kilometers, meters or miles|
|`BoundingBox` |`{topLeft: GeoPoint, bottomRight: GeoPoint}` |Coordinates of a rectangulat area |
|`Vector` | `{angle: number, distance: number, unit: DistanceUnit, unitInWords?: string}` | Unit of distance with angular direction |

## Utility Functions

11 Utility functions are provided - `haversine` (or `calculateDistance`),
`calculateVectorDistance`,
`isWithinBoundingBox`,
`getMidwayPoint`,
`isWithinRadius`,
`isWithinPolygon`, `findClosestCity`, `findClosestCities`, `findEntitiesWithinRadius`, `getBoundingBox`, `moveCoordsTo`

- _**haversine**_ - aliased as `calculateDistance`, given 2 `GeoPoint`s (i.e. geolocation coordinates `{lat: number, lng: number}`) returns the straight line distance in `meters` (the unit can be changed) using the haversing formula
- _**findClosestCity**_ - given a `GeoPoint` returns the nearest `City`, `State` and `Country`, also returns distance from the nearest city in `meters` (unit changeable)
- _**findClosestCities**_ - Given a `GeoPoint` and a number `x`, returns `x` number of cities closest to that location
- _**findEntitiesWithinRadius**_ - Given a `GeoPoint` and a number `x`, returns all cities in `x`km radius around that location (the unit is customizable)
- _**getBoundingBox**_ - Calculates the bounding box for a given set of geographical points with an optional margin.
- _**calculateVectorDistance**_ - Calculates the vector distance (angle and distance) between two geographical points.
- _**moveCoordsTo**_ - Moves a geographical point by a specified vector (angle and distance).
- _**isWithinBoundingBox**_ - Checks if a given `GeoPoint` is inside a specified `BoundingBox`. returns boolean
- _**getMidwayPoint**_ - Given a list of `GeoPoint[]`s returns a point close to the center of all points
- _**isWithinRadius**_ - Checks if a given `GeoPoint` is within a specified radius from a center `GeoPoint`
- _**isWithinPolygon**_ - Given a `GeoPoint` _X_ and list of `GeoPoint[]`s _Y_ that make a polygon, check if _X_ is withing polygon _Y_, returns true or false. Polygon must have at least 3 sides

#### Examples

```ts
import { 
  calculateDistance, 
  findClosestCity, 
  findClosestCities, 
  findEntitiesWithinRadius 
} from '@neoncoder/geolocation-data'

// Heathrow Airport Coords
const pointA = {lat: 51.46852608063078, lng: -0.4548364232750391}
// Abuja Int'l Airport Coords
const pointB = {lat: 9.007318554723346, lng: 7.269119361911654}

// Straight line distance between Heathrow & Abuja Airport
const distance = calculateDistance(pointA, pointB) 
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
// All City results are returned in order of distance

const locations = [
  { lat: 40.7128, lng: -74.0060 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 41.8781, lng: -87.6298 }
];
// Get Bounding Box Coordinates with a 10km margin 
const boundingBox = getBoundingBox(locations, 10, 'km');
// boundingBox: {
//   topLeft: { lat: 42.02283016952886, lng: -118.43808172393314 },
//   bottomRight: { lat: 34.19693016952886, lng: -74.18068354701443 }
// }

// Find new coordinates if you move 100km at 45deg
const origin = { lat: 40.7128, lng: -74.0060 };
const vector = { angle: 45, distance: 100, unit: 'km' };
const destination = moveCoordsTo(origin, vector);
console.log(destination);
// { lat: 41.34871640601271, lng: -73.16704757394922 }

// Calculate distance between points with direction and unit
const origin = { lat: 40.7128, lng: -74.0060 };
const destination = { lat: 40.8128, lng: -74.0060 };
const vectorDistance = calculateVectorDistance(origin, destination, 'km');
/** returns {
  angle: 0, // because the longitude did not change
  distance: 11.11949266445603,
  unit: 'km',
  unitInWords: 'kilometers'
} */

// check if point is withing bounding box
const point = { lat: 40.7128, lng: -74.0060 };
const boundingBox = {
  topLeft: { lat: 41.0, lng: -75.0 },
  bottomRight: { lat: 40.0, lng: -73.0 }
};
isWithinBoundingBox(point, boundingBox); // true

// Get central point of locations
const locations = [
  { lat: 40.7128, lng: -74.0060 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 41.8781, lng: -87.6298 }
];
const midwayPoint = getMidwayPoint(locations);
// { lat: 38.881033333333335, lng: -93.29316666666666 }

// Check if point is within radial distance from center
const point = { lat: 40.7128, lng: -74.0060 };
const center = { lat: 40.730610, lng: -73.935242 };
const radius = 10; // in kilometers
isWithinRadius(point, center, radius, 'km'); // true

const point = { lat: 40.7128, lng: -74.0060 };
const polygon = [
  { lat: 40.7127, lng: -74.0059 },
  { lat: 40.7129, lng: -74.0059 },
  { lat: 40.7129, lng: -74.0061 },
  { lat: 40.7127, lng: -74.0061 }
];
isWithinPolygon(point, polygon); // true

// convert tuple to GeoPoint and vice-versa
const tuple = [40.7128, -74.0060];
const geoPoint: GeoPoint = tupleToGeoPoint(tuple);
// { lat: 40.7128, lng: -74.0060 }
const newTuple: number[] = geoPointToTuple(point);
// [40.7128, -74.0060]
```

## Acknowledgements

Special thanks to [@dr5hn](https://github.com/dr5hn) and all contributors to both the [Countries-state-cities-database](https://github.com/dr5hn/countries-states-cities-database) project and the [geolocation-utils](https://bitbucket.org/teqplay/geolocation-utils/src/master/) projects as well. This package would not be possible without their hard work 🙌.
