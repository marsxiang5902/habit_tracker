# Growthify

## Description

An app for tracking and displaying events and implementing ideas from researched sources. It is publically hosted at https://growthify.herokuapp.com/.

## Installation

* Clone the directory

```
git clone https://github.com/marsxiang5902/habit_tracker
```

* Install the client dependencies (in `client`)

```
npm install
```

* Install the server dependencies (in `server`)

```
npm install
```

* Place the `tester_server_config.json` file in the `server` folder and rename it `config.json`.

* Place the `tester_client_config.js` file in the `client/src` folder and rename it `config.js`.


## Running

* Run the client (in `client`)
```
npm start
```

* Run the server (in `server`)
```
node app.js
```
  * Or alternatively to use nodemon, which relaunches the server when you save a file:
```
npm run dev
```

## Hosting Together

* Follow the [installation](#installation) instructions

* Build the static client (in `client`)
```
npm run build
```

* Run the server (in `server`)
```
node app.js
```
or
```
npm run dev
```

## API Documentation

See the API Documentation in the `server` folder.
