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

## Contributing

If one wants to contribute to this project, create a branch with an appropriate name that reflects the intention.
Then create a pull request with the complete description of the changes made. Make sure to include appropriate testing.
A test coverage of 80% has to be maintained in order for a branch to be considered stable and valid.

### Code Review Check list

Things that need to be kept in mind when reviewing a contributor's work are but may not be limited to the following:

1. If it's a feature that corresponds to a user story, does it fulfill all the acceptance criteria?
2. If it's a bug fix, does the test replicate the actual scenario?
3. Does lint pass?
4. Are there breaking changes/failing tests?
5. Does the code follow coding guidelines?

### Coding Guidelines

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
- seeders
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

##### /lambdas

Contains lambda functions for serverless architecture.

##### /migrations

Contains database migration scripts.

##### /seeders

Contains database seed data.

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

#### Configuration Management

All configuration values, as stated in `config/default.js`, are fetched from the underlying environment. For environment specific overrides, create a json file
with that environment's name. For example, `config/test.json`. For more information, refer to [node-config](https://github.com/lorenwest/node-config)

#### Request Handling Code

All code that aims to handle requests should be placed outside the `src` folder. Requests can originate from http, from another process, serverless, queue etc.
Create a folder that will contain code that handles requests from these origins. Currently, the `/api` folder contains code handling http requests.

#### Testing

Unit and integration tests are to be placed beside the subject under test.
