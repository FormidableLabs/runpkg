import fileNameRegEx from '../utils/fileNameRegEx.js';

// Handles paths like "../../some-file.js"
const handleDoubleDot = (pathEnd, base) => {
  const howFarBack = -1 * pathEnd.match(/\.\.\//g).length;
  const strippedPathEnd = pathEnd.replace(/\.\./g, '').replace(/\/+/g, '/');
  const strippedBase = base
    .split('/')
    .slice(0, howFarBack)
    .join('/');
  return strippedBase + strippedPathEnd;
};

const makePath = base => x => {
  if (x.startsWith('./')) return base + x.replace('./', '/');
  if (x.startsWith('../')) return handleDoubleDot(x, base);
  if (x.startsWith('https://')) return x;
  return 'https://unpkg.com/' + x;
};

const isExternalPath = str => !str.startsWith('.');
const isLocalFile = str => !isExternalPath(str) && fileNameRegEx.test(str);
const stripComments = str =>
  str.replace(/^\/\*(.|\r|\n)*?\*\/|^[\t ]*\/\/.*/gm, '');

const extractDependencies = (input, pkg) => {
  const code = stripComments(input);
  const imports =
    code.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/gm) || [];
  const importsSanitised = imports.map(
    x => x.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/)[3]
  );
  const requires = code.match(/(require\(['"])[^)\n\r]*(['"]\))/gm) || [];
  const requiresSanitised = requires.map(x => x.match(/['"](.*)['"]/)[1]);
  const requiresSanitisedFiltered = requiresSanitised.filter(
    x =>
      !isExternalPath(x) ||
      // comparing just the root of the require, e.g. to handle `require('prop-types/checkPropTypes')`
      Object.keys(pkg.dependencies || {}).includes(x.split('/')[0])
  );
  // Return array of unique dependencies appending js
  // extension to any relative imports that have no extension
  return [...new Set([...importsSanitised, ...requiresSanitisedFiltered])].map(
    x => (isExternalPath(x) || isLocalFile(x) ? x : `${x}.js`)
  );
};

const packageJsonUrl = path =>
  'https://unpkg.com/' +
  path.replace('https://unpkg.com/', '').split('/')[0] +
  '/package.json';

// cache keeps memory of what was run last
const cache = {};
const pkgCache = (items => async key =>
  (items[key] = items[key] || (await fetch(key).then(res => res.json()))))({});

/* eslint-disable max-statements*/
const recursiveDependantsFetch = async (path, parent) => {
  const file = await fetch(path);
  const code = await file.text();
  const url = file.url;
  const dir = url.replace(fileNameRegEx, '');
  const pkg = await pkgCache(packageJsonUrl(url));

  // If we asked for a file but got redirected by unpkg
  // then update the url in the parents dependencies
  if (cache[parent] && path !== url) {
    const position = cache[parent].dependencies.indexOf(path);
    cache[parent].dependencies[position] = url;
  }

  // Checks if we've already fetched the file and dependencies
  // and doesn't fetch it again.
  if (cache[url]) {
    // If this file requests file 'x' but we've already
    // requested file 'x' then it infers that this file
    // is a parent of file 'x'.
    if (parent) {
      cache[url] = {
        ...cache[url],
        dependants: [...cache[url].dependants, parent],
      };
    }
    return;
  }

  const dependencies = extractDependencies(code, pkg).map(makePath(dir));

  cache[url] = {
    url,
    size: code.length,
    dependencies,
    dependants: parent ? [parent] : [],
  };

  // Then we call the function again for all dependencies of
  //  that file and wait for return.

  /* eslint-disable consistent-return*/
  return Promise.all(dependencies.map(x => recursiveDependantsFetch(x, url)));
  /* eslint-enable consistent-return*/
};
/* eslint-enable max-statements*/

export default async entry => {
  // Start tree walking dependencies from the given entry point
  // otherwise start from the projects main entry point
  await recursiveDependantsFetch(`https://unpkg.com/${entry}`);
  // Returns new cache.
  return cache;
};
