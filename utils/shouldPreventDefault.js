// Adapted from hyperapp-router Link.js (MIT license)
// https://github.com/jorgebucaran/hyperapp-router/blob/master/src/Link.js

function getOrigin(loc) {
  return loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '');
}

function isExternal(anchorElement) {
  // Location.origin and HTMLAnchorElement.origin are not
  // supported by IE and Safari.
  return getOrigin(location) !== getOrigin(anchorElement);
}

export default function shouldPreventDefault(e) {
  if (
    e.button !== 0 ||
    e.altKey ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.target.target === '_blank' ||
    isExternal(e.currentTarget)
  ) {
    return false;
  } else {
    return true;
  }
}
