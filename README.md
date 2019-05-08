# dora

> the online package explorer

An interface that lets you navigate around the imports of any es module on npm. Use the tool to learn more about the inner workings of your project dependencies; what they require, the size of specific imports and the dependency chain length as well as other useful metadata.

Eventually we hope to be able to offer dependency tree flattening with dead code elimination and minification.

![Runpkg Usage](https://user-images.githubusercontent.com/21056165/57319197-f584dd80-70f3-11e9-9fc1-7e208a957ddb.gif)

# Usage

Pre-append any unpkg url with: `r`.

![Runpkg resolving example](https://user-images.githubusercontent.com/21056165/57318579-91ade500-70f2-11e9-8f32-8a0b3c6b1e18.gif)

For example: `https://unpkg.com/es-react@16.8.30/index.js`

to:

`https://runpkg.com/es-react@16.8.30/index.js`

This will redirect you to the correct runpkg page.

> Note if browsing directory e.g. `https://unpkg.com/es-react@16.8.30/` it will ignore the trailing `/` and take you to the entry point. If you need to explore the file tree, you can access it via the left-hand-side nav bar. 

# Development

Local development is started by running [servor](https://github.com/lukejacksonn/servor).

Depending on your favourite method run it using any of the following commands from the root directory:

`yarn run servor`

`npm run servor`

`npx servor`

This launches the web server on `:8080` this will load up the landing page.

## URL resolving locally:

As we're not using Zeit to resolve url queries locally, you will have to do the following:

Prepend any unpkg url with: `http://localhost:8080/?`.

For example: `https://unpkg.com/es-react@16.8.30/index.js`

to:

`http://localhost:8080/?es-react@16.8.30/index.js`

# Tests

We're currently doing end to end tests via Cypress, you can run them using the following:

`yarn run cy`
