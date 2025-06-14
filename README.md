### Natours

### command build for windown

`"build": "del /q dist\\* && npx tsc"`

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

GOOGLE_CLIENT_ID=
```

## API Documentation

### Base URL

```
http://localhost:8080/api/v1
```

## Authentication

### Sign Up

**POST** `/sign-up`

Request body:

```json
{
   "name": "John Doe",
   "email": "john@example.com",
   "password": "password123",
   "passWordConfirm": "password123"
}
```

### Log In

**POST** `/log-in`

Request body:

```json
{
   "email": "john@example.com",
   "password": "password123"
}
```

### Google Login

**POST** `/google-login`

Request body:

```json
{
   "idToken": "google-oauth-token"
}
```

### Forgot Password

**POST** `/forgot-password`

Request body:

```json
{
   "email": "john@example.com"
}
```

### Reset Password

**PATCH** `/reset-password/:token`

Request body:

```json
{
   "password": "newPassword123",
   "passWordConfirm": "newPassword123"
}
```

### Change Password

**PATCH** `/change-password`
_Requires authentication_

Request body:

```json
{
   "passWordCurrent": "currentPassword",
   "password": "newPassword123",
   "passWordConfirm": "newPassword123"
}
```

### Active Account

**PATCH** `/active-account`
_Requires authentication and admin role_

Request body:

```json
{
   "email": "user@example.com"
}
```

## Tours

### Get All Tours

**GET** `/tour`

Query parameters:

-  `duration[lte]=5` - Filter by duration
-  `difficulty=difficult` - Filter by difficulty
-  `name=The Snow Adventurer` - Filter by name
-  `sort=price,ratingsAverage` - Sort results
-  `fields=name,price` - Select specific fields
-  `page=2&limit=4` - Pagination

### Get Tour by ID

**GET** `/tour/:id`

### Get Top 5 Cheap Tours

**GET** `/tour/top-5-cheap`

### Get Tour Statistics

**GET** `/tour/tour-stast`

### Get Monthly Plan

**GET** `/tour/monthly-plan/:year`
_Requires authentication (admin, lead-guide, guide)_

### Get Tours Within Distance

**GET** `/tour/tours-within/:distance/center/:latlng/unit/:unit`

Example: `/tour/tours-within/200/center/34.111745,-118.113491/unit/mi`

### Get Distances

**GET** `/tour/distances/:latlng/unit/:unit`

Example: `/tour/distances/34.111745,-118.113491/unit/mi`

### Create Tour

**POST** `/tour`
_Requires authentication (admin, lead-guide)_

Request body:

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

### Update Tour

**PATCH** `/tour/:id`
_Requires authentication (admin, lead-guide)_

Supports multipart/form-data for image uploads:

-  `imageCover` - Single cover image
-  `images` - Multiple tour images (max 3)

Request body example:

```json
{
   "name": "Updated Tour Name",
   "price": 599
}
```

### Delete Tour

**DELETE** `/tour/:id`
_Requires authentication (admin, lead-guide)_

## Users

### Get All Users

**GET** `/user`
_Requires authentication (admin)_

### Get Current User

**GET** `/user/me`
_Requires authentication_

### Get User by ID

**GET** `/user/:id`
_Requires authentication (admin)_

### Update My Profile

**PATCH** `/user/update-profile`
_Requires authentication_

Supports multipart/form-data for photo upload:

-  `photo` - User profile photo

Request body:

```json
{
   "name": "Updated Name",
   "email": "newemail@example.com"
}
```

### Delete Me (Deactivate Account)

**DELETE** `/user/delete-me`
_Requires authentication_

## Reviews

### Get All Reviews

**GET** `/review`
_Requires authentication_

### Get Reviews for Specific Tour

**GET** `/tour/:id/reviews`
_Requires authentication_

### Get Review by ID

**GET** `/review/:id`
_Requires authentication_

### Create Review

**POST** `/review`
_Requires authentication (guest)_

**POST** `/tour/:id/reviews`
_Requires authentication (guest)_

Request body:

```json
{
   "review": "Amazing tour! Highly recommended.",
   "rating": 5
}
```

### Update Review

**PATCH** `/review/:id`
_Requires authentication (guest - own reviews only)_

Request body:

```json
{
   "review": "Updated review text",
   "rating": 4
}
```

### Delete Review

**DELETE** `/review/:id`
_Requires authentication (guest - own reviews only)_

## Bookings

### Get All Bookings

**GET** `/bookings`
_Requires authentication (admin, lead-guide)_

### Get Booking by ID

**GET** `/bookings/:id`
_Requires authentication (admin, lead-guide)_

### Create Booking

**POST** `/bookings`
_Requires authentication (admin, lead-guide)_

Request body:

```json
{
   "tour": "tour-id",
   "user": "user-id",
   "price": 497
}
```

### Update Booking

**PATCH** `/bookings/:id`
_Requires authentication (admin, lead-guide)_

### Delete Booking

**DELETE** `/bookings/:id`
_Requires authentication (admin, lead-guide)_

## Example Requests

```http
### Get all tours with filters
GET http://localhost:8080/api/v1/tour?duration[lte]=5&difficulty=difficult

### Get tours by name
GET http://localhost:8080/api/v1/tour?name=The Snow Adventurer

### Get sorted tours
GET http://localhost:8080/api/v1/tour?sort=price,ratingsAverage

### Get specific fields only
GET http://localhost:8080/api/v1/tour?fields=name,price

### Pagination
GET http://localhost:8080/api/v1/tour?page=2&limit=4

### Get top 5 cheap tours
GET http://localhost:8080/api/v1/tour/top-5-cheap

### Get tour statistics
GET http://localhost:8080/api/v1/tour/tour-stast

### Get monthly plan
GET http://localhost:8080/api/v1/tour/monthly-plan/2021

### Delete tour
DELETE http://localhost:8080/api/v1/tour/66e01edbb827da77d259c699
```

## Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

-  **admin**: Full access to all resources
-  **lead-guide**: Can manage tours and bookings
-  **guide**: Can view tours and monthly plans
-  **guest**: Can create reviews and view content

## Error Responses

All errors follow this format:

```json
{
   "status": "error",
   "message": "Error description"
}
```

Common HTTP status codes:

-  `400`: Bad Request
-  `401`: Unauthorized
-  `403`: Forbidden
-  `404`: Not Found
-  `500`: Internal Server Error
