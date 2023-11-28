# To-Do List

## Getting started

### Prerequisites

This project requires that the developer has the following installed:

1. [Node.js](https://nodejs.org/en)
2. [Postgresql](https://www.postgresql.org/)

### Installing the dependencies

`npm install`

## Test Environment

### Dropping the test environment database

`dropdb to-do-list-test`

### Creating the test environment database

`createdb to-do-list-test`

### Running the test environment database migration script

`NODE_ENV=test npm run migrate-latest`

### Running the tests

`npm test`

### Starting the test environment web server

`NODE_ENV=test npm start`

## Development Environment

### Dropping the development environment database

`dropdb to-do-list-development`

### Creating the development environment database

`createdb to-do-list-development`

### Running the development environment database migration script

`NODE_ENV=development npm run migrate-latest`

### Running the tests

`npm test`

### Starting the development environment web server

`NODE_ENV=development npm start`

#### Key Concepts

1. [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
2. [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control)
3. [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
4. [12 Factor App](https://12factor.net)

#### Project Structure

```
- api
- bin
- config
- lambdas
- migrations
- src
  - constants
  - features
  - interfaces
  - observers
  - public
  - services
  - templates
  - utils
- tests
```

##### /api

Contains endpoint functions for web server architecture.

##### /bin

Contains executable files.

##### /config

Contains configuration files.

##### /migrations

Contains database migration scripts.

##### /src/constants

Contains constant values.

##### /src/features

Contains intended business rules and use cases.

##### /src/interfaces

Contains TypeScript interfaces.

##### /src/observers

Contains event listeners.

##### /src/public

Contains generated files.

##### /src/services

Contains code that has meaning in the process level but not exactly part of the core processes.

##### /src/templates

Contains formatting templates for file generation.

##### /src/utils

Contains mostly convenience methods like boilerplate and formatting code.

##### /tests

Contains mostly test utilities and fixtures.
