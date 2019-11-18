import fileNameRegEx from '../utils/fileNameRegEx.js';
import makePath from '../utils/makePath.js';
import { parseUrl } from './parseUrl.js';

const UNPKG = 'https://unpkg.com/';

const isExternalPath = str => !str.startsWith('.');
const isLocalFile = str => !isExternalPath(str) && fileNameRegEx.test(str);
const isListedInDependencies = (pkgName, pkgJson) =>
  ['dependencies', 'devDependencies', 'peerDependencies'].some(depType =>
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

const extractDependencies = (input, packageJson) => {
  const code = stripComments(input).slice(0, 100000);
  const imports = (code.match(new RegExp(importExportRegex, 'gm')) || []).map(
    x => x.match(new RegExp(importExportRegex))[3]
  );
  const requires = (code.match(new RegExp(requireRegex, 'gm')) || []).map(
    x => x.match(new RegExp(requireRegex))[2]
  );
  return [...new Set([...imports, ...requires])]
    .filter(x => isLocalFile(x) || isListedInDependencies(x, packageJson))
    .map(x => (isExternalPath(x) || x.endsWith('.js') ? x : `${x}.js`));
};

// cache keeps memory of what was run last
// const cache = {};

/* eslint-disable max-statements, max-params */
export const parseDependencies = async path => {
  const { url, code } = await fetch(path).then(async res => ({
    url: res.url,
    code: await res.text(),
  }));
  const pkg = await fetch(packageJsonUrl(url)).then(res => res.json());
  const dependencies = extractDependencies(code, pkg).reduce(
    (all, entry) => ({ ...all, [entry]: makePath(url)(entry) }),
    {}
  );
  return { url, size: code.length, dependencies };
};
/* eslint-enable max-statements*/

// export default async (entry, shallow) => {
//   // Start tree walking dependencies from the given entry point
//   // otherwise start from the projects main entry point
//   await recursiveDependencyFetch(entry, null, shallow);
//   // Returns new cache.
//   return cache;
// };
