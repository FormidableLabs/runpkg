# runpkg

> the online package explorer

Runpkg turns a static file into an interactive and informative browsing experience. It lets you navigate any JavaScript package on npm thanks to [unpkg.com](https://unpkg.com) a very popular and reliable CDN mirror of the npm registry. You can use the tool to learn more about the inner workings of your project's dependencies; find out how modules work, what they depend on, the size of specific imports as other useful metadata.

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/1457604/57516159-1a539d80-730c-11e9-9735-3b34a3ebafde.gif)

# Features

We set out to solve a few very specific problems:

- 🔭 Navigable project directory listing
- 🎨 Syntax highlighted file contents
- 📝 Insight through some static analysis

# Usage

To view a package or module in the browser with runpkg, pre-append any unpkg url with: `r`.

For example: [`https://unpkg.com/es-react@16.8.30/index.js`](https://unpkg.com/es-react@16.8.30/index.js)

Becomes: [`https://runpkg.com/es-react@16.8.30/index.js`](https://runpkg.com/es-react@16.8.30/index.js)

You will be redirect you to runpkg which will display the relevant package and file. You can navigate around the package using the panel on the left which contains a directory listing. Any data uncovered by static analysis will be displayed in the right hand panel.

> Note if browsing a directory then runpkg will ignore the trailing `/` and take you to the entry point.

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

```
npm test
```

# Licence

MIT
