# Products Search

This repository contains a React application that allows the user to search for products in different sources, initially only Ebay and Local products sources are implemented.

# Running the project

1. Clone this repository
2. Run `npm run install` on your terminal
3. Run `npm run dev` to start local development server

# Tests

This application has a high testing code coverage, the tools used were [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/), all tests live inside `tests` folder.

<img width="1531" alt="coverage" src="https://user-images.githubusercontent.com/4440076/137832918-96201b44-fbed-4fc3-ba68-0af31bdf125c.png">

## Running tests

You can use `npm run test` to run all the test suite once, or `npm run test:watch` to run jest in watch mode.

# Deploying

Run `npm run build` and then push your changes to `main` branch, this will trigger the deploy workflow at Heroku.

In order do ensure code quality, tests and linter will run before commits, in case of failing tests you will no be able to push your changes.

# Ebay

One of the products sources is Ebay, since their API doesn't accept CORS headers, a proxy application was required, this application is also hosted at Heroku, and it is a simple Express app that only forwards requests from the frontend to the Ebay FindAPI.

![Multi Search Services](https://user-images.githubusercontent.com/4440076/137831220-f437233c-cf68-4dec-9ec0-8dace6208237.png)

# Architecture

In order to prevent high coupling between software layers, this app uses the following architecture:

![Multi Search](https://user-images.githubusercontent.com/4440076/137906320-07014b2d-3be8-4ebd-9d4a-600b14c53e9c.png)

### Presentational

Composed mostly of React components and hooks, this layer will only be responsible to call injected services and display data.

It's depencies should only point at the `domain` layer, no direct depencies to another layer is allowed.

Services implementations will be injected at the `main` layer.

### Domain

This layer contains only abstractions that will be referenced by the `presentation` layer, and will be implemented in the `data` layer.

### Data

Contains concrete implementations of services in the `domain` layer, should not reference other layers, depency inversion must be used if that is the case.

### Infra

The Infra layer has implementations of clients required by the `data`, should reference only `data` layer, and must not be referenced by any other layer.

### Main

Has awareness of all other application layers, where dependency injection happens.

# Multiple product sources

This application was architectured with focus on allowing developers to easily test and implement new products sources in isolation, the ProductsSourcesOrchestrator will handle all complexity of multiples sources, the developer must only implement his source as described bellow:

## Implementing a new ProductSource

1. Create a new class that matches the `ProductSource` interface inside the `products/data` layer, Eg: `AmazonProductSource` at `src/products/data/amazon-product-source.ts`.
2. Implement the `search` method to adapt the API needs to the application.
3. Inject the new source inside the products page factory function at `main/factories/products/presentation/make-products-page.tsx`.
4. Enjoy your new product source.

# Cache strategy

Sometimes external APIs might take too long to respond, in order to address that, this app caches user searches using localStorage.

After a product is searched it will be available throught the LocalProductSource.

# Styling

Visual components were build from scratch using SASS and CSS modules, shared components live inside the `design-system` folder.
