const dependenciesSizeCalculator = (cache, dependencies) => {
  // This reducer recursively goes through the file's dependencies,
  // then through those file's dependencies till they reach the
  // end of the tree.

  // Then returns a list of dependencies

  const recursiveDependenciesListReducer = (accumulator, x) => [
    ...accumulator,
    x,
    ...(cache[x].dependencies.length > 0
      ? cache[x].dependencies.reduce(recursiveDependenciesListReducer, [])
      : []),
  ];

  // This reducer sums all of the file sizes of those imported files

  const getFileSizesAndReduce = (accumulator, x) =>
    accumulator + cache[x].code.length;

  // Recursively gets the size of all the dependencies
  const dependenciesSize = Array.from(
    new Set(dependencies.reduce(recursiveDependenciesListReducer, []))
  ).reduce(getFileSizesAndReduce, 0);

  return dependenciesSize;
};

export default dependenciesSizeCalculator;
