# habit_tracker API Documentation

`habit_tracker` supports [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) JSON API for accessing the backend.

## Successful Responses Format

When a response is successful, if data is requested, it is given in this format:

```
{
  "data": <the data>
}
```

The status code is `200`.

## Error Format

When an error occurs, an error message is given in this format:

```
{
  "error": "<the error>",
  "description": "<the description>"
}
```

### Error Status Codes

When an error occurs, a non-`200` status code is given:

* `400`: Bad Request - the sent data is invalid
* `404`: Not Found - the resource is not found
* `409`: Conflict - the resource already exists
* `500`: Internal Error - the server ran into an error

## Topics

Events are habits, todos, daily things, cues, rewards, accountability responses, and anything to track. There are three types:
* `habit`
* `todo`
* `repeat`

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

Users are the people who use the app.

## Endpoints

All documentation is in the following format:
* Verb: The [HTTP verb](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to use
* URL: The URL. URL segments that have `:` before them are parameters, usually to specify a specific user or event. For example, if `/users/:user/events` was given as an URL, visiting `/users/mars/events` would fetch the events specific to `mars`.
* Request body: a JSON object that should be sent within the request body. Keys that have `*` before them are optional and can be used to speed up querying.
* Returned data: the data to be returned.
* Other notes

Omitted fields are blank.

### `/events`

#### Create an Event

* Verb: **POST**
* URL: `/`
* Request Body:
```
{
  "user": "<the user it belongs to>",
  "name": "<the name of the event>",
  "type": "<the type of the event>",
  *"args": <arguments passed to certain event types>
}
```
* Depending on the type of the event, there are `args`. All of them are optional:
  * `habit`
    * `historyManagerType`
  * `todo`
  * `repeat`

#### Get an Event

* Verb: **GET**
* URL: `/:_id`
* Returned Data:
```
{
  "_id": "<the id>",
  "user": "<the user it belongs to>",
  "type": "<the event type>",
  "name": "<the name>",
  "historyManager": <the history manager>
}
```

#### Get an Event's History

* Verb: **GET**
* URL: `/:_id/history`
* Request Body:
```
{
  *"historyManager": <the history manager>
}
```
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
  * `historyManager`

#### Update an Event's History

* Verb: **PUT**
* URL: `/:_id/history`
* Request Body:
```
{
  "updObj": {
    "daysBefore1": <value1>,
    "daysBefore2": <value2>,
    ...
  },
  *historyManager: <the history manager>
}
```

#### Delete an Event

* Verb: **DELETE**
* URL: `/:_id`

### `/users`

#### Create a User

* Verb: **POST**
* URL: `/`
* Request Body:
```
{
  "user": "<the username>"
}
```

#### Get Information of User

* Verb: **GET**
* URL: `/:user`
* Returned Data:
```
{
  "_id": "<the id>",
  "user": "<the username>",
  "eventLists": {
    "habit": [<the list of habit event ids>],
    "todo": [<the list of todo event ids>],
    ...
  }
}
```

#### Get Events of User

* Verb: **GET**
* URL: `/:user/events`
* Request Body:
```
{
  *"eventLists": {
    "habit": [<the list of habit event ids>],
    "todo": [<the list of todo event ids>],
    ...
  }
}
```
* Returned Data:
```
{
  "habit": [<habit events>],
  "todo": [<todo events>],
  ...
}
```
* See [Get an Event](#get-an-event) for the returned events.

#### Edit a User

* Verb: **PUT**
* URL: `/:user`
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
  * `user`

#### Delete a User

* Verb: **DELETE**
* URL: `/:user`

















