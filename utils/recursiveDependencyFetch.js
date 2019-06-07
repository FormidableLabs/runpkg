import fileNameRegEx from '../utils/fileNameRegEx.js';

const UNPKG = 'https://unpkg.com/';

// WIPWIP
const isExternalPath = str => !str.startsWith('.');
const isMissingFileExt = str => /\/[^.\/]*$/.test(str);
const isLocalFile = str => !isExternalPath(str) && fileNameRegEx.test(str);
const stripComments = str =>
  str.replace(/^[\t ]*\/\*(.|\r|\n)*?\*\/|^[\t ]*\/\/.*/gm, '');

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

const makePath = url => x => {
  let base = url.replace(fileNameRegEx, '');
  // Following line fixes edge case where current file has no extension, e.g. in Svelte
  if (base === url) base = url.replace(/\/[^\/]+$/, '');
  // WIPWIP
  console.log('base!', base);

  // if()

  if (x.startsWith('./')) return base + x.replace('./', '/');
  if (x.startsWith('../')) return handleDoubleDot(x, base);
  if (x.startsWith('https://')) return x;
  return UNPKG + x;
};

// Return array of unique dependencies appending js
// extension to any relative imports that have no extension
// Need to update this file resolution, using meta!
// console.log('input and pkg', input, pkg);
// WIPWIP
const localFileResolver = (inputName, pathList) => {
  console.log('trying to resolve', inputName, 'against', pathList);
  console.log(
    'pathlist find',
    pathList.filter(x => x.includes(inputName.replace(/^\.\//, '')))
  );
  return `${inputName}.js`;
};

const localFileResMap = x => {
  if (isExternalPath(x) || !isMissingFileExt(x)) return x;

  console.log('yeah', x, isExternalPath(x), isMissingFileExt(x));

  return x;
};

const extractDependencies = (input, pkg, metaPaths) => {
  const code = stripComments(input);
  // WIPWIP

  const imports = (
    code.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/gm) || []
  )
    .map(x => x.match(/^(import|export).*(from)[ \n]+['"](.*?)['"];?$/)[3])
    .map(localFileResMap);
  // WIPWIP

  const requires = (code.match(/(require\(['"])[^)\n\r]*(['"]\))/gm) || [])
    .map(x => x.match(/['"](.*)['"]/)[1])
    .map(localFileResMap)
    .filter(
      x =>
        !isExternalPath(x) ||
        // Allows both @babel/core and proptypes/something
        Object.keys(pkg.dependencies || {}).includes(
          x.startsWith('@') ? x : x.split('/')[0]
        )
    );

  return [...new Set([...imports, ...requires])].map(x =>
    isExternalPath(x) || isLocalFile(x) ? x : localFileResolver(x, metaPaths)
  );
};

const packageJsonUrl = path => {
  const [_full, name, version] = path.match(
    /https:\/\/unpkg.com\/(@?[^@\n]*)@?(\d+\.\d+\.\d+)?/
  );
  return `${UNPKG}${name}@${version}/package.json`;
};

const packageMetaUrl = path => {
  const [_full, name, version] = path.match(
    /https:\/\/unpkg.com\/(@?[^@\n]*)@?(\d+\.\d+\.\d+)?/
  );
  return `${UNPKG}${name}@${version}/?meta`;
};

const getFilePathsFromMeta = meta => {
  const reducer = (acc, curr) => {
    if (curr.type === 'file') {
      return acc.concat(curr.path);
    } else if (curr.type === 'directory') {
      return acc.concat(curr.files.reduce(reducer, []));
    }
  };

  return meta.files.reduce(reducer, []);
};

// cache keeps memory of what was run last
const cache = {};

const pkgCache = (items => async key =>
  (items[key] = items[key] || (await fetch(key).then(res => res.json()))))({});

const fileCache = (items => async key =>
  (items[key] =
    items[key] ||
    (await fetch(key).then(async res => ({
      url: res.url,
      code: await res.text(),
    })))))({});

/* eslint-disable max-statements*/
const recursiveDependantsFetch = async (path, parent) => {
  const { url, code } = await fileCache(path);
  const pkg = await pkgCache(packageJsonUrl(url));

  // This means we're fetching meta twice: redundant but easier for now...
  const meta = await fetch(packageMetaUrl(url)).then(res => res.json());
  const metaPaths = getFilePathsFromMeta(meta);

  // console.log('new meta!', meta, metaPaths);

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
  // WIPWIP

  const dependencies = extractDependencies(code, pkg, metaPaths)
    .map(makePath(url))
    .map(localFileResMap);

  console.log('depen', dependencies);

  cache[url] = {
    url,
    size: code.length,
    dependencies,
    dependants: parent ? [parent] : [],
  };

  // Then we call the function again for all dependencies of
  // that file and wait for return.
  // eslint-disable-next-line consistent-return
  return Promise.all(dependencies.map(x => recursiveDependantsFetch(x, url)));
};
/* eslint-enable max-statements*/

export default async entry => {
  // Start tree walking dependencies from the given entry point
  // otherwise start from the projects main entry point
  await recursiveDependantsFetch(entry);
  // Returns new cache.
  return cache;
};
