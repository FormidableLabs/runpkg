const makePath = base => x => {
  if (x.startsWith('./')) return base + x.replace('./', '/');
  if (x.startsWith('https://')) return x;
  return 'https://unpkg.com/' + x;
};

// cache keeps memory of what was run last
let cache = {};

/* eslint-disable max-statements*/
const recursiveDependantsFetch = packageJSON => async (path, parent) => {
  const file = await fetch(path);
  const code = await file.text();
  const url = file.url;

  // Checks if we've already fetched the file and dependencies
  // and doesn't fetch it again.

  if (cache[parent] && path !== url) {
    const position = cache[parent].dependencies.indexOf(path);
    cache[parent].dependencies[position] = url;
  }

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

  // Base removes immediate js file from absolute URL to get
  // parent directory of current file.
  const base = url.replace(/\/[^\/]*\.js/, '');
  const name = url.includes(packageJSON.name)
    ? './' + url.match(/\/([^\/]*)(\.js)|$/)[1]
    : url.replace('https://unpkg.com/', '');

  const extractDependencies = input => {
    const imports =
      input.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/gm) || [];
    const importsSanitised = imports.map(
      x => x.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/)[3]
    );
    const requires = input.match(/(require\(['"])[^)]*(['"]\))/gm) || [];
    const requiresSanitised = requires.map(x => x.match(/['"](.*)['"]/)[1]);
    const requiresSanitisedFiltered = requiresSanitised
      .filter(
        x =>
          x.startsWith('./') ||
          Object.keys(packageJSON.dependencies || {}).includes(x)
      )
      .map(x => (x.startsWith('./') && !x.endsWith('.js') ? `${x}.js` : x));
    return [...new Set([...importsSanitised, ...requiresSanitisedFiltered])];
  };

  // Checks for imports/ requires for current file then
  // coverts relative imports to absolute.
  const dependencies = extractDependencies(code).map(makePath(base));

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

export default async packageJSON => {
  // Every time this function is called it resets the cache
  // should only be called when package changes.
  cache = {};
  await recursiveDependantsFetch(packageJSON)(
    `https://unpkg.com/${packageJSON.name}@${packageJSON.version}`
  );
  // Returns new cache.
  return cache;
};
