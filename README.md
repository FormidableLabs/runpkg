# runpkg

> the online package explorer

An interface that lets you navigate any module on npm. Use the tool to learn more about the inner workings of your project dependencies; what they require, the size of specific imports and the dependency chain length as well as other useful metadata.

Eventually we hope to be able to offer dependency tree flattening with dead code elimination and minification.

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/1457604/57516159-1a539d80-730c-11e9-9735-3b34a3ebafde.gif)

# Usage

To view a package or module in the browser with runpkg, prepend any unpkg url with: `r`.

For example: [`https://unpkg.com/es-react@16.8.30/index.js`](https://unpkg.com/es-react@16.8.30/index.js)
Becomes: [`https://runpkg.com/es-react@16.8.30/index.js`](https://runpkg.com/es-react@16.8.30/index.js)

You will be redirect you to runpkg which will display the relevant package and file. You can navigate around the package using the panel on the left which contains a directory listing. Any data uncovered by static analysis will be displayed in the right hand panel.

> Note if browsing directory e.g. `https://unpkg.com/es-react@16.8.30/` then runpkg will ignore the trailing `/` and take you to the entry point.

# Development

If you would like to develop the project, first clone this repo then run the following command in your terminal (from the project root directory) which will open the app in your preferred browser.

```
npx servor
```

> Live reload is enabled by default with [servor](https://github.com/lukejacksonn/servor) so when you make changes to your code the browser will reload the tab and your changes will be reflected there.

## Local URLs

As we're not using Zeit to resolve queries locally, you have to pass in the package or file part of the request in as a search param. Notice the `?` in the local URL.

For example: `https://unpkg.com/es-react@16.8.30/index.js`
Becomes: `http://localhost:8080/?es-react@16.8.30/index.js`

# Testing

We're currently doing end to end tests via Cypress, you can run them using the following:

`npm test`

# Licence

MIT
