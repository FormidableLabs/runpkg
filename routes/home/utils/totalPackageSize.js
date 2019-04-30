// Goes through the cache and calculates the size of all the
// dependencies.
const totalPackageSize = cache =>
  Object.values(cache).reduce((a, b) => a + b.code.length, 0);

export default totalPackageSize;
