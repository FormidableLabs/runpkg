const UNPKG = 'https://unpkg.com/';

const fileNameRegEx = /\/[^\/@]+[\.][^\/]+$/;

const parseUrl = (url = window.location.search.slice(1).replace(/\/$/, '')) => {
  const parts = url
    .trim()
    .replace('https://unpkg.com', '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean);

  if (parts[0]) {
    // checks if scoped packaged
    if (parts[0].startsWith('@')) {
      const nameVersion = parts[1].split('@');
      return {
        name: `${parts[0]}/${nameVersion[0]}` || null,
        version: nameVersion[1] || null,
        path: parts.join('/') || null,
        file: (parts.length > 2 && parts.slice(parts.length - 1)[0]) || null,
        directory: parts.slice(2, parts.length - 1).join('/') || null,
      };
    } else {
      const nameVersion = parts[0].split('@');
      return {
        name: nameVersion[0] || null,
        version: nameVersion[1] || null,
        path: parts.join('/') || null,
        file: (parts.length > 1 && parts.slice(parts.length - 1)[0]) || null,
        directory: parts.slice(1, parts.length - 1).join('/') || null,
      };
    }
  } else {
    return {
      name: null,
      version: null,
      path: null,
      file: null,
      directory: null,
    };
  }
};

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

// Handles cases like Svelte, where - on runpkg - the index url doesn't have a file ext
const getCurrentdir = currentPath =>
  currentPath.match(fileNameRegEx)
    ? currentPath.replace(fileNameRegEx, '')
    : currentPath.replace(/\/[^\/]+$/, '');

const makePath = url => x => {
  const base = getCurrentdir(url);
  if (x.startsWith('./')) return base + x.replace('./', '/');
  if (x.startsWith('../')) return handleDoubleDot(x, base);
  if (x.startsWith('https://')) return x;
  return UNPKG + x;
};

const isExternalPath = str => !str.startsWith('.');
const isLocalFile = str => !isExternalPath(str);
const isListedInDependencies = (pkgName, pkgJson) =>
  ['dependencies', 'devDependencies', 'peerDependencies'].find(depType =>
    Object.keys(pkgJson[depType] || {}).includes(parseUrl(pkgName).name)
  );

const stripComments = str =>
  str.replace(/^[\t ]*\/\*(.|\r|\n)*?\*\/|^[\t ]*\/\/.*/gm, '');

const importExportRegex = /^(import|export).*(from)[ \n]+['"](.*?)['"];?$/;
const requireRegex = /(require\(['"])([^)\n\r]*)(['"]\))/;

const packageJsonUrl = url => {
  const { name, version } = parseUrl(url);
  return `${UNPKG}${name}@${version}/package.json`;
};

const directoriesUrl = url => {
  const { name, version } = parseUrl(url);
  return `${UNPKG}${name}@${version}/?meta`;
};

const flatten = arr =>
  arr.reduce(
    (acc, cur) => [...acc, ...(cur.files ? flatten(cur.files) : [cur.path])],
    []
  );

const extractDependencies = (input, packageJson) => {
  const code = stripComments(input).slice(0, 100000);
  const imports = (code.match(new RegExp(importExportRegex, 'gm')) || []).map(
    x => x.match(new RegExp(importExportRegex))[3]
  );
  const requires = (code.match(new RegExp(requireRegex, 'gm')) || []).map(
    x => x.match(new RegExp(requireRegex))[2]
  );
  return [...new Set([...imports, ...requires])].filter(
    x => isLocalFile(x) || isListedInDependencies(x, packageJson)
  );
};

const needsExtension = entry =>
  !entry
    .split('/')
    .pop()
    .includes('.');

const parseDependencies = async path => {
  const { url, code } = await fetch(path).then(async res => ({
    url: res.url,
    code: await res.text(),
  }));
  const dir = await fetch(directoriesUrl(url)).then(res => res.json());
  const pkg = await fetch(packageJsonUrl(url)).then(res => res.json());
  const files = flatten(dir.files);
  const dependencies = extractDependencies(code, pkg).reduce((all, entry) => {
    const packageUrl = `${UNPKG}${pkg.name}@${pkg.version}`;
    let match = makePath(url)(entry);
    if (isExternalPath(entry)) {
      const version = pkg[isListedInDependencies(entry, pkg)][entry];
      match = `${match}@${version}`;
    }
    if (isLocalFile(entry) && needsExtension(entry)) {
      match =
        packageUrl +
        files.find(x =>
          x.match(new RegExp(`${match.replace(packageUrl, '')}(/index)?\\..*`))
        );
    }
    return { ...all, [entry]: match };
  }, {});
  return { url, size: code.length, dependencies };
};

self.onmessage = event => {
  const { data } = event;
  parseDependencies(data)
    .then(x => self.postMessage(x))
    .then(() => self.close());
};
