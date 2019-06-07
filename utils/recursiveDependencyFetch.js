import fileNameRegEx from '../utils/fileNameRegEx.js';
import makePath from '../utils/makePath.js';

const UNPKG = 'https://unpkg.com/';

const isExternalPath = str => !str.startsWith('.');
const isLocalFile = str => !isExternalPath(str) && fileNameRegEx.test(str);
const stripComments = str =>
  str.replace(/^[\t ]*\/\*(.|\r|\n)*?\*\/|^[\t ]*\/\/.*/gm, '');

const extractDependencies = (input, pkg) => {
  const code = stripComments(input);

  const imports = (
    code.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/gm) || []
  ).map(x => x.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/)[3]);

  const requires = (code.match(/(require\(['"])[^)\n\r]*(['"]\))/gm) || [])
    .map(x => x.match(/['"](.*)['"]/)[1])
    .filter(
      x =>
        !isExternalPath(x) ||
        // Allows both @babel/core and proptypes/something
        Object.keys(pkg.dependencies || {}).includes(
          x.startsWith('@') ? x : x.split('/')[0]
        )
    );

  // Return array of unique dependencies appending js
  // extension to any relative imports that have no extension
  return [...new Set([...imports, ...requires])].map(x =>
    isExternalPath(x) || isLocalFile(x) ? x : `${x}.js`
  );
};

const packageJsonUrl = path => {
  const [_full, name, version] = path.match(
    /https:\/\/unpkg.com\/(@?[^@\n]*)@?(\d+\.\d+\.\d+)?/
  );
  return `${UNPKG}${name}@${version}/package.json`;
};

// cache keeps memory of what was run last
const cache = {};

// PkgCache is a class that maintains a cache of package.jsons we've fetched
// the fetchPkg method checks if pkgjson is in cache, if so it
// returns it, if not it fetches it.

class PkgCache {
  constructor() {
    this.cache = new Map();
  }
  async fetchPkg(key) {
    if (this.cache.has(key)) {
      return await this.cache.get(key);
    }
    const resultPromise = fetch(key)
      .then(fetch(key))
      .then(res => res.json());
    this.cache.set(key, resultPromise);
    return await resultPromise;
  }
}

// FileCache is a class that maintains a cache of files we've fetched
// the fetchFiles method checks if file is in cache, if so it
// returns it, if not it fetches it.

class FileCache {
  constructor() {
    this.cache = new Map();
  }
  async fetchFiles(key) {
    if (this.cache.has(key)) {
      return await this.cache.get(key);
    }
    const resultPromise = fetch(key).then(async res => ({
      url: res.url,
      code: await res.text(),
    }));
    this.cache.set(key, resultPromise);
    return await resultPromise;
  }
}

/* eslint-disable max-statements, max-params */
const recursiveDependantsFetch = async (path, parent, fileCache, pkgCache) => {
  if (!fileCache) {
    fileCache = new FileCache();
  }
  if (!pkgCache) {
    pkgCache = new PkgCache();
  }
  const { url, code } = await fileCache.fetchFiles(path);
  const pkg = await pkgCache.fetchPkg(packageJsonUrl(url));

  // If we asked for a file but got redirected by unpkg
  // then update the url in the parents dependencies
  if (cache[parent] && path !== url) {
    const position = cache[parent].dependencies.map(x => x[1]).indexOf(path);
    cache[parent].dependencies[position][1] = url;
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

  const dependencies = extractDependencies(code, pkg).map(x => [
    x,
    makePath(url)(x),
  ]);

  cache[url] = {
    url,
    size: code.length,
    dependencies,
    dependants: parent ? [parent] : [],
  };

  // Then we call the function again for all dependencies of
  // that file and wait for return.
  // eslint-disable-next-line consistent-return
  return Promise.all(
    dependencies.map(x =>
      recursiveDependantsFetch(x[1], url, fileCache, pkgCache)
    )
  );
};
/* eslint-enable max-statements*/

export default async entry => {
  // Start tree walking dependencies from the given entry point
  // otherwise start from the projects main entry point
  await recursiveDependantsFetch(entry);
  // Returns new cache.
  return cache;
};
