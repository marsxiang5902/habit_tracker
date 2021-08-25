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

Events are habits, todos, daily things, rewards, accountability responses, and anything to track. Each `event` object has additional arguments that can be specified when created and that are returned when the event is fetched. There are five types:
* `habit`
  * A basic daily habit
* `todo`
  * A todo that should be deleted when completed
* `reward`
  * A reward (often `stack`ed)
* `stack`
  * A versatile collection of events that renders each sequentially in the dashboard
  * `eventList = []`: the list of events
  * `pointer = 0`: the currently active event in the list
* `form`
  * A form for data collection
  * `fields = []`: the fields in the form. This data is given in the format `[["fieldName1", "fieldType1"], ..., ["fieldNameN", "fieldTypeN"]]`, where `fieldTypeX` is a type in `HistoryManager<fields>` and `fieldName`s are unique.

Each non-`todo` `event` has a `checkedHistoryManagerType = "bitmask"` to record the history of event checking, and `activationDays = {[0:6]: true}` to record which days the `event` should be displayed in the dashboard in `args`.


### History Managers

`HistoryManagers` are objects that manage an event's completion or activation history. Each type has a `get` and a `set` function, each in the following form:
```
{
  "daysBefore1": <value1>,
  "daysBefore2": <value2>,
  ...
}
```
There are three types:
* `bitmask`
  * Stores up to 32 previous days (including the current day). Each day can be either `true` or `false`.
* `fields`
  * Stores up to 32 previous days (including the current day). Each day can be a `num` or a `str`, but all types must be the same for a single `HistoryManager`.
* `none`

The data is reset at the end of each day, which is checked upon events including login.

### Triggers

Triggers are resources that may be displayed prior to start of an event to increase motivation or serve as a reminder. Each event has a list of triggers. Each `trigger` object has additional arguments that can be specified when created and that are returned when fetched. There are four types:
* `image`
  * `resourceURL = ""`: `"<a link to the image>"`
* `audio`
  * `resourceURL = ""`: `"<a link to the audio>"`
* `video`
  * `resourceURL = ""`: `"<a link to the video>"`
* `link`
  * `resourceURL = ""`: `"<a link>"`


### Users

Each user has an accountability partner, whose uncompleted events from the previous day they will be able to read.

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
* Resets `History Managers`.

#### Sign Up

* Verb: **POST**
* URL: `/signup`
* Request Body:
```
{
  "user": "<the username>",
  "password": "<the password>"
  "email": "<the email>"
}
```
* Returned data:
```
{
  jwt: "<the JWT of the newly created user>"
}
```

### Events: `/events`


#### Create Event

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
* Returned Data:
```
  <the newly created event>
```
* Refer to the [events](#events) for the `args`. All of them are optional.
* Refer to [Get Event](#get-event) for the returned event.


#### Get Event's History

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

#### Get Event

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
  "history": <the history>,
  "triggers": [<the triggers>]
}
```
* The `history` object is the same as the one returned from [Get Event's History](#get-events-history)
* Each element in the `triggers` array is the same as the one returned from [Get Trigger](#get-trigger)


#### Get Form Event's Form History

* Verb: **GET**
* URL: `/:_id/form`
* Perms: {`read:event`}
* Returned Data:
```
{
  "formData": {
    "field1": {
      "daysBefore1": <value1>,
      "daysBefore2": <value2>,
      ...
    },
    "field2": {
      "daysBefore1": <value1>,
      "daysBefore2": <value2>,
      ...
    },
    ...
  },
  "formLayout":{
    ["<fieldName1>", "<fieldType1>"],
    ["<fieldName2>", "<fieldType2>"],
    ...
  }
}
```
* The `event` must be a `form`
* Each of `formData`'s entries is in the same format as `HistoryManager<fields>`'s [Get Event's History](#get-events-history)
* The layout of `formLayout` is the same as the [constructor](#events)
* `formLayout` fields are returned in order

#### Update Event

* Verb: **PUT**
* URL: `/:_id`
* Perms: {`update:event`}
* Request Body:
```
{
  "field1": <value1>,
  "field2": <value2>,
  ...
}
```
* Returned Data:
```
  <the new event>
```
* Sets the specified fields to their respective values and leaves everything else the same. The allowed fields to change in this function are:
  * `name`
* The `event` returned is the same as the one returned from [Get Event](#get-event) 


#### Update Event's History

* Verb: **PUT**
* URL: `/:_id/history`
* Perms: {`udpate:event`}
* Request Body:
```
{
  "daysBefore1": <value1>,
  "daysBefore2": <value2>,
  ...
}
```
* Returned Data:
```
  <the new event>
```
* The `event` returned is the same as the one returned from [Get Event](#get-event) 


#### Update Form Event's Form History

* Verb: **PUT**
* URL: `/:_id/form`
* Perms: {`udpate:event`}
* Request Body:
```
{
  "field1": {
    "daysBefore1": <value1>,
    "daysBefore2": <value2>,
    ...
  },
  "field2": {
    "daysBefore1": <value1>,
    "daysBefore2": <value2>,
    ...
  },
  ...
}
```
* Returned Data:
```
  <the new event>
```
* The `event` returned is the same as the one returned from [Get Event](#get-event) 


#### Update Form Event's Form Layout

* Verb: **PUT**
* URL: `/:_id/form/layout`
* Perms: {`udpate:event`}
* Request Body:
```
[
    ["<newLayoutField1>", <fromPrev1?>, <fromPrev1 ? "name1" : "type1">],
    ["<newLayoutField2>", <fromPrev2?>, <fromPrev2 ? "name2" : "type2">],
    ...
]
```
* Returned Data:
```
  <the new event>
```
* `newLayoutField`s must be unique
* `fromPrev` is a `boolean`
* If `fromPrev`, the third argument is the name of the previous field; else, it is the type of the new field
* `name`s must be unique among all elements where `fromPrev` is `true`
* The `event` returned is the same as the one returned from [Get Event](#get-event) 


#### Delete Event

* Verb: **DELETE**
* URL: `/:_id`
* Perms: {`delete:event`}


### Triggers: `/triggers`


#### Create Trigger

* Verb: **POST**
* URL: `/`
* Perms: {`update:event`}
* Request Body:
```
{
  "user": "<the user it belongs to>",
  "name": "<the name of the trigger>",
  "type": "<the type of the trigger>",
  "event_id": "<the _id of the event it belongs to>",
  *"args": <arguments passed to certain trigger types>
}
```
* Returned Data:
```
  <the newly created trigger>
```
* Refer to the [triggers](#triggers) for the `args`. All of them are optional.
* Refer to [Get Trigger](#get-trigger) for the returned trigger.


#### Get Trigger

* Verb: **GET**
* URL: `/:_id`
* Perms: {`read:event`}
* Returned Data:
```
{
  "_id": "<the id>"
  "user": "<the user it belongs to>",
  "name": "<the name of the trigger>",
  "type": "<the type of the trigger>",
  "event_id": "<the _id of the event it belongs to>",
  *"resourceURL": "<the URL of the resource>"
}
```
* Refer to the [triggers](#triggers) for the returned properties.


#### Update Trigger

* Verb: **PUT**
* URL: `/:_id`
* Perms: {`update:event`}
* Request Body:
```
{
  "field1": <value1>,
  "field2": <value2>,
  ...
}
```
* Returned Data:
```
  <the new trigger>
```
* Sets the specified fields to their respective values and leaves everything else the same. The allowed fields to change in this function are:
  * `name`
  * `resourceURL`
* The `trigger` returned is the same as the one returned from [Get Event](#get-trigger) 


#### Delete Trigger

* Verb: **DELETE**
* URL: `/:_id`
* Perms: {`update:event`}


### Users: `/users`

#### Get User Information

* Verb: **GET**
* URL: `/:user`
* Perms: {`read:user`}
* Returned Data:
```
{
  "user": "<the username>",
  "perms": [<the perms>],
  "email": "<the email>",
  "dayStartTime": "<the time a new day starts>",
  "partner": "<their accountability partner>"
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
* Refer to [Get Event](#get-event) for the returned events.


#### Get User Authentication Information

* Verb: **GET**
* URL: `/:user/auth`
* Perms: {`read:user_auth`}
* Returned Data:
```
{
  "password_hashed": "<the hashed password>"
}
```

#### Get Partner's Missed Events

* Verb: **GET**
* URL: `/:user/partner`
* Perms: {`read:user`}
* Returned Data:
```
{
  "habit": [<habit events' names>],
  "todo": [<todo events' names>],
  ...
}
```

#### Update User

* Verb: **PUT**
* URL: `/:user`
* Perms: {`update:user`}
* Request Body:
```
{
  "field1": <value1>,
  "field2": <value2>,
  ...
}
```
* Returned Data:
```
  <the new user>
```
* Sets the specified fields to their respective values and leaves everything else the same. The allowed fields to change in this function are:
  * `email`
  * `dayStartTime`
* The `user` returned is the same as the one returned from [Get Event](#get-trigger) 


#### Delete a User

* Verb: **DELETE**
* URL: `/:user`
* Perms: {`delete:user`}



















