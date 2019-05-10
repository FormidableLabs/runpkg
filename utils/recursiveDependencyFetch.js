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

// cache keeps memory of what was run last
const cache = {};

/* eslint-disable max-statements*/
const recursiveDependantsFetch = packageJSON => async (path, parent) => {
  const file = await fetch(path);
  const code = await file.text();
  const url = file.url;

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

  // Dir removes immediate file from absolute URL to get
  // parent directory of current file.
  const dir = url.replace(fileNameRegEx, '');
  const name = url.includes(packageJSON.name)
    ? './' + url.match(/\/([^\/]*)(\.js)|$/)[1]
    : url.replace('https://unpkg.com/', '');

  const isExternalPath = importOrRequire => !importOrRequire.startsWith('.');

  const isLocalFile = importOrRequire =>
    !isExternalPath(importOrRequire) && fileNameRegEx.test(importOrRequire);

  const extractDependencies = input => {
    const imports =
      input.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/gm) || [];
    const importsSanitised = imports.map(
      x => x.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/)[3]
    );
    const requires = input.match(/(require\(['"])[^)]*(['"]\))/gm) || [];
    const requiresSanitised = requires.map(x => x.match(/['"](.*)['"]/)[1]);
    const requiresSanitisedFiltered = requiresSanitised.filter(
      x =>
        !isExternalPath(x) ||
        Object.keys(packageJSON.dependencies || {}).includes(x)
    );
    // Return array of unique dependencies appending js
    // extension to any relative imports that have no extension
    return [
      ...new Set([...importsSanitised, ...requiresSanitisedFiltered]),
    ].map(x => (isExternalPath(x) || isLocalFile(x) ? x : `${x}.js`));
  };

  // Checks for imports/ requires for current file then
  // coverts relative imports to absolute.
  const dependencies = extractDependencies(code).map(makePath(dir));

  // Pushes collected info into cache
  cache[url] = {
    url,
    name,
    code,
    dependencies,
    dependants: parent ? [parent] : [],
  };

  // Then we call the function again for all dependencies of
  //  that file and wait for return.

  /* eslint-disable consistent-return*/
  return Promise.all(
    dependencies.map(x => recursiveDependantsFetch(packageJSON)(x, url))
  );
  /* eslint-enable consistent-return*/
};
/* eslint-enable max-statements*/

export default async (packageJSON, entry) => {
  // Start tree walking dependencies from the given entry point
  // otherwise start from the projects main entry point
  await recursiveDependantsFetch(packageJSON)(
    entry
      ? `https://unpkg.com/${entry}`
      : `https://unpkg.com/${packageJSON.name}@${packageJSON.version}`
  );
  // Returns new cache.
  return cache;
};
