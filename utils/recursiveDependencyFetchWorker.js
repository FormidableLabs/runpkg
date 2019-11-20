/* eslint-disable no-eval */
const UNPKG = 'https://unpkg.com/';

const fileNameRegEx = /\/[^\/@]+[\.][^\/]+$/;

const getParseUrl = () =>
  fetch('/utils/parseUrl.js')
    .then(x => x.text())
    .then(x =>
      x.replace(/\s*export {[^}]+\};/g, '').replace(/^const\s[^=]+=/, '')
    );

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
const isListedInDependencies = async (pkgName, pkgJson) =>
  ['dependencies', 'devDependencies', 'peerDependencies'].find(async depType =>
    Object.keys(pkgJson[depType] || {}).includes(
      eval(await getParseUrl())(pkgName).name
    )
  );

const stripComments = str =>
  str.replace(/^[\t ]*\/\*(.|\r|\n)*?\*\/|^[\t ]*\/\/.*/gm, '');

const importExportRegex = /^(import|export).*(from)[ \n]+['"](.*?)['"];?$/;
const requireRegex = /(require\(['"])([^)\n\r]*)(['"]\))/;

const packageJsonUrl = async url => {
  const { name, version } = eval(await getParseUrl())(url);
  return `${UNPKG}${name}@${version}/package.json`;
};

const directoriesUrl = async url => {
  const { name, version } = eval(await getParseUrl())(url);
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
  const dir = await fetch(await directoriesUrl(url)).then(res => res.json());
  const pkg = await fetch(await packageJsonUrl(url)).then(res => res.json());
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
