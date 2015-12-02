# DTBS
---------------------------------

> DTBS is a web-app that makes designing and building databases easy.

> For further details, see: [PRESS-RELEASE.md](PRESS-RELEASE.md).

## Team

  - __Product Owner__: Joy Johnson
  - __Scrum Master__: Jessica O'Brien
  - __Development Team Members__: Cheyenne Kellis, Alex Mclean

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Technologies Used](#technologies-used)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Contributing](#contributing)

## Usage

Visit the page, currently hosted on [dtbs.herokuapp.com](http://dtbs.herokuapp.com/)

## Technologies Used

- [Angular](http://angularjs.org)
- [Node](https://nodejs.org/)
- [Express](http://expressjs.com/)
- [MySQL](https://www.mysql.com)
- [jQuery](http://jquery.com)
- [Heroku Deployment](https://www.heroku.com/)

## Requirements

- [Node 0.10.x](https://nodejs.org/en/download/)

## Development Process

### Step 0: Fork and clone the repository from GitHub

### Step 1: Installing Dependencies

Run the following in the command line, from within the repository:

```sh
sudo npm install -g bower
npm install
```

[optional] For convenience with running the server:
```sh
npm install nodemon
```

### Step 2: Running Locally

Run the server in the other tab using node:

```sh
node server/server.js
```

[optional] run the server in nodemon instead (if installed) to automatically restart the server after changing files:

```sh
nodemon
```

### Visiting the server

While node is running, visit the locally running server at [127.0.0.1:3000](127.0.0.1:3000)

### Testing

To run backend tests:
```sh
grunt test
```
To run front end tests, go to test > frontend > backboneSpec.html and open the file in the browser.

### Checking Syntax with JSHint

```sh
grunt syntaxTest
```

## Roadmap

View the project roadmap [here](ROADMAP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
