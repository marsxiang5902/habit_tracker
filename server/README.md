# habit_tracker API Documentation

`habit_tracker` supports [HTTP requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) in JSON format for accessing the backend.

## Authentication and Authorization

Some endpoints are protected and require authorization. Each user has a set of `roles`, each which have a set of `perms` (permissions). The `perms` of a user is the union of the `perms` of all their `roles`. To access an endpoint, a user must have all the required `perms`.

Most `perms` have two versions - `self`, the `perm` to perform an action on a resource that belongs to the user themselves, and `global`, the `perm` to perform an action on a resource belonging to any user. The `perms` are represented as strings in the format `verb:perm(_self)`. For example:
* `read:user`
* `delete:event_self`

Upon successful login, a [`JWT`](https://jwt.io/)(`string`) will be sent. The `JWT` can be decoded, but not changed on the client side. When decoded, it contains:

```
{
  "user": "<the user>",
  "perms": [<the perms>],
  "iat": "<the time it was issued in seconds after January 1, 1970 00:00 UTC>",
  "exp": "<the time it will expire in seconds after January 1, 1970 00:00 UTC>"
}
```

The `JWT` determines the bearer of the request, and so it must be included with every request that requires authentication. Specifically, the `Authentication` header must have the value of `Bearer <JWT>`:

```
"headers": {
  "Authentication": "Bearer <JWT>",
  ...
}
```

## Response Format

All responses are of the following format:

```
{
  "data": <the data>,
  "error": "<the errors, if any>",
  "error_description": "<error description>"
}
```

## Status Codes

When a request is successful, a `200` status code is given.

When an error occurs, a non-`200` status code is given:

* `400`: Bad Request - the sent data is invalid
* `401`: Unauthorized - the username and password is incorrect or the authorization token is incorrect or missing
* `404`: Not Found - the resource is not found
* `409`: Conflict - the resource already exists
* `500`: Internal Error - the server ran into an internal error

## Topics

### Events

Events are habits, todos, daily things, cues, rewards, accountability responses, and anything to track. There are four types:
* `habit`
* `todo`
* `repeat`
* `cue`

Each type has additional arguments that can be specified when created and that are returned when the event is fetched:
* `habit`
  * `historyManagerType = bitmask`: `"<the type of history manager to use>"`
* `cue`
  * `resourceURL = ""`: `"<the URL of the activation resource>"`

### History Managers

History Managers are objects that manage an event's completion or activation history. Each type has a `get` and a `set` function, each in the following form:
```
{
  "daysBefore1": <value1>,
  "daysBefore2": <value2>,
  ...
}
```
There are two types:
* `bitmask`
  * Stores up to 32 previous days (including the current day). Each day can be either `true` or `false`.
* `none`

## Endpoints

All documentation is in the following format:
* Verb: The [HTTP verb](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to use
* URL: The URL. URL segments that have `:` before them are parameters, usually to specify a specific user or event. For example, if `/users/:user/events` was given as an URL, visiting `/users/mars/events` would fetch the events specific to `mars`.
* Perms: the set of permissions required to access the endpoint. All `perms` are given in global format, but users with the `self` `perm` can use the endpoint if they themselves are the owner of the resource.
* Request body: a JSON object that should be sent within the request body. Keys with `*` are optional.
* Returned data: the data to be returned. Keys with `*` are sometimes returned, depending on factors like the type of event.
* Other notes

Omitted fields are blank.

### Auth: `/`

#### Login

* Verb: **POST**
* URL: `/login`
* Request Body:
```
{
  "user": "<the username>",
  "password": "<the password>"
}
```
* Returned data:
```
{
  jwt: "<the JWT>"
}
```

#### Sign Up

* Verb: **POST**
* URL: `/signup`
* Request Body:
```
{
  "user": "<the username>",
  "password": "<the password>"
}
```
* Returned data:
```
{
  jwt: "<the JWT of the newly created user>"
}
```

### Events: `/events`

#### Create an Event

* Verb: **POST**
* URL: `/`
* Perms: {`create:event`}
* Request Body:
```
{
  "user": "<the user it belongs to>",
  "name": "<the name of the event>",
  "type": "<the type of the event>",
  *"args": <arguments passed to certain event types>
}
```
* Refer to the [events](#events) for `args`. All of them are optional.

#### Get an Event

* Verb: **GET**
* URL: `/:_id`
* Perms: {`read:event`}
* Returned Data:
```
{
  "_id": "<the id>",
  "user": "<the user it belongs to>",
  "type": "<the event type>",
  "name": "<the name>",
  *"resourceURL": <the history manager>
}
```

#### Get an Event's History

* Verb: **GET**
* URL: `/:_id/history`
* Perms: {`read:event`}
* Returned Data:
```
{
  "daysBefore1": <value1>,
  "daysBefore2": <value2>,
  ...
}
```

#### Update an Event

* Verb: **PUT**
* URL: `/:_id`
* Perms: {`update:event`}
* Request Body:
```
{
  "updObj": {
    field1: <value1>,
    field2: <value2>,
    ...
  }
}
```
* Sets the specified fields to their respective values and leaves everything else the same. The allowed fields to change in this function are:
  * `name`
  * `resourcePointer`

#### Update an Event's History

* Verb: **PUT**
* URL: `/:_id/history`
* Perms: {`udpate:event`}
* Request Body:
```
{
  "updObj": {
    "daysBefore1": <value1>,
    "daysBefore2": <value2>,
    ...
  }
}
```

#### Delete an Event

* Verb: **DELETE**
* URL: `/:_id`
* Perms: {`delete:event`}

### Users: `/users`

#### Get User Information

* Verb: **GET**
* URL: `/:user`
* Perms: {`read:user`}
* Returned Data:
```
{
  "user": "<the username>",
  "perms": [<the perms>]
}
```

#### Get User Events

* Verb: **GET**
* URL: `/:user/events`
* Perms: {`read:user`}
* Returned Data:
```
{
  "habit": [<habit events>],
  "todo": [<todo events>],
  ...
}
```
* See [Get an Event](#get-an-event) for the returned events.

#### Get User Authentication Information

* Verb: **GET**
* URL: `/user/auth`
* Perms: {`read:user_auth`}
* Returned Data:
```
{
  "password_hashed": "<the hashed password>"
}
```

#### Delete a User

* Verb: **DELETE**
* URL: `/:user`
* Perms: {`delete:user`}



















