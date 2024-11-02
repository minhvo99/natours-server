### Natours

### command build for windown

`"build": "del /q dist\\* && npx tsc"`

## How To Use

update later...

## Nodejs version

node v18.20.4 (npm v10.7.0)

## ENV EXAMPLE

```
MONGODB_PASSWORD=
MONGODB_HOST=
MONGODB_DB=
MONGODB_USER=
CLUSTER=
PORT=
NODE_ENV=

JWT_SECRET_KEY=
JWT_EXPIRE_IN=
JWT_REFRESH_KEY=

JWT_COOKIE_EXPIRE_IN=

EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
```

## API Usage

# Tour

Tours List 👉🏻 GET `/api/v1/tour`

Tours State 👉🏻 GET `/api/v1/tour/tour-stast`

Get Top 5 Cheap Tours 👉🏻 GET `/api/v1/tour/top-5-cheap`

Get Monthly Plan 👉🏻 GET `/api/v1/tour/monthly-plan/:year`

Add new Tour 👉🏻 POST `/api/v1/tour/`

Form data example:

```json
{
   "name": "The Sea Explorer",
   "duration": 7,
   "maxGroupSize": 15,
   "difficulty": "medium",
   "ratingsQuantity": 6,
   "ratingsAverage": 4.5,
   "price": 497,
   "summary": "Exploring the jaw-dropping US east coast by foot and by boat",
   "description": "Test",
   "imageCover": "tour-2-cover.jpg",
   "images": ["tour-2-1.jpg", "tour-2-2.jpg", "tour-2-3.jpg"],
   "startDates": [
      "2021-06-19T09:00:00.000Z",
      "2021-07-20T09:00:00.000Z",
      "2021-08-18T09:00:00.000Z"
   ]
}
```

Update a tour 👉🏻 PUT `/api/v1/tour/:id`
Example: update the name of the tour
Form data:

```
{
    "name": "The Sea Explorer",
  }
```

Delete a tour 👉🏻 DELETE `/api/v1/tour/:id`

```
GET http://localhost:8080/api/v1/tour?duration[lte]=5&difficulty=difficult
###
GET http://localhost:8080/api/v1/tour?name=The Snow Adventurer
###
GET http://localhost:8080/api/v1/tour?sort=price,ratingsAverage
###
GET http://localhost:8080/api/v1/tour?fields=name,price

###
GET  http://localhost:8080/api/v1/tour?page=2&limit=4

###
GET  http://localhost:8080/api/v1/tour/top-5-cheap
###
GET http://localhost:8080/api/v1/tour/

###
GET http://localhost:8080/api/v1/tour/tour-stast
###
GET http://localhost:8080/api/v1/tour/monthly-plan/2021
###
DELETE http://localhost:8080/api/v1/tour/66e01edbb827da77d259c699
###

```
