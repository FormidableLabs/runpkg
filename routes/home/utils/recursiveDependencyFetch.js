const makePath = base => x => {
  if (x.startsWith('./')) return base + x.replace('./', '/');
  if (x.startsWith('https://')) return x;
  return 'https://unpkg.com/' + x;
};

// cache keeps memory of what was run last
let cache = {};

const recursiveDependantsFetch = async (path, parent) => {
  const file = await fetch(path);
  const code = await file.text();
  const url = file.url;

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

  // Base removes immediate js file from absolute URL to get
  // parent directory of current file.
  const base = url.replace(/\/[^\/]*\.js/, '');

  const name = './' + url.match(/\/([^\/]*)(\.js)|$/)[1];

  // Checks for imports/ requires for current file then
  // coverts relative imports to absolute.
  const dependencies = [
    ...(code.match(/(?<=(import|export).*from ['"]).*(?=['"])/g) || []),
    ...(code.match(/(?<=require\(['"])[^)]*(?=['"]\))/g) || []),
  ].map(makePath(base));

  // Pushes collected info into cache
  cache[url] = {
    url,
    name,
    code,
    dependencies,
    dependants: parent ? [parent] : [],
  };
  /* eslint-disable consistent-return*/

  // Then we call the function again for all dependencies of
  //  that file and wait for return.

  return Promise.all(dependencies.map(x => recursiveDependantsFetch(x, url)));
  /* eslint-enable consistent-return*/
};

export default async path => {
  // Every time this function is called it resets the cache
  // should only be called when package changes.
  cache = {};
  await recursiveDependantsFetch(path);

  // Returns new cache.
  return cache;
};
