# runpkg

> the online package explorer

Runpkg turns a static file into an interactive and informative browsing experience. It lets you navigate any JavaScript package on npm thanks to [unpkg.com](https://unpkg.com), a popular and reliable CDN mirror of the npm registry. You can use this tool to learn more about the inner workings of your project's dependencies; find out how modules work, what they depend on, the size of specific imports as well as other useful metadata.

---

![runpkg](https://user-images.githubusercontent.com/1457604/69634098-77fdcc00-1049-11ea-82db-c2f23cf87179.gif)

## Features

- 🔭 Navigable project directory listing
- 🎨 Syntax highlighted file contents
- 📝 Insights through static analysis

## Usage

To view a package or module in the browser with runpkg, prepend any unpkg url with: `r`. For example:

| Source | URL                                                                                            |
| ------ | ---------------------------------------------------------------------------------------------- |
| unpkg  | [`https://unpkg.com/es-react@16.8.30/index.js`](https://unpkg.com/es-react@16.8.30/index.js)   |
| runpkg | [`https://runpkg.com/es-react@16.8.30/index.js`](https://runpkg.com/es-react@16.8.30/index.js) |

You will be redirected to runpkg which will display the relevant package and file. You can navigate around the package using the 'Package' panel which contains a directory listing. The 'File' tab will also display any information uncovered during static analysis.

> Note if browsing a directory then runpkg will ignore the trailing `/` and take you to the entry point.

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on how to run this project locally, contribute, and to see our code of conduct.

## Local URLs

As we're not using Netlify to redirect URLs locally, you have to pass in the package or file part of the request in as a search param. Notice the `?` in the local URL. For example:

| Source    | URL                                                |
| --------- | -------------------------------------------------- |
| unpkg     | `https://unpkg.com/es-react@16.8.30/index.js`      |
| localhost | `http://localhost:8080/?es-react@16.8.30/index.js` |

## Browsers Supported

| Browser           | Supported | Versions    |
| ----------------- | --------- | ----------- |
| Chrome            | Yes       | 73+         |
| Chrome (Android)  | Yes       | 73+         |
| Firefox           | Yes       | 66+         |
| Firefox (Android) | Yes       | 66+         |
| Safari            | Yes       | 11+         |
| Safari (iOS)      | Yes       | 11+         |
| Opera             | Yes       | 59+         |
| Edge (Blink)      | Yes       | Dev, Canary |
| Edge (EdgeHTML)   | No        |             |
| IE 11             | No        |             |

## Testing

We're currently doing end to end tests via Cypress, you can run them using the following:

```bash
yarn test
# or
npm run test
```

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome.

## Licence

MIT
