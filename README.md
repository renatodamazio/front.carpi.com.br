# Frontfy

Frontfy is a structure for front-end projects. Make with Node.js, Express, Redis and Vue.

## Usage

Prerequisites: Node.js (>=8.x), npm version 3+ and Redis 3+.

Clone this repository or use our [CLI](https://github.com/owInteractive/frontfy-cli).

### Run the project

For development, run the command below for the webpack do his job (Change the key NODE_ENV in config/.env to **development**):

```sh
$ npm run build
```

For production, you can run the command below (Change the key NODE_ENV in config/.env to **production**):

```sh
$ npm start
```

## Configurations

### Project configuration file (config/.env)

Access the .env file inside the /config folder. Open it and configure the following properties:

| Key | Value (default) | Description |
| --- |:-------:|-------------|
| NODE_ENV | development | Controls the project environment, the values can be development or production|
| VUE_DEV | true | Controls the browser VueJS plugin |
| PORT | 8080 | Server port |
| REDIS_HOST | 127.0.0.1 | IP address of the Redis server |
| REDIS_PASSWORD | null | If set, client will run Redis auth command on connect.  |
| REDIS_PORT | 6379 | Port of the Redis server |
| MAIL_SENDER  | null | When an error occurs in the application an email is sent, put here the sender's email. |
| MAIL_SENDER_PW  | null | The sender's password |
| MAIL_RECEIVER  | null | Put here the receiver e-mail |

### Panel Authentication

The project contains a Redis administration panel. To access this panel you must have a [Firebase Authentication](https://firebase.google.com/docs/auth) user and password. Create a new project in Firebase, inside the Frontfy Project access the file *src/assets/js/services/firebase/config.js* and configure with your exclusive Firebase API Configuration.

License
----

[MIT](http://opensource.org/licenses/MIT)
