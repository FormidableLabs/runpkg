require = require('esm')(module);

const parseUrlFile = require('../../utils/parseUrl');

const parseUrl = parseUrlFile.parseUrl;

describe('parseUrl', () => {
  it('parses non beta package', () => {
    expect(parseUrl('https://unpkg.com/pkg-dash@1.0.0/extra.js')).toEqual({
      name: 'pkg-dash',
      version: '1.0.0',
      path: '/pkg-dash@1.0.0/extra.js',
      file: 'extra.js',
    });
  });
  it('parses beta package', () => {
    expect(
      parseUrl('https://unpkg.com/pkg-dash@1.0.0-beta.1/extra.js')
    ).toEqual({
      name: 'pkg-dash',
      version: '1.0.0-beta.1',
      path: '/pkg-dash@1.0.0-beta.1/extra.js',
      file: 'extra.js',
    });
  });
  it('parses beta package with file a directory down', () => {
    expect(
      parseUrl('https://unpkg.com/fast-deep-equal@3.0.0-beta.1/es6/index.js')
    ).toEqual({
      file: 'es6/index.js',
      name: 'fast-deep-equal',
      path: '/fast-deep-equal@3.0.0-beta.1/es6/index.js',
      version: '3.0.0-beta.1',
    });
  });
  it('parses scoped non-beta package', () => {
    expect(parseUrl('https://unpkg.com/@scope/pkg@1.0.0/index.js')).toEqual({
      file: 'index.js',
      name: '@scope/pkg',
      path: '/@scope/pkg@1.0.0/index.js',
      version: '1.0.0',
    });
  });
  it('parses scoped non-beta package with file a directory down', () => {
    expect(parseUrl('https://unpkg.com/@scope/pkg@1.0.0/es6/index.js')).toEqual(
      {
        file: 'es6/index.js',
        name: '@scope/pkg',
        path: '/@scope/pkg@1.0.0/es6/index.js',
        version: '1.0.0',
      }
    );
  });
  it('parses scoped beta package', () => {
    expect(
      parseUrl('https://unpkg.com/@scope/pkg@1.0.0-beta.1/index.js')
    ).toEqual({
      file: 'index.js',
      name: '@scope/pkg',
      path: '/@scope/pkg@1.0.0-beta.1/index.js',
      version: '1.0.0-beta.1',
    });
  });
  it('keys are returned null if not available', () => {
    expect(parseUrl('https://unpkg.com/')).toEqual({
      file: null,
      name: null,
      path: null,
      version: null,
    });
    expect(parseUrl('https://unpkg.com/@scope/pkg')).toEqual({
      file: null,
      name: '@scope/pkg',
      path: '/@scope/pkg',
      version: null,
    });
    expect(parseUrl('https://unpkg.com/@scope/pkg@1.0.0-beta.1')).toEqual({
      file: null,
      name: '@scope/pkg',
      path: '/@scope/pkg@1.0.0-beta.1',
      version: '1.0.0-beta.1',
    });
  });
});
