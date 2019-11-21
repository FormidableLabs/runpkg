import makePath from '../utils/makePath.js';
import { parseUrl } from './parseUrl.js';

const UNPKG = 'https://unpkg.com/';

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
    x =>
      isLocalFile(x) ||
      isListedInDependencies(x, packageJson) ||
      x.startsWith('https://')
  );
};

const needsExtension = entry =>
  !entry
    .split('/')
    .pop()
    .includes('.');

export const parseDependencies = async path => {
  const { url, code } = await fetch(path).then(async res => ({
    url: res.url,
    code: await res.text(),
  }));
  const dir = await fetch(directoriesUrl(url)).then(res => res.json());
  const pkg = await fetch(packageJsonUrl(url)).then(res => res.json());
  const files = flatten(dir.files);
  const ext = url
    .split('/')
    .pop()
    .match(/\.(.*)/);
  const dependencies = extractDependencies(code, pkg).reduce((all, entry) => {
    const packageUrl = `${UNPKG}${pkg.name}@${pkg.version}`;
    let match = makePath(url)(entry);
    if (isExternalPath(entry)) {
      if (entry.startsWith('https://')) match = entry;
      else {
        const version = pkg[isListedInDependencies(entry, pkg)][entry];
        match = version ? `${match}@${version}` : match;
      }
    }
    if (isLocalFile(entry) && needsExtension(entry)) {
      const options = files.filter(x =>
        x.match(new RegExp(`${match.replace(packageUrl, '')}(/index)?\\..*`))
      );
      match = packageUrl + (options.find(x => x.endsWith(ext)) || options[0]);
    }
    return { ...all, [entry]: match };
  }, {});
  return {
    url,
    code,
    dependencies,
    size: code.length,
    extension: ext ? ext[1] : '',
  };
};
